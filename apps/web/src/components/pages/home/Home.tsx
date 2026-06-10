'use client';

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/home/Hero";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield, Sparkles, Terminal, Activity, ArrowUpRight,
  ChevronDown, Star, Clock, Info, Gamepad2,
  ImageIcon, Volume2, Compass, Video, Layout, ArrowUp, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import Button3D from '@/components/ui/button-3d';
import ThemeToggle from '@/components/ui/theme-toggle';
import Background3D from '@/components/ui/background-3d';
import PremiumCard from '@/components/ui/premium-card';
import LoginModal from '@/components/auth/LoginModal';
import { div } from "framer-motion/client";


// --- DATA SCHEMA & DECKS ---

const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  category: z.string(),
  rating: z.number().min(0).max(5),
  pricing: z.enum(['Free', 'Paid', 'Freemium']),
  status: z.string(),
  emoji: z.string(),
  metrics: z.object({
    Speed: z.number().min(0).max(100),
    Quality: z.number().min(0).max(100),
    Ease: z.number().min(0).max(100),
    Cost: z.number().min(0).max(100)
  })
});

const ALL_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT Enterprise', desc: 'Advanced AI by OpenAI with custom instructions, reasoning, and enterprise security.', category: 'Writing', rating: 4.9, pricing: 'Paid', status: 'Active', emoji: '🤖', metrics: { Speed: 95, Quality: 92, Ease: 96, Cost: 85 } },
  { id: 'midjourney', name: 'Midjourney v7', desc: 'State-of-the-art AI image generation with stunning photorealistic and artistic outputs.', category: 'Image Gen', rating: 4.8, pricing: 'Paid', status: 'Active', emoji: '🎨', metrics: { Speed: 85, Quality: 96, Ease: 90, Cost: 80 } },
  { id: 'copilot', name: 'GitHub Copilot', desc: 'AI pair programmer with real-time completions, chat, and multi-file edits in your IDE.', category: 'Code', rating: 4.7, pricing: 'Freemium', status: 'Active', emoji: '💻', metrics: { Speed: 92, Quality: 90, Ease: 94, Cost: 88 } },
  { id: 'elevenlabs', name: 'ElevenLabs', desc: 'Ultra-realistic voice cloning and TTS across 29 languages with emotional control.', category: 'Audio AI', rating: 4.9, pricing: 'Freemium', status: 'Active', emoji: '🔊', metrics: { Speed: 90, Quality: 95, Ease: 92, Cost: 82 } },
  { id: 'perplexity', name: 'Perplexity AI', desc: 'AI-powered search with real-time web results, cited sources, and follow-up questions.', category: 'Research', rating: 4.6, pricing: 'Free', status: 'Active', emoji: '🔍', metrics: { Speed: 96, Quality: 90, Ease: 95, Cost: 95 } },
  { id: 'runway', name: 'Runway Gen-4', desc: 'Professional AI video generation with motion brush and cinematic quality output.', category: 'Video AI', rating: 4.8, pricing: 'Paid', status: 'Active', emoji: '🎬', metrics: { Speed: 80, Quality: 94, Ease: 88, Cost: 78 } },
  { id: 'claude', name: 'Claude 3.7 Sonnet', desc: "Anthropic's hybrid reasoning model featuring progressive thinking tokens.", category: 'Code', rating: 4.9, pricing: 'Freemium', status: 'Active', emoji: '🧠', metrics: { Speed: 88, Quality: 96, Ease: 92, Cost: 85 } },
  { id: 'sora', name: 'Sora Video v2', desc: 'Next-gen physics-simulated video engine with temporal consistency and cinematic lenses.', category: 'Video AI', rating: 4.7, pricing: 'Paid', status: 'Active', emoji: '🎥', metrics: { Speed: 70, Quality: 98, Ease: 85, Cost: 70 } },
  { id: 'v0', name: 'v0 by Vercel', desc: 'Generative UI system composing high-fidelity React components and styles from text.', category: 'UI Gen', rating: 4.8, pricing: 'Free', status: 'Active', emoji: '🧱', metrics: { Speed: 92, Quality: 92, Ease: 94, Cost: 90 } },
  { id: 'cursor', name: 'Cursor Compose', desc: 'Multi-file codebase editor engine facilitating conversational file edits.', category: 'Code', rating: 4.9, pricing: 'Freemium', status: 'Active', emoji: '⚡', metrics: { Speed: 94, Quality: 95, Ease: 93, Cost: 88 } },
  { id: 'stable-diffusion', name: 'Stable Diffusion 3', desc: 'Open-weights text-to-image model with high text rendering fidelity and detail.', category: 'Image Gen', rating: 4.6, pricing: 'Free', status: 'Active', emoji: '🖼️', metrics: { Speed: 85, Quality: 90, Ease: 80, Cost: 98 } },
  { id: 'deepseek', name: 'DeepSeek R1', desc: 'Open-weights reasoning model with high performance in math, code, and reasoning.', category: 'Research', rating: 4.9, pricing: 'Free', status: 'Active', emoji: '🔬', metrics: { Speed: 85, Quality: 94, Ease: 90, Cost: 99 } }
];

const VALIDATED_TOOLS = z.array(ToolSchema).parse(ALL_TOOLS);

// --- brand svg logos and category icons ---

