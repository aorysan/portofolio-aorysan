import React, { useEffect } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { Campaign } from '../../lib/dark-fantasy-data';

export const CampaignDossierModal: React.FC<{
  campaign: Campaign | null;
  onClose: () => void;
}> = ({ campaign, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!campaign) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl border border-[#2a2723] bg-[#12100e] p-6 sm:p-8 rounded shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2a2723] pb-4">
          <div className="flex items-center gap-3">
            <span className="font-military text-xs tracking-widest text-[#b4442e]">
              [{campaign.district}] · {campaign.year}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dossier modal"
            className="p-1 rounded text-[#b7ad99] hover:text-white hover:bg-[#1c1a17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#d6cfc2] mt-4">
          {campaign.title}
        </h3>
        <p className="font-military text-xs tracking-wider text-[#b4442e] uppercase mt-1">
          ROLE: {campaign.role}
        </p>

        <p className="font-body text-base text-[#b7ad99] leading-relaxed mt-4">
          {campaign.briefing}
        </p>

        <div className="mt-6">
          <div className="font-military text-xs tracking-wider text-[#b7ad99]/60 mb-2">
            ARSENAL DEPLOYED:
          </div>
          <div className="flex flex-wrap gap-2">
            {campaign.stack.map((st) => (
              <span
                key={st}
                className="px-2.5 py-1 text-xs font-military tracking-wider rounded border border-[#2a2723] bg-[#1c1a17] text-[#d6cfc2]"
              >
                {st}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#2a2723]">
          {campaign.liveLink && (
            <a
              href={campaign.liveLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#b4442e] text-[#d6cfc2] font-military text-xs tracking-wider font-semibold hover:bg-[#7c1f1a] transition-colors"
            >
              <span>INSPECT OPERATION</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {campaign.github && (
            <a
              href={campaign.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded border border-[#2a2723] bg-[#1c1a17] text-[#d6cfc2] font-military text-xs tracking-wider hover:border-[#b4442e] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>REPOSITORY</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
