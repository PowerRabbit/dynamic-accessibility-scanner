import { browserService } from '@/app/services/browser/browser.service';
import { ScanError } from '@/app/services/browser/scan-error.factory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {


    return browserService.start({headless: false}).then(async () => {
        const { url } = await req.json();

        const results = await browserService.startPageViewMode(url);

        if (results instanceof ScanError ) {
            browserService.stop();
            return NextResponse.json({ message: results.message }, { status: 400 });
        }

        return NextResponse.json({ status: 200 });
    });

}
