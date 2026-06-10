"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  FolderPlus,
  Star,
  Globe,
  CheckCircle,
  Play,
  Workflow,
  User,
  Shield,
  Layers,
  Monitor
} from 'lucide-react';
import { SandboxViewer } from '@/components/workspace/SandboxViewer';
import { getCachedTools } from '@/lib/offlineCache';

interface ToolDetailsProps {
  toolId: string | number;
  onBack: () => void;
  onSelectTool?: (id: string | number) => void;
}

const SYNC_EVENT = 'workspace-state-sync';

export const ToolDetails = ({ toolId, onBack, onSelectTool }: ToolDetailsProps) => {
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedToolIds, setSavedToolIds] = useState<(string | number)[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [activeCollectionSelector, setActiveCollectionSelector] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [similarTools, setSimilarTools] = useState<any[]>([]);

  // Helper to resolve role-based storage keys dynamically
  const getRoleKey = (baseKey: string) => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('user_role') || 'default';
      return `${baseKey}_${role}`;
    }
    return baseKey;
  };

  // Synchronize localStorage states across tabs
  const syncLocalStates = () => {
    if (typeof window !== 'undefined') {
      setSavedToolIds(JSON.parse(localStorage.getItem(getRoleKey('saved_tools')) || '[]'));
      setCollections(JSON.parse(localStorage.getItem(getRoleKey('collections')) || '[]'));
    }
  };

  const fetchToolData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      // 1. Fetch current tool details
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${toolId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to fetch tool data');
      const data = await response.json();
      setTool(data);
      setLoading(false); // Stop loading immediately after primary data is fetched

      // 2. Fetch similar tools asynchronously in the background
      fetchSimilarTools(data);
    } catch (err) {
      // Fallback to offline cache
      try {
        const adminTools: any[] = (await getCachedTools()) || [];
        const cachedUserStr = typeof window !== 'undefined' ? localStorage.getItem('offline_registry_data') : null;
        const userTools: any[] = cachedUserStr ? JSON.parse(cachedUserStr) : [];
        const allTools = [...adminTools, ...userTools];
        const cachedTool = allTools.find((t: any) => String(t.id) === String(toolId) || String(t.slug) === String(toolId));
        
        if (cachedTool) {
          setTool(cachedTool);
          setLoading(false);
          const cat = cachedTool.category_name;
          const similar = allTools.filter((t: any) => t.category_name === cat && String(t.id) !== String(cachedTool.id)).slice(0, 3);
          setSimilarTools(similar);
        } else {
          setError('Tool details not available offline.');
          setLoading(false);
        }
      } catch (cacheErr) {
        setError('Unable to load tool details. Please check your connection.');
        setLoading(false);
      }
    }
  };

  const fetchSimilarTools = async (data: any) => {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const categoryParam = data.category_name ? `category=${encodeURIComponent(data.category_name)}&` : '';
      const toolsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?${categoryParam}all=true`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const toolsData = await toolsResponse.json();
      const allToolsList = toolsData.tools || [];

      // Filter tools in same category (excluding current), sliced to 3
      const filtered = allToolsList
        .filter((t: any) => t.id !== data.id)
        .slice(0, 3);

      setSimilarTools(filtered);
    } catch (err) {
      if (similarTools.length === 0) {
        try {
          const adminTools: any[] = (await getCachedTools()) || [];
          const cachedUserStr = typeof window !== 'undefined' ? localStorage.getItem('offline_registry_data') : null;
          const userTools: any[] = cachedUserStr ? JSON.parse(cachedUserStr) : [];
          const allTools = [...adminTools, ...userTools];
          const cat = data.category_name;
          const similar = allTools.filter((t: any) => t.category_name === cat && String(t.id) !== String(data.id)).slice(0, 3);
          setSimilarTools(similar);
        } catch(e) {}
      }
    }
  };

  useEffect(() => {
    fetchToolData();
    syncLocalStates();
    window.addEventListener(SYNC_EVENT, syncLocalStates);
    return () => window.removeEventListener(SYNC_EVENT, syncLocalStates);
  }, [toolId]);

  const isSaved = useMemo(() => {
    return tool && savedToolIds.includes(tool.id);
  }, [tool, savedToolIds]);

  const handleToggleSave = () => {
    if (!tool) return;
    const updated = isSaved
      ? savedToolIds.filter(id => id !== tool.id)
      : [...savedToolIds, tool.id];
    localStorage.setItem(getRoleKey('saved_tools'), JSON.stringify(updated));
    setSavedToolIds(updated);
    window.dispatchEvent(new Event(SYNC_EVENT));
  };

  const handleToggleCollection = (collId: string | number) => {
    if (!tool) return;
    const updated = collections.map(c => {
      if (c.id === collId) {
        const alreadyHas = c.toolIds.includes(tool.id);
        return {
          ...c,
          toolIds: alreadyHas
            ? c.toolIds.filter((id: any) => id !== tool.id)
            : [...c.toolIds, tool.id]
        };
      }
      return c;
    });
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    window.dispatchEvent(new Event(SYNC_EVENT));
  };

  // Resolve key features array safely
  const resolvedFeatures = useMemo(() => {
    if (!tool) return [];
    if (!tool.key_features) return [];
    if (Array.isArray(tool.key_features)) return tool.key_features;
    if (typeof tool.key_features === 'string') {
      try {
        const parsed = JSON.parse(tool.key_features);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return tool.key_features.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  }, [tool]);

  // Resolve use cases cleanly and enrich them contextually
  const resolvedUseCases = useMemo(() => {
    if (!tool) return [];

    let rawUseCases: string[] = [];
    if (tool.use_case && typeof tool.use_case === 'string') {
      rawUseCases = tool.use_case
        .split(/[.\n]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 10);
    }

    if (rawUseCases.length === 0) {
      rawUseCases = [
        `Improve productivity and efficiency in daily operations using ${tool.name}.`,
        `Automate repetitive tasks and streamline workflows across the organization.`,
        `Leverage advanced AI capabilities to gain insights and make data-driven decisions.`
      ];
    } else if (rawUseCases.length === 1) {
      rawUseCases.push(
        `Scale operations seamlessly while maintaining high quality standards.`,
        `Integrate with existing toolchains to enhance overall system capabilities.`
      );
    } else if (rawUseCases.length === 2) {
      rawUseCases.push(`Enhance team collaboration and reduce friction in project execution.`);
    }

    return rawUseCases.map((uc: string) => ({
      desc: uc.endsWith('.') ? uc : `${uc}.`
    }));
  }, [tool]);

  const enrichedDescription = useMemo(() => {
    if (!tool) return '';
    let desc = tool.description || tool.short_description || 'No detailed description available.';
    return desc;
  }, [tool]);

  const resolvedTags = useMemo(() => {
    if (!tool) return [];
    if (!tool.tags) return [];
    if (Array.isArray(tool.tags)) return tool.tags;
    if (typeof tool.tags === 'string') {
      try {
        const parsed = JSON.parse(tool.tags);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return tool.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  }, [tool]);

  const domain = useMemo(() => {
    if (!tool || !tool.url) return '';
    try { return new URL(tool.url.startsWith('http') ? tool.url : `https://${tool.url}`).hostname; }
    catch (e) { return tool.url; }
  }, [tool]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[var(--border2)] border-t-[var(--neon)] rounded-full animate-spin" />
        <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">Loading details...</p>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 font-sans text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <Shield size={24} />
        </div>
        <h2 className="text-xl font-black text-[var(--text)] tracking-tight">Connection Error</h2>
        <p className="text-[13px] font-medium text-[var(--muted)] max-w-sm leading-relaxed">{error || 'Tool not found'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[11px] font-black text-[var(--text)] uppercase tracking-widest hover:border-[var(--neon)] transition-all font-mono"
        >
          Go Back
        </button>
      </div>
    );
  }

  const pricingClean = (tool.pricing_model || 'free').toLowerCase();
  const pricingIcon = pricingClean === 'free' ? 'Free' : pricingClean === 'freemium' ? 'Freemium' : 'Paid';
  const pricingColor = pricingClean === 'free' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
    pricingClean === 'freemium' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
      'text-orange-500 bg-orange-500/10 border-orange-500/20';

  return (
    <div className="h-full flex flex-col font-sans relative text-[var(--text)] bg-[var(--bg)] animate-in fade-in slide-in-from-bottom-4 duration-700">

      <SandboxViewer
        open={isSandboxOpen}
        url={tool?.url}
        title={tool?.name}
        onClose={() => setIsSandboxOpen(false)}
      />

      {/* Header Bar */}
      <div className="flex-shrink-0 flex items-center justify-between pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-black text-[var(--muted)] uppercase tracking-widest hover:bg-[var(--card-bg)] hover:text-[var(--text)] hover:border-[var(--neon)] transition-all cursor-pointer group shadow-sm font-mono"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-0 overflow-y-auto no-scrollbar pb-12">

        {/* Left Column: Tool Profile & Actions */}
        <div className="lg:col-span-4 flex flex-col space-y-6">

          {/* Profile Card */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 flex flex-col items-center shadow-xl relative overflow-hidden group">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--neon)]/10 to-transparent pointer-events-none opacity-50" />

            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-white border border-[var(--border)] shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden mb-6 z-10 group-hover:shadow-lg transition-all duration-300">
              {domain ? (
                <img src={`https://icon.horse/icon/${domain}`} alt="" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
              ) : null}
              <Globe className={`w-12 h-12 text-slate-300 ${domain ? 'hidden' : ''}`} />
            </div>

            <h1 className="text-2xl font-black text-[var(--text)] tracking-tight mb-2 text-center z-10">{tool.name}</h1>
            <p className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-widest font-mono mb-6 text-center z-10">
              {tool.category_name || 'AI Tool'}
              {tool.sub_category && <><span className="mx-2 opacity-50">•</span>{tool.sub_category}</>}
              {tool.micro_category && <><span className="mx-2 opacity-50">•</span>{tool.micro_category}</>}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full z-10">
              <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest font-mono shadow-sm ${pricingColor}`}>
                {pricingIcon}
              </span>
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-black text-[var(--text)] shadow-sm">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                {tool.rating || '4.5'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col w-full gap-3 mt-8 z-10">
              {tool.url && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => setIsSandboxOpen(true)}
                    className="w-full py-3 rounded-xl bg-[var(--neon)] text-black font-bold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(var(--particle-rgb),0.25)]"
                  >
                    <Play size={14} className="fill-black" />
                    Launch Sandbox
                  </button>
                  <button
                    onClick={() => window.open(tool.url, '_blank')}
                    className="w-full py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-bold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
                  >
                    Visit Website
                    <ExternalLink size={14} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={handleToggleSave}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer ${isSaved ? 'bg-[var(--neon)]/10 border-[var(--neon)]/30 text-[var(--neon)] shadow-sm' : 'bg-[var(--input-bg)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text)]'}`}
                >
                  <Bookmark size={13} className={isSaved ? "fill-[var(--neon)]" : ""} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <div className="relative w-full">
                  <button
                    onClick={() => setActiveCollectionSelector(!activeCollectionSelector)}
                    className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer ${activeCollectionSelector ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15'}`}
                  >
                    <FolderPlus size={13} />
                    Add To
                  </button>

                  <AnimatePresence>
                    {activeCollectionSelector && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveCollectionSelector(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl rounded-t-3xl p-3 z-50 shadow-2xl space-y-1"
                        >
                          <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest border-b border-[var(--border)] pb-2 mb-2 px-1 font-mono">My Collections</p>
                          <div className="max-h-48 overflow-y-scroll no-scrollbar space-y-1">
                            {collections.length === 0 ? (
                              <p className="text-[10px] font-medium text-[var(--muted)] text-center py-4">No collections yet.</p>
                            ) : (
                              collections.map(c => {
                                const isSelected = c.toolIds.includes(tool.id);
                                return (
                                  <button
                                    key={c.id}
                                    onClick={() => handleToggleCollection(c.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-between transition-all cursor-pointer ${isSelected ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'hover:bg-[var(--input-bg)] text-[var(--text)]'}`}
                                  >
                                    <span className="truncate pr-2">{c.name}</span>
                                    {isSelected ? <CheckCircle size={12} /> : <FolderPlus size={12} className="text-[var(--muted)]" />}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[0.2em] font-mono border-b border-[var(--border)] pb-3">Tool Details</h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[var(--muted)] flex items-center gap-2"><Globe size={13} /> Website</span>
                <span className="text-[12px] font-bold text-[var(--text)]">{domain || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[var(--muted)] flex items-center gap-2"><User size={13} /> Developer</span>
                <span className="text-[12px] font-bold text-[var(--text)]">{tool.developer_name || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[var(--muted)] flex items-center gap-2"><Monitor size={13} /> Platform</span>
                <span className="text-[12px] font-bold text-[var(--text)] truncate max-w-[120px] text-right" title={tool.platform_type || (Array.isArray(tool.platform_support) ? tool.platform_support.join(', ') : 'Web')}>
                  {tool.platform_type || (Array.isArray(tool.platform_support) ? tool.platform_support.join(', ') : 'Web')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Content */}
        <div className="lg:col-span-8 flex flex-col space-y-6 lg:space-y-8">

          {/* Description Block */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--neon)]/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <h2 className="text-xl lg:text-2xl font-black text-[var(--text)] mb-4 font-sans tracking-tight">Overview</h2>
            <p className="text-[14px] lg:text-[15px] leading-relaxed text-[var(--muted2)] font-medium">
              {enrichedDescription}
            </p>

            {resolvedTags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {resolvedTags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-bold text-[var(--muted2)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors cursor-default font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Key Features & Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* Key Features */}
            {resolvedFeatures.length > 0 && (
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-black text-[var(--text)] tracking-tight mb-5 flex items-center gap-2">
                  <Shield size={18} className="text-[var(--neon)]" />
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {resolvedFeatures.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-[13px] text-[var(--text)] font-medium">
                      <CheckCircle size={15} className="text-[var(--neon)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-[var(--muted2)]">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Use Cases */}
            {resolvedUseCases.length > 0 && (
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-black text-[var(--text)] tracking-tight mb-5 flex items-center gap-2">
                  <Workflow size={18} className="text-[var(--emerald)]" />
                  Use Cases
                </h3>
                <ul className="space-y-4">
                  {resolvedUseCases.map((useCase: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-[13px] text-[var(--text)] font-medium bg-[var(--input-bg)]/50 p-4 rounded-2xl border border-[var(--border)]/50">
                      <div className="w-5 h-5 rounded-full bg-[var(--emerald)]/10 text-[var(--emerald)] flex items-center justify-center shrink-0 text-[9px] font-black mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed text-[var(--muted2)]">{useCase.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Similar Tools */}
          {similarTools.length > 0 && (
            <div className="pt-6">
              <h3 className="text-lg font-black text-[var(--text)] tracking-tight mb-5 flex items-center gap-2 px-1">
                <Layers size={18} className="text-[var(--neon)]" />
                Similar Alternative Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {similarTools.map((t: any) => {
                  const pModel = (t.pricing_model || 'free').toLowerCase();
                  const tColor = pModel === 'free' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                    pModel === 'freemium' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                      'text-orange-500 bg-orange-500/10 border-orange-500/20';
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelectTool && onSelectTool(t.id)}
                      className="bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--border2)] rounded-3xl p-6 flex flex-col items-center text-center transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        {t.category_icon || '🤖'}
                      </div>
                      <h4 className="text-[14px] font-black text-[var(--text)] tracking-tight w-full truncate group-hover:text-[var(--neon)] transition-colors mb-1">{t.name}</h4>
                      <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest font-mono w-full truncate mb-4">{t.category_name}</p>
                      <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest font-mono ${tColor}`}>
                        {t.pricing_model || 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
