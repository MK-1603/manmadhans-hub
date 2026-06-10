"use client";

import React, { useEffect, useState } from "react";
// Removed unused imports

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ backgroundColor: "#060806", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/favicon.ico" alt="Loading" style={{ width: 80, height: 80, opacity: 0.5 }} />
      </div>
    );
  }

  return <>{children}</>;
}
