"use client";

import { useState } from "react";
import './scan.page.css';
import {
    Button,
    Spinner,
    Field,
    Input,
    Stack,
    HStack,
    Tabs,
} from "@chakra-ui/react";
import type { AccessibilityIssue } from "./scan.types";
import ScanPageContext from "./scan.context";
import { communicationService } from "@/app/fe-services/communication.service";
import { ViolationItem } from "../violation-item/violation-item.component";

type ScanResult = {
    incomplete: unknown[], violations: AccessibilityIssue[],
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
    const [url, setUrl] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');
    const [violations, setViolations] = useState<AccessibilityIssue[]>([]);

    const onErrorFallback = <T,>(e: unknown): T => {
        setError((e as Error).message);
        return { incomplete: [], violations: [] } as T;
    };

    const requestScan = async (e: React.FormEvent) => {
        e.preventDefault();

        if (inProgress) {
            return;
        }

        try {
            new URL(url);
            setError('');
        } catch {
            setError('Please enter a valid URL.');
            return;
        }

        setInProgress(true);

        const result = await communicationService.post<ScanResult>({
            url: 'scan-page',
            payload: {
                url
            },
            onErrorFallback,
        });

        setInProgress(false);
        setViolations(
            sortByImpactSeverity(result.violations)
        );
    };

    const removeEntry = (index: number) => {
        setViolations(
            [...violations.slice(0, index), ...violations.slice(index + 1)]
        );
    };

    return <div className="page-wrapper">
        <h1>Scan Page</h1>
        <form onSubmit={requestScan}>
            <Stack gap="2" align="flex-start" maxW="sm">
                <Field.Root invalid={!!error}>
                    <Field.Label>Enter URL</Field.Label>
                    <Input
                        placeholder="https://example.com"
                        onChange={(e) => setUrl(e.target.value)}
                        value={url} />
                    <Field.ErrorText>{error}</Field.ErrorText>
                </Field.Root>
                <HStack>
                    <Button type="submit">Run Scan</Button>
                    {inProgress && <p><Spinner/> Loading...</p>}
                </HStack >
            </Stack>
        </form>
        <ScanPageContext.Provider value={{ removeEntry }}>
        <div className="tabs-wrapper">
            <Tabs.Root defaultValue="violations">
                <Tabs.List>
                    <Tabs.Trigger value="violations">
                        Violations {violations.length > 0 ? `(${violations.length})` : ''}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="incomplete">
                        Incomplete
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="violations">
                    {!violations.length ? 'No violations'
                        : violations.map((v, i) =>
                            <ViolationItem key={v.id + i} violation={v} index={i} />
                        )}
                </Tabs.Content>
                <Tabs.Content value="incomplete">No incomplete checks</Tabs.Content>
            </Tabs.Root>
        </div>
        </ScanPageContext.Provider>
    </div>;
};

export default ScanPage;