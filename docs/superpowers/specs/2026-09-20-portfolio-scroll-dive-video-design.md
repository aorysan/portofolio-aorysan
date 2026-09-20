# Portfolio Scroll + Campaign Dive + Vision Video — Design Spec

Tanggal: 2026-09-20
Status: APPROVED (pendekatan B — full rewrite sesuai request)
Scope: `src/components/dark-fantasy/`, `src/components/SmoothScroll.tsx`, `src/hooks/`, `public/videos/`
Bukan scope: `dossier/`, `portfolio/`, `gamified/`, backend form, CMS.

Request asli (6 poin):
1. Tombol ADVANCE section 0 mati — mau pindah ke section 1.
2. NavRail kanan tidak live mengikuti konten terbuka.
3. Section 1 (Creed): saat masuk section tulisan langsung menyala semua, juga saat NavRail diklik (sekarang harus scroll dulu).
4. Animasi konten reversible mengikuti viewport: scroll bawah → play masuk + bertahan; scroll atas sampai konten keluar bawah viewport → reverse animasi masuk.
5. Section Campaign: ubah horizontal kanan→kiri menjadi dive menusuk tembok (Sina terdalam = proyek tertua → Rose → Maria = terbaru → Beyond = kebebasan). Cari pola GSAP/animejs yang ada.
6. Section 4 (Vision): video background dari YouTube `https://www.youtube.com/watch?v=gNwABGACsfY` detik 46–48 loop, simpan lokal ke repo.

## 1. Phase 1 — Root cause (evidence, bukan tebakan)

### 1.1 ADVANCE mati — `DarkFantasyShell.tsx:26-47` + `SmoothScroll.tsx:69-95`
- `goToSection` early-return `if (clamped === activeIndex) return`. `activeIndex` hanya di-set saat klik, tidak pernah di-update saat scroll manual. Akibat: sekali klik ADVANCE (0→1) membuat `activeIndex=1`; jika user scroll manual balik ke atas, klik ADVANCE lagi = `goToSection(1)` dengan `activeIndex` masih 1 → no-op. Tombol terlihat mati.
- `scrollTo` closure membaca `lenisRef.current`. Provider value `{{ lenis: lenisRef.current, ... }}` selalu `null` di render pertama (stale), tapi `scrollTo` sendiri masih benar karena baca ref. Lenis init bisa gagal diam-diam bila `prefers-reduced-motion` atau `ResizeObserver` undefined → fallback `scrollIntoView` dipakai, yang konflik dengan pin spacer ScrollTrigger (posisi anchor bergeser oleh pin Creed `+=120%` dan pin CampaignsJourney).
- Kesimpulan: bukan satu bug, tapi tiga lapis: state usang + anchor vs pin + fallback tidak sinkron. Fix harus di ketiga lapis, bukan cuma `onClick`.

### 1.2 NavRail tidak live — `NavRail.tsx:12-15` + `DarkFantasyShell.tsx:22`
- `activeIndex` hanya `useState(0)` + `setActiveIndex` di `goToSection`. Tidak ada `IntersectionObserver` / `ScrollTrigger.onToggle` / `lenis.on('scroll')`. Jadi rail hanya berubah saat diklik.
- Fix butuh scroll-spy terpisah dari click-set (bedakan `activeIndex` vs `targetIndex` agar tidak feedback loop).

### 1.3 Creed harus di-scroll — `CreedSection.tsx:28-50`
- Desktop: `fromTo opacity 0.15→1 stagger 0.05` dengan `pin: true, scrub: 1, end: '+=120%'`. Masuk section = awal scrub (redup). Harus scroll sejauh 120% viewport untuk menyala penuh. Klik NavRail scroll ke `#creed` top = posisi redup.
- Mobile `<768px` early-return: tidak ada animasi sama sekali (visible default) — inkonsisten dengan desktop.
- Fix: mode enter-play langsung nyala + event complete saat navigasi via klik.

### 1.4 Sekali jalan, tidak reverse — `ArsenalSection.tsx:55-70`
- `once: true` + `fromTo` tanpa `toggleActions` reverse. Setelah reveal, ScrollTrigger dimatikan. Vision/Arsenal tidak reverse saat keluar bawah viewport.
- Fix: standarisasi `toggleActions: 'play none none reverse'`.

