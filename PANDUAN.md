# Panduan Mengubah & Mendalami Blejar English

Panduan ini untuk kamu yang ingin mengubah game ini sendiri sambil belajar game development.
Urutannya sengaja dari yang paling mudah ke yang paling dalam. Kerjakan satu per satu, jangan sekaligus.

---

## 1. Siapkan alur kerja (sekali saja)

```bash
npm install          # pasang dependensi
npm run dev          # jalankan dev server -> buka http://localhost:3000/play
```

Selama `npm run dev` hidup, setiap file yang kamu simpan langsung tampil di browser (hot reload). Tidak perlu build ulang.

| Perintah | Gunanya |
| --- | --- |
| `npm run dev` | Mode belajar. Cepat, ada pesan error yang jelas. |
| `npm run typecheck` | Cek kesalahan tipe TypeScript tanpa menjalankan game. Jalankan sebelum commit. |
| `npm run build` lalu `npm start` | Versi produksi. Dipakai untuk memastikan semuanya benar sebelum deploy. |

### Pakai git sejak awal (sangat disarankan)

```bash
git init && git add -A && git commit -m "versi awal"
git switch -c ubah-lantai      # satu cabang per eksperimen
# ...edit...
git diff                       # lihat apa yang kamu ubah
git commit -am "lantai baru"
```

Kalau eksperimenmu rusak, `git restore <file>` mengembalikan file ke versi terakhir yang kamu commit. Ini membuat kamu berani mencoba.

### Kalau saya mengirim versi baru

Jangan timpa folder lamamu. Ekstrak zip ke folder lain, lalu bandingkan:

```bash
diff -ru folder-lamamu folder-baru -x node_modules -x .next
```

atau commit versimu dulu, salin file baru, lalu lihat `git diff`. Dengan begitu kamu melihat persis apa yang berubah, dan perubahanmu sendiri tidak hilang.

---

## 2. Peta proyek

```
app/
  page.tsx            beranda (landing)
  play/page.tsx       halaman game utama  -> memuat WorldGame
  arena/page.tsx      mode arena (peta pulau + duel)
  globals.css         warna & font (token Tailwind)

components/world/
  engine.ts           OTAK GAME. Class Engine: dunia, gerak, monster, serang, gambar ke canvas
  WorldGame.tsx       lapisan React: HUD, joystick sentuh, layar awal/game over, memanggil quest
  Sprites.tsx         memuat semua gambar (SVG dan PNG) agar bisa digambar di canvas

components/
  QuestPanel.tsx      jendela quest (susun huruf, pilih jawaban, dst.)
  Scenery.tsx         gambar SVG: pohon, batu, awan, ksatria
  Monsters.tsx        komponen <Monster> untuk halaman biasa (beranda, arena)
  Landing.tsx         halaman beranda
  Battle.tsx, Game.tsx, WorldMap.tsx   mode arena

lib/
  bestiary.ts         DATA monster (nama, HP, kecepatan, ukuran, level muncul)
  vocab.ts            DATA kosakata, kalimat isian, kalimat susun
  questions.ts        pembuat soal per jenis (spell, build, missing, ...)
  quests.ts           memilih jenis quest menurut level pemain
  sfx.ts, music.ts    suara dan musik (dibuat dengan WebAudio, tanpa file)
  speech.ts           suara pengucapan (Web Speech API)
  storage.ts          simpan progres di localStorage

public/monsters/      gambar monster: <id>-idle.png, -hurt.png, -dead.png
```

**Aturan praktis:** kalau yang kamu ubah berupa *data* (kata, monster, angka), ubah di `lib/` atau konstanta di atas `engine.ts`. Kalau berupa *perilaku* (cara bergerak, menyerang), ubah di `engine.ts`. Kalau berupa *tampilan menu* (tombol, HUD), ubah di `WorldGame.tsx`.

---

## 3. Cara game ini bekerja (konsep inti)

### 3.1 Dua dunia: React dan Canvas

- **React** menggambar UI biasa: HUD, tombol, jendela quest.
- **Canvas** menggambar dunia game. Ini dikerjakan `Engine` di `engine.ts`, di luar React, karena game butuh redraw 60 kali per detik dan React tidak cocok untuk itu.
- Keduanya berkomunikasi lewat **callback**: Engine memanggil `onKill`, `onStats`, `onGameOver`, lalu `WorldGame` mengubah tampilannya. Dari React ke Engine lewat method seperti `engine.attack()` dan `engine.reward()`.

### 3.2 Game loop

Setiap frame, Engine melakukan dua hal:

