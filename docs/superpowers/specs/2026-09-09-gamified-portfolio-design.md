# Gamified Portfolio — "VALKYRIE TERMINAL"

## Overview

Transform the existing portfolio (Vite + React + TypeScript + Tailwind + shadcn/ui) into a fully gamified, Honkai Impact 3–inspired sci-fi military HUD experience. The visitor enters through a boot sequence, lands on a HUD command-center dashboard, and interacts with portfolio content through game-themed panels: Pilot Dossier, Operations Log, Tech Arsenal, and Comms Relay.

**Core principle**: Gamified Shell + Keep Content. All existing data (projects, about info, tech stack, contact) stays. Only the UI layer and interaction patterns change.

### Visual Reference

A visual guide (`visual_guide.md`) exists as a reference with mockup images and design tokens. It captures the design direction and CSS specifics. Treat it as guidance material during implementation. The implementation should match the spec's intent, using the visual guide for tone and reference, not as a pixel-perfect target.

## Tech Stack (unchanged)

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: TailwindCSS 3 + shadcn/ui components (selectively used)
- **Animation**: GSAP (already installed), CSS animations
- **Audio**: Web Audio API (new — no extra dependency)
- **Routing**: react-router-dom (HashRouter, already installed)
- **Fonts**: Orbitron (headings — geometric, tactical), JetBrains Mono (terminal/data), Inter (body)

No new heavy dependencies. Web Audio API is native. Sound assets are small royalty-free files hosted in `/public/audio/`.

---

## Color Palette

Three-accent Cyberpunk HUD system (from ui-ux-pro-max database):

| Token               | Value       | Usage                              |
|----------------------|-------------|-------------------------------------|
| `--void`             | `#0A0A0F`   | Main background (deep void)        |
| `--card`             | `#12121A`   | Card/panel surfaces                |
| `--muted-bg`         | `#1C1C2E`   | Subtle bg differentiation          |
| `--border`           | `#2A2A3A`   | Default borders, dividers          |
| `--green`            | `#00FF88`   | Primary action, status, CTA        |
| `--cyan`             | `#00D4FF`   | Info, links, secondary highlight   |
| `--magenta`          | `#FF00FF`   | Tertiary, difficulty, stat bars    |
| `--gold`             | `#FFD700`   | Legendary rarity only              |
| `--destructive`      | `#FF3366`   | Errors, warnings                   |
| `--text`             | `#E0E0E0`   | Primary text                       |
| `--text-muted`       | `#94A3B8`   | Secondary text                     |
| `--text-dim`         | `#6B7280`   | Tertiary/disabled text             |

These map to Tailwind's existing CSS variable system. The current tokens will be remapped to these values. Theme is locked to dark.

---

## Architecture

### File Structure (new/modified files)

```
src/
├── components/
│   ├── gamified/                    # [NEW] All gamified UI components
│   │   ├── BootSequence.tsx         # System boot loading screen
│   │   ├── HUDDashboard.tsx         # Main dashboard layout + panels
│   │   ├── HUDNav.tsx               # Top HUD navigation bar
│   │   ├── CharacterProfile.tsx     # About → RPG character card
│   │   ├── MissionLog.tsx           # Projects → Mission list
│   │   ├── MissionCard.tsx          # Single mission/project card
│   │   ├── EquipmentInventory.tsx   # Tech stack → Inventory grid
│   │   ├── EquipmentCard.tsx        # Single inventory item
│   │   ├── CommsTerminal.tsx        # Contact → Terminal form
│   │   ├── GridBackground.tsx       # Sub-pixel grid background overlay
│   │   ├── GlitchText.tsx           # Reusable glitch text component
│   │   ├── StatBar.tsx              # Reusable stat/progress bar
│   │   ├── ChamferedPanel.tsx       # Reusable panel with clip-path chamfer
│   │   └── SoundManager.tsx         # Audio context provider + controls
│   ├── portfolio/                   # [KEEP] Existing files kept for data/reference
│   └── ui/                          # [KEEP] shadcn/ui components
├── hooks/
│   ├── useScrollAnimation.ts        # [KEEP]
│   ├── useSoundEffect.ts            # [NEW] Hook for playing SFX
│   └── useTypewriter.ts             # [NEW] Hook for typing animation
├── lib/
│   ├── constants.ts                 # [MODIFY] Add gamified constants, keep existing data
│   ├── sounds.ts                    # [NEW] Sound file paths + audio manager
│   └── utils.ts                     # [KEEP]
├── pages/
│   └── Index.tsx                    # [MODIFY] Swap to gamified layout
├── styles/
│   └── gamified.css                 # [NEW] All gamified-specific CSS (scanlines, glitch, glow)
└── index.css                        # [MODIFY] Update color tokens for sci-fi palette
```

