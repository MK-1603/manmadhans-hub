"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { socket } from '@/lib/socket';
import { useToast } from './ToastContext';
import { motion, AnimatePresence } from 'framer-motion'; // Cache bust
import {
  BarChart3, Globe, Server, Cpu,
  Search, Database, ShieldAlert, Zap, RefreshCw, Activity,
  TrendingUp, Layers, CheckCircle2, Clock, ChevronUp, ChevronDown,
  LayoutDashboard, Wifi, Circle
} from 'lucide-react';

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter = ({ value }: { value: string }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const n = parseInt(value);
    if (isNaN(n)) { setDisplay(value); return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(n / 60));
    const id = setInterval(() => {
      cur = Math.min(cur + step, n);
      setDisplay(String(cur));
      if (cur >= n) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [value]);
  return <>{display}</>;
};

// ─── Mini sparkline ──────────────────────────────────────────────────────────
const SparkLine = ({ color = 'var(--neon)' }: { color?: string }) => {
  const pts = useMemo(() => Array.from({ length: 10 }, () => Math.random() * 30 + 10), []);
  const max = Math.max(...pts);
  const h = 40;
  const w = 80;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - (p / max) * h + 4);
  const d = `M ${xs[0]} ${ys[0]} ` + xs.slice(1).map((x, i) => `L ${x} ${ys[i + 1]}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-70">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} L ${xs[xs.length - 1]} ${h} L ${xs[0]} ${h} Z`}
        fill={`url(#sg-${color.replace(/[^a-z]/gi, '')})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      />
      <motion.path
        d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  );
};

// ─── Pulse Ring Badge ─────────────────────────────────────────────────────────
const LiveBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--neon)]/10 border border-[var(--neon)]/25">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon)] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neon)]"></span>
    </span>
    <span className="text-[9px] font-black text-[var(--neon)] uppercase tracking-[0.2em] font-mono">Live Stream</span>
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, onClick, accent = false, delay = 0, disabled = false }: { icon: any; label: string; onClick?: () => void; accent?: boolean; delay?: number; disabled?: boolean }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay }}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
      ${accent
        ? 'bg-[var(--neon)] text-black hover:opacity-90 active:scale-95'
        : 'bg-[var(--input-bg)] border border-[var(--border)] text-[var(--neon)] hover:border-[var(--border2)] hover:bg-[var(--card-bg)] active:scale-95'
      }`}
  >
    <Icon className={`w-4 h-4 shrink-0 ${disabled ? 'animate-spin' : ''}`} />
    <span>{label}</span>
  </motion.button>
);

// ─── Stat Card (Premium Bento) ────────────────────────────────────────────────
const StatCard = ({
  label, value, trend, trendUp, icon: Icon, accentVar, delay = 0,
}: { label: string; value: string; trend?: string; trendUp?: boolean; icon: any; accentVar: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative rounded-2xl border border-[var(--border)] overflow-hidden group transition-all duration-400 hover:-translate-y-1 hover:border-[var(--border2)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transform-gpu"
    style={{ background: 'var(--card-bg)' }}
  >
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
      style={{ background: `linear-gradient(to right, var(${accentVar}), transparent)` }} />
    {/* Background glow orb */}
    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.08] blur-2xl group-hover:opacity-[0.15] transition-opacity duration-500"
      style={{ background: `var(${accentVar})` }} />

    <div className="p-5 relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl border border-[var(--border)]"
          style={{ background: `color-mix(in srgb, var(${accentVar}) 12%, transparent)` }}>
          <Icon className="w-4 h-4" style={{ color: `var(${accentVar})` }} />
        </div>
        <SparkLine color={`var(${accentVar})`} />
      </div>

      <div className="mt-1">
        <p className="text-[8.5px] font-black text-[var(--muted2)] uppercase tracking-[0.2em] font-mono mb-1">{label}</p>
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight leading-none mb-2">
          <Counter value={value} />
        </h3>
        {trend && trend !== '...' && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center justify-center w-4 h-4 rounded-full"
              style={{ background: trendUp ? `color-mix(in srgb, var(${accentVar}) 15%, transparent)` : 'rgba(248,113,113,0.15)', color: trendUp ? `var(${accentVar})` : '#f87171' }}>
              {trendUp ? <ChevronUp className="w-3 h-3" strokeWidth={3} /> : <ChevronDown className="w-3 h-3" strokeWidth={3} />}
            </span>
            <span className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest font-mono">{trend} this week</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── Horizontal bar ──────────────────────────────────────────────────────────
const Bar = ({ pct, color, delay }: { pct: number; color: string; delay: number }) => (
  <div className="h-[6px] rounded-full overflow-hidden" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}>
    <motion.div className="h-full rounded-full"
      style={{ background: color }}
      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
      transition={{ duration: 1.1, delay, ease: 'easeOut' }} />
  </div>
);

// ─── Radial ring gauge ────────────────────────────────────────────────────────
const Ring = ({ pct, color, size = 64 }: { pct: number; color: string; size?: number }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`color-mix(in srgb, ${color} 18%, transparent)`} strokeWidth={6} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round"
        style={{ strokeDasharray: circ }}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }} />
    </svg>
  );
};

