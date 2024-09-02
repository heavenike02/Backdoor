import { Button } from "@/components/ui/button";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface BookDemoProps {
    buttonWidth?: string; 
    icon?: React.ReactNode;
}

export function BookDemo({ buttonWidth = "auto", icon }: BookDemoProps) { // Default to 'auto'
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ "namespace": "backdoor-demo" });
            cal("ui", {
                "styles": {
                    "branding": { "brandColor": "#000000" },
                }, "hideEventTypeDetails": false, "layout": "month_view"
            });
        })();
    }, []);

    return (
        <Button
            variant="secondary"
            data-cal-namespace="backdoor-demo"
            data-cal-link="heaven-ike-a2flam/backdoor-demo"
            data-cal-config='{"layout":"month_view"}'
            style={{ width: buttonWidth }} // Apply button width
        >
            Book a Demo
            {icon}
        </Button>
    );
};
