"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, RefreshCw, WifiOff, Lock, Ghost } from "lucide-react";

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  showRetry?: boolean;
}

export default function ErrorPage({ code, title, message, icon, showRetry = false }: ErrorPageProps) {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      // If there's no referrer or it's from a different site, go home
      const hasHistory = window.history.length > 1;
      if (hasHistory) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-[5%] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(126,242,82,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="max-w-[540px] w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 relative inline-block"
        >
          <div className="text-[clamp(100px,15vw,180px)] font-sans font-black leading-none bg-gradient-to-b from-[var(--text)] to-[rgba(var(--particle-rgb),0.2)] bg-clip-text text-transparent opacity-10 select-none">
            {code}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl flex items-center justify-center text-[var(--neon)] shadow-[var(--glow),var(--shadow-card)]">
              {icon}
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans font-extrabold text-[32px] md:text-[42px] leading-tight mb-4 tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[17px] text-[var(--muted)] mb-10 leading-relaxed max-w-[420px] mx-auto"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="/"
            className="btn-3d-primary min-w-[200px] justify-center"
          >
            <Home size={18} />
            Return Home
          </Link>
          
          {showRetry ? (
            <button
              onClick={() => window.location.reload()}
              className="btn-3d-ghost min-w-[200px] justify-center"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          ) : (
            <button
              onClick={handleBack}
              className="btn-3d-ghost min-w-[200px] justify-center"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          )}
        </motion.div>
      </div>

      {/* Decorative Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-[var(--neon)] rounded-full hidden md:block"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );
}
