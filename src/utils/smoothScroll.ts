/**
 * The Observatory &mdash; Cinematic Navigation Scroll Controller
 *
 * Provides controlled, gradual, easing-driven scrolling between scenes
 * when triggered by navigation clicks or CTA buttons, allowing the
 * celestial dome rotation and star-streak effect to unfold visibly.
 */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let activeRafId: number | null = null;
let isProgrammaticScrolling = false;
let originalScrollBehavior: string | null = null;

export function cancelSmoothScroll(): void {
  if (activeRafId !== null) {
    cancelAnimationFrame(activeRafId);
    activeRafId = null;
  }
  if (isProgrammaticScrolling) {
    isProgrammaticScrolling = false;
    if (typeof document !== 'undefined' && originalScrollBehavior !== null) {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
      originalScrollBehavior = null;
    }
  }
}

// User interruption detection: If the user touches the screen or scrolls the mouse wheel
// during a programmatic navigation transition, cancel gracefully without locking them in.
if (typeof window !== 'undefined') {
  const handleUserInterrupt = () => {
    if (isProgrammaticScrolling) {
      cancelSmoothScroll();
    }
  };

  window.addEventListener('wheel', handleUserInterrupt, { passive: true });
  window.addEventListener('touchstart', handleUserInterrupt, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(e.code)) {
      if (isProgrammaticScrolling) {
        cancelSmoothScroll();
      }
    }
  });
}

export interface SmoothScrollOptions {
  duration?: number;
  onComplete?: () => void;
}

/**
 * Smoothly navigates the viewport to a target element or Y coordinate at a deliberate,
 * cinematic pace, allowing the celestial dome rotation and star streaks to be experienced.
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options?: SmoothScrollOptions
): void {
  if (typeof window === 'undefined') return;

  // Resolve target Y coordinate
  let targetY = 0;
  if (typeof target === 'number') {
    targetY = target;
  } else if (typeof target === 'string') {
    const el = document.getElementById(target);
    if (!el) return;
    targetY = el.offsetTop;
  } else if (target instanceof HTMLElement) {
    targetY = target.offsetTop;
  }

  const startY = window.scrollY;
  const distance = Math.abs(targetY - startY);

  // If already at or within 12px of destination, do not restart transition
  if (distance < 12) {
    options?.onComplete?.();
    return;
  }

  // Accessibility: Immediate navigation for users who prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    cancelSmoothScroll();
    window.scrollTo(0, targetY);
    options?.onComplete?.();
    return;
  }

  // Cancel any prior active animation before starting a new journey
  cancelSmoothScroll();

  // Temporarily set documentElement scrollBehavior to 'auto' to prevent
  // native browser smooth-scrolling from fighting our frame-by-frame loop
  if (document.documentElement.style.scrollBehavior !== 'auto') {
    originalScrollBehavior = document.documentElement.style.scrollBehavior || '';
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // Calculate deliberate, sub-linear duration:
  // ~2.0 - 2.1 seconds for a single scene transition (~3,800px)
  // ~2.4 seconds for 2 scenes (~7,600px)
  // ~2.8 seconds for full 4-scene journey (~16,000px)
  const duration =
    options?.duration || Math.min(3200, Math.max(1600, Math.round(1200 + Math.sqrt(distance) * 13)));

  const startTime = performance.now();
  isProgrammaticScrolling = true;

  const animateScroll = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const easedT = easeInOutCubic(progress);
    const nextY = startY + (targetY - startY) * easedT;

    window.scrollTo(0, nextY);

    if (progress < 1) {
      activeRafId = requestAnimationFrame(animateScroll);
    } else {
      // Journey complete: land precisely at targetY
      window.scrollTo(0, targetY);
      isProgrammaticScrolling = false;
      activeRafId = null;

      if (originalScrollBehavior !== null) {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
        originalScrollBehavior = null;
      }

      options?.onComplete?.();
    }
  };

  activeRafId = requestAnimationFrame(animateScroll);
}

