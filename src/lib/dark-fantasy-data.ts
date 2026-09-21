export type WallZone = 'sina' | 'rose' | 'maria' | 'beyond';

export interface Campaign {
  id: string;
  district: string;
  year: string;
  title: string;
  role: string;
  briefing: string;
  stack: string[];
  github?: string;
  liveLink?: string;
  imageLabel: string;
  wallZone?: WallZone;
  era?: 'oldest' | 'mid' | 'newest';
}

export interface ArsenalQuadrant {
  index: string;
  title: string;
  sigil: 'blades' | 'fortress' | 'reticle' | 'spark';
  stack: string[];
  description: string;
}

export const HERO_DATA = {
  callsign: 'Aryo A.P',
  regimentNumber: 'REG. NO. 104',
  tagline: 'SURVEY CORPS OF SOFTWARE',
  headlineTop: 'BEYOND',
  headlineBottom: 'THE WALLS',
  subtitle: 'I am a full stack engineer who builds interfaces for a world that keeps trying to end. Where others see the horizon as a boundary, I read it as a brief.',
  doctrine: '"IF WE DON\'T FIGHT, WE CAN\'T WIN." — THE ONLY DOCTRINE THAT EVER SHIPPED.',
};

export const CREED_DATA = {
  quote: 'I DEDICATE MY HEART TO INTERFACES THAT REFUSE TO FALL — BUILT WITH THE DISCIPLINE OF A SOLDIER AND THE RESTRAINT OF A CARTOGRAPHER.',
  narrativeLeft: 'For years I\'ve operated at the front line of product engineering, turning impossible briefs into shipped territory. My work lives where design ambition meets the brutal constraints of the real: latency, scale, and the human on the other side of the screen who is very tired.',
  narrativeRight: 'I believe an interface is a fortification — every component a wall, every interaction a gate that must hold. I build slowly enough to be certain, and fast enough to matter. Nothing ships that I would not defend.',
  stats: [
    { value: '02+', label: 'YEARS ENLISTED' },
    { value: '06+', label: 'SYSTEMS FIELDED' },
    { value: '100%', label: 'MISSION RELIABILITY' },
  ],
};

export const ARSENAL_DATA: ArsenalQuadrant[] = [
  {
    index: '/ I',
    title: 'FRONTEND VERTICAL MANEUVER',
    sigil: 'blades',
    stack: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Anime.js', 'Lenis'],
    description: 'Motion systems and robust SPAs built to strike fast and hold ground under load.',
  },
  {
    index: '/ II',
    title: 'SYSTEMS & ARCHITECTURE',
    sigil: 'fortress',
    stack: ['Node.js', 'Express', 'Firebase', 'PostgreSQL', 'RESTful APIs'],
    description: 'Design tokens, component fortresses, and state machines that survive the breach of scale.',
  },
  {
    index: '/ III',
    title: 'INTERFACE RECONNAISSANCE',
    sigil: 'reticle',
    stack: ['UI/UX Wireframing', 'Figma Systems', 'Accessibility Audits', 'Responsive Cartography'],
    description: 'Research, accessibility discipline, and interaction design mapping terrain before deployment.',
  },
  {
    index: '/ IV',
    title: 'PERFORMANCE WARFARE',
    sigil: 'spark',
    stack: ['Vite Bundling', 'Core Web Vitals', 'Git CI/CD', 'Unity C#'],
    description: 'Rendering budgets, bundle discipline, and frame rates sharpened to a razor edge.',
  },
];

