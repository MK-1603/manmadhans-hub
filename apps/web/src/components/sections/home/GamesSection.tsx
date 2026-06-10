"use client";

import React, { useState, useEffect } from "react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";
import { Play } from "lucide-react";

const games = [
  {
    icon: "🐍",
    name: "Neural Snake",
    type: "Classic · Canvas",
    bestScore: "Best: 2,840",
  },
  {
    icon: "🏃",
    name: "Void Runner",
    type: "Endless · Runner",
    bestScore: "Best: 18,200",
  },
  {
    icon: "🧠",
    name: "Memory Match",
    type: "Tool Logos · Cards",
    bestScore: "Best: 24 pairs",
  },
  {
    icon: "🔐",
    name: "Code Breaker",
    type: "Cipher · Daily",
    bestScore: "Daily puzzle",
  },
  {
    icon: "🔤",
    name: "Word Scramble",
    type: "AI Terms · 60s",
    bestScore: "Best: 14 words",
  },
  {
    icon: "❓",
    name: "Tool Trivia",
    type: "Quiz · Daily",
    bestScore: "Best: 9/10",
  },
];

export default function GamesSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);
  }, []);

  const handlePlayGame = () => {
    if (isLoggedIn) {
      localStorage.setItem("dashboard_active_tab", "games");
      window.location.href = "/dashboard#games";
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  return (
    <section id="games" className="py-[90px] px-[5%] bg-transparent relative z-[2]">
      <div className="max-w-[1380px] mx-auto">
        <AnimatedItem className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--neon)] font-sans tracking-[2px] uppercase mb-2">
            🎮 ARCADE_LAYER
          </div>
          <h2 className="font-sans font-extrabold text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-tight text-[var(--text)]">
            Hub <em>Games Universe</em>
          </h2>
          <p className="text-[14px] text-[var(--muted2)] mt-2 max-w-[600px]">
            6 hub-exclusive casual games, all offline-first. No leaderboard stress — just for time pass.
          </p>
        </AnimatedItem>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {games.map((g, idx) => (
            <AnimatedItem key={idx}>
              <div 
                onClick={handlePlayGame}
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[18px] p-5 text-center cursor-pointer hover:border-[var(--border2)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-card)] group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="text-[32px] md:text-[36px] mb-3 group-hover:scale-110 transition-transform duration-300">
                    {g.icon}
                  </div>
                  <h4 className="font-sans font-bold text-[13px] text-[var(--text)] tracking-wide mb-[3px]">
                    {g.name}
                  </h4>
                  <p className="text-[10px] text-[var(--muted2)] mb-[5px] font-sans">
                    {g.type}
                  </p>
                  <p className="text-[10.5px] font-semibold text-[var(--neon)] font-sans uppercase tracking-[0.5px]">
                    {g.bestScore}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayGame();
                  }}
                  className="w-full mt-4 py-1.5 md:py-2 rounded-full bg-[var(--card-bg)] group-hover:bg-[rgba(var(--particle-rgb),0.12)] border border-[var(--border)] group-hover:border-[var(--border2)] text-[11px] font-sans font-bold text-[var(--text)] group-hover:text-[var(--neon)] uppercase tracking-wider cursor-pointer transition-colors duration-250 flex items-center justify-center gap-1"
                >
                  <Play size={10} className="fill-current" /> Play
                </button>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
