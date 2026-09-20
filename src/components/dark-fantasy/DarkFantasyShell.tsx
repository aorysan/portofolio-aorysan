import React, { useCallback, useState } from 'react';
import { useLenisContext } from '../SmoothScroll';
import { useTactileSound } from '../dossier/TactileSoundManager';
import { useSectionSpy } from '../../hooks/useSectionSpy';
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

  useSectionSpy(SECTION_IDS, setActiveIndex);

  // Clamp the index, highlight the rail, and smooth-scroll to the anchor.
  const goToSection = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, SECTION_IDS.length - 1));
      playSound('paperSlide');
      setActiveIndex(clamped);
      const id = SECTION_IDS[clamped];
      if (id) {
        scrollTo(`#${id}`);
        if (id === 'creed') window.dispatchEvent(new CustomEvent('creed:complete'));
        requestAnimationFrame(() => {
          const h = document.querySelector(`#${id} h1, #${id} h2, #${id} [id$="-heading"]`);
          if (h && typeof (h as HTMLElement).focus !== 'function') return;
          if (h) {
            (h as HTMLElement).setAttribute('tabindex', '-1');
            (h as HTMLElement).focus({ preventScroll: true });
          }
        });
      }
    },
    [scrollTo, playSound]
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
