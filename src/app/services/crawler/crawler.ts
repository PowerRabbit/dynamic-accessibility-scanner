import { CrawlOptionsType, InitOptionsType } from "@/app/types/scanner.type";
import { browserService } from "../browser/browser.service";
import { ScanError } from "../browser/scan-error.factory";
import axe from "axe-core";
import db from "../utils/knex";

// TODO: add unit-tests
async function* getNewLinkForScan(forScan: Set<string>, scanned: Set<string>, waitMs = 0) {
  while (true) {
    let foundNew = false;

    for (const value of forScan) {
      if (!scanned.has(value)) {
        scanned.add(value);
        yield value;
        foundNew = true;
      }
    }

    if (!foundNew) {
        break
    };

    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

export class Crawler {

    scanStarted = '';
    scanFinished = '';
    uuid = crypto.randomUUID();
    private browserOptions: InitOptionsType;
    private crawlOptions: CrawlOptionsType;
    private limitUrl: string;
    private readonly beforeScanTimeout = 1000;
    private scannedPages: Set<string> = new Set();
    private pagesToScan: Set<string> = new Set();

    constructor(options: {
        browser: InitOptionsType,
        crawl: CrawlOptionsType,
    }) {
        this.browserOptions = {
            ...options.browser,
        };
        this.crawlOptions = {
            ...options.crawl,
        };

        const startUrlString = this.crawlOptions.startUrl.toString();
        this.limitUrl = startUrlString.toString();
        this.pagesToScan.add(startUrlString);
    }

    async init(cb?: () => void): Promise<void> {
        const startUrl = this.crawlOptions.startUrl.toString();
        if (!this.mayScan(startUrl)) {
            throw new Error('Initial URL is incorrect!');
        }
        this.scanStarted = (new Date()).toUTCString();

        await browserService.start(this.browserOptions);

        const crawlId = await this.saveCrawl({ url: startUrl, startedAt: this.scanStarted, uuid: this.uuid});

        this.run(crawlId).finally(() => {
            if (typeof cb === 'function') {
                cb();
            }
        })
    }

    async run(crawlId: string): Promise<void> {
        for await (const page of getNewLinkForScan(this.pagesToScan, this.scannedPages, this.beforeScanTimeout)) {
            const results = await this.scanPage(page);
            if (results instanceof ScanError) {
                await this.savePage({
                    crawlId,
                    url: page,
                    scanError: '',
                });
            } else {
                const { incomplete, violations, title, actualUrl, links } = results;
                this.scannedPages.add(actualUrl);

                await this.savePage({
                    crawlId,
                    url: page,
                    incomplete,
                    violations,
                    title,
                });

                this.updateLinksToScan(links || []);
            }
        }

        this.scanFinished = (new Date()).toUTCString();
        await db('crawls')
            .where({ uuid: crawlId })
            .update({ ended_at: this.scanFinished });
        browserService.stop();
    }

    private async scanPage(url: string) {
        const results = await browserService.scanPage(url, {
            getLinks: true,
        });

        return results;
    }

    private mayScan(url: string): boolean {
        return (new URL(url).toString()).startsWith(this.limitUrl);
    }

    private updateLinksToScan(links: string[]): void {
        const pagesLimit = this.crawlOptions.maxPages || 5;

        for (const l of links) {
            if (this.pagesToScan.size >= pagesLimit) {
                break;
            }
            try {
                const linkUrl = new URL(l);

                // Excluding anchors and hash-navigation
                linkUrl.hash = '';

                if (this.mayScan(l)) {
                    this.pagesToScan.add(linkUrl.toString());
                }
            } catch(e) {}
        }
    }

    private async saveCrawl(params: {url: string, uuid: string, startedAt: string}): Promise<string> {
        const { url, startedAt, uuid } = params;
        await db('crawls').insert({
            uuid,
            base_url: url,
            started_at: startedAt,
        });

        return uuid;
    }

    private async savePage(params: {
        url: string,
        crawlId: string;
        title?: string,
        violations?: axe.Result[];
        incomplete?: axe.Result[];
        scanError?: string;
    }): Promise<void> {
        const { url, crawlId, violations, incomplete, scanError, title } = params;
        const uuid = crypto.randomUUID();

        await db('pages').insert({
            uuid,
            crawl_uuid: crawlId,
            url,
            title: title || '',
            violations_amount: violations?.length ?? 0,
            incomplete_amount: incomplete?.length ?? 0,
            scan_error: scanError || '',
            scanned_at: (new Date()).toUTCString(),
        });

        await db('page_data').insert({
            page_uuid: uuid,
            violations: JSON.stringify(violations || []),
            incomplete: JSON.stringify(incomplete || []),
        });
    }
}
