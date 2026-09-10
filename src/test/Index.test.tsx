import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Index from '../pages/Index';

describe('Index Page Integration', () => {
  it('renders Dossier portfolio shell directly without boot sequence blockers', () => {
    render(<Index />);
    expect(screen.getByTestId('dossier-shell')).toBeDefined();
    expect(screen.getByTestId('tab-berkas')).toBeDefined();
  });
});

