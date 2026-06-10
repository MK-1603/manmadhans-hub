import React from 'react';
import { cn } from '@/lib/utils';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger';
}

export default function Button3D({ children, variant = 'primary', className, ...props }: Button3DProps) {
  let baseColor, depthColor, textColor, borderColor;
  
  if (variant === 'primary') {
    baseColor = 'bg-accent hover:bg-accent-hover';
    depthColor = 'bg-accent-depth';
    textColor = 'text-white';
  } else if (variant === 'danger') {
    baseColor = 'bg-red-500';
    depthColor = 'bg-red-700 border-b border-red-600/50';
    textColor = 'text-white';
  } else {
    baseColor = 'bg-button-outline-bg';
    depthColor = 'bg-button-outline-depth';
    textColor = 'text-accent';
    borderColor = 'border border-accent/20';
  }

  // Extract all width-related classes from the parent className to mirror them to the top-face layer
  const widthClasses = className
    ? className
        .split(' ')
        .filter((c) => c.startsWith('w-') || c.includes(':w-'))
        .join(' ')
    : '';

  return (
    <button
      className={cn(
        "relative group overflow-visible rounded-[10px] bg-transparent cursor-pointer active:translate-y-[2px] transition-transform duration-75 outline-none select-none",
        className
      )}
      {...props}
    >
      {/* Bevel Depth Shadow Layer */}
      <div className={cn("absolute inset-0 rounded-[10px] translate-y-[3px]", depthColor)} />
      
      {/* Top Face Layer */}
      <div className={cn(
        "relative px-6 py-2.5 rounded-[10px] font-sans font-semibold text-[14px] tracking-[0.01em]",
        "transform -translate-y-[2px] group-hover:-translate-y-[3px] group-active:translate-y-[0.5px] transition-transform duration-100 ease-out",
        "flex items-center justify-center",
        widthClasses,
        baseColor, textColor, borderColor
      )}>
        {children}
      </div>
    </button>
  );
}
