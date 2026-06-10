"use client";

import React, { useState, useEffect } from 'react';
import {
  Settings, Save, ShieldCheck, Database, Sliders, Monitor,
  Moon, Sun, MonitorSmartphone, FileText, ShieldAlert, ChevronRight, ChevronDown, ArrowLeft, Palette, Check, Bell, Zap, ToggleLeft, ToggleRight, Smartphone, Mail, AlertTriangle, Globe, CloudOff, Globe2, Trash2, Wifi, Clock, Info, Cpu, Network, Lock, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import { Activity } from 'lucide-react';
import { socket } from '@/lib/socket';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export const AppSettings = ({ onTabChange, role }: { onTabChange: (tab: string) => void, role: string }) => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('notifications');
  // Mobile-only navigation state: null = show menu list, string = show detail
  const [mobileActive, setMobileActive] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [selectedTheme, setSelectedTheme] = useState('Neon Green');
  const [isSaved, setIsSaved] = useState(false);

  // Toggle states
  const [perfToggles, setPerfToggles] = useState<Record<string, boolean>>({
    hw: true,
    anim: true,
    data: false,
  });

  const { status: pushStatus, subscribe: subscribePush, unsubscribe: unsubscribePush } = usePushNotifications();

  // ── Notification toggles — all wired to real behavior ──
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>({
    push: false,         // Web + Mobile push — syncs with real pushStatus
    tool_alerts: true,   // In-app alerts when tools are added
    offline: true,       // Deliver push even when offline
  });

  // Load persisted prefs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('hub_notif_prefs');
    if (saved) { try { setNotifToggles(JSON.parse(saved)); } catch {} }
  }, []);

  // Sync push toggle with real permission status
  useEffect(() => {
    if (pushStatus === 'subscribed') {
      setNotifToggles(p => { const n = { ...p, push: true }; localStorage.setItem('hub_notif_prefs', JSON.stringify(n)); return n; });
    }
    if (pushStatus === 'unsubscribed' || pushStatus === 'denied') {
      setNotifToggles(p => { const n = { ...p, push: false }; localStorage.setItem('hub_notif_prefs', JSON.stringify(n)); return n; });
    }
  }, [pushStatus]);

  const toggleNotif = async (id: string) => {
    if (id === 'push') {
      if (notifToggles.push) {
        await unsubscribePush();
        showToast('Push notifications disabled', 'info');
      } else {
        if (typeof window !== 'undefined' && Notification.permission === 'denied') {
          showToast('Notifications blocked in browser — open site settings to allow', 'error');
          return;
        }
        await subscribePush();
        showToast('Push notifications enabled! You will be notified when offline.', 'success');
      }
      return; // state syncs via useEffect above
    }
    setNotifToggles(p => {
      const n = { ...p, [id]: !p[id] };
      localStorage.setItem('hub_notif_prefs', JSON.stringify(n));
      return n;
    });
    if (id === 'offline') {
      const next = !notifToggles.offline;
      localStorage.setItem('hub_push_offline_enabled', String(next));
      showToast(next ? 'Offline notifications enabled' : 'Offline notifications disabled', 'info');
    }
    if (id === 'tool_alerts') {
      const next = !notifToggles.tool_alerts;
      localStorage.setItem('hub_tool_alerts_enabled', String(next));
      showToast(next ? 'Tool alerts enabled' : 'Tool alerts muted', 'info');
    }
  };

  const togglePerf = (id: string) => {
    setPerfToggles(p => ({ ...p, [id]: !p[id] }));
  };

  useEffect(() => {
    // Physical DOM manipulation for Performance toggles
    let styleEl = document.getElementById('perf-overrides');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'perf-overrides';
      document.head.appendChild(styleEl);
    }
    
    let css = '';
    if (!perfToggles.anim) {
      css += `
        * {
          animation: none !important;
          transition: none !important;
        }
      `;
    }
    styleEl.innerHTML = css;
    
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [perfToggles]);

  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [appLockPin, setAppLockPin] = useState('');
  const [appLockTimeout, setAppLockTimeout] = useState('5');
  const [showPinMask, setShowPinMask] = useState(true);
  const [isTimeoutDropdownOpen, setIsTimeoutDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSelectedTheme(localStorage.getItem('theme-color') || 'Neon Green');
      setThemeMode(localStorage.getItem('theme') || 'dark');
      
      setAppLockEnabled(localStorage.getItem('hub_app_lock_enabled') === 'true');
      setAppLockPin(localStorage.getItem('hub_app_lock_pin') || '');
      setAppLockTimeout(localStorage.getItem('hub_app_lock_timeout') || '5');
    }
  }, []);

  const sections = [
    { id: 'security', label: 'Security & Privacy', icon: ShieldCheck, desc: 'App Lock & PIN setup', color: 'text-[var(--emerald)] bg-[var(--emerald)]/10 border-[var(--emerald)]/20' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alert preferences', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'appearance', label: 'Appearance', icon: Monitor, desc: 'Theme and UI preferences', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'performance', label: 'Hardware & Performance', icon: Zap, desc: 'App speed and rendering', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

  const handleSave = () => {
    if (activeSection === 'security') {
      localStorage.setItem('hub_app_lock_enabled', String(appLockEnabled));
      localStorage.setItem('hub_app_lock_pin', appLockPin);
      localStorage.setItem('hub_app_lock_timeout', appLockTimeout);
      window.dispatchEvent(new Event('app_lock_settings_changed'));
    }
    
    setIsSaved(true);
    showToast('App settings saved successfully', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Render the content panel for a given section id
  const renderContent = (sectionId: string) => {
    // App settings sections
    if (sectionId === 'security') return (
      <div className="p-5 md:p-8 space-y-8 relative h-fit">
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[32px]">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--emerald)]/[0.03] blur-[100px] rounded-full" />
        </div>
        
        <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[var(--emerald)]/20 to-[var(--emerald)]/5 border border-[var(--emerald)]/30 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative group">
            <div className="absolute inset-0 bg-[var(--emerald)]/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck className="w-7 h-7 text-[var(--emerald)] relative z-10" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-[var(--text)] uppercase tracking-[0.1em] drop-shadow-sm">Security & Privacy</h3>
            <p className="text-[11px] text-[var(--muted)] mt-1 font-mono tracking-wide">Manage App Lock and cryptographic authentication</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] border transition-all duration-300 gap-5 ${
              appLockEnabled 
                ? 'bg-[var(--card-bg)] border-[var(--emerald)]/40 shadow-[0_0_30px_rgba(16,185,129,0.06)]' 
                : 'bg-[var(--bg)] border-[var(--border)] hover:border-[var(--emerald)]/20'
            }`}
          >
            {/* Ambient gradient when enabled */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[var(--emerald)]/[0.04] to-transparent transition-opacity duration-500 pointer-events-none ${appLockEnabled ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-[15px] font-black text-[var(--text)] tracking-wide">Enable App Lock</p>
                {appLockEnabled && (
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.15em] bg-[var(--emerald)]/10 text-[var(--emerald)] border border-[var(--emerald)]/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[var(--muted)] mt-1.5 leading-relaxed max-w-md">Require a cryptographic PIN to unlock the dashboard when idle or away.</p>
            </div>
            
            <button 
              onClick={() => {
                setAppLockEnabled(!appLockEnabled);
                if (!appLockEnabled && !appLockPin) {
                  showToast('Please set a PIN below', 'info');
                }
              }}
              className={`relative z-10 w-14 h-7 rounded-full flex items-center transition-all p-1 cursor-pointer shrink-0 ${appLockEnabled ? 'bg-[var(--emerald)]/20 border border-[var(--emerald)]/40 justify-end' : 'bg-black/60 border border-[var(--border)] justify-start'}`}
            >
              <motion.div 
                layout
                className={`w-5 h-5 rounded-full shadow-md transition-colors ${appLockEnabled ? 'bg-[var(--emerald)] shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-[var(--muted2)]'}`} 
              />
            </button>
          </motion.div>

          <AnimatePresence>
            {appLockEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={isTimeoutDropdownOpen ? "overflow-visible" : "overflow-hidden"}
              >
                <div className="p-6 md:p-8 rounded-[24px] bg-[var(--card-bg)] border border-[var(--border)] space-y-8 relative shadow-lg mt-2">
                  {/* Decorative background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--emerald)]/[0.02] to-transparent pointer-events-none rounded-[24px]" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--emerald)]/40 to-transparent opacity-50 rounded-t-[24px]" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[var(--emerald)] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Lock size={14} className="text-[var(--emerald)]" /> Unlock PIN
                      </label>
                      <div className="relative group">
                        <input 
                          type={showPinMask ? "password" : "text"}
                          maxLength={4}
                          placeholder="••••"
                          value={appLockPin}
                          onChange={(e) => setAppLockPin(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-6 pr-14 py-4 text-center text-3xl font-black text-[var(--text)] focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/20 outline-none transition-all tracking-[0.5em] group-hover:border-[var(--border2)] shadow-inner"
                        />
                        <button 
                          onClick={() => setShowPinMask(!showPinMask)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted2)] hover:text-[var(--text)] bg-[var(--card-bg)] p-2.5 rounded-xl border border-transparent hover:border-[var(--border)] transition-all cursor-pointer shadow-sm"
                        >
                          {showPinMask ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] tracking-widest text-center mt-3 font-mono opacity-80">4-DIGIT NUMERIC CODE</p>
                    </div>

                    <div className="space-y-3 relative">
                      <label className="text-[10px] font-black text-[var(--emerald)] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock size={14} className="text-[var(--emerald)]" /> Auto-Lock Timeout
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setIsTimeoutDropdownOpen(!isTimeoutDropdownOpen)}
                          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl px-6 py-4 text-left focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/20 outline-none transition-all cursor-pointer flex items-center justify-between group hover:border-[var(--border2)] shadow-inner"
                        >
                          <div className="flex flex-col">
                            <span className="text-[16px] font-bold tracking-wide text-[var(--text)] group-hover:text-[var(--emerald)] transition-colors">
                              {appLockTimeout === '1' ? '1 Minute' : appLockTimeout === '60' ? '1 Hour' : `${appLockTimeout} Minutes`}
                            </span>
                            <span className="text-[10px] text-[var(--muted)] font-mono mt-1 opacity-80">IDLE DURATION</span>
                          </div>
                          <div className={`p-2.5 rounded-xl bg-[var(--card-bg)] border transition-all duration-300 ${isTimeoutDropdownOpen ? 'rotate-180 text-[var(--emerald)] border-[var(--emerald)]/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'text-[var(--muted2)] border-[var(--border)]'}`}>
                            <ChevronDown size={16} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isTimeoutDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsTimeoutDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--emerald)]/20 rounded-[1.25rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[999] flex flex-col p-1.5 backdrop-blur-3xl"
                              >
                                {[
                                  { value: '1', label: '1 Minute', desc: 'Maximum security' },
                                  { value: '5', label: '5 Minutes', desc: 'Balanced setting' },
                                  { value: '15', label: '15 Minutes', desc: 'Extended session' },
                                  { value: '30', label: '30 Minutes', desc: 'Long duration' },
                                  { value: '60', label: '1 Hour', desc: 'Minimum security' }
                                ].map(option => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setAppLockTimeout(option.value);
                                      setIsTimeoutDropdownOpen(false);
                                    }}
                                    className={`px-4 py-2.5 rounded-xl text-left transition-all flex items-center justify-between group ${appLockTimeout === option.value ? 'bg-[var(--emerald)]/10 text-[var(--emerald)]' : 'hover:bg-[var(--bg)] text-[var(--text)]'}`}
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[13px] font-bold tracking-wide">{option.label}</span>
                                      <span className={`text-[9px] font-mono ${appLockTimeout === option.value ? 'text-[var(--emerald)]/70' : 'text-[var(--muted)]'}`}>{option.desc}</span>
                                    </div>
                                    {appLockTimeout === option.value && (
                                      <Check size={16} className="text-[var(--emerald)]" />
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );

    if (sectionId === 'appearance') return (
      <div className="p-5 md:p-6 space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/25 shrink-0">
            <Palette className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">Neural Appearance</h3>
            <p className="text-[10px] text-[var(--muted2)] mt-0.5">Customize your interface theme</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Display Mode</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{ id: 'dark', label: 'Dark Mode', icon: Moon }, { id: 'light', label: 'Light Mode', icon: Sun }].map(mode => (
              <button key={mode.id} onClick={() => { setThemeMode(mode.id); localStorage.setItem('theme', mode.id); document.documentElement.setAttribute('data-theme', mode.id); window.dispatchEvent(new Event('storage')); }}
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer ${themeMode === mode.id ? 'border-[var(--neon)] bg-[var(--neon)]/5' : 'border-[var(--border)] bg-[var(--bg)]'}`}>
                <mode.icon size={18} className={themeMode === mode.id ? 'text-[var(--neon)]' : 'text-[var(--muted2)]'} />
                <span className="text-[12px] font-bold uppercase tracking-widest">{mode.label}</span>
                {themeMode === mode.id && <Check size={14} className="ml-auto text-[var(--neon)]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Accent Color</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[{ id: 'Neon Green', c: '#10b981' }, { id: 'Midnight blue', c: '#3b82f6' }, { id: 'Violet Lavender', c: '#8b5cf6' }].map(t => (
              <button key={t.id} onClick={() => { setSelectedTheme(t.id); localStorage.setItem('theme-color', t.id); document.documentElement.setAttribute('data-theme-color', t.id); }}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer ${selectedTheme === t.id ? 'border-[var(--neon)] bg-[var(--neon)]/5' : 'border-[var(--border)] bg-[var(--bg)]'}`}>
                <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm relative flex items-center justify-center" style={{ background: t.c }}>
                  {selectedTheme === t.id && <Check size={14} className="text-white drop-shadow-md" />}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-center">{t.id.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
    if (sectionId === 'performance') return (
      <div className="p-5 md:p-6 space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 shrink-0">
            <Zap className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">Performance Optimization</h3>
            <p className="text-[10px] text-[var(--muted2)] mt-0.5">Control client-side rendering and speed</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { id: 'hw', title: 'Hardware Acceleration', desc: 'Use GPU for complex UI animations' },
            { id: 'anim', title: 'Rich Animations', desc: 'Enable full particle effects and transitions' },
            { id: 'data', title: 'Data Saver Mode', desc: 'Reduce real-time polling frequency' },
          ].map(opt => {
            const active = perfToggles[opt.id];
            return (
              <div key={opt.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <div>
                  <p className="text-[12px] font-bold text-[var(--text)]">{opt.title}</p>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5">{opt.desc}</p>
                </div>
                <button 
                  onClick={() => togglePerf(opt.id)}
                  className={`w-12 h-6 rounded-full flex items-center transition-all p-0.5 cursor-pointer ${active ? 'bg-[var(--neon)]/20 border border-[var(--neon)]/40 justify-end' : 'bg-black/40 border border-[var(--border)] justify-start'}`}
                >
                  <div className={`w-5 h-5 rounded-full shadow-sm transition-colors ${active ? 'bg-[var(--neon)]' : 'bg-[var(--muted2)]'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );

    if (sectionId === 'notifications') {
      const pushBlocked = typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied';
      const pushLoading = pushStatus === 'loading';

      const notifOptions = [
        {
          id: 'push',
          icon: Bell,
          title: 'Push Notifications',
          desc: pushBlocked
            ? 'Blocked by browser — open site settings to allow'
            : pushStatus === 'subscribed'
            ? 'Active — you receive alerts even when offline'
            : 'Get notified on this device even when tab is closed',
          badge: pushBlocked ? 'BLOCKED' : pushStatus === 'subscribed' ? 'ON' : 'OFF',
          badgeColor: pushBlocked
            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
            : pushStatus === 'subscribed'
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
            : 'text-[var(--muted)] bg-[var(--bg)] border-[var(--border)]',
          disabled: pushLoading || pushBlocked,
          loading: pushLoading,
        },
        {
          id: 'tool_alerts',
          icon: Zap,
          title: 'Tool Upload Alerts',
          desc: notifToggles.tool_alerts
            ? 'In-app bell rings when anyone adds a tool to the Global Registry'
            : 'Tool upload alerts are muted',
          badge: notifToggles.tool_alerts ? 'ON' : 'OFF',
          badgeColor: notifToggles.tool_alerts
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
            : 'text-[var(--muted)] bg-[var(--bg)] border-[var(--border)]',
          disabled: false,
          loading: false,
        },
        {
          id: 'offline',
          icon: CloudOff,
          title: 'Offline Delivery',
          desc: notifToggles.offline
            ? 'Push notifications delivered while you are offline'
            : 'Notifications only delivered when you are online',
          badge: notifToggles.offline ? 'ON' : 'OFF',
          badgeColor: notifToggles.offline
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
            : 'text-[var(--muted)] bg-[var(--bg)] border-[var(--border)]',
          disabled: false,
          loading: false,
        },
      ];

      return (
        <div className="p-5 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 shrink-0">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-widest">Notification Preferences</h3>
              <p className="text-[10px] text-[var(--muted2)] mt-0.5">Control exactly how and when you receive alerts</p>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-3.5 rounded-xl border text-[11px] font-bold ${
            pushStatus === 'subscribed'
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
              : pushBlocked
              ? 'bg-rose-500/5 border-rose-500/20 text-rose-400'
              : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
          }`}>
            <div className={`w-2 h-2 rounded-full shrink-0 ${pushStatus === 'subscribed' ? 'bg-emerald-400 animate-pulse' : pushBlocked ? 'bg-rose-400' : 'bg-amber-400'}`} />
            {pushStatus === 'subscribed'
              ? '✓ Push active — you will receive notifications even when this tab is closed'
              : pushBlocked
              ? '✗ Notifications blocked by browser. Click the lock icon in the address bar to unblock.'
              : '○ Push not enabled — enable below to receive offline notifications'}
          </div>

          {/* Toggle Cards */}
          <div className="space-y-3">
            {notifOptions.map(opt => {
              const active = notifToggles[opt.id];
              const Icon = opt.icon;
              return (
                <div key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  active
                    ? 'bg-[var(--card-bg)] border-[var(--neon)]/20'
                    : 'bg-[var(--bg)] border-[var(--border)]'
                }`}>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                    active ? 'bg-[var(--neon)]/10 border-[var(--neon)]/25' : 'bg-[var(--card-bg)] border-[var(--border)]'
                  }`}>
                    {opt.loading
                      ? <div className="w-4 h-4 border-2 border-[var(--neon)]/30 border-t-[var(--neon)] rounded-full animate-spin" />
                      : <Icon size={16} className={active ? 'text-[var(--neon)]' : 'text-[var(--muted)]'} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[12px] font-bold text-[var(--text)]">{opt.title}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                  <button
                    disabled={opt.disabled}
                    onClick={() => toggleNotif(opt.id)}
                    className={`w-12 h-6 rounded-full flex items-center transition-all p-0.5 shrink-0 ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                    } ${active
                      ? 'bg-[var(--neon)]/20 border border-[var(--neon)]/40 justify-end'
                      : 'bg-black/40 border border-[var(--border)] justify-start'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full shadow-sm transition-colors ${active ? 'bg-[var(--neon)]' : 'bg-[var(--muted2)]'}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Info note */}
          <p className="text-[10px] text-[var(--muted2)] leading-relaxed border-t border-[var(--border)] pt-4">
            Push notifications require browser permission. When enabled, the server will deliver alerts (e.g. new tool uploads by any team member) directly to your device — even if you close this tab.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT (hidden on lg+)
      ═══════════════════════════════════════════════ */}
      <div className="flex flex-col h-full lg:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {mobileActive === null ? (
            /* ── Mobile: Menu list view ── */
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col h-full"
            >
              {/* Mobile header */}
              <div className="flex-none flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[var(--border)]">
                <div className="w-9 h-9 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-[var(--neon)]" />
                </div>
                <div>
                  <h1 className="text-[16px] font-black text-[var(--text)] tracking-tight leading-none">App Settings</h1>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5">Preferences & configuration</p>
                </div>
              </div>

              {/* Mobile menu items list */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] mb-2 px-1">General</p>
                  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
                    {sections.filter(s => ['security', 'appearance','performance'].includes(s.id)).map((sec) => {
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
                <div className="h-6" />
              </div>
            </motion.div>
          ) : (
            /* ── Mobile: Detail / page view ── */
            <motion.div
              key={`mobile-detail-${mobileActive}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col h-full min-h-0"
            >
              {/* Mobile back bar */}
              <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]/60 backdrop-blur-sm">
                <button
                  onClick={() => setMobileActive(null)}
                  className="flex items-center gap-1.5 text-[var(--neon)] font-bold text-[13px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <ArrowLeft size={18} />
                  <span>Settings</span>
                </button>
                <div className="flex-1" />
                <span className="text-[12px] font-bold text-[var(--text)]">
                  {sections.find(s => s.id === mobileActive)?.label}
                </span>
              </div>

              {/* Detail content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {renderContent(mobileActive)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT (hidden below lg) — UNCHANGED
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col h-full">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-none rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6 text-[var(--neon)]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight font-royal leading-none">App Settings</h1>
              </div>
              <p className="text-[11px] sm:text-[12px] font-medium text-[var(--muted)] tracking-wide">
                Manage your personal preferences and application behavior.
              </p>
            </div>
          </div>
          {true && (
            <button
              onClick={handleSave}
              disabled={isSaved}
              className="h-11 px-6 rounded-xl bg-[var(--neon)] hover:opacity-90 text-black text-[11px] font-black uppercase tracking-widest font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--particle-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isSaved ? <ShieldCheck size={16} /> : <Save size={16} />}
              {isSaved ? 'Saved' : 'Save Changes'}
            </button>
          )}
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
          <div className={`flex-1 overflow-hidden flex flex-col min-h-0 ${
            ['security', 'appearance', 'performance', 'notifications'].includes(activeSection)
              ? 'bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl'
              : ''
          }`}>
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
