import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import { Mail, Send, Radio, ArrowUpRight } from 'lucide-react';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';
import { useTactileSound } from './TactileSoundManager';

const TELEGRAM_URL = 'https://t.me/aorysan';

export const DossierKontak: React.FC = () => {
  const [namaUtusan, setNamaUtusan] = useState('');
  const [frekuensiKontak, setFrekuensiKontak] = useState('');
  const [perintahMisi, setPerintahMisi] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const stampRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useTactileSound();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (stampRef.current) {
        try {
          anime.remove(stampRef.current);
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('stampThud');
    setIsSubmitted(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger stamp slam animation on confirmation element
    timeoutRef.current = setTimeout(() => {
      if (!stampRef.current) return;

      if (prefersReducedMotion) {
        try {
          stampRef.current.style.transform = 'rotate(-3deg) scale(1)';
          stampRef.current.style.opacity = '1';
        } catch {
          // Fallback for headless environments
        }
        return;
      }

      try {
        anime.remove(stampRef.current);
        anime({
          targets: stampRef.current,
          scale: [2.6, 1],
          rotate: [-18, -3],
          opacity: [0, 1],
          duration: 650,
          easing: 'easeOutElastic(1, .6)',
        });
      } catch {
        // Fallback for headless environments
      }
    }, 50);

    // Prepare mailto link
    try {
      const subject = encodeURIComponent(`[DISPOSISI MILITER] Perintah Tugas dari ${namaUtusan}`);
      const body = encodeURIComponent(
        `Nama Utusan: ${namaUtusan}\nFrekuensi Kontak: ${frekuensiKontak}\n\nPerintah Misi:\n${perintahMisi}\n\n--- Dikirim via Dokumen Portofolio Dossier Eren Vanguard ---`
      );
      // Construct fallback mailto
      const mailtoUrl = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      // In browser environment, we can set location or open link if desired
      if (typeof window !== 'undefined' && window.location) {
        // Delay opening to let sound & stamp finish playing smoothly
        setTimeout(() => {
          try {
            window.location.href = mailtoUrl;
          } catch {
            // Ignore if blocked in tests
          }
        }, 800);
      }
    } catch {
      // Graceful error handling
    }
  };

  const handleReset = () => {
    playSound('paperSlide');
    setIsSubmitted(false);
    setNamaUtusan('');
    setFrekuensiKontak('');
    setPerintahMisi('');
  };

  const handleLinkClick = () => {
    playSound('penClick');
  };

  return (
    <section aria-label="Kontak Requisition" className="relative max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Archival Telegraph Header */}
      <header className="border-t-2 border-b-2 border-double border-iron/60 py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-iron/80 bg-parchment-dark/20 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-widest text-iron">FORMULIR PENUGASAN DIVISI</span>
          <span className="text-iron/40">//</span>
          <span className="tracking-wider">KORPS PENINJAU REKAYASA</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-iron/70">KODE: DSP-902-850</span>
          <span className="font-semibold text-blood tracking-wider">SALURAN RESMI</span>
        </div>
      </header>

      {/* Main Title & Order Instruction */}
      <div className="border-b border-iron/20 pb-4">
        <div className="inline-block border border-iron/40 px-2 py-0.5 mb-1.5 font-mono text-[10px] uppercase tracking-widest text-iron/70 bg-parchment-light/60">
          FORMULIR TELEGRAF PENUGASAN DIVISI
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-iron tracking-wider uppercase leading-none">
          SURAT PERINTAH DISPOSISI
        </h1>
        <p className="font-garamond text-base sm:text-lg text-iron/80 italic mt-2">
          Kirimkan perintah tugas, permohonan kolaborasi taktis, atau instruksi ekspedisi langsung ke markas komando frontend.
        </p>
      </div>

      {/* Telegraph Form Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left / Main Requisition Form */}
        <div className="md:col-span-8 border border-iron/40 bg-parchment-light/70 p-6 sm:p-7 shadow-xs relative">
          {/* Subtle Stencil Stamp in Corner */}
          <div className="absolute top-3 right-4 font-mono text-[9px] uppercase tracking-widest text-iron/30 select-none pointer-events-none">
            [ FORMULIR REF: TEL-REQ-850 ]
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Field 1: Nama Utusan */}
              <div className="space-y-1.5">
                <label
                  htmlFor="nama-utusan"
                  className="block font-mono text-xs font-bold uppercase tracking-wider text-iron"
                >
                  Nama Utusan <span className="text-blood">*</span>{' '}
                  <span className="font-normal text-iron/60 text-[11px]">
                    (Identitas Pemohon / Pangkat & Instansi)
                  </span>
                </label>
                <input
                  id="nama-utusan"
                  type="text"
                  required
                  value={namaUtusan}
                  onChange={(e) => setNamaUtusan(e.target.value)}
                  placeholder="Misal: Kapten Erwin Smith // Divisi Operasi"
                  className="w-full bg-parchment/60 border border-iron/40 focus:border-iron focus:bg-parchment px-3.5 py-2 font-mono text-xs text-iron outline-none transition-colors placeholder:text-iron/40 shadow-inner"
                />
              </div>

              {/* Field 2: Frekuensi Kontak */}
              <div className="space-y-1.5">
                <label
                  htmlFor="frekuensi-kontak"
                  className="block font-mono text-xs font-bold uppercase tracking-wider text-iron"
                >
                  Frekuensi Kontak <span className="text-blood">*</span>{' '}
                  <span className="font-normal text-iron/60 text-[11px]">
                    (Pos Elektronik / Jalur Radio Balasan)
                  </span>
                </label>
                <input
                  id="frekuensi-kontak"
                  type="email"
                  required
                  value={frekuensiKontak}
                  onChange={(e) => setFrekuensiKontak(e.target.value)}
                  placeholder="utusan@markas-korps.org"
                  className="w-full bg-parchment/60 border border-iron/40 focus:border-iron focus:bg-parchment px-3.5 py-2 font-mono text-xs text-iron outline-none transition-colors placeholder:text-iron/40 shadow-inner"
                />
              </div>

              {/* Field 3: Perintah Misi */}
              <div className="space-y-1.5">
                <label
                  htmlFor="perintah-misi"
                  className="block font-mono text-xs font-bold uppercase tracking-wider text-iron"
                >
                  Perintah Misi <span className="text-blood">*</span>{' '}
                  <span className="font-normal text-iron/60 text-[11px]">
                    (Uraian Tugas / Rencana Ekspedisi Proyek)
                  </span>
                </label>
                <textarea
                  id="perintah-misi"
                  required
                  rows={5}
                  value={perintahMisi}
                  onChange={(e) => setPerintahMisi(e.target.value)}
                  placeholder="Tuliskan mandat penugasan, spesifikasi sistem antarmuka yang dibutuhkan, jadwal ekspedisi, atau pesan kolaborasi Anda di sini..."
                  className="w-full bg-parchment/60 border border-iron/40 focus:border-iron focus:bg-parchment p-3 font-garamond text-base text-iron outline-none transition-colors placeholder:text-iron/40 resize-none shadow-inner leading-relaxed"
                />
              </div>

              {/* Submission Button with Wax Stamp Feel */}
              <div className="pt-2 flex items-center justify-between">
                <div className="font-caveat text-sm text-[#7A4B3A] italic">
                  * Disposisi akan diteruskan melalui saluran telegraf resmi.
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#8B3A2E] text-parchment font-cinzel text-xs font-bold tracking-widest uppercase hover:bg-[#722A20] active:scale-95 border border-iron/40 shadow-md transition-all flex items-center gap-2 select-none"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>KIRIMKAN DISPOSISI</span>
                </button>
              </div>
            </form>
          ) : (
            /* Post-Submission Dispatch Confirmation & Wax Stamp */
            <div
              data-testid="dispatch-confirmation"
              className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-5"
            >
              {/* Slammed Wet Ink Wax Seal */}
              <div
                ref={stampRef}
                className="inline-flex flex-col items-center justify-center p-4 border-4 border-double border-[#8B3A2E] text-[#8B3A2E] bg-[#8B3A2E]/10 rounded-xs select-none shadow-lg max-w-sm -rotate-3"
              >
                <span className="font-cinzel font-black text-xl tracking-widest leading-none">
                  TERDISPOSISI // RESMI
                </span>
                <span className="font-mono text-[9px] tracking-widest uppercase opacity-90 mt-1">
                  KORPS PENINJAU // KOMANDO PUSAT
                </span>
                <span className="font-caveat text-sm mt-1 text-[#7A4B3A]">
                  Mandat Resmi Terdaftar dalam Manifes
                </span>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="font-cinzel text-xl font-bold text-iron">
                  KONFIRMASI TRANSMISI DITERIMA MARKAS PUSAT
                </h3>
                <p className="font-garamond text-base text-iron/85 leading-relaxed">
                  Surat perintah dari utusan <strong className="text-iron font-semibold">{namaUtusan}</strong> telah
                  diarsipkan dalam manifes transmisi. Saluran telegraf kami akan segera membalas ke frekuensi{' '}
                  <strong className="text-blood font-mono text-xs">{frekuensiKontak}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-4 py-2 border border-iron/40 font-mono text-xs text-iron hover:bg-parchment-dark/40 active:scale-95 transition-all select-none"
              >
                [ KIRIM DISPOSISI TAMBAHAN ]
              </button>
            </div>
          )}
        </div>

        {/* Right / Fast Telegraph Direct Channels */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Dispatch Notice Card */}
          <div className="border border-iron/30 bg-parchment-light/40 p-4 font-mono text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-blood font-bold tracking-wider">
              <Radio className="w-4 h-4" />
              <span>SALURAN TELEGRAF CEPAT</span>
            </div>
            <p className="text-[11px] text-iron/70 leading-relaxed font-garamond text-sm">
              Untuk jalur transmisi mendesak, utusan dapat menghubungkan saluran eksternal secara langsung ke pos komando.
            </p>
          </div>

          {/* Direct Communication Channels with strict target="_blank" and rel="noopener noreferrer" */}
          <div className="border border-iron/30 bg-parchment-light/60 p-4 space-y-3 font-mono text-xs">
            <span className="block font-bold text-iron text-[11px] uppercase tracking-wider border-b border-iron/15 pb-1">
              SIMPUL JARINGAN EKSTERNAL
            </span>

            <div className="flex flex-col gap-2.5">
              {/* GitHub Link */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="p-2.5 border border-iron/20 bg-parchment/60 hover:bg-parchment hover:border-iron/50 text-iron flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider">GITHUB</span>
                  <span className="text-[10px] text-iron/50">/aorysan</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-iron/50 group-hover:text-iron group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* LinkedIn Link */}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="p-2.5 border border-iron/20 bg-parchment/60 hover:bg-parchment hover:border-iron/50 text-iron flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider">LINKEDIN</span>
                  <span className="text-[10px] text-iron/50">/in/aryo-adi</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-iron/50 group-hover:text-iron group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Telegram Link */}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="p-2.5 border border-iron/20 bg-parchment/60 hover:bg-parchment hover:border-iron/50 text-iron flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider">TELEGRAM</span>
                  <span className="text-[10px] text-iron/50">@aorysan</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-iron/50 group-hover:text-iron group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Direct Email Link */}
              <a
                href={`mailto:${EMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="p-2.5 border border-iron/20 bg-parchment/60 hover:bg-parchment hover:border-iron/50 text-iron flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider">EMAIL RESMI</span>
                  <span className="text-[10px] text-iron/50">aryoadiputro</span>
                </div>
                <Mail className="w-3.5 h-3.5 text-iron/50 group-hover:text-blood transition-colors" />
              </a>
            </div>
          </div>

          {/* Pinned Note */}
          <div className="border-l-2 border-blood bg-parchment-dark/30 p-3 font-caveat text-base text-iron/80">
            "Setiap transmisi yang masuk akan ditinjau dalam tempo 1x24 jam operasional."
          </div>
        </div>
      </div>
    </section>
  );
};
