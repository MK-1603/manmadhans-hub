"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileJson, CheckCircle, AlertTriangle, Terminal, Cpu, ArrowRight, X, Copy, Check, CloudUpload, FileCode, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';

export const BulkImportTools = () => {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'idle' | 'processing' | 'success' | 'error';
    message: string;
    details?: any;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processImportFile(file);
  };
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processImportFile(file);
  };

  const isDemoTool = (t: any) => !t.name || t.name.trim() === '' || t.name === 'Tool Name';

  const validateAndParseJson = (jsonString: string): any[] | null => {
    try {
      const parsed = JSON.parse(jsonString);
      let toolsArray = Array.isArray(parsed) ? parsed : (parsed.tools || []);
      
      // Filter out demo/blank tools
      toolsArray = toolsArray.filter((t: any) => !isDemoTool(t));

      if (!toolsArray.length) {
        throw new Error('No valid tools found. Please fill out the JSON template with real data.');
      }
      setJsonError(null);
      return toolsArray;
    } catch (e: any) {
      let errorMessage = 'JSON syntax error';
      if (e.message) {
        errorMessage = e.message;
      }
      setJsonError(errorMessage);
      return null;
    }
  };

  const processImportFile = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      showToast('Import failed: File format must be JSON.', 'error');
      setImportStatus({ type: 'error', message: 'Invalid file format. Please upload a .json file.' });
      return;
    }
    setImportStatus({ type: 'processing', message: 'Parsing matrix schemas...' });
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      let toolsArray: any[] = Array.isArray(importedData) ? importedData : (importedData.tools || []);
      
      // Filter out demo/blank tools
      toolsArray = toolsArray.filter((t: any) => !isDemoTool(t));

      if (!toolsArray.length) {
        setImportStatus({ type: 'error', message: 'No valid tools found. Did you upload the unmodified template?' });
        return;
      }
      setImportStatus({ type: 'processing', message: `Validating ${toolsArray.length} tools...` });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/bulk`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
          body: JSON.stringify({ tools: toolsArray }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        setImportStatus({
          type: 'success',
          message: `${result.results.success} tools imported, ${result.results.failed} rejected.`,
          details: result.results,
        });
        showToast('Bulk import complete!', 'success');
      } else {
        const err = await response.json();
        setImportStatus({ type: 'error', message: err.message || 'Server rejected the payload.' });
      }
    } catch (e: any) {
      setImportStatus({ type: 'error', message: e.message || 'JSON syntax error encountered during parsing.' });
    }
  };

  const processJsonInput = async () => {
    const toolsArray = validateAndParseJson(jsonInput);
    if (!toolsArray) return;
    setImportStatus({ type: 'processing', message: `Validating ${toolsArray.length} tools...` });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/bulk`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
          body: JSON.stringify({ tools: toolsArray }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        setImportStatus({
          type: 'success',
          message: `${result.results.success} tools imported, ${result.results.failed} rejected.`,
          details: result.results,
        });
        showToast('Bulk import complete!', 'success');
      } else {
        const err = await response.json();
        setImportStatus({ type: 'error', message: err.message || 'Server rejected the payload.' });
      }
    } catch (e: any) {
      setImportStatus({ type: 'error', message: e.message || 'Error importing tools.' });
    }
  };

  const schemaTemplate = `[
  {
    "id": "",
    "name": "",
    "slug": "",
    "short_description": "",
    "description": "",
    "use_case": "",
    "key_features": [
      "",
      "",
      ""
    ],
    "website_url": "",
    "logo_url": "",
    "cover_image_url": "",
    "category_id": "",
    "category_name": "",
    "sub_category": "",
    "micro_category": "",
    "pricing_type": "",
    "pricing_details": "",
    "developer_name": "",
    "developer_description": "",
    "author_name": "",
    "author_role": "",
    "author_description": "",
    "company_founded_year": "",
    "launch_date": "",
    "ai_model_used": "",
    "platform_support": [
      "Web"
    ],
    "api_available": false,
    "github_url": "",
    "integrations": [],
    "monthly_visits": 0,
    "rating": 0,
    "review_count": 0,
    "tool_status": "Active",
    "featured": false,
    "verified": false,
    "tags": [],
    "search_keywords": [],
    "last_verified": "",
    "created_at": "",
    "updated_at": ""
  }
]`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(schemaTemplate);
    setCopiedTemplate(true);
    showToast('Schema template copied!', 'success');
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleCopyInput = () => {
    if (jsonInput) {
      navigator.clipboard.writeText(jsonInput);
      setCopiedInput(true);
      showToast('JSON input copied!', 'success');
      setTimeout(() => setCopiedInput(false), 2000);
    }
  };

  const statusConfig = {
    processing: { color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/8', border: 'border-amber-500/20 dark:border-amber-500/20', Icon: Cpu },
    success: { color: 'text-emerald-600 dark:text-[var(--neon)]', bg: 'bg-emerald-500/10 dark:bg-[var(--neon)]/8', border: 'border-emerald-500/20 dark:border-[var(--neon)]/20', Icon: CheckCircle },
    error: { color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/8', border: 'border-red-500/20 dark:border-red-500/20', Icon: AlertTriangle },
  };

  return (
    <div className="h-full flex flex-col font-sans animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-5 pt-4 sm:pt-5 pb-20 sm:pb-6">

      {/* Header */}
      <div className="flex-none rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-5 mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6 text-[var(--neon)]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight font-royal leading-tight mb-1">Bulk Import</h1>
              <p className="text-[11px] text-[var(--muted)] font-medium">Mass-deploy AI tools via JSON telemetry arrays</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">
            <span className="px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">Max 50MB</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">.json only</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 sm:space-y-5">

        {/* Upload and JSON Input Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
          {/* Upload zone */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !importStatus?.type.includes('processing') && fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-7 sm:p-10 min-h-[230px] sm:min-h-[300px] cursor-pointer group ${
                isDragging
                  ? 'border-[var(--neon)] bg-[var(--neon)]/5 scale-[1.01]'
                  : importStatus?.type === 'success'
                  ? 'border-[var(--neon)]/40 bg-[var(--neon)]/4'
                  : importStatus?.type === 'error'
                  ? 'border-red-500/30 bg-red-500/4'
                  : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--border2)] hover:bg-[var(--bg)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {!importStatus || importStatus.type === 'idle' ? (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 sm:gap-4">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center transition-all ${
                      isDragging ? 'bg-[var(--neon)]/15 border-[var(--neon)]/30' : 'bg-[var(--bg)] border-[var(--border)] group-hover:border-[var(--border2)]'
                    }`}>
                      <CloudUpload className={`w-9 h-9 sm:w-10 sm:h-10 transition-all ${
                        isDragging ? 'text-[var(--neon)] animate-bounce' : 'text-[var(--muted2)]'
                      }`} />
                    </div>
                     <div className="px-2 sm:px-4">
                      <p className="text-[14px] sm:text-[15px] font-black text-[var(--text)] mb-1">
                        {isDragging ? 'Drop to Import' : (
                          <>
                            <span className="hidden lg:inline">Drop JSON File Here</span>
                            <span className="inline lg:hidden">Upload JSON File</span>
                          </>
                        )}
                      </p>
                      <p className="text-[11px] text-[var(--muted)]">
                        <span className="hidden lg:inline">or click to browse your files</span>
                        <span className="inline lg:hidden">tap to browse files</span>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
                    {(() => {
                      const cfg = statusConfig[importStatus.type as 'processing' | 'success' | 'error'];
                      const Icon = cfg.Icon;
                      return (
                        <div className={`w-full p-3.5 sm:p-4 rounded-xl border ${cfg.bg} ${cfg.border} flex items-start gap-2.5 sm:gap-3 text-left`}>
                          <Icon size={17} className={`${cfg.color} shrink-0 mt-0.5 ${importStatus.type === 'processing' ? 'animate-spin' : ''}`} />
                          <div className="flex-1">
                            <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${cfg.color} mb-1`}>
                              {importStatus.type === 'processing' ? 'Processing...' : importStatus.type === 'success' ? 'Import Complete' : 'Import Failed'}
                            </p>
                            <p className="text-[12px] sm:text-[13px] font-semibold text-[var(--text)] leading-tight">{importStatus.message}</p>
                            {importStatus.details && (
                              <div className="flex gap-3 sm:gap-4 mt-2">
                                <span className="text-[10px] text-[var(--neon)] font-mono font-black">✓ {importStatus.details.success} added</span>
                                {importStatus.details.failed > 0 && <span className="text-[10px] text-red-400 font-mono font-black">✗ {importStatus.details.failed} rejected</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    {importStatus.type !== 'processing' && (
                      <button
                        onClick={e => { e.stopPropagation(); setImportStatus(null); }}
                        className="flex items-center gap-2 px-4 py-2.5 sm:px-4.5 sm:py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[10px] font-black text-[var(--muted)] uppercase tracking-widest hover:text-[var(--text)] transition-all cursor-pointer"
                      >
                        <X size={12} /> Import Another File
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Constraints */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-4.5">
              <h4 className="text-[10px] sm:text-[11px] font-black text-[var(--text)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Terminal size={12} className="text-[var(--neon)]" /> System Constraints
              </h4>
              <ul className="space-y-2.5">
                {[
                  'Maximum payload size: 50MB',
                  'Format: root "tools" array or array of objects',
                  'Invalid records are automatically discarded',
                  'Requires admin-level session token',
                ].map(c => (
                  <li key={c} className="flex items-start gap-2.5 text-[10px] text-[var(--muted)] leading-tight">
                    <ArrowRight size={10} className="text-[var(--neon)] shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dedicated JSON Input Section */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4.5 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Edit3 size={15} className="text-[var(--neon)]" />
                <span className="text-[11px] font-black text-[var(--text)] uppercase tracking-wider">JSON Input</span>
              </div>
              <button
                onClick={handleCopyInput}
                disabled={!jsonInput}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  !jsonInput ? 'opacity-50 cursor-not-allowed' : copiedInput
                  ? 'bg-[var(--neon)]/15 border border-[var(--neon)]/25 text-[var(--neon)]'
                  : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                }`}
              >
                {copiedInput ? <Check size={11} /> : <Copy size={11} />}
                {copiedInput ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <textarea
                value={jsonInput}
                onChange={(e) => { setJsonInput(e.target.value); if (e.target.value) validateAndParseJson(e.target.value); else setJsonError(null); }}
                placeholder="Paste your JSON here..."
                className="flex-1 w-full p-4.5 sm:p-5 bg-[var(--bg)] text-[11px] sm:text-[12px] font-mono text-[var(--text)] leading-relaxed resize-none outline-none"
              />
              {jsonError && (
                <div className="p-4 border-t border-red-500/20 bg-red-500/5">
                  <div className="flex items-start gap-2.5 text-[11px] text-red-500">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>{jsonError}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-[var(--border)]">
              <button
                onClick={processJsonInput}
                disabled={!jsonInput || !!jsonError || importStatus?.type === 'processing'}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  !jsonInput || !!jsonError || importStatus?.type === 'processing'
                    ? 'opacity-50 cursor-not-allowed bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]'
                    : 'bg-gradient-to-r from-[var(--neon)] to-[var(--emerald)] text-white hover:shadow-[var(--glow)]'
                }`}
              >
                <Upload size={14} /> Import JSON
              </button>
            </div>
          </div>
        </div>

        {/* Schema template */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4.5 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--border)] shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <FileCode size={15} className="text-[var(--neon)]" />
              <span className="text-[11px] font-black text-[var(--text)] uppercase tracking-wider">JSON Schema Template</span>
            </div>
            <button
              onClick={handleCopyTemplate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                copiedTemplate
                  ? 'bg-[var(--neon)]/15 border border-[var(--neon)]/25 text-[var(--neon)]'
                  : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)]'
              }`}
            >
              {copiedTemplate ? <Check size={11} /> : <Copy size={11} />}
              {copiedTemplate ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-4.5 sm:p-5 bg-[var(--bg)]">
            <pre className="text-[10px] sm:text-[11px] font-mono text-[var(--muted)] leading-relaxed whitespace-pre overflow-x-auto">
              <span className="text-[var(--neon)]">{'['}</span>
              {'\n  '}<span className="text-[var(--neon)]">{'{'}\n</span>
              {schemaTemplate
                .split('\n')
                .slice(2, -1)
                .map((line, i) => {
                  const colonIdx = line.indexOf(':');
                  if (colonIdx === -1) return <span key={i}>{line}{'\n'}</span>;
                  const key = line.substring(0, colonIdx + 1);
                  const val = line.substring(colonIdx + 1);
                  return (
                    <span key={i}>
                      <span className="text-blue-600 dark:text-blue-400">{key}</span>
                      <span className="text-amber-700 dark:text-amber-300">{val}</span>
                      {'\n'}
                    </span>
                  );
                })}
              {'  '}<span className="text-[var(--neon)]">{'}'}\n</span>
              <span className="text-[var(--neon)]">{']'}</span>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
