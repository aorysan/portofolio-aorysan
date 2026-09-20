import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SmoothScroll, { useLenisContext } from '../components/SmoothScroll';

const TestChild = () => {
  const { scrollTo, stop, start } = useLenisContext();
  return (
    <div>
      <span>Child rendered</span>
      <button onClick={() => scrollTo('#creed')}>Scroll CTA</button>
      <button onClick={stop}>Stop Scroll</button>
      <button onClick={start}>Start Scroll</button>
    </div>
  );
};

const Probe = () => {
  const { scrollTo } = useLenisContext();
  return <button onClick={() => scrollTo('#creed')}>Go</button>;
};

describe('SmoothScroll Component', () => {
  it('renders children and exposes scrollTo, stop, start, refreshTriggers from context', () => {
    render(
      <SmoothScroll enabled={false}>
        <TestChild />
      </SmoothScroll>
    );
    expect(screen.getByText('Child rendered')).toBeInTheDocument();
    expect(screen.getByText('Stop Scroll')).toBeInTheDocument();
    expect(screen.getByText('Start Scroll')).toBeInTheDocument();
  });
});

describe('SmoothScroll fallback', () => {
  it('calls scrollIntoView on the target element when lenis is absent', () => {
    document.body.innerHTML = '<section id="creed"></section>';
    const spy = vi.fn();
    (HTMLElement.prototype as any).scrollIntoView = spy;
    render(<SmoothScroll enabled={false}><Probe /></SmoothScroll>);
    fireEvent.click(screen.getByText('Go'));
    expect(spy).toHaveBeenCalled();
  });

  it('uses auto behavior when prefers-reduced-motion is active', () => {
    document.body.innerHTML = '<section id="creed"></section>';
    const spy = vi.fn();
    (HTMLElement.prototype as any).scrollIntoView = spy;

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      render(<SmoothScroll enabled={false}><Probe /></SmoothScroll>);
      fireEvent.click(screen.getByText('Go'));
      expect(spy).toHaveBeenCalledWith({ behavior: 'auto' });
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('stabilizes scrollTo reference across re-renders via useCallback', () => {
    const references: Array<(target: string | HTMLElement, options?: Record<string, unknown>) => void> = [];
    const StabilityProbe = () => {
      const { scrollTo } = useLenisContext();
      references.push(scrollTo);
      return <div>Probe</div>;
    };

    const { rerender } = render(
      <SmoothScroll enabled={false}>
        <StabilityProbe />
      </SmoothScroll>
    );

    rerender(
      <SmoothScroll enabled={false}>
        <StabilityProbe />
      </SmoothScroll>
    );

    expect(references.length).toBe(2);
    expect(references[0]).toBe(references[1]);
  });

  it('provides safe refreshTriggers function that does not throw', () => {
    let capturedRefresh: (() => void) | undefined;
    const RefreshProbe = () => {
      const { refreshTriggers } = useLenisContext();
      capturedRefresh = refreshTriggers;
      return <div>Refresh</div>;
    };

    render(
      <SmoothScroll enabled={false}>
        <RefreshProbe />
      </SmoothScroll>
    );

    expect(typeof capturedRefresh).toBe('function');
    expect(() => capturedRefresh!()).not.toThrow();
  });
});


