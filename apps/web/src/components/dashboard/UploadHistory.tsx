"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ExternalLink, Activity, Box, Search, Download, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export const UploadHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { status: pushStatus, subscribe, unsubscribe } = usePushNotifications();

  useEffect(() => {
    const username = localStorage.getItem('user_name') || 'anonymous';
    const historyKey = `manmadhan_addtools_history_${username}`;
    // Migrate legacy key if exists and no user-scoped key yet
    if (!localStorage.getItem(historyKey)) {
      const legacy = localStorage.getItem('manmadhan_addtools_history');
      if (legacy) localStorage.setItem(historyKey, legacy);
    }
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { }
    }
  }, []);

  const handleExportJSON = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_uploads_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [['Name', 'URL', 'Description', 'Time']];
    history.forEach(item => rows.push([item.name || '', item.url || '', item.description || '', item.time || '']));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_uploads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const grouped = filteredHistory.reduce((acc, item) => {
    const dateStr = new Date(item.time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(item);
    return acc;
  }, {} as Record<string, typeof filteredHistory>);

  // Sort groups by date descending
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden font-sans pr-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* ── Header ── */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[var(--border)] mb-6">
        <div className="min-w-0 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--neon)] tracking-[2px] uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>SESSION HISTORY</span>
          </div>
          <h1 className="font-royal text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight flex items-center gap-3 leading-none">
            My Uploads
          </h1>
          <p className="text-[12px] md:text-[13px] font-medium text-[var(--muted)] tracking-wide">
            A chronological timeline of all AI tools you have added and integrated.
          </p>
        </div>
        {/* Export + Push buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[11px] font-bold text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--neon)]/50 transition-all"
                title="Export as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--neon)] text-black text-[11px] font-bold hover:opacity-90 transition-all shadow-sm"
                title="Export as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>
            </>
          )}
          {pushStatus !== 'unsupported' && (
            <button
              onClick={pushStatus === 'subscribed' ? unsubscribe : subscribe}
              disabled={pushStatus === 'loading' || pushStatus === 'denied'}
              title={pushStatus === 'subscribed' ? 'Disable push notifications' : pushStatus === 'denied' ? 'Notifications blocked in browser' : 'Enable offline push notifications'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                pushStatus === 'subscribed'
                  ? 'bg-[var(--neon)]/10 border-[var(--neon)]/40 text-[var(--neon)] hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400'
                  : pushStatus === 'denied'
                  ? 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted)] opacity-50 cursor-not-allowed'
                  : 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--neon)] hover:border-[var(--neon)]/50'
              }`}
            >
              {pushStatus === 'subscribed' ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              {pushStatus === 'subscribed' ? 'Push On' : pushStatus === 'denied' ? 'Blocked' : 'Enable Push'}
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex-none mb-6">
        <div className="relative w-full max-w-xl bg-[var(--card-bg)] p-1.5 rounded-[18px] border border-[var(--border)] shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
            <input
              type="text"
              placeholder="Search uploaded tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[46px] pl-11 pr-4 rounded-[13px] border-none bg-transparent text-[13px] font-medium text-[var(--text)] outline-none transition-all placeholder:text-[var(--muted2)] placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      {/* ── Timeline Grid ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12 flex flex-col">
        {sortedDates.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center px-6">
            <div className="w-20 h-20 rounded-[24px] bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm">
              <Box size={32} className="text-[var(--neon)] opacity-80" />
            </div>
            <p className="text-xl font-black tracking-tight text-[var(--text)] mb-2">No uploads found</p>
            <p className="text-[13px] font-medium text-[var(--muted)] tracking-wide max-w-xs">You haven't integrated any new tools yet, or they don't match your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((dateStr) => {
              // Sort items in a date by time descending
              const itemsForDate = grouped[dateStr].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

              return (
                <div key={dateStr} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[var(--border)] pb-3 sticky top-0 bg-[var(--bg)]/90 backdrop-blur-md z-10 pt-2">
                    <div className="w-8 h-8 rounded-xl bg-[var(--neon)]/10 flex items-center justify-center border border-[var(--neon)]/20 shadow-sm">
                      <Calendar className="w-4 h-4 text-[var(--neon)]" />
                    </div>
                    <h3 className="text-[14px] font-black text-[var(--text)] uppercase tracking-widest font-mono">{dateStr}</h3>
                    <span className="ml-auto bg-[var(--input-bg)] border border-[var(--border)] px-3 py-1.5 rounded-full text-[10px] font-black text-[var(--muted2)] tracking-widest font-mono shadow-inner">{itemsForDate.length} UPLOADS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {itemsForDate.map((item: any, idx: number) => {
                      const uploadTime = new Date(item.time);
                      const timeStr = uploadTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });

                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={`${item.name}-${item.time}`}
                          className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[20px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-card)] hover:border-[var(--neon)]/50 relative group transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="space-y-4 flex-1 flex flex-col">
                            {/* Card Header Info */}
                            <div className="flex items-start gap-4">
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=64`}
                                className="w-12 h-12 rounded-[14px] bg-white p-1 border border-[var(--border)] shadow-sm shrink-0"
                                alt="favicon"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="w-12 h-12 rounded-[14px] bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center hidden shrink-0 text-[var(--neon)]">
                                <Box className="w-6 h-6" />
                              </div>

                              <div className="min-w-0 flex-1 pt-0.5">
                                <h4 className="text-[15px] font-extrabold tracking-tight truncate text-[var(--text)] group-hover:text-[var(--neon)] transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] font-mono font-semibold text-[var(--muted2)] mt-1 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {timeStr}
                                </p>
                              </div>
                            </div>

                            {item.description && (
                              <p className="text-[12px] text-[var(--muted)] line-clamp-3 leading-relaxed mt-2 bg-[var(--input-bg)]/50 p-3 rounded-xl border border-[var(--border)]">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Card Action Link */}
                          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--neon)] tracking-widest uppercase bg-[var(--neon)]/10 px-2.5 py-1 rounded-lg border border-[var(--neon)]/20">
                              <Activity className="w-3 h-3" />
                              Added successfully
                            </span>

                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--border)] border border-[var(--border)] text-[12px] font-bold text-[var(--text)] hover:text-black hover:bg-[var(--neon)] hover:border-[var(--neon)] shadow-sm transition-all"
                            >
                              <span>Visit</span>
                              <ExternalLink size={13} className="shrink-0" />
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
