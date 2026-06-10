"use client";

import React, { useState, useEffect } from "react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";
import { Flame, Clock, Tag } from "lucide-react";

interface Deal {
  id: string;
  icon: string;
  name: string;
  endsAt: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  initialSecondsLeft: number;
}

const initialDeals: Deal[] = [
  {
    id: "claude-pro",
    icon: "🤖",
    name: "Claude Pro — Annual Plan",
    endsAt: "Ends Jun 1, 2026",
    oldPrice: "$240/yr",
    newPrice: "$168",
    discount: "30% OFF",
    initialSecondsLeft: 2 * 24 * 3600 + 14 * 3600 + 33 * 60, // 2d 14h 33m
  },
  {
    id: "midjourney-credits",
    icon: "🎨",
    name: "Midjourney — Lifetime Credits Bundle",
    endsAt: "Ending soon",
    oldPrice: "$96",
    newPrice: "$49",
    discount: "49% OFF",
    initialSecondsLeft: 6 * 3600 + 12 * 60, // 6h 12m
  },
  {
    id: "elevenlabs-creator",
    icon: "🔊",
    name: "ElevenLabs Creator — 6 Months Free",
    endsAt: "New deal",
    oldPrice: "$99",
    newPrice: "$0",
    discount: "100% OFF",
    initialSecondsLeft: 5 * 24 * 3600, // 5d
  },
];

export default function DealsSection() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);

    // Ticking countdown timer
    const interval = setInterval(() => {
      setDeals((prevDeals) =>
        prevDeals.map((deal) => {
          if (deal.initialSecondsLeft <= 0) return deal;
          return {
            ...deal,
            initialSecondsLeft: deal.initialSecondsLeft - 1,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "Expired";
    const d = Math.floor(totalSeconds / (24 * 3600));
    const h = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (d > 0) {
      return `⏱ ${d}d ${h}h left`;
    }
    if (h > 0) {
      return `🔥 ${h}h ${m}m left`;
    }
    return `🚨 ${m}m ${s}s left`;
  };

  const handleGetDeal = (dealName: string) => {
    if (isLoggedIn) {
      localStorage.setItem("dashboard_active_tab", "deals");
      window.location.href = `/dashboard#deals`;
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  return (
    <section id="deals" className="py-[90px] px-[5%] bg-transparent relative z-[2]">
      <div className="max-w-[1380px] mx-auto">
        <AnimatedItem className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--neon)] font-sans tracking-[2px] uppercase mb-2">
            🏷️ DISCOUNT_MATRIX
          </div>
          <h2 className="font-sans font-extrabold text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-tight text-[var(--text)]">
            AI Tool <em>Deals & Discounts</em>
          </h2>
          <p className="text-[14px] text-[var(--muted2)] mt-2 max-w-[600px]">
            Bookmark a tool — get notified the instant a deal goes live. Countdown timers are live.
          </p>
        </AnimatedItem>

        <div className="flex flex-col gap-4">
          {deals.map((deal) => {
            const isCritical = deal.initialSecondsLeft < 24 * 3600;
            return (
              <AnimatedItem key={deal.id}>
                <div 
                  onClick={() => handleGetDeal(deal.name)}
                  className="bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--border2)] rounded-[18px] md:rounded-[22px] p-5 md:p-[22px_26px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card)] group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-[46px] h-[46px] rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center text-[22px] shrink-0">
                      {deal.icon}
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-bold font-sans text-[var(--text)] group-hover:text-[var(--neon)] transition-colors">
                        {deal.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span 
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            isCritical 
                              ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {formatTime(deal.initialSecondsLeft)}
                        </span>
                        <span className="text-[11px] text-[var(--muted2)] font-sans">
                          {deal.endsAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                    <div className="text-left sm:text-right">
                      <div className="text-[11px] text-[var(--muted2)] line-through">
                        {deal.oldPrice}
                      </div>
                      <div className="text-[20px] md:text-[22px] font-extrabold text-[var(--text)] font-sans leading-tight">
                        {deal.newPrice}
                      </div>
                      <span className="text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wide">
                        {deal.discount}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDeal(deal.name);
                      }}
                      className="px-5 py-2.5 rounded-[12px] bg-[var(--neon)] hover:bg-[var(--neon)]/90 text-[var(--bg)] font-sans font-bold text-[12px] uppercase tracking-wider border-none cursor-pointer transition-transform duration-150 active:scale-95 shadow-sm"
                    >
                      Get Deal ↗
                    </button>
                  </div>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
