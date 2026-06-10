"use client";

import React, { useState, useEffect } from 'react';
import {
  User, Mail, Key, Lock, Save, RefreshCw, Shield, Eye, EyeOff, Activity, ClipboardList, Database,
  Settings, ChevronRight, ArrowLeft, MonitorSmartphone, Smartphone, Monitor, Globe2, Wifi, Trash2, Clock, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';
import { useToast } from './ToastContext';

export const SecuritySettings = ({ onTabChange, onBack }: { onTabChange?: (tabId: string) => void, onBack?: () => void }) => {
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState('profile');
  const [mobileActive, setMobileActive] = useState<string | null>(null);

  // Profile state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [mySessions, setMySessions] = useState<any[]>([]);
  const [sessionRuntime, setSessionRuntime] = useState('00:00:00');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPasskey, setUpdatingPasskey] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Personal Audit Log state
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fetch user profile
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('session_token');
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok && isMounted) {
          const data = await res.json();
          setUsername(data.username);
          setEmail(data.email);
          setUserEmail(data.email);

          fetchAuditLogs(data.email, data.username);
        }
      } catch (err) { console.error(err); }
      finally { if (isMounted) setLoading(false); }
    };

    const fetchAuditLogs = async (userEmail: string, userName: string) => {
      try {
        const token = localStorage.getItem('session_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/audit-logs`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const lowerUserEmail = userEmail ? userEmail.toLowerCase() : '';
            const lowerUserName = userName ? userName.toLowerCase() : '';
            const userEmailPrefix = lowerUserEmail ? lowerUserEmail.split('@')[0] : '';

            const personalLogs = data.filter(e => {
              if (!e.admin) return false;
              const adminLower = e.admin.toLowerCase();
              return adminLower === lowerUserEmail || adminLower === lowerUserName || adminLower === userEmailPrefix;
            });
            setLogs(personalLogs);
          }
        }
      } catch (err) { console.error(err); }
      finally { if (isMounted) setLoadingLogs(false); }
    };

    fetchUser();

    const handleAuditUpdate = (e: any) => {
      if (!isMounted) return;
      if (!e.admin) return;
      const adminLower = e.admin.toLowerCase();
      const lowerEmail = email ? email.toLowerCase() : '';
      const lowerUser = username ? username.toLowerCase() : '';
      const prefix = lowerEmail ? lowerEmail.split('@')[0] : '';
      if (adminLower === lowerEmail || adminLower === lowerUser || adminLower === prefix) {
        setLogs(prev => [e, ...prev]);
      }
    };
    socket.on('audit_log_update', handleAuditUpdate);

    return () => {
      isMounted = false;
      socket.off('audit_log_update', handleAuditUpdate);
    };
  }, [email, username]);

  useEffect(() => {
    let displayName = 'Anonymous';
    if (typeof window !== 'undefined') {
      const rawRole = localStorage.getItem("user_role") || "";
      const role = rawRole.toLowerCase().includes('owner') ? 'owner' : 'member';
      const username = localStorage.getItem("user_name");
      displayName = username || (role === 'owner' ? 'MM1107' : 'AX2201');
    }

    if (socket.connected) {
      socket.emit('request_my_sessions', displayName);
    }
    const onSessionsUpdate = (sessions: any[]) => setMySessions(sessions);
    
    socket.on('sessions_update', onSessionsUpdate);
    const onConnect = () => socket.emit('request_my_sessions', displayName);
    socket.on('connect', onConnect);
    
    return () => {
      socket.off('sessions_update', onSessionsUpdate);
      socket.off('connect', onConnect);
    };
  }, []);

  useEffect(() => {
    const getStartTime = () => {
      const saved = localStorage.getItem("session_start_time");
      if (saved) return parseInt(saved, 10);
      const now = Date.now();
      localStorage.setItem("session_start_time", now.toString());
      return now;
    };
    const start = getStartTime();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const secs = Math.floor(diff / 1000) % 60;
      const mins = Math.floor(diff / 60000) % 60;
      const hrs = Math.floor(diff / 3600000);
      setSessionRuntime(
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/update-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
        body: JSON.stringify({ username, email })
      });
      if (res.ok) {
        showToast("Profile credentials synchronized.", "success");
        setUserEmail(email);
        localStorage.setItem("user_name", username);
        window.dispatchEvent(new Event('storage'));
      } else {
        const data = await res.json();
        showToast(data.error || "Credential synchronization failed.", "error");
      }
    } catch (err) { showToast("Network matrix failure during write.", "error"); }
    finally { setSavingProfile(false); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return showToast("Please fill out all fields.", "error");
    if (newPassword !== confirmPassword) return showToast("New passwords do not match.", "error");
    if (newPassword.length < 8) return showToast("Passkey must be at least 8 characters.", "error");

    setUpdatingPasskey(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, oldPasskey: currentPassword, newPasskey: newPassword })
      });
      if (res.ok) {
        showToast("Access passkey synchronized successfully!", "success");
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        socket.emit('password_changed');
      } else {
        showToast((await res.json()).error || "Credential update rejected.", "error");
      }
    } catch (err) { showToast("Authentication pipeline unreachable.", "error"); }
    finally { setUpdatingPasskey(false); }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: '#ef4444' },
      { score: 2, label: 'Weak', color: '#f97316' },
      { score: 3, label: 'Fair', color: '#f59e0b' },
      { score: 4, label: 'Strong', color: '#10b981' },
      { score: 5, label: 'Very Strong', color: '#3b82f6' },
    ];
    return levels[Math.min(score, 5)];
  };

  const strength = getPasswordStrength(newPassword);

  const formatLogTime = (dateStr: string) => {
    if (!dateStr) return 'Just now';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // fallback if backend returns formatted string
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sections = [
    { id: 'profile', label: 'My Profile', icon: User, desc: 'Update display name and email', color: 'text-[var(--neon)] bg-[var(--neon)]/10 border-[var(--neon)]/20' },
    { id: 'passkey', label: 'Access Passkey', icon: Key, desc: 'Secure your authentication gateway', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { id: 'audit', label: 'Personal Audit Log', icon: ClipboardList, desc: 'Real-time trail of account activity', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { id: 'sessions', label: 'Active Sessions', icon: MonitorSmartphone, desc: 'Manage signed-in devices', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
  ];

  const renderContent = (sectionId: string) => {
    if (sectionId === 'profile') {
      return (
        <div className="p-5 md:p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl h-fit">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-5">
            <div className="p-2 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/25 shrink-0">
              <User className="w-5 h-5 text-[var(--neon)]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">My Profile</h3>
              <p className="text-[10px] text-[var(--muted2)] mt-0.5">Update display name and contact credentials</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5"><User size={12} /> Display Name</label>
              <div className="relative group/field">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)] group-focus-within/field:text-[var(--neon)] transition-colors" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl h-11 pl-11 pr-4 text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5"><Mail size={12} /> Email Address</label>
              <div className="relative group/field">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)] group-focus-within/field:text-[var(--neon)] transition-colors" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl h-11 pl-11 pr-4 text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all" />
              </div>
            </div>
            <div className="pt-3">
              <button type="submit" disabled={savingProfile} className="w-full h-11 rounded-xl bg-[var(--neon)] text-white text-[11px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:shadow-md">
                {savingProfile ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (sectionId === 'passkey') {
      return (
        <div className="p-5 md:p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl h-fit">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/25 shrink-0">
              <Key className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">Access Passkey</h3>
              <p className="text-[10px] text-[var(--muted2)] mt-0.5">Secure your authentication gateway</p>
            </div>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5"><Lock size={12} /> Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl h-11 pl-11 pr-11 text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] cursor-pointer p-1">{showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5"><Lock size={12} /> New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl h-11 pl-11 pr-11 text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] cursor-pointer p-1">{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5"><Lock size={12} /> Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl h-11 pl-11 pr-11 text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] cursor-pointer p-1">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
            </div>
            {newPassword && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between px-1"><span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">Strength</span><span className="text-[9px] font-black uppercase tracking-widest" style={{ color: strength.color }}>{strength.label}</span></div>
                <div className="flex gap-1.5">{[1, 2, 3, 4, 5].map(b => <div key={b} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: b <= strength.score ? strength.color : 'var(--border)' }} />)}</div>
              </div>
            )}
            <div className="pt-3">
              <button type="submit" disabled={updatingPasskey} className="w-full h-11 rounded-xl bg-red-500 text-white text-[11px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:shadow-md">
                {updatingPasskey ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />} {updatingPasskey ? 'Updating...' : 'Update Passkey'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (sectionId === 'audit') {
      return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl">
          <div className="flex-none p-5 md:p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 shrink-0">
                <ClipboardList className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest flex items-center gap-2">
                  Personal Audit Log
                  <span className="px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)] text-[8px] font-black border border-[var(--neon)]/20 animate-pulse">LIVE</span>
                </h3>
                <p className="text-[10px] text-[var(--muted2)] mt-0.5">Real-time trail of your account activities and interactions.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar relative p-5 md:p-6">
            {loadingLogs ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[var(--neon)] animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-50 space-y-3">
                <Database size={32} className="text-[var(--muted2)]" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)]">No Activity Found</p>
                  <p className="text-[10px] text-[var(--muted)]">Your personal audit trail is currently clean.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--neon)]/30 transition-all gap-3 group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shrink-0">
                        <Activity size={14} className="text-[var(--muted2)] group-hover:text-[var(--neon)] transition-colors" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[var(--text)]">{log.action}</p>
                        <p className="text-[10px] text-[var(--muted)] font-mono mt-0.5 max-w-[200px] sm:max-w-xs truncate">{log.details || log.target || 'System interaction recorded'}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right sm:text-right text-left flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
                      <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">{log.time || formatLogTime(log.created_at)}</span>
                      <span className="text-[9px] font-mono text-[var(--neon)]/50 sm:mt-1">{log.ip}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (sectionId === 'sessions') {
      return (
        <div className="p-5 md:p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl h-fit space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 shrink-0">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/25 shrink-0">
              <MonitorSmartphone className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">Your Active Sessions</h3>
              <p className="text-[10px] text-[var(--muted2)] mt-0.5">Manage devices currently logged into your account.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-[var(--bg)]/60 border border-[var(--border)] flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted2)]">Current Session Time</p>
                <p className="text-sm font-bold font-mono text-[var(--text)] mt-0.5">{sessionRuntime}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)]/60 border border-[var(--border)] flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-[var(--emerald)]/10 text-[var(--emerald)]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted2)]">Active Devices</p>
                <p className="text-sm font-bold font-mono text-[var(--text)] mt-0.5">{mySessions.length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Device Matrix</h4>
            
            {mySessions.length === 0 ? (
              <div className="w-full p-4 text-center text-[11px] text-[var(--muted)] border border-dashed border-[var(--border)] rounded-xl">
                No active sessions found.
              </div>
            ) : (
              mySessions.map(sess => {
                const isDesktop = sess.browser?.includes('Desktop') || sess.browser?.includes('Mac') || sess.browser?.includes('Windows');
                const isMobile = sess.browser?.includes('iOS') || sess.browser?.includes('Android') || sess.browser?.includes('Mobile');
                const isCurrent = sess.id === socket.id;

                return (
                  <div key={sess.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-colors shrink-0 ${isCurrent ? 'bg-[var(--neon)]/5 border-[var(--neon)]/20' : 'bg-[var(--bg)] border-[var(--border)] hover:bg-[var(--card-bg)]'}`}>
                    <div className="w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border2)] flex items-center justify-center shrink-0 shadow-sm">
                      {isDesktop ? <Monitor size={16} className="text-blue-400" /> : isMobile ? <Smartphone size={16} className="text-purple-400" /> : <MonitorSmartphone size={16} className="text-amber-400" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[12px] font-black text-[var(--text)] truncate">{sess.browser || 'Unknown Device'}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]/20 whitespace-nowrap">
                            This Device
                          </span>
                        )}
                        {sess.active && !isCurrent && (
                          <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--muted2)] font-mono">
                        <span className="flex items-center gap-1"><Globe2 size={10} /> {sess.location || 'Unknown Location'}</span>
                        <span className="flex items-center gap-1"><Wifi size={10} /> {sess.ip || 'Unknown IP'}</span>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => {
                          socket.emit('revoke_session', sess.id);
                          showToast('Revocation signal dispatched to device.', 'info');
                        }}
                        className="shrink-0 px-3 h-8 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-rose-500/10 cursor-pointer"
                      >
                        <Trash2 size={12} /> Revoke
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex-1 h-full min-h-0 flex flex-col items-center justify-center space-y-4">
        <Shield className="w-8 h-8 text-[var(--neon)] animate-pulse" />
        <span className="text-[10px] font-black text-[var(--neon)] uppercase tracking-widest animate-pulse">Syncing Cryptographic Node</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT (hidden on lg+)
      ═══════════════════════════════════════════════ */}
      <div className="flex flex-col h-full lg:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {mobileActive === null ? (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col h-full"
            >
              <div className="flex-none flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[var(--border)]">
                {onTabChange && (
                  <button 
                    onClick={() => onBack ? onBack() : onTabChange('overview')}
                    className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted2)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <div className="w-9 h-9 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[var(--neon)]" />
                </div>
                <div>
                  <h1 className="text-[16px] font-black text-[var(--text)] tracking-tight leading-none">Account Settings</h1>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5">Identity & security</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-4 pt-5 pb-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] mb-2 px-1">Identity & Security</p>
                  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
                    {sections.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => setMobileActive(sec.id)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--neon)]/[0.03] active:bg-[var(--neon)]/[0.06] transition-colors cursor-pointer"
                        >
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${sec.color}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[var(--text)] truncate">{sec.label}</p>
                            <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">{sec.desc}</p>
                          </div>
                          <ChevronRight size={16} className="text-[var(--muted2)] shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`mobile-detail-${mobileActive}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col h-full min-h-0 bg-[var(--card-bg)]"
            >
              <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]/60 backdrop-blur-sm">
                <button
                  onClick={() => setMobileActive(null)}
                  className="flex items-center gap-1.5 text-[var(--neon)] font-bold text-[13px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <ArrowLeft size={18} />
                  <span>Account</span>
                </button>
                <div className="flex-1" />
                <span className="text-[12px] font-bold text-[var(--text)]">
                  {sections.find(s => s.id === mobileActive)?.label}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {renderContent(mobileActive)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT (hidden below lg)
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col h-full">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-none rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 mb-5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            {onTabChange && (
              <button 
                onClick={() => onBack ? onBack() : onTabChange('overview')}
                className="w-11 h-11 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted2)] hover:text-[var(--text)] hover:bg-[var(--card-bg)] transition-all cursor-pointer shadow-md shrink-0 mr-2"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="w-12 h-12 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-[var(--neon)]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight font-royal leading-none mb-1">Account Settings</h1>
              <p className="text-[11px] sm:text-[12px] font-medium text-[var(--muted)] tracking-wide">
                Manage your identity, security credentials, and personal activity log.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-row gap-5 min-h-0">
          {/* Sidebar Nav */}
          <div className="w-64 flex-none flex flex-col gap-2 overflow-y-auto no-scrollbar">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer text-left border ${isActive
                    ? 'bg-[var(--card-bg)] border-[var(--border2)] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-[var(--card-bg)]/50 hover:border-[var(--border)]'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'bg-[var(--bg)] text-[var(--muted2)]'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[12px] font-bold truncate ${isActive ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>{sec.label}</div>
                    <div className="text-[9px] font-semibold text-[var(--muted2)] uppercase tracking-widest mt-0.5 truncate font-mono">{sec.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto no-scrollbar h-full"
              >
                {renderContent(activeSection)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
