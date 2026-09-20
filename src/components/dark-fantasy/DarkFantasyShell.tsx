import React, { useCallback, useState } from 'react';
import { useLenisContext } from '../SmoothScroll';
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

const SECTION_IDS = ['home', 'creed', 'arsenal', 'campaigns', 'vision', 'summon'];

// Single long page: continuous fluid scroll over all sections.
// There is no chapter/snap deck — every section renders in normal flow.
export const DarkFantasyShell: React.FC = () => {
  const { scrollTo } = useLenisContext();
  const { isMuted, toggleMute, playSound } = useTactileSound();
  const [activeIndex, setActiveIndex] = useState(0);

  // Clamp the index, highlight the rail, and smooth-scroll to the anchor.
  // No-op when the index is unchanged.
  const goToSection = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, SECTION_IDS.length - 1));
      if (clamped === activeIndex) return;
      playSound('paperSlide');
      setActiveIndex(clamped);
      const id = SECTION_IDS[clamped];
      if (id) scrollTo(`#${id}`);
    },
    [activeIndex, scrollTo, playSound]
  );

  const handleSelectSection = useCallback(
    (_id: string, index: number) => {
      goToSection(index);
    },
    [goToSection]
  );

  const handleAdvance = useCallback(() => {
    goToSection(1);
  }, [goToSection]);

  const sections: Array<{ id: string; node: React.ReactNode }> = [
    { id: 'home', node: <HeroSection onAdvance={handleAdvance} /> },
    { id: 'creed', node: <CreedSection /> },
    { id: 'arsenal', node: <ArsenalSection /> },
    { id: 'campaigns', node: <CampaignsSection /> },
    { id: 'vision', node: <VisionSection /> },
    { id: 'summon', node: <SummonSection /> },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0908] text-[#d6cfc2]">
      <EmberCanvas />
      <TacticalHeader isMuted={isMuted} onToggleAudio={toggleMute} />
      <NavRail activeIndex={activeIndex} onSelectSection={handleSelectSection} />
      <main>
        {sections.map((sec) => (
          <div key={sec.id}>{sec.node}</div>
        ))}
      </main>
      <DarkFantasyFooter />
    </div>
  );
};
