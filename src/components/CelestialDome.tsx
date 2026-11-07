import React, { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CelestialDomeProps {
  scrollProgress?: number;
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

// Precomputed spectral colors (Hex and RGB)
const SPECTRAL_COLORS = [
  { hex: '#AFC5FF', r: 175, g: 197, b: 255 }, // Hot blue (Class O/B)
  { hex: '#D7E6FF', r: 215, g: 230, b: 255 }, // Blue-white (Class A)
  { hex: '#FFFAFA', r: 255, g: 250, b: 245 }, // Pure white
  { hex: '#FFEBD2', r: 255, g: 235, b: 210 }, // Warm yellow (Class G)
  { hex: '#F5D2EB', r: 245, g: 210, b: 235 }, // Soft starlight pink
  { hex: '#DCC8FA', r: 220, g: 200, b: 250 }, // Starlight violet
];

interface DomeStar {
  x0: number;
  y0: number;
  z0: number;
  radius: number;
  baseOpacity: number;
  colorIndex: number;
  colorHex: string;
  twinkleSpeed: number;
  twinklePhase: number;
  isTwinkling: boolean;
  glowRadius?: number;
  hasSpike?: boolean;
}

interface RotationMatrix {
  r00: number;
  r01: number;
  r02: number;
  r10: number;
  r11: number;
  r12: number;
  r20: number;
  r21: number;
  r22: number;
}

function updateRotationMatrix(mat: RotationMatrix, p: number): void {
  const pitch = p * 0.82;
  const yaw = p * 0.44;
  const roll = p * 0.22;

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

export const CelestialDome: React.FC<CelestialDomeProps> = ({
  scrollProgress = 0,
  scrollProgressRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animFrameIdRef = useRef<number | null>(null);

  // Performance-critical animation state refs
  const internalProgressRef = useRef<number>(scrollProgress);
  const smoothedProgressRef = useRef<number>(scrollProgress);
  const prevProgressRef = useRef<number>(scrollProgress);
  const smoothedVelocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Sync prop changes if not using ref
  useEffect(() => {
    if (!scrollProgressRef) {
      internalProgressRef.current = scrollProgress;
    }
  }, [scrollProgress, scrollProgressRef]);

  // Generate 1,800 stars with immutable precomputed coordinates and colors
  const { stars, bgBuckets, prominentStars } = useMemo(() => {
    const prng = createPrng(987654321);
    const starList: DomeStar[] = [];
    const TOTAL_STARS = 1800;

    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < TOTAL_STARS; i++) {
      const y0 = 1 - (i / (TOTAL_STARS - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y0 * y0));
      const theta = 2 * Math.PI * (i / phi) + (prng() - 0.5) * 0.08;

      const x0 = Math.cos(theta) * radiusAtY;
      const z0 = Math.sin(theta) * radiusAtY;

      const tier = prng();
      let radius: number;
      let baseOpacity: number;
      let glowRadius: number | undefined;
      let hasSpike = false;
      let isTwinkling = false;

      if (tier < 0.65) {
        // Background stars (faint, small, static)
        radius = 0.55 + prng() * 0.4;
        baseOpacity = 0.22 + prng() * 0.42;
      } else if (tier < 0.93) {
        // Midground stars
        radius = 0.95 + prng() * 0.65;
        baseOpacity = 0.6 + prng() * 0.32;
        isTwinkling = prng() < 0.28;
      } else {
        // Hero stars (prominent, glowing, diffraction spikes)
        radius = 1.6 + prng() * 0.95;
        baseOpacity = 0.88 + prng() * 0.12;
        glowRadius = radius * (2.8 + prng() * 2.0);
        isTwinkling = prng() < 0.4;
        hasSpike = prng() < 0.3;
      }

      const colorIndex = Math.floor(prng() * SPECTRAL_COLORS.length);
      const colorHex = SPECTRAL_COLORS[colorIndex].hex;

      starList.push({
        x0,
        y0,
        z0,
        radius,
        baseOpacity,
        colorIndex,
        colorHex,
        twinkleSpeed: 0.0015 + prng() * 0.0025,
        twinklePhase: prng() * Math.PI * 2,
        isTwinkling,
        glowRadius,
        hasSpike,
      });
    }

    // Partition stars for batched rendering:
    // Background stars: no glow, no spikes, no twinkling -> grouped into 6 color buckets
    const buckets: DomeStar[][] = Array.from({ length: SPECTRAL_COLORS.length }, () => []);
    const prom: DomeStar[] = [];

    starList.forEach((s) => {
      if (s.glowRadius || s.hasSpike || s.isTwinkling || s.radius > 1.1) {
        prom.push(s);
      } else {
        buckets[s.colorIndex].push(s);
      }
    });

    return { stars: starList, bgBuckets: buckets, prominentStars: prom };
  }, []);

  // Pre-render soft glow sprites to off-screen canvases once
  const glowSprites = useMemo(() => {
    if (typeof document === 'undefined') return [];
    return SPECTRAL_COLORS.map((color) => {
      const sprite = document.createElement('canvas');
      const size = 36;
      sprite.width = size;
      sprite.height = size;
      const sCtx = sprite.getContext('2d');
      if (!sCtx) return sprite;

      const half = size / 2;
      const grad = sCtx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
      grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, size, size);
      return sprite;
    });
  }, []);

  // Pre-render nebula texture to off-screen canvas (eliminates runtime radial gradients)
  const nebulaSprite = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const sprite = document.createElement('canvas');
    const size = 512;
    sprite.width = size;
    sprite.height = size;
    const sCtx = sprite.getContext('2d');
    if (!sCtx) return sprite;

    const half = size / 2;
    // Violet nebula cloud
    const gradViolet = sCtx.createRadialGradient(half, half, 0, half, half, half);
    gradViolet.addColorStop(0, 'rgba(108, 62, 156, 0.32)');
    gradViolet.addColorStop(0.45, 'rgba(79, 43, 117, 0.16)');
    gradViolet.addColorStop(1, 'rgba(24, 12, 40, 0)');
    sCtx.fillStyle = gradViolet;
    sCtx.beginPath();
    sCtx.arc(half, half, half, 0, Math.PI * 2);
    sCtx.fill();

    // Muted pink nebula core
    const pinkCenterX = half + 40;
    const pinkCenterY = half - 20;
    const pinkRadius = half * 0.65;
    const gradPink = sCtx.createRadialGradient(
      pinkCenterX,
      pinkCenterY,
      0,
      pinkCenterX,
      pinkCenterY,
      pinkRadius
    );
    gradPink.addColorStop(0, 'rgba(226, 123, 174, 0.28)');
    gradPink.addColorStop(0.5, 'rgba(180, 81, 131, 0.12)');
    gradPink.addColorStop(1, 'rgba(48, 15, 34, 0)');
    sCtx.fillStyle = gradPink;
    sCtx.beginPath();
    sCtx.arc(pinkCenterX, pinkCenterY, pinkRadius, 0, Math.PI * 2);
    sCtx.fill();

    return sprite;
  }, []);

  // Pre-render horizon bottom glow to off-screen canvas
  const horizonGlowSprite = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const sprite = document.createElement('canvas');
    const w = 512;
    const h = 256;
    sprite.width = w;
    sprite.height = h;
    const sCtx = sprite.getContext('2d');
    if (!sCtx) return sprite;

    const grad = sCtx.createRadialGradient(w / 2, h, 0, w / 2, h, w * 0.55);
    grad.addColorStop(0, 'rgba(242, 169, 200, 1.0)');
    grad.addColorStop(0.35, 'rgba(200, 185, 240, 0.65)');
    grad.addColorStop(0.7, 'rgba(119, 116, 200, 0.25)');
    grad.addColorStop(1, 'rgba(23, 21, 47, 0)');

    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, w, h);
    return sprite;
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
      centerY = height * 0.42;
      fov = Math.max(width, height) * 0.85;

      // Cap devicePixelRatio at 1.5 to slash GPU fillrate overhead on high-res displays
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Pre-allocated rotation matrix objects (reused across all frames)
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
    let lastGradP = -999;
    let lastGradH = 0;

    // Render a single frame with zero dynamic allocations
    const renderFrame = (timestamp: number) => {
      const lastTime = lastTimeRef.current || timestamp;
      const dt = Math.max(1, Math.min(50, timestamp - lastTime));
      lastTimeRef.current = timestamp;

      // Read target progress from ref
      const targetP = scrollProgressRef
        ? scrollProgressRef.current
        : internalProgressRef.current;
      const safeTargetP = prefersReducedMotion ? 0 : Math.max(0, Math.min(1, targetP));

      // Damped smooth progress interpolation
      let currentP = smoothedProgressRef.current;
      const pDiff = safeTargetP - currentP;
      if (Math.abs(pDiff) > 0.0001) {
        currentP += pDiff * 0.22;
      } else {
        currentP = safeTargetP;
      }
      smoothedProgressRef.current = currentP;

      // Calculate smooth velocity from interpolated progress
      const prevP = prevProgressRef.current;
      const deltaP = currentP - prevP;
      prevProgressRef.current = currentP;

      const isMobile = width <= 768;

      let smoothedVel = smoothedVelocityRef.current;
      if (!prefersReducedMotion) {
        const instantVelocity = (deltaP / dt) * 1000;
        if (Math.abs(instantVelocity) > 0.0001) {
          smoothedVel += (instantVelocity - smoothedVel) * 0.35;
        } else {
          smoothedVel *= 0.88; // Exponential velocity decay on rest
        }
        if (Math.abs(smoothedVel) < 0.0001) {
          smoothedVel = 0;
        }
      } else {
        smoothedVel = 0;
      }
      smoothedVelocityRef.current = smoothedVel;

      // ==============================================================
      // 1. ATMOSPHERIC SKY GRADIENT (CACHED WHEN RESTING)
      // ==============================================================
      if (Math.abs(currentP - lastGradP) > 0.002 || height !== lastGradH || !cachedSkyGrad) {
        lastGradP = currentP;
        lastGradH = height;

        const zenithR = Math.round(5 + currentP * 3);
        const zenithG = Math.round(3 + currentP * 3);
        const zenithB = Math.round(14 + currentP * 8);

        const midR = Math.round(18 + currentP * 11);
        const midG = Math.round(14 + currentP * 8);
        const midB = Math.round(44 + currentP * 19);

        const horizonR = Math.round(37 + currentP * 62);
        const horizonG = Math.round(26 + currentP * 24);
        const horizonB = Math.round(64 + currentP * 43);

        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, `rgb(${zenithR},${zenithG},${zenithB})`);
        skyGrad.addColorStop(0.55, `rgb(${midR},${midG},${midB})`);
        skyGrad.addColorStop(1, `rgb(${horizonR},${horizonG},${horizonB})`);
        cachedSkyGrad = skyGrad;
      }

      ctx.fillStyle = cachedSkyGrad;
      ctx.fillRect(0, 0, width, height);

      // ==============================================================
      // 2. 3D ROTATION MATRICES (HEAD & TRAIL)
      // ==============================================================
      updateRotationMatrix(headMat, currentP);

      // Scale factor tuned for the extended 16,000px+ cosmic journey
      const streakScaleFactor = isMobile ? 0.042 : 0.062;
      const maxStreakOffset = isMobile ? 0.040 : 0.058;
      const streakOffset = Math.max(
        -maxStreakOffset,
        Math.min(maxStreakOffset, smoothedVel * streakScaleFactor)
      );

      const isStreakingActive = Math.abs(streakOffset) > 0.0006 && !prefersReducedMotion;
      if (isStreakingActive) {
        updateRotationMatrix(trailMat, currentP - streakOffset);
      }

      // ==============================================================
      // 3. NEBULA GLOWS (GPU SPRITE BLIT)
      // ==============================================================
      if (nebulaSprite) {
        const nebX0 = 0.58;
        const nebY0 = 0.52;
        const nebZ0 = 0.62;

        const nebX = headMat.r00 * nebX0 + headMat.r01 * nebY0 + headMat.r02 * nebZ0;
        const nebY = headMat.r10 * nebX0 + headMat.r11 * nebY0 + headMat.r12 * nebZ0;
        const nebZ = headMat.r20 * nebX0 + headMat.r21 * nebY0 + headMat.r22 * nebZ0;

        const domeDepth = nebZ + 1.25;
        if (domeDepth > 0.15) {
          const nebScreenX = centerX + (nebX / domeDepth) * fov;
          const nebScreenY = centerY - (nebY / domeDepth) * fov;
          const nebRadius = Math.min(width, height) * 0.48;

          ctx.drawImage(
            nebulaSprite,
            nebScreenX - nebRadius,
            nebScreenY - nebRadius,
            nebRadius * 2,
            nebRadius * 2
          );
        }
      }

      // ==============================================================
      // 4. STAR RENDERING & VELOCITY STREAKING (BATCHED)
      // ==============================================================
      const maxScreenStreakLength = isMobile ? 32 : 52;

      if (isStreakingActive) {
        // --- 4A. BATCHED BACKGROUND STREAKS (Partitioned by color) ---
        ctx.lineCap = 'round';
        ctx.lineWidth = 0.85;

        for (let b = 0; b < bgBuckets.length; b++) {
          const bucket = bgBuckets[b];
          const bCount = bucket.length;
          if (bCount === 0) continue;

          ctx.strokeStyle = SPECTRAL_COLORS[b].hex;
          ctx.globalAlpha = 0.45;
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

            if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
              continue;
            }

            const xTrail = trailMat.r00 * star.x0 + trailMat.r01 * star.y0 + trailMat.r02 * star.z0;
            const yTrail = trailMat.r10 * star.x0 + trailMat.r11 * star.y0 + trailMat.r12 * star.z0;
            const zTrail = trailMat.r20 * star.x0 + trailMat.r21 * star.y0 + trailMat.r22 * star.z0;

            const zDepthTrail = zTrail + 1.25;
            let tailX = screenX;
            let tailY = screenY;

            if (zDepthTrail > 0.2) {
              tailX = centerX + (xTrail / zDepthTrail) * fov;
              tailY = centerY - (yTrail / zDepthTrail) * fov;

              const dx = tailX - screenX;
              const dy = tailY - screenY;
              const streakLen = Math.hypot(dx, dy);

              if (streakLen > maxScreenStreakLength) {
                const scale = maxScreenStreakLength / streakLen;
                tailX = screenX + dx * scale;
                tailY = screenY + dy * scale;
              }
            }

            ctx.moveTo(tailX, tailY);
            ctx.lineTo(screenX, screenY);
          }
          ctx.stroke();
        }

        // --- 4B. PROMINENT / HERO STARS (Individual high-fidelity streaks) ---
        const promCount = prominentStars.length;
        for (let i = 0; i < promCount; i++) {
          const star = prominentStars[i];

          const xRot = headMat.r00 * star.x0 + headMat.r01 * star.y0 + headMat.r02 * star.z0;
          const yRot = headMat.r10 * star.x0 + headMat.r11 * star.y0 + headMat.r12 * star.z0;
          const zRot = headMat.r20 * star.x0 + headMat.r21 * star.y0 + headMat.r22 * star.z0;

          const zDepth = zRot + 1.25;
          if (zDepth <= 0.2) continue;

          const screenX = centerX + (xRot / zDepth) * fov;
          const screenY = centerY - (yRot / zDepth) * fov;

          if (screenX < -70 || screenX > width + 70 || screenY < -70 || screenY > height + 70) {
            continue;
          }

          const domePerspectiveFactor = Math.max(0.2, (zRot + 0.8) / 1.8);
          const opacity = star.baseOpacity * domePerspectiveFactor;
          const radius = star.radius * (0.8 + 0.25 * domePerspectiveFactor);

          const xTrail = trailMat.r00 * star.x0 + trailMat.r01 * star.y0 + trailMat.r02 * star.z0;
          const yTrail = trailMat.r10 * star.x0 + trailMat.r11 * star.y0 + trailMat.r12 * star.z0;
          const zTrail = trailMat.r20 * star.x0 + trailMat.r21 * star.y0 + trailMat.r22 * star.z0;

          const zDepthTrail = zTrail + 1.25;
          let tailX = screenX;
          let tailY = screenY;

          if (zDepthTrail > 0.2) {
            tailX = centerX + (xTrail / zDepthTrail) * fov;
            tailY = centerY - (yTrail / zDepthTrail) * fov;

            const dx = tailX - screenX;
            const dy = tailY - screenY;
            const streakLen = Math.hypot(dx, dy);

            if (streakLen > maxScreenStreakLength) {
              const scale = maxScreenStreakLength / streakLen;
              tailX = screenX + dx * scale;
              tailY = screenY + dy * scale;
            }
          }

          ctx.globalAlpha = Math.min(1.0, opacity);
          ctx.strokeStyle = star.colorHex;
          ctx.lineWidth = Math.max(0.9, radius * 1.35);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(screenX, screenY);
          ctx.stroke();

          // Star Core
          ctx.fillStyle = star.colorHex;
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      } else {
        // --- 4C. AT REST: BATCHED BACKGROUND STARS (Ultra-fast single-pass fill) ---
        for (let b = 0; b < bgBuckets.length; b++) {
          const bucket = bgBuckets[b];
          const bCount = bucket.length;
          if (bCount === 0) continue;

          ctx.fillStyle = SPECTRAL_COLORS[b].hex;
          ctx.globalAlpha = 0.42;
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

            if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
              continue;
            }

            // High-speed rect blit for tiny background starlight dots
            ctx.rect(screenX - 0.65, screenY - 0.65, 1.3, 1.3);
          }
          ctx.fill();
        }

        // --- 4D. AT REST: PROMINENT STARS (Twinkling, Glow Sprites, Spikes) ---
        const promCount = prominentStars.length;
        for (let i = 0; i < promCount; i++) {
          const star = prominentStars[i];

          const xRot = headMat.r00 * star.x0 + headMat.r01 * star.y0 + headMat.r02 * star.z0;
          const yRot = headMat.r10 * star.x0 + headMat.r11 * star.y0 + headMat.r12 * star.z0;
          const zRot = headMat.r20 * star.x0 + headMat.r21 * star.y0 + headMat.r22 * star.z0;

          const zDepth = zRot + 1.25;
          if (zDepth <= 0.2) continue;

          const screenX = centerX + (xRot / zDepth) * fov;
          const screenY = centerY - (yRot / zDepth) * fov;

          if (screenX < -30 || screenX > width + 30 || screenY < -30 || screenY > height + 30) {
            continue;
          }

          const domePerspectiveFactor = Math.max(0.2, (zRot + 0.8) / 1.8);
          let opacity = star.baseOpacity * domePerspectiveFactor;

          if (star.isTwinkling && !prefersReducedMotion) {
            const delta = Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase) * 0.2;
            opacity = Math.max(0.12, Math.min(1.0, opacity + delta));
          }

          const radius = star.radius * (0.8 + 0.25 * domePerspectiveFactor);

          // Fast GPU blit using pre-rendered glow sprite
          if (star.glowRadius && glowSprites[star.colorIndex]) {
            const curGlow = star.glowRadius * domePerspectiveFactor;
            ctx.globalAlpha = opacity * 0.55;
            ctx.drawImage(
              glowSprites[star.colorIndex],
              screenX - curGlow,
              screenY - curGlow,
              curGlow * 2,
              curGlow * 2
            );
          }

          // Optical Diffraction Spikes on Hero Stars
          if (star.hasSpike && opacity > 0.4) {
            const spikeLen = radius * 7.5;
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
      }

      // ==============================================================
      // 5. HORIZON GLOW BEAM (PRE-RENDERED SPRITE BLIT)
      // ==============================================================
      if (horizonGlowSprite) {
        const horizonGlowOpacity = 0.18 + currentP * 0.22;
        const horizonGlowHeight = height * (0.32 + currentP * 0.15);

        ctx.globalAlpha = horizonGlowOpacity;
        ctx.drawImage(
          horizonGlowSprite,
          0,
          height - horizonGlowHeight,
          width,
          horizonGlowHeight
        );
        ctx.globalAlpha = 1.0;
      }
    };

    // Unified 60fps RAF loop
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
    stars,
    bgBuckets,
    prominentStars,
    glowSprites,
    nebulaSprite,
    horizonGlowSprite,
    prefersReducedMotion,
    scrollProgressRef,
  ]);

  return (
    <div className="celestial-dome-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="celestial-dome-canvas" />
    </div>
  );
};