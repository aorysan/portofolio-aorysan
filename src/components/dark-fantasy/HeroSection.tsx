import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { HERO_DATA } from '../../lib/dark-fantasy-data';
import { useChapterMode } from './ChapterModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Task 4 carry-forward: strengthened guard — brief verbatim
// `typeof window !== 'undefined'` alone crashes jsdom because ScrollTrigger
// touches matchMedia at register. Skip registration when matchMedia is absent.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HeroSection: React.FC<{ onAdvance: () => void }> = ({ onAdvance }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const { scrollFXEnabled } = useChapterMode();
  const reducedMotion = useReducedMotion();

  // Entrance animation (Anime.js)
  useEffect(() => {
    if (!headlineRef.current || reducedMotion) return;
    try {
      anime({
        targets: headlineRef.current.children,
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: anime.stagger(200, { start: 200 }),
      });
    } catch {
      // animejs fallback safe
    }
  }, [reducedMotion]);

  // GSAP Recession & Fog Parallax ScrollTrigger
  useEffect(() => {
    if (!scrollFXEnabled || reducedMotion || !containerRef.current || !headlineRef.current) return;
    if (typeof window === 'undefined' || typeof gsap === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.to(headlineRef.current, {
        scale: 0.85,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-fog-1', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-fog-2', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scrollFXEnabled, reducedMotion]);

  return (
    <section
      id="home"
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-24 pt-32 pb-16 z-10 overflow-hidden"
    >
      {/* 2 Subtle Fog Background Layers */}
      <div className="hero-fog-1 absolute inset-0 pointer-events-none opacity-20 bg-radial from-[#4d6155]/20 to-transparent will-change-transform" />
      <div className="hero-fog-2 absolute inset-0 pointer-events-none opacity-15 bg-radial from-[#1c1a17] to-transparent will-change-transform" />

      {/* Top Tagline */}
      <div className="flex items-center gap-3 relative z-10">
        <span className="w-8 h-px bg-[#7c1f1a]" />
        <span className="font-military text-xs sm:text-sm tracking-[0.3em] text-[#b4442e] uppercase">
          {HERO_DATA.tagline}
        </span>
      </div>

      {/* Main Monolith Headline */}
      <div ref={headlineRef} className="my-auto py-12 relative z-10 will-change-transform">
        <h1
          id="hero-heading"
          className="font-display font-black leading-[0.88] tracking-tight text-[#d6cfc2] text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] select-none"
        >
          <div className="block">{HERO_DATA.headlineTop}</div>
          <div
            className="block mt-2 text-transparent"
            style={{
              WebkitTextStroke: '2px #d6cfc2',
            }}
          >
            {HERO_DATA.headlineBottom}
          </div>
        </h1>

        <p className="mt-8 max-w-2xl font-body text-lg sm:text-xl text-[#b7ad99] font-light leading-relaxed">
          {HERO_DATA.subtitle}
        </p>
      </div>

      {/* Bottom Row: Advance CTA & Doctrine Quote */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-8 border-t border-[#2a2723]/60 relative z-10">
        <button
          onClick={onAdvance}
          aria-label="Advance to the creed"
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <span className="w-10 h-10 rounded-full border border-[#2a2723] bg-[#12100e] flex items-center justify-center text-[#d6cfc2] group-hover:border-[#b4442e] group-hover:text-[#b4442e] transition-colors">
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </span>
          <span className="font-military text-xs tracking-[0.25em] text-[#b7ad99] group-hover:text-[#d6cfc2] transition-colors">
            ADVANCE
          </span>
        </button>

        <p className="font-military text-xs tracking-widest text-[#b7ad99]/60 max-w-md text-left sm:text-right">
          {HERO_DATA.doctrine}
        </p>
      </div>
    </section>
  );
};
