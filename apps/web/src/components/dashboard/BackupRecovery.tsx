"use client";

import React, { useState, useEffect } from 'react';
import {
  Database, RotateCcw, Plus, Download, Trash2, Clock,
  FileJson, RefreshCw, User, Zap, Archive, CheckCircle2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';

export const BackupRecovery = () => {
  const { confirm: openConfirm, modalProps } = useConfirmModal();
  const [backups, setBackups] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [backupType, setBackupType] = useState('Full System');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloadMenuOpenId, setDownloadMenuOpenId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const authHeader = () => ({ 'Authorization': `Bearer ${localStorage.getItem('session_token')}` });

  const fetchBackups = async () => {
    try {
      const res = await fetch(`${API}/api/v1/admin/backups`, { headers: authHeader() });
      const data = await res.json();
      if (res.ok) setBackups(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchBackups();
    socket.on('backup_update', (b: any) => setBackups(p => p.some(x => x.id === b.id) ? p : [b, ...p]));
    socket.on('backup_purge', (id: string) => setBackups(p => p.filter(b => b.id !== id)));
    return () => { socket.off('backup_update'); socket.off('backup_purge'); };
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await fetch(`${API}/api/v1/admin/backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ type: backupType })
      });
      if (res.ok) {
        const nb = await res.json();
        setBackups(p => p.some(b => b.id === nb.id) ? p : [nb, ...p]);
      }
    } catch (err) { console.error(err); }
    finally { setIsCreating(false); }
  };

  const handleDelete = (id: string) => openConfirm({
    title: 'Purge Snapshot',
    message: `Permanently delete Snapshot ${id}? This cannot be undone.`,
    confirmText: 'Purge', cancelText: 'Cancel', variant: 'danger',
    onConfirm: async () => {
      try {
        const res = await fetch(`${API}/api/v1/admin/backups/${id}`, { method: 'DELETE', headers: authHeader() });
        if (res.ok) setBackups(p => p.filter(b => b.id !== id));
      } catch (err) { console.error(err); }
    }
  });

  const handleRestore = (id: string) => openConfirm({
    title: 'Restore Snapshot',
    message: `Restore to Snapshot ${id}? This will overwrite the current system state.`,
    confirmText: 'Restore', cancelText: 'Cancel', variant: 'warning',
    onConfirm: async () => {
      setIsRestoring(id);
      try {
        await fetch(`${API}/api/v1/admin/backups/${id}/restore`, { method: 'POST', headers: authHeader() });
      } catch (err) { console.error(err); }
      finally { setIsRestoring(null); }
    }
  });

  const handleDownload = async (id: string, scope: 'all' | 'users' | 'tools' = 'all') => {
    setIsDownloading(`${id}-${scope}`);
    try {
      const res = await fetch(`${API}/api/v1/admin/backups/${id}/download?scope=${scope}`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: `backup-${id}-${scope}.json` });
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) { alert(`Download failed: ${err.message}`); }
    finally { setIsDownloading(null); }
  };

  const totalBytes = backups.reduce((acc, b) => {
    const s = b.size || '0 KB', n = parseFloat(s);
    if (isNaN(n)) return acc;
    if (s.toUpperCase().includes('GB')) return acc + n * 1073741824;
    if (s.toUpperCase().includes('MB')) return acc + n * 1048576;
    if (s.toUpperCase().includes('KB')) return acc + n * 1024;
    return acc + n;
  }, 0);

  const fmtSize = (b: number) =>
    b >= 1073741824 ? (b / 1073741824).toFixed(2) + ' GB'
    : b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB'
    : b >= 1024 ? (b / 1024).toFixed(2) + ' KB' : b + ' B';

  const typeOptions = ['Full System', 'Database Only', 'Delta Sync'];

  return (
    <div className="w-full h-full flex flex-col font-sans min-h-0 gap-3">
      <ConfirmModal {...modalProps} />

      {/* ── Top Bar ── */}
      <div className="flex-none bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0 shadow-sm">
            <Database size={18} className="text-[var(--neon)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse shadow-[0_0_8px_var(--neon)]" />
              <p className="text-[15px] font-black text-[var(--text)] leading-none truncate">Backup & Recovery</p>
            </div>
            <p className="text-[10px] font-semibold text-[var(--muted)] tracking-wide truncate">{backups.length} snapshots · {fmtSize(totalBytes)} stored</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl h-10 px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] focus:outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)] cursor-pointer transition-all hover:bg-[var(--bg2)] w-full md:min-w-[140px]"
            >
              <span>{backupType}</span>
              <ChevronDown size={14} className={`text-[var(--muted)] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[var(--neon)]' : 'group-hover:text-[var(--neon)]'}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden z-50 shadow-xl py-1"
                  >
                    {typeOptions.map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          setBackupType(t);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                          backupType === t ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--text)] hover:bg-[var(--bg)]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 px-5 h-10 rounded-xl bg-[var(--neon)] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50 active:scale-[0.98] transition-all hover:shadow-[0_4px_12px_rgba(var(--particle-rgb),0.3)] shadow-[0_2px_8px_rgba(var(--particle-rgb),0.15)]"
          >
            {isCreating ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
            <span className="hidden sm:inline">{isCreating ? 'Creating…' : 'New Snapshot'}</span>
            <span className="sm:hidden">{isCreating ? 'Wait' : 'New'}</span>
          </button>
        </div>
      </div>

      {/* ── Snapshot List ── */}
      <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl flex flex-col min-h-0 overflow-hidden">

        {/* Table col headers — desktop only */}
        {backups.length > 0 && (
          <div className="hidden md:grid grid-cols-[2fr_2fr_1.2fr_1fr_auto] gap-3 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--bg)]/40 shrink-0">
            {['Snapshot ID', 'Timestamp', 'Protocol', 'Status', ''].map((h, i) => (
              <div key={i} className={`text-[8.5px] font-black text-[var(--muted2)] uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {backups.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                <Archive size={24} className="text-[var(--muted2)]" />
              </div>
              <div>
                <p className="text-[12px] font-black text-[var(--text)] uppercase tracking-wide">No Snapshots Yet</p>
                <p className="text-[10px] text-[var(--muted)] mt-1.5">Create your first snapshot to protect your system state.</p>
              </div>
              <button onClick={handleCreate} disabled={isCreating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--neon)] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                <Plus size={13} /> Initialize Snapshot
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {backups.map((backup, idx) => {
                const isExpanded = expandedId === backup.id;
                return (
                  <motion.div
                    key={backup.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.2) }}
                    className="group relative border-b border-[var(--border)]/60 last:border-0"
                  >
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[2fr_2fr_1.2fr_1fr_auto] gap-3 items-center px-5 py-3 group-hover:bg-[var(--neon)]/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          <FileJson size={14} className="text-[var(--muted)]" />
                        </div>
                        <span className="text-[11px] font-bold text-[var(--text)] font-mono">{backup.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                        <Clock size={11} className="shrink-0" /><span>{backup.date}</span>
                      </div>
                      <span className="inline-flex px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-[8px] font-black text-blue-400 uppercase tracking-widest whitespace-nowrap">{backup.type}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[8.5px] font-black text-emerald-400 uppercase tracking-widest">{backup.status}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => handleRestore(backup.id)} disabled={isRestoring !== null}
                          className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[9px] font-black text-[var(--muted)] hover:text-[var(--neon)] hover:border-[var(--neon)]/40 transition-all cursor-pointer disabled:opacity-40">
                          {isRestoring === backup.id ? <RefreshCw size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                          <span className="hidden lg:inline uppercase tracking-wider">Restore</span>
                        </button>
                        <div className="relative">
                          <button onClick={() => setDownloadMenuOpenId(downloadMenuOpenId === backup.id ? null : backup.id)}
                            className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-blue-400 hover:border-blue-500/40 transition-all cursor-pointer">
                            {isDownloading?.startsWith(backup.id) ? <RefreshCw size={11} className="animate-spin text-blue-400" /> : <Download size={11} />}
                          </button>
                          {downloadMenuOpenId === backup.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setDownloadMenuOpenId(null)} />
                              <div className="absolute right-0 bottom-full mb-2 w-40 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden z-50 shadow-xl">
                                {([['all', 'Full Payload', Database], ['users', 'User Data', User], ['tools', 'Tool Configs', Zap]] as [string, string, any][]).map(([scope, label, Icon]) => (
                                  <button key={scope} onClick={() => { handleDownload(backup.id, scope as any); setDownloadMenuOpenId(null); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-bold text-[var(--text)] hover:bg-blue-500/10 transition-all cursor-pointer border-b border-[var(--border)]/40 last:border-0">
                                    <Icon size={11} /> {label}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <button onClick={() => handleDelete(backup.id)}
                          className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile accordion card */}
                    <div className="md:hidden">
                      <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : backup.id)}>
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          <FileJson size={15} className="text-[var(--muted)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-black text-[var(--text)] font-mono truncate">{backup.id}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-[var(--muted)] font-mono">{backup.date}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--muted2)]" />
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-500/10 text-[8px] font-black text-blue-400 uppercase">{backup.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <ChevronDown size={15} className={`text-[var(--muted2)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--bg)]/40 space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-2.5">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted2)] mb-1">Size</p>
                                  <p className="text-[11px] font-bold text-[var(--text)]">{backup.size || '—'}</p>
                                </div>
                                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-2.5">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted2)] mb-1">Status</p>
                                  <p className="text-[11px] font-bold text-emerald-400">{backup.status}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => { setExpandedId(null); handleRestore(backup.id); }} disabled={isRestoring !== null}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 text-[var(--neon)] text-[10px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-40 active:scale-95 transition-all">
                                  {isRestoring === backup.id ? <RefreshCw size={12} className="animate-spin" /> : <RotateCcw size={12} />} Restore
                                </button>
                                <div className="relative">
                                  <button onClick={() => setDownloadMenuOpenId(downloadMenuOpenId === backup.id ? null : backup.id)}
                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                                    <Download size={12} /> Save
                                  </button>
                                  {downloadMenuOpenId === backup.id && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={() => setDownloadMenuOpenId(null)} />
                                      <div className="absolute right-0 bottom-full mb-2 w-40 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden z-50 shadow-xl">
                                        {([['all', 'Full Payload', Database], ['users', 'User Data', User], ['tools', 'Tool Configs', Zap]] as [string, string, any][]).map(([scope, label, Icon]) => (
                                          <button key={scope} onClick={() => { handleDownload(backup.id, scope as any); setDownloadMenuOpenId(null); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-bold text-[var(--text)] hover:bg-blue-500/10 transition-all cursor-pointer border-b border-[var(--border)]/40 last:border-0">
                                            <Icon size={11} /> {label}
                                          </button>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <button onClick={() => { setExpandedId(null); handleDelete(backup.id); }}
                                  className="flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 cursor-pointer active:scale-95 transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {backups.length > 0 && (
          <div className="shrink-0 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg)]/30 flex items-center justify-between">
            <p className="text-[8.5px] font-bold text-[var(--muted2)] uppercase tracking-widest">{backups.length} snapshot{backups.length !== 1 ? 's' : ''} · {fmtSize(totalBytes)}</p>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-400" />
              <p className="text-[8.5px] font-bold text-emerald-400 uppercase tracking-widest">All verified</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
