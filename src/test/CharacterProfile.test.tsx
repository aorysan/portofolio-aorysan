import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterProfile from '../components/gamified/CharacterProfile';

describe('CharacterProfile Component', () => {
  it('should render pilot identity and service record metrics', () => {
    render(<CharacterProfile onClose={vi.fn()} />);
    expect(screen.getByText('PILOT DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('ARYO ADI PUTRO')).toBeInTheDocument();
    expect(screen.getByText('SERVICE RECORD')).toBeInTheDocument();
  });

  it('should call onClose when clicking return button', () => {
    const handleClose = vi.fn();
    render(<CharacterProfile onClose={handleClose} />);
    const returnButton = screen.getByRole('button', { name: /RETURN TO HUD/i });
    fireEvent.click(returnButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render aptitude matrix, service records, and deployment logs', () => {
    render(<CharacterProfile onClose={vi.fn()} />);
    expect(screen.getByText(/APTITUDE MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('Problem Solving')).toBeInTheDocument();
    expect(screen.getByText('2+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText(/DEPLOYMENT LOG/i)).toBeInTheDocument();
    expect(screen.getByText('Tactical Foundations')).toBeInTheDocument();
    expect(screen.getByText('Combat Ready')).toBeInTheDocument();
  });
});