```
update(dt)  -> ubah STATE (posisi, HP, timer)       // logika
draw()      -> gambar STATE ke layar                 // tampilan
```

`dt` adalah waktu sejak frame sebelumnya (detik). Semua gerak dikalikan `dt`:
`x += kecepatan * dt`. Dengan begitu game berjalan sama cepatnya di layar 60Hz maupun 144Hz. Ini konsep **delta time**, wajib dipahami.

Cari `private update(dt` dan `private draw()` di `engine.ts`. Baca keduanya dari atas ke bawah sekali. Hampir semua fitur game ada di sana.

### 3.3 Dunia dan koordinat

- Dunia berukuran `WORLD_W x WORLD_H` (3600 x 2600). Posisi pemain dan monster disimpan sebagai `x, y` di dunia ini.
- **Logika (tabrakan, jarak, serangan) memakai koordinat dunia datar.** Efek 3D hanya ada saat *menggambar*.
- Fungsi `proj(x, y)` mengubah koordinat dunia menjadi posisi dan skala di layar (lantai dimiringkan oleh `TILT`, benda jauh mengecil oleh `DEPTH_K`). Fungsi `at(x, y, fn)` menggambar sesuatu di posisi hasil proyeksi itu.
- Urutan gambar memakai **y-sorting**: benda dengan `y` lebih kecil (lebih jauh) digambar dulu, jadi yang lebih dekat menutupinya. Lihat `list.sort(...)` di `draw()`.

### 3.4 Tabrakan

Semua benda dianggap lingkaran. Dua benda bertabrakan kalau jarak pusatnya lebih kecil dari jumlah radius. Sederhana, murah, dan cukup untuk game ini. Lihat `collide()` dan `blocked()`.

### 3.5 Animasi tanpa sprite sheet

Monster hanya satu gambar per tahap, tapi terasa hidup karena `drawMonster` mengubah *transform*-nya: naik-turun (lompatan), gepeng-memanjang (squash and stretch), miring mengikuti arah gerak, dan berbalik halus. Ini disebut animasi prosedural. Teknik yang sama dipakai untuk ksatria di `drawPlayer`, tapi dengan beberapa bagian tubuh terpisah.

Dua alat yang sering muncul:
- **lerp** (interpolasi): `a += (target - a) * min(1, dt * kecepatan)` membuat nilai bergerak halus menuju target. Dipakai untuk kecepatan ksatria, arah hadap monster, dan lain-lain.
- **fase sinus**: `Math.sin(waktu * kecepatan)` menghasilkan gerak bolak-balik halus untuk napas dan goyang.

### 3.6 "Juice" (rasa enak saat bermain)

Hal kecil yang membuat serangan terasa kuat: `hitstop` (game berhenti sesaat saat pedang kena), `shake` (layar bergetar), partikel, kilat putih di monster, teks "-1". Semuanya ada di `swordHit()` dan `drawMonster()`. Coba matikan satu per satu untuk merasakan bedanya.

---

## 4. Resep perubahan (urut dari mudah)

Setiap resep menyebut file dan nama yang harus kamu cari (pakai Ctrl+F / pencarian global di editor).

### Level 1: ubah angka (5 menit)

Semua di `components/world/engine.ts`.

| Mau ubah | Cari | Catatan |
| --- | --- | --- |
| Peluang quest | `QUEST_CHANCE` | 0.5 = 50%. Coba 0.3 atau 1. |
| Kill berturut-turut tanpa quest | `QUEST_PITY` | Setelah sebanyak ini, kill berikutnya pasti quest. |
| Kemiringan lantai | `TILT` | Lebih kecil = lebih miring. 1 = datar seperti dulu. |
| Perbedaan dekat/jauh | `DEPTH_K` | Lebih besar = perspektif lebih kuat. 0 = mati. |
| Kecepatan ksatria | `const maxSp = 255` | Dalam piksel dunia per detik. |
| Jangkauan pedang | `118 + d.r` di `swordHit` | Lebih besar = pedang menjangkau lebih jauh. |
| Nyawa awal | `hp: 5, maxHp: 5` | Muncul di dua tempat: deklarasi `stats` dan `reset()`. |
| XP naik level | `s.xpNext = 40 + ...` di `addXp` | Rumus kenaikan XP per level. |
| Jumlah monster di dunia | `const target = 14` | Dan `respawnT = 4` untuk jeda munculnya. |
| Luas dunia | `WORLD_W`, `WORLD_H` | Dunia lebih besar, perjalanan lebih jauh. |

Setelah ubah, simpan, lihat hasilnya di browser. Ini cara tercepat untuk belajar: ubah, lihat, rasakan.

