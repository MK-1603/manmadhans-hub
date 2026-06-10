import ErrorPage from "@/components/ui/error/ErrorPage";
import { WifiOff } from "lucide-react";

export default function Offline() {
  return (
    <ErrorPage
      code="OFF"
      title="Connection Severed"
      message="Your uplink to the AI Universe has been disconnected. Please check your network environment."
      icon={<WifiOff size={40} />}
      showRetry
    />
  );
}
