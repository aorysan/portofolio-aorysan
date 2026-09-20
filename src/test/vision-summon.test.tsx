import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisionSection } from '../components/dark-fantasy/VisionSection';
import { SummonSection } from '../components/dark-fantasy/SummonSection';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Vision & Summon Sections Polish', () => {
  it('renders VisionSection with semantic aria-labelledby', () => {
    render(<VisionSection />);
    const section = document.getElementById('vision');
    expect(section).toHaveAttribute('aria-labelledby', 'vision-heading');
  });

  it('renders SummonSection with minLength and maxLength validation on report', () => {
    render(
      <TactileSoundProvider>
        <SummonSection />
      </TactileSoundProvider>
    );
    const textarea = screen.getByPlaceholderText(/describe the terrain/i);
    expect(textarea).toHaveAttribute('minLength', '10');
    expect(textarea).toHaveAttribute('maxLength', '2000');
  });
});