function ToolLogo({ id, className }: { id: string; className?: string }) {
  const baseClasses = cn("shrink-0 transition-transform duration-200 hover:scale-105 object-contain", className);
  
  const getDomain = () => {
    switch(id) {
      case 'chatgpt': return 'openai.com';
      case 'claude': return 'anthropic.com';
      case 'midjourney': return 'midjourney.com';
      case 'copilot': return 'github.com';
      case 'elevenlabs': return 'elevenlabs.io';
      case 'perplexity': return 'perplexity.ai';
      case 'runway': return 'runwayml.com';
      case 'sora': return 'openai.com';
      case 'v0': return 'v0.dev';
      case 'cursor': return 'cursor.com';
      case 'stable-diffusion': return 'stability.ai';
      case 'deepseek': return 'deepseek.com';
      default: return null;
    }
  };

  const domain = getDomain();
  
  if (domain) {
    return (
      <img 
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
        alt={`${id} logo`}
        className={baseClasses}
        onError={(e) => {
          // Fallback if image fails to load
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={cn("w-full h-full rounded-[4px] bg-accent/20 flex items-center justify-center text-[10px] font-bold text-primary", className)}>
      {id.slice(0, 2).toUpperCase()}
    </div>
  );
}

function getCategoryIcon(category: string, className?: string) {
  switch (category) {
    case 'Writing':
      return <Sparkles className={className} />;
    case 'Image Gen':
      return <ImageIcon className={className} />;
    case 'Code':
      return <Terminal className={className} />;
    case 'Audio AI':
      return <Volume2 className={className} />;
    case 'Research':
      return <Compass className={className} />;
    case 'Video AI':
      return <Video className={className} />;
    case 'UI Gen':
      return <Layout className={className} />;
    case 'All':
    default:
      return <Compass className={className} />;
  }
}

const LandingToolCard = ({ tool, index }: { tool: any, index?: number }) => {
  const upvotes = 175 - ((index || 0) * 12);
  const rank = (index || 0) + 1;

  return (
    <TiltCard className="dark:bg-[#13151A] bg-white dark:border-[rgba(255,255,255,0.05)] border-gray-200 rounded-[24px] p-6 sm:p-8 relative flex flex-col justify-between min-h-[340px] h-full transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group overflow-hidden">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E5D7A1]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Indicators */}
      <div className="w-full flex justify-between items-start mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-[#E5D7A1] text-[#2A2B20] font-extrabold flex items-center justify-center text-[14px] shadow-[0_0_20px_rgba(229,215,161,0.5)]">
          {rank}
        </div>
        <div className="w-8 h-8 rounded-full dark:border-[rgba(255,255,255,0.1)] border-gray-200 flex items-center justify-center dark:text-[rgba(255,255,255,0.4)] text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer dark:bg-black/20 bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
      </div>

      {/* Center Icon & Title */}
      <div className="flex flex-col items-center flex-1 justify-center mb-6 relative z-10">
        <div className="w-[72px] h-[72px] rounded-[20px] dark:bg-[#1E2028] bg-gray-100 border dark:border-white/10 border-gray-200 flex items-center justify-center text-[36px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.3)] mb-4 p-3.5 relative transition-colors duration-300">
          {tool.id ? <ToolLogo id={tool.id} className="w-full h-full" /> : tool.emoji}
        </div>
        <h4 className="font-sans font-extrabold text-[20px] sm:text-[22px] dark:text-white text-gray-900 tracking-tight mb-2 text-center transition-colors">
          {tool.name}
        </h4>
        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-[#C88B46] text-[15px]">★</span>
          ))}
        </div>
        <p className="text-[14px] sm:text-[15px] dark:text-[rgba(255,255,255,0.7)] text-gray-600 text-center leading-[1.6] px-2 line-clamp-3 italic">
          « {tool.desc} »
        </p>
      </div>

      {/* Tags Pills */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-6 relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:border-[rgba(255,255,255,0.1)] border-gray-200 dark:bg-[rgba(255,255,255,0.03)] bg-gray-50 text-[10px] sm:text-[11px] font-bold tracking-wider dark:text-white text-gray-800 uppercase backdrop-blur-sm">
          <span className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", tool.pricing === 'Free' ? 'bg-[#10b981] text-[#10b981]' : tool.pricing === 'Paid' ? 'bg-[#ef4444] text-[#ef4444]' : 'bg-[#f59e0b] text-[#f59e0b]')}></span>
          {tool.pricing}
        </div>
        <div className="flex items-center px-3 py-1.5 rounded-full dark:border-[rgba(255,255,255,0.1)] border-gray-200 dark:bg-[rgba(255,255,255,0.03)] bg-gray-50 text-[10px] sm:text-[11px] font-bold tracking-wider dark:text-[rgba(255,255,255,0.8)] text-gray-600 uppercase backdrop-blur-sm">
          # {tool.category_name || tool.category || 'AI AGENTS'}
        </div>
        <div className="flex items-center px-2.5 py-1.5 rounded-full dark:border-[rgba(255,255,255,0.1)] border-gray-200 dark:bg-[rgba(255,255,255,0.03)] bg-gray-50 text-[10px] sm:text-[11px] font-bold tracking-wider dark:text-[rgba(255,255,255,0.8)] text-gray-600 backdrop-blur-sm">
          +1
        </div>
      </div>

      <div className="w-full h-[1px] dark:bg-[rgba(255,255,255,0.1)] bg-gray-200 mb-5 relative z-10" />

      {/* Footer */}
      <div className="w-full flex justify-between items-center relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:border-[rgba(255,255,255,0.1)] border-gray-200 dark:bg-[rgba(255,255,255,0.03)] bg-gray-50 text-[12px] font-bold dark:text-white text-gray-800 dark:hover:bg-[rgba(255,255,255,0.1)] hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-[12px] opacity-70">^</span> {upvotes}
        </div>
        <button
          onClick={() => window.dispatchEvent(new Event("openLogin"))}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] dark:bg-[#141519] bg-white dark:border-[rgba(255,255,255,0.05)] border-gray-200 dark:text-[#E5D7A1] text-[#C88B46] text-[12px] font-bold tracking-wider uppercase dark:hover:bg-[#1A1C23] hover:bg-gray-50 dark:hover:border-[#E5D7A1]/30 transition-all cursor-pointer shadow-sm group-hover:shadow-[0_0_15px_rgba(229,215,161,0.15)]"
        >
          VISIT <span className="text-[14px] group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </TiltCard>
  );
};

