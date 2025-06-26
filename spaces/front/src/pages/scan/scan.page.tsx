import { useState } from "react";
import { communicationService } from "../../services/communication.service";

type ScanResult = {
    incomplete: unknown[], violations: unknown[],
};

const ScanPage = () => {
    const [url, setUrl] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');

    const onErrorFallback = <T,>(e: unknown): T => {
        console.log((e as Error).message);
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
            <label>
        Enter a URL:
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                />
            </label>
            <button type="submit">Run Scan</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {inProgress && <p>Loading...</p>}
        </form>
    </>;
};

export default ScanPage;
