"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Users,
  Bot,
  Layers,
  Zap,
  ShieldAlert,
  TrendingUp,
  Clock,
  BarChart2,
  PieChart,
  Activity,
  MailPlus,
  BarChart3,
  Terminal,
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
  Bookmark,
  Folder,
  ArrowRight,
  Cpu,
  Globe,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Circle,
  Radio,
  Wifi,
  Database,
  Server,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';

const escapeHTML = (str: string | undefined | null) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/&lt;b&gt;/g, '<b class="text-[var(--neon)]">')
    .replace(/&lt;\/b&gt;/g, '</b>');
};

// ─── Animated Counter ────────────────────────────────────────────────────────
const AnimatedNumber = ({ value }: { value: string }) => {
  const [display, setDisplay] = useState('0');
  const num = parseInt(value) || 0;

  useEffect(() => {
    if (num === 0) { setDisplay('0'); return; }
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(String(num)); clearInterval(timer); }
      else { setDisplay(String(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [num]);

  return <>{display}</>;
};

// ─── Mini Spark Line ──────────────────────────────────────────────────────────
const SparkLine = ({ color = 'var(--neon)' }: { color?: string }) => {
  const pts = useMemo(() => Array.from({ length: 10 }, () => Math.random() * 30 + 10), []);
  const max = Math.max(...pts);
  const h = 40;
  const w = 80;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - (p / max) * h + 4);
  const d = `M ${xs[0]} ${ys[0]} ` + xs.slice(1).map((x, i) => `L ${x} ${ys[i + 1]}`).join(' ');
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} L ${w} ${h} L 0 ${h} Z`}
        fill={`url(#sg-${color.replace(/[^a-z]/gi, '')})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
      />
      <motion.path
        d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  );
};

const GrowthChart = () => {
  const POINTS = 20;
  const [vals, setVals] = useState<number[]>([]);

  useEffect(() => {
    // Initial organic wave data
    let currentPhase = 0;
    const initial = Array.from({ length: POINTS }, (_, i) => {
      currentPhase += 0.4;
      return Math.sin(currentPhase) * 20 + Math.random() * 10 + 50;
    });
    setVals(initial);

    // Real-time ticking interval
    const interval = setInterval(() => {
      setVals(prev => {
        const next = [...prev.slice(1)];
        const lastVal = next[next.length - 1];
        // Random walk for the next node
        const newVal = Math.max(10, Math.min(90, lastVal + (Math.random() - 0.5) * 25));
        next.push(newVal);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (vals.length === 0) return null;

  const max = 100;
  const min = 0;
  const W = 560; const H = 160;
  const pad = { t: 16, b: 30, l: 8, r: 8 };
  const xs = vals.map((_, i) => pad.l + (i / (vals.length - 1)) * (W - pad.l - pad.r));
  const ys = vals.map(v => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b));
  const linePath = `M ${xs[0]} ${ys[0]} ` + xs.slice(1).map((x, i) => `C ${(xs[i] + x) / 2} ${ys[i]} ${(xs[i] + x) / 2} ${ys[i + 1]} ${x} ${ys[i + 1]}`).join(' ');
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${H - pad.b} L ${xs[0]} ${H - pad.b} Z`;

  return (
    <div className="relative w-full h-[180px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="growthLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--neon)" />
            <stop offset="50%" stopColor="var(--emerald)" />
            <stop offset="100%" stopColor="var(--mint)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line key={i} x1={pad.l} y1={pad.t + p * (H - pad.t - pad.b)} x2={W - pad.r} y2={pad.t + p * (H - pad.t - pad.b)}
            stroke="var(--border2)" strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
        ))}
        {/* Animated Area and Line */}
        <motion.path d={areaPath} fill="url(#growthArea)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <motion.path d={linePath} fill="none" stroke="url(#growthLine)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        
        {/* Real-time Ticks */}
        {xs.filter((_, i) => i % 4 === 0).map((x, i) => (
          <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="8" fill="var(--muted2)"
            fontFamily="monospace" letterSpacing="1" className="uppercase">-{20 - i * 4}s</text>
        ))}
        <text x={xs[xs.length - 1]} y={H - 4} textAnchor="middle" fontSize="8" fill="var(--neon)"
          fontFamily="monospace" letterSpacing="1" className="uppercase font-bold animate-pulse">LIVE</text>
          
        {/* Pulsing Head Node */}
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="4.5" fill="var(--mint)" stroke="var(--bg)" strokeWidth="1.5" filter="url(#glow)" className="animate-[pulse_1s_ease-in-out_infinite]" />
      </svg>
    </div>
  );
};

// ─── Pulse Ring Badge ─────────────────────────────────────────────────────────
const LiveBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--neon)]/10 border border-[var(--neon)]/25">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon)] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neon)]"></span>
    </span>
    <span className="text-[9px] font-black text-[var(--neon)] uppercase tracking-[0.2em] font-mono">Live</span>
  </div>
);

// ─── Stat Card (Premium Bento) ────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string; subText: string;
  isUp?: boolean; icon: any; accentVar: string;
  delay?: number; onClick?: () => void; badge?: string;
}

const StatCard = ({ label, value, subText, isUp, icon: Icon, accentVar, delay = 0, onClick, badge }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    onClick={onClick}
    className={`relative rounded-[1.5rem] overflow-hidden group transition-all duration-500
      ring-1 ring-[var(--border2)] hover:ring-[var(--border3)] bg-[var(--card-bg)]
      hover:-translate-y-1 hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.25)] transform-gpu
      ${onClick ? 'cursor-pointer' : ''}`}
  >
    {/* Animated top gradient highlight */}
    <div className="absolute top-0 inset-x-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `linear-gradient(90deg, transparent, var(${accentVar}), transparent)` }} />
    
    {/* Seamless Sparkline Background */}
    <div className="absolute bottom-0 left-0 right-0 h-[60%] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
      <SparkLine color={`var(${accentVar})`} />
    </div>

    {/* Soft glow orb behind icon */}
    <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-[0.1] blur-2xl group-hover:opacity-[0.25] group-hover:scale-150 transition-all duration-700"
      style={{ background: `var(${accentVar})` }} />

    <div className="p-6 relative z-10 flex flex-col h-full justify-between gap-4">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-2xl ring-1 ring-[var(--border2)] bg-[var(--bg)]/50 backdrop-blur-md shadow-sm group-hover:shadow-[0_0_15px_rgba(var(--particle-rgb),0.2)] transition-shadow duration-500">
          <Icon className="w-4 h-4" style={{ color: `var(${accentVar})` }} />
        </div>
        {isUp !== undefined && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--bg)]/50 ring-1 ring-[var(--border2)] backdrop-blur-md"
            style={{ color: isUp ? `var(${accentVar})` : '#ef4444' }}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span className="text-[10px] font-black">{isUp ? '+12%' : '-3%'}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-[0.2em] mb-1.5 font-mono">{label}</p>
        <div className="flex items-baseline gap-2 mb-1.5">
          <h3 className="text-4xl font-black text-[var(--text)] tracking-tighter drop-shadow-sm">
            <AnimatedNumber value={value} />
          </h3>
          {badge && <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-[var(--bg2)]" style={{ color: `var(${accentVar})` }}>{badge}</span>}
        </div>
        <span className="text-[11px] font-semibold text-[var(--muted)]">{subText}</span>
      </div>
    </div>
  </motion.div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, onClick, accent = false, delay = 0 }: { icon: any; label: string; onClick?: () => void; accent?: boolean; delay?: number }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer
      ${accent
        ? 'bg-[var(--neon)] text-black hover:opacity-90 active:scale-95'
        : 'bg-[var(--input-bg)] border border-[var(--border)] text-[var(--neon)] hover:border-[var(--border2)] hover:bg-[var(--card-bg)] active:scale-95'
      }`}
  >
    <Icon className="w-3.5 h-3.5 shrink-0" />
    <span>{label}</span>
  </motion.button>
);

// ─── Activity Feed Item ───────────────────────────────────────────────────────
const ActivityItem = ({ title, time, index, onClick }: { title: string; time: string; index: number; onClick?: () => void }) => {
  // Transform standard user activities into AI system operations for the dashboard vibe
  const systemTitle = title
    .replace(/<b>.*?<\/b>\s*/g, '<b class="text-[var(--neon)]">[System Node]</b> ')
    .replace(/logged in/g, 'synchronized with central mainframe')
    .replace(/logged out/g, 'terminated secure connection')
    .replace(/viewed a tool/g, 'accessed AI model parameters')
    .replace(/invited a new team member/g, 'allocated new compute instance')
    .replace(/created a new collection/g, 'initialized neural tensor matrix')
    .replace(/deleted/g, 'purged data segment')
    .replace(/updated/g, 'recalibrated weights');

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, duration: 0.35 }}
      onClick={onClick}
      className="group flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-0 cursor-pointer"
    >
      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full bg-[var(--neon)] shadow-[0_0_8px_rgba(var(--particle-rgb),0.5)] group-hover:scale-125 transition-transform" />
        <div className="w-px h-4 bg-[var(--border)] last:hidden" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[var(--text)] group-hover:text-[var(--neon)] transition-colors leading-snug"
          dangerouslySetInnerHTML={{ __html: escapeHTML(systemTitle) }} />
        <p className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-0.5 font-mono">{time}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-[var(--muted2)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--neon)] transition-all shrink-0 mt-1" />
    </motion.div>
  );
};

