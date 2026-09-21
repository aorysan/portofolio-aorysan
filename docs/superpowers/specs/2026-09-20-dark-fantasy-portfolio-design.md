# Dark Fantasy Portfolio Design Spec: Beyond The Walls

## 0. Status & Scope (added — spec vs reality sync)

> Review 2026-09-20: spec asli ditulis seolah implementasi belum ada.
> Realita saat ini: `DarkFantasyShell` **sudah shipped** di `src/components/dark-fantasy/`,
> `SmoothScroll` (Lenis) **sudah real** (bukan no-op), `src/lib/dark-fantasy-data.ts` **sudah ada**.
> Spec ini di-improve agar jadi source of truth: bagian SHIPPED = jangan diulang,
> bagian PLANNED = Three Walls horizontal journey + GSAP scroll choreography.

**SHIPPED (jangan re-implement):**
- `src/pages/Index.tsx` → `TactileSoundProvider` + `DarkFantasyShell` (bukan `DossierShell`)
- `src/App.tsx` → single `SmoothScroll` wrapper di top level (jangan pindah/duplikat ke shell)
- `src/components/dark-fantasy/` → `DarkFantasyShell, TacticalHeader, NavRail, HeroSection, CreedSection, ArsenalSection, CampaignsSection, VisionSection, SummonSection, DarkFantasyFooter, EmberCanvas, CampaignDossierModal`
- `src/lib/dark-fantasy-data.ts` → `HERO_DATA, CREED_DATA, ARSENAL_DATA, CAMPAIGNS_DATA, SUMMON_DATA`
- `src/index.css` → font import Cinzel/Oswald/Barlow + `:root` dark-fantasy tokens (sudah ada)
- `CampaignsSection` saat ini = **responsive grid + modal** (bukan horizontal journey)
- `SummonSection` saat ini = **mailto + sonner toast** (bukan backend form)
- `HeroSection` saat ini = **anime.js** entrance saja (belum ada GSAP ScrollTrigger)

**PLANNED (sisa pekerjaan spec ini):**
1. GSAP ScrollTrigger choreography (hero recession, creed pin-reveal, vision parallax)
2. Three Walls horizontal journey sebagai **Phase 2** dengan fallback ke grid Phase 1
3. Reusable `TextScramble` + `WallBreach` + hooks (`useScrollReveal`, `useTextSplit`)
4. Lenis ↔ GSAP sync yang benar + chapter/fluid mode contract
5. A11y hardening (focus trap modal, reduced-motion, kontras) + perf budget

**Konvensi penamaan (fix dari spec lama):**
- Spec lama memakai `darkfantasy/DFHero/DFHeader/...` — **SALAH**.
- Yang benar: `src/components/dark-fantasy/` + `HeroSection, TacticalHeader, ...` (kebab-case folder, PascalCase `*Section`).
- `DossierLightbox` → nama aktual `CampaignDossierModal`. Jangan rename tanpa migrasi test.

---

## 1. Design Tokens & Typography

### 1.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ash` | `#0a0908` | Page background |
| `--color-soot` | `#12100e` | Card/panel surfaces |
| `--color-iron` | `#1c1a17` | Container backgrounds |
| `--color-stone` | `#2a2723` | Borders, hairlines, dividers |
| `--color-bone` | `#d6cfc2` | Primary text (headings) |
| `--color-parchment` | `#b7ad99` | Secondary text (body, captions) |
| `--color-blood` | `#7c1f1a` | Accent — selections, active states |
| `--color-ember` | `#b4442e` | Accent — highlights, hover glows |
| `--color-rust` | `#8a4b2b` | Tertiary warm accent |
| `--color-verdigris` | `#4d6155` | Cool accent (Beyond zone fog hints) |

**Fix dari spec lama:** proyek ini Tailwind **v3** (`tailwind.config.ts`), bukan v4.
Jangan pakai `@theme`. Integrasi yang benar:

