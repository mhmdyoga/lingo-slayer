"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Knight } from "./Scenery";
import { SKIN, SWORDS, buy, equip, getSkin, getSword, type Kind } from "@/lib/shop";
import { Shop } from "@/types/shop/shop";

type Props = { shop: Shop; onChange: (s: Shop) => void; onClose: () => void };

export default function Store({ shop, onChange, onClose }: Props) {
  const [tab, setTab] = useState<Kind>("skin");
  const [msg, setMsg] = useState("");

  // id item yang sedang di-preview (null = tidak ada, pakai yang equipped)
  const [preview, setPreview] = useState<{ skin: string | null; sword: string | null }>({
    skin: null,
    sword: null,
  });

  const items = tab === "skin" ? SKIN : SWORDS;
  const current = tab === "skin" ? shop.skin : shop.sword;

  // yang ditampilkan di Knight: preview kalau ada, kalau tidak yang equipped
  const shownSkin = preview.skin ?? shop.skin;
  const shownSword = preview.sword ?? shop.sword;
  const isPreviewing = preview.skin !== null || preview.sword !== null;

  const resetPreview = () => setPreview({ skin: null, sword: null });

  const act = (id: string, price: number) => {
    const key = `${tab}:${id}`;
    if (shop.owned.includes(key)) {
      onChange(equip(tab, id));
      setMsg("");
      setPreview((p) => ({ ...p, [tab]: null })); // sudah dipakai, preview tidak perlu lagi
    } else if (shop.coins < price) {
      setMsg(`Koin kurang ${price - shop.coins} lagi. Bunuh monster dulu!`);
    } else {
      onChange(buy(tab, id));
      onChange(equip(tab, id));
      setMsg("Berhasil dibeli & dipakai! ✨");
      setPreview((p) => ({ ...p, [tab]: null }));
    }
  };

  const handlePreview = (id: string) => {
    // klik item yang sama lagi = batalkan preview
    setPreview((p) => ({ ...p, [tab]: p[tab] === id ? null : id }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/55 p-3"
    >
      <div className="doodle-box w-full max-w-3xl bg-paper p-4 sm:p-6" role="dialog" aria-label="Toko">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-3xl sm:text-4xl">🛒 TOKO</h2>
          <span className="rounded-full border-4 border-ink bg-marker px-3 font-display text-xl">
            🪙 {shop.coins}
          </span>
          <button
            onClick={onClose}
            className="doodle-btn grid h-11 w-11 place-items-center bg-white text-xl"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="w-28 shrink-0 sm:w-36">
            <Knight className="w-full" pal={getSkin(shownSkin).pal} />
            <p className="mt-1 text-center text-base">
              {getSkin(shownSkin).name}
              <br />
              {getSword(shownSword).name}
            </p>
            {isPreviewing && (
              <button
                onClick={resetPreview}
                className="doodle-btn mt-1 w-full bg-white px-2 py-1 text-sm"
              >
                ↩ Kembali
              </button>
            )}
          </div>

          <div className="w-full">
            <div className="flex gap-2">
              {(["skin", "sword"] as Kind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => { setTab(k); setMsg(""); }}
                  className={`doodle-btn px-4 py-1 text-xl ${tab === k ? "bg-marker" : "bg-white"}`}
                >
                  {k === "skin" ? "👕 Baju" : "⚔️ Pedang"}
                </button>
              ))}
            </div>

            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {items.map((it) => {
                const owned = shop.owned.includes(`${tab}:${it.id}`);
                const on = current === it.id;
                const previewing = preview[tab] === it.id;
                return (
                  <li
                    key={it.id}
                    className={`doodle-box flex items-center gap-3 bg-white p-2 cursor-pointer ${
                      previewing ? "ring-4 ring-marker" : ""
                    }`}
                  >
                    {/* area klik untuk preview */}
                    <button
                      type="button"
                      onClick={() => handlePreview(it.id)}
                      aria-pressed={previewing}
                      aria-label={`Preview ${it.name}`}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
                    >
                      <span
                        className="h-8 w-8 shrink-0 rounded-full border-4 border-ink"
                        style={{
                          background: tab === "skin" ? getSkin(it.id).pal.light : getSword(it.id).blade,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg leading-tight">{it.name}</p>
                        <p className="text-sm text-ink/70">
                          {owned ? "Dimiliki" : `🪙 ${it.price}`}
                          {previewing && " · 👁 Preview"}
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => act(it.id, it.price)}
                      disabled={on}
                      className={`doodle-btn px-3 py-1 text-lg ${
                        on ? "bg-white opacity-60" : owned ? "bg-white" : "bg-marker"
                      }`}
                    >
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