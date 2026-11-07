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
  const betelgeuseCoronaId = `betelgeuse-corona-${cleanId}`;
  const rigelCoronaId = `rigel-corona-${cleanId}`;
  const alnilamCoronaId = `alnilam-corona-${cleanId}`;
  const starCoronaId = `star-corona-${cleanId}`;
  const m42NebulaId = `m42-nebula-${cleanId}`;
  const shieldGradId = `shield-grad-${cleanId}`;
  const bladeGradId = `blade-grad-${cleanId}`;

  // Astronomical coordinates precisely mapped to the 520 x 740 celestial canvas
  const stars = {
    // Shoulders
    betelgeuse: { x: 170, y: 245, r: 5.6, name: 'Betelgeuse', labelX: 142, labelY: 249, anchor: 'end' },
    bellatrix: { x: 305, y: 230, r: 4.8, name: 'Bellatrix', labelX: 326, labelY: 234, anchor: 'start' },

    // The Three Belt Stars (Crisp, recognizable diagonal line)
    alnitak: { x: 225, y: 368, r: 4.0, name: 'Alnitak', labelX: 198, labelY: 372, anchor: 'end' },
    alnilam: { x: 260, y: 352, r: 4.6, name: 'Alnilam', labelX: 260, labelY: 332, anchor: 'middle' },
    mintaka: { x: 295, y: 338, r: 4.0, name: 'Mintaka', labelX: 318, labelY: 342, anchor: 'start' },

    // The Sword (Hanging beneath the belt)
    swordUpper: { x: 257, y: 395, r: 2.2 },
    swordMiddle: { x: 259, y: 420, r: 3.4, name: 'M42', labelX: 275, labelY: 423, anchor: 'start' },
    swordLower: { x: 262, y: 445, r: 2.4 },

    // The Legs & Feet (Iconic dynamic stance from Reference Image 1)
    saiph: { x: 225, y: 515, r: 4.4, name: 'Saiph', labelX: 198, labelY: 519, anchor: 'end' },
    rigel: { x: 370, y: 448, r: 6.0, name: 'Rigel', labelX: 398, labelY: 452, anchor: 'start' },

    // Raised Arm & Sword Hand Stars
    elbowRight: { x: 72, y: 160, r: 2.2 },
    handRight: { x: 92, y: 75, r: 2.5 },

    // Shield Center Hand Star
    handLeft: { x: 405, y: 195, r: 2.4 },

    // Lepus Constellation Stars (Under Orion's bent right foot)
    lepus1: { x: 335, y: 645, r: 2.0 },
    lepus2: { x: 365, y: 665, r: 2.2 },
    lepus3: { x: 325, y: 685, r: 1.8 },
  };

  return (
    <div
      className={`orion-constellation-container ${className}`}
      aria-label="Orion the Hunter Constellation Illustration"
    >
      <svg
        className="orion-svg"
        viewBox="0 0 520 740"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Celestial vector illustration of Orion the Hunter in a dynamic warrior stance holding sword and shield, overlaid with constellation stars."
      >
        <defs>
          {/* Subtle line glow filter */}
          <filter id={lineGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Betelgeuse Amber Red-Supergiant Corona */}
          <radialGradient id={betelgeuseCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2D6" stopOpacity="1" />
            <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </radialGradient>

          {/* Rigel Brilliant Blue-White Corona */}
          <radialGradient id={rigelCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="22%" stopColor="#BAE6FD" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </radialGradient>

          {/* Alnilam Center Belt Corona */}
          <radialGradient id={alnilamCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#C8B9F0" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#7774C8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#17152F" stopOpacity="0" />
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
            <stop offset="40%" stopColor="#C8B9F0" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#7774C8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#17152F" stopOpacity="0" />
          </radialGradient>

          {/* Shield Metallic Gradient */}
          <radialGradient id={shieldGradId} cx="42%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3D366D" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#252047" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#15122B" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#0D0B1C" stopOpacity="0.98" />
          </radialGradient>

          {/* Sword Blade Starlight Gradient */}
          <linearGradient id={bladeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8B9F0" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. FAINT CELESTIAL BACKGROUND STARS & GUIDE RETICLES           */}
        {/* ============================================================== */}
        <g className="orion-ambient-starfield" opacity="0.45" aria-hidden="true">
          {/* Dashed astronomical guide running above the sword */}
          <line
            x1="35"
            y1="56"
            x2="280"
            y2="30"
            stroke="var(--color-moonlight)"
            strokeWidth="0.8"
            strokeDasharray="4 6"
            opacity="0.35"
          />

          {/* Ambient micro-stars mirroring the star chart in Reference Image 1 */}
          <circle cx="58" cy="115" r="1.1" fill="#E9E4F5" opacity="0.5" />
          <circle cx="118" cy="42" r="1.4" fill="#E9E4F5" opacity="0.6" />
          <circle cx="152" cy="78" r="1.0" fill="#E9E4F5" opacity="0.4" />
          <circle cx="48" cy="210" r="1.2" fill="#E9E4F5" opacity="0.5" />
          <circle cx="120" cy="305" r="1.0" fill="#E9E4F5" opacity="0.35" />
          <circle cx="340" cy="95" r="1.5" fill="#E9E4F5" opacity="0.55" />
          <circle cx="470" cy="110" r="1.2" fill="#E9E4F5" opacity="0.5" />
          <circle cx="485" cy="275" r="1.1" fill="#E9E4F5" opacity="0.45" />
          <circle cx="460" cy="360" r="1.3" fill="#E9E4F5" opacity="0.5" />
          <circle cx="380" cy="330" r="1.0" fill="#E9E4F5" opacity="0.4" />
          <circle cx="140" cy="440" r="1.2" fill="#E9E4F5" opacity="0.45" />
          <circle cx="180" cy="590" r="1.1" fill="#E9E4F5" opacity="0.4" />
          <circle cx="430" cy="520" r="1.3" fill="#E9E4F5" opacity="0.55" />
          <circle cx="410" cy="610" r="1.0" fill="#E9E4F5" opacity="0.35" />
          <circle cx="280" cy="690" r="1.2" fill="#E9E4F5" opacity="0.45" />
          <circle cx="150" cy="670" r="1.0" fill="#E9E4F5" opacity="0.35" />

          {/* Lepus Constellation faint stars under right foot */}
          <circle cx={stars.lepus1.x} cy={stars.lepus1.y} r={stars.lepus1.r} fill="#C8B9F0" opacity="0.7" />
          <circle cx={stars.lepus2.x} cy={stars.lepus2.y} r={stars.lepus2.r} fill="#C8B9F0" opacity="0.75" />
          <circle cx={stars.lepus3.x} cy={stars.lepus3.y} r={stars.lepus3.r} fill="#C8B9F0" opacity="0.65" />
          <line
            x1={stars.lepus1.x}
            y1={stars.lepus1.y}
            x2={stars.lepus2.x}
            y2={stars.lepus2.y}
            stroke="var(--color-violet)"
            strokeWidth="0.75"
            opacity="0.35"
          />
          <line
            x1={stars.lepus2.x}
            y1={stars.lepus2.y}
            x2={stars.lepus3.x}
            y2={stars.lepus3.y}
            stroke="var(--color-violet)"
            strokeWidth="0.75"
            opacity="0.35"
          />
          <text
            x={stars.lepus2.x}
            y={stars.lepus2.y + 16}
            textAnchor="middle"
            fill="var(--color-muted)"
            fontSize="8.5"
            fontFamily="var(--font-mono)"
            letterSpacing="0.16em"
            opacity="0.65"
          >
            LEPUS
          </text>
        </g>

        {/* ============================================================== */}
        {/* 2. THE RECOGNIZABLE HUNTER FIGURE (FACETED WARRIOR ANATOMY)    */}
        {/* ============================================================== */}
        <g className="orion-hunter-figure" aria-hidden="true">
          {/* Base Solid Silhouette for contrast against sky */}
          <path
            className="orion-figure-base"
            d={`
              M 225 110
              L 245 115 L 255 135 L 254 150 L 248 175 L 235 185
              L 265 210 L 305 230 L 365 260 L 405 195 L 420 205
              L 360 275 L 335 250 L 310 250 L 295 338 L 290 435
              L 365 440 L 385 455 L 340 570 L 310 616 L 325 568
              L 358 465 L 275 435 L 265 450 L 252 452 L 236 452
              L 220 448 L 202 442 L 215 508 L 225 532 L 210 648
              L 192 705 L 218 655 L 240 526 L 235 450 L 218 442
              L 200 375 L 185 285 L 170 245 L 145 220 L 125 195
              L 70 155 L 92 85 L 80 80 L 105 72 L 285 46 L 287 49
              L 105 76 L 100 90 L 80 160 L 120 215 L 150 235
              L 180 230 L 215 210 L 210 175 L 212 145 L 215 110
              Z
            `}
            fill="#0E0C22"
            opacity="0.88"
          />

          {/* --- A. HELMET & PLUME (Spartan / Greek Plumed Helmet) --- */}
          <g className="orion-helmet-group">
            {/* Flowing Crest Plumes */}
            <path
              d="M 225 110 C 220 92, 202 70, 180 58 C 194 72, 205 92, 218 112 Z"
              fill="#2E2856"
              stroke="var(--color-pink)"
              strokeWidth="0.8"
              opacity="0.85"
            />
            <path
              d="M 225 110 C 228 90, 215 65, 192 48 C 206 66, 218 88, 222 112 Z"
              fill="#42397B"
              stroke="var(--color-moonlight)"
              strokeWidth="0.9"
            />
            <path
              d="M 228 112 C 238 92, 230 68, 208 52 C 222 70, 226 92, 226 114 Z"
              fill="#27214E"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
              opacity="0.9"
            />

            {/* Helmet Crown & Visor */}
            <path
              d="M 215 110 C 215 98, 238 98, 245 115 C 250 125, 252 135, 250 145 L 212 145 C 212 130, 215 120, 215 110 Z"
              fill="#221D44"
              stroke="var(--color-moonlight)"
              strokeWidth="1.1"
            />
            {/* Visor Slit Aperture */}
            <line
              x1="242"
              y1="138"
              x2="253"
              y2="142"
              stroke="#FFFFFF"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="orion-visor-glow"
            />
            {/* Cheek Guard & Neck Flange */}
            <path
              d="M 250 145 L 255 155 L 248 175 L 235 185 L 225 180 L 242 165 L 238 145 Z"
              fill="#191535"
              stroke="var(--color-violet)"
              strokeWidth="0.9"
            />
            <path
              d="M 212 145 L 210 175 L 225 180 L 238 145 Z"
              fill="#14112B"
              stroke="var(--color-violet)"
              strokeWidth="0.75"
            />
          </g>

          {/* --- B. RAISED RIGHT ARM & CELESTIAL SWORD --- */}
          <g className="orion-sword-arm-group">
            {/* Sword Blade (Horizontal overhead) */}
            <polygon
              points="105,72 285,46 287,49 105,76"
              fill={`url(#${bladeGradId})`}
              className="orion-blade-glow"
            />
            <line
              x1="105"
              y1="74"
              x2="283"
              y2="47"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Crossguard & Pommel */}
            <line
              x1="105"
              y1="64"
              x2="105"
              y2="84"
              stroke="var(--color-pink)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <line
              x1="105"
              y1="74"
              x2="84"
              y2="76"
              stroke="#D1D5DB"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="82" cy="76" r="3.2" fill="var(--color-pink)" />

            {/* Hand gripping hilt at (92, 75) */}
            <ellipse cx="94" cy="75" rx="5.5" ry="4.5" fill="#3D366D" stroke="#C8B9F0" strokeWidth="0.9" />

            {/* Forearm Bracer / Vambrace */}
            <polygon
              points="92,82 70,155 82,160 102,88"
              fill="#27214E"
              stroke="var(--color-moonlight)"
              strokeWidth="1.0"
            />
            <polygon
              points="102,88 82,160 92,165 110,92"
              fill="#1B163B"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
            />

            {/* Elbow & Bicep / Tricep */}
            <polygon
              points="70,155 115,210 138,230 125,195 82,160"
              fill="#221D44"
              stroke="var(--color-moonlight)"
              strokeWidth="0.9"
            />
            <polygon
              points="82,160 125,195 150,235 120,215"
              fill="#191535"
              stroke="var(--color-violet)"
              strokeWidth="0.75"
            />

            {/* Right Shoulder Pauldron (at Betelgeuse) */}
            <path
              d="M 142 220 C 160 215, 185 225, 195 240 C 185 258, 155 252, 142 220 Z"
              fill="#342D62"
              stroke="var(--color-pink)"
              strokeWidth="1.2"
              className="orion-pauldron"
            />
          </g>

          {/* --- C. EXTENDED LEFT ARM & ROUND HOPLITE SHIELD --- */}
          <g className="orion-shield-arm-group">
            {/* Left Shoulder Pauldron (at Bellatrix) */}
            <path
              d="M 290 215 C 315 210, 335 225, 335 245 C 315 258, 295 248, 290 215 Z"
              fill="#342D62"
              stroke="var(--color-moonlight)"
              strokeWidth="1.1"
              className="orion-pauldron"
            />

            {/* Upper Arm & Bicep extending to elbow at (365, 260) */}
            <polygon
              points="320,235 365,255 360,275 310,250"
              fill="#221D44"
              stroke="var(--color-violet)"
              strokeWidth="0.9"
            />

            {/* Forearm angled up into shield boss at (405, 195) */}
            <polygon
              points="365,255 405,195 418,205 360,275"
              fill="#2A2454"
              stroke="var(--color-moonlight)"
              strokeWidth="1.0"
            />

            {/* --- Hoplite Round Shield in 3/4 Perspective --- */}
            <g transform="rotate(8 415 195)" className="orion-shield-object">
              {/* Outer Rim Shadow */}
              <ellipse
                cx="415"
                cy="195"
                rx="68"
                ry="96"
                fill="#0B0918"
                opacity="0.6"
              />

              {/* Main Outer Shield Surface */}
              <ellipse
                cx="415"
                cy="195"
                rx="65"
                ry="92"
                fill={`url(#${shieldGradId})`}
                stroke="var(--color-moonlight)"
                strokeWidth="1.5"
                className="orion-shield-rim"
              />

              {/* Faceted Radial Shield Wedges */}
              <path d="M 415 195 L 415 103 A 65 92 0 0 1 465 140 Z" fill="#3A3266" opacity="0.45" />
              <path d="M 415 195 L 465 140 A 65 92 0 0 1 480 195 Z" fill="#262047" opacity="0.5" />
              <path d="M 415 195 L 480 195 A 65 92 0 0 1 465 250 Z" fill="#1C1838" opacity="0.6" />
              <path d="M 415 195 L 465 250 A 65 92 0 0 1 415 287 Z" fill="#131027" opacity="0.7" />
              <path d="M 415 195 L 415 287 A 65 92 0 0 1 365 250 Z" fill="#1B1736" opacity="0.6" />
              <path d="M 415 195 L 365 250 A 65 92 0 0 1 350 195 Z" fill="#2B2452" opacity="0.55" />
              <path d="M 415 195 L 350 195 A 65 92 0 0 1 365 140 Z" fill="#3C346B" opacity="0.5" />
              <path d="M 415 195 L 365 140 A 65 92 0 0 1 415 103 Z" fill="#4B4184" opacity="0.55" />

              {/* Inner Rim Groove */}
              <ellipse
                cx="415"
                cy="195"
                rx="50"
                ry="72"
                fill="none"
                stroke="var(--color-pink)"
                strokeWidth="0.85"
                opacity="0.65"
              />

              {/* Central Raised Boss */}
              <ellipse
                cx="415"
                cy="195"
                rx="22"
                ry="32"
                fill="#342D62"
                stroke="var(--color-moonlight)"
                strokeWidth="1.2"
              />
              <ellipse
                cx="413"
                cy="193"
                rx="14"
                ry="20"
                fill="#4C4288"
                stroke="#FFFFFF"
                strokeWidth="0.6"
                opacity="0.8"
              />
            </g>
          </g>

          {/* --- D. CUIRASS TORSO & MUSCULAR PLATES --- */}
          <g className="orion-cuirass-group">
            {/* Neck & Gorget */}
            <polygon
              points="218,185 244,182 258,212 214,212"
              fill="#191535"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
            />

            {/* Pectoral Breastplates */}
            <polygon
              points="180,230 238,218 238,278 185,280"
              fill="#2E275C"
              stroke="var(--color-moonlight)"
              strokeWidth="1.1"
            />
            <polygon
              points="238,218 298,225 288,275 238,278"
              fill="#221D46"
              stroke="var(--color-moonlight)"
              strokeWidth="1.1"
            />
            {/* Sternal Center Ridge */}
            <line
              x1="238"
              y1="218"
              x2="238"
              y2="355"
              stroke="var(--color-pink)"
              strokeWidth="0.9"
              opacity="0.75"
            />

            {/* Abdominal & Ribcage Facet Plates */}
            <polygon
              points="190,285 238,280 238,318 198,320"
              fill="#251F4B"
              stroke="var(--color-violet)"
              strokeWidth="0.85"
            />
            <polygon
              points="238,280 284,278 276,318 238,318"
              fill="#1C183B"
              stroke="var(--color-violet)"
              strokeWidth="0.85"
            />

            {/* Lower Abdominals & Obliques */}
            <polygon
              points="198,322 238,320 238,358 205,355"
              fill="#211B44"
              stroke="var(--color-violet)"
              strokeWidth="0.85"
            />
            <polygon
              points="238,320 274,320 268,355 238,358"
              fill="#171333"
              stroke="var(--color-violet)"
              strokeWidth="0.85"
            />
          </g>

          {/* --- E. BELT GIRDLE & ARMORED SKIRT (PTERUGES) --- */}
          <g className="orion-belt-group">
            {/* Belt Band (Diagonal across hips) */}
            <polygon
              points="200,378 295,335 298,348 202,392"
              fill="#342D62"
              stroke="var(--color-pink)"
              strokeWidth="1.2"
              className="orion-belt-plate"
            />

            {/* Hanging Armored Pteruges Strips (Leather/Bronze Tassets) */}
            <polygon points="205,385 202,442 216,444 218,382" fill="#26204E" stroke="var(--color-violet)" strokeWidth="0.8" />
            <polygon points="220,380 218,448 232,450 234,377" fill="#302960" stroke="var(--color-moonlight)" strokeWidth="0.9" />
            <polygon points="236,375 236,452 252,452 250,372" fill="#221D46" stroke="var(--color-violet)" strokeWidth="0.8" />
            <polygon points="254,370 258,448 272,445 268,367" fill="#2C2658" stroke="var(--color-moonlight)" strokeWidth="0.9" />
            <polygon points="272,363 278,440 290,435 284,358" fill="#1C183B" stroke="var(--color-violet)" strokeWidth="0.8" />

            {/* The Scabbard / Sword hanging in the middle */}
            <polygon
              points="254,362 258,468 266,468 264,362"
              fill="#191535"
              stroke="var(--color-pink)"
              strokeWidth="1.0"
            />
            {/* Scabbard Chape & Locket */}
            <rect x="254" y="372" width="10" height="4" fill="var(--color-pink)" opacity="0.85" />
            <polygon points="258,468 262,476 266,468" fill="var(--color-pink)" opacity="0.9" />
          </g>

          {/* --- F. LEFT LEG (STANDING FIRM - SAIPH AT KNEE) --- */}
          <g className="orion-left-leg-group">
            {/* Thigh Cuisses */}
            <polygon
              points="202,435 215,508 225,508 218,442"
              fill="#27214E"
              stroke="var(--color-moonlight)"
              strokeWidth="0.95"
            />
            <polygon
              points="218,442 225,508 235,508 235,450"
              fill="#1B163B"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
            />

            {/* Knee Cop (Poleyn) enclosing Saiph at (225, 515) */}
            <polygon
              points="212,506 238,506 240,526 225,534 210,526"
              fill="#342D62"
              stroke="var(--color-moonlight)"
              strokeWidth="1.2"
            />

            {/* Greave (Shin Armor & Calf) */}
            <polygon
              points="210,526 200,585 210,648 222,648 225,534"
              fill="#241E48"
              stroke="var(--color-moonlight)"
              strokeWidth="1.0"
            />
            <polygon
              points="225,534 222,648 232,648 238,585 240,526"
              fill="#171333"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
            />

            {/* Planted Foot & Boot */}
            <polygon
              points="210,648 225,650 218,675 192,705 186,698 202,670"
              fill="#2B2454"
              stroke="var(--color-moonlight)"
              strokeWidth="0.95"
            />
          </g>

          {/* --- G. RIGHT LEG (DYNAMIC BENT STANCE - RIGEL AT KNEE) --- */}
          <g className="orion-right-leg-group">
            {/* Thigh sweeping out to Rigel at (370, 448) */}
            <polygon
              points="280,415 362,436 368,448 275,432"
              fill="#2D265A"
              stroke="var(--color-moonlight)"
              strokeWidth="1.0"
            />
            <polygon
              points="275,432 368,448 358,465 265,442"
              fill="#1D183E"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
            />

            {/* Knee Cop (Poleyn) enclosing Rigel at (370, 448) */}
            <polygon
              points="356,434 378,438 386,458 370,468 352,455"
              fill="#3D3574"
              stroke="var(--color-moonlight)"
              strokeWidth="1.3"
              className="orion-knee-rigel"
            />

            {/* Shin Greave sweeping back down-left to ankle at (322, 560) */}
            <polygon
              points="370,465 322,560 332,566 384,485"
              fill="#28224F"
              stroke="var(--color-moonlight)"
              strokeWidth="1.0"
            />
            <polygon
              points="384,485 332,566 340,572 394,495"
              fill="#181436"
              stroke="var(--color-violet)"
              strokeWidth="0.8"
            />

            {/* Bent Floating Foot in mid-air */}
            <polygon
              points="322,560 338,570 326,608 310,616 308,602 318,582"
              fill="#2F285C"
              stroke="var(--color-moonlight)"
              strokeWidth="0.95"
            />
          </g>
        </g>

        {/* ============================================================== */}
        {/* 3. M42 GREAT ORION NEBULA DIFFUSE EMISSION                     */}
        {/* ============================================================== */}
        <g className="orion-m42-glow" aria-hidden="true">
          <ellipse
            cx={stars.swordMiddle.x}
            cy={stars.swordMiddle.y}
            rx="24"
            ry="16"
            fill={`url(#${m42NebulaId})`}
            transform={`rotate(-22 ${stars.swordMiddle.x} ${stars.swordMiddle.y})`}
            className="orion-nebula-pulse"
          />
        </g>

        {/* ============================================================== */}
        {/* 4. CONSTELLATION CONNECTING LINES (CRISP, LUMINOUS ASTRONOMY)  */}
        {/* ============================================================== */}
        <g className="orion-main-lines" filter={`url(#${lineGlowId})`}>
          {/* Shoulders to Head / Chest Line */}
          <line x1={stars.betelgeuse.x} y1={stars.betelgeuse.y} x2={stars.bellatrix.x} y2={stars.bellatrix.y} className="orion-constellation-line" />

          {/* Shoulders to Belt Stars */}
          <line x1={stars.betelgeuse.x} y1={stars.betelgeuse.y} x2={stars.alnitak.x} y2={stars.alnitak.y} className="orion-constellation-line" />
          <line x1={stars.bellatrix.x} y1={stars.bellatrix.y} x2={stars.mintaka.x} y2={stars.mintaka.y} className="orion-constellation-line" />

          {/* The Belt (Crisp continuous diagonal) */}
          <line x1={stars.alnitak.x} y1={stars.alnitak.y} x2={stars.alnilam.x} y2={stars.alnilam.y} className="orion-constellation-line orion-belt-line" />
          <line x1={stars.alnilam.x} y1={stars.alnilam.y} x2={stars.mintaka.x} y2={stars.mintaka.y} className="orion-constellation-line orion-belt-line" />

          {/* Belt down to Standing Leg (Saiph) & Bent Leg (Rigel) */}
          <line x1={stars.alnitak.x} y1={stars.alnitak.y} x2={stars.saiph.x} y2={stars.saiph.y} className="orion-constellation-line" />
          <line x1={stars.mintaka.x} y1={stars.mintaka.y} x2={stars.rigel.x} y2={stars.rigel.y} className="orion-constellation-line" />

          {/* Diagonal Connection between Feet / Knees (Saiph <-> Rigel) */}
          <line x1={stars.saiph.x} y1={stars.saiph.y} x2={stars.rigel.x} y2={stars.rigel.y} className="orion-constellation-line" />

          {/* Sword hanging downward */}
          <line x1={stars.alnilam.x} y1={stars.alnilam.y + 10} x2={stars.swordUpper.x} y2={stars.swordUpper.y} className="orion-sword-line" />
          <line x1={stars.swordUpper.x} y1={stars.swordUpper.y} x2={stars.swordMiddle.x} y2={stars.swordMiddle.y} className="orion-sword-line" />
          <line x1={stars.swordMiddle.x} y1={stars.swordMiddle.y} x2={stars.swordLower.x} y2={stars.swordLower.y} className="orion-sword-line" />

          {/* Raised Arm line to elbow and sword hand */}
          <line x1={stars.betelgeuse.x} y1={stars.betelgeuse.y} x2={stars.elbowRight.x} y2={stars.elbowRight.y} className="orion-arm-line" />
          <line x1={stars.elbowRight.x} y1={stars.elbowRight.y} x2={stars.handRight.x} y2={stars.handRight.y} className="orion-arm-line" />

          {/* Left Arm line to shield boss */}
          <line x1={stars.bellatrix.x} y1={stars.bellatrix.y} x2={stars.handLeft.x} y2={stars.handLeft.y} className="orion-arm-line" />

          {/* Chest cross struts from Betelgeuse across cuirass (matching Reference Image 1) */}
          <line x1={stars.betelgeuse.x} y1={stars.betelgeuse.y} x2="238" y2="280" className="orion-strut-line" />
          <line x1={stars.bellatrix.x} y1={stars.bellatrix.y} x2="238" y2="280" className="orion-strut-line" />
          <line x1="238" y1="280" x2={stars.alnilam.x} y2={stars.alnilam.y} className="orion-strut-line" />
        </g>

        {/* ============================================================== */}
        {/* 5. STAR DIFFRACTION SPIKES & HALO CORONAS                      */}
        {/* ============================================================== */}
        <g className="orion-star-diffraction" aria-hidden="true">
          {/* Betelgeuse Amber Red-Supergiant Glow & 4-Point Diffraction Flare */}
          <circle
            cx={stars.betelgeuse.x}
            cy={stars.betelgeuse.y}
            r={stars.betelgeuse.r * 4.6}
            fill={`url(#${betelgeuseCoronaId})`}
            className="orion-supergiant-glow"
          />
          {/* Betelgeuse 4-point Diamond Cross Flare */}
          <path
            d={`
              M ${stars.betelgeuse.x} ${stars.betelgeuse.y - 22}
              Q ${stars.betelgeuse.x} ${stars.betelgeuse.y} ${stars.betelgeuse.x + 22} ${stars.betelgeuse.y}
              Q ${stars.betelgeuse.x} ${stars.betelgeuse.y} ${stars.betelgeuse.x} ${stars.betelgeuse.y + 22}
              Q ${stars.betelgeuse.x} ${stars.betelgeuse.y} ${stars.betelgeuse.x - 22} ${stars.betelgeuse.y}
              Z
            `}
            fill="#FFE8C2"
            opacity="0.85"
            className="orion-spike-shimmer"
          />

          {/* Rigel Brilliant Blue-White Glow & 4-Point Diffraction Flare */}
          <circle
            cx={stars.rigel.x}
            cy={stars.rigel.y}
            r={stars.rigel.r * 4.8}
            fill={`url(#${rigelCoronaId})`}
            className="orion-supergiant-glow"
          />
          {/* Rigel 4-point Diamond Cross Flare */}
          <path
            d={`
              M ${stars.rigel.x} ${stars.rigel.y - 26}
              Q ${stars.rigel.x} ${stars.rigel.y} ${stars.rigel.x + 26} ${stars.rigel.y}
              Q ${stars.rigel.x} ${stars.rigel.y} ${stars.rigel.x} ${stars.rigel.y + 26}
              Q ${stars.rigel.x} ${stars.rigel.y} ${stars.rigel.x - 26} ${stars.rigel.y}
              Z
            `}
            fill="#E0F2FE"
            opacity="0.9"
            className="orion-spike-shimmer"
          />

          {/* Alnilam Center Belt Star Corona & Cross Flare */}
          <circle
            cx={stars.alnilam.x}
            cy={stars.alnilam.y}
            r={stars.alnilam.r * 3.6}
            fill={`url(#${alnilamCoronaId})`}
            className="orion-halo"
          />
          <path
            d={`
              M ${stars.alnilam.x} ${stars.alnilam.y - 15}
              Q ${stars.alnilam.x} ${stars.alnilam.y} ${stars.alnilam.x + 15} ${stars.alnilam.y}
              Q ${stars.alnilam.x} ${stars.alnilam.y} ${stars.alnilam.x} ${stars.alnilam.y + 15}
              Q ${stars.alnilam.x} ${stars.alnilam.y} ${stars.alnilam.x - 15} ${stars.alnilam.y}
              Z
            `}
            fill="#FFFFFF"
            opacity="0.75"
          />

          {/* Bellatrix, Alnitak, Mintaka, Saiph Halos */}
          <circle cx={stars.bellatrix.x} cy={stars.bellatrix.y} r={stars.bellatrix.r * 3.2} fill={`url(#${starCoronaId})`} className="orion-halo" />
          <circle cx={stars.alnitak.x} cy={stars.alnitak.y} r={stars.alnitak.r * 3.0} fill={`url(#${starCoronaId})`} className="orion-halo" />
          <circle cx={stars.mintaka.x} cy={stars.mintaka.y} r={stars.mintaka.r * 3.0} fill={`url(#${starCoronaId})`} className="orion-halo" />
          <circle cx={stars.saiph.x} cy={stars.saiph.y} r={stars.saiph.r * 3.2} fill={`url(#${starCoronaId})`} className="orion-halo" />
        </g>

        {/* ============================================================== */}
        {/* 6. STAR NODES (SHARP LUMINOUS CORES)                           */}
        {/* ============================================================== */}
        <g className="orion-star-nodes">
          {/* Arm and Shield Nodes */}
          <circle cx={stars.elbowRight.x} cy={stars.elbowRight.y} r={stars.elbowRight.r} fill="#C8B9F0" opacity="0.8" />
          <circle cx={stars.handRight.x} cy={stars.handRight.y} r={stars.handRight.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.3s' }} />
          <circle cx={stars.handLeft.x} cy={stars.handLeft.y} r={stars.handLeft.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.1s' }} />

          {/* Sword Stars */}
          <circle cx={stars.swordUpper.x} cy={stars.swordUpper.y} r={stars.swordUpper.r} fill="#E2E8F0" opacity="0.8" />
          <circle cx={stars.swordMiddle.x} cy={stars.swordMiddle.y} r={stars.swordMiddle.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.4s' }} />
          <circle cx={stars.swordLower.x} cy={stars.swordLower.y} r={stars.swordLower.r} fill="#E2E8F0" opacity="0.85" />

          {/* Betelgeuse (Warm Golden Core + Pure White Center) */}
          <circle cx={stars.betelgeuse.x} cy={stars.betelgeuse.y} r={stars.betelgeuse.r} fill="#FFD29D" className="orion-supergiant-core" />
          <circle cx={stars.betelgeuse.x} cy={stars.betelgeuse.y} r={stars.betelgeuse.r * 0.45} fill="#FFFFFF" />

          {/* Bellatrix (Blue-White Core) */}
          <circle cx={stars.bellatrix.x} cy={stars.bellatrix.y} r={stars.bellatrix.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.7s' }} />

          {/* The Belt Stars */}
          <circle cx={stars.alnitak.x} cy={stars.alnitak.y} r={stars.alnitak.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.5s' }} />
          <circle cx={stars.alnilam.x} cy={stars.alnilam.y} r={stars.alnilam.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.2s' }} />
          <circle cx={stars.mintaka.x} cy={stars.mintaka.y} r={stars.mintaka.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '1.9s' }} />

          {/* Saiph (White Core) */}
          <circle cx={stars.saiph.x} cy={stars.saiph.y} r={stars.saiph.r} fill="#FFFFFF" className="orion-twinkle" style={{ animationDelay: '0.5s' }} />

          {/* Rigel (Brilliant Icy Blue-White Core) */}
          <circle cx={stars.rigel.x} cy={stars.rigel.y} r={stars.rigel.r} fill="#F0F9FF" className="orion-supergiant-core" />
          <circle cx={stars.rigel.x} cy={stars.rigel.y} r={stars.rigel.r * 0.5} fill="#FFFFFF" />
        </g>

        {/* ============================================================== */}
        {/* 7. NON-OVERLAPPING ASTRONOMICAL LABELS                         */}
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

            {/* Central Constellation Title on Cuirass (like in Reference Image 1) */}
            <text
              x="238"
              y="308"
              textAnchor="middle"
              className="orion-label-hero-title"
            >
              ORION
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

      {/* Understated Astronomical Telemetry Bar */}
      <div className="orion-telemetry-tag" aria-hidden="true">
        <span className="orion-tag-name">ORION &bull; THE HUNTER</span>
        <span className="orion-tag-coords">RA 05h 35m &bull; DEC +00&deg; 00&prime;</span>
      </div>
    </div>
  );
};
