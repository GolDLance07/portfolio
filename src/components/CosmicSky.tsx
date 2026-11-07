import React, { useEffect, useRef, useId, useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CosmicSkyProps {
  skyParallaxX?: number;
  skyParallaxY?: number;
  nebulaParallaxX?: number;
  nebulaParallaxY?: number;
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

interface CanvasStar {
  normX: number;
  normY: number;
  radius: number;
  baseOpacity: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  isTwinkling: boolean;
  glowRadius?: number;
}

interface HeroStarData {
  id: string;
  cx: number;
  cy: number;
  spikeLength: number;
  spikeThickness: number;
  color: string;
  haloColor: string;
  haloRadius: number;
  coreRadius: number;
  opacity: number;
  twinkleDelay?: number;
}

export const CosmicSky: React.FC<CosmicSkyProps> = ({
  skyParallaxX = 0,
  skyParallaxY = 0,
  nebulaParallaxX = 0,
  nebulaParallaxY = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaSvgRef = useRef<SVGSVGElement>(null);
  const heroStarsRef = useRef<SVGGElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animFrameIdRef = useRef<number | null>(null);

  const svgId = useId();
  // Filter and gradient unique IDs
  const blurLargeId = `${svgId}-blur-large`;
  const blurMediumId = `${svgId}-blur-medium`;
  const blurSubtleId = `${svgId}-blur-subtle`;
  const baseCosmicSkyGradId = `${svgId}-base-sky-grad`;
  const blueNebulaGrad1 = `${svgId}-blue-neb-1`;
  const blueNebulaGrad2 = `${svgId}-blue-neb-2`;
  const violetNebulaGrad1 = `${svgId}-violet-neb-1`;
  const violetNebulaGrad2 = `${svgId}-violet-neb-2`;
  const pinkNebulaGrad1 = `${svgId}-pink-neb-1`;
  const pinkNebulaGrad2 = `${svgId}-pink-neb-2`;
  const darkRiftGrad1 = `${svgId}-dark-rift-1`;
  const darkRiftGrad2 = `${svgId}-dark-rift-2`;

  // Deterministically generate ~1,400 multi-tiered stars across three depth planes
  const starfieldData = useMemo(() => {
    const prng = createPrng(420691337);
    const stars: CanvasStar[] = [];
    const TOTAL_STARS = 1450;

    // Spectral color palettes matching real astronomical photography
    const spectralColors = [
      'rgba(175, 202, 255, ', // Class O/B hot blue
      'rgba(212, 226, 255, ', // Blue-white
      'rgba(245, 242, 255, ', // Pure starlight white
      'rgba(255, 244, 230, ', // Warm starlight yellow
      'rgba(250, 215, 235, ', // Dusty starlight rose
      'rgba(224, 208, 252, ', // Starlight lavender
    ];

    for (let i = 0; i < TOTAL_STARS; i++) {
      let normX = prng();
      let normY = prng();

      // Cosmic clustering: natural concentration along the diagonal nebula corridor
      // (y roughly = 0.22*x + 0.2 + Gaussian offset)
      if (i < 700) {
        // Star corridor along the galactic plane
        const corridorY = 0.22 * normX + 0.15;
        const spread = (prng() + prng() + prng() - 1.5) * 0.38;
        normY = Math.max(0.01, Math.min(0.98, corridorY + spread));
      } else if (i < 950) {
        // Stellar cluster centered in the violet/pink nursery (x ~ 0.75, y ~ 0.3)
        const clusterSpreadX = (prng() + prng() - 1) * 0.28;
        const clusterSpreadY = (prng() + prng() - 1) * 0.22;
        normX = Math.max(0.01, Math.min(0.99, 0.74 + clusterSpreadX));
        normY = Math.max(0.01, Math.min(0.98, 0.3 + clusterSpreadY));
      }

      // Three depth tiers
      const depthTier = prng();
      let radius: number;
      let baseOpacity: number;
      let isTwinkling = false;
      let glowRadius: number | undefined = undefined;

      if (depthTier < 0.68) {
        // Tier 1: Faint distant background micro-stars
        radius = 0.45 + prng() * 0.45;
        baseOpacity = 0.18 + prng() * 0.38;
      } else if (depthTier < 0.92) {
        // Tier 2: Midground luminous stars
        radius = 0.9 + prng() * 0.6;
        baseOpacity = 0.55 + prng() * 0.32;
        isTwinkling = prng() < 0.22;
      } else {
        // Tier 3: Foreground bright stars with subtle aura
        radius = 1.5 + prng() * 0.85;
        baseOpacity = 0.85 + prng() * 0.15;
        glowRadius = radius * (2.8 + prng() * 1.8);
        isTwinkling = prng() < 0.35;
      }

      const colorPrefix = spectralColors[Math.floor(prng() * spectralColors.length)];

      stars.push({
        normX,
        normY,
        radius,
        baseOpacity,
        color: colorPrefix,
        twinkleSpeed: 0.0012 + prng() * 0.0022,
        twinklePhase: prng() * Math.PI * 2,
        isTwinkling,
        glowRadius,
      });
    }

    return stars;
  }, []);

  // Hero stars with prominent optical diffraction spikes
  const heroStars: HeroStarData[] = useMemo(
    () => [
      {
        id: 'hero-1',
        cx: 940,
        cy: 145,
        spikeLength: 32,
        spikeThickness: 1.2,
        color: '#FFFFFF',
        haloColor: '#F2A9C8',
        haloRadius: 24,
        coreRadius: 2.8,
        opacity: 0.95,
        twinkleDelay: 0.4,
      },
      {
        id: 'hero-2',
        cx: 1240,
        cy: 215,
        spikeLength: 26,
        spikeThickness: 1.1,
        color: '#EAF1FF',
        haloColor: '#7774C8',
        haloRadius: 20,
        coreRadius: 2.4,
        opacity: 0.9,
        twinkleDelay: 1.8,
      },
      {
        id: 'hero-3',
        cx: 690,
        cy: 110,
        spikeLength: 28,
        spikeThickness: 1.1,
        color: '#FFFFFF',
        haloColor: '#C8B9F0',
        haloRadius: 22,
        coreRadius: 2.6,
        opacity: 0.92,
        twinkleDelay: 2.5,
      },
      {
        id: 'hero-4',
        cx: 410,
        cy: 230,
        spikeLength: 22,
        spikeThickness: 0.9,
        color: '#E8F0FF',
        haloColor: '#4F72B5',
        haloRadius: 18,
        coreRadius: 2.1,
        opacity: 0.82,
        twinkleDelay: 1.1,
      },
      {
        id: 'hero-5',
        cx: 820,
        cy: 290,
        spikeLength: 24,
        spikeThickness: 1.0,
        color: '#FFF2F8',
        haloColor: '#DE88B0',
        haloRadius: 19,
        coreRadius: 2.3,
        opacity: 0.88,
        twinkleDelay: 3.2,
      },
      {
        id: 'hero-6',
        cx: 1070,
        cy: 390,
        spikeLength: 20,
        spikeThickness: 0.9,
        color: '#F4EDFF',
        haloColor: '#C8B9F0',
        haloRadius: 16,
        coreRadius: 2.0,
        opacity: 0.84,
        twinkleDelay: 0.8,
      },
      {
        id: 'hero-7',
        cx: 190,
        cy: 130,
        spikeLength: 18,
        spikeThickness: 0.85,
        color: '#Dce8ff',
        haloColor: '#36528C',
        haloRadius: 15,
        coreRadius: 1.9,
        opacity: 0.78,
        twinkleDelay: 2.1,
      },
      {
        id: 'hero-8',
        cx: 1350,
        cy: 95,
        spikeLength: 24,
        spikeThickness: 1.0,
        color: '#FFFFFF',
        haloColor: '#F2A9C8',
        haloRadius: 20,
        coreRadius: 2.2,
        opacity: 0.88,
        twinkleDelay: 1.5,
      },
      {
        id: 'hero-9',
        cx: 560,
        cy: 440,
        spikeLength: 17,
        spikeThickness: 0.8,
        color: '#F0EAF8',
        haloColor: '#7774C8',
        haloRadius: 14,
        coreRadius: 1.8,
        opacity: 0.75,
        twinkleDelay: 2.9,
      },
    ],
    []
  );

  // High-performance canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 480);
      dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // If reduced motion, draw once statically
      if (prefersReducedMotion) {
        renderStars(0);
      }
    };

    const renderStars = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Render all 1,450 stars with subpixel precision
      for (let i = 0; i < starfieldData.length; i++) {
        const star = starfieldData[i];
        const x = star.normX * width;
        const y = star.normY * height;

        let currentOpacity = star.baseOpacity;
        if (star.isTwinkling && !prefersReducedMotion) {
          const delta = Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase) * 0.22;
          currentOpacity = Math.max(0.12, Math.min(1.0, star.baseOpacity + delta));
        }

        // Draw soft glow for bright stars
        if (star.glowRadius) {
          const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, star.glowRadius);
          glowGrad.addColorStop(0, `${star.color}${currentOpacity * 0.45})`);
          glowGrad.addColorStop(1, `${star.color}0)`);
          ctx.beginPath();
          ctx.arc(x, y, star.glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${currentOpacity})`;
        ctx.fill();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let lastTime = 0;
    const animate = (time: number) => {
      // Throttle rendering slightly to ~30-60 fps for extreme efficiency
      if (time - lastTime > 24) {
        lastTime = time;
        renderStars(time);
      }
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      animFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [starfieldData, prefersReducedMotion]);

  // Apply parallax coordinates to separate canvas and SVG layers
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate3d(${skyParallaxX}px, ${skyParallaxY}px, 0)`;
    }
    if (nebulaSvgRef.current) {
      nebulaSvgRef.current.style.transform = `translate3d(${nebulaParallaxX}px, ${nebulaParallaxY}px, 0)`;
    }
    if (heroStarsRef.current) {
      const heroX = skyParallaxX * 1.3;
      const heroY = skyParallaxY * 1.3;
      heroStarsRef.current.style.transform = `translate3d(${heroX}px, ${heroY}px, 0)`;
    }
  }, [skyParallaxX, skyParallaxY, nebulaParallaxX, nebulaParallaxY, prefersReducedMotion]);

  return (
    <div className="cosmic-sky-container" aria-hidden="true">
      {/* ============================================================== */}
      {/* 1. DEEP SPACE BACKDROP & HIGH-DENSITY PROCEDURAL STARFIELD      */}
      {/* ============================================================== */}
      <canvas ref={canvasRef} className="cosmic-starfield-canvas" />

      {/* ============================================================== */}
      {/* 2. MULTILAYERED NEBULA & COSMIC CLOUD FORMATIONS (SVG)         */}
      {/* ============================================================== */}
      <svg
        ref={nebulaSvgRef}
        className="cosmic-nebula-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gaussian Blur Filters with generous boundaries to eliminate hard clipping */}
          <filter id={blurLargeId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="62" />
          </filter>
          <filter id={blurMediumId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="36" />
          </filter>
          <filter id={blurSubtleId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>

          {/* Deep Space Background Atmosphere Gradient */}
          <linearGradient id={baseCosmicSkyGradId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#05030E" stopOpacity="0.94" />
            <stop offset="25%" stopColor="#0C091E" stopOpacity="0.88" />
            <stop offset="60%" stopColor="#171233" stopOpacity="0.82" />
            <stop offset="85%" stopColor="#251A40" stopOpacity="0.86" />
            <stop offset="100%" stopColor="#352048" stopOpacity="0.92" />
          </linearGradient>

          {/* Blue/Indigo Nebula Gradients (Left and Lower Sky) */}
          <radialGradient id={blueNebulaGrad1} cx="32%" cy="58%" r="48%">
            <stop offset="0%" stopColor="#2E447C" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#1B2852" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#101735" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0C1028" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={blueNebulaGrad2} cx="22%" cy="42%" r="42%">
            <stop offset="0%" stopColor="#4A6BAE" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#2A4072" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#162244" stopOpacity="0" />
          </radialGradient>

          {/* Violet Nebula Gradients (Central and Right Sky) */}
          <radialGradient id={violetNebulaGrad1} cx="74%" cy="26%" r="52%">
            <stop offset="0%" stopColor="#6C3E9C" stopOpacity="0.65" />
            <stop offset="38%" stopColor="#4F2B75" stopOpacity="0.45" />
            <stop offset="72%" stopColor="#2F184B" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#180C28" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={violetNebulaGrad2} cx="58%" cy="38%" r="40%">
            <stop offset="0%" stopColor="#8A4FB8" stopOpacity="0.42" />
            <stop offset="50%" stopColor="#5B2E85" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2E1448" stopOpacity="0" />
          </radialGradient>

          {/* Dusty Pink Cosmic Ridge Gradients (Right & Central Highlights) */}
          <radialGradient id={pinkNebulaGrad1} cx="80%" cy="32%" r="38%">
            <stop offset="0%" stopColor="#E27BAE" stopOpacity="0.52" />
            <stop offset="35%" stopColor="#B45183" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#6B284D" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#300F22" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={pinkNebulaGrad2} cx="68%" cy="18%" r="30%">
            <stop offset="0%" stopColor="#F2A9C8" stopOpacity="0.42" />
            <stop offset="50%" stopColor="#C96894" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6A2248" stopOpacity="0" />
          </radialGradient>

          {/* Interstellar Dust Lanes / Dark Absorption Nebulae (Creates Deep Astronomical Rifts) */}
          <radialGradient id={darkRiftGrad1} cx="46%" cy="38%" r="40%">
            <stop offset="0%" stopColor="#04020A" stopOpacity="0.88" />
            <stop offset="55%" stopColor="#070412" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0C081E" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={darkRiftGrad2} cx="70%" cy="45%" r="35%">
            <stop offset="0%" stopColor="#05030C" stopOpacity="0.82" />
            <stop offset="60%" stopColor="#090516" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0D0820" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Underlying Atmospheric Sky Base */}
        <rect width="1440" height="900" fill={`url(#${baseCosmicSkyGradId})`} />

        {/* 2. Blue and Indigo Formations (Left & Lower Portion) */}
        <g className="nebula-blue-group" style={{ mixBlendMode: 'screen' }}>
          {/* Broad Indigo Cloud Deck */}
          <path
            d="M -60 220 C 140 180, 360 260, 520 380 C 660 480, 580 680, 420 760 C 240 840, -40 780, -80 560 Z"
            fill={`url(#${blueNebulaGrad1})`}
            filter={`url(#${blurLargeId})`}
          />

          {/* Luminous Cerulean Center in Lower Left */}
          <path
            d="M 60 340 C 220 280, 420 360, 540 480 C 620 570, 510 720, 320 710 C 140 700, 20 540, 60 340 Z"
            fill={`url(#${blueNebulaGrad2})`}
            filter={`url(#${blurMediumId})`}
          />

          {/* Delicate Blue Gas Filament */}
          <path
            d="M 120 440 Q 280 400 460 520 T 640 680"
            stroke="#4A6BAE"
            strokeWidth="48"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
            filter={`url(#${blurMediumId})`}
          />
        </g>

        {/* 3. Violet and Dusty Pink Formations (Central & Right Regions) */}
        <g className="nebula-violet-group" style={{ mixBlendMode: 'screen' }}>
          {/* Great Amethyst Cloud across Zenith & Center-Right */}
          <path
            d="M 440 60 C 720 -20, 1120 40, 1340 160 C 1480 260, 1420 520, 1180 580 C 940 640, 620 540, 480 380 C 380 260, 320 120, 440 60 Z"
            fill={`url(#${violetNebulaGrad1})`}
            filter={`url(#${blurLargeId})`}
          />

          {/* Central Violet Cloud Bridge */}
          <path
            d="M 480 220 C 660 160, 880 240, 1020 360 C 1120 460, 980 620, 780 590 C 600 560, 420 440, 420 310 Z"
            fill={`url(#${violetNebulaGrad2})`}
            filter={`url(#${blurMediumId})`}
          />

          {/* Dusty Pink Radiant Nursery (Center-Right, behind Moon & Mid-Sky) */}
          <path
            d="M 760 140 C 980 90, 1220 160, 1320 280 C 1390 380, 1280 490, 1080 480 C 900 470, 780 360, 740 250 Z"
            fill={`url(#${pinkNebulaGrad1})`}
            filter={`url(#${blurMediumId})`}
          />

          {/* Glowing Dusty Pink Gas Tendril (Reaching upper-right) */}
          <path
            d="M 620 240 C 820 180, 1060 210, 1280 150 C 1380 120, 1420 70, 1360 40"
            stroke="#F2A9C8"
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
            opacity="0.38"
            filter={`url(#${blurSubtleId})`}
          />

          {/* Soft Starlight Filament Ridge */}
          <path
            d="M 780 320 Q 980 260 1220 330 T 1380 240"
            stroke="#DE88B0"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
            opacity="0.42"
            filter={`url(#${blurSubtleId})`}
          />
        </g>

        {/* 4. Interstellar Dark Absorption Lanes (Deep Space Crevasses) */}
        <g className="nebula-dark-rifts">
          {/* Great Cosmic Rift dividing Blue and Violet clouds */}
          <path
            d="M 460 -40 C 580 140, 520 340, 600 520 C 660 640, 720 760, 760 900 L 400 900 C 380 720, 360 520, 340 320 C 320 140, 360 20, 460 -40 Z"
            fill={`url(#${darkRiftGrad1})`}
            filter={`url(#${blurMediumId})`}
          />

          {/* Dark Dust Finger extending into the Violet clouds */}
          <path
            d="M 740 360 C 880 340, 1040 390, 1140 430 C 1060 490, 880 480, 760 440 Z"
            fill={`url(#${darkRiftGrad2})`}
            filter={`url(#${blurSubtleId})`}
          />
        </g>

        {/* 5. Constellation Lines Connecting Select Cosmic Anchors */}
        <g
          className="constellation-network"
          stroke="#C8B9F0"
          strokeWidth="0.8"
          strokeDasharray="3 5"
          opacity="0.34"
        >
          {/* Orion/Cassiopeia inspired celestial alignment */}
          <polyline points="410,230 690,110 940,145 1240,215" fill="none" />
          <line x1="690" y1="110" x2="820" y2="290" />
          <line x1="940" y1="145" x2="820" y2="290" />
          <line x1="820" y1="290" x2="1070" y2="390" />
        </g>

        {/* 6. Prominent Hero Stars with Diffraction Spikes */}
        <g ref={heroStarsRef} className="hero-diffraction-stars">
          {heroStars.map((star) => (
            <g
              key={star.id}
              transform={`translate(${star.cx}, ${star.cy})`}
              className={!prefersReducedMotion ? 'hero-star-shimmer' : ''}
              style={{
                animationDelay: star.twinkleDelay ? `${star.twinkleDelay}s` : '0s',
              }}
            >
              {/* Soft Luminous Corona Glow */}
              <circle cx="0" cy="0" r={star.haloRadius} fill={star.haloColor} opacity="0.28" />
              <circle cx="0" cy="0" r={star.haloRadius * 0.55} fill={star.haloColor} opacity="0.45" />

              {/* 4-Point Optical Diffraction Spikes (Tapered Diamond Geometry) */}
              {/* Horizontal Spikes */}
              <polygon
                points={`-${star.spikeLength},0 0,-${star.spikeThickness} ${star.spikeLength},0 0,${star.spikeThickness}`}
                fill={star.color}
                opacity={star.opacity}
              />
              {/* Vertical Spikes */}
              <polygon
                points={`0,-${star.spikeLength} -${star.spikeThickness},0 0,${star.spikeLength} ${star.spikeThickness},0`}
                fill={star.color}
                opacity={star.opacity}
              />
              {/* Subtle 45° Secondary Micro-Spikes */}
              <line
                x1={-star.spikeLength * 0.35}
                y1={-star.spikeLength * 0.35}
                x2={star.spikeLength * 0.35}
                y2={star.spikeLength * 0.35}
                stroke={star.haloColor}
                strokeWidth="0.6"
                opacity={star.opacity * 0.65}
              />
              <line
                x1={star.spikeLength * 0.35}
                y1={-star.spikeLength * 0.35}
                x2={-star.spikeLength * 0.35}
                y2={star.spikeLength * 0.35}
                stroke={star.haloColor}
                strokeWidth="0.6"
                opacity={star.opacity * 0.65}
              />

              {/* Intense Star Core */}
              <circle cx="0" cy="0" r={star.coreRadius} fill="#FFFFFF" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

