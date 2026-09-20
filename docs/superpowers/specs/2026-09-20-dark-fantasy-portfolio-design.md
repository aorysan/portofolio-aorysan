# Dark Fantasy Portfolio Design Spec: Beyond The Walls

## Overview

Transform the existing gamified expedition dossier portfolio into a cinematic **Dark Fantasy** single-page portfolio inspired by the "Survey Corps of Software" theme. The site will be a vertically-scrollable landing page with Lenis smooth scrolling, GSAP ScrollTrigger-driven cinematic animations, Anime.js micro-interactions, and an interactive **Three Walls horizontal journey** for the projects section.

**Theme**: Dark, atmospheric, medieval-military aesthetic. Every UI element carries the metaphor of a fortified world — walls to breach, expeditions to undertake, and territories to map.

**Target**: Replace the current `DossierShell` entry point with a new `DarkFantasyShell` that renders all sections as a continuous scroll experience.

---

## 1. Design Tokens & Typography

### 1.1 Color Palette (CSS custom properties in `@theme`)

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

### 1.2 Typography (Google Fonts `@import`)

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | `Cinzel` | 400, 600, 700, 900 | Hero headline, section quotes, stats numbers |
| Military | `Oswald` | 300, 400, 500, 600, 700 | Section labels, nav items, badges, form labels, footer |
| Body | `Barlow` | 300, 400, 500, 600 | Paragraphs, descriptions, form inputs |

### 1.3 Global Styles

- `background-color: var(--color-ash)`
- `color: var(--color-bone)`
- `font-family: var(--font-body)` (Barlow)
- `-webkit-font-smoothing: antialiased`
- `overflow-x: hidden`
- `::selection { background: var(--color-blood) }`
- Hidden scrollbar by default, visible on scroll (CSS `::-webkit-scrollbar` with `--color-stone`)

---

## 2. Architecture & Component Tree

```
App.tsx
└── ThemeProvider (forced dark)
    └── DarkFantasyShell
        ├── LenisProvider (smooth scroll wrapper)
        ├── DFHeader (fixed top HUD bar)
        ├── DFNavRail (fixed right-side vertical nav)
        ├── EmberCanvas (full-viewport 2D particle background)
        ├── <main>
        │   ├── DFHero (#home)
        │   ├── DFCreed (#creed)
        │   ├── DFArsenal (#arsenal)
        │   ├── DFCampaigns (#campaigns) — Three Walls Journey
        │   ├── DFVision (#vision)
        │   └── DFSummon (#summon)
        ├── DFFooter
        └── DossierLightbox (portal modal for project details)
```

### 2.1 New Files

| File | Purpose |
|------|---------|
| `src/components/darkfantasy/DarkFantasyShell.tsx` | Root shell: Lenis, header, nav rail, ember canvas, sections |
| `src/components/darkfantasy/DFHeader.tsx` | Fixed top HUD: logo, reg number, audio toggle |
| `src/components/darkfantasy/DFNavRail.tsx` | Fixed right-side vertical section indicators |
| `src/components/darkfantasy/DFHero.tsx` | Hero: "BEYOND THE WALLS" + scroll indicator |
| `src/components/darkfantasy/DFCreed.tsx` | Manifesto: pinned word reveal + stats |
| `src/components/darkfantasy/DFArsenal.tsx` | 2x2 skill cards with SVG sigils |
| `src/components/darkfantasy/DFCampaigns.tsx` | Three Walls horizontal journey (pinned) |
| `src/components/darkfantasy/DFVision.tsx` | Parallax quote + 3 horizon goals |
| `src/components/darkfantasy/DFSummon.tsx` | Contact form + dispatch details |
| `src/components/darkfantasy/DFFooter.tsx` | Footer bar |
| `src/components/darkfantasy/EmberCanvas.tsx` | 2D canvas particle system (floating embers) |
| `src/components/darkfantasy/DossierLightbox.tsx` | Modal for expanded project details |
| `src/components/darkfantasy/WallBreach.tsx` | Wall breach crack + debris animation component |
| `src/components/darkfantasy/TextScramble.tsx` | Reusable text decode/scramble effect |
| `src/hooks/useScrollReveal.ts` | Hook: IntersectionObserver + GSAP/Anime reveal |
| `src/hooks/useLenisScroll.ts` | Hook: access Lenis instance, scrollTo, progress |
| `src/hooks/useTextSplit.ts` | Hook: split text into span-wrapped letters/words for animation |
| `src/lib/darkFantasyData.ts` | Centralized content data adapted for Aryo's profile |

