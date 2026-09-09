import React, { useEffect, useState, useRef } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { PILOT_DOSSIER } from '@/lib/constants';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  '[SYSTEM] Initializing VALKYRIE Terminal v3.2.1...',
  '[CORE] Loading neural interface.............. OK',
  `[SCAN] Pilot identification: ${PILOT_DOSSIER.callsign}`,
  `[AUTH] Access level: ${PILOT_DOSSIER.role}`,
  '[LINK] Establishing secure connection......... OK',
  '[BOOT] All systems nominal.',
  '> Welcome, Captain.',
];

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const { play: playTypeSound } = useSoundEffect('BOOT_TYPE');
  const { play: playDoneSound } = useSoundEffect('BOOT_COMPLETE');
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  const handleDone = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    playDoneSound();
    onComplete();
  };

  const { displayedLines, isFinished, skip } = useTypewriter(BOOT_LOGS, 25, 200, handleDone);

  useEffect(() => {
    if (displayedLines.length > 0) {
      if (!completedRef.current && !isFinished) {
        playTypeSound();
      }
      setProgress(Math.round((displayedLines.length / BOOT_LOGS.length) * 100));
    }
  }, [displayedLines.length, isFinished, playTypeSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        if (e.key === ' ') {
          e.preventDefault();
        }
        skip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skip]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#0A0A0F] text-[#00FF88] font-mono cursor-pointer select-none"
      onClick={skip}
      role="region"
      aria-label="System Boot Sequence"
    >
      <div className="flex justify-between items-center text-xs tracking-widest text-[#94A3B8]">
        <span>VALKYRIE TERMINAL OS // BOOT_SEQ</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="px-3 py-1 text-xs uppercase tracking-wider text-[#00D4FF] border border-[#00D4FF]/40 hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 transition-colors"
          aria-label="Skip initialization"
        >
          [ SKIP INIT ]
        </button>
      </div>

      <div className="max-w-2xl space-y-2 text-sm sm:text-base leading-relaxed">
        {displayedLines.map((line, idx) => (
          <div key={idx} className={idx === displayedLines.length - 1 ? 'text-[#00FF88]' : 'text-[#E0E0E0]/80'}>
            {line}
          </div>
        ))}
        <div className="inline-block w-2 h-4 bg-[#00FF88] animate-pulse ml-1 align-middle" />
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs tracking-widest text-[#94A3B8]">
          <span>DIAGNOSTIC STATUS</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full bg-[#1C1C2E] overflow-hidden">
          <div
            className="h-full bg-[#00FF88] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
