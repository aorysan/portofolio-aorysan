import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HUDNav from '../components/gamified/HUDNav';
import { SoundProvider } from '../components/gamified/SoundManager';

describe('HUDNav Component', () => {
  it('should display VALKYRIE TERMINAL brand and audio toggle button', () => {
    render(
      <SoundProvider>
        <HUDNav activePanel={null} onSelectPanel={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText(/VALKYRIE TERMINAL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle audio/i })).toBeInTheDocument();
  });

  it('should call onSelectPanel with null when clicking brand title', () => {
    const handleSelectPanel = vi.fn();
    render(
      <SoundProvider>
        <HUDNav activePanel="SYSTEM" onSelectPanel={handleSelectPanel} />
      </SoundProvider>
    );
    const brandBtn = screen.getByRole('button', { name: /valkyrie terminal/i });
    fireEvent.click(brandBtn);
    expect(handleSelectPanel).toHaveBeenCalledWith(null);
  });

  it('should toggle audio state when toggle audio button is clicked', () => {
    render(
      <SoundProvider>
        <HUDNav activePanel={null} onSelectPanel={vi.fn()} />
      </SoundProvider>
    );
    const toggleBtn = screen.getByRole('button', { name: /toggle audio/i });
    expect(screen.getByLabelText(/toggle audio/i)).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /toggle audio/i })).toBeInTheDocument();
  });

  it('should render network status indicator with sharp tactical dot and SYS_TIME clock', () => {
    const { container } = render(
      <SoundProvider>
        <HUDNav activePanel={null} onSelectPanel={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText('NET_ONLINE')).toBeInTheDocument();
    expect(screen.getByText(/SYS_TIME:/i)).toBeInTheDocument();
    const dot = container.querySelector('.bg-\\[\\#00FF88\\]');
    expect(dot).toBeInTheDocument();
    expect(dot).not.toHaveClass('rounded-full');
  });
});
