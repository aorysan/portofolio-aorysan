import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Clock, GraduationCap, Compass, Flag, Shield } from 'lucide-react';
import { useTactileSound } from './TactileSoundManager';

interface TimelineEvent {
  id: string;
  category: 'KARIR' | 'PENDIDIKAN' | 'EKSPEDISI';
  period: string;
  datestamp: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  statusBadge: string;
  statusType: 'active' | 'completed' | 'archive';
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tl-1',
    category: 'KARIR',
    period: '2024 - Sekarang',
    datestamp: 'TAHUN 850 // 2024 - SEKARANG',
    title: 'Pakar Rekayasa Antarmuka & Frontend Modern',
    organization: 'Korps Rekayasa Mandiri & Proyek Terdistribusi',
    description:
      'Memimpin perancangan dan implementasi antarmuka web performa tinggi dengan fokus pada arsitektur modular Next.js 14, TypeScript ketat, orkestrasi micro-interactions Anime.js, dan optimasi Core Web Vitals.',
    tags: ['React 18', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Anime.js'],
    statusBadge: 'OPERASI AKTIF',
    statusType: 'active',
  },
  {
    id: 'tl-2',
    category: 'EKSPEDISI',
    period: '2023 - 2024',
    datestamp: 'TAHUN 849 // 2023 - 2024',
    title: 'Pengembang Ekspedisi Aplikasi Komunitas & Game Jam',
    organization: 'TSA GameFest Jam & Proyek Inovasi Warga',
    description:
      'Merancang arsitektur permainan simulasi strategi "Rest Area Business Tycoon" menggunakan Unity 3D & C# engine. Mengembangkan sistem informasi manajemen warga "KampungKu" berbasis Flutter dan Firebase.',
    tags: ['Unity 3D', 'C# Engine', 'Flutter', 'Firebase', 'State Management'],
    statusBadge: 'TERVERIFIKASI',
    statusType: 'completed',
  },
  {
    id: 'tl-3',
    category: 'PENDIDIKAN',
    period: '2021 - 2025',
    datestamp: 'TAHUN 847 - 850 // 2021 - 2025',
    title: 'Pendidikan Tinggi Rekayasa Perangkat Lunak',
    organization: 'Politeknik Negeri Malang (POLINEMA) // Jurusan Teknologi Informasi',
    description:
      'Program studi D4 Sistem Informasi Bisnis / Teknik Informatika. Menempuh kurikulum mendalam dalam rekayasa perangkat lunak, sistem terdistribusi, pengujian perangkat lunak, dan interaksi manusia-komputer dengan IPK konsisten tinggi.',
    tags: ['Software Engineering', 'Database Systems', 'Algorithms', 'POLINEMA'],
    statusBadge: 'PENDIDIKAN UTAMA',
    statusType: 'active',
  },
  {
    id: 'tl-4',
    category: 'KARIR',
    period: '2023',
    datestamp: 'TAHUN 848 // 2023',
    title: 'Penyelidik Logistik SarPras & Hub Terpadu Jawara',
    organization: 'Divisi Logistik Kampus & Korps Administrasi',
    description:
      'Membangun sistem peminjaman sarana prasarana terpadu (SarPras) dengan verifikasi berkas multi-tahap serta merancang antarmuka dasbor operasional terpusat Jawara untuk rekam jejak aktivitas tim.',
    tags: ['Web Application', 'RESTful API', 'MySQL', 'Node.js', 'UI Architecture'],
    statusBadge: 'ARSIP SELESAI',
    statusType: 'completed',
  },
  {
    id: 'tl-5',
    category: 'PENDIDIKAN',
    period: '2023',
    datestamp: 'TAHUN 848 // 2023',
    title: 'Pelatihan Spesialisasi Talent Scouting Academy (TSA)',
    organization: 'Kementerian Komunikasi dan Informatika (Kominfo)',
    description:
      'Menyelesaikan pelatihan intensif jalur pengembangan aplikasi permainan dan arsitektur game berbasis C# / Unity serta penerapan metodologi pengembangan gesit (Agile Development).',
    tags: ['Game Development', 'Kominfo TSA', 'Game Jam', 'C# Specialization'],
    statusBadge: 'TERSERTIFIKASI',
    statusType: 'archive',
  },
  {
    id: 'tl-6',
    category: 'EKSPEDISI',
    period: '2022',
    datestamp: 'TAHUN 846 // 2022',
    title: 'Pondasi Komputasi & Rekayasa Antarmuka Awal',
    organization: 'Inisiasi Jalur Rekayasa Web Mandiri',
    description:
      'Menyelesaikan penyelidikan struktural mengenai standar semantik HTML5, lembar gaya modular CSS3, algoritma JavaScript ES6+, dan pola desain arsitektur modular berorientasi objek.',
    tags: ['Web Fundamentals', 'JavaScript', 'Object-Oriented', 'Pondasi'],
    statusBadge: 'PONDASI AWAL',
    statusType: 'archive',
  },
];

