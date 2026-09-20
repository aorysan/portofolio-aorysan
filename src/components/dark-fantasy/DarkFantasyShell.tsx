import React, { useCallback, useEffect, useState } from 'react';
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
  const { isMuted, toggleMute } = useTactileSound();

  const handleSelectSection = useCallback(
    (id: string, index: number) => {
      onSelectIndex(index);
      scrollTo(`#${id}`);
    },
    [onSelectIndex, scrollTo]
  );

  const handleAdvance = useCallback(() => {
    onSelectIndex(1);
    scrollTo('#creed');
  }, [onSelectIndex, scrollTo]);

  useEffect(() => {
    if (mode !== 'chapter') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(activeIndex + 1, SECTION_IDS.length - 1);
        onSelectIndex(next);
        const id = SECTION_IDS[next];
        if (id) scrollTo(`#${id}`);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(activeIndex - 1, 0);
        onSelectIndex(prev);
        const id = SECTION_IDS[prev];
        if (id) scrollTo(`#${id}`);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, activeIndex, onSelectIndex, scrollTo]);

  return (
    <div className="relative min-h-screen bg-[#0a0908] text-[#d6cfc2]">
      <EmberCanvas />
      <TacticalHeader mode={mode} onToggleMode={onToggleMode} isMuted={isMuted} onToggleAudio={toggleMute} />
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
