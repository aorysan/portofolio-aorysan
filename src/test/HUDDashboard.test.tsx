import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HUDDashboard from '../components/gamified/HUDDashboard';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('HUDDashboard Component', () => {
  it('should render all 4 tactical operation cards with proper button type and main-content id', () => {
    const { container } = render(
      <SoundProvider>
        <HUDDashboard />
      </SoundProvider>
    );
    const mainEl = container.querySelector('main#main-content');
    expect(mainEl).toBeInTheDocument();

    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONS LOG')).toBeInTheDocument();
    expect(screen.getByText('TECH ARSENAL')).toBeInTheDocument();
    expect(screen.getByText('COMMS RELAY')).toBeInTheDocument();

    const buttons = [
      screen.getByRole('button', { name: /open pilot dossier/i }),
      screen.getByRole('button', { name: /open operations log/i }),
      screen.getByRole('button', { name: /open tech arsenal/i }),
      screen.getByRole('button', { name: /open comms relay/i }),
    ];
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button');
    });

    expect(screen.getByRole('heading', { level: 1, name: /ARYO ADI PUTRO/i })).toBeInTheDocument();
    expect(screen.getByText(/VALKYRIE TERMINAL \/\/ ALL SYSTEMS OPERATIONAL/i)).toBeInTheDocument();
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
