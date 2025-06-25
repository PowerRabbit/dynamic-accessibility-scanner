import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import easyWaf from 'easy-waf';
import helmet from 'helmet';
import { browserService } from './services/browser/browser.service';

const envPath = path.join(__dirname, '..', 'public.env');

dotenv.config({ path: envPath });

const port = process.env.PORT;

const app = express();

app.use(easyWaf({
    allowedHTTPMethods: ['GET', 'OPTIONS'],
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
    methods: ['GET'],
    credentials: true,
    allowedHeaders: 'Origin, Accept, Content-Type, x-requested-with, cache-control',
    maxAge: 86400,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

const router = express.Router();
app.use(router);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

browserService.start();

process.on('uncaughtException', (er) => {
    console.error('Uncaught Exception:', er.message);
    console.error(er.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${reason}`);
    process.exit(1);
});
