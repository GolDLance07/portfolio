# The Observatory &mdash; Personal Developer Portfolio

> Personal developer portfolio of **Lance** &mdash; *Building systems. Exploring intelligence.*

---

## Architecture & Visual Direction

"The Observatory" is an illustrated, celestial developer portfolio designed as a sequence of five atmospheric scenes. Rather than a generic portfolio with a space wallpaper, it is built as a coherent little world with layered 2D vector artwork, typography, and motion orchestrated with Anime.js.

### Color Tokens
- `--color-twilight` (`#17152F`): Deep twilight sky and primary backdrop
- `--color-nebula` (`#302B59`): Atmospheric scene depth and panels
- `--color-violet` (`#7774C8`): Secondary celestial accents
- `--color-moonlight` (`#C8B9F0`): Astronomical highlights and metadata
- `--color-starlight` (`#E9E4F5`): High-contrast editorial text
- `--color-pink` (`#F2A9C8`): Interactive highlights and call-to-actions
- `--color-muted` (`#AAA5C7`): Secondary body typography

---

## Current Milestone

### &check; Milestone 0: Scaffold & Architecture
- React 19 + Vite 6 + TypeScript 5.7
- Anime.js 3.2 + Lucide React
- CSS variables design tokens (`tokens.css`, `global.css`)

### &check; Milestone 1: The Observatory (Hero Deliverable & Cosmic Sky Refinement)
- **High-Density Cosmic Sky Architecture**:
  - **High-DPI Procedural Starfield (Canvas)**: ~1,450 multi-tiered stars generated deterministically via PRNG with realistic spectral classifications (hot blue, blue-white, starlight white, warm starlight, dusty rose, lavender).
  - **Depth Stratification**: 3 distinct star tiers (faint background micro-stars, midground luminous stars, foreground bright stars with radial halo glow).
  - **Cosmic Density Corridor**: Natural galactic clustering and stellar nursery grouping along the diagonal celestial axis.
  - **Multilayered Vector Nebula (SVG)**:
    - *Left & Lower*: Deep midnight indigo and dusty cerulean blue gas decks (`#101735`, `#2E447C`, `#4A6BAE`).
    - *Center & Right*: Radiant amethyst violet and dusty pink cloud formations (`#6C3E9C`, `#8A4FB8`, `#E27BAE`, `#F2A9C8`).
    - *Interstellar Dust Lanes*: Organic dark absorption rifts (`#04020A`) separating clouds for astronomical depth.
  - **Hero Optical Stars**: 9 prominent luminary stars with 4-point tapered diamond diffraction spikes, 45° secondary micro-spikes, and soft corona glow.
  - **Atmospheric Scrim**: Dual-layer radial & linear vignette shielding Lance's editorial copy for contrast.
- **Layered 2D/Vector Artwork**:
  - Layer 0: Cosmic Sky (Canvas Starfield + SVG Nebula + Hero Diffraction Stars).
  - Layer 1: Celestial crescent moon with atmospheric corona glow and orbital ring fragment.
  - Layer 2: Distant atmospheric mountain ridge.
  - Layer 3: Midground mountain ridge holding the small, distant vector Observatory dome, rotating telescope rig, lit observation window, and antenna beacon.
  - Layer 4: Deep foreground silhouette ridge grounding the scene.
- **Editorial Hero Typography**:
  - Eyebrow: `HELLO, I'M` with ground station tag
  - Name: `LANCE` (DM Serif Display)
  - Headline: `Building systems. Exploring intelligence.`
  - Intro: `I'm a developer interested in backend engineering, system design, and building intelligent applications.`
  - Supporting line: `I turn ideas into systems worth exploring.`
  - CTAs: `Explore my work` & `About me`
  - Scroll cue: `SCROLL TO EXPLORE`
- **Motion & Accessibility**:
  - Staggered Anime.js entrance animation on mount.
  - Smooth RAF-interpolated parallax on scroll and subtle mouse pointer tracking on desktop across independent visual planes.
  - Restrained telescope rotation tracking cursor azimuth.
  - Full `prefers-reduced-motion` compliance (motion disabled, immediate static rendering).
  - Compact persistent navigation with active scene pip and graceful status handling for unbuilt scenes.

### &check; Milestone 2: The Horizon (About & Philosophy)
- **Panoramic Twilight Landscape (SVG & CSS)**:
  - Upper sky: deep midnight indigo passing through muted violet down to a glowing dusty pink horizon glow.
  - Restrained connecting stars linking Scene 02 to Scene 01's cosmic sky.
  - Multi-plane landscape: distant sweeping mountain range silhouette, midground plateau with an expedition telemetry mast, and foreground dusk contours.
  - Horizon glow breathing animation and subtle scroll-driven parallax.
