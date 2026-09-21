import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CampaignsJourney } from '../components/dark-fantasy/CampaignsJourney';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('CampaignsJourney Component (Phase 2)', () => {
  it('renders 3 wall zones + single Beyond finale with breach backdrops behind cards', () => {
    render(
      <TactileSoundProvider>
        <CampaignsJourney onOpenDossier={vi.fn()} />
      </TactileSoundProvider>
    );

    // NOTE(deviation from brief): 'WALL SINA' etc. appear multiple times by design
    // (zone h2 header + WallBreach h3 + project district badge), so getByText
    // throws "multiple elements". getAllByText preserves the brief's intent.
    expect(screen.getAllByText('WALL SINA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('WALL ROSE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('WALL MARIA').length).toBeGreaterThan(0);
    // Single Beyond finale copy — no duplicates.
    expect(screen.getAllByText('BEYOND THE WALLS').length).toBe(1);
    expect(screen.getByText(/EXPEDITION IN PROGRESS/i)).toBeInTheDocument();
    // Breach backdrops sit behind card layers so cards stay clickable.
    const breaches = [...document.querySelectorAll('[data-breach]')];
    const layers = [...document.querySelectorAll('[data-layer]')];
    expect(breaches.length).toBe(3);
    expect(layers.length).toBe(4);
    breaches.forEach((b) => {
      expect(b.className).toContain('z-0');
    });
    layers.forEach((l) => {
      expect(l.className).toContain('z-10');
    });
  });
});
