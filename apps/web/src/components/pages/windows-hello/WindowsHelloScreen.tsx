"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function WindowsHelloScreen({ onComplete }: { onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  
  const fullText = "Welcome to ManMadhan Hub";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        // use function update to ensure the correct string is sliced if re-renders happen, 
        // though our closure 'i' is sufficient here since it's just a ref to the local var
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowButton(true), 800);
      }
    }, 70);
    
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col items-center justify-center font-display p-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,170,0.08)_0%,transparent_60%)] animate-[pulse_4s_ease-in-out_infinite]" />
      
      <div className="relative z-10 flex flex-col items-center min-h-[160px] justify-center">
        <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-tight min-h-[60px] flex items-center mb-8">
          {displayedText}
          <span className="inline-block w-[3px] h-[36px] md:h-[48px] bg-[var(--neon)] ml-1 animate-[pulse_1s_infinite]" />
        </h1>
        
        <div 
          className="transition-all duration-1000 ease-out"
          style={{ 
            opacity: showButton ? 1 : 0, 
            transform: showButton ? 'translateY(0)' : 'translateY(10px)',
            pointerEvents: showButton ? 'auto' : 'none'
          }}
        >
          <button 
            onClick={onComplete}
            disabled={!showButton}
            className="flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[15px] font-bold tracking-wide backdrop-blur-md transition-all cursor-pointer group hover:border-[var(--neon)]/50 hover:shadow-[0_0_20px_rgba(var(--neon-rgb),0.2)]"
          >
            Continue
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
