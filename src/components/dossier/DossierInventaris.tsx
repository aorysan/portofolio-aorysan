import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Shield, Wrench, Package, HeartPulse, Check } from 'lucide-react';
import { useTactileSound } from './TactileSoundManager';

interface TacticalItem {
  name: string;
  detail: string;
  badge: string;
}

interface TacticalCrateData {
  id: string;
  category: string;
  subtitle: string;
  stencilCode: string;
  icon: React.ComponentType<{ className?: string }>;
  items: TacticalItem[];
}

const TACTICAL_CRATES: TacticalCrateData[] = [
  {
    id: 'crate-senjata',
    category: 'SENJATA UTAMA',
    subtitle: 'ARSENAL INTI PENGEMBANGAN ANTARMUKA',
    stencilCode: 'CRATE // SNT-01',
    icon: Shield,
    items: [
      {
        name: 'React 18 & Next.js',
        detail: 'Arsitektur komponen modular, SSR/SSG, dan reaktivitas tinggi',
        badge: 'TINGKAT I',
      },
      {
        name: 'TypeScript',
        detail: 'Sistem pengetikan statis ketat untuk eliminasi kegagalan runtime',
        badge: 'STANDAR',
      },
      {
        name: 'Tailwind CSS',
        detail: 'Kerangka kerja token desain utilitas untuk integrasi visual cepat',
        badge: 'TAKTIS',
      },
      {
        name: 'Modern HTML5 & Semantic Web',
        detail: 'Hierarki dokumen terstruktur dengan standar semantik ketat',
        badge: 'PONDASI',
      },
    ],
  },
  {
    id: 'crate-perlengkapan',
    category: 'PERLENGKAPAN TAKTIS',
    subtitle: 'PERALATAN INTERAKSI & KOREOGRAFI GERAK',
    stencilCode: 'CRATE // PKP-02',
    icon: Wrench,
    items: [
      {
        name: 'Anime.js & GSAP Engine',
        detail: 'Animasi mikro berbasis fisika, koreografi linimasa, dan manipulasi SVG',
        badge: 'KINETIK',
      },
      {
        name: 'Lenis Smooth Scroll',
        detail: 'Akselerasi gulir terperinci untuk navigasi bebas hambatan',
        badge: 'FLUIDA',
      },
      {
        name: 'Figma Design Tokens',
        detail: 'Pemodelan kawat taktis, purwarupa interaktif, dan desain terukur',
        badge: 'SISTEM',
      },
      {
        name: 'Lucide UI & Shiki Engine',
        detail: 'Ikonografi vektor responsif dan penyorotan kode dua-tema akurat',
        badge: 'VISUAL',
      },
    ],
  },
  {
    id: 'crate-logistik',
    category: 'LOGISTIK',
    subtitle: 'INFRASTRUKTUR DATA & MANAJEMEN DEPLOYMENT',
    stencilCode: 'CRATE // LGS-03',
    icon: Package,
    items: [
      {
        name: 'Node.js & Express API',
        detail: 'Arsitektur microservice RESTful dengan latensi rendah dan throughput tinggi',
        badge: 'SERVER',
      },
      {
        name: 'Firebase & Supabase',
        detail: 'Sinkronisasi data real-time, autentikasi berbasis peran, dan storage awan',
        badge: 'KOLABORASI',
      },
      {
        name: 'PostgreSQL & Database Relasional',
        detail: 'Pemodelan skema ACID dengan integritas referensial kuat',
        badge: 'PERSISTEN',
      },
      {
        name: 'Git, GitHub & CI/CD Pipeline',
        detail: 'Pencabangan taktis, verifikasi otomatis, dan penyebaran edge tanpa jeda',
        badge: 'DEPLOYMENT',
      },
    ],
  },
  {
    id: 'crate-bertahan',
    category: 'KEMAMPUAN BERTAHAN',
    subtitle: 'ATRIBUT KETAHANAN & STANDAR OPERASI TEKNIK',
    stencilCode: 'CRATE // KBH-04',
    icon: HeartPulse,
    items: [
      {
        name: 'Optimasi Web Performance',
        detail: 'Core Web Vitals prima, lazy loading cerdas, dan skor Lighthouse 95+',
        badge: 'LATENSI <16MS',
      },
      {
        name: 'Responsivitas Lintas Perangkat',
        detail: 'Adaptasi tata letak mulus dari layar saku hingga monitor taktis 4K',
        badge: 'ADAPTIF',
      },
      {
        name: 'Aksesibilitas (a11y) & WCAG 2.1',
        detail: 'Navigasi keyboard lengkap, pembaca layar ramah ARIA, dan rasio kontras tinggi',
        badge: 'INKLUSIF',
      },
      {
        name: 'Debugging Sistematis & TDD',
        detail: 'Investigasi akar masalah terisolasi sebelum implementasi perbaikan',
        badge: 'KEANDALAN 100%',
      },
    ],
  },
];