- **Integrated Developer Introduction & Philosophy**:
  - **Introduction**: Editorial title `Beyond the Horizon`, station coordinates `AZIMUTH 142°`, and core lead statement.
  - **Personal Journey**: Narrative columns (*Curiosity as an Engine*, *Systems & Architecture*) focusing on technology interest, system design, and disciplined problem-solving without fabricated facts.
  - **Development Philosophy**: Typographic composition highlighting 4 foundational principles (*Understand the problem before writing code*, *Build with intention*, *Learn by experimenting*, *Prefer meaningful solutions over unnecessary complexity*).
  - **Telemetry Bar**: Subtle journey status marker anchoring the scene.
- **Navigation & Active Scene Tracking**:
  - `useActiveScene` hook dynamically monitors scene viewports with `IntersectionObserver` to highlight the active navigation item (`01 Home` vs `02 About`).
  - `02 About` navigation link enabled with direct smooth scrolling.
- **Accessibility & Motion**:
  - Staggered Anime.js entrance on scroll into view.
  - Full `prefers-reduced-motion` static fallback.

### &check; Milestone 2.5: Celestial Dome Projection & Scroll-Responsive Star Streaks
- **Celestial Dome Representation (`CelestialDome.tsx`)**:
  - Models the heavens as a 3D celestial sphere ($S^2$) populated by 1,800 stars distributed uniformly via the Fibonacci spiral algorithm.
  - As the user scrolls, a 3D orthogonal rotation matrix rotates the entire celestial sphere along 3 axes: **Pitch** ($\sim 47^\circ$ overhead arc), **Yaw** ($\sim 25^\circ$ sidereal drift), and **Roll** ($\sim 12.6^\circ$ axial inclination).
  - Every star travels along its mathematically exact spherical orbit across the curved dome of the sky.
- **Scroll-Responsive Star Streaks (Hyperspace Acceleration)**:
  - **Velocity Tracking**: Instantaneous scroll velocity ($\Delta p / \Delta t$) is smoothed with an exponential moving average ($0.32$ tracking factor) and organic exponential decay ($0.88$ decay factor).
  - **Projected Direction Vector**: For each star, the engine projects its head at current orientation $R(p)$ and its tail at $R(p - \text{streakOffset})$. The resulting screen-space vector follows the exact curvature and perspective of the rotating dome.
  - **Dynamic Elongation & Contraction**: At rest, stars are sharp points. As scroll accelerates, stars stretch into radiant line segments matching their spectral hues; upon stopping, streaks smoothly contract back into points within ~300ms.
  - **Reversibility**: Reverse scrolling inverts the velocity vector, causing streaks to point along the reversed trajectory.
- **Stereographic / Perspective Dome Projection**:
  - Stars are projected from 3D unit coordinates $(x, y, z)$ onto the 2D canvas using a virtual camera positioned at $(0, 0, 0)$ gazing into the dome.
  - Optical depth divisor $\frac{1}{z + d}$ imparts natural dome curvature: stars near the zenith trace sweeping circular paths, while stars near the horizon curve along bowed arcs.
- **Continuous Landscape & Horizon Transition**:
  - The Celestial Dome is the **shared, continuous sky** underpinning both scenes.
  - **Scene 01 (Observatory)**: The mountain ridge and observatory dome slide smoothly downward beneath the horizon line ($y: 0 \rightarrow +55\text{vh}$).
  - **Sky Atmosphere Shift**: The lower sky's atmospheric gradient shifts from deep twilight indigo to the radiant dawn-rose glow of the horizon.
  - **Scene 02 (Horizon)**: The vast panoramic mountains and plateau rise up from below the horizon to anchor the new scene.
- **Cinematic Performance Architecture (Zero-Lag 60 FPS)**:
  - **Decoupled Scroll Input & Single Unified RAF Loop**: Scroll events merely record target positions (`targetScrollYRef.current = window.scrollY`); a single critically damped animation loop smoothly tracks targets at 60fps, eliminating wheel-step jitter.
  - **Zero Layout Thrashing**: Removed all synchronous layout reads (`getBoundingClientRect()`) during scroll; stage geometry is cached on mount and window resize.
  - **Zero React State Updates on Scroll**: Animation progress, transitions, and settled states are managed through mutable refs and direct DOM class toggles, completely bypassing React virtual DOM re-renders during motion.
  - **Off-Screen Canvas Sprite Caching**: Pre-rendered nebula clouds, radial star glow textures, and horizon gradient beams onto off-screen canvases once, eliminating hundreds of per-frame `ctx.createRadialGradient` allocations.
  - **Partitioned Batched Starfield Rendering**: Partitioned 1,800 stars into background buckets by spectral color and prominent hero stars, collapsing draw calls from 3,600+ individual calls down to 6 batched passes.
  - **DPR Capping**: Capped `devicePixelRatio` at 1.5, cutting GPU rasterization fillrate by over 40% on 4K and Retina displays.
  - **Loop De-confliction**: Silenced competing sub-scene scroll listeners and parallax loops in `ObservatoryScene` and `HorizonScene` when embedded in the stage.
