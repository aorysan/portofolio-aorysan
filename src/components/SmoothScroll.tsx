import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
  refreshTriggers: () => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
  refreshTriggers: () => {},
});

export const useLenisContext = () => useContext(LenisContext);

const scrollToTarget = (target: string | HTMLElement) => {
  let el: Element | null = null;
  if (typeof target === 'string') {
    try {
      el = document.querySelector(target);
    } catch {
      return;
    }
  } else {
    el = target;
  }
  if (el && typeof (el as HTMLElement).scrollIntoView === 'function') {
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    (el as HTMLElement).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
};

export default function SmoothScroll({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof ResizeObserver === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger per Spec §2.2
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleLoad = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* no-op in test/jsdom */
      }
    };
    window.addEventListener('load', handleLoad);
    if ('fonts' in document && typeof document.fonts.ready?.then === 'function') {
      document.fonts.ready.then(handleLoad).catch(() => {});
    }
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const scrollTo = useCallback((target: string | HTMLElement, options?: Record<string, unknown>) => {
    try {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { duration: 1.4, ...(options ?? {}) });
        return;
      }
    } catch { /* jatuh ke fallback */ }
    if (typeof target === 'string' || target instanceof HTMLElement) {
      scrollToTarget(target);
    }
  }, []);

  const refreshTriggers = useCallback(() => {
    try { ScrollTrigger.refresh(); } catch { /* abaikan di jsdom */ }
  }, []);

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo, stop, start, refreshTriggers }}>
      {children}
    </LenisContext.Provider>
  );
}