### 2.2 Modified Files

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Replace `DossierShell` with `DarkFantasyShell` |
| `src/components/SmoothScroll.tsx` | Implement real Lenis initialization |
| `src/index.css` | Replace/extend theme tokens with dark fantasy palette |
| `src/App.tsx` | Minimal — routing stays, Lenis wrapper moves into shell |

### 2.3 Preserved Files

All existing `dossier/`, `gamified/`, `portfolio/` components remain untouched (not deleted). Only the entry point in `Index.tsx` changes. This allows reverting if needed.

---

## 3. Section Designs

### 3.1 DFHeader (Fixed Top HUD)

- **Position**: `fixed`, top, full width, `z-index: 50`
- **Background**: transparent → `var(--color-ash)` with blur on scroll (via Lenis scroll callback)
- **Left**: `A.PUTRO` — font Oswald 500, letter-spacing `0.3em`, color `--color-parchment`
- **Right**: `PORTFOLIO — REG. NO. 104` — font Oswald 400, color `--color-parchment` at 50% opacity
- **Audio toggle**: Volume icon (lucide), toggles `TactileSoundManager` mute state

### 3.2 DFNavRail (Fixed Right-Side Navigation)

- **Position**: `fixed`, right side, vertically centered, `z-index: 40`
- **Items**: Vertical list of section indicators:
  - `00 // HOME`
  - `01 // CREED`
  - `02 // ARSENAL`
  - `03 // CAMPAIGNS`
  - `04 // VISION`
  - `05 // SUMMON`
- **Style**: Font Oswald 300, rotated 90deg (`writing-mode: vertical-rl`), letter-spacing wide
- **Active state**: Current section text color changes `--color-parchment` → `--color-ember`, dot indicator glows
- **Detection**: IntersectionObserver on each section, updates active index
- **Hidden on mobile**: `display: none` below ~1000px breakpoint

### 3.3 DFHero (`#home`)

**Content:**
- Subtitle badge: `— SURVEY CORPS OF SOFTWARE` (Oswald, `--color-ember`, with horizontal rule left)
- Headline line 1: `BEYOND` — Cinzel 900, ~12vw, `--color-bone`, solid fill
- Headline line 2: `THE WALLS` — Cinzel 900, ~12vw, `--color-bone` at ~20% opacity OR `-webkit-text-stroke` outline effect (semi-transparent, ghostly)
- Sub-paragraph: *"I am a frontend engineer who builds interfaces for a world that keeps trying to end. Where others see the horizon as a boundary, I read it as a brief."* — Barlow 300, `--color-parchment`, max-width 600px
- Scroll indicator (bottom center): Chevron-down icon + `ADVANCE` (Oswald, letter-spacing wide)
- Quote (bottom right): *"IF WE DON'T FIGHT, WE CAN'T WIN." — THE ONLY DOCTRINE THAT EVER SHIPPED.* — Barlow italic, `--color-parchment` at 40% opacity, small text

**Animations:**
1. **Letter Carving Reveal** (GSAP): Each letter of "BEYOND" and "THE WALLS" enters from below with `clipPath: inset(100% 0 0 0)` → `inset(0%)`, stagger 0.04s, easing `power4.out`, total ~1.2s
2. **Subtitle Slide** (GSAP): Badge slides from left `x: -30 → 0`, `opacity: 0 → 1`, delay after headline
3. **Sub-paragraph Fade** (GSAP): `y: 20 → 0`, `opacity: 0 → 1`, delay 800ms
4. **Parallax Fog Layers** (GSAP ScrollTrigger scrub): 3 semi-transparent gradient divs move at different `yPercent` speeds on scroll
5. **Hero Recession** (GSAP ScrollTrigger scrub): As user scrolls past hero, headline `scale: 1 → 0.85`, `opacity: 1 → 0`
6. **Scroll Indicator Bounce** (Anime.js): `translateY` oscillation, infinite loop, `easeInOutSine`
7. **Cursor Magnetic Pull** (GSAP `quickTo`): "ADVANCE" button subtly follows cursor position

