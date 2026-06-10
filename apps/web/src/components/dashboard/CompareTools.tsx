"use client";

import { useState, useEffect } from 'react';
import {
  GitCompare,
  Plus,
  Wrench,
  Layers,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Sparkles,
  Activity,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '@/lib/socket';

const escapeHTML = (str: string | undefined | null) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

interface Tool {
  id: string | number;
  name: string;
  category_name: string;
  category_icon?: string;
  platform_type: string;
  pricing_model: string;
  rating?: number | string;
  description: string;
  is_active: boolean;
}

export const CompareTools = ({ initialTools = [] }: { initialTools?: string[] }) => {
  const [compareList, setCompareList] = useState<(Tool | null)[]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [generatingVerdict, setGeneratingVerdict] = useState(false);
  const [renderLimit, setRenderLimit] = useState(30);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingNavCallback, setPendingNavCallback] = useState<(() => void) | null>(null);

  // Real-time synchronization states
  const [isSyncMode, setIsSyncMode] = useState<boolean>(true);
  const roomName = 'global_compare';

  // Dynamic compatibility slider weights
  const [weightCostRating, setWeightCostRating] = useState(50); // 0 = Cheap, 100 = Highly Rated
  const [weightIntegrations, setWeightIntegrations] = useState(50); // 0 = Simple Platform, 100 = API/Integration Rich
  const [weightFeatures, setWeightFeatures] = useState(50); // 0 = Simplicity, 100 = Feature Rich

  const hasActiveWork = compareList.some(t => t !== null) || aiVerdict !== null;

  // Fetch tools for selection list
  const fetchAllTools = async (search = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?all=true&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      const data = await response.json();
      if (data.tools) {
        setAllTools(data.tools);
      }
    } catch (err) {
      console.error('Failed to fetch tools for compare:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTools(searchQuery);
    setRenderLimit(30);
  }, [searchQuery]);

  useEffect(() => {
    const loadInitial = async () => {
      if (initialTools.length > 0) {
        setLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?all=true`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('session_token')}`
            }
          });
          const data = await res.json();
          if (data.tools) {
            const pool: Tool[] = data.tools;
            const prefilled = [null, null, null, null] as (Tool | null)[];
            initialTools.slice(0, 4).forEach((id, index) => {
              const match = pool.find(t => String(t.id) === String(id));
              if (match) prefilled[index] = match;
            });
            setCompareList(prefilled);
          }
        } catch (e) {
          console.error('Failed to load initial compare tools', e);
        } finally {
          setLoading(false);
        }
      }
    };
    loadInitial();
  }, [initialTools]);

  // Warn before browser/tab close if work is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasActiveWork) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasActiveWork]);

  // Expose a navigation guard for parent components via custom event
  useEffect(() => {
    const handleNavAttempt = (e: CustomEvent) => {
      if (hasActiveWork) {
        setShowLeaveWarning(true);
        setPendingNavCallback(() => e.detail?.proceed || null);
        e.detail?.cancel?.();
      }
    };
    window.addEventListener('compare-nav-attempt', handleNavAttempt as EventListener);
    return () => window.removeEventListener('compare-nav-attempt', handleNavAttempt as EventListener);
  }, [hasActiveWork]);

  // WebSockets Real-Time Collaborative Room Listener
  useEffect(() => {
    if (!isSyncMode) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Join collaborative compare room
    socket.emit('join_compare_room', roomName);

    const onSlotChanged = (data: { slotIndex: number; tool: Tool | null; sender: string }) => {
      setCompareList(prev => {
        const updated = [...prev];
        updated[data.slotIndex] = data.tool;
        return updated;
      });
      setAiVerdict(null);
    };

    const onVerdictTriggered = () => {
      setGeneratingVerdict(true);
      setAiVerdict(null);
    };

    const onVerdictCompleted = (data: { verdictHTML: string }) => {
      setAiVerdict(data.verdictHTML);
      setGeneratingVerdict(false);
    };

    const onRefreshMatrix = async () => {
      // Re-fetch selections list
      fetchAllTools(searchQuery);
      
      // Refresh compared tools' properties in real time
      setCompareList(prev => {
        const refreshed = [...prev];
        const fetchPromises = refreshed.map(async (tool, idx) => {
          if (!tool || String(tool.id).startsWith('mock-')) return;
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${tool.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('session_token')}`
              }
            });
            if (res.ok) {
              const freshTool = await res.json();
              refreshed[idx] = freshTool;
            }
          } catch (e) {
            console.error(`Failed to refresh tool ${tool.id}`, e);
          }
        });
        Promise.all(fetchPromises).then(() => {
          setCompareList(refreshed);
        });
        return prev;
      });
    };

    socket.on('compare_slot_changed', onSlotChanged);
    socket.on('compare_verdict_triggered', onVerdictTriggered);
    socket.on('compare_verdict_completed', onVerdictCompleted);
    socket.on('refresh_matrix', onRefreshMatrix);

    return () => {
      socket.emit('leave_compare_room', roomName);
      socket.off('compare_slot_changed', onSlotChanged);
      socket.off('compare_verdict_triggered', onVerdictTriggered);
      socket.off('compare_verdict_completed', onVerdictCompleted);
      socket.off('refresh_matrix', onRefreshMatrix);
    };
  }, [isSyncMode, searchQuery]);

  const handleOpenSelector = (slotIndex: number) => {
    setActiveSlot(slotIndex);
    setIsModalOpen(true);
    setSearchQuery('');
  };

  const handleSelectTool = (tool: Tool) => {
    if (compareList.some(t => t?.id === tool.id)) {
      alert('This tool is already selected for comparison.');
      return;
    }
    const updated = [...compareList];
    if (activeSlot !== null) {
      updated[activeSlot] = tool;
      if (isSyncMode) {
        socket.emit('compare_slot_changed', { roomName, slotIndex: activeSlot, tool });
      }
    }
    setCompareList(updated);
    setIsModalOpen(false);
    setActiveSlot(null);
    setAiVerdict(null); // Reset old verdict
  };

  const handleConfirmLeave = () => {
    setCompareList([null, null, null, null]);
    setAiVerdict(null);
    setShowLeaveWarning(false);
    pendingNavCallback?.();
    setPendingNavCallback(null);
  };

  const handleCancelLeave = () => {
    setShowLeaveWarning(false);
    setPendingNavCallback(null);
  };

  const handleRemoveTool = (slotIndex: number) => {
    const updated = [...compareList];
    updated[slotIndex] = null;
    if (isSyncMode) {
      socket.emit('compare_slot_changed', { roomName, slotIndex, tool: null });
    }
    setCompareList(updated);
    setAiVerdict(null); // Reset old verdict
  };

  const loadPreset = (presetType: string) => {
    let presetNames: string[] = [];
    if (presetType === 'llm') {
      presetNames = ['ChatGPT', 'Claude', 'Gemini'];
    } else if (presetType === 'creative') {
      presetNames = ['Midjourney', 'DALL-E', 'Stable Diffusion'];
    } else if (presetType === 'code') {
      presetNames = ['Cursor', 'GitHub Copilot', 'Tabnine'];
    }

    // Try to find matching tools from current pool or backend
    const matched = presetNames.map(name => {
      // Find case-insensitive partial matches in database
      const found = allTools.find(t => t.name.toLowerCase().includes(name.toLowerCase())) ||
      // Mock fallback to keep presets instantly functional
      {
        id: `mock-${name}`,
        name,
        category_name: presetType === 'llm' ? 'Productivity' : presetType === 'creative' ? 'Design' : 'Development',
        category_icon: presetType === 'llm' ? '🤖' : presetType === 'creative' ? '🎨' : '💻',
        platform_type: 'Web, Mobile, API',
        pricing_model: presetType === 'creative' && name === 'Midjourney' ? 'Paid' : 'Freemium',
        rating: name === 'Claude' || name === 'Cursor' || name === 'Midjourney' ? '4.9' : '4.7',
        description: `Premium AI-powered technology built to optimize ${presetType === 'llm' ? 'conversational outputs' : presetType === 'creative' ? 'creative assets' : 'software engineering workflows'}.`,
        is_active: true
      };
      return found;
    });

    const updatedSlots: (Tool | null)[] = [null, null, null, null];
    matched.forEach((t, i) => {
      if (i < 4) {
        updatedSlots[i] = t;
        if (isSyncMode) {
          socket.emit('compare_slot_changed', { roomName, slotIndex: i, tool: t });
        }
      }
    });
    setCompareList(updatedSlots);
    setAiVerdict(null);
  };

  // Generate a premium AI-themed heuristic verdict from global backend engine
  const handleGenerateVerdict = async () => {
    const activeTools = compareList.filter((t): t is Tool => t !== null);
    if (activeTools.length < 2) return;

    setGeneratingVerdict(true);
    setAiVerdict(null);

    if (isSyncMode) {
      socket.emit('compare_verdict_triggered', { roomName });
    }

    try {
      // Filter out mock IDs (from presets if they aren't in DB)
      const toolIds = activeTools.map(t => t.id).filter(id => !String(id).startsWith('mock-'));
      
      if (toolIds.length < 2) {
        throw new Error("Global engine requires at least 2 real database tools. Please select tools from the search list rather than mock presets.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/engine/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        body: JSON.stringify({ toolIds })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = typeof errorData.error === 'object' ? errorData.error.message : errorData.error;
        throw new Error(errorMsg || 'Failed to fetch real-time verdict from global engine.');
      }

      const data = await response.json();
      const verdictHTML = data.verdictHTML;

      setAiVerdict(verdictHTML);
      
      if (isSyncMode) {
        socket.emit('compare_verdict_completed', { roomName, verdictHTML });
      }
    } catch (err: any) {
      console.error('Engine error:', err);
      setAiVerdict(`<div class="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-bold text-[10px] uppercase tracking-wider text-center flex flex-col items-center gap-2"><span class="w-6 h-6 flex items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/30">⚠️</span> ENGINE FAULT: ${err.message}</div>`);
    } finally {
      setGeneratingVerdict(false);
    }
  };

  // Dynamic compatibility slider weights calculation
  const calculateCompatibility = (tool: Tool) => {
    if (!tool) return 0;
    
    // 1. Cost vs Rating
    const isFree = ['free', 'freemium', 'open source'].includes(tool.pricing_model?.toLowerCase() || '');
    const ratingVal = parseFloat(String(tool.rating || '4.0'));
    const ratingScore = (ratingVal / 5) * 100; // 0-100
    const costScore = isFree ? 100 : 30; // 100 if free, 30 if paid
    
    const costRatingValue = ((100 - weightCostRating) * costScore + weightCostRating * ratingScore) / 100;

    // 2. Platform support vs API availability
    const platformCount = (tool.platform_type || '').split(',').length;
    const platformScore = Math.min((platformCount / 3) * 100, 100); // max 3 platforms
    
    const hasAPI = (tool as any).api_available === true || 
                    (tool.platform_type || '').toLowerCase().includes('api') ||
                    (tool.description || '').toLowerCase().includes('api');
    const apiScore = hasAPI ? 100 : 20;

    const integrationValue = ((100 - weightIntegrations) * platformScore + weightIntegrations * apiScore) / 100;

    // 3. Simplicity vs Feature richness
    const descriptionLen = (tool.description || '').length;
    const simplicityScore = Math.max(100 - (descriptionLen / 10), 20); // short description = simple
    
    const featuresCount = ((tool as any).key_features || []).length || 2;
    const featuresScore = Math.min((featuresCount / 5) * 100, 100);

    const simplicityValue = ((100 - weightFeatures) * simplicityScore + weightFeatures * featuresScore) / 100;

    // Average the three components
    const finalScore = Math.round((costRatingValue + integrationValue + simplicityValue) / 3);
    return Math.max(10, Math.min(finalScore, 100)); // bound between 10% and 100%
  };

  const featureChecklist = [
    {
      label: "Zero Cost Options",
      check: (t: Tool) => ['free', 'freemium', 'open source'].includes(t.pricing_model?.toLowerCase() || ''),
      desc: "Available as Free, Freemium, or Open Source"
    },
    {
      label: "Developer API Integration",
      check: (t: Tool) => (t as any).api_available === true || (t.platform_type || '').toLowerCase().includes('api') || (t.description || '').toLowerCase().includes('api'),
      desc: "Has API endpoints or developer access protocols"
    },
    {
      label: "Cross-Platform Access",
      check: (t: Tool) => (t.platform_type || '').toLowerCase().includes('mobile') || (t.platform_type || '').toLowerCase().includes('ios') || (t.platform_type || '').toLowerCase().includes('android'),
      desc: "Supports iOS, Android, or mobile web environments"
    },
    {
      label: "Elite Stability Rating",
      check: (t: Tool) => parseFloat(String(t.rating || '0')) >= 4.7,
      desc: "Stability index rated 4.7 stars or higher"
    },
    {
      label: "Active Production Status",
      check: (t: Tool) => t.is_active === true,
      desc: "Fully active status and verified online"
    }
  ];

  const activeTools = compareList.filter((t): t is Tool => t !== null);

  // Slot accent colors for premium look
  const slotAccents = [
    { from: 'from-emerald-500/20', to: 'to-cyan-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10', dot: 'bg-emerald-400' },
    { from: 'from-blue-500/20', to: 'to-indigo-500/10', border: 'border-blue-500/30', glow: 'shadow-blue-500/10', dot: 'bg-blue-400' },
    { from: 'from-orange-500/20', to: 'to-amber-500/10', border: 'border-orange-500/30', glow: 'shadow-orange-500/10', dot: 'bg-orange-400' },
    { from: 'from-blue-500/20', to: 'to-violet-500/10', border: 'border-blue-500/30', glow: 'shadow-blue-500/10', dot: 'bg-blue-400' },
  ];

  const presets = [
    { key: 'llm', label: 'ChatGPT vs Claude', desc: 'Language Models' },
    { key: 'creative', label: 'Midjourney vs DALL·E', desc: 'Creative AI' },
    { key: 'code', label: 'Cursor vs Copilot', desc: 'Code Assistants' },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-16 pr-1">

      {/* ── Hero Header ── */}
      <div className="relative flex flex-col gap-5 pb-5 border-b border-[var(--border)]">
        {/* Top Row: Title & Sync Toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shadow-sm shrink-0">
              <GitCompare className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--text)] opacity-80" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h1 className="font-royal text-2xl sm:text-4xl font-black tracking-tight leading-none mb-1.5 sm:mb-2 text-[var(--text)]">
                Compare Systems
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="text-[9px] sm:text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.1em] sm:tracking-[0.15em] whitespace-normal sm:whitespace-nowrap flex flex-wrap items-center gap-2">
                  Technical evaluation of advanced AI assets
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border2)] text-[var(--muted2)] normal-case tracking-normal">Requires Internet Connection</span>
                </p>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--border)] shrink-0" />
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">Engine Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sleek Sync Toggle (Top Right on Mobile) */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 shrink-0">
            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-colors ${isSyncMode ? 'text-emerald-500' : 'text-[var(--muted2)]'}`}>
              Sync
            </span>
            <button
              onClick={() => setIsSyncMode(!isSyncMode)}
              className={`w-7 h-3.5 sm:w-8 sm:h-4 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${isSyncMode ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-[var(--input-bg)] border border-[var(--border)]'}`}
            >
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm transform transition-transform duration-300 ${isSyncMode ? 'translate-x-[12px] sm:translate-x-4 bg-emerald-500' : 'translate-x-0 bg-[var(--muted2)]'}`} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Presets Scrollable List */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          <span className="text-[8px] sm:text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest shrink-0">Presets:</span>
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            {presets.map(preset => (
              <button
                key={preset.key}
                onClick={() => loadPreset(preset.key)}
                className="text-[9px] sm:text-[10px] font-black text-[var(--muted)] hover:text-[var(--text)] uppercase tracking-widest transition-colors cursor-pointer relative group whitespace-nowrap"
              >
                {preset.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--text)] transition-all group-hover:w-full" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Comparison Slots ── */}
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Layers className="w-3.5 h-3.5 text-[var(--muted2)]" />
          <h2 className="text-[8px] sm:text-[9px] font-black text-[var(--muted2)] uppercase tracking-[0.2em]">Comparison Slots — Select up to 4 tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {compareList.map((tool, idx) => {
            const accent = slotAccents[idx];
            return (
              <div key={idx} className="relative">
                {tool ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`relative w-full p-4 sm:p-5 bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl flex flex-col justify-between group overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[180px] sm:min-h-[220px]`}
                  >
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accent.from} ${accent.to} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Ambient glow on hover */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveTool(idx)}
                      className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[var(--muted2)] hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/10 transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-3 sm:gap-4 h-full">
                      {/* Icon + Name */}
                      <div className="flex flex-col gap-2.5 sm:gap-3">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-2xl sm:text-3xl shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                          {tool.category_icon || '🤖'}
                        </div>
                        <div className="min-w-0 pr-6">
                          <h4 className="text-[14px] sm:text-[15px] font-black text-[var(--text)] truncate">{tool.name}</h4>
                          <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] mt-0.5 sm:mt-1 truncate`}>
                            {tool.category_name}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[9px] sm:text-[10px] text-[var(--muted)] leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {tool.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-2 sm:gap-3 mt-auto pt-3 sm:pt-4">
                        <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] truncate max-w-[50%]`}>
                          {tool.pricing_model}
                        </span>
                        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
                          <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[9px] sm:text-[10px] font-black text-[var(--text)]">{tool.rating || '4.8'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => handleOpenSelector(idx)}
                    className={`w-full p-4 sm:p-5 border border-dashed border-[var(--border)] rounded-3xl bg-transparent hover:bg-[var(--card-bg)]/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer group min-h-[180px] sm:min-h-[220px]`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--text)] group-hover:border-[var(--text)] group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-black text-[var(--muted)] group-hover:text-[var(--text)] uppercase tracking-widest block transition-colors">
                      Add System
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Spotlight Match Analyzer (Interactive Dual View) ── */}
      {activeTools.length === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Background mesh/effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[var(--text)] tracking-tight flex items-center gap-2 sm:gap-3">
                  Match Analyzer
                  <span className="text-[8px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </h3>
                <p className="text-[10px] sm:text-[11px] font-medium text-[var(--muted)] mt-0.5 sm:mt-1">
                  Adjust priorities to compute custom compatibility scores
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left: Dynamic Match Scores Gauge */}
            <div className="lg:col-span-6 flex flex-row items-center justify-around gap-4 sm:gap-8">
              {activeTools.map((tool, idx) => {
                const compatibility = calculateCompatibility(tool);
                const scoresList = activeTools.map(t => calculateCompatibility(t));
                const maxScore = Math.max(...scoresList);
                const minScore = Math.min(...scoresList);
                const isLeader = compatibility === maxScore && maxScore !== minScore;
                const accentColor = idx === 0 ? 'stroke-emerald-400' : 'stroke-blue-400';
                const strokeDashoffset = 251.2 - (251.2 * compatibility) / 100;

                return (
                  <div key={tool.id} className="flex flex-col items-center text-center relative group w-1/2 sm:w-auto">
                    {/* Pulsing glow if leader */}
                    {isLeader && (
                      <div className="absolute inset-0 bg-emerald-500/[0.03] blur-xl rounded-full animate-pulse pointer-events-none" />
                    )}

                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 128 128">
                        {/* Background track */}
                        <circle cx="64" cy="64" r="40" className="stroke-[var(--border)]" fill="transparent" strokeWidth="6" />
                        {/* Interactive fill */}
                        <circle
                          cx="64"
                          cy="64"
                          r="40"
                          className={`${accentColor} stroke-[6] transition-all duration-500 ease-out`}
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percent text */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl sm:text-2xl font-black tracking-tighter text-[var(--text)]">
                          {compatibility}%
                        </span>
                      </div>
                    </div>

                    <h4 className="text-[13px] font-black mt-2 truncate max-w-[140px] text-[var(--text)]">
                      {tool.name}
                    </h4>

                    {/* Winner badge */}
                    {isLeader && (
                      <div className="mt-2.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Top Match
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Center: Live Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <h4 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-[var(--muted)]" /> Priorities
              </h4>

              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest">
                  <span>Price / Free Tier</span>
                  <span className="text-[var(--text)]">Rating / Quality</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightCostRating}
                  onChange={(e) => setWeightCostRating(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--input-bg)] rounded-full appearance-none cursor-pointer border border-[var(--border)] accent-[var(--text)] hover:accent-emerald-400 transition-all focus:outline-none"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest">
                  <span>Web & Mobile UI</span>
                  <span className="text-[var(--text)]">API & Integrations</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightIntegrations}
                  onChange={(e) => setWeightIntegrations(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--input-bg)] rounded-full appearance-none cursor-pointer border border-[var(--border)] accent-[var(--text)] hover:accent-emerald-400 transition-all focus:outline-none"
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest">
                  <span>Simplicity</span>
                  <span className="text-[var(--text)]">Feature Richness</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightFeatures}
                  onChange={(e) => setWeightFeatures(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--input-bg)] rounded-full appearance-none cursor-pointer border border-[var(--border)] accent-[var(--text)] hover:accent-emerald-400 transition-all focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Feature-by-Feature Checklist Comparison */}
          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <h4 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--muted)]" /> Feature Checklist
            </h4>
            <div className="space-y-2">
              {featureChecklist.map((item, idx) => {
                const toolACheck = item.check(activeTools[0]);
                const toolBCheck = item.check(activeTools[1]);

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 items-center py-3 px-5 rounded-2xl transition-colors ${
                      idx % 2 === 0 ? 'bg-[var(--input-bg)]' : 'bg-transparent hover:bg-[var(--input-bg)]/50'
                    }`}
                  >
                    {/* Tool A */}
                    <div className="col-span-3 flex justify-center">
                      {toolACheck ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Yes</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                          <XCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">No</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="col-span-6 text-center">
                      <span className="text-[10px] font-black text-[var(--text)] uppercase tracking-wide block">
                        {item.label}
                      </span>
                      <span className="text-[8px] font-medium text-[var(--muted)] block mt-0.5">
                        {item.desc}
                      </span>
                    </div>

                    {/* Tool B */}
                    <div className="col-span-3 flex justify-center">
                      {toolBCheck ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Yes</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                          <XCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">No</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Comparison Results ── */}
      {activeTools.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mt-10"
        >
          {/* Main Matrix Table */}
          <div className="xl:col-span-8 bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--input-bg)] to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-[var(--muted)]" />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-[var(--text)] uppercase tracking-[0.1em]">Comparison Matrix</h3>
                  <p className="text-[9px] font-medium text-[var(--muted)] uppercase tracking-widest mt-1">{activeTools.length} Tools · {5} Parameters</p>
                </div>
              </div>
              <button
                onClick={handleGenerateVerdict}
                disabled={generatingVerdict}
                className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[var(--input-bg)] border border-[var(--border)] hover:border-emerald-500/50 rounded-xl text-[10px] font-black text-[var(--text)] hover:text-emerald-500 uppercase tracking-widest transition-all duration-300 cursor-pointer disabled:opacity-50 w-full sm:w-auto shadow-sm group"
              >
                <Sparkles size={14} className={`text-[var(--muted)] group-hover:text-emerald-500 transition-colors ${generatingVerdict ? "animate-spin text-emerald-500" : ""}`} />
                {generatingVerdict ? 'Executing AI Verdict...' : 'Execute AI Verdict'}
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[var(--card-bg)]">
                    <th className="px-6 py-5 text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.15em] border-b border-[var(--border)] w-[22%]">Parameter</th>
                    {activeTools.map((t, i) => (
                      <th key={t.id} className="px-5 py-5 text-[10px] font-black text-[var(--text)] tracking-wider border-b border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${slotAccents[compareList.indexOf(t)]?.dot || 'bg-emerald-500'}`} />
                          <span className="truncate max-w-[120px]">{t.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'Classification',
                      render: (t: Tool) => <span className="text-[var(--text)] text-[10px] font-bold tracking-wide">{t.category_name}</span>
                    },
                    {
                      label: 'Environment',
                      render: (t: Tool) => <span className="text-[var(--muted)] text-[10px]">{t.platform_type || 'Web, API'}</span>
                    },
                    {
                      label: 'Pricing',
                      render: (t: Tool) => (
                        <span className="px-3 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[9px] font-black text-[var(--text)] uppercase tracking-widest">
                          {t.pricing_model}
                        </span>
                      )
                    },
                    {
                      label: 'Rating',
                      render: (t: Tool) => (
                        <div className="flex items-center gap-1.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className={`w-3 h-3 ${s <= Math.round(parseFloat(String(t.rating || '4.8'))) ? 'text-amber-400' : 'text-[var(--border)]'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-[10px] font-black text-[var(--text)] ml-1">{t.rating || '4.8'}</span>
                        </div>
                      )
                    },
                    {
                      label: 'Description',
                      render: (t: Tool) => <span className="text-[var(--muted)] text-[9px] leading-relaxed max-w-[200px] block font-medium">{t.description}</span>
                    },
                  ].map((row, ri) => (
                    <tr key={row.label} className={`transition-colors hover:bg-[var(--input-bg)]/50 ${ri % 2 !== 0 ? 'bg-[var(--input-bg)]/20' : ''}`}>
                      <td className={`px-6 py-5 text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)]`}>
                        {row.label}
                      </td>
                      {activeTools.map(t => (
                        <td key={t.id} className="px-5 py-5 border-b border-[var(--border)]">{row.render(t)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Parameter Blocks */}
            <div className="block md:hidden p-5 space-y-6">
              {[
                { label: 'Classification', key: 'category_name', getValue: (t: Tool) => t.category_name },
                { label: 'Environment', key: 'platform_type', getValue: (t: Tool) => t.platform_type || 'Web, API' },
                { label: 'Pricing', key: 'pricing_model', getValue: (t: Tool) => t.pricing_model, badge: true },
                { label: 'Rating', key: 'rating', getValue: (t: Tool) => `⭐ ${t.rating || '4.8'}` },
                { label: 'Description', key: 'description', getValue: (t: Tool) => t.description, small: true }
              ].map(param => (
                <div key={param.label} className="space-y-3 pb-5 border-b border-[var(--border)] last:border-0 last:pb-0">
                  <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block pl-1">{param.label}</span>
                  <div className="flex overflow-x-auto snap-x no-scrollbar gap-3 pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
                    {activeTools.map(t => (
                      <div key={t.id} className="bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl p-4 space-y-2 shrink-0 w-44 sm:w-56 snap-center">
                        <span className="text-[8px] font-black text-[var(--muted2)] uppercase tracking-widest block truncate">{t.name}</span>
                        {param.badge ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[8px] font-black text-[var(--text)] uppercase tracking-widest">
                            {param.getValue(t)}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold text-[var(--text)] block ${param.small ? 'font-medium leading-relaxed text-[9px] text-[var(--muted)]' : ''}`}>
                            {param.getValue(t)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Verdict Panel */}
          <div className="xl:col-span-4 relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] p-6 sm:p-8 shadow-sm h-full flex flex-col">
            {/* Decorative glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/[0.04] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/[0.04] blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-[var(--text)] tracking-tight">AI Decision Engine</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${generatingVerdict ? 'bg-amber-400 animate-pulse' : aiVerdict ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                      <span className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-widest">
                        {generatingVerdict ? 'Processing...' : aiVerdict ? 'Verdict Ready' : 'Standby'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar pb-4 pr-1">
                {generatingVerdict ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 space-y-6">
                    <div className="relative">
                      <div className="w-14 h-14 border-2 border-[var(--border)] border-t-emerald-500 rounded-full animate-spin" />
                      <div className="absolute inset-2 rounded-full border border-[var(--border)] border-b-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Running Heuristics</p>
                      <p className="text-[9px] font-medium text-[var(--muted)] uppercase tracking-widest">Analyzing {activeTools.length} nodes...</p>
                    </div>
                  </div>
                ) : aiVerdict ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="prose prose-sm prose-invert max-w-none text-[10px] text-[var(--text)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: aiVerdict }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center">
                      <Activity className="w-6 h-6 text-[var(--muted)]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-[var(--text)] tracking-tight">Engine Standby</p>
                      <p className="text-[9px] font-medium text-[var(--muted)] leading-relaxed max-w-[200px] mx-auto">
                        Click &ldquo;Execute AI Verdict&rdquo; on the matrix to run side-by-side heuristics.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Leave Warning Modal ── */}
      <AnimatePresence>
        {showLeaveWarning && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelLeave}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="relative w-full max-w-sm bg-[var(--card-bg)] border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_80px_rgba(245,158,11,0.1)] z-10"
            >
              {/* Amber glow */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-12 bg-amber-500/10 blur-2xl pointer-events-none rounded-full" />

              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-[var(--text)] tracking-tight mb-2">Unsaved Comparison Work</h3>
                  <p className="text-[10px] font-medium text-[var(--muted)] leading-relaxed">
                    You have an active comparison in progress. Leaving will discard your current matrix setup.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={handleCancelLeave}
                    className="flex-1 py-2.5 rounded-xl bg-[var(--bg2)]/60 border border-[var(--border2)] text-[9px] font-black text-[var(--text)] uppercase tracking-widest hover:bg-[var(--bg2)] transition-all cursor-pointer"
                  >
                    Stay & Continue
                  </button>
                  <button
                    onClick={handleConfirmLeave}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[9px] font-black text-amber-400 uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-400 transition-all cursor-pointer"
                  >
                    Discard & Leave
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Tool Selector Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border2)] rounded-3xl shadow-[0_0_100px_rgba(16,185,129,0.08)] z-10 max-h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Ambient top glow */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-emerald-500/5 blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border2)] px-6 py-5 shrink-0 bg-gradient-to-r from-[var(--bg2)]/40 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Wrench className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-[var(--text)] uppercase tracking-tight">Select Tool Node</h3>
                    <p className="text-[8px] font-bold text-emerald-400/80 uppercase tracking-widest mt-0.5">Slot {(activeSlot ?? 0) + 1} · Choose an AI tool to compare</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 hover:bg-[var(--bg2)] rounded-xl transition-all text-[var(--muted2)] hover:text-[var(--text)] cursor-pointer border border-transparent hover:border-[var(--border2)]"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Search */}
              <div className="px-6 pt-5 pb-4 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                  <input
                    type="text"
                    placeholder="Search system tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg2)]/60 border border-[var(--border2)] text-[11px] font-medium text-[var(--text)] placeholder:text-[var(--muted2)] placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] focus:outline-none focus:border-emerald-500/40 focus:bg-[var(--bg2)] transition-all"
                  />
                </div>
              </div>

              {/* Tools List */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 space-y-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-8 h-8 border-2 border-[var(--border2)] border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-[8px] font-black text-[var(--muted2)] uppercase tracking-widest">Fetching Tools...</p>
                  </div>
                ) : allTools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg2)]/60 border border-[var(--border2)] flex items-center justify-center">
                      <Search className="w-5 h-5 text-[var(--muted2)]" />
                    </div>
                    <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">No tools match your query</p>
                  </div>
                ) : (
                  <>
                    {allTools.slice(0, renderLimit).map(tool => {
                      const alreadySelected = compareList.some(t => t?.id === tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool)}
                          disabled={alreadySelected}
                          className={`w-full text-left p-4 border rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                            alreadySelected
                              ? 'bg-[var(--bg2)]/20 border-[var(--border)] opacity-50 cursor-not-allowed'
                              : 'bg-[var(--bg2)]/20 border-[var(--border2)] hover:border-emerald-500/30 hover:bg-emerald-500/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--bg2)]/60 border border-[var(--border2)] flex items-center justify-center text-base group-hover:border-emerald-500/30 transition-colors">
                              {tool.category_icon || '🤖'}
                            </div>
                            <div>
                              <h4 className="text-[11px] font-black text-[var(--text)] group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{tool.name}</h4>
                              <p className="text-[8px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-0.5">{tool.category_name}</p>
                            </div>
                          </div>
                          {alreadySelected ? (
                            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">Added</span>
                          ) : (
                            <ChevronRight size={14} className="text-[var(--muted2)] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </button>
                      );
                    })}

                    {allTools.length > renderLimit && (
                      <div className="pt-3 text-center">
                        <button
                          type="button"
                          onClick={() => setRenderLimit(prev => prev + 30)}
                          className="px-5 py-2.5 rounded-xl bg-[var(--bg2)]/60 border border-[var(--border2)] text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all cursor-pointer"
                        >
                          Load More ({allTools.length - renderLimit} remaining)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
function useCallback(arg0: () => Promise<void>, arg1: never[]) {
  throw new Error('Function not implemented.');
}

