import React, { useId } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { OrionConstellation } from '../components/OrionConstellation';
import '../styles/horizon.css';

// Restrained background stars connecting Scene 02 to Scene 01
const HORIZON_STARS = [
  { id: 1, cx: 12, cy: 15, r: 1.1, opacity: 0.6 },
  { id: 2, cx: 28, cy: 8, r: 0.8, opacity: 0.5 },
  { id: 3, cx: 45, cy: 18, r: 1.4, opacity: 0.75 },
  { id: 4, cx: 62, cy: 12, r: 0.9, opacity: 0.55 },
  { id: 5, cx: 78, cy: 6, r: 1.2, opacity: 0.65 },
  { id: 6, cx: 91, cy: 16, r: 1.0, opacity: 0.7 },
  { id: 7, cx: 18, cy: 26, r: 0.7, opacity: 0.4 },
  { id: 8, cx: 35, cy: 22, r: 1.3, opacity: 0.7 },
  { id: 9, cx: 58, cy: 28, r: 0.8, opacity: 0.45 },
  { id: 10, cx: 84, cy: 24, r: 1.1, opacity: 0.6 },
  { id: 11, cx: 95, cy: 10, r: 0.7, opacity: 0.5 },
];

interface HorizonSceneProps {
  hideSky?: boolean;
}

