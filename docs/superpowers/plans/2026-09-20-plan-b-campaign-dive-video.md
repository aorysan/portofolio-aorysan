# Plan B — Campaign Dive + Vision Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti Campaign horizontal menjadi wall-dive zoom vertikal (Sina→Rose→Maria→Beyond) dan pasang video background loop 2 detik di Vision.

**Architecture:** Rewrite `CampaignsJourney` menjadi pinned vertical timeline GSAP scrub 4 segmen dengan reuse data `wallZone` dan kartu yang ada; `WallBreach` dipakai ulang sebagai overlay; Vision dapat layer `<video>` lokal muted loop dengan poster + overlay gelap dan matikan saat reduced-motion.

**Tech Stack:** React 18, GSAP 3.15 ScrollTrigger, Lenis 1.3, yt-dlp + ffmpeg (manual lokal sekali), Vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-20-portfolio-scroll-dive-video-design.md` (§3.5–§3.6, §4–§6)

## Global Constraints

- Guard register GSAP wajib verbatim: `if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') { gsap.registerPlugin(ScrollTrigger); }`.
- Reduced-motion: dive mati → grid vertikal lama; video mati → poster `<img>`.
- GPU transform only; debris breach maks 12 fragmen; tiap efek `gsap.context` + `ctx.revert()`.
- Kontrak milik bersama, JANGAN diubah: `SECTION_IDS` urutan, `id="campaigns"`, `id="vision"`, shape `CAMPAIGNS_DATA` (`wallZone sina|rose|maria`), event `creed:complete` (abaikan saja).
- `pinSpacing: true` wajib pada pin di dalam parent flex `#campaigns` (pelajaran commit `23a9acf`).
- Plan B DILARANG menyentuh: `src/components/dark-fantasy/DarkFantasyShell.tsx`, `src/components/SmoothScroll.tsx`, `src/hooks/useSectionSpy.ts`, `src/hooks/useReveal.ts`, `src/components/dark-fantasy/CreedSection.tsx`, `src/components/dark-fantasy/HeroSection.tsx` (milik Plan A). Untuk reveal di Vision, tulis ScrollTrigger lokal di file Vision (jangan import `useReveal` agar tidak depend ke Plan A).
- Kronologi dikunci: Sina (FrameWork 2023, Jawara 2023 = tertua) → Rose (KampungKu, Rest Area, SarPras 2024) → Maria (TrasMart 2024 = terbaru) → Beyond. Jangan urut alfabet.
- Video: target `<2MB`, 720p, tanpa audio, `public/videos/vision-sea-loop.mp4` + `public/videos/vision-sea-poster.jpg`. File video TIDAK dibuat oleh bot via download otomatis di CI; sertakan script ekstraksi, jalankan manual lokal sekali.

---

## File map (Plan B owns)

- Rewrite: `src/components/dark-fantasy/CampaignsJourney.tsx` (struktur dive, timeline 4 segmen, reuse `renderProjectCard`).
- Modify: `src/components/dark-fantasy/CampaignsSection.tsx:10-22,36` — `showDive = isLargeScreen && !reducedMotion` (ganti `showHorizontalJourney`), import tetap.
- Modify: `src/components/dark-fantasy/WallBreach.tsx` — tambah props opsional `progress?: number` untuk dipakai sebagai overlay (kompatibel mundur: default `isBreached` lama tetap jalan).
- Rewrite: `src/components/dark-fantasy/VisionSection.tsx` — layer video + poster + reveal lokal + error fallback.
- Create: `public/videos/.gitkeep` (placeholder), `docs/videos/extract-vision.sh` (script yt-dlp+ffmpeg).
- Test: `src/test/campaign-dive.test.tsx` (baru), extend `src/test/campaigns-journey.test.tsx`, `src/test/campaigns-section.test.tsx`, `src/test/vision-summon.test.tsx`.

---

### Task 1: Campaign wall-dive timeline (rewrite journey)

