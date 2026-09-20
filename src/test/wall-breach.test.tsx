import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WallBreach } from '../components/dark-fantasy/WallBreach';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('WallBreach Component', () => {
  it('renders wall name and fortification barrier', () => {
    render(
      <TactileSoundProvider>
        <WallBreach wallName="WALL SINA" zoneLabel="INTERIOR PERIMETER" />
      </TactileSoundProvider>
    );
    expect(screen.getByText('WALL SINA')).toBeInTheDocument();
    expect(screen.getByText('INTERIOR PERIMETER')).toBeInTheDocument();
  });

  it('applies progress style without breaking isBreached contract', () => {
    render(<WallBreach wallName="WALL SINA" zoneLabel="X" isBreached />);
    expect(screen.getByText('BREACH ENGAGED')).toBeInTheDocument();
  });

  it('applies crack opacity based on progress prop', () => {
    const { container } = render(
      <WallBreach wallName="WALL SINA" zoneLabel="X" progress={0.4} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: '0.4' });
  });

  it('clamps progress between 0 and 1', () => {
    const { container, rerender } = render(
      <WallBreach wallName="WALL SINA" zoneLabel="X" progress={1.5} />
    );
    let svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: '1' });

    rerender(<WallBreach wallName="WALL SINA" zoneLabel="X" progress={-0.2} />);
    svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: '0' });
  });
});

