"use client";

import React, { useState, useEffect, useDeferredValue, useMemo } from 'react';
import {
  Bot, Search, Plus, Edit3, Trash2, 
  ChevronLeft, ChevronRight, Loader2, Globe, Archive, RotateCcw,
  Cpu, Filter, RefreshCw, Fingerprint, Save, X, ExternalLink,
  AlertTriangle, Star, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import { CustomDropdown } from './CustomDropdown';
import { socket } from '../../lib/socket';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';

interface Category { id: string; name: string; }
interface Tool {
  id: string; name: string; slug?: string; description: string; url: string;
  category_id: string; category_name?: string; sub_category?: string; micro_category?: string;
  model_version: string; platform_type?: string; pricing_model?: string;
  developer_name?: string; launch_date?: string; is_archived: boolean;
  is_active: boolean; rating?: number; created_at: string;
  short_description?: string; use_case: string; key_features?: string | string[];
  search_keywords?: string | string[]; integrations?: string | string[]; tags?: string | string[];
  tool_status?: string; is_featured?: boolean; source?: string; category_icon?: string;
  website_url?: string;
}

const LocalSearchInput = ({ value, onChange, className, placeholder }: { value: string, onChange: (v: string) => void, className?: string, placeholder?: string }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  useEffect(() => {
    if (localValue === value) return;
    const handler = setTimeout(() => onChange(localValue), 200);
    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);
  return (
    <input type="text" placeholder={placeholder} value={localValue} onChange={(e) => setLocalValue(e.target.value)} className={className} />
  );
};

export const ToolManagement = ({ initialCategory = 'all' }: { initialCategory?: string }) => {
  const { showToast } = useToast();
  const { confirm: openConfirm, modalProps } = useConfirmModal();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activePlatform, setActivePlatform] = useState('all');
  const [filterRecommended, setFilterRecommended] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => { setActiveCategory(initialCategory); }, [initialCategory]);

  const fetchCategories = async () => {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/categories`, { signal: controller.signal });
      clearTimeout(timeoutId);
      setCategories(await response.json());
    } catch (err) {
      try {
        const { getCachedCategories } = await import('@/lib/offlineCache');
        const cached = await getCachedCategories();
        if (cached) setCategories(cached as Category[]);
      } catch { /* no cache */ }
    }
  };

  const fetchTools = async (page = 1) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?page=${page}`;
      if (activeCategory !== 'all' && activeCategory !== 'ALL CATEGORIES') url += `&category=${activeCategory}`;
      if (activePlatform !== 'all' && activePlatform !== 'ALL PLATFORMS') url += `&platform=${activePlatform}`;
      if (filterRecommended) url += `&featured=true`;
      if (debouncedSearchQuery) url += `&search=${debouncedSearchQuery}`;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) abortControllerRef.current.abort(new Error('TimeoutError'));
      }, 4000);
      const response = await fetch(url, { signal: controller.signal, headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token')}` } });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data.tools) {
        setTools(data.tools);
        setPagination({ pages: data.pagination.pages, total: data.pagination.total });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' || err.message === 'TimeoutError') {
        try {
          const { getCachedTools } = await import('@/lib/offlineCache');
          const cached = (await getCachedTools()) as Tool[] | null;
          if (cached && cached.length > 0) {
            let filtered = cached.filter((t) => !t.is_archived);
            if (activeCategory !== 'all' && activeCategory !== 'ALL CATEGORIES') {
              filtered = filtered.filter((t) => t.category_name === activeCategory || t.category_id === activeCategory);
            }
            if (activePlatform !== 'all' && activePlatform !== 'ALL PLATFORMS') {
              filtered = filtered.filter((t) => t.platform_type?.toLowerCase().includes(activePlatform.toLowerCase()));
            }
            if (filterRecommended) {
              filtered = filtered.filter((t) => t.is_featured || (t.rating && t.rating >= 4.5));
            }
            if (debouncedSearchQuery) {
              const q = debouncedSearchQuery.toLowerCase();
              filtered = filtered.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
            }
            const pageSize = 30;
            const start = (page - 1) * pageSize;
            setTools(filtered.slice(start, start + pageSize));
            setPagination({ pages: Math.max(1, Math.ceil(filtered.length / pageSize)), total: filtered.length });
          } else {
            showToast('Offline — no cached data available.', 'error');
          }
        } catch {
          showToast('Failed to retrieve AI directory.', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchTools(currentPage); }, [currentPage, activeCategory, activePlatform, filterRecommended, debouncedSearchQuery]);
  useEffect(() => { setCurrentPage(1); }, [activeCategory, activePlatform, filterRecommended, debouncedSearchQuery]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    const handleRefresh = () => fetchTools(currentPage);
    socket.on('refresh_matrix', handleRefresh);
    return () => { socket.off('refresh_matrix', handleRefresh); };
  }, [currentPage, activeCategory, activePlatform, filterRecommended, debouncedSearchQuery]);

  const handleArchive = async (id: string, archive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
        body: JSON.stringify({ is_archived: archive })
      });
      if (response.ok) {
        showToast(archive ? 'Asset archived.' : 'Asset restored.', 'success');
        fetchTools(currentPage);
      }
    } catch (err) {}
  };

  const handleDelete = async (id: string) => {
    openConfirm({
      title: 'Terminate Intelligence Asset',
      message: 'Permanently terminate this intelligence asset from the matrix? This action is irreversible.',
      confirmText: 'Terminate Asset',
      cancelText: 'Abort',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token')}` }
          });
          if (response.ok) { showToast('Asset terminated.', 'success'); fetchTools(currentPage); }
        } catch (err) {}
      },
    });
  };

  const handleFormSubmit = async (formData: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const isEdit = !!editingTool;
    const url = isEdit ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${editingTool.id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools`;
    try {
      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast(isEdit ? 'Asset updated.' : 'Asset registered.', 'success');
        setIsSidePanelOpen(false);
        setEditingTool(null);
        fetchTools(1);
      } else {
        showToast('Matrix synchronization failure.', 'error');
      }
    } catch (err) {
      showToast('Synchronization failure.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col font-sans text-left pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative px-4 sm:px-6 pt-4 sm:pt-5">
      <ConfirmModal {...modalProps} />
      
      {/* Header */}
      <div className="flex-none space-y-4 pb-4 sm:pb-5 border-b border-[var(--border)] mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-[var(--border)] flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-royal text-lg sm:text-xl lg:text-2xl font-black text-[var(--text)] tracking-tight leading-none">Matrix Manager</h1>
              <p className="text-[9px] sm:text-[10px] font-black text-emerald-400/70 uppercase tracking-widest font-mono mt-1 flex flex-wrap items-center gap-2">
                {pagination.total} Active Nodes Cataloged
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--bg)] border border-emerald-500/20 text-emerald-400/70 normal-case tracking-normal font-sans">View Offline / Edit Online</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full justify-between sm:w-auto sm:justify-start">
            <button onClick={() => { fetchTools(currentPage); showToast('Syncing...', 'info'); }} className="flex-1 sm:flex-none justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Resync</span>
            </button>
            <button onClick={() => { setEditingTool(null); setIsSidePanelOpen(true); }} className="flex-grow sm:flex-none justify-center px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 border border-transparent transition-all cursor-pointer font-bold">
              <Plus size={13} /> Register Node
            </button>
          </div>
        </div>

        {/* Filters (Desktop Only) */}
        <div className="hidden md:flex md:flex-row gap-3 sm:gap-4 items-center justify-between bg-[var(--card-bg)] border border-[var(--border)] p-3 sm:p-3.5 rounded-2xl">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
            <input type="text" placeholder="Scan registry..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl h-[46px] pl-10 pr-4 text-[11px] sm:text-[12px] font-semibold text-[var(--text)] focus:outline-none focus:border-emerald-500/40 placeholder:text-[var(--muted2)] transition-all" />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="w-full sm:w-48 h-[46px]"><CustomDropdown options={[{ id: 'all', name: 'All Categories' }, ...categories]} value={activeCategory} onChange={setActiveCategory} icon={<Filter size={14} className="text-[var(--muted2)]" />} /></div>
            <div className="w-full sm:w-40 h-[46px]"><CustomDropdown options={[{ id: 'all', name: 'All Platforms' }, { id: 'Web', name: 'Web' }, { id: 'Mobile', name: 'Mobile' }, { id: 'API', name: 'API' }]} value={activePlatform} onChange={setActivePlatform} icon={<Globe size={14} className="text-[var(--muted2)]" />} /></div>
          </div>
        </div>

        {/* Filters (Mobile/Tablet Only) */}
        <div className="flex md:hidden w-full gap-2.5 sm:gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
            <input type="text" placeholder="Scan registry..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl h-[46px] pl-10 pr-4 text-[11px] sm:text-[12px] font-semibold text-[var(--text)] focus:outline-none focus:border-emerald-500/40 placeholder:text-[var(--muted2)] transition-all" />
          </div>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className={`px-3.5 h-[46px] rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border flex items-center justify-center gap-1.5 shrink-0 ${
              activeCategory !== 'all' || activePlatform !== 'all'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--muted)]'
            }`}
          >
            <Filter size={14} />
            <span>Filter</span>
            {(activeCategory !== 'all' || activePlatform !== 'all') && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Mobile Filter Modal Popup */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
              />
              {/* Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[var(--card-bg)] border-t border-[var(--border)] rounded-t-[28px] z-[160] flex flex-col shadow-2xl p-5 sm:p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-5">
                  <div className="flex items-center gap-2">
                    <Filter className="text-emerald-400 w-5 h-5" />
                    <h3 className="font-royal text-[16px] font-black uppercase text-[var(--text)]">Filter Nodes</h3>
                  </div>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 rounded-xl border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-5 flex-1 text-left">
                  {/* Sector Selection */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Filter by Category</span>
                    <div className="w-full h-[46px]">
                      <CustomDropdown
                        options={[{ id: 'all', name: 'All Categories' }, ...categories]}
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val)}
                        icon={<Filter size={14} className="text-[var(--muted2)]" />}
                      />
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Filter by Platform</span>
                    <div className="w-full h-[46px]">
                      <CustomDropdown
                        options={[
                          { id: 'all', name: 'All Platforms' },
                          { id: 'Web', name: 'Web' },
                          { id: 'Mobile', name: 'Mobile' },
                          { id: 'API', name: 'API' }
                        ]}
                        value={activePlatform}
                        onChange={(val) => setActivePlatform(val)}
                        icon={<Globe size={14} className="text-[var(--muted2)]" />}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 sm:pt-6 border-t border-[var(--border)] mt-5 sm:mt-6 flex gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setActivePlatform('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg)] text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-all font-mono cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest font-mono transition-all text-center cursor-pointer font-bold"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Data Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[250px]">

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] font-mono">Scanning Registry...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-35 py-20">
              <Bot className="w-10 h-10 text-[var(--muted2)] mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] font-mono">No nodes match criteria</p>
            </div>
          ) : (
            <div className="w-full rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card-bg)] shadow-sm">
              
              {/* DESKTOP TABLE VIEW */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--border)] text-[9px] font-black uppercase tracking-widest text-[var(--muted2)]">
                    <th className="py-4 px-6 font-mono font-black">Node</th>
                    <th className="py-4 px-6 font-mono font-black">Category</th>
                    <th className="py-4 px-6 font-mono font-black">Pricing</th>
                    <th className="py-4 px-6 font-mono font-black">Status</th>
                    <th className="py-4 px-6 text-right font-mono font-black">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool, index) => (
                    <motion.tr 
                      key={`desktop-${tool.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3) }}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--bg)] transition-colors group"
                    >
                      {/* Name & Developer */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:border-[var(--neon)]/30 transition-colors">
                            {tool.platform_type?.includes('Web') ? <Globe size={14} className="text-emerald-400" /> : <Cpu size={14} className="text-emerald-400" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-black text-[var(--text)] truncate flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors">
                              {tool.name}
                              {tool.is_featured && <Star size={10} className="fill-amber-400 text-amber-400" />}
                            </span>
                            <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest font-mono truncate">{tool.developer_name || 'System Hub'}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[9px] font-black text-[var(--text)] uppercase tracking-widest font-mono">
                          {tool.category_name || 'UNK'}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                          {tool.pricing_model || 'Free'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${tool.is_archived ? 'bg-red-500' : 'bg-[var(--neon)] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${tool.is_archived ? 'text-red-400' : 'text-[var(--neon)]'}`}>
                            {tool.is_archived ? 'Offline' : 'Active'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          {(tool.website_url || tool.url) && (
                            <a
                              href={tool.website_url || tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-[var(--muted)] flex items-center justify-center transition-all"
                              title="Visit Platform"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <button 
                            onClick={() => { setEditingTool(tool); setIsSidePanelOpen(true); }} 
                            className="w-8 h-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-[var(--muted)] flex items-center justify-center transition-all"
                            title="Modify Config"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button 
                            onClick={() => handleArchive(tool.id, !tool.is_archived)} 
                            className="w-8 h-8 rounded-lg hover:bg-amber-500/10 hover:text-amber-400 text-[var(--muted)] flex items-center justify-center transition-all"
                            title={tool.is_archived ? "Restore Node" : "Archive Node"}
                          >
                            {tool.is_archived ? <RotateCcw size={13} /> : <Archive size={13} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(tool.id)} 
                            className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[var(--muted)] flex items-center justify-center transition-all"
                            title="Purge Node"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* MOBILE CARD VIEW */}
              <div className="md:hidden flex flex-col divide-y divide-[var(--border)]">
                {tools.map((tool, index) => (
                  <motion.div 
                    key={`mobile-${tool.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    className="p-4 bg-[var(--bg)] hover:bg-[var(--card-bg)] transition-colors flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          {tool.platform_type?.includes('Web') ? <Globe size={16} className="text-emerald-400" /> : <Cpu size={16} className="text-emerald-400" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-black text-[var(--text)] truncate flex items-center gap-1.5">
                            {tool.name}
                            {tool.is_featured && <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />}
                          </span>
                          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest font-mono truncate">{tool.developer_name || 'System Hub'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${tool.is_archived ? 'bg-red-500' : 'bg-[var(--neon)] animate-pulse'}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${tool.is_archived ? 'text-red-400' : 'text-[var(--neon)]'}`}>
                            {tool.is_archived ? 'Offline' : 'Active'}
                          </span>
                        </div>
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border)] text-[8px] font-black text-[var(--text)] uppercase tracking-widest font-mono">
                          {tool.category_name || 'UNK'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                        {tool.pricing_model || 'Free'}
                      </span>
                      <div className="flex items-center gap-2">
                        {(tool.website_url || tool.url) && (
                          <a href={tool.website_url || tool.url} target="_blank" rel="noopener noreferrer" className="h-8 px-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-emerald-500/30 hover:text-emerald-400 text-[var(--muted)] flex items-center justify-center transition-all">
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <button onClick={() => { setEditingTool(tool); setIsSidePanelOpen(true); }} className="h-8 px-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-blue-500/30 hover:text-blue-400 text-[var(--muted)] flex items-center justify-center transition-all">
                          <Edit3 size={12} />
                        </button>
                        <button onClick={() => handleArchive(tool.id, !tool.is_archived)} className="h-8 px-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-amber-500/30 hover:text-amber-400 text-[var(--muted)] flex items-center justify-center transition-all">
                          {tool.is_archived ? <RotateCcw size={12} /> : <Archive size={12} />}
                        </button>
                        <button onClick={() => handleDelete(tool.id)} className="h-8 px-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-red-500/30 hover:text-red-400 text-[var(--muted)] flex items-center justify-center transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      {/* Pagination Footer */}
      <div className="flex-none pt-4 flex items-center justify-between">
        <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest font-mono hidden sm:block">Page {currentPage} of {pagination.pages}</span>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-2 rounded-xl bg-[var(--bg)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 border border-[var(--border)] text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all cursor-pointer">
            <ChevronLeft size={12} /> Prev
          </button>
          <button disabled={currentPage === pagination.pages} onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))} className="px-3 py-2 rounded-xl bg-[var(--bg)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 border border-[var(--border)] text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all cursor-pointer">
            Next <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Slide-out Side Panel for Advanced JSON Edit */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidePanelOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[var(--card-bg)] border-l border-[var(--border)] z-[110] flex flex-col shadow-2xl">
              <ToolJSONEditor 
                view={editingTool ? 'edit' : 'add'} 
                initialData={editingTool} 
                isSubmitting={isSubmitting} 
                onCancel={() => setIsSidePanelOpen(false)} 
                onSubmit={handleFormSubmit} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ToolFormProps { view: 'add' | 'edit'; initialData: Tool | null; isSubmitting: boolean; onCancel: () => void; onSubmit: (data: any) => void; }

const emptyToolTemplate = {
  "id": "",
  "name": "",
  "slug": "",
  "short_description": "",
  "description": "",
  "use_case": "",
  "key_features": [""],
  "search_keywords": [""],
  "website_url": "",
  "logo_url": "",
  "category_id": "",
  "category_name": "",
  "category_icon": "",
  "sub_category": "",
  "micro_category": "",

  "pricing_type": "",
  "pricing_details": "",
  "developer_name": "",
  "developer_description": "",
  "author_name": "",
  "author_description": "",
  "ai_model_used": "",
  "platform_support": [""],
  "launch_date": "",
  "tool_status": "",
  "is_featured": false,
  "integrations": [] as string[],
  "api_available": false,
  "rating": 0.0,
  "tags": [""],
  "last_verified": "",
  "created_at": "",
  "updated_at": ""
};

const ToolJSONEditor = ({ view, initialData, isSubmitting, onCancel, onSubmit }: ToolFormProps) => {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let startingData = { ...emptyToolTemplate };
    if (view === 'edit' && initialData) {
      const normalizeArray = (val: string | string[] | undefined): string[] => {
        if (!val) return [];
        return Array.isArray(val) ? val : [val];
      };
      startingData = {
        ...emptyToolTemplate,
        ...initialData,
        key_features: normalizeArray(initialData.key_features),
        search_keywords: normalizeArray(initialData.search_keywords),
        integrations: normalizeArray(initialData.integrations),
        tags: normalizeArray(initialData.tags),
        platform_support: normalizeArray((initialData as any).platform_support),
      };
    }
    setJsonString(JSON.stringify(startingData, null, 2));
  }, [initialData, view]);

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonString);
      setError(null);
      onSubmit(parsed);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  return (
    <div className="flex flex-col h-full font-sans text-[var(--text)] relative bg-[var(--card-bg)]">
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-[var(--border)] flex items-center justify-center">
            <Bot size={20} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text)]">{view === 'add' ? 'Initialize Raw Node Config' : 'Modify Raw Node Config'}</h2>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono mt-1">Direct Matrix JSON Access</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors cursor-pointer"><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-hidden p-6 flex flex-col bg-[var(--bg)]">
        <div className="mb-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 flex items-start gap-3">
          <Fingerprint className="text-emerald-400 shrink-0 mt-0.5" size={16} />
          <p className="text-[10px] font-bold text-[var(--muted)] leading-relaxed font-mono">
            Ensure the JSON structure matches the 34-field schema protocol. Arrays and booleans must be strictly typed.
          </p>
        </div>

        <textarea
          value={jsonString}
          onChange={(e) => { setJsonString(e.target.value); setError(null); }}
          className="flex-1 w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 text-[12px] text-emerald-400 focus:outline-none focus:border-emerald-500/40 font-mono transition-all resize-none no-scrollbar shadow-inner"
          spellCheck={false}
        />
        
        {error && (
          <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-[10px] font-black text-red-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[var(--border)] bg-[var(--bg)] flex justify-between items-center gap-3">
        <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Raw Config Protocol // V2</span>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--card-bg)] text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-all font-mono cursor-pointer">Abort</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-widest font-mono transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer">
            {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} 
            Commit To Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
