import { Button, Field, HStack, Input, Spinner, Stack } from '@chakra-ui/react';
import { useState, type FC } from 'react';

export const UrlForm: FC<{ submit: (url: string, live: boolean) => void, inProgress: boolean, error: string }> = ({ submit, inProgress, error }) => {
    const [url, setUrl] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (inProgress) {
            return;
        }

        submit(url, (e.nativeEvent as SubmitEvent).submitter?.getAttribute('data-type') === 'live')
    };

    return (
        <form onSubmit={onSubmit}>
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
                    <Button type="submit" data-type="scan">Run Scan</Button>
                    <Button type="submit" data-type="live">Open live scanner</Button>
                </HStack >
                {inProgress && <p><Spinner/> Loading...</p>}
            </Stack>
        </form>
    )
}
