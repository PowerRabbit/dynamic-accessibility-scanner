import ScanPage from "@/app/components/scan/scan.page";
import { Provider } from "@/app/components/ui/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan | Dynamic Accessibility Scanner",
};

const ScanPageP = () =>  <>
        <Provider>
            <ScanPage />
        </Provider>
    </>

export default ScanPageP;
