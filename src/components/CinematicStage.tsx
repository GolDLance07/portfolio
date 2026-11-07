import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CelestialDome } from './CelestialDome';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TRANSITION_CONFIG } from '../config/transitions';
import '../styles/cinematic-stage.css';

interface CinematicStageProps {
  sceneHome: React.ReactNode;
  sceneAbout: React.ReactNode;
  sceneSkills: React.ReactNode;
  sceneProjects: React.ReactNode;
  sceneFrontier: React.ReactNode;
  sceneContact: React.ReactNode;
  onActiveSceneChange?: (sceneId: string) => void;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

const SCENE_IDS = ['home', 'about', 'skills', 'projects', 'frontier', 'contact'] as const;

export const CinematicStage: React.FC<CinematicStageProps> = ({
  sceneHome,
  sceneAbout,
  sceneSkills,
  sceneProjects,
  sceneFrontier,
  sceneContact,
  onActiveSceneChange,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Scene layer refs
  const observatoryLayerRef = useRef<HTMLDivElement>(null);
  const horizonLayerRef = useRef<HTMLDivElement>(null);
  const skillsLayerRef = useRef<HTMLDivElement>(null);
  const projectsLayerRef = useRef<HTMLDivElement>(null);
  const frontierLayerRef = useRef<HTMLDivElement>(null);
  const contactLayerRef = useRef<HTMLDivElement>(null);

  // Cumulative anchor offsets for native browser navigation (#home, #about, #skills, #projects, #frontier, #contact)
  const [sceneOffsets, setSceneOffsets] = useState<number[]>([0, 3800, 7600, 12300, 16300, 20100]);
  const [totalTrackHeight, setTotalTrackHeight] = useState<string>('2200vh');

  // Performance-critical animation refs
  const targetScrollYRef = useRef<number>(0);
  const currentScrollYRef = useRef<number>(0);
  const stageTopRef = useRef<number>(0);
  const sceneOffsetsRef = useRef<number[]>([0, 3800, 7600, 12300, 16300, 20100]);
  const transitionDistsRef = useRef<number[]>([3800, 3800, 4700, 4000, 3800]);
  const needsUpdateRef = useRef<boolean>(true);
  const lastActiveSceneRef = useRef<string>('home');
  const scrollProgressRef = useRef<number>(0);

  // Compute dynamic track height and distances using the shared transitions configuration
  const updateLayout = useCallback(() => {
    if (typeof window === 'undefined') return;
    const windowH = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    // Cache track offset relative to document top
    if (trackRef.current) {
      stageTopRef.current = trackRef.current.offsetTop;
    }

    // Individual transition travel distances computed from shared TRANSITION_CONFIG (5 corridors)
    const dists = TRANSITION_CONFIG.corridors.map((corridor) => {
      const mult = isMobile ? corridor.mobileMultiplier : corridor.desktopMultiplier;
      return Math.round(windowH * mult);
    });
    transitionDistsRef.current = dists;

    // Cumulative scene anchor positions (index 0 to 5)
    const offsets = [
      0,
      dists[0],
      dists[0] + dists[1],
      dists[0] + dists[1] + dists[2],
      dists[0] + dists[1] + dists[2] + dists[3],
      dists[0] + dists[1] + dists[2] + dists[3] + dists[4],
    ];
    sceneOffsetsRef.current = offsets;
    setSceneOffsets(offsets);

    // Total track height = total stage transit + 1 trailing viewport
    const totalStageDist = offsets[5];
    const totalPx = totalStageDist + windowH;
    setTotalTrackHeight(`${totalPx}px`);
    needsUpdateRef.current = true;
  }, []);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout, { passive: true });
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  // Unified, critically damped animation loop for all 5 scenes
  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      targetScrollYRef.current = window.scrollY;
      needsUpdateRef.current = true;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    targetScrollYRef.current = window.scrollY;
    currentScrollYRef.current = window.scrollY;

    const renderLoop = () => {
      const targetY = targetScrollYRef.current;
      let currentY = currentScrollYRef.current;
      const dy = targetY - currentY;

      // Critically damped smooth follow using shared damping coefficient
      if (Math.abs(dy) > 0.08) {
        currentY += dy * TRANSITION_CONFIG.scrollDamping;
      } else {
        currentY = targetY;
      }
      currentScrollYRef.current = currentY;

      const isMoving = Math.abs(dy) > 0.08;
      if (!isMoving && !needsUpdateRef.current) {
        rafId = requestAnimationFrame(renderLoop);
        return;
      }
      if (!isMoving) {
        needsUpdateRef.current = false;
      }

      // Relative stage scroll
      const stageScrollY = Math.max(0, currentY - stageTopRef.current);
      const offsets = sceneOffsetsRef.current;
      const dists = transitionDistsRef.current;
      const totalStageDist = offsets[5] || 1;

      // Overall progress (0.0 to 1.0) feeds continuous CelestialDome rotation
      const overallProgress = Math.max(0, Math.min(1, stageScrollY / totalStageDist));
      scrollProgressRef.current = overallProgress;

      // Calculate continuous fractional scene position (0.0 to 5.0) across non-uniform corridors
      let scenePos = 0;
      if (stageScrollY <= 0) {
        scenePos = 0;
      } else if (stageScrollY >= offsets[5]) {
        scenePos = 5;
      } else if (stageScrollY < offsets[1]) {
        scenePos = 0 + (stageScrollY - offsets[0]) / (dists[0] || 1);
      } else if (stageScrollY < offsets[2]) {
        scenePos = 1 + (stageScrollY - offsets[1]) / (dists[1] || 1);
      } else if (stageScrollY < offsets[3]) {
        scenePos = 2 + (stageScrollY - offsets[2]) / (dists[2] || 1);
      } else if (stageScrollY < offsets[4]) {
        scenePos = 3 + (stageScrollY - offsets[3]) / (dists[3] || 1);
      } else {
        scenePos = 4 + (stageScrollY - offsets[4]) / (dists[4] || 1);
      }
      scenePos = Math.max(0, Math.min(5, scenePos));

      // Active Scene Detection for Navigation Header (trigger on crossing midpoint)
      const activeIdx = Math.max(0, Math.min(5, Math.round(scenePos)));
      const activeSceneId = SCENE_IDS[activeIdx];
      if (activeSceneId !== lastActiveSceneRef.current) {
        lastActiveSceneRef.current = activeSceneId;
        onActiveSceneChange?.(activeSceneId);
      }

      const layers = [
        observatoryLayerRef.current,
        horizonLayerRef.current,
        skillsLayerRef.current,
        projectsLayerRef.current,
        frontierLayerRef.current,
        contactLayerRef.current,
      ];
      const windowH = window.innerHeight;

      // Reduced motion fallback
      if (prefersReducedMotion) {
        layers.forEach((layer, idx) => {
          if (!layer) return;
          const isCurrent = idx === activeIdx;
          layer.style.transform = 'none';
          layer.style.opacity = isCurrent ? '1' : '0';
          layer.style.pointerEvents = isCurrent ? 'auto' : 'none';
          layer.style.visibility = isCurrent ? 'visible' : 'hidden';
        });
        rafId = requestAnimationFrame(renderLoop);
        return;
      }

      // ==============================================================
      // EXTENDED CINEMATIC DEPTH-TRANSITION PACING ENGINE
      // - Settled zone: |d| <= settledRange (resting & interactive)
      // - Departure zone: settledRange < d <= departureEnd (recedes beneath horizon)
      // - Deep Celestial Transit Window: departureEnd < t < 1 - departureEnd (clear starry sky)
      // - Arrival zone: -departureEnd <= d < -settledRange (ascends from depth)
      // ==============================================================
      const { settledRange, departureSpan, arrivalSpan } = TRANSITION_CONFIG.pacing;
      const departureEnd = settledRange + departureSpan; // e.g. 0.18 + 0.28 = 0.46

      layers.forEach((layer, idx) => {
        if (!layer) return;

        // Relative distance from scene `idx` being centered
        const d = scenePos - idx;

        if (Math.abs(d) > departureEnd) {
          // Out of viewport range - completely hidden
          layer.style.opacity = '0';
          layer.style.pointerEvents = 'none';
          layer.style.visibility = 'hidden';
          const offY = d > 0 ? windowH * 0.55 : windowH * 0.45;
          layer.style.transform = `translate3d(0, ${offY.toFixed(1)}px, 0)`;
        } else if (Math.abs(d) <= settledRange) {
          // Settled exploration zone
          layer.style.visibility = 'visible';
          layer.style.pointerEvents = 'auto';
          layer.style.opacity = '1';
          layer.style.transform = 'translate3d(0, 0px, 0)';
        } else if (d > settledRange) {
          // Departing forward (descending beneath horizon)
          layer.style.visibility = 'visible';
          layer.style.pointerEvents = 'none';
          const progress = (d - settledRange) / departureSpan; // 0 to 1 as it departs
          const descT = Math.pow(Math.max(0, Math.min(1, progress)), 1.25);
          const translateY = descT * (windowH * 0.55);
          const opacity = 1.0 - smoothstep(0.0, 1.0, progress);

          layer.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
          layer.style.opacity = opacity.toFixed(3);
        } else {
          // Approaching from distance (ascending into view)
          layer.style.visibility = 'visible';
          layer.style.pointerEvents = 'none';
          const progress = (d + departureEnd) / arrivalSpan; // 0 to 1 as it approaches
          const ascT = easeOutCubic(Math.max(0, Math.min(1, progress)));
          const translateY = (1 - ascT) * (windowH * 0.45);
          const opacity = smoothstep(0.0, 1.0, progress);

          layer.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
          layer.style.opacity = opacity.toFixed(3);
        }
      });

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [onActiveSceneChange, prefersReducedMotion]);

  return (
    <div
      ref={trackRef}
      className="cinematic-stage-track"
      style={{ minHeight: totalTrackHeight }}
      aria-label="The Observatory Cinematic Stage"
    >
      {/* Precision Anchors for Browser Navigation */}
      <div id="home" className="stage-anchor-marker anchor-home" style={{ top: 0 }} aria-hidden="true" />
      <div
        id="about"
        className="stage-anchor-marker anchor-about"
        style={{ top: `${sceneOffsets[1]}px` }}
        aria-hidden="true"
      />
      <div
        id="skills"
        className="stage-anchor-marker anchor-skills"
        style={{ top: `${sceneOffsets[2]}px` }}
        aria-hidden="true"
      />
      <div
        id="projects"
        className="stage-anchor-marker anchor-projects"
        style={{ top: `${sceneOffsets[3]}px` }}
        aria-hidden="true"
      />
      <div
        id="frontier"
        className="stage-anchor-marker anchor-frontier"
        style={{ top: `${sceneOffsets[4]}px` }}
        aria-hidden="true"
      />
      <div
        id="contact"
        className="stage-anchor-marker anchor-contact"
        style={{ top: `${sceneOffsets[5]}px` }}
        aria-hidden="true"
      />

      {/* Pinned Sticky Viewport */}
      <div ref={viewportRef} className="cinematic-sticky-viewport">
        {/* ============================================================== */}
        {/* SHARED CELESTIAL DOME CANVAS                                   */}
        {/* Continuous 3D spherical dome rotation across all 6 scenes       */}
        {/* ============================================================== */}
        <CelestialDome scrollProgressRef={scrollProgressRef} />

        {/* ============================================================== */}
        {/* 6 SCENE PLANES (GLIDE ACROSS THE HORIZON)                      */}
        {/* ============================================================== */}
        <div className="dome-landscape-overlay">
          {/* Scene 01: Observatory (Home) */}
          <div ref={observatoryLayerRef} className="landscape-plane plane-observatory" aria-hidden="false">
            {sceneHome}
          </div>

          {/* Scene 02: Horizon (About) */}
          <div ref={horizonLayerRef} className="landscape-plane plane-horizon">
            {sceneAbout}
          </div>

          {/* Scene 03: Constellations (Skills) */}
          <div ref={skillsLayerRef} className="landscape-plane plane-skills">
            {sceneSkills}
          </div>

          {/* Scene 04: Celestial Archive (Projects) */}
          <div ref={projectsLayerRef} className="landscape-plane plane-projects">
            {sceneProjects}
          </div>

          {/* Scene 05: The Next Frontier (Currently Working On) */}
          <div ref={frontierLayerRef} className="landscape-plane plane-frontier">
            {sceneFrontier}
          </div>

          {/* Scene 06: The Signal (Contact) */}
          <div ref={contactLayerRef} className="landscape-plane plane-contact">
            {sceneContact}
          </div>
        </div>
      </div>
    </div>
  );
};
