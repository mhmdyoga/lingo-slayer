# Panduan: Koin, Toko, Baju & Pedang

Panduan ini untuk **mengetik sendiri** fitur koin + toko. Setiap langkah punya **Cek** supaya kamu tahu langkah itu sudah benar sebelum lanjut. Kalau Cek gagal, jangan lanjut: cari dulu penyebabnya (lihat bagian Masalah umum di akhir).

Aturan koin yang kita buat:
- Monster biasa menjatuhkan **1 atau 2 koin** (acak).
- Boss (Treetank, Magma Brute) menjatuhkan **5 koin, selalu**.
- Baju dan pedang dibeli sekali, lalu bisa dipakai bergantian. Semuanya tersimpan di `localStorage`.
- Baju dan pedang hanya mengubah **tampilan** (tidak mengubah kekuatan). Kalau nanti kamu mau pedang lebih kuat, lihat Tantangan di akhir.

## Peta: file apa yang disentuh

| Langkah | File | Isi |
|---|---|---|
| 1 | `lib/shop.ts` (baru) | Data baju/pedang, aturan koin, dompet di localStorage |
| 2 | `components/world/engine.ts`, `WorldGame.tsx` | Monster jatuhkan koin, tampil di HUD |
| 3 | `components/Scenery.tsx` | Warna ksatria jadi bisa diganti (palet) |
| 4 | `components/world/Sprites.tsx` | Buat gambar ksatria untuk tiap baju |
| 5 | `components/world/engine.ts` | Menggambar baju & pedang yang sedang dipakai |
| 6 | `components/Store.tsx` (baru) | Layar toko |
| 7 | `WorldGame.tsx` | Tombol Toko dan menyambungkan semuanya |

Konsep yang kamu pelajari: **pisahkan data dari tampilan** (`shop.ts` tidak tahu soal React/canvas), **state di localStorage**, **callback dari engine ke React** (seperti `onKill`), dan **satu sumber kebenaran** (dompet disimpan di satu tempat, UI hanya membaca).

---

## Langkah 1: Data toko dan dompet (`lib/shop.ts`)

Buat file baru. Kita mulai dari **tipe dan katalog**.

```ts
export type Palette = {
  light: string; // helm, bahu, sepatu
  mid: string;   // lengan, leher
  body: string;  // dada
  dark: string;  // celana
  plume: string; // jambul
  plume2: string;
};

export type Skin = { id: string; name: string; price: number; pal: Palette };
export type Sword = {
  id: string; name: string; price: number;
  blade: string; // warna bilah
  guard: string; // warna pelindung
  grip: string;  // warna gagang
  len: number;   // panjang bilah (px)
};

export const SKINS: Skin[] = [
  { id: "besi",  name: "Zirah Besi",  price: 0,  pal: { light: "#cfd6dd", mid: "#aeb7c2", body: "#dfe5ea", dark: "#5b6470", plume: "#ff7a1a", plume2: "#ffd23f" } },
  { id: "merah", name: "Zirah Naga",  price: 12, pal: { light: "#ff8a80", mid: "#e0524a", body: "#ffb3ab", dark: "#8c2a25", plume: "#111",    plume2: "#ff5a4d" } },
  { id: "hijau", name: "Zirah Hutan", price: 20, pal: { light: "#9be28a", mid: "#58b04a", body: "#c4f0b8", dark: "#2f6b2a", plume: "#8a5a2b", plume2: "#d9f56a" } },
  { id: "emas",  name: "Zirah Raja",  price: 40, pal: { light: "#ffe14d", mid: "#e8b81c", body: "#fff0a0", dark: "#a8770d", plume: "#c1272d", plume2: "#ff8fa3" } },
];

export const SWORDS: Sword[] = [
  { id: "besi", name: "Pedang Besi", price: 0,  blade: "#e6ecf1", guard: "#ffe14d", grip: "#8a5a2b", len: 74 },
  { id: "es",   name: "Pedang Es",   price: 15, blade: "#bdeeff", guard: "#4ab3e8", grip: "#2d6a8c", len: 80 },
  { id: "api",  name: "Pedang Api",  price: 30, blade: "#ffb35c", guard: "#ff4d2e", grip: "#6b2d12", len: 84 },
  { id: "emas", name: "Pedang Raja", price: 50, blade: "#fff08a", guard: "#c1272d", grip: "#8a5a2b", len: 92 },
];

export const getSkin  = (id: string) => SKINS.find((s) => s.id === id)  ?? SKINS[0];
export const getSword = (id: string) => SWORDS.find((s) => s.id === id) ?? SWORDS[0];
```

