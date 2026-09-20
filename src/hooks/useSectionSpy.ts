import { useEffect, useRef } from 'react';

export function useSectionSpy(ids: string[], onActive: (index: number) => void): void {
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isCancelled = false;
    let cleanup: Array<() => void> = [];

    const init = async () => {
      try {
        const gsapMod = await import('gsap');
        const stMod = await import('gsap/ScrollTrigger');
        if (isCancelled) return;

        const gsap = (gsapMod as any).default ?? gsapMod;
        const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
        if (typeof window.matchMedia !== 'function' || !ScrollTrigger) throw new Error('no-st');

        ids.forEach((id, index) => {
          const trigger = document.getElementById(id);
          if (!trigger) return;
          const st = ScrollTrigger.create({
            trigger,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self: any) => {
              if (self.isActive && !isCancelled) onActiveRef.current(index);
            },
          });
          cleanup.push(() => st.kill());
        });
        if (cleanup.length > 0) return;
      } catch {
        /* fallback IO di bawah */
      }

      if (isCancelled || typeof IntersectionObserver === 'undefined') return;
      const ob = new IntersectionObserver(
        (entries) => {
          if (isCancelled) return;
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const i = ids.indexOf((e.target as HTMLElement).id);
              if (i >= 0 && !isCancelled) onActiveRef.current(i);
            }
          });
        },
        { rootMargin: '-45% 0px -45% 0px' }
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) ob.observe(el);
      });
      cleanup.push(() => ob.disconnect());
    };

    init();
    return () => {
      isCancelled = true;
      cleanup.forEach((fn) => fn());
    };
  }, [ids.join(','), onActive]);
}
