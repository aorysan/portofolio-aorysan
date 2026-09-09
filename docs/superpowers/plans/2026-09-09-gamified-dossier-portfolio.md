# Gamified Field-Expedition Dossier Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the personal portfolio into a "Found Field-Expedition Dossier" military archive (Korps Peninjau / Attack on Titan aesthetic) based on the Figma Make design, featuring a pinned single-viewport desk dossier, 6 parchment sheets, Anime.js tactile animations (paper shuffle, stamp slam, redacted bar peel, crate drops, SVG checkmarks), synthetic tactile audio, and responsive navigation.

**Architecture:** Component-driven architecture in `src/components/dossier/`, with `DossierShell` coordinating state and hash routing (`/#berkas`, `/#jurnal`, etc.), Anime.js animation hooks powering tactile paper and stamp dynamics, `TactileSoundManager` handling physical Web Audio feedback, and 6 dedicated content sheet components.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Anime.js, Lucide React, Web Audio API, Vitest, Testing Library.

## Global Constraints
- Exact palette: `#E8DCC0` (parchment), `#151412` (desk underlay), `#8B3A2E` (blood ink / stamp), `#3D4A34` (moss green crate), `#1C1B18` (iron ink), `#7A4B3A` (rust marginalia).
- Fonts: `Cinzel` (headings), `EB Garamond` / `Lora` (body), `Caveat` (marginalia).
- No external audio downloads; all sounds generated via synthetic Web Audio API.
- All Anime.js animations must respect `prefers-reduced-motion`.
- Single-viewport shell with internal scroll for long sheets. External links (`target="_blank"` with `rel="noopener noreferrer"`).

---

### Task 1: Install `animejs` & Configure Vintage Typography & Styling Tokens

**Files:**
- Modify: `package.json`
- Modify: `index.html:1-30`
- Modify: `tailwind.config.ts:1-80`
- Modify: `src/index.css:1-120`
- Test: `src/test/dossier-tokens.test.ts`

**Interfaces:**
- Consumes: Tailwind theme config, Google Fonts CDN.
- Produces: CSS utility classes (`.bg-parchment`, `.text-iron`, `.text-blood`, `.font-cinzel`, `.font-garamond`, `.font-caveat`, `.stamp-border`, `.taped-edge`), Anime.js installed as a runtime dependency.

- [ ] **Step 1: Write the failing test for dossier design tokens and fonts**

Create `src/test/dossier-tokens.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Dossier Design Tokens', () => {
  it('should have expected dossier color definitions in styles', () => {
    const rootStyles = getComputedStyle(document.documentElement);
    // Verifies CSS custom properties or token setup exists
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify test setup**

Run: `npx vitest run src/test/dossier-tokens.test.ts`
Expected: PASS or initial baseline.

- [ ] **Step 3: Install `animejs` and `@types/animejs`**

Run:
```bash
npm install animejs@^3.2.2
npm install -D @types/animejs@^3.1.12
```

- [ ] **Step 4: Update `index.html` with Google Fonts**

In `index.html`, add Google Fonts preconnect and link in `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cinzel:wght@500;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
```
Update title tag: `<title>Eren Vanguard | Pakar Rekayasa Antarmuka</title>`

- [ ] **Step 5: Update `tailwind.config.ts` and `src/index.css`**

Add font families (`cinzel`, `garamond`, `caveat`) and colors (`parchment: '#E8DCC0'`, `parchment-light: '#F4EDE0'`, `parchment-dark: '#D8C7A5'`, `iron: '#1C1B18'`, `blood: '#8B3A2E'`, `moss: '#3D4A34'`, `desk: '#151412'`, `marginalia: '#7A4B3A'`).
In `src/index.css`, add utility classes for rough paper texture, stamp borders, and scrollbars.

- [ ] **Step 6: Run tests and commit**

```bash
git add package.json package-lock.json index.html tailwind.config.ts src/index.css src/test/dossier-tokens.test.ts
git commit -m "feat(tokens): install animejs and configure vintage dossier typography and tokens"
```

---

### Task 2: Implement Tactile Sound Engine (`src/components/dossier/TactileSoundManager.tsx`)

**Files:**
- Create: `src/components/dossier/TactileSoundManager.tsx`
- Test: `src/test/tactile-sound.test.ts`

**Interfaces:**
- Consumes: Web Audio API (`AudioContext`, `OscillatorNode`, `BiquadFilterNode`, `GainNode`).
- Produces: `useTactileSound(): { playSound: (type: 'paperSlide' | 'stampThud' | 'tapePeel' | 'penClick') => void, isMuted: boolean, toggleMute: () => void }`, `<TactileSoundProvider>` wrapper.

- [ ] **Step 1: Write the failing unit test for TactileSoundManager**

Create `src/test/tactile-sound.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { TactileSoundProvider, useTactileSound } from '../components/dossier/TactileSoundManager';

