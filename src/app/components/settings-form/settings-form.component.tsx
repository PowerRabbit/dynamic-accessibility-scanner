import { Button, Field, HStack, Input, Spinner, Stack } from '@chakra-ui/react';
import { type FC } from 'react';

export const SettingsForm: FC<{ submit: () => void, inProgress: boolean }> = ({ submit, inProgress }) => {

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (inProgress) {
            return;
        }

        submit();
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>View</h2>
            <Stack gap="2" align="flex-start" maxW="sm">
                <Field.Root>
                    <Stack direction={{ base: "column", md: "row" }}>
                            <Field.Label>Height</Field.Label>
                            <Input
                                type="number"
                                value="" /> px
                    </Stack >
                </Field.Root>
                <Field.Root>
                    <Stack direction={{ base: "column", md: "row" }}>
                            <Field.Label>Width</Field.Label>
                            <Input
                                type="number"
                                value="" /> px
                    </Stack >
                </Field.Root>
                <br />
                <HStack>
                    <Button type="submit" data-type="scan">Update Settings</Button>
                </HStack >
                {inProgress && <p><Spinner/> Updating...</p>}
            </Stack>
        </form>
    )
}
