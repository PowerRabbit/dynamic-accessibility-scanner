import puppeteer, { Browser, Page } from "puppeteer";
import axeCore from 'axe-core';
import { AxeResults } from 'axe-core';
import { ScanError, scanErrorFactory } from "./scan-error.factory";

class BrowserClass {

    private browser?: Browser;
    private page?: Page;

    async start(): Promise<void> {
        await this.getBrowser();
    }

    async scanPage(url: string): Promise<AxeResults | ScanError> {

        try {
            const page = await this.getPage();

            await page.goto(url);
            await page.addScriptTag({
                content: axeCore.source,
            });

            const results: AxeResults = await page.evaluate(async () => {
                return await (window as any).axe.run();
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

    private async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
            //    headless: false,
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

export const browserService =  new BrowserClass();
