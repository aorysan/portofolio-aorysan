import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextScramble } from '../components/dark-fantasy/TextScramble';

describe('TextScramble Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders target text with accessible aria-label', () => {
    render(<TextScramble text="01 — THE CREED" as="h2" />);
    const el = screen.getByLabelText('01 — THE CREED');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('H2');
  });

  it('eventually resolves to target text after duration', () => {
    render(<TextScramble text="SURVEY CORPS" duration={300} />);
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(screen.getByText('SURVEY CORPS')).toBeInTheDocument();
  });
});
