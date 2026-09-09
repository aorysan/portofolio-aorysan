import React from 'react';
import { ArrowLeft, User, MapPin, Activity } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import StatBar from '@/components/gamified/StatBar';
import { PILOT_DOSSIER, APTITUDES, SERVICE_RECORDS } from '@/lib/constants';

interface CharacterProfileProps {
  onClose: () => void;
}

const DEPLOYMENT_LOGS = [
  { period: '2022', title: 'Tactical Foundations', desc: 'Began software engineering with HTML, CSS, and modern JavaScript.' },
  { period: '2023', title: 'First Operations', desc: 'Built first full-stack platforms and participated in game development jams.' },
  { period: '2024', title: 'Skill Expansion', desc: 'Mastered production React, TypeScript, and distributed cloud workflows.' },
  { period: 'ACTIVE', title: 'Combat Ready', desc: 'Continuously shipping high-reliability web systems.' },
];

const CharacterProfile: React.FC<CharacterProfileProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">
          <span>PILOT DOSSIER</span> // SEC-01
        </span>
      </div>

      <ChamferedPanel size="md" className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto md:mx-0 border border-[#00D4FF]/40 chamfer flex items-center justify-center bg-[#1C1C2E]">
            <User className="w-16 h-16 text-[#00D4FF]" />
          </div>

          <div className="md:col-span-2 space-y-3 text-center md:text-left font-mono">
            <h2 className="font-display text-2xl font-bold text-[#E0E0E0] tracking-wide">
              {PILOT_DOSSIER.callsign}
            </h2>
            <p className="text-sm text-[#00FF88]">{PILOT_DOSSIER.role}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#00D4FF]" /> {PILOT_DOSSIER.location}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#00FF88]" /> STATUS: {PILOT_DOSSIER.status}
              </span>
            </div>
            <p className="text-xs font-sans text-[#E0E0E0]/80 leading-relaxed pt-2 border-t border-[#2A2A3A]">
              {PILOT_DOSSIER.bio}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <h3 className="font-display text-xs tracking-widest text-[#00D4FF]">── APTITUDE MATRIX</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APTITUDES.map((apt) => (
              <StatBar key={apt.label} label={apt.label} value={apt.value} color={apt.color} />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <h3 className="font-display text-xs tracking-widest text-[#00FF88]">
            ── <span>SERVICE RECORD</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SERVICE_RECORDS.map((stat) => (
              <ChamferedPanel key={stat.label} size="sm" className="p-3 text-center">
                <div className="font-display text-xl font-bold text-[#00D4FF]">{stat.value}</div>
                <div className="text-[10px] font-mono text-[#94A3B8] tracking-wider">{stat.label}</div>
              </ChamferedPanel>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <h3 className="font-display text-xs tracking-widest text-[#FF00FF]">── DEPLOYMENT LOG</h3>
          <div className="space-y-3 font-mono text-xs">
            {DEPLOYMENT_LOGS.map((log) => (
              <div key={log.period} className="flex gap-4 items-start p-2 hover:bg-[#1C1C2E]/40 transition-colors">
                <span className="text-[#00FF88] w-16 shrink-0">{log.period}</span>
                <div>
                  <div className="text-[#E0E0E0] font-bold">{log.title}</div>
                  <div className="text-[#94A3B8] text-[11px] font-sans">{log.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChamferedPanel>
    </div>
  );
};

export default CharacterProfile;
