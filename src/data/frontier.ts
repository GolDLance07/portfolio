/**
 * The Observatory &mdash; The Next Frontier Configuration
 * Editable structured data for Scene 05: Currently Working On & Future Horizons.
 */

export type TrajectoryStatus = 'In Progress' | 'Deepening Knowledge' | 'Exploring';
export type ExpeditionStatus = 'In Development' | 'Planned' | 'Active Exploration';

export interface LearningTrajectoryItem {
  id: string;
  title: string;
  domain: string;
  status: TrajectoryStatus;
  progressPercent: number;
  coordinates: string;
  description: string;
  focusAreas: string[];
  keyMilestones: string[];
  orbitRadius: number; // orbital distance in celestial projection (px or %)
  accentColor: string;
}

export interface UpcomingExpeditionItem {
  id: string;
  name: string;
  codename: string;
  status: ExpeditionStatus;
  coordinates: string;
  phase: string;
  summary: string;
  intendedTech: string[];
  deliverables: string[];
  githubUrl?: string;
  accentColor: string;
}

export interface FrontierConfig {
  heading: string;
  subtitle: string;
  eyebrow: string;
  stationTag: string;
  coordinates: string;
  leadParagraph: string;
  trajectories: LearningTrajectoryItem[];
  expeditions: UpcomingExpeditionItem[];
}

