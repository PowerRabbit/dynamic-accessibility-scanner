import { Provider } from "@/app/components/ui/provider";
import { Metadata } from "next";
import CrawlsPage from "../components/crawls/crawls.page";

export const metadata: Metadata = {
  title: "Crawls | Dynamic Accessibility Scanner",
};

const CrawlsPageP = () =>  <>
        <Provider>
            <CrawlsPage />
        </Provider>
    </>

export default CrawlsPageP;
