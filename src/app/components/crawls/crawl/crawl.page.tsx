'use client';

import { communicationService } from "@/app/fe-services/communication/communication.service";
import { PageDataResponseType } from "@/types/page.type";
import { Icon, Spinner, Table } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";

interface Props {
  uuid: string;
}

type CrawlResponseType = {
    startedAt: string;
    endedAt: string;
    pages: PageDataResponseType[];
}

const CrawlPage = ({ uuid }: Props) => {
    const [pagesData, setPagesData] = useState<PageDataResponseType[]>();
    const [inProgress, setInProgress] = useState(false);
    const hasFetched = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (hasFetched.current) {
            return
        };

        const fetchCrawlsData = async () => {
            let shouldContinue = false;
            try {
                const result = await communicationService.get<CrawlResponseType>({
                    url: `crawls/${uuid}`,
                });
                setPagesData(result.pages);
                shouldContinue = !result.endedAt;
            } catch(e) {
                shouldContinue = false;
            } finally {
                hasFetched.current = true;
            }

            if (shouldContinue) {
                setInProgress(true);
            } else {
                setInProgress(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        };

        fetchCrawlsData();

        intervalRef.current = setInterval(() => {
            fetchCrawlsData();
        }, 10000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

    }, [uuid]);

    return (
    <div className="page-wrapper">
      <h1>Crawl results</h1>
      <Link href="/">Home</Link> | <Link href="/crawls">Back to all Crawls</Link>
      <br/><br/>
        <div>
            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>URL</Table.ColumnHeader>
                        <Table.ColumnHeader>Title</Table.ColumnHeader>
                        <Table.ColumnHeader>Scanned</Table.ColumnHeader>
                        <Table.ColumnHeader>Violations</Table.ColumnHeader>
                        <Table.ColumnHeader>Incomplete</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {pagesData?.map((page) => (
                    <Table.Row key={page.id}>
                        <Table.Cell>
                            <span className="td-text-ellipsis"><a href={page.url} target="_blank"><Icon><HiOutlineExternalLink /></Icon> {page.url}</a></span>
                        </Table.Cell>
                        <Table.Cell>{page.title}</Table.Cell>
                        <Table.Cell>{page.scannedAt}</Table.Cell>
                        <Table.Cell>{page.violations}</Table.Cell>
                        <Table.Cell>{page.incomplete}</Table.Cell>
                        <Table.Cell>{page.scanError}</Table.Cell>
                        <Table.Cell textAlign="end"><Link href={`/crawls/${uuid}/pages/${page.id}`}>See results</Link></Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
        {!hasFetched.current ? <p><Spinner /> Loading...</p> : ''}
        {inProgress ? <p><Spinner /> Crawl in progress...</p> : ''}
    </div>
    );
};

export default CrawlPage;
