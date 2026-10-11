# Blejar English! — Monster Spelling

Game bahasa Inggris untuk anak SD. Next.js 16 + Tailwind 4 + GSAP + Framer Motion + Lenis.

    npm install
    npm run dev     # http://localhost:3000

- `/` landing (GSAP intro + ScrollTrigger, Lenis smooth scroll)
- `/play` petualangan ksatria dunia terbuka (canvas): jalan WASD/panah, tebas SPASI, quest bahasa Inggris setelah monster kalah
- `/arena` mode lama: peta pulau 3D + battle monster
- Soal & kosakata: `lib/vocab.ts`, `lib/questions.ts` (tambah kata di sini)
- Suara: `lib/sfx.ts`, `lib/music.ts` (WebAudio), pengucapan: `lib/speech.ts` (Web Speech API)
- Progress bintang disimpan di localStorage

- Engine dunia: `components/world/engine.ts` | Quest: `lib/quests.ts`, `lib/questions.ts`, `lib/vocab.ts` (tambah kata/kalimat di sini)


## Monster (bestiary)
9 monster dari sprite sheet: Rocky, Wispal, Venomspine, Sandrex, Frostborn, Lurker, Boulderback, Treetank (bos), Magma Brute (bos).
- Data & statistik: `lib/bestiary.ts`
- Gambar: `public/monsters/<id>-{idle,hurt,dead,hero}.png` (ganti file untuk mengubah tampilan)
- Tahapan: **idle** (normal) -> **hurt** (kena pukul & saat nyawa <= 50%) -> **dead** (tergeletak lalu memudar, baru muncul quest)
- Monster baru muncul bertahap sesuai level (`minLevel`); bos memberi quest susun kalimat + XP ekstra.

## Semi-3D
Kamera miring + perspektif ada di `components/world/engine.ts` (konstanta TILT dan DEPTH_K di atas file). TILT makin kecil = lantai makin miring; DEPTH_K makin besar = perbedaan ukuran dekat/jauh makin kuat.
