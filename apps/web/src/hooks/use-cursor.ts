"use client";

import { useContext } from "react";
import { CursorContext } from "@/components/ui/cursor/CursorProvider";

export const useCursorType = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursorType must be used within a CursorProvider");
  }
  return context;
};
