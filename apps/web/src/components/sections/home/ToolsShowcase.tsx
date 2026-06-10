"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";
import { Star, Filter, Heart, ArrowUpRight } from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  rating: string;
  pricing: "Paid" | "Free" | "Freemium";
  icon: string;
  status?: "Active" | "vdot";
}

const curatedTools: ToolItem[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Enterprise",
    category: "Writing",
    desc: "Advanced AI by OpenAI with GPT-4o, custom instructions, and enterprise-grade security.",
    rating: "4.9",
    pricing: "Paid",
    icon: "🤖",
    status: "Active",
  },
  {
    id: "midjourney",
    name: "Midjourney v7",
    category: "Image Gen",
    desc: "State-of-the-art AI image generation with stunning photorealistic and artistic outputs.",
    rating: "4.8",
    pricing: "Paid",
    icon: "🎨",
    status: "vdot",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    category: "Code",
    desc: "AI pair programmer with real-time completions, chat, and multi-file edits directly in your IDE.",
    rating: "4.7",
    pricing: "Freemium",
    icon: "💻",
    status: "vdot",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Audio AI",
    desc: "Ultra-realistic voice cloning and TTS across 29 languages with emotional control.",
    rating: "4.9",
    pricing: "Freemium",
    icon: "🔊",
    status: "Active",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    category: "Research",
    desc: "AI-powered search with real-time web results, cited sources, and follow-up questions.",
    rating: "4.6",
    pricing: "Free",
    icon: "🔍",
  },
  {
    id: "runway",
    name: "Runway Gen-4",
    category: "Video AI",
    desc: "Professional AI video generation with motion brush and cinematic quality output.",
    rating: "4.8",
    pricing: "Paid",
    icon: "🎬",
    status: "vdot",
  },
];

function ToolCard({ tool }: { tool: ToolItem }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAccess = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem("landing_search_query", tool.name);
    if (isLoggedIn) {
      localStorage.setItem("dashboard_active_tab", "search-ai");
      window.location.href = "/dashboard#search-ai";
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  return (
    <div
      onClick={handleAccess}
      className="group relative flex flex-col justify-between h-full bg-[#0a0a0a] border border-[var(--border)] rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:border-[var(--neon)]/50 hover:shadow-[0_8px_32px_-8px_rgba(var(--neon-rgb),0.3)]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--neon)]/10 blur-[40px] rounded-full group-hover:bg-[var(--neon)]/20 transition-colors duration-500 pointer-events-none" />

      {/* Top Indicators */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {tool.status === "Active" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-sans font-black tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </div>
        )}
        {tool.status === "vdot" && (
          <div className="w-2 h-2 rounded-full bg-[var(--neon)] shadow-[0_0_8px_var(--neon)]" />
        )}
      </div>

      <div className="relative z-10 flex-1">
        {/* Header: Icon & Category */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-[14px] bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center text-[22px] shadow-sm group-hover:scale-105 group-hover:shadow-[var(--neon)]/20 transition-all duration-300">
            {tool.icon}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-sans font-bold text-lg text-[var(--text)] group-hover:text-[var(--neon)] transition-colors duration-300 mb-2 tracking-tight">
          {tool.name}
        </h4>

        {/* Category Tag */}
        <div className="inline-block mb-4">
          <span className="text-[9px] font-black text-[var(--muted)] bg-[var(--input-bg)] px-2.5 py-1 rounded-lg border border-[var(--border)] tracking-widest uppercase group-hover:border-[var(--neon)]/30 group-hover:text-[var(--text)] transition-colors duration-300">
            {tool.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-6 group-hover:text-[var(--muted2)] transition-colors duration-300">
          {tool.desc}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-center pt-4 border-t border-[var(--border)]/50 group-hover:border-[var(--neon)]/30 transition-colors duration-300">
        {/* Rating */}
        <div className="flex items-center gap-1.5 bg-[var(--input-bg)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-bold text-[var(--text)] font-mono">{tool.rating}</span>
        </div>

        {/* Pricing tag & Action */}
        <div className="flex items-center gap-3">
          <span
            className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${tool.pricing === "Free"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : tool.pricing === "Paid"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
          >
            {tool.pricing}
          </span>
          <div className="w-7 h-7 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:bg-[var(--neon)] group-hover:text-black group-hover:border-[var(--neon)] transition-all duration-300">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolsShowcase() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleFilter = () => {
    if (isLoggedIn) {
      localStorage.setItem("dashboard_active_tab", "search-ai");
      window.location.href = "/dashboard#search-ai";
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  return (
    <section id="tools" className="py-[90px] px-[5%] bg-transparent relative z-[2]">
      <div className="max-w-[1380px] mx-auto">
        <AnimatedItem className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border)] pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--neon)] font-sans tracking-[2px] uppercase mb-2">
              ⭐ Featured This Week
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-tight text-[var(--text)]">
              Top Curated <em>AI Tools</em>
            </h2>
            <p className="text-[14px] text-[var(--muted2)] mt-2 max-w-[600px]">
              Admin-verified tools with health monitoring, changelog tracking, pricing history & community prompts.
            </p>
          </div>
          <div>
            <button
              onClick={handleFilter}
              className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border2)] px-6 py-2.5 rounded-[12px] text-[13px] font-sans font-bold italic text-[var(--text)] hover:border-[var(--neon)] hover:text-[var(--neon)] transition-all tracking-wide shadow-sm cursor-pointer"
            >
              <Filter size={13} /> Filter Tools
            </button>
          </div>
        </AnimatedItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedTools.map((tool) => (
            <AnimatedItem key={tool.id}>
              <ToolCard tool={tool} />
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
