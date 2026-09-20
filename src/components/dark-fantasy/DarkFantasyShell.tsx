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

  const handleSelectSection = useCallback(
    (id: string, index: number) => {
      onSelectIndex(index);
      scrollTo(`#${id}`);
    },
    [onSelectIndex, scrollTo]
  );

  const handleAdvance = useCallback(() => {
    playSound('paperSlide');
    onSelectIndex(1);
    scrollTo('#creed');
  }, [onSelectIndex, scrollTo, playSound]);

  // Wrap the shell-level mode toggle with click feedback. Wired here (not
  // inside TacticalHeader) to keep the header's tested props stable.
  const handleToggleModeWithSound = useCallback(() => {
    playSound('penClick');
    onToggleMode();
  }, [onToggleMode, playSound]);

  // Central chapter stepper: clamps, syncs the rail, snaps to the section.
  // No-op when the index is unchanged so wheel jitter can't re-trigger snaps.
  const goToChapter = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, SECTION_IDS.length - 1));
      if (clamped === activeIndex) return;
      playSound('paperSlide');
      onSelectIndex(clamped);
      const id = SECTION_IDS[clamped];
      if (id) scrollTo(`#${id}`);
    },
    [activeIndex, onSelectIndex, scrollTo, playSound]
  );

  // Chapter Snap deck (spec §5.2): lock window scroll, debounce wheel input,
  // and snap to the active chapter. Restores everything on mode exit/unmount.
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode !== 'chapter') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Snap to the current chapter on entry so the toggle has visible effect.
    const id = SECTION_IDS[activeIndex];
    if (id) scrollTo(`#${id}`);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLockRef.current) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;
      wheelLockRef.current = true;
      goToChapter(activeIndex + (delta > 0 ? 1 : -1));
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 900);
    };
    // Non-passive so preventDefault actually stops the page scroll.
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current !== null) {
        window.clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = null;
      }
      wheelLockRef.current = false;
    };
  }, [mode, activeIndex, goToChapter, scrollTo]);

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
      goToChapter(activeIndex + (delta > 0 ? 1 : -1));
    },
    [mode, activeIndex, goToChapter]
  );

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
        <HeroSection onAdvance={handleAdvance} />
        <CreedSection />
        <ArsenalSection />
        <CampaignsSection />
        <VisionSection />
        <SummonSection />
      </main>
      <DarkFantasyFooter />
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