### 1.5 Campaign horizontal — `CampaignsJourney.tsx:31-49`, `CampaignsSection.tsx:36`
- Horizontal `x: -(scrollWidth - innerWidth)` + `pin: true` hanya `isLargeScreen && !reducedMotion`. User mau dive vertikal zoom. Tidak bisa ditempel — harus rewrite timeline (struktur DOM + pin distance + data zone tetap dipakai ulang).
- Data sudah siap: `dark-fantasy-data.ts:78-159` `wallZone sina/rose/maria` + era oldest/mid/newest. `WallBreach.tsx` 12 fragmen GPU-only bisa dipakai ulang sebagai overlay breach per lapis.

### 1.6 Vision tanpa video — `VisionSection.tsx:22-48`
- Hanya `xPercent` scrub + storm overlay. Tidak ada `<video>`. Autoplay browser mewajibkan muted + playsInline. Reduced-motion harus matikan video.

## 2. Keputusan arsitektur (B dipilih, A/C ditolak)

- A (patch minimal, campaign tetap horizontal + depth CSS): ditolak — tidak memenuhi request no.5.
- B (dipilih): scroll-spy ScrollTrigger + reveal reversible standar + wall-dive pin vertikal + video lokal. Risiko pin+Lenis sudah terbukti bisa diatasi (lihat commit `23a9acf` pinSpacing fix) — pola yang sama dipakai ulang.
- C (tanpa GSAP pin, hanya IO + CSS): ditolak — kehilangan scrub halus yang sudah ada di hero/creed, dan user eksplisit minta pola GSAP/animejs.

Aturan global:
- GSAP register guard tetap: `typeof window !== 'undefined' && typeof window.matchMedia === 'function'` (jangan diubah — jsdom crash kalau dilonggarkan).
- Semua animasi non-esensial mati total bila `useReducedMotion()` true. Video tidak autoplay, tampil poster.
- GPU transform only (`transform`/`opacity`), `will-change` pada track yang di-pin. Maks 12 fragmen debris per breach (spec lama §3.6.2).

## 3. Desain per workstream

### 3.1 W1 — ADVANCE + `scrollTo` (fix root cause, bukan simptom)
- `DarkFantasyShell`: hapus early-return pemblokir. Pisahkan `activeIndex` (dari scroll-spy) dan navigasi eksplisit:
  ```ts
  const goToSection = (index: number) => {
    const clamped = clamp(index);
    playSound('paperSlide');
    setActiveIndex(clamped); // optimistis, lalu dikoreksi scroll-spy
    scrollToSectionId(SECTION_IDS[clamped]); // selalu scroll, walau index sama
  };
  ```
- `SmoothScroll.scrollTo`: stabilkan dengan `useCallback`, baca `lenisRef.current` saat dipanggil. Target berupa id string → `document.querySelector`. Jika Lenis ada: `lenis.scrollTo(el, { duration: 1.4, offset: 0 })`. Jika tidak: `el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })`. Bungkus try/catch, fallback diam.
- Tambah `useEffect` `ScrollTrigger.refresh()` setelah font/image load agar posisi anchor pin akurat.
- Test: unit `clamp` + mock `scrollTo` selalu dipanggil walau index sama; e2e manual klik ADVANCE 2x (atas → creed → balik atas → ADVANCE lagi tetap jalan).

### 3.2 W2 — NavRail live (scroll-spy)
- Hook baru `src/hooks/useSectionSpy.ts`: untuk tiap `SECTION_IDS`, buat `ScrollTrigger.create({ trigger: '#id', start: 'top center', end: 'bottom center', onToggle: self => self.isActive && onActive(index) })`. Alasan `center/center`: stabil walau ada section yang di-pin (Creed/Campaigns). Alternatif IO `rootMargin: '-45% 0px -45% 0px'` sebagai fallback bila ScrollTrigger absen (jsdom/test).
- `DarkFantasyShell`: `useSectionSpy(SECTION_IDS, setActiveIndex)`. Klik NavRail tetap panggil `goToSection` (optimistis), scroll-spy mengoreksi ≤1 frame kemudian. Tidak ada loop karena setter idempoten.
- A11y: `aria-current` sudah ada di `NavRail.tsx:29`, pertahankan. Tambah `aria-live="polite"` di nav? Tidak — terlalu berisik. Cukup `aria-current`.

