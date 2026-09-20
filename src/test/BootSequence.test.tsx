import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BootSequence from '../components/gamified/BootSequence';
import * as soundHook from '@/hooks/useSoundEffect';

describe('BootSequence Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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

  it('should trigger onComplete on Escape keydown only once', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('should prevent default on Space keydown and trigger onComplete once', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    act(() => {
      window.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('should not double-invoke onComplete when skip button is activated via Enter key', () => {
    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    const skipBtn = screen.getByRole('button', { name: /skip initialization/i });
    skipBtn.focus();
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.click(skipBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('should play BOOT_COMPLETE and not play BOOT_TYPE when skip is clicked', () => {
    const playType = vi.fn();
    const playDone = vi.fn();
    vi.spyOn(soundHook, 'useSoundEffect').mockImplementation((key) => {
      if (key === 'BOOT_TYPE') return { play: playType, isMuted: false };
      return { play: playDone, isMuted: false };
    });

    const handleComplete = vi.fn();
    render(<BootSequence onComplete={handleComplete} />);
    const skipBtn = screen.getByRole('button', { name: /skip initialization/i });
    fireEvent.click(skipBtn);

    expect(playDone).toHaveBeenCalledTimes(1);
    expect(playType).not.toHaveBeenCalled();
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
