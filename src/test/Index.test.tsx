import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Index from '../pages/Index';

describe('Index Page Integration', () => {
  it('renders DarkFantasyShell directly without boot sequence blockers', () => {
    render(<Index />);
    expect(screen.getByText(/Aryo A\.P/i)).toBeInTheDocument();
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
  });
});
