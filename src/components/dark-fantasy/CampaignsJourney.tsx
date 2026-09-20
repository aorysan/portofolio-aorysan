import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CAMPAIGNS_DATA, Campaign } from '../../lib/dark-fantasy-data';
import { WallBreach } from './WallBreach';

// Task 4 carry-forward: strengthened guard — `typeof window !== 'undefined'`
// alone crashes jsdom because ScrollTrigger touches matchMedia at register.
// Skip registration when matchMedia is absent.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export const CampaignsJourney: React.FC<{
  onOpenDossier: (campaign: Campaign) => void;
}> = ({ onOpenDossier }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const sinaProjects = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'sina');
  const roseProjects = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'rose');
  const mariaProjects = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'maria');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function' || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderProjectCard = (item: Campaign) => (
    <div
      key={item.id}
      onClick={() => onOpenDossier(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDossier(item);
        }
      }}
      className="group relative w-80 sm:w-96 flex-shrink-0 p-8 rounded border border-[#2a2723] bg-[#0a0908] hover:border-[#b4442e] transition-all duration-300 cursor-pointer text-left flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between text-xs font-military tracking-widest text-[#b7ad99]/70">
          <span className="px-2 py-0.5 rounded border border-[#2a2723] bg-[#12100e]">
            {item.district}
          </span>
          <span>{item.year}</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-[#d6cfc2] mt-6 group-hover:text-white transition-colors">
          {item.title}
        </h3>
        <p className="font-military text-xs tracking-wider text-[#b4442e] uppercase mt-1">
          {item.role}
        </p>
        <p className="font-body text-sm text-[#b7ad99] line-clamp-3 mt-3">
          {item.briefing}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-1.5">
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
          <span>INSPECT DOSSIER</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center h-full gap-8 px-12 sm:px-24 w-max will-change-transform"
      >
        {/* Sina Zone (Oldest / Interior) */}
        <div className="flex items-center gap-8">
          <div className="w-72 flex-shrink-0 text-left">
            <span className="font-military text-xs tracking-[0.25em] text-[#b4442e]">
              ZONE 01 · INTERIOR
            </span>
            <h2 className="font-display text-4xl font-bold text-[#d6cfc2] mt-2">
              WALL SINA
            </h2>
            <p className="font-body text-sm text-[#b7ad99] mt-3">
              Earliest core architectures and foundations that anchored the journey.
            </p>
          </div>
          {sinaProjects.map(renderProjectCard)}
        </div>

        {/* Breach 1 */}
        <WallBreach wallName="WALL SINA" zoneLabel="BREACH PERIMETER I" isBreached />

        {/* Rose Zone (Mid) */}
        <div className="flex items-center gap-8">
          <div className="w-72 flex-shrink-0 text-left">
            <span className="font-military text-xs tracking-[0.25em] text-[#b4442e]">
              ZONE 02 · INTERMEDIATE
            </span>
            <h2 className="font-display text-4xl font-bold text-[#d6cfc2] mt-2">
              WALL ROSE
            </h2>
            <p className="font-body text-sm text-[#b7ad99] mt-3">
              Production scale systems and simulation engines deployed under live pressure.
            </p>
          </div>
          {roseProjects.map(renderProjectCard)}
        </div>

        {/* Breach 2 */}
        <WallBreach wallName="WALL ROSE" zoneLabel="BREACH PERIMETER II" isBreached />

        {/* Maria Zone (Latest) */}
        <div className="flex items-center gap-8">
          <div className="w-72 flex-shrink-0 text-left">
            <span className="font-military text-xs tracking-[0.25em] text-[#b4442e]">
              ZONE 03 · FRONTIER
            </span>
            <h2 className="font-display text-4xl font-bold text-[#d6cfc2] mt-2">
              WALL MARIA
            </h2>
            <p className="font-body text-sm text-[#b7ad99] mt-3">
              The outer rampart of our software: latest production platforms standing guard.
            </p>
          </div>
          {mariaProjects.map(renderProjectCard)}
        </div>

        {/* Breach 3 */}
        <WallBreach wallName="WALL MARIA" zoneLabel="FINAL PERIMETER BREACH" isBreached />

        {/* Beyond The Walls (Horizon) */}
        <div className="w-[500px] flex-shrink-0 p-12 rounded border border-[#2a2723] bg-gradient-to-r from-[#0a0908] to-[#4d6155]/20 text-left flex flex-col justify-center">
          <span className="font-military text-xs tracking-[0.3em] text-[#4d6155] uppercase">
            UNCHARTED TERRITORY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-3">
            BEYOND THE WALLS
          </h2>
          <p className="font-body text-sm text-[#b7ad99] mt-4 leading-relaxed">
            The perimeter ends here. Ahead lies open sea and wild territory where upcoming distributed engines are forged.
          </p>

          <div className="mt-8 flex items-center gap-3 p-3 rounded border border-[#4d6155]/50 bg-[#12100e] text-xs font-military tracking-widest text-[#d6cfc2]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4d6155] animate-ping" />
            <span>⟐ EXPEDITION IN PROGRESS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
