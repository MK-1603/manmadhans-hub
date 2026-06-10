"use client";

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Search, User, Settings, Layers, Clock,
  Bot, Activity, Download, Shield, Hash, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';

const getActionConfig = (action: string = '') => {
  const a = action.toLowerCase();
  if (a.includes('tool')) return { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', pill: 'bg-emerald-500/15 text-emerald-400', bar: 'bg-emerald-500' };
  if (a.includes('sector')) return { icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', pill: 'bg-blue-500/15 text-blue-400', bar: 'bg-blue-500' };
  if (a.includes('delete') || a.includes('ban') || a.includes('invite') || a.includes('identity') || a.includes('purged')) return { icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', pill: 'bg-rose-500/15 text-rose-400', bar: 'bg-rose-500' };
  if (a.includes('settings') || a.includes('flag') || a.includes('keys') || a.includes('rotated') || a.includes('snapshot')) return { icon: Settings, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', pill: 'bg-amber-500/15 text-amber-400', bar: 'bg-amber-500' };
  return { icon: Activity, color: 'text-[var(--neon)]', bg: 'bg-[var(--neon)]/10 border-[var(--neon)]/20', badge: 'bg-[var(--neon)]/10 text-[var(--neon)] border-[var(--neon)]/20', pill: 'bg-[var(--neon)]/15 text-[var(--neon)]', bar: 'bg-[var(--neon)]' };
};

const getInitials = (name: string = '') => {
  const clean = name.includes('@') ? name.split('@')[0] : name;
  return clean.slice(0, 2).toUpperCase();
};

const FILTERS = ['All Actions', 'Tool Approvals', 'Sector Changes', 'User Bans', 'System Settings'];

export const AuditLog = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Actions');
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/audit-logs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token')}` }
    }).then(r => r.json()).then(d => { if (Array.isArray(d)) setEvents(d); }).catch(console.error);
    socket.on('audit_log_update', (e: any) => setEvents(p => [e, ...p]));
    return () => { socket.off('audit_log_update'); };
  }, []);

  const filtered = events.filter(event => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (event.admin?.toLowerCase() || '').includes(q) ||
      (event.action?.toLowerCase() || '').includes(q) ||
      (event.target?.toLowerCase() || '').includes(q) ||
      (event.details?.toLowerCase() || '').includes(q);
    let matchFilter = true;
    if (filter === 'Tool Approvals') matchFilter = event.action?.toLowerCase().includes('tool');
    else if (filter === 'Sector Changes') matchFilter = event.action?.toLowerCase().includes('sector');
    else if (filter === 'User Bans') matchFilter = event.action?.toLowerCase().includes('delete') || event.action?.toLowerCase().includes('ban') || event.action?.toLowerCase().includes('invite') || event.action?.toLowerCase().includes('identity');
    else if (filter === 'System Settings') matchFilter = event.action?.toLowerCase().includes('settings') || event.action?.toLowerCase().includes('flag') || event.action?.toLowerCase().includes('snapshot');
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Total', value: events.length, icon: ClipboardList, color: 'text-[var(--neon)]' },
    { label: 'Tools', value: events.filter(e => e.action?.toLowerCase().includes('tool')).length, icon: Bot, color: 'text-emerald-400' },
    { label: 'Users', value: events.filter(e => e.action?.toLowerCase().includes('ban') || e.action?.toLowerCase().includes('invite') || e.action?.toLowerCase().includes('identity')).length, icon: User, color: 'text-rose-400' },
    { label: 'System', value: events.filter(e => e.action?.toLowerCase().includes('settings') || e.action?.toLowerCase().includes('snapshot')).length, icon: Settings, color: 'text-amber-400' },
  ];

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
                const cfg = getActionConfig(selected.action);
                const IconCmp = cfg.icon;
                const displayName = selected.admin?.includes('@') ? selected.admin.split('@')[0] : (selected.admin || '—');
                return (
                  <>
                    <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--bg)]/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                          <span className="text-[10px] font-black text-[var(--neon)]">{getInitials(selected.admin)}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-[var(--text)] leading-none">{displayName}</p>
                          <p className="text-[9px] text-[var(--muted)] font-mono mt-0.5">{selected.id}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] cursor-pointer"><X size={15} /></button>
                    </div>
                    <div className="p-5 space-y-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${cfg.badge}`}>
                        <IconCmp size={11} /> {selected.action}
                      </span>
                      {selected.details && (
                        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3.5">
                          <p className="text-[8.5px] font-black uppercase tracking-widest text-[var(--muted)] mb-1.5">Details</p>
                          <p className="text-[12px] text-[var(--text)]">{selected.details}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted2)] mb-1">Target</p>
                          <p className={`text-[11px] font-bold truncate ${cfg.color}`}>{selected.target || '—'}</p>
                        </div>
                        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted2)] mb-1">Time</p>
                          <p className="text-[11px] font-bold text-[var(--text)] font-mono">{selected.time}</p>
                        </div>
                      </div>
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
            <div className="w-9 h-9 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
              <ClipboardList size={16} className="text-[var(--neon)]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                <p className="text-[14px] font-black text-[var(--text)] leading-none">Audit Log</p>
              </div>
              <p className="text-[9px] text-[var(--muted)] mt-0.5">{filtered.length} of {events.length} events · Immutable</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-[var(--text)] transition-colors">
            <Download size={12} /><span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map(s => (
            <div key={s.label} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 flex items-center gap-2">
              <s.icon size={13} className={`${s.color} shrink-0`} />
              <div>
                <p className={`text-[15px] font-black leading-none ${s.color}`}>{s.value}</p>
                <p className="text-[7px] font-bold text-[var(--muted2)] uppercase tracking-wide mt-0.5 hidden sm:block">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted2)]" />
            <input type="text" placeholder="Search admin, action, target…" value={search} onChange={e => setSearch(e.target.value)}
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

        {/* Desktop col headers */}
        {filtered.length > 0 && (
          <div className="hidden md:grid grid-cols-[110px_1fr_1.5fr_1fr_auto] gap-3 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg)]/40 shrink-0">
            {['Event ID', 'Administrator', 'Action', 'Target', 'Time'].map((h, i) => (
              <div key={h} className={`text-[8.5px] font-black text-[var(--muted2)] uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 h-full text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                <ClipboardList size={22} className="text-[var(--muted2)]" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[var(--muted2)]">No audit events found</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((event, idx) => {
                const cfg = getActionConfig(event.action);
                const IconCmp = cfg.icon;
                const displayName = event.admin?.includes('@') ? event.admin.split('@')[0] : (event.admin || '—');
                return (
                  <motion.div key={event.id || idx}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.02, 0.2) }}
                    className="group relative border-b border-[var(--border)]/50 last:border-0"
                  >
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[110px_1fr_1.5fr_1fr_auto] gap-3 items-center px-4 py-3 group-hover:bg-[var(--neon)]/[0.02] transition-colors">
                      <div className="flex items-center gap-1.5">
                        <Hash size={10} className="text-[var(--muted2)] shrink-0" />
                        <span className="text-[10px] font-bold font-mono text-[var(--muted)] truncate">{event.id}</span>
                      </div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-black text-[var(--neon)]">{getInitials(event.admin)}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[var(--text)] truncate">{displayName}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit ${cfg.badge}`}>
                          <IconCmp size={10} /> {event.action}
                        </span>
                        {event.details && <span className="text-[9px] text-[var(--muted)] truncate max-w-[200px] mt-0.5">{event.details}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <IconCmp size={9} className={cfg.color} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wide truncate ${cfg.color}`}>{event.target}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--muted)] whitespace-nowrap justify-end">
                        <Clock size={10} className="shrink-0" />
                        <span className="text-[9px] font-mono">{event.time}</span>
                      </div>
                    </div>

                    {/* Mobile row */}
                    <button onClick={() => setSelected(event)} className="md:hidden w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer active:bg-[var(--neon)]/[0.03] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-[var(--neon)]">{getInitials(event.admin)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[12px] font-bold text-[var(--text)] truncate">{displayName}</p>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[7.5px] font-black uppercase tracking-widest ${cfg.pill}`}>
                            <IconCmp size={9} className="inline mr-0.5" />{event.action?.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.target && <span className={`text-[9px] font-bold truncate ${cfg.color}`}>{event.target}</span>}
                          <span className="text-[var(--muted2)]">·</span>
                          <span className="flex items-center gap-1 text-[9px] text-[var(--muted)] font-mono whitespace-nowrap"><Clock size={9} />{event.time}</span>
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

        {filtered.length > 0 && (
          <div className="shrink-0 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg)]/30 flex items-center justify-between">
            <p className="text-[8.5px] font-bold text-[var(--muted2)] uppercase tracking-widest">{filtered.length} of {events.length} events</p>
            <p className="text-[8.5px] font-bold text-[var(--neon)] uppercase tracking-widest">Live · Immutable</p>
          </div>
        )}
      </div>
    </div>
  );
};
