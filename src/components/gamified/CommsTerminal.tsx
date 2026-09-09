import React, { useState } from 'react';
import { ArrowLeft, Mail, Github, Linkedin, Send } from 'lucide-react';
import ChamferedPanel from '@/components/gamified/ChamferedPanel';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface CommsTerminalProps {
  onClose: () => void;
}

const CommsTerminal: React.FC<CommsTerminalProps> = ({ onClose }) => {
  const [callsign, setCallsign] = useState('');
  const [frequency, setFrequency] = useState('');
  const [transmission, setTransmission] = useState('');
  const [sent, setSent] = useState(false);
  const { play: playClick } = useSoundEffect('UI_CLICK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const mailtoLink = `mailto:${EMAIL}?subject=Transmission from ${callsign}&body=Frequency: ${frequency}%0D%0A%0D%0A${transmission}`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#2A2A3A] pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-[#00D4FF] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> [ RETURN TO HUD ]
        </button>
        <span className="font-display text-sm tracking-widest text-[#00FF88]">COMMS RELAY // SEC-04</span>
      </div>

      <ChamferedPanel size="md" className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-[#E0E0E0]">COMMS RELAY</h2>
          <p className="font-mono text-xs text-[#00FF88]">&gt; CHANNEL OPEN — AWAITING TRANSMISSION</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label htmlFor="callsign" className="block text-[#00D4FF] tracking-wider">
              CALLSIGN (NAME)
            </label>
            <input
              id="callsign"
              type="text"
              required
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder="CAPT. OBSERVER"
              className="w-full bg-[#12121A] border-b border-[#2A2A3A] focus:border-[#00FF88] p-2 text-[#E0E0E0] outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="frequency" className="block text-[#00D4FF] tracking-wider">
              FREQUENCY (EMAIL)
            </label>
            <input
              id="frequency"
              type="email"
              required
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="observer@domain.com"
              className="w-full bg-[#12121A] border-b border-[#2A2A3A] focus:border-[#00FF88] p-2 text-[#E0E0E0] outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="transmission" className="block text-[#00D4FF] tracking-wider">
              TRANSMISSION MESSAGE
            </label>
            <textarea
              id="transmission"
              required
              rows={4}
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              placeholder="Enter briefing message here..."
              className="w-full bg-[#12121A] border-b border-[#2A2A3A] focus:border-[#00FF88] p-2 text-[#E0E0E0] outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-display tracking-widest text-xs uppercase text-[#00FF88] border border-[#00FF88]/50 hover:border-[#00FF88] hover:bg-[#00FF88]/10 chamfer transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> [ TRANSMIT ]
          </button>
        </form>

        <div className="pt-6 border-t border-[#2A2A3A] space-y-3">
          <h3 className="font-mono text-xs tracking-widest text-[#94A3B8]">NETWORK NODES</h3>
          <div className="flex flex-wrap gap-4 font-mono text-xs">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
            >
              <Github className="w-4 h-4" /> GITHUB
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LINKEDIN
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-[#94A3B8] hover:text-[#00FF88] transition-colors"
            >
              <Mail className="w-4 h-4" /> DIRECT_DISPATCH
            </a>
          </div>
        </div>
      </ChamferedPanel>
    </div>
  );
};

export default CommsTerminal;
