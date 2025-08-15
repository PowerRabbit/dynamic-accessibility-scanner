import CrawlPage from "@/app/components/crawls/crawl/crawl.page";
import { Provider } from "@/app/components/ui/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crawl Results | Dynamic Accessibility Scanner",
};

interface Props {
  params: { uuid: string };
}

const CrawlPageP = async ({ params }: Props) => {
  const { uuid } = await Promise.resolve(params);

  return (
    <Provider>
      <CrawlPage uuid={uuid} />
    </Provider>
  );
};

export default CrawlPageP;
