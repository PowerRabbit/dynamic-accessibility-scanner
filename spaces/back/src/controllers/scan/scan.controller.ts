import { Request, Response } from "express";
import { browserService } from "../../services/browser/browser.service";
import { ScanError } from '../../services/browser/scan-error.factory';

export const requestPageScan = async (req: Request<{body: {url: string}}>, res: Response) => {
    const { url } = req.body;

    try {
        new URL(url);
    } catch {
        res.status(400).send('Incorrect URL');
        return;
    }

    browserService.start().then(async () => {
        const results = await browserService.scanPage(url);

        if (results instanceof ScanError ) {
            res.status(400).json({
                message: results.message,
            });
            return;
        }

        const { incomplete, violations } = results;

        /* fs.writeFileSync(
            'temp/axe-results.json',
            JSON.stringify({
                incomplete,
                violations
            }, null, 2),
            'utf-8'
        ); */

        await browserService.stop();

        console.log('done');

        res.json({
            incomplete, violations
        });

    });

};
