"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, RefreshCw, Mail, Shield, ArrowLeft, ChevronDown, Check, Info, Lock } from 'lucide-react';
import { useToast } from './ToastContext';

interface UserEntity {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  display_id?: string;
}

interface EditIdentityViewProps {
  user: UserEntity;
  onBack: () => void;
  onSuccess: () => void;
}

export const EditIdentityView = ({ user, onBack, onSuccess }: EditIdentityViewProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<UserEntity>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loggedInRoleRaw = typeof window !== 'undefined' ? (localStorage.getItem("user_role") || "user") : "user";
  const loggedInRole = loggedInRoleRaw.toLowerCase() === 'owner' ? 'owner' : 'member';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        name: user.name || user.username || '',
        username: user.username || user.name || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/identities/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        body: JSON.stringify({
          username: formData.username || formData.name,
          email: formData.email,
          role: formData.role
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast('Identity updated successfully', 'success');
        onSuccess();
      } else {
        showToast(data.message || 'Failed to update identity', 'error');
      }
    } catch (err) {
      console.error('Update Identity Error:', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Main Content Container */}
      <div className="bg-[var(--card-bg)] border border-[var(--border2)] rounded-[20px] flex flex-col shadow-sm relative">
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          
          {/* Header Row */}
          <div className="flex-none flex items-center justify-between p-6 border-b border-[var(--border2)]">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={onBack}
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--border)] text-[var(--text)] transition-all border border-[var(--border2)] shrink-0 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0 space-y-1">
                <h2 className="text-lg font-bold text-[var(--text)] tracking-tight font-sans leading-none truncate">
                  Modify Identity Node
                </h2>
                <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider leading-none truncate">
                  Updating Node: <span className="font-mono text-[var(--neon)]">{user.display_id || user.id}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[var(--neon)] text-black rounded-[12px] text-[12px] font-extrabold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} className="stroke-[2.5]" />
                )}
                <span className="hidden md:inline">Synchronize Node</span>
                <span className="md:hidden">Sync</span>
              </button>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="p-8 pb-32">
            <div className="space-y-8">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <User size={12} /> Identity Name
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.name || formData.username || ''}
                    onChange={e => setFormData({...formData, name: e.target.value, username: e.target.value})}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 px-4 text-[13px] font-medium text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all placeholder:text-[var(--muted)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input 
                    required
                    type="email" 
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 px-4 text-[13px] font-medium text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all placeholder:text-[var(--muted)]"
                  />
                </div>

                 <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Shield size={12} /> Authority Level
                  </label>
                  {loggedInRole === 'owner' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 px-4 text-[13px] font-medium text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all flex items-center justify-between cursor-pointer text-left"
                      >
                        <span className="font-bold">{formData.role || 'Select Role'}</span>
                        <ChevronDown size={16} className={`text-[var(--muted)] transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isRoleDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-[100] top-full mt-2 w-full bg-[var(--card-bg)] border border-[var(--border2)] rounded-[14px] p-2 shadow-xl flex flex-col gap-1"
                          >
                            {[
                              { id: 'Owner', label: 'Owner' },
                              { id: 'Member', label: 'Member' }
                            ].map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, role: option.id });
                                  setIsRoleDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer text-left ${
                                  formData.role === option.id
                                    ? 'bg-[rgba(126,242,82,0.1)] text-[var(--neon)]'
                                    : 'text-[var(--text)] hover:bg-[var(--border)]'
                                }`}
                              >
                                <span>{option.label}</span>
                                {formData.role === option.id && <Check size={14} className="text-[var(--neon)]" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 px-4 text-[13px] font-medium text-[var(--muted)] flex items-center justify-between select-none opacity-70">
                      <span className="font-bold">{formData.role || 'Select Role'}</span>
                      <Lock size={14} className="text-[var(--muted)]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-5 border-t border-[var(--border2)] flex items-center justify-between bg-[var(--input-bg)] shrink-0 rounded-b-[20px]">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-[var(--muted)]" />
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Protocol: Identity Node Sync Orchestration</p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