// ─── Queue row ───────────────────────────────────────────────────────────────
const QueueRow = ({ name, active, waiting, completed, failed, index }: any) => {
  const total = (completed || 0) + (failed || 0) + (active || 0);
  const pct = total > 0 ? Math.round(((completed || 0) / total) * 100) : 0;
  const healthColor = pct > 80 ? 'var(--neon)' : pct > 50 ? '#fbbf24' : '#f87171';
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] hover:border-[var(--border2)] transition-all group transform-gpu"
      style={{ background: 'var(--input-bg)' }}
    >
      <div className="flex items-center gap-3">
        <Ring pct={pct} color={healthColor} size={44} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black text-[var(--text)] uppercase tracking-wide font-mono truncate group-hover:text-[var(--neon)] transition-colors">{name}</p>
          <div className="flex gap-2.5 mt-1">
            <span className="flex items-center gap-1 text-[8px] font-bold font-mono text-[var(--muted2)] uppercase">
              <span className="w-1 h-1 rounded-full bg-[var(--neon)] animate-pulse" />
              {active} active
            </span>
            <span className="flex items-center gap-1 text-[8px] font-bold font-mono text-[var(--muted2)] uppercase">
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              {waiting} wait
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-[var(--border)]/40 pt-2 sm:pt-0 sm:border-t-0 sm:shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="text-[7px] text-[var(--muted2)] font-mono uppercase tracking-widest">Done</p>
            <p className="text-[12px] font-black" style={{ color: 'var(--neon)' }}>{completed}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[7px] text-[var(--muted2)] font-mono uppercase tracking-widest">Fail</p>
            <p className="text-[12px] font-black text-rose-400">{failed}</p>
          </div>
        </div>
        <div className="text-[11px] font-black font-mono w-10 text-right" style={{ color: healthColor }}>{pct}%</div>
      </div>
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export const PlatformAnalytics = () => {
  const { showToast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [data, setData] = useState<any>({
    pageViews: '...', apiCalls: '...', avgSession: '...', tokenUsage: '...',
    queueHealth: [], searchTrends: [],
    trends: { pageViews: '...', apiCalls: '...', session: '...', tokens: '...' },
  });

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit('request_analytics');
    socket.on('analytics_update', (update: any) => {
      setData((prev: any) => ({
        ...prev, ...update,
        trends: update.trends || prev.trends || {
          pageViews: '+14.8%', apiCalls: '+28.2%', session: '+4.6%', tokens: '-2.1%',
        },
      }));
    });
    return () => { socket.off('analytics_update'); };
  }, []);

  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    socket.emit('request_analytics');
    setTimeout(() => {
      setIsScanning(false);
      showToast('Telemetry synced — all nodes reporting', 'success');
    }, 1000);
  };

  const statCards = [
    { label: 'System Activities', value: data.pageViews, trend: data.trends?.pageViews, trendUp: true, icon: Globe, accentVar: '--neon' },
    { label: 'Audit Log Entries', value: data.apiCalls, trend: data.trends?.apiCalls, trendUp: true, icon: Server, accentVar: '--emerald' },
    { label: 'Security Threats', value: data.avgSession, trend: data.trends?.session, trendUp: false, icon: ShieldAlert, accentVar: '--mint' },
    { label: 'Total Tools', value: data.tokenUsage, trend: data.trends?.tokens, trendUp: true, icon: Cpu, accentVar: '--neon' },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-16 px-1 animate-in fade-in slide-in-from-bottom-4 duration-700 transform-gpu">

      {/* ── HERO HEADER ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden border border-[var(--border)] mb-5 md:mb-8 transform-gpu"
        style={{ background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(var(--particle-rgb), 0.03) 50%, var(--card-bg) 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.07] blur-2xl" style={{ background: 'radial-gradient(circle, var(--neon), transparent)' }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.06] blur-2xl" style={{ background: 'radial-gradient(circle, var(--emerald), transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 opacity-[0.04] blur-2xl" style={{ background: 'radial-gradient(ellipse, var(--mint), transparent)' }} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between p-5 md:p-8 gap-6">
          <div className="flex-1 w-full md:w-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-3">
              <LayoutDashboard className="w-3.5 h-3.5 text-[var(--neon)]" />
              <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-[0.25em] font-mono">mission-control / analytics</span>
            </div>
            {/* Title */}
            <h1 className="font-royal text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text)] tracking-tight leading-none mb-3">
              Platform Analytics<span className="text-[var(--neon)]">.</span>
            </h1>
            <p className="text-sm font-medium text-[var(--muted)] max-w-md leading-relaxed">
              Real-time telemetry, queue health, search intelligence, and system diagnostics.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto border-t border-[var(--border)]/30 md:border-t-0 pt-4 md:pt-0">
            {/* Live clock / badge */}
            <div className="flex items-center gap-2">
              <LiveBadge />
              <div className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] font-mono text-[11px] font-black text-[var(--text)] tracking-widest">
                {currentTime}
              </div>
            </div>
            {/* Quick action buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end mt-1 w-full sm:w-auto">
               <QuickAction icon={RefreshCw} label={isScanning ? 'Scanning...' : 'Diagnostics'} onClick={triggerScan} accent disabled={isScanning} delay={0.1} />
            </div>
          </div>
        </div>

        {/* Bottom status strip */}
        <div className="relative z-10 border-t border-[var(--border)] px-5 md:px-8 py-3.5 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
          {[
            { label: 'Node', val: 'MM-Node-5', icon: Cpu, color: 'text-[var(--neon)]' },
            { label: 'Stream', val: 'Active', icon: Activity, color: 'text-[var(--neon)]' },
            { label: 'Latency', val: '12ms', icon: Clock, color: 'text-[var(--neon)]' },
            { label: 'Uptime', val: '99.9%', icon: CheckCircle2, color: 'text-[var(--neon)]' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-1.5 text-[9px] font-mono"
            >
              <s.icon className={`w-2.5 h-2.5 ${s.color}`} />
              <span className="font-bold text-[var(--muted2)] uppercase tracking-widest">{s.label}:</span>
              <span className={`font-black ${s.color} uppercase tracking-widest`}>{s.val}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── STAT CARDS ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 md:mb-8">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} delay={0.05 * i} />
        ))}
      </div>

      {/* ── BENTO GRID: SEARCH TRENDS + QUEUE HEALTH ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

        {/* Search Trends */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="xl:col-span-2 relative bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 md:p-7 flex flex-col hover:border-[var(--border2)] transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20">
                <Search className="w-4 h-4 text-[var(--neon)]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-[0.25em] font-mono mb-1.5">Intelligence</p>
                <h3 className="text-base font-black text-[var(--text)] uppercase tracking-tight">Search Trends</h3>
              </div>
            </div>
            <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono px-3 py-1.5 rounded-full border border-[var(--border)]">30D</span>
          </div>

          {/* Trend bars */}
          <div className="flex flex-col gap-7 relative z-10">
            {data.searchTrends.length > 0 ? data.searchTrends.map((trend: any, i: number) => (
              <div key={trend.tag} className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[var(--text)] uppercase tracking-wider font-mono">{trend.tag}</span>
                  </div>
                  <span className="text-[10px] font-black text-[var(--neon)] font-mono">{trend.value}%</span>
                </div>
                <Bar pct={trend.value} color="var(--neon)" delay={0.25 + i * 0.08} />
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-14 gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-[var(--border2)] border-t-[var(--neon)] animate-spin" style={{ animationDuration: '3s' }} />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--muted2)] font-mono">Analyzing Trends...</p>
              </div>
            )}
          </div>

          {/* Mini chart preview area */}
          {data.searchTrends.length > 0 && (
            <div className="mt-8 relative z-10">
              <div className="rounded-2xl border border-[var(--border)] p-5 bg-[var(--input-bg)]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[var(--neon)]" />
                  <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-[0.25em] font-mono">Trend Velocity</span>
                </div>
                <div className="flex items-end gap-1.5 sm:gap-2 h-12">
                  {data.searchTrends.map((t: any, i: number) => (
                    <motion.div key={i}
                      className="flex-1 rounded-t-md"
                      style={{ background: 'var(--neon)', opacity: 0.3 + (t.value / 100) * 0.7 }}
                      initial={{ height: 0 }} animate={{ height: `${(t.value / 100) * 48}px` }}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Queue Health */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="xl:col-span-1 relative bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 md:p-7 flex flex-col hover:border-[var(--border2)] transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--emerald)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--emerald)]/10 border border-[var(--emerald)]/20">
                <Database className="w-4 h-4 text-[var(--emerald)]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-[0.25em] font-mono mb-1.5">Infrastructure</p>
                <h3 className="text-base font-black text-[var(--text)] uppercase tracking-tight">Queue Matrix</h3>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-5 relative z-10">
            {[
              { color: 'var(--neon)', label: 'Active' },
              { color: '#fbbf24', label: 'Waiting' },
              { color: '#f87171', label: 'Failed' },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-[9px] font-black text-[var(--text)] uppercase tracking-widest font-mono">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Queue rows */}
          <div className="flex-1 flex flex-col gap-3 relative z-10">
            {data.queueHealth.length > 0 ? data.queueHealth.map((queue: any, i: number) => (
              <QueueRow key={i} {...queue} index={i} />
            )) : (
              <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
                <Layers className="w-8 h-8 text-[var(--border2)]" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--muted2)] font-mono animate-pulse">Connecting Matrix Nodes...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── SUMMARY ROW ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: Activity, label: 'Queue Overview', accentVar: '--neon',
            stats: [
              { label: 'Total Queues', val: String(data.queueHealth.length || '—') },
              { label: 'Healthy', val: String(data.queueHealth.filter((q: any) => (q.failed || 0) === 0).length || '—') },
            ],
          },
          {
            icon: Search, label: 'Search Tags', accentVar: '--emerald',
            stats: [
              { label: 'Tracked Tags', val: String(data.searchTrends.length || '—') },
              { label: 'Top Tag', val: data.searchTrends[0]?.tag || '—' },
            ],
          },
          {
            icon: ShieldAlert, label: 'Security', accentVar: '--mint',
            stats: [
              { label: 'Threats', val: data.avgSession || '—' },
              { label: 'Status', val: 'Monitored' },
            ],
          },
        ].map((panel, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.08 }}
            className="relative rounded-3xl border border-[var(--border)] p-5 md:p-6 flex flex-col hover:border-[var(--border2)] transition-all duration-300 bg-[var(--card-bg)] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style={{ color: `var(${panel.accentVar})` }} />
            
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="p-2 rounded-xl border border-[var(--border)]"
                style={{ background: `color-mix(in srgb, var(${panel.accentVar}) 10%, transparent)` }}>
                <panel.icon className="w-4 h-4" style={{ color: `var(${panel.accentVar})` }} />
              </div>
              <span className="text-[10px] font-black text-[var(--text)] uppercase tracking-widest font-mono">{panel.label}</span>
            </div>
            <div className="flex flex-col gap-2 relative z-10 flex-1 justify-end">
              {panel.stats.map((s, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest font-mono">{s.label}</span>
                  <span className="text-xs font-black text-[var(--text)] font-mono">{s.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
