import React from 'react';
import { CREED_DATA } from '../../lib/dark-fantasy-data';
import profileAvatar from '../../assets/profile-avatar.jpg';

export const CreedSection: React.FC = () => {
  return (
    <section id="creed" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          01 — THE CREED
        </span>
      </div>

      {/* Monumental Quote */}
      <blockquote className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight text-[#d6cfc2] max-w-5xl">
        "{CREED_DATA.quote}"
      </blockquote>

      {/* Asymmetric 2-Col Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-12 font-body text-base sm:text-lg text-[#b7ad99] leading-relaxed">
        <div>
          <p>{CREED_DATA.narrativeLeft}</p>
        </div>
        <div>
          <p>{CREED_DATA.narrativeRight}</p>
        </div>
      </div>

      {/* Stats Bar & Tactical Seal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mt-16 pt-10 border-t border-[#2a2723]">
        <div className="flex flex-wrap items-center gap-10 sm:gap-16">
          {CREED_DATA.stats.map((st) => (
            <div key={st.label}>
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#d6cfc2]">
                {st.value}
              </div>
              <div className="font-military text-xs tracking-widest text-[#b7ad99]/70 mt-1">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Avatar Badge */}
        <div className="flex items-center gap-4 p-2 pr-4 rounded border border-[#2a2723] bg-[#12100e]">
          <img
            src={profileAvatar}
            alt="Aryo Adi Putro"
            className="w-12 h-12 rounded object-cover grayscale contrast-125 border border-[#2a2723]"
          />
          <div className="text-left">
            <div className="font-display text-xs font-semibold text-[#d6cfc2]">ARYO ADI PUTRO</div>
            <div className="font-military text-[10px] tracking-wider text-[#b4442e]">SURVEY CORPS DEV</div>
          </div>
        </div>
      </div>
    </section>
  );
};
