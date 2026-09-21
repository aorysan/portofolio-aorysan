# Dark Fantasy Portfolio Implementation Plan: Beyond The Walls

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a Cinematic Dark Fantasy ("Survey Corps of Software - Beyond The Walls") experience supporting dual-mode navigation (Lenis free-flow smooth scroll & chapter presentation snap) and Anime.js animations.

**Architecture:** A modular React + Tailwind + Vite architecture with centralized dark-fantasy data, high-performance 2D ember canvas, hairline-gridded arsenal cards, responsive campaign cards with an Esc-dismissable dossier lightbox, and an adaptable `DarkFantasyShell` supporting both continuous Lenis smooth scrolling and viewport chapter snapping.

**Tech Stack:** React 18, TypeScript, TailwindCSS, Lenis, Anime.js, Vitest, Testing Library, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-20-dark-fantasy-portfolio-design.md`

## Global Constraints

- Header name displayed verbatim as `Aryo A.P` (with tracking/spacing).
- All 6 projects from existing data mapped to the Wall fortifications (`KampungKu`, `Rest Area Tycoon`, `TrasMart`, `SarPras`, `FrameWork`, `Jawara`).
- Fonts loaded: `Cinzel` (400, 600, 700, 900), `Oswald` (300, 400, 500, 600, 700), `Barlow` (300, 400, 500, 600).
- Color tokens: `--color-ash` (#0a0908), `--color-soot` (#12100e), `--color-iron` (#1c1a17), `--color-stone` (#2a2723), `--color-bone` (#d6cfc2), `--color-parchment` (#b7ad99), `--color-blood` (#7c1f1a), `--color-ember` (#b4442e), `--color-rust` (#8a4b2b), `--color-verdigris` (#4d6155).
- Audio cues integrated with existing `useTactileSound` hook from `TactileSoundManager.tsx`.
- All tests must pass with `npm run test` and production build with `npm run build`.

---

### Task 1: Design Tokens, Fonts & Color System

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.ts`
- Test: `src/test/design-tokens.test.ts`

**Interfaces:**
- Produces: CSS utility variables `--color-ash`, `--color-soot`, `--color-iron`, `--color-stone`, `--color-bone`, `--color-parchment`, `--color-blood`, `--color-ember`, font families `font-display` (Cinzel), `font-military` (Oswald), `font-body` (Barlow).

- [ ] **Step 1: Write the failing test for design tokens**

Create `src/test/design-tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens & CSS Configuration', () => {
  it('defines all required Dark Fantasy color variables in index.css', () => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');
    expect(cssContent).toContain('--color-ash: #0a0908');
    expect(cssContent).toContain('--color-bone: #d6cfc2');
    expect(cssContent).toContain('--color-blood: #7c1f1a');
    expect(cssContent).toContain('--color-ember: #b4442e');
    expect(cssContent).toContain('Cinzel');
    expect(cssContent).toContain('Oswald');
    expect(cssContent).toContain('Barlow');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/design-tokens.test.ts`
Expected: FAIL (variables not yet present)

- [ ] **Step 3: Update `src/index.css` and `tailwind.config.ts`**

In `src/index.css`, add font imports and color variables:
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Cinzel:wght@400;600;700;900&family=Oswald:wght@300;400;500;600;700&display=swap');

:root {
  --color-ash: #0a0908;
  --color-soot: #12100e;
  --color-iron: #1c1a17;
  --color-stone: #2a2723;
  --color-bone: #d6cfc2;
  --color-parchment: #b7ad99;
  --color-blood: #7c1f1a;
  --color-ember: #b4442e;
  --color-rust: #8a4b2b;
  --color-verdigris: #4d6155;
  --background: var(--color-ash);
  --foreground: var(--color-bone);
}
```

In `tailwind.config.ts`, extend font families:
```ts
fontFamily: {
  display: ['Cinzel', 'serif'],
  military: ['Oswald', 'sans-serif'],
  body: ['Barlow', 'sans-serif'],
  mono: ['monospace'],
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/design-tokens.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/index.css tailwind.config.ts src/test/design-tokens.test.ts
git commit -m "style: configure Dark Fantasy typography and color tokens"
```

---

### Task 2: Centralized Dark Fantasy Data & Types

**Files:**
- Create: `src/lib/dark-fantasy-data.ts`
- Test: `src/test/dark-fantasy-data.test.ts`

**Interfaces:**
- Produces: `HERO_DATA`, `CREED_DATA`, `ARSENAL_DATA`, `CAMPAIGNS_DATA`, `VISION_DATA`, `SUMMON_DATA` with full TypeScript interfaces.

- [ ] **Step 1: Write the failing test for data structure**

Create `src/test/dark-fantasy-data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  HERO_DATA,
  CREED_DATA,
  ARSENAL_DATA,
  CAMPAIGNS_DATA,
  VISION_DATA,
  SUMMON_DATA,
} from '../lib/dark-fantasy-data';

