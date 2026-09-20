# Dark Fantasy Portfolio Design Specification: Beyond The Walls

- **Date**: 2026-09-20
- **Author**: Aryo Adi Putro & Antigravity
- **Target Repository**: `portofolio-aorysan`
- **Branch**: `aot-design`
- **Status**: Validated Design (Ready for Implementation Planning)

---

## 1. Executive Summary

This specification outlines the complete transformation of the portfolio into a **Cinematic Dark Fantasy / Attack on Titan ("Survey Corps of Software")** web experience based on the user's Figma Make design. 

The website adopts the monumental visual identity **"BEYOND THE WALLS"**, featuring custom typography, a volcanic ash and blood-ember color palette, audio-tactile feedback, and high-performance motion orchestration powered by **Lenis** (smooth scrolling) and **Anime.js** (cinematic reveals and particle simulation).

Crucially, the application supports **Dual-Mode Navigation**:
1. **Fluid Scroll Mode (Default)**: Free-flowing continuous inertial scrolling with Lenis.
2. **Chapter Snap Mode**: Viewport-locked cinematic presentation deck (`100vh` per section) navigable via mouse wheel, touch swipe, and arrow keys.

---

## 2. Design System & Tokens

### 2.1 Typography
Imported via Google Fonts in `src/index.css`:
- **Display / Monolith Headings**: `'Cinzel', serif` (Weights: 400, 600, 700, 900)
- **Military Badges & Subheadings**: `'Oswald', sans-serif` (Weights: 300, 400, 500, 600, 700)
- **Body & Tactical Copy**: `'Barlow', sans-serif` (Weights: 300, 400, 500, 600)

### 2.2 Color Palette Tokens
Defined as CSS variables on `:root` and Tailwind utility classes:
- `--color-ash`: `#0a0908` — Void black background of the outer territory
- `--color-soot`: `#12100e` — Deep soot surface for elevated panels
- `--color-iron`: `#1c1a17` — Fortified card backgrounds and containers
- `--color-stone`: `#2a2723` — Hairline grid dividers and borders
- `--color-bone`: `#d6cfc2` — Primary legible ivory text
- `--color-parchment`: `#b7ad99` — Muted narrative copy and labels
- `--color-blood`: `#7c1f1a` — Deep crimson accent for hover states & selection
- `--color-ember`: `#b4442e` — Molten orange-red accent for glowing sigils and active underlines
- `--color-rust`: `#8a4b2b` — Weathered bronze/rust borders
- `--color-verdigris`: `#4d6155` — Scout cloak green/teal accent

---

## 3. Architecture & Shell Structure

```
src/
├── components/
│   ├── dark-fantasy/
│   │   ├── DarkFantasyShell.tsx      # Dual-mode container & scroll orchestrator
│   │   ├── TacticalHeader.tsx        # "Aryo A.P", Mode Toggle, Audio Mute
│   │   ├── NavRail.tsx               # Fixed right-side 00-05 indicator
│   │   ├── EmberCanvas.tsx           # 2D particle canvas for drifting ash & embers
│   │   ├── HeroSection.tsx           # "BEYOND THE WALLS" + Anime.js text reveal
│   │   ├── CreedSection.tsx          # 01 — THE CREED + 2-col narrative + stats
│   │   ├── ArsenalSection.tsx        # 02 — THE ARSENAL (4-quadrant hairline grid)
│   │   ├── CampaignsSection.tsx      # 03 — CAMPAIGNS (The Wall + 6 project districts)
│   │   ├── CampaignDossierModal.tsx  # Esc-dismissable modal lightbox
│   │   ├── VisionSection.tsx         # 04 — FUTURE VISION (Parallax & horizon goals)
│   │   ├── SummonSection.tsx         # 05 — SUMMON (Interactive form & dispatch)
│   │   └── DarkFantasyFooter.tsx     # "DEDICATE YOUR HEART" + Copyright
│   └── SmoothScroll.tsx              # Lenis smooth scroll provider
├── lib/
│   └── dark-fantasy-data.ts          # Centralized narrative & project data
└── pages/
    └── Index.tsx                     # Mounts DarkFantasyShell
```

---

## 4. Component Details & Behavior

### 4.1 Tactical Header & HUD (`TacticalHeader.tsx`)
- **Callsign (Left)**: `A R Y O   A . P` (with subtle tracking and serif styling).
- **Controls (Center)**:
  - **Mode Toggle Button**: `[ FLUID SCROLL ⇄ CHAPTER SNAP ]` with active mode glowing in `--color-ember`.
  - **Tactile Audio Toggle**: Icon button triggering `useTactileSound` (mute / un-mute) with click sound feedback.
