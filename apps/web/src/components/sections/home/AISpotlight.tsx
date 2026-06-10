"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedItem } from "@/components/ui/AnimatedSection";
import { Check } from "lucide-react";
import Button3D from "@/components/ui/Button3D";

export default function AISpotlight() {
  return (
    <section id="ai-spotlight" className="py-[90px] px-[5%] bg-[var(--bg2)] relative overflow-hidden">
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(126,242,82,0.07),transparent_70%)] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-[1280px] mx-auto relative z-[2]">
        <div className="text-left">
          <AnimatedItem>
            <div className="inline-flex items-center gap-1.5 bg-[rgba(126,242,82,0.1)] border border-[var(--border2)] px-3.5 py-1.5 rounded-full text-[11.5px] font-bold text-[var(--neon)] font-sans tracking-[1.2px] uppercase mb-4">
              ⚡ MANMADHAN&apos;S AI
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(28px,3.8vw,50px)] leading-[1.08] mb-4 tracking-tight">
              The <em>Intelligence Engine</em> at the Core
            </h2>
            <p className="text-[15.5px] text-[var(--muted)] max-w-[560px] leading-[1.75] mb-6">
              Not just a chatbot. A fully RAG-powered AI system built specifically to understand, recommend, and compare AI tools with perfect context.
            </p>
          </AnimatedItem>
          
          <div className="flex flex-col gap-[11px] mb-7">
            {[
              "Streaming AI responses (token-by-token SSE)",
              "RAG-powered tool knowledge base (Qdrant)",
              "Semantic search with vector embeddings",
              "Personalized memory per session",
              "AI-generated comparison summaries"
            ].map((text, i) => (
              <AnimatedItem key={i}>
                <div className="flex items-center gap-[11px] text-[14.5px] text-[var(--muted)]">
                  <div className="w-[21px] h-[21px] bg-[rgba(126,242,82,0.14)] border border-[var(--border2)] rounded-md flex items-center justify-center text-[10.5px] text-[var(--neon)] flex-shrink-0">
                    <Check size={12} />
                  </div>
                  {text}
                </div>
              </AnimatedItem>
            ))}
          </div>
          <AnimatedItem>
            <Button3D href="#cta-section">⚡ Try Manmadhan&apos;s AI →</Button3D>
          </AnimatedItem>
        </div>

        <AnimatedItem>
          <div className="bg-[var(--card-bg2)] border border-[var(--border2)] rounded-[22px] overflow-hidden shadow-[var(--glow2),var(--shadow-card)]">
            <div className="bg-[var(--card-bg)] border-b border-[var(--border)] p-[15px_18px] flex items-center gap-[11px]">
              <div className="w-[34px] h-[34px] bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] rounded-full flex items-center justify-center text-[15px] animate-[aiPulse_2.5s_ease-in-out_infinite] flex-shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="font-sans font-bold text-[13.5px] text-[var(--text)] uppercase">MANMADHAN&apos;S AI</h4>
                <p className="text-[10.5px] text-[var(--neon)]">● Online · Powered by GPT-4o + RAG</p>
              </div>
            </div>
            <div className="p-[18px] flex flex-col gap-3 min-h-[270px] bg-[var(--card-bg2)]">
              <div className="self-end max-w-[82%] p-[11px_15px] rounded-[15px] rounded-br-[3px] bg-[rgba(126,242,82,0.12)] border border-[var(--border2)] text-[var(--text)] text-[13.5px] leading-[1.6]">
                Find me the best AI coding tools for a developer
              </div>
              <div className="self-start max-w-[82%] p-[11px_15px] rounded-[15px] rounded-bl-[3px] bg-[var(--card-bg)] border border-[var(--border)] text-[var(--muted)] text-[13.5px] leading-[1.6]">
                Here are the top AI coding tools I recommend:
                <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[11px] p-2.5 mt-[7px]">
                  {["Cursor AI — Best AI code editor", "GitHub Copilot — In-editor AI pair", "Tabnine — Privacy-first completion"].map((item, i) => (
                    <div key={i} className="flex items-center gap-[9px] py-1.5 border-b border-[var(--border)] last:border-none text-[12.5px] text-[var(--text)]">
                      <div className="w-[7px] h-[7px] bg-[var(--neon)] rounded-full flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5 items-center py-[9px]">
                {[0.2, 0.4, 0.6].map((delay, i) => (
                  <div key={i} className="w-[7px] h-[7px] bg-[var(--neon)] rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
            </div>
          </div>
        </AnimatedItem>
      </div>
    </section>
  );
}
