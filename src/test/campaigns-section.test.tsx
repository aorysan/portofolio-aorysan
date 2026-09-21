import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CampaignsSection } from '../components/dark-fantasy/CampaignsSection';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('CampaignsSection Integration', () => {
  it('renders campaign cards and opens dossier modal upon click', () => {
    render(
      <TactileSoundProvider>
        <CampaignsSection />
      </TactileSoundProvider>
    );
    expect(screen.getByText('KampungKu')).toBeInTheDocument();
    expect(screen.getByText('TrasMart')).toBeInTheDocument();

    const kampCard = screen.getByText('KampungKu').closest('[role="button"]');
    expect(kampCard).toBeInTheDocument();
    if (kampCard) fireEvent.click(kampCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
