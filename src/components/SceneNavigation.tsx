import React, { useState, useEffect } from 'react';
import { Menu, X, Compass, ExternalLink } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';
import '../styles/navigation.css';

interface NavItem {
  id: string;
  number: string;
  label: string;
  href: string;
  isAvailable: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', number: '01', label: 'Home', href: '#home', isAvailable: true },
  { id: 'about', number: '02', label: 'About', href: '#about', isAvailable: true },
  { id: 'skills', number: '03', label: 'Skills', href: '#skills', isAvailable: true },
  { id: 'projects', number: '04', label: 'Projects', href: '#projects', isAvailable: true },
  { id: 'frontier', number: '05', label: 'Frontier', href: '#frontier', isAvailable: true },
  { id: 'contact', number: '06', label: 'Signal', href: '#contact', isAvailable: true },
];

interface SceneNavigationProps {
  activeScene?: string;
  onNavigate?: (sceneId: string) => void;
}

export const SceneNavigation: React.FC<SceneNavigationProps> = ({
  activeScene = 'home',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    if (!item.isAvailable) {
      setNotice(`Scene ${item.number} (${item.label}) is in calibration.`);
      const timer = setTimeout(() => setNotice(null), 3200);
      return () => clearTimeout(timer);
    }
    if (onNavigate) {
      onNavigate(item.id);
    }
    // Gradual cinematic transit toward destination scene
    smoothScrollTo(item.id);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`observatory-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-container">
        {/* Brand / Observatory Identity */}
        <a href="#home" className="nav-brand" aria-label="The Observatory Home">
          <div className="brand-symbol" aria-hidden="true">
            <span className="symbol-ring"></span>
            <span className="symbol-core"></span>
          </div>
          <div className="brand-text">
            <span className="brand-title">THE OBSERVATORY</span>
            <span className="brand-meta">STATION 01 &bull; AARUSH</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-only" aria-label="Scene navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeScene === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`nav-item ${isActive ? 'is-active' : ''} ${!item.isAvailable ? 'is-pending' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
                aria-current={isActive ? 'page' : undefined}
                title={!item.isAvailable ? `${item.label} (Planned Milestone)` : item.label}
              >
                <span className="nav-item-num">{item.number}</span>
                <span className="nav-item-name">{item.label}</span>
                {isActive && <span className="nav-active-pip" aria-hidden="true"></span>}
                {!item.isAvailable && (
                  <span className="nav-badge" aria-label="Milestone planned">
                    Soon
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Quick action / Coordinates */}
        <div className="nav-actions desktop-only">
          <a
            href="https://github.com/GolDLance07"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-subtle"
            aria-label="GitHub Profile"
          >
            <span>GitHub</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="mobile-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Temporary calibration notice for unbuilt scenes */}
      {notice && (
        <div className="nav-notice" role="status" aria-live="polite">
          <Compass size={14} className="notice-icon" />
          <span>{notice}</span>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer mobile-only">
          <nav className="mobile-nav-links" aria-label="Mobile scene navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeScene === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`mobile-nav-item ${isActive ? 'is-active' : ''} ${!item.isAvailable ? 'is-pending' : ''}`}
                  onClick={(e) => handleItemClick(e, item)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-item-num">{item.number}</span>
                  <span className="nav-item-name">{item.label}</span>
                  {!item.isAvailable && <span className="nav-badge">Planned</span>}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

