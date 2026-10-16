import { Skin, Sword } from "@/types/knight/knight";
import { Shop } from "@/types/shop/shop";

export type Kind = "skin" | "sword";
export type fx = "none" | "fire" | "ice" | "royal";

export const SKIN: Skin[] = [
  {
    id: "besi",
    name: "Zirah Besi",
    price: 0,
    pal: {
      light: "#cfd6dd",
      mid: "#aeb7c2",
      body: "#dfe5ea",
      dark: "#5b6470",
      plume: "#ff7a1a",
      plume2: "#ffd23f",
    },
  },
  {
    id: "naga",
    name: "Zirah Naga Api ( Exclusive )",
    price: 60,
    pal: {
      light: "#c2272c",
      mid: "#2c2e36",
      body: "#4a4d59",
      dark: "#24262d",
      plume: "#ff5a1f",
      plume2: "#ffd23f",
      helm: "#c1272d",
      shoulder: "#c1272d",
      trim: "#e8b81c",
      deco: "dragon",
    },
  },
  {
    id: "crystal",
    name: "Zirah Ice Crystal ( Exclusive )",
    price: 120,
    pal: {
      body: "#dbe4f1",
      light: "#e6edf7",
      mid: "#46506b",
      dark: "#39435a",
      plume: "#3b9cff", // biru kristal & nyala
      plume2: "#b9e6ff", // biru es muda
      trim: "#2f6fcf", // ikat pinggang biru
      shoulder: "#e6edf7",
      helm: "#e9eff8",
      deco: "ice",
    },
  },
  {
    id: "hijau",
    name: "Zirah Hutan",
    price: 20,
    pal: {
      light: "#9be28a",
      mid: "#58b04a",
      body: "#c4f0b8",
      dark: "#2f6b2a",
      plume: "#8a5a2b",
      plume2: "#d9f56a",
    },
  },
 {
  id: "royal",
  name: "Zirah Kerajaan",
  price: 124,
  pal: {
    deco: "royal",
    body: "#2c2e35",     // baju hitam
    mid: "#3a3d46",      // lengan & leher
    dark: "#1f2127",     // kaki
    light: "#f2b824",    // sepatu & aksen emas
    trim: "#d9a11a",     // ikat pinggang
    shoulder: "#f2b824",
    helm: "#3a3d46",     // helm hitam keabuan
    plume: "#f2b824",
    plume2: "#ffe58a",
  },
}
];

export const SWORDS: Sword[] = [
  {
    id: "besi",
    name: "Pedang Besi",
    price: 0,
    blade: "#e6ecf1",
    guard: "#ffe14d",
    grip: "#8a5a2b",
    len: 74,
    fx: "none",
  },
  {
    id: "es",
    name: "Pedang Es",
    price: 15,
    blade: "#bdeeff",
    guard: "#4ab3e8",
    grip: "#2d6a8c",
    len: 80,
    fx: "ice",
  },
  {
    id: "api",
    name: "Pedang Api",
    price: 30,
    blade: "#ffb35c",
    guard: "#ff4d2e",
    grip: "#6b2d12",
    len: 84,
    fx: "fire",
  },
  {
    id: "emas",
    name: "Pedang Raja",
    price: 50,
    blade: "#fff08a",
    guard: "#c1272d",
    grip: "#8a5a2b",
    len: 92,
    fx: "royal",
  },
];

export const getSkin = (id: string) => SKIN.find((s) => s.id === id) ?? SKIN[0];
export const getSword = (id: string) =>
  SWORDS.find((s) => s.id === id) ?? SWORDS[0];

export const BOSS_COIN = 5;

export function coinDrop(boss: boolean): number {
  return boss ? BOSS_COIN : 1 + Math.floor(Math.random() * 2); // kalau boss itu 5 dan monster biasa itu 1 -2 ( secara random)
}

const KEY = "blejar-shop";
export const DEFAULT_SHOP: Shop = {
  coins: 0,
  owned: ["skin:besi", "sword:besi"],
  skin: "besi",
  sword: "besi",
};

export function loadShop(): Shop {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SHOP };
    const s = JSON.parse(raw) as Partial<Shop>;
    return {
      coins: Math.max(0, Number(s.coins) || 0),
      owned: Array.from(
        new Set([
          ...DEFAULT_SHOP.owned,
          ...(Array.isArray(s.owned) ? s.owned : []),
        ]),
      ),
      skin: s.skin ?? "besi",
      sword: s.sword ?? "besi",
    };
  } catch (error) {
    return { ...DEFAULT_SHOP };
  }
}

export function save(s: Shop): Shop {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  return s;
}

export function addCoins(n: number): Shop {
  const s = loadShop();
  return save({ ...s, coins: s.coins + n });
}

const priceOf = (kind: Kind, id: string) =>
  kind === "skin" ? getSkin(id).price : getSword(id).price;

// logic buy item, kalau udah punya / koin nya kurang maka coin sama sekali tidak berubah
export function buy(kind: Kind, id: string): Shop {
  const s = loadShop();
  const key = `${kind}:${id}`;
  const price = priceOf(kind, id);
  if (s.owned.includes(key) || s.coins < price) return s;
  return save({ ...s, coins: s.coins - price, owned: [...s.owned, key] });
}

// logic equip item has been bought
export function equip(kind: Kind, id: string): Shop {
  const s = loadShop();
  if (!s.owned.includes(`${kind}:${id}`)) {
    return s;
  }
  return save({ ...s, [kind]: id });
}
