"use client"
import { Category, VOCAB } from '@/lib/vocab';
import { isCollected, loadBook, medalOf, WordBook } from '@/lib/wordsbook';
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { speak } from '@/lib/speech';

const TABS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "animals", label: "🐶 Hewan" },
  { id: "things", label: "🎒 Benda" },
  { id: "body", label: "👃 Tubuh" },
  { id: "people", label: "👩 Keluarga" },
];
const MEDAL = ["", "🥉", "🥈", "🥇"];

export default function WordBookModal({ onClose }: { onClose: () => void }) {
  const [book, setBook] = useState<WordBook>({});
  const [tab, setTab] = useState<Category | "all">("all");

  // localStorage hanya ada di browser, jadi dibaca setelah komponen tampil
  useEffect(() => setBook(loadBook()), []);

  const list = VOCAB.filter((v) => tab === "all" || v.cat === tab);
  const got = VOCAB.filter((v) => isCollected(book[v.en])).length;

 return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 grid place-items-center bg-ink/55 p-3"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 40, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      onClick={(e) => e.stopPropagation()}
      className="doodle-box flex max-h-[90svh] w-full max-w-3xl flex-col p-4 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl md:text-4xl">📖 Koleksi Kata </h2>
        <button onClick={onClose} className="doodle-btn px-4 py-1 text-2xl" aria-label="Tutup">
          ✕
        </button>
      </div>
      <p className="mt-1 text-xl">
        Terkumpul <b>{got}</b> / {VOCAB.length} kata
      </p>
      <div className="mt-2 h-4 overflow-hidden rounded-full border-4 border-ink bg-white">
        <div className="h-full bg-marker" style={{ width: `${(got / VOCAB.length) * 100}%` }} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border-4 border-ink px-3 text-lg ${tab === t.id ? "bg-marker" : "bg-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-3 md:grid-cols-4">
  {list.map((v) => {
    const s = book[v.en];
    const ok = isCollected(s);
    return (
      <li key={v.en}>
        <button
          disabled={!ok}
          onClick={() => speak(v.en)}
          className={`flex w-full flex-col items-center rounded-2xl border-4 border-ink p-2 ${ok ? "bg-white hover:bg-marker/50" : "bg-ink/10"}`}
        >
          <span className={`text-5xl ${ok ? "" : "brightness-0 opacity-25"}`}>{v.emoji}</span>
          <span className="font-display text-xl">{ok ? v.en : "???"}</span>
          <span className="text-base text-ink/70">{ok ? v.id : "belum ketemu"}</span>
          {ok && <span className="text-xl">{MEDAL[medalOf(s)]} 🔊</span>}
        </button>
      </li>
    );
  })}
</ul>
    </motion.div>
  </motion.div>
);
}
