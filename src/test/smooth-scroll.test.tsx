import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

describe('SmoothScroll Component', () => {
  it('renders children and exposes scrollTo, stop, start from context', () => {
    render(
      <SmoothScroll enabled={true}>
        <TestChild />
      </SmoothScroll>
    );
    expect(screen.getByText('Child rendered')).toBeInTheDocument();
    expect(screen.getByText('Stop Scroll')).toBeInTheDocument();
    expect(screen.getByText('Start Scroll')).toBeInTheDocument();
  });
});
