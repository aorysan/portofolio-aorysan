# Gamified Portfolio — "VALKYRIE TERMINAL"

## Overview

Transform the existing portfolio (Vite + React + TypeScript + Tailwind + shadcn/ui) into a fully gamified, Honkai Impact 3–inspired sci-fi post-apocalyptic experience. The visitor enters through a boot sequence, lands on a HUD command-center dashboard, and interacts with portfolio content through game-themed panels: Character Profile, Mission Log, Equipment Inventory, and Comms Terminal.

**Core principle**: Gamified Shell + Keep Content. All existing data (projects, about info, tech stack, contact) is preserved. Only the UI layer and interaction patterns change.

## Tech Stack (unchanged)

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: TailwindCSS 3 + shadcn/ui components (selectively used)
- **Animation**: GSAP (already installed), CSS animations
- **Audio**: Web Audio API (new — no extra dependency)
- **Routing**: react-router-dom (HashRouter, already installed)
- **Fonts**: Sora (headings), JetBrains Mono (terminal/code), Inter (body)

No new heavy dependencies. Web Audio API is native. Sound assets are small royalty-free files hosted in `/public/audio/`.

---

## Color Palette

| Token               | Value       | Usage                              |
|----------------------|-------------|-------------------------------------|
| `--bg-deep`          | `#0a0a14`   | Main background                    |
| `--bg-panel`         | `#0d1117`   | Card/panel backgrounds             |
| `--bg-panel-hover`   | `#161b22`   | Panel hover state                  |
| `--accent-cyan`      | `#00d4ff`   | Primary accent, borders, glows     |
| `--accent-purple`    | `#7b2ffc`   | Secondary accent                   |
| `--accent-orange`    | `#ff6b35`   | Warning, highlight, "hot" elements |
| `--accent-gold`      | `#ffd700`   | Legendary rarity, special items    |
| `--text-primary`     | `#e4e4e7`   | Main text                          |
| `--text-muted`       | `#6b7280`   | Secondary text                     |
| `--text-glow`        | `#00d4ff`   | Glowing text (headings, labels)    |
| `--border-glow`      | `rgba(0,212,255,0.3)` | Subtle border glow         |
| `--scanline`         | `rgba(0,212,255,0.03)` | Scanline overlay opacity  |

These map to Tailwind's existing CSS variable system. The current `--primary`, `--accent`, etc. tokens will be remapped to these values for dark theme.

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
│   │   ├── ScanlineOverlay.tsx      # Fullscreen scanline CSS effect
│   │   ├── GlitchText.tsx           # Reusable glitch text component
│   │   ├── StatBar.tsx              # Reusable stat/progress bar
│   │   ├── ParticleField.tsx        # Enhanced particle background
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

