"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function MobileBootingScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Optional: Attempt to play a subtle "chime" using Web Audio API.
    // Note: Most browsers block autoplay audio without prior user interaction.
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2);
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
        .mobile-boot-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px; /* Space between logo and progress bar */
          background-color: #000000;
          overflow: hidden;
          animation: fadeOutContainer 0.5s ease-in-out 9.5s forwards;
        }

        .mobile-logo-wrapper {
          position: relative;
          width: 110px;
          height: 110px;
        }

        .loader-bar-container {
          width: 160px;
          height: 3px;
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
      <div className="mobile-boot-container">
        <div className="mobile-logo-wrapper">
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
