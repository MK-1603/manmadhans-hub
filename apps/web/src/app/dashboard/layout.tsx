import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manmadhan'S Hub - Private AI HUB",
  description: "Secure Administrative Nexus for Manmadhan's Hub",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
