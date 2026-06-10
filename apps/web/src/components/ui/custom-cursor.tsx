'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkDevice = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isLargeScreen = window.innerWidth >= 768;
      const active = hasFinePointer && isLargeScreen;
      setIsDesktop(active);
      
      if (active) {
        document.documentElement.classList.add('custom-cursor-active');
      } else {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[role="button"]') !== null ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT';
      setHovered(isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Core Diamond */}
      <motion.div
        className="custom-cursor-element fixed top-0 left-0 w-2.5 h-2.5 bg-[#8DFB5B] pointer-events-none z-[99999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          rotate: 45,
        }}
        animate={{
          scale: clicked ? 0.6 : hovered ? 1.5 : 1,
          backgroundColor: hovered ? '#ffffff' : '#8DFB5B',
          borderRadius: hovered ? '50%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      {/* Trailing Tech Shape */}
      <motion.div
        className="custom-cursor-element fixed top-0 left-0 w-8 h-8 border-[1.5px] border-[#8DFB5B]/50 pointer-events-none z-[99999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: clicked ? 1.3 : hovered ? 1.8 : 1,
          rotate: clicked ? 90 : hovered ? 45 : 0,
          borderColor: hovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(141, 251, 91, 0.4)',
          borderRadius: hovered ? '50%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  );
}
