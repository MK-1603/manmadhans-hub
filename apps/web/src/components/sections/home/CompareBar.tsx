"use client";

import React, { useState, useEffect } from "react";
import { Layers } from "lucide-react";

export default function CompareBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);

    // Fade in after 3 seconds as in reference html
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCompare = () => {
    if (isLoggedIn) {
      localStorage.setItem("dashboard_active_tab", "compare");
      window.location.href = "/dashboard#compare";
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-[22px] left-1/2 -translate-x-1/2 z-[300] bg-[rgba(18,18,26,0.92)] border border-[var(--border2)] rounded-full px-5 py-3 flex items-center gap-4 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-[90%] sm:max-w-none"
    >
      <span className="text-[12.5px] font-sans font-bold text-[var(--text)] whitespace-nowrap flex items-center gap-1.5">
        <Layers size={13} className="text-[var(--neon)]" />
        Comparing
      </span>

      <div className="flex gap-2">
        <div className="w-[30px] h-[30px] rounded-lg bg-[var(--ad)] border border-[var(--border)] flex items-center justify-center text-[14px] select-none">
          🤖
        </div>
        <div className="w-[30px] h-[30px] rounded-lg bg-[var(--ad)] border border-[var(--border)] flex items-center justify-center text-[14px] select-none">
          🎨
        </div>
        <div className="w-[30px] h-[30px] rounded-lg border border-[var(--border)] border-dashed opacity-35 flex items-center justify-center text-[13px] text-[var(--muted2)] select-none">
          +
        </div>
        <div className="w-[30px] h-[30px] rounded-lg border border-[var(--border)] border-dashed opacity-35 flex items-center justify-center text-[13px] text-[var(--muted2)] select-none">
          +
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="px-[18px] py-2 rounded-full bg-[var(--neon)] hover:bg-[var(--neon)]/90 text-[var(--bg)] font-sans font-extrabold text-[11.5px] uppercase tracking-wider border-none cursor-pointer transition-transform active:scale-95 whitespace-nowrap"
      >
        Compare Now
      </button>
    </div>
  );
}
