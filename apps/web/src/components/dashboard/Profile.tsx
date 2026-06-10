"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  User, Mail, ShieldCheck, Zap, Clock, Key, Lock,
  Terminal, Activity, Check, Calendar, Sparkles, Cpu,
  Server, HardDrive, RefreshCw, Globe, ArrowLeft,
  Wifi, WifiOff, Signal, Monitor, Smartphone, MonitorSmartphone, Globe2, Trash2, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';
import { useToast } from './ToastContext';

export const Profile = ({ onTabChange, onBack }: { onTabChange?: (tabId: string) => void, onBack?: () => void }) => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const [lastPing, setLastPing] = useState<number | null>(null);
  const [pingHistory, setPingHistory] = useState<number[]>(Array(15).fill(0));
  const [isPingActive, setIsPingActive] = useState(true);
  const [gatewayHost, setGatewayHost] = useState('mm-gateway-us-east.net');

  const [framesSent, setFramesSent] = useState(0);
  const [framesReceived, setFramesReceived] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(8);
  const [memoryUsage, setMemoryUsage] = useState(48.2);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'Initializing telemetry connection...',
    'Session handshake established.',
    'Gateway listening on socket channel.'
  ]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (!token) return;
      const cachedData = localStorage.getItem('offline_profile_data');
      if (cachedData) {
        try { setProfile(JSON.parse(cachedData)); setLoading(false); } catch(e) {}
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        localStorage.setItem('offline_profile_data', JSON.stringify(data));
      } else if (!cachedData) {
        showToast("Authorization signature rejected.", "error");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const displayName = profile?.username || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || 'Anonymous';
  const displayEmail = profile?.email || 'No email attached';
  const displayRole = (profile?.role || (typeof window !== 'undefined' ? localStorage.getItem('user_role') : null) || 'Member')
    .split(/[-_]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (!isPingActive) return;
      const start = Date.now();
      socket.volatile.emit('ping', start);
    }, 2000);

    const onPong = (serverTime: number) => {
      setFramesReceived(p => p + 1);
    };
    socket.on('pong', onPong);

    return () => {
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [isPingActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFramesSent(prev => prev + Math.floor(Math.random() * 2));
      setFramesReceived(prev => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(3, Math.min(22, Math.round(prev + (Math.random() - 0.5) * 4))));
      setMemoryUsage(prev => Math.max(42, Math.min(58, Number((prev + (Math.random() - 0.5) * 0.6).toFixed(1)))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const chartPath = useMemo(() => {
    const maxVal = Math.max(...pingHistory, 50);
    const minVal = Math.min(...pingHistory, 5);
    const range = maxVal - minVal || 10;
    const points = pingHistory.map((val, index) => ({
      x: (index * (100 / (pingHistory.length - 1))),
      y: 90 - ((val - minVal) / range) * 80
    }));
    if (points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [pingHistory]);

  const chartArea = useMemo(() => {
    if (!chartPath) return '';
    return `${chartPath} L 100 100 L 0 100 Z`;
  }, [chartPath]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };


  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)]/75 backdrop-blur-lg">
        <div className="relative flex flex-col items-center justify-center space-y-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[3px] border-[var(--border)] border-t-[var(--neon)] rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2.5 border-2 border-dashed border-[var(--neon)]/40 rounded-full"
            />
            <Activity className="w-6 h-6 text-[var(--neon)] animate-pulse" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-sm font-bold text-[var(--text)] tracking-wider">Syncing Client Portal</p>
            <p className="text-[9px] font-medium text-[var(--muted2)] uppercase tracking-widest">Establishing session telemetry...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar font-sans text-left">
      <div className="flex flex-col gap-4 pb-6">

        {/* ── HERO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border2)] shadow-[var(--shadow-card)]"
          style={{ background: 'linear-gradient(145deg, var(--card-bg) 0%, var(--bg2) 100%)' }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--neon)]/10 to-[var(--emerald)]/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[var(--mint)]/5 blur-3xl pointer-events-none" />

          {/* SVG ping chart bg */}
          <div className="absolute inset-y-0 right-0 w-3/4 opacity-10 pointer-events-none">
            {isPingActive && chartPath && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="pingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={chartArea} fill="url(#pingGrad)" />
                <motion.path d={chartPath} fill="none" stroke="var(--emerald)" strokeWidth="0.5" />
              </svg>
            )}
          </div>

          <div className="relative z-10 p-5 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-6">
              
              <div className="flex flex-col items-center md:flex-row md:items-end gap-5 md:gap-6 w-full">
                {/* Avatar ring */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-br from-[var(--neon)] via-[var(--emerald)] to-[var(--mint)] shadow-[var(--glow)]">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-2xl md:text-3xl font-black text-white bg-[var(--bg2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon)]/20 to-transparent" />
                    <span className="relative z-10">{getInitials(displayName)}</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--border2)] rounded-full px-2 py-0.5 shadow-lg">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--neon)]"></span>
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--neon)]">Live</span>
                </div>
              </div>

              {/* Name / role / email */}
              <div className="text-center md:text-left flex-1 space-y-2">
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2">
                  <h1 className="text-2xl md:text-4xl font-black text-[var(--text)] tracking-tight leading-none">
                    {displayName}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--emerald)]/10 to-[var(--neon)]/10 border border-[var(--border2)] text-[var(--emerald)]">
                    {displayRole}
                  </span>
                </div>
                <p className="text-xs font-medium text-[var(--muted)] flex items-center justify-center md:justify-start gap-1.5">
                  <Mail size={12} className="text-[var(--emerald)]" />
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* Account Settings Button */}
            {onTabChange && (
              <button
                onClick={() => onTabChange('account-center')}
                className="absolute top-5 right-5 md:static flex items-center gap-2 px-4 h-9 md:h-10 bg-[var(--neon)] text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer hover:opacity-90 active:scale-95 shadow-[0_0_16px_rgba(var(--particle-rgb),0.3)] shrink-0 z-20"
              >
                <ShieldCheck size={14} />
                <span className="hidden sm:inline">Account Settings</span>
                <span className="sm:hidden">Settings</span>
              </button>
            )}
          </div>

            {/* Stat chips — 3 columns on mobile */}
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { label: 'Registered', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2024', icon: Calendar, color: 'var(--emerald)' },
                { label: 'Security', value: 'Enterprise', icon: ShieldCheck, color: 'var(--mint)' },
                { label: 'Latency', value: lastPing !== null ? `${lastPing}ms` : '--', icon: Signal, color: 'var(--neon)' },
              ].map((chip) => (
                <div key={chip.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--bg)]/60 border border-[var(--border)] backdrop-blur-xl">
                  <chip.icon size={13} style={{ color: chip.color }} />
                  <div className="text-center">
                    <div className="text-[9px] font-semibold text-[var(--muted2)] uppercase tracking-wide leading-none">{chip.label}</div>
                    <div className="text-[10px] font-bold text-[var(--text)] mt-0.5 leading-none">{chip.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* LEFT – Telemetry Console */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7 bg-[var(--card-bg)] border border-[var(--border2)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]/50">
              <div className="p-2 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20">
                <Activity className="w-4 h-4 text-[var(--neon)]" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--text)] tracking-wide leading-none">Session Gateway Telemetry</h2>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">Real-time connection pipeline & performance metrics.</p>
              </div>
            </div>

            {/* Stats Grid — 2 cols on mobile */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Sync Frequency', value: '2.0s cycle' },
                { label: 'Frames Tx/Rx', value: `${framesSent}/${framesReceived}` },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-[var(--bg)]/60 border border-[var(--border)] flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase text-[var(--muted2)] tracking-wider leading-none">{s.label}</span>
                  <span className="text-[11px] md:text-sm font-bold text-[var(--text)] font-mono mt-1">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Load bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[var(--border)]/30">
              {[
                { label: 'Server CPU Load', value: `${cpuUsage}%`, pct: cpuUsage, max: 100, Icon: Cpu, color: 'var(--neon)' },
                { label: 'Active Memory', value: `${memoryUsage} MB`, pct: (memoryUsage / 512) * 100, max: 100, Icon: HardDrive, color: 'var(--emerald)' },
              ].map(item => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-[8px] font-black uppercase text-[var(--muted2)] tracking-wider">
                      <item.Icon size={9} style={{ color: item.color }} />{item.label}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--text)] font-bold">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg)] border border-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${item.color}80, ${item.color})`, boxShadow: `0 0 6px ${item.color}` }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ type: "spring", stiffness: 60 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Console Log */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-[var(--muted2)] tracking-wider">
                <Terminal size={9} /> Gateway Activity Log Stream
              </div>
              <div className="bg-black/40 border border-[var(--border)] rounded-xl p-3 font-mono text-[10px] overflow-y-auto no-scrollbar text-[var(--neon)]/90 space-y-1.5 flex flex-col-reverse min-h-[100px] max-h-[150px]">
                {consoleLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed whitespace-pre-wrap opacity-90 border-l border-[var(--neon)]/20 pl-2">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT – Gateway Config */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-5 bg-[var(--card-bg)] border border-[var(--border2)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20">
                  <Server className="w-4 h-4 text-[var(--neon)]" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[var(--text)] tracking-wide leading-none">Gateway Config</h2>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5">Operational integration parameters.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !isPingActive;
                  setIsPingActive(next);
                  const t = new Date().toLocaleTimeString('en-US', { hour12: false });
                  setConsoleLogs(prev => [`[${t}] SYSTEM: Sync ${next ? 'RESUMED' : 'PAUSED'}`, ...prev.slice(0, 8)]);
                  showToast(`Sync telemetry pipeline ${next ? 'resumed' : 'paused'}.`, "info");
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 cursor-pointer active:scale-95 ${isPingActive
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-black'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-black'
                }`}
              >
                <RefreshCw size={10} className={isPingActive ? "animate-spin" : ""} />
                <span className="hidden sm:inline">{isPingActive ? 'Pause Sync' : 'Resume Sync'}</span>
              </button>
            </div>

            {/* Config rows */}
            <div className="space-y-0 flex-1">
              {[
                { label: 'Protocol Type', value: 'WebSocket Secure (WSS)', icon: Activity },
                { label: 'Encryption', value: 'TLS 1.3 / AES-256-GCM', icon: Lock },
                { label: 'Connection Latency', value: lastPing !== null ? `${lastPing} ms` : 'calculating...', icon: Clock },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-[var(--border)]/20 last:border-0">
                  <div className="flex items-center gap-2">
                    <item.icon size={11} className="text-[var(--neon)] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--text)] text-right ml-4 truncate max-w-[130px]">{item.value}</span>
                </div>
              ))}
              {/* Gateway host select */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Globe size={11} className="text-[var(--neon)] shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Gateway Host</span>
                </div>
                <select
                  value={gatewayHost}
                  onChange={(e) => {
                    const h = e.target.value;
                    setGatewayHost(h);
                    const t = new Date().toLocaleTimeString('en-US', { hour12: false });
                    setConsoleLogs(prev => [`[${t}] SYSTEM: Gateway Host routed -> ${h}`, ...prev.slice(0, 8)]);
                    showToast(`Routed to ${h} gateway.`, "success");
                  }}
                  className="bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[9px] font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] px-2 py-1 cursor-pointer transition-all max-w-[130px]"
                >
                  <option value="mm-gateway-us-east.net">US East</option>
                  <option value="mm-gateway-eu-west.net">EU West</option>
                  <option value="mm-gateway-ap-south.net">Asia Pacific</option>
                </select>
              </div>
            </div>

            {/* Node connection diagram */}
            <div className="p-4 rounded-2xl bg-[var(--bg)]/60 border border-[var(--border)] flex items-center justify-between">
              {['Browser', 'Gateway', 'Core API'].map((node, i) => (
                <React.Fragment key={node}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black uppercase text-[var(--muted2)] tracking-wider">{node}</span>
                    <div className="w-6 h-6 rounded-full bg-[var(--neon)]/10 border border-[var(--neon)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="flex-1 h-px border-t border-dashed border-[var(--border2)] mx-1 relative overflow-hidden">
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--neon)]"
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
