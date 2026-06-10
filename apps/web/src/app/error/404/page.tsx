import ErrorPage from "@/components/ui/error/ErrorPage";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Lost in the Void"
      message="The neural pathway you're seeking doesn't exist or has been relocated to another dimension."
      icon={<Ghost size={40} />}
    />
  );
}
