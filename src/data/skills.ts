/**
 * The Observatory &mdash; Skills & Constellations Configuration
 * Editable structured data representing technical domains as celestial constellations.
 */

export interface SkillItem {
  id: string;
  name: string;
  focus: string;
}

export interface ConstellationStar {
  id: string;
  cx: number;
  cy: number;
  name: string; // Full skill name for accessibility & panel
  shortLabel: string; // Concise celestial display label beside node
  labelX: number; // Exact X coordinate for label
  labelY: number; // Exact Y coordinate for label
  textAnchor: 'start' | 'middle' | 'end';
  isPrimary?: boolean;
}

export interface ConstellationCategory {
  id: string;
  name: string;
  astronomicalName: string;
  designation: string;
  description: string;
  coordinates: string;
  skills: SkillItem[];
  stars: ConstellationStar[];
  // Index pairs defining connecting lines between stars
  connections: Array<[number, number]>;
}

export const SKILL_CATEGORIES: ConstellationCategory[] = [
  {
    id: 'development',
    name: 'Development',
    astronomicalName: 'VECTIS',
    designation: 'STATION 03 &bull; DEV-ALPHA',
    description:
      'Core programming languages and computational foundations used to build robust software systems.',
    coordinates: 'RA 19h 50m &bull; DEC +08° 52′',
    skills: [
      { id: 'python', name: 'Python', focus: 'Backend Systems, Data Processing, Scripting' },
      { id: 'cpp', name: 'C++', focus: 'System Programming, Memory Management, Algorithms' },
      { id: 'javascript', name: 'JavaScript', focus: 'Modern ES6+, Web Interfaces, Asynchronous I/O' },
      { id: 'typescript', name: 'TypeScript', focus: 'Type Safety, Scalable Architecture, API Contracts' },
    ],
    stars: [
      {
        id: 's1',
        cx: 24,
        cy: 62,
        name: 'Python',
        shortLabel: 'Python',
        labelX: 18,
        labelY: 63.5,
        textAnchor: 'end',
        isPrimary: true,
      },
      {
        id: 's2',
        cx: 32,
        cy: 24,
        name: 'C++',
        shortLabel: 'C++',
        labelX: 26,
        labelY: 25.5,
        textAnchor: 'end',
        isPrimary: true,
      },
      {
        id: 's3',
        cx: 68,
        cy: 24,
        name: 'TypeScript',
        shortLabel: 'TS',
        labelX: 74,
        labelY: 25.5,
        textAnchor: 'start',
        isPrimary: true,
      },
      {
        id: 's4',
        cx: 76,
        cy: 62,
        name: 'JavaScript',
        shortLabel: 'JS',
        labelX: 82,
        labelY: 63.5,
        textAnchor: 'start',
        isPrimary: false,
      },
      {
        id: 's5',
        cx: 50,
        cy: 82,
        name: 'Core Foundations',
        shortLabel: 'Core',
        labelX: 50,
        labelY: 91,
        textAnchor: 'middle',
        isPrimary: false,
      },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [3, 4],
      [1, 4],
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Systems',
    astronomicalName: 'CORONA',
    designation: 'STATION 03 &bull; SYS-BETA',
    description:
      'Server architecture, relational and document persistence layers, and reliable communication protocols.',
    coordinates: 'RA 15h 35m &bull; DEC +26° 42′',
    skills: [
      { id: 'fastapi', name: 'FastAPI', focus: 'High-performance Asynchronous Web Services' },
      { id: 'rest', name: 'REST APIs', focus: 'Contract Design, Middleware, Rate Limiting' },
      { id: 'databases', name: 'Databases', focus: 'PostgreSQL, Schema Design, Query Optimization' },
    ],
    stars: [
      {
        id: 'b1',
        cx: 25,
        cy: 55,
        name: 'FastAPI',
        shortLabel: 'FastAPI',
        labelX: 19,
        labelY: 56.5,
        textAnchor: 'end',
        isPrimary: true,
      },
      {
        id: 'b2',
        cx: 50,
        cy: 22,
        name: 'REST APIs',
        shortLabel: 'REST',
        labelX: 50,
        labelY: 13,
        textAnchor: 'middle',
        isPrimary: false,
      },
      {
        id: 'b3',
        cx: 75,
        cy: 55,
        name: 'Databases',
        shortLabel: 'DB',
        labelX: 81,
        labelY: 56.5,
        textAnchor: 'start',
        isPrimary: true,
      },
      {
        id: 'b4',
        cx: 50,
        cy: 82,
        name: 'Concurrency',
        shortLabel: 'Async',
        labelX: 50,
        labelY: 91,
        textAnchor: 'middle',
        isPrimary: false,
      },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
      [1, 3],
    ],
  },
  {
    id: 'data-ai',
    name: 'Data & AI',
    astronomicalName: 'CYGNUS',
    designation: 'STATION 03 &bull; ML-GAMMA',
    description:
      'Data transformation workflows, statistical feature discovery, and applying machine learning pipelines.',
    coordinates: 'RA 21h 18m &bull; DEC +45° 16′',
    skills: [
      { id: 'datascience', name: 'Data Science', focus: 'Exploratory Analysis, Numerical Computing' },
      { id: 'ml', name: 'Machine Learning', focus: 'Supervised Learning, Model Evaluation' },
      { id: 'feature-eng', name: 'Feature Engineering', focus: 'Data Cleansing, Transformation Pipelines' },
      { id: 'ai-integration', name: 'AI Integration', focus: 'Inference APIs, Agentic Workflows' },
    ],
    stars: [
      {
        id: 'd1',
        cx: 50,
        cy: 20,
        name: 'AI Integration',
        shortLabel: 'AI',
        labelX: 56,
        labelY: 21.5,
        textAnchor: 'start',
        isPrimary: true,
      },
      {
        id: 'd2',
        cx: 50,
        cy: 50,
        name: 'Machine Learning',
        shortLabel: 'ML',
        labelX: 56,
        labelY: 45,
        textAnchor: 'start',
        isPrimary: true,
      },
      {
        id: 'd3',
        cx: 22,
        cy: 50,
        name: 'Data Science',
        shortLabel: 'Data Sci.',
        labelX: 16,
        labelY: 51.5,
        textAnchor: 'end',
        isPrimary: false,
      },
      {
        id: 'd4',
        cx: 78,
        cy: 50,
        name: 'Feature Engineering',
        shortLabel: 'Feature Eng.',
        labelX: 84,
        labelY: 51.5,
        textAnchor: 'start',
        isPrimary: false,
      },
      {
        id: 'd5',
        cx: 50,
        cy: 82,
        name: 'Statistical Foundations',
        shortLabel: 'Stats',
        labelX: 50,
        labelY: 91,
        textAnchor: 'middle',
        isPrimary: false,
      },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 4],
      [3, 4],
    ],
  },
  {
    id: 'tools-infra',
    name: 'Tools & Infrastructure',
    astronomicalName: 'ANCHOR',
    designation: 'STATION 03 &bull; OPS-DELTA',
    description: 'Containerization, version control discipline, and unix environment administration.',
    coordinates: 'RA 06h 24m &bull; DEC -52° 18′',
    skills: [
      { id: 'git', name: 'Git', focus: 'Version Control, Branching, Collaborative Workflows' },
      { id: 'docker', name: 'Docker', focus: 'Reproducible Container Images, Multi-stage Builds' },
      { id: 'linux', name: 'Linux', focus: 'Shell Scripting, Process Monitoring, POSIX Tools' },
      { id: 'github', name: 'GitHub', focus: 'CI/CD Automation, Pull Requests, Code Review' },
    ],
    stars: [
      {
        id: 't1',
        cx: 28,
        cy: 26,
        name: 'Git',
        shortLabel: 'Git',
        labelX: 22,
        labelY: 27.5,
        textAnchor: 'end',
        isPrimary: true,
      },
      {
        id: 't2',
        cx: 72,
        cy: 26,
        name: 'Docker',
        shortLabel: 'Docker',
        labelX: 78,
        labelY: 27.5,
        textAnchor: 'start',
        isPrimary: true,
      },
      {
        id: 't3',
        cx: 50,
        cy: 55,
        name: 'Linux',
        shortLabel: 'Linux',
        labelX: 56,
        labelY: 56.5,
        textAnchor: 'start',
        isPrimary: true,
      },
      {
        id: 't4',
        cx: 50,
        cy: 82,
        name: 'GitHub',
        shortLabel: 'GitHub',
        labelX: 50,
        labelY: 91,
        textAnchor: 'middle',
        isPrimary: false,
      },
    ],
    connections: [
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 3],
      [0, 3],
      [1, 3],
    ],
  },
];
