import React, { useEffect, useRef } from 'react';
import { useTactileSound } from '../dossier/TactileSoundManager';

interface WallBreachProps {
  wallName: string;
  zoneLabel: string;
  isBreached?: boolean;
  progress?: number;
}

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export const WallBreach: React.FC<WallBreachProps> = ({
  wallName,
  zoneLabel,
  isBreached = false,
  progress,
}) => {
  const { playSound } = useTactileSound();
  const triggeredRef = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isBreached && !triggeredRef.current) {
      triggeredRef.current = true;
      playSound('stampThud');
    }
  }, [isBreached, playSound]);

  // Max 12 debris fragments (Spec §3.6.2 & §10: GPU transform only)
  const debrisFragments = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    dx: ((i % 4) - 1.5) * 56,
    dy: Math.floor(i / 4) * 44 - 44,
    rotate: (i - 6) * 15,
  }));

  const crackOpacity = typeof progress === 'number' ? Math.min(1, Math.max(0, progress)) : undefined;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full h-full min-h-[100vh] select-none overflow-hidden bg-[#12100e]"
    >
      {/* Base stone gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#26221d] via-[#171411] to-[#0a0908]" />

      {/* Masonry courses: horizontal mortar every 96px */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 94px, rgba(0,0,0,0.65) 94px, rgba(0,0,0,0.65) 97px, rgba(214,207,194,0.07) 97px, rgba(214,207,194,0.07) 98px, transparent 98px)',
        }}
      />
      {/* Vertical joints, staggered: two offset layers */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, transparent 0px, transparent 118px, rgba(0,0,0,0.6) 118px, rgba(0,0,0,0.6) 121px, transparent 121px)',
          backgroundSize: '240px 96px',
          backgroundPosition: '0 0',
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, transparent 0px, transparent 118px, rgba(0,0,0,0.55) 118px, rgba(0,0,0,0.55) 121px, transparent 121px)',
          backgroundSize: '240px 192px',
          backgroundPosition: '120px 96px',
        }}
      />
      {/* Per-block tonal variation */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.35) 100%), radial-gradient(ellipse 60% 40% at 20% 15%, rgba(214,207,194,0.08), transparent 70%), radial-gradient(ellipse 50% 35% at 85% 80%, rgba(0,0,0,0.5), transparent 70%)',
        }}
      />
      {/* Stone grain noise */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URI, backgroundSize: '160px 160px' }}
      />
      {/* Vignette + top light / bottom weight for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Engraved ghost wall name (backdrop, never covers cards) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="font-military text-[11px] tracking-[0.35em] text-[#b4442e]/80 uppercase">
          {zoneLabel}
        </span>
        <span
          aria-label={wallName}
          className="font-display text-[13vw] lg:text-[9rem] font-black leading-none tracking-tight text-transparent opacity-20 mt-2"
          style={{ WebkitTextStroke: '1.5px #d6cfc2' }}
        >
          {wallName}
        </span>
        <span className="font-military text-[10px] tracking-[0.3em] text-[#b7ad99]/40 uppercase mt-3">
          PERIMETER DEFENSE SECTOR
        </span>
      </div>

      {/* Breach crack — centered, glows when breached */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-56 h-56 sm:w-72 sm:h-72 stroke-[#b4442e] fill-none stroke-2 transition-all duration-700"
          style={{
            opacity: crackOpacity ?? 1,
            filter: isBreached
              ? 'drop-shadow(0 0 10px rgba(180,68,46,0.9)) drop-shadow(0 0 28px rgba(180,68,46,0.35))'
              : 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
          }}
        >
          <path d="M50 0 L55 30 L45 50 L60 75 L50 100" strokeWidth={isBreached ? 2.5 : 1.5} />
          <path d="M55 30 L70 40" />
          <path d="M45 50 L30 65" />
          <path d="M60 75 L74 82" opacity={0.7} />
          <path d="M45 50 L52 62" opacity={0.6} />
        </svg>

        {/* 12 GPU-accelerated debris fragments */}
        {debrisFragments.map((frag) => (
          <span
            key={frag.id}
            className={`absolute w-3 h-3 bg-[#2a2723] border border-[#b4442e]/40 transition-transform duration-700 ease-out ${
              isBreached ? 'opacity-90' : 'opacity-0 scale-50'
            }`}
            style={{
              transform: isBreached
                ? `translate3d(${frag.dx}px, ${frag.dy}px, 0) rotate(${frag.rotate}deg)`
                : 'translate3d(0, 0, 0) rotate(0deg)',
            }}
          />
        ))}
      </div>

      {/* Status pill — kept for isBreached contract, subtle bottom */}
      <div className="absolute bottom-8 inset-x-0 flex items-center justify-center gap-2 font-military text-[11px] tracking-[0.25em] text-[#b7ad99]/70">
        <span className="w-2 h-2 rounded-full bg-[#b4442e] animate-ping" />
        <span>{isBreached ? 'BREACH ENGAGED' : 'FORTIFICATION INTACT'}</span>
      </div>
    </div>
  );
};
