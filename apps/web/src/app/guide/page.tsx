'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Search, ArrowLeft, Shield, Sparkles, Terminal, 
  Activity, Bookmark, Compass, Sliders, Bell, RefreshCw, 
  Archive, Percent, FileText, Settings, Radio, ChevronRight, Info, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideSection {
  id: string;
  num: string;
  title: string;
  icon: React.ReactNode;
  category: string;
  content: React.ReactNode;
}

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('access-model');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections: GuideSection[] = useMemo(() => [
    {
      id: 'access-model',
      num: '01',
      title: 'Access Model & Invitation System',
      icon: <Shield className="w-5 h-5" />,
      category: 'Security',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Manmadhan's Hub operates as a **private, invitation-only AI tool universe**. The landing index page is the only public-facing page. Search engines are explicitly blocked from crawling or indexing user workspace nodes via standard crawler rules.
          </p>
          
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-strong/30 space-y-2">
            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">🔒 Admin invitation control</span>
            <p className="text-[12px] leading-relaxed text-text-secondary">
              Only authorized Admins can generate invitation links. Each invitation link is bound to a single-use UUID token in the database, pre-configured with a specific target email address.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-bg/40 border border-warning/20">
            <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-text-secondary">
              <strong className="text-warning font-semibold uppercase font-mono block mb-1">Expiration Rule</strong>
              Invitations automatically self-destruct after 7 days if unredeemed. Admins can audit invitation states (`pending`, `accepted`, `expired`, `revoked`) and revoke pending keys instantly from the Admin Console.
            </div>
          </div>

          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mt-4">Invite Template Formats</h3>
          <p className="text-[13px] text-text-secondary">
            To simplify onboarding, generated tokens are auto-formatted into copying templates optimized for instant dispatch via **WhatsApp** or **Telegram**.
          </p>
        </div>
      )
    },
    {
      id: 'onboarding-flow',
      num: '02',
      title: 'Workspace Onboarding Flow',
      icon: <Sliders className="w-5 h-5" />,
      category: 'Security',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Onboarding paths are managed inside the unified login modal. Credentials checks run on both client-side and server-side nodes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="p-4 rounded-xl bg-bg-tertiary border border-border-default space-y-2">
              <h4 className="text-xs font-mono font-bold text-accent uppercase">Admin Flow (3 Steps)</h4>
              <ol className="list-decimal pl-4 text-xs text-text-secondary space-y-1">
                <li>Email + default credentials verification.</li>
                <li>Forced password reset (bcrypt hash, min 8 chars, 1 number, 1 special char).</li>
                <li>Cinematic core dashboard entry.</li>
              </ol>
            </div>
            <div className="p-4 rounded-xl bg-bg-tertiary border border-border-default space-y-2">
              <h4 className="text-xs font-mono font-bold text-accent uppercase">User Flow (4 Steps)</h4>
              <ol className="list-decimal pl-4 text-xs text-text-secondary space-y-1">
                <li>Email + invitation credentials check.</li>
                <li>Forced password strength update.</li>
                <li>Acceptance of Terms & Conditions via SlideToConfirm.</li>
                <li>Core dashboard loading.</li>
              </ol>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-error-bg/40 border border-error/20">
            <Shield className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-text-secondary">
              <strong className="text-error font-semibold uppercase font-mono block mb-1">Brute-Force Lockout Protection</strong>
              Five (5) consecutive failed credentials verification attempts triggers an automatic 15-minute IP-bound lockout, logged directly to the Platform Security Console.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'search-console',
      num: '03',
      title: 'Interactive Search Console',
      icon: <Search className="w-5 h-5" />,
      category: 'Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            The **Smart Search Console** facilitates instant indexing searches. Query execution delivers results under 50ms, utilizing a robust client-side filter engine with fallback support to Meilisearch cloud nodes.
          </p>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-info-bg/40 border border-info/20">
            <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-text-secondary font-sans">
              <strong className="text-info font-semibold uppercase font-mono block mb-1">Interface Controls</strong>
              Pressing <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded border border-border-strong text-[10px]">Cmd+F</kbd> or <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded border border-border-strong text-[10px]">Ctrl+F</kbd> locks the viewport onto the search field instantly.
            </div>
          </div>

          <p className="text-[13px] text-text-secondary leading-relaxed">
            Search inputs parse tool name tags, description keywords, and category matches. Clicking category filters (Writing, Code, Image Gen, Audio AI, Research, Video AI, UI Gen) updates state hooks dynamically, executing animations on matching cards.
          </p>
        </div>
      )
    },
    {
      id: 'compare-station',
      num: '04',
      title: 'Compare Station Telemetry',
      icon: <Activity className="w-5 h-5" />,
      category: 'Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Evaluate performance metrics side-by-side for up to 4 selected models inside the **Compare Station**. Comparison data wraps as shareable JSON keys.
          </p>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-strong/30 space-y-3">
            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">📊 Evaluated Telemetries</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-text-secondary">
              <div><strong className="text-text-primary block">1. Compute Speed</strong> Speed comparison bar charting response calculations.</div>
              <div><strong className="text-text-primary block">2. Output Quality</strong> Evaluates precision of generated text or art assets.</div>
              <div><strong className="text-text-primary block">3. Ease of Integration</strong> API endpoints compatibility and SDK setup times.</div>
              <div><strong className="text-text-primary block">4. Cost-Efficiency</strong> Pricing ratios computed against license tokens.</div>
            </div>
          </div>

          <p className="text-[13px] text-text-secondary">
            Completed comparison tables can be saved to your dashboard history (retaining the last 5 sessions) and exported as formatted Markdown or PDF sheets.
          </p>
        </div>
      )
    },
    {
      id: 'bookmarks-collections',
      num: '05',
      title: 'Personal Bookmarks & Collections',
      icon: <Bookmark className="w-5 h-5" />,
      category: 'Workspace',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Keep track of your development stack using Bookmarks and custom Collections.
          </p>
          
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Clicking the bookmark badge on any card indexes that node to your quick-access panel. Under `/collections`, developers can create folders, group tools, arrange cards by drag-and-drop actions, and share stacks via link keys.
          </p>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-info-bg/40 border border-info/20">
            <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-text-secondary">
              <strong className="text-info font-semibold uppercase font-mono block mb-1">Offline Syncing</strong>
              Bookmarked states cache locally within the browser workspace. The moment network connectivity returns, updates merge into the cloud database schema automatically.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'workflow-builder',
      num: '06',
      title: 'Workflow Builder Node',
      icon: <Terminal className="w-5 h-5" />,
      category: 'Workspace',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            The **Workflow Builder** is an advanced block workspace that chain-links multiple AI tools. Developers can pipe input/output boundaries of different models together.
          </p>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-default font-mono text-xs text-text-secondary space-y-1">
            <div className="text-accent">// Example Pipeline JSON</div>
            <div>{"{"}</div>
            <div className="pl-4">"step_1": "chatgpt_output",</div>
            <div className="pl-4">"pipe_to": "elevenlabs_tts_input",</div>
            <div className="pl-4">"output_format": "audio_wav"</div>
            <div>{"}"}</div>
          </div>

          <p className="text-xs text-text-muted">
            Workflows are drag-and-drop enabled, compile schemas, and allow automated execution.
          </p>
        </div>
      )
    },
    {
      id: 'tool-schema',
      num: '07',
      title: 'Tool Details & Schema',
      icon: <FileText className="w-5 h-5" />,
      category: 'Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Every AI tool entry matches a strict schema in Drizzle ORM containing 35+ fields, storing extended records for visual renders.
          </p>

          <div className="overflow-x-auto my-2 border border-border-subtle rounded-xl bg-bg-tertiary">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-border-strong/20 bg-bg-secondary/40 text-text-muted uppercase">
                  <th className="p-3">Field Key</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Constraint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-secondary">
                <tr>
                  <td className="p-3 text-accent font-semibold">id</td>
                  <td className="p-3">UUID</td>
                  <td className="p-3">PRIMARY KEY</td>
                </tr>
                <tr>
                  <td className="p-3 text-accent font-semibold">slug</td>
                  <td className="p-3">varchar(255)</td>
                  <td className="p-3">UNIQUE, INDEXED</td>
                </tr>
                <tr>
                  <td className="p-3 text-accent font-semibold">pricing_type</td>
                  <td className="p-3">enum</td>
                  <td className="p-3">Free, Freemium, Paid</td>
                </tr>
                <tr>
                  <td className="p-3 text-accent font-semibold">extended_fields</td>
                  <td className="p-3">jsonb</td>
                  <td className="p-3">OPTIONAL METADATA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'cloudinary-assets',
      num: '08',
      title: 'Cloudinary Asset Management',
      icon: <Compass className="w-5 h-5" />,
      category: 'Infrastructure',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            All brand logos and user screenshot uploads write to **Cloudinary CDN** nodes. This offloads static assets from the Next.js server, optimizing first-contentful-paint speeds.
          </p>
          
          <ul className="list-disc pl-5 text-xs text-text-secondary space-y-1">
            <li>Automated conversion to WebP formats.</li>
            <li>Automatic scaling: logos resize to 200x200px, screenshots adapt to screen widths dynamically.</li>
            <li>Asset delivery routed via Cloudinary Edge nodes for fast load performance globally.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'autotag-agent',
      num: '09',
      title: 'GPT Auto-Tag Agent',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'Infrastructure',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            The **GPT Auto-Tag Agent** validates tool submission parameters, generating descriptive metadata, category bindings, search keywords, and affected job roles using OpenAI.
          </p>

          <div className="p-4 rounded-xl bg-success-bg/40 border border-success/20 space-y-1">
            <span className="text-[10px] font-mono font-bold text-success uppercase tracking-wider block">⚙️ Auto-Tag Sequence</span>
            <p className="text-[12px] text-text-secondary">
              Submission triggers API parsing &rarr; GPT models analyze description text &rarr; Metadata yields return JSON &rarr; Admin verifies suggestions on a confirmation page &rarr; Saves to production.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'daily-curation',
      num: '10',
      title: 'Daily AI Digest & Curation',
      icon: <RefreshCw className="w-5 h-5" />,
      category: 'Infrastructure',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            A background agent queries new AI models and releases daily. Discovered listings undergo duplicate detection audits (URL normalization and fuzzy text similarity calculations).
          </p>

          <p className="text-[13px] text-text-secondary">
            Approved discoveries populate the **Daily AI Digest** pushed to user notification nodes at 08:00 UTC, providing quick summaries of new capabilities and pricing transitions.
          </p>
        </div>
      )
    },
    {
      id: 'realtime-notif',
      num: '11',
      title: 'Real-time Notifications (Socket.IO)',
      icon: <Bell className="w-5 h-5" />,
      category: 'Infrastructure',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            WebSocket connections powered by **Socket.IO** push system status alerts and countdown metrics in real time.
          </p>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-bg/40 border border-warning/20">
            <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-text-secondary">
              <strong className="text-warning font-semibold uppercase font-mono block mb-1">SSE Fallback Connection</strong>
              If corporate proxy firewalls block WebSockets, the Hub falls back to **Server-Sent Events (SSE)** dynamically to prevent packet loss.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'health-monitor',
      num: '12',
      title: 'Tool Health Monitor',
      icon: <Radio className="w-5 h-5" />,
      category: 'Infrastructure',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Uptime verification is handled by **BullMQ health workers** that poll website URLs every 6 hours.
          </p>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-default space-y-2">
            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">📶 Uptime Status Definitions</span>
            <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
              <li><strong className="text-success">Active:</strong> Target returns 2xx status code within 3 seconds.</li>
              <li><strong className="text-warning">Degraded:</strong> Target returns 2xx status code with latency exceeding 3 seconds.</li>
              <li><strong className="text-error">Down:</strong> Target returns network timeouts or 4xx/5xx status codes.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'tool-graveyard',
      num: '13',
      title: 'Tool Graveyard Archive',
      icon: <Archive className="w-5 h-5" />,
      category: 'Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            AI products that are shut down are retained as read-only archives under the **Tool Graveyard** (`/graveyard`).
          </p>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            This trust layer provides developers with historical data on discontinued tools (including reason logs, death date records, and alternate suggestions), eliminating the confusion of broken URLs.
          </p>
        </div>
      )
    },
    {
      id: 'mcp-directory',
      num: '14',
      title: 'Model Context Protocol (MCP)',
      icon: <Terminal className="w-5 h-5" />,
      category: 'Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            The Model Context Protocol connects LLM clients directly to external data sources. The Hub hosts a verified directory of compatible servers.
          </p>
          <p className="text-[13px] text-text-secondary">
            MCP listings contain connection commands and configuration schemas (OAuth or API keys) that developers can copy and import directly into IDE clients like Cursor or Claude Desktop.
          </p>
        </div>
      )
    },
    {
      id: 'deals-discounts',
      num: '15',
      title: 'Live Deals & Discounts',
      icon: <Percent className="w-5 h-5" />,
      category: 'Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Browse verified, live promo codes and discount deals for AI tools. Bookmarking a tool automatically subscribes you to deal launch alerts.
          </p>
          <p className="text-[13px] text-text-secondary">
            Deals run on live countdown timers. Expired deals are disabled automatically.
          </p>
        </div>
      )
    },
    {
      id: 'audit-security-logs',
      num: '16',
      title: 'Audit Logs & Diagnostics',
      icon: <Shield className="w-5 h-5" />,
      category: 'Security',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            All user operations (add tools, promote users, modify settings) generate audit logs. Admins can audit these logs at `/admin/audit` to troubleshoot configuration changes.
          </p>
          <p className="text-[13px] text-text-secondary">
            Security logs record failed logins, IP blocks, concurrent session updates, and brute-force lockouts.
          </p>
        </div>
      )
    },
    {
      id: 'settings-impersonation',
      num: '17',
      title: 'Settings & Impersonation',
      icon: <Settings className="w-5 h-5" />,
      category: 'Security',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Modify personal profiles, customize dashboards, and revoke active sessions in the Settings panel.
          </p>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Admins have **user impersonation capabilities** to test workflows and help users resolve layout rendering bugs.
          </p>
        </div>
      )
    },
    {
      id: 'offline-pwa',
      num: '18',
      title: 'Offline PWA Service Worker',
      icon: <BookOpen className="w-5 h-5" />,
      category: 'Infrastructure',
      content: (
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            The Hub is configured as a fully offline-capable **Progressive Web App** using a Workbox-managed Service Worker.
          </p>
          <p className="text-[13px] text-text-secondary">
            The service worker caches tool entries, user guides, CSS files, and offline games. If network connectivity drops, the client continues to function from cache.
          </p>
        </div>
      )
    }
  ], []);

  const filteredSections = useMemo(() => 
    sections.filter(sec => 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.category.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, sections]);

  const activeSectionData = useMemo(() => 
    filteredSections.find(sec => sec.id === activeSection) || filteredSections[0],
    [filteredSections, activeSection]);

  const currentIndex = useMemo(() => {
    if (!activeSectionData) return -1;
    return sections.findIndex(sec => sec.id === activeSectionData.id);
  }, [sections, activeSectionData]);

  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <div className="h-screen w-screen bg-bg-primary text-text-primary font-sans overflow-hidden flex flex-col noise">
      
      {/* TOP HEADER */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border-subtle bg-bg-secondary/60 backdrop-blur-md shrink-0 relative z-20">
        
        {/* Left Side */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border-default group-hover:border-accent/40 transition-colors">
              <ArrowLeft className="w-4 h-4 text-accent transition-transform group-hover:-translate-x-0.5" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-bold text-xs text-text-secondary uppercase tracking-wider mt-0.5 group-hover:text-text-primary transition-colors">Return</span>
            </div>
          </Link>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
          <span className="font-mono text-[11px] sm:text-[13px] text-text-primary uppercase tracking-widest font-bold">
            Manmadhan's Hub
          </span>
        </div>
        
        {/* Right Side */}
        <div className="flex-1 flex justify-end items-center gap-2">
          {/* Mobile Index Trigger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border-default hover:border-accent/40 text-text-secondary hover:text-text-primary text-xs font-mono select-none cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-3.5 h-3.5 text-accent" /> : <Menu className="w-3.5 h-3.5 text-accent" />}
            <span className="hidden xs:inline">Index</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-dim border border-border-strong/30">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider hidden sm:inline">User Station Guide</span>
            <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider sm:hidden">Guide</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1400px] w-full mx-auto relative z-10">
        
        {/* DESKTOP SIDEBAR SEARCH & NAVIGATION */}
        <aside className="hidden lg:flex w-80 border-r border-border-subtle flex-col bg-bg-secondary/25 backdrop-blur-[2px] shrink-0">
          
          {/* SEARCH BOX */}
          <div className="p-4 border-b border-border-subtle">
            <div className="relative">
              <input
                type="text"
                placeholder="Search telemetry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-primary/50 border border-border-strong/60 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-text-primary outline-none focus:border-accent transition-colors placeholder:text-text-muted"
              />
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* SECTIONS LIST */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-150 border cursor-pointer group ${
                  activeSection === sec.id
                    ? "bg-accent-dim border-border-strong text-accent shadow-[0_0_15px_rgba(141,251,91,0.04)]"
                    : "bg-transparent border-transparent text-text-secondary hover:bg-bg-tertiary/40 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`font-mono text-[10px] shrink-0 ${activeSection === sec.id ? "text-accent" : "text-text-muted"}`}>
                    {sec.num}
                  </span>
                  <span className="text-xs font-semibold truncate leading-none">{sec.title}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${activeSection === sec.id ? "translate-x-0.5 text-accent" : "group-hover:translate-x-0.5"}`} />
              </button>
            ))}
            {filteredSections.length === 0 && (
              <div className="text-center py-10 font-mono text-[10px] text-text-muted">
                NO TELEMETRY RECORD MATCHES
              </div>
            )}
          </nav>
        </aside>

        {/* MOBILE DRAWER MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm top-16"
              />
              
              {/* Drawer panel */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-16 left-0 bottom-0 w-[270px] xs:w-80 max-w-[85vw] z-50 bg-bg-secondary/95 border-r border-border-strong/45 flex flex-col shadow-[0_0_20px_rgba(141,251,91,0.06)] backdrop-blur-xl"
              >
                {/* Search */}
                <div className="p-4 border-b border-border-subtle">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search telemetry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-bg-primary/50 border border-border-strong/60 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-text-primary outline-none focus:border-accent transition-colors placeholder:text-text-muted"
                    />
                    <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* List */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                  {filteredSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-150 border cursor-pointer ${
                        activeSection === sec.id
                          ? "bg-accent-dim border-border-strong text-accent"
                          : "bg-transparent border-transparent text-text-secondary hover:bg-bg-tertiary/40 hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`font-mono text-[10px] shrink-0 ${activeSection === sec.id ? "text-accent" : "text-text-muted"}`}>
                          {sec.num}
                        </span>
                        <span className="text-xs font-semibold truncate leading-none">{sec.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-5 md:p-10 bg-bg-primary/40 relative">
          
          <AnimatePresence mode="wait">
            {activeSectionData ? (
              <motion.div
                key={activeSectionData.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-w-3xl mx-auto space-y-8"
              >
                {/* Header Information */}
                <div className="border-b border-border-subtle pb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-bg-tertiary border border-border-default text-text-muted uppercase tracking-wider">
                      System {activeSectionData.num}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent-dim border border-border-strong/30 text-accent uppercase tracking-wider">
                      {activeSectionData.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-bg-secondary border border-border-strong text-accent shadow-[0_0_15px_rgba(141,251,91,0.06)] shrink-0">
                      {activeSectionData.icon}
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text-primary leading-tight">
                      {activeSectionData.title}
                    </h1>
                  </div>
                </div>

                {/* Section Content */}
                <div className="text-text-secondary leading-relaxed space-y-4 text-[13px] sm:text-[14px]">
                  {activeSectionData.content}
                </div>

                {/* Next/Previous Pagination block */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-border-subtle/50">
                  {prevSection ? (
                    <button
                      onClick={() => setActiveSection(prevSection.id)}
                      className="flex flex-col items-start gap-1 p-3 rounded-xl bg-bg-secondary/40 border border-border-subtle hover:border-accent/30 text-left transition-all cursor-pointer group flex-1 max-w-xs"
                    >
                      <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider group-hover:text-accent transition-colors">← Previous Section</span>
                      <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">{prevSection.title}</span>
                    </button>
                  ) : (
                    <div className="flex-1 max-w-xs hidden sm:block" />
                  )}

                  {nextSection ? (
                    <button
                      onClick={() => setActiveSection(nextSection.id)}
                      className="flex flex-col items-end gap-1 p-3 rounded-xl bg-accent-dim/20 hover:bg-accent-dim border border-border-strong/20 hover:border-accent text-right transition-all cursor-pointer group flex-1 max-w-xs sm:ml-auto"
                    >
                      <span className="font-mono text-[9px] text-accent uppercase tracking-wider">Next Section →</span>
                      <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">{nextSection.title}</span>
                    </button>
                  ) : (
                    <div className="flex-1 max-w-xs hidden sm:block" />
                  )}
                </div>

                {/* Technical diagnostics footer */}
                <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[9px] text-text-muted text-center sm:text-left">
                  <span>SECURE DIAGNOSTIC NODE: MM1107</span>
                  <span className="hidden xs:inline">INDEX_STATUS: ONLINE</span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-text-muted">
                SELECT A SYSTEM TELEMETRY TO AUDIT
              </div>
            )}
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
