import { browserService } from '@/app/services/browser/browser.service';
import { ScanError } from '@/app/services/browser/scan-error.factory';
import { withErrorHandler } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest): Promise<NextResponse> {
  const { url } = await req.json();

    if (!url) {
        return NextResponse.json({ message: 'Missing URL' }, { status: 400 });
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

export const POST = withErrorHandler(handler)
