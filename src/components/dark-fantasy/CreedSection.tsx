import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CREED_DATA } from '../../lib/dark-fantasy-data';
import profileAvatar from '../../assets/profile-avatar.jpg';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { splitWords } from '../../hooks/useTextSplit';
import { TextScramble } from './TextScramble';

// Task 4 carry-forward: strengthened guard — brief verbatim
// `typeof window !== 'undefined'` alone crashes jsdom because ScrollTrigger
// touches matchMedia at register. Skip registration when matchMedia is absent.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export const CreedSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLQuoteElement>(null);
  const reducedMotion = useReducedMotion();

  const words = splitWords(CREED_DATA.quote);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (window.innerWidth < 768) return; // Spec §3.4: matikan pin di <768px

    const ctx = gsap.context(() => {
      const wordElements = wordsRef.current?.querySelectorAll('.creed-word');
      if (wordElements && wordElements.length > 0) {
        gsap.fromTo(
          wordElements,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=120%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="creed"
      ref={containerRef}
      aria-labelledby="creed-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <TextScramble
          id="creed-heading"
          as="span"
          text="01 — THE CREED"
          className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]"
        />
      </div>

      {/* Monumental Quote with Split Words */}
      <blockquote
        ref={wordsRef}
        className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight text-[#d6cfc2] max-w-5xl"
      >
        "{words.map((word, i) => (
          <span
            key={i}
            className="creed-word inline-block mr-2.5 transition-opacity"
            style={{ opacity: reducedMotion ? 1 : undefined }}
          >
            {word}
          </span>
        ))}"
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
