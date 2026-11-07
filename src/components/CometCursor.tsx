import React, { useEffect, useRef } from 'react';
import '../styles/cursor.css';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export const CometCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only activate for devices with a fine pointer (desktop mouse)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Add CSS flag class to hide default cursor
    document.body.classList.add('has-comet-cursor');

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Positions & Motion state
    const target = { x: -100, y: -100 };
    const comet = { x: -100, y: -100 };
    let isVisible = false;
    let isHovered = false;
    let currentSpeed = 0;
    const trail: TrailPoint[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!isVisible) {
        comet.x = e.clientX;
        comet.y = e.clientY;
        isVisible = true;
      }

      // Check if hovering over interactive elements
      const element = e.target as HTMLElement | null;
      if (element) {
        const interactive = !!element.closest(
          'a, button, input, textarea, [role="button"], [role="tab"], .celestial-object-card, .trajectory-nav-card, .expedition-card, .nav-item'
        );
        isHovered = interactive;
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
    };

    const handlePointerEnter = (e: MouseEvent) => {
      isVisible = true;
      target.x = e.clientX;
      target.y = e.clientY;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    document.documentElement.addEventListener('mouseenter', handlePointerEnter);

    // High-performance animation loop (Zero React re-renders)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Smooth lerp follow
        const dx = target.x - comet.x;
        const dy = target.y - comet.y;
        comet.x += dx * 0.34;
        comet.y += dy * 0.34;

        currentSpeed = Math.sqrt(dx * dx + dy * dy);

        // Deposit trail points when moving
        if (currentSpeed > 0.8) {
          trail.push({
            x: comet.x,
            y: comet.y,
            age: 0,
            maxAge: Math.min(22, Math.max(12, Math.round(10 + currentSpeed * 0.4))),
          });
        }
      }

      // Update and filter trail points
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += 1;
        if (trail[i].age >= trail[i].maxAge) {
          trail.splice(i, 1);
        }
      }

      // ==============================================================
      // 1. DRAW TAPERED COMET TRAIL
      // ==============================================================
      if (trail.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < trail.length - 1; i++) {
          const pt = trail[i];
          const nextPt = trail[i + 1];

          // Progress from tail (0) to head (1)
          const progress = i / (trail.length - 1);
          const life = 1 - pt.age / pt.maxAge;
          const alpha = progress * life * 0.65;

          const strokeWidth = (isHovered ? 4.5 : 3.5) * progress * life + 0.5;

          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);

          // Color transition: faint violet tail -> radiant lavender head
          if (progress > 0.6) {
            ctx.strokeStyle = `rgba(242, 169, 200, ${alpha * 0.9})`;
            ctx.shadowColor = 'rgba(242, 169, 200, 0.4)';
            ctx.shadowBlur = 6;
          } else {
            ctx.strokeStyle = `rgba(119, 116, 200, ${alpha * 0.7})`;
            ctx.shadowColor = 'rgba(119, 116, 200, 0.2)';
            ctx.shadowBlur = 3;
          }

          ctx.lineWidth = strokeWidth;
          ctx.stroke();
        }

        ctx.restore();
      }

      // ==============================================================
      // 2. DRAW COMET HEAD & SOFT CORONA
      // ==============================================================
      if (isVisible && comet.x > 0 && comet.y > 0) {
        ctx.save();

        const baseHeadRadius = isHovered ? 3.8 : 2.6;
        const baseGlowRadius = isHovered ? 16 : 10;

        // Outer soft ethereal halo
        const haloGrad = ctx.createRadialGradient(
          comet.x,
          comet.y,
          0,
          comet.x,
          comet.y,
          baseGlowRadius
        );
        haloGrad.addColorStop(0, isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(233, 228, 245, 0.85)');
        haloGrad.addColorStop(0.35, isHovered ? 'rgba(242, 169, 200, 0.6)' : 'rgba(200, 185, 240, 0.45)');
        haloGrad.addColorStop(0.7, 'rgba(119, 116, 200, 0.2)');
        haloGrad.addColorStop(1, 'rgba(23, 21, 47, 0)');

        ctx.beginPath();
        ctx.arc(comet.x, comet.y, baseGlowRadius, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        // Interactive subtle target ring when hovering clickable elements
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(comet.x, comet.y, 14, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(242, 169, 200, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Brilliant compact white core
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, baseHeadRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-comet-cursor');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      document.documentElement.removeEventListener('mouseenter', handlePointerEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="comet-cursor-canvas" aria-hidden="true" />;
};

