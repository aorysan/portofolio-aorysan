import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import gsap from 'gsap';
import { DarkFantasyShell } from '../components/dark-fantasy/DarkFantasyShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';
import { useSectionSpy } from '../hooks/useSectionSpy';
import { useReveal } from '../hooks/useReveal';
import { SummonSection } from '../components/dark-fantasy/SummonSection';

describe('scroll foundation: advance always scrolls', () => {
  it('dispatches creed:complete and moves focus when ADVANCE clicked twice', async () => {
    render(
      <TactileSoundProvider>
        <DarkFantasyShell />
      </TactileSoundProvider>
    );
    const spy = vi.fn();
    window.addEventListener('creed:complete', spy);

    try {
      const btn = screen.getByRole('button', { name: /advance to the creed/i });
      fireEvent.click(btn);
      fireEvent.click(btn); // klik kedua dengan index sama harus tetap dispatch

      expect(spy).toHaveBeenCalledTimes(2);

      await new Promise((resolve) => requestAnimationFrame(resolve));
      const heading = document.getElementById('creed-heading');
      expect(document.activeElement).toBe(heading);
      expect(heading?.getAttribute('tabindex')).toBe('-1');
    } finally {
      window.removeEventListener('creed:complete', spy);
    }
  });
});

describe('useSectionSpy hook', () => {
  it('observes section elements and notifies onActive via fallback', async () => {
    document.body.innerHTML = `
      <div id="home"></div>
      <div id="creed"></div>
      <div id="arsenal"></div>
    `;

    let observerCb: ((entries: Array<{ target: Element; isIntersecting: boolean }>) => void) | undefined;
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();

    const originalIO = (globalThis as any).IntersectionObserver;
    (globalThis as any).IntersectionObserver = class {
      constructor(cb: any) {
        observerCb = cb;
      }
      observe = observeSpy;
      disconnect = disconnectSpy;
      unobserve = vi.fn();
    };

    const onActive = vi.fn();
    const { unmount } = renderHook(() =>
      useSectionSpy(['home', 'creed', 'arsenal'], onActive)
    );

    // Wait for async init()
    await vi.waitFor(() => {
      expect(observeSpy).toHaveBeenCalledTimes(3);
    });

    // Simulate intersecting creed
    observerCb!([{ target: document.getElementById('creed')!, isIntersecting: true }]);
    expect(onActive).toHaveBeenCalledWith(1);

    unmount();
    expect(disconnectSpy).toHaveBeenCalled();

    (globalThis as any).IntersectionObserver = originalIO;
  });

  it('does not leak or create observers if unmounted before init resolves', async () => {
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();
    const originalIO = (globalThis as any).IntersectionObserver;
    (globalThis as any).IntersectionObserver = class {
      observe = observeSpy;
      disconnect = disconnectSpy;
      unobserve = vi.fn();
    };

    const onActive = vi.fn();
    const { unmount } = renderHook(() =>
      useSectionSpy(['home', 'creed'], onActive)
    );
    unmount(); // immediately unmount before async dynamic import completes

    await new Promise((r) => setTimeout(r, 50));
    expect(observeSpy).not.toHaveBeenCalled();

    (globalThis as any).IntersectionObserver = originalIO;
  });
});

describe('useReveal hook & reversible animations', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  const TestRevealComp: React.FC<{ selector?: string; items?: string[] }> = ({
    selector = '.reveal-item',
    items = ['item1', 'item2'],
  }) => {
    const ref = useReveal<HTMLDivElement>(selector);
    return (
      <div ref={ref} data-testid="container">
        {items.map((it) => (
          <div key={it} className={it.startsWith('nomatch') ? '' : 'reveal-item'}>
            {it}
          </div>
        ))}
      </div>
    );
  };

  it('configures reversible enter animation with toggleActions play none none reverse', () => {
    const fromToSpy = vi.spyOn(gsap, 'fromTo');
    render(<TestRevealComp />);

    expect(fromToSpy).toHaveBeenCalledWith(
      expect.anything(),
      { opacity: 0, y: 28, scale: 0.98 },
      expect.objectContaining({
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: expect.objectContaining({
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        }),
      })
    );
  });

  it('falls back to container element if selector matches no elements', () => {
    const fromToSpy = vi.spyOn(gsap, 'fromTo');
    const { getByTestId } = render(<TestRevealComp selector=".nonexistent" />);
    const container = getByTestId('container');

    expect(fromToSpy).toHaveBeenCalledWith(
      [container],
      expect.anything(),
      expect.anything()
    );
  });

  it('bypasses animation when prefers-reduced-motion is active', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const fromToSpy = vi.spyOn(gsap, 'fromTo');
    render(<TestRevealComp />);
    expect(fromToSpy).not.toHaveBeenCalled();
  });

  it('reverts GSAP context on unmount', () => {
    const contextSpy = vi.spyOn(gsap, 'context');
    const { unmount } = render(<TestRevealComp />);
    expect(contextSpy).toHaveBeenCalled();
    const ctx = contextSpy.mock.results[0]?.value;
    const revertSpy = vi.spyOn(ctx, 'revert');
    unmount();
    expect(revertSpy).toHaveBeenCalled();
  });

  it('SummonSection integrates useReveal with .summon-block and 2 columns', () => {
    const fromToSpy = vi.spyOn(gsap, 'fromTo');
    render(
      <TactileSoundProvider>
        <SummonSection />
      </TactileSoundProvider>
    );

    const blocks = document.querySelectorAll('.summon-block');
    expect(blocks.length).toBe(2);

    expect(fromToSpy).toHaveBeenCalledWith(
      expect.anything(),
      { opacity: 0, y: 28, scale: 0.98 },
      expect.objectContaining({
        scrollTrigger: expect.objectContaining({
          toggleActions: 'play none none reverse',
          start: 'top 85%',
          end: 'bottom 15%',
        }),
      })
    );
  });
});
