import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CampaignsSection } from '../components/dark-fantasy/CampaignsSection';

describe('CampaignsSection Component', () => {
  it('renders all 6 campaigns and opens modal on click', () => {
    render(<CampaignsSection />);
    expect(screen.getByText(/03 — CAMPAIGNS/i)).toBeInTheDocument();
    expect(screen.getByText('KampungKu')).toBeInTheDocument();
    expect(screen.getByText('Rest Area Business - Idle Tycoon Game')).toBeInTheDocument();
    expect(screen.getByText('TrasMart')).toBeInTheDocument();
    expect(screen.getByText('SarPras')).toBeInTheDocument();
    expect(screen.getByText('FrameWork')).toBeInTheDocument();
    expect(screen.getByText('Jawara')).toBeInTheDocument();

    const card = screen.getByText('KampungKu');
    fireEvent.click(card);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // NOTE(deviation from brief): card role text duplicates modal "ROLE: …" text,
    // so scope the assertion to within the dialog to prove the modal shows the role.
    expect(within(dialog).getByText(/Mobile Lead Engineer/i)).toBeInTheDocument();
  });
});
