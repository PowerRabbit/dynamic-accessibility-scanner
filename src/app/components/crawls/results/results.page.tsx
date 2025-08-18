'use client';

import { communicationService } from "@/app/fe-services/communication/communication.service";
import { PageResultsType } from "@/types/page.type";
import { Icon, Tabs } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { ViolationItem } from "../../violation-item/violation-item.component";
import ScanPageContext from "../../scan/scan.context";

interface Props {
  crawlUuid: string;
  pageUuid: string;
}

const ResultsPage = ({ crawlUuid, pageUuid }: Props) => {

    const [pageData, setPageData] = useState<PageResultsType>();
    const hasFetched = useRef(false);

    const removeEntry = () => {};

    useEffect(() => {
        if (hasFetched.current) {
            return
        };

        const fetchCrawlsData = async () => {
            const result = await communicationService.get<PageResultsType>({
                url: `crawls/${crawlUuid}/pages/${pageUuid}`,
            });
            setPageData(result);
        };

        fetchCrawlsData();
        hasFetched.current = true;
    }, [crawlUuid, pageUuid]);

    const renderData = () => {
        if (pageData) {
            if (pageData.error) {
                return <>
                    <h2>Page was not scanned properly</h2>
                    <p>{pageData.error}</p>
                </>
            } else {
                const { violations, incomplete } = pageData;
                return <>
                    <p><b>Title:</b> {pageData.title}</p>
                    <p><b>URL:</b> <a href={pageData.url} target="_blank"><Icon><HiOutlineExternalLink /></Icon> {pageData.url}</a></p>
                    <br/><br/>
                    <ScanPageContext.Provider value={{ removeEntry }}>
                    <div className="tabs-wrapper">
                        <Tabs.Root defaultValue="violations">
                            <Tabs.List>
                                <Tabs.Trigger value="violations">
                                    Violations {violations.length > 0 ? `(${violations.length})` : ''}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="incomplete">
                                    Incomplete {incomplete.length > 0 ? `(${incomplete.length})` : ''}
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="violations">
                                {!violations.length ? 'No violations'
                                    : violations.map((v, i) =>
                                        <ViolationItem key={v.id + i} violation={v} index={i} type='violation' />
                                    )}
                            </Tabs.Content>
                            <Tabs.Content value="incomplete">
                                {!incomplete.length ? 'No incomplete checks'
                                    : incomplete.map((v, i) =>
                                        <ViolationItem key={v.id + i} violation={v} index={i} type='incomplete' />
                                )}
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                    </ScanPageContext.Provider>
                </>
            }
        }
    };

    return (
    <div className="page-wrapper">
      <h1>Results for page</h1>
      <Link href="/">Home</Link> | <Link href={`/crawls/${crawlUuid}`}>Back to Crawl</Link> | <Link href="/crawls">All Crawls</Link>
      <br/><br/>
      {renderData()}

    </div>
    );
};

export default ResultsPage;