### Level 2: ubah data (15 menit)

**Tambah kosakata** di `lib/vocab.ts`, array `VOCAB`:

```ts
{ en: "pencil", id: "pensil", emoji: "✏️", cat: "things" },
```

Satu emoji untuk satu kata supaya soal tebak gambar tidak ambigu. Soal spell, listen, missing, dan pic2word otomatis memakainya.

**Tambah kalimat isian** di `SENTENCES`:
```ts
{ text: "I write with a ___.", answer: "pen", options: ["pen", "cup", "bed", "hat"], id: "Aku menulis dengan pulpen." },
```

**Tambah kalimat susun** di `BUILD_SENTENCES`:
```ts
{ en: "We play in the park", id: "Kami bermain di taman" },
```
Kalimat pendek (maks. 4 kata) keluar di level rendah, yang panjang di level tinggi (diatur di `lib/quests.ts`).

### Level 3: ganti dan tambah monster

**Ganti gambar monster:** timpa file di `public/monsters/`, misalnya `rocky-idle.png`. Pakai nama yang sama dan latar transparan. Tiga file per monster: `-idle`, `-hurt`, `-dead`.

**Ubah statistik monster:** `lib/bestiary.ts`. Tiap monster punya `hp`, `speed`, `w` (lebar tampil), `r` (radius tabrakan), `minLevel` (level pemain agar mulai muncul), `weight` (kemungkinan muncul), `boss`.

**Tambah monster baru (4 langkah):**
1. Taruh `naga-idle.png`, `naga-hurt.png`, `naga-dead.png` di `public/monsters/`.
2. Di `lib/bestiary.ts`, tambahkan `"naga"` ke tipe `MKind`.
3. Tambahkan satu entri `naga: { ... }` di `BESTIARY` (salin entri lain lalu ubah).
4. Selesai. Pemuatan gambar (`MONSTER_IDS`), kemunculan, dan menggambarnya sudah otomatis.

Jangan lupa `face`: arah hadap *asli* gambarmu (`-1` kiri, `1` kanan, `0` menghadap depan). Kalau salah, monster akan berjalan mundur.

### Level 4: ubah tampilan dunia

**Pohon dan batu:** bentuknya SVG di `components/Scenery.tsx` (`Tree`, `Rock`). Ubah `fill`, bentuk path, atau tambah detail. Gambar itu diubah menjadi sprite oleh `Sprites.tsx` (cari `data-sprite="tree"`).
Kalau mau pakai gambar PNG sendiri: di `Sprites.tsx`, muat PNG-nya dengan `loadPng("/props/pohon.png")` lalu simpan di objek sprite dengan kunci `"tree"`, sama seperti monster. Engine tidak perlu diubah.

**Rumput dan bunga:** gambarnya di `drawDecor()` di `engine.ts`. Penempatannya (berapa banyak, di mana) ada di `buildWorld()`. Coba ubah warna `strokeStyle`, jumlah helai, atau tambah jenis ketiga (`t: 2`) misalnya jamur.

**Lantai:** digambar di `draw()`, di bagian yang diberi komentar "lantai dunia" dan "garis kisi". Cat dasarnya `PAPER`, garis kisinya dibuat di loop `gy` dan `gx`. Untuk lantai berwarna, ganti `c.fillStyle = PAPER` dengan warna atau gradien. Untuk menghapus kisi, hapus blok garis kisi.

**Warna global:** token di `app/globals.css` (`--color-marker`, `--color-paper`, dst.) dan konstanta `INK`, `PAPER`, `MARKER` di atas `engine.ts`.

### Level 5: ubah aturan dan fitur

**Ubah kapan quest muncul:** cari `hasQuest` di `update()`. Contoh variasi yang menarik untuk dicoba:
- Monster tertentu selalu memberi quest (tambahkan properti `quest: true` di `bestiary.ts`, lalu cek di `hasQuest`).
- Peluang quest naik kalau pemain baru saja salah menjawab (butuh membaca `this.stats.streak`).

**Tambah jenis quest baru** (misalnya "cocokkan kata dengan gambar"):
1. `lib/questions.ts`: tambahkan nama jenis ke tipe `QuestionKind` dan tulis pembuat soalnya di `buildQuestion`.
2. `lib/quests.ts`: masukkan ke daftar `kindsFor(playerLevel)` agar muncul pada level tertentu.
3. `components/QuestPanel.tsx`: tambahkan tampilan jawabannya kalau bentuknya baru. Kalau pilihan ganda biasa, tampilan yang ada sudah cukup.

