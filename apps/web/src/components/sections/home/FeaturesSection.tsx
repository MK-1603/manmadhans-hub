"use client";

import React from "react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";

const features = [
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Meilisearch with typo tolerance, synonyms, and CMD+F shortcut",
  },
  {
    icon: "⚖️",
    title: "Compare Tools",
    desc: "Side-by-side of up to 4 tools. Shareable link + export PDF",
  },
  {
    icon: "🏥",
    title: "Health Monitor",
    desc: "6-hour uptime checks with 30-day history chart per tool",
  },
  {
    icon: "🪦",
    title: "Tool Graveyard",
    desc: "Dead tools never deleted — archived with full history preserved",
  },
  {
    icon: "🤖",
    title: "AI Curation",
    desc: "Daily AI agent finds new tools. Admin reviews before any publish",
  },
  {
    icon: "📶",
    title: "Offline PWA",
    desc: "Tools, guide, and all 6 games work without internet",
  },
  {
    icon: "🔌",
    title: "MCP Servers",
    desc: "First-class directory cross-linked to the AI tool directory",
  },
  {
    icon: "📊",
    title: "Version History",
    desc: "Full admin rollback system — every edit stored forever",
  },
];

export default function FeaturesSection() {
  return (
    <section id="systems" className="py-[90px] px-[5%] bg-transparent relative z-[2]">
      <div className="max-w-[1380px] mx-auto">
        <AnimatedItem className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--neon)] font-sans tracking-[2px] uppercase mb-2">
            ⚙️ Platform Systems
          </div>
          <h2 className="font-sans font-extrabold text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-tight text-[var(--text)]">
            80 Core Systems. <em>Nothing Missing.</em>
          </h2>
          <p className="text-[14px] text-[var(--muted2)] mt-2 max-w-[600px]">
            Built for power users who demand enterprise-grade reliability with a cinematic experience.
          </p>
        </AnimatedItem>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <AnimatedItem key={idx}>
              <div 
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[18px] p-5 cursor-default hover:border-[var(--border2)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-card)] h-full flex flex-col items-start"
              >
                <div className="text-[24px] w-[44px] h-[44px] rounded-xl bg-[var(--ad)] border border-[var(--border)] flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h4 className="font-sans font-bold text-[13.5px] text-[var(--text)] tracking-wide mb-[5px]">
                  {f.title}
                </h4>
                <p className="text-[11.5px] text-[var(--muted2)] leading-[1.55] font-sans">
                  {f.desc}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
