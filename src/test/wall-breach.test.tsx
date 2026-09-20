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
});
