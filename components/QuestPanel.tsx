"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BESTIARY, type MKind } from "@/lib/bestiary";
import { SpeakButton } from "./Battle";
import { speak, stopSpeaking } from "@/lib/speech";
import { play } from "@/lib/sfx";
import type { Question } from "@/lib/questions";


export default function QuestPanel({
  q,
  monster,
  streak,
  onDone,
}: {
  q: Question;
  monster: MKind;
  streak: number;
  onDone: (correct: boolean) => void;
}) {
  const [phase, setPhase] = useState<"ask" | "right" | "wrong">("ask");
  const [picked, setPicked] = useState<string | null>(null);
  const [slots, setSlots] = useState<number[]>([]);
  const finished = useRef(false);
  const tiled = q.kind === "spell" || q.kind === "build";
  const need = q.kind === "build" ? q.answer.split(" ").length : q.answer.length;

  useEffect(() => {
    if ((q.kind === "listen" || q.kind === "spell" || q.kind === "build") && q.speak) {
      const t = setTimeout(() => speak(q.speak!), 500);
      return () => clearTimeout(t);
    }
  }, [q]);
  useEffect(() => stopSpeaking, []);

  const resolve = (ok: boolean) => {
    if (phase !== "ask") return;
    setPhase(ok ? "right" : "wrong");
    play(ok ? "correct" : "wrong");
    setTimeout(() => speak(q.review.en), 350);
  };
  const next = () => {
    if (finished.current) return;
    finished.current = true;
    stopSpeaking();
    onDone(phase === "right");
  };

  useEffect(() => {
    if (phase !== "right") return;
    const t = setTimeout(next, 2300);
    return () => clearTimeout(t);
  });

  const pickTile = (i: number) => {
    if (phase !== "ask" || slots.includes(i) || slots.length >= need) return;
    play("click");
    const s = [...slots, i];
    setSlots(s);
    if (s.length === need) {
      const joined = s.map((k) => q.options[k].value).join(q.kind === "build" ? " " : "");
      resolve(joined === q.answer);
    }
  };
  const choose = (v: string) => {
    if (phase !== "ask") return;
    play("click");
    setPicked(v);
    resolve(v === q.answer);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (phase !== "ask") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (phase === "wrong") next();
        }
        return;
      }
      if (q.kind === "spell") {
        if (e.key === "Backspace") return setSlots((s) => s.slice(0, -1));
        if (/^[a-z]$/i.test(e.key)) {
          const i = q.options.findIndex((o, k) => o.value === e.key.toLowerCase() && !slots.includes(k));
          if (i >= 0) pickTile(i);
        }
      } else if (q.kind === "build") {
        if (e.key === "Backspace") setSlots((s) => s.slice(0, -1));
      } else {
        const n = Number(e.key);
        if (n >= 1 && n <= q.options.length) choose(q.options[n - 1].value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const slotTexts = Array.from({ length: need }, (_, i) => (slots[i] !== undefined ? q.options[slots[i]].value : ""));

  return (
    <motion.div
      className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/45 p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.6, y: 80, rotate: -3 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="doodle-box relative w-full max-w-xl p-5 md:p-6"
        role="dialog"
        aria-label="Quest bahasa Inggris"
      >
        <div className="-mt-12 mb-1 flex items-end justify-between">
          <motion.div initial={{ rotate: 180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.15 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/monsters/${monster}-dead.png`} alt={BESTIARY[monster].name} className="h-20 w-auto max-w-[9rem] object-contain drop-shadow-[3px_3px_0_rgba(17,17,17,.35)]" />
          </motion.div>
          <div className="text-right">
            <p className="rounded-full border-4 border-ink bg-marker px-3 font-display text-lg">QUEST!</p>
            {streak > 0 && <p className="mt-1 text-lg">🔥 beruntun {streak}</p>}
          </div>
        </div>
        <p className="text-center text-lg text-ink/70">
          {BESTIARY[monster].name} kalah! Jawab untuk dapat XP.
        </p>
        <h2 className="mt-1 text-center font-display text-2xl md:text-3xl">{q.title}</h2>

        <div className="mt-3 flex flex-col items-center gap-2 text-center">
          {q.emoji && (
            <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-ink bg-marker/60 text-6xl shadow-[4px_4px_0_#111]">
              {q.emoji}
            </div>
          )}
          {q.kind === "listen" && <SpeakButton text={q.speak!} big />}
          {q.prompt && q.kind !== "listen" && (
            <p
              className={
                q.kind === "missing"
                  ? "font-display text-5xl tracking-[0.25em]"
                  : q.kind === "sentence"
                    ? "text-3xl leading-snug"
                    : "font-display text-4xl"
              }
            >
              {q.prompt}
            </p>
          )}
          {q.note && <p className="text-xl text-ink/70">artinya: {q.note}</p>}
          {q.speak && q.kind !== "listen" && <SpeakButton text={q.speak} small />}
        </div>

        {tiled ? (
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-2" aria-label="Kotak jawaban">
              {slotTexts.map((t, pos) => {
                const state = phase === "right" ? "bg-ok" : phase === "wrong" && t ? "bg-bad" : t ? "bg-marker" : "bg-white";
                return (
                  <motion.button
                    key={pos}
                    type="button"
                    onClick={() => t && phase === "ask" && (play("click"), setSlots((s) => s.filter((_, i) => i !== pos)))}
                    animate={phase === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                    className={`doodle-box grid place-items-center font-display ${state} ${
                      q.kind === "build" ? "min-h-12 min-w-16 px-2 text-xl" : "h-14 w-12 text-3xl uppercase"
                    }`}
                  >
                    {t}
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {q.options.map((o, i) => (
                <motion.button
                  key={i}
                  type="button"
                  disabled={slots.includes(i) || phase !== "ask"}
                  onClick={() => pickTile(i)}
                  whileTap={{ scale: 0.88 }}
                  animate={{ opacity: slots.includes(i) ? 0.2 : 1 }}
                  className={`doodle-btn bg-white ${q.kind === "build" ? "px-3 py-1.5 text-xl" : "h-14 w-14 text-3xl uppercase"}`}
                >
                  {o.value}
                </motion.button>
              ))}
            </div>
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                disabled={phase !== "ask" || slots.length === 0}
                onClick={() => setSlots((s) => s.slice(0, -1))}
                className="doodle-btn bg-white px-5 py-1 text-xl"
              >
                ⌫ Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className={`mt-4 grid gap-3 ${q.kind === "sentence" ? "grid-cols-2" : "grid-cols-2"}`}>
            {q.options.map((o, i) => {
              const isAns = o.value === q.answer;
              const state =
                phase === "ask" ? "bg-white" : isAns ? "bg-ok" : picked === o.value ? "bg-bad" : "bg-white opacity-50";
              return (
                <motion.button
                  key={o.value + i}
                  type="button"
                  disabled={phase !== "ask"}
                  onClick={() => choose(o.value)}
                  whileTap={{ scale: 0.93 }}
                  animate={phase === "wrong" && picked === o.value ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                  className={`doodle-btn px-3 py-3 ${o.emoji ? "text-6xl" : "text-2xl"} ${state}`}
                >
                  {o.emoji ?? o.text}
                </motion.button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {phase !== "ask" && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-4 border-ink px-4 py-3 ${
                phase === "right" ? "bg-ok/30" : "bg-bad/20"
              }`}
            >
              <div>
                <p className="font-display text-2xl">{phase === "right" ? "Yeay, benar! 🎉" : "Ups, hati berkurang 💔"}</p>
                <p className="text-xl">
                  {q.review.emoji} <strong>{q.review.en}</strong> = {q.review.id}
                </p>
              </div>
              <button onClick={next} className="doodle-btn px-6 py-2 text-xl">
                Lanjut ▶
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
