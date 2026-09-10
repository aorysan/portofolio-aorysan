# Gamified Field-Expedition Dossier Portfolio — Design Specification

## 1. Ringkasan & Visi Desain
Mengganti antarmuka lama dengan antarmuka bertema **"Found Field-Expedition Document" / Korps Peninjau (Scout Regiment Military Archive)** yang diadaptasi dari purwarupa Figma Make. Desain ini mengusung estetika map berkas intelijen fisik di atas meja kerja ekspedisi, diperkuat dengan animasi taktil berbasis **Anime.js** dan efek suara sintetis tanpa aset eksternal.

## 2. Arsitektur Layout & Navigasi Meja Berkas
### 2.1 Komposisi Meja Kerja (*Workdesk Shell*)
- **Latar Meja (*Underlay*)**: Tekstur meja kerja ekspedisi militer gelap (`#151412` dengan vignette dan pencahayaan lampu minyak di sudut).
- **Lembaran Perkamen Berkas (*Dossier Sheet*)**:
  - Ukuran: Container terpusat dengan rasio dokumen folio/A4 horizontal responsif.
  - Warna Dasar: Perkamen usang bertekstur (`#E8DCC0` / `#F0E6D2`) dengan batas tepi kertas tajam (tanpa rounded-corners modern), noda air/lumpur vintage, dan drop-shadow tipis bertumpuk.
  - Scroll Behavior: Meja kerja dan tab navigasi terkunci pas 1 layar (*fixed pinned viewport*). Konten di dalam lembar kertas yang melebihi batas tinggi layar menggunakan *internal smooth scroll* dengan scrollbar vintage tipis bertema tinta besi.
- **Tab Pembatas Arsip Vertikal (*Right Sidebar Tabs*)**:
  - Berada di sisi kanan lembaran kertas menyerupai *divider tab* map fisik dengan 6 ikon taktis:
    1. `#berkas` — Ikon Berkas Dokumen Personel (Hero & Overview)
    2. `#jurnal` — Ikon Buku Catatan Harian (About & Background)
    3. `#inventaris` — Ikon Pedang Manuver (Skills & Tech Stack)
    4. `#laporan` — Ikon Kompas Ekspedisi (Featured Projects)
    5. `#kronik` — Ikon Peti Waktu (Experience Timeline)
    6. `#kontak` — Ikon Pena Bulu / Surat Perintah (Contact & Requisition)
  - Tab aktif menonjol ke kanan beberapa piksel dengan aksen warna kulit usang.

### 2.2 Navigasi & Sinkronisasi Rute
- State berkas aktif dikelola melalui React state yang tersinkronisasi dua arah dengan URL Hash (`/#berkas`, `/#jurnal`, dll.).
- Mendukung navigasi browser (*back/forward*) dan *deep linking*.
- Tautan eksternal (GitHub repository, live demo) dibuka di tab baru dengan atribut `target="_blank"` dan `rel="noopener noreferrer"`.

## 3. Detail Konten 6 Lembar Berkas
### 3.1 Lembar `#berkas` (Laporan Personel)
- **Kotak Header Dokumen**: Border ganda klasik dengan nomor `ARSIP NO: 782-X`, stempel merah `STATUS: RAHASIA`, dan catatan marginalia miring: *“— jangan hilangkan lagi.”*
- **Identitas Personel**:
  - Nama Utama: `EREN VANGUARD` (font serif megah `Cinzel`).
  - Jabatan Taktis: `PAKAR REKAYASA ANTARMUKA` (*Frontend Engineer*).
  - Manifesto Ekspedisi: Rangkuman dedikasi membangun antarmuka web yang tangguh, rapi, dan berperforma tinggi.
- **Poster Polaroid Taktis**: Poster visual ekspedisi Korps Peninjau yang ditempel miring menggunakan tekstur selotip transparan di sudut atas.
- **Tombol Aksi Cepat**: Tombol bergaya cap dinas untuk mengunduh rekam jejak (*Download CV/Resume*) dan pintasan ke laporan proyek.

### 3.2 Lembar `#jurnal` (Entri Jurnal #104)
- **Format Catatan Lapangan**: Teks naratif autobiografi dengan huruf pembuka *drop cap* klasik.
- **Bar Sensor Interaktif (`[████]`)**: Balok hitam penyensor tanggal, lokasi, atau informasi sandi yang dapat dibuka (*declassified*) saat disorot kursor atau diklik.
- **Catatan Marginalia Tinta Karat**: Catatan kaki informal di sisi samping kertas.

### 3.3 Lembar `#inventaris` (Daftar Inventaris & Perlengkapan)
- **Sub-header**: *“— diperiksa ulang sebelum tiap ekspedisi.”*
- **4 Peti Taktis Hijau Lumut (`#3D4A34`)** dengan aksen rivet besi sudut:
  1. *Senjata Utama (Front-End)*: React, Next.js, TypeScript, Tailwind CSS, Anime.js.
  2. *Perlengkapan Taktis (Tools)*: Figma (Pemetaan), Git / GitHub, Vite, Vitest.
  3. *Logistik (Back-End / API)*: Node.js, REST API, Database / SQL.
  4. *Kemampuan Bertahan (Core Abilities)*: Optimasi Performa, Web Accessibility (WCAG), Clean Code Architecture.
- Tiap item memiliki indikator checkbox taktis militer.

### 3.4 Lembar `#laporan` (Laporan Ekspedisi / Proyek Unggulan)
- **Grid Laporan Asimetris**: Kartu-kartu proyek ditumpuk tidak beraturan dengan sedikit rotasi natural (`-1.2deg` s/d `+1deg`).
- **Stempel Status Basah**:
  - `SELESAI`: Proyek terselesaikan & live.
  - `BERJALAN`: Proyek riset aktif / sedang dikembangkan.
  - `ARSIP`: Eksperimen kode & open-source terdahulu.
