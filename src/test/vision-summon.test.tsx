import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisionSection } from '../components/dark-fantasy/VisionSection';
import { SummonSection } from '../components/dark-fantasy/SummonSection';

describe('Vision & Summon Sections', () => {
  it('renders Future Vision with horizon goals', () => {
    render(<VisionSection />);
    expect(screen.getByText(/04 — FUTURE VISION/i)).toBeInTheDocument();
    expect(screen.getByText('THE SEA')).toBeInTheDocument();
  });

  it('renders Summon form and handles report dispatch', () => {
    render(<SummonSection />);
    expect(screen.getByText(/05 — SUMMON/i)).toBeInTheDocument();
    expect(screen.getByText('SOUND THE HORN.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Levi Ackerman/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /dispatch the report/i });
    expect(btn).toBeInTheDocument();
  });
});
