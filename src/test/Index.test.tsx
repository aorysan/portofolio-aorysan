import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import Index from '../pages/Index';

describe('Index Page Integration', () => {
  it('renders DarkFantasyShell directly without boot sequence blockers', () => {
    render(<Index />);
    // NOTE (Task 11 fix round): callsign and BEYOND each appear twice by contract
    // (header + footer; hero headline + vision horizon label), so queries are
    // disambiguated instead of mutating shipped copy.
    expect(screen.getAllByText(/Aryo A\.P/i)).toHaveLength(2);
    expect(
      within(document.getElementById('home') as HTMLElement).getByText('BEYOND')
    ).toBeInTheDocument();
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();
  });
});
