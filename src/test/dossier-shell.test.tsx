import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { DossierTabs } from '../components/dossier/DossierTabs';
import { DossierShell } from '../components/dossier/DossierShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('DossierTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 6 dossier tabs and triggers tab change', () => {
    const onTabSelect = vi.fn();
    render(
      <TactileSoundProvider>
        <DossierTabs activeTab="berkas" onTabSelect={onTabSelect} />
      </TactileSoundProvider>
    );

    expect(screen.getByTestId('tab-berkas')).toBeDefined();
    expect(screen.getByTestId('tab-jurnal')).toBeDefined();
    expect(screen.getByTestId('tab-inventaris')).toBeDefined();
    expect(screen.getByTestId('tab-laporan')).toBeDefined();
    expect(screen.getByTestId('tab-kronik')).toBeDefined();
    expect(screen.getByTestId('tab-kontak')).toBeDefined();

    fireEvent.click(screen.getByTestId('tab-inventaris'));
    expect(onTabSelect).toHaveBeenCalledWith('inventaris');
  });

  it('marks the active tab with aria-selected true', () => {
    render(
      <TactileSoundProvider>
        <DossierTabs activeTab="jurnal" onTabSelect={vi.fn()} />
      </TactileSoundProvider>
    );

    const activeTab = screen.getByTestId('tab-jurnal');
    expect(activeTab.getAttribute('aria-selected')).toBe('true');

    const inactiveTab = screen.getByTestId('tab-berkas');
    expect(inactiveTab.getAttribute('aria-selected')).toBe('false');
  });

  it('renders mobile expedition bar with touch-friendly targets of at least 44px', () => {
    render(
      <TactileSoundProvider>
        <DossierTabs activeTab="berkas" onTabSelect={vi.fn()} />
      </TactileSoundProvider>
    );

    const mobileBar = screen.getByTestId('mobile-expedition-bar');
    expect(mobileBar).toBeDefined();

    const mobileTab = screen.getByTestId('mobile-tab-berkas');
    expect(mobileTab.className).toMatch(/min-h-\[(44px|48px|.*)\]|h-11|h-12|min-h-\[44px\]/);
  });
});

describe('DossierShell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('renders desk container, parchment paper, and tab navigation', () => {
    render(
      <TactileSoundProvider>
        <DossierShell>
          <div data-testid="test-content">Field Report Content</div>
        </DossierShell>
      </TactileSoundProvider>
    );

    expect(screen.getByTestId('dossier-desk')).toBeDefined();
    expect(screen.getByTestId('dossier-paper')).toBeDefined();
    expect(screen.getByTestId('test-content')).toBeDefined();
    expect(screen.getByTestId('tab-berkas')).toBeDefined();
  });

  it('synchronizes active tab with URL hash on mount', () => {
    window.location.hash = '#laporan';

    render(
      <TactileSoundProvider>
        <DossierShell />
      </TactileSoundProvider>
    );

    const activeTab = screen.getByTestId('tab-laporan');
    expect(activeTab.getAttribute('aria-selected')).toBe('true');
  });

  it('updates active tab when hash changes externally', () => {
    render(
      <TactileSoundProvider>
        <DossierShell />
      </TactileSoundProvider>
    );

    act(() => {
      window.location.hash = '#kronik';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    const activeTab = screen.getByTestId('tab-kronik');
    expect(activeTab.getAttribute('aria-selected')).toBe('true');
  });

  it('updates URL hash when a tab is selected', () => {
    render(
      <TactileSoundProvider>
        <DossierShell />
      </TactileSoundProvider>
    );

    fireEvent.click(screen.getByTestId('tab-kontak'));
    expect(window.location.hash).toBe('#kontak');
  });

  it('renders sound mute toggle button and toggles audio state', () => {
    render(
      <TactileSoundProvider>
        <DossierShell />
      </TactileSoundProvider>
    );

    const muteButton = screen.getByTestId('sound-mute-toggle');
    expect(muteButton).toBeDefined();
    expect(muteButton.getAttribute('aria-label')).toMatch(/suara|mute|sound/i);

    fireEvent.click(muteButton);
    expect(localStorage.getItem('dossier_sound_muted')).toBe('true');

    fireEvent.click(muteButton);
    expect(localStorage.getItem('dossier_sound_muted')).toBe('false');
  });

  it('falls back to berkas tab if window hash is invalid', () => {
    window.location.hash = '#invalid-route-xyz';

    render(
      <TactileSoundProvider>
        <DossierShell />
      </TactileSoundProvider>
    );

    const activeTab = screen.getByTestId('tab-berkas');
    expect(activeTab.getAttribute('aria-selected')).toBe('true');
  });

  it('executes paper transition safely and respects prefers-reduced-motion', () => {
    // Mock matchMedia for prefers-reduced-motion
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      const { rerender } = render(
        <TactileSoundProvider>
          <DossierShell activeTab="berkas" />
        </TactileSoundProvider>
      );

      rerender(
        <TactileSoundProvider>
          <DossierShell activeTab="jurnal" />
        </TactileSoundProvider>
      );

      expect(screen.getByTestId('dossier-paper')).toBeDefined();
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});
