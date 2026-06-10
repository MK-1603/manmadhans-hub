"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, ShieldCheck, Search, UserPlus, Shield, Clock, Eye,
  Trash2, Lock, Edit2, Activity, Crown, ArrowUpRight,
  RefreshCw, ChevronRight, Mail, User, Timer, Send, Check,
  Copy, CheckCircle2, Plus, Globe, X, ArrowLeft, ShieldAlert,
  ChevronDown, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';
import { useToast } from './ToastContext';
import { EditIdentityView } from './EditIdentityView';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const grad = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const sz = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-[13px]', lg: 'w-11 h-11 text-[15px]' }[size];
  return (
    <div className={`${sz} rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center font-black text-white shadow-md shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
};

const RoleBadge = ({ role }: { role: string }) => {
  const isSuper = role?.toLowerCase().includes('super');
  const isOwner = role?.toLowerCase().includes('owner');
  if (isSuper || isOwner) return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${isSuper ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-blue-500/10 border-blue-500/25 text-blue-400'}`}>
      {isSuper ? <Crown size={9} /> : <Shield size={9} />}{role}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border bg-[var(--bg)] border-[var(--border2)] text-[var(--muted)]">
      <Users size={9} />{role || 'Member'}
    </span>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const isActive = status === 'Active';
  const isPending = status === 'Pending';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-400' : isPending ? 'text-amber-400' : 'text-rose-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : isPending ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`} />
      {status || 'Inactive'}
    </span>
  );
};

// ─── Inline Invite Form ───────────────────────────────────────────────────────
const InviteForm = ({ onClose }: { onClose: () => void }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Member');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('session_token')}` },
        body: JSON.stringify({ email, username, role }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.invitationMessage || data.link || '');
        showToast(`Invite sent to ${email}`, 'success');
      } else {
        showToast(data.message || 'Failed to send invite.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast('Invitation link copied!', 'success');
    setTimeout(() => { setCopied(false); setResult(''); setEmail(''); setUsername(''); setRole('Member'); }, 1800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
          </button>
          <div>
            <h3 className="text-[14px] font-black text-[var(--text)] tracking-tight">Invite User</h3>
            <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mt-0.5">Send access invitation</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center">
          <Mail size={16} className="text-[var(--neon)]" />
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 h-full"
            >
              {/* Email */}
              <div>
                <label className="block text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.18em] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted2)]" />
                  <input
                    required type="email" placeholder="user@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text)] placeholder:text-[var(--muted2)] focus:outline-none focus:border-[var(--neon)]/50 transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.18em] mb-1.5">Username</label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted2)]" />
                  <input
                    required type="text" placeholder="Username"
                    value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text)] placeholder:text-[var(--muted2)] focus:outline-none focus:border-[var(--neon)]/50 transition-all"
                  />
                </div>
              </div>



              {/* Info */}
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <ShieldCheck size={14} className="text-[var(--neon)] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[var(--muted)] leading-relaxed">User will receive a secure invitation link to join the platform.</p>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!email || !username || isLoading}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden w-full h-11 mt-auto rounded-xl bg-[var(--neon)] text-black text-[11px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg shadow-[var(--neon)]/10"
              >
                {isLoading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw size={13} />
                    </motion.div>
                    Sending…
                  </>
                ) : (
                  <><Send size={13} /> Send Invitation</>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 h-full"
            >
              {/* Success badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-[12px] font-bold text-emerald-400">Invitation generated successfully!</p>
              </div>

              {/* Result box */}
              <div className="rounded-xl border border-[var(--border)] flex flex-col min-h-[160px]">
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg)] border-b border-[var(--border)] shrink-0">
                  <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">Invitation Details</span>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${copied
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-[var(--card-bg)] border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                  >
                    {copied ? <><Check size={10} /> Copied!</> : <><Copy size={10} /> Copy</>}
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
                  <p className="text-[11px] font-mono text-[var(--text)] leading-relaxed whitespace-pre-wrap select-all">{result}</p>
                </div>
              </div>

              <button
                onClick={() => { setResult(''); setEmail(''); setUsername(''); setRole('Member'); }}
                className="w-full h-11 mt-auto rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[10px] font-black text-[var(--muted)] uppercase tracking-wider hover:text-[var(--text)] hover:border-[var(--border2)] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Plus size={12} /> New Invitation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const IdentityManagement = ({ onInviteClick }: { onInviteClick?: () => void }) => {
  const { showToast } = useToast();
  const [identities, setIdentities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'invite'>('list');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<{ id: string; name: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loggedInRole = typeof window !== 'undefined'
    ? (localStorage.getItem('user_role') || '').toLowerCase() === 'owner' ? 'owner' : 'member'
    : 'member';

  const fetchIdentities = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) return;
    const cached = localStorage.getItem('offline_identities_data');
    if (cached) { try { setIdentities(JSON.parse(cached)); } catch { } }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/identities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const parsed = data.map((u: any) => ({ ...u, name: u.username || u.name || 'Unknown' }));
        setIdentities(parsed);
        localStorage.setItem('offline_identities_data', JSON.stringify(parsed));
      }
    } catch {
      if (!localStorage.getItem('offline_identities_data')) showToast('Failed to load users.', 'error');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchIdentities();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/identities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('session_token')}` },
      });
      if (res.ok) { showToast(`${name} removed.`, 'success'); fetchIdentities(); }
      else { const d = await res.json(); showToast(d.message || 'Delete failed.', 'error'); }
    } catch { showToast('Network error.', 'error'); }
  };

  const handleExportJSON = () => {
    const exportData = identities.map(u => ({
      id: u.id,
      display_id: u.display_id,
      username: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      created_at: u.created_at,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `identity_matrix_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchIdentities();
    if (!socket.connected) socket.connect();
    socket.on('identities_update', (d: any[]) => setIdentities(d));
    socket.on('refresh_matrix', fetchIdentities);
    return () => { socket.off('identities_update'); socket.off('refresh_matrix'); };
  }, []);

  const stats = useMemo(() => ({
    total: identities.length,
    active: identities.filter(e => e.status === 'Active').length,
    admins: identities.filter(e => e.role?.toLowerCase().includes('owner')).length,
    inactive: identities.filter(e => e.status !== 'Active').length,
  }), [identities]);

  const filtered = identities.filter(e => {
    const q = searchQuery.toLowerCase();
    const mQ = (e.name || '').toLowerCase().includes(q) || (e.email || '').toLowerCase().includes(q);
    const mF = activeFilter === 'All'
      || (e.role && e.role.toLowerCase() === activeFilter.toLowerCase())
      || (e.status && e.status.toLowerCase() === activeFilter.toLowerCase());
    return mQ && mF;
  });

  // ── Edit view ──
  if (viewMode === 'edit' && selectedUser) {
    return (
      <EditIdentityView
        user={selectedUser}
        onBack={() => setViewMode('list')}
        onSuccess={() => { setViewMode('list'); fetchIdentities(); }}
      />
    );
  }

  // ── Invite view ──
  if (viewMode === 'invite') {
    return (
      <div className="h-full flex flex-col md:items-center md:justify-center md:p-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-full max-w-md h-full bg-transparent border-transparent md:bg-[var(--card-bg)] md:border-[var(--border)] md:rounded-2xl md:p-6 md:shadow-xl">
          <InviteForm onClose={() => setViewMode('list')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-auto md:h-[520px] min-h-0">
      {/* Header Row */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[14px] font-black text-[var(--text)] tracking-tight">Identity Matrix</h3>
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{stats.total} registered · {stats.active} active</p>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={handleRefresh}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-all cursor-pointer shadow-sm"
          >
            <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
              <RefreshCw size={13} />
            </motion.div>
          </motion.button>
          {identities.length > 0 && (
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--neon)]/50 shadow-sm"
              title="Export Identity Matrix as JSON"
            >
              <Download size={13} /> Export
            </button>
          )}
          <button
            onClick={() => setViewMode('invite')}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer bg-[var(--neon)] text-black hover:opacity-90 shadow-lg shadow-[var(--neon)]/15"
          >
            <UserPlus size={13} /> Invite User
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Active', value: stats.active, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Admins', value: stats.admins, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Offline', value: stats.inactive, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4 text-center shadow-sm`}>
            <p className={`text-xl font-black ${s.color} leading-none`}>{s.value}</p>
            <p className="text-[9px] text-[var(--muted)] uppercase tracking-wider mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted2)]" />
          <input
            type="text" placeholder="Search users by name or email…"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text)] placeholder:text-[var(--muted2)] focus:outline-none focus:border-[var(--neon)]/50 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Owner', 'Member', 'Active', 'Inactive'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap border transition-all cursor-pointer shadow-sm ${activeFilter === f
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                }`}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="md:flex-1 min-h-0 md:rounded-2xl md:border border-[var(--border)] border-transparent bg-transparent md:bg-[var(--card-bg)] flex flex-col md:overflow-hidden md:shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
              <Users size={24} className="text-[var(--muted2)]" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-black text-[var(--text)]">No users found</p>
              <p className="text-[11px] text-[var(--muted)] mt-1">Adjust filters or invite a new user.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:flex flex-col flex-1 min-h-0">
              <div className="shrink-0 grid grid-cols-[3fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 bg-[var(--bg)] border-b border-[var(--border)]">
                {['User Profile', 'System ID', 'Role Clearance', 'Node Status', 'Actions'].map(h => (
                  <div key={h} className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{h}</div>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <AnimatePresence>
                  {filtered.map((entity, idx) => (
                    <motion.div
                      key={entity.id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      onMouseEnter={() => setHoveredRow(entity.id)} onMouseLeave={() => setHoveredRow(null)}
                      className={`grid grid-cols-[3fr_2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-[var(--border)]/40 last:border-0 transition-colors duration-150 ${hoveredRow === entity.id ? 'bg-[var(--bg)]/60' : ''}`}
                    >
                      {/* User Profile */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <Avatar name={entity.name} size="md" />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[var(--card-bg)] ${entity.status === 'Active' ? 'bg-emerald-400' : entity.status === 'Pending' ? 'bg-amber-400' : 'bg-[var(--border2)]'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-[var(--text)] truncate">{entity.name}</p>
                          <p className="text-[10px] text-[var(--muted2)] truncate">{entity.email}</p>
                        </div>
                      </div>

                      {/* System ID */}
                      <div className="text-[10px] font-mono text-[var(--muted2)] tracking-wider">
                        #{String(entity.display_id || entity.id).slice(0, 10).toUpperCase()}
                      </div>

                      <RoleBadge role={entity.role} />
                      <StatusPill status={entity.status} />

                      {/* Actions */}
                      <div className={`flex items-center gap-1.5 transition-opacity duration-150 ${hoveredRow === entity.id ? 'opacity-100' : 'opacity-0'}`}>
                        {loggedInRole === 'owner' && (
                          <>
                            <button onClick={() => { setSelectedUser(entity); setViewMode('edit'); }}
                              className="w-8 h-8 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer shadow-sm">
                              <Edit2 size={12} />
                            </button>
                            <button onClick={() => setDeleteConfirmUser({ id: entity.id, name: entity.name })}
                              className="w-8 h-8 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-rose-400 hover:border-rose-400/30 transition-all cursor-pointer shadow-sm">
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="flex md:hidden flex-col gap-3 pb-4">
              <AnimatePresence>
                {filtered.map((entity, idx) => (
                  <motion.div key={entity.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.025, duration: 0.2 }}
                    className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={entity.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-[var(--text)] truncate">{entity.name}</p>
                          <p className="text-[9px] text-[var(--muted2)] truncate">{entity.email}</p>
                        </div>
                      </div>
                      <StatusPill status={entity.status} />
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                      <RoleBadge role={entity.role} />
                      {loggedInRole === 'owner' && (
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedUser(entity); setViewMode('edit'); }}
                            className="px-3 h-8 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center text-[9px] font-black uppercase text-[var(--muted)] hover:text-amber-400 transition-all cursor-pointer shadow-sm">
                            <Edit2 size={10} className="mr-1.5" /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirmUser({ id: entity.id, name: entity.name })}
                            className="px-3 h-8 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center text-[9px] font-black uppercase text-[var(--muted)] hover:text-rose-400 transition-all cursor-pointer shadow-sm">
                            <Trash2 size={10} className="mr-1.5" /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="hidden md:flex shrink-0 border-t border-[var(--border)] px-5 py-3 bg-[var(--bg)] items-center justify-between mt-auto">
          <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">
            {filtered.length} / {identities.length} total users
          </span>
          <span className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest">
            Identity Matrix System v3.0
          </span>
        </div>
      </div>

      {/* ── Delete Modal ── */}
      <AnimatePresence>
        {deleteConfirmUser && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="relative w-full max-w-sm bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center shadow-inner">
                  <Trash2 size={20} className="text-rose-400" />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-[var(--text)] mb-1.5">Remove User Node</h3>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed px-2">
                    Are you sure you want to permanently revoke access for <span className="font-bold text-[var(--text)]">{deleteConfirmUser.name}</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button onClick={() => setDeleteConfirmUser(null)}
                    className="flex-1 h-11 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[10px] font-black text-[var(--text)] uppercase tracking-wider hover:border-[var(--border2)] hover:bg-[var(--card-bg)] transition-all cursor-pointer shadow-sm">
                    Cancel
                  </button>
                  <button onClick={() => { handleDelete(deleteConfirmUser.id, deleteConfirmUser.name); setDeleteConfirmUser(null); }}
                    className="flex-1 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[10px] font-black text-rose-400 uppercase tracking-wider hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer shadow-lg shadow-rose-500/10">
                    Confirm Removal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