Perhatikan `?? SKINS[0]`: kalau localStorage berisi id yang sudah tidak ada, game tidak crash, hanya kembali ke item pertama. Pola ini namanya *fallback*.

Lalu **aturan koin**:

```ts
export const BOSS_COINS = 5; // konstan

/** Monster biasa: acak 1-2 koin. Boss: selalu 5. */
export function coinDrop(boss: boolean): number {
  return boss ? BOSS_COINS : 1 + Math.floor(Math.random() * 2);
}
```

`Math.random()` menghasilkan 0 sampai 0,999. Kali 2 lalu `Math.floor` hasilnya 0 atau 1, ditambah 1 jadi 1 atau 2.

Lalu **dompet** (pola sama dengan `lib/wordbook.ts`: baca, ubah, simpan, semua dibungkus try/catch).

```ts
export type Shop = {
  coins: number;
  owned: string[]; // contoh: ["skin:besi", "sword:besi", "skin:merah"]
  skin: string;    // id yang sedang dipakai
  sword: string;
};

const KEY = "blejar-shop";
export const DEFAULT_SHOP: Shop = { coins: 0, owned: ["skin:besi", "sword:besi"], skin: "besi", sword: "besi" };

export function loadShop(): Shop {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SHOP };
    const s = JSON.parse(raw) as Partial<Shop>;
    return {
      coins: Math.max(0, Number(s.coins) || 0),
      owned: Array.from(new Set([...DEFAULT_SHOP.owned, ...(Array.isArray(s.owned) ? s.owned : [])])),
      skin: s.skin ?? "besi",
      sword: s.sword ?? "besi",
    };
  } catch {
    return { ...DEFAULT_SHOP };
  }
}

function save(s: Shop): Shop {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s;
}

export function addCoins(n: number): Shop {
  const s = loadShop();
  return save({ ...s, coins: s.coins + n });
}

export type Kind = "skin" | "sword";
const priceOf = (kind: Kind, id: string) => (kind === "skin" ? getSkin(id).price : getSword(id).price);

/** Beli item. Kalau koin kurang / sudah punya, dompet tidak berubah. */
export function buy(kind: Kind, id: string): Shop {
  const s = loadShop();
  const key = `${kind}:${id}`;
  const price = priceOf(kind, id);
  if (s.owned.includes(key) || s.coins < price) return s;
  return save({ ...s, coins: s.coins - price, owned: [...s.owned, key] });
}

/** Pakai item yang sudah dimiliki. */
export function equip(kind: Kind, id: string): Shop {
  const s = loadShop();
  if (!s.owned.includes(`${kind}:${id}`)) return s;
  return save({ ...s, [kind]: id });
}
```

Kenapa `owned` berisi string `"skin:merah"` dan bukan dua array? Supaya satu aturan (`includes`) berlaku untuk baju dan pedang.

**Cek langkah 1:** jalankan `npx tsc --noEmit` (harus tanpa error). Lalu buka `/play`, DevTools Console, dan karena file ini belum dipakai siapa pun, cukup pastikan tidak ada error merah. Pengujian sesungguhnya ada di langkah 2.

---

## Langkah 2: Monster menjatuhkan koin

### 2a. Engine memberi tahu React

Di `engine.ts`:

1. Tambah import di atas: `import { coinDrop } from "@/lib/shop";`
2. Di tipe `Callbacks`, tambah callback **opsional**:
   ```ts
   onCoin?: (n: number) => void;
   ```
3. Di `swordHit()`, di blok `if (m.hp <= 0) { ... }`, tepat setelah `this.addXp(d.xp);` tambahkan:
   ```ts
   const coins = coinDrop(!!d.boss);
   this.cb.onCoin?.(coins);
   this.texts.push({ x: m.x, y: m.y - d.w * 1.3, text: `+${coins} 🪙`, life: 1.1, color: "#b8860b" });
   ```

