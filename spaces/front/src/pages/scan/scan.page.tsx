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
    Tag,
    Icon,
} from "@chakra-ui/react";
import { HiExclamation } from "react-icons/hi";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import type { AccessibilityIssue } from "./scan.types";
import { Tooltip } from "../../components/ui/tooltip";

type ScanResult = {
    incomplete: unknown[], violations: AccessibilityIssue[],
};

const colorsImpact: Record<string, string> = {
    'minor': 'grey.500',
    'moderate': 'yellow.500',
    'serious': 'red.500',
    'critical': 'red.700',
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
        setViolations(result.violations);
    };

    return <>
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
                            <div className="result" key={v.id + i}>
                                <h2>
                                    <Tooltip content={v.impact} openDelay={0} closeDelay={0}>
                                        <Icon color={colorsImpact[v.impact] || ''}><HiExclamation /></Icon>
                                    </Tooltip> {v.help}
                                </h2>
                                <div>
                                    {v.description} {v.helpUrl ? <a href={v.helpUrl} target="_blank" aria-describedby="newTabInformer">Learn more <Icon><HiMiniArrowTopRightOnSquare /></Icon></a> : ''}
                                </div>
                                <div>
                                    <h3>Affected elements</h3>
                                    <ul>
                                        {v.nodes.map((node) =>
                                            node.target.map((t, key) =>
                                                <li key={key}>
                                                    <span>{t}</span>
                                                </li>)
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    {v.tags.length ?
                                        <HStack>
                                            {v.tags.map((tag, k) =>
                                                <Tag.Root key={k}>
                                                    <Tag.Label>{tag}</Tag.Label>
                                                </Tag.Root>
                                            )}
                                        </HStack>
                                        : ''
                                    }
                                </div>
                            </div>

                        )}
                </Tabs.Content>
                <Tabs.Content value="incomplete">No incomplete checks</Tabs.Content>
            </Tabs.Root>
        </div>

    </>;
};

export default ScanPage;