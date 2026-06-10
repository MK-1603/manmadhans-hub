"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert, Search, AlertTriangle, Globe, Clock,
  Zap, ShieldCheck, XCircle, Info,
  Shield, RefreshCw, Activity, X, User, ChevronRight, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';
import { useToast } from './ToastContext';

// API shape: { id, event, severity, source, time, user }
const getSeverityConfig = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical': return {
      iconBg: 'bg-rose-500/10 border-rose-500/20', iconColor: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      pill: 'bg-rose-500/15 text-rose-400',
      bar: 'bg-rose-500', icon: XCircle,
    };
    case 'high': return {
      iconBg: 'bg-amber-500/10 border-amber-500/20', iconColor: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      pill: 'bg-amber-500/15 text-amber-400',
      bar: 'bg-amber-500', icon: AlertTriangle,
    };
    case 'medium': return {
      iconBg: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      pill: 'bg-blue-500/15 text-blue-400',
      bar: 'bg-blue-400', icon: Info,
    };
    default: return {
      iconBg: 'bg-emerald-500/10 border-emerald-500/20', iconColor: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      pill: 'bg-emerald-500/15 text-emerald-400',
      bar: 'bg-emerald-400', icon: ShieldCheck,
    };
  }
};

const FILTERS = ['All Events', 'Critical', 'High', 'Medium', 'Low'];

