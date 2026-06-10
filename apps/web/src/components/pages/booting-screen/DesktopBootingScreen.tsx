"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function DesktopBootingScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Web Audio API for a professional boot chime
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();

        // Main chime tone
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(600, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);

        // Harmonics
        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(1200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 2.5);
        osc2.stop(ctx.currentTime + 2.5);
      }
    } catch (e) {
      // Audio autoplay blocked by browser
    }

    // Unmount or trigger completion after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .desktop-boot-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 60px; /* Space between logo and progress bar */
          background-color: #000000;
          overflow: hidden;
          animation: fadeOutContainer 0.5s ease-in-out 9.5s forwards;
        }

        .desktop-logo-wrapper {
          position: relative;
          width: 150px;
          height: 150px;
        }

        .loader-bar-container {
          width: 240px;
          height: 4px;
          background-color: #333333; /* Dark gray track */
          border-radius: 4px;
          overflow: hidden;
        }

        .loader-bar-fill {
          width: 100%;
          height: 100%;
          background-color: #FFFFFF; /* Pure white fill */
          border-radius: 4px;
          transform-origin: left;
          animation: loadLine 10s ease-in-out forwards;
        }

        @keyframes fadeOutContainer {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        @keyframes loadLine {
          0% { transform: scaleX(0); }
          10% { transform: scaleX(0.15); }
          25% { transform: scaleX(0.15); } /* Deliberate pause */
          40% { transform: scaleX(0.4); }
          55% { transform: scaleX(0.4); } /* Deliberate pause */
          70% { transform: scaleX(0.75); }
          85% { transform: scaleX(0.9); }
          92% { transform: scaleX(0.9); } /* Final pause before finish */
          100% { transform: scaleX(1); }
        }
      `}} />
      <div className="desktop-boot-container">
        <div className="desktop-logo-wrapper">
          <Image
            src="/playstore.png"
            alt="Booting Logo"
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="loader-bar-container">
          <div className="loader-bar-fill"></div>
        </div>
      </div>
    </>
  );
}
