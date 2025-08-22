export const runtime = 'nodejs';

import puppeteer, { Browser, Page, Viewport } from "puppeteer";
import { AxeResults } from 'axe-core';
import { ScanError, scanErrorFactory } from "./scan-error.factory";
import sharp from "sharp";
import { InitOptionsType, ScanPageOptions, ScanResults } from "@/app/types/scanner.type";

const defaultBrowserOptions = {
    headless: true,
    viewHeight: 1280,
    viewWidth: 800,
};

class BrowserClass {

    private browser?: Browser;
    private page?: Page;
    private settings = {
        headless: false,
    }

    async start(options: InitOptionsType): Promise<void> {
        await this.getBrowser(options);
    }

    async scanPage(url: string, options: ScanPageOptions): Promise<ScanResults | ScanError> {

        const { getPicture, getLinks } = options;
        const results: Partial<ScanResults> = {};

        try {
            const page = await this.initPageWithUrl(url);

            const { incomplete, violations } =  await page.evaluate(async () => {
                return await (window as unknown as {
                    axe: {
                        run: () => Promise<AxeResults>;
                    }
                }).axe.run();
            });

            if (getPicture) {
                results.picture = await this.getPicture(page);
            }

            if (getLinks) {
                results.links = await this.getLinks(page);
            }


            const title = await page.title();
            const actualUrl = page.url();

            return {
                ...results,
                incomplete,
                violations,
                title,
                actualUrl,
            };

        } catch(e) {
            return scanErrorFactory(e, {url});
        }
    }


    async stop(): Promise<void> {
        (await this.getBrowser()).close();
        delete this.browser;
        delete this.page;
    }

    async startPageViewMode(url: string): Promise<void | ScanError> {
        try {
            const page = await this.initPageWithUrl(url);

            const setUi = async () => {
                await page.addScriptTag({
                    url: 'http://localhost:3000/scripts/scanner-ui.js',
                });

                await page.evaluate(async () => {
                    (window as unknown as {
                        dynamicAccessibilityScanner: {
                            init: () => void;
                        }
                    }).dynamicAccessibilityScanner.init();
                });
            };

            await setUi();

            page.on('framenavigated', async (frame) => {
                if (frame === page.mainFrame()) {
                    await page.addScriptTag({
                        url: 'http://localhost:3000/api/axe-static',
                    });

                    await setUi();
                }
            });

        } catch(e) {
            return scanErrorFactory(e, {url});
        }
    }

    private async initPageWithUrl(url: string): Promise<Page> {
        const page = await this.getPage();
        await this.hideBotNature(page);
        await page.setBypassCSP(true);

        if (this.settings.headless) {
            try {
                await page.goto(url, {
                    waitUntil: 'networkidle0',
                    timeout: 20000,
                });
            } catch(e) {
                console.log(`Navigation error: ${e}`);
            }
        } else {
            await page.goto(url, {
                waitUntil: 'domcontentloaded'
            });
        }

        await page.addScriptTag({
            url: 'http://localhost:3000/api/axe-static',
        });
        return page;
    }

    private async getBrowser(options?: InitOptionsType): Promise<Browser> {
        if (!this.browser) {
            const { headless, viewHeight, viewWidth } = options ? options : defaultBrowserOptions;

            this.settings.headless = headless;

            const args = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ];

            let viewPort: Viewport | null = {
                width: viewWidth || defaultBrowserOptions.viewWidth,
                height: viewHeight || defaultBrowserOptions.viewHeight,
            };

            if (!headless) {
                args.push('--start-maximized');
                viewPort = null
            }

            this.browser = await puppeteer.launch({
                args,
                headless,
                defaultViewport: viewPort,
                executablePath: puppeteer.executablePath(),
                userDataDir: './.pp-cache',
            });

            this.browser.on('disconnected', () => {
                delete this.browser;
                delete this.page;
            });
        }
        return this.browser;
    }

    private async getPage(): Promise<Page> {
        if (!this.page || !this.settings.headless) { // always open a new tab in non-headless mode
            const browser = await this.getBrowser();
            this.page = await browser.newPage();

            if (this.settings.headless) {
                await this.page.setRequestInterception(true);

                this.page.on('request', (request) => {
                    const resourceType = request.resourceType();
                    if (['image', 'media', 'font'].includes(resourceType)) {
                        request.abort();
                    } else {
                        request.continue();
                    }
                });
            }

        }
        return this.page;
    }

    private async getPicture(page: Page): Promise<string> {
        const screenshotBuffer = await page.screenshot({ type: 'png' });
        const resizedBuffer = await sharp(screenshotBuffer)
            .resize({ width: 320 })
            .toBuffer();
        return resizedBuffer.toString('base64');
    }

    private async getLinks(page: Page): Promise<string[]> {
        await page.addScriptTag({
            url: 'http://localhost:3000/scripts/collect-links.js',
        });

        const links =  await page.evaluate(async () => {
            return await (window as unknown as {
                dynamicAccessibilityScannerLinksCollector: {
                    collectLinks: () => Promise<string[]>;
                }
            }).dynamicAccessibilityScannerLinksCollector.collectLinks();
        });

        return links;
    }

    private async hideBotNature(page: Page) {
        await page.evaluateOnNewDocument(() => {
            delete Object.getPrototypeOf(navigator).webdriver;
        });
    }

}

export const browserService = new BrowserClass();
