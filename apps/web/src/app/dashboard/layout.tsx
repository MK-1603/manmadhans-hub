import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ManMadhan's Hub - Private AI HUB",
  description: "Secure Administrative Nexus for ManMadhan's Hub",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