// ─── Telemetry Bar ─────────────────────────────────────────────────────────────
const TelemetryBar = ({ label, val, index }: { label: string; val: number; index: number }) => {
  const color = val > 75 ? '#ef4444' : val > 50 ? '#f97316' : 'var(--neon)';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 + 0.3 }} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono truncate max-w-[100px]">{label}</span>
        </div>
        <span className="text-[9px] font-black font-mono" style={{ color }}>{val}%</span>
      </div>
      <div className="h-1.5 w-full bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--border)]">
        <motion.div className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

// ─── Main Export ───────────────────────────────────────────────────────────────
export const Overview = ({ username, role = 'super-admin', onTabChange }: { username: string; role?: string; onTabChange?: (tabId: string) => void }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: '0', tools: '0', sectors: '0', sessions: '0', pending: '0', security: '0' });
  const [distributions, setDistributions] = useState<{ label: string; value: string; type: string }[]>([]);
  const [telemetryNodes, setTelemetryNodes] = useState<{ label: string; val: number }[]>([]);
  const [userStats, setUserStats] = useState({ saved: '0', collections: '0' });
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');

  // Time + Greeting
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
      const h = now.getHours();
      setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // User stats from localStorage
  useEffect(() => {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem(`saved_tools_${role}`) || '[]').length;
      const colls = JSON.parse(localStorage.getItem(`collections_${role}`) || '[]').length;
      setUserStats({ saved: String(saved), collections: String(colls) });
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('workspace-state-sync', load);
    return () => { window.removeEventListener('storage', load); window.removeEventListener('workspace-state-sync', load); };
  }, [role]);

  // Socket listeners
  useEffect(() => {
    // Load offline cache on mount
    const cachedStats = localStorage.getItem('offline_overview_stats');
    if (cachedStats) try { setStats(JSON.parse(cachedStats)); } catch(e) {}
    
    const cachedDist = localStorage.getItem('offline_overview_distributions');
    if (cachedDist) try { setDistributions(JSON.parse(cachedDist)); } catch(e) {}

    const cachedTelemetry = localStorage.getItem('offline_overview_telemetry');
    if (cachedTelemetry) try { setTelemetryNodes(JSON.parse(cachedTelemetry)); } catch(e) {}

    if (!socket.connected) socket.connect();
    socket.emit('request_stats');
    socket.emit('request_activities');
    socket.emit('request_telemetry');

    socket.on('stats_update', (data) => {
      const newStats = { users: data.totalUsers || '0', tools: data.aiTools || '0', sectors: data.sectors || '0', sessions: data.aiSessions || '0', pending: '0', security: data.securityAlerts || '0' };
      setStats(newStats);
      localStorage.setItem('offline_overview_stats', JSON.stringify(newStats));
      
      if (data.distributions) {
        setDistributions(data.distributions);
        localStorage.setItem('offline_overview_distributions', JSON.stringify(data.distributions));
      }
    });
    socket.on('system_telemetry', (data) => {
      if (data.nodes?.length > 0) {
        const nodes = data.nodes.slice(0, 4).map((n: any) => ({ label: n.name, val: Math.min(Math.max(n.load, 1), 99) }));
        setTelemetryNodes(nodes);
        localStorage.setItem('offline_overview_telemetry', JSON.stringify(nodes));
      }
    });
    socket.on('activity_update', (a) => {
      setActivities(prev => {
        if (prev.some(x => x.id === a.id)) return prev;
        return [...prev, a].sort((a, b) => b.id - a.id).slice(0, 10);
      });
    });
    return () => { socket.off('stats_update'); socket.off('activity_update'); socket.off('system_telemetry'); };
  }, []);

  // ── Unified Responsive Layout ──────────────────────────────────────────────────
  const isUser = role === 'member';
  // All gradients/colors via CSS vars so they respond to theme switching
  const statCards = isUser ? [
    { label: 'Saved Tools',  value: userStats.saved,       subText: 'Bookmarked assets',     icon: Bookmark,   accentVar: '--neon',    isUp: parseInt(userStats.saved) > 0, tab: 'saved' },
    { label: 'Collections',  value: userStats.collections,  subText: 'Custom libraries',       icon: Folder,     accentVar: '--emerald', tab: 'collections' },
    { label: 'AI Index',     value: stats.tools,            subText: 'Total tools available',  icon: Zap,        accentVar: '--mint',    isUp: true, tab: 'search-ai' },
  ] : [
    { label: 'Total Users',     value: stats.users,    subText: 'Active nodes',    icon: Users,       accentVar: '--neon',    isUp: true, tab: 'identities' },
    { label: 'AI Tools',        value: stats.tools,    subText: 'Indexed assets',  icon: Bot,         accentVar: '--emerald', isUp: true, tab: 'ai-tools' },
    { label: 'Security Alerts', value: stats.security, subText: 'Firewall risks',  icon: ShieldAlert, accentVar: '--neon',    tab: 'security' },
  ];

  const defaultTelemetry = [
    { label: 'API Cluster', val: 0 },
    { label: 'Database', val: 0 },
    { label: 'Socket Node', val: 0 },
    { label: 'Cache Layer', val: 0 },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-16 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 transform-gpu">

      {/* ── HERO BENTO BANNER ────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[2rem] md:rounded-[2.5rem] border border-[var(--border2)] mb-5 md:mb-8 overflow-hidden bg-[var(--card-bg)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm transform-gpu"
      >
        {/* Static Internal Mesh (Animations removed for scroll performance) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[150%] rounded-[100%] bg-[var(--neon)]/[0.12] blur-[60px]" />
          <div className="absolute -bottom-[20%] right-[10%] w-[50%] h-[120%] rounded-[100%] bg-[var(--emerald)]/[0.1] blur-[60px]" />
          <div className="absolute top-[20%] right-[30%] w-[40%] h-[100%] rounded-[100%] bg-[var(--mint)]/[0.08] blur-[50px]" />
        </div>
        
        {/* Top Status Bar integrated into the card border */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 pb-2 border-b border-[var(--border2)]/50 bg-gradient-to-b from-[var(--bg2)]/40 to-transparent">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[var(--neon)]" />
            <span className="text-[10px] font-bold text-[var(--text)] uppercase tracking-[0.2em]">
              {isUser ? 'Intelligence Workspace' : 'Root Command Center'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LiveBadge />
            <div className="font-mono text-[11px] font-black text-[var(--muted2)] tracking-widest bg-[var(--bg)]/50 px-3 py-1.5 rounded-full border border-[var(--border2)]">
              {currentTime}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between px-6 md:px-10 pt-8 pb-10 gap-8">
          <div className="flex-1">
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="text-xs font-bold text-[var(--neon)] uppercase tracking-[0.2em] font-mono mb-2">
              {greeting} —
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-royal text-4xl sm:text-5xl md:text-6xl font-black text-[var(--text)] tracking-tight leading-none mb-4 drop-shadow-sm">
              {username}
              <span className="text-[var(--neon)]">.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-[15px] font-medium text-[var(--muted)] max-w-xl leading-relaxed">
              {isUser
                ? 'Your secure intelligence workspace is active. Manage your AI tool registry and orchestrate your collections from this hub.'
                : 'All platform clusters are synchronized and nominal. Full administrative control and root access have been established.'}
            </motion.p>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            {!isUser ? (
              <>
                <QuickAction icon={UserPlus} label="New Identity" onClick={() => onTabChange?.('identities')} delay={0.4} />
                <QuickAction icon={BarChart3} label="View Telemetry" onClick={() => onTabChange?.('analytics')} accent delay={0.5} />
              </>
            ) : (
              <>
                <QuickAction icon={Globe} label="Explore Tools" onClick={() => onTabChange?.('explore-categories')} delay={0.4} />
                <QuickAction icon={Sparkles} label="Search AI" onClick={() => onTabChange?.('search-ai')} accent delay={0.5} />
              </>
            )}
          </div>
        </div>

        {/* Integrated Status Strip */}
        <div className="relative z-10 bg-[var(--bg2)]/80 border-t border-[var(--border2)] px-6 md:px-10 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          {[
            { icon: Circle, label: 'System', status: 'Operational', color: 'text-[var(--neon)]' },
            { icon: Wifi, label: 'Connection', status: 'Stable', color: 'text-[var(--emerald)]' },
            { icon: Server, label: 'API', status: 'Online', color: 'text-[var(--neon)]' },
            { icon: Database, label: 'Database', status: 'Connected', color: 'text-[var(--mint)]' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 text-[10px] font-mono group cursor-default"
            >
              <s.icon className={`w-3 h-3 ${s.color} animate-pulse drop-shadow-[0_0_8px_currentColor]`} />
              <span className="font-bold text-[var(--muted2)] uppercase tracking-widest">{s.label}</span>
              <span className="text-[var(--border2)] mx-1">/</span>
              <span className={`font-black ${s.color} uppercase tracking-widest group-hover:brightness-125 transition-all`}>{s.status}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── STATS GRID ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 md:mb-8">
        {statCards.map((card, i) => (
          <StatCard
            key={i}
            label={card.label}
            value={card.value}
            subText={card.subText}
            icon={card.icon}
            accentVar={card.accentVar}
            isUp={card.isUp}
            delay={0.05 * i}
            onClick={() => onTabChange?.(card.tab)}
          />
        ))}
      </div>


      {/* ── BOTTOM ROW: ADMIN COMMAND CENTER ────────────────────────────────── */}
      {!isUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Authority Matrix (Identity Management) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            className="relative bg-[var(--card-bg)] border border-[var(--border2)] rounded-[2rem] p-6 md:p-8 flex flex-col hover:border-[var(--border3)] hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[var(--neon)] opacity-[0.01] group-hover:opacity-[0.03] transition-opacity pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-[var(--neon)]/10 ring-1 ring-[var(--neon)]/20 shadow-[0_0_15px_rgba(var(--particle-rgb),0.15)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--neon)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">System Admin</p>
                  <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-tight">Authority Matrix</h3>
                </div>
              </div>

              {/* Stacked Avatars UI */}
              <div className="flex flex-col gap-6 mb-8 flex-1">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)]/40 ring-1 ring-[var(--border2)]">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--card-bg)] bg-gradient-to-br from-[var(--bg3)] to-[var(--bg2)] flex items-center justify-center relative shadow-sm">
                          {i === 3 ? <span className="text-[10px] font-bold text-[var(--muted2)]">+{Math.max(0, parseInt(stats.users || '0') - 3)}</span> : <User className="w-4 h-4 text-[var(--muted)]" />}
                          {i === 0 && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--neon)] ring-2 ring-[var(--card-bg)]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[var(--text)]">{stats.users}</div>
                    <div className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest font-mono">Identities</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)]/40 ring-1 ring-[var(--border2)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[var(--text)] uppercase tracking-widest">Security Status</div>
                      <div className="text-[9px] text-[var(--muted2)] uppercase font-mono tracking-widest">Active Firewall</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-500">{stats.security}</div>
                    <div className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest font-mono">Alerts</div>
                  </div>
                </div>
              </div>

              <button onClick={() => onTabChange?.('identities')}
                className="w-full py-3.5 rounded-xl bg-[var(--neon)] text-black text-[11px] font-black uppercase tracking-widest hover:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(var(--particle-rgb),0.3)]">
                <UserPlus size={15} /> Manage Identities
              </button>
            </div>
          </motion.div>

          {/* Telemetry Nodes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
            onClick={() => onTabChange?.('analytics')}
            className="bg-[var(--card-bg)] border border-[var(--border2)] rounded-[2rem] p-6 md:p-8 flex flex-col hover:border-[var(--border3)] hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--emerald)] opacity-[0.02] blur-[80px] pointer-events-none group-hover:opacity-[0.05] transition-opacity" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2.5 rounded-2xl bg-[var(--emerald)]/10 ring-1 ring-[var(--emerald)]/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Cpu className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">Infrastructure</p>
                <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-tight group-hover:text-[var(--emerald)] transition-colors">Telemetry Nodes</h3>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-5 relative z-10">
              {(telemetryNodes.length > 0 ? telemetryNodes : defaultTelemetry).map((node, i) => {
                const color = node.val > 75 ? '#ef4444' : node.val > 50 ? '#f97316' : 'var(--emerald)';
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono truncate">{node.label}</div>
                    <div className="flex-1 h-3 bg-[var(--bg)]/80 rounded-full ring-1 ring-[var(--border2)] overflow-hidden shadow-inner flex relative">
                      {/* Vertical Server Rack Block Segments Effect */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 z-10 pointer-events-none" />
                      <motion.div className="h-full rounded-full relative"
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                        initial={{ width: 0 }} animate={{ width: `${node.val}%` }} transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="w-8 text-right text-[10px] font-black font-mono" style={{ color }}>{node.val}%</div>
                  </div>
                );
              })}
              {telemetryNodes.length === 0 && (
                <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest text-center pt-2 font-mono animate-pulse">
                  Syncing telemetry cluster...
                </p>
              )}
            </div>
            
            <div className="mt-8 pt-5 border-t border-[var(--border2)]/50 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">View Analytics Array</span>
              <div className="w-6 h-6 rounded-full bg-[var(--bg2)] flex items-center justify-center ring-1 ring-[var(--border2)] group-hover:ring-[var(--emerald)] group-hover:bg-[var(--emerald)]/10 transition-all">
                <ArrowRight className="w-3 h-3 text-[var(--muted2)] group-hover:text-[var(--emerald)] transition-colors" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User workspace bottom section */}
      {isUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 md:p-7 hover:border-[var(--border2)] transition-all group overflow-hidden relative cursor-pointer"
            onClick={() => onTabChange?.('search-ai')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20">
                <Sparkles className="w-4 h-4 text-[var(--neon)]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">Explore</p>
                <h3 className="text-xs font-black text-[var(--text)] uppercase tracking-tight group-hover:text-[var(--neon)] transition-colors">AI Intelligence Index</h3>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
              Browse the full registry of AI tools across all sectors. Filter by category, pricing, and platform.
            </p>
            <div className="flex items-center gap-2 text-[var(--neon)]">
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">Explore {stats.tools} Tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 md:p-7 hover:border-[var(--border2)] transition-all group overflow-hidden relative cursor-pointer"
            onClick={() => onTabChange?.('collections')}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--emerald) 4%, transparent), transparent)' }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl border border-[var(--border2)]"
                style={{ background: 'color-mix(in srgb, var(--emerald) 12%, transparent)' }}>
                <Folder className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
              </div>
              <div>
                <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">Workspace</p>
                <h3 className="text-xs font-black text-[var(--text)] uppercase tracking-tight group-hover:text-[var(--emerald)] transition-colors">My Collections</h3>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
              Organize your saved tools into custom collections. Build your personal intelligence toolkit.
            </p>
            <div className="flex items-center gap-2" style={{ color: 'var(--emerald)' }}>
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">Manage {userStats.collections} Collections</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
