// Daftar monster. Gambar ada di public/monsters/<id>-{idle,hurt,dead,hero}.png
export type MKind =
  | "rocky" | "wispal" | "magma" | "venomspine" | "treetank"
  | "sandrex" | "frostborn" | "lurker" | "boulderback";

export type MonsterDef = {
  id: MKind;
  name: string;
  title: string; // julukan
  desc: string; // deskripsi singkat (Bahasa Indonesia)
  hp: number;
  speed: number;
  w: number; // lebar tampil di dunia (px) untuk pose idle
  r: number; // radius tabrakan
  aggro: number;
  xp: number;
  minLevel: number;
  weight: number; // peluang muncul
  boss: boolean;
  /** arah hadap asli gambar: -1 = kiri, 1 = kanan, 0 = depan */
  face: -1 | 0 | 1;
  color: string; // warna partikel
};

export const BESTIARY: Record<MKind, MonsterDef> = {
  rocky: { id: "rocky", name: "Rocky", title: "Golem Batu", desc: "Raksasa batu berlumut yang lamban tapi keras kepala.", hp: 2, speed: 78, w: 130, r: 34, aggro: 330, xp: 8, minLevel: 1, weight: 10, boss: false, face: 0, color: "#8a7a5a" },
  wispal: { id: "wispal", name: "Wispal", title: "Serigala Api Biru", desc: "Serigala lincah dengan api biru di punggungnya.", hp: 2, speed: 135, w: 130, r: 30, aggro: 400, xp: 10, minLevel: 1, weight: 9, boss: false, face: -1, color: "#5ab8ff" },
  venomspine: { id: "venomspine", name: "Venomspine", title: "Kadal Berbisa", desc: "Duri ungu beracun di sekujur punggungnya.", hp: 3, speed: 112, w: 150, r: 36, aggro: 380, xp: 12, minLevel: 2, weight: 8, boss: false, face: -1, color: "#9be04a" },
  sandrex: { id: "sandrex", name: "Sandrex", title: "Naga Gurun", desc: "Penghuni gurun yang muncul dari kepulan pasir.", hp: 3, speed: 105, w: 150, r: 36, aggro: 380, xp: 12, minLevel: 2, weight: 8, boss: false, face: -1, color: "#e0b86a" },
  frostborn: { id: "frostborn", name: "Frostborn", title: "Serigala Es", desc: "Berduri kristal es, dingin dan galak.", hp: 4, speed: 115, w: 150, r: 36, aggro: 390, xp: 15, minLevel: 3, weight: 7, boss: false, face: -1, color: "#bfe8ff" },
  lurker: { id: "lurker", name: "Lurker", title: "Pengintai Bayangan", desc: "Satu mata ungu yang mengintai dari kegelapan.", hp: 3, speed: 125, w: 140, r: 32, aggro: 420, xp: 15, minLevel: 3, weight: 6, boss: false, face: 0, color: "#a56bff" },
  boulderback: { id: "boulderback", name: "Boulderback", title: "Kura-kura Batu", desc: "Cangkang batunya sangat keras. Sabar ya!", hp: 5, speed: 62, w: 170, r: 42, aggro: 330, xp: 20, minLevel: 4, weight: 5, boss: false, face: -1, color: "#8a7a5a" },
  treetank: { id: "treetank", name: "Treetank", title: "Raja Pohon (BOS)", desc: "Pohon tua penjaga hutan. Kuat sekali!", hp: 7, speed: 70, w: 215, r: 54, aggro: 430, xp: 35, minLevel: 3, weight: 3, boss: true, face: 0, color: "#4f8f3a" },
  magma: { id: "magma", name: "Magma Brute", title: "Raksasa Lava (BOS)", desc: "Tubuhnya membara. Jangan sampai tersentuh!", hp: 8, speed: 74, w: 215, r: 54, aggro: 430, xp: 40, minLevel: 4, weight: 3, boss: true, face: 0, color: "#ff7a2a" },
};

export const MONSTER_IDS = Object.keys(BESTIARY) as MKind[];
