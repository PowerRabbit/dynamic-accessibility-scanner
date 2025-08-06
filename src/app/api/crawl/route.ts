import { Crawler } from '@/app/services/crawler/crawler';
import { withErrorHandler } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

type CrawlDataType = {
    url: string;
    startedAt: string;
}

const scansOrigins: Map<string, CrawlDataType> = new Map();

async function handler(req: NextRequest): Promise<NextResponse> {
  const { url } = await req.json();

    if (!url) {
        return NextResponse.json({ message: 'Missing URL' }, { status: 400 });
    }

    let scanUrl: URL | undefined;
    try {
        scanUrl = new URL(url);
    } catch (e) {}

    if (!scanUrl) {
        return NextResponse.json({ message: 'Incorrect URL' }, { status: 400 });
    }

    const existingCrawl = scansOrigins.get(scanUrl.origin);
    if (existingCrawl) {
        return NextResponse.json(existingCrawl, { status: 200 });
    }


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

    scansOrigins.set(scanUrl.origin, {
        url: scanUrl.toString(),
        startedAt: crawler.scanStarted,
    });

    return NextResponse.json({}, { status: 200 });
}

export const POST = withErrorHandler(handler)