1. `src/index.css` `:root` menyimpan vars di atas (SUDAH ADA — jangan duplikat).
2. `tailwind.config.ts → theme.extend.colors` map ke vars agar bisa dipakai sebagai utility:
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
   }
   ```
   Sampai ini dikerjakan, kode boleh tetap pakai arbitrary values (`bg-[#0a0908]`) — itu yang dipakai sekarang.
3. **[P0 — TODO di kode]** Hapus/perbaiki `index.css:392-393`: dua baris itu menimpa channel HSL (`--background: 240 20% 5%`) dengan hex (`var(--color-ash)`), sementara `tailwind.config.ts` memakai `hsl(var(--background))` → `hsl(#0a0908)` = warna invalid. Akibatnya `bg-background`/`text-foreground` dkk (shadcn, toaster, tooltip) rusak. Fix: hapus kedua baris override itu (kembalikan channel HSL semula) DAN pakai token dark-fantasy via `extend.colors` di poin 2 (`bg-ash text-bone`) untuk komponen dark-fantasy. Jangan campur dua sistem di satu elemen.

**Kontras (angka di bawah ESTIMASI — wajib ukur ulang dengan DevTools contrast checker sebelum close):** `--color-parchment #b7ad99` di atas `--color-ash #0a0908` ≈ 7–9:1 — OK untuk body.
`--color-ember #b4442e` di atas ash ≈ 3:1 (klaim lama "4+:1" overstate) — hanya untuk large text (≥18pt / 14pt bold) dan aksen non-teks. JANGAN untuk label kecil seperti `03 — CAMPAIGNS` 12px (gagal 4.5:1); label kecil pakai parchment, ember hanya sebagai dot/underline/glow pendamping.
`--color-stone #2a2723` untuk teks kecil di atas ash **GAGAL** kontras — hanya untuk border/dekoratif (footer saat ini pakai stone untuk teks — perbaiki ke parchment/60%).

### 1.2 Typography (Google Fonts `@import`)

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | `Cinzel` | 400, 600, 700, 900 | Hero headline, section quotes, stats numbers |
| Military | `Oswald` | 300, 400, 500, 600, 700 | Section labels, nav items, badges, form labels, footer |
| Body | `Barlow` | 300, 400, 500, 600 | Paragraphs, descriptions, form inputs |

Status: import font di `src/index.css:1` SUDAH BENAR. `tailwind.config.ts` sudah map `display/military/body`. Gunakan `font-display/font-military/font-body`, bukan `font-cinzel` custom.

### 1.3 Global Styles

- `background-color: var(--color-ash)`; `color: var(--color-bone)`; `font-family: Barlow`
- `-webkit-font-smoothing: antialiased`; `overflow-x: hidden` (di `body`, bukan tiap section)
- `::selection { background: var(--color-blood); color: var(--color-bone) }`
- Scrollbar: `::-webkit-scrollbar` track soot + thumb stone, hover ember. Jangan hidden-by-default (spec lama ambigu) — pakai thin styled scrollbar agar discoverable.
- `html { scroll-behavior: auto }` saat Lenis aktif (Lenis mengontrol easing sendiri). `smooth` hanya sebagai fallback saat Lenis nonaktif / reduced-motion.

### 1.4 Z-index scale (baru — cegah stacking bug)

| Layer | z | Isi |
|-------|---|-----|
| base | 0–10 | Sections (`z-10` pada section agar di atas canvas) |
| canvas | 1 | `EmberCanvas` (`fixed, pointer-events-none, z-[1]`) |
| header | 50 | `TacticalHeader` |
| nav rail | 40 | `NavRail` |
| modal | 90 | `CampaignDossierModal` overlay + panel — **[TODO di kode]** saat ini `z-50` (`CampaignDossierModal.tsx:24`), sama dengan header. Naikkan ke `z-[90]` agar di atas header/nav rail. |
| toast | 100 | sonner `Toaster` |

---

## 2. Architecture & Component Tree

```
App.tsx
└── SmoothScroll (SATU-SATUNYA instance Lenis, di top level)
    └── ThemeProvider (forced dark)
        └── Index.tsx
            └── TactileSoundProvider
                └── DarkFantasyShell (mode: fluid | chapter)
                    ├── EmberCanvas (fixed, z-1)
                    ├── TacticalHeader (fixed HUD)
                    ├── NavRail (fixed right)
                    ├── <main>
                    │   ├── HeroSection (#home)
                    │   ├── CreedSection (#creed)
                    │   ├── ArsenalSection (#arsenal)
                    │   ├── CampaignsSection (#campaigns) — Phase 1: grid
                    │   │   └── CampaignDossierModal (portal)
                    │   ├── VisionSection (#vision)
                    │   └── SummonSection (#summon)
                    └── DarkFantasyFooter (fluid mode saja)
```

### 2.1 File map — aktual vs rencana

| File aktual (kebab-case) | Status | Catatan |
|------|--------|---------|
| `src/components/dark-fantasy/DarkFantasyShell.tsx` | SHIPPED | Punya dual mode `fluid \| chapter` — spec lama tidak mendokumentasikan, lihat §2.4 |
| `src/components/dark-fantasy/TacticalHeader.tsx` | SHIPPED | = `DFHeader` di spec lama |
| `src/components/dark-fantasy/NavRail.tsx` | SHIPPED | = `DFNavRail` |
| `src/components/dark-fantasy/HeroSection.tsx` | SHIPPED | = `DFHero`, anime.js only |
| `src/components/dark-fantasy/CreedSection.tsx` | SHIPPED | = `DFCreed`, statik |
| `src/components/dark-fantasy/ArsenalSection.tsx` | SHIPPED | = `DFArsenal`, statik |
| `src/components/dark-fantasy/CampaignsSection.tsx` | SHIPPED (Phase 1) | Grid + modal. Horizontal journey = Phase 2, lihat §3.6 |
| `src/components/dark-fantasy/VisionSection.tsx` | SHIPPED | Statik |
| `src/components/dark-fantasy/SummonSection.tsx` | SHIPPED | mailto + toast |
| `src/components/dark-fantasy/DarkFantasyFooter.tsx` | SHIPPED | Perbaiki kontras teks (§1.1) |
| `src/components/dark-fantasy/EmberCanvas.tsx` | SHIPPED | Sudah ada reduced-motion + jsdom guard |
| `src/components/dark-fantasy/CampaignDossierModal.tsx` | SHIPPED partial | Struktur + `Escape` + `aria-modal` ada. BELUM ada: focus trap, focus restore, `lenis.stop()`, body scroll-lock, `z-[90]` (lihat §1.4, §7). Lengkapi sebelum Phase 2. |
| `src/lib/dark-fantasy-data.ts` | SHIPPED | = `darkFantasyData.ts` spec lama (kebab-case!) |
| `src/components/SmoothScroll.tsx` | SHIPPED | Sudah real Lenis + `useLenisContext` |

| File rencana (baru) | Prioritas | Purpose |
|------|-----------|---------|
| `src/components/dark-fantasy/TextScramble.tsx` | P1 | Reusable runic decode effect (ganti duplikasi anime.js per section) |
| `src/components/dark-fantasy/WallBreach.tsx` | P2 | Crack + debris untuk Phase 2 horizontal journey |
| `src/components/dark-fantasy/CampaignsJourney.tsx` | P2 | Phase 2 horizontal journey (terpisah dari grid Phase 1) |
| `src/hooks/useScrollReveal.ts` | P1 | IntersectionObserver + GSAP reveal sekali pakai, dengan cleanup |
| `src/hooks/useTextSplit.ts` | P1 | Split words/chars ke spans (untuk creed pin-reveal) |
| `src/hooks/useReducedMotion.ts` | P1 | Single source `matchMedia('(prefers-reduced-motion: reduce)')` |

**JANGAN buat** `src/hooks/useLenisScroll.ts` terpisah — `useLenisContext` dari `SmoothScroll.tsx` sudah memenuhi. Duplikasi accessor = dua source of truth.

### 2.2 Aturan Lenis — single instance (fix kritis spec lama)

Spec lama §2.2/§5 menyuruh "Lenis wrapper moves into shell" — **JANGAN**.
`App.tsx` sudah membungkus semuanya dengan `<SmoothScroll>`. Menambah Lenis di shell = 2 RAF loop, scroll ganda, ScrollTrigger rusak.

Kontrak:
- Satu instance Lenis, dimiliki `SmoothScroll.tsx`, di top level `App.tsx`.
- `DarkFantasyShell` MENGONSUMSI via `useLenisContext().scrollTo`, tidak membuat instance baru.
- Chapter mode: `<SmoothScroll enabled={mode === 'fluid'}>` (sudah begitu) — Lenis destroy saat chapter, restore saat fluid.
- `CampaignDossierModal` open → `lenis.stop()`; close → `lenis.start()` (ganti "pause" ambigu di spec lama).

Sync Lenis ↔ GSAP yang benar (belum ada di kode — wajib sebelum animasi §3.3/§3.4/§3.6 diimplementasikan).
PENTING: integrasikan ke dalam `SmoothScroll.tsx` (instance miliknya), JANGAN membuat `new Lenis` di file lain:

```ts
// Di dalam SmoothScroll.tsx — GANTI rAF loop yang ada, jangan duplikat:
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
const tick = (time: number) => lenis.raf(time * 1000);
gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);
// cleanup: gsap.ticker.remove(tick); lenis.destroy();
```

`ScrollTrigger.getAll().forEach(t => t.kill())` hanya di cleanup unmount root, bukan per section (section pakai `ctx.revert()`, lihat §7).
Tanpa pola ini, semua `pin + scrub` akan jitter/desync. Menjalankan rAF loop lama + `gsap.ticker` bersamaan = double-drive (Lenis maju 2×) — pastikan hanya satu driver.

### 2.3 Preserved Files

`dossier/`, `gamified/`, `portfolio/` tetap ada, tidak dihapus. Entry point tetap `Index.tsx`.

### 2.4 Fluid vs Chapter mode (baru — didokumentasikan karena sudah ada di kode)

`DarkFantasyShell` punya `mode: 'fluid' | 'chapter'` yang spec lama abaikan total:
- `fluid` = continuous scroll (pengalaman utama, SEO-friendly, default).
- `chapter` = presentation deck (satu section per viewport, wheel/keys/swipe navigasi, body overflow hidden).
- Semua animasi ScrollTrigger **hanya aktif di fluid**. Di chapter mode: matikan pin/scrub, pakai fade-in sederhana.
- Anchor `#creed` dkk hanya valid di fluid. Di chapter, `NavRail` memanggil `goToChapter(i)`, bukan `scrollTo`.
- Spec animasi §3 di bawah berlaku untuk **fluid**. Jika menulis test, uji kedua mode.
- **Mekanisme penonaktifan [TODO]:** section tidak menerima `mode` saat ini, sehingga ScrollTrigger yang dibuat di dalam section akan rusak di chapter mode (pin di dalam container `overflow-y-auto` + body hidden). Sebelum implementasi §3: sediakan `ChapterModeContext` (atau prop `scrollFXEnabled`) dari `DarkFantasyShell` — section hanya init ScrollTrigger bila `mode === 'fluid'`; bila chapter, pakai fade-in sederhana. Tanpa ini, Phase 2 dilarang masuk chapter deck.

---

## 3. Section Designs

Kepemilikan animasi (baru — cegah over-engineering):
- **Hover/micro**: CSS transitions saja. Anime.js hanya untuk scramble/decode teks.
- **Entrance sekali**: `useScrollReveal` (IO + CSS class) atau anime.js. GSAP hanya jika perlu scrub/pin/stagger kompleks.
- **Scroll-driven (scrub/pin/parallax)**: GSAP ScrollTrigger saja, dengan pola §2.2 + cleanup.

### 3.1 TacticalHeader (Fixed Top HUD) — SHIPPED, polish saja

- `fixed` top full width `z-50`; transparent → ash + blur on scroll (via Lenis scroll callback atau IO sentinel).
- Kiri: callsign. Kanan: `REG. NO. 104`. Audio toggle (lucide Volume) → `TactileSoundManager` mute.
- **Callsign (diputuskan final — lihat §6):** tetap `Aryo A.P` sesuai `HERO_DATA.callsign` dan test regex `/Aryo A\.P/i`. `A.PUTRO` hanya diizinkan sebagai alias pendek di HUD bila ruang sempit, tanpa mengubah data maupun test. Jangan rename sebelum migrasi test.
- Tambah: `aria-pressed` pada audio toggle; mode toggle fluid/chapter harus punya `aria-pressed` + label jelas.

### 3.2 NavRail — SHIPPED, polish saja

- 6 item (`HOME/CREED/ARSENAL/CAMPAIGNS/VISION/SUMMON`), active = ember + glow dot.
- Deteksi: IO per section. Hidden < 1000px.
- Sudah `<button>` + `aria-label` (`NavRail.tsx:24-28`) — pertahankan. **[TODO]** tambah `aria-current="true"` pada item aktif.

### 3.3 HeroSection (`#home`) — SHIPPED entrance, PLANNED recession/parallax

Konten aktual (pertahankan): tagline, `BEYOND` solid + `THE WALLS` outline (`-webkit-text-stroke: 2px`), sub-paragraph, `ADVANCE` button + doctrine quote.

Animasi:
1. Letter entrance — SHIPPED (anime.js stagger). Pertahankan + bungkus try/catch + reduced-motion guard (sudah ada).
2. ~~Cursor Magnetic Pull (GSAP quickTo)~~ — HAPUS dari spec. Biaya vs manfaat buruk di mobile; hover magnet tidak relevan untuk CTA scroll. Ganti: scale + border glow CSS on hover (sudah ada).
3. **PLANNED** Hero Recession (GSAP scrub): headline `scale 1→0.85, opacity 1→0` saat scroll keluar. Nonaktifkan di chapter mode + reduced-motion.
4. **PLANNED** Fog parallax: max 2 layer (spec lama bilang 3 — kurangi untuk perf), `yPercent` berbeda, `will-change: transform`, nonaktif di reduced-motion.

Acceptance: LCP < 2.5s (headline adalah LCP — jangan animate `filter`/blur padanya).

### 3.4 CreedSection (`#creed`) — PLANNED pin-reveal

Konten: header `01 — THE CREED`, quote Cinzel, 2 kolom narasi, stats row.
**Drift:** data aktual `CREED_DATA.stats = 02+ / 06+ / 100% MISSION RELIABILITY`. Spec lama bilang `2+ / 6+ / ∞`. Putuskan: `∞ WALLS BREACHED` lebih tematik tapi tidak kredibel untuk hiring; `100% MISSION RELIABILITY` juga tidak verifiable. Rekomendasi: `02+ YEARS / 06+ SYSTEMS / NN PARTNERS` dengan NN = jumlah klien/org yang benar-benar bisa dipertanggungjawabkan. Jangan ship `∞`/`100%` tanpa basis.

Animasi:
1. **Pinned word reveal** (GSAP `pin + scrub`): kata `opacity 0.15→1` progresif. Wajib `invalidateOnRefresh`, `end: '+=120%'`, matikan pin di <768px (ganti IO stagger biasa — pin vertikal di mobile sempit = jebakan scroll).
2. Header decode → pakai `TextScramble` reusable (baru), bukan duplikasi anime.js per section.
3. Stats counter: count-up hanya untuk numerik (`02+`, `06+`); simbol non-numerik fade-in. Trigger sekali (`once: true`), hormati reduced-motion (tampilkan final langsung).

### 3.5 ArsenalSection (`#arsenal`) — SHIPPED statik, PLANNED entrance

4 kartu sesuai `ARSENAL_DATA` (sigil: `blades/fortress/reticle/spark`). Pertahankan stack aktual (sudah lebih akurat dari spec lama: ada `Anime.js/Lenis`, `RESTful APIs`, `Vite`, `Git CI/CD`).
- Entrance: `scale 0.9→1, opacity, brightness` stagger 0.1s (spec lama 0.2s terlalu lambat untuk 4 kartu).
- SVG stroke-draw hanya jika sigil berupa path SVG; jika lucide icon biasa, pakai fade+glow saja (jangan over-spec `strokeDashoffset` untuk icon fill).
- Hover: ember underline `scaleX`, sigil glow, title scramble — semua CSS kecuali scramble (anime.js, debounce 300ms agar tidak spam saat mouse lewat cepat).

### 3.6 Campaigns — Phase 1 SHIPPED (grid), Phase 2 PLANNED (Three Walls Journey)

**Phase 1 (saat ini, pertahankan sebagai fallback):** responsive grid 1→2→3 kolom, kartu `role=button tabIndex=0` + Enter/Space, slice stack max 3 + `+n`, klik → `CampaignDossierModal`. Ini yang diuji dan di-ship. Jangan hapus saat Phase 2 datang.

**Phase 2 (rencana — jangan implement sebelum §5 + §7 siap):** pinned horizontal journey dengan metafora ekspedisi Survey Corps menembus 3 lapis tembok dari dalam ke luar. (Nama proyek di §3.6.1 hanya ilustrasi dari data saat ini; mapping resmi mengikuti aturan data-driven §3.6.3. "Mitras" = ujung interior zona `sina`, bukan zone terpisah.)

#### 3.6.1 Camera & Visual POV (Kamera Menghadap ke Luar)
Sesuai arahan desain, kamera ekspedisi **selalu menyorot/menghadap ke arah luar** (ke depan perjalanan / ke horizon kanan), bukan sebaliknya atau mundur ke dalam:
1. **Titik Awal (Wall Sina / Mitras)**:
   - Kamera berada di pusat terdalam, menatap lurus ke depan ke arah benteng **Wall Sina**.
   - Menampilkan proyek-proyek era terawal / paling lama (`wallZone: 'sina'`, 2023: *FrameWork*, *Jawara*).
2. **Breach 1 (Wall Sina Breach)**:
   - Saat user scroll maju, viewport bergerak mendekati Wall Sina hingga memicu breach: SVG retak (`strokeDashoffset`), debris shatter (≤12 fragmen GPU transform), kilatan ember, dan trigger audio tactile (`playSound`).
   - Kamera menembus celah reruntuhan dan tetap menatap ke depan ke arah benteng berikutnya di kejauhan.
3. **Zona Tengah (Wall Rose)**:
   - Kamera berada di antara Sina dan Rose, menampilkan proyek-proyek era pertengahan (`wallZone: 'rose'`, 2024: *KampungKu*, *SarPras*, *Rest Area Tycoon*).
   - Menghadap ke arah **Wall Rose** yang menjulang di hadapan.
4. **Breach 2 (Wall Rose Breach)**:
   - Wall Rose retak dan runtuh dengan efek partikel + audio cue. Kamera melintasi reruntuhan menuju zona terluar.
5. **Zona Terluar (Wall Maria)**:
   - Kamera berada di zona Wall Maria, menampilkan proyek-proyek era terbaru (`wallZone: 'maria'`, 2024: *TrasMart*).
   - Menghadap ke benteng terluar peradaban: **Wall Maria**.
6. **Breach 3 (Wall Maria Breach — The Final Wall)**:
   - Wall Maria hancur lebur. Kamera menembus keluar dari perimeter peradaban.
7. **Beyond the Walls (Wilayah Titan Liar / Upcoming Projects)**:
   - Kamera menatap ke horizon terbuka yang diselimuti kabut tebal (`ash` → `verdigris` gradient).
   - Partikel kabut dingin melayang pelan (kecepatan 0.3×).
   - Terdapat beacon / radar berkedip `⟐ EXPEDITION IN PROGRESS` sebagai representasi proyek masa depan (*incoming projects*).

#### 3.6.2 Technical Mechanics & Constraints
- **Track**: `display:flex; width: max-content` di dalam pinned wrapper `height: 100vh`.
- **GSAP**: `x: () => -(track.scrollWidth - window.innerWidth)`, `scrub: 1`, `pin: true`, `anticipatePin: 1`, `invalidateOnRefresh: true`, `end: () => '+=' + (track.scrollWidth - window.innerWidth)`.
- **Panel sequence**: `Sina Interior → Wall Sina → Rose Zone → Wall Rose → Maria Zone → Wall Maria → Beyond The Walls`. Zone label Oswald faded; wall = full-height stone (CSS gradient + SVG noise, bukan image berat).
- **WallBreach trigger**: crack SVG `strokeDashoffset` → debris shatter (max 12 fragmen per wall, `transform`-only) → ember flash 200ms → rumbling `x: ±4px` 300ms (hindari layout thrashing) → audio trigger via `TactileSoundProvider` (`playSound('stampThud')` atau stone crack FX).
- **Beyond zone**: fog gradient ash→verdigris, 1–2 pulsing marker `⟐ EXPEDITION IN PROGRESS`, fog particles lambat (bukan ember).

#### 3.6.3 Data Mapping
`CAMPAIGNS_DATA` saat ini flat (`district/year`), tidak punya `wallZone`. Untuk Phase 2 tambah field opsional tanpa merusak Phase 1:
```ts
export type WallZone = 'sina' | 'rose' | 'maria' | 'beyond';
export interface Campaign extends Base { 
  wallZone?: WallZone; 
  era?: 'oldest' | 'mid' | 'newest'; 
}
```
Aturan distribusi (data-driven, bukan hardcode — sesuai §6):
- `sina`: 2 proyek tertua (`era: 'oldest'`)
- `rose`: proyek tengah (`era: 'mid'`)
- `maria`: proyek terbaru/unggulan (`era: 'newest'`)
- `beyond`: marker `⟐ EXPEDITION IN PROGRESS` (bukan dari `CAMPAIGNS_DATA`)

Contoh ilustratif dari data saat ini (bisa berubah tanpa mengubah spec): sina ← FrameWork + Jawara (2023); rose ← KampungKu + SarPras + Rest Area Tycoon (2024); maria ← TrasMart (2024).

**Fallback (wajib):** `<1000px` ATAU `prefers-reduced-motion` ATAU chapter mode → render Phase 1 grid vertikal. Wall menjadi horizontal divider dengan crack on-reveal (bukan pin).

Acceptance Phase 2: scroll penuh menembus 3 breach tanpa jank (>50fps di Moto G4 emulation), semua kartu tetap bisa dibuka via keyboard, `ScrollTrigger.refresh()` setelah image load.

### 3.7 VisionSection (`#vision`) — PLANNED parallax ringan

Konten pertahankan (quote THE SEA ember highlight + 3 horizon goals NEXT/BEYOND/ALWAYS).
- Horizontal text parallax: max `x: ±6%` scrub (spec lama tidak membatasi — teks yang kabur keluar viewport = gagal baca). 
- Storm overlay opacity scrub `0→0.4` max.
- Horizon cards stagger + divider `scaleX`. Semua nonaktif saat reduced-motion.

### 3.8 SummonSection (`#summon`) — SHIPPED mailto, kontrak diperjelas

Konten + form fields sesuai implementasi aktual (NAME/CALLSIGN-EMAIL/OBJECTIVE/REPORT).
Kontrak yang spec lama salah: bukan "form replaced with confirmation". Perilaku aktual & yang dipertahankan:
1. `required` + `type=email` validation native. Tambah `minLength={10}` untuk REPORT + `maxLength={2000}` (baru — cegah mailto URL >2000 char pecah di klien email).
2. Submit → `playSound('stampThud')` → `mailto:` dengan subject/body encoded → `toast.success('Raven dispatched…')`.
3. Tambah (baru): jika body >1800 char, potong + tampilkan `toast.error` instruksi kirim manual ke `SUMMON_DATA.dispatch`. Ini edge case nyata mailto yang spec lama abaikan.
4. Button: `DISPATCH THE REPORT →` + `aria-label`. Hover pulse CSS saja (loop anime.js border = distraksi + biaya; hapus dari spec).
5. "Shockwave scale 1.05" → hapus; entrance cukup fade-rise 400ms.

### 3.9 DarkFantasyFooter — SHIPPED, fix kontras

Hairline stone, kiri callsign + `DEDICATE YOUR HEART`, kanan `© 2026 · BUILT BEYOND THE WALLS`. Naikkan warna teks ke `--color-parchment` 60% (saat ini stone = gagal kontras).

---

## 4. Ember Canvas Particle System — SHIPPED, batasan ditambah

`EmberCanvas.tsx` sudah benar (rAF loop, resize handler, reduced-motion + jsdom guard, `count=35`).
Tambahan (baru):
- **[TODO]** Pause saat tab hidden (`visibilitychange` → `cancelAnimationFrame`) — hemat baterai.
- Tidak perlu pause saat modal open / chapter mode (canvas `pointer-events-none`, biaya ~35 arc fill/frame dapat diabaikan). Jangan sinkron ke Lenis scroll position (spec lama menyarankan parallax sync — biaya per-frame untuk efek sub-piksel; hapus).
- Budget: ≤50 partikel desktop, ≤20 jika `deviceMemory < 4` atau `hardwareConcurrency < 4` atau viewport <768px. Radius 1–3px, tanpa shadowBlur (mahal).
- Fog particles Beyond zone (Phase 2) = sistem terpisah dengan warna verdigris + speed 0.3×, bukan mode/varian EmberCanvas.

---

## 5. Lenis Smooth Scroll Integration — SHIPPED, pola GSAP ditambah

`SmoothScroll.tsx` SUDAH real (duration 1.2, expo easing, `smoothWheel`, reduced-motion + ResizeObserver guard, `scrollTo` fallback `scrollIntoView`). Pertahankan.

Yang belum ada dan WAJIB sebelum animasi §3.3/3.4/3.6:
- Pola §2.2 (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`).
- `lenis.stop()/start()` pada modal open/close.
- `ScrollTrigger.refresh()` setelah fonts/images load + setelah toggle fluid/chapter.
- Wheel `orientation: 'vertical'` saja; jangan tambah `smoothTouch` (merusak ekspektasi swipe mobile).

---

## 6. Data Adaptation (`src/lib/dark-fantasy-data.ts` — perhatikan kebab-case)

File sudah ada dengan tipe `Campaign`, `ArsenalQuadrant`, `HERO_DATA`, `CREED_DATA`, `ARSENAL_DATA`, `CAMPAIGNS_DATA`, `SUMMON_DATA`. Spec lama menunjuk `darkFantasyData.ts` + field yang tidak ada (`callsign/regNumber/headline/...`) — abaikan, ikuti file aktual.

Drift yang harus diputuskan & resolusi rekomendasi:
| Item | Spec lama | Aktual | Rekomendasi / Keputusan |
|------|-----------|--------|-------------------------|
| Callsign | `A.PUTRO` | `Aryo A.P` | Tetap `Aryo A.P` di data & test suite agar tidak memecahkan snapshot test; `A.PUTRO` diizinkan sebagai alias pendek khusus di HUD jika diperlukan. |
| Stats | `2+/6+/∞` | `02+/06+/100%` | Ganti `100% MISSION RELIABILITY` dengan metrik nyata yang verifiable (misal `04+ REGIMENTS / ORGANIZATIONS`) saat update data. |
| Campaign districts | Wall zones | `DISTRICT TROST` dkk flat | Tambah opsional `wallZone: 'sina' \| 'rose' \| 'maria' \| 'beyond'` (Phase 2), mapping: Sina (2023), Rose (2024 mid), Maria (2024 latest), Beyond (upcoming). |
| Role | `FULL STACK` | `full stack` / per-campaign role | Pertahankan per-campaign `role` aktual. |

Aturan: spec tidak meng-hardcode judul proyek / email / stats. Semua dari `dark-fantasy-data.ts`. Ubah data = tidak perlu ubah spec.

---

## 7. Accessibility & Performance (diperketat dari spec lama yang generik)

- `prefers-reduced-motion`: [DONE] matikan Lenis, matikan EmberCanvas. [TODO] pin/scrub/parallax/counter/scramble → tampilkan state akhir langsung. Satu hook `useReducedMotion` untuk semua (belum ada — masih guard `matchMedia` tersebar per file).
- Semantic: `header/nav/main/section/footer` [DONE sebagian]. [TODO] tiap section `aria-labelledby` ke heading-nya (contoh: `HeroSection#home` belum punya).
- `CampaignDossierModal`: [DONE] `role=dialog aria-modal=true`, `Escape` close. [TODO] `aria-label`, focus trap (Tab cycling), focus restore ke kartu pemicu, `lenis.stop()` + `body overflow hidden` saat open, `z-[90]`. Kartu: `role=button tabIndex=0` + Enter/Space [DONE] — pertahankan.
- Kontras: body ≥4.5:1 (bone/parchment di ash OK); ember hanya large text/accent; perbaiki footer stone.
- Perf budget (baru): TTI < 3.5s 4G, scroll ≥50fps selama scrub, JS animasi tidak menyentuh properti layout (`transform`/`opacity` saja), image `loading=lazy` + dimensi eksplisit (cegah CLS), font `display=swap` (sudah).
- Cleanup: tiap `useEffect` GSAP harus `ctx.revert()` / `trigger.kill()` + `lenis.destroy()` / `cancelAnimationFrame`. Kebocoran ScrollTrigger adalah bug P0.
- jsdom guards (`matchMedia`, `ResizeObserver`, `scrollIntoView`) mengikuti preseden kode — pertahankan agar `vitest` tidak pecah.

---

## 8. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `>=1200px` | Full: nav rail, hero ~11rem max (clamp, bukan 12vw mentah — cegah overflow ultrawide), arsenal 2×2, Phase 2 horizontal (jika diaktifkan) |
| `1000-1199px` | Nav rail hidden, hero scales via `clamp()`, arsenal 2×2 |
| `768-999px` | Phase 2 nonaktif → grid vertikal; 2-kolom → 1 kolom; pin creed nonaktif |
| `<768px` | Single column; hero `clamp(3rem, 14vw, 5rem)`; form stack; ember count ≤20; walls = horizontal divider |

Gunakan `clamp()` untuk display type, bukan `vw` murni (spec lama `~12vw` pecah di 320px dan 2560px).

---

## 9. Verification Plan

### Automated
- `npm run build` — no TS/bundling errors.
- `npm run lint` — no violations (termasuk `react-hooks/exhaustive-deps` pada efek GSAP/Lenis).
- `npm test` (script = `vitest run`) — suite dark-fantasy hijau: shell mode toggle, nav rail select, modal open/close + Escape, form mailto encoding, reduced-motion guard. (File test ada: `dark-fantasy-shell`, `campaigns-section`, `creed-section`, `hero-section`, `smooth-scroll`, `vision-summon`, `tactical-hud`, `dark-fantasy-data` — pastikan assertion-nya mencakup daftar ini, bukan sekadar render.)
- Tambah test baru untuk: `TextScramble` resolve, `useReducedMotion`, Phase 2 fallback (<1000px → grid), `wallZone` mapping tidak merusak Phase 1.

### Manual (dengan acceptance criteria)
- [ ] Scroll fluid penuh 6 section: semua reveal trigger sekali, tanpa flicker/pin tertinggal.
- [ ] Phase 2 (jika aktif): 3 breach berurutan, kartu bisa dibuka via mouse + keyboard, tutup via Escape/outside.
- [ ] `Escape` menutup modal + fokus kembali ke kartu pemicu.
- [ ] Mobile 360px: tidak ada horizontal overflow (`overflow-x` check), form submit dengan REPORT 2000 char tidak pecah.
- [ ] `prefers-reduced-motion`: tidak ada pin/parallax/partikel/counter; konten langsung terbaca.
- [ ] Lenis anchor `#creed/#arsenal/#campaigns/#vision/#summon` smooth-scroll tepat di bawah header (offset header).
- [ ] Perf tab: scrub Campaigns ≥50fps, tidak ada forced reflow (layout shift ungu).
- [ ] Kontras footer + badge lolos cek manual (devtools contrast).

### Non-goals (baru — cegah scope creep)
- Backend form / API pengiriman email. Tetap `mailto:`.
- Three.js / WebGL walls. Tetap CSS/SVG.
- Migrasi Tailwind v4 / rename komponen massal. Tidak dalam spec ini.

---

## 10. Risiko (baru)

1. **Pin + Lenis desync** → mitigasi pola §2.2 + `invalidateOnRefresh`. Jika tetap jank di low-end, Phase 2 dimatikan via feature flag, grid tetap jalan.
2. **500vw track boros memori** → batasi fragmen debris (≤12/wall), gambar lazy, tidak ada `backdrop-blur` full-track.
3. **Drift data vs spec** (callsign, stats) → kunci di §6; perubahan copy tidak boleh memecahkan test snapshot tanpa update test.
4. **Ganda Lenis** → larangan §2.2; review wajib menolak Lenis baru di luar `SmoothScroll.tsx`.
