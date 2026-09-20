import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CampaignsJourney } from '../components/dark-fantasy/CampaignsJourney';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('CampaignsJourney Component (Phase 2)', () => {
  it('renders all 3 wall breach sections and beyond horizon marker', () => {
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
    expect(screen.getByText(/EXPEDITION IN PROGRESS/i)).toBeInTheDocument();
  });
});
