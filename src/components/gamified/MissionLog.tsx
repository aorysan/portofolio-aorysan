import React from 'react';
import { ArrowLeft } from 'lucide-react';
import MissionCard from '@/components/gamified/MissionCard';
import { MISSIONS_DATA } from '@/lib/constants';

interface MissionLogProps {
  onClose: () => void;
}

const MissionLog: React.FC<MissionLogProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">
          <span>OPERATIONS LOG</span> // SEC-02
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MISSIONS_DATA.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
};

export default MissionLog;
