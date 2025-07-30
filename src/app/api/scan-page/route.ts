import { browserService } from '@/app/services/browser/browser.service';
import { ScanError } from '@/app/services/browser/scan-error.factory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {


    return browserService.start({headless: true}).then(async () => {
        const { url } = await req.json();

        const results = await browserService.scanPage(url);

        browserService.stop();

        if (results instanceof ScanError ) {
            return NextResponse.json({ message: results.message }, { status: 400 });
        }

        const { incomplete, violations, picture } = results;

        return NextResponse.json({ incomplete, violations, picture }, { status: 200 });
    });

}
