"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Bookmark,
  FolderPlus,
  ExternalLink,
  Plus,
  Grid,
  Trash2,
  Folder,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Filter,
  PlusCircle,
  FolderMinus,
  Sparkles,
  BookOpen,
  ArrowRight,
  Calendar,
  Zap,
  Clock,
  Cpu,
  Award,
  Globe,
  Heart,
  Star,
  Download,
  X,
  Info,
  Shield,
  Users,
  Activity,
  Layers,
  RefreshCw,
  Play,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddTools } from './AddTools';
import { UploadHistory } from './UploadHistory';
import { socket } from '@/lib/socket';
import { getRecommendedTools } from '@/lib/recommendationEngine';
import { SandboxViewer } from '@/components/workspace/SandboxViewer';
import {
  loadCategories,
  loadAdminTools,
  buildCategoryCountMap,
  buildPricingCounts,
  buildToolsByCategory,
} from '@/lib/workspaceData';

// --- TYPE DEFINITIONS ---
interface Tool {
  id: string | number;
  name: string;
  category_name: string;
  sub_category?: string;
  micro_category?: string;
  category_icon?: string;
  platform_type: string;
  pricing_model: string;
  rating?: number | string;
  description: string;
  is_active: boolean;
  url?: string;
  tags?: string[] | string;
  started_at?: string;
  created_at?: string;
  source?: string;
  is_admin_added?: boolean;
}


interface Collection {
  id: string;
  name: string;
  description: string;
  toolIds: (string | number)[];
}

// --- SYNC MECHANISM FOR REAL-TIME ---
const SYNC_EVENT = 'workspace-state-sync';
const triggerSync = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SYNC_EVENT));
  }
};

// --- ROLE-BASED KEY GENERATOR ---
export const getRoleKey = (baseKey: string) => {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('user_role') || 'default';
    return `${baseKey}_${role}`;
  }
  return baseKey;
};

// --- SHARED SKELETON LOADER ---
const SkeletonCard = () => (
  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl overflow-hidden animate-pulse">
    <div className="p-5 pb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-[14px] bg-[var(--border)] shrink-0" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded-full bg-[var(--border)]" />
          <div className="h-2.5 w-20 rounded-full bg-[var(--border)]" />
        </div>
      </div>
      <div className="h-6 w-14 rounded-full bg-[var(--border)]" />
    </div>
    <div className="px-5 pb-4 space-y-2">
      <div className="h-2.5 w-full rounded-full bg-[var(--border)]" />
      <div className="h-2.5 w-4/5 rounded-full bg-[var(--border)]" />
      <div className="h-2.5 w-3/5 rounded-full bg-[var(--border)]" />
    </div>
    <div className="px-5 py-4 border-t border-[var(--border)] flex items-center justify-between">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-[10px] bg-[var(--border)]" />
        <div className="w-8 h-8 rounded-[10px] bg-[var(--border)]" />
      </div>
      <div className="h-8 w-24 rounded-xl bg-[var(--border)]" />
    </div>
  </div>
);


// --- SHARED PREMIUM TOOL CARD ---
const PremiumToolCard = ({
  tool,
  idx,
  isSaved,
  collections,
  activeCollectionSelector,
  onViewDetails,
  onToggleSave,
  onToggleCollection,
  onSetActiveSelector,
  isSelectedForCompare = false,
  onToggleCompare,
  onLaunchSandbox,
  isRecommended = false,
}: {
  tool: Tool;
  idx: number;
  isSaved: boolean;
  collections: Collection[];
  activeCollectionSelector: string | number | null;
  onViewDetails: (id: string | number) => void;
  onToggleSave: (id: string | number) => void;
  onToggleCollection: (collectionId: string, toolId: string | number) => void;
  onSetActiveSelector: (id: string | number | null) => void;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (id: string | number) => void;
  onLaunchSandbox?: (tool: Tool) => void;
  isRecommended?: boolean;
}) => {
  const pricingClean = (tool.pricing_model || 'free').toLowerCase();
  const pricingColor =
    pricingClean === 'free'
      ? { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' }
      : pricingClean === 'freemium'
      ? { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' }
      : { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20' };

  const accents = ['--neon', '--emerald', '--mint'];
  const accentVar = accents[idx % accents.length];

  const domain = React.useMemo(() => {
    if (!tool.url) return '';
    try {
      return new URL(tool.url.startsWith('http') ? tool.url : `https://${tool.url}`).hostname;
    } catch (e) {
      return tool.url;
    }
  }, [tool.url]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.15), ease: 'easeOut' }}
      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl flex flex-col overflow-hidden group hover:border-[var(--border2)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative cursor-pointer"
      onClick={() => onViewDetails(tool.id)}
    >
      {/* Gradient accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, var(${accentVar}), transparent)` }}
      />
      {/* Glow orb (Optimized for scroll performance) */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, color-mix(in srgb, var(${accentVar}) 15%, transparent) 0%, transparent 70%)` }}
      />

      {/* Large Ghost Number */}
      <div className="absolute -top-2 -right-2 text-[100px] font-black text-[var(--muted)]/5 font-sans pointer-events-none select-none z-0 tracking-tighter leading-none group-hover:text-[var(--neon)]/10 transition-colors duration-500">
        {(idx + 1).toString().padStart(2, '0')}
      </div>

      {/* Card Header */}
      <div className="p-5 pb-3 flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-[16px] border flex items-center justify-center text-[22px] shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden"
            style={{
              background: `color-mix(in srgb, var(${accentVar}) 10%, transparent)`,
              borderColor: `color-mix(in srgb, var(${accentVar}) 25%, transparent)`,
            }}
          >
            {domain ? (
               <>
                 <img src={`https://icon.horse/icon/${domain}`} alt="" className="w-full h-full object-contain rounded-[14px] p-2 bg-white/5" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                 <Globe className="w-5 h-5 hidden" style={{ color: `var(${accentVar})` }} />
               </>
            ) : (
               <Globe className="w-5 h-5" style={{ color: `var(${accentVar})` }} />
            )}
          </div>
          <div className="min-w-0">
            <h4
              className="text-[15px] font-extrabold text-[var(--text)] tracking-tight leading-tight group-hover:text-[var(--neon)] transition-colors duration-200 truncate max-w-[150px] font-sans"
            >
              {tool.name}
            </h4>
            <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest mt-0.5 truncate font-sans">
              {tool.category_name}
              {tool.sub_category && <><span className="mx-1 opacity-50">•</span>{tool.sub_category}</>}
              {tool.micro_category && <><span className="mx-1 opacity-50">•</span>{tool.micro_category}</>}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-black border capitalize ${pricingColor.bg} ${pricingColor.text} ${pricingColor.border}`}
        >
          {tool.pricing_model || 'Free'}
        </span>
      </div>

      {/* Card Body */}
      <div className="px-5 pb-3 flex-1 flex flex-col relative z-10">
        <p className="text-[12px] font-medium text-[var(--muted)] leading-[1.7] line-clamp-3 font-sans">
          {tool.description || 'No description available for this tool.'}
        </p>

        {/* Platform & Rating Row */}
        <div className="flex items-center gap-3 mt-auto pt-3">
          {tool.platform_type && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] bg-[var(--input-bg)] px-2.5 py-1 rounded-full border border-[var(--border)] font-sans">
              {tool.platform_type}
            </span>
          )}
          {tool.rating && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-400 font-sans">
              <Star size={10} className="fill-amber-400" />
              {tool.rating}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3.5 border-t border-[var(--border)] flex items-center justify-between gap-3 mt-auto bg-[var(--input-bg)]/40 relative z-10">
        <div className="flex items-center gap-2">
          {/* Compare Button */}
          {onToggleCompare && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleCompare(tool.id); }}
              className={`p-2 rounded-[10px] border transition-all cursor-pointer active:scale-95 ${isSelectedForCompare
                ? 'bg-[var(--emerald)]/20 text-[var(--emerald)] border-[var(--emerald)]/30'
                : 'bg-[var(--input-bg)] border-[var(--border)] text-[var(--muted2)] hover:border-[var(--emerald)] hover:text-[var(--emerald)]'}`}
              title={isSelectedForCompare ? 'Remove from Comparison' : 'Add to Comparison'}
            >
              {isSelectedForCompare ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <Layers size={13} />
              )}
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(tool.id); }}
            className={`p-2 rounded-[10px] border transition-all cursor-pointer active:scale-95 ${isSaved
              ? 'bg-[var(--neon)] text-black border-[var(--neon)] shadow-[0_0_15px_rgba(var(--particle-rgb),0.35)]'
              : 'bg-[var(--input-bg)] border-[var(--border)] text-[var(--muted2)] hover:border-[var(--neon)] hover:text-[var(--neon)]'}`}
            title={isSaved ? 'Unsave' : 'Save Tool'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-black' : ''} />
          </button>

          {/* Collection Button */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); onSetActiveSelector(activeCollectionSelector === tool.id ? null : tool.id); }}
              className={`p-2 rounded-[10px] border transition-all cursor-pointer active:scale-95 ${activeCollectionSelector === tool.id
                ? 'bg-[var(--emerald)]/20 text-[var(--emerald)] border-[var(--emerald)]/40'
                : 'bg-[var(--input-bg)] border-[var(--border)] text-[var(--muted2)] hover:border-[var(--emerald)] hover:text-[var(--emerald)]'}`}
              title="Add to Collection"
            >
              <FolderPlus size={13} />
            </button>
            <AnimatePresence>
              {activeCollectionSelector === tool.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onSetActiveSelector(null); }} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full mb-2 left-0 w-56 bg-[var(--card-bg)] border border-[var(--border2)] rounded-2xl rounded-t-3xl p-3 z-50 shadow-2xl backdrop-blur-xl space-y-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest px-1 mb-2 pb-2 border-b border-[var(--border)] font-mono">
                      My Collections
                    </p>
                    {collections.length === 0 ? (
                      <p className="text-[9px] font-bold text-[var(--muted2)] text-center py-2 uppercase tracking-widest font-general">
                        No collections yet
                      </p>
                    ) : (
                      collections.map((c) => {
                        const isSelected = c.toolIds.includes(tool.id);
                        return (
                          <button
                            key={c.id}
                            onClick={() => onToggleCollection(c.id, tool.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-between hover:bg-[var(--input-bg)] transition-colors cursor-pointer font-general ${isSelected ? 'text-[var(--neon)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                          >
                            <span className="truncate max-w-[120px]">{c.name}</span>
                            {isSelected ? (
                              <FolderMinus size={11} className="text-[var(--mint)] shrink-0" />
                            ) : (
                              <FolderPlus size={11} className="text-[var(--muted2)] shrink-0" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div layout className="flex items-center gap-2">
          {tool.url && onLaunchSandbox && (
            <button
              onClick={(e) => { e.stopPropagation(); onLaunchSandbox(tool); }}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--neon)]/15 border border-[var(--neon)]/30 text-[var(--neon)] hover:bg-[var(--neon)] hover:text-black transition-all duration-200 cursor-pointer active:scale-95"
              title="Launch Sandbox"
            >
              <Play size={12} className="fill-current" />
            </button>
          )}
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--muted2)] hover:text-white hover:border-[var(--border2)] transition-all duration-200 cursor-pointer active:scale-95"
              title="Visit External Website"
            >
              <ExternalLink size={12} />
            </a>
          )}
          {/* View Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(tool.id); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[9px] font-black uppercase tracking-widest text-[var(--neon)] hover:bg-[var(--neon)] hover:text-black hover:border-[var(--neon)] hover:shadow-[0_0_15px_rgba(var(--particle-rgb),0.3)] transition-all duration-200 cursor-pointer group/btn font-sans active:scale-95"
          >
            View
            <ChevronRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const PremiumFilterBar = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-none flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6 relative z-20">
    {children}
  </div>
);

// --- PREMIUM SEARCH INPUT ---
const PremiumSearch = ({
  value,
  onChange,
  placeholder,
  accentColor = 'var(--neon)',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  accentColor?: string;
}) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) onChange(localValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)] pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full h-[46px] pl-11 pr-4 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] text-[13px] font-semibold text-[var(--text)] outline-none transition-all placeholder:text-[var(--muted2)] focus:ring-2 focus:ring-[var(--neon)]/20 focus:border-[var(--neon)] shadow-sm"
      />
      {localValue && (
        <button
          onClick={() => { setLocalValue(''); onChange(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[var(--muted2)] hover:text-[var(--text)] transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

// --- RECOMMENDATION ENGINE ---
const RecommendationEngine = ({
  tools,
  savedToolIds,
  searchQuery,
  collections,
  activeCollectionSelector,
  onViewDetails,
  onToggleSave,
  onToggleCollection,
  onSetActiveSelector,
  onLaunchSandbox
}: {
  tools: Tool[];
  savedToolIds: (string | number)[];
  searchQuery: string;
  collections: any[];
  activeCollectionSelector: string | number | null;
  onViewDetails: (id: string | number) => void;
  onToggleSave: (id: string | number) => void;
  onToggleCollection: (collectionId: string, toolId: string | number) => void;
  onSetActiveSelector: (id: string | number | null) => void;
  onLaunchSandbox: (tool: Tool) => void;
}) => {
  const deferredSearchQuery = React.useDeferredValue(searchQuery);

  const recommendedTools = React.useMemo(() => {
    return getRecommendedTools(tools as any[], savedToolIds, 3, deferredSearchQuery);
  }, [tools, savedToolIds, deferredSearchQuery]);

  if (recommendedTools.length === 0) return null;

  return (
    <div className="mb-8 flex-none animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-2 mb-3.5 px-1">
        <Sparkles size={14} className="text-amber-500 animate-pulse" />
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
          {searchQuery ? 'Suggested Systems' : 'Recommended Systems'}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {recommendedTools.map((tool, i) => (
          <PremiumToolCard
            key={`rec-${tool.id}`}
            tool={tool as Tool}
            idx={i}
            isSaved={savedToolIds.includes(tool.id)}
            collections={collections}
            activeCollectionSelector={activeCollectionSelector}
            onViewDetails={onViewDetails}
            onToggleSave={onToggleSave}
            onToggleCollection={onToggleCollection}
            onSetActiveSelector={onSetActiveSelector}
            onLaunchSandbox={onLaunchSandbox}
            isRecommended={true}
          />
        ))}
      </div>
      <div className="w-full h-px bg-[var(--border)]/30 mt-6" />
    </div>
  );
};

// --- PREMIUM SECTION HEADER ---
const PremiumHeader = ({
  badge,
  title,
  subtitle,
  count,
  countLabel,
  icon: Icon,
  accentClass = 'text-[var(--neon)]',
  badgeBg = 'bg-[var(--neon)]/10',
  badgeBorder = 'border-[var(--neon)]/20',
  children,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  count?: number | string;
  countLabel?: string;
  icon?: React.ElementType;
  accentClass?: string;
  badgeBg?: string;
  badgeBorder?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex-none flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 relative">
    {/* Background gradient hint */}
    <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon)]/[0.02] to-transparent pointer-events-none rounded-2xl" />
    <div className="min-w-0 space-y-2 relative z-10">
      {badge && (
        <div className={`inline-flex items-center gap-1.5 text-[9px] font-black tracking-[0.22em] uppercase font-mono ${accentClass}`}>
          {badge}
        </div>
      )}
      <h1 className="font-royal text-2xl md:text-3xl lg:text-4xl font-black text-[var(--text)] tracking-tight flex flex-wrap items-center gap-3 leading-tight">
        {Icon && <Icon className={`w-7 h-7 ${accentClass} shrink-0`} />}
        <span>{title}</span>
        {count !== undefined && (
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeBg} border ${badgeBorder} ${accentClass} self-center`}>
            {count}{countLabel ? ` ${countLabel}` : ''}
          </span>
        )}
      </h1>
      <p className="text-[12px] md:text-[13px] text-[var(--muted)] tracking-wide leading-relaxed max-w-xl">
        {subtitle}
      </p>
    </div>
    {children && <div className="relative z-10 shrink-0 w-full sm:w-auto">{children}</div>}
  </div>
);

