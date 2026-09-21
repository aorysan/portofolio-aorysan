import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TacticalHeader } from '../components/dark-fantasy/TacticalHeader';
import { NavRail } from '../components/dark-fantasy/NavRail';

describe('Tactical Header & Navigation Rail A11y', () => {
  it('includes aria-pressed on the audio toggle', () => {
    render(
      <TacticalHeader
        isMuted={false}
        onToggleAudio={vi.fn()}
      />
    );

    const audioBtn = screen.getByRole('button', { name: /mute tactical audio/i });
    expect(audioBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks the active nav item with aria-current="true"', () => {
    render(<NavRail activeIndex={2} onSelectSection={vi.fn()} />);
    const activeBtn = screen.getByRole('button', { name: /jump to section arsenal/i });
    expect(activeBtn).toHaveAttribute('aria-current', 'true');
  });
});
