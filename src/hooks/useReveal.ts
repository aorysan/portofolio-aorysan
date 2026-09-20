import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(selector: string) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'function' || !ref.current) return;
    const ctx = gsap.context(() => {
      const targets = (ref.current as unknown as HTMLElement).querySelectorAll(selector);
      const list = targets.length > 0 ? targets : [ref.current];
      gsap.fromTo(list, { opacity: 0, y: 28, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current, start: 'top 85%', end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion, selector]);
  return ref;
}
