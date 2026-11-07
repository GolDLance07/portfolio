# The Observatory --- Implementation Specification

## Goal

Implement a polished responsive portfolio according to `DESIGN.md`.
First build a faithful working hero; then add scenes incrementally. Do
not attempt all features in one pass.

## Stack

React, Vite, TypeScript, Anime.js, SVG/CSS illustration, React Router
for project detail routes if needed, Lucide React for icons. Use
organized CSS or CSS modules consistently. Do not add Three.js, a
backend, CMS, or extra animation libraries without a concrete need.

## Principles

1.  Read `DESIGN.md` first.
2.  Inspect the existing repository before changing it; preserve its
    setup.
3.  Separate artwork, content data, layout, and animation.
4.  Use reusable components only where they have real responsibilities.
5.  Use semantic and accessible HTML.
6.  Content is editable typed data.
7.  Use only supplied/verified project details and links; do not invent
    outcomes.
8.  Keep each milestone runnable and verify before continuing.
9.  Normal scrolling only; no scroll hijack.
10. Test desktop, tablet, and mobile.

## Suggested structure

``` text
src/
  components/
    SceneNavigation.tsx
    SceneShell.tsx
    ParallaxLayer.tsx
    CelestialObject.tsx
    ProjectSelector.tsx
    FeaturedProjectPanel.tsx
  scenes/
    ObservatoryScene.tsx
    HorizonScene.tsx
    ConstellationsScene.tsx
    ArchiveScene.tsx
    SignalScene.tsx
  projects/
    projectData.ts
    ProjectDetail.tsx
  hooks/
    useReducedMotion.ts
    useActiveScene.ts
  animations/
    sceneAnimations.ts
  styles/
    tokens.css
    global.css
    scenes.css
  App.tsx
  main.tsx
```

Do not create empty files just to match this tree.

## Milestones

### 0 --- Inspect and scaffold

Inspect repository. If empty, scaffold React + Vite + TypeScript.
Install only needed packages. Confirm dev server/build.

### 1 --- Hero (first deliverable)

Build only hero: - Twilight gradient and starfield. - Independent
SVG/CSS layers for distant sky, moon/nebula, mountains, foreground,
small observatory. - Hero copy, CTA, scroll cue, top navigation. - Other
nav links may target planned anchors, but do not pretend unbuilt scenes
are complete. - Responsive layout and reduced-motion fallback. - Gentle
entry and parallax via Anime.js without scroll hijack. - Ensure artwork
never obscures text. Do not use a flattened screenshot as the website;
implement actual layered elements.

### 2 --- Scene framework and About

Add five scene containers with stable IDs, active-scene detection and
working nav; implement About content.

### 3 --- Skills constellation

Add typed skill group data, selected/focused state,
pointer/keyboard/touch support. No unverified claims.

### 4 --- Celestial Archive

Add typed project data, selectable objects, featured panel, accessible
selector/list, project detail route/view. Keep selection motion short.
Only verified content/links.

### 5 --- Contact

Add supplied real contact links. Keep scene quieter.

### 6 --- Quality

Responsive/cross-browser checks, keyboard/focus, reduced motion,
optimize SVG/media, console and build checks, README with
setup/scripts/architecture/deployment.

## Motion requirements

Anime.js is primary orchestrator. Avoid CSS and Anime.js competing for
the same element/property. Prefer transforms/opacity. Honor reduced
motion: no parallax or autoplay decorative motion; show content
immediately. Reduce parallax on touch/mobile. No scroll locking/snap.
Clean up animations/listeners on unmount.

## Project data fields

Suggested: `id`, `name`, `category`, `summary`, `description`,
`technologies`, `problem`, `implementation`, `challenges`, optional
verified `outcomes`, optional `githubUrl`, `liveUrl`, and visual-only
`visualVariant`. Keep facts separate from visuals.

## Quality gates

At each milestone: run app, inspect console/terminal, run TS/build/lint
checks available, verify navigation/interactions, test narrow viewport.
Report files changed, decisions, actual checks and results, and known
gaps. Never claim a check passed if not run.

## Definition of done

Five scenes usable; projects selectable and explorable; real project
data/links; responsive layout; reduced-motion and keyboard support; no
major build/console errors; README documents setup/deployment.
