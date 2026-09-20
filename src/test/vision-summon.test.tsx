import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisionSection } from '../components/dark-fantasy/VisionSection';
import { SummonSection } from '../components/dark-fantasy/SummonSection';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Vision & Summon Sections Polish', () => {
  it('renders VisionSection with semantic aria-labelledby', () => {
    render(<VisionSection />);
    const section = document.getElementById('vision');
    expect(section).toHaveAttribute('aria-labelledby', 'vision-heading');
  });

  it('renders SummonSection with minLength and maxLength validation on report', () => {
    render(
      <TactileSoundProvider>
        <SummonSection />
      </TactileSoundProvider>
    );
    const textarea = screen.getByPlaceholderText(/describe the terrain/i);
    expect(textarea).toHaveAttribute('minLength', '10');
    expect(textarea).toHaveAttribute('maxLength', '2000');
  });
});

describe('Vision video', () => {
  it('renders muted looping video with poster over storm overlay', () => {
    render(<VisionSection />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('muted');
    expect(video?.querySelector('source')?.getAttribute('src')).toContain('vision-sea-loop');
    expect(document.querySelector('.vision-storm-overlay')).toBeInTheDocument();
  });

  it('falls back to poster image when video triggers onError', () => {
    render(<VisionSection />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    fireEvent.error(video!);
    expect(document.querySelector('video')).toBeNull();
    const posterImg = document.querySelector('img');
    expect(posterImg).toBeInTheDocument();
    expect(posterImg?.getAttribute('src')).toContain('vision-sea-poster.jpg');
    expect(posterImg).toHaveAttribute('aria-hidden', 'true');
  });

  it('falls back to poster image when reduced motion is preferred', () => {
    const originalMatchMedia = window.matchMedia;
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

    try {
      render(<VisionSection />);
      expect(document.querySelector('video')).toBeNull();
      const posterImg = document.querySelector('img');
      expect(posterImg).toBeInTheDocument();
      expect(posterImg?.getAttribute('src')).toContain('vision-sea-poster.jpg');
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('renders horizon items with horizon-item class for ScrollTrigger reveal', () => {
    render(<VisionSection />);
    const items = document.querySelectorAll('.horizon-item');
    expect(items.length).toBe(3);
  });
});