### 3.4 DFCreed (`#creed`)

**Content:**
- Section header: `01 — THE CREED` (Oswald)
- Main quote (large): *"I DEDICATE MY HEART TO INTERFACES THAT REFUSE TO FALL — BUILT WITH THE DISCIPLINE OF A SOLDIER AND THE RESTRAINT OF A CARTOGRAPHER."* — Cinzel 400 italic, ~2.5rem, `--color-bone`
- Two-column narrative (asymmetric grid):
  - Left: *"For two years I've operated at the front line of product engineering, turning impossible briefs into shipped territory. My work lives where design ambition meets the brutal constraints of the real: latency, scale, and the human on the other side of the screen who is very tired."*
  - Right: *"I believe an interface is a fortification — every component a wall, every interaction a gate that must hold. I build slowly enough to be certain, and fast enough to matter. Nothing ships that I would not defend."*
  - Font Barlow 300/400, `--color-parchment`, line-height 1.8
- Stats row (3-column grid):
  - `2+` YEARS ENLISTED
  - `6+` SYSTEMS FIELDED
  - `∞` WALLS BREACHED
  - Numbers: Cinzel 700, ~4rem, `--color-bone`. Labels: Oswald uppercase, `--color-parchment`

**Animations:**
1. **Pinned Word-by-Word Reveal** (GSAP ScrollTrigger `pin + scrub`): Section is pinned. Each word of the main quote transitions from `opacity: 0.15` → `opacity: 1` progressively as user scrolls. Like ink appearing on parchment.
2. **Section Header Decode** (Anime.js): "01 — THE CREED" text scrambles from runic characters and resolves, ~500ms
3. **Paragraph Columns Fade** (GSAP): Left column `y: 30 → 0, opacity: 0 → 1`, right column follows with 200ms delay
4. **Hairline Border Draw** (GSAP): Divider lines `scaleX: 0 → 1, transformOrigin: left`
5. **Stats Counter Roll** (GSAP): Numbers animate count-up from 0 (slot-machine style). Infinity symbol fades in directly.

### 3.5 DFArsenal (`#arsenal`)

**Content:**
- Section header: `02 — THE ARSENAL` (Oswald)
- Intro text (right-aligned): *"Four disciplines, sharpened over a career of sieges. Hover to bring each blade to the light."* — Barlow 300, `--color-parchment`
- 2x2 grid of skill cards:

| Card | Number | Title | Description | Sigil |
|------|--------|-------|-------------|-------|
| I | `/ I` | FRONTEND VERTICAL MANEUVER | React, Next.js, TypeScript, TailwindCSS — built to strike fast and hold ground under load. | Shield/Home icon |
| II | `/ II` | SYSTEMS & ARCHITECTURE | Node.js, Express, Firebase, PostgreSQL — component fortresses that survive the breach of scale. | Fortress icon |
| III | `/ III` | INTERFACE RECONNAISSANCE | Git, Vercel, Figma, Unity — mapping the terrain before the assault. | Crosshair/Globe icon |
| IV | `/ IV` | PERFORMANCE WARFARE | GSAP, Lenis, Anime.js, Core Web Vitals — sharpened to a killing edge. | Lightning icon |

- Card style: Background `--color-soot`, hairline border `--color-stone`, padding generous

**Animations:**
1. **Card Forge Entrance** (GSAP ScrollTrigger): Cards enter from `scale: 0.9, opacity: 0, filter: brightness(0.3)` → full, stagger 0.2s
2. **SVG Stroke Draw** (GSAP `strokeDashoffset`): Sigil icons draw themselves stroke-by-stroke as cards enter
3. **Section Header Decode** (Anime.js): Same runic scramble resolve as other headers
4. **Hover — Ember Underline** (Anime.js): `scaleX: 0 → 1` ember-colored line from left on hover
5. **Hover — Sigil Glow** (Anime.js): SVG fill transitions `--color-stone` → `--color-ember`
6. **Hover — Text Scramble** (Anime.js): Card title scrambles briefly then resolves on hover

### 3.6 DFCampaigns (`#campaigns`) — The Three Walls Journey

This is the centerpiece interactive section. A GSAP ScrollTrigger-pinned horizontal journey through three concentric walls, from inside (oldest projects) to outside (newest + upcoming).

