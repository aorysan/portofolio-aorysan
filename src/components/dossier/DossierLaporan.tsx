import React from 'react';
import { ExternalLink, GitBranch, Compass, FileText, Paperclip } from 'lucide-react';
import { useTactileSound } from './TactileSoundManager';

type ProjectStatus = 'SELESAI' | 'BERJALAN' | 'ARSIP';

interface ExpeditionReport {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  briefing: string;
  status: ProjectStatus;
  tags: string[];
  repoUrl: string;
  liveUrl: string;
  rotation: number;
  colSpan: string;
}

const EXPEDITION_REPORTS: ExpeditionReport[] = [
  {
    id: 'exp-kampungku',
    code: 'DOK-01 // KAMPUNGKU',
    title: 'KampungKu Mobile System',
    subtitle: 'Sistem Informasi Manajemen Pemukiman & Warga',
    briefing:
      'Platform manajemen komunitas terpadu dengan autentikasi berjenjang, pembukuan kas keuangan otomatis, arsip kependudukan warga, dan visualisasi metrik aktivitas masyarakat secara real-time.',
    status: 'SELESAI',
    tags: ['Flutter', 'Firebase', 'Dart', 'Cloudinary', 'Mobile Arch'],
    repoUrl: 'https://github.com/aorysan/jawara_kel3',
    liveUrl: 'https://github.com/aorysan/jawara_kel3#demo',
    rotation: -1.2,
    colSpan: 'md:col-span-6',
  },
  {
    id: 'exp-tycoon',
    code: 'DOK-02 // REST-AREA',
    title: 'Rest Area Business Tycoon',
    subtitle: 'Simulasi Strategi Manajemen Ekonomi Jalur Tol',
    briefing:
      'Game simulasi ekonomi taktis untuk TSA GameFest Jam dengan pemodelan arus pemudik dinamis, peningkatan fasilitas gerai, dan mekanisme alokasi sumber daya berintensitas tinggi.',
    status: 'SELESAI',
    tags: ['Unity 3D', 'C# Engine', 'Game Jam', 'Simulation'],
    repoUrl: 'https://github.com/aorysan/rest-area-tycoon',
    liveUrl: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746',
    rotation: 0.8,
    colSpan: 'md:col-span-6',
  },
  {
    id: 'exp-trasmart',
    code: 'DOK-03 // TRASMART',
    title: 'TrasMart E-Commerce Storefront',
    subtitle: 'Platform Katalog Perdagangan Digital Modern',
    briefing:
      'Platform belanja digital dengan perutean Next.js dinamis, manajemen keranjang reaktif, pemrosesan transaksi berlatensi rendah, dan desain antarmuka responsif ramah jempol yang dioptimalkan untuk edge deployment.',
    status: 'BERJALAN',
    tags: ['Next.js', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    repoUrl: 'https://github.com/aorysan/trasmart-web',
    liveUrl: 'https://trasmart-web.vercel.app/',
    rotation: -1.5,
    colSpan: 'md:col-span-7',
  },
  {
    id: 'exp-jawara',
    code: 'DOK-04 // JAWARA',
    title: 'Jawara Operational Hub',
    subtitle: 'Portal Administrasi Kegiatan Mahasiswa & Korps',
    briefing:
      'Dasbor terpusat untuk orkestrasi kegiatan tim dan inventarisasi operasional dengan autentikasi peran terenkripsi, linimasa agenda terpadu, dan pencatatan riwayat aksi taktis.',
    status: 'BERJALAN',
    tags: ['React', 'Node.js', 'Express', 'RESTful API', 'Tailwind'],
    repoUrl: 'https://github.com/aorysan/jawara',
    liveUrl: 'https://github.com/aorysan/jawara#demo',
    rotation: 1.1,
    colSpan: 'md:col-span-5',
  },
  {
    id: 'exp-sarpras',
    code: 'DOK-05 // SARPRAS',
    title: 'SarPras Management System',
    subtitle: 'Inventarisasi & Peminjaman Sarana Prasarana',
    briefing:
      'Sistem arsip dan peminjaman fasilitas kampus berkapasitas tinggi dengan verifikasi berkas, alur persetujuan bertingkat, serta pelaporan inventaris berkala untuk audit logistik.',
    status: 'ARSIP',
    tags: ['Web App', 'MySQL', 'PHP', 'Bootstrap', 'Aset Logistik'],
    repoUrl: 'https://github.com/aorysan/Kel6-SarPras',
    liveUrl: 'https://github.com/aorysan/Kel6-SarPras#arsip',
    rotation: -0.9,
    colSpan: 'md:col-span-6',
  },
  {
    id: 'exp-framework',
    code: 'DOK-06 // FRAMEWORK',
    title: 'FrameWork Modular Architecture',
    subtitle: 'Eksplorasi Desain Pola Arsitektur Bersih & Terpisah',
    briefing:
      'Penyelidikan struktural rekayasa perangkat lunak mengenai pola decoupling dependensi, injeksi ketergantungan modular, dan pengujian unit berbasis prinsip SOLID.',
    status: 'ARSIP',
    tags: ['TypeScript', 'Architecture', 'Clean Code', 'Design Patterns'],
    repoUrl: 'https://github.com/aorysan/frameWork',
    liveUrl: 'https://github.com/aorysan/frameWork#arsip',
    rotation: 1.2,
    colSpan: 'md:col-span-6',
  },
];

const WetInkStamp: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  switch (status) {
    case 'SELESAI':
      return (
        <div
          data-testid="status-stamp"
          className="inline-flex flex-col items-center justify-center px-2 py-0.5 border-2 border-dashed border-[#2D452B] text-[#2D452B] bg-[#2D452B]/10 -rotate-2 select-none shadow-xs"
        >
          <span className="font-cinzel font-black text-xs tracking-widest leading-tight">
            SELESAI
          </span>
          <span className="font-mono text-[7px] tracking-wider uppercase opacity-85">
            TERVERIFIKASI LAPANGAN
          </span>
        </div>
      );
    case 'BERJALAN':
      return (
        <div
          data-testid="status-stamp"
          className="inline-flex flex-col items-center justify-center px-2 py-0.5 border-2 border-dashed border-[#7A4B3A] text-[#7A4B3A] bg-[#7A4B3A]/10 rotate-3 select-none shadow-xs"
        >
          <span className="font-cinzel font-black text-xs tracking-widest leading-tight">
            BERJALAN
          </span>
          <span className="font-mono text-[7px] tracking-wider uppercase opacity-85">
            OPERASI AKTIF
          </span>
        </div>
      );
    case 'ARSIP':
      return (
        <div
          data-testid="status-stamp"
          className="inline-flex flex-col items-center justify-center px-2 py-0.5 border-2 border-dashed border-[#8B3A2E] text-[#8B3A2E] bg-[#8B3A2E]/10 -rotate-1 select-none shadow-xs"
        >
          <span className="font-cinzel font-black text-xs tracking-widest leading-tight">
            ARSIP
          </span>
          <span className="font-mono text-[7px] tracking-wider uppercase opacity-85">
            REFERENSI OPERASIONAL
          </span>
        </div>
      );
  }
};