- **Aksi Proyek**: Stempel tautan langsung ke repositori GitHub dan demo web.

### 3.5 Lembar `#kronik` (Kronik Perjalanan / Riwayat Waktu)
- **Sumbu Ekspedisi Vertikal**: Garis timeline bertaut dengan simpul medali besi kuningan.
- **Entri Perjalanan**: Urutan riwayat pendidikan, magang, pengalaman kerja, dan tonggak pencapaian dalam format catatan dinas militer.

### 3.6 Lembar `#kontak` (Surat Disposisi Tugas / Requisition)
- **Formulir Telegram Militer**:
  - Kolom *Nama Utusan* (Pengirim).
  - Kolom *Frekuensi Sandi* (Email / Kontak).
  - Kolom *Perintah Misi* (Pesan Kebutuhan Kolaborasi).
- **Tombol Kirim Segel Lilin**: Mengirimkan pesan atau membuka klien email resmi, dilengkapi tautan media komunikasi langsung (LinkedIn, GitHub, Telegram).

## 4. Sistem Animasi Anime.js & Efek Taktil
Implementasi animasi menggunakan library `animejs` yang dihubungkan melalui React ref dan lifecycle:
1. **Transisi Kertas Berkas (*Paper Shuffle*)**:
   - Lembar lama: `translateX: [0, 60px]`, `rotate: [0, 2.5deg]`, `opacity: [1, 0]`, durasi 280ms, easing `easeInQuad`.
   - Lembar baru: `translateX: [-40px, 0]`, `translateY: [20px, 0]`, `rotate: [-1.5deg, 0]`, `opacity: [0, 1]`, durasi 450ms, delay 100ms, easing `easeOutCubic`.
2. **Hantaman Stempel Basah (*Wet Ink Stamp Slam*)**:
   - `scale: [2.8, 1]`, `rotate: [-20deg, -4deg]`, `opacity: [0, 0.95]`, durasi 650ms, easing `easeOutElastic(1.1, 0.5)`.
   - Diikuti *micro-desk shake* pada lembar kertas (`translateY: [-2px, 1px, 0]`, durasi 150ms).
3. **Kupas Selotip Sensor Hitam (*Redacted Bar Peel*)**:
   - Hover/Click: `scaleX: [1, 0]`, `transformOrigin: 'left'`, durasi 300ms, easing `easeInOutCubic`.
4. **Jatuhnya Peti Inventaris & Centang Pena Tinta (*Crate Drop & SVG Check*)**:
   - Peti: `translateY: [-35px, 0]`, `opacity: [0, 1]`, delay `anime.stagger(80)`, easing `easeOutBounce`, durasi 600ms.
   - Checklist SVG: `strokeDashoffset: [anime.setDashoffset, 0]`, easing `easeInOutSine`, durasi 350ms, delay `anime.stagger(50, { start: 400 })`.
5. **Akselerasi GPU & Aksesibilitas**:
   - Hanya memanipulasi properti `transform` dan `opacity` untuk menjamin 60 FPS bebas *layout reflow*.
   - Mendukung media query `@media (prefers-reduced-motion)`: animasi gerakan digantikan dengan transisi *instant fade* tanpa getaran.

## 5. Audio Taktil (*Tactile Sound Engine*)
Menggunakan Web Audio API sintetis (0 beban unduhan file audio eksternal):
- **Paper Slide/Rustle**: Sapuan noise putih terfilter bandpass saat pergantian berkas.
- **Stamp Thud**: Nada rendah berbobot saat stempel merah mendarat di kertas.
- **Tape Peel**: Kemerisik lembut saat sensor hitam dibuka.
- **Pen/Key Click**: Bunyi klik pena tajam saat tombol navigasi atau link ditekan.
- **Tombol Mute**: Disediakan tombol bisu/suara di sudut kanan bawah meja dengan persistensi ke `localStorage`.

## 6. Tipografi & Desain Token
- **Warna**:
  - Perkamen Dokumen: `#E8DCC0` (latar utama), `#F4EDE0` (sorotan), `#D8C7A5` (bayangan lipatan).
  - Tinta Besi Hitam: `#1C1B18` (teks utama).
  - Tinta Karat / Marginalia: `#7A4B3A` (catatan pinggir & coretan).
  - Stempel Merah Darah: `#8B3A2E` (cap status rahasia & lencana).
  - Peti Taktis Hijau Lumut: `#3D4A34` (kotak inventaris).
  - Latar Meja Kerja: `#151412` (area luar dokumen).
- **Tipografi**:
  - Headings: `Cinzel`, serif romawi militer.
  - Body: `EB Garamond` / `Lora`, serif arsip klasik.
  - Marginalia: `Caveat`, tulisan tangan tinta kuas.
- **Ikon**: `lucide-react`.

## 7. Responsivitas Layar
- **Desktop (≥ 1024px)**: Meja kerja penuh, lembaran berkas folio di tengah, tab arsip vertikal di sebelah kanan kertas.
- **Mobile & Tablet (< 1024px)**: Tab arsip vertikal beralih menjadi navigasi bilah bawah horizontal (*Bottom Expedition Bar*) yang ramah sentuhan (target min 44x44px). Lembaran berkas melebar fleksibel dengan *smooth vertical scroll*.

## 8. Verifikasi & Pengujian
- **Unit & Component Testing**: Vitest untuk memastikan pergantian tab, integrasi hook Anime.js, dan render 6 modul berkas tanpa error.
- **Visual & Audio Verification**: Memastikan audio Web Audio API berjalan tanpa distorsi dan animasi Anime.js berjalan lancar pada 60 FPS di browser.
