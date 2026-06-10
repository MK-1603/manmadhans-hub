import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Bot,
  ExternalLink,
  Clock,
  Activity,
  Cpu,
  Network,
  Database,
  Shield,
  Search,
  Layers,
  Filter,
  Trash2,
  Download
} from 'lucide-react';
import { useToast } from './ToastContext';
import { socket } from '../../lib/socket';

export interface Tool {
  id: string;
  name: string;
  slug?: string;
  short_description?: string;
  description: string;
  url: string;
  logo_url?: string;
  category_id: string;
  category_name?: string;
  category_icon?: string;
  sector_id?: string;
  sector_name?: string;
  sector_icon?: string;
  model_version: string;
  use_case: string;
  platform_type?: string;
  pricing_model?: string;
  pricing_details?: string;
  key_features?: string | string[];
  search_keywords?: string | string[];
  developer_name?: string;
  launch_date?: string;
  tool_status?: string;
  is_featured?: boolean;
  integrations?: string | string[];
  tags?: string | string[];
  entry_date?: string;
  source?: 'seeded' | 'manual' | 'user';
  is_active: boolean;
  is_archived: boolean;
  rating?: number;
  created_at: string;
}

export const AIToolsRegistry = () => {
  const { showToast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentRole, setCurrentRole] = useState<string>('user');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all'); // all, admin, user
  const [loading, setLoading] = useState(true);

  const fetchTools = async () => {
    try {
      const cachedTools = localStorage.getItem('offline_ai_tools_registry_data');
      if (cachedTools) {
        try {
          setTools(JSON.parse(cachedTools));
          setLoading(false);
        } catch(e) {}
      }

      const token = localStorage.getItem('session_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?all=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
        localStorage.setItem('offline_ai_tools_registry_data', JSON.stringify(data.tools || []));
      }
    } catch (err) {
      console.error('Failed to sync user registry', err);
      if (localStorage.getItem('offline_ai_tools_registry_data')) {
        showToast("Offline Mode: Displaying cached registry tools.", "info");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rawRole = localStorage.getItem("user_role") || "";
    const role = rawRole.toLowerCase().includes('owner') ? 'owner' : 'member';
    setCurrentRole(role);

    fetchTools();

    if (!socket.connected) {
      socket.connect();
    }

    const handleRefresh = () => {
      fetchTools();
    };

    socket.on('refresh_matrix', handleRefresh);

    return () => {
      socket.off('refresh_matrix', handleRefresh);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      if (response.ok) {
        showToast('Tool deleted successfully', 'success');
        fetchTools();
      } else {
        showToast('Failed to delete tool', 'error');
      }
    } catch (err) {
      showToast('Error deleting tool', 'error');
    }
  };

  const isAdministrator = currentRole === 'owner' || currentRole === 'owner';

  const filteredItems = useMemo(() => {
    return tools.filter(item => {
      const dateStr = new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.category_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dateStr.includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (roleFilter === 'owner') {
        return item.source === 'manual';
      }
      if (roleFilter === 'member') {
        return item.source === 'user';
      }
      return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [tools, searchQuery, roleFilter]);

  const handleExportUserTools = () => {
    const toolsToExport = tools.filter(item => item.source === 'user');
    if (toolsToExport.length === 0) {
      showToast('No user nodes to export', 'error');
      return;
    }
    
    const exportData = toolsToExport.map(t => ({
      id: t.id || "",
      name: t.name || "",
      slug: t.slug || "",
      short_description: t.short_description || "",
      description: t.description || "",
      use_case: t.use_case || "",
      key_features: ["", "", ""],
      website_url: t.url || "",
      logo_url: t.logo_url || "",
      cover_image_url: "",
      category_id: t.category_id || "",
      category_name: t.category_name || "",
      sub_category: "",
      micro_category: "",
      pricing_type: t.pricing_model || "",
      pricing_details: t.pricing_details || "",
      developer_name: t.developer_name || "",
      developer_description: "",
      author_name: "",
      author_role: "",
      author_description: "",
      company_founded_year: "",
      launch_date: t.launch_date || "",
      ai_model_used: t.model_version || "",
      platform_support: ["Web"],
      api_available: false,
      github_url: "",
      integrations: [],
      monthly_visits: 0,
      rating: 0,
      review_count: 0,
      tool_status: "Active",
      featured: false,
      verified: false,
      tags: [],
      search_keywords: [],
      last_verified: "",
      created_at: t.created_at || "",
      updated_at: ""
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user_tools_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported tools successfully', 'success');
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden font-sans pr-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* ── Header ── */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[var(--border2)] mb-6">
        <div className="min-w-0 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--neon)] tracking-[2px] uppercase">
            ⚙️ OPERATOR REGISTRY
          </div>
          <h1 className="font-royal text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight flex items-center gap-3 leading-none">
            <Database className="w-6 h-6 text-[var(--neon)] shrink-0 animate-pulse" />
            AI Tools Registry
            <div className="flex items-center gap-2 bg-[rgba(126,242,82,0.05)] border border-[var(--border2)] px-2.5 py-1 rounded-full shrink-0 ml-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse shadow-[0_0_8px_rgba(126,242,82,0.8)]" />
              <span className="text-[10px] font-bold text-[var(--neon)] tracking-widest leading-none uppercase">SYNC: ACTIVE</span>
            </div>
          </h1>
          <p className="text-[12px] md:text-[13px] font-medium text-[var(--muted)] tracking-wide">
            {isAdministrator 
              ? "Dual telemetry chamber displaying core AI intelligence deployments."
              : "Cybernetic logging chamber for your deployed AI intelligence assets."}
          </p>
        </div>
      </div>


      {/* ── Filter Toolbar ── */}
      <div className="flex-none flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-4 relative z-20">
        {/* Search */}
        <div className="relative flex-1 min-w-0 lg:max-w-xl bg-[var(--card-bg)] p-1.5 rounded-[18px] border border-[var(--border2)] shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
            <input
              type="text"
              placeholder="Search nodes by name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[46px] pl-11 pr-4 rounded-[13px] border-none bg-transparent text-[13px] font-medium text-[var(--text)] outline-none transition-all placeholder:text-[var(--muted2)] placeholder:font-normal"
            />
          </div>
        </div>

        {/* Role-Based filter options */}
        {isAdministrator && (
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1.5 rounded-[18px] border border-[var(--border2)] bg-[var(--card-bg)] shadow-sm overflow-x-auto no-scrollbar w-full lg:w-auto shrink-0">
              <div className="flex items-center gap-1.5 px-3 text-[10px] font-bold text-[var(--muted)] tracking-wider border-r border-[var(--border2)] h-full shrink-0">
                <Filter className="w-3 h-3" />
                <span>CLEARANCE</span>
              </div>
              <div className="flex items-center gap-1 pl-2 pr-1 shrink-0">
                {['all', 'admin', 'user'].map(filterOpt => (
                  <button
                    key={filterOpt}
                    onClick={() => setRoleFilter(filterOpt)}
                    className={`px-4 py-2 rounded-[12px] text-[12px] font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      roleFilter === filterOpt
                        ? 'bg-[var(--neon)] text-black shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--input-bg)]'
                    }`}
                  >
                    {filterOpt === 'all' ? 'All Logs' : filterOpt === 'owner' ? 'Admin Nodes' : 'User Nodes'}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleExportUserTools}
              className="flex items-center gap-2 px-4 py-3 bg-[var(--neon)] text-black rounded-[14px] font-bold tracking-wide shadow-sm hover:shadow-[0_0_15px_rgba(126,242,82,0.3)] hover:scale-105 transition-all duration-200 shrink-0 cursor-pointer"
              title="Export User Tools to JSON format"
            >
              <Download size={16} />
              <span className="text-[12px] uppercase">Export Users JSON</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Main Roster Grid ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-4 px-1 pb-12 flex flex-col">
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center px-6">
            <div className="w-20 h-20 rounded-[24px] bg-[var(--card-bg)] border border-[var(--border2)] flex items-center justify-center mb-6 shadow-sm">
              <Bot size={32} className="text-[var(--neon)] opacity-80" />
            </div>
            <p className="text-xl font-black tracking-tight text-[var(--text)] mb-2">No nodes detected</p>
            <p className="text-[13px] font-medium text-[var(--muted)] tracking-wide max-w-xs">Adjust your clearance filters or search query to find registry deployments.</p>
          </div>
        ) : (
          <div className="space-y-10 pb-6">
            {Object.entries(
              filteredItems.reduce((acc, item) => {
                const dateStr = new Date(item.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
                if (!acc[dateStr]) acc[dateStr] = [];
                acc[dateStr].push(item);
                return acc;
              }, {} as Record<string, typeof filteredItems>)
            ).map(([dateStr, itemsForDate]) => (
              <div key={dateStr} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border2)] pb-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--neon)]/10 flex items-center justify-center border border-[var(--neon)]/20 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-[var(--neon)]" />
                  </div>
                  <h3 className="text-[13px] font-black text-[var(--text)] uppercase tracking-widest font-mono">{dateStr}</h3>
                  <span className="ml-2 bg-[var(--input-bg)] border border-[var(--border)] px-2.5 py-1 rounded-full text-[9px] font-black text-[var(--muted2)] tracking-widest font-mono">{itemsForDate.length} Nodes</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-start">
                  {itemsForDate.map((item, idx) => {
                    const isAdminItem = item.source === 'manual';
                    
                    // Color theme logic based on admin vs user node
                    const cardBorder = isAdminItem ? 'border-cyan-500/25 hover:border-cyan-400/50' : 'border-[var(--border2)] hover:border-[var(--neon)]';
                    const iconTheme = isAdminItem ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/15 group-hover:border-cyan-400/50' : 'bg-[rgba(126,242,82,0.07)] border-[var(--border2)] text-[var(--neon)] group-hover:bg-[rgba(126,242,82,0.13)] group-hover:border-[var(--neon)]';
                    const titleGlow = isAdminItem ? 'group-hover:text-cyan-400' : 'group-hover:text-[var(--neon)]';
                    const topBar = isAdminItem ? 'via-cyan-400' : 'via-[var(--neon)]';
                    const badgeTheme = isAdminItem ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' : 'border-[var(--border2)] text-[var(--text)] bg-[var(--border)]';
                    
                    const createdAt = new Date(item.created_at);
                    const timeStr = createdAt.toLocaleTimeString('en-US', { hour12: false });
                    
                    return (
                      <div
                        key={item.id || idx}
                        className={`bg-[var(--card-bg)] border rounded-[20px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-card)] relative group transition-all duration-300 flex flex-col justify-between text-left ${cardBorder}`}
                      >
                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${topBar} to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-t-[20px]`} />

                        <div className="space-y-5 flex-1 flex flex-col">
                          {/* Card Header Info */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-mono text-sm transition-colors shrink-0 shadow-sm border ${iconTheme}`}>
                                <Cpu className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className={`text-[14px] font-extrabold tracking-tight transition-colors leading-tight truncate text-[var(--text)] ${titleGlow}`}>
                                  {item.name}
                                </h4>
                                <p className="text-[11px] font-medium text-[var(--muted)] truncate mt-0.5">
                                  · {item.category_name || 'AI Systems'}
                                </p>
                              </div>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold capitalize shrink-0 ${badgeTheme}`}>
                              {item.pricing_model || 'Free'}
                            </span>
                          </div>

                          {/* System integration checklist */}
                          <div className="border-t border-[var(--border2)] pt-4 space-y-2.5 mt-auto">
                            <div className="flex items-center gap-2.5 text-[11px] font-semibold text-[var(--muted)]">
                              <Database className={`w-3.5 h-3.5 shrink-0 ${isAdminItem ? 'text-cyan-400' : 'text-[var(--neon)]'}`} />
                              <span>Schema Status: <span className="text-[var(--text)] font-bold">Sync Complete</span></span>
                            </div>
                            <div className="flex items-center gap-2.5 text-[11px] font-semibold text-[var(--muted)]">
                              <Shield className={`w-3.5 h-3.5 shrink-0 ${item.tool_status === 'pending' ? 'text-amber-400' : isAdminItem ? 'text-cyan-400' : 'text-[var(--neon)]'}`} />
                              <span>Clearance: <span className={`font-extrabold ${item.tool_status === 'pending' ? 'text-amber-400' : isAdminItem ? 'text-cyan-400' : 'text-[var(--neon)]'}`}>{item.tool_status === 'pending' ? 'Pending Review' : 'Verified'}</span></span>
                            </div>
                            <div className="flex items-center gap-2.5 text-[11px] font-semibold text-[var(--muted)]">
                              <Clock className={`w-3.5 h-3.5 shrink-0 ${isAdminItem ? 'text-cyan-400' : 'text-[var(--neon)]'}`} />
                              <span className="flex items-center gap-1.5">
                                Synced: 
                                <span className="text-[var(--text)] font-mono font-bold bg-[var(--border)] px-1.5 py-0.5 rounded">{timeStr}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Action Link */}
                        <div className="mt-5 pt-4 border-t border-[var(--border2)] flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase bg-[var(--input-bg)] px-2.5 py-1 rounded-[8px] border border-[var(--border2)]">
                            Role: {isAdminItem ? 'Owner' : 'Operator'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(item.id);
                              }}
                              className="p-2 rounded-[10px] border border-[var(--border2)] text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 cursor-pointer"
                              title="Delete Tool"
                            >
                              <Trash2 size={14} />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border text-[12px] font-extrabold tracking-wide transition-all duration-200 cursor-pointer ${
                                isAdminItem 
                                  ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                  : 'bg-[var(--border)] border-[var(--border2)] text-[var(--text)] hover:text-black hover:bg-[var(--neon)] hover:border-[var(--neon)] shadow-sm'
                              }`}
                            >
                              <span>Launch</span>
                              <ExternalLink size={13} className="shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
