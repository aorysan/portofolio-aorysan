import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSection } from '../components/dark-fantasy/HeroSection';

describe('HeroSection Component', () => {
  it('renders with semantic aria-labelledby on home section', () => {
    render(<HeroSection onAdvance={() => {}} />);
    const section = document.getElementById('home');
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    expect(screen.getByText('BEYOND')).toBeInTheDocument();
  });
});
