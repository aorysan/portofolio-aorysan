import React from 'react';
import { Shield } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import { EquipmentItem, TechRarity } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface EquipmentCardProps {
  item: EquipmentItem;
}

const RARITY_STYLES: Record<TechRarity, { border: string; glow: string; text: string }> = {
  Common: { border: 'border-[#2A2A3A]', glow: '', text: 'text-[#94A3B8]' },
  Rare: { border: 'border-[#00D4FF]/60', glow: 'glow-cyan', text: 'text-[#00D4FF]' },
  Epic: { border: 'border-[#FF00FF]/60', glow: 'glow-magenta', text: 'text-[#FF00FF]' },
  Legendary: { border: 'border-[#FFD700]/70', glow: 'glow-gold', text: 'text-[#FFD700]' },
};

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item }) => {
  const { play: playHover } = useSoundEffect('UI_HOVER');
  const style = RARITY_STYLES[item.rarity];

  return (
    <ChamferedPanel
      size="sm"
      onMouseEnter={playHover}
      className={`p-4 flex flex-col justify-between border ${style.border} ${style.glow} hover:bg-[#1C1C2E]/60 transition-all duration-200`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Shield className={`w-4 h-4 ${style.text}`} />
          <span className={`text-[10px] font-mono uppercase tracking-widest ${style.text}`}>
            {item.rarity}
          </span>
        </div>
        <h4 className="font-display text-sm font-bold text-[#E0E0E0]">
          {item.name}
        </h4>
        <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
          {item.description}
        </p>
      </div>
    </ChamferedPanel>
  );
};

export default EquipmentCard;
