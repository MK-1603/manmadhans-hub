"use client";

import React, { useState, useEffect } from 'react';
import { FolderOpen, Search, Plus, Edit3, Trash2, Zap, ArrowLeft, Save, Info, Fingerprint, Loader2, X, Tag, Boxes, ChevronRight, ChevronDown, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';

interface Category { id: string; name: string; description: string; icon: string; sector_id: string; toolsCount: number; }
interface Sector { id: string; name: string; icon: string; }

const GRADIENT_PALETTES = [
  { from: '#10b981', to: '#059669', shadow: '#10b98118' },
  { from: '#3b82f6', to: '#2563eb', shadow: '#3b82f618' },
  { from: '#f97316', to: '#ea580c', shadow: '#f9731618' },
  { from: '#8b5cf6', to: '#7c3aed', shadow: '#8b5cf618' },
  { from: '#ec4899', to: '#db2777', shadow: '#ec489918' },
  { from: '#06b6d4', to: '#0891b2', shadow: '#06b6d418' },
  { from: '#f59e0b', to: '#d97706', shadow: '#f59e0b18' },
  { from: '#14b8a6', to: '#0d9488', shadow: '#14b8a618' },
];
const getPalette = (index: number) => GRADIENT_PALETTES[index % GRADIENT_PALETTES.length];

export const CategoryManagement = () => {
  const { showToast } = useToast();
  const { confirm: openConfirm, modalProps } = useConfirmModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewLevel, setViewLevel] = useState<'main' | 'sub' | 'micro'>('main');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const [catsRes, toolsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/categories`, { signal: controller.signal }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?all=true`, { signal: controller.signal })
      ]);
      
      clearTimeout(timeoutId);
      
      const catsData = await catsRes.json();
      const toolsData = await toolsRes.json();
      
      setCategories(Array.isArray(catsData) ? catsData : []);
      
      if (toolsData.tools) {
        setTools(toolsData.tools);
      } else if (Array.isArray(toolsData)) {
        setTools(toolsData);
      }
    } catch (err) {
      try {
        const { getCachedCategories } = await import('@/lib/offlineCache');
        const cached = await getCachedCategories();
        if (cached && cached.length > 0) {
          setCategories(cached as Category[]);
        } else {
          showToast('Taxonomy synchronization failure.', 'error');
        }
      } catch (e) {
        showToast('Taxonomy synchronization failure.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const derivedSubCategories = React.useMemo(() => {
    const subs = new Map<string, number>();
    tools.forEach((t) => {
      if (t.sub_category) {
        subs.set(t.sub_category, (subs.get(t.sub_category) || 0) + 1);
      }
    });
    return Array.from(subs.entries()).map(([name, count], id) => ({
      id: `sub-${id}`,
      name,
      description: 'Extracted automatically from tool tags.',
      icon: '📁',
      sector_id: '',
      toolsCount: count,
    }));
  }, [tools]);

  const derivedMicroCategories = React.useMemo(() => {
    const micros = new Map<string, number>();
    tools.forEach((t) => {
      if (t.micro_category) {
        micros.set(t.micro_category, (micros.get(t.micro_category) || 0) + 1);
      }
    });
    return Array.from(micros.entries()).map(([name, count], id) => ({
      id: `micro-${id}`,
      name,
      description: 'Extracted automatically from tool tags.',
      icon: '📄',
      sector_id: '',
      toolsCount: count,
    }));
  }, [tools]);

  const handleDelete = async (id: string) => {
    openConfirm({
      title: 'Delete Category',
      message: 'Permanently delete this category from the taxonomy registry? All associated tools will become unmapped.',
      confirmText: 'Delete Category',
      cancelText: 'Abort',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/categories/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token')}` }
          });
          if (response.ok) { showToast('Category permanently terminated.', 'success'); fetchData(); }
        } catch (err) {}
      },
    });
  };

  const handleFormSubmit = async (formData: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const isEdit = !!editingCategory;
    const url = isEdit ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/categories/${editingCategory.id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/categories`;
    try {
      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast(isEdit ? 'Category protocol updated.' : 'Category integrated successfully.', 'success');
        setIsSidePanelOpen(false); setEditingCategory(null); fetchData();
      }
    } catch (err) { showToast('Taxonomy mapping failure.', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const currentList = viewLevel === 'main' ? categories : viewLevel === 'sub' ? derivedSubCategories : derivedMicroCategories;

  const filteredCategories = currentList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTools = categories.reduce((s, c) => s + (c.toolsCount || 0), 0);

  const CategoryCard = ({ cat, index }: { cat: Category | any; index: number }) => {
    const palette = getPalette(index);
    const isReadOnly = viewLevel !== 'main';

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.4 }}
        className="group relative rounded-[18px] border border-[var(--border)] bg-[var(--card-bg)] p-5 hover:border-[var(--border2)] transition-all overflow-hidden"
        style={{ boxShadow: `0 4px 20px ${palette.shadow}` }}
      >
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
          style={{ background: palette.from }} />

        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl shrink-0"
            style={{ background: `linear-gradient(135deg, ${palette.from}20, ${palette.to}10)`, border: `1px solid ${palette.from}25` }}>
            {cat.icon || '📦'}
          </div>
          {/* Actions */}
          {!isReadOnly ? (
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { setEditingCategory(cat); setIsSidePanelOpen(true); }}
                className="p-1.5 rounded-[9px] border border-[var(--border)] bg-[var(--input-bg)] hover:border-[var(--emerald)]/50 text-[var(--muted)] hover:text-[var(--emerald)] transition-all cursor-pointer"
              >
                <Edit3 size={12} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-[9px] border border-[var(--border)] bg-[var(--input-bg)] hover:border-rose-500/50 text-[var(--muted)] hover:text-rose-400 transition-all cursor-pointer"
              >
                <Trash2 size={12} />
              </motion.button>
            </div>
          ) : (
             <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
               <span className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted2)] px-2 py-1 bg-[var(--input-bg)] rounded-md border border-[var(--border)] cursor-help" title="This category is dynamically generated from tools and cannot be edited directly. Edit the tools to change this name.">Read Only</span>
             </div>
          )}
        </div>

        <h3 className="text-[14px] font-black text-[var(--text)] mb-1 group-hover:text-[var(--neon)] transition-colors truncate">
          {cat.name}
        </h3>
        <p className="text-[11px] text-[var(--muted)] mb-4 line-clamp-2 leading-relaxed h-[33px]">
          {cat.description || 'System classification'}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-[7px] text-[9px] font-bold ml-auto"
            style={{ background: 'var(--emerald)12', color: 'var(--emerald)', border: '1px solid var(--emerald)20' }}>
            <Boxes size={9} />
            {cat.toolsCount || 0} Tools
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col font-sans text-left pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <ConfirmModal {...modalProps} />

      {/* Grand Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none space-y-4 pb-5 border-b border-[var(--border)] mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 blur-[16px] opacity-20 rounded-full" style={{ background: 'var(--mint)' }} />
              <div className="relative w-14 h-14 rounded-[16px] border border-[var(--border2)] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--mint)20, var(--emerald)10)' }}>
                <FolderOpen className="w-6 h-6 text-[var(--mint)]" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight font-royal leading-none mb-1 flex items-center gap-3">
                Category Registry
                <div className="relative inline-block text-left mt-1 z-50">
                  <button 
                    onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                    className="bg-[var(--input-bg)] border border-[var(--border)] text-[12px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--neon)] hover:border-[var(--neon)]/30 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/20 transition-all cursor-pointer font-sans flex items-center gap-2"
                  >
                    {viewLevel === 'main' ? 'Main Categories' : viewLevel === 'sub' ? 'Sub Categories' : 'Micro Categories'}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isViewDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isViewDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-[90]" onClick={() => setIsViewDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          className="absolute top-full left-0 min-w-[12rem] bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl mt-2 p-2 z-[100] shadow-2xl backdrop-blur-xl space-y-0.5"
                        >
                          {[
                            { value: 'main', label: 'Main Categories' },
                            { value: 'sub', label: 'Sub Categories' },
                            { value: 'micro', label: 'Micro Categories' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { setViewLevel(opt.value as any); setIsViewDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${viewLevel === opt.value ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}
                            >
                              <span>{opt.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </h1>
              <p className="text-[12px] font-medium text-[var(--muted)]">
                {currentList.length} {viewLevel === 'main' ? 'categories' : viewLevel === 'sub' ? 'sub-categories' : 'micro-categories'} · {viewLevel === 'main' ? `${totalTools} tools indexed` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full justify-between sm:w-auto sm:justify-start">
            {viewLevel === 'main' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setEditingCategory(null); setIsSidePanelOpen(true); }}
                className="px-5 py-2.5 rounded-[13px] text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer flex-1 sm:flex-none"
                style={{ background: 'var(--neon)', color: '#000', boxShadow: '0 4px 20px var(--neon)40' }}
              >
                <Plus size={15} /> Add Category
              </motion.button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder={`Search ${viewLevel === 'main' ? 'categories' : viewLevel === 'sub' ? 'sub-categories' : 'micro-categories'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-11 pl-11 pr-4 text-[13px] font-medium text-[var(--text)] focus:outline-none focus:border-[var(--neon)]/50 focus:ring-2 focus:ring-[var(--neon)]/10 transition-all placeholder:text-[var(--muted)]"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-2 border-[var(--border)] mb-4"
              style={{ borderTopColor: 'var(--neon)' }}
            />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">Loading Data...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 py-16"
          >
            <div className="w-20 h-20 rounded-[24px] border border-[var(--border)] flex items-center justify-center mb-5 text-4xl"
              style={{ background: 'var(--card-bg)' }}>
              📦
            </div>
            <h3 className="text-[15px] font-bold text-[var(--text)] mb-2">No Items Found</h3>
            <p className="text-[12px] text-[var(--muted)] mb-5">
              {searchQuery ? 'No results match your search' : `No ${viewLevel} categories found in the registry.`}
            </p>
            {!searchQuery && viewLevel === 'main' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setEditingCategory(null); setIsSidePanelOpen(true); }}
                className="px-5 py-2.5 rounded-[12px] text-[12px] font-bold flex items-center gap-2 cursor-pointer"
                style={{ background: 'var(--neon)', color: '#000' }}
              >
                <Plus size={14} /> Create First Category
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* Flat Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCategories.map((cat, i) => <CategoryCard key={cat.id} cat={cat} index={i} />)}
          </div>
        )}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidePanelOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl border-l border-[var(--border)] z-[110] flex flex-col"
              style={{ background: 'var(--card-bg)', boxShadow: '-20px 0 60px rgba(0,0,0,0.3)' }}
            >
              <CategoryForm
                view={editingCategory ? 'edit' : 'add'}
                initialData={editingCategory}
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

