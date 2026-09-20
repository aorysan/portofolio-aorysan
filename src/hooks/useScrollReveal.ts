import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        setRevealed(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, revealed };
}