export const DossierLaporan: React.FC = () => {
  const { playSound } = useTactileSound();

  return (
    <article aria-label="Laporan Ekspedisi Dossier" className="relative max-w-5xl mx-auto flex flex-col gap-6 py-2">
      {/* Expedition Header Banner */}
      <header className="border-t-2 border-b-2 border-iron/60 py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-iron/80 bg-parchment-dark/20 select-none">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blood" />
          <span className="font-bold tracking-widest text-iron text-sm">LAPORAN EKSPEDISI</span>
          <span className="text-iron/40">//</span>
          <span className="hidden sm:inline tracking-wider">ARSIP PROYEK & MISI LAPANGAN</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>SEKTOR: PROJ-782</span>
          <span className="px-1.5 py-0.5 bg-blood/10 border border-blood/30 text-blood font-bold uppercase">
            STATUS: DIBUKA PENUH
          </span>
        </div>
      </header>

      {/* Narrative Lead */}
      <div className="font-garamond text-base sm:text-lg text-iron/90 leading-relaxed border-l-2 border-blood/60 pl-3 italic">
        "Setiap berkas di bawah ini mendokumentasikan misi perangkat lunak yang telah diluncurkan ke ranah publik.
        Diperiksa secara mandiri dan dibubuhi cap verifikasi komando."
      </div>

      {/* Asymmetric 12-Column Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 pb-6">
        {EXPEDITION_REPORTS.map((report) => {
          return (
            <div
              key={report.id}
              data-testid="project-card"
              className={`${report.colSpan} relative bg-parchment-light/95 text-iron border border-iron/40 rounded-xs p-5 sm:p-6 shadow-[0_4px_16px_rgba(28,27,24,0.12)] transition-all duration-200 hover:shadow-[0_12px_28px_rgba(28,27,24,0.22)] hover:border-iron/70 hover:rotate-0 flex flex-col justify-between group`}
              style={{
                transform: `rotate(${report.rotation}deg)`,
                backgroundImage: `
                  linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(216, 199, 165, 0.15) 100%),
                  radial-gradient(circle at 10% 10%, rgba(122, 75, 58, 0.03) 0%, transparent 40%)
                `,
              }}
              onMouseEnter={() => playSound('paperSlide')}
            >
              {/* Paperclip / Staple Accent Top Left */}
              <div className="absolute -top-3 left-4 text-iron/50 pointer-events-none drop-shadow-xs">
                <Paperclip className="w-5 h-5 transform -rotate-45 text-marginalia/70" />
              </div>

              {/* Card Header: Code & Wet-Ink Status Stamp */}
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-iron/20 pb-3 mb-3">
                  <div className="pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-iron/60 uppercase">
                      <FileText className="w-3 h-3 text-blood/70" />
                      <span>{report.code}</span>
                    </div>
                    <h3 className="font-cinzel font-bold text-lg text-iron tracking-wide mt-1">
                      {report.title}
                    </h3>
                    <p className="font-mono text-xs text-marginalia/90 font-medium">
                      {report.subtitle}
                    </p>
                  </div>

                  {/* Wet-ink status stamp */}
                  <div className="shrink-0 pt-0.5">
                    <WetInkStamp status={report.status} />
                  </div>
                </div>

                {/* Report Briefing Narrative */}
                <p className="font-garamond text-sm sm:text-base text-iron/85 leading-relaxed text-justify mb-4">
                  {report.briefing}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {report.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 font-mono text-[10px] bg-parchment-dark/50 border border-iron/25 text-iron/80 rounded-xs uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Action Links (Repo & Demo) */}
              <div className="pt-3 border-t border-iron/20 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <a
                  href={report.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('penClick')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-iron text-parchment-light hover:bg-[#2F2E2A] hover:text-white border border-iron/70 rounded-xs transition-colors duration-150 shadow-xs active:scale-95 group-hover:border-iron"
                >
                  <GitBranch className="w-3.5 h-3.5 text-parchment" />
                  <span>Akses Repositori</span>
                </a>

                <a
                  href={report.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('penClick')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-parchment-dark/60 text-iron hover:bg-parchment-dark hover:text-black border border-iron/40 rounded-xs transition-colors duration-150 shadow-xs active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blood" />
                  <span>Inspeksi Lapangan</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
