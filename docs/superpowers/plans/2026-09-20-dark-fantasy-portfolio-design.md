# Dark Fantasy Portfolio ("Beyond The Walls") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Dark Fantasy Portfolio ("Beyond The Walls") transformation by implementing GSAP ScrollTrigger choreography, the Three Walls Phase 2 horizontal expedition journey with robust Phase 1 grid fallback, reusable animation hooks, Lenis-GSAP synchronization, and strict accessibility hardening.

**Architecture:** Maintain a clean React 18 + Vite + Tailwind architecture centered on `DarkFantasyShell`. Centralize Lenis scrolling at the top level with a single synchronized GSAP ticker. Provide a `ChapterModeContext` so sections dynamically toggle between scroll-driven ScrollTrigger choreography in fluid mode and static presentation decks in chapter mode. Scaffolding Phase 2 horizontal expedition into a dedicated `CampaignsJourney` component preserving Phase 1 responsive grid as an a11y/mobile fallback.

**Tech Stack:** React 18, TypeScript, TailwindCSS v3, GSAP 3.15 + ScrollTrigger, Lenis 1.3, Anime.js 3.2, Vitest 2.1, React Testing Library, Lucide React, Sonner.

**Spec:** `docs/superpowers/specs/2026-09-20-dark-fantasy-portfolio-design.md`

## Global Constraints

- Proyek ini Tailwind v3 (`tailwind.config.ts`), bukan v4. Jangan gunakan `@theme`.
- Hapus dan perbaiki override `--background` / `--foreground` di `src/index.css:392-393` agar channel HSL tidak tertimpa hex `#0a0908`.
- Token warna Dark Fantasy: `--color-ash` (#0a0908), `--color-soot` (#12100e), `--color-iron` (#1c1a17), `--color-stone` (#2a2723), `--color-bone` (#d6cfc2), `--color-parchment` (#b7ad99), `--color-blood` (#7c1f1a), `--color-ember` (#b4442e), `--color-rust` (#8a4b2b), `--color-verdigris` (#4d6155).
- Hanya satu instance Lenis di top level `App.tsx` via `SmoothScroll.tsx`. Dilarang memanggil `new Lenis()` di file lain.
- Lenis ↔ GSAP ticker disinkronkan via `lenis.on('scroll', ScrollTrigger.update)` dan `gsap.ticker.add(tick)`.
- Semua efek ScrollTrigger hanya aktif di fluid mode (`scrollFXEnabled: true`) dan saat `!prefersReducedMotion`.
- Di chapter mode (`mode === 'chapter'`) dan `<1000px` atau `prefers-reduced-motion`, Campaigns wajib fallback ke responsive vertical grid Phase 1.
- Callsign tetap `Aryo A.P` di data dan test suite (`HERO_DATA.callsign`).
- Semua 6 kampanye (`FrameWork`, `Jawara`, `KampungKu`, `SarPras`, `Rest Area Tycoon`, `TrasMart`) dimetakan ke zona dinding (`sina`, `rose`, `maria`) tanpa merusak data Phase 1.
- Setiap efek GSAP wajib dibungkus dalam `gsap.context()` dan di-cleanup dengan `ctx.revert()` saat unmount untuk mencegah memory leak.
- Pertahankan jsdom guards (`matchMedia`, `ResizeObserver`, `scrollIntoView`) agar `vitest run` tetap 100% hijau.
- Modal `CampaignDossierModal` wajib menggunakan `z-[90]`, focus trap, focus restoration, body scroll-lock, dan `lenis.stop()/start()`.

---

### Task 1: Design Tokens & HSL Background Channel Fix

**Files:**
- Modify: `src/index.css:380-395`
- Modify: `tailwind.config.ts:27-80`
- Test: `src/test/design-tokens.test.ts`

**Interfaces:**
- Consumes: CSS `:root` variables in `src/index.css`.
- Produces: Correct Tailwind utility classes (`bg-ash`, `bg-soot`, `bg-iron`, `border-stone`, `text-bone`, `text-parchment`, `text-ember`, `bg-blood`, `text-verdigris`) without breaking standard shadcn `hsl(var(--background))` channels.

- [ ] **Step 1: Write the failing test for token mapping and valid HSL channels**

Update `src/test/design-tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens & CSS Configuration', () => {
  it('defines all required Dark Fantasy color variables in index.css without overwriting HSL channels with hex', () => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');
    expect(cssContent).toContain('--color-ash: #0a0908');
    expect(cssContent).toContain('--color-soot: #12100e');
    expect(cssContent).toContain('--color-iron: #1c1a17');
    expect(cssContent).toContain('--color-stone: #2a2723');
    expect(cssContent).toContain('--color-bone: #d6cfc2');
    expect(cssContent).toContain('--color-parchment: #b7ad99');
    expect(cssContent).toContain('--color-blood: #7c1f1a');
    expect(cssContent).toContain('--color-ember: #b4442e');
    expect(cssContent).toContain('--color-rust: #8a4b2b');
    expect(cssContent).toContain('--color-verdigris: #4d6155');

    // index.css:392-393 bug fix: ensure --background is not overwritten with hex in :root
    expect(cssContent).not.toContain('--background: var(--color-ash);');
    expect(cssContent).not.toContain('--foreground: var(--color-bone);');
  });

  it('verifies tailwind.config.ts exposes dark fantasy colors mapped to CSS variables', () => {
    const tailwindConfig = fs.readFileSync(path.resolve(__dirname, '../../tailwind.config.ts'), 'utf-8');
    expect(tailwindConfig).toContain("ash: 'var(--color-ash)'");
    expect(tailwindConfig).toContain("soot: 'var(--color-soot)'");
    expect(tailwindConfig).toContain("stone: 'var(--color-stone)'");
    expect(tailwindConfig).toContain("bone: 'var(--color-bone)'");
    expect(tailwindConfig).toContain("ember: 'var(--color-ember)'");
    expect(tailwindConfig).toContain("verdigris: 'var(--color-verdigris)'");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/test/design-tokens.test.ts`
Expected: FAIL due to `--background: var(--color-ash);` still present and tailwind config missing color variables.

- [ ] **Step 3: Modify `src/index.css` and `tailwind.config.ts`**

In `src/index.css`, replace lines 380-395 with:
```css
/* Dark Fantasy design tokens ("Beyond The Walls") */
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
}
```

In `tailwind.config.ts`, update `theme.extend.colors` to include:
```ts
      colors: {
        ash: 'var(--color-ash)',
        soot: 'var(--color-soot)',
        iron: 'var(--color-iron)',
        stone: 'var(--color-stone)',
        bone: 'var(--color-bone)',
        parchment: 'var(--color-parchment)',
        blood: 'var(--color-blood)',
        ember: 'var(--color-ember)',
        rust: 'var(--color-rust)',
        verdigris: 'var(--color-verdigris)',
        'parchment-light': '#F4EDE0',
        'parchment-dark': '#D8C7A5',
        moss: '#3D4A34',
        desk: '#151412',
        marginalia: '#7A4B3A',
        border: "var(--border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/test/design-tokens.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/index.css tailwind.config.ts src/test/design-tokens.test.ts
git commit -m "fix(tokens): restore valid HSL background channels and map dark fantasy colors in tailwind"
```

---

### Task 2: Core Utility Hooks (`useReducedMotion`, `useScrollReveal`, `useTextSplit`)

**Files:**
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useScrollReveal.ts`
- Create: `src/hooks/useTextSplit.ts`
- Create: `src/test/hooks-utility.test.tsx`

**Interfaces:**
- Produces:
  - `useReducedMotion(): boolean` (reactive reduced motion hook, ssr/jsdom safe)
  - `useScrollReveal(options?: IntersectionObserverInit): { ref: React.RefObject<HTMLDivElement>; revealed: boolean }`
  - `splitWords(text: string): string[]`
  - `splitChars(text: string): string[]`

- [ ] **Step 1: Write failing tests for utility hooks**

Create `src/test/hooks-utility.test.tsx`:
```tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { splitWords, splitChars } from '../hooks/useTextSplit';

describe('Core Animation & A11y Hooks', () => {
  it('useReducedMotion returns false by default when window.matchMedia does not match reduce', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(typeof result.current).toBe('boolean');
    expect(result.current).toBe(false);
  });

  it('splitWords splits text into clean words', () => {
    const words = splitWords('SURVEY CORPS OF SOFTWARE');
    expect(words).toEqual(['SURVEY', 'CORPS', 'OF', 'SOFTWARE']);
  });

  it('splitChars splits text into individual characters', () => {
    const chars = splitChars('BEYOND');
    expect(chars).toEqual(['B', 'E', 'Y', 'O', 'N', 'D']);
  });

  it('useScrollReveal provides a ref and revealed state', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.revealed).toBe('boolean');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/test/hooks-utility.test.tsx`
Expected: FAIL (files do not exist)

- [ ] **Step 3: Implement `useReducedMotion.ts`, `useScrollReveal.ts`, and `useTextSplit.ts`**

Create `src/hooks/useReducedMotion.ts`:
```ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return matches;
}
```

Create `src/hooks/useScrollReveal.ts`:
```ts
import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        setRevealed(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, revealed };
}
```

Create `src/hooks/useTextSplit.ts`:
```ts
export function splitWords(text: string): string[] {
  if (!text) return [];
  return text.trim().split(/\s+/);
}

