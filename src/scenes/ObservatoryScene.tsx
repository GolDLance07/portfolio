import React, { useEffect, useRef, useState, useId } from 'react';
import anime from 'animejs';
import { ArrowDown, Compass, FolderGit2, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CosmicSky } from '../components/CosmicSky';
import { smoothScrollTo } from '../utils/smoothScroll';
import '../styles/hero.css';

interface ObservatorySceneProps {
  hideSky?: boolean;
}

export const ObservatoryScene: React.FC<ObservatorySceneProps> = ({ hideSky = false }) => {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const telescopeRef = useRef<SVGGElement>(null);
  const distantMountainsRef = useRef<HTMLDivElement>(null);
  const midMountainsRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const celestialRef = useRef<HTMLDivElement>(null);
  const entranceAnimRef = useRef<anime.AnimeInstance | null>(null);

  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Generate unique IDs for SVG gradients and masks to prevent collisions
  const svgId = useId();
  const moonGlowId = `${svgId}-moon-glow`;
  const moonGradId = `${svgId}-moon-grad`;
  const distantRidgeGradId = `${svgId}-distant-ridge-grad`;
  const midRidgeGradId = `${svgId}-mid-ridge-grad`;
  const domeGradId = `${svgId}-dome-grad`;

  // Detect pointer device capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      setIsPointerDevice(hasFinePointer);
    }
  }, []);

  // Milestone 1 Entrance Animation via Anime.js
  useEffect(() => {
    if (prefersReducedMotion) {
      // Instantly show content for reduced-motion users
      const elements = heroRef.current?.querySelectorAll<HTMLElement>('.hero-stagger-item');
      elements?.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const items = heroRef.current?.querySelectorAll('.hero-stagger-item');
    if (items && items.length > 0) {
      entranceAnimRef.current = anime({
        targets: items,
        opacity: [0, 1],
        translateY: [24, 0],
        easing: 'easeOutCubic',
        duration: 700,
        delay: anime.stagger(100, { start: 200 }),
      });
    }

    return () => {
      entranceAnimRef.current?.pause();
      entranceAnimRef.current = null;
    };
  }, [prefersReducedMotion]);

  // Pointer & Scroll Parallax (Disabled on touch or reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;

    // When hosted inside CinematicStage (hideSky=true), mountain layers are positioned and transitioned
    // by the stage. Avoid competing continuous RAF loops and redundant scroll parallax listeners.
    if (hideSky) {
      if (!isPointerDevice) return;

      const handlePointerMove = (e: MouseEvent) => {
        const width = window.innerWidth;
        const targetMouseX = (e.clientX / width - 0.5) * 2;
        if (telescopeRef.current) {
          const telescopeAngle = targetMouseX * 14 - 4;
          telescopeRef.current.style.transform = `rotate(${telescopeAngle.toFixed(2)}deg)`;
        }
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
      };
    }

    let rafId: number;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerDevice) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      targetMouseX = (e.clientX / width - 0.5) * 2; // -1 to 1
      targetMouseY = (e.clientY / height - 0.5) * 2; // -1 to 1
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const updateLoop = () => {
      // Smooth interpolation for mouse follow
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Parallax vertical offset based on scroll
      const skyY = scrollY * 0.04;
      const distantY = scrollY * 0.12;
      const midY = scrollY * 0.24;
      const fgY = scrollY * 0.38;
      const celestialY = scrollY * 0.08;

      if (skyRef.current) {
        const mx = currentMouseX * -5;
        skyRef.current.style.transform = `translate3d(${mx}px, ${skyY}px, 0)`;
      }

      if (distantMountainsRef.current) {
        const mx = currentMouseX * -10;
        distantMountainsRef.current.style.transform = `translate3d(${mx}px, ${distantY}px, 0)`;
      }

      if (midMountainsRef.current) {
        const mx = currentMouseX * -18;
        midMountainsRef.current.style.transform = `translate3d(${mx}px, ${midY}px, 0)`;
      }

      if (foregroundRef.current) {
        const mx = currentMouseX * -28;
        foregroundRef.current.style.transform = `translate3d(${mx}px, ${fgY}px, 0)`;
      }

      if (celestialRef.current) {
        const mx = currentMouseX * -6;
        const my = currentMouseY * -4;
        celestialRef.current.style.transform = `translate3d(${mx}px, ${celestialY + my}px, 0)`;
      }

      // Subtle telescope pointer aim
      if (telescopeRef.current && isPointerDevice) {
        // Aim angle restricted between -12deg and +20deg
        const telescopeAngle = currentMouseX * 14 - 4;
        telescopeRef.current.style.transform = `rotate(${telescopeAngle}deg)`;
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion, isPointerDevice, hideSky]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, targetId: string) => {
    e.preventDefault();
    setActionFeedback(`Station calibrated: navigating toward "${label}"...`);
    const timer = setTimeout(() => {
      setActionFeedback(null);
      // Initiate gradual cinematic navigation scroll toward destination
      smoothScrollTo(targetId);
    }, 250);
    return () => clearTimeout(timer);
  };

  return (
    <section
      id="observatory-section"
      ref={heroRef}
      className={`observatory-hero ${hideSky ? 'is-in-celestial-stage' : ''}`}
      aria-label="The Observatory Hero Scene"
      style={hideSky ? { background: 'transparent' } : undefined}
    >
      {/* ============================================================== */}
      {/* LAYER 0: REFINED COSMIC SKY & NEBULA (ATMOSPHERIC MULTILAYER)   */}
      {/* ============================================================== */}
      {!hideSky && (
        <div ref={skyRef} className="layer-base layer-sky" aria-hidden="true">
          <CosmicSky />
        </div>
      )}

      {/* ============================================================== */}
      {/* LAYER 1: CELESTIAL CRESCENT MOON & ATMOSPHERIC HALO            */}
      {/* ============================================================== */}
      <div ref={celestialRef} className="layer-base layer-celestial" aria-hidden="true">
        <svg
          className="celestial-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={moonGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C8B9F0" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#7774C8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7774C8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={moonGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E9E4F5" />
              <stop offset="100%" stopColor="#C8B9F0" />
            </linearGradient>
          </defs>

          {/* Positioned upper-right sky: center ~ (1040, 200) */}
          <g transform="translate(1040, 190)">
            {/* Atmospheric Corona */}
            <circle cx="0" cy="0" r="76" fill={`url(#${moonGlowId})`} />

            {/* Faint Orbital Ring Fragment */}
            <ellipse
              cx="0"
              cy="0"
              rx="95"
              ry="26"
              fill="none"
              stroke="#C8B9F0"
              strokeWidth="0.85"
              strokeDasharray="4 6"
              opacity="0.25"
              transform="rotate(-22)"
            />

            {/* Crescent Moon (Constructed cleanly via boolean geometry) */}
            <path
              d="M 0 -36 A 36 36 0 1 1 -24 26 A 31 31 0 1 0 0 -36 Z"
              fill={`url(#${moonGradId})`}
              filter="drop-shadow(0 0 14px rgba(200, 185, 240, 0.45))"
            />

            {/* Delicate Crater Impression */}
            <circle cx="12" cy="-6" r="3" fill="#B3A2DE" opacity="0.45" />
            <circle cx="8" cy="14" r="2.2" fill="#B3A2DE" opacity="0.4" />
          </g>
        </svg>
      </div>

      {/* ============================================================== */}
      {/* LAYER 2: DISTANT MOUNTAIN RIDGE SILHOUETTE                     */}
      {/* ============================================================== */}
      <div ref={distantMountainsRef} className="layer-base layer-mountains-distant" aria-hidden="true">
        <svg
          className="mountains-distant-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={distantRidgeGradId} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#3A2D58" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#2A2146" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1B1633" />
            </linearGradient>
          </defs>

          {/* Distant majestic mountain silhouette */}
          <path
            d="M 0 620 
               Q 140 560, 260 580 
               T 520 540 
               Q 660 510, 780 545 
               T 1050 490 
               Q 1180 470, 1310 520 
               T 1440 540 
               L 1440 900 
               L 0 900 Z"
            fill={`url(#${distantRidgeGradId})`}
          />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* LAYER 3: MIDGROUND RIDGE WITH THE OBSERVATORY                  */}
      {/* ============================================================== */}
      <div ref={midMountainsRef} className="layer-base layer-mountains-mid" aria-hidden="true">
        <svg
          className="mountains-mid-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={midRidgeGradId} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#251E3F" />
              <stop offset="50%" stopColor="#1B1632" />
              <stop offset="100%" stopColor="#120E24" />
            </linearGradient>

            <linearGradient id={domeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#534A7F" />
              <stop offset="50%" stopColor="#3B3461" />
              <stop offset="100%" stopColor="#272145" />
            </linearGradient>
          </defs>

          {/* Midground Ridge Path (Ridge crest rises to hold Observatory at ~x=1120, y=560) */}
          <path
            d="M 0 680 
               C 180 670, 320 695, 480 670 
               C 640 645, 760 660, 890 635 
               C 1010 610, 1080 575, 1150 575 
               C 1230 575, 1330 630, 1440 640 
               L 1440 900 
               L 0 900 Z"
            fill={`url(#${midRidgeGradId})`}
          />

          {/* ========================================================== */}
          {/* THE OBSERVATORY DOME & TELESCOPE (Scalable Vector Rig)     */}
          {/* Anchored at (1145, 575) - small, distant, cinematic       */}
          {/* ========================================================== */}
          <g transform="translate(1130, 520)" className="observatory-station">
            {/* Ground foundation plinth */}
            <rect x="0" y="44" width="56" height="16" rx="2" fill="#1C1733" />
            <line x1="4" y1="48" x2="52" y2="48" stroke="#7774C8" strokeWidth="0.8" opacity="0.4" />

            {/* Cylindrical Base Tower */}
            <path d="M 6 22 L 50 22 L 52 45 L 4 45 Z" fill="#2E284E" stroke="#161228" strokeWidth="1" />

            {/* Lit Observation Slit Window in Tower */}
            <rect x="23" y="30" width="10" height="7" rx="1.5" fill="#C8B9F0" />
            {/* Soft amber/moonlight glow from inside */}
            <circle cx="28" cy="33" r="6" fill="#F2A9C8" opacity="0.4" />

            {/* Catwalk railing around the base */}
            <line x1="2" y1="22" x2="54" y2="22" stroke="#7774C8" strokeWidth="1.2" opacity="0.75" />
            <line x1="8" y1="18" x2="48" y2="18" stroke="#7774C8" strokeWidth="0.8" opacity="0.6" />
            <line x1="12" y1="18" x2="12" y2="22" stroke="#7774C8" strokeWidth="0.8" opacity="0.6" />
            <line x1="28" y1="18" x2="28" y2="22" stroke="#7774C8" strokeWidth="0.8" opacity="0.6" />
            <line x1="44" y1="18" x2="44" y2="22" stroke="#7774C8" strokeWidth="0.8" opacity="0.6" />

            {/* Hemispherical Observatory Dome */}
            <path
              d="M 8 22 A 20 20 0 0 1 48 22 Z"
              fill={`url(#${domeGradId})`}
              stroke="#685E9E"
              strokeWidth="0.8"
            />

            {/* Observation Slit in the Dome */}
            <path d="M 23 3 L 33 3 L 35 22 L 21 22 Z" fill="#141126" />

            {/* Interactive Telescope Barrel (rotates subtly via ref) */}
            <g
              ref={telescopeRef}
              transform="translate(28, 12)"
              style={{ transformOrigin: '0px 0px', transition: 'transform 0.15s ease-out' }}
            >
              {/* Telescope Body pointing toward upper-left/upward */}
              <rect x="-3" y="-18" width="6" height="20" rx="1" fill="#C8B9F0" />
              <rect x="-4.5" y="-20" width="9" height="3" rx="0.5" fill="#E9E4F5" />
              {/* Lens highlight */}
              <ellipse cx="0" cy="-20" rx="3.5" ry="1.2" fill="#F2A9C8" />
              {/* Telescope mount pivot */}
              <circle cx="0" cy="0" r="3.2" fill="#7774C8" />
            </g>

            {/* External Weather Sensor / Antenna Tower with blinking beacon */}
            <g transform="translate(56, 16)">
              <line x1="0" y1="36" x2="0" y2="4" stroke="#7774C8" strokeWidth="1" opacity="0.8" />
              <line x1="-3" y1="12" x2="3" y2="12" stroke="#7774C8" strokeWidth="0.8" opacity="0.7" />
              <line x1="-2" y1="20" x2="2" y2="20" stroke="#7774C8" strokeWidth="0.8" opacity="0.7" />
              {/* Blinking signal beacon */}
              <circle
                cx="0"
                cy="3"
                r="2"
                fill="#F2A9C8"
                className={!prefersReducedMotion ? 'beacon-pulse' : ''}
              />
            </g>

            {/* Distant pine silhouettes along the ridge near observatory */}
            <g fill="#18132D" opacity="0.95">
              <polygon points="1185,574 1188,558 1191,574" transform="translate(-1130, -520)" />
              <polygon points="1195,577 1198,563 1201,577" transform="translate(-1130, -520)" />
              <polygon points="1208,582 1211,566 1214,582" transform="translate(-1130, -520)" />
              <polygon points="1075,592 1078,574 1081,592" transform="translate(-1130, -520)" />
              <polygon points="1084,595 1087,579 1090,595" transform="translate(-1130, -520)" />
            </g>
          </g>
        </svg>
      </div>

      {/* ============================================================== */}
      {/* LAYER 4: FOREGROUND RIDGE & NATURAL SILHOUETTE                 */}
      {/* ============================================================== */}
      <div ref={foregroundRef} className="layer-base layer-foreground" aria-hidden="true">
        <svg
          className="foreground-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep foreground silhouette giving depth and grounding */}
          <path
            d="M 0 760 
               C 160 740, 290 770, 440 750 
               C 620 725, 780 775, 960 745 
               C 1140 715, 1310 750, 1440 730 
               L 1440 900 
               L 0 900 Z"
            fill="#0D0B1D"
          />
        </svg>
      </div>

      {/* Atmospheric Vignette Scrim behind text for guaranteed contrast */}
      <div className="layer-text-scrim" aria-hidden="true"></div>

      {/* ============================================================== */}
      {/* LAYER 5: HERO EDITORIAL CONTENT (ACCESSIBLE SEMANTIC HTML)     */}
      {/* ============================================================== */}
      <div className="hero-content-container">
        <div className="hero-content">
          {/* Eyebrow & Station Metadata */}
          <div className="hero-eyebrow-row hero-stagger-item">
            <span className="hero-badge">
              <Sparkles size={13} className="badge-sparkle" aria-hidden="true" />
              <span>STATION 01 &bull; GROUND TRANSMISSION</span>
            </span>
            <span className="hero-eyebrow-text">HELLO, I&apos;M</span>
          </div>

          {/* Name */}
          <h1 className="hero-name hero-stagger-item">
            AARUSH
          </h1>

          {/* Headline */}
          <h2 className="hero-headline hero-stagger-item">
            Building systems. Exploring intelligence.
          </h2>

          {/* Intro Description */}
          <p className="hero-intro hero-stagger-item">
            I&apos;m a developer interested in backend engineering, system design, and building
            intelligent applications.
          </p>

          {/* Supporting Line */}
          <p className="hero-supporting hero-stagger-item">
            I turn ideas into systems worth exploring.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="hero-actions hero-stagger-item">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={(e) => handleCtaClick(e, 'Projects Archive', 'projects')}
              aria-label="Explore my work (Navigate to Projects)"
            >
              <FolderGit2 size={16} aria-hidden="true" />
              <span>Explore my work</span>
            </a>
            <a
              href="#about"
              className="btn btn-secondary"
              onClick={(e) => handleCtaClick(e, 'About Aarush', 'about')}
              aria-label="About Aarush (Navigate to About)"
            >
              <Compass size={16} aria-hidden="true" />
              <span>About me</span>
            </a>
          </div>

          {/* Dynamic feedback message when navigating */}
          {actionFeedback && (
            <div className="action-feedback-toast" role="status" aria-live="polite">
              {actionFeedback}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SCROLL CUE                                                      */}
      {/* ============================================================== */}
      <div className="hero-scroll-cue hero-stagger-item">
        <a
          href="#about"
          className="scroll-cue-link"
          onClick={(e) => handleCtaClick(e, 'The Horizon', 'about')}
          aria-label="Scroll to explore next scene"
        >
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
          <div className="scroll-cue-icon" aria-hidden="true">
            <ArrowDown size={14} className="cue-arrow" />
          </div>
        </a>
      </div>
    </section>
  );
};
