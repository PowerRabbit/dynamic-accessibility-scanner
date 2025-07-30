"use client";

import { useState } from "react";
import './scan.page.css';
import { Tabs } from "@chakra-ui/react";
import type { AccessibilityIssue } from "./scan.types";
import ScanPageContext from "./scan.context";
import { communicationService } from "@/app/fe-services/communication/communication.service";
import { ViolationItem } from "../violation-item/violation-item.component";
import { UrlForm } from "../url-form/url-form.component";
import Link from 'next/link';

type ScanResult = {
    incomplete: AccessibilityIssue[],
    violations: AccessibilityIssue[],
    actualUrl: string;
    title: string;
    picture?: string;
};

const severityOrder: Record<string, number> = {
    critical: 4,
    serious: 3,
    moderate: 2,
    minor: 1,
};

const sortByImpactSeverity = (issues: AccessibilityIssue[]): AccessibilityIssue[] => {
    return [...issues].sort((a, b) => {
        const aPriority = severityOrder[a.impact] ?? 0;
        const bPriority = severityOrder[b.impact] ?? 0;
        return bPriority - aPriority;
    });
};

const ScanPage = () => {
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [actualUrl, setActualUrl] = useState('');
    const [picture, setPicture] = useState('');
    const [violations, setViolations] = useState<AccessibilityIssue[]>([]);
    const [incompletes, setIncompletes] = useState<AccessibilityIssue[]>([]);

    const onScanError = <T,>(e: unknown): T => {
        setError((e as Error).message);
        return { incomplete: [], violations: [] } as T;
    };

    const onOpenBrowserError = <T,>(e: unknown): T => {
        setError((e as Error).message);
        return  undefined as T;
    };

    const requestScan = async (url: string) => {
        const result = await communicationService.post<ScanResult>({
            url: 'scan-page',
            payload: {
                url
            },
            onErrorFallback: onScanError,
        });

        setViolations(
            sortByImpactSeverity(result.violations)
        );
        setIncompletes(
            sortByImpactSeverity(result.incomplete)
        );

        setTitle(result.title ?? '');
        setActualUrl(result.actualUrl);
        setPicture(result.picture ?? '');
    }

    const openBrowser = async (url: string) => {
        await communicationService.post<ScanResult>({
            url: 'run-view-mode',
            payload: {
                url
            },
            onErrorFallback: onOpenBrowserError,
        });
    }

    const onUrlSubmit = async (url: string, live = false) => {

        if (inProgress) {
            return;
        }

        if (!/^http(s)?:\/\//.test(url)) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
            setError('');
        } catch {
            setError('Please enter a valid URL.');
            return;
        }

        setInProgress(true);

        if (live) {
            await openBrowser(url);
        } else {
            await requestScan(url);
        }


        setInProgress(false);
    };

    const removeEntry = (index: number, type = 'violation') => {
        if (type === 'violation') {
            setViolations(
                [...violations.slice(0, index), ...violations.slice(index + 1)]
            );
        } else {
            setIncompletes(
                [...incompletes.slice(0, index), ...incompletes.slice(index + 1)]
            );
        }
    };

    return <div className="page-wrapper">
        <h1>Scan Page</h1>

        <UrlForm submit={onUrlSubmit} inProgress={inProgress} error={error}></UrlForm>

        <br></br>
        <Link href="/settings">Settings</Link>

        {actualUrl ?
            <div className="results-wrapper">
                <h2>{title}</h2>
                <p>
                    <a href={actualUrl} target="_blank">{actualUrl}</a>
                </p>
                {picture ?
                    <img src={`data:image/png;base64,${picture}`} alt="Screenshot of the page" />
                    : ''}

                    <ScanPageContext.Provider value={{ removeEntry }}>
                    <div className="tabs-wrapper">
                        <Tabs.Root defaultValue="violations">
                            <Tabs.List>
                                <Tabs.Trigger value="violations">
                                    Violations {violations.length > 0 ? `(${violations.length})` : ''}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="incomplete">
                                    Incomplete {incompletes.length > 0 ? `(${incompletes.length})` : ''}
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="violations">
                                {!violations.length ? 'No violations'
                                    : violations.map((v, i) =>
                                        <ViolationItem key={v.id + i} violation={v} index={i} type='violation' />
                                    )}
                            </Tabs.Content>
                            <Tabs.Content value="incomplete">
                                {!incompletes.length ? 'No incomplete checks'
                                    : incompletes.map((v, i) =>
                                        <ViolationItem key={v.id + i} violation={v} index={i} type='incomplete' />
                                )}
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                    </ScanPageContext.Provider>
            </div>
        : ''}
    </div>;

};

export default ScanPage;