export function splitChars(text: string): string[] {
  if (!text) return [];
  return text.split('');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/test/hooks-utility.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useReducedMotion.ts src/hooks/useScrollReveal.ts src/hooks/useTextSplit.ts src/test/hooks-utility.test.tsx
git commit -m "feat(hooks): add useReducedMotion, useScrollReveal, and text splitting utilities"
```

---

### Task 3: Reusable Runic Text Scramble Component (`TextScramble.tsx`)

**Files:**
- Create: `src/components/dark-fantasy/TextScramble.tsx`
- Create: `src/test/text-scramble.test.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from `src/hooks/useReducedMotion.ts`.
- Produces: `<TextScramble text={string} duration?: number trigger?: boolean as?: Component />` for runic decode effects across headings and cards.

- [ ] **Step 1: Write failing test for TextScramble**

Create `src/test/text-scramble.test.tsx`:
```tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextScramble } from '../components/dark-fantasy/TextScramble';

describe('TextScramble Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders target text with accessible aria-label', () => {
    render(<TextScramble text="01 — THE CREED" as="h2" />);
    const el = screen.getByLabelText('01 — THE CREED');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('H2');
  });

  it('eventually resolves to target text after duration', () => {
    render(<TextScramble text="SURVEY CORPS" duration={300} />);
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(screen.getByText('SURVEY CORPS')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/test/text-scramble.test.tsx`
Expected: FAIL (component missing)

- [ ] **Step 3: Implement `TextScramble.tsx`**

Create `src/components/dark-fantasy/TextScramble.tsx`:
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const RUNIC_GLYPHS = '᚛᚜⟐⟡⚡︎ᛟᚦᚨᚱᚲᚷᚹᚺᚻᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞ';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: boolean;
  duration?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  trigger = true,
  duration = 800,
  as: Component = 'span',
}) => {
  const reducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(reducedMotion ? text : '');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || !trigger) {
      setDisplayText(text);
      return;
    }

    const chars = text.split('');
    const length = chars.length;
    const startTime = Date.now();

    const updateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const resolvedCount = Math.floor(progress * length);

      const scrambled = chars
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < resolvedCount) return char;
          const randomGlyph = RUNIC_GLYPHS[Math.floor(Math.random() * RUNIC_GLYPHS.length)];
          return randomGlyph;
        })
        .join('');

      setDisplayText(scrambled);

      if (progress < 1) {
        timerRef.current = window.setTimeout(updateFrame, 40);
      } else {
        setDisplayText(text);
      }
    };

    timerRef.current = window.setTimeout(updateFrame, 40);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [text, trigger, duration, reducedMotion]);

  return (
    <Component className={className} aria-label={text}>
      {displayText || text}
    </Component>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/test/text-scramble.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/TextScramble.tsx src/test/text-scramble.test.tsx
git commit -m "feat(ui): implement reusable runic TextScramble component with reduced-motion support"
```

---

### Task 4: Lenis ↔ GSAP Synchronization & Chapter Mode Context Contract

**Files:**
- Create: `src/components/dark-fantasy/ChapterModeContext.tsx`
- Modify: `src/components/SmoothScroll.tsx`
- Modify: `src/components/dark-fantasy/DarkFantasyShell.tsx`
- Test: `src/test/smooth-scroll.test.tsx`
- Test: `src/test/dark-fantasy-shell.test.tsx`

**Interfaces:**
- Consumes: GSAP + ScrollTrigger, Lenis instance.
- Produces:
  - `ChapterModeContext` with `{ mode: 'fluid' | 'chapter', scrollFXEnabled: boolean }`
  - `useLenisContext()` with `{ lenis, scrollTo, stop, start }`
  - Eliminates duplicate Lenis instances between `App.tsx` and `DarkFantasyShell.tsx`.

- [ ] **Step 1: Write failing tests for Lenis-GSAP sync and ChapterModeContext**

Update `src/test/smooth-scroll.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SmoothScroll, { useLenisContext } from '../components/SmoothScroll';

const TestChild = () => {
  const { scrollTo, stop, start } = useLenisContext();
  return (
    <div>
      <span>Child rendered</span>
      <button onClick={() => scrollTo('#creed')}>Scroll CTA</button>
      <button onClick={stop}>Stop Scroll</button>
      <button onClick={start}>Start Scroll</button>
    </div>
  );
};

describe('SmoothScroll Component', () => {
  it('renders children and exposes scrollTo, stop, start from context', () => {
    render(
      <SmoothScroll enabled={true}>
        <TestChild />
      </SmoothScroll>
    );
    expect(screen.getByText('Child rendered')).toBeInTheDocument();
    expect(screen.getByText('Stop Scroll')).toBeInTheDocument();
    expect(screen.getByText('Start Scroll')).toBeInTheDocument();
  });
});
```

Update `src/test/dark-fantasy-shell.test.tsx` to verify `ChapterModeContext` is provided:
```tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

    expect(screen.getAllByText(/Aryo A\.P/i)).toHaveLength(2);
    expect(
      screen.getByText(/ARYO A\.P — DEDICATE YOUR HEART/i)
    ).toBeInTheDocument();
    expect(
      within(document.getElementById('home') as HTMLElement).getByText('BEYOND')
    ).toBeInTheDocument();
    expect(
      within(document.getElementById('vision') as HTMLElement).getByText('BEYOND')
    ).toBeInTheDocument();
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();

    const modeBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    fireEvent.click(modeBtn);
    expect(screen.getByText(/CHAPTER SNAP/i)).toHaveClass('text-[#b4442e]');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/test/smooth-scroll.test.tsx`
Expected: FAIL due to missing `stop` and `start` on `useLenisContext`.

- [ ] **Step 3: Implement `ChapterModeContext.tsx`, update `SmoothScroll.tsx` and `DarkFantasyShell.tsx`**

Create `src/components/dark-fantasy/ChapterModeContext.tsx`:
```tsx
import { createContext, useContext } from 'react';

export interface ChapterModeContextType {
  mode: 'fluid' | 'chapter';
  scrollFXEnabled: boolean;
}

export const ChapterModeContext = createContext<ChapterModeContextType>({
  mode: 'fluid',
  scrollFXEnabled: true,
});

export const useChapterMode = () => useContext(ChapterModeContext);
```

Update `src/components/SmoothScroll.tsx`:
```tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
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

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof ResizeObserver === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger per Spec §2.2
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
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
        if (el && typeof (el as HTMLElement).scrollIntoView === 'function') {
          (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      } else if (target instanceof HTMLElement) {
        if (typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
```

In `src/components/dark-fantasy/DarkFantasyShell.tsx`:
Remove the nested `<SmoothScroll enabled={mode === 'fluid'}>` wrapper inside `DarkFantasyShell`.
Instead, provide `ChapterModeContext` and control `lenis.stop()` when `mode === 'chapter'`, `lenis.start()` when `mode === 'fluid'`:
```tsx
import { ChapterModeContext } from './ChapterModeContext';

// Inside DarkFantasyShell component:
export const DarkFantasyShell: React.FC = () => {
  const [mode, setMode] = useState<ShellMode>('fluid');
  const [activeIndex, setActiveIndex] = useState(0);
  const { stop, start } = useLenisContext();

  const handleToggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'fluid' ? 'chapter' : 'fluid';
      if (next === 'chapter') {
        stop();
      } else {
        start();
      }
      return next;
    });
  }, [stop, start]);

  return (
    <ChapterModeContext.Provider value={{ mode, scrollFXEnabled: mode === 'fluid' }}>
      <ShellBody
        mode={mode}
        onToggleMode={handleToggleMode}
        activeIndex={activeIndex}
        onSelectIndex={setActiveIndex}
      />
    </ChapterModeContext.Provider>
  );
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/test/smooth-scroll.test.tsx src/test/dark-fantasy-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/ChapterModeContext.tsx src/components/SmoothScroll.tsx src/components/dark-fantasy/DarkFantasyShell.tsx src/test/smooth-scroll.test.tsx src/test/dark-fantasy-shell.test.tsx
git commit -m "feat(scroll): synchronize Lenis with GSAP ticker and introduce ChapterModeContext"
```

---

### Task 5: Modal Hardening & A11y Polish (`CampaignDossierModal`, `EmberCanvas`, `TacticalHeader`, `NavRail`)

**Files:**
- Modify: `src/components/dark-fantasy/CampaignDossierModal.tsx`
- Modify: `src/components/dark-fantasy/EmberCanvas.tsx`
- Modify: `src/components/dark-fantasy/TacticalHeader.tsx`
- Modify: `src/components/dark-fantasy/NavRail.tsx`
- Test: `src/test/campaigns-section.test.tsx`
- Test: `src/test/ember-canvas.test.tsx`
- Test: `src/test/tactical-hud.test.tsx`

**Interfaces:**
- Consumes: `useLenisContext().stop/start` for modal opening/closing.
- Produces: Focus trap, focus restoration, `z-[90]` modal layer, visibilitychange battery saving in EmberCanvas, `aria-pressed` and `aria-current` indicators.

- [ ] **Step 1: Write failing tests for modal focus management and a11y attributes**

Update `src/test/tactical-hud.test.tsx` to assert `aria-pressed` and `aria-current`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TacticalHeader } from '../components/dark-fantasy/TacticalHeader';
import { NavRail } from '../components/dark-fantasy/NavRail';

describe('Tactical Header & Navigation Rail A11y', () => {
  it('includes aria-pressed on mode toggle and audio toggle', () => {
    render(
      <TacticalHeader
        mode="fluid"
        onToggleMode={vi.fn()}
        isMuted={false}
        onToggleAudio={vi.fn()}
      />
    );
    const modeBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    expect(modeBtn).toHaveAttribute('aria-pressed', 'false');

    const audioBtn = screen.getByRole('button', { name: /mute tactical audio/i });
    expect(audioBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks the active nav item with aria-current="true"', () => {
    render(<NavRail activeIndex={2} onSelectSection={vi.fn()} />);
    const activeBtn = screen.getByRole('button', { name: /jump to section arsenal/i });
    expect(activeBtn).toHaveAttribute('aria-current', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/test/tactical-hud.test.tsx`
Expected: FAIL (missing `aria-pressed` or `aria-current`)

- [ ] **Step 3: Update `CampaignDossierModal.tsx`, `EmberCanvas.tsx`, `TacticalHeader.tsx`, `NavRail.tsx`**

In `src/components/dark-fantasy/CampaignDossierModal.tsx`:
Implement `z-[90]`, focus trap, focus restoration, `lenis.stop()/start()`, and body scroll lock:
```tsx
import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { Campaign } from '../../lib/dark-fantasy-data';
import { useLenisContext } from '../SmoothScroll';

export const CampaignDossierModal: React.FC<{
  campaign: Campaign | null;
  onClose: () => void;
}> = ({ campaign, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const { stop, start } = useLenisContext();

  useEffect(() => {
    if (!campaign) return;

    // Save previous active element for focus restoration
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Lock scroll
    stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the modal container
    const closeBtn = modalRef.current?.querySelector('button') as HTMLElement | null;
    closeBtn?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      start();
      previousActiveElementRef.current?.focus();
    };
  }, [campaign, onClose, stop, start]);

  if (!campaign) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Campaign Dossier: ${campaign.title}`}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
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