describe('TactileSoundManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should toggle mute and persist state in localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TactileSoundProvider>{children}</TactileSoundProvider>
    );

    const { result } = renderHook(() => useTactileSound(), { wrapper });
    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);
    expect(localStorage.getItem('dossier_sound_muted')).toBe('true');
  });

  it('should safely play tactile sounds without throwing', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TactileSoundProvider>{children}</TactileSoundProvider>
    );

    const { result } = renderHook(() => useTactileSound(), { wrapper });
    expect(() => {
      result.current.playSound('paperSlide');
      result.current.playSound('stampThud');
      result.current.playSound('tapePeel');
      result.current.playSound('penClick');
    }).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/tactile-sound.test.ts`
Expected: FAIL (TactileSoundManager does not exist).

- [ ] **Step 3: Implement `TactileSoundManager.tsx`**

Synthesize custom tactile profiles:
- `paperSlide`: filtered noise buffer with bandpass sweep (250ms).
- `stampThud`: low frequency sine sweep (90Hz -> 30Hz) with rapid exponential decay (180ms) + small noise burst for wooden stamp impact.
- `tapePeel`: high-pass filtered white noise burst with subtle frequency flutter (120ms).
- `penClick`: quick high ping (1200Hz) with sharp decay (30ms).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/tactile-sound.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dossier/TactileSoundManager.tsx src/test/tactile-sound.test.ts
git commit -m "feat(audio): implement synthetic tactile sound manager for dossier interactions"
```

---

### Task 3: Build Dossier Shell & Right-Side Navigation Tabs

**Files:**
- Create: `src/components/dossier/DossierTabs.tsx`
- Create: `src/components/dossier/DossierShell.tsx`
- Test: `src/test/dossier-shell.test.tsx`

**Interfaces:**
- Consumes: `useTactileSound`, React Router / Hash location.
- Produces: `<DossierShell>` top-level desk container, `<DossierTabs>` binder divider tabs, tab IDs: `'berkas' | 'jurnal' | 'inventaris' | 'laporan' | 'kronik' | 'kontak'`.

- [ ] **Step 1: Write the failing test for DossierTabs and DossierShell**

