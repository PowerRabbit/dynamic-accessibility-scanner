'use client';

import Link from 'next/link';
import { SettingsForm } from '../settings-form/settings-form.component';

const SettingsPage = () => {

    return <div className="page-wrapper">
        <h1>Settings</h1>
        <p>(Applies for Headless scan)</p>
        <br />
        <SettingsForm  submit={() => {}} inProgress={false}></SettingsForm>
        <br />
        <Link href="/">Go Back</Link>
    </div>
}

export default SettingsPage;
