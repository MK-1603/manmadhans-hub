"use client";

import React, { useEffect, useRef } from "react";
import Button3D from "@/components/ui/Button3D";
import { motion } from "framer-motion";
import { AnimatedItem } from "@/components/ui/AnimatedSection";

export default function CTASection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: any[] = [];
    const particleCount = 20;

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1 + 0.2;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.2 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }
      draw() {
        if (!ctx) return;
        const rgb = getComputedStyle(document.documentElement).getPropertyValue('--particle-rgb').trim() || '126, 242, 82';
        ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="cta-section" className="py-[60px] px-[5%] bg-transparent text-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />

      <div className="max-w-[700px] mx-auto relative z-[2]">
        <AnimatedItem className="flex flex-col items-center">
          <div className="flex justify-center gap-1.5 mb-[16px] text-[14px] text-amber-500/80">✦ ✦ ✦</div>

          <div className="inline-block font-sans text-[9px] font-bold text-[var(--neon)] tracking-[4px] uppercase mb-[16px]">
            SYSTEM_ACCESS_INVITATION
          </div>

          <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,48px)] leading-[1.1] tracking-tight mb-[16px]">
            <span className="text-[var(--muted)]">Ready to Enter the</span><br />
            <span className="bg-gradient-to-br from-[var(--neon)] to-[var(--emerald)] bg-clip-text text-transparent italic">Universe? ⚡</span>
          </h2>

          <p className="text-[14px] text-[var(--muted)] max-w-[440px] mx-auto mb-9 leading-[1.6]">
            Secure your invitation to the most exclusive AI ecosystem. Experience intelligence without boundaries.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button3D onClick={() => window.dispatchEvent(new Event('openLogin'))} style={{ padding: "12px 34px", fontSize: "14px" }}>
              🚀 Get Started
            </Button3D>
            <Button3D variant="ghost" href="/guide" style={{ padding: "12px 34px", fontSize: "14px" }}>
              📖 Read Guide
            </Button3D>
          </div>

          <p className="text-[10px] text-[var(--muted2)] tracking-[1px] font-sans uppercase mt-12">
            Limited slots available for alpha testers
          </p>
        </AnimatedItem>
      </div>
    </section>
  );
}
