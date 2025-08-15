import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import db from '@/app/services/utils/knex';

type PageType = {
    crawl_id: number;
    id: string;
    scan_error: string;
    scanned_at: string;
    title: string;
    url: string;
    violations_amount: number;
    incomplete_amount: number;
};

async function getHandler(
    request: Request,
    { params }: { params: { uuid: string } }
) {
    const { uuid } = await Promise.resolve(params);
    const crawl = await db('crawls')
        .where({ uuid })
        .first();

    if (!crawl) {
        return NextResponse.json({ message: 'Crawl not found'}, { status: 404 });
    }

    const pages = await db<PageType>('pages')
        .where({ crawl_id: crawl.id })
        .select('*');

    return NextResponse.json(pages.map(p => ({
        id: p.id,
        violations: p.violations_amount,
        incomplete: p.incomplete_amount,
        url: p.url,
        title: p.title,
        scanError: p.scan_error,
        scannedAt: p.scanned_at,
    })), { status: 200 });
}

export const GET = withErrorHandler<{ uuid: string }>(getHandler);
