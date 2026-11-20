import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CameraState {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  fov: number;
  roll: number;
}

export interface PointerState {
  x: number; // Normalized -1 to +1
  y: number; // Normalized -1 to +1
  screenX: number;
  screenY: number;
  vx: number;
  vy: number;
  speed: number;
  active: boolean;
}

export type SceneId = 'home' | 'about' | 'skills' | 'projects' | 'frontier' | 'contact';

export interface MotionState {
  scrollProgress: number; // 0.0 to 1.0
  scrollVelocity: number;
  activeScene: SceneId;
  sceneProgress: Record<SceneId, number>;
  camera: CameraState;
  pointer: PointerState;
  prefersReducedMotion: boolean;
  isTouch: boolean;
}

type MotionListener = (state: MotionState, dt: number) => void;

class MotionController {
  private state: MotionState = {
    scrollProgress: 0,
    scrollVelocity: 0,
    activeScene: 'home',
    sceneProgress: {
      home: 1,
      about: 0,
      skills: 0,
      projects: 0,
      frontier: 0,
      contact: 0,
    },
    camera: {
      x: 0,
      y: 0,
      z: 220,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      fov: 55,
      roll: 0,
    },
    pointer: {
      x: 0,
      y: 0,
      screenX: -9999,
      screenY: -9999,
      vx: 0,
      vy: 0,
      speed: 0,
      active: false,
    },
    prefersReducedMotion: false,
    isTouch: false,
  };

  private listeners: Set<MotionListener> = new Set();
  private prevScrollY: number = 0;
  private prevPointerX: number = 0;
  private prevPointerY: number = 0;
  private targetScrollY: number = 0;
  private currentSmoothY: number = 0;
  private isWheeling: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Detect environment capabilities
    this.state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.state.isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

    // Pointer tracking with velocity calculation
    let pointerTimeout: number | null = null;
    const onPointerMove = (e: MouseEvent) => {
      if (this.state.isTouch) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const normX = (e.clientX / w) * 2 - 1;
      const normY = -(e.clientY / h) * 2 + 1;

      const dx = e.clientX - this.prevPointerX;
      const dy = e.clientY - this.prevPointerY;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;

      const speed = Math.sqrt(dx * dx + dy * dy);

      this.state.pointer.x = normX;
      this.state.pointer.y = normY;
      this.state.pointer.screenX = e.clientX;
      this.state.pointer.screenY = e.clientY;
      this.state.pointer.vx = dx;
      this.state.pointer.vy = dy;
      this.state.pointer.speed = speed;
      this.state.pointer.active = true;

      if (pointerTimeout) window.clearTimeout(pointerTimeout);
      pointerTimeout = window.setTimeout(() => {
        this.state.pointer.vx = 0;
        this.state.pointer.vy = 0;
        this.state.pointer.speed = 0;
      }, 50);
    };

    const onPointerLeave = () => {
      this.state.pointer.active = false;
      this.state.pointer.speed = 0;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave, { passive: true });

    // Smooth scroll inertia integration for discrete mouse-wheel increments
    this.targetScrollY = window.scrollY;
    this.currentSmoothY = window.scrollY;

    const onWheel = (e: WheelEvent) => {
      if (this.state.prefersReducedMotion) return;

      // Trackpads emit frequent small/float deltaY; discrete mouse wheels emit stepped integers >= 40
      const isDiscreteWheel = Math.abs(e.deltaY) >= 40 && Number.isInteger(e.deltaY);

      if (isDiscreteWheel) {
        e.preventDefault();
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        // Weighted scroll delta with gradual acceleration
        this.targetScrollY = Math.max(0, Math.min(maxScroll, this.targetScrollY + e.deltaY * 0.95));
        this.isWheeling = true;
      } else {
        // Trackpad gesture: allow native smooth trackpad physics without interference
        this.targetScrollY = window.scrollY;
        this.currentSmoothY = window.scrollY;
        this.isWheeling = false;
      }
    };

    // User interruptions: immediate synchronization without locking
    const onUserInterrupt = () => {
      this.targetScrollY = window.scrollY;
      this.currentSmoothY = window.scrollY;
      this.isWheeling = false;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onUserInterrupt, { passive: true });
    window.addEventListener('touchmove', onUserInterrupt, { passive: true });
    window.addEventListener('mousedown', onUserInterrupt, { passive: true });
    window.addEventListener('keydown', onUserInterrupt, { passive: true });

