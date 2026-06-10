import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ArrowRight, ArrowLeft, Bot, Globe, Cpu, Layers, Zap, Info, Plus, Activity, Tag, AlertTriangle } from 'lucide-react';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';

interface Category {
  id: string;
  name: string;
}

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

interface ExistingTool {
  name?: string;
  url?: string;
}

export const AddToolModal = ({ isOpen, onClose, onSuccess, categories }: AddToolModalProps) => {
  const { confirm: openConfirm, modalProps: confirmModalProps } = useConfirmModal();
  const [step, setStep] = useState(1);
  const [existingTools, setExistingTools] = useState<ExistingTool[]>([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateReason, setDuplicateReason] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    use_case: '',
    key_features: '',
    search_keywords: '',
    url: '',
    logo_url: '',
    category_id: '',
    category_name: '',
    category_icon: '',
    sector_id: '',
    sector_name: '',
    sector_icon: '',
    pricing_model: 'Free',
    pricing_details: '',
    developer_name: '',
    model_version: '',
    platform_type: 'Web',
    launch_date: '',
    tool_status: 'Active',
    is_featured: false,
    integrations: '',
    rating: '',
    tags: '',
    source: 'manual'
  });

  const isDirty = formData.name.trim() !== '' || 
                  formData.url.trim() !== '' || 
                  formData.short_description.trim() !== '' ||
                  formData.description.trim() !== '' ||
                  formData.use_case.trim() !== '' ||
                  formData.key_features.trim() !== '';

  const handleCloseAttempt = () => {
    if (isDirty) {
      openConfirm({
        title: 'Abort Asset Onboarding',
        message: 'You have unsaved changes in your registry form slots. Are you sure you want to quit registration? All inputted datasets will be lost.',
        confirmText: 'Abort & Discard',
        cancelText: 'Continue Onboarding',
        variant: 'warning',
        onConfirm: () => {
          setStep(1);
          setFormData({
            name: '', slug: '', short_description: '', description: '', use_case: '', key_features: '', search_keywords: '', url: '', logo_url: '',
            category_id: '', category_name: '', category_icon: '', sector_id: '', sector_name: '', sector_icon: '', pricing_model: 'Free', pricing_details: '',
            developer_name: '', model_version: '', platform_type: 'Web', launch_date: '', tool_status: 'Active', is_featured: false, integrations: '', rating: '', tags: '', source: 'manual'
          });
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (isOpen) {
      const fetchExisting = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?all=true`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('session_token')}`
            }
          });
          const data = await res.json();
          if (data.tools) {
            setExistingTools(data.tools);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchExisting();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!formData.name.trim() && !formData.url.trim()) {
      setIsDuplicate(false);
      setDuplicateReason('');
      return;
    }
    const cleanName = formData.name.trim().toLowerCase();
    const cleanUrl = formData.url.trim().toLowerCase();

    const match = existingTools.find(t => {
      const tName = (t.name || '').toLowerCase();
      const tUrl = (t.url || '').toLowerCase();
      return (cleanName && tName === cleanName) || (cleanUrl && tUrl === cleanUrl);
    });

    if (match) {
      setIsDuplicate(true);
      const isNameMatch = (match.name || '').toLowerCase() === cleanName;
      setDuplicateReason(isNameMatch
        ? `Duplicate Name: "${match.name}" is already registered in our system.`
        : `Duplicate URL: "${match.url}" is already mapped in our database.`
      );
    } else {
      setIsDuplicate(false);
      setDuplicateReason('');
    }
  }, [formData.name, formData.url, existingTools]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) {
      handleNext();
      return;
    }

    try {
      const payload = {
        ...formData,
        key_features: formData.key_features.split(',').map(s => s.trim()).filter(Boolean),
        search_keywords: formData.search_keywords.split(',').map(s => s.trim()).filter(Boolean),
        integrations: formData.integrations.split(',').map(s => s.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
        rating: parseFloat(formData.rating) || 0
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        onSuccess();
        setStep(1);
      }
    } catch (err) {
      console.error('Add Asset Error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseAttempt}
        className="absolute inset-0 bg-[var(--bg4)] backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl max-h-full bg-[var(--bg2)]/40 border border-[var(--border2)] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
      >
        <div className="flex items-center justify-between p-8 lg:p-10 border-b border-[var(--border2)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-[var(--border2)] flex items-center justify-center">
              <Plus className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text)] tracking-tight font-sans leading-none">Initialize Asset</h2>
              <p className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.2em] mt-1.5">
                Step {step} of 3: {step === 1 ? 'Core Identity' : step === 2 ? 'Neural Specs' : 'Market Presence'}
              </p>
            </div>
          </div>
          <button onClick={handleCloseAttempt} className="p-3 rounded-2xl bg-[var(--glass)] hover:bg-rose-500/10 text-muted hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Fingerprint size={14} className="text-emerald-400" />
                  <h3 className="text-[10px] font-black text-[var(--text)] uppercase tracking-[0.2em]">Base Identifiers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Asset Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. NeuralSeek AI"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Asset Slug</label>
                    <input
                      required
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. neuralseek-ai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Deployment URL</label>
                    <input
                      required
                      type="url"
                      value={formData.url}
                      onChange={e => setFormData({ ...formData, url: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="https://asset-node.ai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo_url}
                      onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="https://.../logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Category</label>
                    <select
                      required
                      value={formData.category_name}
                      onChange={e => {
                        const selectedName = e.target.value;
                        const matchedCat = categories.find(c => c.name === selectedName);
                        setFormData({ 
                          ...formData, 
                          category_name: selectedName,
                          category_id: matchedCat ? matchedCat.id : '',
                          category_icon: (matchedCat as any)?.icon || ''
                        });
                      }}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none uppercase"
                    >
                      <option value="" className="bg-[var(--bg2)] text-emerald-400">SELECT CATEGORY</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name} className="bg-[var(--bg2)] text-emerald-400">{cat.name.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Sector Name</label>
                    <input
                      type="text"
                      value={formData.sector_name}
                      onChange={e => setFormData({ ...formData, sector_name: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. Enterprise Solutions"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Short Description</label>
                    <textarea
                      required
                      value={formData.short_description}
                      onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-24 p-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40 resize-none"
                      placeholder="Brief overview of the tool..."
                    />
                  </div>
                  {isDuplicate && (
                    <div className="md:col-span-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3 mt-2">
                      <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Duplicate Shield Active</p>
                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide leading-relaxed">{duplicateReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={14} className="text-emerald-400" />
                  <h3 className="text-[10px] font-black text-[var(--text)] uppercase tracking-[0.2em]">Neural Specs</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">AI Model Used</label>
                    <input
                      type="text"
                      value={formData.model_version}
                      onChange={e => setFormData({ ...formData, model_version: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. GPT-4, Claude 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Platform Type</label>
                    <select
                      value={formData.platform_type}
                      onChange={e => setFormData({ ...formData, platform_type: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none"
                    >
                      <option value="Web" className="bg-[var(--bg2)] text-emerald-400">Web-Based</option>
                      <option value="Mobile" className="bg-[var(--bg2)] text-emerald-400">Mobile-Native</option>
                      <option value="API" className="bg-[var(--bg2)] text-emerald-400">API-Driven</option>
                      <option value="Desktop" className="bg-[var(--bg2)] text-emerald-400">Desktop</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Key Features (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.key_features}
                      onChange={e => setFormData({ ...formData, key_features: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. API Access, Real-time sync"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Integrations (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.integrations}
                      onChange={e => setFormData({ ...formData, integrations: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. Slack, GitHub"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Primary Use Case</label>
                    <textarea
                      value={formData.use_case}
                      onChange={e => setFormData({ ...formData, use_case: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-24 p-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40 resize-none"
                      placeholder="Describe the primary operational purpose..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Activity size={14} className="text-emerald-400" />
                  <h3 className="text-[10px] font-black text-[var(--text)] uppercase tracking-[0.2em]">Market Presence</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Developer Name</label>
                    <input
                      type="text"
                      value={formData.developer_name}
                      onChange={e => setFormData({ ...formData, developer_name: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. OpenAI"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Launch Date</label>
                    <input
                      type="date"
                      value={formData.launch_date}
                      onChange={e => setFormData({ ...formData, launch_date: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40 color-scheme-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Tool Status</label>
                    <select
                      value={formData.tool_status}
                      onChange={e => setFormData({ ...formData, tool_status: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none"
                    >
                      <option value="Active" className="bg-[var(--bg2)] text-emerald-400">Active</option>
                      <option value="Beta" className="bg-[var(--bg2)] text-emerald-400">Beta</option>
                      <option value="Deprecated" className="bg-[var(--bg2)] text-emerald-400">Deprecated</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Pricing Model</label>
                    <select
                      value={formData.pricing_model}
                      onChange={e => setFormData({ ...formData, pricing_model: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all appearance-none"
                    >
                      <option value="Free" className="bg-[var(--bg2)] text-emerald-400">Free</option>
                      <option value="Freemium" className="bg-[var(--bg2)] text-emerald-400">Freemium</option>
                      <option value="Paid" className="bg-[var(--bg2)] text-emerald-400">Paid</option>
                      <option value="Enterprise" className="bg-[var(--bg2)] text-emerald-400">Enterprise</option>
                    </select>
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Pricing Details</label>
                    <input
                      type="text"
                      value={formData.pricing_details}
                      onChange={e => setFormData({ ...formData, pricing_details: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. Starts at $20/month"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      min="0"
                      value={formData.rating}
                      onChange={e => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. 4.8"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. Design, Productivity"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Search Keywords</label>
                    <input
                      type="text"
                      value={formData.search_keywords}
                      onChange={e => setFormData({ ...formData, search_keywords: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl h-12 px-5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40"
                      placeholder="e.g. AI tools, image generator"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded-md bg-[var(--bg2)] border-[var(--border2)] text-emerald-500 focus:ring-emerald-500/50"
                    />
                    <label htmlFor="is_featured" className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest cursor-pointer">Featured Asset</label>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest ml-1">Full Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-3xl h-32 p-6 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-all placeholder:text-emerald-500/40 resize-none"
                      placeholder="Provide a high-fidelity description of the neural node's capabilities..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="p-8 lg:p-10 border-t border-[var(--border2)] flex items-center justify-between bg-[var(--bg2)]">
          <div className="flex items-center gap-3">
            <Info size={14} className="text-emerald-400/40" />
            <p className="text-[8px] font-bold text-emerald-400/40 uppercase tracking-[0.2em] hidden md:block">Protocol: Manual Asset Registration v3.0</p>
          </div>
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button onClick={handlePrev} type="button" className="px-6 py-3 rounded-2xl text-[10px] font-black text-emerald-400/60 uppercase tracking-widest hover:text-emerald-400 transition-all flex items-center gap-2">
                <ArrowLeft size={14} />
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                disabled={isDuplicate}
                onClick={handleNext}
                type="button"
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                  isDuplicate
                    ? 'bg-rose-500/10 border border-rose-500/25 text-rose-500/50 cursor-not-allowed animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 border border-[var(--border2)] hover:bg-emerald-500/20'
                }`}
              >
                Next Step
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                disabled={isDuplicate}
                onClick={handleSubmit}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                  isDuplicate
                    ? 'bg-rose-500/10 border border-rose-500/25 text-rose-500/50 cursor-not-allowed animate-pulse'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                }`}
              >
                <Save size={16} />
                Synchronize Matrix
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmModal {...confirmModalProps} />
    </div>
  );
};

const Fingerprint = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 10a2 2 0 0 0-2 2c0 .5.5 1 1 1s1-.5 1-1a2 2 0 0 1 2-2c.5 0 1 .5 1 1s-.5 1-1 1" />
    <path d="M13.1 8.1a4 4 0 0 0-5.7 5.7" />
    <path d="M15.1 6.1a6 6 0 0 0-8.2 8.2" />
    <path d="M17.1 4.1a8 8 0 0 0-10.7 10.7" />
    <path d="M19.1 2.1a10 10 0 0 0-13.2 13.2" />
    <path d="M12 15a3 3 0 0 1-3-3" />
    <path d="M12 18a6 6 0 0 1-6-6" />
    <path d="M12 21a9 9 0 0 1-9-9" />
  </svg>
);
