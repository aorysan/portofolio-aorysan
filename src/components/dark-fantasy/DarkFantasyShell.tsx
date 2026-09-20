import React, { useCallback, useEffect, useRef, useState } from 'react';
import SmoothScroll, { useLenisContext } from '../SmoothScroll';
import { useTactileSound } from '../dossier/TactileSoundManager';
import { EmberCanvas } from './EmberCanvas';
import { TacticalHeader } from './TacticalHeader';
import { NavRail } from './NavRail';
import { HeroSection } from './HeroSection';
import { CreedSection } from './CreedSection';
import { ArsenalSection } from './ArsenalSection';
import { CampaignsSection } from './CampaignsSection';
import { VisionSection } from './VisionSection';
import { SummonSection } from './SummonSection';
import { DarkFantasyFooter } from './DarkFantasyFooter';

export type ShellMode = 'fluid' | 'chapter';

const SECTION_IDS = ['home', 'creed', 'arsenal', 'campaigns', 'vision', 'summon'];

interface ShellBodyProps {
  mode: ShellMode;
  onToggleMode: () => void;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

const ShellBody: React.FC<ShellBodyProps> = ({ mode, onToggleMode, activeIndex, onSelectIndex }) => {
  const { scrollTo } = useLenisContext();
  const { isMuted, toggleMute, playSound } = useTactileSound();

  // Central chapter stepper: clamps, syncs the rail, and navigates.
  // Chapter mode only swaps the visible slide (the snap effect below handles
  // positioning); fluid mode smooth-scrolls to the section anchor.
  // No-op when the index is unchanged so wheel jitter can't re-trigger snaps.
  const goToChapter = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, SECTION_IDS.length - 1));
      if (clamped === activeIndex) return;
      playSound('paperSlide');
      onSelectIndex(clamped);
      if (mode !== 'chapter') {
        const id = SECTION_IDS[clamped];
        if (id) scrollTo(`#${id}`);
      }
    },
    [activeIndex, mode, onSelectIndex, scrollTo, playSound]
  );

  const handleSelectSection = useCallback(
    (_id: string, index: number) => {
      goToChapter(index);
    },
    [goToChapter]
  );

  const handleAdvance = useCallback(() => {
    goToChapter(1);
  }, [goToChapter]);

  // Wrap the shell-level mode toggle with click feedback. Wired here (not
  // inside TacticalHeader) to keep the header's tested props stable.
  const handleToggleModeWithSound = useCallback(() => {
    playSound('penClick');
    onToggleMode();
  }, [onToggleMode, playSound]);

  // Chapter Snap deck (spec §5.2): lock window scroll, debounce wheel input,
  // and snap to the active chapter. Restores everything on mode exit/unmount.
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef<number | null>(null);

  // True when the active chapter container can still scroll natively in the
  // given direction — wheel/touch input is then left alone so tall chapters
  // (e.g. Campaigns) remain readable instead of instantly paging away.
  const chapterCanScroll = useCallback((index: number, dir: 1 | -1): boolean => {
    if (typeof document === 'undefined') return false;
    const id = SECTION_IDS[index];
    if (!id) return false;
    const el = document.querySelector(`[data-chapter="${id}"]`);
    if (!(el instanceof HTMLElement)) return false;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 4) return false;
    return dir > 0 ? scrollTop + clientHeight < scrollHeight - 4 : scrollTop > 4;
  }, []);

  // Window scroll lock for chapter mode. Positioning lives in the snap effect.
  useEffect(() => {
    if (mode !== 'chapter') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mode]);

  // Snap effect: entering chapter mode (or changing chapters) parks the
  // window at the top and rewinds the active slide so the deck always opens
  // on the current chapter. Property assignment (not window.scrollTo) keeps
  // this a safe no-op in headless/jsdom environments.
  useEffect(() => {
    if (mode !== 'chapter') return;
    try {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const id = SECTION_IDS[activeIndex];
      if (id) {
        const el = document.querySelector(`[data-chapter="${id}"]`);
        if (el) el.scrollTop = 0;
      }
    } catch {
      // Non-DOM environment: positioning is irrelevant.
    }
  }, [mode, activeIndex]);

  useEffect(() => {
    if (mode !== 'chapter') return;

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      // Tall chapter with room to scroll: don't hijack, don't advance.
      if (chapterCanScroll(activeIndex, dir)) return;
      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      goToChapter(activeIndex + dir);
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 900);
    };
    // Non-passive so preventDefault actually stops the page scroll.
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current !== null) {
        window.clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = null;
      }
      wheelLockRef.current = false;
    };
  }, [mode, activeIndex, goToChapter, chapterCanScroll]);

  useEffect(() => {
    if (mode !== 'chapter') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Never hijack typing, form fields, links/buttons, or the open dossier.
      if (
        target &&
        (target.closest?.('[role="dialog"]') ||
          /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToChapter(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToChapter(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, activeIndex, goToChapter]);

  // Touch swipe navigation for Chapter Snap deck (spec §5.2).
  const touchStartYRef = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (mode !== 'chapter') return;
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY === null) return;
      const endY = e.changedTouches[0]?.clientY ?? startY;
      const delta = startY - endY;
      if (Math.abs(delta) < 50) return;
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      // Tall chapter with room to scroll: the native swipe already scrolled
      // it — don't also page away.
      if (chapterCanScroll(activeIndex, dir)) return;
      goToChapter(activeIndex + dir);
    },
    [mode, activeIndex, goToChapter, chapterCanScroll]
  );

  const chapters: Array<{ id: string; node: React.ReactNode }> = [
    { id: 'home', node: <HeroSection onAdvance={handleAdvance} /> },
    { id: 'creed', node: <CreedSection /> },
    { id: 'arsenal', node: <ArsenalSection /> },
    { id: 'campaigns', node: <CampaignsSection /> },
    { id: 'vision', node: <VisionSection /> },
    { id: 'summon', node: <SummonSection /> },
  ];

  return (
    <div
      className="relative min-h-screen bg-[#0a0908] text-[#d6cfc2]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <EmberCanvas />
      <TacticalHeader mode={mode} onToggleMode={handleToggleModeWithSound} isMuted={isMuted} onToggleAudio={toggleMute} />
      <NavRail activeIndex={activeIndex} onSelectSection={handleSelectSection} />
      <main>
        {chapters.map((ch, i) =>
          mode === 'chapter' ? (
            // Presentation deck: exactly one viewport slide visible. Tall
            // chapters inner-scroll; the active slide fades in on each entry.
            <div
              key={ch.id}
              data-chapter={ch.id}
              className={
                i === activeIndex ? 'h-[100vh] overflow-y-auto animate-fade-in' : 'hidden'
              }
            >
              {ch.node}
            </div>
          ) : (
            <div key={ch.id} data-chapter={ch.id}>
              {ch.node}
            </div>
          )
        )}
      </main>
      {/* The deck is the six chapters; the footer belongs to fluid scroll. */}
      {mode === 'fluid' && <DarkFantasyFooter />}
    </div>
  );
};

export const DarkFantasyShell: React.FC = () => {
  const [mode, setMode] = useState<ShellMode>('fluid');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggleMode = useCallback(() => {
    setMode((prev) => (prev === 'fluid' ? 'chapter' : 'fluid'));
  }, []);

  return (
    <SmoothScroll enabled={mode === 'fluid'}>
      <ShellBody
        mode={mode}
        onToggleMode={handleToggleMode}
        activeIndex={activeIndex}
        onSelectIndex={setActiveIndex}
      />
    </SmoothScroll>
  );
};
