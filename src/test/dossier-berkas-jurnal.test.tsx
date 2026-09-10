import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DossierBerkas } from '../components/dossier/DossierBerkas';
import { DossierJurnal } from '../components/dossier/DossierJurnal';
import { DossierShell } from '../components/dossier/DossierShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Dossier Berkas & Jurnal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '';
  });

  describe('DossierBerkas (Hero Sheet)', () => {
    it('renders Berkas sheet with dossier header and stamp', () => {
      render(
        <TactileSoundProvider>
          <DossierBerkas onNavigateToProjects={vi.fn()} />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/ARSIP NO: 782-X/i)).toBeDefined();
      expect(screen.getByText(/STATUS: RAHASIA/i)).toBeDefined();
      expect(screen.getByText(/EREN VANGUARD/i)).toBeDefined();
    });

    it('renders subtitle, manifesto quote, and expedition poster', () => {
      render(
        <TactileSoundProvider>
          <DossierBerkas />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/PAKAR REKAYASA ANTARMUKA/i)).toBeDefined();
      expect(screen.getByTestId('manifesto-quote')).toBeDefined();
      expect(screen.getByTestId('expedition-poster')).toBeDefined();
    });

    it('handles CTA interactions for Buka Ekspedisi and CV link', () => {
      const onNavigate = vi.fn();
      render(
        <TactileSoundProvider>
          <DossierBerkas onNavigateToProjects={onNavigate} />
        </TactileSoundProvider>
      );

      const expeditionBtn = screen.getByRole('button', { name: /buka ekspedisi/i });
      fireEvent.click(expeditionBtn);
      expect(onNavigate).toHaveBeenCalled();

      const cvLink = screen.getByRole('link', { name: /rekam jejak \(cv\)/i });
      expect(cvLink.getAttribute('target')).toBe('_blank');
      expect(cvLink.getAttribute('rel')).toContain('noopener');
      expect(cvLink.getAttribute('rel')).toContain('noreferrer');
    });

    it('handles default navigation when onNavigateToProjects is omitted', () => {
      render(
        <TactileSoundProvider>
          <DossierBerkas />
        </TactileSoundProvider>
      );
      const expeditionBtn = screen.getByRole('button', { name: /buka ekspedisi/i });
      fireEvent.click(expeditionBtn);
      expect(window.location.hash).toBe('#laporan');
    });

    it('handles reduced motion preferences for stamp animation', () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <TactileSoundProvider>
          <DossierBerkas />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/STATUS: RAHASIA/i)).toBeDefined();
      matchMediaSpy.mockRestore();
    });
  });

  describe('DossierJurnal (About Sheet)', () => {
    it('renders Jurnal sheet with interactive redacted bars', () => {
      render(
        <TactileSoundProvider>
          <DossierJurnal />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/ENTRI JURNAL #104/i)).toBeDefined();
      const redactedBars = screen.getAllByTestId('redacted-bar');
      expect(redactedBars.length).toBeGreaterThan(0);
    });

    it('renders drop cap and marginalia note in Caveat font', () => {
      render(
        <TactileSoundProvider>
          <DossierJurnal />
        </TactileSoundProvider>
      );
      expect(screen.getByTestId('drop-cap')).toBeDefined();
      expect(screen.getByText(/— jangan hilangkan lagi\./i)).toBeDefined();
    });

    it('reveals redacted text on hover or tap and triggers sound', () => {
      render(
        <TactileSoundProvider>
          <DossierJurnal />
        </TactileSoundProvider>
      );
      const redactedBars = screen.getAllByTestId('redacted-bar');
      const firstBar = redactedBars[0];

      // Peeling via mouse enter
      fireEvent.mouseEnter(firstBar);
      expect(firstBar.getAttribute('data-revealed')).toBe('true');

      // Peeling via click/touch
      if (redactedBars[1]) {
        fireEvent.click(redactedBars[1]);
        expect(redactedBars[1].getAttribute('data-revealed')).toBe('true');
      }
    });

    it('handles reduced motion preferences when peeling redacted bar', () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <TactileSoundProvider>
          <DossierJurnal />
        </TactileSoundProvider>
      );
      const redactedBars = screen.getAllByTestId('redacted-bar');
      fireEvent.mouseEnter(redactedBars[0]);
      expect(redactedBars[0].getAttribute('data-revealed')).toBe('true');

      matchMediaSpy.mockRestore();
    });
  });

  describe('DossierShell Integration with Berkas & Jurnal', () => {
    it('renders DossierBerkas when activeTab is berkas', () => {
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="berkas" />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/EREN VANGUARD/i)).toBeDefined();
      expect(screen.getByText(/ARSIP NO: 782-X/i)).toBeDefined();
    });

    it('renders DossierJurnal when activeTab is jurnal', () => {
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="jurnal" />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/ENTRI JURNAL #104/i)).toBeDefined();
      expect(screen.getAllByTestId('redacted-bar').length).toBeGreaterThan(0);
    });

    it('navigates from Berkas to Laporan when clicking Buka Ekspedisi inside DossierShell', () => {
      const onTabChange = vi.fn();
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="berkas" onTabChange={onTabChange} />
        </TactileSoundProvider>
      );

      const expeditionBtn = screen.getByRole('button', { name: /buka ekspedisi/i });
      fireEvent.click(expeditionBtn);
      expect(onTabChange).toHaveBeenCalledWith('laporan');
    });
  });
});
