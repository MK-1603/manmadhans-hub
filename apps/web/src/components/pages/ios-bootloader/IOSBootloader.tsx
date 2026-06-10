"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function IOSBootloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(8); // 8 seconds estimated

  useEffect(() => {
    // OS updates typically pause, stutter, and take time.
    const milestones = [
      { target: 15, duration: 1000 },
      { target: 15, duration: 800 }, // pause
      { target: 45, duration: 2000 },
      { target: 45, duration: 1200 }, // pause
      { target: 80, duration: 2500 },
      { target: 95, duration: 1500 },
      { target: 100, duration: 500 },
    ];

    let currentProgress = 0;
    let currentMilestone = 0;
    let startTime = Date.now();
    let animationFrameId: number;

    const animateProgress = () => {
      if (currentMilestone >= milestones.length) {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
        }, 1000);
        return;
      }

      const milestone = milestones[currentMilestone];
      const elapsed = Date.now() - startTime;
      const progressToAdd = ((milestone.target - currentProgress) * elapsed) / milestone.duration;
      
      let nextProgress = currentProgress + progressToAdd;

      if (elapsed >= milestone.duration) {
        currentProgress = milestone.target;
        nextProgress = currentProgress;
        currentMilestone++;
        startTime = Date.now();
      }

      setProgress(nextProgress);
      animationFrameId = requestAnimationFrame(animateProgress);
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    // Update time remaining
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
          style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
        >
          {/* Logo */}
          <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] mb-16">
            <Image
              src="/favicon.ico"
              alt="System Logo"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* OS Style Progress Bar */}
          <div className="w-[200px] sm:w-[260px] h-[4px] bg-[#333333] rounded-full overflow-hidden mb-5">
            <motion.div 
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          {/* Installation Text matching an OS Update */}
          <div className="flex flex-col items-center gap-1 text-[#888888] text-[13px] sm:text-[14px] font-medium tracking-wide">
            {progress < 100 ? (
              <>
                <span>Installing System Workspace...</span>
                <span>About {timeRemaining} second{timeRemaining !== 1 ? 's' : ''} remaining</span>
              </>
            ) : (
              <span>Installation Complete</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