describe('Dark Fantasy Data Module', () => {
  it('exports valid hero data with callsign Aryo A.P', () => {
    expect(HERO_DATA.callsign).toBe('Aryo A.P');
    expect(HERO_DATA.headlineTop).toBe('BEYOND');
    expect(HERO_DATA.headlineBottom).toBe('THE WALLS');
  });

  it('includes all 6 campaigns mapped to wall sectors', () => {
    expect(CAMPAIGNS_DATA.length).toBe(6);
    const titles = CAMPAIGNS_DATA.map((c) => c.title);
    expect(titles).toContain('KampungKu');
    expect(titles).toContain('Rest Area Business - Idle Tycoon Game');
    expect(titles).toContain('TrasMart');
    expect(titles).toContain('SarPras');
    expect(titles).toContain('FrameWork');
    expect(titles).toContain('Jawara');
  });

  it('exports 4 arsenal quadrants', () => {
    expect(ARSENAL_DATA.length).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/dark-fantasy-data.test.ts`
Expected: FAIL (file does not exist)

- [ ] **Step 3: Implement `src/lib/dark-fantasy-data.ts`**

Export typed datasets:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/dark-fantasy-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/dark-fantasy-data.ts src/test/dark-fantasy-data.test.ts
git commit -m "feat: add typed dark fantasy datasets and wall campaign data"
```

---

### Task 3: Lenis Smooth Scroll Engine Provider

**Files:**
- Modify: `src/components/SmoothScroll.tsx`
- Test: `src/test/smooth-scroll.test.tsx`

**Interfaces:**
- Produces: `SmoothScroll` component with exportable `useLenisScroll` hook or Lenis context for programmatic scrolling (`lenis.scrollTo`).

- [ ] **Step 1: Write the failing test for SmoothScroll**

Create `src/test/smooth-scroll.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SmoothScroll, { useLenisContext } from '../components/SmoothScroll';

const TestChild = () => {
  const { scrollTo } = useLenisContext();
  return (
    <div>
      <span>Child rendered</span>
      <button onClick={() => scrollTo('#creed')}>Scroll CTA</button>
    </div>
  );
};

describe('SmoothScroll Component', () => {
  it('renders children with Lenis context provider', () => {
    render(
      <SmoothScroll enabled={true}>
        <TestChild />
      </SmoothScroll>
    );
    expect(screen.getByText('Child rendered')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/smooth-scroll.test.tsx`
Expected: FAIL (missing `useLenisContext` export and provider)

- [ ] **Step 3: Implement `src/components/SmoothScroll.tsx`**

Implement Lenis lifecycle with `requestAnimationFrame`, reduced-motion check, and support for `enabled` prop (to disable wheel interception in Chapter Snap mode):
```tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, unknown>) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenisContext = () => useContext(LenisContext);

export default function SmoothScroll({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  const scrollTo = (target: string | HTMLElement, options?: Record<string, unknown>) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/smooth-scroll.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SmoothScroll.tsx src/test/smooth-scroll.test.tsx
git commit -m "feat: implement robust Lenis smooth scroll engine and context"
```

---

### Task 4: 2D Ember & Ash Particle Canvas

**Files:**
- Create: `src/components/dark-fantasy/EmberCanvas.tsx`
- Test: `src/test/ember-canvas.test.tsx`

**Interfaces:**
- Produces: `EmberCanvas` component rendering a fixed background canvas simulating atmospheric battlefield ash & glowing embers.

- [ ] **Step 1: Write the failing test for EmberCanvas**

Create `src/test/ember-canvas.test.tsx`:
```tsx
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmberCanvas } from '../components/dark-fantasy/EmberCanvas';

describe('EmberCanvas Component', () => {
  it('renders a fixed background canvas element', () => {
    const { container } = render(<EmberCanvas count={30} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas?.className).toContain('pointer-events-none');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/ember-canvas.test.tsx`
Expected: FAIL (component not found)

- [ ] **Step 3: Implement `src/components/dark-fantasy/EmberCanvas.tsx`**

Implement high-efficiency canvas loop with resize listener and reduced motion respect:
```tsx
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  isEmber: boolean;
}

export const EmberCanvas: React.FC<{ count?: number }> = ({ count = 35 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.7 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      fadeSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      isEmber: Math.random() > 0.4,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity <= 0.1 || p.opacity >= 0.8) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isEmber
          ? `rgba(180, 68, 46, ${Math.max(0, p.opacity)})`
          : `rgba(183, 173, 153, ${Math.max(0, p.opacity * 0.5)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] opacity-70"
    />
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/ember-canvas.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/EmberCanvas.tsx src/test/ember-canvas.test.tsx
git commit -m "feat: add 2D canvas ash and ember particle animation"
```

---

### Task 5: Tactical Header HUD & Nav Rail

**Files:**
- Create: `src/components/dark-fantasy/TacticalHeader.tsx`
- Create: `src/components/dark-fantasy/NavRail.tsx`
- Test: `src/test/tactical-hud.test.tsx`

**Interfaces:**
- Produces: `TacticalHeader` with `Aryo A.P` title, dual-mode switcher (`FLUID SCROLL` vs `CHAPTER SNAP`), and audio mute button.
- Produces: `NavRail` fixed vertical 00-05 indicator synchronized to active section.

- [ ] **Step 1: Write the failing test for Header & NavRail**

Create `src/test/tactical-hud.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TacticalHeader } from '../components/dark-fantasy/TacticalHeader';
import { NavRail } from '../components/dark-fantasy/NavRail';

describe('Tactical Header & Navigation Rail', () => {
  it('renders Aryo A.P and mode switcher in header', () => {
    const handleModeToggle = vi.fn();
    render(
      <TacticalHeader
        mode="fluid"
        onToggleMode={handleModeToggle}
        isMuted={false}
        onToggleAudio={vi.fn()}
      />
    );
    expect(screen.getByText(/Aryo A\.P/i)).toBeInTheDocument();
    expect(screen.getByText(/FLUID SCROLL/i)).toBeInTheDocument();
    const toggleBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    fireEvent.click(toggleBtn);
    expect(handleModeToggle).toHaveBeenCalled();
  });

  it('renders all 6 navigation rail items', () => {
    render(<NavRail activeIndex={0} onSelectSection={vi.fn()} />);
    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/tactical-hud.test.tsx`
Expected: FAIL (components missing)

- [ ] **Step 3: Implement `TacticalHeader.tsx` and `NavRail.tsx`**

`src/components/dark-fantasy/TacticalHeader.tsx`:
```tsx
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TacticalHeaderProps {
  mode: 'fluid' | 'chapter';
  onToggleMode: () => void;
  isMuted: boolean;
  onToggleAudio: () => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  mode,
  onToggleMode,
  isMuted,
  onToggleAudio,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#2a2723] bg-[#0a0908]/90 backdrop-blur-md">
      {/* Callsign */}
      <div className="flex items-center gap-3">
        <span className="font-display text-sm tracking-[0.25em] text-[#d6cfc2] font-semibold">
          A R Y O &nbsp; A . P
        </span>
        <span className="hidden sm:inline-block w-px h-3 bg-[#2a2723]" />
        <span className="hidden sm:inline-block font-military text-xs tracking-wider text-[#b7ad99]">
          SURVEY CORPS OF SOFTWARE
        </span>
      </div>

      {/* Mode Switcher & Audio Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMode}
          aria-label="Switch navigation mode"
          className="group flex items-center gap-2 px-3 py-1.5 rounded border border-[#2a2723] bg-[#12100e] text-xs font-military tracking-wider transition-all hover:border-[#b4442e]"
        >
          <span className="text-[#b7ad99] group-hover:text-[#d6cfc2]">MODE:</span>
          <span className={mode === 'fluid' ? 'text-[#b4442e] font-semibold' : 'text-[#b7ad99]'}>
            FLUID SCROLL
          </span>
          <span className="text-[#2a2723]">|</span>
          <span className={mode === 'chapter' ? 'text-[#b4442e] font-semibold' : 'text-[#b7ad99]'}>
            CHAPTER SNAP
          </span>
        </button>

        <button
          onClick={onToggleAudio}
          aria-label={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
          className="p-1.5 rounded border border-[#2a2723] bg-[#12100e] text-[#b7ad99] hover:text-[#d6cfc2] hover:border-[#b4442e] transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#b4442e]" />}
        </button>
      </div>

      {/* Regiment Badge */}
      <div className="hidden md:flex items-center gap-2 text-xs font-military tracking-widest text-[#b7ad99]">
        <span>PORTFOLIO — REG. NO. 104</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#4d6155] animate-pulse" />
      </div>
    </header>
  );
};
```

`src/components/dark-fantasy/NavRail.tsx`:
```tsx
import React from 'react';

const SECTIONS = [
  { id: 'home', number: '00', label: 'HOME' },
  { id: 'creed', number: '01', label: 'CREED' },
  { id: 'arsenal', number: '02', label: 'ARSENAL' },
  { id: 'campaigns', number: '03', label: 'CAMPAIGNS' },
  { id: 'vision', number: '04', label: 'VISION' },
  { id: 'summon', number: '05', label: 'SUMMON' },
];

export const NavRail: React.FC<{
  activeIndex: number;
  onSelectSection: (id: string, index: number) => void;
}> = ({ activeIndex, onSelectSection }) => {
  return (
    <nav
      aria-label="Section navigation rail"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-5"
    >
      {SECTIONS.map((sec, idx) => {
        const isActive = activeIndex === idx;
        return (
          <button
            key={sec.id}
            onClick={() => onSelectSection(sec.id, idx)}
            className="group flex items-center gap-3 text-right focus:outline-none"
            aria-label={`Jump to section ${sec.label}`}
          >
            <span
              className={`font-military text-xs tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-[#b4442e] font-semibold translate-x-0 opacity-100'
                  : 'text-[#b7ad99]/60 group-hover:text-[#d6cfc2] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {sec.label}
            </span>
            <span
              className={`font-military text-xs transition-colors duration-300 ${
                isActive ? 'text-[#b4442e] font-bold' : 'text-[#b7ad99]/40 group-hover:text-[#b7ad99]'
              }`}
            >
              {sec.number}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-[#b4442e] scale-125 ring-2 ring-[#b4442e]/30'
                  : 'bg-[#2a2723] group-hover:bg-[#b7ad99]'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/tactical-hud.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/TacticalHeader.tsx src/components/dark-fantasy/NavRail.tsx src/test/tactical-hud.test.tsx
git commit -m "feat: implement TacticalHeader with mode switch and NavRail"
```

---

### Task 6: Hero Section ("BEYOND THE WALLS" with Anime.js)

**Files:**
- Create: `src/components/dark-fantasy/HeroSection.tsx`
- Test: `src/test/hero-section.test.tsx`

**Interfaces:**
- Consumes: `HERO_DATA` from `src/lib/dark-fantasy-data.ts`.
- Produces: `HeroSection` rendering the "BEYOND THE WALLS" typography with solid/outline treatment, subtitle, and `ADVANCE` scroll button.

- [ ] **Step 1: Write the failing test for HeroSection**

Create `src/test/hero-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroSection } from '../components/dark-fantasy/HeroSection';

describe('HeroSection Component', () => {
  it('renders BEYOND THE WALLS monument and advance button', () => {
    render(<HeroSection onAdvance={vi.fn()} />);
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
    expect(screen.getByText('THE WALLS')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /advance to the creed/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/hero-section.test.tsx`
Expected: FAIL (file missing)

- [ ] **Step 3: Implement `src/components/dark-fantasy/HeroSection.tsx`**

Integrate Anime.js text reveal and exact typography layout:
```tsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { ArrowDown } from 'lucide-react';
import { HERO_DATA } from '../../lib/dark-fantasy-data';

export const HeroSection: React.FC<{ onAdvance: () => void }> = ({ onAdvance }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      anime({
        targets: headlineRef.current.children,
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: anime.stagger(200, { start: 200 }),
      });
    } catch {
      // animejs fallback
    }
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-24 pt-32 pb-16 z-10"
    >
      {/* Top Tagline */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-px bg-[#7c1f1a]" />
        <span className="font-military text-xs sm:text-sm tracking-[0.3em] text-[#b4442e] uppercase">
          {HERO_DATA.tagline}
        </span>
      </div>

      {/* Main Monolith Headline */}
      <div ref={headlineRef} className="my-auto py-12">
        <h1 className="font-display font-black leading-[0.88] tracking-tight text-[#d6cfc2] text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] select-none">
          <div className="block">{HERO_DATA.headlineTop}</div>
          <div
            className="block mt-2 text-transparent"
            style={{
              WebkitTextStroke: '2px #d6cfc2',
            }}
          >
            {HERO_DATA.headlineBottom}
          </div>
        </h1>

        <p className="mt-8 max-w-2xl font-body text-lg sm:text-xl text-[#b7ad99] font-light leading-relaxed">
          {HERO_DATA.subtitle}
        </p>
      </div>

      {/* Bottom Row: Advance CTA & Doctrine Quote */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-8 border-t border-[#2a2723]/60">
        <button
          onClick={onAdvance}
          aria-label="Advance to the creed"
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <span className="w-10 h-10 rounded-full border border-[#2a2723] bg-[#12100e] flex items-center justify-center text-[#d6cfc2] group-hover:border-[#b4442e] group-hover:text-[#b4442e] transition-colors">
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </span>
          <span className="font-military text-xs tracking-[0.25em] text-[#b7ad99] group-hover:text-[#d6cfc2] transition-colors">
            ADVANCE
          </span>
        </button>

        <p className="font-military text-xs tracking-widest text-[#b7ad99]/60 max-w-md text-left sm:text-right">
          {HERO_DATA.doctrine}
        </p>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/hero-section.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/HeroSection.tsx src/test/hero-section.test.tsx
git commit -m "feat: create HeroSection with monumental typography and advance trigger"
```

---

### Task 7: The Creed Section

**Files:**
- Create: `src/components/dark-fantasy/CreedSection.tsx`
- Test: `src/test/creed-section.test.tsx`

**Interfaces:**
- Consumes: `CREED_DATA` from `src/lib/dark-fantasy-data.ts`.
- Produces: `CreedSection` rendering the 2-column manifesto, soldier statistics, and profile seal.

- [ ] **Step 1: Write the failing test for CreedSection**

Create `src/test/creed-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreedSection } from '../components/dark-fantasy/CreedSection';

describe('CreedSection Component', () => {
  it('renders section title and creed quote', () => {
    render(<CreedSection />);
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();
    expect(screen.getByText(/I DEDICATE MY HEART/i)).toBeInTheDocument();
    expect(screen.getByText('YEARS ENLISTED')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/creed-section.test.tsx`
Expected: FAIL (missing component)

- [ ] **Step 3: Implement `src/components/dark-fantasy/CreedSection.tsx`**

```tsx
import React from 'react';
import { CREED_DATA } from '../../lib/dark-fantasy-data';
import profileAvatar from '../../assets/profile-avatar.jpg';

export const CreedSection: React.FC = () => {
  return (
    <section id="creed" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          01 — THE CREED
        </span>
      </div>

      {/* Monumental Quote */}
      <blockquote className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight text-[#d6cfc2] max-w-5xl">
        "{CREED_DATA.quote}"
      </blockquote>

      {/* Asymmetric 2-Col Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-12 font-body text-base sm:text-lg text-[#b7ad99] leading-relaxed">
        <div>
          <p>{CREED_DATA.narrativeLeft}</p>
        </div>
        <div>
          <p>{CREED_DATA.narrativeRight}</p>
        </div>
      </div>

      {/* Stats Bar & Tactical Seal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mt-16 pt-10 border-t border-[#2a2723]">
        <div className="flex flex-wrap items-center gap-10 sm:gap-16">
          {CREED_DATA.stats.map((st) => (
            <div key={st.label}>
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#d6cfc2]">
                {st.value}
              </div>
              <div className="font-military text-xs tracking-widest text-[#b7ad99]/70 mt-1">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Avatar Badge */}
        <div className="flex items-center gap-4 p-2 pr-4 rounded border border-[#2a2723] bg-[#12100e]">
          <img
            src={profileAvatar}
            alt="Aryo Adi Putro"
            className="w-12 h-12 rounded object-cover grayscale contrast-125 border border-[#2a2723]"
          />
          <div className="text-left">
            <div className="font-display text-xs font-semibold text-[#d6cfc2]">ARYO ADI PUTRO</div>
            <div className="font-military text-[10px] tracking-wider text-[#b4442e]">SURVEY CORPS DEV</div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/creed-section.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/CreedSection.tsx src/test/creed-section.test.tsx
git commit -m "feat: implement CreedSection with 2-column manifesto and stats"
```

---

### Task 8: The Arsenal (Skills Quad with Sigil SVGs)

**Files:**
- Create: `src/components/dark-fantasy/ArsenalSection.tsx`
- Test: `src/test/arsenal-section.test.tsx`

**Interfaces:**
- Consumes: `ARSENAL_DATA` from `src/lib/dark-fantasy-data.ts`.
- Produces: `ArsenalSection` with hairline 2x2 grid, SVG sigils, and ember hover underlines.

- [ ] **Step 1: Write the failing test for ArsenalSection**

Create `src/test/arsenal-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArsenalSection } from '../components/dark-fantasy/ArsenalSection';

describe('ArsenalSection Component', () => {
  it('renders the 4 arsenal quadrants and skills', () => {
    render(<ArsenalSection />);
    expect(screen.getByText(/02 — THE ARSENAL/i)).toBeInTheDocument();
    expect(screen.getByText('FRONTEND VERTICAL MANEUVER')).toBeInTheDocument();
    expect(screen.getByText('SYSTEMS & ARCHITECTURE')).toBeInTheDocument();
    expect(screen.getByText('INTERFACE RECONNAISSANCE')).toBeInTheDocument();
    expect(screen.getByText('PERFORMANCE WARFARE')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/arsenal-section.test.tsx`
Expected: FAIL (missing component)

- [ ] **Step 3: Implement `src/components/dark-fantasy/ArsenalSection.tsx`**

```tsx
import React from 'react';
import { ARSENAL_DATA } from '../../lib/dark-fantasy-data';

const SigilIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'blades':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <path d="M4 20L18 6M18 6H10M18 6V14" />
          <path d="M8 20L20 8" />
        </svg>
      );
    case 'fortress':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <path d="M3 21V9l9-6 9 6v12H3z" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case 'reticle':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      );
    case 'spark':
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
  }
};

export const ArsenalSection: React.FC = () => {
  return (
    <section id="arsenal" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
            02 — THE ARSENAL
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-2">
            DISCIPLINES OF COMBAT
          </h2>
        </div>
        <p className="font-body text-sm text-[#b7ad99] max-w-sm">
          Four disciplines, sharpened over a career of sieges. Hover to bring each blade to the light.
        </p>
      </div>

      {/* Hairline Grid Quad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-[#2a2723]">
        {ARSENAL_DATA.map((item) => (
          <div
            key={item.index}
            className="group relative p-8 sm:p-12 border-r border-b border-[#2a2723] bg-[#0a0908] hover:bg-[#12100e] transition-all duration-300"
          >
            {/* Top row: Sigil and quadrant number */}
            <div className="flex items-center justify-between text-[#b7ad99] group-hover:text-[#b4442e] transition-colors">
              <SigilIcon type={item.sigil} />
              <span className="font-military text-xs tracking-widest">{item.index}</span>
            </div>

            {/* Title */}
            <h3 className="font-military text-xl sm:text-2xl font-bold tracking-wider text-[#d6cfc2] mt-8 group-hover:text-white transition-colors">
              {item.title}
            </h3>

            {/* Description */}
            <p className="font-body text-sm text-[#b7ad99] leading-relaxed mt-3">
              {item.description}
            </p>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {item.stack.map((st) => (
                <span
                  key={st}
                  className="px-2.5 py-1 text-xs font-military tracking-wider rounded border border-[#2a2723] bg-[#1c1a17] text-[#d6cfc2]"
                >
                  {st}
                </span>
              ))}
            </div>

            {/* Ember underline on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b4442e] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/arsenal-section.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/ArsenalSection.tsx src/test/arsenal-section.test.tsx
git commit -m "feat: implement ArsenalSection with 2x2 hairline grid and sigil hover effects"
```

---

### Task 9: Campaigns & Dossier Lightbox (All 6 Wall Projects)

**Files:**
- Create: `src/components/dark-fantasy/CampaignDossierModal.tsx`
- Create: `src/components/dark-fantasy/CampaignsSection.tsx`
- Test: `src/test/campaigns-section.test.tsx`

**Interfaces:**
- Consumes: `CAMPAIGNS_DATA` from `src/lib/dark-fantasy-data.ts`.
- Produces: `CampaignsSection` rendering all 6 project cards and `CampaignDossierModal` for detail viewing.

- [ ] **Step 1: Write the failing test for Campaigns & Modal**

Create `src/test/campaigns-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CampaignsSection } from '../components/dark-fantasy/CampaignsSection';

describe('CampaignsSection Component', () => {
  it('renders all 6 campaigns and opens modal on click', () => {
    render(<CampaignsSection />);
    expect(screen.getByText(/03 — CAMPAIGNS/i)).toBeInTheDocument();
    expect(screen.getByText('KampungKu')).toBeInTheDocument();
    expect(screen.getByText('Rest Area Business - Idle Tycoon Game')).toBeInTheDocument();
    expect(screen.getByText('TrasMart')).toBeInTheDocument();
    expect(screen.getByText('SarPras')).toBeInTheDocument();
    expect(screen.getByText('FrameWork')).toBeInTheDocument();
    expect(screen.getByText('Jawara')).toBeInTheDocument();

    const card = screen.getByText('KampungKu');
    fireEvent.click(card);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Mobile Lead Engineer/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/campaigns-section.test.tsx`
Expected: FAIL (components missing)

- [ ] **Step 3: Implement `CampaignDossierModal.tsx` and `CampaignsSection.tsx`**

`src/components/dark-fantasy/CampaignDossierModal.tsx`:
```tsx
import React, { useEffect } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { Campaign } from '../../lib/dark-fantasy-data';

export const CampaignDossierModal: React.FC<{
  campaign: Campaign | null;
  onClose: () => void;
}> = ({ campaign, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!campaign) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl border border-[#2a2723] bg-[#12100e] p-6 sm:p-8 rounded shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2a2723] pb-4">
          <div className="flex items-center gap-3">
            <span className="font-military text-xs tracking-widest text-[#b4442e]">
              [{campaign.district}] · {campaign.year}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dossier modal"
            className="p-1 rounded text-[#b7ad99] hover:text-white hover:bg-[#1c1a17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#d6cfc2] mt-4">
          {campaign.title}
        </h3>
        <p className="font-military text-xs tracking-wider text-[#b4442e] uppercase mt-1">
          ROLE: {campaign.role}
        </p>

        <p className="font-body text-base text-[#b7ad99] leading-relaxed mt-4">
          {campaign.briefing}
        </p>

        <div className="mt-6">
          <div className="font-military text-xs tracking-wider text-[#b7ad99]/60 mb-2">
            ARSENAL DEPLOYED:
          </div>
          <div className="flex flex-wrap gap-2">
            {campaign.stack.map((st) => (
              <span
                key={st}
                className="px-2.5 py-1 text-xs font-military tracking-wider rounded border border-[#2a2723] bg-[#1c1a17] text-[#d6cfc2]"
              >
                {st}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#2a2723]">
          {campaign.liveLink && (
            <a
              href={campaign.liveLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#b4442e] text-[#d6cfc2] font-military text-xs tracking-wider font-semibold hover:bg-[#7c1f1a] transition-colors"
            >
              <span>INSPECT OPERATION</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {campaign.github && (
            <a
              href={campaign.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded border border-[#2a2723] bg-[#1c1a17] text-[#d6cfc2] font-military text-xs tracking-wider hover:border-[#b4442e] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>REPOSITORY</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
```

`src/components/dark-fantasy/CampaignsSection.tsx`:
```tsx
import React, { useState } from 'react';
import { CAMPAIGNS_DATA, Campaign } from '../../lib/dark-fantasy-data';
import { CampaignDossierModal } from './CampaignDossierModal';

export const CampaignsSection: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <section id="campaigns" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
            03 — CAMPAIGNS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-2">
            THE WALL.
          </h2>
        </div>
        <p className="font-body text-sm text-[#b7ad99] max-w-sm">
          All six deployed fortifications across the outer and inner walls. Select any sector to inspect tactical dossier.
        </p>
      </div>

      {/* Grid of all 6 projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAMPAIGNS_DATA.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedCampaign(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedCampaign(item);
            }}
            className="group relative p-6 sm:p-8 rounded border border-[#2a2723] bg-[#0a0908] hover:border-[#b4442e] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Sector marker */}
            <div className="flex items-center justify-between text-xs font-military tracking-widest text-[#b7ad99]/70">
              <span className="px-2 py-0.5 rounded border border-[#2a2723] bg-[#12100e]">
                {item.district}
              </span>
              <span>{item.year}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#d6cfc2] mt-6 group-hover:text-white transition-colors">
              {item.title}
            </h3>

            <p className="font-military text-xs tracking-wider text-[#b4442e] uppercase mt-1">
              {item.role}
            </p>

            <p className="font-body text-sm text-[#b7ad99] line-clamp-3 mt-3">
              {item.briefing}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-6">
              {item.stack.slice(0, 3).map((st) => (
                <span
                  key={st}
                  className="px-2 py-0.5 text-[11px] font-military tracking-wider rounded border border-[#2a2723] text-[#b7ad99]"
                >
                  {st}
                </span>
              ))}
              {item.stack.length > 3 && (
                <span className="px-2 py-0.5 text-[11px] font-military text-[#b4442e]">
                  +{item.stack.length - 3}
                </span>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#2a2723] flex items-center justify-between text-xs font-military tracking-wider text-[#b7ad99] group-hover:text-[#b4442e]">
              <span>OPEN DOSSIER</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        ))}
      </div>

      <CampaignDossierModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </section>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/campaigns-section.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/CampaignDossierModal.tsx src/components/dark-fantasy/CampaignsSection.tsx src/test/campaigns-section.test.tsx
git commit -m "feat: implement CampaignsSection with all 6 projects and dossier modal"
```

---

### Task 10: Future Vision, Summon & Footer

**Files:**
- Create: `src/components/dark-fantasy/VisionSection.tsx`
- Create: `src/components/dark-fantasy/SummonSection.tsx`
- Create: `src/components/dark-fantasy/DarkFantasyFooter.tsx`
- Test: `src/test/vision-summon.test.tsx`

**Interfaces:**
- Consumes: `VISION_DATA`, `SUMMON_DATA` from `src/lib/dark-fantasy-data.ts`.
- Produces: `VisionSection`, `SummonSection` with functional dispatch form, and `DarkFantasyFooter`.

- [ ] **Step 1: Write the failing test for Vision & Summon**

Create `src/test/vision-summon.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisionSection } from '../components/dark-fantasy/VisionSection';
import { SummonSection } from '../components/dark-fantasy/SummonSection';

describe('Vision & Summon Sections', () => {
  it('renders Future Vision with horizon goals', () => {
    render(<VisionSection />);
    expect(screen.getByText(/04 — FUTURE VISION/i)).toBeInTheDocument();
    expect(screen.getByText('THE SEA')).toBeInTheDocument();
  });

  it('renders Summon form and handles report dispatch', () => {
    render(<SummonSection />);
    expect(screen.getByText(/05 — SUMMON/i)).toBeInTheDocument();
    expect(screen.getByText('SOUND THE HORN.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Levi Ackerman/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /dispatch the report/i });
    expect(btn).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/vision-summon.test.tsx`
Expected: FAIL (components missing)

- [ ] **Step 3: Implement VisionSection, SummonSection, and DarkFantasyFooter**

`src/components/dark-fantasy/VisionSection.tsx`:
```tsx
import React from 'react';
import { VISION_DATA } from '../../lib/dark-fantasy-data';

export const VisionSection: React.FC = () => {
  return (
    <section id="vision" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      <div className="mb-10">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          04 — FUTURE VISION
        </span>
      </div>

      <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#d6cfc2] leading-tight max-w-5xl">
        {VISION_DATA.titlePrimary}{' '}
        <span className="text-[#b4442e]">{VISION_DATA.titleHighlight}</span>{' '}
        {VISION_DATA.titleSecondary}
      </h2>

      <p className="font-body text-lg text-[#b7ad99] max-w-3xl leading-relaxed mt-10">
        {VISION_DATA.manifesto}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-[#2a2723]">
        {VISION_DATA.horizons.map((h) => (
          <div key={h.label} className="border-l-2 border-[#b4442e] pl-4">
            <div className="font-military text-xs tracking-widest text-[#b4442e]">
              {h.label}
            </div>
            <p className="font-body text-sm sm:text-base text-[#d6cfc2] mt-2 leading-snug">
              {h.goal}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
```

`src/components/dark-fantasy/SummonSection.tsx`:
```tsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SUMMON_DATA } from '../../lib/dark-fantasy-data';

export const SummonSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', objective: '', report: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailSubject = encodeURIComponent(`[EXPEDITION REPORT] ${form.objective || 'New Directive'}`);
    const mailBody = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nObjective: ${form.objective}\n\nReport:\n${form.report}`
    );
    toast.success('Raven dispatched. Launching email transmission.');
    window.location.href = `mailto:${SUMMON_DATA.dispatch}?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <section id="summon" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      <div className="mb-8">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          05 — SUMMON
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Title & Dispatch Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#d6cfc2]">
              {SUMMON_DATA.title}
            </h2>
            <p className="font-body text-base sm:text-lg text-[#b7ad99] leading-relaxed mt-6">
              {SUMMON_DATA.subtitle}
            </p>
          </div>

          <div className="space-y-4 mt-12 pt-8 border-t border-[#2a2723] font-military text-xs tracking-wider">
            <div>
              <span className="text-[#b7ad99]/60 block">DISPATCH:</span>
              <a href={`mailto:${SUMMON_DATA.dispatch}`} className="text-[#d6cfc2] hover:text-[#b4442e] transition-colors">
                {SUMMON_DATA.dispatch}
              </a>
            </div>
            <div>
              <span className="text-[#b7ad99]/60 block">STATION:</span>
              <span className="text-[#d6cfc2]">{SUMMON_DATA.station}</span>
            </div>
            <div>
              <span className="text-[#b7ad99]/60 block">REGIMENT:</span>
              <span className="text-[#4d6155] font-semibold">{SUMMON_DATA.regiment}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
                NAME
              </label>
              <input
                type="text"
                required
                placeholder="Levi Ackerman"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
                CALLSIGN / EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="you@corps.dev"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
              OBJECTIVE
            </label>
            <input
              type="text"
              required
              placeholder="What wall are we taking?"
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
              REPORT
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the terrain, the threat, and the timeline."
              value={form.report}
              onChange={(e) => setForm({ ...form, report: e.target.value })}
              className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            aria-label="Dispatch the report"
            className="w-full sm:w-auto px-8 py-3.5 rounded border border-[#b4442e] bg-[#b4442e]/10 text-[#d6cfc2] font-military text-xs tracking-[0.2em] font-bold hover:bg-[#b4442e] hover:text-white transition-all duration-300"
          >
            DISPATCH THE REPORT →
          </button>
        </form>
      </div>
    </section>
  );
};
```

`src/components/dark-fantasy/DarkFantasyFooter.tsx`:
```tsx
import React from 'react';
import { SUMMON_DATA } from '../../lib/dark-fantasy-data';

export const DarkFantasyFooter: React.FC = () => {
  return (
    <footer className="relative z-10 px-6 sm:px-12 lg:px-24 py-8 border-t border-[#2a2723] bg-[#0a0908] flex flex-col sm:flex-row items-center justify-between gap-4 font-military text-xs tracking-widest text-[#b7ad99]/60">
      <div className="flex items-center gap-4">
        <span>ARYO A.P — DEDICATE YOUR HEART</span>
      </div>

      <div className="flex items-center gap-6">
        {SUMMON_DATA.socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#b7ad99] hover:text-[#b4442e] transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div>© 2026 · BUILT BEYOND THE WALLS</div>
    </footer>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/vision-summon.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/VisionSection.tsx src/components/dark-fantasy/SummonSection.tsx src/components/dark-fantasy/DarkFantasyFooter.tsx src/test/vision-summon.test.tsx
git commit -m "feat: implement VisionSection, SummonSection with form, and DarkFantasyFooter"
```

---

### Task 11: Dual-Mode Shell & Page Integration

**Files:**
- Create: `src/components/dark-fantasy/DarkFantasyShell.tsx`
- Modify: `src/pages/Index.tsx`
- Test: `src/test/dark-fantasy-shell.test.tsx`

**Interfaces:**
- Consumes: All components from `src/components/dark-fantasy/` and `SmoothScroll`.
- Produces: Complete interactive portfolio mounted on `/`.

- [ ] **Step 1: Write integration test for DarkFantasyShell**

Create `src/test/dark-fantasy-shell.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DarkFantasyShell } from '../components/dark-fantasy/DarkFantasyShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('DarkFantasyShell Integration', () => {
  it('renders all sections and toggles navigation mode', () => {
    render(
      <TactileSoundProvider>
        <DarkFantasyShell />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/Aryo A\.P/i)).toBeInTheDocument();
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();

    const modeBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    fireEvent.click(modeBtn);
    expect(screen.getByText(/CHAPTER SNAP/i)).toHaveClass('text-[#b4442e]');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/test/dark-fantasy-shell.test.tsx`
Expected: FAIL (missing component)

- [ ] **Step 3: Implement `DarkFantasyShell.tsx` and wire to `Index.tsx`**

`src/components/dark-fantasy/DarkFantasyShell.tsx`:
Implement state for `mode` (`fluid` | `chapter`), keyboard handlers for ArrowUp/ArrowDown in chapter snap mode, smooth scroll anchor triggers, and active rail index sync.

`src/pages/Index.tsx`:
```tsx
import React from 'react';
import { TactileSoundProvider } from '@/components/dossier/TactileSoundManager';
import { DarkFantasyShell } from '@/components/dark-fantasy/DarkFantasyShell';

const Index: React.FC = () => {
  return (
    <TactileSoundProvider>
      <DarkFantasyShell />
    </TactileSoundProvider>
  );
};

export default Index;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/test/dark-fantasy-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/DarkFantasyShell.tsx src/pages/Index.tsx src/test/dark-fantasy-shell.test.tsx
git commit -m "feat: assemble DarkFantasyShell with Dual-Mode scroll engine and wire to Index"
```

---

### Task 12: Production Build & End-to-End Verification

**Files:**
- Run: `npm run build`
- Run: `npm run test`

- [ ] **Step 1: Execute all unit and integration tests**

Run: `npm run test`
Expected: All test suites PASS with 0 failures.

- [ ] **Step 2: Execute production bundle build**

Run: `npm run build`
Expected: Clean Vite build output with 0 TypeScript errors.

- [ ] **Step 3: Commit final release verification**

```bash
git add -A
git commit -m "chore(release): complete Dark Fantasy Beyond The Walls portfolio transformation"
```
