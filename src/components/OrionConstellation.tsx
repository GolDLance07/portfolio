import React, { useId } from 'react';
import '../styles/orion.css';

interface OrionConstellationProps {
  className?: string;
  showLabels?: boolean;
}

export const OrionConstellation: React.FC<OrionConstellationProps> = ({
  className = '',
  showLabels = true,
}) => {
  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  const lineGlowId = `orion-line-glow-${cleanId}`;
  const figureGradId = `orion-figure-grad-${cleanId}`;
  const figureGlowId = `orion-figure-glow-${cleanId}`;
  const shieldGradId = `orion-shield-grad-${cleanId}`;
  const bladeGradId = `orion-blade-grad-${cleanId}`;
  const betelgeuseCoronaId = `betelgeuse-corona-${cleanId}`;
  const rigelCoronaId = `rigel-corona-${cleanId}`;
  const alnilamCoronaId = `alnilam-corona-${cleanId}`;
  const starCoronaId = `star-corona-${cleanId}`;
  const m42NebulaId = `m42-nebula-${cleanId}`;

  // Anatomical and astronomical coordinates mapped across the 500 x 700 celestial canvas
  const stars = {
    // Shoulders
    betelgeuse: { x: 165, y: 225, r: 5.6, name: 'Betelgeuse', labelX: 138, labelY: 228, anchor: 'end' },
    bellatrix: { x: 295, y: 210, r: 4.8, name: 'Bellatrix', labelX: 318, labelY: 214, anchor: 'start' },

    // The Three Belt Stars (Crisp, aligned diagonal line across the waist)
    alnitak: { x: 218, y: 350, r: 4.0, name: 'Alnitak', labelX: 192, labelY: 354, anchor: 'end' },
    alnilam: { x: 252, y: 336, r: 4.6, name: 'Alnilam', labelX: 252, labelY: 316, anchor: 'middle' },
    mintaka: { x: 286, y: 322, r: 4.0, name: 'Mintaka', labelX: 308, labelY: 326, anchor: 'start' },

    // The Sword (Hanging gently beneath the belt)
    swordUpper: { x: 250, y: 375, r: 2.2 },
    swordMiddle: { x: 252, y: 398, r: 3.4, name: 'M42', labelX: 268, labelY: 401, anchor: 'start' },
    swordLower: { x: 254, y: 422, r: 2.4 },

    // The Legs & Knees (Dynamic celestial stance)
    saiph: { x: 215, y: 495, r: 4.4, name: 'Saiph', labelX: 188, labelY: 499, anchor: 'end' },
    rigel: { x: 355, y: 435, r: 6.0, name: 'Rigel', labelX: 382, labelY: 439, anchor: 'start' },

    // Arm and Weapon Anchor Stars
    handRight: { x: 105, y: 68, r: 2.4 },
    handLeft: { x: 388, y: 180, r: 2.4 },
  };

  return (
    <div
      className={`orion-constellation-container ${className}`}
      aria-label="Orion the Hunter Mythological Celestial Illustration"
    >
      <svg
        className="orion-svg"
        viewBox="0 0 500 700"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Classical celestial artwork of Orion the Hunter emerging gracefully from the twilight starfield."
      >
        <defs>
          {/* Subtle line glow filter */}
          <filter id={lineGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ethereal body glow filter */}
          <filter id={figureGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ethereal semi-transparent silhouette gradient (Nebula Violet & Indigo) */}
          <linearGradient id={figureGradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#7774C8" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#302B59" stopOpacity="0.48" />
            <stop offset="70%" stopColor="#1E1942" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0F0C24" stopOpacity="0.25" />
          </linearGradient>

          {/* Classical shield translucent gradient */}
          <radialGradient id={shieldGradId} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C8B9F0" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#7774C8" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#251F4A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#120E28" stopOpacity="0.1" />
          </radialGradient>

          {/* Slender starlight blade gradient */}
          <linearGradient id={bladeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8B9F0" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.4" />
          </linearGradient>

          {/* Betelgeuse Amber Red-Supergiant Corona */}
          <radialGradient id={betelgeuseCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2D6" stopOpacity="1" />
            <stop offset="28%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#D97706" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7774C8" stopOpacity="0" />
          </radialGradient>

          {/* Rigel Brilliant Blue-White Corona */}
          <radialGradient id={rigelCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#BAE6FD" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#17152F" stopOpacity="0" />
          </radialGradient>

          {/* Alnilam Center Belt Corona */}
          <radialGradient id={alnilamCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#C8B9F0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7774C8" stopOpacity="0" />
          </radialGradient>

          {/* Standard Star Halo */}
          <radialGradient id={starCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#C8B9F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7774C8" stopOpacity="0" />
          </radialGradient>

          {/* M42 Great Orion Nebula diffuse emission cloud */}
          <radialGradient id={m42NebulaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2A9C8" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#C8B9F0" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#7774C8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#17152F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. FAINT CELESTIAL BACKGROUND STARS & GUIDE RETICLE            */}
        {/* ============================================================== */}
        <g className="orion-ambient-stars" opacity="0.4" aria-hidden="true">
          {/* Subtle guide arc curving above the blade */}
          <path
            d="M 60 55 C 150 25, 260 25, 330 50"
            fill="none"
            stroke="var(--color-moonlight)"
            strokeWidth="0.75"
            strokeDasharray="3 5"
            opacity="0.35"
          />
          <circle cx="55" cy="105" r="1.1" fill="#E9E4F5" opacity="0.4" />
          <circle cx="115" cy="35" r="1.3" fill="#E9E4F5" opacity="0.5" />
          <circle cx="145" cy="70" r="1.0" fill="#E9E4F5" opacity="0.35" />
          <circle cx="45" cy="195" r="1.2" fill="#E9E4F5" opacity="0.45" />
          <circle cx="340" cy="85" r="1.4" fill="#E9E4F5" opacity="0.55" />
          <circle cx="455" cy="105" r="1.1" fill="#E9E4F5" opacity="0.4" />
          <circle cx="465" cy="265" r="1.2" fill="#E9E4F5" opacity="0.45" />
          <circle cx="440" cy="350" r="1.0" fill="#E9E4F5" opacity="0.35" />
          <circle cx="130" cy="425" r="1.1" fill="#E9E4F5" opacity="0.4" />
          <circle cx="165" cy="570" r="1.0" fill="#E9E4F5" opacity="0.35" />
          <circle cx="410" cy="510" r="1.3" fill="#E9E4F5" opacity="0.5" />
          <circle cx="390" cy="595" r="1.1" fill="#E9E4F5" opacity="0.4" />
          <circle cx="265" cy="670" r="1.2" fill="#E9E4F5" opacity="0.45" />
        </g>

        {/* ============================================================== */}
        {/* 2. THE RECOGNIZABLE HUNTER SILHOUETTE (FLOWING CELESTIAL ART)  */}
        {/* ============================================================== */}
        <g className="orion-hunter-artwork" aria-hidden="true">
          {/* Main Flowing Silhouette Base with Soft Nebular Fill */}
          <path
            className="orion-myth-silhouette"
            d={`
              M 226 108
              C 238 92, 230 68, 208 50
              C 222 68, 226 88, 226 108
              C 236 108, 248 118, 252 135
              C 255 145, 253 158, 248 168
              C 242 178, 235 186, 238 198
              C 255 198, 275 204, 295 210
              C 320 212, 345 224, 355 240
              C 368 226, 382 205, 388 180
              C 392 185, 396 195, 386 215
              C 375 235, 358 255, 345 260
              C 330 262, 310 252, 292 245
              C 285 275, 278 305, 272 330
              C 282 342, 292 360, 290 380
              C 285 410, 275 425, 268 435
              C 295 435, 328 438, 355 435
              C 370 445, 362 468, 348 495
              C 332 525, 320 545, 315 565
              C 310 578, 302 585, 298 580
              C 295 572, 304 555, 308 535
              C 315 505, 332 468, 338 450
              C 315 448, 285 445, 260 445
              C 250 455, 238 465, 230 475
              C 224 495, 220 535, 218 575
              C 216 615, 212 642, 206 655
              C 200 668, 190 668, 188 660
              C 186 648, 194 625, 198 595
              C 204 545, 208 510, 212 495
              C 205 470, 200 445, 196 425
              C 190 405, 185 375, 186 350
              C 182 315, 175 275, 165 225
              C 150 220, 132 205, 118 185
              C 105 168, 92 152, 88 142
              C 84 132, 92 115, 102 85
              C 104 78, 105 72, 105 68
              C 108 68, 114 74, 115 85
              C 118 108, 126 130, 138 152
              C 150 175, 162 198, 168 215
              C 178 208, 195 200, 214 195
              C 210 180, 206 160, 206 142
              C 206 122, 214 108, 226 108
              Z
            `}
            fill={`url(#${figureGradId})`}
            filter={`url(#${figureGlowId})`}
          />

          {/* Delicate, Flowing Lavender Contours (Graceful, Not Polygonal) */}
          {/* Head, Noble Profile & Visor Brow */}
          <path
            d="
              M 226 108 
              C 236 108, 248 118, 252 135 
              C 255 145, 253 158, 248 168 
              C 242 178, 235 186, 238 198
            "
            stroke="var(--color-moonlight)"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="none"
            className="orion-contour-line"
          />
          {/* Helmet Dome & Crown Curve */}
          <path
            d="
              M 252 135 
              C 248 116, 236 106, 222 106 
              C 210 106, 204 122, 206 142 
              C 208 165, 212 182, 216 196
            "
            stroke="var(--color-violet)"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          {/* Ethereal Helmet Crest Feathers (3 Flowing Strands) */}
          <path
            d="M 224 108 C 218 88, 202 68, 180 50 C 195 68, 205 88, 216 110 Z"
            fill="rgba(242, 169, 200, 0.22)"
            stroke="var(--color-pink)"
            strokeWidth="0.85"
            className="orion-crest-plume"
          />
          <path
            d="M 226 108 C 235 88, 222 62, 195 40 C 210 60, 218 84, 222 110 Z"
            fill="rgba(200, 185, 240, 0.3)"
            stroke="var(--color-moonlight)"
            strokeWidth="1.0"
            className="orion-crest-plume"
          />
          <path
            d="M 228 110 C 242 90, 236 68, 212 48 C 226 68, 230 90, 228 112 Z"
            fill="rgba(119, 116, 200, 0.2)"
            stroke="var(--color-violet)"
            strokeWidth="0.85"
            className="orion-crest-plume"
          />

          {/* Upraised Right Arm & Slender Starlight Blade */}
          <path
            d="
              M 165 225 
              C 148 215, 130 195, 116 172 
              C 104 152, 92 135, 88 125 
              C 85 115, 92 98, 102 75 
              C 104 70, 105 68, 105 68
            "
            stroke="var(--color-moonlight)"
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
            className="orion-contour-line"
          />
          {/* Slender Starlight Blade (Horizontal across top) */}
          <g className="orion-sword-group">
            <line
              x1="110"
              y1="68"
              x2="270"
              y2="42"
              stroke={`url(#${bladeGradId})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              className="orion-starlight-blade"
            />
            {/* Fine Blade Fuller Core */}
            <line
              x1="112"
              y1="68"
              x2="268"
              y2="42"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Delicate Crossguard & Pommel */}
            <line x1="110" y1="58" x2="110" y2="78" stroke="var(--color-pink)" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="94" cy="71" r="2.8" fill="var(--color-pink)" />
            <line x1="94" y1="71" x2="110" y2="68" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Forward Left Arm & Classical Ethereal Buckler */}
          <path
            d="
              M 295 210 
              C 320 215, 345 228, 355 240 
              C 368 226, 382 205, 388 180
            "
            stroke="var(--color-moonlight)"
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
            className="orion-contour-line"
          />
          {/* Classical Oval Celestial Buckler (Smooth & Elegant, NOT a satellite dish) */}
          <g transform="rotate(10 398 175)" className="orion-celestial-buckler">
            {/* Outer Ethereal Shield Dish */}
            <ellipse
              cx="398"
              cy="175"
              rx="50"
              ry="74"
              fill={`url(#${shieldGradId})`}
              stroke="var(--color-moonlight)"
              strokeWidth="1.3"
              className="orion-buckler-rim"
            />
            {/* Delicate Inner Inscription Arc */}
            <ellipse
              cx="398"
              cy="175"
              rx="38"
              ry="56"
              fill="none"
              stroke="var(--color-pink)"
              strokeWidth="0.75"
              strokeDasharray="4 6"
              opacity="0.6"
            />
            {/* Central Star Boss */}
            <circle
              cx="398"
              cy="175"
              r="7"
              fill="rgba(200, 185, 240, 0.4)"
              stroke="#FFFFFF"
              strokeWidth="1.0"
            />
            <circle cx="398" cy="175" r="2.2" fill="#FFFFFF" />
          </g>

          {/* Graceful Torso, Chest Arc & Waist Contours */}
          <path
            d="
              M 165 225 
              C 200 240, 255 235, 295 210
            "
            stroke="var(--color-moonlight)"
            strokeWidth="1.0"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* Subtle Sternal Line */}
          <line
            x1="235"
            y1="236"
            x2="242"
            y2="330"
            stroke="var(--color-violet)"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Torso Flanks */}
          <path
            d="M 165 225 C 172 260, 185 295, 202 342"
            stroke="var(--color-moonlight)"
            strokeWidth="1.0"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 295 210 C 288 250, 280 290, 272 330"
            stroke="var(--color-moonlight)"
            strokeWidth="1.0"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />

          {/* The Belt Sash (Gentle drapery across waist) */}
          <path
            d="
              M 198 355 
              C 230 350, 265 338, 290 322 
              L 292 334 
              C 265 350, 230 362, 196 368 
              Z
            "
            fill="rgba(119, 116, 200, 0.28)"
            stroke="var(--color-pink)"
            strokeWidth="0.9"
            opacity="0.85"
          />

          {/* Flowing Classical Tunic Folds (Soft, mythological, not leather flaps) */}
          <path
            d="
              M 196 368 
              C 192 395, 190 420, 196 430 
              C 215 435, 238 438, 268 435 
              C 275 422, 285 400, 292 334
            "
            fill="rgba(48, 43, 89, 0.35)"
            stroke="var(--color-moonlight)"
            strokeWidth="1.05"
            strokeLinecap="round"
            className="orion-contour-line"
          />
          {/* Soft interior drape fold */}
          <path
            d="M 226 362 C 224 388, 224 415, 228 434"
            stroke="var(--color-violet)"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 260 350 C 258 380, 255 410, 254 434"
            stroke="var(--color-violet)"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Celestial Scabbard / Sword hanging in center */}
          <path
            d="M 248 350 L 253 430 L 257 430 L 252 350 Z"
            fill="rgba(242, 169, 200, 0.22)"
            stroke="var(--color-pink)"
            strokeWidth="0.85"
            opacity="0.8"
          />

          {/* Standing Firm Left Leg (Saiph at knee) */}
          <path
            d="
              M 196 430 
              C 202 460, 208 485, 215 495 
              C 220 525, 218 565, 216 615 
              C 214 635, 210 655, 204 662 
              C 198 668, 190 668, 188 660 
              C 186 648, 194 625, 198 595 
              C 204 545, 208 510, 212 495
            "
            stroke="var(--color-moonlight)"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="orion-contour-line"
          />

          {/* Dynamic Stepping Right Leg (Rigel at bent knee, trailing foot) */}
          <path
            d="
              M 268 435 
              C 295 435, 328 438, 355 435 
              C 370 445, 362 468, 348 495 
              C 332 525, 320 545, 315 565 
              C 310 578, 302 585, 298 580 
              C 295 572, 304 555, 308 535 
              C 315 505, 332 468, 338 450
            "
            stroke="var(--color-moonlight)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="orion-contour-line"
          />
        </g>

        {/* ============================================================== */}
        {/* 3. M42 GREAT ORION NEBULA DIFFUSE EMISSION                     */}
        {/* ============================================================== */}
        <g className="orion-m42-glow" aria-hidden="true">
          <ellipse
            cx={stars.swordMiddle.x}
            cy={stars.swordMiddle.y}
            rx="22"
            ry="14"
            fill={`url(#${m42NebulaId})`}
            transform={`rotate(-18 ${stars.swordMiddle.x} ${stars.swordMiddle.y})`}
            className="orion-nebula-pulse"
          />
        </g>

        {/* ============================================================== */}
        {/* 4. CONSTELLATION CONNECTING LINES (CLEAN, SUBTLE, UNCLUTTERED) */}
        {/* ============================================================== */}
        <g className="orion-constellation-lines" filter={`url(#${lineGlowId})`}>
          {/* Shoulders to Chest */}
          <line x1={stars.betelgeuse.x} y1={stars.betelgeuse.y} x2={stars.bellatrix.x} y2={stars.bellatrix.y} className="orion-astro-line" />

          {/* Shoulders to Belt */}
          <line x1={stars.betelgeuse.x} y1={stars.betelgeuse.y} x2={stars.alnitak.x} y2={stars.alnitak.y} className="orion-astro-line" />
          <line x1={stars.bellatrix.x} y1={stars.bellatrix.y} x2={stars.mintaka.x} y2={stars.mintaka.y} className="orion-astro-line" />

          {/* The Belt (Crisp continuous diagonal) */}
          <line x1={stars.alnitak.x} y1={stars.alnitak.y} x2={stars.alnilam.x} y2={stars.alnilam.y} className="orion-astro-line orion-belt-line" />
          <line x1={stars.alnilam.x} y1={stars.alnilam.y} x2={stars.mintaka.x} y2={stars.mintaka.y} className="orion-astro-line orion-belt-line" />

          {/* Belt down to Standing Leg (Saiph) & Bent Leg (Rigel) */}
          <line x1={stars.alnitak.x} y1={stars.alnitak.y} x2={stars.saiph.x} y2={stars.saiph.y} className="orion-astro-line" />
          <line x1={stars.mintaka.x} y1={stars.mintaka.y} x2={stars.rigel.x} y2={stars.rigel.y} className="orion-astro-line" />

          {/* Diagonal Connection between Knees (Saiph <-> Rigel) */}
          <line x1={stars.saiph.x} y1={stars.saiph.y} x2={stars.rigel.x} y2={stars.rigel.y} className="orion-astro-line" />

          {/* Slender Sword hanging downward */}
          <line x1={stars.alnilam.x} y1={stars.alnilam.y + 8} x2={stars.swordUpper.x} y2={stars.swordUpper.y} className="orion-sword-astro-line" />
          <line x1={stars.swordUpper.x} y1={stars.swordUpper.y} x2={stars.swordMiddle.x} y2={stars.swordMiddle.y} className="orion-sword-astro-line" />
          <line x1={stars.swordMiddle.x} y1={stars.swordMiddle.y} x2={stars.swordLower.x} y2={stars.swordLower.y} className="orion-sword-astro-line" />
        </g>

        {/* ============================================================== */}
        {/* 5. STAR DIFFRACTION SPIKES & LUMINOUS HALO CORONAS             */}
        {/* ============================================================== */}
        <g className="orion-star-diffraction" aria-hidden="true">
          {/* Betelgeuse Amber Red-Supergiant Glow & 4-Point Starlight Flare */}
          <circle
            cx={stars.betelgeuse.x}
            cy={stars.betelgeuse.y}
            r={stars.betelgeuse.r * 4.4}
            fill={`url(#${betelgeuseCoronaId})`}
            className="orion-supergiant-glow"
          />
          <path
            d={`
              M ${stars.betelgeuse.x} ${stars.betelgeuse.y - 20}
              Q ${stars.betelgeuse.x} ${stars.betelgeuse.y} ${stars.betelgeuse.x + 20} ${stars.betelgeuse.y}
              Q ${stars.betelgeuse.x} ${stars.betelgeuse.y} ${stars.betelgeuse.x} ${stars.betelgeuse.y + 20}
              Q ${stars.betelgeuse.x} ${stars.betelgeuse.y} ${stars.betelgeuse.x - 20} ${stars.betelgeuse.y}
              Z
            `}
            fill="#FFE8C2"
            opacity="0.82"
            className="orion-spike-shimmer"
          />

          {/* Rigel Brilliant Blue-White Glow & 4-Point Starlight Flare */}
          <circle
            cx={stars.rigel.x}
            cy={stars.rigel.y}
            r={stars.rigel.r * 4.6}
            fill={`url(#${rigelCoronaId})`}
            className="orion-supergiant-glow"
          />
          <path
            d={`
              M ${stars.rigel.x} ${stars.rigel.y - 24}
              Q ${stars.rigel.x} ${stars.rigel.y} ${stars.rigel.x + 24} ${stars.rigel.y}
              Q ${stars.rigel.x} ${stars.rigel.y} ${stars.rigel.x} ${stars.rigel.y + 24}
              Q ${stars.rigel.x} ${stars.rigel.y} ${stars.rigel.x - 24} ${stars.rigel.y}
              Z
            `}
            fill="#E0F2FE"
            opacity="0.88"
            className="orion-spike-shimmer"
          />

          {/* Alnilam Center Belt Star Corona & Starlight Flare */}
          <circle
            cx={stars.alnilam.x}
            cy={stars.alnilam.y}
            r={stars.alnilam.r * 3.4}
            fill={`url(#${alnilamCoronaId})`}
            className="orion-halo"
          />
          <path
            d={`
              M ${stars.alnilam.x} ${stars.alnilam.y - 14}
              Q ${stars.alnilam.x} ${stars.alnilam.y} ${stars.alnilam.x + 14} ${stars.alnilam.y}
              Q ${stars.alnilam.x} ${stars.alnilam.y} ${stars.alnilam.x} ${stars.alnilam.y + 14}
              Q ${stars.alnilam.x} ${stars.alnilam.y} ${stars.alnilam.x - 14} ${stars.alnilam.y}
              Z
            `}
            fill="#FFFFFF"
            opacity="0.75"
          />

          {/* Bellatrix, Alnitak, Mintaka, Saiph Halos */}
          <circle cx={stars.bellatrix.x} cy={stars.bellatrix.y} r={stars.bellatrix.r * 3.0} fill={`url(#${starCoronaId})`} className="orion-halo" />
          <circle cx={stars.alnitak.x} cy={stars.alnitak.y} r={stars.alnitak.r * 2.8} fill={`url(#${starCoronaId})`} className="orion-halo" />
          <circle cx={stars.mintaka.x} cy={stars.mintaka.y} r={stars.mintaka.r * 2.8} fill={`url(#${starCoronaId})`} className="orion-halo" />
          <circle cx={stars.saiph.x} cy={stars.saiph.y} r={stars.saiph.r * 3.0} fill={`url(#${starCoronaId})`} className="orion-halo" />
        </g>

        {/* ============================================================== */}
        {/* 6. STAR NODES (SHARP LUMINOUS EMBEDDED CORES)                  */}
        {/* ============================================================== */}
        <g className="orion-star-nodes">
          {/* Hand Star Nodes */}
          <circle cx={stars.handRight.x} cy={stars.handRight.y} r={stars.handRight.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.4s' }} />
          <circle cx={stars.handLeft.x} cy={stars.handLeft.y} r={stars.handLeft.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.2s' }} />

          {/* Sword Stars */}
          <circle cx={stars.swordUpper.x} cy={stars.swordUpper.y} r={stars.swordUpper.r} fill="#E2E8F0" opacity="0.85" />
          <circle cx={stars.swordMiddle.x} cy={stars.swordMiddle.y} r={stars.swordMiddle.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.5s' }} />
          <circle cx={stars.swordLower.x} cy={stars.swordLower.y} r={stars.swordLower.r} fill="#E2E8F0" opacity="0.85" />

          {/* Betelgeuse (Warm Golden Core + Pure White Center) */}
          <circle cx={stars.betelgeuse.x} cy={stars.betelgeuse.y} r={stars.betelgeuse.r} fill="#FFD29D" className="orion-supergiant-core" />
          <circle cx={stars.betelgeuse.x} cy={stars.betelgeuse.y} r={stars.betelgeuse.r * 0.45} fill="#FFFFFF" />

          {/* Bellatrix (Icy Lavender-White Core) */}
          <circle cx={stars.bellatrix.x} cy={stars.bellatrix.y} r={stars.bellatrix.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.8s' }} />

          {/* The Belt Stars (Alnitak - Alnilam - Mintaka) */}
          <circle cx={stars.alnitak.x} cy={stars.alnitak.y} r={stars.alnitak.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.4s' }} />
          <circle cx={stars.alnilam.x} cy={stars.alnilam.y} r={stars.alnilam.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.2s' }} />
          <circle cx={stars.mintaka.x} cy={stars.mintaka.y} r={stars.mintaka.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.8s' }} />

          {/* Saiph (White Core) */}
          <circle cx={stars.saiph.x} cy={stars.saiph.y} r={stars.saiph.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.6s' }} />

          {/* Rigel (Brilliant Icy Blue-White Core) */}
          <circle cx={stars.rigel.x} cy={stars.rigel.y} r={stars.rigel.r} fill="#F0F9FF" className="orion-supergiant-core" />
          <circle cx={stars.rigel.x} cy={stars.rigel.y} r={stars.rigel.r * 0.5} fill="#FFFFFF" />
        </g>

        {/* ============================================================== */}
        {/* 7. UNDERSTATED, NON-OVERLAPPING ASTRONOMICAL LABELS            */}
        {/* ============================================================== */}
        {showLabels && (
          <g className="orion-labels" aria-hidden="true">
            {/* Betelgeuse */}
            <text
              x={stars.betelgeuse.labelX}
              y={stars.betelgeuse.labelY}
              textAnchor={stars.betelgeuse.anchor as any}
              className="orion-label orion-label-prominent"
            >
              Betelgeuse
            </text>

            {/* Bellatrix */}
            <text
              x={stars.bellatrix.labelX}
              y={stars.bellatrix.labelY}
              textAnchor={stars.bellatrix.anchor as any}
              className="orion-label orion-label-prominent"
            >
              Bellatrix
            </text>

            {/* Belt: Alnitak (left), Alnilam (center above), Mintaka (right) */}
            <text
              x={stars.alnitak.labelX}
              y={stars.alnitak.labelY}
              textAnchor={stars.alnitak.anchor as any}
              className="orion-label"
            >
              Alnitak
            </text>
            <text
              x={stars.alnilam.labelX}
              y={stars.alnilam.labelY}
              textAnchor={stars.alnilam.anchor as any}
              className="orion-label orion-label-belt"
            >
              Alnilam
            </text>
            <text
              x={stars.mintaka.labelX}
              y={stars.mintaka.labelY}
              textAnchor={stars.mintaka.anchor as any}
              className="orion-label"
            >
              Mintaka
            </text>

            {/* Saiph */}
            <text
              x={stars.saiph.labelX}
              y={stars.saiph.labelY}
              textAnchor={stars.saiph.anchor as any}
              className="orion-label orion-label-prominent"
            >
              Saiph
            </text>

            {/* Rigel */}
            <text
              x={stars.rigel.labelX}
              y={stars.rigel.labelY}
              textAnchor={stars.rigel.anchor as any}
              className="orion-label orion-label-prominent"
            >
              Rigel
            </text>
          </g>
        )}
      </svg>

      {/* Refined Astronomical Telemetry Caption */}
      <div className="orion-telemetry-tag" aria-hidden="true">
        <span className="orion-tag-name">ORION &bull; THE HUNTER</span>
        <span className="orion-tag-coords">RA 05h 35m &bull; DEC +00&deg; 00&prime;</span>
      </div>
    </div>
  );
};
