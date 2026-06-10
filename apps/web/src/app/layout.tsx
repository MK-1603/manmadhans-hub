import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Poppins, Geist } from "next/font/google";
import { AppProviders } from "@/components/layout/AppProviders";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Font Configuration
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://manmadhans-hub-web.vercel.app"),
  title: "ManMadhan’s Hub — Futuristic AI Discovery Platform",
  description: "A futuristic AI ecosystem engineered for creators, developers, and intelligent teams to discover, automate, organize, and orchestrate next-generation AI workflows.",
  keywords: [
    "AI Tools", "AI Platform", "AI Discovery", "AI Workflow",
    "AI Automation", "Artificial Intelligence", "Neural Systems",
    "AI Ecosystem", "AI Operating System", "Future AI", "AI Infrastructure"
  ],
  authors: [{ name: "ManMadhan" }],
  creator: "ManMadhan",
  publisher: "ManMadhan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ManMadhan",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://manmadhans-hub-web.vercel.app",
    title: "ManMadhan’s Hub — Futuristic AI Discovery Platform",
    description: "A futuristic AI ecosystem engineered for creators, developers, and intelligent teams.",
    siteName: "ManMadhan’s Hub",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "ManMadhan’s Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ManMadhan’s Hub — Futuristic AI Discovery Platform",
    description: "A futuristic AI ecosystem engineered for creators, developers, and intelligent teams.",
    images: ["/icons/icon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icons/icon-512x512.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <head>
      </head>
      <body
        suppressHydrationWarning
        className={`${jetbrainsMono.variable} ${poppins.variable} font-sans antialiased bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
