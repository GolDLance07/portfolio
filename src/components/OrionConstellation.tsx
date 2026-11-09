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
  const blueStarCoronaId = `blue-star-corona-${cleanId}`;
  const amberStarCoronaId = `amber-star-corona-${cleanId}`;
  const m42NebulaId = `m42-nebula-${cleanId}`;
  const shieldGradId = `shield-grad-${cleanId}`;
  const bladeGradId = `blade-grad-${cleanId}`;

  return (
    <div
      className={`orion-constellation-container ${className}`}
      aria-label="Orion the Hunter Constellation & Celestial Silhouette"
    >
      <svg
        className="orion-svg"
        viewBox="0 0 384 640"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Celestial reconstruction of Orion the Hunter emerging from the starfield, exactly mapped to astronomical coordinates."
      >
        <defs>
          {/* Subtle line glow filter */}
          <filter id={lineGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Betelgeuse Amber Red-Supergiant Corona */}
          <radialGradient id={betelgeuseCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7E6" stopOpacity="1" />
            <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </radialGradient>

          {/* Rigel Brilliant Blue-White Corona */}
          <radialGradient id={rigelCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="22%" stopColor="#BAE6FD" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>

          {/* Alnilam Center Belt Corona */}
          <radialGradient id={alnilamCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#BFDBFE" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
          </radialGradient>

          {/* Blue-White Star Halo */}
          <radialGradient id={blueStarCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#C7D2FE" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#818CF8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#312E81" stopOpacity="0" />
          </radialGradient>

          {/* Amber Star Halo (Aldebaran) */}
          <radialGradient id={amberStarCoronaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="35%" stopColor="#FCD34D" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
          </radialGradient>

          {/* M42 Great Orion Nebula diffuse cloud */}
          <radialGradient id={m42NebulaId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#A855F7" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#6366F1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
          </radialGradient>

          {/* Shield Concave Shading Gradient */}
          <radialGradient id={shieldGradId} cx="52%" cy="48%" r="58%">
            <stop offset="0%" stopColor="#1e2c42" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#141e2e" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#0d1420" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#182538" stopOpacity="0.8" />
          </radialGradient>

          {/* Sword Blade Starlight Gradient */}
          <linearGradient id={bladeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#94A3B8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. FAINT CELESTIAL BACKGROUND STARS & GUIDE RETICLE            */}
        {/* ============================================================== */}
        <g className="orion-ambient-stars" aria-hidden="true">
          {/* Dashed Celestial Coordinate Line (Top-Left) */}
          <line
            x1="12"
            y1="50"
            x2="78"
            y2="24"
            stroke="#64748b"
            strokeWidth="0.8"
            strokeDasharray="4 5"
            opacity="0.45"
          />

          {/* Taurus / Aldebaran in Upper Right */}
          <circle cx="292" cy="28" r="14" fill={`url(#${amberStarCoronaId})`} opacity="0.65" />
          <line x1="277" y1="28" x2="307" y2="28" stroke="#fde68a" strokeWidth="0.8" opacity="0.8" />
          <line x1="292" y1="13" x2="292" y2="43" stroke="#fde68a" strokeWidth="0.8" opacity="0.8" />
          <circle cx="292" cy="28" r="2.2" fill="#fffbeb" />

          {/* Background Field Stars */}
          <circle cx="113" cy="40" r="1.3" fill="#e2e8f0" opacity="0.75" />
          <circle cx="340" cy="48" r="1.0" fill="#cbd5e1" opacity="0.5" />
          <circle cx="22" cy="115" r="0.9" fill="#94a3b8" opacity="0.45" />
          <circle cx="370" cy="130" r="1.1" fill="#cbd5e1" opacity="0.5" />
          <circle cx="365" cy="245" r="0.9" fill="#94a3b8" opacity="0.45" />
          <circle cx="25" cy="270" r="1.1" fill="#cbd5e1" opacity="0.55" />
          <circle cx="115" cy="365" r="0.8" fill="#94a3b8" opacity="0.4" />
          <circle cx="355" cy="390" r="1.0" fill="#cbd5e1" opacity="0.5" />
          <circle cx="360" cy="515" r="1.1" fill="#cbd5e1" opacity="0.45" />
          <circle cx="295" cy="580" r="0.9" fill="#94a3b8" opacity="0.4" />
          <circle cx="70" cy="610" r="1.0" fill="#cbd5e1" opacity="0.5" />

          {/* Orion's Head Stars (Meissa Lambda Ori, Phi1, Phi2) */}
          <circle cx="168" cy="77" r="1.4" fill="#ffffff" opacity="0.85" />
          <circle cx="178" cy="74" r="1.2" fill="#cbd5e1" opacity="0.75" />
          <circle cx="183" cy="77" r="1.2" fill="#cbd5e1" opacity="0.75" />
          <line x1="168" y1="77" x2="178" y2="74" stroke="#64748b" strokeWidth="0.6" opacity="0.4" />
          <line x1="178" y1="74" x2="183" y2="77" stroke="#64748b" strokeWidth="0.6" opacity="0.4" />

          {/* Orion's Sword Stars & M42 Nebula below belt */}
          <circle cx="204" cy="303" r="14" fill={`url(#${m42NebulaId})`} />
          <circle cx="202" cy="289" r="1.3" fill="#e2e8f0" opacity="0.8" />
          <circle cx="204" cy="303" r="1.8" fill="#ffffff" opacity="0.95" />
          <circle cx="216" cy="315" r="1.4" fill="#e2e8f0" opacity="0.8" />
          <line x1="202" y1="289" x2="204" y2="303" stroke="#cbd5e1" strokeWidth="0.65" opacity="0.5" />
          <line x1="204" y1="303" x2="216" y2="315" stroke="#cbd5e1" strokeWidth="0.65" opacity="0.5" />

          {/* Shield Arc Stars (Pi 1 to Pi 6 Orionis) */}
          <circle cx="256" cy="75" r="1.2" fill="#cbd5e1" opacity="0.7" />
          <circle cx="249" cy="87" r="1.3" fill="#e2e8f0" opacity="0.8" />
          <circle cx="266" cy="123" r="1.4" fill="#ffffff" opacity="0.85" />
          <circle cx="282" cy="132" r="1.3" fill="#e2e8f0" opacity="0.8" />
          <circle cx="292" cy="168" r="1.4" fill="#ffffff" opacity="0.85" />
          <circle cx="287" cy="216" r="1.3" fill="#e2e8f0" opacity="0.8" />
          <circle cx="245" cy="218" r="1.2" fill="#cbd5e1" opacity="0.7" />

          {/* Lepus Constellation below stepping leg */}
          <g className="orion-lepus-asterism">
            <line x1="254" y1="448" x2="272" y2="443" stroke="#475569" strokeWidth="0.7" opacity="0.6" />
            <line x1="272" y1="443" x2="292" y2="473" stroke="#475569" strokeWidth="0.7" opacity="0.6" />
            <line x1="254" y1="448" x2="258" y2="506" stroke="#475569" strokeWidth="0.7" opacity="0.6" />
            <line x1="258" y1="506" x2="272" y2="505" stroke="#475569" strokeWidth="0.7" opacity="0.6" />
            <circle cx="254" cy="448" r="1.8" fill="#ffffff" opacity="0.9" />
            <circle cx="272" cy="443" r="1.5" fill="#e2e8f0" opacity="0.85" />
            <circle cx="292" cy="473" r="1.4" fill="#e2e8f0" opacity="0.85" />
            <circle cx="258" cy="506" r="1.3" fill="#cbd5e1" opacity="0.8" />
            <circle cx="272" cy="505" r="1.3" fill="#cbd5e1" opacity="0.8" />
          </g>

          {/* Canis Major Stars (Sirius & Murzim) in Lower Left */}
          <g className="orion-canis-major">
            <line x1="88" y1="503" x2="148" y2="492" stroke="#475569" strokeWidth="0.7" opacity="0.5" />
            {/* Sirius (Alpha Canis Majoris) */}
            <circle cx="88" cy="503" r="18" fill={`url(#${blueStarCoronaId})`} opacity="0.8" />
            <line x1="75" y1="503" x2="101" y2="503" stroke="#bae6fd" strokeWidth="0.9" opacity="0.85" />
            <line x1="88" y1="490" x2="88" y2="516" stroke="#bae6fd" strokeWidth="0.9" opacity="0.85" />
            <circle cx="88" cy="503" r="2.4" fill="#ffffff" />
            {/* Murzim (Beta Canis Majoris) */}
            <circle cx="148" cy="492" r="12" fill={`url(#${blueStarCoronaId})`} opacity="0.6" />
            <line x1="139" y1="492" x2="157" y2="492" stroke="#bae6fd" strokeWidth="0.7" opacity="0.75" />
            <line x1="148" y1="483" x2="148" y2="501" stroke="#bae6fd" strokeWidth="0.7" opacity="0.75" />
            <circle cx="148" cy="492" r="1.9" fill="#ffffff" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* 2. MASTER HUNTER BASE SILHOUETTE                               */}
        {/* ============================================================== */}
        <g className="orion-hunter-silhouette" aria-hidden="true">
          <path
            className="orion-silhouette-base"
            d="
              M 49 49 L 27 66 L 49 70 L 34 141 L 38 159 L 53 167 L 58 151
              L 71 152 L 74 166 L 66 167 L 83 185 L 55 171 L 110 209 L 95 223
              L 128 226 L 160 259 L 158 276 L 173 288 L 161 348 L 171 360
              L 160 510 L 174 504 L 177 523 L 183 510 L 175 497 L 193 426
              L 169 421 L 170 408 L 183 405 L 186 389 L 195 391 L 194 407
              L 209 389 L 225 397 L 228 362 L 250 354 L 283 383 L 260 399
              L 250 439 L 225 466 L 246 481 L 258 506 L 273 504 L 277 497
              L 260 468 L 283 445 L 286 424 L 261 411 L 290 389 L 291 419
              L 315 381 L 291 317 L 239 277 L 229 207 L 258 206 L 289 235
              L 319 230 L 340 204 L 349 159 L 340 109 L 313 76 L 287 73
              L 264 89 L 251 114 L 248 170 L 236 177 L 185 149 L 195 141
              L 204 97 L 157 41 L 171 64 L 138 52 L 175 73 L 181 68
              L 180 78 L 128 75 L 159 77 L 147 98 L 149 129 L 138 134
              L 155 152 L 134 170 L 112 169 L 67 149 L 63 87 L 69 70
              L 87 63 L 75 63 L 70 48 Z
            "
            fill="#090e17"
            stroke="#131c2c"
            strokeWidth="0.8"
          />
        </g>

        {/* ============================================================== */}
        {/* 3. SHADED ARMOR PLATE FACETS & 3D ANATOMICAL REGIONS           */}
        {/* ============================================================== */}
        <g className="orion-armor-facets" aria-hidden="true">
          {/* --- HELMET & CREST --- */}
          {/* Crest Plume Feathers (curving gracefully backward) */}
          <path
            d="M 155 78 C 144 65, 134 54, 125 48 C 132 58, 142 68, 153 80 Z"
            fill="#1c2a3d"
          />
          <path
            d="M 163 74 C 153 58, 145 48, 138 42 C 145 54, 154 66, 161 77 Z"
            fill="#273950"
          />
          <path
            d="M 170 75 C 164 60, 158 50, 152 46 C 158 56, 165 67, 168 77 Z"
            fill="#1f2e42"
          />

          {/* Helmet Skull Cap & Dome */}
          <polygon
            points="148,98 156,82 170,76 186,80 198,94 198,108 180,108 162,104"
            fill="#141f2e"
          />
          {/* Visor Brow Highlight */}
          <polygon
            points="168,104 198,108 206,116 196,124 170,118"
            fill="#2b3e58"
          />
          {/* T-Visor Eye Slit Shadow */}
          <polygon
            points="172,120 195,125 192,136 170,132"
            fill="#080c14"
          />
          {/* Cheek Guard & Chin Plate */}
          <polygon
            points="165,130 192,136 188,154 174,154 162,142"
            fill="#1a273a"
          />
          {/* Throat & Neck Gorget */}
          <polygon
            points="164,152 188,154 182,170 166,168"
            fill="#111a28"
          />

          {/* --- SWORD & RAISED ARM --- */}
          {/* Sword Blade (extending horizontally overhead) */}
          <polygon
            points="56,75 56,71 208,42 210,46"
            fill={`url(#${bladeGradId})`}
          />
          {/* Sword Hilt & Crossguard */}
          <polygon
            points="48,72 58,70 56,85 46,87"
            fill="#1e2c3f"
          />
          {/* Pommel */}
          <polygon
            points="44,86 48,85 46,92 42,93"
            fill="#293c54"
          />
          {/* Raised Forearm */}
          <polygon
            points="52,79 63,86 66,120 63,142 50,140 45,105"
            fill="#1b283b"
          />
          {/* Forearm Light Facet */}
          <polygon
            points="52,79 58,85 53,138 48,138 45,105"
            fill="#26374e"
          />
          {/* Elbow Joint Facet */}
          <polygon
            points="50,140 63,142 72,152 58,158"
            fill="#23344b"
          />
          {/* Bicep & Tricep */}
          <polygon
            points="63,142 80,155 104,175 124,209 105,215 76,185 58,158"
            fill="#152132"
          />
          {/* Bicep Inner Highlight Plane */}
          <polygon
            points="76,155 98,172 118,206 105,213 74,180"
            fill="#223349"
          />

          {/* --- TORSO CUIRASS & ARMOR --- */}
          {/* Clavicle & Collar Plate */}
          <polygon
            points="124,209 165,172 182,170 203,193 175,196 145,205"
            fill="#1e2c3e"
          />
          {/* Right Pectoral Plate (under Betelgeuse) */}
          <polygon
            points="124,209 145,205 175,196 180,232 150,236 128,224"
            fill="#273a52"
          />
          {/* Left Pectoral Plate (under Bellatrix) */}
          <polygon
            points="175,196 203,193 218,215 206,235 180,232"
            fill="#172335"
          />
          {/* Sternum Dividing Ridge Line */}
          <line
            x1="178"
            y1="196"
            x2="180"
            y2="232"
            stroke="#344a68"
            strokeWidth="1"
          />
          {/* Upper Abdominal Armor Plate */}
          <polygon
            points="145,236 180,232 206,235 200,256 175,258 150,252"
            fill="#22334a"
          />
          {/* Lower Abdominal Armor Plate */}
          <polygon
            points="150,252 175,258 200,256 216,258 220,275 187,280 160,278"
            fill="#192537"
          />
          {/* Waist Belt (Cingulum across Alnitak - Alnilam - Mintaka) */}
          <polygon
            points="160,278 187,280 220,275 226,288 188,294 162,290"
            fill="#121b29"
            stroke="#263850"
            strokeWidth="0.8"
          />

          {/* --- PTERUGES (ROMAN/GREEK SKIRT STRIPS) --- */}
          <g className="orion-pteruges">
            {/* Flap 1 (Rightmost viewer left) */}
            <polygon points="162,290 174,292 170,348 160,346" fill="#182436" />
            {/* Flap 2 */}
            <polygon points="174,292 186,294 184,352 170,348" fill="#24354c" />
            {/* Flap 3 (Center) */}
            <polygon points="186,294 198,293 196,348 184,352" fill="#1b283b" />
            {/* Flap 4 */}
            <polygon points="198,293 212,290 218,335 208,325" fill="#25374e" />
            {/* Flap 5 (Leftmost viewer right) */}
            <polygon points="212,290 226,288 246,336 232,342 218,335" fill="#192639" />
          </g>

          {/* --- SHIELD ARM & HOPLITE ASPIS SHIELD --- */}
          {/* Left Deltoid (Bellatrix joint) */}
          <polygon
            points="203,193 225,190 235,202 228,218 208,222"
            fill="#23344b"
          />
          {/* Left Bicep */}
          <polygon
            points="228,218 235,202 262,208 258,224"
            fill="#172436"
          />
          {/* Left Forearm entering shield */}
          <polygon
            points="258,224 262,208 291,153 284,150"
            fill="#1f2d41"
          />

          {/* 12-Sided Hoplite Shield Outer Rim */}
          <polygon
            points="
              297,71 320,80 340,107 350,154
              340,204 321,229 297,237 273,229
              254,204 244,154 254,104 273,80
            "
            fill="#131c2a"
            stroke="#263852"
            strokeWidth="1.2"
          />
          {/* Shield Inner Dish Facet */}
          <polygon
            points="
              297,85 315,93 330,115 338,154
              330,193 315,215 297,223 279,215
              264,193 256,154 264,115 279,93
            "
            fill={`url(#${shieldGradId})`}
          />
          {/* Shield Outer Rim Highlight Facets */}
          <polygon points="297,71 320,80 315,93 297,85" fill="#2d405a" />
          <polygon points="320,80 340,107 330,115 315,93" fill="#24344c" />
          <polygon points="340,107 350,154 338,154 330,115" fill="#1b283b" />
          <polygon points="340,204 321,229 315,215 330,193" fill="#273850" />
          <polygon points="321,229 297,237 297,223 315,215" fill="#2d415d" />
          <polygon points="273,80 297,71 297,85 279,93" fill="#293b54" />
          {/* Central Shield Boss / Hand Grip */}
          <polygon
            points="288,146 298,146 302,156 296,164 286,160"
            fill="#364e6f"
          />

          {/* --- STANDING LEG (RIGHT LEG / VIEWER'S LEFT) --- */}
          {/* Upper Thigh */}
          <polygon
            points="175,352 195,348 208,325 212,365 175,372"
            fill="#172336"
          />
          {/* Lower Thigh Ridge */}
          <polygon
            points="175,372 212,365 205,384 188,384 172,380"
            fill="#23344a"
          />
          {/* Knee Cap (Saiph star joint) */}
          <polygon
            points="188,384 205,384 206,405 190,405"
            fill="#2a3d56"
          />
          {/* Greave / Shin Upper */}
          <polygon
            points="190,405 206,405 200,445 182,445"
            fill="#1c2a3e"
          />
          {/* Shin Ridge Highlight */}
          <polygon
            points="190,405 196,405 192,445 186,445"
            fill="#2c3f59"
          />
          {/* Greave / Shin Lower */}
          <polygon
            points="182,445 200,445 192,490 174,490 178,455"
            fill="#152030"
          />
          {/* Ankle & Planted Foot */}
          <polygon
            points="174,490 192,490 188,545 178,548 172,520"
            fill="#101926"
            stroke="#1c2b3e"
            strokeWidth="0.8"
          />

          {/* --- STEPPING / BENT LEG (LEFT LEG / VIEWER'S RIGHT) --- */}
          {/* Upper Thigh */}
          <polygon
            points="226,288 248,335 272,325 255,305"
            fill="#1c2b3e"
          />
          {/* Lower Thigh towards Rigel */}
          <polygon
            points="248,335 278,330 284,336 268,355 255,350"
            fill="#2a3c54"
          />
          {/* Knee Apex Plate (Rigel star joint) */}
          <polygon
            points="278,330 284,336 275,355 266,350"
            fill="#324764"
          />
          {/* Bent Calf / Upper Shin angling down-left */}
          <polygon
            points="268,355 284,336 298,385 280,405 265,385"
            fill="#213146"
          />
          {/* Shin Ridge Highlight */}
          <polygon
            points="280,350 284,336 295,385 288,388"
            fill="#304461"
          />
          {/* Lower Shin to Ankle */}
          <polygon
            points="280,405 298,385 278,435 255,442 260,415"
            fill="#182537"
          />
          {/* Poised Stepping Foot (flexed in mid-air over Lepus) */}
          <polygon
            points="255,442 278,435 275,455 248,465 226,485 238,470"
            fill="#121c2a"
            stroke="#213247"
            strokeWidth="0.8"
          />
        </g>

        {/* ============================================================== */}
        {/* 4. INTERNAL CONTOUR HIGHLIGHTS (SUBTLE CELESTIAL EDGES)        */}
        {/* ============================================================== */}
        <g className="orion-highlights-contours" aria-hidden="true">
          {/* Raised Arm Highlight */}
          <line x1="45" y1="105" x2="50" y2="140" stroke="#364e6f" strokeWidth="0.9" opacity="0.6" />
          <line x1="63" y1="142" x2="104" y2="175" stroke="#2d425f" strokeWidth="0.8" opacity="0.5" />
          {/* Helmet Visor Brow Line */}
          <line x1="168" y1="104" x2="206" y2="116" stroke="#48648c" strokeWidth="1" opacity="0.75" />
          {/* Shield Outer Edge Highlight */}
          <path
            d="M 273 80 L 297 71 L 320 80 L 340 107"
            fill="none"
            stroke="#3b5478"
            strokeWidth="0.9"
            opacity="0.65"
          />
          {/* Rigel Knee Apex Highlight */}
          <line x1="278" y1="330" x2="284" y2="336" stroke="#52749e" strokeWidth="1.2" opacity="0.85" />
          {/* Standing Shin Crest Line */}
          <line x1="188" y1="384" x2="182" y2="445" stroke="#374f70" strokeWidth="0.9" opacity="0.55" />
        </g>

        {/* ============================================================== */}
        {/* 5. CRISP CONSTELLATION CONNECTING LINES (1PX STARLIGHT)        */}
        {/* ============================================================== */}
        <g className="orion-constellation-lines" filter={`url(#${lineGlowId})`} aria-hidden="true">
          {/* Torso & Shoulder Hexagon/Hourglass */}
          <line x1="124" y1="209" x2="203" y2="193" className="orion-astro-line" />
          <line x1="124" y1="209" x2="205" y2="268" className="orion-astro-line" />
          <line x1="203" y1="193" x2="205" y2="268" className="orion-astro-line" />

          {/* The Belt of Orion (Alnitak -> Alnilam -> Mintaka) */}
          <line x1="187" y1="275" x2="205" y2="268" className="orion-belt-line" />
          <line x1="205" y1="268" x2="218" y2="260" className="orion-belt-line" />

          {/* Lower Body (Belt to Knees) */}
          <line x1="205" y1="268" x2="201" y2="384" className="orion-astro-line" />
          <line x1="205" y1="268" x2="280" y2="332" className="orion-astro-line" />
          <line x1="201" y1="384" x2="280" y2="332" className="orion-astro-line" />

          {/* Raised Arm & Sword Lines */}
          <line x1="124" y1="209" x2="63" y2="142" className="orion-astro-line" />
          <line x1="63" y1="142" x2="52" y2="79" className="orion-astro-line" />
          <line x1="124" y1="209" x2="74" y2="168" className="orion-astro-line" opacity="0.5" />
          <line x1="56" y1="75" x2="208" y2="42" className="orion-sword-astro-line" opacity="0.65" />

          {/* Shield Arm Line */}
          <line x1="203" y1="193" x2="291" y2="153" className="orion-astro-line" />
        </g>

        {/* ============================================================== */}
        {/* 6. DIFFRACTION SPIKES & FLARES (AUTHENTIC 4-POINT CROSS)       */}
        {/* ============================================================== */}
        <g className="orion-diffraction-spikes" aria-hidden="true">
          {/* Betelgeuse Amber Flare Cross */}
          <g className="orion-spike-shimmer">
            <line x1="104" y1="209" x2="144" y2="209" stroke="#fcd34d" strokeWidth="1.1" opacity="0.85" />
            <line x1="124" y1="189" x2="124" y2="229" stroke="#fcd34d" strokeWidth="1.1" opacity="0.85" />
            <line x1="112" y1="209" x2="136" y2="209" stroke="#fffbeb" strokeWidth="1.6" opacity="0.95" />
            <line x1="124" y1="197" x2="124" y2="221" stroke="#fffbeb" strokeWidth="1.6" opacity="0.95" />
          </g>

          {/* Rigel Brilliant Cyan-White Flare Cross */}
          <g className="orion-spike-shimmer">
            <line x1="258" y1="332" x2="302" y2="332" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.9" />
            <line x1="280" y1="310" x2="280" y2="354" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.9" />
            <line x1="267" y1="332" x2="293" y2="332" stroke="#ffffff" strokeWidth="1.8" opacity="0.98" />
            <line x1="280" y1="319" x2="280" y2="345" stroke="#ffffff" strokeWidth="1.8" opacity="0.98" />
          </g>

          {/* Alnilam Center Belt Star Spike */}
          <g className="orion-spike-shimmer">
            <line x1="192" y1="268" x2="218" y2="268" stroke="#bae6fd" strokeWidth="0.9" opacity="0.75" />
            <line x1="205" y1="255" x2="205" y2="281" stroke="#bae6fd" strokeWidth="0.9" opacity="0.75" />
          </g>

          {/* Bellatrix Spike */}
          <g className="orion-spike-shimmer">
            <line x1="192" y1="193" x2="214" y2="193" stroke="#bfdbfe" strokeWidth="0.85" opacity="0.7" />
            <line x1="203" y1="182" x2="203" y2="204" stroke="#bfdbfe" strokeWidth="0.85" opacity="0.7" />
          </g>

          {/* Saiph Spike */}
          <g className="orion-spike-shimmer">
            <line x1="191" y1="384" x2="211" y2="384" stroke="#bfdbfe" strokeWidth="0.85" opacity="0.7" />
            <line x1="201" y1="374" x2="201" y2="394" stroke="#bfdbfe" strokeWidth="0.85" opacity="0.7" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* 7. CONSTELLATION STARS & HALOS                                 */}
        {/* ============================================================== */}
        <g className="orion-stars" aria-hidden="true">
          {/* Betelgeuse (Alpha Orionis) */}
          <g className="orion-star-betelgeuse">
            <circle cx="124" cy="209" r="16" fill={`url(#${betelgeuseCoronaId})`} className="orion-supergiant-glow" />
            <circle cx="124" cy="209" r="4.2" fill="#F59E0B" />
            <circle cx="124" cy="209" r="2.2" fill="#FFF7ED" className="orion-supergiant-core" />
          </g>

          {/* Bellatrix (Gamma Orionis) */}
          <g className="orion-star-bellatrix">
            <circle cx="203" cy="193" r="10" fill={`url(#${blueStarCoronaId})`} opacity="0.8" />
            <circle cx="203" cy="193" r="3.2" fill="#BAE6FD" />
            <circle cx="203" cy="193" r="1.8" fill="#FFFFFF" />
          </g>

          {/* The Belt Stars */}
          {/* Alnitak (Zeta Orionis) */}
          <g className="orion-star-alnitak">
            <circle cx="187" cy="275" r="7" fill={`url(#${blueStarCoronaId})`} opacity="0.65" />
            <circle cx="187" cy="275" r="2.8" fill="#CBD5E1" />
            <circle cx="187" cy="275" r="1.6" fill="#FFFFFF" />
          </g>

          {/* Alnilam (Epsilon Orionis) */}
          <g className="orion-star-alnilam">
            <circle cx="205" cy="268" r="12" fill={`url(#${alnilamCoronaId})`} className="orion-supergiant-glow" />
            <circle cx="205" cy="268" r="3.4" fill="#BFDBFE" />
            <circle cx="205" cy="268" r="2.0" fill="#FFFFFF" />
          </g>

          {/* Mintaka (Delta Orionis) */}
          <g className="orion-star-mintaka">
            <circle cx="218" cy="260" r="7" fill={`url(#${blueStarCoronaId})`} opacity="0.65" />
            <circle cx="218" cy="260" r="2.8" fill="#CBD5E1" />
            <circle cx="218" cy="260" r="1.6" fill="#FFFFFF" />
          </g>

          {/* Saiph (Kappa Orionis) */}
          <g className="orion-star-saiph">
            <circle cx="201" cy="384" r="11" fill={`url(#${blueStarCoronaId})`} opacity="0.8" />
            <circle cx="201" cy="384" r="3.2" fill="#BAE6FD" />
            <circle cx="201" cy="384" r="1.8" fill="#FFFFFF" />
          </g>

          {/* Rigel (Beta Orionis) */}
          <g className="orion-star-rigel">
            <circle cx="280" cy="332" r="18" fill={`url(#${rigelCoronaId})`} className="orion-supergiant-glow" />
            <circle cx="280" cy="332" r="4.6" fill="#38BDF8" />
            <circle cx="280" cy="332" r="2.4" fill="#FFFFFF" className="orion-supergiant-core" />
          </g>

          {/* Weapon / Limb Anchor Stars */}
          <circle cx="52" cy="79" r="2.2" fill="#E2E8F0" opacity="0.9" />
          <circle cx="63" cy="142" r="2.0" fill="#CBD5E1" opacity="0.8" />
          <circle cx="291" cy="153" r="2.2" fill="#E2E8F0" opacity="0.9" />
        </g>

        {/* ============================================================== */}
        {/* 8. CELESTIAL TYPOGRAPHY & STAR LABELS                          */}
        {/* ============================================================== */}
        {showLabels && (
          <g className="orion-labels" aria-hidden="true">
            {/* Prominent Constellation Title */}
            <text
              x="185"
              y="246"
              textAnchor="middle"
              className="orion-title-label"
            >
              ORION
            </text>

            {/* Betelgeuse */}
            <text
              x="115"
              y="230"
              textAnchor="end"
              className="orion-label orion-label-prominent"
            >
              Betelgeuse
            </text>

            {/* Bellatrix */}
            <text
              x="203"
              y="213"
              textAnchor="middle"
              className="orion-label orion-label-prominent"
            >
              Bellatrix
            </text>

            {/* Alnilam */}
            <text
              x="205"
              y="286"
              textAnchor="middle"
              className="orion-label orion-label-belt"
            >
              Alnilam
            </text>

            {/* Rigel */}
            <text
              x="280"
              y="348"
              textAnchor="middle"
              className="orion-label orion-label-prominent"
            >
              Rigel
            </text>

            {/* Saiph */}
            <text
              x="201"
              y="398"
              textAnchor="middle"
              className="orion-label"
            >
              Saiph
            </text>

            {/* Lepus */}
            <text
              x="255"
              y="452"
              textAnchor="middle"
              className="orion-label orion-label-faint"
            >
              LEPUS
            </text>

            {/* Canis Major Stars: Murzim & Sirius */}
            <text
              x="148"
              y="504"
              textAnchor="middle"
              className="orion-label orion-label-faint"
            >
              Murzim
            </text>
            <text
              x="88"
              y="514"
              textAnchor="middle"
              className="orion-label orion-label-faint"
            >
              Sirius
            </text>
          </g>
        )}
      </svg>

      {/* Astronomical Telemetry Caption */}
      <div className="orion-telemetry-tag" aria-hidden="true">
        <span className="orion-telemetry-item">RA 05h 35m &bull; Dec +09&deg; 56&prime;</span>
        <span className="orion-telemetry-item">Star Walk Reference &bull; Exact 2D Vector Geometry</span>
      </div>
    </div>
  );
};
