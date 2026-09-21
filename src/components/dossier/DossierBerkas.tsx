import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Compass, FileDown, Shield, ChevronRight } from 'lucide-react';
import { useTactileSound } from './TactileSoundManager';

export interface DossierBerkasProps {
  onNavigateToProjects?: () => void;
}

export const DossierBerkas: React.FC<DossierBerkasProps> = ({ onNavigateToProjects }) => {
  const stampRef = useRef<HTMLDivElement>(null);
  const { playSound } = useTactileSound();

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!stampRef.current) return;

    if (prefersReducedMotion) {
      try {
        stampRef.current.style.transform = 'rotate(-4deg) scale(1)';
        stampRef.current.style.opacity = '1';
      } catch {
        // Safe fallback in minimal environments
      }
      playSound('stampThud');
      const stampEl = stampRef.current;
      return () => {
        if (stampEl) {
          anime.remove(stampEl);
        }
      };
    }

    try {
      anime.remove(stampRef.current);
      anime({
        targets: stampRef.current,
        scale: [2.8, 1],
        rotate: [-20, -4],
        opacity: [0, 1],
        duration: 700,
        easing: 'easeOutElastic(1, .6)',
      });
      playSound('stampThud');
    } catch {
      // Graceful fallback for non-DOM environments
    }
    const stampEl = stampRef.current;

    return () => {
      if (stampEl) {
        anime.remove(stampEl);
      }
    };
  }, [playSound]);

  const handleOpenExpedition = () => {
    playSound('penClick');
    if (onNavigateToProjects) {
      onNavigateToProjects();
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#laporan';
    }
  };

  const handleCvClick = () => {
    playSound('paperSlide');
  };

  return (
    <section aria-label="Hero Dossier Berkas" className="relative max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Official Dossier Archival Header with Double Border */}
      <header className="border-t-2 border-b-2 border-double border-iron/60 py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-iron/80 bg-parchment-dark/20 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-widest text-iron">ARSIP NO: 782-X</span>
          <span className="text-iron/40">//</span>
          <span className="hidden sm:inline tracking-wider">KOMANDO PUSAT SURVEI MILITER</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-iron/70">TAHUN: 850</span>
          <span className="font-semibold text-moss">DIVISI REKAYASA SISTEM</span>
        </div>
      </header>

      {/* Main Hero Header and Animated Stamp */}
      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
        <div className="flex-1">
          <div className="inline-block border border-iron/40 px-2 py-0.5 mb-2 font-mono text-[10px] uppercase tracking-widest text-iron/70 bg-parchment-light/60">
            DOKUMEN IDENTITAS KELAS TINGGI
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black text-iron tracking-wider uppercase leading-none drop-shadow-sm">
            EREN VANGUARD
          </h1>
          <h2 className="font-cinzel text-sm sm:text-base md:text-lg font-bold text-blood tracking-[0.25em] uppercase mt-2.5 flex items-center gap-2">
            <span className="w-5 h-px bg-blood inline-block" />
            PAKAR REKAYASA ANTARMUKA
            <span className="w-5 h-px bg-blood inline-block" />
          </h2>

          {/* Tactical Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 py-3 border-y border-iron/20 font-mono text-xs text-iron/75">
            <div>
              <span className="block text-[10px] text-iron/50 uppercase">AFILIASI</span>
              <span className="font-semibold text-iron">KORPS PENINJAU</span>
            </div>
            <div>
              <span className="block text-[10px] text-iron/50 uppercase">PERAN OPERASIONAL</span>
              <span className="font-semibold text-iron">ARSITEK FRONTEND</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-iron/50 uppercase">KESIAPAN SISTEM</span>
              <span className="font-bold text-moss">100% OPERASIONAL</span>
            </div>
          </div>

          {/* Mission Manifesto Quote */}
          <blockquote
            data-testid="manifesto-quote"
            className="font-garamond text-base sm:text-lg italic text-iron/90 border-l-2 border-blood/70 pl-4 py-1.5 leading-relaxed bg-blood/[0.03]"
          >
            "Batas antarmuka bukan sekadar batas visual, melainkan medan pertempuran antara
            kekacauan data dan presisi eksekusi pengguna. Kami merekayasa struktur yang tak tergoyahkan
            menembus batas dinding keterbatasan web."
          </blockquote>
        </div>

        {/* Animated STATUS: RAHASIA Stamp */}
        <div className="flex items-center justify-center md:justify-end md:w-56 shrink-0 self-center md:self-start my-2 md:my-0">
          <div
            ref={stampRef}
            data-testid="status-stamp"
            className="stamp-border px-4 py-2 text-blood bg-blood/[0.04] text-center select-none shadow-md transform -rotate-4 transition-transform"
            style={{ opacity: 1 }}
          >
            <div className="text-[10px] font-mono tracking-widest text-blood/80">KORPS PENINJAU</div>
            <div className="font-cinzel text-lg sm:text-xl font-black tracking-widest uppercase my-0.5">
              STATUS: RAHASIA
            </div>
            <div className="text-[9px] font-mono tracking-wider text-blood/70 border-t border-blood/40 pt-0.5 mt-0.5">
              OTORITAS: INSPEKTORAT #104
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Attack on Titan Expedition Poster with Taped Corners */}
      <div className="relative mt-4">
        <div
          data-testid="expedition-poster"
          className="relative bg-parchment-light border-2 border-iron/70 p-5 sm:p-7 shadow-xl rounded-sm transform rotate-[-0.5deg]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 100% 0%, rgba(139, 58, 46, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 0% 100%, rgba(61, 74, 52, 0.06) 0%, transparent 40%)
            `,
          }}
        >
          {/* Top-Left Translucent Tape Strip */}
          <div
            aria-hidden="true"
            className="absolute -top-3.5 left-6 w-16 h-6 bg-[#D8C7A5]/80 backdrop-blur-[1px] -rotate-12 shadow-sm border-t border-b border-parchment-dark/70 pointer-events-none z-20"
          />
          {/* Top-Right Translucent Tape Strip */}
          <div
            aria-hidden="true"
            className="absolute -top-3.5 right-6 w-16 h-6 bg-[#D8C7A5]/80 backdrop-blur-[1px] rotate-12 shadow-sm border-t border-b border-parchment-dark/70 pointer-events-none z-20"
          />

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Survey Corps Wings of Freedom Crest */}
            <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 border-2 border-iron/80 bg-parchment-dark/40 flex flex-col items-center justify-center p-2 shadow-inner">
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full text-iron"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Shield Outline */}
                <path
                  d="M10 10 H90 V70 C90 95 50 115 50 115 C50 115 10 95 10 70 Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="#E8DCC0"
                />
                {/* Left Blue/Iron Wing */}
                <path
                  d="M48 20 C35 30 20 50 22 75 C30 70 38 65 42 62 C34 52 35 38 48 20 Z"
                  fill="#1C1B18"
                />
                <path
                  d="M48 35 C38 45 28 60 30 82 C38 77 44 73 48 70 C42 62 40 48 48 35 Z"
                  fill="#1C1B18"
                />
                {/* Right White Wing */}
                <path
                  d="M52 20 C65 30 80 50 78 75 C70 70 62 65 58 62 C66 52 65 38 52 20 Z"
                  fill="#8B3A2E"
                />
                <path
                  d="M52 35 C62 45 72 60 70 82 C62 77 56 73 52 70 C58 62 60 48 52 35 Z"
                  fill="#8B3A2E"
                />
              </svg>
              <span className="font-cinzel text-[8px] font-bold tracking-widest text-iron uppercase mt-1">
                WINGS OF FREEDOM
              </span>
            </div>

            {/* Poster Details and Brief */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1 text-[11px] font-mono text-blood font-bold tracking-wider">
                <span className="inline-flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> SURAT PERINTAH EKSPEDISI KE-57
                </span>
                <span className="text-iron/40">•</span>
                <span className="text-iron/70">ZONA DINDING ROSE</span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-iron tracking-wide uppercase">
                INSTRUKSI MISI: REKAYASA SISTEM DIGITAL
              </h3>
              <p className="font-garamond text-sm sm:text-base text-iron/80 leading-snug mt-1.5 max-w-2xl">
                Prajurit antarmuka diperintahkan menjelajahi lanskap digital, menaklukkan tantangan
                performa web, dan membangun pengalaman interaktif berskala tinggi dengan ketahanan
                militer. Seluruh artefak kode terbuka untuk inspeksi taktis.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3 text-[10px] font-mono text-iron/70">
                <span className="px-2 py-0.5 bg-parchment-dark/50 border border-iron/20 rounded-sm">
                  REACT 18 // TYPESCRIPT
                </span>
                <span className="px-2 py-0.5 bg-parchment-dark/50 border border-iron/20 rounded-sm">
                  TAILWIND CSS // ANIME.JS
                </span>
                <span className="px-2 py-0.5 bg-parchment-dark/50 border border-iron/20 rounded-sm">
                  WEB AUDIO API // TACTILE HUD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons / CTAs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
        <button
          type="button"
          data-testid="cta-expedition"
          onClick={handleOpenExpedition}
          className="bg-blood text-parchment font-cinzel font-bold text-sm sm:text-base px-6 py-3 rounded-sm shadow-md hover:bg-blood/90 transition-all active:scale-95 flex items-center gap-2 border border-parchment-dark/40 group tracking-wider uppercase cursor-pointer"
        >
          <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
          <span>Buka Ekspedisi</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCvClick}
          className="border-2 border-iron/70 text-iron bg-parchment-dark/20 hover:bg-parchment-dark/60 font-cinzel font-bold text-sm sm:text-base px-5 py-2.5 rounded-sm shadow-sm transition-all active:scale-95 flex items-center gap-2 tracking-wider uppercase cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-iron/80" />
          <span>Rekam Jejak (CV)</span>
        </a>
      </div>
    </section>
  );
};