**Panel cards**: Each panel is a glassmorphism card with:
- Glow border (`box-shadow: 0 0 15px var(--accent-cyan)`)
- Icon + label
- Hover: border brightens, subtle scale(1.02), glow intensifies
- Click: Opens corresponding section with GSAP slide-in animation
- SFX on hover and click

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
│  [← Back]              CHARACTER PROFILE   │
├────────────────────────────────────────────┤
│                                            │
│  ┌─────────┐   Name: ARYO ADI PUTRO       │
│  │         │   Class: FULL STACK DEVELOPER │
│  │  Avatar │   Location: MALANG, JAWA TIMUR│
│  │         │   Status: AVAILABLE           │
│  └─────────┘                               │
│                                            │
│  ── STATS ──────────────────────────────   │
│  Clean Code      ████████░░  80%           │
│  Problem Solving █████████░  90%           │
│  Goal Oriented   ████████░░  80%           │
│  Team Player     █████████░  90%           │
│                                            │
│  ── COMBAT RECORD ──────────────────────   │
│  2+ Years  │  3+ Projects  │  5+ Techs    │
│                                            │
│  ── MISSION HISTORY ────────────────────   │
│  2022 ● Started Learning                  │
│  2023 ● First Projects                    │
│  2024 ● Skill Expansion                   │
│  Now  ● Ongoing Growth                    │
└────────────────────────────────────────────┘
```

**Data mapping**:
- `highlights[]` → Stats with progress bars (StatBar component)
- `stats[]` → "Combat Record" summary row
- `journey[]` → "Mission History" timeline (keep existing data, restyle)

**StatBar.tsx**: Reusable component. Props: `label`, `value` (0-100), `color`. Renders an animated fill bar with glow effect. GSAP animates fill on mount.

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
- Top: Thumbnail or placeholder with scanline overlay
- Status badge: Glowing green `[COMPLETED]` or pulsing yellow `[IN PROGRESS]`
- Difficulty: Star rating with glow
- Rewards: Tag pills (same data as current tags)
- Bottom: Action buttons (View Repo, Live Demo)
- Hover: Card lifts, border glows brighter, SFX

### 6. EquipmentInventory.tsx + EquipmentCard.tsx

**Replaces**: `TechStackSection.tsx` (uses same `techTree[]` data)

**Layout**: Tab bar for categories (Frontend, Backend, Tools) + item grid.

**Rarity system** (mapped by proficiency):
| Rarity     | Border Color  | Glow         | Criteria                |
|------------|---------------|--------------|-------------------------|
| Common     | `#6b7280`     | None         | Basic familiarity       |
| Rare       | `#3b82f6`     | Blue subtle  | Regular use             |
| Epic       | `#7b2ffc`     | Purple       | Strong proficiency      |
| Legendary  | `#ffd700`     | Gold         | Core daily-use tech     |

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
- Square card, dark bg
- Rarity-colored border (subtle glow matching rarity)
- Icon centered (Lucide icon or simple SVG)
- Name below icon
- Hover tooltip: Full name + category + brief description

### 7. CommsTerminal.tsx

**Replaces**: `ContactSection.tsx` (uses same form fields/data)

**Design**: Terminal-style contact form
- Header with typing effect: `> ESTABLISHING SECURE CHANNEL...`
- Form fields styled as terminal inputs (monospace, cursor blink, cyan accent)
- Labels as terminal prompts (`SENDER_NAME: `, `MESSAGE_BODY: `)
- Submit button: `[TRANSMIT ▶]` with glow effect
- Social links from existing footer data, styled as "network nodes"

### 8. ScanlineOverlay.tsx

**Purpose**: Fullscreen CSS overlay that gives the whole page a subtle CRT/holographic feel.

**Implementation**: A `position: fixed` div with:
- Repeating linear gradient (2px transparent, 1px rgba cyan) creating horizontal scan lines
- `pointer-events: none`
- Very low opacity (0.03-0.05)
- Optional: slow vertical animation (translateY) for "scrolling scanline" effect

### 9. GlitchText.tsx

**Purpose**: Reusable component for text with glitch effect.

**Props**: `text: string`, `intensity?: 'low' | 'medium' | 'high'`, `as?: 'h1' | 'h2' | 'span' | 'p'`

**Implementation**: CSS-only glitch using `::before` and `::after` pseudo-elements with `clip-path` animation. Triggers periodically (every 3-5s) or on hover.

### 10. ParticleField.tsx

**Purpose**: Enhanced version of existing particle background.

**Implementation**: Canvas-based particle system (or CSS if performance is better). Slow-moving dots with subtle connecting lines when close. Cyan-tinted. Responds subtly to mouse movement (parallax).

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
/* Scanline effect */
/* Glitch animation keyframes */
/* Glow border utilities */
/* Terminal cursor blink */
/* HUD panel transitions */
/* Rarity color border utilities */
/* Boot sequence animations */
/* Stat bar fill animation */
```

### index.css modifications

- Remap CSS custom properties for dark theme to sci-fi palette
- Add new utility classes: `.glow-cyan`, `.glow-purple`, `.glow-gold`
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
- Reduced motion: `@media (prefers-reduced-motion)` disables glitch, scanline, particle animations
- Color contrast: All text meets WCAG AA against dark backgrounds
- Skip boot sequence option always visible

---

## Performance Considerations

- Audio files loaded lazily (only when unmuted)
- Particle field uses `requestAnimationFrame` with delta-time, pauses when tab is hidden
- GSAP animations use `will-change` sparingly
- Images kept as-is (existing project thumbnails)
- No new heavy dependencies

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
- 3D/WebGL effects (keeping to CSS + Canvas for performance)
- Mobile app or PWA features
- i18n / multi-language support