// --- EMPTY STATE ---
const EmptyState = ({
  icon: Icon,
  title,
  subtitle,
  accentClass = 'text-[var(--neon)]',
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  accentClass?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20 px-8 bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/[0.03] to-transparent pointer-events-none" />
    <div className={`w-16 h-16 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5 ${accentClass}`}>
      <Icon className="w-8 h-8 opacity-50" />
    </div>
    <p className="text-[15px] font-extrabold text-[var(--text)] mb-2 tracking-tight">{title}</p>
    {subtitle && <p className="text-[12px] font-medium text-[var(--muted2)] max-w-xs mx-auto leading-relaxed">{subtitle}</p>}
  </motion.div>
);


// --- 1. SEARCH AI TOOLS VIEW ---
export const SearchAITools = ({ 
  initialCategory = 'all', 
  initialSearchQuery = '',
  onViewDetails,
  onCompareTools
}: { 
  initialCategory?: string;
  initialSearchQuery?: string;
  onViewDetails: (id: string | number) => void;
  onCompareTools?: (ids: string[]) => void;
}) => {
  const [adminTools, setAdminTools] = useState<Tool[]>([]);
  const [userTools, setUserTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPricingDropdownOpen, setIsPricingDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [sandboxTool, setSandboxTool] = useState<Tool | null>(null);

  const handleToggleCompare = (id: string | number) => {
    const stringId = String(id);
    setSelectedCompareIds(prev => {
      if (prev.includes(stringId)) return prev.filter(item => item !== stringId);
      if (prev.length >= 4) return prev; // limit to 4
      return [...prev, stringId];
    });
  };

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Real-time synchronization states
  const [savedToolIds, setSavedToolIds] = useState<(string | number)[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionSelector, setActiveCollectionSelector] = useState<string | number | null>(null);

  // Sync state with localStorage
  const loadSyncState = () => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(getRoleKey('saved_tools')) || '[]');
      const colls = JSON.parse(localStorage.getItem(getRoleKey('collections')) || '[]');
      setSavedToolIds(saved);
      setCollections(colls);
    }
  };

  useEffect(() => {
    loadSyncState();
    window.addEventListener(SYNC_EVENT, loadSyncState);
    return () => window.removeEventListener(SYNC_EVENT, loadSyncState);
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    await loadCategories((data) => {
      setCategories(data);
      setCategoriesLoading(false);
    });
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      await loadAdminTools((tools) => { setAdminTools(tools as Tool[]); if (tools.length > 0) setLoading(false); }, token);

      const cachedUserTools = localStorage.getItem('offline_registry_data');
      if (cachedUserTools) {
        try { setUserTools(JSON.parse(cachedUserTools)); setLoading(false); } catch(e) {}
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const userData = await userRes.json();
      if (userData.tools) {
        setUserTools(userData.tools);
        localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools));
      }
    } catch (err) {
      console.error('Fetch Tools Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTools();

    // Listen for real-time data updates from the server
    socket.on('refresh_matrix', fetchTools);
    return () => {
      socket.off('refresh_matrix', fetchTools);
    };
  }, []);

  // Compute selected active registry dynamically
  const tools = useMemo(() => {
    const merged = [...adminTools, ...userTools];
    // Sort alphabetically by name
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [adminTools, userTools]);

  const deferredSearchQuery = React.useDeferredValue(searchQuery);

  // Filter tools alphabetically, search queries, and selected parameters
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(deferredSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category_name === selectedCategory;

      const pricingClean = (tool.pricing_model || 'free').toLowerCase();
      const matchesPricing = selectedPricing === 'all' ||
        (selectedPricing === 'free' && pricingClean === 'free') ||
        (selectedPricing === 'freemium' && pricingClean === 'freemium') ||
        (selectedPricing === 'paid' && (pricingClean === 'paid' || pricingClean === 'premium' || pricingClean === 'enterprise'));

      return matchesSearch && matchesCategory && matchesPricing;
    });
  }, [tools, deferredSearchQuery, selectedCategory, selectedPricing]);

  // Prevent UI hanging by limiting rendering to 50 tools at a time
  const [displayLimit, setDisplayLimit] = useState(50);
  
  // Reset limit when filter changes
  useEffect(() => {
    setDisplayLimit(50);
  }, [searchQuery, selectedCategory, selectedPricing]);

  const displayedTools = useMemo(() => {
    return filteredTools.slice(0, displayLimit);
  }, [filteredTools, displayLimit]);

  const categoryCountMap = useMemo(
    () => buildCategoryCountMap(categories, tools.length),
    [categories, tools.length]
  );

  const pricingCounts = useMemo(() => buildPricingCounts(tools), [tools]);

  const pricingOptions = useMemo(() => [
    { id: 'all', label: 'All Pricing', count: pricingCounts.all },
    { id: 'free', label: '🟢 Free', count: pricingCounts.free },
    { id: 'freemium', label: '🔵 Freemium', count: pricingCounts.freemium },
    { id: 'paid', label: '🟠 Paid', count: pricingCounts.paid },
  ], [pricingCounts]);

  const handleToggleSave = (toolId: string | number) => {
    let updated = [...savedToolIds];
    if (updated.includes(toolId)) {
      updated = updated.filter(id => id !== toolId);
    } else {
      updated.push(toolId);
    }
    localStorage.setItem(getRoleKey('saved_tools'), JSON.stringify(updated));
    setSavedToolIds(updated);
    triggerSync();
  };

  const handleToggleCollection = (collectionId: string, toolId: string | number) => {
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        const alreadyHas = c.toolIds.includes(toolId);
        return {
          ...c,
          toolIds: alreadyHas
            ? c.toolIds.filter(id => id !== toolId)
            : [...c.toolIds, toolId]
        };
      }
      return c;
    });
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    triggerSync();
  };

  return (
    <motion.div layout className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">

      <SandboxViewer
        open={!!sandboxTool}
        url={sandboxTool?.url}
        title={sandboxTool?.name}
        onClose={() => setSandboxTool(null)}
      />

      {/* ── Sticky Header & Filter Area ── */}
      <div className="sticky top-0 z-[100] bg-black shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] pt-4 pb-2 mb-6 border-b border-[var(--border)]">
        {/* ── Header ── */}
        <PremiumHeader
          badge="🔍 AI TOOLS REGISTRY"
          title="Search AI Tools"
          subtitle="Browse, filter and discover AI tools from the full intelligence registry."
          count={`${filteredTools.length} / ${tools.length}`}
          icon={Search}
          accentClass="text-[var(--neon)]"
          badgeBg="bg-[var(--neon)]/10"
          badgeBorder="border-[var(--neon)]/20"
        />

        {/* ── Filter Toolbar (Desktop Only) ── */}
        <div className="hidden lg:block">
          <PremiumFilterBar>
          <PremiumSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tools by name or description..."
          />

          {/* Category Dropdown */}
          <div className="relative flex-1 lg:flex-none lg:w-52 z-[999]">
            <button
              onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsPricingDropdownOpen(false); }}
              className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] rounded-2xl h-[46px] px-4 text-[12px] font-bold focus:outline-none focus:border-[var(--neon)] cursor-pointer w-full flex items-center justify-between transition-all gap-2 hover:bg-[var(--card-bg)] hover:border-[var(--border2)] shadow-sm"
            >
              <span className="truncate uppercase tracking-widest text-[10px] font-mono">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">
                  {selectedCategory === 'all' ? categoryCountMap.__all__ : (categoryCountMap[selectedCategory] ?? 0)}
                </span>
                <ChevronDown size={13} className={`text-[var(--muted)] transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[990]" onClick={() => setIsCategoryDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="absolute top-full left-0 right-0 min-w-[14rem] bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl mt-2 p-2 z-[1000] shadow-2xl backdrop-blur-xl max-h-64 overflow-y-auto no-scrollbar space-y-0.5"
                  >
                    <button onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedCategory === 'all' ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}>
                      <span>All Categories</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">{categoryCountMap.__all__}</span>
                    </button>
                    {categoriesLoading && categories.length === 0 ? (
                      <p className="text-[10px] font-bold text-[var(--muted2)] text-center py-3 uppercase tracking-widest font-mono">Loading…</p>
                    ) : categories.map((cat: any) => {
                      const count = categoryCountMap[cat.name] ?? cat.toolsCount ?? 0;
                      return (
                        <button key={cat.id} onClick={() => { setSelectedCategory(cat.name); setIsCategoryDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedCategory === cat.name ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}>
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)] shrink-0 ml-2">{count}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Dropdown */}
          <div className="relative flex-1 lg:flex-none lg:w-44 z-[999]">
            <button
              onClick={() => { setIsPricingDropdownOpen(!isPricingDropdownOpen); setIsCategoryDropdownOpen(false); }}
              className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] rounded-2xl h-[46px] px-4 text-[12px] font-bold focus:outline-none focus:border-[var(--neon)] cursor-pointer w-full flex items-center justify-between transition-all gap-2 hover:bg-[var(--card-bg)] hover:border-[var(--border2)] shadow-sm"
            >
              <span className="uppercase tracking-widest text-[10px] font-mono">
                {selectedPricing === 'all' ? 'All Pricing' : selectedPricing === 'paid' ? 'Paid' : selectedPricing.charAt(0).toUpperCase() + selectedPricing.slice(1)}
              </span>
              <ChevronDown size={13} className={`text-[var(--muted)] transition-transform duration-200 shrink-0 ${isPricingDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isPricingDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[990]" onClick={() => setIsPricingDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="absolute top-full left-0 right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl mt-2 p-2 z-[1000] shadow-2xl backdrop-blur-xl space-y-0.5"
                  >
                    {pricingOptions.map(opt => (
                      <button key={opt.id} onClick={() => { setSelectedPricing(opt.id); setIsPricingDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedPricing === opt.id ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}>
                        <span>{opt.label}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">{opt.count}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </PremiumFilterBar>
      </div>

      {/* ── Filter Toolbar (Mobile/Tablet Only) ── */}
      <div className="flex lg:hidden w-full gap-3 items-center">
        <PremiumSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tools..."
        />
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className={`px-4 h-[46px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border flex items-center justify-center gap-1.5 shrink-0 ${
            selectedCategory !== 'all' || selectedPricing !== 'all'
              ? 'bg-[var(--neon)]/10 border-[var(--neon)]/30 text-[var(--neon)]'
              : 'bg-[var(--input-bg)] border border-[var(--border)] text-[var(--muted2)] hover:border-[var(--border2)] hover:text-[var(--text)] shadow-sm'
          }`}
        >
          <Filter size={14} />
          <span>Filter</span>
          {(selectedCategory !== 'all' || selectedPricing !== 'all') && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
          )}
        </button>
      </div>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[var(--card-bg)] border-t border-[var(--border)] rounded-t-[28px] z-[9995] flex flex-col shadow-2xl p-6 overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-5">
                <div className="flex items-center gap-2">
                  <Filter className="text-[var(--neon)] w-5 h-5" />
                  <h3 className="font-royal text-[16px] font-black uppercase text-[var(--text)]">Filter Tools</h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-xl border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-6 flex-grow">
                {/* Category Selector */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Category</span>
                  <div className="relative">
                    <button
                      onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsPricingDropdownOpen(false); }}
                      className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] rounded-2xl h-[46px] px-4 text-[12px] font-bold focus:outline-none cursor-pointer w-full flex items-center justify-between transition-all gap-2"
                    >
                      <span className="truncate uppercase tracking-widest text-[10px] font-mono">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
                      <ChevronDown size={13} className={`text-[var(--muted)] transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCategoryDropdownOpen && (
                      <div className="border border-[var(--border)] bg-[var(--bg)] rounded-2xl mt-2 p-2 max-h-48 overflow-y-auto no-scrollbar space-y-0.5">
                        <button
                          onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedCategory === 'all' ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}
                        >
                          <span>All Categories</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">{tools.length}</span>
                        </button>
                        {categories.map((cat: any) => {
                          const count = tools.filter(t => t.category_name === cat.name).length;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => { setSelectedCategory(cat.name); setIsCategoryDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedCategory === cat.name ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}
                            >
                              <span className="truncate">{cat.name}</span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)] shrink-0 ml-2">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Selector */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">Pricing</span>
                  <div className="relative">
                    <button
                      onClick={() => { setIsPricingDropdownOpen(!isPricingDropdownOpen); setIsCategoryDropdownOpen(false); }}
                      className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] rounded-2xl h-[46px] px-4 text-[12px] font-bold focus:outline-none cursor-pointer w-full flex items-center justify-between transition-all gap-2"
                    >
                      <span className="uppercase tracking-widest text-[10px] font-mono">
                        {selectedPricing === 'all' ? 'All Pricing' : selectedPricing === 'paid' ? 'Paid' : selectedPricing.charAt(0).toUpperCase() + selectedPricing.slice(1)}
                      </span>
                      <ChevronDown size={13} className={`text-[var(--muted)] transition-transform duration-200 shrink-0 ${isPricingDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPricingDropdownOpen && (
                      <div className="border border-[var(--border)] bg-[var(--bg)] rounded-2xl mt-2 p-2 space-y-0.5">
                        {pricingOptions.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => { setSelectedPricing(opt.id); setIsPricingDropdownOpen(false); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedPricing === opt.id ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}
                          >
                            <span>{opt.label}</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">{opt.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPricing('all');
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg)] text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-all font-mono cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[var(--neon)] hover:opacity-90 text-black text-[10px] font-black uppercase tracking-widest font-mono transition-all text-center cursor-pointer font-bold"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Grid ── */}
      <div className="pt-2 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredTools.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No tools found"
            subtitle="Try adjusting your search query or filter criteria to discover matching AI tools."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {displayedTools.map((tool, idx) => (
              <PremiumToolCard
                key={tool.id}
                tool={tool}
                idx={idx}
                isSaved={savedToolIds.includes(tool.id)}
                collections={collections}
                activeCollectionSelector={activeCollectionSelector}
                onViewDetails={onViewDetails}
                onToggleSave={handleToggleSave}
                onToggleCollection={handleToggleCollection}
                onSetActiveSelector={setActiveCollectionSelector}
                isSelectedForCompare={selectedCompareIds.includes(String(tool.id))}
                onToggleCompare={handleToggleCompare}
                onLaunchSandbox={setSandboxTool}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredTools.length > displayLimit && (
          <div className="flex justify-center mt-8 pb-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDisplayLimit(prev => prev + 50)}
              className="px-8 py-3 bg-[var(--card-bg)] hover:bg-[var(--neon)] text-[var(--neon)] hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest font-mono border border-[var(--border)] hover:border-[var(--neon)] transition-all cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(var(--particle-rgb),0.25)] flex items-center gap-2"
            >
              <Plus size={14} className="stroke-[3]" />
              Load More Tools ({filteredTools.length - displayLimit} remaining)
            </motion.button>
          </div>
        )}
      </div>

      {/* Floating Compare Action Bar */}
      <AnimatePresence>
        {selectedCompareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[5000] px-5 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border2)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text)] leading-none">Comparison Queue</span>
                <span className="text-[9px] font-bold text-[var(--muted)] tracking-widest uppercase mt-1 leading-none">{selectedCompareIds.length} / 4 Selected</span>
              </div>
            </div>
            <div className="w-px h-8 bg-[var(--border2)] mx-2" />
            <button
              onClick={() => {
                if (selectedCompareIds.length >= 2 && onCompareTools) {
                  onCompareTools(selectedCompareIds);
                  setSelectedCompareIds([]);
                }
              }}
              disabled={selectedCompareIds.length < 2}
              className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400"
            >
              Compare Selected
            </button>
            <button
              onClick={() => setSelectedCompareIds([])}
              className="p-2.5 rounded-xl border border-[var(--border2)] text-[var(--muted2)] hover:text-white hover:bg-[var(--bg2)] cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- NEW PREMIUM LIST CARD ---
const EntityListCard = ({
  entity,
  tools,
  idx,
  onClick,
  isCat = false
}: {
  entity: any;
  tools: Tool[];
  idx: number;
  onClick: () => void;
  isCat?: boolean;
}) => {
  const accents = ['--neon', '--emerald', '--mint'];
  const accentVar = accents[idx % accents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.05 }}
      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl flex flex-col hover:border-[var(--border2)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, var(${accentVar}), transparent)` }} />
      
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pb-4 border-b border-[var(--border)]/50 relative z-10 shrink-0">
        <div className="w-12 h-12 rounded-[14px] border flex items-center justify-center text-2xl shrink-0 shadow-sm"
          style={{
            background: `color-mix(in srgb, var(${accentVar}) 10%, transparent)`,
            borderColor: `color-mix(in srgb, var(${accentVar}) 25%, transparent)`
          }}>
          {entity.icon || (isCat ? '📦' : '📁')}
        </div>
        <div className="min-w-0">
          <h4 className="text-[16px] font-extrabold tracking-tight leading-tight text-[var(--text)] font-sans truncate pr-2">
            {entity.name}
          </h4>
          <p className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-1 font-mono">
            {tools.length} Tools
          </p>
        </div>
      </div>

      {/* List Body */}
      <div className="px-5 py-3 space-y-3 relative z-10 grow">
        {tools.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <span className="text-4xl mb-2">🔭</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] font-mono">No tools indexed</p>
          </div>
        )}
        {tools.slice(0, 10).map((tool, i) => {
          const domain = (() => {
            if (!tool.url) return '';
            try { return new URL(tool.url.startsWith('http') ? tool.url : `https://${tool.url}`).hostname; }
            catch (e) { return tool.url; }
          })();

          const pricingClean = (tool.pricing_model || 'free').toLowerCase();
          const pricingIcon = pricingClean === 'free' ? 'F' : pricingClean === 'freemium' ? 'FM' : 'P';
          const pricingColor = pricingClean === 'free' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                               pricingClean === 'freemium' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 
                               'text-orange-400 bg-orange-500/10 border-orange-500/20';

          return (
            <div key={tool.id} className="flex items-center gap-3 group/row py-1 border-b border-[var(--border)]/30 last:border-0">
              <span className="text-[12px] font-bold text-[var(--muted2)] w-4 text-right font-mono">{i + 1}.</span>
              <div className="w-7 h-7 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                {domain ? (
                  <img src={`https://icon.horse/icon/${domain}`} alt="" className="w-full h-full object-contain p-1" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                ) : null}
                <Globe className={`w-3.5 h-3.5 ${domain ? 'hidden' : ''} text-[var(--muted)]`} />
              </div>
              <span className="text-[14px] font-bold text-[var(--text)] truncate flex-1 font-sans group-hover/row:text-[var(--neon)] transition-colors cursor-pointer" onClick={onClick}>
                {tool.name}
              </span>
              <span className={`text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border ${pricingColor} cursor-help`} title={tool.pricing_model || 'Free'}>
                {pricingIcon}
              </span>
              {tool.url && (
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--neon)] transition-colors p-1 bg-[var(--input-bg)] rounded-md border border-[var(--border)] hover:border-[var(--neon)]" onClick={e => e.stopPropagation()}>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--input-bg)]/40 mt-auto relative z-10 shrink-0">
        <button
          onClick={onClick}
          className="w-full py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-[var(--text)] hover:text-[var(--bg)] transition-all cursor-pointer shadow-sm hover:shadow-md font-mono flex items-center justify-center gap-2 group/btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `var(${accentVar})`;
            e.currentTarget.style.borderColor = `var(${accentVar})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.borderColor = '';
          }}
        >
          {`Explore ${entity.name}`} ({entity.toolsCount || tools.length})
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

// --- NEW PREMIUM CATEGORY HEADER ---
const PremiumCategoryHeader = ({
  icon,
  title,
  subtitle,
  toolsCount,
  onBack
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  toolsCount: number;
  onBack?: () => void;
}) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[2rem] p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl mb-8 mx-1 mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--neon)]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--emerald)]/10 blur-[80px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4" />

      {/* Back Button (Top Left) */}
      {onBack && (
        <button 
          onClick={onBack} 
          className="absolute top-5 left-5 sm:top-6 sm:left-6 p-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--muted2)] hover:text-white hover:border-[var(--neon)] hover:bg-[var(--neon)]/10 transition-all cursor-pointer shadow-sm z-20"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Left Content */}
      <div className="flex items-center gap-6 sm:gap-8 relative z-10 w-full md:w-auto flex-col sm:flex-row text-center sm:text-left mt-4 sm:mt-0">
        {/* Large Icon Box */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-[var(--input-bg)] border border-[var(--border)] shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-4xl sm:text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
            {icon}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1 flex flex-col items-center sm:items-start">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--muted)] font-mono shadow-sm backdrop-blur-md">
              BEST AI TOOLS FOR
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text)] tracking-tight mb-3 font-sans" style={{ textShadow: '0 4px 20px var(--neon-glow, rgba(0,0,0,0.05))' }}>
            {title}
          </h1>
          <p className="text-[13px] sm:text-[15px] font-medium text-[var(--muted2)] leading-relaxed max-w-xl font-sans mb-5">
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-bold text-[var(--muted2)] hover:text-white hover:border-[var(--border2)] transition-colors cursor-default font-mono">UPDATE {new Date().getFullYear()}</span>
            <span className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-bold text-[var(--muted2)] hover:text-white hover:border-[var(--border2)] transition-colors cursor-default font-mono">#Prompts & Aids</span>
            <span className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[10px] font-bold text-[var(--muted2)] hover:text-white hover:border-[var(--border2)] transition-colors cursor-default font-mono">#Productivity</span>
          </div>
        </div>
      </div>

      {/* Right Stats Stack */}
      <div className="flex flex-col gap-2.5 w-full md:w-56 shrink-0 relative z-10">
        <div className="flex items-center gap-4 bg-[var(--input-bg)] border border-[var(--border)] rounded-[1.25rem] p-4 shadow-sm hover:border-[var(--border2)] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <div className="text-[15px] font-black text-[var(--text)] font-sans">{toolsCount}</div>
            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted2)] mt-0.5 font-mono">AI TOOLS</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--input-bg)] border border-[var(--border)] rounded-[1.25rem] p-4 shadow-sm hover:border-[var(--border2)] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
          <div>
            <div className="text-[14px] font-black text-[var(--text)] font-sans">Free & Paid</div>
            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted2)] mt-0.5 font-mono">PRICING</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[var(--input-bg)] border border-[var(--border)] rounded-[1.25rem] p-4 shadow-sm hover:border-[var(--border2)] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[var(--neon)]/10 text-[var(--neon)] flex items-center justify-center shrink-0">
            <Shield size={18} />
          </div>
          <div>
            <div className="text-[14px] font-black text-[var(--text)] font-sans">Verified</div>
            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted2)] mt-0.5 font-mono">SELECTION</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- EXPLORE CATEGORIES VIEW ---
export const ExploreCategories = ({ onExploreCategory }: { onExploreCategory: (categoryName: string) => void }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);
  const [loadingTools, setLoadingTools] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const initData = () => {
    setLoadingTaxonomy(true);
    setLoadingTools(true);
    
    loadCategories((data) => { 
      setCategories(data); 
      if (data.length > 0) setLoadingTaxonomy(false); 
    });

    loadAdminTools((data) => {
      setTools(data as Tool[]);
      if (data.length > 0) setLoadingTools(false);
    }, localStorage.getItem('session_token'));
  };

  useEffect(() => {
    initData();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toolsByCategory = useMemo(() => buildToolsByCategory(tools), [tools]);
  const loading = loadingTaxonomy && categories.length === 0;

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col font-sans text-left bg-[var(--bg)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Header ── */}
      <PremiumHeader
        badge="🗂️ CATEGORY_MATRIX"
        title="Explore Categories"
        subtitle="Dive into specific AI tool categories across all functional sectors."
        count={`${filteredCategories.length} / ${categories.length}`}
        icon={Layers}
        accentClass="text-[var(--mint)]"
        badgeBg="bg-[var(--mint)]/10"
        badgeBorder="border-[var(--mint)]/20"
      />

      {/* ── Filter Toolbar ── */}
      <PremiumFilterBar>
        <PremiumSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search category matrix..."
          accentColor="var(--mint)"
        />
      </PremiumFilterBar>

      {/* Grid Container */}
      <div className="pt-2 px-1 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredCategories.length === 0 ? (
          <EmptyState icon={Layers} title="No matching categories found" subtitle="Adjust your search query to explore other domains." accentClass="text-[var(--mint)]" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredCategories.map((cat, idx) => {
              const catTools = toolsByCategory.get(cat.name) || [];
              const entityWithCount = { ...cat, toolsCount: cat.toolsCount || catTools.length };
              return (
                <EntityListCard 
                  key={cat.id} 
                  entity={entityWithCount} 
                  tools={catTools as Tool[]} 
                  idx={idx} 
                  onClick={() => onExploreCategory(cat.name)} 
                  isCat 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};


// --- CATEGORY TOOLS VIEW (Hierarchical Drill-down) ---
export const CategoryToolsView = ({
  categoryName,
  onBack,
  onViewDetails,
}: {
  categoryName: string;
  onBack: () => void;
  onViewDetails: (id: string | number) => void;
}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedToolIds, setSavedToolIds] = useState<(string | number)[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionSelector, setActiveCollectionSelector] = useState<string | number | null>(null);
  const [sandboxTool, setSandboxTool] = useState<Tool | null>(null);

  // Drilldown state
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedMicroCategory, setSelectedMicroCategory] = useState<string | null>(null);

  const loadSyncState = () => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(getRoleKey('saved_tools')) || '[]');
      const colls = JSON.parse(localStorage.getItem(getRoleKey('collections')) || '[]');
      setSavedToolIds(saved);
      setCollections(colls);
    }
  };

  useEffect(() => {
    loadSyncState();
    setLoading(true);
    const token = localStorage.getItem('session_token');
    
    let adminT: Tool[] = [];
    let userT: Tool[] = [];

    const loadUserTools = async () => {
      const cachedUserTools = localStorage.getItem('offline_registry_data');
      if (cachedUserTools) {
        try { userT = JSON.parse(cachedUserTools); setTools([...adminT, ...userT]); if (adminT.length > 0 || userT.length > 0) setLoading(false); } catch(e) {}
      }
      try {
        if (typeof navigator !== 'undefined' && !navigator.onLine) throw new Error('Offline');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const userData = await userRes.json();
        if (userData.tools) {
          userT = userData.tools;
          setTools([...adminT, ...userT]);
          localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools));
        }
      } catch (err) {}
    };

    Promise.all([
      new Promise<void>((resolve) => loadCategories((data) => { setCategories(data); resolve(); })),
      new Promise<void>((resolve) => loadAdminTools((data) => { adminT = data as Tool[]; setTools([...adminT, ...userT].sort((a,b) => a.name.localeCompare(b.name))); if (adminT.length > 0 || userT.length > 0) setLoading(false); resolve(); }, token)),
      loadUserTools()
    ]).finally(() => setLoading(false));

    window.addEventListener(SYNC_EVENT, loadSyncState);
    return () => window.removeEventListener(SYNC_EVENT, loadSyncState);
  }, [categoryName]);

  const category = useMemo(
    () => categories.find((c) => c.name === categoryName || c.id === categoryName),
    [categories, categoryName]
  );

  const categoryTools = useMemo(
    () => tools.filter((t) => t.category_name === categoryName || (category && (t.category_name === category.name || (t as any).category_id === category.id))),
    [tools, categoryName, category]
  );

  const uniqueSubCategories = useMemo(() => {
    const subs = new Set<string>();
    categoryTools.forEach(t => { if (t.sub_category) subs.add(t.sub_category); });
    return Array.from(subs).sort();
  }, [categoryTools]);

  const uniqueMicroCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    const micros = new Set<string>();
    categoryTools.forEach(t => {
      if (t.sub_category === selectedSubCategory && t.micro_category) micros.add(t.micro_category);
    });
    return Array.from(micros).sort();
  }, [categoryTools, selectedSubCategory]);

  const finalToolsToDisplay = useMemo(() => {
    let base = categoryTools;
    if (selectedSubCategory) {
      base = base.filter(t => t.sub_category === selectedSubCategory);
      if (selectedMicroCategory) {
        base = base.filter(t => t.micro_category === selectedMicroCategory);
      }
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (t) => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
    );
  }, [categoryTools, selectedSubCategory, selectedMicroCategory, searchQuery]);

  const handleToggleSave = (toolId: string | number) => {
    let updated = [...savedToolIds];
    if (updated.includes(toolId)) updated = updated.filter((id) => id !== toolId);
    else updated.push(toolId);
    localStorage.setItem(getRoleKey('saved_tools'), JSON.stringify(updated));
    setSavedToolIds(updated);
    triggerSync();
  };

  const handleToggleCollection = (collectionId: string, toolId: string | number) => {
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        const exists = c.toolIds.includes(toolId);
        return { ...c, toolIds: exists ? c.toolIds.filter((id) => id !== toolId) : [...c.toolIds, toolId] };
      }
      return c;
    });
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    triggerSync();
  };

  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest font-mono flex-wrap">
        <button onClick={onBack} className="text-[var(--muted)] hover:text-[var(--neon)] transition-colors inline-flex items-center gap-1 shrink-0 bg-[var(--input-bg)] border border-[var(--border)] px-2 py-1 rounded-md">
          <ChevronLeft size={12} /> Categories
        </button>
        <span className="text-[var(--muted2)]">/</span>
        <button onClick={() => { setSelectedSubCategory(null); setSelectedMicroCategory(null); }} className={`transition-colors shrink-0 bg-[var(--input-bg)] border border-[var(--border)] px-2 py-1 rounded-md ${!selectedSubCategory ? 'text-[var(--mint)] border-[var(--mint)]/30' : 'text-[var(--muted)] hover:text-[var(--neon)]'}`}>
          {categoryName}
        </button>
        {selectedSubCategory && (
          <>
            <span className="text-[var(--muted2)]">/</span>
            <button onClick={() => setSelectedMicroCategory(null)} className={`transition-colors shrink-0 bg-[var(--input-bg)] border border-[var(--border)] px-2 py-1 rounded-md ${!selectedMicroCategory ? 'text-[var(--mint)] border-[var(--mint)]/30' : 'text-[var(--muted)] hover:text-[var(--neon)]'}`}>
              {selectedSubCategory}
            </button>
          </>
        )}
        {selectedMicroCategory && (
          <>
            <span className="text-[var(--muted2)]">/</span>
            <span className="text-[var(--mint)] shrink-0 bg-[var(--input-bg)] border border-[var(--mint)]/30 px-2 py-1 rounded-md">{selectedMicroCategory}</span>
          </>
        )}
      </div>
    );
  };

  const currentLevel = selectedMicroCategory ? 'tools' : selectedSubCategory ? (uniqueMicroCategories.length > 0 ? 'micros' : 'tools') : (uniqueSubCategories.length > 0 ? 'subs' : 'tools');
  const currentTitle = selectedMicroCategory || selectedSubCategory || categoryName;

  return (
    <div className="relative w-full h-full overflow-y-auto no-scrollbar flex flex-col font-sans pr-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SandboxViewer open={!!sandboxTool} url={sandboxTool?.url} title={sandboxTool?.name} onClose={() => setSandboxTool(null)} />

      <div className="flex-none">
        {renderBreadcrumbs()}
      </div>

      <PremiumHeader
        badge={`${category?.icon || '📦'} ${currentTitle.toUpperCase()} LEVEL`}
        title={currentTitle}
        subtitle={`Exploring items in ${currentTitle}`}
        count={currentLevel === 'tools' || searchQuery ? `${finalToolsToDisplay.length} Tools` : currentLevel === 'subs' ? `${uniqueSubCategories.length} Sub Categories` : `${uniqueMicroCategories.length} Micro Categories`}
        icon={Folder}
        accentClass="text-[var(--mint)]"
        badgeBg="bg-[var(--mint)]/10"
        badgeBorder="border-[var(--mint)]/20"
      >
        <div className="flex items-center gap-2 bg-[var(--mint)]/10 border border-[var(--mint)]/20 rounded-2xl px-3 py-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--mint)] animate-pulse" />
          <span className="text-[9px] font-black text-[var(--mint)] uppercase tracking-widest leading-none font-mono">FOCUSED</span>
        </div>
      </PremiumHeader>

      <PremiumFilterBar>
        <PremiumSearch value={searchQuery} onChange={setSearchQuery} placeholder={`Search within ${currentTitle}...`} accentColor="var(--mint)" />
      </PremiumFilterBar>

      <div className="pt-2 px-1 pb-28">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : currentLevel === 'subs' && !searchQuery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-6">
            {uniqueSubCategories.map((sub, idx) => {
              const subTools = categoryTools.filter(t => t.sub_category === sub);
              return (
                <EntityListCard key={sub} entity={{ name: sub, description: `${subTools.length} tools available in ${sub}`, toolsCount: subTools.length }} tools={subTools} idx={idx} onClick={() => setSelectedSubCategory(sub)} isCat />
              );
            })}
          </div>
        ) : currentLevel === 'micros' && !searchQuery ? (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-6">
             {uniqueMicroCategories.map((micro, idx) => {
               const microTools = categoryTools.filter(t => t.sub_category === selectedSubCategory && t.micro_category === micro);
               return (
                 <EntityListCard key={micro} entity={{ name: micro, description: `${microTools.length} tools in ${micro}`, toolsCount: microTools.length }} tools={microTools} idx={idx} onClick={() => setSelectedMicroCategory(micro)} isCat />
               );
             })}
           </div>
        ) : finalToolsToDisplay.length === 0 ? (
          <EmptyState icon={Folder} title={searchQuery ? 'No matching tools found' : `No tools indexed in ${currentTitle}`} subtitle={searchQuery ? 'Adjust your search query.' : 'This level does not currently contain any tools.'} accentClass="text-[var(--mint)]" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pb-6">
            {finalToolsToDisplay.map((tool, idx) => (
              <PremiumToolCard key={tool.id} tool={tool} idx={idx} isSaved={savedToolIds.includes(tool.id)} collections={collections} activeCollectionSelector={activeCollectionSelector} onViewDetails={onViewDetails} onToggleSave={handleToggleSave} onToggleCollection={handleToggleCollection} onSetActiveSelector={setActiveCollectionSelector} onLaunchSandbox={setSandboxTool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// --- 3. SAVED TOOLS VIEW ---
export const SavedTools = ({ onViewDetails }: { onViewDetails: (id: string | number) => void }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [savedToolIds, setSavedToolIds] = useState<(string | number)[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionSelector, setActiveCollectionSelector] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSavedState = () => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(getRoleKey('saved_tools')) || '[]');
      const colls = JSON.parse(localStorage.getItem(getRoleKey('collections')) || '[]');
      setSavedToolIds(saved);
      setCollections(colls);
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      let adminT: Tool[] = [];
      let userT: Tool[] = [];

      await loadAdminTools((data) => { adminT = data as Tool[]; setTools([...adminT, ...userT]); if (adminT.length > 0) setLoading(false); }, token);

      const cachedUserTools = localStorage.getItem('offline_registry_data');
      if (cachedUserTools) {
        try { userT = JSON.parse(cachedUserTools); setTools([...adminT, ...userT]); if (adminT.length > 0 || userT.length > 0) setLoading(false); } catch(e) {}
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const userData = await userRes.json();
      if (userData.tools) {
        userT = userData.tools;
        setTools([...adminT, ...userT]);
        localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools));
      }
    } catch (err) {
      console.error('Fetch Tools Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedState();
    fetchTools();
    window.addEventListener(SYNC_EVENT, loadSavedState);
    return () => window.removeEventListener(SYNC_EVENT, loadSavedState);
  }, []);

  const savedToolsList = useMemo(() => {
    return tools.filter(t => savedToolIds.includes(t.id) && (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [tools, savedToolIds, searchQuery]);

  const handleRemove = (toolId: string | number) => {
    const updated = savedToolIds.filter(id => id !== toolId);
    localStorage.setItem(getRoleKey('saved_tools'), JSON.stringify(updated));
    setSavedToolIds(updated);
    triggerSync();
  };

  const handleToggleCollection = (collectionId: string, toolId: string | number) => {
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        const exists = c.toolIds.includes(toolId);
        const updatedToolIds = exists
          ? c.toolIds.filter(id => id !== toolId)
          : [...c.toolIds, toolId];
        return { ...c, toolIds: updatedToolIds };
      }
      return c;
    });
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    triggerSync();
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden font-sans pr-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PremiumHeader
        badge="📌 BOOKMARKS"
        title="Saved Intelligence"
        subtitle="Your curated bookmarks of high-value AI tools and resources."
        count={`${savedToolsList.length} / ${tools.filter(t => savedToolIds.includes(t.id)).length}`}
        icon={Bookmark}
        accentClass="text-[var(--neon)]"
        badgeBg="bg-[var(--neon)]/10"
        badgeBorder="border-[var(--neon)]/20"
      />

      <PremiumFilterBar>
        <PremiumSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search bookmarked tools..."
        />
      </PremiumFilterBar>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-2 px-1 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : savedToolsList.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved tools yet"
            subtitle="Visit the Search directory and bookmark AI tools to build your collection."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {savedToolsList.map((tool, idx) => (
              <PremiumToolCard
                key={tool.id}
                tool={tool}
                idx={idx}
                isSaved={true}
                collections={collections}
                activeCollectionSelector={activeCollectionSelector}
                onViewDetails={onViewDetails}
                onToggleSave={handleRemove}
                onToggleCollection={handleToggleCollection}
                onSetActiveSelector={setActiveCollectionSelector}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 4. MY COLLECTIONS VIEW ---
export const MyCollections = ({ onViewDetails }: { onViewDetails: (id: string | number) => void }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [newCollName, setNewCollName] = useState('');
  const [newCollDesc, setNewCollDesc] = useState('');

  const loadCollections = () => {
    if (typeof window !== 'undefined') {
      const colls = JSON.parse(localStorage.getItem(getRoleKey('collections')) || '[]');
      setCollections(colls);
      if (colls.length > 0 && !activeCollectionId) {
        setActiveCollectionId(colls[0].id);
      }
    }
  };

  const fetchTools = async () => {
    try {
      const token = localStorage.getItem('session_token');
      let adminT: Tool[] = [];
      let userT: Tool[] = [];

      await loadAdminTools((data) => { adminT = data as Tool[]; setTools([...adminT, ...userT]); if (adminT.length > 0) setLoading(false); }, token);

      const cachedUserTools = localStorage.getItem('offline_registry_data');
      if (cachedUserTools) {
        try { userT = JSON.parse(cachedUserTools); setTools([...adminT, ...userT]); if (adminT.length > 0 || userT.length > 0) setLoading(false); } catch(e) {}
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const userData = await userRes.json();
      if (userData.tools) {
        userT = userData.tools;
        setTools([...adminT, ...userT]);
        localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools));
      }
    } catch (err) {
      console.error('Fetch Tools Error:', err);
    }
  };

  useEffect(() => {
    loadCollections();
    fetchTools();
    window.addEventListener(SYNC_EVENT, loadCollections);
    return () => window.removeEventListener(SYNC_EVENT, loadCollections);
  }, []);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollName.trim()) return;

    const newCollection: Collection = {
      id: `coll-${Date.now()}`,
      name: newCollName.trim(),
      description: newCollDesc.trim(),
      toolIds: []
    };

    const updated = [...collections, newCollection];
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    setActiveCollectionId(newCollection.id);
    setIsCreating(false);
    setNewCollName('');
    setNewCollDesc('');
    triggerSync();
  };

  const handleDeleteCollection = (id: string) => {
    const updated = collections.filter(c => c.id !== id);
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    if (activeCollectionId === id) {
      setActiveCollectionId(updated.length > 0 ? updated[0].id : null);
    }
    triggerSync();
  };

  const handleRemoveToolFromCollection = (collId: string, toolId: string | number) => {
    const updated = collections.map(c => {
      if (c.id === collId) {
        return {
          ...c,
          toolIds: c.toolIds.filter(id => id !== toolId)
        };
      }
      return c;
    });
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    triggerSync();
  };

  const filteredCollections = useMemo(() => {
    return collections.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

  const activeCollection = collections.find(c => c.id === activeCollectionId);
  const activeTools = useMemo(() => {
    if (!activeCollection) return [];
    return tools.filter(t => activeCollection.toolIds.includes(t.id));
  }, [tools, activeCollection]);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden font-sans pr-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex-none">
        <PremiumHeader
          badge="📁 WORKSPACE MATRICES"
          title="My Collections"
          subtitle="Organize and manage your custom intelligence matrix catalog collections."
          count={`${collections.length} Collections`}
          icon={Folder}
          accentClass="text-[var(--neon)]"
          badgeBg="bg-[var(--neon)]/10"
          badgeBorder="border-[var(--neon)]/20"
        />

        {/* ── Filter & Action Toolbar ── */}
        <PremiumFilterBar>
          <PremiumSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search collections..."
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 h-[46px] bg-[var(--neon)] text-black text-[10px] font-black uppercase tracking-widest font-mono rounded-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(var(--particle-rgb),0.25)] shrink-0 hover:shadow-[0_0_30px_rgba(var(--particle-rgb),0.4)]"
          >
            <Plus size={14} className="stroke-[3]" />
            New Collection
          </motion.button>
        </PremiumFilterBar>
      </div>

      {/* Scrollable Container for Collections & Tools */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {collections.length === 0 ? (
          <div className="col-span-full flex-1 overflow-hidden pt-2 px-1 pb-12">
            <EmptyState
              icon={Folder}
              title="No collections created yet"
              subtitle='Click "New Collection" to organize your AI tools into themed groups.'
            />
          </div>
        ) : (
          <>
            {/* Folders List (Left Side) — File Manager Style */}
            <div className="xl:col-span-4 flex flex-col overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] font-mono px-1 mb-3 flex-none">
                📁 {filteredCollections.length} Collection{filteredCollections.length !== 1 ? 's' : ''}
              </p>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {filteredCollections.map((c, idx) => {
                  const isActive = activeCollectionId === c.id;
                  const folderAccents = ['--neon', '--emerald', '--mint'];
                  const accentVar = folderAccents[idx % folderAccents.length];
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      onClick={() => setActiveCollectionId(c.id)}
                      className={`p-4 bg-[var(--card-bg)] border rounded-[20px] transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden shadow-sm ${isActive
                        ? 'border-[var(--neon)] shadow-[0_0_20px_rgba(var(--particle-rgb),0.1)]'
                        : 'border-[var(--border)] hover:border-[var(--border2)] hover:-translate-y-0.5 hover:shadow-md'}`}
                    >
                      {/* Active indicator strip */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]"
                          style={{ background: `var(${accentVar})` }} />
                      )}
                      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: isActive ? `var(${accentVar})` : `linear-gradient(90deg, transparent, var(${accentVar}), transparent)` }} />

                      <div className="flex items-center gap-3.5 min-w-0 z-10 relative pl-1">
                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center border transition-all shrink-0 shadow-sm ${isActive ? '' : 'group-hover:scale-105'}`}
                          style={{
                            background: isActive ? `var(${accentVar})` : `color-mix(in srgb, var(${accentVar}) 10%, transparent)`,
                            borderColor: isActive ? `var(${accentVar})` : `color-mix(in srgb, var(${accentVar}) 30%, transparent)`,
                            color: isActive ? 'black' : `var(${accentVar})`
                          }}>
                          <Folder size={18} className={isActive ? "fill-black" : ""} />
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-[13px] font-black tracking-tight truncate transition-colors ${isActive ? 'text-[var(--neon)]' : 'text-[var(--text)] group-hover:text-[var(--neon)]'}`}>
                            {c.name}
                          </h4>
                          <p className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-0.5 font-mono">
                            {c.toolIds.length} Tool{c.toolIds.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 z-10 relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCollection(c.id); }}
                          className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete Collection"
                        >
                          <Trash2 size={12} />
                        </button>
                        <ChevronRight size={14} className={`transition-transform ${isActive ? 'text-[var(--neon)] rotate-90' : 'text-[var(--muted)] group-hover:text-[var(--neon)]'}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Active Folder Tools list (Right Side) */}
            <div className="xl:col-span-8 flex flex-col overflow-hidden">
              {activeCollection ? (
                <motion.div
                  key={activeCollection.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 flex flex-col overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 relative shadow-xl"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent opacity-30" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--neon)] rounded-full blur-[40px] opacity-[0.04] pointer-events-none" />

                  <div className="flex-none border-b border-[var(--border)] pb-5 relative z-10 mb-6">
                    <h3 className="font-royal text-xl font-black text-[var(--text)] tracking-tight flex items-center gap-2">
                      <span className="text-[var(--neon)]">📁</span>
                      {activeCollection.name}
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--neon)]/10 border border-[var(--neon)]/20 text-[var(--neon)] ml-1">
                        {activeTools.length} tools
                      </span>
                    </h3>
                    <p className="text-[12px] font-medium text-[var(--muted2)] tracking-wide mt-1.5 leading-relaxed">
                      {activeCollection.description || 'No custom description added'}
                    </p>
                  </div>

                  {activeTools.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-16 space-y-2 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-7 h-7 text-[var(--muted2)] opacity-50" />
                      </div>
                      <p className="text-[13px] font-semibold text-[var(--muted)] tracking-wide">Collection is empty</p>
                      <p className="text-[11px] font-medium text-[var(--muted2)] tracking-wide">Go to "Search Assets" and click the folder icon to add tools here.</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {activeTools.map((tool, idx) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between hover:border-[var(--border2)] hover:shadow-md transition-all group/card cursor-pointer"
                          onClick={() => onViewDetails(tool.id)}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-11 h-11 rounded-[14px] bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center text-lg shrink-0 group-hover/card:border-[var(--neon)]/30 group-hover/card:scale-105 transition-all duration-200">
                              {tool.category_icon || '🤖'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-[13px] font-black text-[var(--text)] tracking-tight truncate group-hover/card:text-[var(--neon)] transition-colors">
                                {tool.name}
                              </h4>
                              <p className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest truncate mt-0.5 font-mono">
                                {tool.category_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemoveToolFromCollection(activeCollection.id, tool.id); }}
                              className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all cursor-pointer opacity-0 group-hover/card:opacity-100"
                              title="Remove from Collection"
                            >
                              <FolderMinus size={12} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onViewDetails(tool.id); }}
                              className="p-1.5 bg-[var(--card-bg)] border border-[var(--border)] text-[var(--muted)] group-hover/card:text-[var(--neon)] group-hover/card:border-[var(--neon)] rounded-lg transition-all cursor-pointer"
                              title="View specs"
                            >
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-44 bg-[var(--card-bg)] border border-dashed border-[var(--border2)] rounded-3xl flex flex-col items-center justify-center gap-3 w-full">
                    <BookOpen className="w-8 h-8 text-[var(--muted2)] opacity-40" />
                    <p className="text-[12px] font-medium text-[var(--muted)] tracking-wide">Select a collection to view its tools</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              className="relative w-full max-w-md bg-[var(--card-bg)] border border-[var(--border2)] rounded-[28px] p-8 shadow-2xl z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent rounded-t-[28px]" />

              <div className="flex items-center justify-between border-b border-[var(--border)] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
                    <FolderPlus className="w-5 h-5 text-[var(--neon)]" />
                  </div>
                  <div>
                    <h3 className="font-royal text-[17px] font-black text-[var(--text)] tracking-tight">New Collection</h3>
                    <p className="text-[10px] font-bold text-[var(--muted2)] tracking-widest mt-0.5 font-mono uppercase">Create a custom catalog matrix</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1.5 rounded-xl text-[var(--muted2)] hover:text-[var(--text)] hover:bg-[var(--border)] border border-transparent hover:border-[var(--border2)] transition-all cursor-pointer"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] font-mono">Collection Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Coding Stack"
                    value={newCollName}
                    onChange={(e) => setNewCollName(e.target.value)}
                    required
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl h-[46px] px-4 text-[13px] font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/20 transition-all placeholder:text-[var(--muted2)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] font-mono">Description</label>
                  <textarea
                    placeholder="Describe collection goal..."
                    value={newCollDesc}
                    onChange={(e) => setNewCollDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-4 text-[13px] font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/20 transition-all placeholder:text-[var(--muted2)] resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full h-[48px] bg-[var(--neon)] text-black rounded-xl text-[12px] font-black uppercase tracking-widest font-mono hover:bg-emerald-400 transition-colors cursor-pointer shadow-[0_0_20px_rgba(var(--particle-rgb),0.25)] mt-2"
                >
                  Create Collection
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ExploreTools = ({ onViewDetails }: { onViewDetails: (id: string | number) => void }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedToolIds, setSavedToolIds] = useState<(string | number)[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionSelector, setActiveCollectionSelector] = useState<string | number | null>(null);
  const [sandboxTool, setSandboxTool] = useState<Tool | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const loadSavedState = () => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(getRoleKey('saved_tools')) || '[]');
      const colls = JSON.parse(localStorage.getItem(getRoleKey('collections')) || '[]');
      setSavedToolIds(saved);
      setCollections(colls);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    await loadCategories((data) => {
      setCategories(data);
      setCategoriesLoading(false);
    });
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      let adminT: Tool[] = [];
      let userT: Tool[] = [];

      await loadAdminTools((data) => { adminT = data as Tool[]; setTools([...adminT, ...userT]); if (adminT.length > 0) setLoading(false); }, token);

      const cachedUserTools = localStorage.getItem('offline_registry_data');
      if (cachedUserTools) {
        try { userT = JSON.parse(cachedUserTools); setTools([...adminT, ...userT]); if (adminT.length > 0 || userT.length > 0) setLoading(false); } catch(e) {}
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const userData = await userRes.json();
      if (userData.tools) {
        userT = userData.tools;
        setTools([...adminT, ...userT]);
        localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools));
      }
    } catch (err) {
      console.error('Fetch tools error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedState();
    fetchCategories();
    fetchTools();
    window.addEventListener(SYNC_EVENT, loadSavedState);
    return () => window.removeEventListener(SYNC_EVENT, loadSavedState);
  }, []);

  // Auto-reset page on search query or category filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleToggleSave = (toolId: string | number) => {
    let updated = [...savedToolIds];
    if (updated.includes(toolId)) {
      updated = updated.filter(id => id !== toolId);
    } else {
      updated.push(toolId);
    }
    localStorage.setItem(getRoleKey('saved_tools'), JSON.stringify(updated));
    setSavedToolIds(updated);
    triggerSync();
  };

  const handleToggleCollection = (collectionId: string, toolId: string | number) => {
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        const exists = c.toolIds.includes(toolId);
        const updatedToolIds = exists
          ? c.toolIds.filter(id => id !== toolId)
          : [...c.toolIds, toolId];
        return { ...c, toolIds: updatedToolIds };
      }
      return c;
    });
    localStorage.setItem(getRoleKey('collections'), JSON.stringify(updated));
    setCollections(updated);
    triggerSync();
  };

  const deferredSearchQuery = React.useDeferredValue(searchQuery);

  // Filtered tools list
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(deferredSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category_name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, deferredSearchQuery, selectedCategory]);

  // Sliced tools logic using pagination page
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage) || 1;
  const paginatedTools = useMemo(() => {
    const end = currentPage * itemsPerPage;
    return filteredTools.slice(0, end);
  }, [filteredTools, currentPage]);

  const categoryCountMap = useMemo(
    () => buildCategoryCountMap(categories, tools.length),
    [categories, tools.length]
  );

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden font-sans pr-1 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <SandboxViewer
        open={!!sandboxTool}
        url={sandboxTool?.url}
        title={sandboxTool?.name}
        onClose={() => setSandboxTool(null)}
      />

      {/* ── Sticky Header & Filter Area ── */}
      <div className="sticky top-0 z-[100] bg-black shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] pt-4 pb-2 mb-6 border-b border-[var(--border)]">
        {/* ── Header ── */}
        <PremiumHeader
          badge="🔍 AI SYSTEMS REGISTRY"
          title="Explore AI Systems"
          subtitle="Global directory of advanced intelligence tools and core assets."
          count={`${filteredTools.length} / ${tools.length}`}
          countLabel="Systems"
          icon={BookOpen}
          accentClass="text-[var(--neon)]"
          badgeBg="bg-[var(--neon)]/10"
          badgeBorder="border-[var(--neon)]/20"
        >
          {/* Live Status Capsule */}
          <div className="flex items-center gap-2 bg-[var(--neon)]/10 border border-[var(--neon)]/20 rounded-2xl px-3 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--neon)] animate-pulse shadow-[0_0_8px_rgba(var(--particle-rgb),0.8)]" />
            <span className="text-[9px] font-black text-[var(--neon)] uppercase tracking-widest leading-none font-mono">LIVE</span>
          </div>
        </PremiumHeader>

      {/* ── Filter Toolbar ── */}
      <PremiumFilterBar>
        <PremiumSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search the directory..."
        />

        {/* Category Dropdown */}
        <div className="relative flex-1 lg:flex-none lg:w-56 z-[999]">
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] rounded-2xl h-[46px] px-4 text-[12px] font-bold focus:outline-none focus:border-[var(--neon)] cursor-pointer w-full flex items-center justify-between transition-all gap-2 hover:bg-[var(--card-bg)] hover:border-[var(--border2)] shadow-sm"
          >
            <span className="truncate uppercase tracking-widest text-[10px] font-mono">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)] font-mono">
                {selectedCategory === 'all' ? categoryCountMap.__all__ : (categoryCountMap[selectedCategory] ?? 0)}
              </span>
              <ChevronDown size={13} className={`text-[var(--muted)] transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {isCategoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[990]" onClick={() => setIsCategoryDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  className="absolute top-full right-0 min-w-[14rem] bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl mt-2 p-2 z-[1000] shadow-2xl backdrop-blur-xl max-h-64 overflow-y-auto no-scrollbar space-y-0.5"
                >
                  <button onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedCategory === 'all' ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}>
                    <span>All Categories</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)]">{categoryCountMap.__all__}</span>
                  </button>
                  {categoriesLoading && categories.length === 0 ? (
                    <p className="text-[10px] font-bold text-[var(--muted2)] text-center py-3 uppercase tracking-widest font-mono">Loading…</p>
                  ) : categories.map((cat: any) => {
                    const count = categoryCountMap[cat.name] ?? cat.toolsCount ?? 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.name); setIsCategoryDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center justify-between ${selectedCategory === cat.name ? 'bg-[var(--neon)]/10 text-[var(--neon)]' : 'text-[var(--muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)]'}`}>
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)] shrink-0">{count}</span>
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </PremiumFilterBar>
    </div>

      {/* Scrollable Directory Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-2 px-1 min-h-0 pb-28 [will-change:transform] [transform:translateZ(0)]">
        {currentPage === 1 && (
          <RecommendationEngine
            tools={tools as Tool[]}
            savedToolIds={savedToolIds}
            searchQuery={searchQuery}
            collections={collections}
            activeCollectionSelector={activeCollectionSelector}
            onViewDetails={onViewDetails}
            onToggleSave={handleToggleSave}
            onToggleCollection={handleToggleCollection}
            onSetActiveSelector={setActiveCollectionSelector}
            onLaunchSandbox={setSandboxTool}
          />
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredTools.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No tools detected"
            subtitle="No matching tools found in the directory. Adjust your search or category filter."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pb-6">
              {paginatedTools.map((tool, idx) => (
                <PremiumToolCard
                  key={tool.id}
                  tool={tool}
                  idx={idx}
                  isSaved={savedToolIds.includes(tool.id)}
                  collections={collections}
                  activeCollectionSelector={activeCollectionSelector}
                  onViewDetails={onViewDetails}
                  onToggleSave={handleToggleSave}
                  onToggleCollection={handleToggleCollection}
                  onSetActiveSelector={setActiveCollectionSelector}
                  onLaunchSandbox={setSandboxTool}
                />
              ))}
            </div>

            {/* Load More Trigger and Status */}
            {currentPage < totalPages ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-3 rounded-xl bg-[var(--neon)] text-black font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md font-mono"
                >
                  <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                  Load More Tools
                </button>
                <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-wider font-mono">
                  Showing {paginatedTools.length} of {filteredTools.length} tools
                </span>
              </div>
            ) : (
              filteredTools.length > 0 && (
                <div className="text-center py-8 text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest font-mono">
                  All {filteredTools.length} systems loaded
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};


export const DailyAITools = ({ onViewDetails, onTabChange }: { onViewDetails: (id: string | number) => void; onTabChange?: (tab: string) => void }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('user');
  
  // Calendar and Selected Date States
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const rawRole = localStorage.getItem('user_role') || 'user';
      const resolvedRole = rawRole.toLowerCase().includes('owner') ? 'owner' : 'member';
      setRole(resolvedRole);
      const headers = { 'Authorization': `Bearer ${token}` };
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      const cachedAdmin = localStorage.getItem('offline_cache_tools_data');
      const cachedUser = localStorage.getItem('offline_registry_data');
      if (cachedAdmin || cachedUser) {
        try {
          const a = cachedAdmin ? JSON.parse(cachedAdmin) : [];
          const u = cachedUser ? JSON.parse(cachedUser) : [];
          const aTools = a.filter((t: Tool) => t.source !== 'seeded').map((t: Tool) => ({ ...t, is_admin_added: true }));
          const uTools = u.map((t: Tool) => ({ ...t, is_admin_added: false }));
          setTools([...aTools, ...uTools]);
          setLoading(false);
        } catch(e) {}
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const [adminRes, userRes] = await Promise.all([
        fetch(`${baseUrl}/api/v1/tools?all=true`, { headers, signal: controller.signal }),
        fetch(`${baseUrl}/api/v1/user-tools?all=true`, { headers, signal: controller.signal })
      ]);
      clearTimeout(timeoutId);
      const adminData = await adminRes.json();
      const userData = await userRes.json();

      localStorage.setItem('offline_cache_tools_data', JSON.stringify(adminData.tools || []));
      localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools || []));
      
      const adminTools = (adminData.tools || [])
        .filter((t: Tool) => t.source !== 'seeded')
        .map((t: Tool) => ({ ...t, is_admin_added: true }));
        
      const userTools = (userData.tools || [])
        .map((t: Tool) => ({ ...t, is_admin_added: false }));
        
      setTools([...adminTools, ...userTools]);
    } catch (err) {
      console.error('Fetch AI Update feed failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tools, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `daily-ai-tools-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export JSON Failed:', err);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on('analytics_update', () => {
      fetchData();
    });

    return () => {
      socket.off('analytics_update');
    };
  }, []);

  // Calendar Helpers
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getFormattedDateKey = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSelectedDate = (date: Date) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return `${weekday}, ${month} ${day}`;
  };

  const handleGoToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const groupedTools = useMemo(() => {
    const groups: { [key: string]: Tool[] } = {};

    tools.forEach(tool => {
      const dateVal = tool.started_at || tool.created_at || new Date().toISOString();
      const formattedDate = getFormattedDateKey(new Date(dateVal));
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(tool);
    });

    return Object.entries(groups);
  }, [tools]);

  const toolsByDateKey = useMemo(() => {
    const map = new Map<string, Tool[]>();
    groupedTools.forEach(([dateStr, dayTools]) => {
      map.set(dateStr, dayTools);
    });
    return map;
  }, [groupedTools]);

  const calendarCells = useMemo(() => {
    const cells = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const date = new Date(prevYear, prevMonth, day);
      const dateKey = getFormattedDateKey(date);
      cells.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        hasUpdates: toolsByDateKey.has(dateKey) && (toolsByDateKey.get(dateKey) || []).length > 0,
        date
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = getFormattedDateKey(date);
      cells.push({
        day,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        hasUpdates: toolsByDateKey.has(dateKey) && (toolsByDateKey.get(dateKey) || []).length > 0,
        date
      });
    }

    const totalCells = 42;
    const nextDays = totalCells - cells.length;
    for (let day = 1; day <= nextDays; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const date = new Date(nextYear, nextMonth, day);
      const dateKey = getFormattedDateKey(date);
      cells.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        hasUpdates: toolsByDateKey.has(dateKey) && (toolsByDateKey.get(dateKey) || []).length > 0,
        date
      });
    }

    return cells;
  }, [currentMonth, currentYear, toolsByDateKey]);

  const selectedDayTools = useMemo(() => {
    const key = getFormattedDateKey(selectedDate);
    return toolsByDateKey.get(key) || [];
  }, [selectedDate, toolsByDateKey]);

  const { adminTools, userTools } = useMemo(() => {
    const admin = selectedDayTools.filter(t => t.is_admin_added);
    const user = selectedDayTools.filter(t => !t.is_admin_added);
    return { adminTools: admin, userTools: user };
  }, [selectedDayTools]);

  const renderToolCard = (tool: Tool) => {
    const pricingClean = (tool.pricing_model || 'free').toLowerCase();
    const badgeColor = pricingClean === 'free' 
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : pricingClean === 'freemium' 
        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';

    const dateVal = tool.started_at || tool.created_at || new Date().toISOString();
    const timeStr = new Date(dateVal).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    return (
      <motion.div
        key={tool.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--neon)]/40 rounded-3xl p-5 md:p-6 shadow-md flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(var(--particle-rgb),0.12)] text-left cursor-pointer"
        onClick={() => onViewDetails(tool.id)}
      >
        {/* Gradient hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent" />

        <div className="space-y-4 flex-1">
          {/* Tool Icon and Title */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-[14px] bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-2xl shadow-sm group-hover:border-[var(--neon)]/30 group-hover:scale-105 transition-all shrink-0">
                {tool.category_icon || '🤖'}
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] md:text-[15px] font-black text-[var(--text)] tracking-tight group-hover:text-[var(--neon)] transition-colors leading-tight truncate">{tool.name}</h4>
                <p className="text-[9px] md:text-[10px] font-bold text-[var(--muted2)] uppercase tracking-widest leading-none mt-1.5 font-mono">{tool.category_name || 'AI Systems'}</p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full border text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0 ${badgeColor}`}>
              {tool.pricing_model}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] md:text-[12px] text-[var(--muted)] tracking-wide line-clamp-2 md:line-clamp-3 leading-relaxed border-t border-[var(--border)] pt-4">
            {tool.description}
          </p>

          {/* System telemetry */}
          <div className="border-t border-[var(--border)] pt-3.5 mt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-wider text-[var(--muted2)]">
            <div className="flex items-center gap-1.5 bg-[var(--input-bg)] px-2.5 py-1.5 rounded-lg">
              <Clock className="w-3 h-3 text-[var(--neon)] shrink-0" />
              <span>SYNC: <span className="text-[var(--text)] font-mono">{timeStr}</span></span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--input-bg)] px-2.5 py-1.5 rounded-lg">
              <Cpu className="w-3 h-3 text-[var(--neon)] shrink-0" />
              <span>V1 <span className="text-[var(--neon)]">CLEARANCE</span></span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans lg:overflow-hidden overflow-y-auto no-scrollbar pb-16 lg:pb-0 relative">
      
      {/* ── Header ── */}
      <PremiumHeader
        badge="📡 NEURAL AI UPDATE FEED"
        title="Neural AI Update"
        subtitle="Chronological system updates & telemetry logs of integrated intelligence nodes."
        icon={Award}
        accentClass="text-[var(--neon)]"
        badgeBg="bg-[var(--neon)]/10"
        badgeBorder="border-[var(--neon)]/20"
      >
        <div className="flex items-center gap-3">
          {role === 'owner' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--muted)] text-[9px] md:text-[10px] font-black uppercase tracking-wider hover:bg-[var(--card-bg)] hover:text-[var(--text)] transition-all cursor-pointer shadow-sm font-mono"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </motion.button>
          )}
          <div className="flex items-center gap-2 bg-[var(--neon)]/10 border border-[var(--neon)]/20 px-4 py-2.5 rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--neon)] animate-pulse shadow-[0_0_8px_rgba(var(--particle-rgb),0.8)]" />
            <span className="text-[9px] font-black text-[var(--neon)] uppercase tracking-widest leading-none font-mono">STREAM ACTIVE</span>
          </div>
        </div>
      </PremiumHeader>

      {loading && tools.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
          {/* Premium skeleton loading state */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border2)] border-t-[var(--neon)] animate-spin" />
            <div className="absolute inset-3 rounded-full border border-[var(--border)] border-t-[var(--emerald)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-6 rounded-full bg-[var(--neon)]/20 animate-pulse" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--neon)] font-mono">Synchronizing Neural Network</p>
            <p className="text-[10px] font-medium text-[var(--muted2)] tracking-wide">Fetching intelligence stream...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 relative z-10">
          {/* Left Column (Calendar Widget) */}
          <div className="w-full lg:w-[320px] xl:w-[380px] flex-none flex flex-col gap-3 text-left order-2 lg:order-1 h-auto lg:h-auto pr-0 lg:pr-2">
            
            {/* Calendar Timeline Card */}
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 relative overflow-hidden shadow-xl hover:border-[var(--border2)] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/[0.03] to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent opacity-20 rounded-t-3xl" />
              
              {/* Card Subtitle & Month Display */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-[var(--neon)] uppercase tracking-[0.25em] font-mono">CHRONOLOGY</span>
                  <span className="text-lg md:text-xl font-black text-[var(--text)] uppercase tracking-wider font-mono mt-0.5 leading-none">
                    {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                {/* Month navigation buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-bg)] hover:border-[var(--neon)] hover:text-[var(--neon)] transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronLeft size={14} className="stroke-[2.5]" />
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-bg)] hover:border-[var(--neon)] hover:text-[var(--neon)] transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronRight size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2.5 relative z-10">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                  <span key={day} className="text-[9px] font-black text-[var(--muted2)] tracking-[0.1em] py-1 text-center font-mono">{day}</span>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-1.5 relative z-10">
                {calendarCells.map((cell, idx) => {
                  const isSelected = isSameDay(cell.date, selectedDate);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDate(cell.date);
                        if (cell.month !== currentMonth) {
                          setCurrentMonth(cell.month);
                          setCurrentYear(cell.year);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-xl text-[11px] font-black transition-all cursor-pointer select-none font-mono
                        ${cell.isCurrentMonth ? 'text-[var(--text)]' : 'text-[var(--muted2)]/40'}
                        ${isSelected 
                          ? 'bg-[var(--neon)] text-black shadow-[0_0_15px_rgba(var(--particle-rgb),0.35)] scale-105' 
                          : cell.isToday 
                            ? 'border border-[var(--neon)]/50 text-[var(--neon)] bg-[var(--neon)]/10' 
                            : 'bg-[var(--input-bg)] border border-transparent hover:border-[var(--neon)]/30 hover:bg-[var(--card-bg)]'
                        }
                      `}
                    >
                      <span className={isSelected ? "text-black" : ""}>{cell.day}</span>
                      
                      {/* Updates count indicator */}
                      {cell.hasUpdates && (
                        <span className={`absolute top-1 right-1 text-[7px] font-black px-1 rounded-sm leading-none py-0.5 ${isSelected ? 'bg-black text-[var(--neon)]' : 'bg-[var(--neon)]/20 text-[var(--neon)]'}`}>
                          {toolsByDateKey.get(getFormattedDateKey(cell.date))?.length || 0}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom info text */}
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl px-4 py-3 flex items-center gap-2.5">
              <Info size={13} className="text-[var(--neon)] shrink-0" />
              <p className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-[0.1em] leading-snug">
                Highlighted dates have logged protocols. Click to inspect.
              </p>
            </div>
          </div>

          {/* Right Column (Updates list content) */}
          <div className="flex-1 flex flex-col lg:h-full lg:overflow-y-auto no-scrollbar order-1 lg:order-2 gap-5 text-left">
            
            {/* Transmission Header with Date & Today button */}
            <div className="flex-none flex items-center justify-between bg-[var(--card-bg)] border border-[var(--border)] p-5 md:p-6 rounded-3xl shadow-xl relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--emerald)] to-transparent opacity-20" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-[0.2em] mb-1 font-mono">
                  TOTAL PROTOCOLS: <span className="text-[var(--neon)]">{selectedDayTools.length}</span>
                </span>
                <span className="text-lg md:text-xl font-black text-[var(--text)] uppercase tracking-wider leading-none">
                  {formatSelectedDate(selectedDate)}
                </span>
              </div>

              {!isSameDay(selectedDate, new Date()) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoToToday}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[10px] font-black uppercase tracking-wider hover:bg-[var(--neon)] hover:text-black hover:border-[var(--neon)] transition-all cursor-pointer shrink-0 font-mono"
                >
                  <Calendar size={13} />
                  <span>JUMP TO TODAY</span>
                </motion.button>
              )}
            </div>

            {/* Grid display / Empty state */}
            {adminTools.length === 0 && userTools.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 text-center min-h-[350px] relative z-10 shadow-xl">
                <div className="w-16 h-16 rounded-[1.2rem] bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center mb-5 shadow-inner">
                  <Activity className="w-8 h-8 text-[var(--muted2)] opacity-40 animate-pulse" />
                </div>
                <p className="font-royal text-[15px] md:text-[17px] font-black text-[var(--text)] tracking-tight mb-2">Zero Transmissions Found</p>
                <p className="text-[10px] md:text-[11px] font-medium text-[var(--muted)] tracking-wide max-w-sm mx-auto">No intelligence nodes or systemic overrides were registered on this date protocol.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-8 pb-12 overflow-y-auto pr-1 relative z-10">
                {/* Admin Feed */}
                {adminTools.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] md:text-[11px] font-black text-[var(--text)] uppercase tracking-[0.15em] flex items-center gap-2 border-b border-[var(--border)] pb-3 font-mono">
                      <div className="w-6 h-6 rounded-lg bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-[var(--neon)]" />
                      </div>
                      Core Overrides
                      <span className="ml-auto bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]/20 px-2.5 py-0.5 rounded-full text-[9px]">{adminTools.length}</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-4 lg:gap-5">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 md:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[var(--neon)]/40 transition-all cursor-pointer"
                        onClick={() => onTabChange?.('registry')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shadow-sm shrink-0">
                            <Bot className="w-6 h-6 text-[var(--neon)]" />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-black text-[var(--text)] tracking-tight group-hover:text-[var(--neon)] transition-colors">
                              {adminTools.length} {adminTools.length === 1 ? 'New AI Tool' : 'New AI Tools'} Uploaded
                            </h4>
                            <p className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-1 font-mono">
                              By Admin / Core System
                            </p>
                          </div>
                        </div>
                        <div className="text-[9px] font-black uppercase text-[var(--neon)] tracking-widest bg-[var(--neon)]/10 px-3 py-1.5 rounded-lg border border-[var(--neon)]/20 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                          <span>View in Registry</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
                
                {/* User Feed */}
                {userTools.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] md:text-[11px] font-black text-[var(--text)] uppercase tracking-[0.15em] flex items-center gap-2 border-b border-[var(--border)] pb-3 font-mono">
                      <div className="w-6 h-6 rounded-lg bg-[var(--emerald)]/10 border border-[var(--emerald)]/20 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-[var(--emerald)]" />
                      </div>
                      User Integrations
                      <span className="ml-auto bg-[var(--emerald)]/10 text-[var(--emerald)] border border-[var(--emerald)]/20 px-2.5 py-0.5 rounded-full text-[9px]">{userTools.length}</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-4 lg:gap-5">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-5 md:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[var(--emerald)]/40 transition-all cursor-pointer"
                        onClick={() => onTabChange?.('registry')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[var(--emerald)]/10 border border-[var(--emerald)]/20 flex items-center justify-center shadow-sm shrink-0">
                            <Users className="w-6 h-6 text-[var(--emerald)]" />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-black text-[var(--text)] tracking-tight group-hover:text-[var(--emerald)] transition-colors">
                              {userTools.length} {userTools.length === 1 ? 'New AI Tool' : 'New AI Tools'} Uploaded
                            </h4>
                            <p className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-widest mt-1 font-mono">
                              By Neural Node Operator
                            </p>
                          </div>
                        </div>
                        <div className="text-[9px] font-black uppercase text-[var(--emerald)] tracking-widest bg-[var(--emerald)]/10 px-3 py-1.5 rounded-lg border border-[var(--emerald)]/20 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                          <span>View in Registry</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

