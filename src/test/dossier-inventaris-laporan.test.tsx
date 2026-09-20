import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DossierInventaris } from '../components/dossier/DossierInventaris';
import { DossierLaporan } from '../components/dossier/DossierLaporan';
import { DossierShell } from '../components/dossier/DossierShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Dossier Inventaris & Laporan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DossierInventaris (Skills Sheet)', () => {
    it('renders Inventaris with 4 tactical crates', () => {
      render(
        <TactileSoundProvider>
          <DossierInventaris />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/SENJATA UTAMA/i)).toBeDefined();
      expect(screen.getByText(/PERLENGKAPAN TAKTIS/i)).toBeDefined();
      expect(screen.getByText(/LOGISTIK/i)).toBeDefined();
      expect(screen.getByText(/KEMAMPUAN BERTAHAN/i)).toBeDefined();

      const crates = screen.getAllByTestId('tactical-crate');
      expect(crates.length).toBe(4);
    });

    it('renders iron rivets on tactical crates', () => {
      render(
        <TactileSoundProvider>
          <DossierInventaris />
        </TactileSoundProvider>
      );
      const rivets = screen.getAllByTestId('iron-rivet');
      // 4 crates * 4 corner rivets = 16 rivets
      expect(rivets.length).toBeGreaterThanOrEqual(16);
    });

    it('renders animated SVG line-drawn checkboxes for inventory items', () => {
      render(
        <TactileSoundProvider>
          <DossierInventaris />
        </TactileSoundProvider>
      );
      const checkmarks = screen.getAllByTestId('drawn-check');
      expect(checkmarks.length).toBeGreaterThan(0);
    });

    it('handles reduced motion preferences in Inventaris', () => {
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
          <DossierInventaris />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/SENJATA UTAMA/i)).toBeDefined();

      matchMediaSpy.mockRestore();
    });

    it('handles interaction on crates and items without errors', () => {
      render(
        <TactileSoundProvider>
          <DossierInventaris />
        </TactileSoundProvider>
      );
      const crates = screen.getAllByTestId('tactical-crate');
      fireEvent.click(crates[0]);

      const items = screen.getAllByTestId('tactical-item');
      fireEvent.mouseEnter(items[0]);
    });
  });

  describe('DossierLaporan (Featured Projects Sheet)', () => {
    it('renders Laporan with project cards and status stamps', () => {
      render(
        <TactileSoundProvider>
          <DossierLaporan />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/LAPORAN EKSPEDISI/i)).toBeDefined();
      const projectCards = screen.getAllByTestId('project-card');
      expect(projectCards.length).toBeGreaterThan(0);
    });

    it('renders wet-ink status stamps including SELESAI, BERJALAN, or ARSIP', () => {
      render(
        <TactileSoundProvider>
          <DossierLaporan />
        </TactileSoundProvider>
      );
      const stamps = screen.getAllByTestId('status-stamp');
      expect(stamps.length).toBeGreaterThan(0);

      const stampTexts = stamps.map((s) => s.textContent);
      expect(stampTexts.some((t) => t?.includes('SELESAI'))).toBe(true);
      expect(stampTexts.some((t) => t?.includes('BERJALAN'))).toBe(true);
      expect(stampTexts.some((t) => t?.includes('ARSIP'))).toBe(true);
    });

    it('renders direct links "Akses Repositori" and "Inspeksi Lapangan" with proper external attributes', () => {
      render(
        <TactileSoundProvider>
          <DossierLaporan />
        </TactileSoundProvider>
      );
      const repoLinks = screen.getAllByRole('link', { name: /akses repositori/i });
      const demoLinks = screen.getAllByRole('link', { name: /inspeksi lapangan/i });

      expect(repoLinks.length).toBeGreaterThan(0);
      expect(demoLinks.length).toBeGreaterThan(0);

      repoLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      });

      demoLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      });
    });

    it('applies asymmetric rotation to project cards for untidy tactical look and CSS variable', () => {
      render(
        <TactileSoundProvider>
          <DossierLaporan />
        </TactileSoundProvider>
      );
      const projectCards = screen.getAllByTestId('project-card');
      const rotations = projectCards.map((c) => c.style.transform);
      expect(rotations.some((rot) => rot.includes('rotate'))).toBe(true);
      const cssVars = projectCards.map((c) => c.style.getPropertyValue('--card-rotate'));
      expect(cssVars.some((v) => v.includes('deg'))).toBe(true);

      const repoLinks = screen.getAllByRole('link', { name: /akses repositori/i });
      expect(repoLinks[0].getAttribute('aria-label')).toContain('Akses Repositori untuk');
    });

    it('handles card hover and link clicks without errors', () => {
      render(
        <TactileSoundProvider>
          <DossierLaporan />
        </TactileSoundProvider>
      );
      const projectCards = screen.getAllByTestId('project-card');
      fireEvent.mouseEnter(projectCards[0]);

      const repoLinks = screen.getAllByRole('link', { name: /akses repositori/i });
      fireEvent.click(repoLinks[0]);

      const demoLinks = screen.getAllByRole('link', { name: /inspeksi lapangan/i });
      fireEvent.click(demoLinks[0]);
    });
  });

  describe('DossierShell Integration with Inventaris & Laporan', () => {
    it('renders DossierInventaris when activeTab is inventaris', () => {
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="inventaris" />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/SENJATA UTAMA/i)).toBeDefined();
      expect(screen.getAllByTestId('tactical-crate').length).toBe(4);
    });

    it('renders DossierLaporan when activeTab is laporan', () => {
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="laporan" />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/LAPORAN EKSPEDISI/i)).toBeDefined();
      expect(screen.getAllByTestId('project-card').length).toBeGreaterThan(0);
    });
  });
});
