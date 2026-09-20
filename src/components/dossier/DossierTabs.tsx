import React from 'react';
import {
  FileText,
  BookOpen,
  Swords,
  Compass,
  Archive,
  Mail,
  LucideIcon,
} from 'lucide-react';
import { useTactileSound } from './TactileSoundManager';

export type DossierTabId = 'berkas' | 'jurnal' | 'inventaris' | 'laporan' | 'kronik' | 'kontak';

export interface TabConfig {
  id: DossierTabId;
  label: string;
  code: string;
  icon: LucideIcon;
  tooltip: string;
}

export const DOSSIER_TABS: TabConfig[] = [
  {
    id: 'berkas',
    label: 'Berkas',
    code: '01 // BERKAS',
    icon: FileText,
    tooltip: 'Dokumen Personel & Ikhtisar',
  },
  {
    id: 'jurnal',
    label: 'Jurnal',
    code: '02 // JURNAL',
    icon: BookOpen,
    tooltip: 'Catatan Lapangan & Rekam Jejak',
  },
  {
    id: 'inventaris',
    label: 'Inventaris',
    code: '03 // INVENTARIS',
    icon: Swords,
    tooltip: 'Perlengkapan & Keahlian Taktis',
  },
  {
    id: 'laporan',
    label: 'Laporan',
    code: '04 // LAPORAN',
    icon: Compass,
    tooltip: 'Laporan Ekspedisi & Proyek',
  },
  {
    id: 'kronik',
    label: 'Kronik',
    code: '05 // KRONIK',
    icon: Archive,
    tooltip: 'Sumbu Waktu & Pengalaman',
  },
  {
    id: 'kontak',
    label: 'Kontak',
    code: '06 // KONTAK',
    icon: Mail,
    tooltip: 'Disposisi Tugas & Requisisi',
  },
];

export interface DossierTabsProps {
  activeTab: DossierTabId;
  onTabSelect: (tabId: DossierTabId) => void;
  className?: string;
}

export const DossierTabs: React.FC<DossierTabsProps> = ({
  activeTab,
  onTabSelect,
  className = '',
}) => {
  const { playSound } = useTactileSound();

  const handleTabClick = (tabId: DossierTabId) => {
    if (tabId === activeTab) {
      playSound('penClick');
    }
    onTabSelect(tabId);
  };

  return (
    <>
      {/* Desktop Vertical Tab Dividers attached to the right edge */}
      <nav
        aria-label="Navigasi Lembar Berkas"
        role="tablist"
        className={`hidden md:flex flex-col gap-2 z-20 select-none ${className}`}
      >
        {DOSSIER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              data-testid={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              aria-selected={isActive}
              aria-label={`${tab.label} (${tab.code})`}
              title={tab.tooltip}
              onClick={() => handleTabClick(tab.id)}
              className={`
                group relative flex items-center gap-2.5 px-3 py-2.5 text-xs font-cinzel font-semibold tracking-wider uppercase
                transition-all duration-200 text-left border-y border-r rounded-r-md shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blood
                ${
                  isActive
                    ? 'bg-parchment text-iron border-parchment-dark/80 border-r-4 border-r-blood translate-x-2 shadow-md z-30 font-bold'
                    : 'bg-[#D8C7A5]/80 text-[#1C1B18]/70 border-[#C5B390] hover:bg-parchment hover:text-iron hover:translate-x-1 hover:border-[#1C1B18]/40'
                }
              `}
            >
              {/* Tab indicator strip */}
              <div
                className={`w-1.5 h-full absolute left-0 top-0 bottom-0 rounded-l ${
                  isActive ? 'bg-blood' : 'bg-transparent group-hover:bg-marginalia/40'
                }`}
              />

              <Icon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'text-blood scale-110' : 'text-iron/60 group-hover:text-iron'
                }`}
              />

              <div className="flex flex-col">
                <span className="leading-tight text-[11px] font-bold">{tab.label}</span>
                <span className="text-[9px] font-mono opacity-60 tracking-normal">
                  {tab.code.split(' // ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Expedition Bar */}
      <nav
        data-testid="mobile-expedition-bar"
        aria-label="Navigasi Ekspedisi Bawah"
        role="tablist"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-desk/95 backdrop-blur-md border-t border-parchment-dark/40 px-2 pt-1.5 pb-[env(safe-area-inset-bottom)] flex items-center justify-around shadow-2xl"
      >
        {DOSSIER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-testid={`mobile-tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => handleTabClick(tab.id)}
              className={`
                min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center gap-0.5 rounded transition-colors
                ${
                  isActive
                    ? 'text-parchment font-bold bg-parchment/15 border border-blood/50'
                    : 'text-parchment/60 hover:text-parchment/90 active:bg-parchment/10'
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-blood motion-safe:animate-pulse' : 'text-parchment/70'
                }`}
              />
              <span className="text-[10px] font-cinzel font-medium uppercase tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
