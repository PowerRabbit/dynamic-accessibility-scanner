import puppeteer, { Browser } from "puppeteer";

class BrowserClass {

    private browser?: Browser;

    async start(): Promise<void> {

        const browser = await this.getBrowser();

          const page = await browser.newPage();
          await page.goto('about:blank');

          const dimensions = await page.evaluate(() => ({
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
          }));

          console.log('Viewport dimensions:', dimensions);
    }

    async stop(): Promise<void> {
        (await this.getBrowser()).close();
    }

    private async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: false,
                defaultViewport: {
                  width: 1280,
                  height: 800
                }
              });
        }

        return this.browser;
    }

}

export const browserService =  new BrowserClass();
