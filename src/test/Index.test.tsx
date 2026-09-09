import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Index from '../pages/Index';

describe('Index Entry Page', () => {
  it('should initially show the boot sequence then advance to HUD dashboard upon skip', () => {
    render(<Index />);
    const skipBtn = screen.getByRole('button', { name: /skip initialization/i });
    expect(skipBtn).toBeInTheDocument();
    fireEvent.click(skipBtn);
    expect(screen.getByText(/COMMAND CENTER/i)).toBeInTheDocument();
  });
});
