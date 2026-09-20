import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CampaignsJourney } from '../components/dark-fantasy/CampaignsJourney';

describe('CampaignsDive', () => {
  it('renders four layers in chronological order', () => {
    render(<CampaignsJourney onOpenDossier={() => {}} />);
    const layers = document.querySelectorAll('[data-layer]');
    expect([...layers].map((l) => l.getAttribute('data-layer'))).toEqual(['sina', 'rose', 'maria', 'beyond']);
    expect(screen.getAllByText('WALL SINA').length).toBeGreaterThan(0);
    expect(screen.getByText('BEYOND THE WALLS')).toBeInTheDocument();
  });
});
