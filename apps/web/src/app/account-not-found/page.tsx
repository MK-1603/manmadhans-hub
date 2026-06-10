"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AccountNotFoundPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--bg)] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgba(239,68,68,0.05)] rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgba(var(--neon-rgb),0.05)] rounded-full blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[500px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[24px] p-[40px] shadow-[var(--shadow-card)] flex flex-col items-center text-center"
      >
        {/* Access Denied Animated Icon */}
        <div className="w-[80px] h-[80px] rounded-full bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[36px] text-red-500 mb-6 animate-pulse">
          ⚠️
        </div>

        <div className="access-pill inline-flex items-center gap-[7px] bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] rounded-[20px] px-[12px] py-[6px] mb-[20px]">
          <div className="pill-dot w-[6px] h-[6px] rounded-full bg-red-500" />
          <span className="pill-txt text-[10px] font-bold uppercase tracking-[0.1em] text-red-500">403 Access Denied</span>
        </div>

        <h1 className="font-display text-[28px] md:text-[36px] font-extrabold text-[var(--text)] tracking-tight mb-[12px] leading-[1.2]">
          Account Not Found<span className="text-red-500">.</span>
        </h1>
        
        <p className="text-[14px] text-[var(--muted)] mb-[32px] leading-[1.6] max-w-[420px]">
          The Google account you tried to use is not authorized to access this platform.
          <br className="mt-2" />
          Please contact a <strong className="text-[var(--text)] font-semibold">Super Admin</strong> to register your email before logging in.
        </p>

        <button
          onClick={() => window.location.href = '/'}
          className="relative w-full max-w-[320px] h-[50px] bg-transparent border border-[var(--border2)] hover:border-[var(--border3)] hover:bg-[var(--glass)] rounded-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer group"
        >
          <span className="text-[14px] font-bold uppercase tracking-[0.06em] text-[var(--text)]">Back to Home</span>
        </button>
      </motion.div>
    </div>
  );
}
