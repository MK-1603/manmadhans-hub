"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Wrench,
  Grid,
  ShieldCheck,
  ChevronDown,
  Terminal,
  Menu,
  X,
  Layers,
  Activity,
  Zap,
  Folder,
  FolderOpen,
  User,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Compass,
  Bookmark,
  Database,
  Shield,
  Bell,
  UserPlus,
  Info,
  Plus,
  Sparkles,
  Gamepad2,
  BookOpen,
  Calendar,
  History,
  Film,
  FileText,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Star,
  Crown,
  Cpu,
  Radio,
  Heart,
  Sliders,
  FileCode2,
  Eye,
  Rocket,
  Lock,
  MessageSquare,
  Network
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { socket } from '@/lib/socket';
const defaultSettings = {
  hubName: "MANMADHAN'S HUB",
  founder: "Manmadhan"
};

import { MyRegistry } from './MyRegistry';
import { UploadHistory } from './UploadHistory';
import { NotepadWidget } from './NotepadWidget';

import { Overview } from './Overview';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';
import { AppLockOverlay } from './AppLockOverlay';
import { IdentityManagement } from './IdentityManagement';
import { ToolManagement } from './ToolManagement';
import { InvitationCenter } from './InvitationCenter';
import { PlatformAnalytics } from './Analytics';
import { SecurityLog } from './SecurityLog';
import { AuditLog } from './AuditLog';
import { CategoryManagement } from './CategoryManagement';
import { FeatureFlags } from './FeatureFlags';
import { SystemStatus } from './SystemStatus';
import { BackupRecovery } from './BackupRecovery';
import { PlatformSettings } from './PlatformSettings';
import { CompareTools } from './CompareTools';
import { SearchAITools, ExploreCategories, MyCollections, SavedTools, ExploreTools, DailyAITools, CategoryToolsView } from './WorkspacePages';
import { ToolDetails } from './ToolDetails';
import { Profile } from './Profile';
import { SecuritySettings } from './SecuritySettings';
import { AddTools } from './AddTools';
import { ManmadhanMovie } from './ManmadhanMovie';
import { NotificationCenter } from './NotificationCenter';
import { HubGames } from './HubGames';
import { AppSettings } from './AppSettings';
import { AboutApp } from './AboutApp';

import { ToastProvider, useToast } from './ToastContext';
import { usePushNotifications } from '../../hooks/usePushNotifications';

