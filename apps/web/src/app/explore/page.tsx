"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, ChevronLeft, LayoutGrid, Sparkles, Star, Globe, Cpu, ExternalLink, Activity, ArrowRight, Zap, ArrowLeft, Filter } from 'lucide-react';
import { socket } from '@/lib/socket';

interface Category { id: string; name: string; icon: string; description: string; }
interface Tool {
  id: string; name: string; description: string; url: string;
  category_id: string; category_name: string;
  platform_type?: string; pricing_model?: string;
  developer_name?: string; is_featured?: boolean;
  website_url?: string;
}

export default function ExplorePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toolsRes, catsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?all=true`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token')}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/categories`)
        ]);
        const toolsData = await toolsRes.json();
        const catsData = await catsRes.json();
        if (toolsData.tools) setTools(toolsData.tools);
        if (Array.isArray(catsData)) setCategories(catsData);
      } catch (err) {
        console.error('Failed to load explore data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    socket.on('refresh_matrix', fetchData);
    return () => {
      socket.off('refresh_matrix', fetchData);
    };
  }, []);

  const filteredTools = useMemo(() => {
    let result = tools;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    return result;
  }, [tools, searchQuery]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, Tool[]> = {};
    categories.forEach(c => grouped[c.id] = []);
    filteredTools.forEach(t => {
      if (t.category_id && grouped[t.category_id]) {
        grouped[t.category_id].push(t);
      }
    });
    return grouped;
  }, [filteredTools, categories]);

  // Expanded View Meta-Data Calculation
  const activeCategoryTools = activeCategory ? toolsByCategory[activeCategory.id] || [] : [];
  const platforms = Array.from(new Set(activeCategoryTools.map(t => t.platform_type || 'Web'))).filter(Boolean);
  const pricingModels = Array.from(new Set(activeCategoryTools.map(t => t.pricing_model || 'Free'))).filter(Boolean);

  const ToolCard = ({ tool, index }: { tool: Tool; index: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--neon)]/50 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[var(--neon)]/30 transition-colors">
            {tool.platform_type?.includes('Web') ? <Globe size={18} className="text-emerald-400" /> : <Cpu size={18} className="text-emerald-400" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-black text-[var(--text)] truncate flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors">
              {tool.name}
              {tool.is_featured && (
                <span className="inline-flex p-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400" title="Featured">
                  <Star size={10} className="fill-amber-400" />
                </span>
              )}
            </span>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest font-mono truncate mt-0.5">{tool.developer_name || 'System Hub'}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3 relative z-10 mb-5">
        <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">{tool.description}</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <span className="text-[8px] font-bold text-[var(--muted2)] uppercase tracking-wider">Platform</span>
            <span className="font-semibold text-[11px] text-[var(--text)] truncate">{tool.platform_type || 'Web'}</span>
          </div>
          <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <span className="text-[8px] font-bold text-[var(--muted2)] uppercase tracking-wider">Pricing</span>
            <span className="font-black text-[11px] text-emerald-400 uppercase tracking-widest font-mono truncate">{tool.pricing_model || 'Free'}</span>
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-[var(--border)]/60 relative z-10 mt-auto">
        <a
          href={tool.website_url || tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-[40px] rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--neon)] text-[10px] font-black uppercase tracking-widest text-[var(--text)] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
        >
          Explore Node <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)] flex flex-col pb-20">
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 overflow-hidden shrink-0 border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon)]/[0.04] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--neon)]/[0.08] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg2)] border border-[var(--border)] mb-6 shadow-sm">
            <Sparkles size={12} className="text-[var(--neon)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--neon)] font-mono">Neural Ecosystem Catalog</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-royal text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[var(--muted)]">
            Explore {activeCategory ? 'Category' : 'Intelligence'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm sm:text-base text-[var(--muted)] max-w-2xl mx-auto mb-10 font-medium">
            Discover, evaluate, and integrate the most powerful AI nodes available across the matrix.
          </motion.p>

          {!activeCategory && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted2)]" />
              <input
                type="text"
                placeholder="Search for nodes, tools, platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border)] text-[14px] font-semibold text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--neon)]/50 focus:ring-4 focus:ring-[var(--neon)]/10 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--neon)] rounded-full animate-spin mb-6" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Synchronizing Matrix...</span>
          </div>
        ) : activeCategory ? (
          
          /* ================= EXPANDED CATEGORY VIEW ================= */
          <AnimatePresence mode="wait">
            <motion.div key="expanded" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              
              {/* Category Meta Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 sm:p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--border)] shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--neon)]/[0.05] rounded-full blur-[80px] pointer-events-none" />
                
                <div className="flex items-center gap-5 relative z-10">
                  <button 
                    onClick={() => setActiveCategory(null)}
                    className="w-12 h-12 rounded-xl border border-[var(--border)] hover:bg-[var(--bg)] flex items-center justify-center transition-all group"
                  >
                    <ChevronLeft size={20} className="text-[var(--muted)] group-hover:text-[var(--text)] transition-colors" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-inner flex items-center justify-center text-3xl shrink-0">
                      {activeCategory.icon || '📦'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">{activeCategory.name}</h2>
                      <p className="text-[12px] text-[var(--muted)] mt-1 max-w-md line-clamp-2">{activeCategory.description}</p>
                    </div>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto relative z-10">
                  <div className="flex-1 md:flex-none flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] min-w-[120px]">
                    <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Total Nodes</span>
                    <span className="text-[15px] font-black text-[var(--text)]">{activeCategoryTools.length} Indexed</span>
                  </div>
                  <div className="flex-1 md:flex-none flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] min-w-[140px]">
                    <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Platforms</span>
                    <span className="text-[11px] font-bold text-blue-400 line-clamp-1">{platforms.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex-1 md:flex-none flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] min-w-[140px]">
                    <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Pricing Models</span>
                    <span className="text-[11px] font-bold text-emerald-400 line-clamp-1">{pricingModels.join(', ') || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Tools Grid for this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeCategoryTools.map((tool, idx) => (
                  <ToolCard key={tool.id} tool={tool} index={idx} />
                ))}
                {activeCategoryTools.length === 0 && (
                  <div className="col-span-full py-20 text-center flex flex-col items-center">
                    <Compass size={32} className="text-[var(--muted2)] mb-4" />
                    <p className="text-[12px] font-black uppercase tracking-widest text-[var(--muted)] font-mono">No nodes indexed in this category.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

        ) : (
          
          /* ================= DEFAULT GROUPED VIEW ================= */
          <AnimatePresence mode="wait">
            <motion.div key="grouped" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-16">
              
              {categories.filter(c => toolsByCategory[c.id]?.length > 0).map((category, catIdx) => {
                const categoryTools = toolsByCategory[category.id].slice(0, 4); // Preview up to 4
                
                return (
                  <motion.section 
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: Math.min(catIdx * 0.1, 0.4) }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center text-2xl shadow-sm">
                          {category.icon || '📦'}
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-[var(--text)] tracking-tight">{category.name}</h2>
                          <p className="text-[11px] font-bold text-[var(--muted)] mt-1 uppercase tracking-wider">{toolsByCategory[category.id].length} Tools Available</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveCategory(category)}
                        className="px-5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--neon)]/10 hover:border-[var(--neon)]/40 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--neon)] transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
                      >
                        See All Tools <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryTools.map((tool, idx) => (
                        <ToolCard key={tool.id} tool={tool} index={idx} />
                      ))}
                    </div>
                  </motion.section>
                );
              })}

              {categories.length === 0 && !loading && (
                <div className="text-center py-32 flex flex-col items-center">
                  <LayoutGrid size={40} className="text-[var(--muted2)] mb-4" />
                  <p className="text-[12px] font-black uppercase tracking-widest text-[var(--muted)] font-mono">No categories or tools found in the matrix.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
