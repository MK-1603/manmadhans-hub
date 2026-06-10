"use client";

import React, { useState } from 'react';
import { 
  Flag, 
  Search, 
  Zap, 
  Shield, 
  Globe, 
  MessageSquare, 
  LayoutDashboard, 
  Cpu, 
  CreditCard,
  Lock,
  Eye,
  Settings,
  Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';

const initialFlags = [
  { id: 'semantic_search', name: 'Semantic Search', desc: 'Qdrant vector semantic search layer for tools', active: true, sector: 'Search Engine' },
  { id: 'ai_recommendations', name: 'AI Recommendations', desc: 'GPT-4.1 personalized tool recommendations', active: true, sector: 'Neural Layer' },
  { id: 'hub_games', name: 'Hub Games Layer', desc: 'Void Runner & Neural Snake game integration', active: true, sector: 'Engagement' },
  { id: 'tool_comparison', name: 'Tool Comparison', desc: 'Side-by-side tool comparison with AI verdict', active: true, sector: 'Analysis' },
  { id: 'pwa_push', name: 'PWA Push Notifications', desc: 'Browser push notifications via service worker', active: false, sector: 'System' },
  { id: 'billing_system', name: 'Billing System v4', desc: 'Stripe billing & subscription management', active: false, sector: 'Commercial' },
  { id: 'google_oauth', name: 'Google OAuth', desc: 'Pre-authorized Google OAuth login protocol', active: true, sector: 'Security' },
  { id: 'strict_rate_limit', name: 'Strict Rate Limiting', desc: 'Enforce 20 AI req/min per user threshold', active: true, sector: 'Infrastructure' },
];

export const FeatureFlags = () => {
  const [flags, setFlags] = useState(initialFlags);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const filteredFlags = flags.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-royal text-2xl font-black text-[var(--text)] tracking-tight flex items-center gap-3">
            <Flag className="w-6 h-6 text-emerald-400" />
            Feature Flags
          </h1>
          <p className="text-xs font-bold text-emerald-400/70 uppercase tracking-[0.2em] mt-1">
            Toggle platform protocols without deployment — dynamic orchestration
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[var(--bg2)]/20 border border-[var(--border2)] p-4 rounded-2xl">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute dashboard-search-icon top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search protocols or sectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-search-input"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{flags.filter(f => f.active).length} Active</span>
          </div>
          <div className="h-4 w-px bg-emerald-500/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{flags.filter(f => !f.active).length} Disabled</span>
          </div>
        </div>
      </div>

      {/* Flags List */}
      <div className="bg-[var(--bg2)]/30 border border-[var(--border2)] rounded-[2.5rem] overflow-hidden">
        <div className="p-8 space-y-4">
          {filteredFlags.map((flag, idx) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--border2)] hover:border-[var(--border2)] transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl border transition-all ${
                  flag.active ? 'bg-emerald-500/10 border-[var(--border2)] text-emerald-400' : 'bg-[var(--glass)] border-[var(--border2)] text-[var(--text)]/20'
                }`}>
                  {flag.id.includes('search') ? <Search size={20} /> : 
                   flag.id.includes('ai') ? <Cpu size={20} /> : 
                   flag.id.includes('game') ? <Zap size={20} /> : 
                   <Flag size={20} />}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[13px] font-black text-[var(--text)] uppercase tracking-wider group-hover:text-emerald-400 transition-colors">{flag.name}</h3>
                    <span className="text-[8px] font-black text-emerald-400/20 border border-[var(--border2)] px-2 py-0.5 rounded-full uppercase tracking-widest">{flag.sector}</span>
                  </div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wide mt-1">{flag.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end mr-4">
                  <span className="text-[8px] font-black text-emerald-400/20 uppercase tracking-widest">Protocol Status</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${flag.active ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {flag.active ? 'Operational' : 'Disabled'}
                  </span>
                </div>
                
                <button 
                  onClick={() => toggleFlag(flag.id)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-500 flex items-center ${
                    flag.active ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-[var(--glass)]'
                  }`}
                >
                  <motion.div 
                    layout
                    className={`w-5 h-5 rounded-full shadow-lg ${flag.active ? 'bg-black ml-8' : 'bg-[var(--glass)] ml-1'}`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
