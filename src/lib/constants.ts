import type { LucideIcon } from 'lucide-react';

// URLs
export const GITHUB_URL = 'https://github.com/aorysan';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/aryo-adi-putro-1a7b872a4/';
export const EMAIL = 'aryoadiputro@gmail.com';
export const MAILTO = `mailto:${EMAIL}` as const;
export const ITCHIO_URL = 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746';

// Navigation
export const SECTION_IDS = ['home', 'about', 'projects', 'media', 'contact'] as const;

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Media', href: '#media' },
  { label: 'Contact', href: '#contact' },
];

// Animation
export const ANIMATION = {
  BASE_DELAY: 400,
  CATEGORY_STAGGER: 150,
  ITEM_STAGGER: 100,
  SKILL_STAGGER: 80,
  SECTION_DELAY: 700,
  INTERVAL_MS: 3500,
} as const;

// Types
export interface Highlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Journey {
  icon: LucideIcon;
  title: string;
  period: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  itchio?: string;
  website?: string;
  img?: string;
  imageLabel: string;
}

export interface GalleryImage {
  src: string;
  label: string;
}

export interface GallerySlide {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  images: GalleryImage[];
}

export interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
}

export interface SocialLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

// Gamified Tactical HUD Constants & Types
export type DifficultyRating = 1 | 2 | 3 | 4 | 5;
export type TechRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Mission {
  id: string;
  title: string;
  briefing: string;
  status: 'COMPLETED' | 'IN PROGRESS';
  difficulty: DifficultyRating;
  rewards: string[];
  repoLink?: string;
  liveLink?: string;
  thumbnail?: string;
  imageLabel: string;
}

export interface EquipmentItem {
  name: string;
  rarity: TechRarity;
  description: string;
}

export interface EquipmentCategory {
  category: string;
  items: EquipmentItem[];
}

export interface Aptitude {
  label: string;
  value: number;
  color: '#00D4FF' | '#FF00FF';
}

export const PILOT_DOSSIER = {
  callsign: 'ARYO ADI PUTRO',
  role: 'FULL STACK DEVELOPER',
  location: 'MALANG, JAWA TIMUR',
  status: 'AVAILABLE',
  bio: 'Full stack developer building production web applications with React, TypeScript, and Node.js. 2+ years shipping maintainable software.',
} as const;

export const APTITUDES: Aptitude[] = [
  { label: 'Architecture', value: 80, color: '#00D4FF' },
  { label: 'Problem Solving', value: 90, color: '#FF00FF' },
  { label: 'Systems Design', value: 80, color: '#00D4FF' },
  { label: 'Collaboration', value: 90, color: '#FF00FF' },
];

export const SERVICE_RECORDS = [
  { value: '2+', label: 'Years Experience' },
  { value: '6+', label: 'Missions Completed' },
  { value: '12+', label: 'Arsenal Technologies' },
  { value: '100%', label: 'Mission Reliability' },
] as const;

export interface DeploymentLog {
  period: string;
  title: string;
  desc: string;
}

export const DEPLOYMENT_LOGS: DeploymentLog[] = [
  { period: '2022', title: 'Tactical Foundations', desc: 'Began software engineering with HTML, CSS, and modern JavaScript.' },
  { period: '2023', title: 'First Operations', desc: 'Built first full-stack platforms and participated in game development jams.' },
  { period: '2024', title: 'Skill Expansion', desc: 'Mastered production React, TypeScript, and distributed cloud workflows.' },
  { period: 'ACTIVE', title: 'Combat Ready', desc: 'Active deployment of high-reliability web systems.' },
];

