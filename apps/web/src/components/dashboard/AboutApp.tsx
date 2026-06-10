"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from './ToastContext';
import { RefreshCcw } from 'lucide-react';

export const AboutApp = () => {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-6 md:p-10 bg-[var(--card-bg)] relative overflow-hidden">
      {/* Special Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon)]/[0.03] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[var(--neon)]/[0.05] blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg flex flex-col items-center p-10 relative z-10"
      >
        {/* Logo */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 mb-8">
          <img 
            src="/favicon.ico" 
            alt="Hub Logo" 
            className="w-full h-full object-contain drop-shadow-md" 
          />
        </div>

        {/* Title & Version */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-2">
            ManMadhan'S Hub
          </h1>
          <p className="text-sm font-medium text-[var(--muted)]">
            Version 1.0 (Early Access)
          </p>
        </div>

        {/* Update Status */}
        <div className="w-full text-center mb-10">
          <p className="text-[13px] text-[var(--text)] font-medium mb-1">
            ManMadhan'S Hub 1.0 is up to date.
          </p>
          <p className="text-[11px] text-[var(--muted2)] mb-5">
            Last checked: Just now
          </p>
          <button 
            onClick={() => {
              showToast("Contacting update servers...", "info");
              setTimeout(() => showToast("ManMadhan'S Hub is already on the latest version.", "success"), 2000);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg)]/50 hover:bg-[var(--card-bg)] hover:border-[var(--muted)] transition-all text-[12px] font-semibold text-[var(--text)] cursor-pointer shadow-sm"
          >
            <RefreshCcw size={14} />
            Check for Updates
          </button>
        </div>

        {/* System Info (Minimal) */}
        <div className="w-full max-w-sm pt-8 border-t border-[var(--border)]/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-[var(--muted)]">Operation Environment</span>
            <span className="text-[12px] text-[var(--text)] font-medium">{process.env.NODE_ENV === 'development' ? 'Local DEV Relay' : 'Production Grid'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-[var(--muted)]">License Tier</span>
            <span className="text-[12px] text-[var(--text)] font-medium">Enterprise Elite</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-[var(--muted)]">Launch Date</span>
            <span className="text-[12px] text-[var(--text)] font-medium">10-6-26</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
