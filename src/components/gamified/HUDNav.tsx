import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { useSound } from '@/components/gamified/SoundManager';

interface HUDNavProps {
  activePanel: string | null;
  onSelectPanel: (panel: string | null) => void;
}

const HUDNav: React.FC<HUDNavProps> = ({ activePanel, onSelectPanel }) => {
  const { isMuted, toggleMute } = useSound();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0A0A0F]/80 backdrop-blur border-b border-[#00D4FF]/20 px-6 sm:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Radio className="w-5 h-5 text-[#00FF88] animate-pulse" />
        <button
          onClick={() => onSelectPanel(null)}
          className="font-mono text-sm tracking-widest text-[#E0E0E0] hover:text-[#00D4FF] transition-colors"
        >
          VALKYRIE TERMINAL <span className="text-[#00FF88] text-xs">v3.2</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-6 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00FF88]" />
          <span>NET_ONLINE</span>
        </div>
        <div>SYS_TIME: {time}</div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleMute}
          className="p-2 text-[#E0E0E0] hover:text-[#00FF88] border border-[#2A2A3A] hover:border-[#00FF88] transition-colors chamfer-sm"
          aria-label="Toggle audio"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#94A3B8]" /> : <Volume2 className="w-4 h-4 text-[#00FF88]" />}
        </button>
      </div>
    </header>
  );
};

export default HUDNav;
