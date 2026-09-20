import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArsenalSection } from '../components/dark-fantasy/ArsenalSection';

describe('ArsenalSection Component', () => {
  it('renders the 4 arsenal quadrants and skills', () => {
    render(<ArsenalSection />);
    expect(screen.getByText(/02 — THE ARSENAL/i)).toBeInTheDocument();
    expect(screen.getByText('FRONTEND VERTICAL MANEUVER')).toBeInTheDocument();
    expect(screen.getByText('SYSTEMS & ARCHITECTURE')).toBeInTheDocument();
    expect(screen.getByText('INTERFACE RECONNAISSANCE')).toBeInTheDocument();
    expect(screen.getByText('PERFORMANCE WARFARE')).toBeInTheDocument();
  });
});
