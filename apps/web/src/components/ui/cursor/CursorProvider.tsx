"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CustomCursor from "./CustomCursor";

type CursorType = "default" | "hover" | "drag" | "view" | "none";

interface CursorContextType {
  type: CursorType;
  setType: (type: CursorType) => void;
}

export const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState<CursorType>("default");
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize theme color (avoids inline script tag warnings in layout.tsx)
    try {
      const color = localStorage.getItem('theme-color') || 'Neon Green';
      document.documentElement.setAttribute('data-theme-color', color);
    } catch (e) {}

    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Globally detect data-cursor="hover" on mouseover
  useEffect(() => {
    if (isMobile) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorData = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      
      if (cursorData === "hover") {
        setType("hover");
      } else if (cursorData === "drag") {
        setType("drag");
      } else if (cursorData === "view") {
        setType("view");
      } else if (cursorData === "none") {
        setType("none");
      } else if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("button") || target.style.cursor === "pointer") {
        setType("hover");
      } else {
        setType("default");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, [isMobile]);

  return (
    <CursorContext.Provider value={{ type, setType }}>
      {children}
      {mounted && !isMobile && createPortal(<CustomCursor />, document.body)}
    </CursorContext.Provider>
  );
}
