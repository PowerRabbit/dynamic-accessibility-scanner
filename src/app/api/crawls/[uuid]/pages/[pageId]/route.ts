import { NextResponse } from 'next/server';
import db from '@/app/services/utils/knex';
import { PageResultsType } from '@/types/page.type';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ uuid: string, pageId: string }>}
) {
    const { uuid, pageId } = await params;

    if (!uuid ||!pageId) {
        return NextResponse.json({ message: 'Data not found'}, { status: 404 });
    }

    const resultFromDb: Omit<PageResultsType, 'violations' | 'incomplete'> & { violations: string, incomplete: string} = await db('page_data')
        .join('pages', 'page_data.page_uuid', '=', 'pages.uuid')
        .join('crawls', 'pages.crawl_uuid', '=', 'crawls.uuid')
        .select(
            'page_data.violations',
            'page_data.incomplete',
            'pages.title',
            'pages.url',
            'pages.scan_error as error',
            'pages.scanned_at as scannedAt',
        )
        .where({
            'pages.uuid': pageId,
            'crawls.uuid': uuid
        })
        .first();

    if (!resultFromDb) {
        return NextResponse.json({ message: 'Not found'}, { status: 404 });
    }

    const result: PageResultsType = {
        ...resultFromDb,
        violations: JSON.parse(resultFromDb.violations),
        incomplete: JSON.parse(resultFromDb.incomplete),
    }

    return NextResponse.json(result, { status: 200 });
}

