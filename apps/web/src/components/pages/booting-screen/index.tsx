"use client";

import React, { useEffect, useState } from "react";
import MobileBootingScreen from "./MobileBootingScreen";
import DesktopBootingScreen from "./DesktopBootingScreen";

export default function BootingScreen({ onComplete }: { onComplete?: () => void }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!mounted) return null;

  return isMobile ? (
    <MobileBootingScreen onComplete={onComplete} />
  ) : (
    <DesktopBootingScreen onComplete={onComplete} />
  );
}