In `src/components/dark-fantasy/EmberCanvas.tsx`:
Add visibilitychange handler and mobile particle budgeting:
```tsx
    // Inside EmberCanvas useEffect:
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup:
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
```

In `src/components/dark-fantasy/TacticalHeader.tsx`:
Add `aria-pressed={mode === 'chapter'}` to the mode toggle button, and `aria-pressed={!isMuted}` to the audio button.

In `src/components/dark-fantasy/NavRail.tsx`:
Add `aria-current={isActive ? 'true' : undefined}` to each nav button.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/test/tactical-hud.test.tsx src/test/campaigns-section.test.tsx src/test/ember-canvas.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/CampaignDossierModal.tsx src/components/dark-fantasy/EmberCanvas.tsx src/components/dark-fantasy/TacticalHeader.tsx src/components/dark-fantasy/NavRail.tsx src/test/tactical-hud.test.tsx
git commit -m "fix(a11y): add modal focus trap, z-90 scale, canvas visibility listener, and ARIA attributes"
```

---

### Task 6: Hero & Creed GSAP Scroll Choreography

**Files:**
- Modify: `src/components/dark-fantasy/HeroSection.tsx`
- Modify: `src/components/dark-fantasy/CreedSection.tsx`
- Test: `src/test/hero-section.test.tsx`
- Test: `src/test/creed-section.test.tsx`

**Interfaces:**
- Consumes: `useChapterMode`, `useReducedMotion`, `splitWords`, `TextScramble`, GSAP + ScrollTrigger.
- Produces: Hero recession scroll scrub, Creed pinned quote word reveal with mobile / reduced-motion fallback.

- [ ] **Step 1: Write failing tests for Hero & Creed enhancements**

Update `src/test/creed-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreedSection } from '../components/dark-fantasy/CreedSection';

