"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Loader2 } from 'lucide-react';
import { getToolProxyUrl } from '@/lib/workspaceData';

interface SandboxViewerProps {
  open: boolean;
  url?: string;
  title?: string;
  onClose: () => void;
}

export function SandboxViewer({ open, url, title, onClose }: SandboxViewerProps) {
  const [iframeLoading, setIframeLoading] = React.useState(true);
  const proxyUrl = url ? getToolProxyUrl(url) : '';

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) setIframeLoading(true);
  }, [open, url]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const externalUrl = url
    ? url.startsWith('http')
      ? url
      : `https://${url}`
    : '';

  const content = (
    <AnimatePresence>
      {open && url && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[10050]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-[10060] flex flex-col bg-[#0a0a0a] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pb-3 pt-[calc(12px+env(safe-area-inset-top))] border-b border-[var(--border)] bg-[#141414] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[var(--neon)]/15 border border-[var(--neon)]/25 flex items-center justify-center shrink-0">
                  <Play size={14} className="text-[var(--neon)] fill-[var(--neon)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] font-mono">
                    Launch Sandbox
                  </p>
                  <p className="text-[13px] font-bold text-[var(--text)] truncate">{title || 'Tool Preview'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--neon)] transition-all"
                  >
                    Open tab
                    <ExternalLink size={12} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer"
                  aria-label="Close sandbox"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 relative min-h-0 bg-[#0a0a0a]">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[#0a0a0a]">
                  <Loader2 size={28} className="text-[var(--neon)] animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)] font-mono">
                    Loading preview…
                  </p>
                </div>
              )}
              <iframe
                key={proxyUrl}
                src={proxyUrl}
                title={title ? `${title} sandbox` : 'Tool sandbox'}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