export const CAMPAIGNS_DATA: Campaign[] = [
  {
    id: 'campaign-kampungku',
    district: 'DISTRICT TROST',
    year: '2024',
    title: 'KampungKu',
    role: 'Mobile Lead Engineer',
    briefing: 'Community management mobile system with role-based auth, financial records, resident directory, and live metrics.',
    stack: ['Flutter', 'Firebase', 'Dart', 'Cloudinary'],
    github: 'https://github.com/aorysan/jawara_kel3',
    imageLabel: 'kampungku.png',
    wallZone: 'rose',
    era: 'mid',
  },
  {
    id: 'campaign-restarea',
    district: 'THE UNDERGROUND',
    year: '2024',
    title: 'Rest Area Business - Idle Tycoon Game',
    role: 'Game Mechanics & Systems',
    briefing: 'Tycoon simulation game built for game jam with passenger flow mechanics, upgrades, and rush-hour management loops.',
    stack: ['Unity', 'C#', 'Game Jam', 'Simulation'],
    github: 'https://github.com/aorysan/rest-area-tycoon',
    liveLink: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746',
    imageLabel: 'Rest Area Tycoon',
    wallZone: 'rose',
    era: 'mid',
  },
  {
    id: 'campaign-trasmart',
    district: 'SHIGANSHINA',
    year: '2024',
    title: 'TrasMart',
    role: 'Full Stack Engineer',
    briefing: 'Production e-commerce storefront deployed on Vercel with catalog navigation, cart management, and responsive UI.',
    stack: ['React', 'TailwindCSS', 'Vercel', 'E-Commerce'],
    github: 'https://github.com/aorysan/trasmart-web',
    liveLink: 'https://trasmart-web.vercel.app/',
    imageLabel: 'TrasMart',
    wallZone: 'maria',
    era: 'newest',
  },
  {
    id: 'campaign-sarpras',
    district: 'DISTRICT KARANES',
    year: '2024',
    title: 'SarPras',
    role: 'Full Stack Engineer',
    briefing: 'Facilities and equipment resource management system with check-in/out workflows and collaborative tracking.',
    stack: ['React', 'Node.js', 'Resource Management'],
    github: 'https://github.com/aorysan/Kel6-SarPras',
    imageLabel: 'sarpras.png',
    wallZone: 'rose',
    era: 'mid',
  },
  {
    id: 'campaign-framework',
    district: 'WALL SINA',
    year: '2023',
    title: 'FrameWork',
    role: 'Systems Architect',
    briefing: 'Modular architecture exploration project demonstrating clean separation of concerns and design pattern implementations.',
    stack: ['Architecture', 'Clean Code', 'TypeScript'],
    github: 'https://github.com/aorysan/frameWork',
    imageLabel: 'framework.png',
    wallZone: 'sina',
    era: 'oldest',
  },
  {
    id: 'campaign-jawara',
    district: 'DISTRICT STOHESS',
    year: '2023',
    title: 'Jawara',
    role: 'Frontend Engineer',
    briefing: 'Organizational operational management web app with activity logging and administrative telemetry dashboard.',
    stack: ['Web Platform', 'Community Management'],
    github: 'https://github.com/aorysan/jawara',
    imageLabel: 'jawara.png',
    wallZone: 'sina',
    era: 'oldest',
  },
];

export const VISION_DATA = {
  titlePrimary: 'SOMEDAY I WILL REACH',
  titleHighlight: 'THE SEA',
  titleSecondary: '— AND FIND, BEYOND IT, ONLY MORE WORK.',
  manifesto: 'My ambition isn\'t a finished product. It\'s a horizon that keeps receding: interfaces that anticipate intent, systems that heal themselves, tooling that lets a single engineer defend an entire wall. I\'m building toward a craft where speed and humanity stop being a trade-off.',
  horizons: [
    { label: 'NEXT', goal: 'Ship high-performance AI-augmented interface frameworks' },
    { label: 'BEYOND', goal: 'Architect distributed resilient open-source tools' },
    { label: 'ALWAYS', goal: 'Refuse the comfort of the wall' },
  ],
};

export const SUMMON_DATA = {
  title: 'SOUND THE HORN.',
  subtitle: 'A new expedition, a stalled system, or a wall that needs rebuilding — send word. I answer every signal fired in earnest.',
  dispatch: 'aryoadiputro@gmail.com',
  station: 'Malang, East Java — remote, worldwide',
  regiment: 'Available for opportunities',
  socials: [
    { label: 'GitHub', url: 'https://github.com/aorysan' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/aryo-adi-putro-1a7b872a4/' },
    { label: 'Itch.io', url: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746' },
  ],
};