describe('CreedSection Component', () => {
  it('renders section heading and semantic section with aria-labelledby', () => {
    render(<CreedSection />);
    const section = document.getElementById('creed');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'creed-heading');
    expect(screen.getByLabelText('01 — THE CREED')).toBeInTheDocument();
  });
});
```

Update `src/test/hero-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSection } from '../components/dark-fantasy/HeroSection';

describe('HeroSection Component', () => {
  it('renders with semantic aria-labelledby on home section', () => {
    render(<HeroSection onAdvance={() => {}} />);
    const section = document.getElementById('home');
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/test/hero-section.test.tsx src/test/creed-section.test.tsx`
Expected: FAIL (missing `aria-labelledby`)

- [ ] **Step 3: Implement GSAP choreography in `HeroSection.tsx` and `CreedSection.tsx`**

In `src/components/dark-fantasy/HeroSection.tsx`:
Add recession scrub, fog layers, `aria-labelledby`, and GSAP cleanup:
```tsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { HERO_DATA } from '../../lib/dark-fantasy-data';
import { useChapterMode } from './ChapterModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const HeroSection: React.FC<{ onAdvance: () => void }> = ({ onAdvance }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const { scrollFXEnabled } = useChapterMode();
  const reducedMotion = useReducedMotion();

  // Entrance animation (Anime.js)
  useEffect(() => {
    if (!headlineRef.current || reducedMotion) return;
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
      // animejs fallback safe
    }
  }, [reducedMotion]);

  // GSAP Recession & Fog Parallax ScrollTrigger
  useEffect(() => {
    if (!scrollFXEnabled || reducedMotion || !containerRef.current || !headlineRef.current) return;
    if (typeof window === 'undefined' || typeof gsap === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.to(headlineRef.current, {
        scale: 0.85,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-fog-1', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-fog-2', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scrollFXEnabled, reducedMotion]);

  return (
    <section
      id="home"
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-24 pt-32 pb-16 z-10 overflow-hidden"
    >
      {/* 2 Subtle Fog Background Layers */}
      <div className="hero-fog-1 absolute inset-0 pointer-events-none opacity-20 bg-radial from-[#4d6155]/20 to-transparent will-change-transform" />
      <div className="hero-fog-2 absolute inset-0 pointer-events-none opacity-15 bg-radial from-[#1c1a17] to-transparent will-change-transform" />

      {/* Top Tagline */}
      <div className="flex items-center gap-3 relative z-10">
        <span className="w-8 h-px bg-[#7c1f1a]" />
        <span className="font-military text-xs sm:text-sm tracking-[0.3em] text-[#b4442e] uppercase">
          {HERO_DATA.tagline}
        </span>
      </div>

      {/* Main Monolith Headline */}
      <div ref={headlineRef} className="my-auto py-12 relative z-10 will-change-transform">
        <h1
          id="hero-heading"
          className="font-display font-black leading-[0.88] tracking-tight text-[#d6cfc2] text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] select-none"
        >
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
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-8 border-t border-[#2a2723]/60 relative z-10">
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

In `src/components/dark-fantasy/CreedSection.tsx`:
Add pinned word reveal on desktop, `TextScramble` heading, stats counter trigger, and fallback for mobile / reduced motion:
```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CREED_DATA } from '../../lib/dark-fantasy-data';
import profileAvatar from '../../assets/profile-avatar.jpg';
import { useChapterMode } from './ChapterModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { splitWords } from '../../hooks/useTextSplit';
import { TextScramble } from './TextScramble';

export const CreedSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const { scrollFXEnabled } = useChapterMode();
  const reducedMotion = useReducedMotion();

  const words = splitWords(CREED_DATA.quote);

  useEffect(() => {
    if (!scrollFXEnabled || reducedMotion || typeof window === 'undefined') return;
    if (window.innerWidth < 768) return; // Spec §3.4: matikan pin di <768px

    const ctx = gsap.context(() => {
      const wordElements = wordsRef.current?.querySelectorAll('.creed-word');
      if (wordElements && wordElements.length > 0) {
        gsap.fromTo(
          wordElements,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=120%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [scrollFXEnabled, reducedMotion]);

  return (
    <section
      id="creed"
      ref={containerRef}
      aria-labelledby="creed-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <TextScramble
          id="creed-heading"
          as="span"
          text="01 — THE CREED"
          className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]"
        />
      </div>

      {/* Monumental Quote with Split Words */}
      <blockquote
        ref={wordsRef}
        className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight text-[#d6cfc2] max-w-5xl"
      >
        "{words.map((word, i) => (
          <span
            key={i}
            className="creed-word inline-block mr-2.5 transition-opacity"
            style={{ opacity: reducedMotion ? 1 : undefined }}
          >
            {word}
          </span>
        ))}"
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

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/test/hero-section.test.tsx src/test/creed-section.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/HeroSection.tsx src/components/dark-fantasy/CreedSection.tsx src/test/hero-section.test.tsx src/test/creed-section.test.tsx
git commit -m "feat(animation): implement hero recession scrub and creed pinned word reveal with a11y fallbacks"
```

---

### Task 7: Arsenal, Vision & Summon Polish

**Files:**
- Modify: `src/components/dark-fantasy/ArsenalSection.tsx`
- Modify: `src/components/dark-fantasy/VisionSection.tsx`
- Modify: `src/components/dark-fantasy/SummonSection.tsx`
- Test: `src/test/arsenal-section.test.tsx`
- Test: `src/test/vision-summon.test.tsx`

**Interfaces:**
- Consumes: `useChapterMode`, `useReducedMotion`, `TextScramble`, Sonner toast.
- Produces: Card entrance, horizontal vision scrub (max `±6%`), Summon form validation (`minLength={10}`, `maxLength={2000}`, >1800 char manual warning).

- [ ] **Step 1: Write failing tests for Arsenal, Vision, and Summon constraints**

Update `src/test/vision-summon.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisionSection } from '../components/dark-fantasy/VisionSection';
import { SummonSection } from '../components/dark-fantasy/SummonSection';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Vision & Summon Sections Polish', () => {
  it('renders VisionSection with semantic aria-labelledby', () => {
    render(<VisionSection />);
    const section = document.getElementById('vision');
    expect(section).toHaveAttribute('aria-labelledby', 'vision-heading');
  });

  it('renders SummonSection with minLength and maxLength validation on report', () => {
    render(
      <TactileSoundProvider>
        <SummonSection />
      </TactileSoundProvider>
    );
    const textarea = screen.getByPlaceholderText(/describe the terrain/i);
    expect(textarea).toHaveAttribute('minLength', '10');
    expect(textarea).toHaveAttribute('maxLength', '2000');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/test/vision-summon.test.tsx`
Expected: FAIL (missing `aria-labelledby` or `minLength` attribute)

- [ ] **Step 3: Update `ArsenalSection.tsx`, `VisionSection.tsx`, and `SummonSection.tsx`**

In `src/components/dark-fantasy/ArsenalSection.tsx`:
Add `aria-labelledby="arsenal-heading"`, card entrance reveal, and hover title scramble:
```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ARSENAL_DATA } from '../../lib/dark-fantasy-data';
import { useChapterMode } from './ChapterModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollFXEnabled } = useChapterMode();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!scrollFXEnabled || reducedMotion || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.arsenal-card',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [scrollFXEnabled, reducedMotion]);

  return (
    <section
      id="arsenal"
      ref={containerRef}
      aria-labelledby="arsenal-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
            02 — THE ARSENAL
          </span>
          <h2 id="arsenal-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-2">
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
            className="arsenal-card group relative p-8 sm:p-12 border-r border-b border-[#2a2723] bg-[#0a0908] hover:bg-[#12100e] transition-all duration-300"
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

In `src/components/dark-fantasy/VisionSection.tsx`:
Add `aria-labelledby="vision-heading"`, horizontal text parallax scrub (max `±6%`), and horizon cards stagger:
```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { VISION_DATA } from '../../lib/dark-fantasy-data';
import { useChapterMode } from './ChapterModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const VisionSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { scrollFXEnabled } = useChapterMode();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!scrollFXEnabled || reducedMotion || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Horizontal text scrub bounded to max ±6%
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          xPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Storm overlay opacity scrub
      gsap.to('.vision-storm-overlay', {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scrollFXEnabled, reducedMotion]);

  return (
    <section
      id="vision"
      ref={containerRef}
      aria-labelledby="vision-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723] overflow-hidden"
    >
      <div className="vision-storm-overlay absolute inset-0 pointer-events-none opacity-10 bg-radial from-[#4d6155]/30 to-transparent" />

      <div className="mb-10 relative z-10">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          04 — FUTURE VISION
        </span>
      </div>

      <h2
        id="vision-heading"
        ref={headlineRef}
        className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#d6cfc2] leading-tight max-w-5xl relative z-10 will-change-transform"
      >
        {VISION_DATA.titlePrimary}{' '}
        <span className="text-[#b4442e]">{VISION_DATA.titleHighlight}</span>{' '}
        {VISION_DATA.titleSecondary}
      </h2>

      <p className="font-body text-lg text-[#b7ad99] max-w-3xl leading-relaxed mt-10 relative z-10">
        {VISION_DATA.manifesto}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-[#2a2723] relative z-10">
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

In `src/components/dark-fantasy/SummonSection.tsx`:
Add `minLength={10}`, `maxLength={2000}`, length check > 1800 with error toast, and `aria-labelledby`:
```tsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SUMMON_DATA } from '../../lib/dark-fantasy-data';
import { useTactileSound } from '../dossier/TactileSoundManager';

export const SummonSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', objective: '', report: '' });
  const { playSound } = useTactileSound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('stampThud');

    // Mailto length limit handling per Spec §3.8
    if (form.report.length > 1800) {
      toast.error(
        `Report payload exceeds 1,800 characters. Truncating mailto draft; please transmit complete report directly to ${SUMMON_DATA.dispatch}.`
      );
    }

    const trimmedReport = form.report.slice(0, 1800);
    const mailSubject = encodeURIComponent(`[EXPEDITION REPORT] ${form.objective || 'New Directive'}`);
    const mailBody = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nObjective: ${form.objective}\n\nReport:\n${trimmedReport}`
    );

    toast.success('Raven dispatched. Launching email transmission.');
    window.location.href = `mailto:${SUMMON_DATA.dispatch}?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <section
      id="summon"
      aria-labelledby="summon-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]"
    >
      <div className="mb-8">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          05 — SUMMON
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Title & Dispatch Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h2 id="summon-heading" className="font-display text-4xl sm:text-5xl font-bold text-[#d6cfc2]">
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
              minLength={10}
              maxLength={2000}
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

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/test/arsenal-section.test.tsx src/test/vision-summon.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/ArsenalSection.tsx src/components/dark-fantasy/VisionSection.tsx src/components/dark-fantasy/SummonSection.tsx src/test/vision-summon.test.tsx
git commit -m "feat(sections): polish Arsenal, Vision, and Summon sections with a11y labels and form bounds"
```

---

### Task 8: Wall Campaign Data Adaptation & WallBreach Component

**Files:**
- Modify: `src/lib/dark-fantasy-data.ts`
- Create: `src/components/dark-fantasy/WallBreach.tsx`
- Create: `src/test/wall-breach.test.tsx`
- Modify: `src/test/dark-fantasy-data.test.ts`

**Interfaces:**
- Consumes: `playSound` from `useTactileSound`.
- Produces:
  - `WallZone = 'sina' | 'rose' | 'maria' | 'beyond'`
  - Updated `Campaign` interface with optional `wallZone` and `era`
  - `<WallBreach wallName={string} zoneLabel={string} isBreached?: boolean onBreachTrigger?: () => void />`

- [ ] **Step 1: Write failing tests for data wallZone mapping and WallBreach component**

Update `src/test/dark-fantasy-data.test.ts`:
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

  it('includes all 6 campaigns mapped to wall sectors with optional wallZone and era', () => {
    expect(CAMPAIGNS_DATA.length).toBe(6);
    const titles = CAMPAIGNS_DATA.map((c) => c.title);
    expect(titles).toContain('KampungKu');
    expect(titles).toContain('Rest Area Business - Idle Tycoon Game');
    expect(titles).toContain('TrasMart');
    expect(titles).toContain('SarPras');
    expect(titles).toContain('FrameWork');
    expect(titles).toContain('Jawara');

    const sinaCampaigns = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'sina');
    const roseCampaigns = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'rose');
    const mariaCampaigns = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'maria');

    expect(sinaCampaigns.length).toBe(2);
    expect(roseCampaigns.length).toBe(3);
    expect(mariaCampaigns.length).toBe(1);
  });

  it('exports 4 arsenal quadrants', () => {
    expect(ARSENAL_DATA.length).toBe(4);
  });
});
```

Create `src/test/wall-breach.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WallBreach } from '../components/dark-fantasy/WallBreach';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('WallBreach Component', () => {
  it('renders wall name and fortification barrier', () => {
    render(
      <TactileSoundProvider>
        <WallBreach wallName="WALL SINA" zoneLabel="INTERIOR PERIMETER" />
      </TactileSoundProvider>
    );
    expect(screen.getByText('WALL SINA')).toBeInTheDocument();
    expect(screen.getByText('INTERIOR PERIMETER')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/test/dark-fantasy-data.test.ts src/test/wall-breach.test.tsx`
Expected: FAIL (WallBreach does not exist, wallZone not present on campaigns)

- [ ] **Step 3: Modify `src/lib/dark-fantasy-data.ts` and create `src/components/dark-fantasy/WallBreach.tsx`**

In `src/lib/dark-fantasy-data.ts`:
Add `WallZone` type and optional fields to `Campaign`:
```ts
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
```

Update `CAMPAIGNS_DATA` array entries with data-driven mapping per Spec §3.6.3:
```ts
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
```

Create `src/components/dark-fantasy/WallBreach.tsx`:
```tsx
import React, { useEffect, useRef } from 'react';
import { useTactileSound } from '../dossier/TactileSoundManager';

interface WallBreachProps {
  wallName: string;
  zoneLabel: string;
  isBreached?: boolean;
}

export const WallBreach: React.FC<WallBreachProps> = ({
  wallName,
  zoneLabel,
  isBreached = false,
}) => {
  const { playSound } = useTactileSound();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (isBreached && !triggeredRef.current) {
      triggeredRef.current = true;
      playSound('stampThud');
    }
  }, [isBreached, playSound]);

  // Max 12 debris fragments (Spec §3.6.2 & §10: GPU transform only)
  const debrisFragments = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    dx: ((i % 4) - 1.5) * 40,
    dy: Math.floor(i / 4) * 35 - 35,
    rotate: (i - 6) * 15,
  }));

  return (
    <div className="relative w-72 sm:w-96 h-[80vh] flex-shrink-0 flex flex-col items-center justify-center border-x-2 border-[#2a2723] bg-gradient-to-b from-[#1c1a17] via-[#12100e] to-[#0a0908] px-8 text-center select-none overflow-hidden">
      {/* Stone Texture Lines & Noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2a2723_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Outward Facing Fortification Header */}
      <div className="relative z-10 space-y-3">
        <span className="font-military text-xs tracking-[0.3em] text-[#b4442e]">
          {zoneLabel}
        </span>
        <h3 className="font-display text-4xl sm:text-5xl font-black text-[#d6cfc2] tracking-wider">
          {wallName}
        </h3>
        <p className="font-military text-[11px] tracking-widest text-[#b7ad99]/60 uppercase">
          PERIMETER DEFENSE SECTOR
        </p>
      </div>

      {/* Wall Breach SVG Crack */}
      <div className="relative my-8 w-full max-w-[200px] h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full stroke-[#b4442e] fill-none stroke-2 transition-all duration-700"
          style={{
            filter: isBreached ? 'drop-shadow(0 0 8px #b4442e)' : undefined,
          }}
        >
          <path d="M50 0 L55 30 L45 50 L60 75 L50 100" />
          <path d="M55 30 L70 40" />
          <path d="M45 50 L30 65" />
        </svg>

        {/* 12 GPU-accelerated Debris Fragments */}
        {debrisFragments.map((frag) => (
          <span
            key={frag.id}
            className={`absolute w-3 h-3 bg-[#2a2723] border border-[#b4442e]/40 transition-transform duration-700 ease-out ${
              isBreached ? 'opacity-90' : 'opacity-0 scale-50'
            }`}
            style={{
              transform: isBreached
                ? `translate3d(${frag.dx}px, ${frag.dy}px, 0) rotate(${frag.rotate}deg)`
                : 'translate3d(0, 0, 0) rotate(0deg)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-2 font-military text-xs tracking-widest text-[#b7ad99]">
        <span className="w-2 h-2 rounded-full bg-[#b4442e] animate-ping" />
        <span>{isBreached ? 'BREACH ENGAGED' : 'FORTIFICATION INTACT'}</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/test/dark-fantasy-data.test.ts src/test/wall-breach.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/dark-fantasy-data.ts src/components/dark-fantasy/WallBreach.tsx src/test/wall-breach.test.tsx src/test/dark-fantasy-data.test.ts
git commit -m "feat(campaigns): map projects to wall zones and create WallBreach component"
```

---

### Task 9: Campaigns Phase 2 Horizontal Journey & Responsive Fallback

**Files:**
- Create: `src/components/dark-fantasy/CampaignsJourney.tsx`
- Modify: `src/components/dark-fantasy/CampaignsSection.tsx`
- Create: `src/test/campaigns-journey.test.tsx`
- Modify: `src/test/campaigns-section.test.tsx`

**Interfaces:**
- Consumes: `CAMPAIGNS_DATA`, `useChapterMode`, `useReducedMotion`, `WallBreach`, `CampaignDossierModal`.
- Produces:
  - `<CampaignsJourney onOpenDossier={(c: Campaign) => void} />` (pinned horizontal expedition track)
  - Responsive fallback in `CampaignsSection.tsx` rendering vertical grid on `<1000px`, `prefersReducedMotion`, or `mode === 'chapter'`.

- [ ] **Step 1: Write failing tests for CampaignsJourney and responsive fallback**

Create `src/test/campaigns-journey.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CampaignsJourney } from '../components/dark-fantasy/CampaignsJourney';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('CampaignsJourney Component (Phase 2)', () => {
  it('renders all 3 wall breach sections and beyond horizon marker', () => {
    render(
      <TactileSoundProvider>
        <CampaignsJourney onOpenDossier={vi.fn()} />
      </TactileSoundProvider>
    );

    expect(screen.getByText('WALL SINA')).toBeInTheDocument();
    expect(screen.getByText('WALL ROSE')).toBeInTheDocument();
    expect(screen.getByText('WALL MARIA')).toBeInTheDocument();
    expect(screen.getByText(/EXPEDITION IN PROGRESS/i)).toBeInTheDocument();
  });
});
```

Update `src/test/campaigns-section.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CampaignsSection } from '../components/dark-fantasy/CampaignsSection';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('CampaignsSection Integration', () => {
  it('renders campaign cards and opens dossier modal upon click', () => {
    render(
      <TactileSoundProvider>
        <CampaignsSection />
      </TactileSoundProvider>
    );
    expect(screen.getByText('KampungKu')).toBeInTheDocument();
    expect(screen.getByText('TrasMart')).toBeInTheDocument();

    const kampCard = screen.getByText('KampungKu').closest('[role="button"]');
    expect(kampCard).toBeInTheDocument();
    if (kampCard) fireEvent.click(kampCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/test/campaigns-journey.test.tsx`
Expected: FAIL (CampaignsJourney does not exist)

- [ ] **Step 3: Implement `CampaignsJourney.tsx` and integrate fallback in `CampaignsSection.tsx`**

Create `src/components/dark-fantasy/CampaignsJourney.tsx`:
```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CAMPAIGNS_DATA, Campaign } from '../../lib/dark-fantasy-data';
import { WallBreach } from './WallBreach';
import { useTactileSound } from '../dossier/TactileSoundManager';

export const CampaignsJourney: React.FC<{
  onOpenDossier: (campaign: Campaign) => void;
}> = ({ onOpenDossier }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { playSound } = useTactileSound();

  const sinaProjects = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'sina');
  const roseProjects = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'rose');
  const mariaProjects = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'maria');

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderProjectCard = (item: Campaign) => (
    <div
      key={item.id}
      onClick={() => onOpenDossier(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpenDossier(item);
      }}
      className="group relative w-80 sm:w-96 flex-shrink-0 p-8 rounded border border-[#2a2723] bg-[#0a0908] hover:border-[#b4442e] transition-all duration-300 cursor-pointer text-left flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between text-xs font-military tracking-widest text-[#b7ad99]/70">
          <span className="px-2 py-0.5 rounded border border-[#2a2723] bg-[#12100e]">
            {item.district}
          </span>
          <span>{item.year}</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-[#d6cfc2] mt-6 group-hover:text-white transition-colors">
          {item.title}
        </h3>
        <p className="font-military text-xs tracking-wider text-[#b4442e] uppercase mt-1">
          {item.role}
        </p>
        <p className="font-body text-sm text-[#b7ad99] line-clamp-3 mt-3">
          {item.briefing}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-1.5">
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
          <span>INSPECT DOSSIER</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center h-full gap-8 px-12 sm:px-24 w-max will-change-transform"
      >
        {/* Sina Zone (Oldest / Interior) */}
        <div className="flex items-center gap-8">
          <div className="w-72 flex-shrink-0 text-left">
            <span className="font-military text-xs tracking-[0.25em] text-[#b4442e]">
              ZONE 01 · INTERIOR
            </span>
            <h2 className="font-display text-4xl font-bold text-[#d6cfc2] mt-2">
              WALL SINA
            </h2>
            <p className="font-body text-sm text-[#b7ad99] mt-3">
              Earliest core architectures and foundations that anchored the journey.
            </p>
          </div>
          {sinaProjects.map(renderProjectCard)}
        </div>

        {/* Breach 1 */}
        <WallBreach wallName="WALL SINA" zoneLabel="BREACH PERIMETER I" isBreached />

        {/* Rose Zone (Mid) */}
        <div className="flex items-center gap-8">
          <div className="w-72 flex-shrink-0 text-left">
            <span className="font-military text-xs tracking-[0.25em] text-[#b4442e]">
              ZONE 02 · INTERMEDIATE
            </span>
            <h2 className="font-display text-4xl font-bold text-[#d6cfc2] mt-2">
              WALL ROSE
            </h2>
            <p className="font-body text-sm text-[#b7ad99] mt-3">
              Production scale systems and simulation engines deployed under live pressure.
            </p>
          </div>
          {roseProjects.map(renderProjectCard)}
        </div>

        {/* Breach 2 */}
        <WallBreach wallName="WALL ROSE" zoneLabel="BREACH PERIMETER II" isBreached />

        {/* Maria Zone (Latest) */}
        <div className="flex items-center gap-8">
          <div className="w-72 flex-shrink-0 text-left">
            <span className="font-military text-xs tracking-[0.25em] text-[#b4442e]">
              ZONE 03 · FRONTIER
            </span>
            <h2 className="font-display text-4xl font-bold text-[#d6cfc2] mt-2">
              WALL MARIA
            </h2>
            <p className="font-body text-sm text-[#b7ad99] mt-3">
              The outer rampart of our software: latest production platforms standing guard.
            </p>
          </div>
          {mariaProjects.map(renderProjectCard)}
        </div>

        {/* Breach 3 */}
        <WallBreach wallName="WALL MARIA" zoneLabel="FINAL PERIMETER BREACH" isBreached />

        {/* Beyond The Walls (Horizon) */}
        <div className="w-[500px] flex-shrink-0 p-12 rounded border border-[#2a2723] bg-gradient-to-r from-[#0a0908] to-[#4d6155]/20 text-left flex flex-col justify-center">
          <span className="font-military text-xs tracking-[0.3em] text-[#4d6155] uppercase">
            UNCHARTED TERRITORY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-3">
            BEYOND THE WALLS
          </h2>
          <p className="font-body text-sm text-[#b7ad99] mt-4 leading-relaxed">
            The perimeter ends here. Ahead lies open sea and wild territory where upcoming distributed engines are forged.
          </p>

          <div className="mt-8 flex items-center gap-3 p-3 rounded border border-[#4d6155]/50 bg-[#12100e] text-xs font-military tracking-widest text-[#d6cfc2]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4d6155] animate-ping" />
            <span>⟐ EXPEDITION IN PROGRESS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

In `src/components/dark-fantasy/CampaignsSection.tsx`:
Add dual-mode fallback logic:
```tsx
import React, { useEffect, useState } from 'react';
import { CAMPAIGNS_DATA, Campaign } from '../../lib/dark-fantasy-data';
import { useTactileSound } from '../dossier/TactileSoundManager';
import { CampaignDossierModal } from './CampaignDossierModal';
import { CampaignsJourney } from './CampaignsJourney';
import { useChapterMode } from './ChapterModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CampaignsSection: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { playSound } = useTactileSound();
  const { scrollFXEnabled, mode } = useChapterMode();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkSize = () => {
      setIsLargeScreen(window.innerWidth >= 1000);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleOpenDossier = (item: Campaign) => {
    playSound('paperSlide');
    setSelectedCampaign(item);
  };

  const handleCloseDossier = () => {
    playSound('tapePeel');
    setSelectedCampaign(null);
  };

  // Fallback condition per Spec §3.6 & §3.6.3:
  // Use horizontal journey only when large screen (>=1000px), fluid mode, and not reduced motion.
  const showHorizontalJourney =
    isLargeScreen && scrollFXEnabled && !reducedMotion && mode === 'fluid';

  return (
    <section
      id="campaigns"
      aria-labelledby="campaigns-heading"
      className="relative min-h-screen flex flex-col justify-center z-10 border-t border-[#2a2723]"
    >
      {showHorizontalJourney ? (
        <CampaignsJourney onOpenDossier={handleOpenDossier} />
      ) : (
        <div className="px-6 sm:px-12 lg:px-24 py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
                03 — CAMPAIGNS
              </span>
              <h2 id="campaigns-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-2">
                THE WALL.
              </h2>
            </div>
            <p className="font-body text-sm text-[#b7ad99] max-w-sm">
              All six deployed fortifications across the outer and inner walls. Select any sector to inspect tactical dossier.
            </p>
          </div>

          {/* Responsive Vertical Grid (Phase 1 fallback) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPAIGNS_DATA.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenDossier(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleOpenDossier(item);
                }}
                className="group relative p-6 sm:p-8 rounded border border-[#2a2723] bg-[#0a0908] hover:border-[#b4442e] transition-all duration-300 cursor-pointer overflow-hidden text-left"
              >
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
        </div>
      )}

      <CampaignDossierModal
        campaign={selectedCampaign}
        onClose={handleCloseDossier}
      />
    </section>
  );
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/test/campaigns-journey.test.tsx src/test/campaigns-section.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/CampaignsJourney.tsx src/components/dark-fantasy/CampaignsSection.tsx src/test/campaigns-journey.test.tsx src/test/campaigns-section.test.tsx
git commit -m "feat(campaigns): implement Phase 2 Three Walls horizontal journey with responsive Phase 1 fallback"
```

---

### Task 10: Full Regression Testing, Performance Budget & Production Build Verification

**Files:**
- Test: All test files under `src/test/`
- Build: `npm run build`
- Lint: `npm run lint`

**Interfaces:**
- Consumes: All modules and test suites.
- Produces: 100% passing tests, 0 typescript/eslint errors, verified production bundle.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: All 30+ test suites pass without errors or unhandled rejections.

- [ ] **Step 2: Run ESLint**

Run: `npm run lint`
Expected: 0 lint errors.

- [ ] **Step 3: Run production Vite build**

Run: `npm run build`
Expected: Successful build with clean dist output and no TypeScript or bundle errors.

- [ ] **Step 4: Commit and finalize**

```bash
git add .
git commit -m "chore(release): verify all dark fantasy portfolio systems, GSAP choreography, and tests"
```
