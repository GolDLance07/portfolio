import { useState, useEffect } from 'react';

/**
 * Hook to track which scene is currently active in the viewport using IntersectionObserver.
 * Dynamically updates the active scene for navigation indicators.
 */
export function useActiveScene(sceneIds: string[], defaultScene: string = 'home'): string {
  const [activeScene, setActiveScene] = useState<string>(defaultScene);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveScene(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Trigger when section is prominently in middle third of screen
        threshold: [0, 0.2, 0.5],
      }
    );

    const elements = sceneIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sceneIds]);

  return activeScene;
}