- **Accessibility (`prefers-reduced-motion`)**:
  - Automatically disables star streaking and dome rotation, providing a static, gentle crossfade.

---

### &check; Milestone 3: Complete The Observatory Scenes (5-Scene Experience)
- **Scene 03: The Constellations (Technical Skills & Architectures)**:
  - Technical skills mapped as celestial constellations across deep indigo space.
  - Interactive constellation selector (`Development`, `Backend & Systems`, `Data & AI`, `Tools & Infrastructure`).
  - Geometric SVG sky map with delicate dashed constellation lines and glowing star nodes (`α-Py`, `β-Cpp`, etc.).
  - Structured, editable configuration (`src/data/skills.ts`) with zero arbitrary skill percentages.
  - Accessible tablist / keyboard arrow navigation and mobile-responsive layout.
- **Scene 04: The Celestial Archive (Projects & Artifacts)**:
  - Projects modeled as distinct celestial artifacts in cosmic orbit:
    - *Featureforge*: Radiant stellar pulsar with intersecting planetary processing rings.
    - *Dropzone*: Dual-ringed telemetry relay station with orbital communication nodes.
    - *NetShield*: Crystalline deep-space telemetry probe with phased radar arcs.
  - Interactive selection highlights the celestial artifact and updates the featured project detail panel.
  - Structured, editable project configuration (`src/data/projects.ts`) with tech stacks and GitHub links.
  - Accessible keyboard selection and vertical mobile layout.
- **Scene 05: The Signal (Transmission & Contact)**:
  - Quieter, intimate midnight transmission environment with central atmospheric glow and subtle harmonic broadcast rings.
  - Editable communication channels (`src/data/contact.ts`): Direct frequency (email with copy-to-clipboard), GitHub station, and LinkedIn relay.
  - Accessible frontend transmission form with client-side validation, error handling, and honest status feedback (no fake backend).
- **Unified 5-Scene Depth Transition System (`CinematicStage.tsx`)**:
  - The continuous `CelestialDome` seamlessly spans all 5 scenes:
    $$\text{Observatory} \rightarrow \text{Horizon} \rightarrow \text{Constellations} \rightarrow \text{Celestial Archive} \rightarrow \text{The Signal}$$
  - **Substantially Extended Cinematic Pacing (`src/config/transitions.ts`)**:
    - Centralized shared transition configuration allocating $4.3\times$ to $5.25\times$ viewport height per inter-scene corridor (~3,800px to ~4,700px on desktop), representing a $2.5\times$ to $2.8\times$ expansion over baseline.
    - Features a dedicated **Deep Celestial Transit Window** ($d \in [0.46, 0.54]$) where foreground planes are completely clear, allowing the 3D celestial sphere rotation and velocity star streaks to be experienced as an interstellar voyage.
    - Star-streak sensitivity in `CelestialDome.tsx` tuned proportionally so hyperspace lines trigger with immediate, tactile responsiveness during wheel and trackpad scroll.
  - **Cinematic Navigation Scroll Controller (`src/utils/smoothScroll.ts`)**:
    - Replaced the browser's 300–400ms rushed `scrollIntoView` with a gradual, easing-driven (`easeInOutCubic`) RAF controller.
    - Transitions between adjacent scenes unfold deliberately over **~2.0 to 2.1 seconds**, giving the user ample time to observe the celestial dome rotate overhead and watch velocity star streaks stretch across the deep space transit.
    - Sub-linear square-root duration scaling ($\approx 1200 + \sqrt{D} \times 13\,\text{ms}$) scales multi-scene journeys up to ~2.8s without dragging.
    - Graceful interruption handling: manual wheel, touch gestures, or arrow keys cancel the programmatic transition immediately with zero scroll jumps.
    - Full `prefers-reduced-motion` compliance (immediate zero-latency navigation).
  - Full reverse scrolling support, critically damped RAF physics, and velocity-responsive star streaks throughout the entire journey.
  - Native anchor markers (`#home`, `#about`, `#skills`, `#projects`, `#contact`) enabling instant or smooth navigation across all 5 scenes.

---

## Roadmap

- [x] **Milestone 0**: Scaffold repository & install core packages
- [x] **Milestone 1**: Hero scene & cosmic sky refinement
- [x] **Milestone 2**: The Horizon (About scene & active scene tracking)
- [x] **Milestone 2.5**: Cinematic scroll system & performance optimization
- [x] **Milestone 3**: Complete Observatory scenes (Constellations, Celestial Archive, Signal)
- [ ] **Milestone 4**: Advanced interactive orbital simulations & deeper archive inspection
- [ ] **Milestone 5**: Production polish, lighthouse audit & deployment

---

## Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run TypeScript type check and production build
npm run build

# Preview production build locally
npm run preview
```