### Routing

The existing single-page layout (scroll sections) changes to a **panel-based SPA**:

- `/` → Boot Sequence → HUD Dashboard (hero + clickable panels)
- Panel clicks open in-page sections/modals (no route change, state-driven)
- Smooth GSAP transitions between panel open/close

No new routes needed. The `HashRouter` with catch-all stays.

---

## Component Specifications

### 1. BootSequence.tsx

**Replaces**: `LoadingScreen.tsx` (current simple loading screen)

**Behavior**:
1. Full-screen black background
2. Terminal text appears line-by-line with typing effect (JetBrains Mono):
   ```
   [SYSTEM] Initializing VALKYRIE Terminal v3.2.1...
   [CORE] Loading neural interface.............. OK
   [SCAN] Pilot identification: ARYO ADI PUTRO
   [AUTH] Access level: FULL STACK DEVELOPER
   [LINK] Establishing secure connection......... OK
   [BOOT] All systems nominal.
   
   > Welcome, Captain.
   ```
3. Each line has a ~300ms delay, then types at ~30ms per char
4. A futuristic progress bar fills at the bottom
5. Subtle glitch flicker every ~2s (random CSS transform + opacity)
6. After complete (~4s total), screen transitions to HUD with a "power on" flash effect
7. **Skip**: Click anywhere or press any key to skip immediately

**Data source**: Hardcoded text lines. Uses pilot name from existing constants.

### 2. HUDDashboard.tsx

**Replaces**: The scroll-based `Index.tsx` layout

**Layout** (desktop):
```
┌──────────────────────────────────────────┐
│  [HUDNav — logo, status, audio toggle]   │
├──────────────────────────────────────────┤
│                                          │
│     ┌──────────────────────────┐         │
│     │   WELCOME TRANSMISSION   │         │
│     │   Avatar + Name + Title  │         │
│     │   "Available for ops"    │         │
│     └──────────────────────────┘         │
│                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ PROFILE  │ │MISSIONS │ │ ARSENAL │    │
│  │   🧬     │ │   📋    │ │   ⚔️    │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│          ┌─────────┐                     │
│          │  COMMS   │                     │
│          │   📡     │                     │
│          └─────────┘                     │
│                                          │
│  [ScanlineOverlay]  [ParticleField]      │
└──────────────────────────────────────────┘
```

**Panel cards**: Each panel uses chamfered corners via `clip-path` (not `border-radius`):
- Dark `#12121A` fill, thin 1px `#2A2A3A` border
- Lucide SVG icon (line-art, no emoji) + label in Orbitron
- Hover: border shifts to `#00FF88`, controlled `box-shadow: 0 0 12px rgba(0,255,136,0.3)`, transition 200ms
- Click: Opens corresponding section with GSAP slide-in
- SFX on hover and click
- No glass/blur decoration. No gradient text. No `scale()` on hover.

**Mobile**: Panels stack vertically in a scrollable list. Same HUD aesthetic.

**State management**: `useState` for which panel is open (`null | 'profile' | 'missions' | 'arsenal' | 'comms'`). When a panel is open, dashboard dims and the section slides in from the right as a large overlay panel.

### 3. HUDNav.tsx

**Replaces**: `PortfolioNav.tsx`

**Elements**:
- Left: Logo/codename "VALKYRIE TERMINAL" in JetBrains Mono with subtle glow
- Center: Status indicators (time, connection status dot — decorative)
- Right: Audio toggle button (speaker icon), theme is locked to dark

**Style**: Fixed top, transparent bg with subtle blur, thin cyan bottom border line.

### 4. CharacterProfile.tsx

**Replaces**: `AboutSection.tsx` (uses same data)

