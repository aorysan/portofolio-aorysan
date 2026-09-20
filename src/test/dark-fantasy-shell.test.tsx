import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText(/Aryo A\.P/i)).toBeInTheDocument();
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();

    const modeBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    fireEvent.click(modeBtn);
    expect(screen.getByText(/CHAPTER SNAP/i)).toHaveClass('text-[#b4442e]');
  });
});
