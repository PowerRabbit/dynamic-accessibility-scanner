import {
    Button,
    Field,
    HStack,
    Input,
    Spinner,
    Stack,
    Portal,
    Select,
    createListCollection,
} from '@chakra-ui/react';
import { type FC } from 'react';
import './settings-form.css';

export const SettingsForm: FC<{ submit: () => void, inProgress: boolean }> = ({ submit, inProgress }) => {

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (inProgress) {
            return;
        }

        submit();
    };

    const devices = createListCollection({
        items: [
            { label: "No", value: "no" },
            { label: "iPhone 12 Pro", value: "iphone_12pro" },
            { label: "Samsung Galaxy S20 Ultra", value: "samsung_galaxy_s20_ultra" },
        ],
    })

    return (
        <form onSubmit={onSubmit}>
            <h2>View</h2>
            <Stack gap="2" align="flex-start" maxW="sm">
                <Select.Root collection={devices} defaultValue={["no"]} onValueChange={(e) => {console.log(e.value[0])}}>
                    <Select.HiddenSelect />
                        <Select.Label>Device</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select virtual device" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                            {devices.items.map((devices) => (
                                <Select.Item item={devices} key={devices.value}>
                                    {devices.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
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