**Layout**:
```
┌────────────────────────────────────────────┐
│  [← Back]               PILOT DOSSIER     │
├────────────────────────────────────────────┤
│                                            │
│  ┌─────────┐   Name: ARYO ADI PUTRO       │
│  │         │   Class: FULL STACK DEVELOPER │
│  │  Avatar │   Location: MALANG, JAWA TIMUR│
│  │         │   Status: AVAILABLE           │
│  └─────────┘                               │
│                                            │
│  ── APTITUDE ───────────────────────────   │
│  Architecture    ████████░░  80%  (cyan)   │
│  Problem Solving █████████░  90%  (magenta)│
│  Systems Design  ████████░░  80%  (cyan)   │
│  Collaboration   █████████░  90%  (magenta)│
│                                            │
│  ── SERVICE RECORD ─────────────────────   │
│  2+ Years  │  3+ Operations  │ 5+ Platforms│
│                                            │
│  ── DEPLOYMENT LOG ─────────────────────   │
│  2022 ● Started Learning                  │
│  2023 ● First Projects                    │
│  2024 ● Skill Expansion                   │
│  Now  ● ACTIVE                            │
└────────────────────────────────────────────┘
```

**Data mapping**:
- `highlights[]` → Aptitude bars (StatBar component). Bars alternate between `--cyan` and `--magenta`.
- `stats[]` → "Service Record" summary boxes, chamfered.
- `journey[]` → "Deployment Log" timeline (keep existing data, restyle)

**StatBar.tsx**: Reusable component. Props: `label`, `value` (0-100), `color`. Renders a thin 4px bar, no rounded ends. GSAP animates `scaleX` from 0 on mount with `ease: 'expo.out'`.

### 5. MissionLog.tsx + MissionCard.tsx

**Replaces**: `ProjectsSection.tsx` (uses same `projects[]` data)

**Layout**: Grid of mission cards (2 columns desktop, 1 mobile).

**MissionCard props** (derived from existing `Project` type):
```typescript
interface MissionCardProps {
  title: string;           // project.title
  briefing: string;        // project.description  
  status: 'COMPLETED' | 'IN PROGRESS';  // all existing = COMPLETED
  difficulty: 1 | 2 | 3 | 4 | 5;       // manually mapped per project
  rewards: string[];       // project.tags
  repoLink?: string;       // project.github
  liveLink?: string;       // project.website || project.itchio
  thumbnail?: string;      // project.img
}
```

**Difficulty mapping** (added to constants):
- KampungKu → 4 (multi-feature Flutter app)
- Rest Area Tycoon → 3 (game jam)
- TrasMart → 2 (web storefront)
- SarPras → 3 (group project)
- FrameWork → 2 (framework exploration)
- Jawara → 2 (web app)

**Card design**:
- Top: Thumbnail or geometric grid placeholder with crosshair icon
- Status badge: `COMPLETE` in `#00FF88` monospace, top-right. No pulsing — static.
- Difficulty: ◆ diamond shapes filled in `#FF00FF` (not stars)
- Rewards: Chamfered rectangular badges, thin border, monospace text
- Bottom: "ACCESS REPOSITORY" button — `#00D4FF` text, thin border, chamfered
- Hover: border shifts to `#00FF88` with controlled glow. No `scale()` lift.
- All corners chamfered via `clip-path`, not `border-radius`

### 6. EquipmentInventory.tsx + EquipmentCard.tsx

**Replaces**: `TechStackSection.tsx` (uses same `techTree[]` data)

**Layout**: Tab bar for categories (Frontend, Backend, Tools) + item grid.

**Rarity system** (mapped by proficiency):
| Rarity     | Border Color  | Glow                                     | Criteria                |
|------------|---------------|------------------------------------------|-------------------------|
| Common     | `#2A2A3A`     | None                                     | Basic familiarity       |
| Rare       | `#00D4FF`     | `0 0 12px rgba(0,212,255,0.3)`           | Regular use             |
| Epic       | `#FF00FF`     | `0 0 12px rgba(255,0,255,0.25)`          | Strong proficiency      |
| Legendary  | `#FFD700`     | `0 0 12px rgba(255,215,0,0.3)`           | Core daily-use tech     |

**Rarity mapping** (added to constants):
- React & Next.js → Legendary
- TypeScript → Legendary
- TailwindCSS → Epic
- GSAP & Lenis → Rare
- Node.js & Express → Epic
- Firebase → Epic
- PostgreSQL → Rare
- REST APIs → Epic
- Git & GitHub → Legendary
- Vercel / Netlify → Rare
- Figma → Rare
- Unity → Rare

