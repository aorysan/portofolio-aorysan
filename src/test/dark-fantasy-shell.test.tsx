import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DarkFantasyShell } from '../components/dark-fantasy/DarkFantasyShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('DarkFantasyShell Integration', () => {
  it('renders all sections as one continuous page', () => {
    render(
      <TactileSoundProvider>
        <DarkFantasyShell />
      </TactileSoundProvider>
    );
    // The callsign appears twice by contract (header sr-only hook + footer sign-off)
    // and BEYOND appears twice by contract (hero monument headline + vision horizon
    // label), so bare getByText throws. Scoped/count assertions are strictly stronger.
    expect(screen.getAllByText(/Aryo A\.P/i)).toHaveLength(2);
    expect(
      screen.getByText(/ARYO A\.P — DEDICATE YOUR HEART/i)
    ).toBeInTheDocument();
    expect(
      within(document.getElementById('home') as HTMLElement).getByText('BEYOND')
    ).toBeInTheDocument();
    expect(
      within(document.getElementById('vision') as HTMLElement).getByText('BEYOND')
    ).toBeInTheDocument();
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();
  });

  it('navigates to the creed when the hero advance button is clicked', () => {
    render(
      <TactileSoundProvider>
        <DarkFantasyShell />
      </TactileSoundProvider>
    );
    const advanceBtn = screen.getByRole('button', { name: /advance to the creed/i });
    fireEvent.click(advanceBtn);
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();
  });
});
