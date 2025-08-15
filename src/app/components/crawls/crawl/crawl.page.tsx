'use client';

import { communicationService } from "@/app/fe-services/communication/communication.service";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
  uuid: string;
}

type CrawlResultsType = {
    id: number;
    uuid: string;
    base_url: string;
    started_at: string;
    ended_at?: string;
}

const CrawlPage = ({ uuid }: Props) => {
    const [crawlResults, setResults] = useState<CrawlResultsType>();
        const hasFetched = useRef(false);

        useEffect(() => {
            if (hasFetched.current) {
                return
            };

            const fetchCrawlsData = async () => {
                const result = await communicationService.get<CrawlResultsType>({
                    url: `crawls/${uuid}`,
                });
                console.log('result');
                console.log(result);
                setResults(result);
            };

            fetchCrawlsData();
            hasFetched.current = true;
        }, [uuid]);

    return (
    <div className="page-wrapper">
      <h1>Crawl results</h1>
      <Link href="/">Scan Page</Link> | <Link href="/crawls">Back to all Crawls</Link>
    </div>
    );
};

export default CrawlPage;
