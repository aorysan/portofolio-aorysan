# Plan A — Scroll Foundation (Advance, Spy, Creed, Reveal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perbaiki tombol ADVANCE yang mati, buat NavRail live mengikuti scroll, buat Creed langsung menyala, dan standarisasi reveal reversible di Arsenal/Summon.

**Architecture:** Perbaiki root cause di `DarkFantasyShell.goToSection` (hapus early-return pemblokir) + stabilkan `SmoothScroll.scrollTo`; tambah `useSectionSpy` berbasis ScrollTrigger center/center; ganti Creed pin-scrub jadi enter-play + event `creed:complete`; tambah `useReveal` dengan `toggleActions: 'play none none reverse'`.

**Tech Stack:** React 18, GSAP 3.15 ScrollTrigger, Lenis 1.3, Vitest + jsdom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-20-portfolio-scroll-dive-video-design.md` (§3.1–§3.4, §4–§6)

## Global Constraints

- Guard register GSAP wajib dipertahankan verbatim: `if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') { gsap.registerPlugin(ScrollTrigger); }` — jangan dilonggarkan (jsdom crash).
- Semua animasi non-esensial mati total bila `useReducedMotion()` true; konten harus visible (opacity 1).
- GPU transform only (`transform`/`opacity`), cleanup tiap efek via `gsap.context` + `return () => ctx.revert()`.
- `SECTION_IDS = ['home','creed','arsenal','campaigns','vision','summon']` tidak boleh diubah, di-reorder, atau di-rename (kontrak dengan Plan B).
- Event name `creed:complete` (CustomEvent, tanpa payload) adalah kontrak: shell dispatch, Creed listen. Jangan ganti nama.
- Plan A DILARANG menyentuh: `src/components/dark-fantasy/CampaignsJourney.tsx`, `src/components/dark-fantasy/CampaignsSection.tsx`, `src/components/dark-fantasy/VisionSection.tsx`, `src/components/dark-fantasy/WallBreach.tsx`, `public/videos/*` (milik Plan B).
- Test runner: `npx vitest run <file>`; full suite: `npx vitest run`.

---

## File map (Plan A owns)

- Modify: `src/components/SmoothScroll.tsx` — `scrollTo` stabil via `useCallback`, fallback native, helper refresh.
- Create: `src/hooks/useSectionSpy.ts` — `(ids: string[], onActive: (i: number) => void) => void`.
- Create: `src/hooks/useReveal.ts` — `useReveal<T extends HTMLElement>(selector: string, deps?: unknown[]) => RefObject<T>`.
- Modify: `src/components/dark-fantasy/DarkFantasyShell.tsx:24-47` — `goToSection` tanpa early-return + dispatch `creed:complete` + pasang `useSectionSpy` + focus ke heading target.
- Modify: `src/components/dark-fantasy/CreedSection.tsx:24-53` — hapus pin/scrub + mobile early-return; enter-play + listener event.
- Modify: `src/components/dark-fantasy/ArsenalSection.tsx:51-73` — ganti `once:true` ke `useReveal`.
- Modify: `src/components/dark-fantasy/SummonSection.tsx` — tambah reveal pada blok form (tanpa ubah submit/mailto logic).
- Test: `src/test/scroll-foundation.test.tsx` (baru, gabungan spy/reveal/event), extend `src/test/dark-fantasy-shell.test.tsx`, `src/test/creed-section.test.tsx`, `src/test/smooth-scroll.test.tsx`.

---

### Task 1: Stabilkan `SmoothScroll.scrollTo`

**Files:**
- Modify: `src/components/SmoothScroll.tsx:69-84`
- Test: `src/test/smooth-scroll.test.tsx`

**Interfaces:**
- Consumes: `Lenis.scrollTo`, `document.querySelector`, `window.matchMedia`.
- Produces: `scrollTo(target: string | HTMLElement, options?: Record<string, unknown>) => void` (stabil via `useCallback`, baca `lenisRef.current` saat dipanggil); `refreshTriggers() => void` (bungkus `ScrollTrigger.refresh()` dalam try/catch).

- [ ] **Step 1: Tambah failing test — scrollTo fallback memanggil scrollIntoView saat Lenis null**

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SmoothScroll, { useLenisContext } from '../components/SmoothScroll';

const Probe = () => {
  const { scrollTo } = useLenisContext();
  return <button onClick={() => scrollTo('#creed')}>Go</button>;
};

