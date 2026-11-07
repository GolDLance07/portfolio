import React, { useState, useId } from 'react';
import { SKILL_CATEGORIES } from '../data/skills';
import { Sparkles, Compass } from 'lucide-react';
import '../styles/constellations.css';

interface ConstellationsSceneProps {
  hideSky?: boolean;
}

export const ConstellationsScene: React.FC<ConstellationsSceneProps> = ({ hideSky = false }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('development');
  const [focusedStarId, setFocusedStarId] = useState<string | null>(null);
  const svgId = useId();

  const activeCategory =
    SKILL_CATEGORIES.find((cat) => cat.id === activeCategoryId) || SKILL_CATEGORIES[0];

  const handleKeyDownTabs = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % SKILL_CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length;
    } else {
      return;
    }
    e.preventDefault();
    setActiveCategoryId(SKILL_CATEGORIES[nextIndex].id);
    const nextBtn = document.getElementById(`constellation-tab-${SKILL_CATEGORIES[nextIndex].id}`);
    nextBtn?.focus();
  };

  return (
    <section
      id="skills-section"
      className={`constellations-scene ${hideSky ? 'is-in-celestial-stage' : ''}`}
      aria-label="Scene 03: The Constellations (Technical Skills)"
    >
      <div className="constellations-container">
        {/* Header */}
        <header className="constellations-header">
          <div className="constellations-eyebrow">
            <Compass size={14} aria-hidden="true" />
            <span>SECTOR 03 &bull; THE CONSTELLATIONS</span>
          </div>
          <h2 className="constellations-title">Technical Constellations</h2>
          <p className="constellations-subtitle">
            Patterns formed across systems, computational tools, and architectural domains. Select a
            constellation to inspect its connected nodes.
          </p>
        </header>

        {/* Category Navigation Bar */}
        <div
          role="tablist"
          aria-label="Skill constellation categories"
          className="constellation-tabs-bar"
        >
          {SKILL_CATEGORIES.map((category, index) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                id={`constellation-tab-${category.id}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`constellation-panel-${category.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`constellation-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveCategoryId(category.id)}
                onKeyDown={(e) => handleKeyDownTabs(e, index)}
              >
                {isActive && <span className="tab-active-dot" aria-hidden="true" />}
                <span>{category.name}</span>
                <span style={{ opacity: 0.6, fontSize: '0.68rem' }}>({category.skills.length})</span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage */}
        <div
          id={`constellation-panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`constellation-tab-${activeCategory.id}`}
          className="constellation-main-stage"
        >
          {/* Left: Constellation Celestial Map */}
          <div className="constellation-sky-card" aria-label={`${activeCategory.name} constellation map`}>
            <div className="sky-card-meta">
              <span>{activeCategory.designation}</span>
              <span>{activeCategory.coordinates}</span>
            </div>

            <div className="constellation-svg-wrapper">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="constellation-svg"
                aria-hidden="true"
              >
                <defs>
                  <filter id={`${svgId}-star-glow`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
                  </filter>
                  <filter id={`${svgId}-line-glow`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.75" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Delicate Solid Connecting Lines with Subtle Glow */}
                {activeCategory.connections.map(([fromIdx, toIdx], cIdx) => {
                  const p1 = activeCategory.stars[fromIdx];
                  const p2 = activeCategory.stars[toIdx];
                  if (!p1 || !p2) return null;
                  return (
                    <line
                      key={`conn-${cIdx}`}
                      x1={p1.cx}
                      y1={p1.cy}
                      x2={p2.cx}
                      y2={p2.cy}
                      className="constellation-line"
                      filter={`url(#${svgId}-line-glow)`}
                    />
                  );
                })}

                {/* Star Nodes */}
                {activeCategory.stars.map((star) => {
                  const isFocused = focusedStarId === star.id;
                  const haloRadius = star.isPrimary ? (isFocused ? 5.2 : 3.8) : (isFocused ? 4.0 : 2.8);
                  const coreRadius = star.isPrimary ? 1.5 : 1.1;

                  return (
                    <g
                      key={star.id}
                      className="constellation-star-group"
                      tabIndex={0}
                      role="button"
                      aria-label={`Star node: ${star.name}`}
                      onMouseEnter={() => setFocusedStarId(star.id)}
                      onMouseLeave={() => setFocusedStarId(null)}
                      onFocus={() => setFocusedStarId(star.id)}
                      onBlur={() => setFocusedStarId(null)}
                    >
                      {/* Halo */}
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={haloRadius}
                        className="constellation-star-halo"
                        filter={`url(#${svgId}-star-glow)`}
                      />
                      {/* Core */}
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={coreRadius}
                        className="constellation-star-core"
                      />
                      {/* Concise Translucent Display Label Beside Star */}
                      <text
                        x={star.labelX}
                        y={star.labelY}
                        textAnchor={star.textAnchor}
                        className="constellation-star-label"
                      >
                        {star.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right: Skills Content Panel */}
          <div className="constellation-details-panel">
            {/* Category Overview */}
            <div className="category-overview">
              <div className="category-overview-header">
                <h3 className="category-overview-name">{activeCategory.name}</h3>
                <span className="category-overview-coords">{activeCategory.astronomicalName}</span>
              </div>
              <p className="category-overview-desc">{activeCategory.description}</p>
            </div>

            {/* Nodes Grid */}
            <div className="skills-nodes-grid" role="list" aria-label={`Skills in ${activeCategory.name}`}>
              {activeCategory.skills.map((skill) => (
                <div key={skill.id} className="skill-node-card" role="listitem">
                  <div className="skill-node-header">
                    <Sparkles size={13} className="skill-node-star" aria-hidden="true" />
                    <span className="skill-node-name">{skill.name}</span>
                  </div>
                  <div className="skill-node-focus">{skill.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

