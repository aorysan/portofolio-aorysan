import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreedSection } from '../components/dark-fantasy/CreedSection';

describe('CreedSection Component', () => {
  it('renders section title and creed quote', () => {
    render(<CreedSection />);
    expect(screen.getByText(/01 — THE CREED/i)).toBeInTheDocument();
    expect(screen.getByText(/I DEDICATE MY HEART/i)).toBeInTheDocument();
    expect(screen.getByText('YEARS ENLISTED')).toBeInTheDocument();
  });
});
