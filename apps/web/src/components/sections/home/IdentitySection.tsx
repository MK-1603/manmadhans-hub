"use client";

import React from "react";
import { AnimatedItem } from "@/components/ui/AnimatedSection";
import { Globe, Cpu, Layout, Lightbulb, ShieldCheck } from "lucide-react";

const cards = [
  { icon: <Globe size={28} />, title: "PRIVATE UNIVERSE", desc: "Invitation-only, curated access to the world's best AI tools" },
  { icon: <Cpu size={28} />, title: "AI OS PLATFORM", desc: "Futuristic AI operating platform with cinematic experience" },
  { icon: <Layout size={28} />, title: "CENTRAL HUB", desc: "One centralized AI intelligence ecosystem for all tools" },
  { icon: <Lightbulb size={28} />, title: "SMART DISCOVERY", desc: "Semantic, personalized AI navigation and recommendations" },
  { icon: <ShieldCheck size={28} />, title: "PREMIUM ACCESS", desc: "Secure, exclusive, role-gated premium environment" },
];

export default function IdentitySection() {
  return (
    <section id="identity" className="py-32 px-[5%] bg-[#050505] relative overflow-hidden border-t border-[var(--border)]">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--neon)]/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1380px] mx-auto relative z-10">
        <AnimatedItem className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[var(--neon)]" />
            <span className="text-[10px] font-black tracking-[0.2em] text-[var(--neon)] uppercase font-mono">
              Platform Identity
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[var(--neon)]" />
          </div>
          <h2 className="font-sans font-black text-[clamp(32px,4vw,48px)] leading-[1.1] mb-5 tracking-tight text-white">
            What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--muted2)]">MANMADHAN&apos;S HUB?</span>
          </h2>
          <p className="text-[16px] text-[var(--muted)] max-w-[600px] mx-auto leading-relaxed font-medium">
            One universe. Every AI tool. Pure intelligence — built for those who demand the pinnacle of technological curation.
          </p>
        </AnimatedItem>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map((card, i) => (
            <AnimatedItem key={i}>
              <div className="group bg-[#0a0a0a] border border-[var(--border)] rounded-2xl p-6 h-full transition-all duration-500 hover:border-[var(--neon)]/40 hover:bg-[#0f0f0f] relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="w-14 h-14 rounded-full bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--neon)] mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--neon-rgb),0.15)] transition-all duration-500">
                  {card.icon}
                </div>
                <h3 className="font-sans font-black text-[13px] text-white tracking-wider uppercase mb-3">
                  {card.title}
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed group-hover:text-[var(--muted2)] transition-colors duration-300">
                  {card.desc}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>
        
        <AnimatedItem className="text-center mt-20">
          <div className="inline-block px-8 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon)]/5 to-transparent pointer-events-none" />
            <p className="font-sans text-[18px] md:text-[22px] font-bold text-[var(--muted2)]">
              &quot;One universe. Every AI tool. <span className="text-[var(--neon)] italic">Pure intelligence.</span>&quot;
            </p>
          </div>
        </AnimatedItem>
      </div>
    </section>
  );
}
