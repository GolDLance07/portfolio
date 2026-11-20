import React from 'react';
import { OrionConstellation } from '../components/OrionConstellation';
import '../styles/horizon.css';

interface HorizonSceneProps {
  hideSky?: boolean;
}

export const HorizonScene: React.FC<HorizonSceneProps> = () => {
  return (
    <section
      id="horizon-section"
      className="horizon-scene"
      aria-label="Scene 02: Beyond the Horizon (About)"
    >
      <div className="horizon-content-container">
        {/* Spatial Flight Log HUD / Eyebrow */}
        <div className="horizon-eyebrow-row">
          <span className="horizon-meta-station">SCENE 02 // 06</span>
          <span className="horizon-meta-divider" aria-hidden="true">&bull;</span>
          <span className="horizon-meta-sector">THE HORIZON &bull; PERSONAL PROFILE</span>
          <span className="horizon-meta-divider" aria-hidden="true">&bull;</span>
          <span className="horizon-coordinates">AZIMUTH 142&deg; // CELESTIAL LOG</span>
          <span className="horizon-meta-divider" aria-hidden="true">&bull;</span>
          <span className="horizon-coordinates">ALPHA ORIONIS VECTOR</span>
        </div>

        {/* Two-Column Spatial Stage: Editorial Narrative (Left) & Orion Constellation (Right) */}
        <div className="about-stage-grid">
          {/* Left Column: Personal Introduction & Philosophy */}
          <div className="about-editorial-column">
            {/* Header Group */}
            <div className="about-header-group">
              <h2 className="horizon-title">
                Beyond the Horizon.
              </h2>
              <div className="about-name-tag">
                <span className="about-name-lead">IDENTITY //</span>
                <span className="about-name-text">Aarush Rahul Patel</span>
              </div>
            </div>

            {/* Main Introduction Paragraphs (4 Full Paragraphs Restored) */}
            <div className="about-body-narrative">
              <p className="about-narrative-p">
                I&apos;m a developer driven by curiosity &mdash; the kind that makes me want to
                understand not just how something works, but what&apos;s happening beneath the surface.
              </p>

              <p className="about-narrative-p">
                My journey into technology has been about exploring ideas, experimenting with code,
                and turning concepts into things people can actually use. From software development to
                machine learning and backend systems, I enjoy figuring things out and bringing them to
                life.
              </p>

              <p className="about-narrative-p">
                I&apos;m particularly interested in the engineering behind software: how systems are
                designed, how data moves, and how intelligent capabilities can be integrated into
                practical applications.
              </p>

              <p className="about-narrative-p">
                For me, every project is an opportunity to learn something new, challenge an
                assumption, and build something a little better than before.
              </p>
            </div>

            {/* Unboxed Editorial Quote with Vertical Starlight Hairline */}
            <blockquote className="about-closing-quote">
              <p className="quote-text">
                &ldquo;Still exploring. Still building. Always looking beyond the horizon.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right Column: Orion Constellation in Open Deep Space */}
          <div className="about-constellation-column" aria-label="Orion the Hunter celestial illustration">
            <OrionConstellation />
          </div>
        </div>

        {/* Floating Navigational Telemetry HUD */}
        <div className="horizon-editorial-telemetry" role="note" aria-label="Journey Coordinates">
          <div className="telemetry-item">
            <span className="telemetry-label">CURRENT VECTOR</span>
            <span className="telemetry-value">System Architecture &bull; Intelligent Systems</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">&bull;</div>
          <div className="telemetry-item">
            <span className="telemetry-label">CELESTIAL ANCHOR</span>
            <span className="telemetry-value">Orion Constellation &bull; Alpha Orionis</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">&bull;</div>
          <div className="telemetry-item">
            <span className="telemetry-label">NEXT SECTOR</span>
            <span className="telemetry-value">03 Constellations (Skills)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
