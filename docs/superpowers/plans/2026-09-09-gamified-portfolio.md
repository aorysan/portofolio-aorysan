# VALKYRIE TERMINAL Gamified Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing portfolio into a gamified, Honkai Impact 3–inspired sci-fi military HUD terminal ("VALKYRIE TERMINAL") with boot sequence, interactive HUD panels, tactical aesthetic, and Web Audio SFX while preserving all existing portfolio data.

**Architecture:** Panel-based single-page HUD architecture where the user boots into a tactical dashboard with 4 core operations panels (Pilot Dossier, Operations Log, Tech Arsenal, Comms Relay) that slide into view via GSAP overlays. Reusable clip-path chamfered panels enforce non-rounded sci-fi corners, complemented by a native Web Audio API sound manager and stop-slop direct copy.

**Tech Stack:** Vite, React 18, TypeScript, TailwindCSS 3, GSAP, Web Audio API, Vitest (test runner), Lucide Icons, Google Fonts (Orbitron, JetBrains Mono, Inter).

## Global Constraints

- **Color Palette**: Locked to 3-accent Cyberpunk HUD system: `--void` (`#0A0A0F`), `--card` (`#12121A`), `--muted-bg` (`#1C1C2E`), `--border` (`#2A2A3A`), `--green` (`#00FF88`), `--cyan` (`#00D4FF`), `--magenta` (`#FF00FF`), `--gold` (`#FFD700`), `--destructive` (`#FF3366`), `--text` (`#E0E0E0`), `--text-muted` (`#94A3B8`).
- **Typography**: `Orbitron` for headings/display, `JetBrains Mono` for monospace/data/terminal, `Inter` for body.
- **Corners**: 45° chamfered corners via CSS `clip-path: polygon(...)`, strictly no `border-radius` on panels/cards.
- **Depth & Visuals**: Border OR glow (never both heavy on the same element). No gradient text. No decorative glass/blur (only functional overlays). No section numbering (01/02). No emoji icons (Lucide SVG line-art only).
- **Sound**: Web Audio API native synthesis fallback + royalty-free SFX; audio defaults to muted (`isMuted: true`), persisted in `localStorage`.
- **Content Integrity**: Retain all existing project links, repository links, contact details, and tech skills.
- **Tone (stop-slop)**: Direct, active voice, concrete metrics, no AI filler, no adverbs, no em dashes.

---

### Task 1: Test Infrastructure & Design System Tokens Setup

**Files:**
- Modify: `package.json`
- Modify: `index.html:8`
- Modify: `tailwind.config.ts:16-65`
- Modify: `src/index.css:7-70`
- Create: `src/styles/gamified.css`
- Create: `src/test/setup.ts`
- Create: `src/test/design-tokens.test.ts`

**Interfaces:**
- Consumes: TailwindCSS, PostCSS.
- Produces: CSS utility classes `.chamfer`, `.chamfer-sm`, `.glow-green`, `.glow-cyan`, `.glow-magenta`, `.glow-gold`, `.void-grid`, and font classes `font-display` (Orbitron), `font-mono` (JetBrains Mono).

- [ ] **Step 1: Write the failing test**

Create `src/test/design-tokens.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens and Styling Setup', () => {
  it('should include Orbitron font in index.html', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8');
    expect(html).toContain('Orbitron:wght@400;500;600;700;800;900');
  });

  it('should define the 3-accent sci-fi palette variables in index.css', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');
    expect(css).toContain('--void: #0A0A0F');
    expect(css).toContain('--green: #00FF88');
    expect(css).toContain('--cyan: #00D4FF');
    expect(css).toContain('--magenta: #FF00FF');
    expect(css).toContain('--gold: #FFD700');
  });

  it('should define chamfer and glow utilities in gamified.css', () => {
    const gamifiedCss = fs.readFileSync(path.resolve(__dirname, '../styles/gamified.css'), 'utf-8');
    expect(gamifiedCss).toContain('.chamfer');
    expect(gamifiedCss).toContain('.chamfer-sm');
    expect(gamifiedCss).toContain('.glow-green');
    expect(gamifiedCss).toContain('.void-grid');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/design-tokens.test.ts`
Expected: FAIL with "vitest not found" or "Cannot find file".

- [ ] **Step 3: Write minimal implementation**

1. Install `vitest` and `@testing-library/react` as dev dependencies, and add test script to `package.json`:
Add to `package.json` `scripts`:
```json
"test": "vitest run"
```
And add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` into `devDependencies`.

2. Update `index.html` line 8:
```html
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

3. Update `tailwind.config.ts` font families:
```typescript
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
```

4. Update `src/index.css`:
```css
@import './styles/gamified.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --void: #0A0A0F;
    --card: #12121A;
    --muted-bg: #1C1C2E;
    --border: #2A2A3A;
    --green: #00FF88;
    --cyan: #00D4FF;
    --magenta: #FF00FF;
    --gold: #FFD700;
    --destructive: #FF3366;
    --text: #E0E0E0;
    --text-muted: #94A3B8;
    --text-dim: #6B7280;

    --background: 240 20% 5%;
    --foreground: 0 0% 88%;
    --card-foreground: 0 0% 88%;
    --primary: 152 100% 50%;
    --primary-foreground: 240 20% 5%;
    --secondary: 191 100% 50%;
    --secondary-foreground: 240 20% 5%;
    --accent: 300 100% 50%;
    --accent-foreground: 0 0% 100%;
    --muted: 240 24% 15%;
    --muted-foreground: 215 20% 65%;
  }

  body {
    background-color: var(--void);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }
}
```

5. Create `src/styles/gamified.css`:
```css
/* Chamfer cut corners via clip-path */
.chamfer {
  clip-path: polygon(
    12px 0,
    100% 0,
    100% calc(100% - 12px),
    calc(100% - 12px) 100%,
    0 100%,
    0 12px
  );
}

.chamfer-sm {
  clip-path: polygon(
    6px 0,
    100% 0,
    100% calc(100% - 6px),
    calc(100% - 6px) 100%,
    0 100%,
    0 6px
  );
}

/* Tactical Sub-pixel Grid */
.void-grid {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.024) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.024) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Glow Utilities */
.glow-green {
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.3);
}

.glow-cyan {
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
}

.glow-magenta {
  box-shadow: 0 0 12px rgba(255, 0, 255, 0.25);
}

.glow-gold {
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
}

/* Glitch text effect keyframes */
@keyframes glitch-anim {
  0% { transform: translate(0); clip-path: inset(0 0 0 0); }
  20% { transform: translate(-2px, 1px); clip-path: inset(10% 0 30% 0); }
  40% { transform: translate(2px, -1px); clip-path: inset(40% 0 10% 0); }
  60% { transform: translate(-1px, 2px); clip-path: inset(20% 0 50% 0); }
  80% { transform: translate(1px, -2px); clip-path: inset(60% 0 5% 0); }
  100% { transform: translate(0); clip-path: inset(0 0 0 0); }
}

.animate-glitch {
  animation: glitch-anim 0.3s ease infinite alternate;
}
```

6. Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS 3 tests.

- [ ] **Step 5: Commit**

```bash
git add package.json index.html tailwind.config.ts src/index.css src/styles/gamified.css src/test/
git commit -m "feat(tokens): setup testing, 3-accent color tokens, orbitron font, and gamified css utilities"
```

---

### Task 2: Gamified Constants & Extended Data Model

**Files:**
- Modify: `src/lib/constants.ts`
- Create: `src/test/constants.test.ts`

**Interfaces:**
- Consumes: existing `Project`, `Highlight`, `Stat`, `Journey` types.
- Produces: `MISSION_DATA`, `TECH_ARSENAL`, `PILOT_DOSSIER`, `APTITUDES`, `SERVICE_RECORDS`, `DifficultyRating`, `TechRarity`.

- [ ] **Step 1: Write the failing test**

Create `src/test/constants.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  PILOT_DOSSIER,
  MISSIONS_DATA,
  TECH_ARSENAL,
  APTITUDES,
  SERVICE_RECORDS,
} from '../lib/constants';

describe('Gamified Constants', () => {
  it('should have complete PILOT_DOSSIER data matching stop-slop rules', () => {
    expect(PILOT_DOSSIER.callsign).toBe('ARYO ADI PUTRO');
    expect(PILOT_DOSSIER.role).toBe('FULL STACK DEVELOPER');
    expect(PILOT_DOSSIER.location).toBe('MALANG, JAWA TIMUR');
    expect(PILOT_DOSSIER.status).toBe('AVAILABLE');
  });

  it('should define all missions with mapped difficulty ratings', () => {
    expect(MISSIONS_DATA.length).toBeGreaterThanOrEqual(6);
    const kampungku = MISSIONS_DATA.find((m) => m.title === 'KampungKu');
    expect(kampungku).toBeDefined();
    expect(kampungku?.difficulty).toBe(4);
    expect(kampungku?.status).toBe('COMPLETED');
  });

  it('should define tech items with assigned rarities', () => {
    const reactTech = TECH_ARSENAL.flatMap((cat) => cat.items).find((i) => i.name === 'React & Next.js');
    expect(reactTech).toBeDefined();
    expect(reactTech?.rarity).toBe('Legendary');
  });

  it('should define aptitudes with alternating cyan and magenta colors', () => {
    expect(APTITUDES.length).toBe(4);
    expect(APTITUDES[0].color).toBe('#00D4FF');
    expect(APTITUDES[1].color).toBe('#FF00FF');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/constants.test.ts`
Expected: FAIL with missing exports in `constants.ts`.

- [ ] **Step 3: Write minimal implementation**

Update `src/lib/constants.ts` to export the new gamified structures while keeping all original data intact:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/constants.test.ts`
Expected: PASS 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts src/test/constants.test.ts
git commit -m "feat(constants): add gamified mission, arsenal, pilot dossier, and aptitude data structures"
```

---

### Task 3: Web Audio Engine & Audio Hooks

**Files:**
- Create: `src/lib/sounds.ts`
- Create: `src/hooks/useSoundEffect.ts`
- Create: `src/components/gamified/SoundManager.tsx`
- Create: `src/test/sounds.test.ts`

**Interfaces:**
- Consumes: Native Web Audio API (`AudioContext`).
- Produces: `SOUNDS` dictionary, `playSyntheticSound(type)`, `useSound()`, `useSoundEffect(key)`, `<SoundProvider>`.

- [ ] **Step 1: Write the failing test**

Create `src/test/sounds.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SOUNDS, playSyntheticSound } from '../lib/sounds';

describe('Sound Registry and Synthetic Audio Engine', () => {
  it('should define all 7 required sound keys', () => {
    expect(SOUNDS.BOOT_TYPE).toBe('/audio/boot-type.mp3');
    expect(SOUNDS.BOOT_COMPLETE).toBe('/audio/boot-done.mp3');
    expect(SOUNDS.UI_HOVER).toBe('/audio/ui-hover.mp3');
    expect(SOUNDS.UI_CLICK).toBe('/audio/ui-click.mp3');
    expect(SOUNDS.PANEL_OPEN).toBe('/audio/panel-open.mp3');
    expect(SOUNDS.PANEL_CLOSE).toBe('/audio/panel-close.mp3');
    expect(SOUNDS.AMBIENT).toBe('/audio/ambient-loop.mp3');
  });

  it('should safely execute playSyntheticSound without crashing in headless environment', () => {
    expect(() => playSyntheticSound('UI_CLICK')).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/sounds.test.ts`
Expected: FAIL with "Cannot find module '../lib/sounds'".

- [ ] **Step 3: Write minimal implementation**

1. Create `src/lib/sounds.ts`:
```typescript
export const SOUNDS = {
  BOOT_TYPE: '/audio/boot-type.mp3',
  BOOT_COMPLETE: '/audio/boot-done.mp3',
  UI_HOVER: '/audio/ui-hover.mp3',
  UI_CLICK: '/audio/ui-click.mp3',
  PANEL_OPEN: '/audio/panel-open.mp3',
  PANEL_CLOSE: '/audio/panel-close.mp3',
  AMBIENT: '/audio/ambient-loop.mp3',
} as const;

export type SoundKey = keyof typeof SOUNDS;

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

export function playSyntheticSound(key: SoundKey) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  switch (key) {
    case 'UI_HOVER':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'UI_CLICK':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
      break;

    case 'PANEL_OPEN':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;

    case 'PANEL_CLOSE':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
      break;

    case 'BOOT_TYPE':
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
      break;

    case 'BOOT_COMPLETE':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;

    default:
      break;
  }
}
```

