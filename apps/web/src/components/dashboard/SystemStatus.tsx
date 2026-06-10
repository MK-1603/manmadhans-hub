"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  Globe, 
  Zap, 
  Wifi, 
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { socket } from '@/lib/socket';

const iconMap: any = {
  api: Server,
  db: Database,
  inference: Cpu,
  cdn: Globe,
  ws: Zap,
  s3: HardDrive
};

const SystemNode = ({ name, status, load, uptime, type }: any) => {
  const Icon = iconMap[type] || Server;
  const isOperational = status === 'Operational';
  const loadNum = parseFloat(load) || 0;
  const loadColor = loadNum > 80 ? 'from-red-500 to-rose-400' : loadNum > 60 ? 'from-amber-500 to-orange-400' : 'from-emerald-500 to-green-400';
  const loadGlow = loadNum > 80 ? 'shadow-[0_0_12px_rgba(239,68,68,0.4)]' : loadNum > 60 ? 'shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'shadow-[0_0_12px_rgba(16,185,129,0.4)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[2rem] p-5 hover:border-[var(--border2)] transition-all duration-300 group shadow-[var(--shadow-card)] backdrop-blur-xl relative overflow-hidden text-left flex flex-col justify-between"
    >
      {/* Accent glow */}
      <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${isOperational ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : 'bg-amber-500/5 group-hover:bg-amber-500/10'}`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${isOperational ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${isOperational ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOperational ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-amber-500 animate-pulse'}`} />
              {status}
            </div>
            <span className="text-[9px] font-bold font-mono text-[var(--muted2)] uppercase tracking-widest">{uptime} uptime</span>
          </div>
        </div>

        <div className="space-y-1 mb-5">
          <h3 className="text-[14px] font-bold text-[var(--text)] uppercase tracking-wide group-hover:text-[var(--neon)] transition-colors">{name}</h3>
          <p className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest font-mono">{type?.toUpperCase()} Service Node</p>
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black uppercase tracking-widest font-mono text-[var(--muted2)]">Load</span>
          <span className={`text-[10px] font-black font-mono ${loadNum > 80 ? 'text-red-400' : loadNum > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{load}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--bg4)]/50 rounded-full overflow-hidden border border-[var(--border)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${load}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${loadColor} ${loadGlow}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const SystemStatus = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [latency, setLatency] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    socket.on('system_telemetry', (telemetry: any) => {
      if (telemetry) {
        setNodes(telemetry.nodes);
        setLatency(telemetry.latency);
      }
    });

    socket.emit('request_telemetry');

    return () => {
      socket.off('system_telemetry');
    };
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    socket.emit('trigger_sync');
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const operationalCount = nodes.filter(n => n.status === 'Operational').length;
  const degradedCount = nodes.filter(n => n.status !== 'Operational').length;
  const allOperational = degradedCount === 0 && nodes.length > 0;
  const avgLoad = nodes.length > 0 ? (nodes.reduce((a, n) => a + (parseFloat(n.load) || 0), 0) / nodes.length).toFixed(1) : '—';

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans text-left pb-6 md:pb-12">

      {/* ── Hero Header ── */}
      <div className="flex-none mb-6">
        <div className="relative rounded-[2rem] overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow-card)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/4 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-8 w-48 h-48 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${allOperational ? 'bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.2)]' : nodes.length === 0 ? 'bg-[var(--bg4)] border-[var(--border)]' : 'bg-amber-500/15 border-amber-500/30'}`}>
                <Activity className={`w-7 h-7 ${allOperational ? 'text-emerald-400' : nodes.length === 0 ? 'text-[var(--muted)]' : 'text-amber-400'}`} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${allOperational ? 'bg-emerald-500 animate-pulse' : nodes.length === 0 ? 'bg-[var(--muted2)]' : 'bg-amber-500 animate-pulse'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${allOperational ? 'text-emerald-400' : nodes.length === 0 ? 'text-[var(--muted)]' : 'text-amber-400'}`}>
                    {nodes.length === 0 ? 'Connecting...' : allOperational ? 'All Systems Operational' : 'Degraded Performance'}
                  </span>
                </div>
                <h1 className="font-royal text-2xl md:text-3xl font-bold text-[var(--text)] leading-tight">
                  System Cluster Status
                </h1>
                <p className="text-[11px] md:text-[13px] font-medium text-[var(--muted)] tracking-wide max-w-md">
                  Real-time telemetry and resource usage from distributed compute nodes
                </p>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>Synchronize Nodes</span>
            </button>
          </div>

          {/* Quick stats row */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Nodes', value: nodes.length || '—', icon: <Server size={16} />, color: 'text-[var(--text)]', bg: 'bg-[var(--bg4)]/50 border-[var(--border)]' },
              { label: 'Operational', value: operationalCount || '—', icon: <CheckCircle2 size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Degraded', value: degradedCount || '—', icon: <AlertCircle size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Avg. Load', value: `${avgLoad}%`, icon: <TrendingUp size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.bg}`}
              >
                <span className={s.color}>{s.icon}</span>
                <div>
                  <div className={`text-xl font-black ${s.color} leading-none`}>{s.value}</div>
                  <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12 space-y-6 pr-0.5">
        
        {/* Service Node Grid */}
        {nodes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-[var(--card-bg)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {nodes.map((node, i) => (
              <motion.div key={node.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                <SystemNode
                  name={node.name}
                  status={node.status}
                  load={node.load}
                  uptime={node.uptime}
                  type={node.type}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Connectivity Matrix */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-[var(--shadow-card)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-[12px] font-black text-[var(--text)] uppercase tracking-wider">Inter-Node Connectivity Matrix</h3>
                <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">Global latency scan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-[8px] font-black text-blue-400/60 uppercase tracking-widest font-mono">Scanning...</span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {latency.length === 0
              ? ['US-East', 'EU-West', 'AS-South', 'US-West', 'EU-Central', 'SA-East'].map(region => (
                <div key={region} className="p-3.5 rounded-xl bg-[var(--bg4)]/30 border border-[var(--border)] flex flex-col items-center gap-2 animate-pulse">
                  <span className="text-[8px] font-black text-[var(--muted2)] uppercase tracking-wider font-mono">{region}</span>
                  <span className="text-[10px] font-bold text-[var(--muted2)] font-mono">--ms</span>
                </div>
              ))
              : latency.map(loc => {
                const ping = parseFloat(loc.ping) || 0;
                const pingColor = ping < 50 ? 'text-emerald-400' : ping < 100 ? 'text-amber-400' : 'text-red-400';
                const dotColor = ping < 50 ? 'bg-emerald-500' : ping < 100 ? 'bg-amber-500' : 'bg-red-500';
                return (
                  <motion.div
                    key={loc.region}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-xl bg-[var(--bg4)]/30 border border-[var(--border)] flex flex-col items-center gap-2 hover:border-[var(--border2)] transition-all group cursor-default"
                  >
                    <span className="text-[8px] font-black text-[var(--muted)] uppercase tracking-wider font-mono group-hover:text-[var(--text)] transition-colors">{loc.region}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
                      <span className={`text-[11px] font-black font-mono ${pingColor}`}>{loc.ping}ms</span>
                    </div>
                  </motion.div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};
