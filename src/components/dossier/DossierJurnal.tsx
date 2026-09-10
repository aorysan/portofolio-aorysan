import React, { useState, useRef } from 'react';
import anime from 'animejs';
import { BookOpen, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';
import { useTactileSound } from './TactileSoundManager';

interface RedactedBarProps {
  classified: string;
  codename?: string;
}

const RedactedBar: React.FC<RedactedBarProps> = ({ classified, codename = 'DIRAHASIAKAN' }) => {
  const [revealed, setRevealed] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const { playSound } = useTactileSound();

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    playSound('tapePeel');

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!barRef.current) return;

    if (prefersReducedMotion) {
      try {
        barRef.current.style.transform = 'scaleX(0)';
        barRef.current.style.opacity = '0';
        barRef.current.style.pointerEvents = 'none';
      } catch {
        // Safe fallback in minimal environments
      }
      return;
    }

    try {
      anime.remove(barRef.current);
      anime({
        targets: barRef.current,
        scaleX: [1, 0],
        opacity: [1, 0],
        duration: 380,
        easing: 'easeInOutCubic',
        complete: () => {
          if (barRef.current) {
            barRef.current.style.pointerEvents = 'none';
          }
        },
      });
    } catch {
      // Safe fallback for headless environments
    }
  };

  return (
    <span
      className="relative inline-block mx-1 font-mono align-baseline group cursor-pointer"
      onClick={handleReveal}
      onMouseEnter={handleReveal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleReveal();
        }
      }}
      title="Sorot kursor atau ketuk untuk membuka pita sensor intelijen"
    >
      {/* Revealed classified text underneath */}
      <span className="text-blood bg-parchment-dark/40 px-1.5 py-0.5 rounded-sm border-b-2 border-blood/50 font-bold tracking-wide">
        {classified}
      </span>

      {/* Blackout redaction tape */}
      <span
        ref={barRef}
        data-testid="redacted-bar"
        data-revealed={revealed ? 'true' : 'false'}
        className="absolute inset-0 bg-iron text-iron origin-left flex items-center justify-center rounded-sm select-none shadow-sm transition-transform"
        style={{
          transformOrigin: 'left center',
          boxShadow: '0 1px 3px rgba(28, 27, 24, 0.4)',
        }}
      >
        <span className="text-[9px] text-parchment/60 font-mono tracking-widest px-1 uppercase truncate pointer-events-none">
          {revealed ? '' : codename}
        </span>
      </span>
    </span>
  );
};

export const DossierJurnal: React.FC = () => {
  return (
    <article aria-label="Jurnal Lapangan Dossier" className="relative max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Field Journal Log Header */}
      <header className="border-t-2 border-b-2 border-iron/60 py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-iron/80 bg-parchment-dark/20 select-none">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blood" />
          <span className="font-bold tracking-widest text-iron text-sm">ENTRI JURNAL #104</span>
          <span className="text-iron/40">//</span>
          <span className="hidden sm:inline tracking-wider">LOG PENELITIAN LAPANGAN</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>LOKASI: POS TERDEPAN SHIGANSHINA</span>
          <span className="px-1.5 py-0.5 bg-blood/10 border border-blood/30 text-blood font-bold uppercase">
            STATUS: DIDEKLASIFIKASI
          </span>
        </div>
      </header>

      {/* Journal Body Content with Marginalia Note */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* Main Log Narrative */}
        <div className="lg:col-span-8 flex flex-col gap-4 font-garamond text-base sm:text-lg leading-relaxed text-iron/90">
          <div className="text-xs font-mono text-iron/60 uppercase tracking-widest border-b border-iron/20 pb-1">
            CATATAN OPERASIONAL: REKAYASA KOGNITIF & INFRASTRUKTUR WEB
          </div>

          <p className="text-justify">
            <span
              data-testid="drop-cap"
              className="float-left text-5xl sm:text-6xl font-cinzel font-black mr-3 mt-1 leading-none text-blood select-none drop-shadow-sm"
            >
              D
            </span>
            i balik tembok pertahanan kode konvensional, lanskap pengembangan antarmuka
            sering kali tenggelam dalam kebisingan dependensi yang rapuh. Sebagai seorang
            praktisi rekayasa antarmuka, prinsip utama saya berakar pada kesederhanaan taktis:
            memaksimalkan daya tahan sistem, memangkas latensi render, dan memastikan setiap
            interaksi taktil terasa nyata bagi pengguna. Kami telah menaklukkan berbagai proyek berskala tinggi
            menggunakan tumpukan teknologi modern seperti{' '}
            <RedactedBar classified="React 18 & Vite Next-Gen" codename="MODUL-01" />, arsitektur status{' '}
            <RedactedBar classified="Zustand & React Query" codename="MODUL-02" />, serta animasi mikro berbasis{' '}
            <RedactedBar classified="Anime.js & GSAP Engine" codename="MODUL-03" />.
          </p>

          <p className="text-justify">
            Setiap proyek bukan sekadar deretan baris kode, melainkan ekspedisi ke medan yang belum
            terpetakan. Ketika membangun sistem desain antarmuka, fokus saya tidak hanya berhenti pada
            estetika visual semata. Ketahanan arsitektur, kepatuhan aksesibilitas (a11y), dan
            respon interaksi dengan latensi{' '}
            <RedactedBar classified="kurang dari 16ms (60 FPS solid)" codename="SPEK-INTEL" />{' '}
            adalah standar mutlak yang harus ditegakkan sebelum sebuah modul dirilis ke publik.
          </p>

          <p className="text-justify">
            Misi kami ke depan adalah terus merekayasa pengalaman digital yang menggabungkan kedalaman
            cerita dengan kekuatan rekayasa web modern. Dokumen ini merekam komitmen tersebut untuk
            generasi penjelajah berikutnya.
          </p>

          {/* Interactive Redaction Guide Callout */}
          <div className="flex items-center gap-2 p-2.5 bg-parchment-dark/30 border border-iron/20 rounded-sm font-mono text-xs text-iron/70 mt-2">
            <Eye className="w-4 h-4 text-blood shrink-0" />
            <span>
              Petunjuk intelijen: Sentuh atau arahkan kursor ke pita hitam untuk membuka segel sensor
              dokumen taktis.
            </span>
          </div>
        </div>

        {/* Marginalia Aside Callout Box */}
        <aside
          aria-label="Catatan Pinggir"
          className="lg:col-span-4 flex flex-col gap-4 p-4 border border-dashed border-marginalia/50 bg-parchment-light/70 shadow-sm rounded-sm lg:sticky lg:top-4 transform lg:-rotate-1"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-marginalia tracking-wider uppercase border-b border-marginalia/30 pb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-marginalia" />
            <span>CATATAN PINGGIR PERWIRA</span>
          </div>

          {/* Rust Ink Handwritten Note in Caveat font */}
          <div className="font-caveat text-2xl sm:text-3xl text-marginalia font-bold leading-snug py-1">
            "— jangan hilangkan lagi."
          </div>

          <p className="font-caveat text-lg text-marginalia/85 leading-snug">
            Berkas rancangan ini ditemukan terselip di antara log ekspedisi sektor selatan.
            Semua catatan arsitektur antarmuka telah diverifikasi akurat oleh komando lapangan.
          </p>

          <div className="font-mono text-[10px] text-marginalia/70 border-t border-marginalia/30 pt-2 flex items-center justify-between">
            <span>PARAF: KAPTEN LEVI</span>
            <span>DIVISI PENELITIAN</span>
          </div>
        </aside>
      </div>
    </article>
  );
};
