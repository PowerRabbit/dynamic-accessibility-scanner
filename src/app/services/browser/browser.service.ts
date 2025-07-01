export const runtime = 'nodejs';

import puppeteer, { Browser, Page } from "puppeteer";
import { AxeResults } from 'axe-core';
import { ScanError, scanErrorFactory } from "./scan-error.factory";

export type InitOptionsType = { headless: boolean };

const defaultBrowserOptions: InitOptionsType = {
    headless: true,
}

class BrowserClass {

    private browser?: Browser;
    private page?: Page;

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
            const page = await this.getPage();
            await page.setBypassCSP(true);
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            await page.addScriptTag({
                url: 'http://localhost:3000/api/axe-static',
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
            const { headless } = options ? options : defaultBrowserOptions;

            this.browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless,
                defaultViewport: {
                    width: 1280,
                    height: 800
                }
            });
        }
        return this.browser;
    }

    private async getPage(): Promise<Page> {
        if (!this.page) {
            const browser = await this.getBrowser();
            this.page = await browser.newPage();
        }
        return this.page;
    }

}

export const browserService = new BrowserClass();
