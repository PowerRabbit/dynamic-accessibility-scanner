import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import db from '@/app/services/utils/knex';
import { PageType } from '@/types/page.type';

type CrawlType = {
    id: number;
    uuid: string;
    base_url: string;
    started_at: string;
    ended_at: string;
}

async function getHandler(
    _request: Request,
    { params }: { params: { uuid: string } }
) {
    const { uuid } = await Promise.resolve(params);
    const crawl: CrawlType = await db('crawls')
        .where({ uuid })
        .first();

    if (!crawl) {
        return NextResponse.json({ message: 'Crawl not found'}, { status: 404 });
    }

    const pages = await db<PageType>('pages')
        .where({ crawl_id: crawl.id })
        .select('*');

    return NextResponse.json({
        startedAt: crawl.started_at,
        endedAt: crawl.ended_at,
        pages: pages.map(p => ({
            id: p.id,
            violations: p.violations_amount,
            incomplete: p.incomplete_amount,
            url: p.url,
            title: p.title,
            scanError: p.scan_error,
            scannedAt: p.scanned_at,
        })),
    }, { status: 200 });
}

export const GET = withErrorHandler<{ uuid: string }>(getHandler);
