"use client";

import React, { useEffect, useState, useRef } from "react";
import Button3D from "@/components/ui/Button3D";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Layout, Database, AppWindow } from "lucide-react";

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid motion
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to rotation angles (e.g., -10deg to 10deg)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const translateZ = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // range: -0.5 to 0.5
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleEnterHub = () => {
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    } else {
      window.dispatchEvent(new Event("openLogin"));
    }
  };

  const handleExploreTools = () => {
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-[90vh] flex items-center relative overflow-hidden px-[5%] pb-[40px] pt-[40px] select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{ perspective: 1200 }}
    >
      <div className="max-w-[1380px] mx-auto w-full relative z-[2]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  delayChildren: 0.2,
                  staggerChildren: 0.1,
                }
              }
            }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 col-span-1 relative z-20"
          >
            {/* Eyebrow */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="w-full flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 bg-background/50 border border-border px-4 py-1.5 rounded-full text-foreground text-[10px] font-semibold font-sans tracking-[1.2px] uppercase backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                Manmadhan's Hub · Platform Access
              </div>
            </motion.div>

            {/* Title */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
              <h1 className="font-sans font-extrabold text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-tight text-foreground uppercase mt-2">
                The Definitive <br />
                <span className="inline-flex flex-col items-center lg:items-start">
                  <em className="text-primary italic font-sans block mt-1">AI Tool</em>
                  <em className="text-primary italic font-sans block">Discovery</em>
                </span>
                <br />
                Universe
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
              <p className="text-[15px] md:text-[16px] text-muted-foreground max-w-[500px] leading-[1.6] font-sans mt-3">
                Discover, compare, and organize 1,200+ curated AI tools. The cleanest, most powerful intelligence layer for your daily workflow.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="w-full">
              <div className="flex flex-row items-center gap-3 mt-6 justify-center lg:justify-start w-full">
                <Button3D
                  onClick={handleEnterHub}
                  variant="primary"
                  className="font-semibold px-8 py-3.5 h-[48px]"
                >
                  Enter the Hub <span className="ml-1 opacity-70">→</span>
                </Button3D>
                <Link href="/guide" passHref>
                  <Button3D
                    variant="outline"
                    className="font-semibold px-8 py-3.5 h-[48px]"
                  >
                    Read Guide
                  </Button3D>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="w-full">
              <div className="flex gap-10 md:gap-14 flex-wrap mt-8 justify-center lg:justify-start w-full">
                {[
                  { val: "1200+", label: "Curated Tools" },
                  { val: "80", label: "Core Systems" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start">
                    <span className="font-sans font-extrabold text-[28px] md:text-[32px] text-foreground tracking-tight leading-none">
                      {stat.val}
                    </span>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-[1px] mt-1.5 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Creative 3D Tool Ecosystem */}
          <div className="hidden lg:flex relative w-full h-[600px] items-center justify-center pointer-events-none z-[1] col-span-1 perspective-[1200px]">
            <motion.div 
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
              className="relative w-[400px] h-[400px] flex items-center justify-center"
            >
              
              
              {/* Top-Down Pipeline Architecture */}
              <div className="absolute inset-0 w-full h-[450px] -translate-y-8 flex items-center justify-center pointer-events-none">
                
                {/* SVG Pipeline Connections */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 450">
                  {/* Thick Background Pipes */}
                  <g stroke="currentColor" strokeWidth="6" className="text-border/40" fill="none" strokeLinecap="round">
                    {/* Top Pipes */}
                    <path d="M 80 60 C 80 140, 200 140, 200 225" />
                    <path d="M 200 60 L 200 225" />
                    <path d="M 320 60 C 320 140, 200 140, 200 225" />

                    {/* Bottom Pipes */}
                    <path d="M 60 390 C 60 310, 200 310, 200 225" />
                    <path d="M 130 390 C 130 310, 200 310, 200 225" />
                    <path d="M 200 390 L 200 225" />
                    <path d="M 270 390 C 270 310, 200 310, 200 225" />
                    <path d="M 340 390 C 340 310, 200 310, 200 225" />
                  </g>

                  {/* Animated Data Flow Lines */}
                  <g stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" strokeLinecap="round">
                    {/* Top Flow (Center -> Up) */}
                    <motion.path d="M 80 60 C 80 140, 200 140, 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, 24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    <motion.path d="M 200 60 L 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, 24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    <motion.path d="M 320 60 C 320 140, 200 140, 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, 24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />

                    {/* Bottom Flow (Up -> Center) */}
                    <motion.path d="M 60 390 C 60 310, 200 310, 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    <motion.path d="M 130 390 C 130 310, 200 310, 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    <motion.path d="M 200 390 L 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    <motion.path d="M 270 390 C 270 310, 200 310, 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    <motion.path d="M 340 390 C 340 310, 200 310, 200 225" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                  </g>
                </svg>

                {/* --- TOP ROW: DESTINATIONS --- */}
                <div className="absolute top-[60px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-card border-b-2 border-border px-4 py-2 rounded-xl shadow-lg z-10 pointer-events-auto hover:-translate-y-1 transition-transform cursor-default" style={{ left: '80px' }}>
                  <Layout className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-bold text-foreground">Website</span>
                </div>
                <div className="absolute top-[60px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-card border-b-2 border-border px-4 py-2 rounded-xl shadow-lg z-10 pointer-events-auto hover:-translate-y-1 transition-transform cursor-default" style={{ left: '200px' }}>
                  <AppWindow className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-bold text-foreground">Application</span>
                </div>
                <div className="absolute top-[60px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-card border-b-2 border-border px-4 py-2 rounded-xl shadow-lg z-10 pointer-events-auto hover:-translate-y-1 transition-transform cursor-default" style={{ left: '320px' }}>
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-bold text-foreground">Database</span>
                </div>

                {/* --- CENTER HUB --- */}
                <div className="absolute top-[225px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] bg-background/90 backdrop-blur-xl border border-primary/30 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(var(--primary-rgb),0.25)] z-20 pointer-events-auto">
                  <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-30" />
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center p-2">
                     <div className="w-full h-full bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 relative overflow-hidden">
                       <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                         <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                         </svg>
                       </motion.div>
                     </div>
                  </div>
                </div>

                {/* --- BOTTOM ROW: AI SOURCES --- */}
                {[
                  { x: 60, domain: 'openai.com', name: 'ChatGPT' },
                  { x: 130, domain: 'anthropic.com', name: 'Anthropic' },
                  { x: 200, domain: 'midjourney.com', name: 'Midjourney' },
                  { x: 270, domain: 'google.com', name: 'Gemini' },
                  { x: 340, domain: 'cursor.com', name: 'Cursor' }
                ].map((node, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ y: [0, -4, 0] }} 
                    transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" }}
                    className="absolute bottom-[60px] -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-card border-b-2 border-border rounded-xl shadow-lg flex items-center justify-center p-2 z-10 pointer-events-auto hover:scale-110 transition-transform cursor-pointer" 
                    style={{ left: `${node.x}px` }}
                    title={node.name}
                  >
                    <img src={`https://www.google.com/s2/favicons?domain=${node.domain}&sz=128`} alt={node.name} className="w-full h-full object-contain rounded-[4px]" />
                  </motion.div>
                ))}
              </div>

              {/* Floating Decorative Elements */}
              <motion.div 
                style={{ translateZ: -20 }}
                className="absolute bottom-[10%] left-[10%] w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl"
              />
              <motion.div 
                style={{ translateZ: -40 }}
                className="absolute top-[10%] right-[20%] w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-xl"
              />

            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Cue */}
      <button
        onClick={handleExploreTools}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[10] group cursor-pointer border-none bg-transparent outline-none animate-[scb_2s_ease-in-out_infinite]"
      >
        <span className="text-[10px] text-muted-foreground tracking-[2px] uppercase font-sans font-semibold group-hover:text-primary transition-colors duration-300">
          Scroll
        </span>
        <div className="w-[16px] h-[16px] border-r-2 border-b-2 border-muted-foreground group-hover:border-primary rotate-45 transform mt-0.5 transition-colors duration-300"></div>
      </button>

      {/* Embedded CSS for custom keyframe animations */}
      <style jsx global>{`
        @keyframes scb {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(7px);
          }
        }
      `}</style>
    </section>
  );
}
