"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X, Zap, type LucideIcon } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ─── Type Config ─────────────────────────────────────────────────────────────
const CONFIG: Record<ToastType, {
  icon: LucideIcon;
  label: string;
  bar: string;      // progress bar color
  iconBg: string;   // icon container bg
  iconColor: string;
  barBg: string;    // solid card background
  topLine: string;  // top border accent
}> = {
  success: {
    icon: CheckCircle2,
    label: 'Success',
    bar: '#22c55e',
    iconBg: 'rgba(34,197,94,0.14)',
    iconColor: '#4ade80',
    barBg: 'rgba(34,197,94,0.08)',
    topLine: '#22c55e',
  },
  error: {
    icon: XCircle,
    label: 'Error',
    bar: '#f87171',
    iconBg: 'rgba(248,113,113,0.14)',
    iconColor: '#fca5a5',
    barBg: 'rgba(248,113,113,0.08)',
    topLine: '#f87171',
  },
  info: {
    icon: Info,
    label: 'Info',
    bar: '#60a5fa',
    iconBg: 'rgba(96,165,250,0.14)',
    iconColor: '#93c5fd',
    barBg: 'rgba(96,165,250,0.08)',
    topLine: '#60a5fa',
  },
  warning: {
    icon: Zap,
    label: 'Warning',
    bar: '#fbbf24',
    iconBg: 'rgba(251,191,36,0.14)',
    iconColor: '#fde68a',
    barBg: 'rgba(251,191,36,0.08)',
    topLine: '#fbbf24',
  },
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ duration, color }: { duration: number; color: string }) => {
  const [width, setWidth] = useState(100);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.max(0, 100 - ((now - startRef.current) / duration) * 100);
      setWidth(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration]);

  return (
    <div className="h-[3px] w-full" style={{ background: `${color}22` }}>
      <div
        className="h-full"
        style={{
          width: `${width}%`,
          background: color,
          transition: 'none',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
};

// ─── Toast Item ───────────────────────────────────────────────────────────────
const ToastItem = ({
  toast,
  onRemove,
  index,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
  index: number;
}) => {
  const cfg = CONFIG[toast.type];
  const Icon = cfg.icon;
  const duration = toast.duration ?? 4500;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={{ type: 'spring', damping: 26, stiffness: 300, delay: index * 0.04 }}
      className="pointer-events-auto w-full select-none overflow-hidden"
      style={{
        borderRadius: 14,
        background: '#0c141c', // Solid dark background to prevent transparency
        border: `1px solid ${cfg.topLine}28`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 1px 0 ${cfg.topLine}18 inset`,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Top colored accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${cfg.topLine}, ${cfg.topLine}44, transparent)` }} />

      {/* Body */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Icon */}
        <div
          className="shrink-0 flex items-center justify-center rounded-xl"
          style={{
            width: 36,
            height: 36,
            background: cfg.iconBg,
          }}
        >
          <Icon size={17} color={cfg.iconColor} strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[8.5px] font-black uppercase tracking-[0.22em] font-mono mb-0.5"
            style={{ color: cfg.iconColor }}
          >
            {toast.title ?? cfg.label}
          </p>
          <p className="text-[12.5px] font-semibold text-[var(--text)] leading-snug">
            {toast.message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => onRemove(toast.id)}
          className="shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150"
          style={{ width: 28, height: 28, background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.background = cfg.iconBg)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Dismiss"
        >
          <X size={13} color="var(--muted2)" strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      <ProgressBar duration={duration} color={cfg.bar} />
    </motion.div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'success',
    title?: string,
    duration = 4500,
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-5), { id, message, type, title, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast column — bottom-right, newest on bottom */}
      <div
        className="fixed bottom-6 right-4 md:right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
        style={{ width: 'min(400px, calc(100vw - 32px))' }}
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, i) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