### 3.3 W3 — Creed langsung nyala
- Hapus `pin` + `scrub` Creed. Ganti dengan enter-play:
  ```ts
  gsap.fromTo('.creed-word', { opacity: 0.15 }, {
    opacity: 1, stagger: 0.02, duration: 0.5, ease: 'power1.out',
    scrollTrigger: { trigger: container, start: 'top 75%', toggleActions: 'play none none reverse' },
  });
  ```
- Event navigasi: `window.dispatchEvent(new CustomEvent('creed:complete'))` dipanggil `goToSection` saat target `#creed`. `CreedSection` listen: `gsap.to('.creed-word', { opacity: 1, duration: 0.3, overwrite: true })`. Juga `onEnter`/`onEnterBack` ScrollTrigger melakukan hal yang sama — jadi baik scroll manual maupun klik hasilnya sama: masuk viewport = langsung nyala.
- Mobile dan desktop kini konsisten (tidak ada early-return `<768px` lagi kecuali reduced-motion).
- Narasi 2 kolom + stats tidak diubah.

### 3.4 W4 — Reveal reversible standar
- Util baru `src/hooks/useReveal.ts` (atau fungsi `revealUp(ctx, selector)`):
  ```ts
  gsap.fromTo(sel, { opacity: 0, y: 28, scale: 0.98 }, {
    opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 15%', toggleActions: 'play none none reverse' },
  });
  ```
  Semantik persis request: scroll bawah masuk → play; bertahan selama di viewport/di atasnya; scroll atas sampai keluar bawah viewport → reverse ke state masuk.
- Terapkan ke: `.arsenal-card` (ganti `once:true`), Vision `.horizon-item`, Summon form blocks, Campaign fallback grid cards. Hero headline entrance (animejs) tidak diubah — itu load animation, bukan scroll reveal.
- Reduced-motion: lewati `fromTo`, pastikan opacity 1 via style guard seperti `CreedSection.tsx:81` yang sudah ada.

### 3.5 W5 — Campaign wall-dive (menggantikan horizontal)
- Struktur baru `CampaignsDive.tsx` (ganti isi `CampaignsJourney.tsx`, nama file boleh tetap agar import tidak pecah, atau rename + update `CampaignsSection.tsx:5`):
  - Outer `height: 420vh`, inner sticky `h-screen overflow-hidden` di-pin via ScrollTrigger `pin: true, scrub: 1, end: '+=320%'`.
  - Timeline 4 segmen (scrub): Sina (proyek tertua, `wallZone==='sina'`) scale 1→1.6 opacity 1→0 + breach overlay retak; Rose; Maria (terbaru); Beyond (freedom panel, reuse markup `CampaignsJourney.tsx:177-192`).
  - Tiap lapis `absolute inset-0 flex items-center` dengan kartu proyek reuse `renderProjectCard` yang ada (w-80/96). Label zona reuse: `ZONE 01 · INTERIOR / WALL SINA` dst.
  - Breach: reuse `WallBreach` sebagai overlay tengah yang `scale` + `opacity` per segmen, bukan sekat horizontal lagi. Debris tetap 12.
  - Fallback: `showHorizontalJourney` lama dihapus; kondisi baru `showDive = isLargeScreen && !reducedMotion`. Kecil/reduced → grid vertikal yang sudah ada di `CampaignsSection.tsx:63-119` tanpa perubahan.
  - Lenis + pin: `pinSpacing: true` wajib (pelajaran `23a9acf` — parent `#campaigns` flex mematikan pinSpacing default). `invalidateOnRefresh: true`, `anticipatePin: 1`.
- Urutan kronologi dikunci: Sina (FrameWork 2023, Jawara 2023) → Rose (KampungKu, Rest Area, SarPras 2024) → Maria (TrasMart 2024) → Beyond. Jangan urut alfabet.

