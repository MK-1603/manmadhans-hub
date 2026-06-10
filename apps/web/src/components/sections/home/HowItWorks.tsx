"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedItem } from "@/components/ui/AnimatedSection";

const steps = [
  { icon: "🔐", title: "Receive Invitation", desc: "Get your exclusive invite link — assigned only to your email." },
  { icon: "⚡", title: "Setup Identity", desc: "Create your Hub Identity Code — your unique universe ID." },
  { icon: "🌌", title: "Enter the Universe", desc: "Experience the cinematic welcome. Dashboard unlocked." },
  { icon: "🚀", title: "Command AI", desc: "Search, compare, save, and chat with Manmadhan's AI." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[90px] px-[5%] bg-[var(--bg)]">
      <div className="max-w-[1380px] mx-auto">
        <AnimatedItem className="text-center mb-[56px]">
          <div className="inline-flex items-center gap-1.5 bg-[rgba(126,242,82,0.1)] border border-[var(--border2)] px-3.5 py-1.5 rounded-full text-[11.5px] font-bold text-[var(--neon)] font-sans tracking-[1.2px] uppercase mb-4">
            🔄 WORKFLOW
          </div>
          <h2 className="font-sans font-extrabold text-[clamp(28px,3.8vw,50px)] leading-[1.08] mb-3.5 tracking-tight">
            How the <em>Universe Works</em>
          </h2>
          <p className="text-[15.5px] text-[var(--muted)] max-w-[560px] mx-auto leading-[1.75]">
            From invitation to AI intelligence — in 4 cinematic steps.
          </p>
        </AnimatedItem>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-0 max-w-[1180px] mx-auto">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[51px] left-[12.5%] right-[12.5%] h-0.5 bg-[var(--border)] z-0">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: "100%" }}
               viewport={{ once: false }}
               transition={{ duration: 1.6, delay: 0.2 }}
               className="h-full bg-gradient-to-r from-[var(--neon)] to-[var(--emerald)]"
             />
          </div>

          {steps.map((step, i) => (
            <AnimatedItem key={i}>
              <div className="flex flex-col items-center text-center px-3.5 relative z-[1] group cursor-pointer">
                <div className="relative mb-[18px]">
                  <div className="w-[102px] h-[102px] rounded-full border-[1.5px] border-[var(--border2)] bg-[var(--step-bg)] backdrop-blur-[8px] flex items-center justify-center text-[34px] transition-all duration-500 shadow-[var(--shadow-card)] group-hover:border-[var(--neon)] group-hover:shadow-[0_0_28px_rgba(126,242,82,0.22),var(--shadow-card)]">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1.25 -right-1.25 w-6 h-6 bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] rounded-full text-[10.5px] font-extrabold text-white dark:text-[#060806] flex items-center justify-center font-sans">
                    0{i + 1}
                  </div>
                </div>
                <div className="font-sans font-bold text-[15.5px] text-[var(--text)] mb-[7px]">{step.title}</div>
                <p className="text-[13px] text-[var(--muted)] leading-[1.65] max-w-[175px]">{step.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
