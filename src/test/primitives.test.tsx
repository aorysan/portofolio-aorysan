import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChamferedPanel from '../components/gamified/ChamferedPanel';
import GlitchText from '../components/gamified/GlitchText';
import StatBar from '../components/gamified/StatBar';

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
    render(<StatBar label="Architecture" value={85} color="#00D4FF" />);
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
