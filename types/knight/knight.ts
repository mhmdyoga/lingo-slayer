import { fx } from "@/lib/shop";

export type Palette = {
  light: string; // helm, bahu, sepatu
  mid: string;   // lengan, leher
  body: string;  // dada
  dark: string;  // celana
  plume: string; // jambul
  plume2: string;

  helm?: string;     // warna helm (kalau beda dari light)
  shoulder?: string; // warna bahu
  trim?: string;     // warna sabuk & hiasan emas
  deco?: "dragon" | "ice" | "royal";   // lapisan hiasan: tanduk, jambul api, bahu berduri, kain dada
};

export type Skin = {
    id: string
    name: string
    price: number
    pal: Palette
}

export type Sword ={
    id: string
    name: string
    price: number
    blade: string
    guard: string
    grip: string
    len: number
    fx: fx
}