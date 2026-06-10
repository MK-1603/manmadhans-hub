import ErrorPage from "@/components/ui/error/ErrorPage";
import { Lock } from "lucide-react";

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      message="Your current authentication clearance is insufficient to access this encrypted node."
      icon={<Lock size={40} />}
    />
  );
}
