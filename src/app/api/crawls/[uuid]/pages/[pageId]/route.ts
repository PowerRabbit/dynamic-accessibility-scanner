import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import db from '@/app/services/utils/knex';
import { PageResultsType } from '@/types/page.type';

async function getHandler(
    request: Request,
    { params }: { params: { uuid: string, pageId: string } }
) {
    const { uuid, pageId } = await Promise.resolve(params);

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

export const GET = withErrorHandler<{ uuid: string, pageId: string }>(getHandler);
