import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Bot, Globe, Cpu, Layers, Zap, Info, RefreshCw } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  category_id: string;
  category_name?: string;
  category_icon?: string;
  model_version: string;
  use_case: string;
  platform_type?: string;
  pricing_model?: string;
  key_features?: string;
  entry_date?: string;
  source?: 'seeded' | 'manual';
  is_active: boolean;
  is_archived: boolean;
  rating?: number;
  created_at: string;
}

interface EditToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  tool: Tool;
}

export const EditToolModal = ({ isOpen, onClose, onSuccess, categories, tool }: EditToolModalProps) => {
  const [formData, setFormData] = useState<Partial<Tool>>({});

  useEffect(() => {
    if (tool) {
      setFormData(tool);
    }
  }, [tool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${tool.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error('Update Asset Error:', err);
    }
  };

  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--bg4)] backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-full bg-[var(--bg2)]/40 border border-[var(--border2)] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
      >
        <div className="flex items-center justify-between p-10 border-b border-[var(--border2)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <RefreshCw className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text)] tracking-tight font-sans leading-none">Modify Asset Protocol</h2>
              <p className="text-[9px] font-black text-amber-400/40 uppercase tracking-[0.2em] mt-1.5">Updating Node Identifier: {tool.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-[var(--glass)] hover:bg-rose-500/10 text-muted hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot size={14} className="text-emerald-400" />
                <h3 className="text-[10px] font-black text-[var(--text)] uppercase tracking-[0.2em]">Base Identifiers</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Asset Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Deployment URL</label>
                <input 
                  required
                  type="url" 
                  value={formData.url || ''}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Sector Classification</label>
                  <select 
                    required
                    value={formData.category_name || ''}
                    onChange={e => {
                      const selectedName = e.target.value;
                      const matchedCat = categories.find(c => c.name === selectedName);
                      setFormData({
                        ...formData,
                        category_name: selectedName,
                        category_id: matchedCat ? matchedCat.id : (formData.category_id || ''),
                        category_icon: matchedCat ? (matchedCat as any).icon : (formData.category_icon || '')
                      });
                    }}
                    className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none uppercase"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Platform Type</label>
                  <select 
                    value={formData.platform_type || 'Web'}
                    onChange={e => setFormData({...formData, platform_type: e.target.value})}
                    className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none"
                  >
                    <option value="Web">Web-Based</option>
                    <option value="Mobile">Mobile-Native</option>
                    <option value="API">API-Driven</option>
                    <option value="Desktop">Desktop</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={14} className="text-emerald-400" />
                <h3 className="text-[10px] font-black text-[var(--text)] uppercase tracking-[0.2em]">Neural Parameters</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Model Version</label>
                  <input 
                    type="text" 
                    value={formData.model_version || ''}
                    onChange={e => setFormData({...formData, model_version: e.target.value})}
                    className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Pricing Model</label>
                  <select 
                    value={formData.pricing_model || 'Free'}
                    onChange={e => setFormData({...formData, pricing_model: e.target.value})}
                    className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Primary Use Case</label>
                <textarea 
                  value={formData.use_case || ''}
                  onChange={e => setFormData({...formData, use_case: e.target.value})}
                  className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-24 p-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest ml-1">Intelligence Asset Summary</label>
            <textarea 
              required
              value={formData.description || ''}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-3xl h-32 p-6 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all resize-none"
            />
          </div>
        </form>

        <div className="p-10 border-t border-[var(--border2)] flex items-center justify-between bg-[var(--bg2)]">
          <div className="flex items-center gap-3">
             <Info size={14} className="text-emerald-400/20" />
             <p className="text-[8px] font-bold text-emerald-400/20 uppercase tracking-[0.2em]">Last Sync: {new Date(tool.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="px-8 py-3 rounded-2xl text-[10px] font-black text-emerald-400/60 uppercase tracking-widest hover:text-emerald-400 transition-all">Discard Changes</button>
            <button 
              onClick={handleSubmit}
              className="px-10 py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 flex items-center gap-3"
            >
              <Save size={16} />
              Commit Updates
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