2. Create `src/components/gamified/SoundManager.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SOUNDS, playSyntheticSound, SoundKey } from '@/lib/sounds';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (key: SoundKey) => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playSound: () => {},
});

const STORAGE_KEY = 'valkyrie_terminal_muted';

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playSound = useCallback((key: SoundKey) => {
    if (isMuted) return;
    playSyntheticSound(key);
  }, [isMuted]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
```

3. Create `src/hooks/useSoundEffect.ts`:
```typescript
import { useCallback } from 'react';
import { useSound } from '@/components/gamified/SoundManager';
import { SoundKey } from '@/lib/sounds';

export function useSoundEffect(key: SoundKey) {
  const { playSound, isMuted } = useSound();
  
  const play = useCallback(() => {
    playSound(key);
  }, [playSound, key]);

  return { play, isMuted };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/sounds.test.ts`
Expected: PASS 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sounds.ts src/hooks/useSoundEffect.ts src/components/gamified/SoundManager.tsx src/test/sounds.test.ts
git commit -m "feat(audio): implement Web Audio API sound manager, synthetic SFX synthesizer, and useSoundEffect hook"
```

---

### Task 4: Core Tactical UI Primitives (ChamferedPanel, GridBackground, GlitchText, StatBar, useTypewriter)

**Files:**
- Create: `src/hooks/useTypewriter.ts`
- Create: `src/components/gamified/ChamferedPanel.tsx`
- Create: `src/components/gamified/GridBackground.tsx`
- Create: `src/components/gamified/GlitchText.tsx`
- Create: `src/components/gamified/StatBar.tsx`
- Create: `src/test/primitives.test.tsx`

**Interfaces:**
- Consumes: `gsap`, `gamified.css`.
- Produces: `<ChamferedPanel>`, `<GridBackground>`, `<GlitchText>`, `<StatBar>`, `useTypewriter`.

- [ ] **Step 1: Write the failing test**

Create `src/test/primitives.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChamferedPanel from '../components/gamified/ChamferedPanel';
import GlitchText from '../components/gamified/GlitchText';
import StatBar from '../components/gamified/StatBar';