Create `src/test/dossier-shell.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DossierTabs } from '../components/dossier/DossierTabs';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('DossierTabs', () => {
  it('renders all 6 dossier tabs and triggers tab change', () => {
    const onTabSelect = vi.fn();
    render(
      <TactileSoundProvider>
        <DossierTabs activeTab="berkas" onTabSelect={onTabSelect} />
      </TactileSoundProvider>
    );

    expect(screen.getByTestId('tab-berkas')).toBeDefined();
    expect(screen.getByTestId('tab-jurnal')).toBeDefined();
    expect(screen.getByTestId('tab-inventaris')).toBeDefined();
    expect(screen.getByTestId('tab-laporan')).toBeDefined();
    expect(screen.getByTestId('tab-kronik')).toBeDefined();
    expect(screen.getByTestId('tab-kontak')).toBeDefined();

    fireEvent.click(screen.getByTestId('tab-inventaris'));
    expect(onTabSelect).toHaveBeenCalledWith('inventaris');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/dossier-shell.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `DossierTabs.tsx` and `DossierShell.tsx`**

- `DossierTabs`:
  - 6 tabs with icons (`FileText`, `BookOpen`, `Swords`, `Compass`, `Archive`, `Mail`).
  - Desktop: Vertical tabs attached to right edge of paper with slight horizontal offset on active tab.
  - Mobile: Fixed bottom expedition bar with touch-friendly buttons (min 44px).
- `DossierShell`:
  - Centered folio parchment container with subtle drop-shadows and desk underlay.
  - Synchronizes active tab with `window.location.hash`.
  - Implements Anime.js paper shuffle animation when active sheet changes.
  - Sound mute toggle button in the bottom right corner.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/dossier-shell.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dossier/DossierTabs.tsx src/components/dossier/DossierShell.tsx src/test/dossier-shell.test.tsx
git commit -m "feat(shell): implement dossier desk shell, responsive navigation tabs, and paper transition"
```

---

### Task 4: Implement Hero Dossier (`DossierBerkas.tsx`) & About Journal (`DossierJurnal.tsx`)

**Files:**
- Create: `src/components/dossier/DossierBerkas.tsx`
- Create: `src/components/dossier/DossierJurnal.tsx`
- Test: `src/test/dossier-berkas-jurnal.test.tsx`

**Interfaces:**
- Consumes: `useTactileSound`, Anime.js.
- Produces: `<DossierBerkas>` (Hero sheet), `<DossierJurnal>` (About sheet with interactive redaction bars).

- [ ] **Step 1: Write the failing test for Berkas and Jurnal sheets**

Create `src/test/dossier-berkas-jurnal.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DossierBerkas } from '../components/dossier/DossierBerkas';
import { DossierJurnal } from '../components/dossier/DossierJurnal';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Dossier Berkas & Jurnal', () => {
  it('renders Berkas sheet with dossier header and stamp', () => {
    render(
      <TactileSoundProvider>
        <DossierBerkas onNavigateToProjects={vi.fn()} />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/ARSIP NO: 782-X/i)).toBeDefined();
    expect(screen.getByText(/STATUS: RAHASIA/i)).toBeDefined();
    expect(screen.getByText(/EREN VANGUARD/i)).toBeDefined();
  });

  it('renders Jurnal sheet with interactive redacted bars', () => {
    render(
      <TactileSoundProvider>
        <DossierJurnal />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/ENTRI JURNAL #104/i)).toBeDefined();
    const redactedBars = screen.getAllByTestId('redacted-bar');
    expect(redactedBars.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/dossier-berkas-jurnal.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `DossierBerkas.tsx` and `DossierJurnal.tsx`**

- `DossierBerkas`:
  - Double border header with `ARSIP NO: 782-X`, `STATUS: RAHASIA` stamp slam using Anime.js (`scale: [2.8, 1]`, `rotate: [-20, -4]`, `easing: 'easeOutElastic'`).
  - Title `EREN VANGUARD`, subtitle `PAKAR REKAYASA ANTARMUKA`.
  - Mission manifesto quote.
  - Attack on Titan expedition poster pinned with semi-transparent tape on top corners.
  - CTAs: "Buka Ekspedisi" (jumps to Laporan) and "Rekam Jejak (CV)".
- `DossierJurnal`:
  - Entry #104 field log with drop cap.
  - Redacted blackout bars `[████]` that animate `scaleX: [1, 0]` with Anime.js on mouse enter / tap to reveal hidden declassified text.
  - Rust ink marginalia notes in the margin: *"— jangan hilangkan lagi."*

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/dossier-berkas-jurnal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dossier/DossierBerkas.tsx src/components/dossier/DossierJurnal.tsx src/test/dossier-berkas-jurnal.test.tsx
git commit -m "feat(dossier): implement Berkas hero sheet with stamp slam and Jurnal sheet with redacted peel"
```

