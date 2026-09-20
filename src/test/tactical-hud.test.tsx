import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TacticalHeader } from '../components/dark-fantasy/TacticalHeader';
import { NavRail } from '../components/dark-fantasy/NavRail';

describe('Tactical Header & Navigation Rail', () => {
  it('renders Aryo A.P and mode switcher in header', () => {
    const handleModeToggle = vi.fn();
    render(
      <TacticalHeader
        mode="fluid"
        onToggleMode={handleModeToggle}
        isMuted={false}
        onToggleAudio={vi.fn()}
      />
    );
    expect(screen.getByText(/Aryo A\.P/i)).toBeInTheDocument();
    expect(screen.getByText(/FLUID SCROLL/i)).toBeInTheDocument();
    const toggleBtn = screen.getByRole('button', { name: /switch navigation mode/i });
    fireEvent.click(toggleBtn);
    expect(handleModeToggle).toHaveBeenCalled();
  });

  it('renders all 6 navigation rail items', () => {
    render(<NavRail activeIndex={0} onSelectSection={vi.fn()} />);
    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });
});
