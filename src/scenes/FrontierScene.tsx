import React, { useState } from 'react';
import { FRONTIER_CONFIG } from '../data/frontier';
import { Compass, Sparkles, Rocket, Radio, CheckCircle2 } from 'lucide-react';
import '../styles/frontier.css';

interface FrontierSceneProps {
  hideSky?: boolean;
}

const GithubIcon = ({ size = 14 }: { size?: number }) => (
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

export const FrontierScene: React.FC<FrontierSceneProps> = ({ hideSky = false }) => {
  const [activeSection, setActiveSection] = useState<'trajectories' | 'expeditions'>('trajectories');
  const [activeTrajectoryId, setActiveTrajectoryId] = useState<string>('backend-engineering');

  const activeTrajectory =
    FRONTIER_CONFIG.trajectories.find((t) => t.id === activeTrajectoryId) ||
    FRONTIER_CONFIG.trajectories[0];

  const renderStatusBadge = (status: string) => {
    let className = 'status-exploring';
    if (status === 'In Progress' || status === 'In Development') {
      className = 'status-in-progress';
    } else if (status === 'Deepening Knowledge' || status === 'Active Exploration') {
      className = 'status-deepening';
    }

    return (
      <span className={`status-pill ${className}`}>
        <span className="status-dot" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <section
      id="frontier-section"
      className={`frontier-scene ${hideSky ? 'is-in-celestial-stage' : ''}`}
      aria-label="Scene 05: The Next Frontier (Currently Working On)"
    >
      <div className="frontier-container">
        {/* Header */}
        <header className="frontier-header">
          <div className="frontier-eyebrow">
            <Compass size={14} aria-hidden="true" />
            <span>{FRONTIER_CONFIG.eyebrow}</span>
          </div>
          <h2 className="frontier-title">{FRONTIER_CONFIG.heading}</h2>
          <div className="frontier-subtitle">{FRONTIER_CONFIG.subtitle}</div>
          <p className="frontier-lead">{FRONTIER_CONFIG.leadParagraph}</p>
        </header>

        {/* Section Switcher (Section A: Learning vs Section B: Expeditions) */}
        <div
          className="frontier-mode-switcher"
          role="tablist"
          aria-label="Frontier exploration categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'trajectories'}
            aria-controls="trajectories-panel"
            id="tab-trajectories"
            className={`frontier-mode-btn ${activeSection === 'trajectories' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('trajectories')}
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>Learning Trajectories ({FRONTIER_CONFIG.trajectories.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'expeditions'}
            aria-controls="expeditions-panel"
            id="tab-expeditions"
            className={`frontier-mode-btn ${activeSection === 'expeditions' ? 'is-active' : ''}`}
            onClick={() => setActiveSection('expeditions')}
          >
            <Rocket size={14} aria-hidden="true" />
            <span>Upcoming Expeditions ({FRONTIER_CONFIG.expeditions.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* SECTION A: LEARNING TRAJECTORIES                               */}
        {/* ============================================================== */}
        {activeSection === 'trajectories' && (
          <div
            id="trajectories-panel"
            role="tabpanel"
            aria-labelledby="tab-trajectories"
            className="trajectory-grid"
          >
            {/* Left Deck: Selectable Trajectory Cards */}
            <div
              className="trajectory-selector-deck"
              role="tablist"
              aria-label="Active learning trajectories"
            >
              {FRONTIER_CONFIG.trajectories.map((traj) => {
                const isSelected = traj.id === activeTrajectory.id;
                return (
                  <button
                    key={traj.id}
                    id={`trajectory-tab-${traj.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`trajectory-panel-${traj.id}`}
                    className={`trajectory-nav-card ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setActiveTrajectoryId(traj.id)}
                  >
                    <div className="trajectory-card-header">
                      <span className="trajectory-card-coords">{traj.coordinates}</span>
                      {renderStatusBadge(traj.status)}
                    </div>
                    <div className="trajectory-card-title">{traj.title}</div>
                    <div className="trajectory-card-domain">{traj.domain}</div>
                  </button>
                );
              })}
            </div>

            {/* Right Deck: Trajectory Mission Telemetry Console */}
            <div
              id={`trajectory-panel-${activeTrajectory.id}`}
              role="tabpanel"
              aria-labelledby={`trajectory-tab-${activeTrajectory.id}`}
              className="trajectory-detail-panel"
            >
              <div className="trajectory-detail-glow" aria-hidden="true" />

              <div className="trajectory-meta-bar">
                <span>{activeTrajectory.coordinates}</span>
                <span>{FRONTIER_CONFIG.stationTag}</span>
              </div>

              <h3 className="trajectory-main-title">{activeTrajectory.title}</h3>
              <div className="trajectory-domain-tag">{activeTrajectory.domain}</div>
              <p className="trajectory-narrative">{activeTrajectory.description}</p>

              {/* Progress Gauge */}
              <div className="trajectory-progress-box">
                <div className="trajectory-progress-labels">
                  <span>MASTERY TRAJECTORY</span>
                  <span>{activeTrajectory.progressPercent}% PROFICIENCY &bull; {activeTrajectory.status.toUpperCase()}</span>
                </div>
                <div
                  className="trajectory-progress-track"
                  role="progressbar"
                  aria-valuenow={activeTrajectory.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="trajectory-progress-fill"
                    style={{ width: `${activeTrajectory.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Subsections: Focus Areas & Key Milestones */}
              <div className="trajectory-subsections">
                <div>
                  <h4 className="trajectory-col-title">Focus &amp; Systems Exploration</h4>
                  <ul className="trajectory-item-list">
                    {activeTrajectory.focusAreas.map((focus) => (
                      <li key={focus} className="trajectory-item-entry">
                        <span className="trajectory-bullet" aria-hidden="true">&bull;</span>
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="trajectory-col-title">Operational Milestones</h4>
                  <ul className="trajectory-item-list">
                    {activeTrajectory.keyMilestones.map((milestone) => (
                      <li key={milestone} className="trajectory-item-entry">
                        <CheckCircle2 size={13} color="var(--color-pink)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                        <span>{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION B: UPCOMING EXPEDITIONS                                */}
        {/* ============================================================== */}
        {activeSection === 'expeditions' && (
          <div
            id="expeditions-panel"
            role="tabpanel"
            aria-labelledby="tab-expeditions"
            className="expeditions-grid"
          >
            {FRONTIER_CONFIG.expeditions.map((exp) => (
              <div key={exp.id} className="expedition-card">
                <div className="expedition-card-header">
                  <span className="expedition-codename">{exp.codename}</span>
                  {renderStatusBadge(exp.status)}
                </div>

                <h3 className="expedition-title">{exp.name}</h3>
                <div className="expedition-phase">Phase: {exp.phase}</div>
                <p className="expedition-summary">{exp.summary}</p>

                {/* Tech Chips */}
                <div className="expedition-tech-list" aria-label="Target Technologies">
                  {exp.intendedTech.map((tech) => (
                    <span key={tech} className="expedition-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Deliverables */}
                <div className="expedition-deliverables">
                  <div className="expedition-deliv-title">Target Deliverables</div>
                  <ul className="expedition-deliv-list">
                    {exp.deliverables.map((item) => (
                      <li key={item} className="expedition-deliv-item">
                        <Radio size={11} color="var(--color-pink)" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Actions */}
                <div className="expedition-actions">
                  <span className="expedition-coords">{exp.coordinates}</span>
                  {exp.githubUrl && (
                    <a
                      href={exp.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="expedition-repo-link"
                      aria-label={`Inspect ${exp.name} source repository on GitHub`}
                    >
                      <GithubIcon size={13} />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