export const HorizonScene: React.FC<HorizonSceneProps> = ({ hideSky = false }) => {
  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const horizonSkyGradId = `horizon-sky-grad-${cleanId}`;
  const horizonGlowGradId = `horizon-glow-grad-${cleanId}`;
  const distantMountainsGradId = `distant-mountains-grad-${cleanId}`;
  const midPlateauGradId = `mid-plateau-grad-${cleanId}`;

  return (
    <section
      id="horizon-section"
      className={`horizon-scene ${hideSky ? 'is-in-celestial-stage' : ''}`}
      aria-label="Scene 02: Beyond the Horizon (About)"
    >
      {/* ============================================================== */}
      {/* 1. ATMOSPHERIC TWILIGHT SKY & HORIZON GLOW (SVG)               */}
      {/* ============================================================== */}
      {!hideSky && (
        <div className="horizon-layer-base horizon-layer-sky" aria-hidden="true">
          <svg
            className="horizon-sky-svg"
            viewBox="0 0 1440 1000"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={horizonSkyGradId} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#080616" />
                <stop offset="28%" stopColor="#120E2C" />
                <stop offset="55%" stopColor="#1D163F" />
                <stop offset="78%" stopColor="#322152" />
                <stop offset="92%" stopColor="#4A2B63" />
                <stop offset="100%" stopColor="#63326B" />
              </linearGradient>

              <radialGradient id={horizonGlowGradId} cx="50%" cy="88%" r="65%">
                <stop offset="0%" stopColor="#F2A9C8" stopOpacity="0.28" />
                <stop offset="35%" stopColor="#C8B9F0" stopOpacity="0.18" />
                <stop offset="70%" stopColor="#7774C8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#1D163F" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1440" height="1000" fill={`url(#${horizonSkyGradId})`} />
            <rect
              width="1440"
              height="1000"
              fill={`url(#${horizonGlowGradId})`}
              className="horizon-glow-pulse"
            />

            <g className="horizon-stars">
              {HORIZON_STARS.map((star) => {
                const x = (star.cx / 100) * 1440;
                const y = (star.cy / 100) * 1000;
                return (
                  <circle
                    key={star.id}
                    cx={x}
                    cy={y}
                    r={star.r}
                    fill="#E9E4F5"
                    opacity={star.opacity}
                  />
                );
              })}
            </g>
          </svg>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DISTANT PANORAMIC MOUNTAIN RIDGE SILHOUETTE                 */}
      {/* ============================================================== */}
      <div className="horizon-layer-base horizon-layer-mountains-distant" aria-hidden="true">
        <svg
          className="horizon-distant-svg"
          viewBox="0 0 1440 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={distantMountainsGradId} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#2E204C" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#201738" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#140F27" />
            </linearGradient>
          </defs>

          <path
            d="M 0 680 
               Q 180 610, 340 640 
               T 680 590 
               Q 840 560, 1020 610 
               T 1300 580 
               Q 1380 570, 1440 590 
               L 1440 1000 
               L 0 1000 Z"
            fill={`url(#${distantMountainsGradId})`}
          />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 3. MIDGROUND PLATEAU & EXPEDITION WAYPOINT MAST                */}
      {/* ============================================================== */}
      <div className="horizon-layer-base horizon-layer-plateau" aria-hidden="true">
        <svg
          className="horizon-plateau-svg"
          viewBox="0 0 1440 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={midPlateauGradId} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#1B1333" />
              <stop offset="60%" stopColor="#120D23" />
              <stop offset="100%" stopColor="#0B0818" />
            </linearGradient>
          </defs>

          <path
            d="M 0 780 
               C 220 760, 440 790, 680 750 
               C 920 710, 1140 760, 1440 730 
               L 1440 1000 
               L 0 1000 Z"
            fill={`url(#${midPlateauGradId})`}
          />

          <g transform="translate(1240, 680)" opacity="0.75">
            <line x1="0" y1="40" x2="0" y2="0" stroke="#7774C8" strokeWidth="1" />
            <line x1="-3" y1="10" x2="3" y2="10" stroke="#7774C8" strokeWidth="0.8" />
            <line x1="-2" y1="20" x2="2" y2="20" stroke="#7774C8" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.8" fill="#F2A9C8" opacity="0.9" />
          </g>
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 4. FOREGROUND DUSK SILHOUETTE                                  */}
      {/* ============================================================== */}
      <div className="horizon-layer-base horizon-layer-foreground" aria-hidden="true">
        <svg
          className="horizon-foreground-svg"
          viewBox="0 0 1440 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 880 
               C 280 860, 520 890, 820 865 
               C 1120 840, 1320 870, 1440 855 
               L 1440 1000 
               L 0 1000 Z"
            fill="#080514"
          />
        </svg>
      </div>

      {/* Atmospheric Scrim for Guaranteed Contrast */}
      <div className="horizon-scrim" aria-hidden="true"></div>

      {/* ============================================================== */}
      {/* 5. EDITORIAL CONTENT (TWO-COLUMN CELESTIAL COMPOSITION)        */}
      {/* ============================================================== */}
      <div className="horizon-content-container">
        {/* Intro Eyebrow & Station Metadata */}
        <div className="horizon-eyebrow-row">
          <span className="horizon-station-badge">
            <Compass size={13} className="badge-icon" aria-hidden="true" />
            <span>SCENE 02 &bull; THE HORIZON</span>
          </span>
          <span className="horizon-coordinates">AZIMUTH 142&deg; // CELESTIAL LOG</span>
        </div>

        {/* Two-Column Stage: About Narrative (Left) & Orion Constellation (Right) */}
        <div className="about-stage-grid">
          {/* Left Column: Personal Introduction & Philosophy */}
          <div className="about-editorial-column">
            {/* Heading */}
            <h2 className="horizon-title">
              Beyond the Horizon
            </h2>

            {/* Name Identifier */}
            <div className="about-name-tag">
              <Sparkles size={13} className="about-name-sparkle" aria-hidden="true" />
              <span>Aarush Rahul Patel</span>
            </div>

            {/* Main Introduction Paragraphs */}
            <div className="about-body-narrative">
              <p className="about-narrative-p">
                I&apos;m a developer driven by curiosity &mdash; the kind that makes me want to
                understand not just how something works, but what&apos;s happening beneath the surface.
              </p>

              <p className="about-narrative-p">
                My journey into technology has been about exploring ideas, experimenting with code,
                and turning concepts into things people can actually use. From building software
                projects to exploring machine learning and backend systems, I enjoy the process of
                figuring things out and bringing them to life.
              </p>

              <p className="about-narrative-p">
                I&apos;m particularly interested in the engineering behind software: how systems are
                designed, how data moves, and how intelligent capabilities can be integrated into
                practical applications.
              </p>

              <p className="about-narrative-p">
                For me, every project is an opportunity to learn something new, challenge an
                assumption, and build something a little better than before.
              </p>
            </div>

            {/* Closing Line */}
            <blockquote className="about-closing-line">
              &ldquo;Still exploring. Still building. Always looking beyond the horizon.&rdquo;
            </blockquote>
          </div>

          {/* Right Column: Orion Constellation Accurate Visualization */}
          <div className="about-constellation-column">
            <OrionConstellation />
          </div>
        </div>

        {/* Telemetry / Journey Marker */}
        <div className="horizon-telemetry-bar" role="note" aria-label="Journey Coordinates">
          <div className="telemetry-item">
            <span className="telemetry-label">CURRENT VECTOR</span>
            <span className="telemetry-value">System Architecture &bull; Intelligent Systems</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">&bull;</div>
          <div className="telemetry-item">
            <span className="telemetry-label">CELESTIAL ANCHOR</span>
            <span className="telemetry-value">Orion Constellation &bull; Alpha Orionis</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">&bull;</div>
          <div className="telemetry-item">
            <span className="telemetry-label">NEXT EXPEDITION</span>
            <span className="telemetry-value">03 Constellations (Skills)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