const CategoryForm = ({ view, initialData, isSubmitting, onCancel, onSubmit }: any) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    icon: initialData?.icon || '📦'
  });

  const QUICK_ICONS = ['🤖', '🧠', '💡', '🔬', '🎨', '📊', '🚀', '🔧', '🌐', '📝', '🎯', '⚡', '🏗️', '🎵', '🏥', '💼', '📦', '🔐', '📈', '🗂️', '💬', '🎬', '🛒', '🔍'];

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="flex flex-col h-full font-sans text-[var(--text)]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[12px] border border-[var(--border)]"
            style={{ background: 'var(--mint)15' }}>
            <FolderOpen className="w-5 h-5 text-[var(--mint)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-[var(--text)]">
              {view === 'add' ? 'New Category' : 'Edit Category'}
            </h2>
            <p className="text-[10px] text-[var(--muted)] mt-0.5">Taxonomy classification setup</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 rounded-[10px] border border-[var(--border)] hover:border-rose-500/40 hover:bg-rose-500/10 text-[var(--muted)] hover:text-rose-400 transition-all cursor-pointer">
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Icon Preview */}
        <div className="flex items-center gap-4 p-4 rounded-[16px] border border-[var(--border)] bg-[var(--input-bg)]">
          <div className="w-16 h-16 rounded-[16px] flex items-center justify-center text-4xl border border-[var(--border)]"
            style={{ background: 'var(--card-bg)' }}>
            {formData.icon || '📦'}
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 block">Category Icon (emoji)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-[10px] h-10 px-3 text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--neon)]/50 transition-all"
              placeholder="📦"
            />
          </div>
        </div>

        {/* Quick Icon Grid */}
        <div>
          <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 block">Quick Pick</label>
          <div className="grid grid-cols-8 gap-2">
            {QUICK_ICONS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData({ ...formData, icon: emoji })}
                className={`h-10 rounded-[9px] text-xl flex items-center justify-center border transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                  formData.icon === emoji
                    ? 'border-[var(--neon)]/60 bg-[var(--neon)]/10'
                    : 'border-[var(--border)] bg-[var(--input-bg)] hover:border-[var(--border2)]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Category Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] h-12 px-4 text-[14px] font-medium text-[var(--text)] focus:outline-none focus:border-[var(--neon)]/60 focus:ring-2 focus:ring-[var(--neon)]/10 transition-all placeholder:text-[var(--muted)]"
            placeholder="e.g. Natural Language Processing"
          />
        </div>

        {/* Parent Sector Removed */}

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[13px] p-4 text-[13px] font-medium text-[var(--text)] focus:outline-none focus:border-[var(--neon)]/60 focus:ring-2 focus:ring-[var(--neon)]/10 transition-all min-h-[110px] resize-none placeholder:text-[var(--muted)]"
            placeholder="Describe this category's scope and purpose..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3 shrink-0 bg-[var(--card-bg)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-[12px] border border-[var(--border)] text-[12px] font-bold text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-all cursor-pointer"
        >
          Cancel
        </button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 rounded-[12px] text-[12px] font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          style={{ background: 'var(--neon)', color: '#000', boxShadow: '0 4px 16px var(--neon)40' }}
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {view === 'add' ? 'Create Category' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  );
};
