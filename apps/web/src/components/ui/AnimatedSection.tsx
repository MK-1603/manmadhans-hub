"use client";

import React, { ReactNode, useRef } from "react";
import { motion, Variants, useScroll, useTransform, useSpring, HTMLMotionProps } from "framer-motion";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  viewportAmount?: number;
  noInitialY?: boolean;
}

const antigravityVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: 12,
    translateZ: -80,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    translateZ: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 70,
    } as any,
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: (staggerDelay: number = 0.15) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
};

export default function AnimatedSection({
  children,
  delay = 0,
  staggerDelay = 0.15,
  className = "",
  viewportAmount = 0.15,
  noInitialY = false,
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(springScroll, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(springScroll, [0, 0.2, 0.8, 1], [0.94, 1, 1, 0.94]);
  // If noInitialY is true (Hero), we don't want it to 'move up' from 60 to 0 on load.
  const yRange = noInitialY ? [0, 0, 0, -60] : [60, 0, 0, -60];
  const y = useTransform(springScroll, [0, 0.2, 0.8, 1], yRange);

  return (
    <motion.section
      ref={ref}
      initial={noInitialY ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: false, amount: viewportAmount }}
      variants={containerVariants}
      custom={staggerDelay}
      style={{ 
        opacity,
        scale,
        y,
        perspective: "1000px", 
        transformStyle: "preserve-3d" 
      }}
      className={`relative ${className} transition-colors duration-500`}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/**
 * Reusable motion wrapper for elements inside an AnimatedSection
 */
export function AnimatedItem({ 
  children, 
  className = "",
  variants = antigravityVariants 
}: { 
  children: ReactNode; 
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div
      variants={variants}
      className={`will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
