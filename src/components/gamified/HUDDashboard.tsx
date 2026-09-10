import React, { useState, useEffect, useCallback } from 'react';
import { User, ClipboardList, Shield, Radio, Terminal } from 'lucide-react';
import HUDNav from '@/components/gamified/HUDNav';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import CharacterProfile from '@/components/gamified/CharacterProfile';
import MissionLog from '@/components/gamified/MissionLog';
import EquipmentInventory from '@/components/gamified/EquipmentInventory';
import CommsTerminal from '@/components/gamified/CommsTerminal';
import { PILOT_DOSSIER } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

type PanelType = 'profile' | 'missions' | 'arsenal' | 'comms' | null;

const HUDDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const { play: playHover } = useSoundEffect('UI_HOVER');
  const { play: playOpen } = useSoundEffect('PANEL_OPEN');
  const { play: playClose } = useSoundEffect('PANEL_CLOSE');

  const openPanel = useCallback((panel: PanelType) => {
    if (panel) playOpen();
    else playClose();
    setActivePanel(panel);
  }, [playOpen, playClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePanel) {
        openPanel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, openPanel]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E0E0E0] pt-20 pb-12 px-6 sm:px-12 flex flex-col justify-between relative z-10">
      <HUDNav activePanel={activePanel} onSelectPanel={openPanel} />

      <main id="main-content" className="w-full max-w-6xl mx-auto my-auto py-8">
        {activePanel === null ? (
          <div className="space-y-12">
            {/* Center Welcome Transmission */}
            <ChamferedPanel size="md" className="p-8 text-center max-w-2xl mx-auto space-y-4 border-[#00D4FF]/30">
              <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs text-[#00FF88] border border-[#00FF88]/40 chamfer-sm">
                <Terminal className="w-3.5 h-3.5" /> STANDBY MODE // COMMAND CENTER
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wider text-[#E0E0E0]">
                {PILOT_DOSSIER.callsign}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#00D4FF] tracking-widest">
                {PILOT_DOSSIER.role} // STATUS: {PILOT_DOSSIER.status}
              </p>
              <p className="font-sans text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Select an operational module below to inspect mission parameters, technical inventory, or dispatch transmissions.
              </p>
            </ChamferedPanel>

            {/* 4 Operations Hub Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChamferedPanel
                as="button"
                type="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('profile')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Pilot Dossier"
              >
                <div className="flex justify-between items-start">
                  <User className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-01</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">PILOT DOSSIER</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Identity, aptitudes, and operational service record.</p>
                </div>
              </ChamferedPanel>

              <ChamferedPanel
                as="button"
                type="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('missions')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Operations Log"
              >
                <div className="flex justify-between items-start">
                  <ClipboardList className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-02</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">OPERATIONS LOG</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Deployed production systems and project archives.</p>
                </div>
              </ChamferedPanel>

              <ChamferedPanel
                as="button"
                type="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('arsenal')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Tech Arsenal"
              >
                <div className="flex justify-between items-start">
                  <Shield className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-03</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">TECH ARSENAL</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Tiered technology inventory sorted by combat proficiency.</p>
                </div>
              </ChamferedPanel>

              <ChamferedPanel
                as="button"
                type="button"
                size="md"
                onMouseEnter={playHover}
                onClick={() => openPanel('comms')}
                className="p-6 text-left flex flex-col justify-between h-48 hover:border-[#00FF88] hover:glow-green transition-all duration-200 group cursor-pointer"
                aria-label="Open Comms Relay"
              >
                <div className="flex justify-between items-start">
                  <Radio className="w-7 h-7 text-[#00D4FF] group-hover:text-[#00FF88] transition-colors" />
                  <span className="font-mono text-[10px] text-[#94A3B8]">SEC-04</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#E0E0E0]">COMMS RELAY</h3>
                  <p className="text-xs font-sans text-[#94A3B8] mt-1">Direct communication transmission and network links.</p>
                </div>
              </ChamferedPanel>
            </div>
          </div>
        ) : (
          <div className="py-4 animate-fade-in">
            {activePanel === 'profile' && <CharacterProfile onClose={() => openPanel(null)} />}
            {activePanel === 'missions' && <MissionLog onClose={() => openPanel(null)} />}
            {activePanel === 'arsenal' && <EquipmentInventory onClose={() => openPanel(null)} />}
            {activePanel === 'comms' && <CommsTerminal onClose={() => openPanel(null)} />}
          </div>
        )}
      </main>

      <footer className="w-full max-w-6xl mx-auto pt-8 border-t border-[#2A2A3A] flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-[#94A3B8] gap-2">
        <span>VALKYRIE TERMINAL // ALL SYSTEMS OPERATIONAL</span>
        <span>{"\u00A9"} {new Date().getFullYear()} ARYO ADI PUTRO</span>
      </footer>
    </div>
  );
};

export default HUDDashboard;
