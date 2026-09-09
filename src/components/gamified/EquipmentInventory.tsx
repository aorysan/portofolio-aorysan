import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import EquipmentCard from '@/components/gamified/EquipmentCard';
import { TECH_ARSENAL } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface EquipmentInventoryProps {
  onClose: () => void;
}

const EquipmentInventory: React.FC<EquipmentInventoryProps> = ({ onClose }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const { play: playClick } = useSoundEffect('UI_CLICK');

  const activeCategory = TECH_ARSENAL[activeCategoryIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">TECH ARSENAL // SEC-03</span>
      </div>

      <div className="flex gap-4 border-b border-[#2A2A3A] overflow-x-auto pb-2">
        {TECH_ARSENAL.map((cat, idx) => (
          <button
            key={cat.category}
            onClick={() => {
              playClick();
              setActiveCategoryIndex(idx);
            }}
            className={`text-xs font-mono tracking-wider py-2 px-3 transition-colors border-b-2 whitespace-nowrap ${
              idx === activeCategoryIndex
                ? 'border-[#00FF88] text-[#00FF88]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E0E0E0]'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeCategory.items.map((item) => (
          <EquipmentCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};

export default EquipmentInventory;
