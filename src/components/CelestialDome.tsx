import React, { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CelestialDomeProps {
  scrollProgressRef?: React.RefObject<number>;
}

// 100% deterministic pseudo-random number generator (Mulberry32)
function createPrng(seed: number) {
  let s = seed;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Real astronomical spectral colors (Midnight / Deep-Space palette)
// Prioritizing cold highlights (#A7C5DF), pure starlight (#E5EAF2), and stellar blue (#426C91)
const MIDNIGHT_SPECTRAL_COLORS = [
  { hex: '#A7C5DF', r: 167, g: 197, b: 223 }, // Cold highlight (Class B/A)
  { hex: '#D7E6FF', r: 215, g: 230, b: 255 }, // Pale ice blue
  { hex: '#E5EAF2', r: 229, g: 234, b: 242 }, // Pure crisp starlight
  { hex: '#FFFFFF', r: 255, g: 255, b: 255 }, // Brilliant stellar white
  { hex: '#FFF4E0', r: 255, g: 244, b: 224 }, // Pale warm starlight (Class G/F)
  { hex: '#5B86AB', r: 91, g: 134, b: 171 },  // Stellar blue depth
  { hex: '#8F8CD4', r: 143, g: 140, b: 212 }, // Restrained subtle violet accent
];

type StarPopulation = 'distant' | 'midground' | 'foreground';

interface DomeStar {
  x0: number;
  y0: number;
  z0: number;
  population: StarPopulation;
  radius: number;
  baseOpacity: number;
  colorIndex: number;
  colorHex: string;
  twinkleSpeed: number;
  twinklePhase: number;
  isTwinkling: boolean;
  driftSpeedX: number;
  driftSpeedY: number;
  driftPhase: number;
  glowRadius?: number;
  hasSpike?: boolean;
}

interface RotationMatrix {
  r00: number; r01: number; r02: number;
  r10: number; r11: number; r12: number;
  r20: number; r21: number; r22: number;
}

function updateRotationMatrix(mat: RotationMatrix, p: number): void {
  // Enhanced spatial travel feel across continuous document scroll
  const pitch = p * 1.35;
  const yaw = p * 0.72;
  const roll = p * 0.35;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosR = Math.cos(roll);
  const sinR = Math.sin(roll);

  mat.r00 = cosR * cosY + sinR * sinP * sinY;
  mat.r01 = -sinR * cosP;
  mat.r02 = -cosR * sinY + sinR * sinP * cosY;

  mat.r10 = sinR * cosY - cosR * sinP * sinY;
  mat.r11 = cosR * cosP;
  mat.r12 = -sinR * sinY - cosR * sinP * cosY;

  mat.r20 = cosP * sinY;
  mat.r21 = sinP;
  mat.r22 = cosP * cosY;
}

export const CelestialDome: React.FC<CelestialDomeProps> = ({ scrollProgressRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animFrameIdRef = useRef<number | null>(null);

  // Performance-critical animation state refs
  const smoothedProgressRef = useRef<number>(0);
  const prevProgressRef = useRef<number>(0);
  const smoothedVelocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Pointer state for Gravitational Lens Star Effect
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const isTouchDeviceRef = useRef<boolean>(false);

  // Generate 1,750 stars organized into three distinct depth populations
  const { distantBuckets, midgroundStars, foregroundStars } = useMemo(() => {
    const prng = createPrng(48271039);
    const TOTAL_STARS = 1750;

    const distant: DomeStar[][] = Array.from({ length: MIDNIGHT_SPECTRAL_COLORS.length }, () => []);
    const midground: DomeStar[] = [];
    const foreground: DomeStar[] = [];

    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < TOTAL_STARS; i++) {
      const y0 = 1 - (i / (TOTAL_STARS - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y0 * y0));
      const theta = 2 * Math.PI * (i / phi) + (prng() - 0.5) * 0.08;

      const x0 = Math.cos(theta) * radiusAtY;
      const z0 = Math.sin(theta) * radiusAtY;

      const tier = prng();
      let population: StarPopulation;
      let radius: number;
      let baseOpacity: number;
      let glowRadius: number | undefined;
      let hasSpike = false;
      let isTwinkling = false;

      // 60% Distant Stars: subtle, micro-twinkle, minimal parallax, unaffected by pointer
      if (tier < 0.60) {
        population = 'distant';
        radius = 0.5 + prng() * 0.45;
        baseOpacity = 0.22 + prng() * 0.38;
        isTwinkling = prng() < 0.15;
      }
      // 30% Midground Stars: gentle drift, subtle twinkling, moderate depth response
      else if (tier < 0.90) {
        population = 'midground';
        radius = 0.95 + prng() * 0.65;
        baseOpacity = 0.55 + prng() * 0.35;
        isTwinkling = prng() < 0.35;
      }
      // 10% Foreground Stars: prominent starlight, strong parallax, responsive to pointer gravitational lens
      else {
        population = 'foreground';
        radius = 1.7 + prng() * 1.1;
        baseOpacity = 0.88 + prng() * 0.12;
        glowRadius = radius * (2.6 + prng() * 1.8);
        isTwinkling = prng() < 0.45;
        hasSpike = prng() < 0.35;
      }

      const colorIndex = Math.floor(prng() * MIDNIGHT_SPECTRAL_COLORS.length);
      const colorHex = MIDNIGHT_SPECTRAL_COLORS[colorIndex].hex;

      const star: DomeStar = {
        x0,
        y0,
        z0,
        population,
        radius,
        baseOpacity,
        colorIndex,
        colorHex,
        twinkleSpeed: 0.0012 + prng() * 0.0022,
        twinklePhase: prng() * Math.PI * 2,
        isTwinkling,
        driftSpeedX: (prng() - 0.5) * 0.0003,
        driftSpeedY: (prng() - 0.5) * 0.0003,
        driftPhase: prng() * Math.PI * 2,
        glowRadius,
        hasSpike,
      };

      if (population === 'distant') {
        distant[colorIndex].push(star);
      } else if (population === 'midground') {
        midground.push(star);
      } else {
        foreground.push(star);
      }
    }

    return {
      distantBuckets: distant,
      midgroundStars: midground,
      foregroundStars: foreground,
    };
  }, []);

  // Pre-render soft glow sprites in the midnight spectral palette
  const glowSprites = useMemo(() => {
    if (typeof document === 'undefined') return [];
    return MIDNIGHT_SPECTRAL_COLORS.map((color) => {
      const sprite = document.createElement('canvas');
      const size = 40;
      sprite.width = size;
      sprite.height = size;
      const sCtx = sprite.getContext('2d');
      if (!sCtx) return sprite;

      const half = size / 2;
      const grad = sCtx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, 0.72)`);
      grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, size, size);
      return sprite;
    });
  }, []);

  // Pre-render restrained deep-blue and midnight nebula formations (zero heavy purples)
  const nebulaSprite = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const sprite = document.createElement('canvas');
    const size = 512;
    sprite.width = size;
    sprite.height = size;
    const sCtx = sprite.getContext('2d');
    if (!sCtx) return sprite;

    const half = size / 2;
    // Deep midnight gas cloud (#102B49)
    const gradBlue = sCtx.createRadialGradient(half, half, 0, half, half, half);
    gradBlue.addColorStop(0, 'rgba(16, 43, 73, 0.28)');
    gradBlue.addColorStop(0.45, 'rgba(9, 23, 43, 0.16)');
    gradBlue.addColorStop(1, 'rgba(5, 11, 24, 0)');
    sCtx.fillStyle = gradBlue;
    sCtx.beginPath();
    sCtx.arc(half, half, half, 0, Math.PI * 2);
    sCtx.fill();

    // Subtle cold stellar highlight core (#426C91)
    const coreX = half + 35;
    const coreY = half - 25;
    const coreR = half * 0.6;
    const gradCore = sCtx.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreR);
    gradCore.addColorStop(0, 'rgba(66, 108, 145, 0.22)');
    gradCore.addColorStop(0.4, 'rgba(16, 43, 73, 0.10)');
    gradCore.addColorStop(1, 'rgba(5, 11, 24, 0)');
    sCtx.fillStyle = gradCore;
    sCtx.beginPath();
    sCtx.arc(coreX, coreY, coreR, 0, Math.PI * 2);
    sCtx.fill();

    return sprite;
  }, []);

  // Setup pointer tracking for the Gravitational Lens Star Effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for touch-only devices
    isTouchDeviceRef.current =
      window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

    if (isTouchDeviceRef.current) return;

    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
    };
  }, []);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let fov = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 480);
      centerX = width * 0.5;
      centerY = height * 0.45;
      fov = Math.max(width, height) * 0.95;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Pre-allocated rotation matrices
    const headMat: RotationMatrix = {
      r00: 1, r01: 0, r02: 0,
      r10: 0, r11: 1, r12: 0,
      r20: 0, r21: 0, r22: 1,
    };
    const trailMat: RotationMatrix = {
      r00: 1, r01: 0, r02: 0,
      r10: 0, r11: 1, r12: 0,
      r20: 0, r21: 0, r22: 1,
    };

    let cachedSkyGrad: CanvasGradient | null = null;
    let lastGradH = 0;

    const renderFrame = (timestamp: number) => {
      const lastTime = lastTimeRef.current || timestamp;
      const dt = Math.max(1, Math.min(50, timestamp - lastTime));
      lastTimeRef.current = timestamp;

      // Calculate continuous native document scroll progress
      let targetP = 0;
      if (scrollProgressRef && scrollProgressRef.current !== undefined) {
        targetP = scrollProgressRef.current;
      } else if (typeof window !== 'undefined') {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        targetP = docH > 0 ? window.scrollY / docH : 0;
      }
      const safeTargetP = prefersReducedMotion ? 0 : Math.max(0, Math.min(1, targetP));

      // Damped smooth progress interpolation
      let currentP = smoothedProgressRef.current;
      const pDiff = safeTargetP - currentP;
      if (Math.abs(pDiff) > 0.0001) {
        currentP += pDiff * 0.18;
      } else {
        currentP = safeTargetP;
      }
      smoothedProgressRef.current = currentP;

      // Calculate smooth velocity for star streaking
      const prevP = prevProgressRef.current;
      const deltaP = currentP - prevP;
      prevProgressRef.current = currentP;

      const isMobile = width <= 768;

      let smoothedVel = smoothedVelocityRef.current;
      if (!prefersReducedMotion) {
        const instantVelocity = (deltaP / dt) * 1000;
        if (Math.abs(instantVelocity) > 0.0001) {
          smoothedVel += (instantVelocity - smoothedVel) * 0.32;
        } else {
          smoothedVel *= 0.88;
        }
        if (Math.abs(smoothedVel) < 0.0001) {
          smoothedVel = 0;
        }
      } else {
        smoothedVel = 0;
      }
      smoothedVelocityRef.current = smoothedVel;

      // ==============================================================
      // 1. REALISTIC MIDNIGHT SKY GRADIENT
      // Palette: Cosmic Black (#050B18) -> Midnight Blue (#09172B) -> Deep Blue (#102B49)
      // ==============================================================
      if (height !== lastGradH || !cachedSkyGrad) {
        lastGradH = height;
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#050B18');   // Cosmic black at zenith
        skyGrad.addColorStop(0.45, '#09172B'); // Midnight blue
        skyGrad.addColorStop(0.85, '#102B49'); // Deep blue horizon
        skyGrad.addColorStop(1, '#0B1E34');    // Soft stellar horizon haze
        cachedSkyGrad = skyGrad;
      }

      ctx.fillStyle = cachedSkyGrad;
      ctx.fillRect(0, 0, width, height);

      // ==============================================================
      // 2. 3D ROTATION MATRICES (HEAD & TRAIL)
      // ==============================================================
      updateRotationMatrix(headMat, currentP);

      const streakScaleFactor = isMobile ? 0.035 : 0.052;
      const maxStreakOffset = isMobile ? 0.038 : 0.055;
      const streakOffset = Math.max(
        -maxStreakOffset,
        Math.min(maxStreakOffset, smoothedVel * streakScaleFactor)
      );

      const isStreakingActive = Math.abs(streakOffset) > 0.0008 && !prefersReducedMotion;
      if (isStreakingActive) {
        updateRotationMatrix(trailMat, currentP - streakOffset);
      }

      // ==============================================================
      // 3. RESTRAINED MIDNIGHT NEBULA CLOUD
      // ==============================================================
      if (nebulaSprite) {
        const nebX0 = 0.52;
        const nebY0 = 0.48;
        const nebZ0 = 0.65;

        const nebX = headMat.r00 * nebX0 + headMat.r01 * nebY0 + headMat.r02 * nebZ0;
        const nebY = headMat.r10 * nebX0 + headMat.r11 * nebY0 + headMat.r12 * nebZ0;
        const nebZ = headMat.r20 * nebX0 + headMat.r21 * nebY0 + headMat.r22 * nebZ0;

        const domeDepth = nebZ + 1.25;
        if (domeDepth > 0.15) {
          const nebScreenX = centerX + (nebX / domeDepth) * fov;
          const nebScreenY = centerY - (nebY / domeDepth) * fov;
          const nebRadius = Math.min(width, height) * 0.45;

          ctx.drawImage(
            nebulaSprite,
            nebScreenX - nebRadius,
            nebScreenY - nebRadius,
            nebRadius * 2,
            nebRadius * 2
          );
        }
      }

      // Gravitational Lens Cursor State
      const pointer = pointerRef.current;
      const isLensActive = pointer.active && !isTouchDeviceRef.current && !prefersReducedMotion;
      const lensX = pointer.x;
      const lensY = pointer.y;
      const lensRadius = 160;
      const lensRadiusSq = lensRadius * lensRadius;
      const lensSigmaSq2 = 2 * 56 * 56;

      // ==============================================================
      // 4A. POPULATION 1: DISTANT STARS (60% — Subtle, Static, Efficient)
      // Fast single-pass batching by spectral color
      // ==============================================================
      for (let b = 0; b < distantBuckets.length; b++) {
        const bucket = distantBuckets[b];
        const bCount = bucket.length;
        if (bCount === 0) continue;

        ctx.fillStyle = MIDNIGHT_SPECTRAL_COLORS[b].hex;
        ctx.globalAlpha = 0.40;
        ctx.beginPath();

        for (let i = 0; i < bCount; i++) {
          const star = bucket[i];

          const xRot = headMat.r00 * star.x0 + headMat.r01 * star.y0 + headMat.r02 * star.z0;
          const yRot = headMat.r10 * star.x0 + headMat.r11 * star.y0 + headMat.r12 * star.z0;
          const zRot = headMat.r20 * star.x0 + headMat.r21 * star.y0 + headMat.r22 * star.z0;

          const zDepth = zRot + 1.25;
          if (zDepth <= 0.2) continue;

          const screenX = centerX + (xRot / zDepth) * fov;
          const screenY = centerY - (yRot / zDepth) * fov;

          if (screenX < -15 || screenX > width + 15 || screenY < -15 || screenY > height + 15) {
            continue;
          }

          ctx.rect(screenX - 0.55, screenY - 0.55, 1.1, 1.1);
        }
        ctx.fill();
      }

      // ==============================================================
      // 4B. POPULATION 2: MIDGROUND STARS (30% — Gentle drift, Twinkling)
      // ==============================================================
      const midCount = midgroundStars.length;
      for (let i = 0; i < midCount; i++) {
        const star = midgroundStars[i];

        // Micro-drift calculation
        const driftX = Math.sin(timestamp * 0.0004 + star.driftPhase) * 0.008;
        const driftY = Math.cos(timestamp * 0.0003 + star.driftPhase) * 0.008;

        const xRot = headMat.r00 * (star.x0 + driftX) + headMat.r01 * (star.y0 + driftY) + headMat.r02 * star.z0;
        const yRot = headMat.r10 * (star.x0 + driftX) + headMat.r11 * (star.y0 + driftY) + headMat.r12 * star.z0;
        const zRot = headMat.r20 * star.x0 + headMat.r21 * star.y0 + headMat.r22 * star.z0;

        const zDepth = zRot + 1.25;
        if (zDepth <= 0.2) continue;

        let screenX = centerX + (xRot / zDepth) * fov;
        let screenY = centerY - (yRot / zDepth) * fov;

        // Subtle Gravitational Lens Deflection on Midground Stars
        if (isLensActive) {
          const dx = screenX - lensX;
          const dy = screenY - lensY;
          const distSq = dx * dx + dy * dy;
          if (distSq < lensRadiusSq && distSq > 0.5) {
            const r = Math.sqrt(distSq);
            const influence = Math.exp(-distSq / lensSigmaSq2);
            const ux = dx / r;
            const uy = dy / r;
            const tx = -uy;
            const ty = ux;
            // Subtle 6px repulsion + 3px tangential deflection
            screenX += (ux * 6.0 + tx * 3.0) * influence;
            screenY += (uy * 6.0 + ty * 3.0) * influence;
          }
        }

        if (screenX < -25 || screenX > width + 25 || screenY < -25 || screenY > height + 25) {
          continue;
        }

        const domePerspective = Math.max(0.25, (zRot + 0.8) / 1.8);
        let opacity = star.baseOpacity * domePerspective;

        if (star.isTwinkling && !prefersReducedMotion) {
          const delta = Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase) * 0.18;
          opacity = Math.max(0.18, Math.min(1.0, opacity + delta));
        }

        ctx.globalAlpha = opacity;
        ctx.fillStyle = star.colorHex;
        ctx.beginPath();
        ctx.arc(screenX, screenY, star.radius * 0.85, 0, Math.PI * 2);
        ctx.fill();
      }

      // ==============================================================
      // 4C. POPULATION 3: FOREGROUND STARS (10% — Prominent, Spikes, Lens)
      // Highest depth responsiveness and full gravitational lensing effect
      // ==============================================================
      const foreCount = foregroundStars.length;
      for (let i = 0; i < foreCount; i++) {
        const star = foregroundStars[i];

        const xRot = headMat.r00 * star.x0 + headMat.r01 * star.y0 + headMat.r02 * star.z0;
        const yRot = headMat.r10 * star.x0 + headMat.r11 * star.y0 + headMat.r12 * star.z0;
        const zRot = headMat.r20 * star.x0 + headMat.r21 * star.y0 + headMat.r22 * star.z0;

        const zDepth = zRot + 1.25;
        if (zDepth <= 0.2) continue;

        let screenX = centerX + (xRot / zDepth) * fov;
        let screenY = centerY - (yRot / zDepth) * fov;

        // Full Gravitational Lens Displacement on Foreground Stars
        if (isLensActive) {
          const dx = screenX - lensX;
          const dy = screenY - lensY;
          const distSq = dx * dx + dy * dy;
          if (distSq < lensRadiusSq && distSq > 0.5) {
            const r = Math.sqrt(distSq);
            const influence = Math.exp(-distSq / lensSigmaSq2);
            const ux = dx / r;
            const uy = dy / r;
            const tx = -uy;
            const ty = ux;
            // 15px repulsion + 7.5px tangential bending around cursor
            screenX += (ux * 15.0 + tx * 7.5) * influence;
            screenY += (uy * 15.0 + ty * 7.5) * influence;
          }
        }

        if (screenX < -60 || screenX > width + 60 || screenY < -60 || screenY > height + 60) {
          continue;
        }

        const domePerspective = Math.max(0.3, (zRot + 0.8) / 1.8);
        let opacity = star.baseOpacity * domePerspective;

        if (star.isTwinkling && !prefersReducedMotion) {
          const delta = Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase) * 0.25;
          opacity = Math.max(0.25, Math.min(1.0, opacity + delta));
        }

        const radius = star.radius * (0.85 + 0.25 * domePerspective);

        // Pre-rendered soft glow sprite
        if (star.glowRadius && glowSprites[star.colorIndex]) {
          const curGlow = star.glowRadius * domePerspective;
          ctx.globalAlpha = opacity * 0.65;
          ctx.drawImage(
            glowSprites[star.colorIndex],
            screenX - curGlow,
            screenY - curGlow,
            curGlow * 2,
            curGlow * 2
          );
        }

        // Diffraction Spikes on Hero Stars
        if (star.hasSpike && opacity > 0.35) {
          const spikeLen = radius * 7.2;
          ctx.globalAlpha = opacity * 0.85;
          ctx.strokeStyle = star.colorHex;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(screenX - spikeLen, screenY);
          ctx.lineTo(screenX + spikeLen, screenY);
          ctx.moveTo(screenX, screenY - spikeLen);
          ctx.lineTo(screenX, screenY + spikeLen);
          ctx.stroke();
        }

        // Star Core
        ctx.globalAlpha = Math.min(1.0, opacity);
        ctx.fillStyle = star.colorHex;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
    };

    const animate = (timestamp: number) => {
      renderFrame(timestamp);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    distantBuckets,
    midgroundStars,
    foregroundStars,
    glowSprites,
    nebulaSprite,
    prefersReducedMotion,
    scrollProgressRef,
  ]);

  return (
    <div className="celestial-dome-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="celestial-dome-canvas" />
    </div>
  );
};
