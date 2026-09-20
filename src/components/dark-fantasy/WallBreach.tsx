import React, { useEffect, useRef } from 'react';
import { useTactileSound } from '../dossier/TactileSoundManager';

interface WallBreachProps {
  wallName: string;
  zoneLabel: string;
  isBreached?: boolean;
  progress?: number;
}

export const WallBreach: React.FC<WallBreachProps> = ({
  wallName,
  zoneLabel,
  isBreached = false,
  progress,
}) => {
  const { playSound } = useTactileSound();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (isBreached && !triggeredRef.current) {
      triggeredRef.current = true;
      playSound('stampThud');
    }
  }, [isBreached, playSound]);

  // Max 12 debris fragments (Spec §3.6.2 & §10: GPU transform only)
  const debrisFragments = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    dx: ((i % 4) - 1.5) * 40,
    dy: Math.floor(i / 4) * 35 - 35,
    rotate: (i - 6) * 15,
  }));

  const crackOpacity = typeof progress === 'number' ? Math.min(1, Math.max(0, progress)) : undefined;

  return (
    <div className="relative w-72 sm:w-96 h-[80vh] flex-shrink-0 flex flex-col items-center justify-center border-x-2 border-[#2a2723] bg-gradient-to-b from-[#1c1a17] via-[#12100e] to-[#0a0908] px-8 text-center select-none overflow-hidden">
      {/* Stone Texture Lines & Noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2a2723_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Outward Facing Fortification Header */}
      <div className="relative z-10 space-y-3">
        <span className="font-military text-xs tracking-[0.3em] text-[#b4442e]">
          {zoneLabel}
        </span>
        <h3 className="font-display text-4xl sm:text-5xl font-black text-[#d6cfc2] tracking-wider">
          {wallName}
        </h3>
        <p className="font-military text-[11px] tracking-widest text-[#b7ad99]/60 uppercase">
          PERIMETER DEFENSE SECTOR
        </p>
      </div>

      {/* Wall Breach SVG Crack */}
      <div className="relative my-8 w-full max-w-[200px] h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full stroke-[#b4442e] fill-none stroke-2 transition-all duration-700"
          style={{
            opacity: crackOpacity ?? 1,
            filter: isBreached ? 'drop-shadow(0 0 8px #b4442e)' : undefined,
          }}
        >
          <path d="M50 0 L55 30 L45 50 L60 75 L50 100" />
          <path d="M55 30 L70 40" />
          <path d="M45 50 L30 65" />
        </svg>

        {/* 12 GPU-accelerated Debris Fragments */}
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

      <div className="relative z-10 flex items-center gap-2 font-military text-xs tracking-widest text-[#b7ad99]">
        <span className="w-2 h-2 rounded-full bg-[#b4442e] animate-ping" />
        <span>{isBreached ? 'BREACH ENGAGED' : 'FORTIFICATION INTACT'}</span>
      </div>
    </div>
  );
};
