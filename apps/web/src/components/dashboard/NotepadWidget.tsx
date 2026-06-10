"use client";

import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2, Check, FileText, Hash, Plus, Clock, FilePlus2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal, useConfirmModal } from './ConfirmModal';

interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export const NotepadWidget = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const { confirm: openConfirm, modalProps } = useConfirmModal();

  useEffect(() => {
    const savedNotes = localStorage.getItem('hub_system_notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } catch (e) {
        setNotes([]);
      }
    } else {
      // Migrate old note if exists
      const oldNote = localStorage.getItem('hub_notepad_content');
      if (oldNote && oldNote.trim()) {
        const migratedNote: Note = {
          id: Date.now().toString(),
          content: oldNote,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        setNotes([migratedNote]);
        setActiveNoteId(migratedNote.id);
        localStorage.setItem('hub_system_notes', JSON.stringify([migratedNote]));
      } else {
        createNewNote();
      }
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('hub_system_notes', JSON.stringify(updatedNotes));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNoteId) return;
    const newContent = e.target.value;
    
    setIsSaved(false);
    
    const updatedNotes = notes.map(n => 
      n.id === activeNoteId ? { ...n, content: newContent, updatedAt: Date.now() } : n
    );
    
    saveNotes(updatedNotes);
    
    setTimeout(() => {
      setIsSaved(true);
    }, 500);
  };

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const handleDeleteNote = (id: string) => {
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
          setActiveNoteId(updated.length > 0 ? updated[0].id : null);
        }
        if (updated.length === 0) {
           createNewNote();
        }
      },
    });
  };

  const handleClearAll = () => {
    openConfirm({
      title: 'Clear All Notes',
      message: 'Are you sure you want to permanently delete ALL notes? This cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      variant: 'warning',
      onConfirm: () => {
        saveNotes([]);
        createNewNote();
      },
    });
  };

  const charCount = activeNote ? activeNote.content.length : 0;
  const lineCount = activeNote ? activeNote.content.split('\n').length : 0;
  const wordCount = activeNote && activeNote.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full h-full flex flex-col md:flex-row font-sans bg-[var(--bg)] animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
      <ConfirmModal {...modalProps} />

      {/* ── SIDEBAR (NOTES LIST) ───────────────────────── */}
      <div className="w-full md:w-72 h-48 md:h-full shrink-0 border-b md:border-b-0 md:border-r border-[var(--border2)] flex flex-col bg-[var(--bg4)]/30">
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
            const title = note.content.split('\n')[0].substring(0, 40) || 'Untitled Note';
            const isActive = note.id === activeNoteId;
            return (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${isActive ? 'bg-[var(--card-bg)] border-[var(--neon)]/50 shadow-sm' : 'bg-transparent border-transparent hover:bg-[var(--card-bg)]/50 hover:border-[var(--border2)]'}`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`text-[13px] font-bold truncate pr-2 ${isActive ? 'text-[var(--neon)]' : 'text-[var(--text)]'}`}>
                    {title}
                  </span>
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                    className="opacity-0 group-hover:opacity-100 text-[var(--muted2)] hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest font-mono">
                  <Clock size={10} />
                  {new Date(note.createdAt).toLocaleDateString()} · {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── EDITOR ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative group overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-blue-500/[0.02] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Header */}
        <div className="relative h-14 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-[var(--border2)] z-10 bg-[var(--bg4)]/10">
          <div className="flex items-center gap-2 md:gap-3">
            {activeNote && (
              <span className="text-[10px] font-mono font-bold text-[var(--muted)] tracking-widest bg-[var(--input-bg)] px-3 py-1 rounded-lg border border-[var(--border)]">
                Last edited: {new Date(activeNote.updatedAt).toLocaleTimeString()}
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
                style={isSaved
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

        {/* Text Area */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-10 md:w-12 border-r border-[var(--border2)]/40 bg-[var(--bg4)]/20 pointer-events-none flex flex-col pt-4 md:pt-6 gap-[1.625rem] items-center overflow-hidden">
            {Array.from({ length: Math.max(lineCount + 2, 15) }).map((_, i) => (
              <span key={i} className="text-[9px] font-mono font-bold text-[var(--muted2)]/40 leading-none select-none">
                {i + 1}
              </span>
            ))}
          </div>

          <textarea
            value={activeNote?.content || ''}
            onChange={handleContentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!activeNote}
            placeholder={activeNote ? "Start typing your notes here...\nAuto-saves as you type." : "Create a new note to start typing..."}
            className="w-full h-full bg-transparent resize-none outline-none pl-12 md:pl-16 pr-4 md:pr-8 pt-4 md:pt-6 pb-6 text-[14px] leading-[1.625rem] font-medium text-[var(--text)] placeholder:text-[var(--muted2)]/40 custom-scrollbar"
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

        {/* Footer */}
        <div className="shrink-0 h-10 flex items-center justify-between px-3 md:px-6 border-t border-[var(--border2)] z-10 bg-[var(--bg4)]/10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
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
};
