import React from 'react';
import { ExternalLink, Github, Crosshair } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import { Mission } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface MissionCardProps {
  mission: Mission;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  const { play: playHover } = useSoundEffect('UI_HOVER');

  return (
    <ChamferedPanel
      size="md"
      onMouseEnter={playHover}
      className="p-5 flex flex-col justify-between hover:border-[#00FF88] transition-all duration-200"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 text-[#FF00FF] text-xs font-mono">
            <span>DIFF:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < mission.difficulty ? 'text-[#FF00FF]' : 'text-[#2A2A3A]'}>
                ◆
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#00FF88] border border-[#00FF88]/40 px-2 py-0.5 chamfer-sm">
            {mission.status}
          </span>
        </div>

        <div className="h-32 bg-[#1C1C2E] border border-[#2A2A3A] chamfer-sm overflow-hidden flex items-center justify-center relative group">
          {mission.thumbnail ? (
            <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#94A3B8]">
              <Crosshair className="w-6 h-6 text-[#00D4FF]/60" />
              <span className="text-[10px] font-mono uppercase">{mission.imageLabel}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-display text-base font-bold text-[#E0E0E0] tracking-wide">
            {mission.title}
          </h4>
          <p className="text-xs font-sans text-[#94A3B8] leading-relaxed mt-1">
            {mission.briefing}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {mission.rewards.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/5 border border-[#00D4FF]/20 px-2 py-0.5 chamfer-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#2A2A3A]">
        {mission.repoLink && (
          <a
            href={mission.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-mono text-[#00D4FF] border border-[#00D4FF]/40 hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 chamfer-sm transition-colors"
          >
            <Github className="w-3.5 h-3.5" /> REPO
          </a>
        )}
        {mission.liveLink && (
          <a
            href={mission.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-mono text-[#00FF88] border border-[#00FF88]/40 hover:border-[#00FF88] hover:bg-[#00FF88]/10 chamfer-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> DEPLOY
          </a>
        )}
      </div>
    </ChamferedPanel>
  );
};

export default MissionCard;
