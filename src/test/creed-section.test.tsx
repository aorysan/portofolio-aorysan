import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import gsap from 'gsap';
import { CreedSection } from '../components/dark-fantasy/CreedSection';

describe('CreedSection Component', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let originalInnerWidth: number;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;
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
    window.innerWidth = originalInnerWidth;
    vi.restoreAllMocks();
  });

  it('renders section heading and semantic section with aria-labelledby', () => {
    render(<CreedSection />);
    const section = document.getElementById('creed');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'creed-heading');
    // NOTE (Task 6 deviation): brief verbatim `getByLabelText('01 — THE CREED')`
    // matches TWICE once the linkage is correct — the <section> (via
    // aria-labelledby resolution) and the <span id="creed-heading"> (via
    // aria-label). Disambiguate with selector; asserts the same heading node.
    expect(
      screen.getByLabelText('01 — THE CREED', { selector: '#creed-heading' })
    ).toBeInTheDocument();
  });

  it('completes all creed words on creed:complete event', async () => {
    const toSpy = vi.spyOn(gsap, 'to');
    render(<CreedSection />);
    window.dispatchEvent(new CustomEvent('creed:complete'));
    const words = document.querySelectorAll('.creed-word');
    expect(words.length).toBeGreaterThan(5);
    expect(toSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ opacity: 1, duration: 0.3, overwrite: true })
    );
  });

  it('configures enter-play ScrollTrigger without pin or scrub', () => {
    const fromToSpy = vi.spyOn(gsap, 'fromTo');
    render(<CreedSection />);
    expect(fromToSpy).toHaveBeenCalledWith(
      expect.anything(),
      { opacity: 0.15 },
      expect.objectContaining({
        opacity: 1,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power1.out',
        scrollTrigger: expect.objectContaining({
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }),
      })
    );
    const callArgs = fromToSpy.mock.calls[0]?.[2] as
      | { scrollTrigger?: { pin?: unknown; scrub?: unknown } }
      | undefined;
    expect(callArgs?.scrollTrigger?.pin).toBeUndefined();
    expect(callArgs?.scrollTrigger?.scrub).toBeUndefined();
  });

  it('registers listener and animates even on mobile viewport (<768px)', async () => {
    window.innerWidth = 375;
    const toSpy = vi.spyOn(gsap, 'to');
    render(<CreedSection />);
    window.dispatchEvent(new CustomEvent('creed:complete'));
    expect(toSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ opacity: 1, duration: 0.3, overwrite: true })
    );
  });

  it('removes creed:complete event listener on unmount', () => {
    const toSpy = vi.spyOn(gsap, 'to');
    const { unmount } = render(<CreedSection />);
    unmount();
    window.dispatchEvent(new CustomEvent('creed:complete'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('falls back to setting inline style opacity if gsap.to throws', () => {
    vi.spyOn(gsap, 'to').mockImplementation(() => {
      throw new Error('GSAP error');
    });
    render(<CreedSection />);
    window.dispatchEvent(new CustomEvent('creed:complete'));
    const words = document.querySelectorAll('.creed-word');
    expect((words[0] as HTMLElement).style.opacity).toBe('1');
  });

  it('respects reduced motion by skipping animations and keeping opacity 1', () => {
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
    const toSpy = vi.spyOn(gsap, 'to');
    render(<CreedSection />);
    window.dispatchEvent(new CustomEvent('creed:complete'));
    expect(fromToSpy).not.toHaveBeenCalled();
    expect(toSpy).not.toHaveBeenCalled();
    const words = document.querySelectorAll('.creed-word');
    expect((words[0] as HTMLElement).style.opacity).toBe('1');
  });
});
