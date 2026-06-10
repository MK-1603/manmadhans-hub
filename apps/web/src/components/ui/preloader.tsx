'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [renderSplit, setRenderSplit] = useState(true);
  const pathname = usePathname();

  const errorPaths = ['/404', '/403', '/account-not-found', '/tools-not-found', '/offline', '/maintenance'];

  useEffect(() => {
    // Clear cache to always start from the beginning as requested
    localStorage.clear();
    sessionStorage.clear();

    const isSessionActive = sessionStorage.getItem("session_active") === "true";
    const isLocalSessionActive = localStorage.getItem("session_active_flag") === "true";
    const hasToken = !!localStorage.getItem("session_token");

    // If session is already active or we are on an error path, skip preloader immediately
    if (isSessionActive || isLocalSessionActive || hasToken || errorPaths.includes(pathname)) {
      setLoading(false);
      setRenderSplit(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    // Simulate native app launch time
    const duration = 1500;

    let innerTimeout: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      setLoading(false);
      innerTimeout = setTimeout(() => {
        document.body.style.overflow = '';
        setRenderSplit(false);
      }, 500); // Wait for fade out animation to finish
    }, duration);

    return () => {
      clearTimeout(timeout);
      if (innerTimeout) clearTimeout(innerTimeout);
      document.body.style.overflow = '';
    };
  }, [pathname]);

  if (!renderSplit) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center bg-background transition-opacity duration-500 ease-in-out"
      style={{ opacity: loading ? 1 : 0 }}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center justify-center relative w-24 h-24 sm:w-28 sm:h-28"
          >
            <img
              src="/favicon.ico"
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