**Camera Direction**: The viewport faces OUTWARD. You start inside Mitras (center), looking toward the walls. As you scroll, you advance outward through each wall toward the unknown territory beyond.

**Horizontal Layout** (total width ~500vw, pinned and scrubbed):

```
|-- Mitras Zone --|-- Wall Sina --|-- Rose Zone --|-- Wall Rose --|-- Maria Zone --|-- Wall Maria --|-- Beyond Zone --|
    (oldest)         BREACH!         (mid)           BREACH!         (newest)          BREACH!        (incoming)
   FrameWork                        SarPras                        KampungKu                        "Expedition
    Jawara                          TrasMart                     Rest Area Tycoon                   in progress..."
```

**Visual Composition:**

1. **Mitras Zone** (inside Wall Sina):
   - Background: `--color-soot` with faint radial glow from center (safe interior)
   - Zone label: `MITRAS — INNER SANCTUM` (Oswald, faded)
   - Project cards as glowing beacons/outposts
   - Atmosphere: relatively calm, dim interior lighting

2. **Wall Sina** (first barrier):
   - Visual: Tall vertical structure spanning full viewport height, textured stone pattern (CSS gradient or SVG), color `--color-iron` / `--color-stone`
   - Label on wall: `WALL SINA` (Cinzel, large, carved into stone)
   - Gate label: `GATE: HERMIHA` (Oswald, small)
   - **Breach animation** (GSAP): As scroll reaches the wall:
     - Crack lines appear (SVG paths animate `strokeDashoffset`)
     - Wall fragments break apart (child divs with `rotation`, `x`, `y` scatter via GSAP)
     - Debris particles fall (small rect elements animated by GSAP stagger)
     - Brief flash of `--color-ember` light through the cracks
     - Wall clears, revealing the next zone

3. **Rose Zone** (between Sina and Rose):
   - Background: slightly different shade, atmospheric particles increase
   - Zone label: `DISTRICT TROST — ROSE TERRITORY`
   - Project cards with more detail (tags visible)

4. **Wall Rose** (second barrier):
   - Same breach mechanic, label `WALL ROSE`, gate `GATE: TROST`
   - Breach feels more intense (more debris, louder crack sound if audio enabled)

5. **Maria Zone** (between Rose and Maria):
   - Background darker, more ember particles, tension builds
   - Zone label: `DISTRICT SHIGANSHINA — MARIA TERRITORY`
   - Newest/biggest project cards (more prominent styling)

6. **Wall Maria** (final barrier):
   - Largest wall, most dramatic breach
   - Label `WALL MARIA`, gate `GATE: SHIGANSHINA`
   - Breach: maximum debris, flash, rumbling effect (subtle CSS translate shake on container)

7. **Beyond the Walls** (Titan Territory):
   - Background transitions to dense fog: CSS gradient from `--color-ash` to `--color-verdigris` hints, heavy blur overlay
   - No clear project cards — instead:
     - 1-2 mysterious markers pulsing/glitching: `⟐ EXPEDITION IN PROGRESS`
     - Sub-text: *"The territory ahead hasn't been mapped yet."* (Barlow italic, faded)
     - Ember particles replaced by slower, colder fog particles
     - Eerie atmosphere — the unknown ahead

**Project Cards (within zones):**
- Background: `--color-iron` with hairline border `--color-stone`
- Title: Cinzel 600, `--color-bone`
- Role/era badge: Oswald uppercase, `--color-ember`
- Tech tags: small pills, border `--color-stone`, font Oswald
- Thumbnail: grayscale by default, subtle color on hover
- **Hover**: Card lifts (`translateY: -4px`), border glows `--color-ember`, thumbnail gains color
- **Click**: Opens `DossierLightbox` with full project details

**DossierLightbox (project detail modal):**
- Fullscreen overlay, background `--color-ash` at 95% opacity
- Content panel: project title (Cinzel), role, tech stack badges, narrative description, screenshot, links (GitHub, live)
- **Reveal**: GSAP `fromTo` slide-up (`y: 100 → 0`), `opacity: 0 → 1`, easing `power3.out`, 500ms
- **Dismiss**: `Escape` key or click outside. Reverse animation on close.

