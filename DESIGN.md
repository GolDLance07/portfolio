# The Observatory --- Design Specification

## Vision

A personal developer portfolio experienced as a sequence of illustrated
celestial scenes. It should feel like exploring a coherent little
world---not a conventional portfolio with a space wallpaper. The
atmosphere earns attention; real projects and engineering details earn
trust.

## Locked direction

-   Palette: Twilight --- indigo, violet, dusty blue, pale pink,
    moonlight.
-   Navigation: five scene-based destinations.
-   Illustration: clean 2D/vector artwork.
-   Motion: balanced, atmospheric, purposeful.
-   Hero: vast starry sky, small observatory low on a distant ridge,
    prominent readable introduction.
-   No 3D engine by default. Use SVG/CSS layers.

## Color tokens

  Token                 Hex         Usage
  --------------------- ----------- -------------------------
  `--color-twilight`    `#17152F`   Main background
  `--color-nebula`      `#302B59`   Scene depth and panels
  `--color-violet`      `#7774C8`   Interactive accents
  `--color-moonlight`   `#C8B9F0`   Secondary highlights
  `--color-starlight`   `#E9E4F5`   Primary text
  `--color-pink`        `#F2A9C8`   CTA and selected states
  `--color-muted`       `#AAA5C7`   Secondary text

Twilight dominates. Pink is an accent, not a flood. Keep text contrast
readable and use a scrim/panel behind copy over busy artwork.

## Typography

Suggested: DM Serif Display for editorial headings, Inter for body/UI,
JetBrains Mono for technical metadata. Use fallbacks. Scene eyebrow
labels are compact uppercase with tracking; body copy has comfortable
line length.

## Global design

-   Full-bleed illustrated scenes; content constrained by a responsive
    max-width.
-   Compact persistent Observatory wordmark/navigation.
-   Scene destinations: `01 Home`, `02 About`, `03 Skills`,
    `04 Projects`, `05 Contact`.
-   Clearly indicate active scene.
-   Translucent dark panels, subtle borders, restrained blur.
-   Motifs: star marks, orbital lines, tiny labels---never clutter.
-   Maintain content hierarchy and accessibility.

## Scenes

### 01 --- The Observatory (Hero)

Large open sky; text at left/center-left; small observatory low on the
horizon, preferably toward the right; layered mountain ridge along
bottom; distant moon/planet and nebula. Copy (editable content): -
Eyebrow: `HELLO, I'M` - Name: `LANCE` - Headline:
`Building systems. Exploring intelligence.` - Intro:
`I'm a developer interested in backend engineering, system design, and building intelligent applications.` -
Supporting line: `I turn ideas into systems worth exploring.` - CTAs:
`Explore my work`, `About me` - Scroll cue: `SCROLL TO EXPLORE` Gentle
star twinkle and layered parallax. Optional small telescope pointer
response on pointer devices.

### 02 --- The Horizon (About)

Quiet landscape, generous negative space. Concise intro, education,
current focus, and limited personality. Do not fabricate biography.

### 03 --- The Constellations (Skills)

Navigable groups: Backend & APIs; Databases & System Design; AI / ML &
Data; Tools & Infrastructure. Selecting/focusing a group reveals
technologies and context. Skills are data-driven; do not claim
unconfirmed expertise.

### 04 --- The Celestial Archive (Projects)

Projects are selectable celestial objects in an orbital/constellation
composition. Include featured project panel and visible selector/list so
users do not rely on hover. Selection updates object focus and panel
(title, summary, category, stack, available links) with a short
restrained animation. Project detail view covers problem, what was
built, architecture/implementation, decisions/challenges, stack,
verified outcomes, GitHub/live links when supplied. Project data is
separate from artwork. Candidate records may include Featureforge,
Dropzone, FinLit, Bharat Infra Digital Twin, and SIH prototype; verify
descriptions and URLs before publishing. Never fabricate claims or
links.

### 05 --- The Signal (Contact)

Quieter horizon and beacon motif. Email, GitHub, LinkedIn, résumé only
when actual URLs/details are supplied.

## Interactions

-   Natural browser scrolling; never trap scroll or force scroll snap.
-   Scene navigation scrolls to anchors and supports direct scene links.
-   Keyboard accessible controls with visible focus.
-   Celestial objects support click/tap and keyboard; hover is
    enhancement.
-   Project detail routes support direct entry and browser back/forward
    if routing is used.
-   Buttons use restrained lift/tint/glow.
-   No custom cursor requirement, autoplay audio, or distracting
    particle explosions.

## Motion / Anime.js

Anime.js orchestrates motion. One owner per animated property; do not
let CSS and Anime.js fight over transforms. Suggested tuning: button
hover 150--220ms; object focus 200--300ms; text reveal 350--550ms; scene
transition 600--900ms; ambient twinkle slow and low amplitude. Prefer
transform/opacity. Motion must not delay content.

## Responsive

Desktop: full layered illustration and scene navigation. Tablet: reduce
offsets and sizes; prevent overlaps. Mobile: recompose rather than
merely scale; reduce parallax; disable pointer-follow; compact
navigation; provide project cards/list as well as celestial selectors.

## Accessibility and performance

Honor `prefers-reduced-motion` with calm/static mode. Keyboard support
and visible focus. Semantic headings/landmarks. Accessible names for
interactive celestial objects. Sufficient contrast; never use color
alone for state. Content remains if animation fails. Optimize
SVGs/assets; avoid excessive DOM stars; lazy-load noncritical media; use
`will-change` sparingly. No unnecessary canvas/WebGL.

## Design acceptance

-   Hero matches the direction: expansive twilight sky, readable
    left-side intro, small observatory low on horizon.
-   All five scenes share a coherent visual language.
-   Archive is distinctive and usable without hover.
-   Mobile is intentionally composed.
-   Reduced-motion mode remains attractive and functional.
-   No fake links or fabricated claims.