// ─── Premium System Clock ────────────────────────────────────────────────────
function SystemClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="flex items-center gap-2 font-mono text-[var(--neon)]/40 text-[9px] font-bold uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]/30 animate-pulse" />
        SYNCING...
      </div>
    );
  }

  const day = time.getDate().toString().padStart(2, '0');
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = monthNames[time.getMonth()];
  const year = time.getFullYear();
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const offsetMinutes = -time.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHoursStr = Math.floor(Math.abs(offsetMinutes) / 60).toString().padStart(2, '0');
  const offsetMinsStr = (Math.abs(offsetMinutes) % 60).toString().padStart(2, '0');
  const tzString = `UTC${sign}${offsetHoursStr}:${offsetMinsStr}`;

  return (
    <div className="hidden sm:flex items-center gap-2 select-none shrink-0 font-mono">
      <div className="flex items-center gap-2.5 bg-[var(--neon)]/[0.06] border border-[var(--neon)]/[0.15] rounded-2xl px-3.5 py-2 backdrop-blur-md">
        {/* Live dot */}
        <div className="relative h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon)]/50 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neon)]" />
        </div>
        {/* Date */}
        <div className="flex flex-col leading-none gap-0.5">
          <span className="text-[10px] font-black text-[var(--text)] opacity-70 tracking-wide">
            {day} {month} {year}
          </span>
          <span className="text-[7px] font-bold text-[var(--muted2)] uppercase tracking-[0.15em]">Date</span>
        </div>
        <div className="h-6 w-px bg-[var(--neon)]/20" />
        {/* Time */}
        <div className="flex flex-col leading-none gap-0.5">
          <span className="text-[13px] font-black text-[var(--text)] tracking-[0.05em]">
            {hours}:{minutes}
            <span className="text-[var(--muted)] text-[9px] ml-0.5">{seconds}</span>
          </span>
          <span className="text-[7px] font-bold text-[var(--muted)] uppercase tracking-[0.15em]">{tzString}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Premium KPI Badge ($100K knob) ──────────────────────────────────────────
function KnobBadge() {
  return null;
}

export default function MissionControlDashboard() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { confirm: openConfirm, modalProps: confirmModalProps } = useConfirmModal();
  // Auto-request push permission when dashboard loads
  usePushNotifications({ autoEnable: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string>('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [initialToolFilter, setInitialToolFilter] = useState('all');
  const [initialToolSearchQuery, setInitialToolSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | number | null>(null);
  const [prevTab, setPrevTab] = useState('overview');
  const [toolsToCompare, setToolsToCompare] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Dashboard Hub': true,
    'AI Workspace': true,
    'Operator Registry': true,
    'System Governance': true,
    'Security & Operations': true,
    'Support & Profile': false,
    'Manmadhan': false,
    'Hub Games': false,
  });

  const displayUsername = useMemo(() => {
    if (user && user.username && user.username !== 'MM1107') {
      return user.username;
    }
    return currentRole === 'owner' ? 'MM1107' : (currentRole === 'owner' ? 'SS0078' : 'AX2201');
  }, [user, currentRole]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Request Native Push Notification Permissions for Owners
    if (currentRole === 'owner' && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [currentRole]);

  useEffect(() => {
    socket.on('security_log_update', (newLog: any) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: `Security Alert`,
          desc: `${newLog.event} flagged from ${newLog.source}.`,
          time: 'Just now',
          type: 'shield',
          read: false
        },
        ...prev
      ]);
      showToast(`Security Alert: ${newLog.event}`, "error");
    });

    socket.on('audit_log_update', (newLog: any) => {
      const isTool = newLog.action?.toLowerCase().includes('tool') || newLog.target?.toLowerCase().includes('tool');
      const isBackup = newLog.action?.toLowerCase().includes('snapshot') || newLog.action?.toLowerCase().includes('backup') || newLog.action?.toLowerCase().includes('purge');
      const isIdentity = newLog.action?.toLowerCase().includes('identity') || newLog.action?.toLowerCase().includes('user') || newLog.action?.toLowerCase().includes('invite');

      setNotifications((prev) => [
        {
          id: Date.now(),
          title: newLog.action,
          desc: newLog.details || `Target node details: ${newLog.target}`,
          time: 'Just now',
          type: isBackup ? 'database' : isIdentity ? 'user' : isTool ? 'zap' : 'shield',
          read: false
        },
        ...prev
      ]);

      showToast(`Audit Event: ${newLog.action}`, "success");
    });

    socket.on('notification', (newNotif: any) => {
      const storedRole = (localStorage.getItem("user_role") || "user").toLowerCase();
      const mappedRole = storedRole.includes('owner') ? 'owner' : 'member';

      if (newNotif.roles && !newNotif.roles.includes(mappedRole)) return;

      // Respect tool_alerts preference
      if (newNotif.type === 'tool_added') {
        try {
          const prefs = JSON.parse(localStorage.getItem('hub_notif_prefs') || '{}');
          if (prefs.tool_alerts === false) return; // user muted tool alerts
        } catch {}
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setNotifications((prev) => [
        {
          id: Date.now(),
          title: newNotif.title || 'System Notification',
          desc: newNotif.desc || newNotif.message || '',
          time: timeStr,
          type: newNotif.type || 'zap',
          read: false
        },
        ...prev.slice(0, 49) // keep max 50
      ]);
      showToast(newNotif.title || 'System Notification', "info");
    });

    socket.on('tool_submitted_for_review', (data: any) => {
      const storedRole = (localStorage.getItem("user_role") || "user").toLowerCase();
      if (storedRole.includes('owner')) {
        // Trigger native web push notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Pending Tool Review', {
            body: `${data.user} has submitted "${data.name}" for moderation.`,
            icon: '/logo.png', // Assuming logo.png exists in public
          });
        }
      }
    });

    return () => {
      socket.off('security_log_update');
      socket.off('audit_log_update');
      socket.off('notification');
      socket.off('tool_submitted_for_review');
    };
  }, [showToast]);

  const handleViewDetails = (toolId: string | number) => {
    setSelectedToolId(toolId);
    localStorage.setItem("dashboard_selected_tool_id", String(toolId));
    setPrevTab(activeTab);
    localStorage.setItem("dashboard_prev_tab", activeTab);
    setActiveTab('tool-details');
    window.location.hash = 'tool-details';
    localStorage.setItem("dashboard_active_tab", 'tool-details');
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 150);
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem("session_start_time")) {
        localStorage.setItem("session_start_time", Date.now().toString());
      }
    }
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSessionActive = sessionStorage.getItem("session_active");
      const isLocalStorageFlag = localStorage.getItem("session_active_flag");
      const hasToken = !!localStorage.getItem("session_token");

      if (!isSessionActive && !isLocalStorageFlag && !hasToken) {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_name");
        localStorage.removeItem("session_start_time");
        window.location.replace("/");
        return;
      }

      if (!isSessionActive && isLocalStorageFlag) {
        sessionStorage.setItem("session_active", "true");
      }
    }

    const rawRole = localStorage.getItem("user_role") || "";
    const role = rawRole.toLowerCase().includes('owner') ? 'owner' : 'member';
    const token = localStorage.getItem("session_token");
    const username = localStorage.getItem("user_name");

    if (!token) {
      window.location.replace("/");
    } else {
      const defaultUsername = role === 'owner' ? 'MM1107' : 'AX2201';
      setUser({ role, username: username || defaultUsername, displayName: username || defaultUsername });
      setCurrentRole(role);

      const savedFilter = localStorage.getItem("dashboard_initial_tool_filter");
      if (savedFilter) setInitialToolFilter(savedFilter);
      const savedToolId = localStorage.getItem("dashboard_selected_tool_id");
      if (savedToolId) setSelectedToolId(savedToolId);
      const savedPrevTab = localStorage.getItem("dashboard_prev_tab");
      if (savedPrevTab) setPrevTab(savedPrevTab);

      const landingQuery = localStorage.getItem("landing_search_query");
      if (landingQuery) {
        setInitialToolSearchQuery(landingQuery);
        setInitialToolFilter("all");
        localStorage.setItem("dashboard_initial_tool_filter", "all");
        setActiveTab("search-ai");
        window.location.hash = "search-ai";
        localStorage.setItem("dashboard_active_tab", "search-ai");
        localStorage.removeItem("landing_search_query");
      } else {
        const hash = window.location.hash.replace('#', '');
        const savedTab = localStorage.getItem("dashboard_active_tab");
        const allowedLinks = [
          'overview', 'analytics', 'identities', 'ai-tools', 'invitations', 'security', 'audit',
          'categories', 'flags', 'status', 'backup', 'settings', 'compare', 'search-ai',
          'daily-ai', 'explore-tools', 'explore-categories',
          'category-tools',
          'collections', 'saved', 'tool-details', 'profile', 'account-center', 'games',
          'add-tools', 'my-registry', 'system-notes', 'notifications', 'app-settings'
        ];

        if (hash && allowedLinks.includes(hash)) {
          setActiveTab(hash);
          localStorage.setItem("dashboard_active_tab", hash);
        } else if (savedTab && allowedLinks.includes(savedTab)) {
          setActiveTab(savedTab);
          window.location.hash = savedTab;
        }
      }
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("session_token");
    if (!token) return;

    const rawRole = localStorage.getItem("user_role") || "";
    const role = rawRole.toLowerCase().includes('owner') ? 'owner' : 'member';
    const username = localStorage.getItem("user_name");
    const defaultUsername = role === 'owner' ? 'MM1107' : 'AX2201';
    const finalUsername = username || defaultUsername;

    let isMounted = true;
    let realIp = "127.0.0.1";
    let realLoc = "Localhost";

    let detectedOS = "Unknown OS";
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") !== -1) detectedOS = "Windows";
    else if (ua.indexOf("Mac") !== -1) detectedOS = "macOS";
    else if (ua.indexOf("Linux") !== -1) detectedOS = "Linux";
    else if (/iPhone|iPad|iPod/i.test(ua)) detectedOS = "iOS";
    else if (/Android/i.test(ua)) detectedOS = "Android";

    let detectedBrowser = "Browser";
    if (ua.indexOf("Firefox") !== -1) detectedBrowser = "Firefox";
    else if (ua.indexOf("Edge") !== -1) detectedBrowser = "Edge";
    else if (ua.indexOf("Chrome") !== -1) detectedBrowser = "Chrome";
    else if (ua.indexOf("Safari") !== -1) detectedBrowser = "Safari";

    const register = () => {
      socket.emit('register_session', {
        user: finalUsername,
        browser: `${detectedBrowser} / ${detectedOS}`,
        ip: realIp,
        location: realLoc
      });
    };

    socket.on('connect', register);
    if (socket.connected) register();

    const onForceLogout = () => {
      showToast("Your operational session has been terminated.", "error");
      setTimeout(() => {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_name");
        localStorage.removeItem("session_start_time");
        window.location.replace("/");
      }, 1500);
    };

    socket.on('force_logout', onForceLogout);

    fetch('https://ipapi.co/json/')
      .then(res => { if (res.ok) return res.json(); throw new Error('Failed to fetch IP data'); })
      .then(ipData => {
        if (ipData && isMounted) {
          realIp = ipData.ip || "127.0.0.1";
          realLoc = ipData.city && ipData.country_name ? `${ipData.city}, ${ipData.country_name}` : "Unknown Location";
          register();
        }
      })
      .catch(err => {
        console.warn("IP fetch failed, falling back to local defaults", err);
        if (isMounted) register();
      });

    return () => {
      isMounted = false;
      socket.off('connect', register);
      socket.off('force_logout', onForceLogout);
    };
  }, [showToast]);

  const allNavLinks = useMemo(() => [
    // Dashboard Hub
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'Dashboard Hub', roles: ['owner', 'member'] },

    // AI Workspace
    { id: 'search-ai', label: 'Search AI Tools', icon: Search, section: 'AI Workspace', roles: ['owner', 'member'] },
    { id: 'daily-ai', label: 'AI Update', icon: Calendar, section: 'AI Workspace', roles: ['owner', 'member'] },
    { id: 'explore-tools', label: 'Explore Tools', icon: Compass, section: 'AI Workspace', roles: ['owner', 'member'] },
    { id: 'explore-categories', label: 'Explore Categories', icon: BookOpen, section: 'AI Workspace', roles: ['owner', 'member'] },
    { id: 'compare', label: 'Compare Tools', icon: Layers, section: 'AI Workspace', roles: ['owner', 'member'] },

    // Operator Registry
    { id: 'add-tools', label: 'Add Tools', icon: Plus, section: 'Operator Registry', roles: ['owner', 'member'] },
    { id: 'upload-history', label: 'My Uploads', icon: UploadCloud, section: 'Operator Registry', roles: ['owner', 'member'] },
    { id: 'my-registry', label: 'Global Registry', icon: History, section: 'Operator Registry', roles: ['owner', 'member'] },
    { id: 'saved', label: 'Saved Tools', icon: Bookmark, section: 'Operator Registry', roles: ['owner', 'member'] },
    { id: 'collections', label: 'My Collections', icon: Folder, section: 'Operator Registry', roles: ['owner', 'member'] },

    // Features & Notes
    { id: 'system-notes', label: 'System Notes', icon: FileText, section: 'Features & Notes', roles: ['owner', 'member'] },
    { id: 'notifications', label: 'Notification Center', icon: Bell, section: 'Features & Notes', roles: ['owner', 'member'] },

    // Hub Entertainment
    { id: 'manmadhan-movie', label: 'Manmadhan Movie', icon: Film, section: 'Hub Entertainment', roles: ['owner', 'member'] },
    { id: 'games', label: 'Hub Games', icon: Gamepad2, section: 'Hub Entertainment', roles: ['owner', 'member'] },

    // System Governance
    { id: 'ai-tools', label: 'AI Tools Manager', icon: Wrench, section: 'System Governance', roles: ['owner'] },
    { id: 'categories', label: 'Categories Manager', icon: FolderOpen, section: 'System Governance', roles: ['owner'] },

    // Account & Settings
    { id: 'settings', label: 'Platform Settings', icon: Sliders, section: 'Account & Settings', roles: ['owner'] },
    { id: 'profile', label: 'My Profile', icon: User, section: 'Account & Settings', roles: ['owner', 'member'] },
    { id: 'app-settings', label: 'App Settings', icon: SettingsIcon, section: 'Account & Settings', roles: ['owner', 'member'] },
    { id: 'about-app', label: 'About & Updates', icon: Info, section: 'Account & Settings', roles: ['owner', 'member'] },
  ], []);

  const navLinks = useMemo(() => {
    return allNavLinks.filter(link => link.roles.includes(currentRole));
  }, [allNavLinks, currentRole]);

  const [hubConfig, setHubConfig] = useState(defaultSettings);

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        setHubConfig({
          hubName: localStorage.getItem('platform_name') || "MANMADHAN'S HUB",
          founder: localStorage.getItem('platform_founder') || "Manmadhan"
        });

        const storedUsername = localStorage.getItem("user_name");
        const rawRole = localStorage.getItem("user_role") || "";
        const role = rawRole.toLowerCase().includes('owner') ? 'owner' : 'member';

        if (storedUsername) {
          setUser((prev: any) => prev ? { ...prev, username: storedUsername, displayName: storedUsername } : { role, username: storedUsername, displayName: storedUsername });
        }

        const storedTheme = localStorage.getItem('theme') || 'dark';
        const storedThemeColor = localStorage.getItem('theme-color') || 'Neon Green';
        document.documentElement.setAttribute('data-theme', storedTheme);
        document.documentElement.setAttribute('data-theme-color', storedThemeColor);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const handleTabChange = (tabId: string) => {
    if (activeTab === 'add-tools' && tabId !== 'add-tools' && typeof window !== 'undefined' && (window as any).isAddToolsDirty) {
      openConfirm({
        title: 'Abort Tool Integration',
        message: 'Are you sure you want to abort the tool integration? All entered details will be lost.',
        confirmText: 'Abort Integration',
        cancelText: 'Continue Editing',
        variant: 'warning',
        onConfirm: () => {
          if (typeof window !== 'undefined') (window as any).isAddToolsDirty = false;
          if (tabId !== activeTab) {
            setPrevTab(activeTab);
            localStorage.setItem("dashboard_prev_tab", activeTab);
          }
          performTabChange(tabId);
        }
      });
      return;
    }
    if (tabId !== activeTab) {
      setPrevTab(activeTab);
      localStorage.setItem("dashboard_prev_tab", activeTab);
    }
    performTabChange(tabId);
  };

  const performTabChange = (tabId: string) => {
    const preserveFilterTabs = ['ai-tools', 'category-tools', 'tool-details', 'explore-categories', 'search-ai'];
    if (!preserveFilterTabs.includes(tabId)) {
      setInitialToolFilter('all');
      localStorage.setItem("dashboard_initial_tool_filter", 'all');
    }
    setActiveTab(tabId);
    window.location.hash = tabId;
    localStorage.setItem("dashboard_active_tab", tabId);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleExploreCategory = (categoryName: string) => {
    setInitialToolFilter(categoryName);
    localStorage.setItem("dashboard_initial_tool_filter", categoryName);
    setPrevTab('explore-categories');
    localStorage.setItem("dashboard_prev_tab", 'explore-categories');
    setActiveTab('category-tools');
    window.location.hash = 'category-tools';
    localStorage.setItem("dashboard_active_tab", 'category-tools');
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    if (activeTab === 'add-tools' && typeof window !== 'undefined' && (window as any).isAddToolsDirty) {
      openConfirm({
        title: 'Abort Tool Integration',
        message: 'Are you sure you want to abort the tool integration and logout? All entered details will be lost.',
        confirmText: 'Abort & Logout',
        cancelText: 'Continue Editing',
        variant: 'warning',
        onConfirm: () => {
          if (typeof window !== 'undefined') (window as any).isAddToolsDirty = false;
          performLogout();
        }
      });
      return;
    }
    performLogout();
  };

  const performLogout = () => {
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("session_active_flag");
    localStorage.removeItem("session_start_time");
    sessionStorage.removeItem("session_active");
    localStorage.removeItem("dashboard_active_tab");
    localStorage.removeItem("dashboard_prev_tab");
    localStorage.removeItem("dashboard_selected_tool_id");
    localStorage.removeItem("dashboard_initial_tool_filter");
    localStorage.removeItem("landing_search_query");
    window.location.replace("/");
  };

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return navLinks.filter(link =>
      link.label.toLowerCase().includes(query) ||
      link.section.toLowerCase().includes(query)
    );
  }, [searchQuery, navLinks]);

  useEffect(() => {
    if (searchQuery.length > 0 && filteredResults.length > 0) {
      setIsSearchDropdownOpen(true);
      setSelectedIndex(0);
    } else {
      setIsSearchDropdownOpen(false);
      setSelectedIndex(-1);
    }
  }, [searchQuery, filteredResults]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const allowedLinks = [
        'overview', 'analytics', 'identities', 'ai-tools', 'invitations', 'security', 'audit',
        'categories', 'flags', 'status', 'backup', 'settings', 'compare', 'search-ai',
        'daily-ai', 'explore-tools', 'explore-categories',
        'category-tools',
        'collections', 'saved', 'tool-details', 'profile', 'account-center', 'games',
        'add-tools', 'system-notes', 'my-registry', 'notifications', 'app-settings'
      ];
      if (hash && allowedLinks.includes(hash)) {
        setActiveTab(hash);
        localStorage.setItem("dashboard_active_tab", hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const preventBackspaceNav = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        const isEditable = target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        );
        if (!isEditable) e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventBackspaceNav);
    return () => window.removeEventListener('keydown', preventBackspaceNav);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchDropdownOpen || filteredResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (target) {
        handleTabChange(target.id);
        setSearchQuery('');
        setIsSearchDropdownOpen(false);
        searchInputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      setIsSearchDropdownOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Section accent colors
  const sectionConfig: Record<string, { color: string; dot: string; bg: string; border: string }> = {
    'Dashboard Hub': { color: 'text-[var(--neon)]', dot: 'bg-[var(--neon)]', bg: 'from-[var(--neon)]/10', border: 'border-[var(--neon)]/20' },
    'AI Workspace': { color: 'text-[var(--emerald)]', dot: 'bg-[var(--emerald)]', bg: 'from-[var(--emerald)]/10', border: 'border-[var(--emerald)]/20' },
    'Operator Registry': { color: 'text-[var(--mint)]', dot: 'bg-[var(--mint)]', bg: 'from-[var(--mint)]/10', border: 'border-[var(--mint)]/20' },
    'Features & Notes': { color: 'text-[var(--neon)]', dot: 'bg-[var(--neon)]', bg: 'from-[var(--neon)]/10', border: 'border-[var(--neon)]/20' },
    'Hub Entertainment': { color: 'text-[var(--emerald)]', dot: 'bg-[var(--emerald)]', bg: 'from-[var(--emerald)]/10', border: 'border-[var(--emerald)]/20' },
    'System Governance': { color: 'text-[var(--mint)]', dot: 'bg-[var(--mint)]', bg: 'from-[var(--mint)]/10', border: 'border-[var(--mint)]/20' },
    'Account & Settings': { color: 'text-[var(--neon)]', dot: 'bg-[var(--neon)]', bg: 'from-[var(--neon)]/10', border: 'border-[var(--neon)]/20' },
  };

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[var(--bg)] text-[var(--text)] flex relative font-sans selection:bg-[var(--neon)]/30">
      <AppLockOverlay />
      
      {/* ── Ambient Background Mesh ────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--neon)]/[0.07] blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[var(--emerald)]/[0.05] blur-[130px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--mint)]/[0.05] blur-[100px] animate-[pulse_12s_ease-in-out_infinite]" />
      </div>

      {/* ── Mobile Sidebar Backdrop ──────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1900]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/*  PREMIUM SIDEBAR                                               */}
      {/* ============================================================== */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 h-screen flex flex-col 
          bg-[var(--bg)]/95 lg:bg-[var(--bg)]/60 backdrop-blur-3xl
          border-r border-[var(--border2)] 
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[2000] shrink-0 overflow-hidden
          ${isSidebarOpen ? 'w-[80vw] sm:w-[20rem] lg:w-[17.5rem] translate-x-0 shadow-[4px_0_30px_rgba(0,0,0,0.05)]' : 'w-[80vw] lg:w-[4.5rem] -translate-x-full lg:translate-x-0 shadow-none'}`}
      >
        {/* -- Sidebar Header / Logo -- */}
        <div
          className="px-4 flex items-center justify-between shrink-0 border-b border-[var(--border)] relative overflow-hidden group"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            minHeight: "calc(80px + env(safe-area-inset-top))",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon)]/0 via-[var(--neon)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div
            className="flex items-center gap-3 cursor-pointer group relative z-10 flex-1 min-w-0"
            onClick={() => handleTabChange('overview')}
          >
            <div className="relative shrink-0">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-[var(--neon)]/20 bg-[var(--bg3)] flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="Hub Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-royal font-black text-[14px] text-[var(--text)] tracking-[0.5px] whitespace-nowrap truncate leading-none">
                  {hubConfig.hubName}
                </span>
                <span className="text-[8px] font-bold text-[var(--neon)] uppercase tracking-[0.2em] mt-1 font-mono opacity-70">
                  Mission Control v3.0
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          {isMobile && isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-black/[0.06] dark:hover:bg-white/[0.06] border border-transparent hover:border-[var(--border2)] transition-all text-[var(--muted)] hover:text-[var(--text)] cursor-pointer shrink-0 relative z-10"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* -- Sidebar Navigation Links -- */}
        <nav className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-3 space-y-6">
          {Object.keys(sectionConfig)
            .filter(section => navLinks.some(link => link.section === section))
            .map((section) => {
              const sectionLinks = navLinks.filter(link => link.section === section);

              return (
                <div key={section} className="space-y-1">
                  {/* Minimal Section Header */}
                  {isSidebarOpen && (
                    <div className="px-3 pb-1">
                      <span className="text-[10px] font-semibold text-[var(--muted2)] uppercase tracking-wider">
                        {section}
                      </span>
                    </div>
                  )}

                  {/* Navigation items */}
                  <div className="space-y-0.5">
                    {sectionLinks.map((link: any) => {
                      const isActive = activeTab === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => handleTabChange(link.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer
                              ${isActive
                              ? 'bg-[var(--bg3)] text-[var(--text)] font-medium'
                              : 'text-[var(--muted)] hover:bg-[var(--bg2)] border border-transparent'
                            }`}
                          title={!isSidebarOpen ? link.label : undefined}
                        >
                          <link.icon
                            className={`w-4 h-4 shrink-0 transition-colors duration-150
                                ${isActive ? 'text-[var(--neon)]' : 'text-[var(--muted2)]'}`}
                          />

                          {isSidebarOpen && (
                            <span className="text-[13px] whitespace-nowrap truncate flex-1 text-left">
                              {link.label}
                            </span>
                          )}

                          {isSidebarOpen && link.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--bg3)] text-[var(--muted)]">
                              {link.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </nav>

        {/* -- Sidebar Footer -- */}
        <div className="p-3 shrink-0 border-t border-[var(--border)]">
          <div className={`relative overflow-hidden ${!isSidebarOpen ? 'p-2 flex flex-col gap-3 items-center justify-center' : 'p-3'}`}>
            {isSidebarOpen ? (
              <div className="flex items-center justify-between relative z-10 w-full">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] p-[1.5px]">
                      <div className="w-full h-full rounded-[13px] bg-[var(--bg)] flex items-center justify-center">
                        <User className="w-4 h-4 text-[var(--neon)]" />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--neon)] border-2 border-[var(--bg)]" />
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="text-[11px] font-black bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 dark:from-amber-200 dark:via-yellow-400 dark:to-orange-500 bg-clip-text text-transparent truncate uppercase tracking-widest leading-none mb-1">
                      {displayUsername}
                    </p>
                    <p className="text-[9px] font-bold text-[var(--neon)] uppercase tracking-widest leading-none opacity-80">
                      {currentRole === 'owner' ? '⚡ Super Admin' : currentRole === 'owner' ? '🛡 Admin' : '👤 User'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-[var(--bg3)] flex items-center justify-center border border-[var(--border2)]">
                  <User className="w-4 h-4 text-[var(--neon)]" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 mt-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-red-500/20"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/*  MAIN CONTENT AREA                                            */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 min-h-0">

        {/* ========================================================== */}
        {/*  PREMIUM FLOATING HEADER                                   */}
        {/* ========================================================== */}
        <header
          className="w-full shrink-0 transition-all duration-300 sticky top-0 z-[1000] bg-[var(--bg)]"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            minHeight: "calc(64px + env(safe-area-inset-top))",
          }}
        >
          <div className="relative h-16 md:h-[4.5rem] px-4 md:px-5 flex items-center justify-between gap-3
            border-b border-[var(--border2)]">

            {/* ── Left: Menu Toggle + Page Title ─────────────────────── */}
            <div className="flex items-center gap-3 min-w-0 shrink-0 relative z-10">
              <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                whileTap={{ scale: 0.92 }}
                className="p-2.5 rounded-xl hover:bg-white/[0.07] active:scale-95 transition-all cursor-pointer group
                  border border-transparent hover:border-[var(--border2)] shrink-0"
              >
                <AnimatePresence mode="wait">
                  {isSidebarOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--text)] transition-colors" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--text)] transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Page title + breadcrumb */}
              <div className="hidden sm:flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[16px] md:text-[18px] font-black text-[var(--text)] tracking-tight truncate leading-none">
                    {navLinks.find(l => l.id === activeTab)?.label || 'Terminal'}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[var(--text)] opacity-80 uppercase tracking-[0.2em] mt-1 font-mono">
                  Active Protocol Node
                </span>
              </div>
            </div>

            {/* ── Center: Premium Search ──────────────────────────────── */}
            <div ref={searchContainerRef} className="flex-1 max-w-sm lg:max-w-lg mx-2 md:mx-4 relative hidden md:block z-10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--neon)] transition-colors z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search modules... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => {
                    if (searchQuery.length > 0 && filteredResults.length > 0) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  className="w-full h-10 pl-11 pr-14 rounded-2xl
                    bg-[var(--bg3)]/60 backdrop-blur-md
                    border border-[var(--border2)]
                    text-[12px] font-semibold text-[var(--text)]
                    placeholder:text-[var(--muted2)]
                    focus:outline-none focus:border-[var(--neon)]/50 focus:bg-[var(--bg3)]/80
                    focus:shadow-[0_0_0_2px_rgba(var(--particle-rgb),0.1)]
                    transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded-[6px] bg-white/[0.04] border border-[var(--border2)] text-[9px] font-bold text-[var(--muted2)] leading-none shadow-sm">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Search dropdown */}
              <AnimatePresence>
                {isSearchDropdownOpen && filteredResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-[calc(100%+0.5rem)] left-0 right-0
                      bg-[var(--bg2)]
                      border border-[var(--border2)]
                      rounded-2xl overflow-hidden
                      shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                      z-[500] ring-1 ring-white/[0.04]"
                  >
                    <div className="px-4 pt-3 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                      <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.22em] flex items-center gap-2 font-mono">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                        Quick Navigate
                      </span>
                    </div>
                    <div className="max-h-[55vh] overflow-y-auto no-scrollbar py-2 px-2 space-y-0.5">
                      {filteredResults.map((result, idx) => {
                        const Icon = result.icon;
                        return (
                          <button
                            key={result.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleTabChange(result.id);
                              setSearchQuery('');
                              setIsSearchDropdownOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden
                              ${idx === selectedIndex
                                ? 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--text)] border border-[var(--border2)]'
                                : 'text-[var(--muted)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:text-[var(--text)] border border-transparent'
                              }`}
                          >
                            {idx === selectedIndex && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--neon)] rounded-r-full" />
                            )}
                            <div className={`p-2 rounded-xl shrink-0 transition-all ${idx === selectedIndex ? 'bg-[var(--neon)]/15 text-[var(--neon)]' : 'bg-black/[0.02] dark:bg-white/[0.03] text-[var(--muted)]'}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[12px] font-semibold tracking-wide truncate">{result.label}</span>
                              <span className="text-[9px] font-medium text-[var(--muted2)] uppercase tracking-widest mt-0.5">{result.section}</span>
                            </div>
                            {idx === selectedIndex && (
                              <span className="ml-auto text-[9px] font-black text-[var(--neon)] uppercase tracking-widest shrink-0 flex items-center gap-1 bg-[var(--neon)]/10 px-2 py-1 rounded-lg">
                                <span className="text-[11px] leading-none">↵</span> Enter
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: KPI + Clock + Notifications + Profile ───────── */}
            {/* ── Right: Notifications + Profile ───────── */}
            <div className="flex items-center gap-4 shrink-0 relative z-10">

              {/* Notification Heart (Direct Link) */}
              <div className="relative">
                <button
                  onClick={() => handleTabChange('notifications')}
                  className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
                >
                  <Heart className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[var(--bg)]" />
                  )}
                </button>
              </div>

              {/* Profile Avatar */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-300" />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="fixed right-4 left-auto top-20 sm:absolute sm:right-0 sm:top-[calc(100%+0.5rem)] sm:w-[15rem]
                        bg-[var(--card-bg)]/95 backdrop-blur-3xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[var(--border2)] z-[2000] overflow-hidden"
                    >
                      <div className="px-5 pt-5 pb-4">
                        <span className="block text-[16px] font-black text-[var(--text)] tracking-tight truncate">{displayUsername}</span>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]/20">
                          {currentRole === 'owner' ? 'Owner' : 'Member'}
                        </span>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent w-full" />

                      <div className="p-3 space-y-2">
                        {[
                          { id: 'profile', icon: User, label: 'Profile' },
                          { id: 'account-center', icon: ShieldCheck, label: 'Security' },
                          ...(currentRole === 'owner' ? [{ id: 'settings', icon: SettingsIcon, label: 'Settings' }] : []),
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => { handleTabChange(item.id); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-[var(--border)]/50 hover:border-[var(--neon)]/40 bg-[var(--bg)]/30 hover:bg-[var(--bg)] text-[13px] font-bold text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer text-left group shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                          >
                            <item.icon className="w-4 h-4 text-[var(--muted2)] group-hover:text-[var(--neon)] transition-colors" />
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent w-full" />

                      <div className="p-3">
                        <button
                          onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10 text-[13px] font-bold text-rose-400 hover:text-rose-300 transition-all cursor-pointer text-left group shadow-sm hover:shadow-rose-500/5"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================== */}
        {/*  CONTENT AREA                                              */}
        {/* ========================================================== */}
        <main className={`flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth ${activeTab === 'notifications' ? 'p-0' : 'p-3 md:p-4 pt-3 pb-0'}`}>
          <AnimatePresence mode="wait">
            {isBooting ? (
              <motion.div
                key="boot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="h-full flex flex-col items-center justify-center space-y-8"
              >
                {/* Premium boot loader */}
                <div className="relative">
                  <div className="w-24 h-24 relative">
                    {/* Outer ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-[var(--neon)]/10 border-t-[var(--neon)] border-r-[var(--neon)]/40"
                    />
                    {/* Middle ring */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 rounded-full border border-blue-500/10 border-t-blue-500/60"
                    />
                    {/* Inner icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                      </div>
                    </div>
                  </div>
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-full bg-[var(--neon)]/10 blur-xl" />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <p className="text-[11px] font-black text-[var(--neon)] uppercase tracking-[0.4em] animate-pulse font-mono">
                    Synchronizing Protocols
                  </p>
                  {/* Progress bar */}
                  <div className="w-48 h-1 bg-[var(--glass)] rounded-full overflow-hidden border border-[var(--border2)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[var(--neon)] to-blue-500 rounded-full"
                    />
                  </div>
                  <p className="text-[8px] font-bold text-[var(--muted2)] uppercase tracking-[0.3em] font-mono">
                    {hubConfig.hubName} v3.0
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col min-h-0 relative"
              >
                {activeTab === 'overview' && <Overview username={displayUsername} role={currentRole} onTabChange={handleTabChange} />}
                {activeTab === 'ai-tools' && <ToolManagement initialCategory={initialToolFilter} />}
                {activeTab === 'categories' && <CategoryManagement />}
                {activeTab === 'invitations' && <InvitationCenter onBack={() => handleTabChange('settings')} />}
                {activeTab === 'security' && <SecurityLog />}
                {activeTab === 'audit' && <AuditLog />}
                {activeTab === 'flags' && <FeatureFlags />}
                {activeTab === 'status' && <SystemStatus />}
                {activeTab === 'backup' && (currentRole === 'owner' || currentRole === 'owner') && <BackupRecovery />}
                {activeTab === 'settings' && <PlatformSettings onTabChange={handleTabChange} />}
                {activeTab === 'app-settings' && <AppSettings onTabChange={handleTabChange} role={currentRole} />}
                {activeTab === 'about-app' && <AboutApp />}
                {activeTab === 'compare' && <CompareTools initialTools={toolsToCompare} />}
                {activeTab === 'search-ai' && <SearchAITools initialCategory={initialToolFilter} initialSearchQuery={initialToolSearchQuery} onViewDetails={handleViewDetails} onCompareTools={(ids) => { setToolsToCompare(ids); setActiveTab('compare'); window.location.hash = 'compare'; localStorage.setItem('dashboard_active_tab', 'compare'); }} />}
                {activeTab === 'daily-ai' && <DailyAITools onViewDetails={handleViewDetails} onTabChange={handleTabChange} />}
                {activeTab === 'explore-tools' && <ExploreTools onViewDetails={handleViewDetails} />}
                {activeTab === 'explore-categories' && <ExploreCategories onExploreCategory={handleExploreCategory} />}
                {activeTab === 'category-tools' && (
                  <CategoryToolsView
                    categoryName={initialToolFilter}
                    onViewDetails={handleViewDetails}
                    onBack={() => handleTabChange('explore-categories')}
                  />
                )}
                {activeTab === 'collections' && <MyCollections onViewDetails={handleViewDetails} />}
                {activeTab === 'saved' && <SavedTools onViewDetails={handleViewDetails} />}
                {activeTab === 'tool-details' && selectedToolId && <ToolDetails toolId={selectedToolId} onBack={() => handleTabChange(prevTab)} onSelectTool={handleViewDetails} />}
                {activeTab === 'profile' && <Profile onTabChange={handleTabChange} onBack={() => handleTabChange(prevTab || 'overview')} />}
                {activeTab === 'system-notes' && <NotepadWidget />}
                {activeTab === 'account-center' && <SecuritySettings onTabChange={handleTabChange} onBack={() => handleTabChange(prevTab || 'overview')} />}
                {activeTab === 'notifications' && <NotificationCenter notifications={notifications} setNotifications={setNotifications} onBack={() => handleTabChange(prevTab || 'overview')} />}
                {activeTab === 'manmadhan-movie' && <ManmadhanMovie />}
                {activeTab === 'games' && <HubGames />}
                {activeTab === 'add-tools' && <AddTools />}
                {activeTab === 'my-registry' && <MyRegistry />}
                {activeTab === 'upload-history' && <UploadHistory />}
                {!['overview', 'analytics', 'identities', 'ai-tools', 'invitations', 'security', 'audit', 'categories', 'flags', 'status', 'backup', 'settings', 'app-settings', 'about-app', 'compare', 'search-ai', 'daily-ai', 'explore-tools', 'explore-categories', 'category-tools', 'collections', 'saved', 'tool-details', 'profile', 'account-center', 'notifications', 'manmadhan-movie', 'games', 'add-tools', 'system-notes', 'my-registry', 'upload-history'].includes(activeTab) && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[var(--card-bg)]/50 rounded-3xl border border-[var(--border2)]">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--glass)] flex items-center justify-center mb-6 border border-[var(--border2)]">
                      <Terminal className="w-10 h-10 text-[var(--muted)]" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--muted)]">Module Under Construction</h2>
                    <p className="text-[var(--muted2)] text-[10px] font-bold uppercase tracking-widest italic mt-2">{activeTab.replace('-', ' ')} protocol not yet active.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <ConfirmModal {...confirmModalProps} />
      </div>
    </div>
  );
}
