import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroSection } from '../components/dark-fantasy/HeroSection';

describe('HeroSection Component', () => {
  it('renders BEYOND THE WALLS monument and advance button', () => {
    render(<HeroSection onAdvance={vi.fn()} />);
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
    expect(screen.getByText('THE WALLS')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /advance to the creed/i })).toBeInTheDocument();
  });
});
