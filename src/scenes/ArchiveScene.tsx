import React, { useState } from 'react';
import { PROJECTS_DATA, ProjectItem } from '../data/projects';
import { FolderGit2, ExternalLink, Radio } from 'lucide-react';
import '../styles/archive.css';

interface ArchiveSceneProps {
  hideSky?: boolean;
}

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ArchiveScene: React.FC<ArchiveSceneProps> = ({ hideSky = false }) => {
  const [activeProjectId, setActiveProjectId] = useState<string>('churnsignal');

  const activeProject =
    PROJECTS_DATA.find((proj) => proj.id === activeProjectId) || PROJECTS_DATA[0];

  const renderArtifactSvg = (item: ProjectItem) => {
    const isSelected = item.id === activeProjectId;
    const strokeColor = isSelected ? '#FFFFFF' : item.accentColor;

    if (item.artifactShape === 'pulsar') {
      return (
        <svg viewBox="0 0 60 60" className="celestial-svg-icon" aria-hidden="true">
          <circle cx="30" cy="30" r="14" fill={item.accentColor} fillOpacity={isSelected ? 0.4 : 0.2} />
          <ellipse
            cx="30"
            cy="30"
            rx="26"
            ry="9"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.2"
            transform="rotate(-25 30 30)"
          />
          <ellipse
            cx="30"
            cy="30"
            rx="24"
            ry="8"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeDasharray="3 2"
            transform="rotate(40 30 30)"
          />
          <circle cx="30" cy="30" r="6" fill="#FFFFFF" />
        </svg>
      );
    }

    if (item.artifactShape === 'ringed-satellite') {
      return (
        <svg viewBox="0 0 60 60" className="celestial-svg-icon" aria-hidden="true">
          <circle cx="30" cy="30" r="12" fill={item.accentColor} fillOpacity={isSelected ? 0.35 : 0.18} />
          <line x1="18" y1="30" x2="42" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
          <ellipse
            cx="30"
            cy="30"
            rx="27"
            ry="11"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.4"
            transform="rotate(15 30 30)"
          />
          {/* Orbiting Satellite Nodes */}
          <circle cx="53" cy="24" r="3" fill="#FFFFFF" />
          <circle cx="30" cy="30" r="5" fill="#FFFFFF" />
        </svg>
      );
    }

    // Crystalline Probe / Radar
    return (
      <svg viewBox="0 0 60 60" className="celestial-svg-icon" aria-hidden="true">
        {/* Phased Radar Arcs */}
        <path
          d="M 12 18 A 24 24 0 0 1 48 18"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />
        <path
          d="M 18 24 A 16 16 0 0 1 42 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.4"
        />
        {/* Diamond Core */}
        <polygon
          points="30,16 42,30 30,44 18,30"
          fill={item.accentColor}
          fillOpacity={isSelected ? 0.5 : 0.25}
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <circle cx="30" cy="30" r="4" fill="#FFFFFF" />
      </svg>
    );
  };

  return (
    <section
      id="projects-section"
      className={`archive-scene ${hideSky ? 'is-in-celestial-stage' : ''}`}
      aria-label="Scene 04: Celestial Archive (Projects)"
    >
      <div className="archive-container">
        {/* Header */}
        <header className="archive-header">
          <div className="archive-eyebrow">
            <FolderGit2 size={14} aria-hidden="true" />
            <span>SECTOR 04 &bull; CELESTIAL ARCHIVE</span>
          </div>
          <h2 className="archive-title">Project Artifacts</h2>
          <p className="archive-subtitle">
            Explorations in software engineering, intelligent pipelines, and network systems. Select
            an artifact to inspect technical blueprints and repository sources.
          </p>
        </header>

        {/* Main Stage */}
        <div className="archive-main-stage">
          {/* Left: Celestial Objects Selector */}
          <div
            className="celestial-objects-deck"
            role="tablist"
            aria-label="Selectable project celestial artifacts"
          >
            {PROJECTS_DATA.map((project) => {
              const isSelected = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  id={`project-tab-${project.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`project-panel-${project.id}`}
                  tabIndex={0}
                  className={`celestial-object-card ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <div className="celestial-icon-frame">{renderArtifactSvg(project)}</div>
                  <div className="celestial-meta">
                    <div className="celestial-tag">{project.celestialDesignation}</div>
                    <div className="celestial-name">{project.name}</div>
                    <div className="celestial-desc-brief">{project.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Featured Project Detail Panel */}
          <div
            id={`project-panel-${activeProject.id}`}
            role="tabpanel"
            aria-labelledby={`project-tab-${activeProject.id}`}
            className="project-detail-panel"
          >
            <div className="detail-panel-glow" aria-hidden="true" />

            <div className="detail-header-meta">
              <span>{activeProject.celestialDesignation}</span>
              <span>{activeProject.coordinates}</span>
            </div>

            <h3 className="detail-project-name">{activeProject.name}</h3>
            <div className="detail-project-tagline">{activeProject.tagline}</div>
            <p className="detail-narrative">{activeProject.longDescription}</p>

            {/* Tech Stack Chips */}
            <div className="detail-tech-section">
              <div className="detail-tech-label">Technology Stack</div>
              <div className="detail-tech-chips" role="list" aria-label="Project technologies">
                {activeProject.techStack.map((tech) => (
                  <span key={tech} className="tech-chip" role="listitem">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Links (shown only if provided) */}
            <div className="detail-actions-bar">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-action-btn is-primary"
                  aria-label={`View ${activeProject.name} source code on GitHub`}
                >
                  <GithubIcon size={15} />
                  <span>Inspect Repository</span>
                </a>
              )}

              {activeProject.liveDemoUrl && (
                <a
                  href={activeProject.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-action-btn is-secondary"
                  aria-label={`Open live deployment for ${activeProject.name}`}
                >
                  <ExternalLink size={15} aria-hidden="true" />
                  <span>Live Telemetry</span>
                </a>
              )}

              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--color-muted)',
                }}
              >
                <Radio size={13} style={{ color: 'var(--color-pink)' }} aria-hidden="true" />
                <span>{activeProject.celestialType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
