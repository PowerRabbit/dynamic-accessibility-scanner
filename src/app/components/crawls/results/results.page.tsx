'use client';

import { communicationService } from "@/app/fe-services/communication/communication.service";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
  crawlUuid: string;
  pageUuid: string;
}

const ResultsPage = ({ crawlUuid, pageUuid }: Props) => {

    const [pagesData, setPagesData] = useState<any[]>();
            const hasFetched = useRef(false);

            useEffect(() => {
                if (hasFetched.current) {
                    return
                };

                const fetchCrawlsData = async () => {
                    const result = await communicationService.get<any[]>({
                        url: `crawls/${crawlUuid}/pages/${pageUuid}`,
                    });
                    console.log(result);
                    setPagesData(result);
                };

                fetchCrawlsData();
                hasFetched.current = true;
            }, [crawlUuid, pageUuid]);

    return (
    <div className="page-wrapper">
      <h1>Results for page</h1>
      <h2>{pageUuid}</h2>
      <Link href={`/crawls/${crawlUuid}`}>Back to Crawl</Link> | <Link href="/crawls">All Crawls</Link>
      <br/><br/>

    </div>
    );
};

export default ResultsPage;
