
import ResultsPage from "@/app/components/crawls/results/results.page";
import { Provider } from "@/app/components/ui/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Results | Dynamic Accessibility Scanner",
};

interface Props {
  params: Promise<{
    crawlUuid: string;
    pageUuid: string;
 }>;
}

const CrawlResultsPageP = async ({ params }: Props) => {
  const { crawlUuid, pageUuid } = await Promise.resolve(params);

  return (
    <Provider>
      <ResultsPage crawlUuid={crawlUuid} pageUuid={pageUuid} />
    </Provider>
  );
};

export default CrawlResultsPageP;
