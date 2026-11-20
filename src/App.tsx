import React, { useState } from 'react';
import { SceneNavigation } from './components/SceneNavigation';
import { CinematicStage } from './components/CinematicStage';
import { ObservatoryScene } from './scenes/ObservatoryScene';
import { HorizonScene } from './scenes/HorizonScene';
import { ConstellationsScene } from './scenes/ConstellationsScene';
import { ArchiveScene } from './scenes/ArchiveScene';
import { FrontierScene } from './scenes/FrontierScene';
import { SignalScene } from './scenes/SignalScene';

export const App: React.FC = () => {
  const [activeScene, setActiveScene] = useState<string>('home');

  return (
    <div className="observatory-app">
      {/* Persistent Scene Navigation */}
      <SceneNavigation
        activeScene={activeScene}
        onNavigate={(sceneId) => {
          setActiveScene(sceneId);
        }}
      />

      {/* Main Content Area: Grand 6-Scene Celestial Dome Stage */}
      <main id="main-content">
        <CinematicStage
          sceneHome={<ObservatoryScene hideSky={true} />}
          sceneAbout={<HorizonScene hideSky={true} />}
          sceneSkills={<ConstellationsScene hideSky={true} />}
          sceneProjects={<ArchiveScene hideSky={true} />}
          sceneFrontier={<FrontierScene hideSky={true} />}
          sceneContact={<SignalScene hideSky={true} />}
          onActiveSceneChange={(sceneId) => setActiveScene(sceneId)}
        />
      </main>

      {/* Accessible Terminal Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(167, 197, 223, 0.12)',
          background: 'var(--color-cosmic-black)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--color-muted)',
          letterSpacing: '0.08em',
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} The Observatory &bull; Built with React, TypeScript &amp; Anime.js &bull; Stations 01–06 Operational
        </p>
      </footer>
    </div>
  );
};

export default App;
