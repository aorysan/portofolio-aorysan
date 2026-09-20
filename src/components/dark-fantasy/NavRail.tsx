import React from 'react';

const SECTIONS = [
  { id: 'home', number: '00', label: 'HOME' },
  { id: 'creed', number: '01', label: 'CREED' },
  { id: 'arsenal', number: '02', label: 'ARSENAL' },
  { id: 'campaigns', number: '03', label: 'CAMPAIGNS' },
  { id: 'vision', number: '04', label: 'VISION' },
  { id: 'summon', number: '05', label: 'SUMMON' },
];

export const NavRail: React.FC<{
  activeIndex: number;
  onSelectSection: (id: string, index: number) => void;
}> = ({ activeIndex, onSelectSection }) => {
  return (
    <nav
      aria-label="Section navigation rail"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-5"
    >
      {SECTIONS.map((sec, idx) => {
        const isActive = activeIndex === idx;
        return (
          <button
            key={sec.id}
            onClick={() => onSelectSection(sec.id, idx)}
            className="group flex items-center gap-3 text-right focus:outline-none"
            aria-label={`Jump to section ${sec.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className={`font-military text-xs tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-[#b4442e] font-semibold translate-x-0 opacity-100'
                  : 'text-[#b7ad99]/60 group-hover:text-[#d6cfc2] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {sec.label}
            </span>
            <span
              className={`font-military text-xs transition-colors duration-300 ${
                isActive ? 'text-[#b4442e] font-bold' : 'text-[#b7ad99]/40 group-hover:text-[#b7ad99]'
              }`}
            >
              {sec.number}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-[#b4442e] scale-125 ring-2 ring-[#b4442e]/30'
                  : 'bg-[#2a2723] group-hover:bg-[#b7ad99]'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
