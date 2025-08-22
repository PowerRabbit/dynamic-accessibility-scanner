import {
    Button,
    Field,
    Input,
    Stack,
    Fieldset,
    Separator,

} from '@chakra-ui/react';
import './settings-form.css';
import { useDialog } from '../dialog/dialog.component';
import { useEffect, useState } from 'react';
import { storageService } from '@/app/fe-services/storage/storage.service';
import { ScannerSettingsType } from '@/app/types/settings.type';

export const defaultSettings: ScannerSettingsType = {
    viewHeight: 1280,
    viewWidth: 1024,
    maxPages: 5,
};

export const SettingsForm = () => {
    const { close } = useDialog();
    const [formData, setFormData] = useState({
        viewHeight: defaultSettings.viewHeight,
        viewWidth: defaultSettings.viewWidth,
        maxPages: defaultSettings.maxPages,
    });

    useEffect(() => {
        const storedSettings = storageService.load<ScannerSettingsType>('scannerSettings') || defaultSettings;
        setFormData({
            viewHeight: storedSettings.viewHeight ?? defaultSettings.viewHeight,
            viewWidth: storedSettings.viewWidth ?? defaultSettings.viewWidth,
            maxPages: storedSettings.maxPages ?? defaultSettings.maxPages,
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        storageService.save('scannerSettings', formData);
        close();
    };

    const onReset = (e: React.FormEvent) => {
        setFormData(defaultSettings);
    };

    return (
        <form onSubmit={onSubmit} onReset={onReset}>
            <Stack gap="2" align="flex-start" maxW="sm">
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Legend>Viewport size (headless)</Fieldset.Legend>
                    <Fieldset.Content>
                        <Field.Root>
                            <Stack direction={{ base: "column", md: "row" }}>
                                    <Field.Label>Height</Field.Label>
                                    <Input
                                        type="number"
                                        name="viewHeight"
                                        onChange={handleChange}
                                        value={formData.viewHeight} /> px
                            </Stack >
                        </Field.Root>
                        <Field.Root>
                            <Stack direction={{ base: "column", md: "row" }}>
                                    <Field.Label>Width</Field.Label>
                                    <Input
                                        type="number"
                                        name="viewWidth"
                                        onChange={handleChange}
                                        value={formData.viewWidth} /> px
                            </Stack >
                        </Field.Root>
                    </Fieldset.Content>
                </Fieldset.Root>
            </Stack>
            <Separator />
            <Field.Root>
                <Field.Label>Max pages to crawl</Field.Label>
                <Input
                    type="number"
                    name="maxPages"
                    onChange={handleChange}
                    value={formData.maxPages} />
            </Field.Root>
            <br /><br />
            <Button type="submit">Update</Button> <Button type="reset" variant="outline">Reset</Button>
        </form>
    )
}
