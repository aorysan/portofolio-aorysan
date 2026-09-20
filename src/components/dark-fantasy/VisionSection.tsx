import React from 'react';
import { VISION_DATA } from '../../lib/dark-fantasy-data';

export const VisionSection: React.FC = () => {
  return (
    <section id="vision" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      <div className="mb-10">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          04 — FUTURE VISION
        </span>
      </div>

      <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#d6cfc2] leading-tight max-w-5xl">
        {VISION_DATA.titlePrimary}{' '}
        <span className="text-[#b4442e]">{VISION_DATA.titleHighlight}</span>{' '}
        {VISION_DATA.titleSecondary}
      </h2>

      <p className="font-body text-lg text-[#b7ad99] max-w-3xl leading-relaxed mt-10">
        {VISION_DATA.manifesto}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-[#2a2723]">
        {VISION_DATA.horizons.map((h) => (
          <div key={h.label} className="border-l-2 border-[#b4442e] pl-4">
            <div className="font-military text-xs tracking-widest text-[#b4442e]">
              {h.label}
            </div>
            <p className="font-body text-sm sm:text-base text-[#d6cfc2] mt-2 leading-snug">
              {h.goal}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
