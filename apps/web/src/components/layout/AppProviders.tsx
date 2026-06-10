"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/Toast";
import OfflineProvider from "@/components/OfflineProvider";
import { BootProvider } from "@/components/providers/BootProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <ToastProvider>
        <OfflineProvider>
          <BootProvider>
            {children}
          </BootProvider>
        </OfflineProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
