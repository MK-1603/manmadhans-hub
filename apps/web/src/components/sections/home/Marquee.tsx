"use client";

import React from "react";

const items = [
  "⚡ Powered by GPT-4o", "🔍 Meilisearch Engine", "🧠 Qdrant Vector DB", "🔐 Invite Only Access",
  "⚡ Realtime AI", "🌌 47 DB Tables", "🚀 Next.js 15", "💾 Neon PostgreSQL", "🎯 RAG Pipeline", "🔥 500+ AI Tools"
];

export default function Marquee() {
  return (
    <div className="bg-[var(--marquee-bg)] border-t border-b border-[var(--border)] overflow-hidden py-3.5">
      <div className="flex animate-[marqueeScroll_28s_linear_infinite] w-max hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <React.Fragment key={i}>
            <span className="flex items-center gap-2 px-6 text-[12.5px] font-semibold text-[var(--muted)] whitespace-nowrap font-sans transition-colors duration-200 hover:text-[var(--neon)] tracking-[0.3px]">
              {item}
            </span>
            {i !== items.length * 2 - 1 && <span className="text-[var(--border3)] px-1">·</span>}
          </React.Fragment>
        ))}
      </div>
      <style jsx>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