**Tambah suara:** `lib/sfx.ts` membuat bunyi dari osilator (tanpa file audio). Salin salah satu fungsi bunyi, ubah frekuensi dan durasi, lalu panggil `play("namamu")` di tempat yang diinginkan.

**Tombol serang kedua / jurus baru:** mulai dari `attack()` dan `swordHit()` di `engine.ts`, serta `TouchControls` di bagian bawah `WorldGame.tsx` untuk tombol di HP.

---

## 5. Cara menyelidiki dan memperbaiki masalah

1. **Pesan error di terminal `npm run dev`:** baca baris pertama, biasanya menyebut file dan nomor baris.
2. **Console browser (F12):** untuk error saat game berjalan.
3. **`npm run typecheck`:** menangkap salah ketik nama properti sebelum game dibuka.
4. **Lihat state langsung.** Game membuka engine sebagai `window.__world`. Di console browser coba:
   ```js
   __world.p            // posisi & kondisi ksatria
   __world.monsters     // semua monster
   __world.stats        // HP, level, XP
   __world.p.x = 500    // pindahkan ksatria
   __world.stats.level = 5   // lompat ke level 5 untuk menguji monster kuat
   ```
   Teknik ini menghemat waktu: tidak perlu bermain lama untuk menguji sesuatu.
5. **`console.log` di dalam `update()`** boleh, tapi hapus lagi karena fungsi itu jalan 60 kali per detik dan membanjiri console.
6. **Ubah satu hal, uji, baru ubah yang lain.** Kalau game rusak, kamu langsung tahu penyebabnya. Commit di setiap langkah yang sudah jalan.

---

## 6. Jalur belajar yang saya sarankan

**Minggu 1: rasakan.** Kerjakan semua Level 1 dan 2. Tujuannya terbiasa mengubah file dan melihat hasil.

**Minggu 2: baca.** Baca `update()` lalu `draw()` dari atas ke bawah. Tulis komentar sendiri di tiap blok dengan bahasamu ("ini menggerakkan monster", "ini menghitung jarak"). Kalau ada baris yang tidak kamu mengerti, itu bahan pertanyaan yang bagus.

**Minggu 3: bangun.** Tantangan latihan berikut, urut dari mudah:
1. Buat monster berhenti mengejar kalau pemain terlalu jauh (ubah `aggro`).
2. Tambah satu monster baru dengan gambar buatanmu.
3. Tambah item "hati" yang kadang dijatuhkan monster dan menambah nyawa kalau disentuh.
4. Buat tombol dash (lari cepat sesaat) dengan cooldown.
5. Tambah jenis quest "dengarkan lalu ketik jawabannya".
6. Simpan skor tertinggi dan tampilkan di layar awal (lihat `lib/storage.ts`).

**Setelah itu:** backend untuk akun dan leaderboard (lihat percakapan kita soal Go, Gin, GORM). Konsep game-nya sudah kamu kuasai, tinggal menyambungkan ke API.

### Konsep yang layak kamu pelajari lebih dalam (urut dari yang paling berguna)

1. **Game loop dan delta time** (dasar semua game).
2. **State vs render**: pisahkan data dari cara menggambarnya.
3. **Vektor dan jarak** (`Math.hypot`, normalisasi arah). Dipakai di hampir semua gerak.
4. **Tabrakan lingkaran dan kotak (AABB).**
5. **Interpolasi (lerp) dan easing** untuk gerak halus.
6. **Kamera dan proyeksi** (yang membuat game ini terlihat semi-3D).
7. **State machine** (monster: idle, mengejar, terluka, mati). Sekarang masih tersebar di `update()`, merapikannya jadi state machine adalah latihan refactor yang bagus.
8. **Desain pembelajaran dalam game**: kenapa tidak setiap kill memberi quest (menjaga ritme dan menghindari kebosanan).

### Sumber belajar

- MDN: *Canvas tutorial* dan *Game development* (gratis, sangat baik).
- Dokumen resmi Next.js dan Tailwind untuk bagian React dan UI.
- Cari "game loop delta time", "squash and stretch", dan "game juice" untuk pembahasan konsepnya.

---

## 7. Kebiasaan yang membuat kamu cepat berkembang

- Ubah satu hal kecil, jalankan, lihat. Jangan menulis 200 baris lalu baru menjalankan.
- Selalu pakai git. Commit sering, cabang per eksperimen.
- Kalau memakai bantuan AI untuk menulis kode, minta penjelasan baris yang kamu belum paham, lalu coba tulis ulang versi sederhananya sendiri. Memahami lebih penting daripada menyalin.
- Tulis catatan kecil tentang apa yang kamu pelajari. Itu juga bahan portofolio yang bagus.
