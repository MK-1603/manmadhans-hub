import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  glowColor?: string;
  badgeText?: string;
}

export default function PremiumCard({
  title,
  subtitle,
  children,
  glowColor,
  badgeText,
  className,
  ...props
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        "relative group rounded-[14px] bg-bg-secondary border border-border-default p-6 transition-all duration-300 hover:border-border-strong hover:-translate-y-1 hover:shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    >
      {/* Ambient Radial Glow on Hover */}
      <div
        className="absolute -inset-0.5 rounded-[14px] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor || 'rgba(var(--particle-rgb), 0.04)'}, transparent 70%)`
        }}
      />

      {/* Cyberpunk Brackets / Corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/30 rounded-tl-[4px] group-hover:border-accent transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/30 rounded-br-[4px] group-hover:border-accent transition-colors duration-300" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-[20px] font-semibold text-text-primary tracking-tight group-hover:text-accent transition-colors duration-200">
              {title}
            </h3>
            {badgeText && (
              <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full bg-accent-dim text-accent border border-border-strong shrink-0">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] text-text-muted font-bold tracking-[0.08em] uppercase leading-none">
              {subtitle}
            </p>
          )}
        </div>

        <div className="text-[14px] text-text-muted leading-[1.6]">
          {children}
        </div>
      </div>
    </div>
  );
}
