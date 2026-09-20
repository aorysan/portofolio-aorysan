import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import gsap from 'gsap';
import { ArsenalSection } from '../components/dark-fantasy/ArsenalSection';

describe('ArsenalSection Component', () => {
  it('renders the 4 arsenal quadrants and skills', () => {
    render(<ArsenalSection />);
    expect(screen.getByText(/02 — THE ARSENAL/i)).toBeInTheDocument();
    expect(screen.getByText('FRONTEND VERTICAL MANEUVER')).toBeInTheDocument();
    expect(screen.getByText('SYSTEMS & ARCHITECTURE')).toBeInTheDocument();
    expect(screen.getByText('INTERFACE RECONNAISSANCE')).toBeInTheDocument();
    expect(screen.getByText('PERFORMANCE WARFARE')).toBeInTheDocument();
  });
});

describe('reveal', () => {
  it('renders arsenal cards visible without JS animation (guard)', () => {
    render(<ArsenalSection />);
    expect(document.querySelectorAll('.arsenal-card').length).toBe(4);
  });

  it('configures reversible enter animation with toggleActions play none none reverse', () => {
    const originalMatchMedia = window.matchMedia;
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
    const fromToSpy = vi.spyOn(gsap, 'fromTo');
    try {
      render(<ArsenalSection />);
      expect(fromToSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ opacity: 0 }),
        expect.objectContaining({
          opacity: 1,
          scrollTrigger: expect.objectContaining({
            toggleActions: 'play none none reverse',
            start: 'top 85%',
            end: 'bottom 15%',
          }),
        })
      );
    } finally {
      window.matchMedia = originalMatchMedia;
      vi.restoreAllMocks();
    }
  });
});
