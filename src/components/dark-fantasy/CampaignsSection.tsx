import React, { useEffect, useState } from 'react';
import { CAMPAIGNS_DATA, Campaign } from '../../lib/dark-fantasy-data';
import { useTactileSound } from '../dossier/TactileSoundManager';
import { CampaignDossierModal } from './CampaignDossierModal';
import { CampaignsJourney } from './CampaignsJourney';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useReveal } from '../../hooks/useReveal';

export const CampaignsSection: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { playSound } = useTactileSound();
  const reducedMotion = useReducedMotion();
  const fallbackGridRef = useReveal<HTMLDivElement>('.campaign-card');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkSize = () => {
      setIsLargeScreen(window.innerWidth >= 1000);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleOpenDossier = (item: Campaign) => {
    playSound('paperSlide');
    setSelectedCampaign(item);
  };

  const handleCloseDossier = () => {
    playSound('tapePeel');
    setSelectedCampaign(null);
  };

  // Fallback: vertical wall-dive only on large screens without reduced
  // motion; otherwise the Phase 1 vertical grid.
  const showDive = isLargeScreen && !reducedMotion;

  return (
    <section
      id="campaigns"
      aria-labelledby="campaigns-heading"
      className="relative min-h-screen flex flex-col justify-center z-10 border-t border-[#2a2723]"
    >
      <h2 id="campaigns-heading" className="sr-only">
        03 — CAMPAIGNS
      </h2>
      {showDive ? (
        <CampaignsJourney onOpenDossier={handleOpenDossier} />
      ) : (
        <div className="px-6 sm:px-12 lg:px-24 py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
                03 — CAMPAIGNS
              </span>
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-2">
                THE WALL.
              </div>
            </div>
            <p className="font-body text-sm text-[#b7ad99] max-w-sm">
              All six deployed fortifications across the outer and inner walls. Select any sector to inspect tactical dossier.
            </p>
          </div>

          {/* Responsive Vertical Grid (Phase 1 fallback) with reversible reveal */}
          <div ref={fallbackGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPAIGNS_DATA.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenDossier(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDossier(item);
                  }
                }}
                className="campaign-card group relative p-6 sm:p-8 rounded border border-[#2a2723] bg-[#0a0908] hover:border-[#b4442e] transition-all duration-300 cursor-pointer overflow-hidden text-left"
              >
                <div className="flex items-center justify-between text-xs font-military tracking-widest text-[#b7ad99]/70">
                  <span className="px-2 py-0.5 rounded border border-[#2a2723] bg-[#12100e]">
                    {item.district}
                  </span>
                  <span>{item.year}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#d6cfc2] mt-6 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="font-military text-xs tracking-wider text-[#b4442e] uppercase mt-1">
                  {item.role}
                </p>

                <p className="font-body text-sm text-[#b7ad99] line-clamp-3 mt-3">
                  {item.briefing}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-6">
                  {item.stack.slice(0, 3).map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 text-[11px] font-military tracking-wider rounded border border-[#2a2723] text-[#b7ad99]"
                    >
                      {st}
                    </span>
                  ))}
                  {item.stack.length > 3 && (
                    <span className="px-2 py-0.5 text-[11px] font-military text-[#b4442e]">
                      +{item.stack.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#2a2723] flex items-center justify-between text-xs font-military tracking-wider text-[#b7ad99] group-hover:text-[#b4442e]">
                  <span>OPEN DOSSIER</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CampaignDossierModal
        campaign={selectedCampaign}
        onClose={handleCloseDossier}
      />
    </section>
  );
};
