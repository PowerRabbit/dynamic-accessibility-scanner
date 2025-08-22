import { NextResponse } from 'next/server';
import db from '@/app/services/utils/knex';
import { PageType } from '@/types/page.type';

type CrawlType = {
    uuid: string;
    base_url: string;
    started_at: string;
    ended_at: string;
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ uuid: string }>}
) {
    const { uuid } = await params;
    const crawl: CrawlType = await db('crawls')
        .where({ uuid })
        .first();

    if (!crawl) {
        return NextResponse.json({ message: 'Crawl not found'}, { status: 404 });
    }

    const pages = await db<PageType>('pages')
        .where({ crawl_uuid: crawl.uuid })
        .select('*');

    return NextResponse.json({
        startedAt: crawl.started_at,
        endedAt: crawl.ended_at,
        pages: pages.map(p => ({
            id: p.uuid,
            violations: p.violations_amount,
            incomplete: p.incomplete_amount,
            url: p.url,
            title: p.title,
            scanError: p.scan_error,
            scannedAt: p.scanned_at,
        })),
    }, { status: 200 });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ uuid: string }>}
) {
    const { uuid } = await params;
    await db('crawls')
        .where({ uuid })
        .del();

    return NextResponse.json({}, { status: 200 });
}