export const DossierKronik: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useTactileSound();

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !containerRef.current) return;

    try {
      const nodes = containerRef.current.querySelectorAll('[data-testid="timeline-node"]');
      if (nodes.length > 0) {
        anime.remove(nodes);
        anime({
          targets: nodes,
          translateY: [20, 0],
          opacity: [0, 1],
          delay: anime.stagger(100, { start: 150 }),
          duration: 600,
          easing: 'easeOutCubic',
        });
      }
    } catch {
      // Safe fallback for headless/JSDOM environments
    }

    return () => {
      try {
        if (containerRef.current) {
          const nodes = containerRef.current.querySelectorAll('[data-testid="timeline-node"]');
          if (nodes.length > 0) {
            anime.remove(nodes);
          }
        }
      } catch {
        // Safe cleanup
      }
    };
  }, []);

  const handleNodeClick = () => {
    playSound('penClick');
  };

  return (
    <section aria-label="Kronik Ekspedisi" className="relative max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Archival Sheet Header */}
      <header className="border-t-2 border-b-2 border-double border-iron/60 py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-iron/80 bg-parchment-dark/20 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-widest text-iron">ARSIP HISTORIS: KRN-850</span>
          <span className="text-iron/40">//</span>
          <span className="tracking-wider">REKAM JEJAK MILITER & PENDIDIKAN</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-iron/70">DOKUMEN KLASIFIKASI TERVERIFIKASI</span>
          <span className="font-semibold text-blood tracking-wider">KORPS PENINJAU</span>
        </div>
      </header>

      {/* Main Title & Stamp */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-iron/20 pb-4">
        <div>
          <div className="inline-block border border-iron/40 px-2 py-0.5 mb-1.5 font-mono text-[10px] uppercase tracking-widest text-iron/70 bg-parchment-light/60">
            DOKUMEN KRONOLOGIS OPERASIONAL
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-iron tracking-wider uppercase leading-none">
            KRONIK EKSPEDISI
          </h1>
          <p className="font-garamond text-base sm:text-lg text-iron/80 italic mt-2">
            Catatan resmi tonggak perjalanan, rekam jejak operasional, dan riwayat pendidikan taktis.
          </p>
        </div>

        {/* Tactical Official Badge */}
        <div className="flex items-center gap-2 font-mono text-xs text-iron/75 border border-iron/30 px-3 py-1.5 bg-parchment-dark/30 self-start md:self-auto">
          <Clock className="w-4 h-4 text-blood" />
          <span>PERIODE 846 — 850 // RESMI</span>
        </div>
      </div>

      {/* Overview Category Tabs Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs select-none">
        <div className="p-3 border border-iron/30 bg-parchment-light/40 flex items-center gap-2.5">
          <Flag className="w-4 h-4 text-blood flex-shrink-0" />
          <div>
            <span className="block font-bold text-iron text-[11px]">REKAM JEJAK MILITER</span>
            <span className="text-[10px] text-iron/60">Pengalaman Karir & Komando</span>
          </div>
        </div>
        <div className="p-3 border border-iron/30 bg-parchment-light/40 flex items-center gap-2.5">
          <GraduationCap className="w-4 h-4 text-moss flex-shrink-0" />
          <div>
            <span className="block font-bold text-iron text-[11px]">PENDIDIKAN & PELATIHAN</span>
            <span className="text-[10px] text-iron/60">Akademik & Sertifikasi Resmi</span>
          </div>
        </div>
        <div className="p-3 border border-iron/30 bg-parchment-light/40 flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-[#8B6E4E] flex-shrink-0" />
          <div>
            <span className="block font-bold text-iron text-[11px]">EKSPEDISI LAPANGAN</span>
            <span className="text-[10px] text-iron/60">Simulasi & Game Jam Taktis</span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Spine and Nodes */}
      <div ref={containerRef} className="relative mt-4 pl-4 sm:pl-8 md:pl-12">
        {/* Rusted Iron & Brass Vertical Spine */}
        <div
          aria-hidden="true"
          className="absolute left-1.5 sm:left-3 md:left-5 top-2 bottom-4 w-1 bg-gradient-to-b from-[#7A4B3A] via-iron/60 to-[#8B6E4E] shadow-xs rounded-full opacity-80"
          style={{
            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.6)',
          }}
        />

        {/* Timeline Events Stack */}
        <div className="space-y-8">
          {TIMELINE_EVENTS.map((event, index) => {
            const isCareer = event.category === 'KARIR';
            const isEducation = event.category === 'PENDIDIKAN';

            return (
              <article
                key={event.id}
                data-testid="timeline-node"
                tabIndex={0}
                role="button"
                aria-label={`Lihat tonggak riwayat: ${event.title}`}
                onClick={handleNodeClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeClick();
                  }
                }}
                className="relative group cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blood"
              >
                {/* Rusted Brass / Iron Node Rivet Anchor */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-[23px] sm:-left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 border-iron flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isCareer
                      ? 'bg-[#8B3A2E] text-parchment'
                      : isEducation
                      ? 'bg-[#3D4A34] text-parchment'
                      : 'bg-[#8B6E4E] text-parchment'
                  } shadow-md`}
                  style={{
                    boxShadow: '0 2px 4px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.2)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-parchment/90 block" />
                </div>

                {/* Milestone Parchment Card */}
                <div className="border border-iron/30 bg-parchment-light/60 hover:bg-parchment-light hover:border-iron/60 p-4 sm:p-5 transition-all shadow-xs relative">
                  {/* Top Metadata Row: Datestamp & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-iron/15 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        data-testid="timeline-datestamp"
                        className="font-mono text-xs font-bold tracking-wider text-iron bg-parchment-dark/40 px-2 py-0.5 border border-iron/20"
                      >
                        {event.datestamp}
                      </span>
                      <span className="font-mono text-[10px] text-iron/60 uppercase">
                        [{event.category}]
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border font-semibold ${
                        event.statusType === 'active'
                          ? 'border-blood/50 text-blood bg-blood/10'
                          : event.statusType === 'completed'
                          ? 'border-moss/50 text-moss bg-moss/10'
                          : 'border-iron/30 text-iron/70 bg-parchment-dark/30'
                      }`}
                    >
                      {event.statusBadge}
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-iron tracking-wide flex items-center gap-2">
                    {event.title}
                  </h3>
                  <div className="font-mono text-xs text-blood font-semibold tracking-wider mt-0.5 mb-2">
                    {event.organization}
                  </div>

                  {/* Description Paragraph */}
                  <p className="font-garamond text-base text-iron/85 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-iron/10 font-mono text-[10px]">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-parchment-dark/40 text-iron/75 border border-iron/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Marginalia Note for the first and third items */}
                  {index === 0 && (
                    <div className="mt-3 font-caveat text-sm text-[#7A4B3A] italic">
                      * Catatan Lapangan: Fokus penuh pada kehandalan rekayasa frontend dan skalabilitas komponen.
                    </div>
                  )}
                  {index === 2 && (
                    <div className="mt-3 font-caveat text-sm text-[#7A4B3A] italic">
                      * Dokumen Pendidikan: Transkrip akademik tersimpan rapi di arsip institusi.
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer Archival Stamp */}
      <footer className="mt-6 pt-4 border-t border-iron/20 flex flex-wrap items-center justify-between text-xs font-mono text-iron/60">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-moss" />
          <span>REKAM JEJAK RESMI KORPS // DISAHKAN KEPALA OPERASI</span>
        </div>
        <div>
          <span>ARSIP NO: KRN-850-V</span>
        </div>
      </footer>
    </section>
  );
};
