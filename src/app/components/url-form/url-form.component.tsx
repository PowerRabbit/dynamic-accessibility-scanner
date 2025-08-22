import { Button, Field, HStack, Input, Spinner, Stack } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import { ScanRunType } from '../scan/scan.page';

export const UrlForm: FC<{ submit: (url: string, type: ScanRunType) => void, inProgress: boolean, error: string }> = ({ submit, inProgress, error }) => {
    const [url, setUrl] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (inProgress) {
            return;
        }

        submit(url, (e.nativeEvent as SubmitEvent).submitter?.getAttribute('data-type') as ScanRunType)
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack gap="2" align="flex-start" style={{ width: '100%' }}>
            <Field.Root invalid={!!error} style={{ width: '100%' }}>
                <Field.Label>Enter URL</Field.Label>
                <HStack gap="2" align="center" style={{ width: '100%' }}>
                <Input
                    placeholder="https://example.com"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                    style={{ maxWidth: '50%', flex: 1 }}
                />

                <HStack gap="1">
                    <Button type="submit" data-type="scan">Scan Single Page</Button>
                    <Button type="submit" data-type="crawl">Run Crawler</Button>
                    <Button type="submit" colorPalette="teal" data-type="live">Open Live Scanner</Button>
                </HStack>
                </HStack>
                <Field.ErrorText>{error}</Field.ErrorText>
            </Field.Root>
            {inProgress && <p><Spinner /> Loading...</p>}
            </Stack>
        </form>
    )
}
