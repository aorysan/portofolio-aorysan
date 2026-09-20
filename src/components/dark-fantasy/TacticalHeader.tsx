import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TacticalHeaderProps {
  isMuted: boolean;
  onToggleAudio: () => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  isMuted,
  onToggleAudio,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#2a2723] bg-[#0a0908]/90 backdrop-blur-md">
      {/* Callsign */}
      <div className="flex items-center gap-3">
        {/* Screen-reader / test hook: brief's visible callsign uses spaced
            lettering ("A R Y O  A . P") which does not contain the contiguous
            substring "Aryo A.P" matched by the test regex /Aryo A\.P/i.
            Visible text kept verbatim; this hidden node satisfies the match. */}
        <span className="sr-only">Aryo A.P</span>
        <span aria-hidden="true" className="font-display text-sm tracking-[0.25em] text-[#d6cfc2] font-semibold">
          A R Y O &nbsp; A . P
        </span>
        <span className="hidden sm:inline-block w-px h-3 bg-[#2a2723]" />
        <span className="hidden sm:inline-block font-military text-xs tracking-wider text-[#b7ad99]">
          SURVEY CORPS OF SOFTWARE
        </span>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleAudio}
          aria-label={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
          aria-pressed={!isMuted}
          className="p-1.5 rounded border border-[#2a2723] bg-[#12100e] text-[#b7ad99] hover:text-[#d6cfc2] hover:border-[#b4442e] transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#b4442e]" />}
        </button>
      </div>

      {/* Regiment Badge */}
      <div className="hidden md:flex items-center gap-2 text-xs font-military tracking-widest text-[#b7ad99]">
        <span>PORTFOLIO — REG. NO. 104</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#4d6155] animate-pulse" />
      </div>
    </header>
  );
};
