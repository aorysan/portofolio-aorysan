import React from 'react';
import { SUMMON_DATA } from '../../lib/dark-fantasy-data';

export const DarkFantasyFooter: React.FC = () => {
  return (
    <footer className="relative z-10 px-6 sm:px-12 lg:px-24 py-8 border-t border-[#2a2723] bg-[#0a0908] flex flex-col sm:flex-row items-center justify-between gap-4 font-military text-xs tracking-widest text-[#b7ad99]/60">
      <div className="flex items-center gap-4">
        <span>ARYO A. P — DEDICATE YOUR HEART</span>
      </div>

      <div className="flex items-center gap-6">
        {SUMMON_DATA.socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#b7ad99] hover:text-[#b4442e] transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div>© 2026 · BUILT BEYOND THE WALLS</div>
    </footer>
  );
};
