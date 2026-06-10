"use client";

import React, { useState, useEffect } from "react";
import { Search, Zap } from "lucide-react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Save pending search query to carry over to the dashboard
    localStorage.setItem("landing_search_query", trimmed);

    if (isLoggedIn) {
      // Go directly to secure search tab
      localStorage.setItem("dashboard_active_tab", "search-ai");
      window.location.href = "/dashboard#search-ai";
    } else {
      // Prompt credentials check
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <section id="search-section" className="py-[110px] px-[5%] bg-[var(--bg3)] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(126,242,82,0.07),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto text-center relative z-[50]">
        <AnimatedItem className="mb-14">
          <div className="inline-flex items-center gap-2 bg-[rgba(126,242,82,0.08)] border border-[var(--border2)] px-4 py-2 rounded-full text-[10px] font-bold text-[var(--neon)] font-sans tracking-[2.5px] uppercase mb-8 shadow-[var(--glow)]">
            <Zap size={14} className="fill-[var(--neon)]" /> DISCOVERY MODULE
          </div>
          <h2 className="font-sans font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.15] mb-6 tracking-tight">
            Master the <span className="bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] bg-clip-text text-transparent italic ml-1.5 px-1">AI Intelligence</span>
          </h2>
          <p className="text-[16px] text-[var(--muted)] max-w-[580px] mx-auto leading-[1.8] font-body opacity-90">
            Search 500+ premium AI tools with intelligent semantic reasoning. <br className="hidden md:block" /> Engineered for creators, developers, and visionary teams.
          </p>
        </AnimatedItem>

        <form onSubmit={onSubmit} className="relative max-w-[800px] mx-auto mb-12 group z-[100]">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon)] to-[var(--emerald)] opacity-[0.05] blur-[50px] rounded-full group-focus-within:opacity-[0.12] transition-opacity duration-500 pointer-events-none"></div>
          <div className="search-container-premium relative z-[10] flex items-center">
            <div className="flex items-center flex-grow">
              <Search className="ml-5 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors pointer-events-none" size={20} />
              <input
                type="text"
                placeholder="Search tools by name, use-case, or capability..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-[60px] bg-transparent border-none px-4 text-[16px] text-[var(--text)] font-body outline-none placeholder:text-[var(--muted2)]"
              />
            </div>
            <button 
              type="submit"
              className="bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] text-[var(--bg)] px-10 h-[60px] rounded-[18px] font-sans font-extrabold text-[13px] tracking-[1.5px] uppercase hover:brightness-110 active:scale-[0.97] transition-all shadow-[0_8px_20px_rgba(126,242,82,0.25)] mr-1.5 cursor-pointer"
            >
              SEARCH
            </button>
          </div>
        </form>

        <AnimatedItem className="flex items-center gap-4 flex-wrap justify-center opacity-90">
          <span className="text-[10px] text-[var(--muted2)] font-black tracking-[2px] font-sans uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--neon)] rounded-full animate-pulse"></span>
            TRENDING_TOOLS:
          </span>
          {[
            { name: "ChatGPT", icon: "🤖" },
            { name: "Cursor AI", icon: "💻" },
            { name: "Midjourney", icon: "🎨" },
            { name: "Claude", icon: "🧠" },
            { name: "Make.com", icon: "⚡" }
          ].map(tool => (
            <button 
              key={tool.name} 
              onClick={() => handleSearch(tool.name)}
              className="flex items-center gap-2 bg-[rgba(var(--particle-rgb),0.04)] border border-[var(--border)] px-4.5 py-2 rounded-xl text-[12.5px] text-[var(--muted)] cursor-pointer transition-all duration-250 font-sans font-medium hover:bg-[rgba(var(--particle-rgb),0.08)] hover:border-[var(--border3)] hover:text-[var(--neon)] hover:-translate-y-0.5 shadow-sm"
            >
              <span className="text-[14px]">{tool.icon}</span>
              {tool.name}
            </button>
          ))}
        </AnimatedItem>
      </div>
    </section>
  );
}