**Mobile Responsive:**
- Below ~1000px: horizontal journey converts to vertical stacking
- Each zone stacks vertically, walls become horizontal barriers that crack on scroll-reveal
- Project cards stack in single column

### 3.7 DFVision (`#vision`)

**Content:**
- Section header: `04 — FUTURE VISION` (Oswald, `--color-ember`)
- Background: full-bleed dark atmospheric gradient (storm/mist effect), parallax movement
- Main quote (center, Cinzel):
  > SOMEDAY I WILL REACH **THE SEA** — AND FIND, BEYOND IT, ONLY MORE WORK.
  
  "THE SEA" highlighted in `--color-ember`, rest in `--color-bone`
- Sub-paragraph (center, Barlow 300, `--color-parchment`):
  > My ambition isn't a finished product. It's a horizon that keeps receding: interfaces that anticipate intent, systems that heal themselves, tooling that lets a single engineer defend an entire wall. I'm building toward a craft where speed and humanity stop being a trade-off.
- Three horizon goals (3-column grid, hairline divider above each):
  - `NEXT` — *"Ship an AI-native interface framework"*
  - `BEYOND` — *"Mentor the next scouting regiment"*
  - `ALWAYS` — *"Refuse the comfort of the wall"*

**Animations:**
1. **Horizontal Text Parallax** (GSAP ScrollTrigger scrub): Quote lines move at different horizontal speeds on scroll
2. **Storm Intensification** (GSAP ScrollTrigger scrub): Background overlay opacity increases as user scrolls deeper
3. **Horizon Cards Stagger** (GSAP): Fade-in from bottom, stagger 150ms, divider lines draw themselves
4. **Section Header Decode** (Anime.js): Same runic scramble

### 3.8 DFSummon (`#summon`)

**Content:**
- Section header: `05 — SUMMON` (Oswald, `--color-ember`)
- CTA headline: *"SOUND THE HORN."* — Cinzel 700, massive (~6rem), `--color-bone`
- Sub-text: *"A new expedition, a stalled system, or a wall that needs rebuilding — send word. I answer every signal fired in earnest."* — Barlow 300, `--color-parchment`
- Contact form (right side):
  - `NAME` — placeholder: "Levi Ackerman"
  - `CALLSIGN / EMAIL` — placeholder: "you@corps.dev"
  - `OBJECTIVE` — placeholder: "What wall are we taking?"
  - `REPORT` (textarea) — placeholder: "Describe the terrain, the threat, and the timeline."
  - Labels: Oswald uppercase, letter-spacing wide, `--color-parchment`
  - Inputs: transparent background, border-bottom `--color-stone`, color `--color-bone`
  - Button: `DISPATCH THE REPORT →` — background `--color-blood`, border `--color-blood`, Oswald uppercase. Hover: bg → `--color-ember`, slight scale up.
- Dispatch details (left, below CTA):
  - `DISPATCH` — `aryoadiputro@gmail.com`
  - `STATION` — `Malang — East Java, Indonesia`
  - `REGIMENT` — `Available for Opportunities`
- Submitted state: form replaced with confirmation message *"Signal received. Expect a response from beyond the wall."*

**Animations:**
1. **"SOUND THE HORN" Shockwave** (GSAP): Text enters with `scale: 1.05 → 1`, `opacity: 0 → 1`, brief ember flash on background
2. **Form Fields Rise** (GSAP ScrollTrigger): Staggered `y: 40 → 0`, `opacity: 0 → 1`, border-bottom draws `scaleX: 0 → 1`
3. **Button Hover Pulse** (Anime.js): Border color oscillates `--color-blood` ↔ `--color-ember` on loop

### 3.9 DFFooter

- Hairline divider `--color-stone` on top
- Left: `A.PUTRO — DEDICATE YOUR HEART` (Oswald, `--color-stone`)
- Right: `© 2026 · BUILT BEYOND THE WALLS` (Oswald, `--color-stone`)
- Minimal padding, font size small

---

## 4. Ember Canvas Particle System

**Component**: `EmberCanvas.tsx`

