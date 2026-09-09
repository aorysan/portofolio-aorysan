import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HUDDashboard from '../components/gamified/HUDDashboard';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('HUDDashboard Component', () => {
  it('should render all 4 tactical operation cards', () => {
    render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONS LOG')).toBeInTheDocument();
    expect(screen.getByText('TECH ARSENAL')).toBeInTheDocument();
    expect(screen.getByText('COMMS RELAY')).toBeInTheDocument();
  });

  it('should open section when card is clicked', () => {
    render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    const dossierBtn = screen.getByRole('button', { name: /pilot dossier/i });
    fireEvent.click(dossierBtn);
    expect(screen.getByText(/APTITUDE MATRIX/i)).toBeInTheDocument();
  });

  it('should return to overview when Escape key is pressed', () => {
    render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    const dossierBtn = screen.getByRole('button', { name: /pilot dossier/i });
    fireEvent.click(dossierBtn);
    expect(screen.getByText(/APTITUDE MATRIX/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
  });

  it('should return to overview when panel return button is clicked', () => {
    render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    const dossierBtn = screen.getByRole('button', { name: /pilot dossier/i });
    fireEvent.click(dossierBtn);
    expect(screen.getByText(/APTITUDE MATRIX/i)).toBeInTheDocument();

    const returnBtn = screen.getByRole('button', { name: /RETURN TO HUD/i });
    fireEvent.click(returnBtn);
    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
  });
});
