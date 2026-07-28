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
