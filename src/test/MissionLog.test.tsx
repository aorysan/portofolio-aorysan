import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MissionLog from '../components/gamified/MissionLog';
import MissionCard from '../components/gamified/MissionCard';
import { SoundProvider } from '../components/gamified/SoundManager';
import { MISSIONS_DATA } from '../lib/constants';

describe('MissionLog Component', () => {
  it('should render mission titles and difficulty diamonds', () => {
    render(
      <SoundProvider>
        <MissionLog onClose={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText('OPERATIONS LOG')).toBeInTheDocument();
    expect(screen.getByText('KampungKu')).toBeInTheDocument();
    expect(screen.getByText('Rest Area Business - Idle Tycoon Game')).toBeInTheDocument();
  });

  it('should call onClose when clicking return button', () => {
    const handleClose = vi.fn();
    render(
      <SoundProvider>
        <MissionLog onClose={handleClose} />
      </SoundProvider>
    );
    const returnBtn = screen.getByRole('button', { name: /RETURN TO HUD/i });
    fireEvent.click(returnBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render mission card with difficulty, tags, and links', () => {
    const mission = MISSIONS_DATA[1]; // Rest Area Tycoon (has repoLink, liveLink, thumbnail)
    render(
      <SoundProvider>
        <MissionCard mission={mission} />
      </SoundProvider>
    );

    expect(screen.getByText(mission.title)).toBeInTheDocument();
    expect(screen.getByText(mission.briefing)).toBeInTheDocument();
    expect(screen.getByText(mission.status)).toBeInTheDocument();
    expect(screen.getByText('DIFF:')).toBeInTheDocument();

    // Rewards / tags
    mission.rewards.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });

    // Links
    const repoLink = screen.getByRole('link', { name: /REPO/i });
    expect(repoLink).toHaveAttribute('href', mission.repoLink);
    expect(repoLink).toHaveAttribute('target', '_blank');

    const liveLink = screen.getByRole('link', { name: /DEPLOY/i });
    expect(liveLink).toHaveAttribute('href', mission.liveLink);
    expect(liveLink).toHaveAttribute('target', '_blank');

    // Thumbnail image
    const img = screen.getByRole('img', { name: mission.title });
    expect(img).toHaveAttribute('src', mission.thumbnail);
  });

  it('should render fallback crosshair and image label when thumbnail is missing', () => {
    const missionWithoutThumb = MISSIONS_DATA[0]; // KampungKu (no thumbnail)
    render(
      <SoundProvider>
        <MissionCard mission={missionWithoutThumb} />
      </SoundProvider>
    );

    expect(screen.getByText(missionWithoutThumb.imageLabel)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should not render link footer if mission has neither repoLink nor liveLink', () => {
    const missionNoLinks = {
      id: 'mission-classified',
      title: 'Classified Operation',
      briefing: 'Black ops reconnaissance without public repository or deployment link.',
      status: 'COMPLETED' as const,
      difficulty: 5 as const,
      rewards: ['OpSec'],
      imageLabel: 'classified.png',
    };
    const { container } = render(
      <SoundProvider>
        <MissionCard mission={missionNoLinks} />
      </SoundProvider>
    );

    expect(screen.queryByRole('link', { name: /REPO/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /DEPLOY/i })).not.toBeInTheDocument();
    expect(container.querySelector('.border-t.border-\\[\\#2A2A3A\\]')).not.toBeInTheDocument();
  });
});
