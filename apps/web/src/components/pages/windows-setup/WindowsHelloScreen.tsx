"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SETUP_STEPS = [
  { text: "Hi", duration: 3000 },
  { text: "We're getting everything ready for you.", duration: 4000 },
  { text: "This might take a few minutes.", duration: 4000 },
  { text: "Don't turn off your system.", duration: 4000 },
  { text: "Almost there...", duration: 2500 },
];

export default function WindowsHelloScreen({ onComplete }: { onComplete: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;

    const runSteps = (index: number) => {
      if (index >= SETUP_STEPS.length) {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 1000); // Wait for the final fade out
        return;
      }

      setCurrentStepIndex(index);
      stepTimer = setTimeout(() => {
        runSteps(index + 1);
      }, SETUP_STEPS[index].duration);
    };

    runSteps(0);

    return () => clearTimeout(stepTimer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#005A9E] sm:bg-[#000000] overflow-hidden"
          style={{ 
            // Windows 11 style dark shifting background
            background: "radial-gradient(circle at center, #0F2027, #203A43, #2C5364)"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-center px-6"
              style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif" }}
            >
              {SETUP_STEPS[currentStepIndex]?.text}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