function HeroRightSide() {
  return (
    <div className="relative w-full h-[300px] xs:h-[350px] sm:h-[400px] lg:h-[450px] flex items-center justify-center overflow-visible select-none">

      {/* Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[200px] h-[200px] xs:w-[250px] xs:h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[350px] lg:h-[350px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Orb Container */}
      <div className="relative w-[230px] h-[230px] xs:w-[260px] xs:h-[260px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] flex items-center justify-center">

        {/* Outer Spinning Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-primary/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15px] xs:inset-[20px] rounded-full border-2 border-dashed border-primary/30"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[30px] xs:inset-[40px] rounded-full border border-primary/40"
        />

        {/* Central Core */}
        <div className="relative w-[110px] h-[110px] xs:w-[130px] xs:h-[130px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-primary/30" />
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[8px] xs:inset-[10px] rounded-full bg-gradient-to-tr from-accent/30 to-transparent"
          />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Terminal className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
            <span className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] font-mono text-primary tracking-widest">MM1107</span>
          </div>
        </div>

        {/* Orbiting Nodes */}
        {[
          { icon: <Shield className="w-3.5 h-3.5 sm:w-4 h-4" />, color: "#8DFB5B", delay: 0 },
          { icon: <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4" />, color: "#38BDF8", delay: 2 },
          { icon: <Terminal className="w-3.5 h-3.5 sm:w-4 h-4" />, color: "#F59E0B", delay: 4 },
          { icon: <Activity className="w-3.5 h-3.5 sm:w-4 h-4" />, color: "#EC4899", delay: 6 },
        ].map((node, i) => (
          <motion.div
            key={i}
            className="absolute [--orbit-radius:-100px] xs:[--orbit-radius:-115px] sm:[--orbit-radius:-125px] lg:[--orbit-radius:-140px]"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: node.delay,
            }}
            style={{ transformOrigin: "center center" }}
          >
            <motion.div
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-bg-secondary border border-border-strong shadow-lg"
              style={{
                transform: `rotate(${i * 90}deg) translateY(var(--orbit-radius)) rotate(${-i * 90}deg)`,
                borderColor: node.color,
                boxShadow: `0 0 15px ${node.color}40`
              }}
            >
              <div style={{ color: node.color }}>{node.icon}</div>
            </motion.div>
          </motion.div>
        ))}

      </div>

      {/* Floating Data Cards */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-1 xs:right-4 bg-bg-secondary/80 border border-border-strong rounded-xl p-2 xs:p-3 backdrop-blur-md scale-80 xs:scale-90 sm:scale-100 origin-right"
      >
        <div className="text-[8px] xs:text-[9px] font-mono text-text-muted uppercase tracking-wider">Live Index</div>
        <div className="text-sm xs:text-xl font-bold text-primary mt-0.5 xs:mt-1">1,200+</div>
        <div className="text-[8px] xs:text-[10px] text-text-muted mt-0.5">Tools Online</div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-4 left-1 xs:left-4 bg-bg-secondary/80 border border-border-strong rounded-xl p-2 xs:p-3 backdrop-blur-md scale-80 xs:scale-90 sm:scale-100 origin-left"
      >
        <div className="text-[8px] xs:text-[9px] font-mono text-text-muted uppercase tracking-wider">System Health</div>
        <div className="flex items-center gap-1 mt-0.5 xs:mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] xs:text-[12px] font-semibold text-text-primary">100% Active</span>
        </div>
      </motion.div>

    </div>
  );
}

// --- SUB-COMPONENTS ---

// Dynamic Count-Up animation component for Hero Stats
function CountUpNumber({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const numericValue = parseInt(value.replace(/[^0-9.]/g, ''), 10);
  const isPercent = value.includes('%');
  const isStar = value.includes('★');
  const isPlus = value.includes('+');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun) {
        setHasRun(true);
        let startTimestamp: number | null = null;
        const duration = 1500; // 1.5s

        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(easeProgress * numericValue);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [numericValue, hasRun]);

  let displayValue = count.toFixed(0);
  if (isPercent) displayValue += '%';
  if (isPlus) displayValue += '+';
  if (isStar) displayValue += '★';

  return <div ref={containerRef}>{displayValue}</div>;
}

// 3D Card Hover component using mouse coordinates (with touch checks)
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: `perspective(700px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(6px)`,
        transition: 'transform 0.1s ease-out, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {children}
    </div>
  );
}

// Active dynamic deal row timer countdown
function DealTimer({ initialHours, initialMinutes }: { initialHours: number; initialMinutes: number }) {
  const [time, setTime] = useState({ hours: initialHours, minutes: initialMinutes });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let h = prev.hours;
        let m = prev.minutes - 1;
        if (m < 0) {
          m = 59;
          h = Math.max(0, h - 1);
        }
        return { hours: h, minutes: m };
      });
    }, 60000); // decrement every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <span>⏱ {time.hours}h {time.minutes}m left</span>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.215, 0.61, 0.355, 1] as const }
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    }
  }
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1.0] as const }
  }
};

