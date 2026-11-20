import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeSpaceEnvironment } from './ThreeSpaceEnvironment';
import { motionController, SceneId } from '../services/motionController';
import '../styles/cinematic-stage.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CinematicStageProps {
  sceneHome: React.ReactNode;
  sceneAbout: React.ReactNode;
  sceneSkills: React.ReactNode;
  sceneProjects: React.ReactNode;
  sceneFrontier: React.ReactNode;
  sceneContact: React.ReactNode;
  onActiveSceneChange?: (sceneId: string) => void;
}

const SCENE_IDS: SceneId[] = ['home', 'about', 'skills', 'projects', 'frontier', 'contact'];

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

  // ==============================================================
  // 1. SYNCHRONIZE ACTIVE SCENE (Zero re-renders via MotionController)
  // ==============================================================
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
          const sid = (bestCandidate as { id: string; ratio: number }).id as SceneId;
          motionController.setActiveScene(sid);
          onActiveSceneChange?.(sid);
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

  // ==============================================================
  // 2. EXPERIENCE 3.0: FULL MULTI-SCENE SPATIAL SCROLL CHOREOGRAPHY
  // Inspired by Carter Ogunsola & Psychoactive
  // Continuous natural document flow with selective spatial reveals & exits
  // ==============================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // ------------------------------------------------------------
      // SCENE 01: THE OBSERVATORY (HERO)
      // Initial spatial entrance and continuous departure recede
      // ------------------------------------------------------------
      const homeSection = document.getElementById('home');
      const homeContent = homeSection?.querySelector('.hero-editorial-composition');
      const homeEyebrow = homeSection?.querySelector('.hero-station-badge');
      const homeTitle = homeSection?.querySelector('.hero-editorial-title');
      const homeTagline = homeSection?.querySelector('.hero-editorial-tagline');
      const homeMeta = homeSection?.querySelector('.hero-meta-strip');

      if (homeSection) {
        // Initial entrance on page arrival
        const heroEntranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (homeEyebrow) heroEntranceTl.fromTo(homeEyebrow, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
        if (homeTitle) heroEntranceTl.fromTo(homeTitle, { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0 }, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.2 }, '-=0.5');
        if (homeTagline) heroEntranceTl.fromTo(homeTagline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
        if (homeMeta) heroEntranceTl.fromTo(homeMeta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');

        // Departure: Content gently recedes into deep space
        if (homeContent) {
          gsap.to(homeContent, {
            scrollTrigger: {
              trigger: homeSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
            scale: 0.92,
            y: -50,
            opacity: 0,
            ease: 'power2.inOut',
          });
        }
      }

      // ------------------------------------------------------------
      // SCENE 02: BEYOND THE HORIZON (ABOUT & LIVING ORION CONSTELLATION)
      // Coordinated astronomical sequence: Typography + Orion emergence
      // ------------------------------------------------------------
      const aboutSection = document.getElementById('about');
      const aboutContent = aboutSection?.querySelector('.horizon-content-container');
      const aboutEyebrow = aboutSection?.querySelector('.horizon-eyebrow-row');
      const aboutTitle = aboutSection?.querySelector('.horizon-title');
      const aboutName = aboutSection?.querySelector('.about-name-tag');
      const aboutParagraphs = aboutSection?.querySelectorAll('.about-narrative-p');
      const aboutQuote = aboutSection?.querySelector('.about-closing-quote');
      const aboutTelemetry = aboutSection?.querySelector('.horizon-editorial-telemetry');

      // Orion Constellation Specific Elements for Astronomical Reveal
      const orionContainer = aboutSection?.querySelector('.orion-constellation-container');
      const orionAmbient = aboutSection?.querySelector('.orion-ambient-stars');
      const orionBetelgeuse = aboutSection?.querySelector('.orion-star-betelgeuse');
      const orionRigel = aboutSection?.querySelector('.orion-star-rigel');
      const orionBelt = aboutSection?.querySelector('.orion-belt-stars');
      const orionLines = aboutSection?.querySelectorAll('.orion-constellation-lines line');
      const orionBellatrixSaiph = aboutSection?.querySelector('.orion-stars-bellatrix-saiph');
      const orionSecondary = aboutSection?.querySelectorAll('.orion-secondary-features, .orion-highlights-contours, .orion-lepus-asterism, .orion-canis-major');
      const orionSilhouette = aboutSection?.querySelectorAll('.orion-hunter-silhouette, .orion-armor-facets');
      const orionLabels = aboutSection?.querySelector('.orion-labels');
      const orionTag = aboutSection?.querySelector('.orion-telemetry-tag');

      if (aboutSection) {
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 80%',
            end: 'top 15%',
            scrub: 0.8,
          },
        });

        // 1. Editorial Typography Stagger Sequence
        if (aboutEyebrow) {
          aboutTl.fromTo(aboutEyebrow, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 });
        }
        if (aboutTitle) {
          aboutTl.fromTo(
            aboutTitle,
            { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' },
            '-=0.3'
          );
        }
        if (aboutName) {
          aboutTl.fromTo(aboutName, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.6');
        }
        if (aboutParagraphs && aboutParagraphs.length > 0) {
          aboutTl.fromTo(
            aboutParagraphs,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
            '-=0.4'
          );
        }
        if (aboutQuote) {
          aboutTl.fromTo(aboutQuote, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
        }
        if (aboutTelemetry) {
          aboutTl.fromTo(aboutTelemetry, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
        }

        // 2. Orion Living Constellation Reveal Sequence (Plays alongside text)
        if (orionContainer) {
          aboutTl.fromTo(orionContainer, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.2);
        }
        // Step 1: Surrounding background stars subtly reduce brightness
        if (orionAmbient) {
          aboutTl.fromTo(orionAmbient, { opacity: 0.2 }, { opacity: 0.55, duration: 0.6 }, 0.3);
        }
        // Step 2: Betelgeuse illuminates (warm amber glow)
        if (orionBetelgeuse) {
          aboutTl.fromTo(orionBetelgeuse, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }, 0.4);
        }
        // Step 3: Rigel illuminates (cool blue-white glow)
        if (orionRigel) {
          aboutTl.fromTo(orionRigel, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }, 0.55);
        }
        // Step 4: Orion belt stars appear
        if (orionBelt) {
          aboutTl.fromTo(orionBelt, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.7);
        }
        // Step 5: Connecting lines draw progressively
        if (orionLines && orionLines.length > 0) {
          aboutTl.fromTo(
            orionLines,
            { strokeDashoffset: 100, opacity: 0 },
            { strokeDashoffset: 0, opacity: 1, duration: 1.0, stagger: 0.07, ease: 'power2.inOut' },
            0.85
          );
        }
        // Step 6: Bellatrix and Saiph illuminate
        if (orionBellatrixSaiph) {
          aboutTl.fromTo(orionBellatrixSaiph, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.1);
        }
        // Step 7: Remaining constellation details appear
        if (orionSecondary && orionSecondary.length > 0) {
          aboutTl.fromTo(orionSecondary, { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.08 }, 1.25);
        }
        // Step 8: Orion silhouette gradually resolves through subtle lighting/opacity
        if (orionSilhouette && orionSilhouette.length > 0) {
          aboutTl.fromTo(orionSilhouette, { opacity: 0 }, { opacity: 0.85, duration: 1.0, ease: 'power2.out' }, 1.4);
        }
        // Step 9: Star labels fade in last
        if (orionLabels) {
          aboutTl.fromTo(orionLabels, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.6);
        }
        if (orionTag) {
          aboutTl.fromTo(orionTag, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.7);
        }

        // Departure: Content and Orion gently recede as visitor descends towards Sector 03
        if (aboutContent) {
          gsap.to(aboutContent, {
            scrollTrigger: {
              trigger: aboutSection,
              start: 'bottom 90%',
              end: 'bottom 15%',
              scrub: 0.6,
            },
            scale: 0.93,
            y: -40,
            opacity: 0,
            ease: 'power2.inOut',
          });
        }
      }

      // ------------------------------------------------------------
      // SCENE 03: THE CONSTELLATIONS (TECHNICAL CAPABILITIES)
      // Star cluster reveal, tabs bar scale, detail card entrance
      // ------------------------------------------------------------
      const skillsSection = document.getElementById('skills');
      const skillsContainer = skillsSection?.querySelector('.constellations-container');
      const skillsEyebrow = skillsSection?.querySelector('.constellations-eyebrow');
      const skillsTitle = skillsSection?.querySelector('.constellations-title');
      const skillsSubtitle = skillsSection?.querySelector('.constellations-subtitle');
      const skillsTabs = skillsSection?.querySelector('.constellation-tabs-bar');
      const skillsStage = skillsSection?.querySelector('.constellation-main-stage');

      if (skillsSection) {
        const skillsTl = gsap.timeline({
          scrollTrigger: {
            trigger: skillsSection,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.8,
          },
        });

        if (skillsEyebrow) {
          skillsTl.fromTo(skillsEyebrow, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 });
        }
        if (skillsTitle) {
          skillsTl.fromTo(
            skillsTitle,
            { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
            '-=0.4'
          );
        }
        if (skillsSubtitle) {
          skillsTl.fromTo(skillsSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');
        }
        if (skillsTabs) {
          skillsTl.fromTo(skillsTabs, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.5');
        }
        if (skillsStage) {
          skillsTl.fromTo(skillsStage, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, '-=0.6');
        }

        if (skillsContainer) {
          gsap.to(skillsContainer, {
            scrollTrigger: {
              trigger: skillsSection,
              start: 'bottom 90%',
              end: 'bottom 15%',
              scrub: 0.6,
            },
            scale: 0.92,
            y: -45,
            opacity: 0,
            ease: 'power2.inOut',
          });
        }
      }

      // ------------------------------------------------------------
      // SCENE 04: CELESTIAL ARCHIVE (PROJECT ARTIFACTS)
      // Staggered selector cards & spatial spotlight panel focus
      // ------------------------------------------------------------
      const archiveSection = document.getElementById('projects');
      const archiveContainer = archiveSection?.querySelector('.archive-container');
      const archiveEyebrow = archiveSection?.querySelector('.archive-eyebrow');
      const archiveTitle = archiveSection?.querySelector('.archive-title');
      const archiveSubtitle = archiveSection?.querySelector('.archive-subtitle');
      const archiveDeck = archiveSection?.querySelector('.celestial-objects-deck');
      const archiveDetail = archiveSection?.querySelector('.project-detail-panel');

      if (archiveSection) {
        const archiveTl = gsap.timeline({
          scrollTrigger: {
            trigger: archiveSection,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.8,
          },
        });

        if (archiveEyebrow) {
          archiveTl.fromTo(archiveEyebrow, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 });
        }
        if (archiveTitle) {
          archiveTl.fromTo(
            archiveTitle,
            { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
            '-=0.4'
          );
        }
        if (archiveSubtitle) {
          archiveTl.fromTo(archiveSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');
        }
        if (archiveDeck) {
          archiveTl.fromTo(archiveDeck, { opacity: 0, x: -25 }, { opacity: 1, x: 0, duration: 0.8 }, '-=0.5');
        }
        if (archiveDetail) {
          archiveTl.fromTo(archiveDetail, { opacity: 0, scale: 0.94, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power2.out' }, '-=0.6');
        }

        if (archiveContainer) {
          gsap.to(archiveContainer, {
            scrollTrigger: {
              trigger: archiveSection,
              start: 'bottom 90%',
              end: 'bottom 15%',
              scrub: 0.6,
            },
            scale: 0.92,
            y: -45,
            opacity: 0,
            ease: 'power2.inOut',
          });
        }
      }

      // ------------------------------------------------------------
      // SCENE 05: THE NEXT FRONTIER (RESEARCH & EXPEDITIONS)
      // Mode switcher entrance & trajectory cards spatial rise
      // ------------------------------------------------------------
      const frontierSection = document.getElementById('frontier');
      const frontierContainer = frontierSection?.querySelector('.frontier-container');
      const frontierEyebrow = frontierSection?.querySelector('.frontier-eyebrow');
      const frontierTitle = frontierSection?.querySelector('.frontier-title');
      const frontierSubtitle = frontierSection?.querySelector('.frontier-subtitle');
      const frontierLead = frontierSection?.querySelector('.frontier-lead');
      const frontierSwitcher = frontierSection?.querySelector('.frontier-mode-switcher');
      const frontierTrajectories = frontierSection?.querySelector('#trajectories-panel');

      if (frontierSection) {
        const frontierTl = gsap.timeline({
          scrollTrigger: {
            trigger: frontierSection,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.8,
          },
        });

        if (frontierEyebrow) {
          frontierTl.fromTo(frontierEyebrow, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 });
        }
        if (frontierTitle) {
          frontierTl.fromTo(
            frontierTitle,
            { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
            '-=0.4'
          );
        }
        if (frontierSubtitle) {
          frontierTl.fromTo(frontierSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');
        }
        if (frontierLead) {
          frontierTl.fromTo(frontierLead, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
        }
        if (frontierSwitcher) {
          frontierTl.fromTo(frontierSwitcher, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7 }, '-=0.5');
        }
        if (frontierTrajectories) {
          frontierTl.fromTo(frontierTrajectories, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, '-=0.5');
        }

        if (frontierContainer) {
          gsap.to(frontierContainer, {
            scrollTrigger: {
              trigger: frontierSection,
              start: 'bottom 90%',
              end: 'bottom 15%',
              scrub: 0.6,
            },
            scale: 0.92,
            y: -45,
            opacity: 0,
            ease: 'power2.inOut',
          });
        }
      }

      // ------------------------------------------------------------
      // SCENE 06: THE SIGNAL (COMMUNICATION CONSOLE)
      // Telemetry antenna card & transmission console bilateral entrance
      // ------------------------------------------------------------
      const signalSection = document.getElementById('contact');
      const signalEyebrow = signalSection?.querySelector('.signal-eyebrow');
      const signalTitle = signalSection?.querySelector('.signal-title');
      const signalSubtitle = signalSection?.querySelector('.signal-subtitle');
      const signalStationCard = signalSection?.querySelector('.signal-station-card');
      const signalFormCard = signalSection?.querySelector('.transmission-form-card');

      if (signalSection) {
        const signalTl = gsap.timeline({
          scrollTrigger: {
            trigger: signalSection,
            start: 'top 75%',
            end: 'top 30%',
            scrub: 0.8,
          },
        });

        if (signalEyebrow) {
          signalTl.fromTo(signalEyebrow, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 });
        }
        if (signalTitle) {
          signalTl.fromTo(
            signalTitle,
            { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
          );
        }
        if (signalSubtitle) {
          signalTl.fromTo(signalSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');
        }
        if (signalStationCard) {
          signalTl.fromTo(signalStationCard, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5');
        }
        if (signalFormCard) {
          signalTl.fromTo(signalFormCard, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' }, '-=0.7');
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="continuous-observatory-wrapper">
      {/* 1. PERSISTENT THREE.JS WEBGL CELESTIAL ENVIRONMENT (FIXED) */}
      <ThreeSpaceEnvironment />

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