export const SecurityLog = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Events');
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/security-logs`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('session_token')}` } }
      );
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
      else if (Array.isArray(data?.logs)) setEvents(data.logs);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchEvents();
    if (!socket.connected) socket.connect();
    const handler = (e: any) => setEvents(p => [e, ...p]);
    socket.on('security_log_update', handler);
    return () => { socket.off('security_log_update', handler); };
  }, []);

  const filtered = useMemo(() => events.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !search || e.event?.toLowerCase().includes(q) || e.source?.toLowerCase().includes(q) || e.user?.toLowerCase().includes(q);
    const matchFilter = filter === 'All Events' || e.severity?.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  }), [events, search, filter]);

  const stats = useMemo(() => ({
    total: events.length,
    critical: events.filter(e => e.severity?.toLowerCase() === 'critical').length,
    high: events.filter(e => e.severity?.toLowerCase() === 'high').length,
    medium: events.filter(e => e.severity?.toLowerCase() === 'medium').length,
  }), [events]);

  return (
    <div className="w-full h-full flex flex-col font-sans min-h-0 gap-3">

      {/* Detail modal — bottom-sheet on mobile, centered on desktop */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-t-3xl md:rounded-2xl w-full md:max-w-lg overflow-hidden flex flex-col font-sans"
            >
              {(() => {
                const cfg = getSeverityConfig(selected.severity);
                const IconCmp = cfg.icon;
                return (
                  <>
                    <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--bg)]/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cfg.iconBg}`}><IconCmp size={16} className={cfg.iconColor} /></div>
                        <div>
                          <p className="text-[12px] font-black text-[var(--text)] leading-none">Security Event</p>
                          <p className="text-[9px] text-[var(--muted)] font-mono mt-0.5">{selected.id}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] cursor-pointer"><X size={15} /></button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] mb-2">Event Description</p>
                        <p className="text-[13px] font-bold text-[var(--text)] leading-snug">{selected.event || '—'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[['Severity', selected.severity || 'Low', false], ['Time', selected.time || '—', true], ['Source', selected.source || '—', true], ['User', selected.user || 'System', false]].map(([label, value, mono]) => (
                          <div key={String(label)} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3.5">
                            <p className="text-[8.5px] font-black uppercase tracking-widest text-[var(--muted)] mb-1.5">{label}</p>
                            <p className={`text-[12px] font-bold text-[var(--text)] truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { showToast('Mitigation applied', 'success'); setSelected(null); }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                        <Zap size={14} /> Apply Mitigation
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex-none bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <p className="text-[14px] font-black text-[var(--text)] leading-none">Security Log</p>
              </div>
              <p className="text-[9px] text-[var(--muted)] mt-0.5">{filtered.length} of {events.length} events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchEvents} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-[var(--text)] transition-colors">
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={() => showToast('Threat protocols updated', 'success')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-rose-500/20 transition-colors">
              <Zap size={12} /><span className="hidden sm:inline">Harden</span>
            </button>
          </div>
        </div>

        {/* Mini stats strip */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, color: 'text-[var(--neon)]', icon: Activity },
            { label: 'Critical', value: stats.critical, color: 'text-rose-400', icon: XCircle },
            { label: 'High', value: stats.high, color: 'text-amber-400', icon: ShieldAlert },
            { label: 'Medium', value: stats.medium, color: 'text-blue-400', icon: Info },
          ].map(s => (
            <div key={s.label} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 flex items-center gap-2">
              <s.icon size={13} className={`${s.color} shrink-0`} />
              <div>
                <p className={`text-[15px] font-black leading-none ${s.color}`}>{isLoading ? '—' : s.value}</p>
                <p className="text-[7px] font-bold text-[var(--muted2)] uppercase tracking-wide mt-0.5 hidden sm:block">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted2)]" />
            <input type="text" placeholder="Search event, source, user…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-[12px] bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder:text-[var(--muted2)] focus:outline-none focus:border-[var(--neon)]/40 transition-all" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted2)] cursor-pointer"><X size={12} /></button>}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer border transition-all ${
                  filter === f ? 'bg-[var(--neon)]/10 text-[var(--neon)] border-[var(--neon)]/25' : 'bg-[var(--bg)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Events List ── */}
      <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl flex flex-col min-h-0 overflow-hidden">

        {/* Desktop column headers */}
        {!isLoading && filtered.length > 0 && (
          <div className="hidden md:grid grid-cols-[110px_1fr_1fr_90px_80px_auto] gap-3 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg)]/40 shrink-0">
            {['Severity', 'Event', 'Source', 'User', 'Time', ''].map((h, i) => (
              <div key={i} className={`text-[8.5px] font-black text-[var(--muted2)] uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>{h}</div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="p-4 space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] animate-pulse">
                  <div className="w-20 h-5 rounded-lg bg-[var(--border)]" />
                  <div className="flex-1 h-2.5 bg-[var(--border)] rounded" />
                  <div className="w-20 h-2 bg-[var(--border)] rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 h-full text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                <ShieldCheck size={22} className="text-emerald-400" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[var(--text)]">System Secure</p>
              <p className="text-[10px] text-[var(--muted)]">No events match the current filter</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((event, i) => {
                const cfg = getSeverityConfig(event.severity);
                const IconCmp = cfg.icon;
                return (
                  <motion.div key={event.id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2), duration: 0.18 }} className="group relative border-b border-[var(--border)]/50 last:border-0">

                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[110px_1fr_1fr_90px_80px_auto] gap-3 items-center px-4 py-3 group-hover:bg-[var(--neon)]/[0.02] transition-colors">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit ${cfg.badge}`}>
                        <IconCmp size={10} /> {event.severity || 'Low'}
                      </div>
                      <span className="text-[11px] font-bold text-[var(--text)] truncate">{event.event || '—'}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] font-mono min-w-0">
                        <Globe size={10} className="shrink-0 text-[var(--muted2)]" />
                        <span className="truncate">{event.source || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] min-w-0">
                        <User size={10} className="shrink-0 text-[var(--muted2)]" />
                        <span className="truncate font-mono">{event.user || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--muted)]">
                        <Clock size={10} className="shrink-0" />
                        <span className="text-[9px] font-mono whitespace-nowrap">{event.time || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => setSelected(event)} className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer" title="Details">
                          <Eye size={12} />
                        </button>
                        <button onClick={() => showToast('Mitigation applied', 'success')} className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer" title="Mitigate">
                          <Zap size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile card row */}
                    <button onClick={() => setSelected(event)} className="md:hidden w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer active:bg-[var(--neon)]/[0.03] transition-colors">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                        <IconCmp size={15} className={cfg.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 rounded-md text-[7.5px] font-black uppercase tracking-widest ${cfg.pill}`}>{event.severity || 'Low'}</span>
                        </div>
                        <p className="text-[12px] font-bold text-[var(--text)] truncate">{event.event || '—'}</p>
                        <div className="flex items-center gap-2.5 mt-1">
                          {event.source && <span className="flex items-center gap-1 text-[9px] text-[var(--muted)] font-mono"><Globe size={9} />{event.source}</span>}
                          {event.time && <span className="flex items-center gap-1 text-[9px] text-[var(--muted)] font-mono"><Clock size={9} />{event.time}</span>}
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-[var(--muted2)] shrink-0" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="shrink-0 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg)]/30 flex items-center justify-between">
            <p className="text-[8.5px] font-bold text-[var(--muted2)] uppercase tracking-widest">{filtered.length} of {events.length} events</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <p className="text-[8.5px] font-bold text-rose-400 uppercase tracking-widest">Live Feed Active</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
