import React, { useState, useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';
import { Volume2, VolumeX } from 'lucide-react';
import { DossierTabs, DossierTabId, DOSSIER_TABS } from './DossierTabs';
import { useTactileSound } from './TactileSoundManager';
import { DossierBerkas } from './DossierBerkas';
import { DossierJurnal } from './DossierJurnal';
import { DossierInventaris } from './DossierInventaris';
import { DossierLaporan } from './DossierLaporan';
import { DossierKronik } from './DossierKronik';
import { DossierKontak } from './DossierKontak';

const VALID_TABS: DossierTabId[] = ['berkas', 'jurnal', 'inventaris', 'laporan', 'kronik', 'kontak'];

function parseHash(hash: string): DossierTabId {
  const cleanHash = hash.replace(/^#/, '').toLowerCase();
  if (VALID_TABS.includes(cleanHash as DossierTabId)) {
    return cleanHash as DossierTabId;
  }
  return 'berkas';
}

export interface DossierShellProps {
  activeTab?: DossierTabId;
  onTabChange?: (tab: DossierTabId) => void;
  children?: React.ReactNode;
}

export const DossierShell: React.FC<DossierShellProps> = ({
  activeTab: propActiveTab,
  onTabChange,
  children,
}) => {
  const { isMuted, toggleMute, playSound } = useTactileSound();
  const [internalActiveTab, setInternalActiveTab] = useState<DossierTabId>(() => {
    if (propActiveTab) return propActiveTab;
    if (typeof window !== 'undefined') {
      return parseHash(window.location.hash);
    }
    return 'berkas';
  });

  const activeTab = propActiveTab || internalActiveTab;
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const sheetAnimRef = useRef<HTMLDivElement>(null);
  const previousTabRef = useRef<DossierTabId>(activeTab);
  const isInitialMount = useRef(true);

  // Sync state if prop changes
  useEffect(() => {
    if (propActiveTab) {
      setInternalActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  // Synchronize with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = parseHash(window.location.hash);
      setInternalActiveTab((current) => {
        if (current !== newTab) {
          if (onTabChange) onTabChange(newTab);
          return newTab;
        }
        return current;
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [onTabChange]);

  // Paper shuffle animation & sound trigger when tab changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousTabRef.current = activeTab;
      return;
    }

    if (previousTabRef.current !== activeTab) {
      previousTabRef.current = activeTab;
      playSound('paperSlide');

      // Check prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (sheetContentRef.current) {
        // Reset scroll position on sheet switch
        sheetContentRef.current.scrollTop = 0;
      }

      const animTarget = sheetAnimRef.current || sheetContentRef.current;
      if (animTarget) {
        try {
          // Remove ongoing animations before triggering new one
          anime.remove(animTarget);

          if (prefersReducedMotion) {
            anime({
              targets: animTarget,
              opacity: [0, 1],
              duration: 200,
              easing: 'linear',
            });
          } else {
            // Paper shuffle animation on inner wrapper so scroll container stays clean
            anime({
              targets: animTarget,
              translateX: [-25, 0],
              translateY: [15, 0],
              rotate: [-1, 0],
              opacity: [0, 1],
              duration: 450,
              easing: 'easeOutCubic',
              complete: () => {
                if (animTarget) {
                  animTarget.style.transform = '';
                }
              },
            });
          }
        } catch {
          // Gracefully handle animation in environments without full DOM support
        }
      }
    }
  }, [activeTab, playSound]);

  const handleTabSelect = useCallback(
    (tabId: DossierTabId) => {
      if (tabId === activeTab) return;

      if (typeof window !== 'undefined') {
        window.location.hash = `#${tabId}`;
      }
      setInternalActiveTab(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    },
    [activeTab, onTabChange]
  );

  const handleMuteToggle = () => {
    playSound('penClick');
    toggleMute();
  };

  const handleDeskWheel = (e: React.WheelEvent) => {
    if (!sheetContentRef.current) return;
    if (!sheetContentRef.current.contains(e.target as Node)) {
      sheetContentRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <div
      data-testid="dossier-shell"
      className="relative min-h-screen w-full bg-desk text-iron flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto md:overflow-hidden select-none"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 30%, rgba(216, 199, 165, 0.08) 0%, rgba(21, 20, 18, 0.95) 75%),
          radial-gradient(circle at 85% 15%, rgba(255, 235, 180, 0.05) 0%, transparent 40%)
        `,
      }}
    >
      {/* Folio Desk Area Container */}
      <div
        data-testid="dossier-desk"
        onWheel={handleDeskWheel}
        className="relative w-full max-w-6xl h-[92vh] md:h-[88vh] flex items-stretch justify-center min-h-0"
      >
        {/* Folio Parchment Paper */}
        <div
          data-testid="dossier-paper"
          className="relative flex-1 bg-parchment paper-texture border border-parchment-dark/70 shadow-2xl flex flex-col overflow-hidden min-h-0"
          style={{
            boxShadow: `
              0 20px 45px -10px rgba(0, 0, 0, 0.7),
              0 0 0 1px rgba(28, 27, 24, 0.25),
              inset 0 0 80px rgba(122, 75, 58, 0.06)
            `,
          }}
        >
          {/* Subtle Vintage Pinned / Stamped Header Line */}
          <div className="flex shrink-0 items-center justify-between px-6 py-2.5 border-b border-parchment-dark/60 bg-parchment-dark/30 text-[11px] font-mono tracking-wider text-iron/70 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blood/80 inline-block" />
              <span className="font-bold text-iron tracking-widest">KORPS PENINJAU // ARSIP RESMI</span>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span>KODE: 782-X</span>
              <span className="text-blood font-bold uppercase tracking-wider">STATUS: RAHASIA</span>
            </div>
          </div>

          {/* Paper Content Slot with internal smooth scroll */}
          <div
            ref={sheetContentRef}
            data-testid="dossier-sheet-content"
            data-lenis-prevent="true"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="flex-1 min-h-0 overflow-y-auto dossier-scrollbar p-4 md:p-8 relative select-text pb-20 md:pb-8"
          >
            <div ref={sheetAnimRef} className="w-full">
              {children ? (
                children
              ) : activeTab === 'berkas' ? (
                <DossierBerkas onNavigateToProjects={() => handleTabSelect('laporan')} />
              ) : activeTab === 'jurnal' ? (
                <DossierJurnal />
              ) : activeTab === 'inventaris' ? (
                <DossierInventaris />
              ) : activeTab === 'laporan' ? (
                <DossierLaporan />
              ) : activeTab === 'kronik' ? (
                <DossierKronik />
              ) : activeTab === 'kontak' ? (
                <DossierKontak />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <span className="font-cinzel text-xl text-iron tracking-wider mb-2 uppercase">
                    {DOSSIER_TABS.find((t) => t.id === activeTab)?.label}
                  </span>
                  <p className="font-garamond text-base text-iron/70 italic max-w-md">
                    Lembar dokumen sedang dipersiapkan untuk peninjauan taktis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop vertical tabs + Mobile fixed bottom expedition bar) */}
        <div className="flex items-center -ml-px">
          <DossierTabs activeTab={activeTab} onTabSelect={handleTabSelect} />
        </div>
      </div>

      {/* Audio Mute Toggle Button in the bottom right corner */}
      <button
        type="button"
        data-testid="sound-mute-toggle"
        onClick={handleMuteToggle}
        aria-label={isMuted ? 'Aktifkan suara taktil' : 'Bisukan suara taktil'}
        title={isMuted ? 'Aktifkan Suara Taktil' : 'Bisukan Suara Taktil'}
        className="fixed bottom-16 md:bottom-4 right-4 z-50 p-2.5 rounded-full bg-[#1C1B18]/90 text-parchment border border-parchment-dark/40 shadow-lg hover:bg-desk hover:border-parchment/70 transition-all duration-200 active:scale-95 flex items-center justify-center"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-blood" />
        ) : (
          <Volume2 className="w-5 h-5 text-parchment" />
        )}
      </button>
    </div>
  );
};