### 3.6 W6 — Vision video loop 46–48s lokal
- File: `public/videos/vision-sea-loop.mp4` (+ `webm` bila ukuran memungkinkan, target <2MB untuk 2 detik, 720p, 24fps, tanpa audio). Poster: `public/videos/vision-sea-poster.jpg` (frame detik 46).
- Ekstraksi BUKAN oleh bot di CI (hindari ToS issue di runner). Script terdokumentasi `docs/videos/extract-vision.sh`:
  ```sh
  yt-dlp -f "bv*[height<=720]" --download-sections "*46-48" "https://www.youtube.com/watch?v=gNwABGACsfY" -o vision-sea-loop.mp4
  ffmpeg -i vision-sea-loop.mp4 -an -c:v libx264 -crf 23 -r 24 -s 1280x720 vision-sea-loop.mp4
  ffmpeg -ss 0 -i vision-sea-loop.mp4 -vframes 1 vision-sea-poster.jpg
  ```
  Pemilik repo menjalankan sekali secara lokal, commit hasilnya. Persetujuan user "Extract & simpan lokal" sudah mencakup langkah ini.
- Markup `VisionSection`: `<video autoplay muted loop playsInline preload="metadata" poster=...>` absolute cover `opacity-25`, di bawah overlay gradient `from-[#0a0908] via-transparent` agar teks `VISION_DATA` tetap kontras. `onError` → sembunyikan video, tampilkan storm overlay lama. Reduced-motion / `matchMedia('(prefers-reduced-motion: reduce)')` → render poster `<img>`, bukan `<video>`.
- Legal: cantumkan atribusi/kepemilikan di spec final bila video bukan milik sendiri; jika ada klaim, fallback ke poster + storm overlay tanpa video.

## 4. Data flow & sentuhan file

- `DarkFantasyShell.tsx`: `goToSection` (tanpa early-return) + `useSectionSpy` + dispatch `creed:complete`.
- `SmoothScroll.tsx`: `scrollTo` `useCallback` stabil + fallback + `ScrollTrigger.refresh()` helper.
- `useSectionSpy.ts` (baru), `useReveal.ts` (baru).
- `CreedSection.tsx`: ganti pin-scrub → enter-play + listener event.
- `ArsenalSection.tsx`, `VisionSection.tsx`, `SummonSection.tsx`: ganti ke `useReveal`.
- `CampaignsJourney.tsx` → `CampaignsDive` timeline; `CampaignsSection.tsx:36` kondisi `showDive`; `WallBreach.tsx` reuse overlay.
- `VisionSection.tsx` + `public/videos/*` + `docs/videos/extract-vision.sh`.
- Tidak ada perubahan data shape (`dark-fantasy-data.ts` dipakai apa adanya).

## 5. Error handling & a11y

- Semua `gsap.context` + `ctx.revert()` cleanup seperti pola yang sudah ada.
- Guard `matchMedia` dan `typeof window` dipertahankan di semua file.
- Video gagal load → poster. Lenis gagal → native smooth scroll. ScrollTrigger gagal → konten visible (opacity 1 default).
- Focus: klik NavRail/ADVANCE memindah focus ke heading section target (`tabIndex={-1}` + `.focus({ preventScroll: true })`) agar SR tahu konteks pindah.
- Kontras teks di atas video dijaga overlay gelap; label kecil tetap parchment, bukan ember (lihat spec lama §1.1).

## 6. Verifikasi

- `bun run test` / `vitest run`: tambah test `useSectionSpy` (mock ScrollTrigger), `goToSection` selalu scroll, `creed:complete` listener, `useReveal` toggleActions string.
- Manual QA: (1) ADVANCE 2x tetap jalan; (2) scroll manual rail ikut live; (3) masuk Creed langsung nyala penuh baik via klik maupun scroll; (4) scroll atas-bawah kartu reverse/ bertahan; (5) dive Sina→Rose→Maria→Beyond urut + pin tidak overlap section berikut; (6) video loop muted 2 detik, poster saat reduced-motion, ukuran <2MB.
- `verification-before-completion`: jangan klaim selesai sebelum `build` + `test` hijau.