**Card design**: 
- Vertical rectangle, dark `#12121A` fill, chamfered corners
- Rarity-colored thin 1px border with matching glow (border OR glow, not both heavy)
- Icon centered (Lucide line-art SVG or tech icon — monochrome white)
- Name below icon in Orbitron small
- Rarity label below name in JetBrains Mono tiny
- Hover tooltip: chamfered, dark bg, brief description text
- Category tabs: text-only, active has `#00FF88` underline, no tab background

### 7. CommsTerminal.tsx

**Replaces**: `ContactSection.tsx` (uses same form fields/data)

**Design**: Military comms panel (not generic terminal)
- Title: "COMMS RELAY" in Orbitron, thin `#00FF88` underline
- Subheader with typing effect: `> CHANNEL OPEN — AWAITING TRANSMISSION` in JetBrains Mono, `#00FF88`
- Labels: `CALLSIGN`, `FREQUENCY`, `TRANSMISSION` — JetBrains Mono, `#00D4FF`, tracked
- Input fields: `#12121A` bg, 1px bottom-border only (no outline, no rounded corners)
- Submit button: `[ TRANSMIT ]` in Orbitron, `#00FF88` text, thin border, chamfered. Hover: `box-shadow: 0 4px 14px rgba(0,255,136,0.35)`
- Social links: Line-art icons (GitHub, LinkedIn, Mail), `#94A3B8`, connected by thin lines. Labeled "NETWORK NODES"

### 8. GridBackground.tsx

**Purpose**: Sub-pixel grid background that gives the page a tactical HUD feel. Replaces the scanline approach (per impeccable craft-floor: scanlines are decoration without function).

**Implementation**: A `position: fixed` div with:
- Two-axis repeating linear gradient: `rgba(255,255,255,0.024)` 1px lines on 40px grid
- `pointer-events: none`
- Static, no animation (no scrolling effect)
- Inspired by QikSense's background grid technique

### 9. GlitchText.tsx

**Purpose**: Reusable component for text with glitch effect.

**Props**: `text: string`, `intensity?: 'low' | 'medium' | 'high'`, `as?: 'h1' | 'h2' | 'span' | 'p'`

**Implementation**: CSS-only glitch using `::before` and `::after` pseudo-elements with `clip-path` animation. Triggers periodically (every 3-5s) or on hover.

### 10. ChamferedPanel.tsx

**Purpose**: Reusable wrapper component for all panels/cards. Enforces the chamfered corner system.

**Implementation**: Renders a `<div>` with `clip-path: polygon(...)` for 45° chamfered corners. Props: `size?: 'sm' | 'md'` (controls chamfer cut size: 6px or 12px), `glowColor?: string` (optional border glow), `active?: boolean`. Wraps children. Eliminates repetition of clip-path values across components.

### 11. SoundManager.tsx + useSoundEffect.ts + sounds.ts

**Sound System Architecture**:

```typescript
// sounds.ts — Sound registry
export const SOUNDS = {
  BOOT_TYPE: '/audio/boot-type.mp3',      // Keyboard typing for boot
  BOOT_COMPLETE: '/audio/boot-done.mp3',   // Power-on whoosh
  UI_HOVER: '/audio/ui-hover.mp3',         // Subtle hover tick
  UI_CLICK: '/audio/ui-click.mp3',         // Panel click
  PANEL_OPEN: '/audio/panel-open.mp3',     // Slide-in whoosh
  PANEL_CLOSE: '/audio/panel-close.mp3',   // Slide-out
  AMBIENT: '/audio/ambient-loop.mp3',      // Background ambient loop
} as const;
```

**SoundManager.tsx**: React context provider wrapping the app.
- Creates a single `AudioContext` on first user interaction
- Provides `playSound(key)`, `toggleMute()`, `isMuted` via context
- `isMuted` defaults to `true` — user must opt-in
- Persists mute preference in `localStorage`

**useSoundEffect.ts**: Hook that returns `play()` bound to a specific sound key.

**Audio files**: Small (< 50KB each) royalty-free sci-fi sound effects. Placed in `public/audio/`. We will use placeholder/generated tones initially and document where to source real files.

---

## CSS Architecture

### gamified.css (new file)