describe('Tactical UI Primitives', () => {
  it('should render ChamferedPanel with chamfer class and child content', () => {
    const { container } = render(
      <ChamferedPanel size="md" glow="green" data-testid="panel">
        <div>Terminal Data</div>
      </ChamferedPanel>
    );
    expect(screen.getByText('Terminal Data')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('chamfer');
    expect(container.firstChild).toHaveClass('glow-green');
  });

  it('should render GlitchText with text attribute', () => {
    render(<GlitchText text="SYSTEM ACTIVE" as="h1" />);
    expect(screen.getByText('SYSTEM ACTIVE')).toBeInTheDocument();
  });

  it('should render StatBar with proper label and percentage', () => {
    render(<StatBar label="Architecture" value={85} color="#00D4FF" />);
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/primitives.test.tsx`
Expected: FAIL with module not found errors.

- [ ] **Step 3: Write minimal implementation**

1. Create `src/hooks/useTypewriter.ts`:
```typescript
import { useState, useEffect } from 'react';

export function useTypewriter(
  lines: string[],
  charSpeed: number = 30,
  lineDelay: number = 250,
  onComplete?: () => void
) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    const currentTargetLine = lines[currentLineIndex];

    if (currentCharIndex < currentTargetLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = currentTargetLine.slice(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, charSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, lines, charSpeed, lineDelay, onComplete]);

  const skip = () => {
    setDisplayedLines(lines);
    setCurrentLineIndex(lines.length);
    setIsFinished(true);
    onComplete?.();
  };

  return { displayedLines, isFinished, skip };
}
```

2. Create `src/components/gamified/ChamferedPanel.tsx`:
```typescript
import React from 'react';

interface ChamferedPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md';
  glow?: 'green' | 'cyan' | 'magenta' | 'gold' | 'none';
  borderVariant?: 'default' | 'highlight' | 'none';
  children: React.ReactNode;
}

const ChamferedPanel: React.FC<ChamferedPanelProps> = ({
  size = 'md',
  glow = 'none',
  borderVariant = 'default',
  className = '',
  children,
  ...props
}) => {
  const chamferClass = size === 'sm' ? 'chamfer-sm' : 'chamfer';
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';
  const borderClass =
    borderVariant === 'highlight'
      ? 'border border-[#00FF88]/60'
      : borderVariant === 'default'
      ? 'border border-[#2A2A3A]'
      : '';

  return (
    <div
      className={`bg-[#12121A] text-[#E0E0E0] ${chamferClass} ${borderClass} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ChamferedPanel;
```

3. Create `src/components/gamified/GridBackground.tsx`:
```typescript
import React from 'react';

const GridBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 void-grid"
      aria-hidden="true"
    />
  );
};

export default GridBackground;
```

4. Create `src/components/gamified/GlitchText.tsx`:
```typescript
import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  className?: string;
  glitchOnHover?: boolean;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  glitchOnHover = true,
}) => {
  return (
    <Component
      data-text={text}
      className={`font-display tracking-wider ${
        glitchOnHover ? 'hover:animate-glitch' : ''
      } ${className}`}
    >
      {text}
    </Component>
  );
};

export default GlitchText;
```

5. Create `src/components/gamified/StatBar.tsx`:
```typescript
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StatBarProps {
  label: string;
  value: number;
  color?: '#00D4FF' | '#FF00FF' | '#00FF88';
}

const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  color = '#00D4FF',
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'expo.out', transformOrigin: 'left' }
      );
    }
  }, [value]);

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs font-mono tracking-widest text-[#94A3B8]">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 w-full bg-[#1C1C2E] overflow-hidden">
        <div
          ref={barRef}
          className="h-full"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default StatBar;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/primitives.test.tsx`
Expected: PASS 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTypewriter.ts src/components/gamified/ChamferedPanel.tsx src/components/gamified/GridBackground.tsx src/components/gamified/GlitchText.tsx src/components/gamified/StatBar.tsx src/test/primitives.test.tsx
git commit -m "feat(ui): add tactical primitives: ChamferedPanel, GridBackground, GlitchText, StatBar, and useTypewriter"
```

---

### Task 5: Boot Sequence Screen

**Files:**
- Create: `src/components/gamified/BootSequence.tsx`
- Create: `src/test/BootSequence.test.tsx`

**Interfaces:**
- Consumes: `useTypewriter`, `useSoundEffect`, `PILOT_DOSSIER`.
- Produces: `<BootSequence onComplete={() => void} />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/BootSequence.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BootSequence from '../components/gamified/BootSequence';

describe('BootSequence Component', () => {
  it('should render skip button and terminal prompt', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    expect(screen.getByRole('button', { name: /skip initialization/i })).toBeInTheDocument();
  });

  it('should trigger onComplete when Skip button is clicked', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    const skipBtn = screen.getByRole('button', { name: /skip initialization/i });
    fireEvent.click(skipBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/BootSequence.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/BootSequence'".

- [ ] **Step 3: Write minimal implementation**

Create `src/components/gamified/BootSequence.tsx`:
```typescript
import React, { useEffect, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { PILOT_DOSSIER } from '@/lib/constants';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  '[SYSTEM] Initializing VALKYRIE Terminal v3.2.1...',
  '[CORE] Loading neural interface.............. OK',
  `[SCAN] Pilot identification: ${PILOT_DOSSIER.callsign}`,
  `[AUTH] Access level: ${PILOT_DOSSIER.role}`,
  '[LINK] Establishing secure connection......... OK',
  '[BOOT] All systems nominal.',
  '> Welcome, Captain.',
];

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const { play: playTypeSound } = useSoundEffect('BOOT_TYPE');
  const { play: playDoneSound } = useSoundEffect('BOOT_COMPLETE');
  const [progress, setProgress] = useState(0);

  const handleDone = () => {
    playDoneSound();
    onComplete();
  };

  const { displayedLines, skip } = useTypewriter(BOOT_LOGS, 25, 200, handleDone);

  useEffect(() => {
    if (displayedLines.length > 0) {
      playTypeSound();
      setProgress(Math.round((displayedLines.length / BOOT_LOGS.length) * 100));
    }
  }, [displayedLines.length, playTypeSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        skip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skip]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#0A0A0F] text-[#00FF88] font-mono cursor-pointer select-none"
      onClick={skip}
      role="region"
      aria-label="System Boot Sequence"
    >
      <div className="flex justify-between items-center text-xs tracking-widest text-[#94A3B8]">
        <span>VALKYRIE TERMINAL OS // BOOT_SEQ</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="px-3 py-1 text-xs uppercase tracking-wider text-[#00D4FF] border border-[#00D4FF]/40 hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 transition-colors"
          aria-label="Skip initialization"
        >
          [ SKIP INIT ]
        </button>
      </div>

      <div className="max-w-2xl space-y-2 text-sm sm:text-base leading-relaxed">
        {displayedLines.map((line, idx) => (
          <div key={idx} className={idx === displayedLines.length - 1 ? 'text-[#00FF88]' : 'text-[#E0E0E0]/80'}>
            {line}
          </div>
        ))}
        <div className="inline-block w-2 h-4 bg-[#00FF88] animate-pulse ml-1 align-middle" />
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs tracking-widest text-[#94A3B8]">
          <span>DIAGNOSTIC STATUS</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full bg-[#1C1C2E] overflow-hidden">
          <div
            className="h-full bg-[#00FF88] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/BootSequence.test.tsx`
Expected: PASS 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/BootSequence.tsx src/test/BootSequence.test.tsx
git commit -m "feat(boot): implement BootSequence terminal loading screen with diagnostics and skip functionality"
```

---

### Task 6: Top HUD Navigation Bar

**Files:**
- Create: `src/components/gamified/HUDNav.tsx`
- Create: `src/test/HUDNav.test.tsx`

**Interfaces:**
- Consumes: `useSound`.
- Produces: `<HUDNav activePanel={string | null} onSelectPanel={(id) => void} />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/HUDNav.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HUDNav from '../components/gamified/HUDNav';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('HUDNav Component', () => {
  it('should display VALKYRIE TERMINAL brand and audio toggle button', () => {
    render(
      <SoundProvider>
        <HUDNav activePanel={null} onSelectPanel={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText(/VALKYRIE TERMINAL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle audio/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/HUDNav.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/HUDNav'".

- [ ] **Step 3: Write minimal implementation**

Create `src/components/gamified/HUDNav.tsx`:
```typescript
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { useSound } from '@/components/gamified/SoundManager';

interface HUDNavProps {
  activePanel: string | null;
  onSelectPanel: (panel: string | null) => void;
}

const HUDNav: React.FC<HUDNavProps> = ({ activePanel, onSelectPanel }) => {
  const { isMuted, toggleMute } = useSound();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0A0A0F]/80 backdrop-blur border-b border-[#00D4FF]/20 px-6 sm:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Radio className="w-5 h-5 text-[#00FF88] animate-pulse" />
        <button
          onClick={() => onSelectPanel(null)}
          className="font-mono text-sm tracking-widest text-[#E0E0E0] hover:text-[#00D4FF] transition-colors"
        >
          VALKYRIE TERMINAL <span className="text-[#00FF88] text-xs">v3.2</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-6 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
          <span>NET_ONLINE</span>
        </div>
        <div>SYS_TIME: {time}</div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleMute}
          className="p-2 text-[#E0E0E0] hover:text-[#00FF88] border border-[#2A2A3A] hover:border-[#00FF88] transition-colors chamfer-sm"
          aria-label="Toggle audio"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#94A3B8]" /> : <Volume2 className="w-4 h-4 text-[#00FF88]" />}
        </button>
      </div>
    </header>
  );
};

export default HUDNav;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/HUDNav.test.tsx`
Expected: PASS 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/HUDNav.tsx src/test/HUDNav.test.tsx
git commit -m "feat(nav): add HUDNav top telemetry bar with status indicator and audio controls"
```

---

### Task 7: Pilot Dossier (Character Profile)

**Files:**
- Create: `src/components/gamified/CharacterProfile.tsx`
- Create: `src/test/CharacterProfile.test.tsx`

**Interfaces:**
- Consumes: `PILOT_DOSSIER`, `APTITUDES`, `SERVICE_RECORDS`, `ChamferedPanel`, `StatBar`.
- Produces: `<CharacterProfile onClose={() => void} />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/CharacterProfile.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterProfile from '../components/gamified/CharacterProfile';

describe('CharacterProfile Component', () => {
  it('should render pilot identity and service record metrics', () => {
    render(<CharacterProfile onClose={vi.fn()} />);
    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('ARYO ADI PUTRO')).toBeInTheDocument();
    expect(screen.getByText('SERVICE RECORD')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/CharacterProfile.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/CharacterProfile'".

- [ ] **Step 3: Write minimal implementation**

Create `src/components/gamified/CharacterProfile.tsx`:
```typescript
import React from 'react';
import { ArrowLeft, User, MapPin, Activity } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import StatBar from '@/components/gamified/StatBar';
import { PILOT_DOSSIER, APTITUDES, SERVICE_RECORDS } from '@/lib/constants';

interface CharacterProfileProps {
  onClose: () => void;
}

const DEPLOYMENT_LOGS = [
  { period: '2022', title: 'Tactical Foundations', desc: 'Began software engineering with HTML, CSS, and modern JavaScript.' },
  { period: '2023', title: 'First Operations', desc: 'Built first full-stack platforms and participated in game development jams.' },
  { period: '2024', title: 'Skill Expansion', desc: 'Mastered production React, TypeScript, and distributed cloud workflows.' },
  { period: 'ACTIVE', title: 'Combat Ready', desc: 'Continuously shipping high-reliability web systems.' },
];

const CharacterProfile: React.FC<CharacterProfileProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">PILOT DOSSIER // SEC-01</span>
      </div>

      <ChamferedPanel size="md" className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto md:mx-0 border border-[#00D4FF]/40 chamfer flex items-center justify-center bg-[#1C1C2E]">
            <User className="w-16 h-16 text-[#00D4FF]" />
          </div>

          <div className="md:col-span-2 space-y-3 text-center md:text-left font-mono">
            <h2 className="font-display text-2xl font-bold text-[#E0E0E0] tracking-wide">
              {PILOT_DOSSIER.callsign}
            </h2>
            <p className="text-sm text-[#00FF88]">{PILOT_DOSSIER.role}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#00D4FF]" /> {PILOT_DOSSIER.location}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#00FF88]" /> STATUS: {PILOT_DOSSIER.status}
              </span>
            </div>
            <p className="text-xs font-sans text-[#E0E0E0]/80 leading-relaxed pt-2 border-t border-[#2A2A3A]">
              {PILOT_DOSSIER.bio}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <h3 className="font-display text-xs tracking-widest text-[#00D4FF]">── APTITUDE MATRIX</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APTITUDES.map((apt) => (
              <StatBar key={apt.label} label={apt.label} value={apt.value} color={apt.color} />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <h3 className="font-display text-xs tracking-widest text-[#00FF88]">── SERVICE RECORD</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SERVICE_RECORDS.map((stat) => (
              <ChamferedPanel key={stat.label} size="sm" className="p-3 text-center">
                <div className="font-display text-xl font-bold text-[#00D4FF]">{stat.value}</div>
                <div className="text-[10px] font-mono text-[#94A3B8] tracking-wider">{stat.label}</div>
              </ChamferedPanel>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <h3 className="font-display text-xs tracking-widest text-[#FF00FF]">── DEPLOYMENT LOG</h3>
          <div className="space-y-3 font-mono text-xs">
            {DEPLOYMENT_LOGS.map((log) => (
              <div key={log.period} className="flex gap-4 items-start p-2 hover:bg-[#1C1C2E]/40 transition-colors">
                <span className="text-[#00FF88] w-16 shrink-0">{log.period}</span>
                <div>
                  <div className="text-[#E0E0E0] font-bold">{log.title}</div>
                  <div className="text-[#94A3B8] text-[11px] font-sans">{log.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChamferedPanel>
    </div>
  );
};

export default CharacterProfile;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/CharacterProfile.test.tsx`
Expected: PASS 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/CharacterProfile.tsx src/test/CharacterProfile.test.tsx
git commit -m "feat(profile): add Pilot Dossier character profile with aptitudes, service record, and deployment history"
```

---

### Task 8: Operations Log (MissionLog & MissionCard)

**Files:**
- Create: `src/components/gamified/MissionCard.tsx`
- Create: `src/components/gamified/MissionLog.tsx`
- Create: `src/test/MissionLog.test.tsx`

**Interfaces:**
- Consumes: `MISSIONS_DATA`, `Mission`, `ChamferedPanel`, `useSoundEffect`.
- Produces: `<MissionLog onClose={() => void} />`, `<MissionCard mission={Mission} />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/MissionLog.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MissionLog from '../components/gamified/MissionLog';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('MissionLog Component', () => {
  it('should render mission titles and difficulty diamonds', () => {
    render(
      <SoundProvider>
        <MissionLog onClose={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText('OPERATIONS LOG')).toBeInTheDocument();
    expect(screen.getByText('KampungKu')).toBeInTheDocument();
    expect(screen.getByText('Rest Area Business - Idle Tycoon Game')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/MissionLog.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/MissionLog'".

- [ ] **Step 3: Write minimal implementation**

1. Create `src/components/gamified/MissionCard.tsx`:
```typescript
import React from 'react';
import { ExternalLink, Github, Crosshair } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import { Mission } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface MissionCardProps {
  mission: Mission;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  const { play: playHover } = useSoundEffect('UI_HOVER');

  return (
    <ChamferedPanel
      size="md"
      onMouseEnter={playHover}
      className="p-5 flex flex-col justify-between hover:border-[#00FF88] transition-all duration-200"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 text-[#FF00FF] text-xs font-mono">
            <span>DIFF:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < mission.difficulty ? 'text-[#FF00FF]' : 'text-[#2A2A3A]'}>
                ◆
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#00FF88] border border-[#00FF88]/40 px-2 py-0.5 chamfer-sm">
            {mission.status}
          </span>
        </div>

        <div className="h-32 bg-[#1C1C2E] border border-[#2A2A3A] chamfer-sm overflow-hidden flex items-center justify-center relative group">
          {mission.thumbnail ? (
            <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#94A3B8]">
              <Crosshair className="w-6 h-6 text-[#00D4FF]/60" />
              <span className="text-[10px] font-mono uppercase">{mission.imageLabel}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-display text-base font-bold text-[#E0E0E0] tracking-wide">
            {mission.title}
          </h4>
          <p className="text-xs font-sans text-[#94A3B8] leading-relaxed mt-1">
            {mission.briefing}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {mission.rewards.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/5 border border-[#00D4FF]/20 px-2 py-0.5 chamfer-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#2A2A3A]">
        {mission.repoLink && (
          <a
            href={mission.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-mono text-[#00D4FF] border border-[#00D4FF]/40 hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 chamfer-sm transition-colors"
          >
            <Github className="w-3.5 h-3.5" /> REPO
          </a>
        )}
        {mission.liveLink && (
          <a
            href={mission.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-mono text-[#00FF88] border border-[#00FF88]/40 hover:border-[#00FF88] hover:bg-[#00FF88]/10 chamfer-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> DEPLOY
          </a>
        )}
      </div>
    </ChamferedPanel>
  );
};

export default MissionCard;
```

2. Create `src/components/gamified/MissionLog.tsx`:
```typescript
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import MissionCard from '@/components/gamified/MissionCard';
import { MISSIONS_DATA } from '@/lib/constants';

interface MissionLogProps {
  onClose: () => void;
}

const MissionLog: React.FC<MissionLogProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">OPERATIONS LOG // SEC-02</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MISSIONS_DATA.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
};

export default MissionLog;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/MissionLog.test.tsx`
Expected: PASS 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/MissionCard.tsx src/components/gamified/MissionLog.tsx src/test/MissionLog.test.tsx
git commit -m "feat(missions): add Operations Log mission grid and MissionCard with difficulty diamonds and tech badges"
```

---

### Task 9: Tech Arsenal (EquipmentInventory & EquipmentCard)

**Files:**
- Create: `src/components/gamified/EquipmentCard.tsx`
- Create: `src/components/gamified/EquipmentInventory.tsx`
- Create: `src/test/EquipmentInventory.test.tsx`

**Interfaces:**
- Consumes: `TECH_ARSENAL`, `EquipmentItem`, `ChamferedPanel`, `useSoundEffect`.
- Produces: `<EquipmentInventory onClose={() => void} />`, `<EquipmentCard item={EquipmentItem} />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/EquipmentInventory.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EquipmentInventory from '../components/gamified/EquipmentInventory';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('EquipmentInventory Component', () => {
  it('should render equipment tabs and inventory items', () => {
    render(
      <SoundProvider>
        <EquipmentInventory onClose={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText('TECH ARSENAL')).toBeInTheDocument();
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/EquipmentInventory.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/EquipmentInventory'".

- [ ] **Step 3: Write minimal implementation**

1. Create `src/components/gamified/EquipmentCard.tsx`:
```typescript
import React from 'react';
import { Shield } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import { EquipmentItem, TechRarity } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface EquipmentCardProps {
  item: EquipmentItem;
}

const RARITY_STYLES: Record<TechRarity, { border: string; glow: string; text: string }> = {
  Common: { border: 'border-[#2A2A3A]', glow: '', text: 'text-[#94A3B8]' },
  Rare: { border: 'border-[#00D4FF]/60', glow: 'glow-cyan', text: 'text-[#00D4FF]' },
  Epic: { border: 'border-[#FF00FF]/60', glow: 'glow-magenta', text: 'text-[#FF00FF]' },
  Legendary: { border: 'border-[#FFD700]/70', glow: 'glow-gold', text: 'text-[#FFD700]' },
};

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item }) => {
  const { play: playHover } = useSoundEffect('UI_HOVER');
  const style = RARITY_STYLES[item.rarity];

  return (
    <ChamferedPanel
      size="sm"
      onMouseEnter={playHover}
      className={`p-4 flex flex-col justify-between border ${style.border} ${style.glow} hover:bg-[#1C1C2E]/60 transition-all duration-200`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Shield className={`w-4 h-4 ${style.text}`} />
          <span className={`text-[10px] font-mono uppercase tracking-widest ${style.text}`}>
            {item.rarity}
          </span>
        </div>
        <h4 className="font-display text-sm font-bold text-[#E0E0E0]">
          {item.name}
        </h4>
        <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
          {item.description}
        </p>
      </div>
    </ChamferedPanel>
  );
};

export default EquipmentCard;
```

2. Create `src/components/gamified/EquipmentInventory.tsx`:
```typescript
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import EquipmentCard from '@/components/gamified/EquipmentCard';
import { TECH_ARSENAL } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface EquipmentInventoryProps {
  onClose: () => void;
}

const EquipmentInventory: React.FC<EquipmentInventoryProps> = ({ onClose }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const { play: playClick } = useSoundEffect('UI_CLICK');

  const activeCategory = TECH_ARSENAL[activeCategoryIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">TECH ARSENAL // SEC-03</span>
      </div>

      <div className="flex gap-4 border-b border-[#2A2A3A] overflow-x-auto pb-2">
        {TECH_ARSENAL.map((cat, idx) => (
          <button
            key={cat.category}
            onClick={() => {
              playClick();
              setActiveCategoryIndex(idx);
            }}
            className={`text-xs font-mono tracking-wider py-2 px-3 transition-colors border-b-2 whitespace-nowrap ${
              idx === activeCategoryIndex
                ? 'border-[#00FF88] text-[#00FF88]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E0E0E0]'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeCategory.items.map((item) => (
          <EquipmentCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};

export default EquipmentInventory;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/EquipmentInventory.test.tsx`
Expected: PASS 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/EquipmentCard.tsx src/components/gamified/EquipmentInventory.tsx src/test/EquipmentInventory.test.tsx
git commit -m "feat(arsenal): add EquipmentInventory category browser and EquipmentCard with 4-tier rarity system"
```

---

### Task 10: Comms Relay Terminal

**Files:**
- Create: `src/components/gamified/CommsTerminal.tsx`
- Create: `src/test/CommsTerminal.test.tsx`

**Interfaces:**
- Consumes: `ChamferedPanel`, `useSoundEffect`, `EMAIL`, `GITHUB_URL`, `LINKEDIN_URL`.
- Produces: `<CommsTerminal onClose={() => void} />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/CommsTerminal.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommsTerminal from '../components/gamified/CommsTerminal';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('CommsTerminal Component', () => {
  it('should render military comms relay with CALLSIGN, FREQUENCY, and TRANSMIT button', () => {
    render(
      <SoundProvider>
        <CommsTerminal onClose={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText('COMMS RELAY')).toBeInTheDocument();
    expect(screen.getByLabelText(/callsign/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transmit/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/CommsTerminal.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/CommsTerminal'".

- [ ] **Step 3: Write minimal implementation**

Create `src/components/gamified/CommsTerminal.tsx`:
```typescript
import React, { useState } from 'react';
import { ArrowLeft, Mail, Github, Linkedin, Send } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface CommsTerminalProps {
  onClose: () => void;
}

const CommsTerminal: React.FC<CommsTerminalProps> = ({ onClose }) => {
  const [callsign, setCallsign] = useState('');
  const [frequency, setFrequency] = useState('');
  const [transmission, setTransmission] = useState('');
  const [sent, setSent] = useState(false);
  const { play: playClick } = useSoundEffect('UI_CLICK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const mailtoLink = `mailto:${EMAIL}?subject=Transmission from ${callsign}&body=Frequency: ${frequency}%0D%0A%0D%0A${transmission}`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">COMMS RELAY // SEC-04</span>
      </div>

      <ChamferedPanel size="md" className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-[#E0E0E0]">COMMS RELAY</h2>
          <p className="font-mono text-xs text-[#00FF88]">&gt; CHANNEL OPEN — AWAITING TRANSMISSION</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label htmlFor="callsign" className="block text-[#00D4FF] tracking-wider">
              CALLSIGN (NAME)
            </label>
            <input
              id="callsign"
              type="text"
              required
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder="CAPT. OBSERVER"
              className="w-full bg-[#12121A] border-b border-[#2A2A3A] focus:border-[#00FF88] p-2 text-[#E0E0E0] outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="frequency" className="block text-[#00D4FF] tracking-wider">
              FREQUENCY (EMAIL)
            </label>
            <input
              id="frequency"
              type="email"
              required
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="observer@domain.com"
              className="w-full bg-[#12121A] border-b border-[#2A2A3A] focus:border-[#00FF88] p-2 text-[#E0E0E0] outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="transmission" className="block text-[#00D4FF] tracking-wider">
              TRANSMISSION MESSAGE
            </label>
            <textarea
              id="transmission"
              required
              rows={4}
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              placeholder="Enter briefing message here..."
              className="w-full bg-[#12121A] border-b border-[#2A2A3A] focus:border-[#00FF88] p-2 text-[#E0E0E0] outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-display tracking-widest text-xs uppercase text-[#00FF88] border border-[#00FF88]/50 hover:border-[#00FF88] hover:bg-[#00FF88]/10 chamfer transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> [ TRANSMIT ]
          </button>
        </form>

        <div className="pt-6 border-t border-[#2A2A3A] space-y-3">
          <h3 className="font-mono text-xs tracking-widest text-[#94A3B8]">NETWORK NODES</h3>
          <div className="flex flex-wrap gap-4 font-mono text-xs">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
            >
              <Github className="w-4 h-4" /> GITHUB
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LINKEDIN
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#00FF88] transition-colors"
            >
              <Mail className="w-4 h-4" /> DIRECT_DISPATCH
            </a>
          </div>
        </div>
      </ChamferedPanel>
    </div>
  );
};

export default CommsTerminal;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/CommsTerminal.test.tsx`
Expected: PASS 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/CommsTerminal.tsx src/test/CommsTerminal.test.tsx
git commit -m "feat(comms): add CommsTerminal military messaging form and network nodes dispatch"
```

---

### Task 11: HUD Dashboard Central Hub & Panel Controller

**Files:**
- Create: `src/components/gamified/HUDDashboard.tsx`
- Create: `src/test/HUDDashboard.test.tsx`

**Interfaces:**
- Consumes: `HUDNav`, `CharacterProfile`, `MissionLog`, `EquipmentInventory`, `CommsTerminal`, `ChamferedPanel`, `useSoundEffect`.
- Produces: `<HUDDashboard />`.

- [ ] **Step 1: Write the failing test**

Create `src/test/HUDDashboard.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HUDDashboard from '../components/gamified/HUDDashboard';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('HUDDashboard Component', () => {
  it('should render all 4 tactical operation cards', () => {
    render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONS LOG')).toBeInTheDocument();
    expect(screen.getByText('TECH ARSENAL')).toBeInTheDocument();
    expect(screen.getByText('COMMS RELAY')).toBeInTheDocument();
  });

  it('should open section when card is clicked', () => {
    render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    const dossierBtn = screen.getByRole('button', { name: /pilot dossier/i });
    fireEvent.click(dossierBtn);
    expect(screen.getByText(/APTITUDE MATRIX/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/HUDDashboard.test.tsx`
Expected: FAIL with "Cannot find module '../components/gamified/HUDDashboard'".

- [ ] **Step 3: Write minimal implementation**

Create `src/components/gamified/HUDDashboard.tsx`:
```typescript
import React, { useState, useEffect } from 'react';
import { User, ClipboardList, Shield, Radio, Terminal } from 'lucide-react';
import HUDNav from '@/components/gamified/HUDNav';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import CharacterProfile from '@/components/gamified/CharacterProfile';
import MissionLog from '@/components/gamified/MissionLog';
import EquipmentInventory from '@/components/gamified/EquipmentInventory';
import CommsTerminal from '@/components/gamified/CommsTerminal';
import { PILOT_DOSSIER } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

type PanelType = 'profile' | 'missions' | 'arsenal' | 'comms' | null;

const HUDDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const { play: playHover } = useSoundEffect('UI_HOVER');
  const { play: playOpen } = useSoundEffect('PANEL_OPEN');
  const { play: playClose } = useSoundEffect('PANEL_CLOSE');

  const openPanel = (panel: PanelType) => {
    if (panel) playOpen();
    else playClose();
    setActivePanel(panel);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePanel) {
        openPanel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E0E0E0] pt-20 pb-12 px-6 sm:px-12 flex flex-col justify-between relative z-10">
      <HUDNav activePanel={activePanel} onSelectPanel={openPanel} />

      <main className="w-full max-w-6xl mx-auto my-auto py-8">
        {activePanel === null ? (
          <div className="space-y-12">
            {/* Center Welcome Transmission */}
            <ChamferedPanel size="md" className="p-8 text-center max-w-2xl mx-auto space-y-4 border-[#00D4FF]/30">
              <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs text-[#00FF88] border border-[#00FF88]/40 chamfer-sm">
                <Terminal className="w-3.5 h-3.5" /> STANDBY MODE // COMMAND CENTER
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wider text-[#E0E0E0]">
                {PILOT_DOSSIER.callsign}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#00D4FF] tracking-widest">
                {PILOT_DOSSIER.role} // STATUS: {PILOT_DOSSIER.status}
              </p>
              <p className="font-sans text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Select an operational module below to inspect mission parameters, technical inventory, or dispatch transmissions.
              </p>
            </ChamferedPanel>

            {/* 4 Operations Hub Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChamferedPanel
                as="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('profile')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Pilot Dossier"
              >
                <div className="flex justify-between items-start">
                  <User className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-01</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">PILOT DOSSIER</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Identity, aptitudes, and operational service record.</p>
                </div>
              </ChamferedPanel>

              <ChamferedPanel
                as="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('missions')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Operations Log"
              >
                <div className="flex justify-between items-start">
                  <ClipboardList className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-02</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">OPERATIONS LOG</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Deployed production systems and project archives.</p>
                </div>
              </ChamferedPanel>

              <ChamferedPanel
                as="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('arsenal')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Tech Arsenal"
              >
                <div className="flex justify-between items-start">
                  <Shield className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-03</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">TECH ARSENAL</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Tiered technology inventory sorted by combat proficiency.</p>
                </div>
              </ChamferedPanel>

              <ChamferedPanel
                as="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('comms')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Comms Relay"
              >
                <div className="flex justify-between items-start">
                  <Radio className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-04</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">COMMS RELAY</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Direct communication transmission and network links.</p>
                </div>
              </ChamferedPanel>
            </div>
          </div>
        ) : (
          <div className="py-4 animate-fade-in">
            {activePanel === 'profile' && <CharacterProfile onClose={() => openPanel(null)} />}
            {activePanel === 'missions' && <MissionLog onClose={() => openPanel(null)} />}
            {activePanel === 'arsenal' && <EquipmentInventory onClose={() => openPanel(null)} />}
            {activePanel === 'comms' && <CommsTerminal onClose={() => openPanel(null)} />}
          </div>
        )}
      </main>

      <footer className="w-full max-w-6xl mx-auto pt-8 border-t border-[#2A2A3A] flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-[#94A3B8] gap-2">
        <span>VALKYRIE TERMINAL // ALL SYSTEMS OPERATIONAL</span>
        <span>© {new Date().getFullYear()} ARYO ADI PUTRO</span>
      </footer>
    </div>
  );
};

export default HUDDashboard;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/HUDDashboard.test.tsx`
Expected: PASS 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/gamified/HUDDashboard.tsx src/test/HUDDashboard.test.tsx
git commit -m "feat(hub): add central HUDDashboard layout with interactive module navigation and state overlay controller"
```

---

### Task 12: Page Assembly, SEO, Full Build Verification & Browser QA

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/App.tsx`
- Modify: `index.html`
- Create: `src/test/Index.test.tsx`

**Interfaces:**
- Consumes: `<SoundProvider>`, `<GridBackground>`, `<BootSequence>`, `<HUDDashboard>`.
- Produces: Seamless entry flow from BootSequence to HUDDashboard with persistent sound settings.

- [ ] **Step 1: Write the failing test**

Create `src/test/Index.test.tsx`:
```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Index from '../pages/Index';

describe('Index Entry Page', () => {
  it('should initially show the boot sequence then advance to HUD dashboard upon skip', () => {
    render(<Index />);
    const skipBtn = screen.getByRole('button', { name: /skip initialization/i });
    expect(skipBtn).toBeInTheDocument();
    fireEvent.click(skipBtn);
    expect(screen.getByText(/COMMAND CENTER/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/Index.test.tsx`
Expected: FAIL because `Index.tsx` still renders old `PortfolioNav` and `HeroSection`.

- [ ] **Step 3: Write minimal implementation**

1. Update `src/pages/Index.tsx`:
```typescript
import React, { useState } from 'react';
import { SoundProvider } from '@/components/gamified/SoundManager';
import GridBackground from '@/components/gamified/GridBackground';
import BootSequence from '@/components/gamified/BootSequence';
import HUDDashboard from '@/components/gamified/HUDDashboard';

const Index: React.FC = () => {
  const [bootCompleted, setBootCompleted] = useState(false);

  return (
    <SoundProvider>
      <div className="relative min-h-screen bg-[#0A0A0F] text-[#E0E0E0] overflow-x-hidden selection:bg-[#00FF88] selection:text-[#0A0A0F]">
        <GridBackground />
        {!bootCompleted ? (
          <BootSequence onComplete={() => setBootCompleted(true)} />
        ) : (
          <HUDDashboard />
        )}
      </div>
    </SoundProvider>
  );
};

export default Index;
```

2. Update `index.html` title and metadata:
```html
    <title>Aryo Adi Putro | VALKYRIE TERMINAL</title>
    <meta name="description" content="Tactical portfolio terminal of Aryo Adi Putro — Full Stack Developer. Inspect operations, technical arsenal, and pilot dossier.">
```

3. Update `src/App.tsx` to force dark theme class if needed.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS all tests.

- [ ] **Step 5: Run full build and lint**

Run: `npm run build && npm run lint`
Expected: Build succeeds with 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Index.tsx index.html src/App.tsx src/test/Index.test.tsx
git commit -m "feat(app): integrate BootSequence, SoundProvider, GridBackground, and HUDDashboard into main application"
```

---

## Plan Self-Review Checklist

1. **Spec Coverage**:
   - Color palette (`#0A0A0F`, `#12121A`, `#00FF88`, `#00D4FF`, `#FF00FF`, `#FFD700`) -> Implemented in Task 1.
   - Chamfered corners (45° clip-path) -> Implemented in Task 1 & Task 4 (`ChamferedPanel`).
   - Web Audio API & sounds.ts -> Implemented in Task 3.
   - Tactical Grid Background -> Implemented in Task 4.
   - Boot Sequence -> Implemented in Task 5.
   - HUD Navigation -> Implemented in Task 6.
   - Pilot Dossier (Character Profile with Aptitude bars & Service record) -> Implemented in Task 7.
   - Operations Log (MissionLog & MissionCard with ◆ diamonds) -> Implemented in Task 8.
   - Tech Arsenal (EquipmentInventory with 4-tier rarities) -> Implemented in Task 9.
   - Comms Relay (military inputs & network nodes) -> Implemented in Task 10.
   - HUD Dashboard Hub -> Implemented in Task 11.
   - Page Integration & SEO -> Implemented in Task 12.
2. **No Placeholders**: All tasks contain explicit file paths, complete code snippets, and exact test assertions.
3. **Type Consistency**: `Mission`, `DifficultyRating`, `TechRarity`, `EquipmentItem`, `SoundKey` types are consistent across all tasks.
