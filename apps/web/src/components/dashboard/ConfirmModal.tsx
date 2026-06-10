"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Info, Trash2 } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-rose-500/10 border-rose-500/30',
    iconColor: 'text-rose-400',
    confirmBtn: 'bg-rose-500 hover:bg-rose-400 text-[var(--text)] shadow-[0_4px_20px_rgba(244,63,94,0.35)]',
    borderAccent: 'border-rose-500/20',
    labelColor: 'text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    iconColor: 'text-amber-400',
    confirmBtn: 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_4px_20px_rgba(245,158,11,0.35)]',
    borderAccent: 'border-amber-500/20',
    labelColor: 'text-amber-400',
  },
  info: {
    icon: Info,
    iconBg: 'bg-emerald-500/10 border-[var(--border2)]',
    iconColor: 'text-emerald-400',
    confirmBtn: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_4px_20px_rgba(16,185,129,0.35)]',
    borderAccent: 'border-[var(--border2)]',
    labelColor: 'text-emerald-400',
  },
};

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--bg4)] backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className={`relative w-full max-w-sm bg-[var(--card-bg)] border ${cfg.borderAccent} rounded-3xl shadow-2xl overflow-hidden`}
          >
            {/* Top accent line */}
            <div className={`h-[2px] w-full ${variant === 'danger' ? 'bg-rose-500/60' : variant === 'warning' ? 'bg-amber-500/60' : 'bg-emerald-500/60'}`} />

            <div className="p-7">
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                  <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                </div>
                <div className="pt-0.5">
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${cfg.labelColor}`}>
                    Confirmation Required
                  </p>
                  <h3 className="text-[15px] font-black text-[var(--text)] leading-snug tracking-tight">
                    {title}
                  </h3>
                </div>
              </div>

              {/* Message */}
              <p className="text-[12px] font-medium text-[var(--muted)] leading-relaxed mb-7 pl-[60px]">
                {message}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg4)] transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${cfg.confirmBtn}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ─── Hook for imperative usage ─────────────────────────────────────────── */
interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
  onConfirm: () => void;
}

const defaultState: ConfirmState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger',
  onConfirm: () => {},
};

export const useConfirmModal = () => {
  const [state, setState] = React.useState<ConfirmState>(defaultState);

  const confirm = (opts: Omit<ConfirmState, 'isOpen'>) =>
    setState({ ...opts, isOpen: true });

  const close = () => setState(prev => ({ ...prev, isOpen: false }));

  const modalProps: ConfirmModalProps = {
    ...state,
    onCancel: close,
    onConfirm: () => { state.onConfirm(); close(); },
  };

  return { confirm, modalProps };
};
