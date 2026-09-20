import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DossierKronik } from '../components/dossier/DossierKronik';
import { DossierKontak } from '../components/dossier/DossierKontak';
import { DossierShell } from '../components/dossier/DossierShell';
import { TactileSoundProvider } from '../components/dossier/TactileSoundManager';

describe('Dossier Kronik & Kontak', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DossierKronik (Expedition Timeline Sheet)', () => {
    it('renders Kronik expedition timeline nodes', () => {
      render(
        <TactileSoundProvider>
          <DossierKronik />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/KRONIK EKSPEDISI/i)).toBeDefined();
      const nodes = screen.getAllByTestId('timeline-node');
      expect(nodes.length).toBeGreaterThan(0);
    });

    it('renders career milestones, education, and expedition history with vintage datestamps', () => {
      render(
        <TactileSoundProvider>
          <DossierKronik />
        </TactileSoundProvider>
      );
      // Verify presence of education / milestones / datestamps
      expect(screen.getAllByText(/PENDIDIKAN/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/REKAM JEJAK MILITER/i).length).toBeGreaterThan(0);
      const datestamps = screen.getAllByTestId('timeline-datestamp');
      expect(datestamps.length).toBeGreaterThan(0);
    });

    it('handles reduced motion preferences in DossierKronik', () => {
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
          <DossierKronik />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/KRONIK EKSPEDISI/i)).toBeDefined();

      matchMediaSpy.mockRestore();
    });

    it('handles node click and keyboard interaction without error', () => {
      render(
        <TactileSoundProvider>
          <DossierKronik />
        </TactileSoundProvider>
      );
      const nodes = screen.getAllByTestId('timeline-node');
      fireEvent.click(nodes[0]);
      fireEvent.keyDown(nodes[0], { key: 'Enter' });
      fireEvent.keyDown(nodes[0], { key: ' ' });
      expect(nodes[0].getAttribute('tabindex')).toBe('0');
      expect(nodes[0].getAttribute('role')).toBe('button');
    });
  });

  describe('DossierKontak (Requisition Dispatch Sheet)', () => {
    it('renders Kontak requisition dispatch form', () => {
      render(
        <TactileSoundProvider>
          <DossierKontak />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/SURAT PERINTAH DISPOSISI/i)).toBeDefined();
      expect(screen.getByLabelText(/Nama Utusan/i)).toBeDefined();
      expect(screen.getByLabelText(/Frekuensi Kontak/i)).toBeDefined();
      expect(screen.getByLabelText(/Perintah Misi/i)).toBeDefined();
    });

    it('submits dispatch form and displays dispatch confirmation / stamp', () => {
      render(
        <TactileSoundProvider>
          <DossierKontak />
        </TactileSoundProvider>
      );

      const nameInput = screen.getByLabelText(/Nama Utusan/i);
      const emailInput = screen.getByLabelText(/Frekuensi Kontak/i);
      const messageInput = screen.getByLabelText(/Perintah Misi/i);
      const submitBtn = screen.getByRole('button', { name: /kirimkan disposisi|kirim disposisi|kirim perintah/i });

      fireEvent.change(nameInput, { target: { value: 'Kapten Erwin' } });
      fireEvent.change(emailInput, { target: { value: 'erwin@surveycorps.org' } });
      fireEvent.change(messageInput, { target: { value: 'Lakukan rekayasa antarmuka benteng terluar.' } });

      fireEvent.click(submitBtn);

      // Confirmation message or wet ink stamp should appear
      expect(screen.getByTestId('dispatch-confirmation')).toBeDefined();
      expect(screen.getByText(/DISPOSISI DITERIMA|TERDISPOSISI|DISPOSISI TERKIRIM/i)).toBeDefined();

      // Direct mail link in confirmation card
      const mailClientLink = screen.getByRole('link', { name: /buka klien surel/i });
      expect(mailClientLink).toBeDefined();
      expect(mailClientLink.getAttribute('href')).toContain('mailto:');
    });

    it('handles reduced motion preferences on form submission', () => {
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
          <DossierKontak />
        </TactileSoundProvider>
      );

      const nameInput = screen.getByLabelText(/Nama Utusan/i);
      const emailInput = screen.getByLabelText(/Frekuensi Kontak/i);
      const messageInput = screen.getByLabelText(/Perintah Misi/i);
      const submitBtn = screen.getByRole('button', { name: /kirimkan disposisi|kirim disposisi|kirim perintah/i });

      fireEvent.change(nameInput, { target: { value: 'Komandan Hange' } });
      fireEvent.change(emailInput, { target: { value: 'hange@surveycorps.org' } });
      fireEvent.change(messageInput, { target: { value: 'Pengujian transmisi taktis.' } });

      fireEvent.click(submitBtn);
      expect(screen.getByTestId('dispatch-confirmation')).toBeDefined();

      matchMediaSpy.mockRestore();
    });

    it('renders direct communication channels with proper external link attributes', () => {
      render(
        <TactileSoundProvider>
          <DossierKontak />
        </TactileSoundProvider>
      );

      const githubLink = screen.getByRole('link', { name: /github/i });
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      const telegramLink = screen.getByRole('link', { name: /telegram/i });
      const emailLink = screen.getByRole('link', { name: /email|pos elektronik|surel/i });

      expect(githubLink).toBeDefined();
      expect(linkedinLink).toBeDefined();
      expect(telegramLink).toBeDefined();
      expect(emailLink).toBeDefined();

      [githubLink, linkedinLink, telegramLink].forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      });
    });
  });

  describe('DossierShell Integration with Kronik & Kontak', () => {
    it('renders DossierKronik when activeTab is kronik', () => {
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="kronik" />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/KRONIK EKSPEDISI/i)).toBeDefined();
      expect(screen.getAllByTestId('timeline-node').length).toBeGreaterThan(0);
    });

    it('renders DossierKontak when activeTab is kontak', () => {
      render(
        <TactileSoundProvider>
          <DossierShell activeTab="kontak" />
        </TactileSoundProvider>
      );
      expect(screen.getByText(/SURAT PERINTAH DISPOSISI/i)).toBeDefined();
      expect(screen.getByLabelText(/Nama Utusan/i)).toBeDefined();
    });
  });
});
