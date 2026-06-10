"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ShieldAlert, Delete } from 'lucide-react';
import { useToast } from './ToastContext';

export const AppLockOverlay = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { showToast } = useToast();
  
  const [isClient, setIsClient] = useState(false);

  // Auto-lock timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Check if lock is enabled
    const checkLockStatus = () => {
      const enabled = localStorage.getItem('hub_app_lock_enabled') === 'true';
      const storedPin = localStorage.getItem('hub_app_lock_pin');
      
      if (enabled && storedPin) {
        // By default, if enabled, lock on initial load unless we want to keep it unlocked per session.
        // For maximum security, we lock it immediately on mount if it's enabled.
        const sessionUnlocked = sessionStorage.getItem('hub_app_lock_unlocked') === 'true';
        if (!sessionUnlocked) {
          setIsLocked(true);
        }
      }
    };
    
    checkLockStatus();
    
    // Listen for storage changes (if another tab enables it or changes PIN)
    window.addEventListener('storage', checkLockStatus);
    // Listen for custom event from AppSettings when settings change
    window.addEventListener('app_lock_settings_changed', checkLockStatus);
    
    return () => {
      window.removeEventListener('storage', checkLockStatus);
      window.removeEventListener('app_lock_settings_changed', checkLockStatus);
    };
  }, []);

  useEffect(() => {
    // Activity tracker for auto-lock
    const resetTimer = () => {
      if (isLocked) return;
      
      const enabled = localStorage.getItem('hub_app_lock_enabled') === 'true';
      if (!enabled) return;
      
      const timeoutStr = localStorage.getItem('hub_app_lock_timeout') || '5';
      const timeoutMins = parseInt(timeoutStr, 10);
      
      if (isNaN(timeoutMins) || timeoutMins <= 0) return;
      
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        setIsLocked(true);
        sessionStorage.removeItem('hub_app_lock_unlocked');
      }, timeoutMins * 60 * 1000);
    };

    const handleVisibilityChange = () => {
      const enabled = localStorage.getItem('hub_app_lock_enabled') === 'true';
      if (!enabled) return;
      
      // Lock immediately when the app is backgrounded/hidden
      if (document.visibilityState === 'hidden') {
        setIsLocked(true);
        sessionStorage.removeItem('hub_app_lock_unlocked');
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    if (!isLocked) {
      events.forEach(e => document.addEventListener(e, handleActivity));
      document.addEventListener('visibilitychange', handleVisibilityChange);
      resetTimer(); // init
    }

    return () => {
      events.forEach(e => document.removeEventListener(e, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLocked]);

  const handlePinInput = (digit: string) => {
    if (error) setError(false);
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (error) setError(false);
    setPin(prev => prev.slice(0, -1));
  };

  const verifyPin = (enteredPin: string) => {
    const storedPin = localStorage.getItem('hub_app_lock_pin');
    if (enteredPin === storedPin) {
      // Success
      setTimeout(() => {
        setIsLocked(false);
        setPin('');
        sessionStorage.setItem('hub_app_lock_unlocked', 'true');
        showToast('App unlocked successfully', 'success');
        
        // Trigger activity tracker restart
        window.dispatchEvent(new Event('mousemove'));
      }, 300);
    } else {
      // Error
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 500);
      showToast('Incorrect PIN', 'error');
    }
  };

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg)]/80"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon)]/[0.03] to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center"
          >
            {/* Logo / Lock Icon */}
            <div className="w-20 h-20 mb-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border2)] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon)]/10 to-transparent" />
              {error ? (
                <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
              ) : (
                <Lock className="w-10 h-10 text-[var(--neon)]" />
              )}
            </div>

            <h2 className="text-2xl font-black text-[var(--text)] tracking-tight mb-2">App Locked</h2>
            <p className="text-[13px] text-[var(--muted)] mb-8 text-center px-6">
              Enter your 4-digit PIN to access the dashboard.
            </p>

            {/* PIN Dots */}
            <motion.div 
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 mb-10"
            >
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    pin.length > i 
                      ? 'bg-[var(--neon)] shadow-[0_0_10px_var(--neon)] scale-110' 
                      : 'bg-[var(--border2)] scale-100'
                  } ${error ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : ''}`}
                />
              ))}
            </motion.div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full px-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  disabled={pin.length >= 4}
                  className="h-14 sm:h-16 rounded-2xl bg-[var(--card-bg)] border border-[var(--border2)] text-xl font-bold text-[var(--text)] hover:bg-[var(--neon)]/10 hover:border-[var(--neon)]/30 hover:text-[var(--neon)] transition-colors active:scale-95"
                >
                  {num}
                </button>
              ))}
              <div /> {/* Empty space for bottom row layout */}
              <button
                onClick={() => handlePinInput('0')}
                disabled={pin.length >= 4}
                className="h-14 sm:h-16 rounded-2xl bg-[var(--card-bg)] border border-[var(--border2)] text-xl font-bold text-[var(--text)] hover:bg-[var(--neon)]/10 hover:border-[var(--neon)]/30 hover:text-[var(--neon)] transition-colors active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                disabled={pin.length === 0}
                className="h-14 sm:h-16 rounded-2xl bg-[var(--card-bg)] border border-[var(--border2)] flex items-center justify-center text-[var(--text)] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-colors active:scale-95"
              >
                <Delete size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
