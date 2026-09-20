import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VISION_DATA } from '../../lib/dark-fantasy-data';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Task 4 carry-forward: strengthened guard — brief verbatim
// `typeof window !== 'undefined'` alone crashes jsdom because ScrollTrigger
// touches matchMedia at register. Skip registration when matchMedia is absent.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export const VisionSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Horizontal text scrub bounded to max ±6%
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          xPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Storm overlay opacity scrub
      gsap.to('.vision-storm-overlay', {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="vision"
      ref={containerRef}
      aria-labelledby="vision-heading"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723] overflow-hidden"
    >
      <div className="vision-storm-overlay absolute inset-0 pointer-events-none opacity-10 bg-radial from-[#4d6155]/30 to-transparent" />

      <div className="mb-10 relative z-10">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          04 — FUTURE VISION
        </span>
      </div>

      <h2
        id="vision-heading"
        ref={headlineRef}
        className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#d6cfc2] leading-tight max-w-5xl relative z-10 will-change-transform"
      >
        {VISION_DATA.titlePrimary}{' '}
        <span className="text-[#b4442e]">{VISION_DATA.titleHighlight}</span>{' '}
        {VISION_DATA.titleSecondary}
      </h2>

      <p className="font-body text-lg text-[#b7ad99] max-w-3xl leading-relaxed mt-10 relative z-10">
        {VISION_DATA.manifesto}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-[#2a2723] relative z-10">
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
