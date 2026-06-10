"use client";

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-[9999] flex flex-col gap-3 w-[calc(100%-32px)] sm:w-auto max-w-md pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : 100, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full"
            >
              <div className={`
                min-w-[320px] sm:min-w-[420px] bg-[#0c141c] border rounded-2xl p-5 shadow-2xl flex items-start gap-4 w-full
                ${toast.type === 'success' ? 'border-[#5BE8FB]/30' : 
                  toast.type === 'error' ? 'border-rose-500/30' : 
                  'border-amber-500/30'}
              `}>
                <div className={`
                  p-2.5 rounded-xl shrink-0
                  ${toast.type === 'success' ? 'bg-[#5BE8FB]/10' : 
                    toast.type === 'error' ? 'bg-rose-500/10' : 
                    'bg-amber-500/10'}
                `}>
                  {toast.type === 'success' && <Zap className="w-5 h-5 text-[#5BE8FB]" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                  {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                </div>

                <div className="flex-1 pt-0.5 text-left">
                  <p className="text-[10.5px] font-black text-[#8aadad] uppercase tracking-[0.2em] mb-1.5">
                    {toast.type === 'success' ? 'Protocol Sync Success' : 
                     toast.type === 'error' ? 'Critical Matrix Error' : 'System Notification'}
                  </p>
                  <p className="text-[13.5px] font-bold text-[#e8f5e8] leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors group cursor-pointer"
                >
                  <X className="w-4.5 h-4.5 text-[#4a6b6b] group-hover:text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