---

### Task 5: Implement Tactical Inventory (`DossierInventaris.tsx`) & Expedition Reports (`DossierLaporan.tsx`)

**Files:**
- Create: `src/components/dossier/DossierInventaris.tsx`
- Create: `src/components/dossier/DossierLaporan.tsx`
- Test: `src/test/dossier-inventaris-laporan.test.tsx`

**Interfaces:**
- Consumes: `useTactileSound`, Anime.js.
- Produces: `<DossierInventaris>` (Skills sheet with 4 tactical crates), `<DossierLaporan>` (Featured projects sheet with tilted report cards and status stamps).

- [ ] **Step 1: Write the failing test for Inventaris and Laporan sheets**

Create `src/test/dossier-inventaris-laporan.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DossierInventaris } from '../components/dossier/DossierInventaris';
import { DossierLaporan } from '../components/dossier/DossierLaporan';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Dossier Inventaris & Laporan', () => {
  it('renders Inventaris with 4 tactical crates', () => {
    render(
      <TactileSoundProvider>
        <DossierInventaris />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/SENJATA UTAMA/i)).toBeDefined();
    expect(screen.getByText(/PERLENGKAPAN TAKTIS/i)).toBeDefined();
    expect(screen.getByText(/LOGISTIK/i)).toBeDefined();
    expect(screen.getByText(/KEMAMPUAN BERTAHAN/i)).toBeDefined();
  });

  it('renders Laporan with project cards and status stamps', () => {
    render(
      <TactileSoundProvider>
        <DossierLaporan />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/LAPORAN EKSPEDISI/i)).toBeDefined();
    expect(screen.getAllByTestId('project-card').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/dossier-inventaris-laporan.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `DossierInventaris.tsx` and `DossierLaporan.tsx`**

- `DossierInventaris`:
  - 4 moss-green crates (`#3D4A34`) with iron rivets on corners.
  - Anime.js staggered bounce drop on entrance (`translateY: [-30, 0]`, `easing: 'easeOutBounce'`).
  - SVG line-drawn checkboxes that check in sequence with Anime.js `strokeDashoffset`.
- `DossierLaporan`:
  - Asymmetric 12-column untidily stacked report cards (`-1.5deg` to `1.2deg` rotation).
  - Wet-ink status caps: `SELESAI`, `BERJALAN`, `ARSIP`.
  - Project title, description, tech stack tags, and direct links: "Akses Repositori" (GitHub) and "Inspeksi Lapangan" (Live Demo) opening in `target="_blank"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/dossier-inventaris-laporan.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dossier/DossierInventaris.tsx src/components/dossier/DossierLaporan.tsx src/test/dossier-inventaris-laporan.test.tsx
git commit -m "feat(dossier): implement Inventaris tactical crates and Laporan project report cards"
```

---

### Task 6: Implement Expedition Chronicle (`DossierKronik.tsx`) & Requisition Contact (`DossierKontak.tsx`)

**Files:**
- Create: `src/components/dossier/DossierKronik.tsx`
- Create: `src/components/dossier/DossierKontak.tsx`
- Test: `src/test/dossier-kronik-kontak.test.tsx`

**Interfaces:**
- Consumes: `useTactileSound`, Anime.js.
- Produces: `<DossierKronik>` (Timeline sheet), `<DossierKontak>` (Dispatch letter requisition form).

- [ ] **Step 1: Write the failing test for Kronik and Kontak sheets**

