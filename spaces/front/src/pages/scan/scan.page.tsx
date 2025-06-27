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

type ScanResult = {
    incomplete: unknown[], violations: unknown[],
};

const ScanPage = () => {
    const [url, setUrl] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');

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
        console.log(result);
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
                        Violations
                    </Tabs.Trigger>
                    <Tabs.Trigger value="incomplete">
                        Incomplete
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="violations">Manage your team members</Tabs.Content>
                <Tabs.Content value="incomplete">Manage your projects</Tabs.Content>
            </Tabs.Root>
        </div>

    </>;
};

export default ScanPage;
