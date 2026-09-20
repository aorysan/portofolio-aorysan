import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import ChamferedPanel from '../components/gamified/ChamferedPanel';
import GlitchText from '../components/gamified/GlitchText';
import StatBar from '../components/gamified/StatBar';
import { useTypewriter } from '../hooks/useTypewriter';

describe('Tactical UI Primitives', () => {
  it('should render ChamferedPanel with chamfer class and child content', () => {
    const { container } = render(
      <ChamferedPanel size="md" glow="green" data-testid="panel">
        <div>Terminal Data</div>
      </ChamferedPanel>
    );
    expect(screen.getByText('Terminal Data')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('chamfer');
    expect(container.firstChild).toHaveClass('glow-green');
  });

  it('should render GlitchText with text attribute', () => {
    render(<GlitchText text="SYSTEM ACTIVE" as="h1" />);
    expect(screen.getByText('SYSTEM ACTIVE')).toBeInTheDocument();
  });

  it('should render StatBar with proper label and percentage', () => {
    const { unmount } = render(<StatBar label="Architecture" value={85} color="#00D4FF" />);
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
  });

  it('should run useTypewriter and call onComplete once without duplicate calls on rerender', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { result, rerender } = renderHook(
      ({ lines, cb }) => useTypewriter(lines, 10, 50, cb),
      { initialProps: { lines: ['Hi'], cb: onComplete } }
    );

    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(50);
      });
    }

    expect(result.current.isFinished).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Re-render with new array and new callback
    rerender({ lines: ['Hi'], cb: vi.fn() });
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
