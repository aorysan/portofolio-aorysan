import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmberCanvas } from '../components/dark-fantasy/EmberCanvas';

describe('EmberCanvas Component', () => {
  it('renders a fixed background canvas element', () => {
    const { container } = render(<EmberCanvas count={30} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas?.className).toContain('pointer-events-none');
  });
});