    // Single unified GSAP Ticker loop
    gsap.ticker.add((_time, deltaTime) => {
      const dt = Math.max(0.001, Math.min(0.05, deltaTime / 1000));
      this.update(dt);
    });
  }

  private update(dt: number) {
    if (typeof window === 'undefined') return;

    // Apply smooth scroll inertia if active
    if (this.isWheeling && !this.state.prefersReducedMotion) {
      const diff = this.targetScrollY - this.currentSmoothY;
      if (Math.abs(diff) > 0.5) {
        // Controlled inertia damping (0.085): smooth acceleration and gradual deceleration
        this.currentSmoothY += diff * 0.085;
        window.scrollTo(0, this.currentSmoothY);
      } else {
        this.currentSmoothY = this.targetScrollY;
        this.isWheeling = false;
      }
    } else {
      this.currentSmoothY = window.scrollY;
      this.targetScrollY = window.scrollY;
    }

    // 1. Calculate Continuous Scroll Metrics
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollY = window.scrollY;
    const targetProgress = docH > 0 ? Math.max(0, Math.min(1, currentScrollY / docH)) : 0;

    const deltaScroll = currentScrollY - this.prevScrollY;
    this.prevScrollY = currentScrollY;
    const instantVelocity = deltaScroll / dt;

    // Smooth progress and velocity with heavier astronomical inertia
    this.state.scrollVelocity += (instantVelocity - this.state.scrollVelocity) * 0.08;
    this.state.scrollProgress += (targetProgress - this.state.scrollProgress) * 0.075;

    // Dampen pointer velocity decay
    this.state.pointer.vx *= 0.92;
    this.state.pointer.vy *= 0.92;
    this.state.pointer.speed *= 0.92;

    // 2. Camera Spatial Choreography based on Scroll Progress
    this.computeCameraTrajectory();

    // 3. Notify Listeners
    for (const listener of this.listeners) {
      listener(this.state, dt);
    }
  }

  /**
   * Spatial Camera Trajectory Model:
   * Maps continuous document journey to genuine 3D coordinates.
   * Creates the sensation of forward spaceflight rather than flat page scrolling.
   */
  private computeCameraTrajectory() {
    const p = this.state.scrollProgress;

    // Scene 01 (Home: 0.0 - 0.18):
    // Vantage point outside the observatory, looking at Earth's horizon & sky.
    // Scene 02 (Horizon / Orion: 0.18 - 0.38):
    // Push forward into space (+Z to -Z travel), orienting toward Orion (RA 05h, Dec +09°).
    // Scene 03 (Constellations: 0.38 - 0.58):
    // Lateral pan and orbital alignment with the skill stars.
    // Scene 04 (Archive / Projects: 0.58 - 0.78):
    // Deep spatial corridor exploring project artifacts.
    // Scene 05 (The Next Frontier: 0.78 - 0.92):
    // Ascending orbital trajectory toward future horizons.
    // Scene 06 (Signal: 0.92 - 1.0):
    // Deep array orientation listening for incoming and outgoing signals.

    const target = this.state.camera;

    if (p < 0.20) {
      // Scene 01 -> Scene 02 Transition
      const t = p / 0.20;
      target.x = gsap.utils.interpolate(0, 35, t);
      target.y = gsap.utils.interpolate(0, -15, t);
      target.z = gsap.utils.interpolate(220, 90, t); // Pushes 130 units forward into space
      target.targetX = gsap.utils.interpolate(0, 18, t);
      target.targetY = gsap.utils.interpolate(0, 12, t);
      target.targetZ = gsap.utils.interpolate(0, -100, t);
      target.roll = gsap.utils.interpolate(0, -0.04, t);
    } else if (p < 0.40) {
      // Scene 02 -> Scene 03 Transition
      const t = (p - 0.20) / 0.20;
      target.x = gsap.utils.interpolate(35, -40, t);
      target.y = gsap.utils.interpolate(-15, 20, t);
      target.z = gsap.utils.interpolate(90, -40, t);
      target.targetX = gsap.utils.interpolate(18, -25, t);
      target.targetY = gsap.utils.interpolate(12, 0, t);
      target.targetZ = gsap.utils.interpolate(-100, -200, t);
      target.roll = gsap.utils.interpolate(-0.04, 0.05, t);
    } else if (p < 0.60) {
      // Scene 03 -> Scene 04 Transition
      const t = (p - 0.40) / 0.20;
      target.x = gsap.utils.interpolate(-40, 20, t);
      target.y = gsap.utils.interpolate(20, -10, t);
      target.z = gsap.utils.interpolate(-40, -160, t);
      target.targetX = gsap.utils.interpolate(-25, 10, t);
      target.targetY = gsap.utils.interpolate(0, 5, t);
      target.targetZ = gsap.utils.interpolate(-200, -320, t);
      target.roll = gsap.utils.interpolate(0.05, -0.03, t);
    } else if (p < 0.80) {
      // Scene 04 -> Scene 05 Transition
      const t = (p - 0.60) / 0.20;
      target.x = gsap.utils.interpolate(20, -15, t);
      target.y = gsap.utils.interpolate(-10, 30, t);
      target.z = gsap.utils.interpolate(-160, -280, t);
      target.targetX = gsap.utils.interpolate(10, 0, t);
      target.targetY = gsap.utils.interpolate(5, 20, t);
      target.targetZ = gsap.utils.interpolate(-320, -450, t);
      target.roll = gsap.utils.interpolate(-0.03, 0.02, t);
    } else {
      // Scene 05 -> Scene 06 Transition
      const t = (p - 0.80) / 0.20;
      target.x = gsap.utils.interpolate(-15, 0, t);
      target.y = gsap.utils.interpolate(30, 0, t);
      target.z = gsap.utils.interpolate(-280, -380, t);
      target.targetX = gsap.utils.interpolate(0, 0, t);
      target.targetY = gsap.utils.interpolate(20, 0, t);
      target.targetZ = gsap.utils.interpolate(-450, -550, t);
      target.roll = gsap.utils.interpolate(0.02, 0, t);
    }
  }

  public subscribe(listener: MotionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): Readonly<MotionState> {
    return this.state;
  }

  public setActiveScene(scene: SceneId) {
    this.state.activeScene = scene;
  }
}

export const motionController = new MotionController();
