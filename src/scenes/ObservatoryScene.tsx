import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { ArrowDown, Compass, FolderGit2 } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { smoothScrollTo } from '../utils/smoothScroll';
import '../styles/hero.css';

interface ObservatorySceneProps {
  hideSky?: boolean;
}

export const ObservatoryScene: React.FC<ObservatorySceneProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const entranceAnimRef = useRef<anime.AnimeInstance | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Entrance Animation via Anime.js on initial mount
  useEffect(() => {
    if (prefersReducedMotion) {
      const elements = heroRef.current?.querySelectorAll<HTMLElement>('.hero-stagger-item');
      elements?.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const items = heroRef.current?.querySelectorAll('.hero-stagger-item');
    if (items && items.length > 0) {
      entranceAnimRef.current = anime({
        targets: items,
        opacity: [0, 1],
        translateY: [24, 0],
        easing: 'easeOutCubic',
        duration: 800,
        delay: anime.stagger(120, { start: 200 }),
      });
    }

    return () => {
      entranceAnimRef.current?.pause();
      entranceAnimRef.current = null;
    };
  }, [prefersReducedMotion]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, targetId: string) => {
    e.preventDefault();
    setActionFeedback(`Station calibrated: navigating toward "${label}"...`);
    const timer = setTimeout(() => {
      setActionFeedback(null);
      smoothScrollTo(targetId);
    }, 250);
    return () => clearTimeout(timer);
  };

  return (
    <section
      id="observatory-section"
      ref={heroRef}
      className="observatory-hero"
      aria-label="Scene 01: The Observatory"
    >
      <div className="hero-content-container">
        <div className="hero-editorial-composition">
          {/* Eyebrow & Station Metadata HUD */}
          <div className="hero-eyebrow-row hero-stagger-item">
            <span className="hero-meta-station">STATION 01 // 06</span>
            <span className="hero-meta-divider" aria-hidden="true">&bull;</span>
            <span className="hero-meta-vector">GROUND TRANSMISSION &bull; OBSERVATORY DOME</span>
            <span className="hero-meta-divider" aria-hidden="true">&bull;</span>
            <span className="hero-meta-vector">RA 18h 36m &bull; DEC +38&deg; 47&prime;</span>
          </div>

          {/* Massive Display Name with Architectural Lettering */}
          <div className="hero-name-wrap hero-stagger-item">
            <h1 className="hero-name">
              AARUSH
            </h1>
            <span className="hero-name-tagline" aria-hidden="true">PATEL</span>
          </div>

          {/* Editorial Asymmetric Narrative Row */}
          <div className="hero-editorial-row">
            <div className="hero-editorial-lead hero-stagger-item">
              <h2 className="hero-statement">
                Building systems.<br />
                <span className="statement-accent">Exploring computational intelligence.</span>
              </h2>
            </div>

            <div className="hero-editorial-detail hero-stagger-item">
              <p className="hero-intro">
                Developer focused on backend engineering, distributed systems architecture, and building
                intelligent computational applications.
              </p>
              <p className="hero-credo">
                Turning ideas into systems worth exploring.
              </p>

              {/* Minimal Editorial Links */}
              <div className="hero-actions-row">
                <a
                  href="#projects"
                  className="hero-editorial-link is-primary"
                  onClick={(e) => handleCtaClick(e, 'Projects Archive', 'projects')}
                  aria-label="Explore my work (Navigate to Projects)"
                >
                  <FolderGit2 size={15} aria-hidden="true" />
                  <span>Explore Work</span>
                  <span className="link-arrow" aria-hidden="true">&rarr;</span>
                </a>
                <a
                  href="#about"
                  className="hero-editorial-link is-secondary"
                  onClick={(e) => handleCtaClick(e, 'About Aarush', 'about')}
                  aria-label="About Aarush (Navigate to About)"
                >
                  <Compass size={15} aria-hidden="true" />
                  <span>About Me</span>
                  <span className="link-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Dynamic feedback message when navigating */}
          {actionFeedback && (
            <div className="action-feedback-toast" role="status" aria-live="polite">
              {actionFeedback}
            </div>
          )}
        </div>
      </div>

      {/* Floating Vertical Scroll Cue */}
      <div className="hero-scroll-cue hero-stagger-item">
        <a
          href="#about"
          className="scroll-cue-link"
          onClick={(e) => handleCtaClick(e, 'The Horizon', 'about')}
          aria-label="Scroll to explore next scene"
        >
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
          <div className="scroll-cue-icon" aria-hidden="true">
            <ArrowDown size={14} className="cue-arrow" />
          </div>
        </a>
      </div>
    </section>
  );
};
