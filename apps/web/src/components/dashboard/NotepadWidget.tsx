"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  PenLine,
  ArrowLeft,
  Trash2,
  Check,
  FileText,
  Hash,
  FilePlus2,
  Clock,
  AlignLeft,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';

interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

type MobileView = 'list' | 'editor';

const slideVariants = {
  enterFromRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  enterFromLeft: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
};

const transition = { type: 'spring' as const, stiffness: 300, damping: 32 };

export const NotepadWidget = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('list');
  const [slideDirection, setSlideDirection] = useState<'forward' | 'back'>('forward');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { confirm: openConfirm, modalProps } = useConfirmModal();

  // ── bootstrap ──────────────────────────────────────────────────────────
  useEffect(() => {
    const savedNotes = localStorage.getItem('hub_system_notes');
    if (savedNotes) {
      try {
        const parsed: Note[] = JSON.parse(savedNotes);
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
      } catch {
        setNotes([]);
      }
    } else {
      const oldNote = localStorage.getItem('hub_notepad_content');
      if (oldNote?.trim()) {
        const migrated: Note = {
          id: Date.now().toString(),
          content: oldNote,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setNotes([migrated]);
        setActiveNoteId(migrated.id);
        localStorage.setItem('hub_system_notes', JSON.stringify([migrated]));
      }
    }
  }, []);

  // ── persistence ────────────────────────────────────────────────────────
  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem('hub_system_notes', JSON.stringify(updated));
  };

  // ── create ─────────────────────────────────────────────────────────────
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
    openEditor(newNote.id);
  };

  // ── open editor (mobile) ───────────────────────────────────────────────
  const openEditor = (id: string) => {
    setActiveNoteId(id);
    setSlideDirection('forward');
    setMobileView('editor');
    setTimeout(() => textareaRef.current?.focus(), 350);
  };

  // ── go back to list (mobile) ───────────────────────────────────────────
  const goBack = () => {
    setSlideDirection('back');
    setMobileView('list');
  };

  // ── content change ─────────────────────────────────────────────────────
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNoteId) return;
    setIsSaved(false);
    const updated = notes.map(n =>
      n.id === activeNoteId ? { ...n, content: e.target.value, updatedAt: Date.now() } : n,
    );
    saveNotes(updated);
    setTimeout(() => setIsSaved(true), 500);
  };

  // ── delete ─────────────────────────────────────────────────────────────
  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    openConfirm({
      title: 'Delete Note',
      message: 'Are you sure you want to permanently delete this note?',
      confirmText: 'Delete',
      cancelText: 'Keep Note',
      variant: 'warning',
      onConfirm: () => {
        const updated = notes.filter(n => n.id !== id);
        saveNotes(updated);
        if (activeNoteId === id) {
          const next = updated[0] ?? null;
          setActiveNoteId(next?.id ?? null);
          if (mobileView === 'editor') goBack();
        }
      },
    });
  };

  // ── clear all ──────────────────────────────────────────────────────────
  const handleClearAll = () => {
    openConfirm({
      title: 'Clear All Notes',
      message: 'Are you sure you want to permanently delete ALL notes? This cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      variant: 'warning',
      onConfirm: () => {
        saveNotes([]);
        setActiveNoteId(null);
        if (mobileView === 'editor') goBack();
      },
    });
  };

  const activeNote = notes.find(n => n.id === activeNoteId) ?? null;
  const charCount = activeNote?.content.length ?? 0;
  const lineCount = activeNote?.content.split('\n').length ?? 0;
  const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0;

  // ─────────────────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────────────────
  const getNoteTitle = (note: Note) =>
    note.content.split('\n')[0].trim().substring(0, 42) || 'Untitled Note';

  const getNotePreview = (note: Note) => {
    const lines = note.content.split('\n').filter(l => l.trim());
    return lines.slice(1, 3).join(' ').substring(0, 80) || 'No additional content';
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  // ─────────────────────────────────────────────────────────────────────
  //  MOBILE LIST VIEW
  // ─────────────────────────────────────────────────────────────────────
  const ListScreen = (
    <div className="flex flex-col h-full w-full absolute inset-0 bg-[var(--bg)]">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-3 flex items-center justify-between border-b border-[var(--border2)]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded-xl bg-[var(--neon)]/15 flex items-center justify-center">
              <PenLine size={14} className="text-[var(--neon)]" />
            </div>
            <h2 className="text-[15px] font-bold text-[var(--text)] tracking-tight">My Notes</h2>
          </div>
          <p className="text-[10px] font-semibold text-[var(--muted2)] uppercase tracking-widest ml-9">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        <button
          onClick={createNewNote}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-[var(--neon)] shadow-lg shadow-[var(--neon)]/20 hover:shadow-[var(--neon)]/35 hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          <FilePlus2 size={13} />
          New
        </button>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-2.5 no-scrollbar">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--neon)]/8 flex items-center justify-center">
              <Sparkles size={28} className="text-[var(--neon)]/50" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-[var(--text)]">No notes yet</p>
              <p className="text-[11px] text-[var(--muted2)] mt-1">Tap "New" to create your first note</p>
            </div>
            <button
              onClick={createNewNote}
              className="mt-2 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest text-white bg-[var(--neon)] shadow-lg shadow-[var(--neon)]/20 active:scale-95 transition-all duration-200"
            >
              Create Note
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {notes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
              >
                <button
                  onClick={() => openEditor(note.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative overflow-hidden
                    ${note.id === activeNoteId
                      ? 'bg-[var(--neon)]/6 border-[var(--neon)]/30 shadow-sm'
                      : 'bg-[var(--card-bg)] border-[var(--border2)] hover:border-[var(--neon)]/20'
                    }`}
                >
                  {/* Active accent line */}
                  {note.id === activeNoteId && (
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-[var(--neon)] rounded-full" />
                  )}

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[13px] font-bold leading-tight truncate flex-1 ${note.id === activeNoteId ? 'text-[var(--neon)]' : 'text-[var(--text)]'}`}>
                      {getNoteTitle(note)}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-wider whitespace-nowrap">
                        {formatDate(note.updatedAt)}
                      </span>
                      <ChevronRight size={13} className="text-[var(--muted2)]/50" />
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--muted2)] leading-relaxed truncate mb-2.5">
                    {getNotePreview(note)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest">
                      <Clock size={9} />
                      {formatTime(note.updatedAt)}
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 group-active:opacity-100 p-1 rounded-lg text-[var(--muted2)] hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {notes.length > 0 && (
        <div className="shrink-0 px-5 py-3 border-t border-[var(--border2)] flex items-center justify-between">
          <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
            Auto-sync active
          </span>
          <button
            onClick={handleClearAll}
            className="text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] hover:text-rose-400 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────
  //  MOBILE EDITOR VIEW
  // ─────────────────────────────────────────────────────────────────────
  const EditorScreen = (
    <div className="flex flex-col h-full w-full absolute inset-0 bg-[var(--bg)]">
      {/* Editor Header */}
      <div className="shrink-0 h-14 flex items-center gap-3 px-4 border-b border-[var(--border2)] bg-[var(--bg4)]/20">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 p-2 -ml-1 rounded-xl hover:bg-[var(--bg4)]/50 active:scale-95 text-[var(--neon)] transition-all duration-150"
        >
          <ArrowLeft size={18} />
          <span className="text-[12px] font-black uppercase tracking-widest">Notes</span>
        </button>

        <div className="flex-1" />

        {/* Save status */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSaved ? 'saved' : 'saving'}
            initial={{ opacity: 0, scale: 0.85, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
            style={
              isSaved
                ? { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }
                : { background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }
            }
          >
            {isSaved ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Saved</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                />
                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Saving</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Delete current note */}
        {activeNote && (
          <button
            onClick={() => handleDeleteNote(activeNote.id)}
            className="p-2 rounded-xl text-[var(--muted2)] hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all duration-150"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Note meta */}
      {activeNote && (
        <div className="shrink-0 px-5 pt-3 pb-0 flex items-center gap-2">
          <Clock size={10} className="text-[var(--muted2)]" />
          <span className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-widest">
            {formatDate(activeNote.updatedAt)} · {formatTime(activeNote.updatedAt)}
          </span>
        </div>
      )}

      {/* Text area with line numbers */}
      <div className="flex-1 relative overflow-hidden mt-2">
        {/* Line numbers gutter */}
        <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-[var(--border2)]/40 bg-[var(--bg4)]/10 pointer-events-none flex flex-col pt-4 gap-[1.625rem] items-center overflow-hidden">
          {Array.from({ length: Math.max(lineCount + 3, 20) }).map((_, i) => (
            <span key={i} className="text-[9px] font-mono font-bold text-[var(--muted2)]/35 leading-none select-none">
              {i + 1}
            </span>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={activeNote?.content ?? ''}
          onChange={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={!activeNote}
          placeholder={
            activeNote
              ? 'Start typing your note…\nAuto-saves as you type.'
              : 'Create a new note to start typing…'
          }
          className="w-full h-full bg-transparent resize-none outline-none pl-14 pr-5 pt-4 pb-6 text-[14px] leading-[1.625rem] font-medium text-[var(--text)] placeholder:text-[var(--muted2)]/40 custom-scrollbar no-scrollbar"
          spellCheck={false}
          style={{ fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}
        />

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none border-2 border-[var(--neon)]/12 rounded-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Editor Footer */}
      <div className="shrink-0 h-10 flex items-center justify-between px-4 border-t border-[var(--border2)] bg-[var(--bg4)]/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <AlignLeft className="w-3 h-3 text-[var(--muted2)]" />
            <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-[var(--muted2)]" />
            <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">{charCount} chars</span>
          </div>
        </div>
        <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">Ln {lineCount}</span>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────
  //  DESKTOP LAYOUT (unchanged, side-by-side)
  // ─────────────────────────────────────────────────────────────────────
  const DesktopLayout = (
    <div className="w-full h-full flex font-sans bg-[var(--bg)]">
      {/* Sidebar */}
      <div className="w-72 h-full shrink-0 border-r border-[var(--border2)] flex flex-col bg-[var(--bg4)]/30">
        <div className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-[var(--border2)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--neon)]/10 text-[var(--neon)]">
              <FileText size={14} />
            </div>
            <span className="text-[11px] font-black text-[var(--text)] uppercase tracking-widest">My Notes</span>
          </div>
          <button
            onClick={createNewNote}
            className="p-1.5 rounded-lg hover:bg-[var(--neon)]/10 hover:text-[var(--neon)] text-[var(--muted2)] transition-colors"
            title="New Note"
          >
            <FilePlus2 size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
          {notes.length === 0 && (
            <p className="text-[10px] text-center text-[var(--muted2)] mt-10 uppercase tracking-widest font-mono">No notes yet</p>
          )}
          {notes.map(note => {
            const isActive = note.id === activeNoteId;
            return (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${isActive ? 'bg-[var(--card-bg)] border-[var(--neon)]/50 shadow-sm' : 'bg-transparent border-transparent hover:bg-[var(--card-bg)]/50 hover:border-[var(--border2)]'}`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`text-[13px] font-bold truncate pr-2 ${isActive ? 'text-[var(--neon)]' : 'text-[var(--text)]'}`}>
                    {getNoteTitle(note)}
                  </span>
                  <div
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--muted2)] hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">
                  <Clock size={10} />
                  {new Date(note.createdAt).toLocaleDateString()} · {formatTime(note.createdAt)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-blue-500/[0.02] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-14 shrink-0 flex items-center justify-between px-6 border-b border-[var(--border2)] z-10 bg-[var(--bg4)]/10">
          <div className="flex items-center gap-3">
            {activeNote && (
              <span className="text-[10px] font-mono font-bold text-[var(--muted)] tracking-widest bg-[var(--input-bg)] px-3 py-1 rounded-lg border border-[var(--border)]">
                Last edited: {formatTime(activeNote.updatedAt)}
              </span>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSaved ? 'saved' : 'saving'}
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ml-1"
                style={
                  isSaved
                    ? { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }
                    : { background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }
                }
              >
                {isSaved ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Saved</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    />
                    <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Saving</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--muted2)] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
          >
            Clear All Notes
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-[var(--border2)]/40 bg-[var(--bg4)]/20 pointer-events-none flex flex-col pt-6 gap-[1.625rem] items-center overflow-hidden">
            {Array.from({ length: Math.max(lineCount + 2, 15) }).map((_, i) => (
              <span key={i} className="text-[9px] font-mono font-bold text-[var(--muted2)]/40 leading-none select-none">
                {i + 1}
              </span>
            ))}
          </div>
          <textarea
            value={activeNote?.content ?? ''}
            onChange={handleContentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!activeNote}
            placeholder={
              activeNote
                ? 'Start typing your notes here…\nAuto-saves as you type.'
                : 'Create a new note to start typing…'
            }
            className="w-full h-full bg-transparent resize-none outline-none pl-16 pr-8 pt-6 pb-6 text-[14px] leading-[1.625rem] font-medium text-[var(--text)] placeholder:text-[var(--muted2)]/40 custom-scrollbar"
            spellCheck={false}
            style={{ fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}
          />
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none rounded-none border-2 border-[var(--neon)]/15"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 h-10 flex items-center justify-between px-6 border-t border-[var(--border2)] z-10 bg-[var(--bg4)]/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[var(--muted2)]" />
              <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">{wordCount} words</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-[var(--muted2)]" />
              <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">{charCount} chars</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">Ln {lineCount}</span>
            <span className="text-[var(--border2)]">·</span>
            <span className="text-[9px] font-black text-[var(--neon)]/70 uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
              Auto-sync active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full font-sans animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
      <ConfirmModal {...modalProps} />

      {/* MOBILE layout (< md) */}
      <div className="relative w-full h-full md:hidden overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {mobileView === 'list' ? (
            <motion.div
              key="list"
              className="absolute inset-0"
              {...(slideDirection === 'back'
                ? slideVariants.enterFromLeft
                : { initial: { x: 0, opacity: 1 }, animate: { x: 0, opacity: 1 }, exit: slideVariants.enterFromLeft.exit }
              )}
              transition={transition}
            >
              {ListScreen}
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              className="absolute inset-0"
              initial={slideVariants.enterFromRight.initial}
              animate={slideVariants.enterFromRight.animate}
              exit={slideVariants.enterFromRight.exit}
              transition={transition}
            >
              {EditorScreen}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP layout (≥ md) */}
      <div className="hidden md:block w-full h-full">
        {DesktopLayout}
      </div>
    </div>
  );
};
