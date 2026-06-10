"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Globe, Save, Check, Zap, Sparkles, User, Info, ShieldCheck, Link2, Star, Cpu, ChevronRight, ArrowLeft, Rocket, UploadCloud, ArrowUpRight, MonitorSmartphone, Wifi, Monitor, Smartphone, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import { IdentityManagement } from './IdentityManagement';
import { socket } from '@/lib/socket';

const SkeletonField = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-2.5 w-24 bg-[var(--border)] rounded" />
    <div className="h-28 bg-[var(--border)] rounded-2xl" />
  </div>
);

export const PlatformSettings = ({ onTabChange }: { onTabChange?: (tabId: string) => void }) => {
  const { showToast } = useToast();
  // Desktop active tab
  const [activeSection, setActiveSection] = useState('general');
  // Mobile active tab (null means showing menu list)
  const [mobileActive, setMobileActive] = useState<string | null>(null);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Editable version
  const [systemVersion, setSystemVersion] = useState('v1.0');
  const [versionFeature, setVersionFeature] = useState('Genesis Release');
  const [versionDetails, setVersionDetails] = useState("- Initial core architecture deployment\n- Integrated real-time Identity Matrix\n- Centralized Platform Settings module");

  // Draft version state
  const [draftVersion, setDraftVersion] = useState('');
  const [draftFeature, setDraftFeature] = useState('');
  const [draftDetails, setDraftDetails] = useState('');

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  const handleLaunchVersion = () => {
    if (!draftVersion) return;
    setSystemVersion(draftVersion);
    setVersionFeature(draftFeature || 'Minor Update');
    setVersionDetails(draftDetails || 'General optimizations and stability improvements.');
    
    // Broadcast real-time push notification to all users globally
    socket.emit('client_trigger_notification', {
      title: 'Platform Genesis Update',
      desc: `Global Deployment: Version ${draftVersion} is now live.`,
      type: 'success',
      roles: ['owner', 'admin', 'member']
    });

    setDraftVersion('');
    setDraftFeature('');
    setDraftDetails('');
    showToast(`BROADCAST: Version ${draftVersion} has been deployed globally. All systems automatically updated.`, 'success');
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (socket.connected) {
      socket.emit('request_all_sessions');
    }
    
    const onAllSessionsUpdate = (sessions: any[]) => {
      setActiveSessions(sessions);
    };

    socket.on('all_sessions_update', onAllSessionsUpdate);
    const onConnect = () => socket.emit('request_all_sessions');
    socket.on('connect', onConnect);

    return () => {
      socket.off('all_sessions_update', onAllSessionsUpdate);
      socket.off('connect', onConnect);
    };
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    showToast('Platform configuration saved', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const sections = [
    { id: 'general',  label: 'General',            icon: Globe,       desc: 'Platform identity & links', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'version',  label: 'Version Control',    icon: Rocket,      desc: 'Release management',        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'sessions', label: 'Active Sessions',    icon: MonitorSmartphone, desc: 'Real-time device usage', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'founders', label: 'Founders & Team',     icon: User,        desc: 'Executive leadership', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'identity', label: 'Identity Matrix',     icon: ShieldCheck, desc: 'Access & role management', color: 'text-[var(--neon)] bg-[var(--neon)]/10 border-[var(--neon)]/20' },
  ];

  const labelCls = 'block text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-1.5';

  const renderContent = (sectionId: string | null) => {
    if (sectionId === 'general') {
      return (
        <motion.div
          key="general"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center">
              <Globe size={13} className="text-[var(--neon)]" />
            </div>
            <div>
              <h3 className="text-[12px] font-black text-[var(--text)] uppercase tracking-wider">Core Identity</h3>
              <p className="text-[9px] text-[var(--muted)] mt-0.5">Primary platform identifiers and branding</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SkeletonField /><SkeletonField /><SkeletonField />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Platform Name */}
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><Globe size={48} /></div>
                <label className={labelCls}>Platform Name</label>
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-[var(--card-bg)] border border-[var(--border2)] shrink-0 flex items-center justify-center overflow-hidden p-1">
                    <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-[var(--text)] tracking-tight">ManMadhan'S Hub</p>
                    <p className="text-[9px] text-[var(--muted2)] font-mono uppercase tracking-widest mt-0.5">Primary Instance</p>
                  </div>
                </div>
              </div>

              {/* System Version */}
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><Cpu size={48} /></div>
                <label className={labelCls}>System Version</label>
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Zap size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black text-[var(--text)] tracking-tight">{systemVersion}</p>
                    <p className="text-[9px] text-[var(--muted2)] font-mono uppercase tracking-widest mt-0.5">{versionFeature}</p>
                  </div>
                </div>
              </div>

              {/* Foundation Date */}
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><Sparkles size={48} /></div>
                <label className={labelCls}>Foundation Date</label>
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Info size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-[var(--text)] tracking-tight">9-6-26</p>
                    <p className="text-[9px] text-[var(--muted2)] font-mono uppercase tracking-widest mt-0.5">Epoch Genesis</p>
                  </div>
                </div>
              </div>

              {/* Website Link */}
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] relative overflow-hidden group sm:col-span-3">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><Link2 size={48} /></div>
                <label className={labelCls}>Public Portal</label>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <div className="flex-1 flex items-center h-10 px-3 rounded-xl bg-black/30 border border-[var(--border)] text-[12px] font-mono text-[var(--muted2)]">
                    https://manmadhans-hub.cloud
                  </div>
                  <button className="h-10 px-5 rounded-xl bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]/30 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--neon)] hover:text-black transition-all cursor-pointer whitespace-nowrap">
                    Visit Portal
                  </button>
                </div>
              </div>

              {/* Version Details / Features */}
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] relative overflow-hidden group sm:col-span-3">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><Sparkles size={48} /></div>
                <label className={labelCls}>Version Highlights & Features</label>
                <div className="mt-2 p-3 rounded-xl bg-black/30 border border-[var(--border)] overflow-y-auto max-h-32 no-scrollbar shadow-inner">
                  <p className="text-[11px] text-[var(--muted)] font-mono leading-relaxed whitespace-pre-wrap">{versionDetails}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      );
    }

    if (sectionId === 'version') {
      return (
        <motion.div
          key="version"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Rocket size={13} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[12px] font-black text-[var(--text)] uppercase tracking-wider">Version Control</h3>
              <p className="text-[9px] text-[var(--muted)] mt-0.5">Manage platform releases and deploy updates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Version */}
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex flex-col">
               <label className={labelCls}>Current Deployment (Editable)</label>
               <div className="mt-3 flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                     <Cpu size={20} />
                   </div>
                   <div className="flex-1 min-w-0 space-y-1">
                     <input 
                       value={systemVersion} onChange={e => setSystemVersion(e.target.value)}
                       className="w-full bg-transparent border-b border-[var(--border)] hover:border-[var(--border2)] focus:border-blue-500/50 text-xl font-black text-[var(--text)] tracking-tight truncate focus:outline-none transition-colors"
                     />
                     <input 
                       value={versionFeature} onChange={e => setVersionFeature(e.target.value)}
                       className="w-full bg-transparent border-b border-[var(--border)] hover:border-[var(--border2)] focus:border-blue-500/50 text-[10px] text-[var(--muted2)] font-mono uppercase tracking-widest truncate focus:outline-none transition-colors"
                     />
                   </div>
                 </div>
                 <textarea 
                   value={versionDetails} onChange={e => setVersionDetails(e.target.value)}
                   className="mt-2 w-full h-32 p-3 rounded-xl bg-black/30 border border-[var(--border)] focus:border-blue-500/50 text-[10px] font-mono text-[var(--muted)] leading-relaxed resize-none focus:outline-none transition-colors"
                 />
               </div>
            </div>

            {/* Launch New Version */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[var(--bg)] to-emerald-500/5 border border-emerald-500/20">
               <label className={labelCls}>Launch New Version</label>
               <div className="space-y-3 mt-3">
                 <input 
                   value={draftVersion} onChange={e => setDraftVersion(e.target.value)}
                   placeholder="e.g. v3.1.0"
                   className="w-full h-10 px-3 rounded-xl bg-black/40 border border-[var(--border)] text-[12px] text-[var(--text)] font-black tracking-widest focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-[var(--muted2)]"
                 />
                 <input 
                   value={draftFeature} onChange={e => setDraftFeature(e.target.value)}
                   placeholder="Release Codename"
                   className="w-full h-10 px-3 rounded-xl bg-black/40 border border-[var(--border)] text-[12px] text-[var(--text)] font-black tracking-widest focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-[var(--muted2)]"
                 />
                 <textarea 
                   value={draftDetails} onChange={e => setDraftDetails(e.target.value)}
                   placeholder="Release Notes..."
                   className="w-full h-20 p-3 rounded-xl bg-black/40 border border-[var(--border)] text-[11px] text-[var(--text)] font-mono focus:border-emerald-500/50 focus:outline-none transition-colors resize-none placeholder:text-[var(--muted2)]"
                 />
                 <button 
                   onClick={handleLaunchVersion}
                   disabled={!draftVersion}
                   className="w-full h-11 mt-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10 cursor-pointer"
                 >
                   <UploadCloud size={14} /> Initialize Launch
                 </button>
               </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (sectionId === 'sessions') {
      const desktopCount = activeSessions.filter(s => s.browser?.includes('Desktop') || s.browser?.includes('Mac') || s.browser?.includes('Windows')).length;
      const mobileCount = activeSessions.filter(s => s.browser?.includes('iOS') || s.browser?.includes('Android') || s.browser?.includes('Mobile')).length;

      return (
        <motion.div
          key="sessions"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <MonitorSmartphone size={13} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-[12px] font-black text-[var(--text)] uppercase tracking-wider">Device Matrix</h3>
              <p className="text-[9px] text-[var(--muted)] mt-0.5">Real-time tracking of active user sessions</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Active Devices', val: activeSessions.length.toString(), c: 'text-emerald-400', bg: 'bg-emerald-500/10', b: 'border-emerald-500/20' },
              { label: 'Desktop', val: desktopCount.toString(), c: 'text-blue-400', bg: 'bg-blue-500/10', b: 'border-blue-500/20' },
              { label: 'Mobile / Tablet', val: mobileCount.toString(), c: 'text-purple-400', bg: 'bg-purple-500/10', b: 'border-purple-500/20' },
            ].map(s => (
              <div key={s.label} className={`p-3 rounded-xl border ${s.bg} ${s.b} text-center`}>
                <p className={`text-xl font-black ${s.c} tracking-tight`}>{s.val}</p>
                <p className="text-[8px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className={labelCls}>Current Network Sessions</label>
            <div className="flex flex-col gap-2">
              {activeSessions.map(sess => {
                const isDesktop = sess.browser?.includes('Desktop') || sess.browser?.includes('Mac') || sess.browser?.includes('Windows');
                const isMobile = sess.browser?.includes('iOS') || sess.browser?.includes('Android') || sess.browser?.includes('Mobile');
                
                return (
                <div key={sess.id} className="p-3 sm:p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-colors hover:bg-[var(--card-bg)] cursor-default">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border2)] flex items-center justify-center shrink-0">
                    {isDesktop ? <Monitor size={16} className="text-blue-400" /> : isMobile ? <Smartphone size={16} className="text-purple-400" /> : <MonitorSmartphone size={16} className="text-amber-400" />}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-black text-[var(--text)]">{sess.user}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                        Active Session
                      </span>
                      {sess.active && (
                        <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest ml-auto sm:ml-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--muted2)] font-mono">
                      <span className="flex items-center gap-1"><Cpu size={10} /> ID: {sess.id}</span>
                      <span className="flex items-center gap-1"><Globe2 size={10} /> {sess.location || 'Unknown Location'}</span>
                      <span className="flex items-center gap-1"><Wifi size={10} /> {sess.ip || 'Unknown IP'}</span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </motion.div>
      );
    }

    if (sectionId === 'founders') {
      return (
        <motion.div
          key="founders"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User size={13} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-[12px] font-black text-[var(--text)] uppercase tracking-wider">Executive Core</h3>
              <p className="text-[9px] text-[var(--muted)] mt-0.5">Platform founders, authors, and co-founders</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Author / Real Founder */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[var(--neon)]/10 to-transparent border border-[var(--neon)]/25">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] flex items-center justify-center text-base font-black text-black shadow-lg shrink-0">MM</div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[var(--neon)] text-black mb-1">
                  <Star size={8} /> Real Founder / Author
                </div>
                <h4 className="text-[14px] font-black text-[var(--text)] tracking-tight">MM1107</h4>
                <p className="text-[10px] text-[var(--muted)]">The architect and visionary of ManMadhan's Hub.</p>
              </div>
            </div>

            {/* Founder */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              <div className="w-11 h-11 rounded-full bg-[var(--card-bg)] border border-[var(--border2)] flex items-center justify-center text-[13px] font-black text-[var(--text)] shrink-0">MK</div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[var(--border2)] text-[var(--muted2)] mb-1">
                  <Globe size={8} /> Founder
                </div>
                <h4 className="text-[13px] font-black text-[var(--text)] tracking-tight">MK1603</h4>
                <p className="text-[10px] text-[var(--muted)]">Operational executor and primary founder identity.</p>
              </div>
            </div>

            {/* Co-Founders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { initials: 'TN', id: 'TN813', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
                { initials: 'SS', id: 'SS0778', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
              ].map(cf => (
                <div key={cf.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-[12px] font-black shrink-0 ${cf.color}`}>{cf.initials}</div>
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-[var(--muted2)] mb-0.5">Co-Founder</div>
                    <h4 className="text-[13px] font-black text-[var(--text)] tracking-tight">{cf.id}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }

    if (sectionId === 'identity') {
      return (
        <motion.div
          key="identity"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="h-full pb-4"
        >
          <IdentityManagement onInviteClick={undefined} />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full font-sans">
      
      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT (visible up to lg)
      ═══════════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col h-full bg-[var(--bg)]">
        <AnimatePresence mode="wait" initial={false}>
          {!mobileActive ? (
            /* ── Mobile: Menu List View ── */
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col h-full overflow-y-auto no-scrollbar"
            >
              {/* Header Title Mobile */}
              <div className="px-4 py-5 mb-2 bg-[var(--card-bg)]/50 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5 text-[var(--neon)]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-[var(--text)] tracking-tight leading-none">Platform</h1>
                    <p className="text-[11px] font-medium text-[var(--muted)] tracking-wide mt-1">
                      ManMadhan'S Hub Configuration
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation List */}
              <div className="px-4 py-4 pb-20">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] mb-2 px-1">Settings Panel</p>
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
            </motion.div>
          ) : (
            /* ── Mobile: Detail / Page View ── */
            <motion.div
              key={`mobile-detail-${mobileActive}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col h-full min-h-0"
            >
              {/* Mobile Back Bar */}
              <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]/60 backdrop-blur-sm">
                <button
                  onClick={() => setMobileActive(null)}
                  className="flex items-center gap-1.5 text-[var(--neon)] font-bold text-[13px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <ArrowLeft size={18} />
                  <span>Platform</span>
                </button>
                <div className="flex-1" />
                <span className="text-[12px] font-bold text-[var(--text)]">
                  {sections.find(s => s.id === mobileActive)?.label}
                </span>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-2">
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
        {/* ── Desktop Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-none rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-5 py-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                <Settings className="w-5 h-5 text-[var(--neon)]" />
              </motion.div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-black text-[var(--text)] tracking-tight font-royal leading-none">Platform Settings</h1>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--neon)]/10 border border-[var(--neon)]/20 text-[8px] font-black text-[var(--neon)] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-[var(--muted)]">ManMadhan'S Hub · {systemVersion} · Founded 9-6-26</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {activeSection !== 'identity' && (
              <motion.button
                key={isSaved ? 'saved' : 'save'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 w-full sm:w-auto justify-center ${
                  isSaved
                    ? 'bg-[var(--neon)]/15 border border-[var(--neon)]/30 text-[var(--neon)]'
                    : 'bg-[var(--neon)] text-black hover:opacity-90'
                }`}
              >
                {isSaved ? <Check size={13} /> : <Save size={13} />}
                {isSaved ? 'Saved!' : 'Save Changes'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Desktop Body ── */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
          {/* Desktop Sidebar Nav */}
          <div className="col-span-3 flex flex-col gap-1.5">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer border w-full ${
                  activeSection === sec.id
                    ? 'bg-[var(--neon)]/10 border-[var(--neon)]/25 text-[var(--neon)]'
                    : 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeSection === sec.id ? 'bg-[var(--neon)]/15' : 'bg-[var(--bg)]'}`}>
                  <sec.icon size={14} className={activeSection === sec.id ? 'text-[var(--neon)]' : 'text-[var(--muted)]'} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-wider truncate">{sec.label}</div>
                  <div className="text-[8px] text-[var(--muted2)] mt-0.5 normal-case tracking-normal font-normal">{sec.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Desktop Content Panel */}
          <div className="col-span-9 min-h-0 overflow-y-auto no-scrollbar pb-6">
            <AnimatePresence mode="wait">
              {renderContent(activeSection)}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
