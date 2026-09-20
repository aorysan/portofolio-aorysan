import React from 'react';
import { ARSENAL_DATA } from '../../lib/dark-fantasy-data';
import { useReveal } from '../../hooks/useReveal';

const SigilIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'blades':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <path d="M4 20L18 6M18 6H10M18 6V14" />
          <path d="M8 20L20 8" />
        </svg>
      );
    case 'fortress':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <path d="M3 21V9l9-6 9 6v12H3z" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case 'reticle':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      );
    case 'spark':
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
  }
};

export const ArsenalSection: React.FC = () => {
  const containerRef = useReveal<HTMLDivElement>('.arsenal-card');

  return (
    <section
      id="arsenal"
      ref={containerRef}
      aria-labelledby="arsenal-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
            02 — THE ARSENAL
          </span>
          <h2 id="arsenal-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#d6cfc2] mt-2">
            DISCIPLINES OF COMBAT
          </h2>
        </div>
        <p className="font-body text-sm text-[#b7ad99] max-w-sm">
          Four disciplines, sharpened over a career of sieges. Hover to bring each blade to the light.
        </p>
      </div>

      {/* Hairline Grid Quad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-[#2a2723]">
        {ARSENAL_DATA.map((item) => (
          <div
            key={item.index}
            className="arsenal-card group relative p-8 sm:p-12 border-r border-b border-[#2a2723] bg-[#0a0908] hover:bg-[#12100e] transition-all duration-300"
          >
            {/* Top row: Sigil and quadrant number */}
            <div className="flex items-center justify-between text-[#b7ad99] group-hover:text-[#b4442e] transition-colors">
              <SigilIcon type={item.sigil} />
              <span className="font-military text-xs tracking-widest">{item.index}</span>
            </div>

            {/* Title */}
            <h3 className="font-military text-xl sm:text-2xl font-bold tracking-wider text-[#d6cfc2] mt-8 group-hover:text-white transition-colors">
              {item.title}
            </h3>

            {/* Description */}
            <p className="font-body text-sm text-[#b7ad99] leading-relaxed mt-3">
              {item.description}
            </p>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {item.stack.map((st) => (
                <span
                  key={st}
                  className="px-2.5 py-1 text-xs font-military tracking-wider rounded border border-[#2a2723] bg-[#1c1a17] text-[#d6cfc2]"
                >
                  {st}
                </span>
              ))}
            </div>

            {/* Ember underline on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b4442e] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
};
