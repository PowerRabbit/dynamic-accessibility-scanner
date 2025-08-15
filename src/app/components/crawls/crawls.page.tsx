'use client';

import { communicationService } from '@/app/fe-services/communication/communication.service';
import { Table } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type CrawlDataType = {
    id: number;
    uuid: string;
    base_url: string;
    started_at: string;
    ended_at?: string;
}

const CrawlsPage = () => {
    const [crawls, setCrawlsData] = useState<CrawlDataType[]>();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) {
            return
        };

        const fetchCrawlsData = async () => {
            const result = await communicationService.get<CrawlDataType[]>({
                url: 'crawls',
            });
            setCrawlsData(result);
        };

        fetchCrawlsData();
        hasFetched.current = true;
    }, []);

    return <div className="page-wrapper">
        <h1>Crawls</h1>
        <Link href="/">Scan Page</Link>
        <br/><br/>
        <div>
            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                    <Table.ColumnHeader>URL</Table.ColumnHeader>
                    <Table.ColumnHeader>Started</Table.ColumnHeader>
                    <Table.ColumnHeader>Finished</Table.ColumnHeader>
                    <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {crawls?.map((crawl) => (
                    <Table.Row key={crawl.id}>
                        <Table.Cell>{crawl.base_url}</Table.Cell>
                        <Table.Cell>{crawl.started_at}</Table.Cell>
                        <Table.Cell>{crawl.ended_at}</Table.Cell>
                        <Table.Cell textAlign="end"><Link href={`/crawls/${crawl.uuid}`}>See results</Link></Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    </div>
}

export default CrawlsPage;
