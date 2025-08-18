'use client';

import { communicationService } from "@/app/fe-services/communication/communication.service";
import { PageDataResponseType } from "@/types/page.type";
import { Icon, Table } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";

interface Props {
  uuid: string;
}

const CrawlPage = ({ uuid }: Props) => {
    const [pagesData, setPagesData] = useState<PageDataResponseType[]>();
        const hasFetched = useRef(false);

        useEffect(() => {
            if (hasFetched.current) {
                return
            };

            const fetchCrawlsData = async () => {
                const result = await communicationService.get<PageDataResponseType[]>({
                    url: `crawls/${uuid}`,
                });
                setPagesData(result);
            };

            fetchCrawlsData();
            hasFetched.current = true;
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
    </div>
    );
};

export default CrawlPage;
