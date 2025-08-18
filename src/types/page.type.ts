import { AccessibilityIssue } from "./scan.types";

export type PageType = {
    crawl_id: number;
    id: string;
    scan_error: string;
    scanned_at: string;
    title: string;
    url: string;
    violations_amount: number;
    incomplete_amount: number;
};

export type PageDataResponseType = {
    id: string;
    scanError: string;
    scannedAt: string;
    title: string;
    url: string;
    violations: number;
    incomplete: number;
};

export type PageResultsType = {
    scanError: string;
    scannedAt: string;
    title: string;
    url: string;
    violations: AccessibilityIssue;
    incomplete: AccessibilityIssue;
    error: string;
};
