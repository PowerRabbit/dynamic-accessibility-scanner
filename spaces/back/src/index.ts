import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import easyWaf from 'easy-waf';
import helmet from 'helmet';
import fs from 'fs';
import { browserService } from './services/browser/browser.service';
import { setRoutes } from './routes/main/main.routes';

const envPath = path.join(__dirname, '..', 'public.env');

dotenv.config({ path: envPath });

const port = process.env.PORT;

const app = express();

app.use(easyWaf({
    allowedHTTPMethods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(helmet());
app.disable( 'x-powered-by' );
const customHeaders = (_req: Request, res: Response, next: NextFunction)  => {
    res.setHeader( 'X-Powered-By', 'PHP/4.4.9' );
    next();
};
app.use( customHeaders );
app.use(cors({
    origin: [process.env.FRNT_SRV as string],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: 'Origin, Accept, Content-Type, x-requested-with, cache-control',
    maxAge: 86400,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

const router = express.Router();
app.use(router);

setRoutes(router);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

browserService.start().then(async () => {
    const results = await browserService.scanPage('https://vigintiverus.com');

    const { incomplete, violations } = results;

    fs.writeFileSync(
        'temp/axe-results.json',
        JSON.stringify({
            incomplete,
            violations
        }, null, 2),
        'utf-8'
    );

    await browserService.stop();

    console.log('done');
});

process.on('uncaughtException', (er) => {
    console.error('Uncaught Exception:', er.message);
    console.error(er.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${reason}`);
    process.exit(1);
});
