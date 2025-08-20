'use client';

import Link from 'next/link';
import { SettingsForm } from '../settings-form/settings-form.component';

const SettingsPage = () => {

    return <div className="page-wrapper">
        <h1>Settings</h1>
        <Link href="/">Home</Link>
        <p>(Applies for Headless scans)</p>
        <br />
        <SettingsForm  submit={() => {}} inProgress={false}></SettingsForm>
    </div>
}

export default SettingsPage;