function ConnectionMapGraphic() {
  const satellites = [
    { id: 'chatgpt', name: 'ChatGPT', x: 60, y: 50, color: '#8DFB5B' },
    { id: 'claude', name: 'Claude', x: 240, y: 50, color: '#F59E0B' },
    { id: 'midjourney', name: 'Midjourney', x: 50, y: 230, color: '#38BDF8' },
    { id: 'v0', name: 'v0', x: 250, y: 230, color: '#F0F0F0' },
    { id: 'elevenlabs', name: 'ElevenLabs', x: 150, y: 280, color: '#EC4899' },
  ];

  return (
    <div className="relative w-full max-w-[400px] h-[280px] xs:h-[320px] sm:h-[350px] mx-auto flex items-center justify-center bg-card shadow-lg border border-border-default rounded-[20px] overflow-hidden p-4 xs:p-6 backdrop-blur-[4px]">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(141,251,91,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(141,251,91,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Canvas */}
      <svg className="w-full h-full relative z-10 max-h-[300px]" viewBox="0 0 300 300" fill="none">
        {/* Animated Connection Lines */}
        {satellites.map((sat) => (
          <g key={sat.id}>
            {/* Base line */}
            <line x1="150" y1="150" x2={sat.x} y2={sat.y} stroke="currentColor" className="text-border-default" strokeWidth="1" />
            {/* Animated pulsing path */}
            <motion.path
              d={`M 150 150 L ${sat.x} ${sat.y}`}
              stroke={sat.color}
              strokeWidth="1.5"
              strokeDasharray="4, 12"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 2 }}
            />
          </g>
        ))}

        {/* Central Hub Core */}
        <motion.g
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <circle cx="150" cy="150" r="32" className="fill-white dark:fill-[#0A0A0F] stroke-[#111827] dark:stroke-[#8DFB5B] shadow-[0_0_20px_rgba(141,251,91,0.3)]" strokeWidth="2.5" />
          <circle cx="150" cy="150" r="26" className="fill-[#111827]/5 dark:fill-[#8DFB5B]/10" />
          <text x="150" y="154" textAnchor="middle" className="fill-[#111827] dark:fill-[#8DFB5B]" fontSize="11" fontWeight="bold" fontFamily="monospace" letterSpacing="1">HUB</text>
        </motion.g>

        {/* Satellites */}
        {satellites.map((sat) => (
          <motion.g
            key={sat.id}
            initial={{ y: 0 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: "easeInOut", delay: Math.random() * 2 }}
          >
            {/* Satellite node circle */}
            <circle cx={sat.x} cy={sat.y} r="18" className="fill-white dark:fill-[#12121A]" stroke={sat.color} strokeWidth="1.5" />

            {/* Brand SVG wrapper */}
            <foreignObject x={sat.x - 9} y={sat.y - 9} width="18" height="18">
              <ToolLogo id={sat.id} className="w-full h-full text-text-primary rounded-full overflow-hidden" />
            </foreignObject>
          </motion.g>
        ))}
      </svg>

      {/* Floating diagnostics HUD label */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[8px] text-text-muted select-none">
        <span>MATRIX_SYNC: ONLINE</span>
        <span className="text-primary animate-pulse">● SYSTEM_NODE</span>
      </div>
    </div>
  );
}

