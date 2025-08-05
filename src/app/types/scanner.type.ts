import axe from "axe-core";

export type InitOptionsType = {
    headless: boolean,
    viewHeight?: number,
    viewWidth?: number,
};

export type ScanResults = {
    violations: axe.Result[];
    incomplete: axe.Result[];
    actualUrl: string;
    title: string;
    picture?: string;
    links?: string[];
}

export type CrawlOptionsType = {
    startUrl: URL;
}

export type ScanPageOptions = {
    getPicture?: boolean;
    getLinks?: boolean;
}