- **Regiment Marker (Right)**: `PORTFOLIO — REG. NO. 104` with a pulsing green `--color-verdigris` status dot (`STATUS: COMBAT READY`).

### 4.2 Hero Section (`HeroSection.tsx`)
- **Top Tagline**: `— SURVEY CORPS OF SOFTWARE` with crimson hairline.
- **Monumental Headline**:
  - Top word: **`BEYOND`** in solid Cinzel font (`--color-bone`).
  - Bottom word: **`THE WALLS`** with a hollow/outlined stroke treatment matching the exact Figma Make design.
- **Narrative Subtitle**:
  > *"I am a full stack engineer who builds interfaces for a world that keeps trying to end. Where others see the horizon as a boundary, I read it as a brief."*
- **Call to Action**:
  - `ADVANCE ↓` button scrolling smoothly to `#creed`.
  - Right-aligned doctrinal quote: *"IF WE DON'T FIGHT, WE CAN'T WIN." — THE ONLY DOCTRINE THAT EVER SHIPPED.*
- **Anime.js Integration**:
  - Staggered letter-by-letter / line reveal on entry using `anime.timeline()`.

### 4.3 Ember Particle Background (`EmberCanvas.tsx`)
- Lightweight HTML5 2D Canvas fixed to the background.
- Emits ~35-50 slow-moving ash and glowing ember particles with slight horizontal turbulence, upward drift, and gentle opacity pulsing.
- Automatically pauses when out of viewport or when reduced motion is preferred (`prefers-reduced-motion: reduce`).

### 4.4 The Creed Section (`CreedSection.tsx`)
- **Identifier**: `01 — THE CREED`
- **Monolith Statement**:
  > *"I DEDICATE MY HEART TO INTERFACES THAT REFUSE TO FALL — BUILT WITH THE DISCIPLINE OF A SOLDIER AND THE RESTRAINT OF A CARTOGRAPHER."*
- **Two-Column Asymmetric Narrative**:
  - **Left (Frontline Engineering)**: Operating at the front line of product engineering, navigating real-world constraints: latency, scale, and the exhausted user on the other side of the screen.
  - **Right (Interface as Fortification)**: Treating every component as a wall and every interaction as a gate that must hold.
- **Enlisted Record Metrics**:
  - `02+` YEARS ENLISTED
  - `06+` SYSTEMS FIELDED
  - `100%` MISSION RELIABILITY
  - Military seal avatar featuring Aryo Adi Putro.

### 4.5 The Arsenal (`ArsenalSection.tsx`)
- **Identifier**: `02 — THE ARSENAL`
- **Subtitle**: *"Four disciplines, sharpened over a career of sieges. Hover to bring each blade to the light."*
- **Hairline Grid Layout (2x2 Quad)** with `--color-stone` borders:
  1. `/ I FRONTEND VERTICAL MANEUVER` (Sigil: Dual Blades)
     - Stack: React, Next.js, TypeScript, TailwindCSS, Anime.js, Lenis.
     - Copy: *"Motion systems and robust SPAs built to strike fast and hold ground under load."*
  2. `/ II SYSTEMS & ARCHITECTURE` (Sigil: Fortified Gate)
     - Stack: Node.js, Express, Firebase, PostgreSQL, RESTful APIs.
     - Copy: *"Design tokens, component fortresses, and state machines that survive the breach of scale."*
  3. `/ III INTERFACE RECONNAISSANCE` (Sigil: Precision Reticle)
     - Stack: UI/UX Wireframing, Figma Systems, Accessibility Audits, Responsive Cartography.
     - Copy: *"Research, accessibility discipline, and interaction design mapping terrain before deployment."*
  4. `/ IV PERFORMANCE WARFARE` (Sigil: Thunderbolt Spark)
     - Stack: Vite Bundler discipline, Core Web Vitals optimization, Git CI/CD, Unity C#.
     - Copy: *"Rendering budgets, bundle discipline, and frame rates sharpened to a razor edge."*
- **Hover Micro-interaction**: Custom Anime.js or CSS transition drawing an ember line along the card base and lifting the sigil.