Contains all game-specific CSS that doesn't fit in Tailwind utilities:

```css
/* Chamfered clip-path utilities (.chamfer, .chamfer-sm) */
/* Glow utilities (.glow-green, .glow-cyan, .glow-magenta, .glow-gold, .glow-cta) */
/* Text glow (.text-glow) */
/* Grid background overlay (.void-grid) */
/* Glitch animation keyframes (periodic, not constant) */
/* Terminal cursor blink */
/* HUD panel slide transitions */
/* Rarity border color utilities */
/* Stat bar thin fill */
/* Boot sequence typing animation */
```

### Design rules (from impeccable craft-floor)

- No gradient text. Emphasis via weight or size.
- No glass/blur as decoration. Blur only for functional overlays.
- No section numbers (01/02/03).
- No emoji as icons. Use Lucide SVG.
- No `border-radius` on cards/panels. Use chamfered `clip-path`.
- Depth: border OR glow, never both heavy on same element.
- One authored motion per section, not scattered hover effects.

### index.css modifications

- Remap CSS custom properties for dark theme to the 3-accent Cyberpunk palette
- Add Google Fonts import: Orbitron, JetBrains Mono, Inter
- Keep existing utilities that are still used

---

## Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Desktop (≥1024px) | HUD grid layout, panels in 2x2 grid, side-panel overlay for sections |
| Tablet (768-1023px) | Panels in 2x2 grid, sections as full-screen overlays |
| Mobile (<768px) | Panels stack vertically, sections as full-screen overlays, simplified effects |

Performance on mobile: Reduce particle count, disable scanline animation, simplify glitch effects.

---

## Accessibility

- All interactive elements have proper `aria-labels`
- Focus management when panels open/close
- Keyboard navigation: Tab through panels, Enter to open, Escape to close
- Sound is muted by default — no auto-playing audio
- Reduced motion: `@media (prefers-reduced-motion)` disables glitch and glow animations
- Color contrast: All text meets WCAG AA (≥4.5:1) against `#0A0A0F` background
- `cursor-pointer` on all clickable elements
- Visible focus states for keyboard navigation
- Skip boot sequence option always visible

---

## Performance Considerations

- Audio files loaded lazily (only when unmuted)
- Grid background is pure CSS (no JS, no canvas)
- GSAP animations use `will-change` sparingly
- Images kept as-is (existing project thumbnails)
- No new heavy dependencies
- Responsive breakpoints: 375px, 768px, 1024px, 1440px

---

## Migration Strategy

1. Create all new `gamified/` components without touching existing `portfolio/` components
2. Modify `Index.tsx` to import from `gamified/` instead of `portfolio/`
3. Update `LoadingScreen.tsx` → replaced by `BootSequence.tsx`
4. Update `PortfolioNav.tsx` → replaced by `HUDNav.tsx`
5. Update `PortfolioFooter.tsx` → removed (HUD has no traditional footer)
6. Existing `portfolio/` components kept in codebase for reference/rollback
7. Update CSS variables in `index.css`
8. Add `gamified.css` import

---

## Out of Scope

- Backend/database for tracking visitor progress or achievements
- User accounts or login system
- Blog/AllPosts page gamification (kept as-is, accessible via direct route if needed)
- 3D/WebGL effects (keeping to CSS for performance)
- Mobile app or PWA features
- i18n / multi-language support
- Particle field (replaced by static grid background for performance)
- Scanline overlay (removed per craft-floor: decoration without function)

---

## Copy Tone Guidelines (stop-slop)

All UI text in the terminal should sound direct, specific, and human. No AI writing patterns.

| Rule | Example |
|------|---------|
| Active voice | "I shipped 3 production apps" not "Projects were completed" |
| Name the actor | "I refactored the codebase" not "The codebase was refactored" |
| Cut filler | State skills directly, no "Here's what I do:" |
| Two items > three | "Fast and reliable" not "Fast, reliable, and scalable" |
| Specific claims | "Shipped 3 production apps in 2024" not "Results-driven developer" |
| No adverbs | "I build production React apps" not "I deeply understand React" |
| No em dashes | Use commas or periods |
| No vague claims | Every claim should be verifiable |

Before shipping copy, run through stop-slop quick checks: any adverbs? Kill them. Passive voice? Find the actor. Sounds like a pull-quote? Rewrite.
