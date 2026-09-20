import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DarkFantasyShell } from '../components/dark-fantasy/DarkFantasyShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';
import { useSectionSpy } from '../hooks/useSectionSpy';

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
