/**
 * The Observatory &mdash; Celestial Archive & Projects Configuration
 * Editable structured data representing projects as distinct celestial artifacts in space.
 */

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  celestialDesignation: string;
  celestialType: string;
  coordinates: string;
  artifactShape: 'pulsar' | 'ringed-satellite' | 'crystalline-probe';
  accentColor: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'churnsignal',
    name: 'ChurnSignal',
    category: 'Customer Retention Intelligence & ML',
    tagline: 'Forward-looking customer churn risk prediction and retention intelligence platform.',
    shortDescription:
      'A machine learning project focused on customer churn prediction, calibrated risk scoring, and SHAP-based feature attribution for subscription businesses.',
    longDescription:
      'Provides an early warning system 30 days in advance of potential subscription cancellation. Computes calibrated churn probabilities, categorizes accounts into High, Medium, and Low risk bands, evaluates financial exposure via Expected Revenue at Risk, and delivers SHAP waterfall factor attribution alongside an interactive Streamlit diagnostic console, counterfactual what-if simulator, and FastAPI REST endpoints.',
    techStack: ['Python', 'LightGBM', 'scikit-learn', 'SHAP', 'FastAPI', 'Streamlit', 'pandas'],
    githubUrl: 'https://github.com/GolDLance07/Churnsignal',
    celestialDesignation: 'ORBITAL CORE &bull; CS-01',
    celestialType: 'Retention Intelligence Engine',
    coordinates: 'RA 19h 50m &bull; DEC +08° 52′',
    artifactShape: 'pulsar',
    accentColor: '#F2A9C8',
  },
  {
    id: 'ttula',
    name: 'TTULA',
    category: 'Security Reconnaissance & Systems',
    tagline: 'Kali-native, terminal-first security reconnaissance workspace with unified Python core.',
    shortDescription:
      'A unified security reconnaissance workspace tying together web crawling, OSINT footprint discovery, URL deduplication, credential testing, and command knowledge.',
    longDescription:
      'Connects Arsenal-NG (command knowledge), Tookie (OSINT/URL discovery), Uro (URL filtering), and lab-gated Legba (authentication testing) with a custom Python-native urllib crawler. Features a Monokai-themed Textual TUI with persistent PTY shell session, live Tailscale mesh monitoring, and strict zero-shell-interpolation security guarantees.',
    techStack: ['Python', 'Textual (TUI)', 'Streamlit', 'urllib', 'Tailscale', 'Linux / Kali'],
    githubUrl: 'https://github.com/GolDLance07/TTULA',
    celestialDesignation: 'RECON BEACON &bull; TT-02',
    celestialType: 'Security Reconnaissance Workspace',
    coordinates: 'RA 04h 35m &bull; DEC +16° 30′',
    artifactShape: 'ringed-satellite',
    accentColor: '#C8B9F0',
  },
  {
    id: 'featureforge',
    name: 'FeatureForge Studio',
    category: 'Data Science & Feature Engineering',
    tagline: 'Interactive machine learning preprocessing and exploratory data analysis platform.',
    shortDescription:
      'An interactive platform simplifying ML preprocessing through automated EDA, configurable feature transformations, and exportable scikit-learn pipelines.',
    longDescription:
      'Streamlines repetitive preprocessing workflows through interactive CSV profiling, univariate and multivariate visualizations (Plotly & ydata-profiling), missing value imputation, scaling, categorical encoding, and outlier filtering. Dynamically builds reproducible scikit-learn ColumnTransformer pipelines and clean dataset exports.',
    techStack: ['Python', 'scikit-learn', 'Streamlit', 'Plotly', 'pandas', 'ydata-profiling'],
    githubUrl: 'https://github.com/GolDLance07/featureforge-studio',
    celestialDesignation: 'ORBITAL FORGE &bull; FF-03',
    celestialType: 'Preprocessing Pipeline Engine',
    coordinates: 'RA 12h 28m &bull; DEC +31° 28′',
    artifactShape: 'crystalline-probe',
    accentColor: '#7774C8',
  },
];

