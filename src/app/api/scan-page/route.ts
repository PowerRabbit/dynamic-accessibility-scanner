import { browserService } from '@/app/services/browser/browser.service';
import { ScanError } from '@/app/services/browser/scan-error.factory';
import { Crawler } from '@/app/services/crawler/crawler';
import { NextRequest, NextResponse } from 'next/server';

const scansOrigins: Set<string> = new Set();

export async function POST(req: NextRequest) {
    const { url, crawlerMode } = await req.json();

    if (!url) {
        return NextResponse.json({ message: 'Missing URL' }, { status: 400 });
    }

    // TEMP!!!
    if (!crawlerMode) {
        let scanUrl: URL | undefined;
        try {
            scanUrl = new URL(url);
        } catch (e) {}

        if (!scanUrl) {
            return NextResponse.json({ message: 'Incorrect URL' }, { status: 400 });
        }
        if (scansOrigins.has(scanUrl.origin)) {
            return NextResponse.json({ message: 'Domain is already being scanned' }, { status: 409 });
        }

        scansOrigins.add(scanUrl.origin);

        const crawler = new Crawler({
            browser: {
                headless: true,
            },
            crawl: {
                startUrl: scanUrl,
            }
        });


        crawler.run().finally(() => {
            scansOrigins.delete(scanUrl.origin);
        });

        return NextResponse.json({}, { status: 200 });
    }

    return browserService.start({headless: true}).then(async () => {

        const results = await browserService.scanPage(url, {
            getPicture: true,
        });

        browserService.stop();

        if (results instanceof ScanError ) {
            return NextResponse.json({ message: results.message }, { status: 400 });
        }

        const { incomplete, violations, picture, title, actualUrl } = results;

        return NextResponse.json({ incomplete, violations, picture, title, actualUrl }, { status: 200 });
    });

}