Tanda `?.` artinya "panggil kalau ada". Engine tidak perlu tahu siapa yang mendengarkan.

### 2b. React menyimpan dan menampilkan

Di `WorldGame.tsx`:

1. Import: `import { addCoins, loadShop, DEFAULT_SHOP, type Shop } from "@/lib/shop";`
2. State: `const [shop, setShop] = useState<Shop>(DEFAULT_SHOP);`
3. Di daftar callback saat `new Engine(...)`, tambah:
   ```ts
   onCoin: (n) => setShop(addCoins(n)),
   ```
4. Muat dompet **setelah mount** (bukan di nilai awal `useState`, supaya tidak hydration mismatch, sama seperti Word Book):
   ```ts
   useEffect(() => setShop(loadShop()), []);
   ```
5. Di HUD, di bawah baris `XP ... ★`, tambahkan:
   ```tsx
   <p className="text-base">🪙 {shop.coins}</p>
   ```

**Cek langkah 2:**
- Main, bunuh monster biasa: muncul teks emas `+1 🪙` atau `+2 🪙`, angka di HUD naik.
- Bunuh beberapa monster biasa: kadang 1, kadang 2, **tidak pernah 0 atau 3**.
- Bunuh boss (Treetank atau Magma Brute): selalu `+5`.
- Refresh halaman: koin masih ada (cek `localStorage.getItem("blejar-shop")` di Console).
- Tips menguji boss cepat: di Console `__world.monsters.length = 0; __world.monsters.push({id:1,kind:"treetank",x:__world.p.x+70,y:__world.p.y,hp:1,maxHp:1,hurt:0,dying:0,face:1,kx:0,ky:0,wt:99,wx:0,wy:0,born:-9,phase:0})` lalu tebas.

---

## Langkah 3: Warna ksatria jadi bisa diganti (`Scenery.tsx`)

Sekarang warna zirah tertulis langsung (`fill="#cfd6dd"`). Kita ubah jadi **palet** yang bisa diganti dari luar.

1. Di atas file: `import { SKINS, type Palette } from "@/lib/shop";` dan `const DEF: Palette = SKINS[0].pal;`
2. Ubah tanda tangan fungsi:
   ```tsx
   export function Knight({ className, pal = DEF }: { className?: string; pal?: Palette }) {
   export function KnightPart({ part, pal = DEF }: { part: KnightPartName; pal?: Palette }) {
   ```
   `pal = DEF` artinya: kalau tidak diberi palet, pakai zirah besi. Jadi pemakaian lama tidak rusak.
3. Di **kedua** fungsi (`Knight` dan semua bagian di `KnightPart`), ganti warna:

   | Warna lama | Jadi |
   |---|---|
   | `#ff7a1a` | `{pal.plume}` |
   | `#ffd23f` | `{pal.plume2}` |
   | `#5b6470` | `{pal.dark}` |
   | `#cfd6dd` | `{pal.light}` |
   | `#aeb7c2` | `{pal.mid}` |
   | `#dfe5ea` | `{pal.body}` |

   Contoh: `fill="#cfd6dd"` menjadi `fill={pal.light}`. Perhatikan: pakai kurung kurawal, **tanpa tanda kutip**. Ini juga berlaku untuk `stroke="#cfd6dd"`. Biarkan warna sabuk `#8a5a2b`, warna visor `#2b2f36`, putih `#fff`, dan `INK` tetap.

   Tips: pakai Find & Replace di editor (cari `"#cfd6dd"` ganti `{pal.light}`), tapi hanya di bagian bawah file mulai dari `export function Knight`.

**Cek langkah 3:** `npx tsc --noEmit` bersih, dan ksatria di layar awal tampak **sama persis** seperti sebelumnya (karena palet bawaan = warna lama). Kalau warnanya berubah, ada satu pasangan warna yang tertukar.

---

## Langkah 4: Gambar ksatria untuk setiap baju (`Sprites.tsx`)

Engine tidak menggambar SVG langsung. SVG dijadikan gambar sekali di awal (lihat komentar di file). Jadi kita buat **satu set bagian untuk tiap baju**, dengan nama `k-body-merah`, `k-legL-hijau`, dan seterusnya.

