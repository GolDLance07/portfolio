/**
 * The Observatory &mdash; Shared Cinematic Scroll & Transition Configuration
 *
 * Defines the substantial, cinematic travel distances allocated to each inter-scene
 * cosmic corridor within the Celestial Dome stage.
 */

export interface SceneTransitionSpec {
  id: string;
  fromScene: string;
  toScene: string;
  name: string;
  desktopMultiplier: number; // Multiplier of window.innerHeight for desktop (>768px)
  mobileMultiplier: number; // Multiplier of window.innerHeight for mobile (<=768px)
}

export interface TransitionSystemConfig {
  // Corridors connecting the 6 scenes
  corridors: [
    SceneTransitionSpec, // Observatory -> Horizon
    SceneTransitionSpec, // Horizon -> Constellations
    SceneTransitionSpec, // Constellations -> Celestial Archive
    SceneTransitionSpec, // Celestial Archive -> The Next Frontier
    SceneTransitionSpec // The Next Frontier -> The Signal
  ];
  // Pacing phase proportions (normalized 0.0 to 1.0 along each corridor)
  pacing: {
    // Settled exploration window: scene is resting at y=0, opacity 1, interactive
    settledRange: number;
    // Departure span: scene glides down beneath horizon and fades out
    departureSpan: number;
    // Arrival span: next scene ascends from depth into settled view
    arrivalSpan: number;
  };
  // Damping coefficient for requestAnimationFrame interpolation
  scrollDamping: number;
}

export const TRANSITION_CONFIG: TransitionSystemConfig = {
  corridors: [
    {
      id: 'corridor-01-02',
      fromScene: 'home',
      toScene: 'about',
      name: 'Observatory to Horizon',
      desktopMultiplier: 4.3,
      mobileMultiplier: 3.2,
    },
    {
      id: 'corridor-02-03',
      fromScene: 'about',
      toScene: 'skills',
      name: 'Horizon to Constellations',
      desktopMultiplier: 4.3,
      mobileMultiplier: 3.2,
    },
    {
      id: 'corridor-03-04',
      fromScene: 'skills',
      toScene: 'projects',
      name: 'Constellations to Celestial Archive',
      desktopMultiplier: 5.25,
      mobileMultiplier: 3.8,
    },
    {
      id: 'corridor-04-05',
      fromScene: 'projects',
      toScene: 'frontier',
      name: 'Celestial Archive to The Next Frontier',
      desktopMultiplier: 4.5,
      mobileMultiplier: 3.3,
    },
    {
      id: 'corridor-05-06',
      fromScene: 'frontier',
      toScene: 'contact',
      name: 'The Next Frontier to The Signal',
      desktopMultiplier: 4.3,
      mobileMultiplier: 3.2,
    },
  ],
  pacing: {
    settledRange: 0.18,
    departureSpan: 0.28,
    arrivalSpan: 0.28,
  },
  scrollDamping: 0.18,
};