- Full-viewport `<canvas>` element, positioned `fixed`, `z-index: 1`, `pointer-events: none`
- 30-50 particles representing floating embers/ash
- Each particle: small circle (1-3px radius), color randomly chosen from `--color-ember`, `--color-blood`, `--color-rust`
- Behavior: drift upward slowly, slight horizontal sway (sine wave), random opacity (0.2-0.6), random lifespan with fade-out and respawn
- Rendered via `requestAnimationFrame` loop, synced with Lenis scroll position for subtle parallax
- Performance: lightweight, no heavy computation, skip if `prefers-reduced-motion` is set

---

## 5. Lenis Smooth Scroll Integration

**Implementation**: Replace the current no-op `SmoothScroll.tsx` with a real Lenis wrapper.

- Initialize `Lenis` instance with:
  - `duration: 1.2`
  - `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
  - `smoothWheel: true`
  - `wheelMultiplier: 1`
- Sync with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
- Provide `useLenisScroll()` hook for components to access `lenis.scrollTo(target)` and current scroll progress
- Pause Lenis when `DossierLightbox` is open (prevent background scroll)

---

## 6. Data Adaptation (`darkFantasyData.ts`)

Centralized content file mapping Aryo Adi Putro's actual data to the dark fantasy theme:

| Data | Value |
|------|-------|
| `callsign` | `A.PUTRO` |
| `regNumber` | `REG. NO. 104` |
| `role` | `FULL STACK DEVELOPER` |
| `subtitleBadge` | `SURVEY CORPS OF SOFTWARE` |
| `headline` | `BEYOND / THE WALLS` |
| `heroSubtext` | Adapted from Figma |
| `creedQuote` | Adapted manifesto |
| `creedNarrativeLeft` | Adapted for 2+ years experience |
| `creedNarrativeRight` | Adapted philosophy |
| `stats` | `{ years: '2+', systems: '6+', walls: '∞' }` |
| `arsenalCards` | 4 categories mapped from `TECH_ARSENAL` |
| `campaigns` | `MISSIONS_DATA` mapped to wall zones |
| `visionQuote` | From Figma |
| `horizonGoals` | NEXT, BEYOND, ALWAYS |
| `dispatch` | email, station (Malang), regiment |
| `footer` | `A.PUTRO — DEDICATE YOUR HEART` |

### Wall Zone Mapping

| Wall Zone | Projects (from `MISSIONS_DATA`) |
|-----------|--------------------------------|
| **Mitras** (inside Sina) | FrameWork (2022), Jawara (2022) |
| **Rose Territory** (Sina-Rose) | SarPras (2023), TrasMart (2023) |
| **Maria Territory** (Rose-Maria) | KampungKu (2024), Rest Area Tycoon (2024) |
| **Beyond the Walls** | Incoming marker(s) |

---

## 7. Accessibility & Performance

- All animations respect `prefers-reduced-motion`: reduced to simple fade-in/out, no pinning, no particles
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- All interactive elements have `aria-label` and keyboard navigation
- Focus management in `DossierLightbox` (trap focus, restore on close)
- Ember canvas skipped entirely for reduced-motion users
- GSAP ScrollTrigger cleanup on unmount (prevent memory leaks)
- Images lazy-loaded with `loading="lazy"`
- Font display: `swap` for all Google Fonts

---

## 8. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `>=1200px` | Full experience: nav rail visible, hero text ~12vw, 2x2 arsenal grid, horizontal campaigns journey |
| `1000-1199px` | Nav rail hidden, hero text scales down, arsenal 2x2 maintained |
| `768-999px` | Campaigns converts to vertical stacking, 2-column layouts become single column |
| `<768px` | Full mobile: single column everything, hero text ~10vw min, form fields stack, campaigns vertical with horizontal wall breaches |

---

## 9. Verification Plan

### Automated
- `npm run build` — no TypeScript or bundling errors
- `npm run lint` — no linting violations
- Existing `vitest` tests still pass

### Manual
- Visual inspection of all 6 sections in Chrome, Firefox, Safari
- Scroll through entire page verifying all GSAP animations trigger correctly
- Test Three Walls journey: scroll through all breaches, click project cards, open/close lightbox
- Test `Escape` key dismisses lightbox
- Test mobile viewport (Chrome DevTools responsive mode)
- Verify `prefers-reduced-motion` fallback
- Verify Lenis smooth scroll and anchor navigation (`#creed`, `#arsenal`, etc.)
- Performance check: 60fps during scroll and animations (Chrome DevTools Performance tab)
