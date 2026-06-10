"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MailPlus, 
  Copy, 
  Check, 
  History, 
  User, 
  Clock,
  Mail,
  Zap,
  Key,
  ShieldCheck,
  Globe,
  Plus,
  ChevronDown,
  CheckCircle2,
  Send,
  Sparkles,
  Timer,
  Users,
  RefreshCw,
  Search,
  Trash2,
  QrCode,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';
import { useToast } from './ToastContext';

const CustomSelect = ({ value, onChange, options, label, icon: Icon, align = 'left' }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div className={`space-y-2 relative ${isOpen ? 'z-[9999]' : 'z-10'}`}>
      <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 px-4 flex items-center justify-between cursor-pointer hover:border-[var(--neon)]/50 transition-all group shadow-sm"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className="text-[var(--muted)] group-hover:text-[var(--neon)] transition-colors" />}
          <div className="flex flex-col text-left">
            <span className="text-[12px] font-bold text-[var(--text)]">{selectedOption?.label || value}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[var(--muted)]"
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[1001]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} min-w-full w-[260px] mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-[16px] overflow-hidden z-[1002] shadow-xl backdrop-blur-xl`}
            >
              {options.map((opt: any) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-[12px] font-medium cursor-pointer transition-all flex flex-col text-left group border-b border-[var(--border)]/30 last:border-0 ${
                    value === opt.value ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{opt.label}</span>
                    {value === opt.value && <CheckCircle2 size={14} className="text-[var(--neon)]" />}
                  </div>
                  {opt.description && (
                    <span className="text-[10px] text-[var(--muted2)] mt-0.5 font-normal leading-normal">
                      {opt.description}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Pending Activation';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
};

const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card-bg)] p-5 group hover:border-[var(--neon)]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm"
    style={{ boxShadow: `0 4px 20px ${color}08` }}
  >
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10" style={{ background: color }} />
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-emerald-500/20 group-hover:to-transparent transition-all" />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">{label}</p>
        <p className="text-2xl font-black text-[var(--text)]">{value}</p>
      </div>
      <div className="p-2.5 rounded-[12px] border border-[var(--border)]" style={{ background: `${color}15`, borderColor: `${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

export const InvitationCenter = ({ onBack }: { onBack?: () => void }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Member');
  const [expiry, setExpiry] = useState('7d');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending'>('All');
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<{ id: string, name: string } | null>(null);

  const roleOptions = [
    { value: 'Member', label: 'User Level Access', description: 'Standard platform features and custom tools directory access' },
    { value: 'Owner', label: 'Admin Level Access', description: 'Full administrative panel clearance, catalog managers, system status metrics' }
  ];

  const expiryOptions = [
    { value: '24h', label: '24 Hours', description: 'Access token self-destructs after 24 hours of generation' },
    { value: '7d', label: '7 Days', description: 'Standard token lifetime. Clean up inactive links in 7 days' },
    { value: '30d', label: '30 Days', description: 'Extended lifespan token for remote integrations and backup protocols' },
  ];

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/identities`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Fetch History Error:', err);
    }
  };

  const handleDeleteIdentity = async (id: string, name: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/identities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      if (response.ok) {
        showToast(`Identity node revoked & purged: ${name}`, 'success');
        fetchHistory();
      } else {
        const data = await response.json();
        showToast(data.message || 'Revocation protocol failed.', 'error');
      }
    } catch (err) {
      console.error('Delete Identity Error:', err);
      showToast('Revocation request failed. Network unreachable.', 'error');
    }
  };

  useEffect(() => {
    fetchHistory();
    if (!socket.connected) socket.connect();
    socket.on('refresh_matrix', fetchHistory);
    return () => {
      socket.off('refresh_matrix', fetchHistory);
    };
  }, []);

  const handleGenerate = async () => {
    if (!email || !username) return;
    setIsInitializing(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        body: JSON.stringify({ email, username, role })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedLink(data.invitationMessage || data.link);
        setEmail('');
        setUsername('');
        showToast(`Identity Authorized successfully: ${role}`, 'success');
        fetchHistory(); // refresh the list to show new pending item
      } else {
        showToast(data.message || 'Identity authorization failed.', 'error');
      }
    } catch (err) {
      console.error('Invite Error:', err);
      showToast('Neural link failed. Matrix server unreachable.', 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    showToast('Secure credentials copied to clipboard', 'success');
    setTimeout(() => {
      setCopied(false);
      // Reset form for new session/invite
      setGeneratedLink('');
      setEmail('');
      setUsername('');
    }, 1500);
  };

  // Filtered lists
  const filteredHistory = useMemo(() => {
    return history.filter(invite => {
      const emailMatch = invite.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const userMatch = invite.username?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const searchMatch = emailMatch || userMatch || searchQuery === '';
      
      if (statusFilter === 'All') return searchMatch;
      if (statusFilter === 'Active') return searchMatch && invite.status === 'Active';
      if (statusFilter === 'Pending') return searchMatch && invite.status !== 'Active';
      return searchMatch;
    });
  }, [history, searchQuery, statusFilter]);

  const pendingCount = history.filter(h => h.status !== 'Active').length;
  const activeCount = history.filter(h => h.status === 'Active').length;

  return (
    <div 
      style={{ WebkitOverflowScrolling: 'touch' }}
      className="h-[calc(100vh-76px)] md:h-[calc(100vh-84px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans xl:overflow-hidden overflow-y-auto no-scrollbar pb-16 xl:pb-0 px-4 sm:px-5 pt-4 sm:pt-5"
    >
      {/* Grand Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-none mb-4 sm:mb-6 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {onBack && (
              <button
                onClick={onBack}
                type="button"
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--border)] text-[var(--text)] transition-all border border-[var(--border)] shrink-0 cursor-pointer"
              >
                <ArrowRight size={16} className="rotate-180" />
              </button>
            )}
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--neon)] blur-[18px] opacity-25 rounded-full" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] border border-[var(--neon)]/30 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))' }}>
                <MailPlus className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--neon)]" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight font-royal leading-none">
                  Invitation Matrix
                </h1>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[8px] sm:text-[9px] font-black uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 w-fit"
                  style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)', color: 'var(--neon)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                  LIVE MATRIX GATEWAY
                </span>
              </div>
              <p className="text-[11px] sm:text-[12px] font-medium text-[var(--muted)]">
                Cryptographically initialize secure credentials · Regulate enterprise access vectors
              </p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchHistory}
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-[12px] border border-[var(--border)] bg-[var(--input-bg)] hover:border-[var(--neon)] hover:text-[var(--text)] transition-all text-[var(--muted)] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider cursor-pointer shadow-sm"
          >
            <RefreshCw size={12} className="text-[var(--neon)]" />
            Synchronize
          </motion.button>
        </div>
      </motion.div>



      <div className="flex-none xl:flex-1 xl:min-h-0 pb-20 xl:pb-5 sm:pb-6 flex flex-col xl:h-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 xl:flex-1 xl:min-h-0 h-auto xl:h-full">
          
          {/* Token Initialization Panel */}
          <div className="xl:col-span-5 h-auto xl:h-full xl:min-h-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative rounded-[22px] border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-6 flex flex-col h-auto xl:h-full shadow-lg"
            >
              {/* Background gradient orb */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-[0.06] pointer-events-none"
                style={{ background: 'var(--neon)' }} />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-[0.04] pointer-events-none"
                style={{ background: 'var(--emerald)' }} />
              
              <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6 relative">
                <div className="p-2 sm:p-2.5 rounded-[12px] border border-[var(--border)]"
                  style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon)]" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-[14px] font-extrabold text-[var(--text)]">
                    {generatedLink ? 'Signature Generated ✓' : 'Access Token Dispatcher'}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[var(--muted)] mt-0.5 uppercase tracking-widest font-mono">System Version v3.0</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!generatedLink ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGenerate();
                    }}
                  >
                    <div className="space-y-4">
                      {/* Email address */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider ml-1">Target Email Vector</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--neon)] transition-colors" />
                          <input 
                            required
                            type="email"
                            placeholder="entity@enterprise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 pl-12 pr-4 text-[13px] font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)]/60 focus:ring-2 focus:ring-[var(--neon)]/10 transition-all placeholder:text-[var(--muted2)] shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Username */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider ml-1">Registry Name Handle</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--neon)] transition-colors" />
                          <input 
                            required
                            type="text"
                            placeholder="e.g. NeoMatrix_01"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 pl-12 pr-4 text-[13px] font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)]/60 focus:ring-2 focus:ring-[var(--neon)]/10 transition-all placeholder:text-[var(--muted2)] shadow-sm"
                          />
                        </div>
                      </div>

                      {/* selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CustomSelect 
                          label="Authority Clearance"
                          value={role}
                          onChange={setRole}
                          options={roleOptions}
                          icon={ShieldCheck}
                        />
                        <CustomSelect 
                          label="Token Lifespan"
                          value={expiry}
                          onChange={setExpiry}
                          options={expiryOptions}
                          icon={Timer}
                          align="right"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pb-2 mt-auto">
                      <div className="flex items-start gap-2.5 px-3 py-3 rounded-[12px] bg-[var(--input-bg)] border border-[var(--border)]">
                        <Info size={14} className="text-[var(--neon)] shrink-0 mt-0.5" />
                        <p className="text-[10px] leading-relaxed text-[var(--muted)]">
                          Authorized identities receive a cryptographic link to secure login. Refresh logs to track activation status.
                        </p>
                      </div>

                      <motion.button 
                        type="submit"
                        disabled={!email || !username || isInitializing}
                        whileHover={!isInitializing ? { scale: 1.01 } : {}}
                        whileTap={!isInitializing ? { scale: 0.98 } : {}}
                        className="w-full h-12 rounded-[13px] text-[12px] font-black uppercase tracking-widest disabled:opacity-60 transition-all flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden"
                        style={{ background: isInitializing ? 'rgba(16,185,129,0.6)' : 'var(--neon)', color: '#000', boxShadow: '0 4px 20px rgba(16,185,129,0.25)' }}
                      >
                        {/* Shimmer overlay while loading */}
                        {isInitializing && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          />
                        )}
                        {isInitializing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                              className="shrink-0"
                            >
                              <RefreshCw size={15} />
                            </motion.div>
                            <span className="relative z-10">Binding Node...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} className="stroke-[2.5] shrink-0" />
                            Initialize Matrix link
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Success Banner */}
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-[12px] border"
                        style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }}>
                        <div className="p-1 rounded-full bg-[var(--neon)]/15">
                          <CheckCircle2 size={15} className="text-[var(--neon)] shrink-0" />
                        </div>
                        <span className="text-[11px] font-bold tracking-wide text-[var(--neon)] uppercase">Access Key Sync Successful</span>
                      </div>

                      {/* Interactive Holographic Key Visual */}
                      <div className="relative h-28 rounded-[16px] border border-[var(--border)] overflow-hidden bg-gradient-to-br from-[var(--input-bg)] to-[var(--bg)] flex items-center justify-center p-4">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                          style={{ backgroundImage: 'radial-gradient(var(--neon) 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                        <div className="absolute w-24 h-24 rounded-full border border-dashed border-[var(--neon)]/20 animate-spin" style={{ animationDuration: '20s' }} />
                        <div className="absolute w-16 h-16 rounded-full border border-[var(--neon)]/10 flex items-center justify-center">
                          <Key className="w-6 h-6 text-[var(--neon)] animate-pulse" />
                        </div>
                        <div className="relative text-center ml-auto">
                          <div className="inline-block px-2 py-0.5 rounded bg-[var(--neon)]/10 text-[8px] font-mono text-[var(--neon)] uppercase border border-[var(--neon)]/20 mb-1">
                            {role} Token
                          </div>
                          <p className="text-[10px] font-mono text-[var(--muted2)]">SIG: {username.substring(0, 10)}</p>
                        </div>
                      </div>

                      {/* Copy Box Container */}
                      <div className="rounded-[16px] border border-[var(--border)] overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--input-bg)]">
                          <span className="text-[10px] font-bold text-[var(--text)] uppercase tracking-widest font-mono">Vector Signature Data</span>
                          <div className="flex gap-2">
                            <motion.button 
                              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generatedLink)}`, '_blank')}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-[10px] border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--neon)] hover:text-[var(--neon)] transition-all text-[var(--muted)] cursor-pointer"
                              title="Share via WhatsApp"
                            >
                              <Globe size={13} />
                            </motion.button>
                            <motion.button 
                              onClick={handleCopy}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-[10px] border transition-all cursor-pointer flex items-center gap-1.5 px-3"
                              style={copied 
                                ? { background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--neon)' }
                                : { borderColor: 'var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }
                              }
                            >
                              {copied ? (
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                                  <Check size={12} /> Copied!
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                                  <Copy size={12} /> Copy link
                                </span>
                              )}
                            </motion.button>
                          </div>
                        </div>
                        <div className="text-[11px] font-mono text-[var(--muted)] whitespace-pre-wrap p-5 bg-[var(--input-bg)] select-all max-h-[160px] overflow-y-auto no-scrollbar leading-relaxed border-t-0">
                          {generatedLink}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]/50">
                      <motion.button 
                        onClick={() => { setGeneratedLink(''); setEmail(''); }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-11 bg-[var(--input-bg)] border border-[var(--border)] hover:border-[var(--neon)] text-[var(--text)] rounded-[13px] text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Plus size={14} className="text-[var(--neon)]" />
                        Initialize new matrix node
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Protocol History / Nodes Log */}
          <div className="xl:col-span-7 h-auto xl:h-full xl:min-h-0 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-[22px] border border-[var(--border)] bg-[var(--card-bg)] flex flex-col h-auto xl:h-full xl:min-h-0 overflow-hidden shadow-lg"
            >
              {/* Header block */}
              <div className="px-6 py-5 border-b border-[var(--border)] flex flex-col gap-4 bg-[var(--card-bg)] relative shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-[12px] border border-[var(--border)]"
                      style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }}>
                      <History className="w-4 h-4 text-[var(--emerald)]" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[var(--text)]">Node Authorization Registry</h3>
                      <p className="text-[10px] text-[var(--muted)] font-mono">Sync state active</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                    style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {filteredHistory.length} Nodes listed
                  </span>
                </div>

                {/* Filters and search toolbar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-1 pt-1 border-t border-[var(--border)]/30">
                  <div className="relative w-full sm:flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                    <input 
                      type="text" 
                      placeholder="Filter registry by handle or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[11px] h-10 pl-10 pr-4 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--neon)] transition-all placeholder:text-[var(--muted2)] font-semibold"
                    />
                  </div>

                  <div className="flex gap-1.5 w-full sm:w-auto shrink-0 justify-end">
                    {(['All', 'Active', 'Pending'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-3 py-2 rounded-[10px] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
                          statusFilter === tab
                            ? 'bg-[var(--neon)]/10 text-[var(--neon)] border-[var(--neon)]/30'
                            : 'bg-[var(--input-bg)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Node Log Body */}
              <div className="flex-1 overflow-x-auto xl:overflow-y-auto no-scrollbar">
                <table className="hidden md:table w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-[var(--card-bg)] shadow-sm">
                    <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/30">
                      <th className="px-6 py-4 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest whitespace-nowrap">Access Target Handle</th>
                      <th className="px-6 py-4 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest whitespace-nowrap">Clearance</th>
                      <th className="px-6 py-4 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest text-center whitespace-nowrap">Link Sync</th>
                      <th className="px-6 py-4 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest text-right whitespace-nowrap">Modified</th>
                      <th className="px-6 py-4 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest text-center whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredHistory.map((invite, i) => (
                        <motion.tr
                          key={invite.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.3 }}
                          className="border-b border-[var(--border)]/70 group transition-all hover:bg-[var(--input-bg)]/40 cursor-default"
                        >
                          {/* target handle */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 text-[12px] font-black transition-all border group-hover:scale-105"
                                style={invite.status === 'Active' 
                                  ? { background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.2)' }
                                  : { background: 'rgba(249,115,22,0.1)', color: '#f97316', borderColor: 'rgba(249,115,22,0.2)' }
                                }>
                                {(invite.username || invite.email || '?')[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-[var(--text)] truncate max-w-[150px]" title={invite.username}>
                                  {invite.username || 'System Handle'}
                                </span>
                                <span className="text-[10px] text-[var(--muted2)] font-mono truncate max-w-[180px]" title={invite.email}>
                                  {invite.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* role */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-wider border"
                              style={{
                                background: invite.role === 'Owner' ? 'rgba(59,130,246,0.1)' : 'var(--input-bg)',
                                borderColor: invite.role === 'Owner' ? 'rgba(59,130,246,0.2)' : 'var(--border)',
                                color: invite.role === 'Owner' ? '#3b82f6' : 'var(--muted)'
                              }}>
                              {invite.role || 'Member'}
                            </span>
                          </td>

                          {/* link sync status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center">
                              <span className={`px-2.5 py-1.5 rounded-[8px] text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                                invite.status === 'Active' 
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                  : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${invite.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500 animate-ping'}`} />
                                {invite.status === 'Active' ? 'Activated' : 'Pending Link'}
                              </span>
                            </div>
                          </td>

                          {/* timestamp */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="text-[11px] font-semibold text-[var(--muted)] font-mono">
                              {formatDate(invite.lastLogin)}
                            </span>
                          </td>

                          {/* Operations */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {invite.status !== 'Active' && (
                                <button
                                  onClick={() => {
                                    // Regenerate or grab invitation data
                                    const template = `You have been authorized as a ${invite.role || 'Member'} in MANMADHAN'S HUB.\nEmail: ${invite.email}\nUse this identity to complete portal onboarding.`;
                                    navigator.clipboard.writeText(template);
                                    showToast('Credentials draft copied to clipboard', 'info');
                                  }}
                                  className="p-2 rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--neon)] hover:border-[var(--neon)]/50 transition-all cursor-pointer"
                                  title="Copy Authorization Info"
                                >
                                  <Copy size={13} />
                                </button>
                              )}
                              
                              <button
                                onClick={() => setDeleteConfirmUser({ id: invite.id, name: invite.username || invite.email })}
                                className="p-2 rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[var(--muted)] hover:text-rose-500 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all cursor-pointer"
                                title="Revoke Clearance & Purge Node"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>

                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={5}>
                          <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-[20px] border border-[var(--border)] flex items-center justify-center mb-4 bg-[var(--input-bg)]/50">
                              <Globe size={28} className="text-[var(--muted2)]" />
                            </div>
                            <p className="text-[13px] font-bold text-[var(--muted)] mb-1">No nodes match search filters</p>
                            <p className="text-[11px] text-[var(--muted2)] max-w-[200px]">
                              Verify the email or handle criteria, or select another sync filter category.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* --- Mobile View Cards --- */}
                <div className="block md:hidden space-y-3 p-4">
                  <AnimatePresence>
                    {filteredHistory.map((invite, i) => (
                      <motion.div
                        key={invite.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.3 }}
                        className="bg-[var(--card-bg)] border border-[var(--border2)] rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black border"
                              style={invite.status === 'Active' 
                                ? { background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.2)' }
                                : { background: 'rgba(249,115,22,0.1)', color: '#f97316', borderColor: 'rgba(249,115,22,0.2)' }
                              }>
                              {(invite.username || invite.email || '?')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-[var(--text)] truncate max-w-[150px]">{invite.username || 'System Handle'}</p>
                              <p className="text-[10px] text-[var(--muted2)] font-mono truncate max-w-[180px]">{invite.email}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-[var(--muted2)]">{formatDate(invite.lastLogin)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border"
                            style={{
                              background: invite.role === 'Owner' ? 'rgba(59,130,246,0.1)' : 'var(--input-bg)',
                              borderColor: invite.role === 'Owner' ? 'rgba(59,130,246,0.2)' : 'var(--border)',
                              color: invite.role === 'Owner' ? '#3b82f6' : 'var(--muted)'
                            }}>
                            {invite.role || 'Member'}
                          </span>
                          
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border ${
                            invite.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${invite.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500 animate-ping'}`} />
                            {invite.status === 'Active' ? 'Activated' : 'Pending Link'}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[var(--border)]/40">
                          {invite.status !== 'Active' && (
                            <button
                              onClick={() => {
                                const template = `You have been authorized as a ${invite.role || 'Member'} in MANMADHAN'S HUB.\nEmail: ${invite.email}\nUse this identity to complete portal onboarding.`;
                                navigator.clipboard.writeText(template);
                                showToast('Credentials draft copied to clipboard', 'info');
                              }}
                              className="flex-1 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[8px] font-black text-[var(--muted)] hover:text-[var(--neon)] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Copy size={11} /> Copy Draft
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmUser({ id: invite.id, name: invite.username || invite.email })}
                            className="flex-1 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[8px] font-black text-[var(--muted)] hover:text-rose-500 hover:border-rose-500/30 uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 size={11} /> Revoke
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredHistory.length === 0 && (
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-[16px] border border-[var(--border)] flex items-center justify-center mb-3 bg-[var(--input-bg)]/50">
                        <Globe size={20} className="text-[var(--muted2)]" />
                      </div>
                      <p className="text-[11px] font-bold text-[var(--muted)] mb-0.5">No nodes match filters</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete / Revoke Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmUser && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-[var(--card-bg)] border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.15)] z-10"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-[var(--text)] tracking-tight mb-2">Revoke Clearance Matrix</h3>
                  <p className="text-[11px] font-medium text-[var(--muted)] leading-relaxed">
                    Are you sure you want to permanently revoke all access credentials and purge identity node{' '}
                    <span className="font-extrabold text-rose-500 font-mono">{deleteConfirmUser.name}</span>?
                  </p>
                </div>
                <div className="w-full px-3 py-2.5 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[9px] font-black text-rose-500/80 uppercase tracking-widest text-center">
                  ⚠ Immediate link invalidation and system lockout
                </div>
                <div className="flex items-center gap-3 w-full mt-2">
                  <button
                    onClick={() => setDeleteConfirmUser(null)}
                    className="flex-1 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-black text-[var(--text)] uppercase tracking-widest hover:bg-[var(--border)] transition-all cursor-pointer"
                  >
                    Abort
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteIdentity(deleteConfirmUser.id, deleteConfirmUser.name);
                      setDeleteConfirmUser(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-400 transition-all cursor-pointer"
                  >
                    Confirm Purge
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
