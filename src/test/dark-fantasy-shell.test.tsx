import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DarkFantasyShell } from '../components/dark-fantasy/DarkFantasyShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('DarkFantasyShell Integration', () => {
  it('renders all sections and toggles navigation mode', () => {
    render(
      <TactileSoundProvider>
        <DarkFantasyShell />
      </TactileSoundProvider>
    );
    // NOTE (Task 11 fix round): deviates from the brief's exact queries on purpose.
    // The callsign appears twice by contract (header sr-only hook + footer sign-off)
    // and BEYOND appears twice by contract (hero monument headline + vision horizon
    // label), so bare getByText throws. Scoped/count assertions are strictly stronger
    // and preserve the Task 5/8/10 product copy verbatim.
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

    const modeBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    fireEvent.click(modeBtn);
    expect(screen.getByText(/CHAPTER SNAP/i)).toHaveClass('text-[#b4442e]');
  });
});
