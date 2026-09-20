import React, { useEffect, useRef, useState } from 'react';
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
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = !reducedMotion && !videoFailed;

  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const videoSrc = `${normalizedBase}videos/vision-sea-loop.mp4`;
  const posterSrc = `${normalizedBase}videos/vision-sea-poster.jpg`;

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

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

      // Inline ScrollTrigger reveal for .horizon-item with toggleActions: 'play none none reverse'
      const items = containerRef.current?.querySelectorAll<HTMLElement>('.horizon-item');
      items?.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse',
            },
          }
        );
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

      {showVideo ? (
        <video
          ref={(el) => {
            if (el) el.setAttribute('muted', '');
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-25 pointer-events-none"
        >
          <source src={videoSrc} type="video/mp4" onError={() => setVideoFailed(true)} />
        </video>
      ) : (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-25 pointer-events-none"
        />
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0a0908] via-[#0a0908]/40 to-[#0a0908]" />

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
          <div key={h.label} className="horizon-item border-l-2 border-[#b4442e] pl-4">
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
