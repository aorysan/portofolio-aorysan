import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SmoothScroll, { useLenisContext } from '../components/SmoothScroll';

const TestChild = () => {
  const { scrollTo } = useLenisContext();
  return (
    <div>
      <span>Child rendered</span>
      <button onClick={() => scrollTo('#creed')}>Scroll CTA</button>
    </div>
  );
};

describe('SmoothScroll Component', () => {
  it('renders children with Lenis context provider', () => {
    render(
      <SmoothScroll enabled={true}>
        <TestChild />
      </SmoothScroll>
    );
    expect(screen.getByText('Child rendered')).toBeInTheDocument();
  });
});