export const MISSIONS_DATA: Mission[] = [
  {
    id: 'mission-kampungku',
    title: 'KampungKu',
    briefing: 'Community management mobile system with role-based auth, financial records, resident directory, and live metrics.',
    status: 'COMPLETED',
    difficulty: 4,
    rewards: ['Flutter', 'Firebase', 'Dart', 'Cloudinary'],
    repoLink: `${GITHUB_URL}/jawara_kel3`,
    imageLabel: 'kampungku.png',
  },
  {
    id: 'mission-restarea',
    title: 'Rest Area Business - Idle Tycoon Game',
    briefing: 'Tycoon simulation game built for game jam with passenger flow mechanics, upgrades, and rush-hour management loop.',
    status: 'COMPLETED',
    difficulty: 3,
    rewards: ['Unity', 'Game Jam', 'Simulation', 'Tycoon'],
    repoLink: `${GITHUB_URL}/rest-area-tycoon`,
    liveLink: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746',
    thumbnail: 'img/tycoon/tycoon.png',
    imageLabel: 'Rest Area Tycoon',
  },
  {
    id: 'mission-trasmart',
    title: 'TrasMart',
    briefing: 'Production e-commerce storefront deployed on Vercel with catalog navigation, cart management, and responsive UI.',
    status: 'COMPLETED',
    difficulty: 2,
    rewards: ['Website', 'Vercel', 'E-Commerce'],
    repoLink: `${GITHUB_URL}/trasmart-web`,
    liveLink: 'https://trasmart-web.vercel.app/',
    thumbnail: 'img/trasmart/trasmart.png',
    imageLabel: 'TrasMart',
  },
  {
    id: 'mission-sarpras',
    title: 'SarPras',
    briefing: 'Facilities and equipment resource management system with check-in/out workflows and collaborative tracking.',
    status: 'COMPLETED',
    difficulty: 3,
    rewards: ['Web', 'Kelompok', 'Manajemen'],
    repoLink: `${GITHUB_URL}/Kel6-SarPras`,
    imageLabel: 'sarpras.png',
  },
  {
    id: 'mission-framework',
    title: 'FrameWork',
    briefing: 'Modular architecture exploration project demonstrating clean separation of concerns and pattern implementations.',
    status: 'COMPLETED',
    difficulty: 2,
    rewards: ['Framework', 'Architecture', 'Web'],
    repoLink: `${GITHUB_URL}/frameWork`,
    imageLabel: 'framework.png',
  },
  {
    id: 'mission-jawara',
    title: 'Jawara',
    briefing: 'Organizational operational management web app with activity logging and administrative dashboard.',
    status: 'COMPLETED',
    difficulty: 2,
    rewards: ['Web', 'Community', 'Management'],
    repoLink: `${GITHUB_URL}/jawara`,
    imageLabel: 'jawara.png',
  },
];

export const TECH_ARSENAL: EquipmentCategory[] = [
  {
    category: 'Frontend Development',
    items: [
      { name: 'React & Next.js', rarity: 'Legendary', description: 'Core application engine for SPA and SSR platforms' },
      { name: 'TypeScript', rarity: 'Legendary', description: 'Strict typing for high-reliability systems' },
      { name: 'TailwindCSS', rarity: 'Epic', description: 'Utility-first modern design token styling' },
      { name: 'GSAP & Lenis', rarity: 'Rare', description: 'Hardware-accelerated micro-interactions and smooth scrolling' },
    ],
  },
  {
    category: 'Backend & Database',
    items: [
      { name: 'Node.js & Express', rarity: 'Epic', description: 'Scalable HTTP microservices and REST endpoints' },
      { name: 'Firebase', rarity: 'Epic', description: 'Real-time database, auth, and cloud storage' },
      { name: 'PostgreSQL', rarity: 'Rare', description: 'Relational data modeling and ACID transactions' },
      { name: 'REST APIs', rarity: 'Epic', description: 'Standardized communication protocols' },
    ],
  },
  {
    category: 'Tools & Infrastructure',
    items: [
      { name: 'Git & GitHub', rarity: 'Legendary', description: 'Version control, branching, and automated CI/CD' },
      { name: 'Vercel / Netlify', rarity: 'Rare', description: 'Edge deployment and production hosting' },
      { name: 'Figma', rarity: 'Rare', description: 'Interface wireframing and design systems' },
      { name: 'Unity', rarity: 'Rare', description: 'C# game simulation and asset pipeline' },
    ],
  },
];