const CornerRivet: React.FC<{ position: string; rotation: string }> = ({ position, rotation }) => (
  <div
    data-testid="iron-rivet"
    className={`absolute ${position} w-2.5 h-2.5 rounded-full bg-[#201F1B] border border-[#555248] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none z-10`}
  >
    <div className={`w-1 h-0.5 bg-[#423E36] transform ${rotation}`} />
  </div>
);

export const DossierInventaris: React.FC = () => {
  const { playSound } = useTactileSound();
  const cratesRef = useRef<(HTMLDivElement | null)[]>([]);
  const checkmarksRef = useRef<(SVGPolylineElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const validCrates = cratesRef.current.filter(Boolean) as HTMLDivElement[];
    const validChecks = checkmarksRef.current.filter(Boolean) as SVGPolylineElement[];

    if (prefersReducedMotion) {
      validCrates.forEach((el) => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      validChecks.forEach((el) => {
        el.style.strokeDashoffset = '0';
      });
      return;
    }

    try {
      if (validCrates.length > 0) {
        anime.remove(validCrates);
        anime({
          targets: validCrates,
          translateY: [-30, 0],
          opacity: [0, 1],
          duration: 700,
          delay: anime.stagger(100, { start: 100 }),
          easing: 'easeOutBounce',
        });
      }

      if (validChecks.length > 0) {
        anime.remove(validChecks);
        anime({
          targets: validChecks,
          strokeDashoffset: [30, 0],
          duration: 400,
          delay: anime.stagger(40, { start: 450 }),
          easing: 'easeInOutQuad',
        });
      }
    } catch {
      // headless / minimal environment safe fallback
    }

    return () => {
      try {
        if (validCrates.length > 0) anime.remove(validCrates);
        if (validChecks.length > 0) anime.remove(validChecks);
      } catch {
        // Safe unmount
      }
    };
  }, []);

  return (
    <article aria-label="Inventaris Taktis Dossier" className="relative max-w-5xl mx-auto flex flex-col gap-6 py-2">
      {/* Tactical Inventory Header Banner */}
      <header className="border-t-2 border-b-2 border-iron/60 py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-iron/80 bg-parchment-dark/20 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-moss border border-parchment-light/40 inline-block" />
          <span className="font-bold tracking-widest text-iron text-sm">INVENTARIS TAKTIS // PERALATAN</span>
          <span className="text-iron/40">//</span>
          <span className="hidden sm:inline tracking-wider">SUPLAI & ARSENAL REKAYASA</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>SEKTOR: SPL-04</span>
          <span className="px-1.5 py-0.5 bg-moss/20 border border-moss/50 text-moss font-bold uppercase">
            STATUS: SIAP OPERASIONAL
          </span>
        </div>
      </header>

      {/* Subheader Narrative */}
      <div className="font-garamond text-base sm:text-lg text-iron/90 leading-relaxed border-l-2 border-moss/60 pl-3 italic">
        "Setiap instrumen di dalam peti ini telah diuji di garis depan rekayasa kode. 
        Keandalan tidak dibangun di atas keberuntungan, melainkan disiplin perkakas dan kesiapan taktis."
      </div>

      {/* 4 Moss-Green Tactical Crates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {TACTICAL_CRATES.map((crate, crateIdx) => {
          const IconComponent = crate.icon;
          return (
            <div
              key={crate.id}
              ref={(el) => {
                cratesRef.current[crateIdx] = el;
              }}
              data-testid="tactical-crate"
              onClick={() => playSound('penClick')}
              className="relative bg-moss text-parchment-light border-2 border-[#526346] rounded-sm p-4 sm:p-5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.4)] transition-all duration-200 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.65)] hover:border-[#677C57] group cursor-default"
              style={{
                backgroundImage: `
                  linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 60%),
                  repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08) 0, rgba(0, 0, 0, 0.08) 2px, transparent 0, transparent 8px)
                `,
              }}
            >
              {/* 4 Iron Corner Rivets */}
              <CornerRivet position="top-2 left-2" rotation="-rotate-45" />
              <CornerRivet position="top-2 right-2" rotation="rotate-45" />
              <CornerRivet position="bottom-2 left-2" rotation="rotate-12" />
              <CornerRivet position="bottom-2 right-2" rotation="-rotate-12" />

              {/* Stenciled Crate Header */}
              <div className="flex items-start justify-between border-b border-[#526346]/80 pb-3 mb-3.5 pr-3 pl-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#2A3423] border border-[#5A6C4D] rounded-sm text-parchment-light/90 shadow-inner">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-cinzel font-bold text-base sm:text-lg tracking-wider text-parchment-light drop-shadow-sm uppercase">
                      {crate.category}
                    </h2>
                    <p className="font-mono text-[10px] tracking-wider text-parchment/60 uppercase">
                      {crate.subtitle}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-parchment/50 border border-[#526346] px-1.5 py-0.5 rounded-sm bg-[#2A3423]/60 shrink-0">
                  {crate.stencilCode}
                </span>
              </div>

              {/* Compartment Items List with Line-Drawn Checkboxes */}
              <ul className="space-y-2.5 pl-2 pr-1">
                {crate.items.map((item, itemIdx) => {
                  const globalItemIndex = crateIdx * 4 + itemIdx;
                  return (
                    <li
                      key={item.name}
                      data-testid="tactical-item"
                      onMouseEnter={() => playSound('penClick')}
                      className="p-2 bg-[#2D3826]/80 border border-[#48573D] rounded-sm hover:bg-[#34412C] hover:border-[#677C57] transition-colors duration-150 flex items-start gap-2.5"
                    >
                      {/* Animated SVG line-drawn checkmark box */}
                      <div className="w-5 h-5 rounded-sm bg-[#1E2519] border border-[#5A6C4D] flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3.5 h-3.5 text-parchment-light"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline
                            ref={(el) => {
                              checkmarksRef.current[globalItemIndex] = el;
                            }}
                            data-testid="drawn-check"
                            points="20 6 9 17 4 12"
                            style={{
                              strokeDasharray: '30',
                              strokeDashoffset: '0',
                            }}
                          />
                        </svg>
                      </div>

                      {/* Item Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-parchment-light truncate">
                            {item.name}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-[#1E2519] border border-[#526346] text-parchment/70 rounded-xs shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="font-garamond text-xs text-parchment/80 leading-snug mt-0.5">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Bottom Crate Stencil Mark */}
              <div className="mt-3 pt-2 border-t border-[#526346]/60 flex items-center justify-between text-[10px] font-mono text-parchment/40 px-2">
                <span>SEKTOR VERIFIKASI: OK</span>
                <span className="tracking-widest">KORPS PENINJAU</span>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