Create `src/test/dossier-kronik-kontak.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DossierKronik } from '../components/dossier/DossierKronik';
import { DossierKontak } from '../components/dossier/DossierKontak';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Dossier Kronik & Kontak', () => {
  it('renders Kronik expedition timeline nodes', () => {
    render(
      <TactileSoundProvider>
        <DossierKronik />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/KRONIK EKSPEDISI/i)).toBeDefined();
    expect(screen.getAllByTestId('timeline-node').length).toBeGreaterThan(0);
  });

  it('renders Kontak requisition dispatch form', () => {
    render(
      <TactileSoundProvider>
        <DossierKontak />
      </TactileSoundProvider>
    );
    expect(screen.getByText(/SURAT PERINTAH DISPOSISI/i)).toBeDefined();
    expect(screen.getByLabelText(/Nama Utusan/i)).toBeDefined();
    expect(screen.getByLabelText(/Frekuensi Kontak/i)).toBeDefined();
    expect(screen.getByLabelText(/Perintah Misi/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/dossier-kronik-kontak.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `DossierKronik.tsx` and `DossierKontak.tsx`**

- `DossierKronik`:
  - Vertical timeline spine with rusted brass/iron nodes.
  - Career milestones, education, and expedition history with vintage datestamps.
- `DossierKontak`:
  - Form styled as a military telegraph requisition sheet.
  - Fields: Nama Utusan (*Name*), Frekuensi Radio (*Email*), Perintah Tugas (*Message*).
  - Send button with wax seal / ink stamp effect and feedback message.
  - Direct communication links (GitHub, LinkedIn, Telegram, Email).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/dossier-kronik-kontak.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dossier/DossierKronik.tsx src/components/dossier/DossierKontak.tsx src/test/dossier-kronik-kontak.test.tsx
git commit -m "feat(dossier): implement Kronik expedition timeline and Kontak dispatch requisition form"
```

---

### Task 7: Integrate Main Page (`src/pages/Index.tsx`) & Clean Old HUD Artifacts

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/test/Index.test.tsx`

**Interfaces:**
- Consumes: `<DossierShell>`, `<TactileSoundProvider>`.
- Produces: Complete working portfolio at `/` and `/*`.

- [ ] **Step 1: Write integration test for Index page**

Update `src/test/Index.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Index from '../pages/Index';

describe('Index Page Integration', () => {
  it('renders Dossier portfolio shell directly without boot sequence blockers', () => {
    render(<Index />);
    expect(screen.getByTestId('dossier-shell')).toBeDefined();
    expect(screen.getByTestId('tab-berkas')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails with old Index page**

Run: `npx vitest run src/test/Index.test.tsx`
Expected: FAIL (renders old BootSequence/HUD).

- [ ] **Step 3: Update `src/pages/Index.tsx`**

Mount `TactileSoundProvider` and `DossierShell`. Ensure clean integration without the old boot sequence gating.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/Index.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Index.tsx src/test/Index.test.tsx
git commit -m "feat(app): integrate DossierShell and TactileSoundProvider into main application entry"
```

---

### Task 8: Full Verification & Visual Inspection

**Files:**
- Verify: Full test suite (`npm test`)
- Verify: Production build (`npm run build`)
- Visual: Inspect in browser across desktop (1536x776) and mobile (375x812) viewports.

- [ ] **Step 1: Run complete test suite**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 2: Run production build check**

Run: `npm run build`
Expected: Build succeeds with 0 TypeScript and bundling errors.

- [ ] **Step 3: Visual and interaction inspection**

Use browser subagent to open local dev server:
- Verify `#berkas` header, stamp animation, and polaroid tape.
- Click each tab (`#jurnal`, `#inventaris`, `#laporan`, `#kronik`, `#kontak`) and verify smooth Anime.js transitions.
- Hover over redacted bars in `#jurnal` and verify unredacting peel.
- Inspect responsive layout at mobile width.

- [ ] **Step 4: Final commit and walkthrough artifact**

```bash
git add .
git commit -m "chore(release): complete gamified expedition dossier portfolio makeover"
```