export const FRONTIER_CONFIG: FrontierConfig = {
  heading: 'The Next Frontier',
  subtitle: 'Currently Exploring',
  eyebrow: 'SECTOR 05 &bull; THE NEXT FRONTIER',
  stationTag: 'DEEP-SURVEY ORBITAL PROJECTION',
  coordinates: 'RA 18h 36m &bull; DEC +38° 47′ (LYRA VECTOR)',
  leadParagraph:
    'An evolving celestial map of current engineering pursuits, active learning trajectories, and upcoming computational expeditions.',
  trajectories: [
    {
      id: 'backend-engineering',
      title: 'Advanced Backend Engineering',
      domain: 'Systems & Core Services',
      status: 'In Progress',
      progressPercent: 78,
      coordinates: 'ORBIT ALPHA &bull; RA 18h 22m',
      description:
        'Hardening asynchronous server runtimes, connection multiplexing, message streaming, and distributed cache invalidation strategies.',
      focusAreas: [
        'FastAPI & Uvicorn ASGI internals',
        'Asynchronous I/O concurrency models',
        'Redis pub/sub & session caches',
        'Database query profiling & indexing',
      ],
      keyMilestones: [
        'Sub-millisecond API response caching',
        'Zero-downtime database migrations',
        'Stream-oriented data pipelining',
      ],
      orbitRadius: 38,
      accentColor: '#F2A9C8',
    },
    {
      id: 'system-design',
      title: 'System Design & Distributed Topologies',
      domain: 'Scalability & Fault Tolerance',
      status: 'Deepening Knowledge',
      progressPercent: 65,
      coordinates: 'ORBIT BETA &bull; RA 18h 45m',
      description:
        'Deepening practical knowledge of horizontal scaling, consensus mechanics, multi-node replication, and resilient fault-tolerant distributed architectures.',
      focusAreas: [
        'CAP & PACELC trade-off analysis',
        'Distributed rate-limiting algorithms',
        'Database partitioning & read replicas',
        'Idempotency & graceful degradation',
      ],
      keyMilestones: [
        'Resilient circuit breaker implementations',
        'Event-driven asynchronous microservices',
        'Consistent hashing & partition balancing',
      ],
      orbitRadius: 58,
      accentColor: '#C8B9F0',
    },
    {
      id: 'data-science-ml',
      title: 'Applied Data Science & Machine Learning',
      domain: 'Predictive Intelligence',
      status: 'In Progress',
      progressPercent: 82,
      coordinates: 'ORBIT GAMMA &bull; RA 19h 10m',
      description:
        'Advancing machine learning lifecycle pipelines, gradient boosting architectures, feature interaction analysis, and model explainability standards.',
      focusAreas: [
        'Gradient boosting classifiers (LightGBM/XGBoost)',
        'SHAP & TreeExplainer interpretability',
        'Automated ColumnTransformer preprocessing',
        'Time-based split validation & leakage prevention',
      ],
      keyMilestones: [
        'End-to-end churn prediction framework',
        'Dynamic EDA & transformation engine',
        'Calibrated prediction thresholds',
      ],
      orbitRadius: 78,
      accentColor: '#9D8DF1',
    },
    {
      id: 'ai-integration',
      title: 'AI Integration & Agentic Frameworks',
      domain: 'Autonomous Tool Orchestration',
      status: 'Exploring',
      progressPercent: 50,
      coordinates: 'ORBIT DELTA &bull; RA 19h 35m',
      description:
        'Investigating agentic tool-calling protocols, Model Context Protocol (MCP) integrations, structured execution boundaries, and context optimization.',
      focusAreas: [
        'Model Context Protocol (MCP) tool servers',
        'Declarative tool orchestration & schemas',
        'Execution sandboxing & safety gates',
        'Evaluation benchmarks for agentic traces',
      ],
      keyMilestones: [
        'Custom MCP server implementations',
        'Agentic code automation experiments',
        'Dynamic tool resolution protocols',
      ],
      orbitRadius: 96,
      accentColor: '#7774C8',
    },
  ],
  expeditions: [
    {
      id: 'exp-telemetry-pipe',
      name: 'High-Throughput Telemetry Pipeline',
      codename: 'EXPEDITION 01 &bull; PROJECT PULSAR',
      status: 'In Development',
      coordinates: 'AZ 084° &bull; ALT +32°',
      phase: 'Prototyping & Buffer Benchmarking',
      summary:
        'A lightweight asynchronous streaming service designed to ingest, validate, and batch high-frequency application events into storage tiers with zero event loss.',
      intendedTech: ['Python', 'FastAPI', 'Redis', 'Docker', 'AsyncIO'],
      deliverables: [
        'Non-blocking event queue buffer',
        'Checksum-verified payload delivery',
        'Dockerized reproducible deployment',
      ],
      accentColor: '#F2A9C8',
    },
    {
      id: 'exp-agent-runtime',
      name: 'Agentic Tool Orchestration Harness',
      codename: 'EXPEDITION 02 &bull; PROJECT AEGIS',
      status: 'Planned',
      coordinates: 'AZ 142° &bull; ALT +55°',
      phase: 'Specification & Protocol Design',
      summary:
        'A developer-centric execution environment for autonomous agents, implementing standardized MCP tool protocols and human-in-the-loop intervention gates.',
      intendedTech: ['TypeScript', 'Python', 'Model Context Protocol', 'CLI Tools'],
      deliverables: [
        'Standardized MCP tool adapters',
        'Deterministic execution trace logger',
        'Terminal dashboard for inspection',
      ],
      accentColor: '#C8B9F0',
    },
    {
      id: 'exp-visionguard-plus',
      name: 'VisionGuard Enhancement',
      codename: 'EXPEDITION 03 &bull; PROJECT HORIZON',
      status: 'Active Exploration',
      coordinates: 'AZ 210° &bull; ALT +64°',
      phase: 'Refining Real-Time Feeds',
      summary:
        'Upgrading computer vision monitoring capabilities with low-latency browser feeds, automated anomaly classification, and incident telemetry logs.',
      intendedTech: ['JavaScript', 'Python', 'OpenCV', 'WebSockets', 'Tailscale'],
      deliverables: [
        'Sub-second WebSocket frame streaming',
        'Automated detection alerts',
        'Authenticated mesh network telemetry',
      ],
      githubUrl: 'https://github.com/GolDLance07/VisionGuard',
      accentColor: '#7774C8',
    },
  ],
};