### 4.6 Campaigns / The Wall (`CampaignsSection.tsx`)
- **Identifier**: `03 — CAMPAIGNS` / Title: `THE WALL.`
- **All 6 Projects Included** mapped to Wall Districts & Fortifications:
  1. **KampungKu** (`[DISTRICT TROST]` · 2024) — Community management mobile platform (Flutter, Firebase, Cloudinary).
  2. **Rest Area Tycoon** (`[THE UNDERGROUND]` · 2024) — Simulation game jam project (Unity, C#, Itch.io).
  3. **TrasMart** (`[SHIGANSHINA]` · 2024) — Production e-commerce storefront (React, Tailwind, Vercel).
  4. **SarPras** (`[DISTRICT KARANES]` · 2024) — Resource & facilities check-in management system.
  5. **FrameWork** (`[WALL SINA]` · 2023) — Modular core architecture & clean code pattern exploration.
  6. **Jawara** (`[DISTRICT STOHESS]` · 2023) — Organizational operational management dashboard.
- **Grayscale-to-Blood Hover**: Cards rest in moody textured grayscale, transitioning to warm blood-crimson border glow on hover.
- **Dossier Lightbox (`CampaignDossierModal.tsx`)**:
  - Clicking any campaign opens a full tactical dossier lightbox.
  - Displays full mission briefing, technical role, key technologies, live demo button, and GitHub repository button.
  - Supports `Escape` key dismissal and outside-click close.

### 4.7 Future Vision (`VisionSection.tsx`)
- **Identifier**: `04 — FUTURE VISION`
- **Atmospheric Background**: Parallax storm cloud texture.
- **Title**:
  > *"SOMEDAY I WILL REACH **THE SEA** — AND FIND, BEYOND IT, ONLY MORE WORK."*
- **Horizon Goals**:
  - `NEXT`: Ship high-performance AI-augmented interface frameworks.
  - `BEYOND`: Architect distributed resilient open-source tools.
  - `ALWAYS`: Refuse the comfort of the wall (relentless craft & exploration).

### 4.8 Summon (`SummonSection.tsx`)
- **Identifier**: `05 — SUMMON` / Title: `SOUND THE HORN.`
- **Narrative**: *"A new expedition, a stalled system, or a wall that needs rebuilding — send word. I answer every signal fired in earnest."*
- **Interactive Form**:
  - Inputs: Name, Callsign / Email, Objective (`What wall are we taking?`), Report (`Describe the terrain, the threat, and the timeline.`).
  - Button: `DISPATCH THE REPORT →` with tactile click feedback and automatic fallback to `mailto:` with prefilled subject/body + toast notification.
- **Dispatch Coordinates**:
  - DISPATCH: `aryoadiputro@gmail.com`
  - STATION: `Malang, East Java — remote, worldwide`
  - REGIMENT: `Available for opportunities`
- **Social Links**: GitHub, LinkedIn, Itch.io.
- **Footer**: `ARYO A.P — DEDICATE YOUR HEART` · `© 2026 · BUILT BEYOND THE WALLS`.

---

## 5. Dual-Mode Scroll & Motion Mechanics

### 5.1 Fluid Scroll Mode
- Orchestrated by `lenis` configured with:
  ```ts
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });
  ```
- Section anchors (`#creed`, `#arsenal`, etc.) scroll via `lenis.scrollTo(targetElement)`.
- IntersectionObserver triggers entry reveals for sections as they enter the screen.

### 5.2 Chapter Snap Mode
- Locks window scroll (`overflow: hidden` on body or viewport container).
- Manages an `activeChapter` index `[0..5]` corresponding to each section.
- Wheel events (debounced), touchpad swipes, and Keyboard navigation (`ArrowDown`, `ArrowUp`, `PageDown`, `PageUp`, `Space`) trigger a smooth Anime.js transition to the next/previous chapter.
- Indicator dots on the right nav rail allow direct chapter jumping.

---

## 6. Accessibility & Performance Guardrails
- **Prefers-reduced-motion**: If active, disables ember canvas animation and sets all Anime.js durations to 0ms.
- **Keyboard Navigation**: All interactive elements (CTA buttons, form inputs, dossier modal, mode toggle) are fully focusable with standard keyboard tab order.
- **Mobile Responsive Breakpoint**: Seamless responsive layout collapsing the 2x2 Arsenal into a 1-column stack and adjusting font sizes dynamically below 1024px and 768px.

---

## 7. Verification Plan
1. **Visual Parity**: Verify font hierarchy (Cinzel, Oswald, Barlow) and color palette matches Figma Make inspect.
2. **Dual-Mode Functionality**: Verify toggling between Fluid Scroll (Lenis) and Chapter Snap works smoothly without glitch or scroll jumping.
3. **Animations**: Confirm Anime.js entrance stagger on Hero and particle canvas render at 60fps.
4. **All 6 Projects**: Verify all 6 project cards are present and open their respective dossier lightboxes.
5. **Summon Form**: Verify dispatch button interaction and toast feedback.
6. **Tests & Build**: Run `npm run build` and `npm run test` to verify zero TypeScript errors or regressions.
