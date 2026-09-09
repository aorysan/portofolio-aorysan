import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BootSequence from '../components/gamified/BootSequence';

describe('BootSequence Component', () => {
  it('should render skip button and terminal prompt', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    expect(screen.getByRole('button', { name: /skip initialization/i })).toBeInTheDocument();
  });

  it('should trigger onComplete when Skip button is clicked', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    const skipBtn = screen.getByRole('button', { name: /skip initialization/i });
    fireEvent.click(skipBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
