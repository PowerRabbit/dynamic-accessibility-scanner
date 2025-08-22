import { Crawler } from '@/app/services/crawler/crawler';
import db from '@/app/services/utils/knex';
import { ScannerSettingsType } from '@/app/types/settings.type';
import { withErrorHandler } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

type CrawlDataType = {
    url: string;
    startedAt: string;
}

const scansOrigins: Map<string, CrawlDataType> = new Map();

async function postHandler(req: NextRequest): Promise<NextResponse> {
  const { url, settings } = (await req.json()) as { url: string, settings: ScannerSettingsType};

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

    const { viewHeight, viewWidth, maxPages } = settings;

    const crawler = new Crawler({
        browser: {
            headless: true,
            viewHeight,
            viewWidth,
        },
        crawl: {
            startUrl: scanUrl,
            maxPages,
        }
    });

    await crawler.init(() => {
        scansOrigins.delete(scanUrl.origin); // Runs very at the end! Not within await!
    });

    scansOrigins.set(scanUrl.origin, {
        url: scanUrl.toString(),
        startedAt: crawler.scanStarted,
    });

    return NextResponse.json({ uuid: crawler.uuid }, { status: 200 });
}

async function getHandler(req: NextRequest): Promise<NextResponse> {
    const crawls = await db('crawls');
    return NextResponse.json(crawls, { status: 200 });
}

export const POST = withErrorHandler(postHandler);
export const GET = withErrorHandler(getHandler);
