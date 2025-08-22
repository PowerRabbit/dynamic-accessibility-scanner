import CrawlPage from "@/app/components/crawls/crawl/crawl.page";
import { Provider } from "@/app/components/ui/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crawl Results | Dynamic Accessibility Scanner",
};

interface Props {
  params: { crawlUuid: string };
}

const CrawlPageP = async ({ params }: Props) => {
  const { crawlUuid } = await Promise.resolve(params);

  return (
    <Provider>
      <CrawlPage uuid={crawlUuid} />
    </Provider>
  );
};

export default CrawlPageP;
