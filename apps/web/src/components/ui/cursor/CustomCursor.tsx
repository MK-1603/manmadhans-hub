"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useCursorType } from "@/hooks/use-cursor";

export default function CustomCursor() {
  const { type } = useCursorType();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Large trailing ring physics
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, isMobile]);

  if (isMobile) return null;

  const variants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderColor: "var(--cursor-ring)",
    },
    hover: {
      width: 64,
      height: 64,
      backgroundColor: "var(--cursor-hover-bg)",
      borderColor: "var(--cursor-hover-border)",
    },
    drag: {
      width: 80,
      height: 80,
      backgroundColor: "var(--cursor-hover-bg)",
      borderColor: "var(--cursor-ring)",
    },
    view: {
      width: 100,
      height: 100,
      backgroundColor: "var(--text)",
      borderColor: "var(--text)",
      mixBlendMode: "difference" as const,
    },
    none: {
      opacity: 0,
      scale: 0,
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {isVisible && type !== "none" && (
          <>
            {/* Small Dot */}
            <motion.div
              className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--cursor-dot)] rounded-full z-10 will-change-transform shadow-[0_0_10px_rgba(var(--particle-rgb),0.3)] transition-colors duration-300"
              style={{
                x: mouseX,
                y: mouseY,
                translateX: "-50%",
                translateY: "-50%",
              }}
            />

            {/* Trailing Ring */}
            <motion.div
              className="fixed top-0 left-0 rounded-full border-[1.5px] z-0 will-change-transform flex items-center justify-center overflow-hidden transition-colors duration-300"
              style={{
                x: ringX,
                y: ringY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              variants={variants}
              animate={type}
              transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.6 }}
            >
              {type === "view" && (
                <span className="text-[10px] font-bold text-[var(--bg)] uppercase tracking-wider">View</span>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
