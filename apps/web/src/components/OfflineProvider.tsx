"use client";

/**
 * OfflineProvider
 * - Registers the service worker
 * - Pre-fetches and caches tools/categories on first online load
 * - Shows a persistent offline banner when the network is unavailable
 * - Exposes window.__hubOnline for other components to check
 */

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import {
  cacheTools,
  cacheCategories,

  isOnline,
  onNetworkChange,
} from "@/lib/offlineCache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── Service Worker Registration ───────────────────────────
function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // We allow SW registration in development because sw.js already bypasses localhost caching,
  // and we need the SW active to trigger the beforeinstallprompt event for PWA testing.

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.log("[SW] Registered:", reg.scope);

        // Prompt update when a new SW is waiting
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              newWorker.postMessage("SKIP_WAITING");
            }
          });
        });
      })
      .catch((err) => console.warn("[SW] Registration failed:", err));
  });
}

// ── Pre-cache API data ────────────────────────────────────
async function preCacheData(token: string | null) {
  try {
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const [toolsRes, categoriesRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/v1/tools?all=true`, { headers }),
      fetch(`${API_BASE}/api/v1/categories`, { headers }),
    ]);

    if (toolsRes.status === "fulfilled" && toolsRes.value.ok) {
      const data = await toolsRes.value.json();
      if (data.tools) await cacheTools(data.tools);
    }

    if (categoriesRes.status === "fulfilled" && categoriesRes.value.ok) {
      const data = await categoriesRes.value.json();
      if (Array.isArray(data)) await cacheCategories(data);
    }


  } catch {
    // Silently fail — offline cache will be used when available
  }
}

// ── Component ─────────────────────────────────────────────
export default function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);

  useEffect(() => {
    // Register SW
    registerServiceWorker();

    // Set initial state
    const currentlyOnline = isOnline();
    setOnline(currentlyOnline);
    (window as any).__hubOnline = currentlyOnline;

    if (!currentlyOnline) setShowBanner(true);

    // Listen for network changes
    const cleanup = onNetworkChange((nowOnline) => {
      setOnline(nowOnline);
      (window as any).__hubOnline = nowOnline;

      if (nowOnline) {
        setJustCameOnline(true);
        setShowBanner(false);
        // Re-cache data when back online
        const token = localStorage.getItem("session_token");
        preCacheData(token);
        // Hide "back online" toast after 3s
        setTimeout(() => setJustCameOnline(false), 3000);
      } else {
        setShowBanner(true);
        setJustCameOnline(false);
      }
    });

    // Pre-cache on initial load if online
    if (currentlyOnline) {
      const token = localStorage.getItem("session_token");
      // Delay slightly to not block initial render
      const timer = setTimeout(() => preCacheData(token), 2000);
      return () => {
        cleanup();
        clearTimeout(timer);
      };
    }

    return cleanup;
  }, []);

  return (
    <>
      {children}

      {/* ── Offline Banner ── */}
      {showBanner && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl border border-red-500/30 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(239,68,68,0.2)] text-sm font-bold text-red-400 font-sans animate-in slide-in-from-bottom-4 duration-300"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff size={16} className="shrink-0" />
          <span className="tracking-wide uppercase text-[11px]">
            Offline Mode — Showing cached data
          </span>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-red-300/70 hover:text-red-300 transition-colors cursor-pointer"
            aria-label="Retry connection"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* ── Back Online Toast ── */}
      {justCameOnline && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl border border-emerald-500/30 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(126,242,82,0.15)] text-sm font-bold text-emerald-400 font-sans animate-in slide-in-from-bottom-4 duration-300"
          role="status"
          aria-live="polite"
        >
          <Wifi size={16} className="shrink-0" />
          <span className="tracking-wide uppercase text-[11px]">
            Connection Restored — Syncing data...
          </span>
        </div>
      )}
    </>
  );
}
