"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Button3DProps {
  variant?: "primary" | "ghost" | "outline";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  style?: React.CSSProperties;
}

export default function Button3D({
  variant = "primary",
  children,
  className = "",
  onClick,
  href,
  style,
}: Button3DProps) {
  // Clean, iOS-style flat buttons, box format
  const baseClass = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 active:scale-95 outline-none select-none",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    variant === "ghost" && "bg-transparent text-primary hover:bg-primary/10",
    variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground shadow-sm"
  );

  if (href) {
    return (
      <a href={href} className={cn(baseClass, className)} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClass, className)} style={style}>
      {children}
    </button>
  );
}
