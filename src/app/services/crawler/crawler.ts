import { CrawlOptionsType, InitOptionsType } from "@/app/types/scanner.type";
import { browserService } from "../browser/browser.service";
import { ScanError } from "../browser/scan-error.factory";
import { saveToFile } from "../utils/utils";

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
    private browserOptions: InitOptionsType;
    private crawlOptions: CrawlOptionsType;
    private limitUrl: string;
    private readonly pagesLimit = 10;
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

    async run(): Promise<void> {
        if (!this.mayScan(this.crawlOptions.startUrl.toString())) {
            throw new Error('Initial URL is incorrect!');
        }
        this.scanStarted = (new Date()).toUTCString();

        await browserService.start({headless: true});


        console.log(`Start: ${this.scanStarted}`);
        const dir = 'temp/' + this.crawlOptions.startUrl.host;

        for await (const page of getNewLinkForScan(this.pagesToScan, this.scannedPages, this.beforeScanTimeout)) {
            const results = await this.scanPage(page);
            if (results instanceof ScanError) {
                console.log('ERROR!');
                console.log(results);
                saveToFile(dir, crypto.randomUUID(), JSON.stringify(
                    {
                        results
                    },
                    null,
                    2
                ));
            } else {
                const { incomplete, violations, title, actualUrl, links } = results;
                this.scannedPages.add(actualUrl);

                if (violations.length) {
                    saveToFile(dir, crypto.randomUUID() + '.json', JSON.stringify(
                        {
                            actualUrl,
                            title,
                            timeFinished: (new Date()).toUTCString(),
                            //incomplete,
                            violationsLength: violations.length,
                            violations,
                            //links
                        },
                        null,
                        2
                    ));
                }

                for (const l of links || []) {
                    if (this.pagesToScan.size >= this.pagesLimit) {
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

        }

        this.scanFinished = (new Date()).toUTCString();
        console.log(`Finish: ${this.scanFinished}`);
        console.log(JSON.stringify(Array.from(this.pagesToScan), null, 4))
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


}
