"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Engine, type Stats } from "./engine";
import type { MKind } from "@/lib/bestiary";
import { useSprites } from "./Sprites";
import QuestPanel from "../QuestPanel";
import { HeartIcon } from "../Monsters";
import { Knight } from "../Scenery";
import { createQuestGenerator } from "@/lib/quests";
import type { Question } from "@/lib/questions";
import { getMuted, setMuted as persistMuted } from "@/lib/sfx";
import { startMusic, stopMusic } from "@/lib/music";
import { speak } from "@/lib/speech";
import { isCollected, loadBook, RecordWord, WordStats } from "@/lib/wordsbook";
import WordBookModal from "../WordsBook";
import { Shop } from "@/types/shop/shop";
import { addCoins, DEFAULT_SHOP, loadShop } from "@/lib/shop";
import Store from "../Store";
import { ShoppingCart } from "lucide-react";

type Phase = "intro" | "play" | "quest" | "over";
type Review = { en: string; id: string; emoji?: string } | null;

const START: Stats = {
  hp: 5,
  maxHp: 5,
  level: 1,
  xp: 0,
  xpNext: 40,
  kills: 0,
  score: 0,
  streak: 0,
};
const BEST_KEY = "blejar-best-world";

export default function WorldGame() {
  const { host, sprites } = useSprites();
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);
  const gen = useRef(createQuestGenerator());
  const statsRef = useRef<Stats>(START);
  const xpBar = useRef<HTMLDivElement>(null);
  const quest = useRef<{ q: Question; kind: MKind } | null>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [stats, setStats] = useState<Stats>(START);
  const [questState, setQuestState] = useState<{
    q: Question;
    kind: MKind;
  } | null>(null);
  const [learned, setLearned] = useState<Review[]>([]);
  const [finalStats, setFinalStats] = useState<Stats>(START);
  const [best, setBest] = useState(0);
  const [muted, setMuted] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [newWord, setNewWord] = useState<Review>();
  const [paused, setPaused] = useState(false);
  const [banner, setBanner] = useState<number | null>(null);
  const [touch, setTouch] = useState(false);

  const [shop, setShop] = useState<Shop>(DEFAULT_SHOP);
  const [storeOpen, setStoreOpen] = useState(false);

  const phaseRef = useRef<Phase>("intro");
  phaseRef.current = phase;
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const shopRef = useRef<Shop>(DEFAULT_SHOP);

  useEffect(() => {
    setMuted(getMuted());
    try {
      setBest(Number(localStorage.getItem(BEST_KEY) ?? 0));
    } catch {}
    setTouch(
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 720,
    );
  }, []);

  // ---- buat engine ----
  useEffect(() => {
    if (!sprites || !canvasRef.current || !wrap.current) return;
    const e = new Engine(canvasRef.current, sprites, {
      onStats: (s) => {
        statsRef.current = s;
        setStats(s);
      },
      onKill: (kind) => {
        const q = gen.current(statsRef.current.level, kind);
        quest.current = { q, kind };
        setQuestState({ q, kind });
        setPhase("quest");
      },
      onHurt: () => {
        if (wrap.current)
          gsap.fromTo(
            wrap.current,
            { x: -14, y: 6 },
            {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.3)",
              overwrite: true,
            },
          );
      },
      onLevelUp: (lv) => {
        setBanner(lv);
        setTimeout(() => setBanner(null), 2200);
      },
      onGameOver: (s) => {
        setFinalStats(s);
        setPhase("over");
        stopMusic();
        try {
          const b = Math.max(
            Number(localStorage.getItem(BEST_KEY) ?? 0),
            s.score,
          );
          localStorage.setItem(BEST_KEY, String(b));
          setBest(b);
        } catch {}
      },
      onCoin: (n) => setShop(addCoins(n)),
    });
    engine.current = e;
    e.muted = getMuted();
    e.look = { skin: shopRef.current.skin, sword: shopRef.current.sword };
    (window as unknown as { __world?: Engine }).__world = e;
    const fit = () => {
      const r = wrap.current!.getBoundingClientRect();
      e.resize(r.width, r.height);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap.current);
    e.start();
    return () => {
      ro.disconnect();
      e.stop();
      engine.current = null;
    };
  }, [sprites]);

  // ---- keyboard ----
  useEffect(() => {
    const down = (ev: KeyboardEvent) => {
      if (phaseRef.current !== "play" || !engine.current) return;
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          ev.code,
        )
      )
        ev.preventDefault();
      if (ev.code === "KeyP" || ev.code === "Escape")
        return setPaused((p) => !p);
      if (!ev.repeat || ev.code === "Space") engine.current.keyDown(ev.code);
    };
    const up = (ev: KeyboardEvent) => engine.current?.keyUp(ev.code);
    const blur = () => engine.current?.clearInput();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // jeda saat tab tersembunyi / tombol jeda
  useEffect(() => {
    const apply = () => {
      if (engine.current)
        engine.current.suspended = document.hidden || pausedRef.current;
    };
    apply();
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, [paused]);

  // bar XP dengan GSAP
  useEffect(() => {
    if (xpBar.current)
      gsap.to(xpBar.current, {
        width: `${(stats.xp / stats.xpNext) * 100}%`,
        duration: 0.6,
        ease: "power3.out",
      });
  }, [stats.xp, stats.xpNext, stats.level]);

  useEffect(() => stopMusic, []);
  useEffect(() => setShop(loadShop()), []);
  useEffect(() => {
    shopRef.current = shop;
    if (engine.current)
      engine.current.look = { skin: shop.skin, sword: shop.sword };
  }, [shop]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      persistMuted(!m);
      if (engine.current) engine.current.muted = !m;
      if (!m) stopMusic();
      else if (phaseRef.current === "play") startMusic();
      return !m;
    });
  }, []);

  const begin = () => {
    const e = engine.current;
    if (!e) return;
    e.reset();
    e.resume();
    setLearned([]);
    setPaused(false);
    setPhase("play");
    if (!getMuted()) startMusic();
    speak("");
  };

  const questDone = (ok: boolean) => {
    const e = engine.current;
    const cur = quest.current;
    if (!e || !cur) return;
    const rv = cur.q.review;
    setLearned((l) => (l.some((x) => x?.en === rv.en) ? l : [...l, rv]));
    const wasNew = !isCollected(loadBook()[rv.en]);
    const after = RecordWord(rv.en, ok)[rv.en];
    if (ok && wasNew && isCollected(after)) {
      setNewWord(rv);
      setTimeout(() => setNewWord(null), 2500);
    }
    e.reward(ok, cur.kind);
    setQuestState(null);
    quest.current = null;
    if (!e.over) {
      setPhase("play");
      e.resume();
    }
  };

  const heartsRow = Array.from({ length: stats.maxHp });

  return (
    <main className="fixed inset-0 select-none overflow-hidden bg-paper">
      {host}
      <div ref={wrap} className="absolute inset-0">
        <canvas ref={canvasRef} className="block touch-none" />
      </div>

      {/* HUD */}
      {phase !== "intro" && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-2 md:left-5 md:top-5">
            <div className="doodle-box px-2.5 py-2 sm:px-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full border-4 border-ink bg-marker px-2 font-display text-base sm:px-3 sm:text-lg">
                  Lv {stats.level}
                </span>
                <div
                  className="flex max-w-[9.5rem] flex-wrap gap-0.5 sm:max-w-none"
                  aria-label={`Nyawa ${stats.hp} dari ${stats.maxHp}`}
                >
                  {heartsRow.map((_, i) => (
                    <HeartIcon
                      key={i}
                      filled={i < stats.hp}
                      className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2 h-4 w-40 overflow-hidden rounded-full border-4 border-ink bg-white sm:w-52 md:w-64">
                <div ref={xpBar} className="hatch h-full w-0 bg-marker" />
              </div>
              <p className="mt-1 text-base">
                XP {stats.xp}/{stats.xpNext} · ⚔ {stats.kills} · ★ {stats.score}
                {stats.streak >= 2 && <span> · 🔥{stats.streak}</span>}
              </p>
              <p className="text-base">🪙 {shop.coins}</p>
            </div>
          </div>
          <div className="absolute right-3 top-3 z-10 flex gap-2 md:right-5 md:top-5">
            <button
              onClick={() => setBookOpen(true)}
              className="doodle-btn grid h-11 w-11 place-items-center bg-white text-xl"
            >
              📖
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="doodle-btn grid h-11 w-11 place-items-center bg-white text-xl"
              aria-label="Jeda"
            >
              {paused ? "▶" : "⏸"}
            </button>
            <button
              onClick={toggleMute}
              className="doodle-btn grid h-11 w-11 place-items-center bg-white text-2xl"
              aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <Link
              href="/"
              className="doodle-btn grid h-11 place-items-center bg-white px-3 text-lg"
              onClick={() => stopMusic()}
            >
              ✕
            </Link>
          </div>
        </>
      )}

      {/* petunjuk singkat */}
      {phase === "play" && !touch && (
        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 9, duration: 1.5 }}
          className="doodle-box pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 px-5 py-2 text-xl"
        >
          WASD / panah = jalan · <b>SPASI</b> = tebas monster · P = jeda
        </motion.p>
      )}

      {/* kontrol sentuh */}
      {phase === "play" && touch && <TouchControls engine={engine} />}

      {/* banner naik level */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 14 }}
            className="doodle-box pointer-events-none absolute left-1/2 top-24 z-30 -translate-x-1/2 bg-marker px-8 py-3 text-center"
          >
            <p className="font-display text-4xl">LEVEL {banner}!</p>
            <p className="text-xl">Nyawa penuh · quest makin seru</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* jeda */}
      <AnimatePresence>
        {paused && phase === "play" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 grid place-items-center bg-paper/70"
          >
            <div className="doodle-box px-10 py-6 text-center items-center">
              <p className="font-display text-5xl">JEDA</p>
              <div className="flex flex-col md:flex-row gap-2">
                 <button
                onClick={() => setPaused(false)}
                className="doodle-btn mt-4 px-8 py-3 text-2xl"
              >
                Lanjut ▶
              </button>
              <button
                onClick={() => setStoreOpen(true)}
                className="doodle-btn mt-4 px-8 py-3 text-2xl"
              >
                <ShoppingCart className="font-bold text-black"/> Toko
              </button> 
              </div>
            
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* quest */}
      <AnimatePresence>
        {bookOpen && <WordBookModal onClose={() => setBookOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {phase === "quest" && questState && (
          <QuestPanel
            key={questState.q.key + stats.kills}
            q={questState.q}
            monster={questState.kind}
            streak={stats.streak}
            onDone={questDone}
          />
        )}
      </AnimatePresence>

      {/* intro */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 grid place-items-center overflow-y-auto bg-paper/85 p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, rotate: -2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              className="doodle-box flex w-full max-w-3xl flex-col items-center gap-4 p-6 text-center md:flex-row md:text-left"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-36 shrink-0 md:w-44"
              >
                <Knight className="w-full" />
              </motion.div>
              <div>
                <h1 className="font-display text-4xl md:text-5xl">
                  PETUALANGAN <span className="bg-marker px-2">KSATRIA</span>
                </h1>
                <ul className="mt-3 space-y-1 text-xl">
                  <li>
                    🗺️ Jelajahi dunia luas, cari monster (ikuti panah &amp; peta
                    mini).
                  </li>
                  <li>
                    ⚔️ Tebas monster dengan pedangmu. Jangan sampai disentuh!
                  </li>
                  <li>
                    📝 Kadang monster yang kalah menjatuhkan quest bahasa
                    Inggris. Jawab benar untuk XP!
                  </li>
                  <li>💔 Salah jawab atau kena monster, nyawa berkurang.</li>
                </ul>
                <p className="mt-2 text-lg text-ink/70">
                  {touch
                    ? "Joystick kiri bawah untuk jalan, tombol ⚔ untuk menebas."
                    : "Jalan: WASD / panah · Tebas: SPASI · Jeda: P"}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <button
                    onClick={begin}
                    disabled={!sprites}
                    className="doodle-btn px-8 py-3 text-3xl"
                  >
                    {sprites ? "MULAI ▶" : "Memuat..."}
                  </button>
                  <button
                    onClick={() => setBookOpen(true)}
                    className="doodle-btn bg-white px-5 py-2 text-xl"
                  >
                    📖 Buku Kata
                  </button>
                  <Link
                    href="/"
                    className="doodle-btn bg-white px-5 py-2 text-xl"
                  >
                    ← Beranda
                  </Link>
                  <button
                    onClick={() => setStoreOpen(true)}
                    className="doodle-btn bg-white px-5 py-2 text-xl"
                  >
                    🛒 Toko
                  </button>
                  <Link
                    href="/arena"
                    className="text-lg underline decoration-2 underline-offset-4"
                  >
                    Mode Arena
                  </Link>
                </div>
                {best > 0 && (
                  <p className="mt-3 text-lg">🏆 Skor terbaik: {best}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* game over */}
      <AnimatePresence>
        {phase === "over" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/55 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="doodle-box w-full max-w-xl p-6 text-center"
            >
              <h2 className="font-display text-5xl md:text-6xl">
                KSATRIA JATUH!
              </h2>
              <p className="mt-2 text-xl">
                Level {finalStats.level} · ⚔ {finalStats.kills} monster · ★{" "}
                {finalStats.score}
              </p>
              {finalStats.score >= best && finalStats.score > 0 && (
                <p className="text-xl">🏆 Skor terbaik baru!</p>
              )}
              {learned.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="font-display text-xl">
                    Kata yang kamu pelajari ({learned.length})
                  </p>
                  <ul className="mt-2 grid max-h-52 gap-1.5 overflow-y-auto sm:grid-cols-2">
                    {learned.map((w) => (
                      <li key={w!.en}>
                        <button
                          onClick={() => speak(w!.en)}
                          className="flex w-full items-center gap-2 rounded-xl border-2 border-ink px-2 py-0.5 text-left text-lg hover:bg-marker/60"
                        >
                          <span className="text-2xl">{w!.emoji ?? "💬"}</span>
                          <span className="truncate">
                            <b>{w!.en}</b> = {w!.id}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={begin}
                  className="doodle-btn px-8 py-3 text-2xl"
                >
                  ↻ Main lagi
                </button>
                <Link
                  href="/"
                  className="doodle-btn bg-white px-6 py-3 text-2xl"
                >
                  Beranda
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {storeOpen && (
          <Store
            shop={shop}
            onChange={setShop}
            onClose={() => setStoreOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function TouchControls({ engine }: { engine: React.RefObject<Engine | null> }) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const active = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = (e: React.PointerEvent) => {
    if (active.current !== e.pointerId || !base.current || !engine.current)
      return;
    const r = base.current.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const max = r.width / 2 - 10;
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    setKnob({ x: dx, y: dy });
    engine.current.joy = { x: dx / max, y: dy / max };
  };
  const end = (e: React.PointerEvent) => {
    if (active.current !== e.pointerId) return;
    active.current = null;
    setKnob({ x: 0, y: 0 });
    if (engine.current) engine.current.joy = { x: 0, y: 0 };
  };
  useEffect(
    () => () => void (timer.current && clearInterval(timer.current)),
    [],
  );

  return (
    <>
      <div
        ref={base}
        className="doodle-box absolute bottom-6 left-6 z-20 grid h-32 w-32 touch-none place-items-center rounded-full bg-white/80"
        style={{ borderRadius: "50%" }}
        onPointerDown={(e) => {
          active.current = e.pointerId;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          move(e);
        }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          className="h-14 w-14 rounded-full border-4 border-ink bg-marker shadow-[3px_3px_0_#111]"
          style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        />
      </div>
      <button
        className="doodle-btn absolute bottom-8 right-6 z-20 grid h-24 w-24 touch-none place-items-center text-5xl"
        style={{ borderRadius: "50%" }}
        aria-label="Tebas"
        onPointerDown={(e) => {
          e.preventDefault();
          engine.current?.attack();
          timer.current = setInterval(() => engine.current?.attack(), 140);
        }}
        onPointerUp={() => timer.current && clearInterval(timer.current)}
        onPointerLeave={() => timer.current && clearInterval(timer.current)}
        onPointerCancel={() => timer.current && clearInterval(timer.current)}
      >
        ⚔
      </button>
    </>
  );
}