1. Import: `import { SKINS } from "@/lib/shop";`
2. Ganti blok `(["legL", ...]).map(...)` di dalam `host` menjadi:
   ```tsx
   {SKINS.flatMap((sk) =>
     (["legL", "legR", "body", "armL", "armR"] as KnightPartName[]).map((n) => (
       <div key={`${n}-${sk.id}`} data-sprite={`k-${n}-${sk.id}`}>
         <KnightPart part={n} pal={sk.pal} />
       </div>
     )),
   )}
   ```

Dengan 4 baju jadi 20 gambar kecil. Murah, dan tidak ada filter canvas (filter canvas tidak jalan di Safari iPhone, itu sebabnya kita pakai cara ini).

**Cek langkah 4:** game masih jalan, tapi sekarang ksatria **hilang** (karena engine masih mencari nama lama `k-body`). Itu benar dan akan kita perbaiki di langkah 5.

---

## Langkah 5: Engine memakai baju dan pedang yang dipilih (`engine.ts`)

1. Import: `import { coinDrop, getSword, type Sword } from "@/lib/shop";`
2. Tambah properti di class `Engine` (dekat `stats`):
   ```ts
   look = { skin: "besi", sword: "besi" };
   ```
3. Di `drawPlayer()`, ganti nama sprite:
   - `S["k-body"]` jadi ``S[`k-body-${this.look.skin}`]`` (ada di `if (!S[...]) return;` dan di `drawImage`)
   - `S["k-armR"]` jadi ``S[`k-armR-${this.look.skin}`]``
   - di fungsi kecil `put`: tambahkan `const sk = this.look.skin;` di atasnya, dan `drawImage(S[name], ...)` jadi ``drawImage(S[`${name}-${sk}`], ...)``
4. Di `blade()`, di awal fungsi tambahkan:
   ```ts
   const sw: Sword = getSword(this.look.sword);
   const len = base + (sw.len - 74); // pedang lebih panjang = lebih gagah
   ```
   dan ubah parameter `len` di tanda tangan menjadi `base`. Lalu ganti warna tetap di dalamnya:
   - `"#8a5a2b"` jadi `sw.grip`
   - `"#e6ecf1"` jadi `sw.blade`
   - `c.strokeStyle = MARKER;` (yang di bagian pelindung, paling bawah) jadi `c.strokeStyle = sw.guard;`

**Cek langkah 5:** ksatria muncul lagi dan tampak seperti semula. Untuk menguji ganti baju sebelum toko ada, di Console:
```js
__world.look = { skin: "merah", sword: "api" }
```
Ksatria langsung berzirah merah dan pedangnya oranye. Coba juga `"hijau"`, `"emas"`, `"es"`.

---

## Langkah 6: Layar toko (`components/Store.tsx`)

Komponen ini **tidak menyimpan dompet sendiri**. Ia menerima `shop` dari luar dan memanggil `onChange` setiap kali ada pembelian. Itu yang membuat HUD dan toko selalu sinkron.

```tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Knight } from "./Scenery";
import { SKINS, SWORDS, buy, equip, getSkin, getSword, type Kind, type Shop } from "@/lib/shop";

type Props = { shop: Shop; onChange: (s: Shop) => void; onClose: () => void };

export default function Store({ shop, onChange, onClose }: Props) {
  const [tab, setTab] = useState<Kind>("skin");
  const [msg, setMsg] = useState("");

  const items = tab === "skin" ? SKINS : SWORDS;
  const current = tab === "skin" ? shop.skin : shop.sword;

  const act = (id: string, price: number) => {
    const key = `${tab}:${id}`;
    if (shop.owned.includes(key)) {
      onChange(equip(tab, id));
      setMsg("");
    } else if (shop.coins < price) {
      setMsg(`Koin kurang ${price - shop.coins} lagi. Bunuh monster dulu!`);
    } else {
      onChange(buy(tab, id));
      onChange(equip(tab, id));
      setMsg("Berhasil dibeli & dipakai! ✨");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/55 p-3">
      <div className="doodle-box w-full max-w-3xl bg-paper p-4 sm:p-6" role="dialog" aria-label="Toko">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-3xl sm:text-4xl">🛒 TOKO</h2>
          <span className="rounded-full border-4 border-ink bg-marker px-3 font-display text-xl">🪙 {shop.coins}</span>
          <button onClick={onClose} className="doodle-btn grid h-11 w-11 place-items-center bg-white text-xl" aria-label="Tutup">✕</button>
        </div>

        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="w-28 shrink-0 sm:w-36">
            <Knight className="w-full" pal={getSkin(shop.skin).pal} />
            <p className="mt-1 text-center text-base">{getSkin(shop.skin).name}<br />{getSword(shop.sword).name}</p>
          </div>

          <div className="w-full">
            <div className="flex gap-2">
              {(["skin", "sword"] as Kind[]).map((k) => (
                <button key={k} onClick={() => { setTab(k); setMsg(""); }}
                  className={`doodle-btn px-4 py-1 text-xl ${tab === k ? "bg-marker" : "bg-white"}`}>
                  {k === "skin" ? "👕 Baju" : "⚔️ Pedang"}
                </button>
              ))}
            </div>

            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {items.map((it) => {
                const owned = shop.owned.includes(`${tab}:${it.id}`);
                const on = current === it.id;
                return (
                  <li key={it.id} className="doodle-box flex items-center gap-3 bg-white p-2">
                    <span className="h-8 w-8 shrink-0 rounded-full border-4 border-ink"
                      style={{ background: tab === "skin" ? getSkin(it.id).pal.light : getSword(it.id).blade }} />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-lg leading-tight">{it.name}</p>
                      <p className="text-sm text-ink/70">{owned ? "Dimiliki" : `🪙 ${it.price}`}</p>
                    </div>
                    <button onClick={() => act(it.id, it.price)} disabled={on}
                      className={`doodle-btn px-3 py-1 text-lg ${on ? "bg-white opacity-60" : owned ? "bg-white" : "bg-marker"}`}>
                      {on ? "Dipakai" : owned ? "Pakai" : "Beli"}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 min-h-6 text-lg" aria-live="polite">{msg}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

Hal yang layak dipahami, bukan sekadar disalin:
- `buy()` dan `equip()` sama-sama membaca dari localStorage, mengubah, lalu **mengembalikan dompet baru**. `onChange(...)` meneruskannya ke React supaya layar ikut berubah.
- Pengecekan "koin cukup?" ada **dua kali**: di `Store` (untuk pesan ramah) dan di `buy()` (pengaman). Jangan hanya mengandalkan UI.
- `disabled={on}` mencegah klik pada item yang sudah dipakai.

---

## Langkah 7: Tombol toko dan penyambungan (`WorldGame.tsx`)

1. Import: `import Store from "../Store";` dan tambahkan `getSkin` ke import dari `@/lib/shop`.
2. State: `const [storeOpen, setStoreOpen] = useState(false);`
3. Ref supaya callback engine (yang dibuat sekali) tetap tahu pilihan terbaru:
   ```ts
   const shopRef = useRef<Shop>(DEFAULT_SHOP);
   ```
4. Dekat `useEffect(() => setShop(loadShop()), [])` tambahkan efek yang **mengirim pilihan ke engine** setiap dompet berubah:
   ```ts
   useEffect(() => {
     shopRef.current = shop;
     if (engine.current) engine.current.look = { skin: shop.skin, sword: shop.sword };
   }, [shop]);
   ```
5. Engine dibuat belakangan (menunggu sprite siap), jadi saat ia dibuat kita juga isi `look`. Tepat setelah `e.muted = getMuted();` tambahkan:
   ```ts
   e.look = { skin: shopRef.current.skin, sword: shopRef.current.sword };
   ```
6. Ksatria di layar awal: `<Knight className="w-full" pal={getSkin(shop.skin).pal} />`
7. Tombol di layar awal, di sebelah tombol `← Beranda`:
   ```tsx
   <button onClick={() => setStoreOpen(true)} className="doodle-btn bg-white px-5 py-2 text-xl">🛒 Toko</button>
   ```
   Dan di layar **Jeda**, di bawah tombol `Lanjut ▶`:
   ```tsx
   <button onClick={() => setStoreOpen(true)} className="doodle-btn mt-3 bg-white px-8 py-2 text-xl">🛒 Toko</button>
   ```
8. Render tokonya, di dekat `{/* game over */}`:
   ```tsx
   <AnimatePresence>{storeOpen && <Store shop={shop} onChange={setShop} onClose={() => setStoreOpen(false)} />}</AnimatePresence>
   ```

Kenapa toko hanya dari layar awal dan jeda, bukan saat bermain? Supaya tidak ada yang bisa belanja sambil dikejar monster. Kalau mau, itu keputusan desain yang bisa kamu ubah.

---

## Cek akhir

1. Layar awal → **Toko**. Koin 0 → klik Beli di Zirah Naga → muncul "Koin kurang 12 lagi".
2. Main, kumpulkan koin sampai 12 atau lebih. Buka Jeda → Toko → beli Zirah Naga. Ksatria di panel toko **langsung** berganti merah, dan koin berkurang 12.
3. Tutup toko, lanjut main. Ksatria di dalam game berzirah merah.
4. Beli Pedang Es/Api di tab Pedang. Saat menebas, warna dan panjang pedang berubah.
5. **Refresh** halaman. Koin, baju, dan pedang tetap sama (cek `localStorage.getItem("blejar-shop")`).
6. Klik Beli pada item yang sudah dimiliki: tombolnya sudah jadi "Pakai", dan koin tidak berkurang dua kali.

## Masalah umum

| Gejala | Penyebab paling mungkin |
|---|---|
| Ksatria menghilang setelah langkah 4 | Normal sampai langkah 5 selesai. Setelah itu: cek nama sprite `k-body-${...}` persis sama dengan `data-sprite` di Sprites |
| Ksatria menghilang dan Console penuh error | `look.skin` berisi id yang tidak ada. Jalankan `localStorage.removeItem("blejar-shop")` lalu refresh |
| Warna ksatria berubah padahal skin besi | Ada pasangan warna yang tertukar di langkah 3 (lihat tabel) |
| Warna tidak ikut berubah di salah satu bagian | Masih ada `"#xxxxxx"` lama di bagian itu. Cari di `Scenery.tsx` |
| Koin naik dua kali per kill | `onCoin` dipanggil dua kali, atau `addCoins` ada di dua tempat |
| Koin tidak bertambah, tapi teks `+N` muncul | Callback `onCoin` belum ditambahkan di `new Engine({...})` |
| Koin hilang setelah refresh | `setShop(addCoins(n))` ditulis `setShop(...)` saja tanpa `addCoins`, jadi tidak tersimpan |
| Error hydration saat refresh | `useState(loadShop())` dipakai. Harus `useState(DEFAULT_SHOP)` + `useEffect` |
| Pakai item baru, tapi di game tidak berubah | Efek `[shop]` di langkah 7 belum ada, atau `engine.current.look` tidak diisi |
| Setelah refresh, game kembali ke baju lama | `e.look = ...` saat engine dibuat belum ada (langkah 7 poin 5) |
| Tombol Beli tidak mengurangi koin | `buy()` tidak dibungkus `onChange(...)`, jadi layar tidak dapat dompet baru |

## Tantangan (urut dari mudah)

1. **Tambah baju baru** (misal "Zirah Es"): cukup tambah satu baris di `SKINS` dengan palet baru. Tidak ada file lain yang perlu diubah. Itu tanda desainmu bagus.
2. **Pedang yang lebih kuat:** tambahkan `dmg: number` ke tipe `Sword`, lalu di `swordHit()` ganti `m.hp -= 1` menjadi `m.hp -= getSword(this.look.sword).dmg`. Hati-hati menjaga keseimbangan: kalau terlalu kuat, game jadi membosankan.
3. **Harga naik** sesuai level, atau boss menjatuhkan koin lebih banyak di level tinggi (tapi ingat aturanmu: boss harus konstan 5).
4. **Suara koin:** tambahkan efek `coin` di `lib/sfx.ts` dan panggil di `swordHit()` setelah `onCoin`.
5. **Koin terbang ke HUD:** pakai GSAP untuk animasi angka koin saat bertambah (lihat cara XP bar dianimasikan).
6. **Topi / aksesori:** tambah kategori ketiga `"hat"`. Kamu perlu `Kind` baru, tab baru, dan menggambar topi di `drawPlayer()`.
7. **Backend nanti:** `Shop` adalah satu objek JSON kecil, jadi mudah disinkronkan ke server bersama Word Book.
