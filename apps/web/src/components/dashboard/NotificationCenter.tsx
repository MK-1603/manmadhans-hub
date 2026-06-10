"use client";

import React from 'react';
import {
  Heart,
  Shield,
  Database,
  UserCheck,
  Zap,
  ChevronLeft,
  X,
  Rocket,
  Bot,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCenterProps {
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  onBack: () => void;
}

export const NotificationCenter = ({ notifications, setNotifications, onBack }: NotificationCenterProps) => {

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissOne = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'shield': return { icon: <Shield className="w-5 h-5" />, bg: 'bg-amber-500/15 border-amber-500/25', color: 'text-amber-400' };
      case 'database': return { icon: <Database className="w-5 h-5" />, bg: 'bg-blue-500/15 border-blue-500/25', color: 'text-blue-400' };
      case 'zap': return { icon: <Zap className="w-5 h-5" />, bg: 'bg-purple-500/15 border-purple-500/25', color: 'text-purple-400' };
      case 'user': return { icon: <UserCheck className="w-5 h-5" />, bg: 'bg-emerald-500/15 border-emerald-500/25', color: 'text-emerald-400' };
      case 'tool_added': return { icon: <Rocket className="w-5 h-5" />, bg: 'bg-[var(--neon)]/15 border-[var(--neon)]/25', color: 'text-[var(--neon)]' };
      case 'bot': return { icon: <Bot className="w-5 h-5" />, bg: 'bg-cyan-500/15 border-cyan-500/25', color: 'text-cyan-400' };
      case 'alert': return { icon: <AlertTriangle className="w-5 h-5" />, bg: 'bg-rose-500/15 border-rose-500/25', color: 'text-rose-400' };
      default: return { icon: <Bell className="w-5 h-5" />, bg: 'bg-[var(--card-bg)] border-[var(--border)]', color: 'text-[var(--muted)]' };
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const NotificationRow = ({ notif }: { notif: any }) => {
    const { icon, bg, color } = getNotifIcon(notif.type);
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -10 }}
        onClick={() => markOneRead(notif.id)}
        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${notif.read ? 'hover:bg-[var(--hover-bg)]' : 'bg-[var(--neon)]/[0.02] hover:bg-[var(--neon)]/[0.05]'}`}
      >
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${bg} ${color}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[var(--text)] leading-snug truncate">{notif.title}</p>
          <p className="text-[11px] text-[var(--muted)] leading-snug mt-0.5 line-clamp-2">{notif.desc}</p>
          <p className="text-[10px] text-[var(--muted2)] mt-1 font-mono">{notif.time}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!notif.read && (
            <div className="w-2 h-2 rounded-full bg-[var(--neon)] shadow-[0_0_6px_var(--neon)]" />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); dismissOne(notif.id); }}
            className="w-8 h-8 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-[var(--muted)] transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col font-sans animate-in fade-in duration-300 text-left bg-[var(--bg)] text-[var(--text)]">
      
      <div className="w-full md:max-w-none mx-auto h-full flex flex-col md:border-none bg-[var(--bg)]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)] shrink-0 relative">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 rounded-full hover:bg-[var(--hover-bg)] transition-colors shrink-0 md:hidden absolute left-4"
          >
            <ChevronLeft className="w-7 h-7 text-[var(--text)]" strokeWidth={2} />
          </button>
          
          <h1 className="text-[17px] font-bold text-[var(--text)] w-full text-center">
            Notifications
          </h1>

          {unreadNotifications.length > 0 && (
            <button 
              onClick={markAllRead} 
              className="hidden md:block absolute right-4 text-sm font-semibold text-blue-500 hover:text-blue-600 z-10"
            >
              Mark all as done
            </button>
          )}
        </div>

        {/* ── Notifications Feed ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          
          {/* Top Actions (Mark all read) */}
          {unreadNotifications.length > 0 && (
            <div className="px-4 py-3 flex justify-end md:hidden">
               <button onClick={markAllRead} className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                 Mark all as done
               </button>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4"
              >
                <div className="w-24 h-24 rounded-full border-[3px] border-[var(--border)] flex items-center justify-center mb-2 bg-[var(--input-bg)]">
                  <Heart className="w-12 h-12 text-[var(--muted)]" />
                </div>
                <p className="text-[22px] font-bold text-[var(--text)]">Activity On Your App</p>
                <p className="text-[15px] text-[var(--muted)]">
                  When there is activity, you'll see it here.
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col">
                
                {/* Follow Requests / Priority Section */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--hover-bg)]">
                  <div className="relative w-12 h-12">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center absolute top-0 left-0">
                      <UserCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-[var(--bg)] absolute bottom-0 right-0">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pl-1">
                    <p className="text-[14px] font-bold text-[var(--text)] leading-snug">System Requests</p>
                    <p className="text-[14px] text-[var(--muted)] leading-snug truncate">No pending approvals</p>
                  </div>
                </div>

                {/* New Section */}
                {unreadNotifications.length > 0 && (
                  <div className="mt-4">
                    <h2 className="px-4 py-2 text-[16px] font-bold text-[var(--text)]">New</h2>
                    {unreadNotifications.map(notif => (
                      <NotificationRow key={notif.id} notif={notif} />
                    ))}
                  </div>
                )}

                {/* Earlier Section */}
                {readNotifications.length > 0 && (
                  <div className="mt-4">
                    <h2 className="px-4 py-2 text-[16px] font-bold text-[var(--text)]">{unreadNotifications.length > 0 ? 'Earlier' : 'Today'}</h2>
                    {readNotifications.map(notif => (
                      <NotificationRow key={notif.id} notif={notif} />
                    ))}
                  </div>
                )}
                
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
