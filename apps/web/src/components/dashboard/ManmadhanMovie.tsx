"use client";

import React, { useState } from 'react';
import { Film, ExternalLink, Play, Star, Music, User, Calendar, Tag, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManmadhanMovie = () => {
  const [isHovered, setIsHovered] = useState(false);

  const castMembers = [
    { name: 'Silambarasan', role: 'Lead Actor', emoji: '🎭' },
    { name: 'Jyothika', role: 'Lead Actress', emoji: '🌟' },
    { name: 'Sindhu Tolani', role: 'Supporting', emoji: '💫' },
    { name: 'Santhanam', role: 'Comedy Relief', emoji: '😄' },
    { name: 'Goundamani', role: 'Supporting', emoji: '🎪' },
  ];

  const details = [
    { icon: <Calendar size={13} />, label: 'Year', value: '2004' },
    { icon: <Tag size={13} />, label: 'Genre', value: 'Romantic Thriller' },
    { icon: <User size={13} />, label: 'Director', value: 'A.J. Murugan' },
    { icon: <Music size={13} />, label: 'Music', value: 'Yuvan Shankar Raja' },
    { icon: <Star size={13} />, label: 'Language', value: 'Tamil' },
    { icon: <Award size={13} />, label: 'Rating', value: '4.8 / 5.0' },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar font-sans pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Cinematic Hero Header ── */}
      <div className="relative flex-none overflow-hidden rounded-3xl mb-6 bg-gradient-to-br from-red-950 via-[#1a0a0a] to-[#0d0505] border border-red-900/30 shadow-2xl min-h-[160px]">
        {/* Background glow orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        {/* Film strip decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.05) 28px, rgba(255,255,255,0.05) 30px)`
          }}
        />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Film reel icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <Film className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/25 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] font-black text-red-300 uppercase tracking-[0.2em]">MANMADHAN'S ARCHIVE</span>
            </div>

            <h1 className="font-royal text-3xl sm:text-4xl md:text-5xl font-bold text-white italic leading-tight tracking-tight">
              Manmadhan
            </h1>
            <p className="text-red-300/70 text-sm font-medium mt-1 tracking-wide">Tamil Romantic Thriller · 2004 · Silambarasan</p>
          </div>

          <button
            onClick={() => window.open('https://www.youtube.com/watch?v=w6Hxb4RXOjA', '_blank')}
            className="flex items-center gap-2.5 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] cursor-pointer shrink-0 active:scale-95 border border-red-400/30"
          >
            <Play size={16} className="fill-white" />
            Watch Now
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">

        {/* Left: Cinema Embed */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Cinema Frame */}
          <div
            className="relative rounded-3xl overflow-hidden border-2 border-red-900/40 bg-black group cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ aspectRatio: '16/9' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Cinema top bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none flex items-center px-4 gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>

            {/* Hover glow */}
            <div className={`absolute inset-0 border-2 border-red-500/0 group-hover:border-red-500/40 rounded-3xl transition-all duration-500 z-10 pointer-events-none ${isHovered ? 'shadow-[inset_0_0_40px_rgba(239,68,68,0.1)]' : ''}`} />

            <iframe
              src="https://www.youtube.com/embed/w6Hxb4RXOjA?autoplay=0&rel=0&modestbranding=1"
              title="Manmadhan Movie (2004)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-none"
            />
          </div>

          {/* Description card */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-royal text-xl font-bold text-[var(--text)] italic mb-3">About the Film</h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              <span className="font-semibold text-[var(--text)]">Manmadhan</span> is a 2004 Indian Tamil-language romantic thriller film directed by <span className="text-[var(--neon)] font-semibold">A.J. Murugan</span>. The film features Silambarasan in a celebrated dual role — one a charming lover, the other a mysterious serial killer. The film boasts a chart-topping soundtrack composed by <span className="text-[var(--neon)] font-semibold">Yuvan Shankar Raja</span>, making it one of Tamil cinema's most iconic albums. Critically acclaimed for its tight screenplay and stellar performances, the film became a landmark in Tamil romantic thriller cinema.
            </p>

            <button
              onClick={() => window.open('https://www.youtube.com/watch?v=w6Hxb4RXOjA', '_blank')}
              className="mt-4 inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition-colors cursor-pointer"
            >
              Watch Full Movie on YouTube <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Info Panels */}
        <div className="flex flex-col gap-4">

          {/* Movie Details */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--neon)] mb-4 flex items-center gap-2">
              <Film size={13} />
              Film Details
            </h3>
            <div className="space-y-3">
              {details.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--muted2)]">
                    <span className="text-[var(--neon)]">{detail.icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{detail.label}</span>
                  </div>
                  <span className="text-[12px] font-black text-[var(--text)] bg-[var(--input-bg)] border border-[var(--border)] px-2.5 py-1 rounded-full">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-gradient-to-br from-amber-950/50 to-[var(--card-bg)] border border-amber-900/30 rounded-3xl p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 mb-3 flex items-center gap-2">
              <Star size={13} />
              Audience Score
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={20} className={i <= 4 ? 'fill-amber-400 text-amber-400' : 'text-[var(--border2)]'} />
              ))}
              <span className="text-2xl font-black text-amber-400 ml-2">4.8</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] uppercase tracking-wider">Based on audience reviews</p>
          </div>

          {/* Cast */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 shadow-[var(--shadow-card)] flex-1">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--neon)] mb-4 flex items-center gap-2">
              <User size={13} />
              Cast & Crew
            </h3>
            <div className="space-y-2.5">
              {castMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--input-bg)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-base shrink-0">
                    {member.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[var(--text)] leading-none truncate">{member.name}</p>
                    <p className="text-[10px] font-medium text-[var(--muted2)] uppercase tracking-wider mt-0.5">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