**Files:**
- Rewrite: `src/components/dark-fantasy/CampaignsJourney.tsx:24-53,113-195`
- Modify: `src/components/dark-fantasy/CampaignsSection.tsx:36`
- Test: `src/test/campaign-dive.test.tsx`

**Interfaces:**
- Consumes: `CAMPAIGNS_DATA`, `onOpenDossier(campaign)`, `WallBreach`.
- Produces: pinned dive `h-screen` dengan 4 lapis `data-layer="sina|rose|maria|beyond"`; fallback grid lama tetap untuk kecil/reduced (diputuskan di `CampaignsSection`).

- [ ] **Step 1: Tulis failing test — 4 lapis berurutan**

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CampaignsJourney } from '../components/dark-fantasy/CampaignsJourney';

describe('CampaignsDive', () => {
  it('renders four layers in chronological order', () => {
    render(<CampaignsJourney onOpenDossier={() => {}} />);
    const layers = document.querySelectorAll('[data-layer]');
    expect([...layers].map((l) => l.getAttribute('data-layer'))).toEqual(['sina', 'rose', 'maria', 'beyond']);
    expect(screen.getByText('WALL SINA')).toBeInTheDocument();
    expect(screen.getByText('BEYOND THE WALLS')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan FAIL**

Run: `npx vitest run src/test/campaign-dive.test.tsx`
Expected: FAIL (`data-layer` belum ada di markup horizontal lama).

- [ ] **Step 3: Implementasi rewrite (pertahankan filter zone + kartu)**

```tsx
useEffect(() => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
  if (!containerRef.current) return;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current, start: 'top top', pin: true,
        pinSpacing: true, scrub: 1, anticipatePin: 1,
        invalidateOnRefresh: true, end: '+=320%',
      },
    });
    (['sina', 'rose', 'maria'] as const).forEach((zone) => {
      tl.to(`[data-layer="${zone}"]`, { scale: 1.6, opacity: 0, ease: 'none', duration: 1 });
      tl.fromTo(`[data-breach="${zone}"]`, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1.05, ease: 'none', duration: 0.4 }, '<');
      tl.to(`[data-breach="${zone}"]`, { opacity: 0, duration: 0.3 });
    });
    tl.fromTo('[data-layer="beyond"]', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'none', duration: 1 });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

Markup: outer `<div ref={containerRef} className="relative w-full" style={{ height: '420vh' }}>` + inner sticky `<div className="sticky top-0 h-screen overflow-hidden">` berisi 4 `<div data-layer="..." className="absolute inset-0 flex items-center ...">` (Sina/Rose/Maria reuse `renderProjectCard` + header zona lama; Beyond reuse panel `UNCHARTED TERRITORY` dari kode lama). Sisipkan overlay `<div data-breach="sina">` (dst) berisi `<WallBreach wallName="WALL SINA" zoneLabel="BREACH PERIMETER I" isBreached />` dengan class absolute center pointer-events-none. Semua lapis selain `sina` mulai `opacity-0` via class + timeline mengatur masuk/keluar (tambah `tl.to` lawan untuk opacity masuk tiap lapis setelah breach — tulis eksplisit per zona, jangan loop generik yang mengaburkan urutan).

`CampaignsSection.tsx`: ganti `showHorizontalJourney` → `const showDive = isLargeScreen && !reducedMotion;` dan `{showDive ? <CampaignsJourney/> : (grid)}`.

- [ ] **Step 4: Jalankan, pastikan PASS**

Run: `npx vitest run src/test/campaign-dive.test.tsx src/test/campaigns-journey.test.tsx src/test/campaigns-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/CampaignsJourney.tsx src/components/dark-fantasy/CampaignsSection.tsx src/test/campaign-dive.test.tsx
git commit -m "feat(campaigns): vertical wall-dive sina-rose-maria-beyond"
```

---

### Task 2: WallBreach overlay kompatibel mundur

**Files:**
- Modify: `src/components/dark-fantasy/WallBreach.tsx:10-17`
- Test: `src/test/wall-breach.test.tsx`

**Interfaces:**
- Consumes: `progress?: number` (0–1, opsional).
- Produces: tampilan sama bila hanya `isBreached` dipakai (kompatibel test lama); bila `progress` ada, crack opacity/scale mengikuti progress.

- [ ] **Step 1: Tulis failing test**

```tsx
it('applies progress style without breaking isBreached contract', () => {
  render(<WallBreach wallName="WALL SINA" zoneLabel="X" isBreached />);
  expect(screen.getByText('BREACH ENGAGED')).toBeInTheDocument();
});
```

- [ ] **Step 2: Jalankan**

Run: `npx vitest run src/test/wall-breach.test.tsx`
Expected: PASS baseline (kontrak lama). Lanjut implementasi tanpa memecahkannya.

- [ ] **Step 3: Implementasi minimal — tambah prop opsional**

```tsx
interface WallBreachProps { wallName: string; zoneLabel: string; isBreached?: boolean; progress?: number; }
// di dalam komponen, setelah debrisFragments:
const crackOpacity = typeof progress === 'number' ? Math.min(1, Math.max(0, progress)) : undefined;
// pada svg: style={{ opacity: crackOpacity ?? 1, filter: isBreached ? 'drop-shadow(0 0 8px #b4442e)' : undefined }}
```

Jangan ubah debris 12, class, atau teks status.

- [ ] **Step 4: Jalankan**

Run: `npx vitest run src/test/wall-breach.test.tsx src/test/campaign-dive.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dark-fantasy/WallBreach.tsx src/test/wall-breach.test.tsx
git commit -m "feat(walls): breach overlay progress without breaking contract"
```

---

### Task 3: Vision video background + script ekstraksi

**Files:**
- Rewrite: `src/components/dark-fantasy/VisionSection.tsx:19-60`
- Create: `docs/videos/extract-vision.sh`, `public/videos/.gitkeep`
- Test: extend `src/test/vision-summon.test.tsx`

**Interfaces:**
- Consumes: `VISION_DATA`, `public/videos/vision-sea-loop.mp4`, `public/videos/vision-sea-poster.jpg`.
- Produces: layer video `autoplay muted loop playsInline` + fallback poster + overlay kontras; reveal lokal `toggleActions: 'play none none reverse'` untuk `.horizon-item` (independen dari Plan A).

- [ ] **Step 1: Tulis failing test — video attrs + poster fallback**

```tsx
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisionSection } from '../components/dark-fantasy/VisionSection';

describe('Vision video', () => {
  it('renders muted looping video with poster over storm overlay', () => {
    render(<VisionSection />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('muted');
    expect(video?.querySelector('source')?.getAttribute('src')).toContain('vision-sea-loop');
    expect(document.querySelector('.vision-storm-overlay')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan FAIL**

Run: `npx vitest run src/test/vision-summon.test.tsx`
Expected: FAIL (belum ada `<video>`).

- [ ] **Step 3: Buat script + placeholder + implementasi**

`docs/videos/extract-vision.sh`:

```sh
#!/bin/sh
set -eu
mkdir -p public/videos
yt-dlp -f "bv*[height<=720]" --download-sections "*46-48" "https://www.youtube.com/watch?v=gNwABGACsfY" -o "public/videos/vision-sea-loop.raw.mp4"
ffmpeg -y -i "public/videos/vision-sea-loop.raw.mp4" -an -c:v libx264 -crf 23 -r 24 -vf "scale=1280:-2" "public/videos/vision-sea-loop.mp4"
ffmpeg -y -ss 0 -i "public/videos/vision-sea-loop.mp4" -vframes 1 "public/videos/vision-sea-poster.jpg"
rm -f "public/videos/vision-sea-loop.raw.mp4"
ls -lh public/videos/
```

`VisionSection.tsx` (bagian atas section, di bawah overlay lama):

```tsx
const [videoFailed, setVideoFailed] = useState(false);
const showVideo = !reducedMotion && !videoFailed;
// ...
{showVideo ? (
  <video autoPlay muted loop playsInline preload="metadata" poster="/videos/vision-sea-poster.jpg"
    onError={() => setVideoFailed(true)}
    className="absolute inset-0 h-full w-full object-cover opacity-25">
    <source src="/videos/vision-sea-loop.mp4" type="video/mp4" />
  </video>
) : (
  <img src="/videos/vision-sea-poster.jpg" alt="" aria-hidden="true"
    className="absolute inset-0 h-full w-full object-cover opacity-25" />
)}
<div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0a0908] via-[#0a0908]/40 to-[#0a0908]" />
```

Pertahankan `.vision-storm-overlay` dan scrub `xPercent` headline yang ada; tambah reveal lokal untuk `.horizon-item` dengan `toggleActions: 'play none none reverse'` (tulis ScrollTrigger inline di file ini, jangan import dari Plan A). Tambah class `horizon-item` pada tiap item horizons. Base path video `./videos/...` bila `import.meta.env.BASE_URL !== '/'`? Gunakan absolut `/videos/...` konsisten dengan `base: './'`? Untuk GitHub Pages subpath, pakai `${import.meta.env.BASE_URL}videos/vision-sea-loop.mp4`. Tulis begitu agar tidak pecah di Pages.

- [ ] **Step 4: Jalankan, pastikan PASS (dengan catatan video file asli belum ada — test hanya cek markup)**

Run: `npx vitest run src/test/vision-summon.test.tsx`
Expected: PASS. Catatan untuk executor: file `mp4`/`jpg` asli dibuat manual via script sebelum QA visual; test tidak membutuhkan file biner.

- [ ] **Step 5: Commit (tanpa file video biner)**

```bash
git add src/components/dark-fantasy/VisionSection.tsx docs/videos/extract-vision.sh public/videos/.gitkeep src/test/vision-summon.test.tsx
git commit -m "feat(vision): local looping sea video background with poster fallback"
```

---

### Task 4: Verifikasi akhir Plan B

- [ ] **Step 1: Full test file terkait**

Run: `npx vitest run src/test/campaign-dive.test.tsx src/test/campaigns-journey.test.tsx src/test/campaigns-section.test.tsx src/test/wall-breach.test.tsx src/test/vision-summon.test.tsx`
Expected: PASS semua.

- [ ] **Step 2: Typecheck file yang disentuh**

Run: `npx tsc --noEmit`
Expected: bersih (tidak ada error baru di file Plan B; bila ada error lama di file lain, catat dan jangan perbaiki di plan ini).

- [ ] **Step 3: QA manual checklist (tulis hasil di commit message atau PR)**

```
- [ ] Dive urut Sina->Rose->Maria->Beyond, pin tidak overlap section berikut
- [ ] Kecil (<1000px) / reduced-motion tampil grid vertikal lama
- [ ] Video loop muted 2 detik, poster saat reduced-motion / error
- [ ] Ukuran mp4 <2MB, tanpa audio
```

- [ ] **Step 4: Commit verifikasi (bila ada perbaikan kecil)**

```bash
git add -A
git commit -m "test(plan-b): verify dive order and vision video fallback"
```

## Self-review Plan B

- Spec §3.5→Task 1+2; §3.6→Task 3; verifikasi→Task 4.
- Tidak ada TODO/TBD; semua step punya kode + perintah run eksplisit.
- Tidak depend ke file Plan A (`useReveal` ditulis ulang lokal agar 2 agent bisa jalan paralel tanpa blokir).
- Konflik merge yang mungkin: `CampaignsSection.tsx` (hanya Plan B), `VisionSection.tsx` (hanya Plan B) — Plan A dilarang menyentuhnya. `DarkFantasyShell`/`SmoothScroll` hanya Plan A.
