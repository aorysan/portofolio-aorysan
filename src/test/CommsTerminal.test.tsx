import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommsTerminal from '../components/gamified/CommsTerminal';
import { SoundProvider } from '../components/gamified/SoundManager';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../lib/constants';

describe('CommsTerminal Component', () => {
  it('should render military comms relay with CALLSIGN, FREQUENCY, and TRANSMIT button', () => {
    render(
      <SoundProvider>
        <CommsTerminal onClose={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText('COMMS RELAY')).toBeInTheDocument();
    expect(screen.getByLabelText(/callsign/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transmit/i })).toBeInTheDocument();
  });

  it('should call onClose when clicking return button', () => {
    const handleClose = vi.fn();
    render(
      <SoundProvider>
        <CommsTerminal onClose={handleClose} />
      </SoundProvider>
    );
    const returnBtn = screen.getByRole('button', { name: /return to hud/i });
    fireEvent.click(returnBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should submit form and trigger mailto dispatch', () => {
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(
      <SoundProvider>
        <CommsTerminal onClose={vi.fn()} />
      </SoundProvider>
    );

    const callsignInput = screen.getByLabelText(/callsign/i);
    const frequencyInput = screen.getByLabelText(/frequency/i);
    const transmissionInput = screen.getByLabelText(/transmission message/i);
    const form = screen.getByRole('button', { name: /transmit/i }).closest('form')!;

    fireEvent.change(callsignInput, { target: { value: 'Observer' } });
    fireEvent.change(frequencyInput, { target: { value: 'obs@domain.com' } });
    fireEvent.change(transmissionInput, { target: { value: 'Briefing report.' } });

    fireEvent.submit(form);

    expect(window.location.href).toContain(`mailto:${EMAIL}`);
    expect(window.location.href).toContain('Observer');
    expect(window.location.href).toContain('obs@domain.com');
    expect(window.location.href).toContain('Briefing report.');
  });

  it('should render network nodes links', () => {
    render(
      <SoundProvider>
        <CommsTerminal onClose={vi.fn()} />
      </SoundProvider>
    );

    expect(screen.getByText('NETWORK NODES')).toBeInTheDocument();
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', GITHUB_URL);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', LINKEDIN_URL);
    const emailLink = screen.getByRole('link', { name: /direct_dispatch/i });
    expect(emailLink).toHaveAttribute('href', `mailto:${EMAIL}`);
  });
});
