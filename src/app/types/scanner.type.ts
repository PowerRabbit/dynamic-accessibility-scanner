import axe from "axe-core";
import { ScannerSettingsType } from "./settings.type";

export type InitOptionsType = {
    headless: boolean,
    viewHeight?: number;
    viewWidth?: number;
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
    maxPages: number;
}

export type ScanPageOptions = {
    getPicture?: boolean;
    getLinks?: boolean;
}