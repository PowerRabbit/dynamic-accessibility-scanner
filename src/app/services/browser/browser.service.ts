export const runtime = 'nodejs';

import puppeteer, { Browser, Page, Viewport } from "puppeteer";
import { AxeResults } from 'axe-core';
import { ScanError, scanErrorFactory } from "./scan-error.factory";

export type InitOptionsType = {
    headless: boolean,
    viewHeight?: number,
    viewWidth?: number,
};

const defaultBrowserOptions: InitOptionsType = {
    headless: true,
}

class BrowserClass {

    private browser?: Browser;
    private page?: Page;
    private settings = {
        headless: false,
    }

    async start(options: InitOptionsType): Promise<void> {
        await this.getBrowser(options);
    }

    async scanPage(url: string): Promise<AxeResults | ScanError> {

        try {

            const page = await this.initPageWithUrl(url);

            const results: AxeResults = await page.evaluate(async () => {
                return await (window as unknown as {
                    axe: {
                        run: () => Promise<AxeResults>;
                    }
                }).axe.run();
            });

            return results;

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
        await page.setBypassCSP(true);

        await page.goto(url, { waitUntil: 'domcontentloaded' });

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
                width: viewWidth || 1280,
                height: viewHeight || 800,
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
        }
        return this.page;
    }

}

export const browserService = new BrowserClass();