export default function HomeContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toolAId, setToolAId] = useState('chatgpt');
  const [toolBId, setToolBId] = useState('claude');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; username: string; role: 'admin' | 'user' } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Open login modal event listener
    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener('openLogin', handleOpenLogin);

    // PWA Launch check & Session check
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isSessionActive = sessionStorage.getItem("session_active") === "true";
    const isLocalSessionActive = localStorage.getItem("session_active_flag") === "true";
    const hasToken = !!localStorage.getItem("session_token");

    if (hasToken || isLocalSessionActive) {
      window.location.replace('/dashboard');
      return;
    }

    if (isStandalone && !isSessionActive && !isLocalSessionActive && !hasToken) {
      // Small timeout to allow preloader to finish its exit animation
      setTimeout(() => setIsLoginOpen(true), 2500);
    } else if (isStandalone && (isLocalSessionActive || hasToken) && !isSessionActive) {
      sessionStorage.setItem("session_active", "true");
    }

    return () => window.removeEventListener('openLogin', handleOpenLogin);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredTools = VALIDATED_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-transparent text-text-primary selection:bg-accent/30 selection:text-white transition-colors duration-300">

      {/* Three.js Hardware-Accelerated 3D Background */}
      <Background3D />

      <Navbar />

      {/* Floating Overlay Content wrap */}
      <div
        className="relative z-10 w-full flex flex-col gap-16 md:gap-24"
        style={{ paddingTop: "calc(64px + env(safe-area-inset-top))" }}
      >

        <Hero />

        {/* Below-the-fold content container */}
        <div className="bg-transparent w-full flex flex-col gap-20">

          {/* Subtle line glow separator */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />

          {/* SECTION 2.5 — WHAT IS MANMADHAN'S HUB */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual description */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary font-mono">Platform Genesis</div>
                  <h2 className="text-[30px] sm:text-[36px] font-extrabold tracking-[-0.02em] text-text-primary uppercase leading-tight">
                    What is Manmadhan's Hub?
                  </h2>
                </div>
                <p className="text-[14px] text-text-secondary leading-[1.75]">
                  Manmadhan's Hub is a <strong>private, invitation-only AI tool discovery universe</strong>. It serves as the definitive centralized intelligence layer for discovering, organizing, comparing, and managing the world's AI tools.
                </p>
                <p className="text-[14px] text-text-secondary leading-[1.75]">
                  Unlike public catalogs, every tool in the Hub is verified for performance, uptime, and pricing history. We run automated telemetry checks every six hours to make sure your workstation is connected only to active intelligence nodes.
                </p>

                {/* 3 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
                  <div className="p-4 rounded-[12px] bg-card shadow-sm border border-border-default">
                    <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1 font-mono">🔐 Private Node</div>
                    <p className="text-[11px] text-text-muted leading-relaxed">Invitation-only access, secure logins, and audit-logged operations.</p>
                  </div>
                  <div className="p-4 rounded-[12px] bg-card shadow-sm border border-border-default">
                    <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1 font-mono">📊 Telemetry</div>
                    <p className="text-[11px] text-text-muted leading-relaxed">Uptime, model versions, price histories, and health logs.</p>
                  </div>
                  <div className="p-4 rounded-[12px] bg-card shadow-sm border border-border-default">
                    <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1 font-mono">💼 Workspaces</div>
                    <p className="text-[11px] text-text-muted leading-relaxed">Build personal workflows, bookmarked stacks, and comparative tables.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Connection Map Graphic */}
              <div className="lg:col-span-5 flex items-center justify-center w-full">
                <ConnectionMapGraphic />
              </div>
            </div>
          </motion.section>

          {/* Subtle line glow separator */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />


          {/* Subtle line glow separator */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />

          {/* INTERACTIVE COMPARISON STATION */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16"
          >
            <div className="space-y-2 mb-8 text-center md:text-left">
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary">Analytical Deck</div>
              <h2 className="text-[30px] font-bold tracking-[-0.02em] text-text-primary uppercase">Compare Station</h2>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                Conduct side-by-side performance checks. Evaluate model speeds, accuracy margins, and integration efficiency.
              </p>
            </div>

            <div className="bg-card shadow-lg border border-border-default rounded-[20px] overflow-hidden p-5 sm:p-8 backdrop-blur-xl">

              {/* Dropdown pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Tool Selector A */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Select Tool Alpha</label>
                  <div className="relative">
                    <select
                      value={toolAId}
                      onChange={(e) => setToolAId(e.target.value)}
                      className="w-full bg-bg-primary border border-border-strong rounded-[10px] py-3 px-4 text-[13px] text-text-primary font-mono outline-none appearance-none cursor-pointer focus:border-primary"
                    >
                      {VALIDATED_TOOLS.map((t) => (
                        <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>

                {/* Tool Selector B */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Select Tool Beta</label>
                  <div className="relative">
                    <select
                      value={toolBId}
                      onChange={(e) => setToolBId(e.target.value)}
                      className="w-full bg-bg-primary border border-border-strong rounded-[10px] py-3 px-4 text-[13px] text-text-primary font-mono outline-none appearance-none cursor-pointer focus:border-primary"
                    >
                      {VALIDATED_TOOLS.map((t) => (
                        <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Cards */}
              {(() => {
                const toolA = VALIDATED_TOOLS.find(t => t.id === toolAId) || VALIDATED_TOOLS[0];
                const toolB = VALIDATED_TOOLS.find(t => t.id === toolBId) || VALIDATED_TOOLS[1];

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                      {/* Tool A details */}
                      <div className="bg-bg-primary/50 border border-border-default rounded-[14px] p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[8px] bg-bg-tertiary flex items-center justify-center border border-border-subtle shrink-0 p-2">
                            <ToolLogo id={toolA.id} className="w-full h-full" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-text-primary">{toolA.name}</h3>
                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full tracking-wider uppercase">{toolA.category}</span>
                          </div>
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">{toolA.desc}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border-subtle/50">
                          <div><span className="text-text-muted">Pricing:</span> <span className="text-text-primary font-semibold">{toolA.pricing}</span></div>
                          <div><span className="text-text-muted">Uptime:</span> <span className="text-success font-semibold">99.9%</span></div>
                          <div><span className="text-text-muted">Rating:</span> <span className="text-warning font-semibold">{toolA.rating} ★</span></div>
                          <div><span className="text-text-muted">Index Node:</span> <span className="text-text-primary font-mono font-semibold">Active</span></div>
                        </div>
                      </div>

                      {/* Tool B details */}
                      <div className="bg-bg-primary/50 border border-border-default rounded-[14px] p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[8px] bg-bg-tertiary flex items-center justify-center border border-border-subtle shrink-0 p-2">
                            <ToolLogo id={toolB.id} className="w-full h-full" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-text-primary">{toolB.name}</h3>
                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full tracking-wider uppercase">{toolB.category}</span>
                          </div>
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">{toolB.desc}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border-subtle/50">
                          <div><span className="text-text-muted">Pricing:</span> <span className="text-text-primary font-semibold">{toolB.pricing}</span></div>
                          <div><span className="text-text-muted">Uptime:</span> <span className="text-success font-semibold">99.9%</span></div>
                          <div><span className="text-text-muted">Rating:</span> <span className="text-warning font-semibold">{toolB.rating} ★</span></div>
                          <div><span className="text-text-muted">Index Node:</span> <span className="text-text-primary font-mono font-semibold">Active</span></div>
                        </div>
                      </div>

                    </div>

                    {/* Metric Comparison Charts */}
                    <div className="bg-bg-primary/30 border border-border-subtle rounded-[14px] p-4 sm:p-6 space-y-4">
                      <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-2">System Telemetry Comparison</h4>

                      {[
                        { label: 'Compute Speed', key: 'Speed' as const },
                        { label: 'Output Accuracy', key: 'Quality' as const },
                        { label: 'Ease of Integration', key: 'Ease' as const },
                        { label: 'Cost-Efficiency', key: 'Cost' as const },
                      ].map((metric) => {
                        const valA = toolA.metrics[metric.key];
                        const valB = toolB.metrics[metric.key];

                        return (
                          <div key={metric.label} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-semibold text-text-secondary">
                              <span>{metric.label}</span>
                              <span className="font-mono text-[10px]">
                                <span className="text-primary">{valA}%</span> vs <span className="text-[#38BDF8]">{valB}%</span>
                              </span>
                            </div>

                            {/* Bar visualization */}
                            <div className="h-2 w-full bg-bg-tertiary rounded-full overflow-hidden flex">
                              <div
                                className="bg-accent h-full transition-all duration-500 ease-out"
                                style={{ width: `${(valA / (valA + valB)) * 100}%` }}
                              />
                              <div
                                className="bg-[#38BDF8] h-full transition-all duration-500 ease-out"
                                style={{ width: `${(valB / (valA + valB)) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] font-mono text-text-muted uppercase">
                              <span>{toolA.name}</span>
                              <span>{toolB.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>
          </motion.section>

          {/* Subtle line glow separator */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />


          {/* SECTION 4 — MCP DIRECTORY (Scroll Reveal) */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16"
          >
            <div className="space-y-2 mb-8 text-center md:text-left">
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary">MCP Servers</div>
              <h2 className="text-[30px] font-bold tracking-[-0.02em] text-text-primary uppercase">First-Class MCP Directory</h2>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                Model Context Protocol servers cross-linked to AI tools. Filter by compatible model, auth type, and GitHub stars.
              </p>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >

              {/* MCP 1 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-[8px] bg-bg-tertiary border border-border-subtle flex items-center justify-center p-1.5 shrink-0">
                      <img src="https://www.google.com/s2/favicons?domain=notion.so&sz=128" alt="Notion" className="w-full h-full object-contain rounded-[4px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-text-primary">Notion MCP</div>
                      <div className="text-[9px] text-success font-bold">✅ Verified</div>
                    </div>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-[1.6] mb-3">
                    Connects to Notion databases, pages, blocks, and workspaces. Full read/write access with rich content support.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-bg text-info border border-info/10">Claude</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-bg text-info border border-info/10">GPT-4o</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">OAuth</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">productivity</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">⭐ 2.4k</span>
                  </div>
                </div>
              </motion.div>

              {/* MCP 2 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-[8px] bg-bg-tertiary border border-border-subtle flex items-center justify-center p-1.5 shrink-0">
                      <img src="https://www.google.com/s2/favicons?domain=postgresql.org&sz=128" alt="Postgres" className="w-full h-full object-contain rounded-[4px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-text-primary">Postgres MCP</div>
                      <div className="text-[9px] text-success font-bold">✅ Verified</div>
                    </div>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-[1.6] mb-3">
                    Direct PostgreSQL query execution, schema introspection, and migration management from any AI model.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-bg text-info border border-info/10">Claude</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-bg text-info border border-info/10">Gemini</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">API Key</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">databases</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">⭐ 1.8k</span>
                  </div>
                </div>
              </motion.div>

              {/* MCP 3 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-[8px] bg-bg-tertiary border border-border-subtle flex items-center justify-center p-1.5 shrink-0">
                      <img src="https://www.google.com/s2/favicons?domain=search.brave.com&sz=128" alt="Brave" className="w-full h-full object-contain rounded-[4px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-text-primary">Brave Search MCP</div>
                      <div className="text-[9px] text-warning font-bold">🌱 Community</div>
                    </div>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-[1.6] mb-3">
                    Real-time web search via Brave's private and independent search index with clean result formatting.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-bg text-info border border-info/10">Claude</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-bg text-info border border-info/10">GPT-4o</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">API Key</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">search</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary border border-border-subtle">⭐ 3.1k</span>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.section>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />

          {/* SECTION 5 — LIVE DEALS (Scroll Reveal) */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16"
          >
            <div className="space-y-2 mb-8 text-center md:text-left">
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary">Live Deals</div>
              <h2 className="text-[30px] font-bold tracking-[-0.02em] text-text-primary uppercase">AI Tool Deals & Discounts</h2>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                Bookmark a tool — get notified the instant a deal goes live. Countdowns are live.
              </p>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.05 }}
              className="flex flex-col gap-3.5"
            >

              {/* Deal 1 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-primary rounded-[16px] p-4 sm:p-5 sm:px-6 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 hover:shadow-accent/10 cursor-pointer">
                  <div className="w-11 h-11 rounded-[10px] bg-bg-tertiary flex items-center justify-center shrink-0 p-2">
                    <ToolLogo id="claude" className="w-full h-full" />
                  </div>
                  <div className="flex-grow text-center sm:text-left w-full">
                    <div className="text-[14px] font-bold text-text-primary">Claude Pro — Annual Plan</div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-bold tracking-wide mt-1.5">
                      <span className="text-warning bg-warning-bg px-2 py-0.5 rounded-full">
                        <DealTimer initialHours={62} initialMinutes={33} />
                      </span>
                      <span className="text-text-muted">Ends Jun 1, 2026</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <div className="text-[11px] text-text-muted line-through">$240/yr</div>
                    <div className="text-[22px] font-extrabold text-primary">$168</div>
                    <div className="text-[9px] font-bold text-error bg-error-bg px-2 py-0.5 rounded-full inline-block mt-0.5">30% OFF</div>
                  </div>
                  <button className="px-5 py-2.5 rounded-[10px] bg-accent hover:bg-accent-hover text-text-inverse font-sans font-bold text-[12px] border-none cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 select-none shrink-0 w-full sm:w-auto">
                    Get Deal ↗
                  </button>
                </div>
              </motion.div>

              {/* Deal 2 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-primary rounded-[16px] p-4 sm:p-5 sm:px-6 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 hover:shadow-accent/10 cursor-pointer">
                  <div className="w-11 h-11 rounded-[10px] bg-bg-tertiary flex items-center justify-center shrink-0 p-2">
                    <ToolLogo id="midjourney" className="w-full h-full" />
                  </div>
                  <div className="flex-grow text-center sm:text-left w-full">
                    <div className="text-[14px] font-bold text-text-primary">Midjourney — Lifetime Credits Bundle</div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-bold tracking-wide mt-1.5">
                      <span className="text-error bg-error-bg px-2 py-0.5 rounded-full animate-pulse">
                        <DealTimer initialHours={6} initialMinutes={12} />
                      </span>
                      <span className="text-text-muted">Ending soon</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <div className="text-[11px] text-text-muted line-through">$96</div>
                    <div className="text-[22px] font-extrabold text-primary">$49</div>
                    <div className="text-[9px] font-bold text-error bg-error-bg px-2 py-0.5 rounded-full inline-block mt-0.5">49% OFF</div>
                  </div>
                  <button className="px-5 py-2.5 rounded-[10px] bg-accent hover:bg-accent-hover text-text-inverse font-sans font-bold text-[12px] border-none cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 select-none shrink-0 w-full sm:w-auto">
                    Get Deal ↗
                  </button>
                </div>
              </motion.div>

              {/* Deal 3 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-primary rounded-[16px] p-4 sm:p-5 sm:px-6 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 hover:shadow-accent/10 cursor-pointer">
                  <div className="w-11 h-11 rounded-[10px] bg-bg-tertiary flex items-center justify-center shrink-0 p-2">
                    <ToolLogo id="elevenlabs" className="w-full h-full" />
                  </div>
                  <div className="flex-grow text-center sm:text-left w-full">
                    <div className="text-[14px] font-bold text-text-primary">ElevenLabs Creator — 6 Months Free</div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-bold tracking-wide mt-1.5">
                      <span className="text-warning bg-warning-bg px-2 py-0.5 rounded-full">
                        <DealTimer initialHours={120} initialMinutes={0} />
                      </span>
                      <span className="text-text-muted">New deal</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <div className="text-[11px] text-text-muted line-through">$99</div>
                    <div className="text-[22px] font-extrabold text-primary">$0</div>
                    <div className="text-[9px] font-bold text-error bg-error-bg px-2 py-0.5 rounded-full inline-block mt-0.5">100% OFF</div>
                  </div>
                  <button className="px-5 py-2.5 rounded-[10px] bg-accent hover:bg-accent-hover text-text-inverse font-sans font-bold text-[12px] border-none cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 select-none shrink-0 w-full sm:w-auto">
                    Get Deal ↗
                  </button>
                </div>
              </motion.div>

            </motion.div>
          </motion.section>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />

          {/* SECTION 6 — PLATFORM SYSTEMS */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16"
          >
            <div className="space-y-2 mb-8 text-center md:text-left">
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary">Platform Systems</div>
              <h2 className="text-[30px] font-bold tracking-[-0.02em] text-text-primary uppercase">80 Core Systems.</h2>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                Built for power users who demand enterprise-grade reliability with a cinematic experience.
              </p>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
            >

              {/* Sys 1 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">Smart Search</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    Meilisearch with typo tolerance, synonyms, and CMD+F shortcut
                  </p>
                </div>
              </motion.div>

              {/* Sys 2 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">Compare Tools</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    Side-by-side of up to 4 tools. Shareable link + export PDF
                  </p>
                </div>
              </motion.div>

              {/* Sys 3 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">Health Monitor</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    6-hour uptime checks with 30-day history chart per tool
                  </p>
                </div>
              </motion.div>

              {/* Sys 4 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">Tool Graveyard</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    Dead tools never deleted — archived with full history preserved
                  </p>
                </div>
              </motion.div>

              {/* Sys 5 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">AI Curation</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    Daily AI agent finds new tools. Admin reviews before any publish
                  </p>
                </div>
              </motion.div>

              {/* Sys 6 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">Offline PWA</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    Tools, guide, and all 6 games work without internet
                  </p>
                </div>
              </motion.div>

              {/* Sys 7 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">MCP Servers</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    First-class directory cross-linked to the AI tool directory
                  </p>
                </div>
              </motion.div>

              {/* Sys 8 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default hover:border-border-strong rounded-[14px] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-10.5 h-10.5 rounded-[10px] bg-primary/10 border border-border-default flex items-center justify-center mb-3">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">Version History</h4>
                  <p className="text-[11px] text-text-muted leading-[1.55]">
                    Full admin rollback system — every edit stored forever
                  </p>
                </div>
              </motion.div>

            </motion.div>
          </motion.section>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />


          {/* SECTION 8 — USER STATION GUIDE */}
          <motion.section
            id="operations-manual"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16"
          >
            <div className="space-y-2 mb-8 text-center md:text-left">
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary">Operations Manual</div>
              <h2 className="text-[30px] font-bold tracking-[-0.02em] text-text-primary uppercase">User Station Guide</h2>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                How to operate the intelligence layer. Get authorized, query variables, and connect server endpoints.
              </p>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              {/* Step 1 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default rounded-[14px] p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row gap-4 transition-colors hover:border-border-strong items-start h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-primary/10 border border-border-strong flex items-center justify-center text-primary text-[18px] sm:text-[20px] font-bold shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-text-primary">Establish Terminal Authorization</h3>
                    <p className="text-[12px] text-text-secondary leading-[1.6] mt-1.5">
                      Launch the terminal client and request permission via your private, invite-only node key. Once authenticated, your local environment binds securely to the Hub database layer.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default rounded-[14px] p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row gap-4 transition-colors hover:border-border-strong items-start h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-primary/10 border border-border-strong flex items-center justify-center text-primary text-[18px] sm:text-[20px] font-bold shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-text-primary">Search & Filter Curated Index</h3>
                    <p className="text-[12px] text-text-secondary leading-[1.6] mt-1.5">
                      Use our typo-tolerant search field or press <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded border border-border-subtle text-[10px]">Cmd+F</kbd> to access the 1,200+ index. Sort by licensing models (Free, Paid, Freemium) and verify health statuses.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default rounded-[14px] p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row gap-4 transition-colors hover:border-border-strong items-start h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-primary/10 border border-border-strong flex items-center justify-center text-primary text-[18px] sm:text-[20px] font-bold shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-text-primary">Connect MCP Server Bridges</h3>
                    <p className="text-[12px] text-text-secondary leading-[1.6] mt-1.5">
                      Link database query endpoints and page managers (Notion, Postgres, Brave) directly into your LLM contexts. Simply import the JSON schema configuration files into your local desktop agent.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div variants={staggerItemVariants}>
                <div className="bg-card shadow-sm border border-border-default rounded-[14px] p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row gap-4 transition-colors hover:border-border-strong items-start h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-primary/10 border border-border-strong flex items-center justify-center text-primary text-[18px] sm:text-[20px] font-bold shrink-0">
                    04
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-text-primary">Activate Uptime & Deals Alerts</h3>
                    <p className="text-[12px] text-text-secondary leading-[1.6] mt-1.5">
                      Bookmark your frequently accessed tools and toggle notifications. Receive instant webhook pings the moment a discount deal goes live or if a tool experience downtime.
                    </p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.section>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent mx-10" />

          {/* SECTION 9 — CALL TO ACTION (CTA) */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={sectionVariants}
            className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-16 mb-10"
          >
            <div className="relative bg-[#111827] dark:bg-[#1A1C23] shadow-2xl border border-gray-800 dark:border-white/10 rounded-[32px] p-8 sm:p-12 md:p-16 text-center flex flex-col items-center justify-center gap-6 overflow-hidden">
              {/* Glowing decorative background blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full filter blur-[100px] pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-[#E5D7A1]" /> Secure Access Nodes Active
              </div>

              <h2 className="text-[28px] sm:text-[42px] font-extrabold tracking-tight text-white uppercase max-w-2xl leading-tight">
                Enter the Ultimate <br className="sm:hidden" />
                <span className="text-[#E5D7A1] italic font-normal">AI Discovery Node</span>
              </h2>

              <p className="text-[14px] sm:text-[15px] text-gray-300 max-w-md leading-relaxed px-2">
                Connect your workstation to the central intelligence deck. Organize your development stack, query database engines, and monitor active workflows.
              </p>

              <div className="flex flex-row flex-wrap items-center justify-center gap-4 mt-4">
                <div className="flex items-center justify-center min-h-[48px]">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-8 py-3.5 rounded-[12px] bg-white text-[#111827] hover:bg-gray-100 font-bold text-[14px] transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Request Secure Access ↗
                  </button>
                </div>
                <button className="px-8 py-3.5 rounded-[12px] bg-transparent text-white border border-white/20 hover:bg-white/10 font-bold text-[14px] transition-all duration-200 active:scale-95">
                  Query System Logs
                </button>
              </div>
            </div>
          </motion.section>

        </div>
      </div>

      {/* SECTION 10 — FOOTER */}
      <footer className="w-full border-t border-border-subtle bg-bg-primary/95 transition-colors relative z-10 py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 mb-12">

            {/* Branding Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className="font-bold text-[16px] tracking-[0.02em] select-none text-text-primary uppercase"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  MANMADHAN'S HUB
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </div>
              <p className="text-[12px] text-text-secondary max-w-sm leading-relaxed">
                Centralized, invitation-only workstation facilitating advanced discovery, dynamic pricing tracking, and server connections for developer agents.
              </p>
              <div className="text-[10px] text-text-muted font-sans mt-2">
                &copy; {new Date().getFullYear()} Manmadhan's Hub. All nodes secured.
              </div>
            </div>

            {/* Links Column 1 */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold text-text-primary tracking-wider uppercase">Workstation</h4>
              <ul className="space-y-2 text-[12px] text-text-secondary font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">API Endpoints</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security Keys</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">System Diagnostics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Uptime Monitor</a></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold text-text-primary tracking-wider uppercase">Ecosystem</h4>
              <ul className="space-y-2 text-[12px] text-text-secondary font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">MCP Servers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Notion Bridge</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Brave Search</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Postgres Tunnel</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Divider & Credit Details */}
          <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-text-muted font-mono">
            <div>
              BUILT BY <span className="text-primary">MM1107</span> &middot; SS0778 &middot; MK1603 &middot; TN813
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-x-4 gap-y-2">
              <span>DB CHIPS: 1,200+</span>
              <span>UPTIME: 99.98%</span>
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> SECURE DECK CONNECTED
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* Fixed Premium Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 sm:p-4 rounded-full bg-bg-secondary/80 hover:bg-primary/10 text-primary border border-border-strong shadow-[0_4px_24px_rgba(0,0,0,0.40)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center justify-center"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  );
}
