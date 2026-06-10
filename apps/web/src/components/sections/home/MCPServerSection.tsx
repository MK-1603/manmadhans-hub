"use client";

import React, { useState, useEffect } from "react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";
import { Server, Star, CheckCircle, HelpCircle } from "lucide-react";

const mcpServers = [
  {
    icon: "📝",
    name: "Notion MCP",
    verified: true,
    desc: "Connects to Notion databases, pages, blocks, and workspaces. Full read/write access with rich content support.",
    chips: ["Claude", "GPT-4o", "OAuth", "productivity", "⭐ 2.4k"],
  },
  {
    icon: "🗄️",
    name: "Postgres MCP",
    verified: true,
    desc: "Direct PostgreSQL query execution, schema introspection, and migration management from any AI model.",
    chips: ["Claude", "Gemini", "API Key", "databases", "⭐ 1.8k"],
  },
  {
    icon: "🔍",
    name: "Brave Search MCP",
    verified: false,
    desc: "Real-time web search via Brave's private and independent search index with clean result formatting.",
    chips: ["Claude", "GPT-4o", "API Key", "search", "⭐ 3.1k"],
  },
];

export default function MCPServerSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAccess = () => {
    if (isLoggedIn) {
      localStorage.setItem("dashboard_active_tab", "mcp-servers");
      window.location.href = "/dashboard#mcp-servers";
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  return (
    <section id="mcp" className="py-[90px] px-[5%] bg-transparent relative z-[2]">
      <div className="max-w-[1380px] mx-auto">
        <AnimatedItem className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border)] pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--neon)] font-sans tracking-[2px] uppercase mb-2">
              🔌 CONNECTION_LAYER
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-tight text-[var(--text)]">
              Model Context Protocol <em>(MCP)</em>
            </h2>
            <p className="text-[14px] text-[var(--muted2)] mt-2 max-w-[600px]">
              First-class directory of MCP servers cross-linked to AI tools. Filter by compatible model, auth type, and GitHub stars.
            </p>
          </div>
          <div>
            <button
              onClick={handleAccess}
              className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border2)] px-6 py-2.5 rounded-[12px] text-[13px] font-sans font-semibold text-[var(--text)] hover:border-[var(--neon)] hover:text-[var(--neon)] transition-all tracking-wide shadow-sm cursor-pointer"
            >
              🌌 View All Servers
            </button>
          </div>
        </AnimatedItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mcpServers.map((s, idx) => (
            <AnimatedItem key={idx}>
              <div 
                onClick={handleAccess}
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[20px] p-6 cursor-pointer hover:border-[var(--border2)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-card)] group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-[42px] h-[42px] rounded-xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center text-[20px]">
                      {s.icon}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold font-sans text-[var(--text)] group-hover:text-[var(--neon)] transition-colors">
                        {s.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {s.verified ? (
                          <>
                            <CheckCircle size={10} className="text-emerald-500 fill-emerald-500/10" />
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.5px]">Verified</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle size={10} className="text-amber-500" />
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.5px]">Community</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[12.5px] text-[var(--muted)] leading-[1.6] mb-5">
                    {s.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border)]">
                  {s.chips.map((chip, cIdx) => {
                    const isAccent = chip === "Claude" || chip === "GPT-4o" || chip === "Gemini";
                    return (
                      <span
                        key={cIdx}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                          isAccent
                            ? "bg-[rgba(59,130,246,0.08)] text-[var(--emerald-400)] border-[rgba(59,130,246,0.15)]"
                            : "bg-[var(--bg3)] text-[var(--muted2)] border-[var(--border)]"
                        }`}
                      >
                        {chip}
                      </span>
                    );
                  })}
                </div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
