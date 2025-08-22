import { Crawler } from '@/app/services/crawler/crawler';
import db from '@/app/services/utils/knex';
import { ScannerSettingsType } from '@/app/types/settings.type';
import { NextRequest, NextResponse } from 'next/server';

type CrawlDataType = {
    url: string;
    startedAt: string;
}

const scansOrigins: Map<string, CrawlDataType> = new Map();

export async function POST(req: NextRequest): Promise<NextResponse> {
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

export async function GET(req: NextRequest): Promise<NextResponse> {
    const crawls = await db('crawls');
    return NextResponse.json(crawls, { status: 200 });
}

