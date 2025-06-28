import { useState } from "react";
import './scan.page.css';
import { communicationService } from "../../services/communication.service";
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
import { ViolationItem } from "../../components/violation-item/violation-item.component";

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
            url: 'request-page',
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

    const [children, setChildren] = useState<number[]>([1, 2, 3]);

    const removeChild = (id: number) => {
        setChildren((prev) => prev.filter((childId) => childId !== id));
    };

    const cloneChild = (id: number) => {
        setChildren((prev) => {
            // Generate a new unique id (e.g., max + 1)
            const newId = Math.max(...prev) + 1;
            return [...prev, newId];
        });
    };

    return <>
        <ScanPageContext.Provider value={{ removeChild, cloneChild }}></ScanPageContext.Provider>
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

    </>;
};

export default ScanPage;