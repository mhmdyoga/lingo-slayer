"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorldMap from "./WorldMap";
import Battle, { type BattleResult } from "./Battle";
import { Monster, StarIcon } from "./Monsters";
import { LEVELS, LEVEL_ORDER, type LevelId } from "@/lib/questions";
import { loadProgress, saveStars, type Progress } from "@/lib/storage";
import { getMuted, play, setMuted as persistMuted } from "@/lib/sfx";
import { startMusic, stopMusic } from "@/lib/music";
import { speak } from "@/lib/speech";

type Screen =
  | { name: "menu" }
  | { name: "battle"; level: LevelId; run: number }
  | { name: "result"; level: LevelId; result: BattleResult };

export default function Game() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  const [progress, setProgress] = useState<Progress>({});
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMuted(getMuted());
  }, []);

  // musik hanya saat bertarung
  useEffect(() => {
    if (screen.name === "battle" && !muted) startMusic();
    else stopMusic();
    return stopMusic;
  }, [screen.name, muted]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      persistMuted(!m);
      return !m;
    });
  }, []);

  const startLevel = (level: LevelId) => {
    play("click");
    setScreen({ name: "battle", level, run: Date.now() });
  };

  const finish = (level: LevelId, result: BattleResult) => {
    if (result.won) setProgress(saveStars(level, result.stars));
    setScreen({ name: "result", level, result });
  };

  return (
    <main className="min-h-svh">
      <AnimatePresence mode="wait">
        {screen.name === "menu" && (
          <motion.div key="menu" exit={{ opacity: 0, y: -30 }}>
            <WorldMap progress={progress} muted={muted} onToggleMute={toggleMute} onStart={startLevel} />
          </motion.div>
        )}
        {screen.name === "battle" && (
          <motion.div key={`battle-${screen.run}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Battle
              level={screen.level}
              muted={muted}
              onToggleMute={toggleMute}
              onQuit={() => setScreen({ name: "menu" })}
              onFinish={(r) => finish(screen.level, r)}
            />
          </motion.div>
        )}
        {screen.name === "result" && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Result
              level={screen.level}
              result={screen.result}
              onAgain={() => startLevel(screen.level)}
              onNext={(l) => startLevel(l)}
              onMenu={() => setScreen({ name: "menu" })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Result({
  level,
  result,
  onAgain,
  onNext,
  onMenu,
}: {
  level: LevelId;
  result: BattleResult;
  onAgain: () => void;
  onNext: (l: LevelId) => void;
  onMenu: () => void;
}) {
  const cfg = LEVELS[level];
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        dur: 2.4 + Math.random() * 2,
        rot: Math.random() * 720 - 360,
        ch: ["✦", "★", "✿", "●"][i % 4],
      })),
    [],
  );

  return (
    <div className="relative mx-auto flex min-h-svh max-w-3xl flex-col items-center px-5 py-10 text-center">
      {result.won &&
        confetti.map((c) => (
          <motion.span
            key={c.id}
            aria-hidden
            className="pointer-events-none fixed top-0 text-3xl"
            style={{ left: `${c.left}%` }}
            initial={{ y: -40, opacity: 1 }}
            animate={{ y: "105vh", rotate: c.rot }}
            transition={{ delay: c.delay, duration: c.dur, ease: "easeIn", repeat: Infinity, repeatDelay: 1 }}
          >
            {c.ch}
          </motion.span>
        ))}

      <motion.h1
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: -2 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="font-display text-6xl md:text-8xl"
      >
        {result.won ? "MENANG!" : "KALAH..."}
      </motion.h1>
      <p className="mt-3 text-2xl">
        {result.won ? `${cfg.monsterName} berhasil kamu kalahkan!` : `${cfg.monsterName} masih terlalu kuat. Coba lagi, ya!`}
      </p>

      <motion.div
        animate={result.won ? { rotate: [0, 180, 360], scale: [1, 0.6, 1] } : { y: [0, -10, 0] }}
        transition={result.won ? { duration: 1.2 } : { duration: 1.6, repeat: Infinity }}
        className="mt-4"
      >
        <Monster kind={cfg.monster} mood={result.won ? "dead" : "idle"} className="h-44 w-44" />
      </motion.div>

      {result.won && (
        <div className="mt-2 flex gap-2" aria-label={`${result.stars} dari 3 bintang`}>
          {[1, 2, 3].map((n) => (
            <motion.div
              key={n}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + n * 0.25, type: "spring", stiffness: 260, damping: 12 }}
            >
              <StarIcon filled={n <= result.stars} className="h-16 w-16" />
            </motion.div>
          ))}
        </div>
      )}

      {result.learned.length > 0 && (
        <section className="doodle-box mt-8 w-full p-5 text-left">
          <h2 className="font-display text-2xl">Kata yang kamu temui ({result.learned.length})</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {result.learned.map((w) => (
              <li key={w.en}>
                <button
                  onClick={() => speak(w.en)}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-ink px-3 py-1 text-left text-xl hover:bg-marker/60"
                >
                  <span className="text-3xl">{w.emoji ?? "💬"}</span>
                  <span>
                    <strong>{w.en}</strong> = {w.id}
                  </span>
                  <span className="ml-auto" aria-hidden>
                    🔊
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {result.won && nextLevel && (
          <button onClick={() => onNext(nextLevel)} className="doodle-btn px-8 py-3 text-2xl">
            Monster berikutnya ▶
          </button>
        )}
        <button onClick={onAgain} className="doodle-btn bg-white px-6 py-3 text-2xl">
          ↻ Main lagi
        </button>
        <button onClick={onMenu} className="doodle-btn bg-white px-6 py-3 text-2xl">
          Menu
        </button>
      </div>
    </div>
  );
}