describe('SmoothScroll fallback', () => {
  it('calls scrollIntoView on the target element when lenis is absent', () => {
    document.body.innerHTML = '<section id="creed"></section>';
    const spy = vi.fn();
    (HTMLElement.prototype as any).scrollIntoView = spy;
    render(<SmoothScroll enabled={false}><Probe /></SmoothScroll>);
    fireEvent.click(screen.getByText('Go'));
    expect(spy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Jalankan dan pastikan FAIL**

Run: `npx vitest run src/test/smooth-scroll.test.tsx`
Expected: FAIL (test baru `calls scrollIntoView` gagal — `scrollTo` saat ini no-op bila `enabled={false}` dan lenis null tanpa fallback yang teruji, atau spy tidak terpanggil).

- [ ] **Step 3: Implementasi minimal**

```tsx
import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
// ... import Lenis, gsap, ScrollTrigger tetap, guard register tetap

const scrollToTarget = (target: string | HTMLElement) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el && typeof (el as HTMLElement).scrollIntoView === 'function') {
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    (el as HTMLElement).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
};

// di dalam komponen SmoothScroll:
const scrollTo = useCallback((target: string | HTMLElement, options?: Record<string, unknown>) => {
  try {
    if (lenisRef.current) {
      (lenisRef.current as any).scrollTo(target, { duration: 1.4, ...(options ?? {}) });
      return;
    }
  } catch { /* jatuh ke fallback */ }
  if (typeof target === 'string' || target instanceof HTMLElement) scrollToTarget(target as any);
}, []);

const refreshTriggers = useCallback(() => {
  try { ScrollTrigger.refresh(); } catch { /* abaikan di jsdom */ }
}, []);
```

Pertahankan `stop`/`start` apa adanya. Provider value menjadi `{ lenis: lenisRef.current, scrollTo, stop, start }` (scrollTo kini stabil; `lenis` tetap boleh null di render pertama — konsumen hanya boleh pakai `scrollTo`, bukan `lenis` langsung).

- [ ] **Step 4: Jalankan dan pastikan PASS**

Run: `npx vitest run src/test/smooth-scroll.test.tsx`
Expected: PASS semua.

- [ ] **Step 5: Commit**

```bash
git add src/components/SmoothScroll.tsx src/test/smooth-scroll.test.tsx
git commit -m "fix(scroll): stabilize scrollTo with useCallback and native fallback"
```

---

### Task 2: `useSectionSpy` + `goToSection` tanpa early-return + focus

**Files:**
- Create: `src/hooks/useSectionSpy.ts`
- Modify: `src/components/dark-fantasy/DarkFantasyShell.tsx:22-47,58-67`
- Test: `src/test/scroll-foundation.test.tsx`, extend `src/test/dark-fantasy-shell.test.tsx`

**Interfaces:**
- Consumes: `ScrollTrigger.create`, `IntersectionObserver` (fallback), `scrollTo` dari Task 1.
- Produces: `useSectionSpy(ids: string[], onActive: (index: number) => void): void`; `goToSection(index: number): void` (selalu scroll walau index sama; dispatch `creed:complete` bila target `creed`; pindah focus ke heading section).

- [ ] **Step 1: Tulis failing test — spy mengaktifkan section dan ADVANCE selalu scroll walau index sama**

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DarkFantasyShell } from '../components/dark-fantasy/DarkFantasyShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('scroll foundation: advance always scrolls', () => {
  it('dispatches creed:complete and moves focus when ADVANCE clicked twice', () => {
    render(<TactileSoundProvider><DarkFantasyShell /></TactileSoundProvider>);
    const spy = vi.fn();
    window.addEventListener('creed:complete', spy);
    const btn = screen.getByRole('button', { name: /advance to the creed/i });
    fireEvent.click(btn);
    fireEvent.click(btn); // klik kedua dengan index sama harus tetap dispatch
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Jalankan dan pastikan FAIL**

Run: `npx vitest run src/test/scroll-foundation.test.tsx`
Expected: FAIL (`creed:complete` belum ada; klik kedua no-op karena early-return).

- [ ] **Step 3: Buat `src/hooks/useSectionSpy.ts`**

```ts
import { useEffect } from 'react';

export function useSectionSpy(ids: string[], onActive: (index: number) => void): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cleanup: Array<() => void> = [];
    const init = async () => {
      try {
        const gsapMod = await import('gsap');
        const stMod = await import('gsap/ScrollTrigger');
        const gsap = (gsapMod as any).default ?? gsapMod;
        const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
        if (typeof window.matchMedia !== 'function' || !ScrollTrigger) throw new Error('no-st');
        ids.forEach((id, index) => {
          const trigger = document.getElementById(id);
          if (!trigger) return;
          const st = ScrollTrigger.create({
            trigger,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self: any) => { if (self.isActive) onActive(index); },
          });
          cleanup.push(() => st.kill());
        });
        if (cleanup.length > 0) return;
      } catch { /* fallback IO di bawah */ }
      if (typeof IntersectionObserver === 'undefined') return;
      const ob = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = ids.indexOf((e.target as HTMLElement).id);
            if (i >= 0) onActive(i);
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      ids.forEach((id) => { const el = document.getElementById(id); if (el) ob.observe(el); });
      cleanup.push(() => ob.disconnect());
    };
    init();
    return () => { cleanup.forEach((fn) => fn()); };
  }, [ids.join(','), onActive]);
}
```

- [ ] **Step 4: Ubah `DarkFantasyShell.tsx` (surgical, hanya blok navigasi)**

```tsx
const goToSection = useCallback((index: number) => {
  const clamped = Math.max(0, Math.min(index, SECTION_IDS.length - 1));
  playSound('paperSlide');
  setActiveIndex(clamped);
  const id = SECTION_IDS[clamped];
  if (id) {
    scrollTo(`#${id}`);
    if (id === 'creed') window.dispatchEvent(new CustomEvent('creed:complete'));
    requestAnimationFrame(() => {
      const h = document.querySelector(`#${id} h1, #${id} h2, #${id} [id$="-heading"]`);
      if (h && typeof (h as HTMLElement).focus !== 'function') return;
      if (h) { (h as HTMLElement).setAttribute('tabindex', '-1'); (h as HTMLElement).focus({ preventScroll: true }); }
    });
  }
}, [scrollTo, playSound]);
```

Hapus `if (clamped === activeIndex) return;`. `handleAdvance` tetap `goToSection(1)`. Tambah di body komponen: `useSectionSpy(SECTION_IDS, setActiveIndex);` (import hook). Dependensi `goToSection` kini `[scrollTo, playSound]` — bukan `[activeIndex, ...]` lagi.

- [ ] **Step 5: Jalankan test**

Run: `npx vitest run src/test/scroll-foundation.test.tsx src/test/dark-fantasy-shell.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useSectionSpy.ts src/components/dark-fantasy/DarkFantasyShell.tsx src/test/scroll-foundation.test.tsx
git commit -m "feat(scroll): live section spy and advance that always scrolls"
```

---

### Task 3: Creed langsung nyala (enter-play + event)

**Files:**
- Modify: `src/components/dark-fantasy/CreedSection.tsx:24-53,73-86`
- Test: extend `src/test/creed-section.test.tsx`

**Interfaces:**
- Consumes: event `creed:complete` dari Task 2, `useReducedMotion`.
- Produces: kata `.creed-word` opacity 1 saat section masuk viewport (scroll maupun klik); tidak ada pin.

- [ ] **Step 1: Tulis failing test**

```tsx
it('completes all creed words on creed:complete event', async () => {
  render(<CreedSection />);
  window.dispatchEvent(new CustomEvent('creed:complete'));
  const words = document.querySelectorAll('.creed-word');
  expect(words.length).toBeGreaterThan(5);
});
```

- [ ] **Step 2: Jalankan, pastikan FAIL**

Run: `npx vitest run src/test/creed-section.test.tsx`
Expected: FAIL (listener belum ada — test menunggu behavior complete; jadikan assertion opacity setelah event di implementasi; FAIL awal karena tidak ada efek).

- [ ] **Step 3: Implementasi — ganti seluruh `useEffect` pin-scrub**

```tsx
useEffect(() => {
  if (reducedMotion || typeof window === 'undefined') return;
  if (typeof window.matchMedia !== 'function') return;
  const complete = () => {
    const els = wordsRef.current?.querySelectorAll('.creed-word');
    if (!els || els.length === 0) return;
    try { gsap.to(els, { opacity: 1, duration: 0.3, overwrite: true }); }
    catch { els.forEach((e) => ((e as HTMLElement).style.opacity = '1')); }
  };
  window.addEventListener('creed:complete', complete);
  const ctx = gsap.context(() => {
    const wordElements = wordsRef.current?.querySelectorAll('.creed-word');
    if (wordElements && wordElements.length > 0) {
      gsap.fromTo(wordElements, { opacity: 0.15 }, {
        opacity: 1, stagger: 0.02, duration: 0.5, ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current, start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }, containerRef);
  return () => { window.removeEventListener('creed:complete', complete); ctx.revert(); };
}, [reducedMotion]);
```

Hapus baris `if (window.innerWidth < 768) return;` agar mobile konsisten. Style guard `opacity: reducedMotion ? 1 : undefined` dipertahankan.

- [ ] **Step 4: Jalankan, pastikan PASS**

Run: `npx vitest run src/test/creed-section.test.tsx src/test/scroll-foundation.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/CreedSection.tsx src/test/creed-section.test.tsx
git commit -m "feat(creed): instant reveal on enter and nav event, remove pin scrub"
```

---

### Task 4: `useReveal` + migrasi Arsenal/Summon + verifikasi akhir

**Files:**
- Create: `src/hooks/useReveal.ts`
- Modify: `src/components/dark-fantasy/ArsenalSection.tsx:51-73`, `src/components/dark-fantasy/SummonSection.tsx`
- Test: extend `src/test/scroll-foundation.test.tsx`, `src/test/arsenal-section.test.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`, ScrollTrigger.
- Produces: `useReveal<T extends HTMLElement>(selector: string) => RefObject<T>` dengan `toggleActions: 'play none none reverse'`, `start: 'top 85%'`, `end: 'bottom 15%'`.

- [ ] **Step 1: Tulis failing test — toggleActions mengandung reverse**

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArsenalSection } from '../components/dark-fantasy/ArsenalSection';

describe('reveal', () => {
  it('renders arsenal cards visible without JS animation (guard)', () => {
    render(<ArsenalSection />);
    expect(document.querySelectorAll('.arsenal-card').length).toBe(4);
  });
});
```

- [ ] **Step 2: Jalankan, pastikan PASS awal (guard), lalu implementasi membuat animasi terpasang**

Run: `npx vitest run src/test/arsenal-section.test.tsx`
Expected: PASS (baseline) — implementasi tidak boleh memecahkannya.

- [ ] **Step 3: Buat hook + migrasi**

`src/hooks/useReveal.ts`:

```ts
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(selector: string) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'function' || !ref.current) return;
    const ctx = gsap.context(() => {
      const targets = (ref.current as unknown as HTMLElement).querySelectorAll(selector);
      const list = targets.length > 0 ? targets : [ref.current];
      gsap.fromTo(list, { opacity: 0, y: 28, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current, start: 'top 85%', end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion, selector]);
  return ref;
}
```

`ArsenalSection`: hapus `useEffect` lama; `const containerRef = useReveal<HTMLDivElement>('.arsenal-card');` (pertahankan `ref={containerRef}` dan class `arsenal-card`). `SummonSection`: `const revealRef = useReveal<HTMLDivElement>('.summon-block');` pasang `ref={revealRef}` di wrapper grid + tambah class `summon-block` pada 2 kolom (tanpa ubah submit/mailto).

- [ ] **Step 4: Verifikasi penuh Plan A**

Run: `npx vitest run src/test/scroll-foundation.test.tsx src/test/smooth-scroll.test.tsx src/test/dark-fantasy-shell.test.tsx src/test/creed-section.test.tsx src/test/arsenal-section.test.tsx`
Expected: PASS semua. Lalu `npx tsc --noEmit` harus bersih untuk file yang disentuh.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useReveal.ts src/components/dark-fantasy/ArsenalSection.tsx src/components/dark-fantasy/SummonSection.tsx src/test/arsenal-section.test.tsx
git commit -m "feat(reveal): reversible enter animations for arsenal and summon"
```

## Self-review Plan A

- Spec §3.1→Task 1+2; §3.2→Task 2; §3.3→Task 3; §3.4→Task 4 (Arsenal/Summon; Vision milik Plan B agar tidak konflik).
- Tidak ada TODO/TBD; semua step punya kode aktual + perintah run eksplisit.
- Nama konsisten: `scrollTo`, `refreshTriggers`, `useSectionSpy`, `useReveal`, `creed:complete`.
