import React, { useEffect, useRef } from 'react';
import { CelestialDome } from './CelestialDome';
import '../styles/cinematic-stage.css';

interface CinematicStageProps {
  sceneHome: React.ReactNode;
  sceneAbout: React.ReactNode;
  sceneSkills: React.ReactNode;
  sceneProjects: React.ReactNode;
  sceneFrontier: React.ReactNode;
  sceneContact: React.ReactNode;
  onActiveSceneChange?: (sceneId: string) => void;
}

const SCENE_IDS = ['home', 'about', 'skills', 'projects', 'frontier', 'contact'] as const;

export const CinematicStage: React.FC<CinematicStageProps> = ({
  sceneHome,
  sceneAbout,
  sceneSkills,
  sceneProjects,
  sceneFrontier,
  sceneContact,
  onActiveSceneChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active scene detection via IntersectionObserver on continuous document sections
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const sections = SCENE_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestCandidate: { id: string; ratio: number } | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!bestCandidate || entry.intersectionRatio > bestCandidate.ratio) {
              bestCandidate = { id: entry.target.id, ratio: entry.intersectionRatio };
            }
          }
        });
        if (bestCandidate) {
          onActiveSceneChange?.((bestCandidate as { id: string; ratio: number }).id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -35% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [onActiveSceneChange]);

  // Progressive scroll reveal observer for editorial text & elements
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const revealElements = document.querySelectorAll('.reveal-init');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="continuous-observatory-wrapper">
      {/* 1. PERSISTENT CELESTIAL BACKGROUND DOME CANVAS (FIXED) */}
      <CelestialDome />

      {/* 2. CONTINUOUS DOCUMENT FLOW STAGE */}
      <div className="continuous-document-stage">
        <section
          id="home"
          className="document-scene-section scene-home-section"
          aria-label="Scene 01: The Observatory"
        >
          {sceneHome}
        </section>

        <section
          id="about"
          className="document-scene-section scene-about-section"
          aria-label="Scene 02: Beyond the Horizon"
        >
          {sceneAbout}
        </section>

        <section
          id="skills"
          className="document-scene-section scene-skills-section"
          aria-label="Scene 03: The Constellations"
        >
          {sceneSkills}
        </section>

        <section
          id="projects"
          className="document-scene-section scene-projects-section"
          aria-label="Scene 04: Celestial Archive"
        >
          {sceneProjects}
        </section>

        <section
          id="frontier"
          className="document-scene-section scene-frontier-section"
          aria-label="Scene 05: The Next Frontier"
        >
          {sceneFrontier}
        </section>

        <section
          id="contact"
          className="document-scene-section scene-contact-section"
          aria-label="Scene 06: The Signal"
        >
          {sceneContact}
        </section>
      </div>
    </div>
  );
};
