import SettingsPage from "@/app/components/settings-page/settings.page";
import { Provider } from "@/app/components/ui/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Dynamic Accessibility Scanner",
};

const SettingsPageP = () =>  <>
        <Provider>
            <SettingsPage />
        </Provider>
    </>

export default SettingsPageP;
