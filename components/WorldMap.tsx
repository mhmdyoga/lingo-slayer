"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Monster, StarIcon } from "./Monsters";
import { Cloud, PencilHero, Rock, Sun, PineTree } from "./Scenery";
import { LEVELS, LEVEL_ORDER, type LevelId } from "@/lib/questions";
import type { Progress } from "@/lib/storage";
import { play } from "@/lib/sfx";

const TILT = 56; // kemiringan kamera (derajat)
const ROT = -8; // putaran peta
const THICK = 8; // jumlah lapisan tebal pulau
const LAYER = 3; // px per lapisan
const TOP = THICK * LAYER;

const ISLANDS: Record<LevelId, { x: number; y: number; d: number; m: number }> = {
  easy: { x: -440, y: 170, d: 330, m: 200 },
  medium: { x: -10, y: -130, d: 350, m: 215 },
  hard: { x: 450, y: 190, d: 420, m: 270 },
};

const DECOR: { t: "tree" | "rock"; x: number; y: number; s: number }[] = [
  { t: "tree", x: -640, y: 20, s: 120 },
  { t: "tree", x: -590, y: 330, s: 100 },
  { t: "rock", x: -260, y: 330, s: 80 },
  { t: "tree", x: -250, y: 60, s: 110 },
  { t: "rock", x: -340, y: -140, s: 70 },
  { t: "tree", x: -170, y: -330, s: 130 },
  { t: "tree", x: 190, y: -250, s: 115 },
  { t: "rock", x: 240, y: -40, s: 90 },
  { t: "tree", x: 330, y: -300, s: 100 },
  { t: "tree", x: 140, y: 120, s: 105 },
  { t: "rock", x: 100, y: 350, s: 85 },
  { t: "tree", x: 690, y: 40, s: 125 },
  { t: "tree", x: 700, y: 360, s: 105 },
  { t: "rock", x: 760, y: -180, s: 75 },
  { t: "tree", x: -820, y: -140, s: 115 },
  { t: "tree", x: 880, y: 200, s: 110 },
  { t: "tree", x: -80, y: 440, s: 100 },
  { t: "tree", x: 480, y: -150, s: 95 },
];

const CLOUDS = [
  { x: -700, y: -420, z: 260, w: 260 },
  { x: -120, y: -520, z: 320, w: 200 },
  { x: 520, y: -440, z: 280, w: 300 },
  { x: 140, y: 120, z: 380, w: 180 },
];

const BLOB = "48% 52% 55% 45% / 52% 46% 54% 48%";

/** Berdiri tegak menghadap kamera di titik (0,0) induknya. Padding memberi ruang agar animasi tidak terpotong. */
function Stand({
  children,
  z = 0,
  padTop = 0,
  padX = 0,
  padBottom = 0,
}: {
  children: React.ReactNode;
  z?: number;
  padTop?: number;
  padX?: number;
  padBottom?: number;
}) {
  return (
    <div className="absolute left-0 top-0" style={{ transformStyle: "preserve-3d", transform: `translateZ(${z}px)` }}>
      <div
        className="absolute"
        style={{
          padding: `${padTop}px ${padX}px ${padBottom}px`,
          transformOrigin: "0 0",
          transform: `rotateZ(${-ROT}deg) rotateX(${-TILT}deg) translate(-50%, calc(-100% + ${padBottom}px))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function WorldMap({
  progress,
  muted,
  onToggleMute,
  onStart,
}: {
  progress: Progress;
  muted: boolean;
  onToggleMute: () => void;
  onStart: (l: LevelId) => void;
}) {
  const [selected, setSelected] = useState<LevelId>("easy");
  const [launching, setLaunching] = useState(false);
  const [vw, setVw] = useState(1280);

  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // kamera: intro menukik + parallax mouse
  const baseRx = useMotionValue(82);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const rx = useTransform([baseRx, smy], ([b, m]) => (b as number) + (m as number) * -3);
  const rz = useTransform(smx, (m) => ROT + m * 4);

  useEffect(() => {
    const c = animate(baseRx, TILT, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    const move = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => {
      c.stop();
      window.removeEventListener("pointermove", move);
    };
  }, [baseRx, mx, my]);

  const base = Math.min(1.05, Math.max(0.42, vw / 1500));
  const zoomSel = Math.max(base * 1.18, Math.min(1, vw / 760));
  const pos = ISLANDS[selected];
  const scale = launching ? zoomSel * 2.6 : zoomSel;

  const launch = (l: LevelId) => {
    if (launching) return;
    play("click");
    setLaunching(true);
    setTimeout(() => onStart(l), 650);
  };
  const pick = (l: LevelId) => {
    if (launching) return;
    if (l === selected) return launch(l);
    play("click");
    setSelected(l);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = LEVEL_ORDER.indexOf(selected);
      if (e.key === "ArrowRight" && i < 2) pick(LEVEL_ORDER[i + 1]);
      else if (e.key === "ArrowLeft" && i > 0) pick(LEVEL_ORDER[i - 1]);
      else if (e.key === "Enter") launch(selected);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const total = LEVEL_ORDER.reduce((n, id) => n + (progress[id] ?? 0), 0);
  const path = useMemo(() => {
    const c = (id: LevelId) => ISLANDS[id];
    const o = { x: 2000, y: 1500 };
    const a = c("easy"), b = c("medium"), k = c("hard");
    return `M${a.x + o.x} ${a.y + o.y} C${a.x + o.x + 120} ${a.y + o.y - 260} ${b.x + o.x - 220} ${b.y + o.y + 220} ${b.x + o.x} ${b.y + o.y} S${k.x + o.x - 260} ${k.y + o.y - 300} ${k.x + o.x} ${k.y + o.y}`;
  }, []);
  const lv = LEVELS[selected];
  const stars = progress[selected] ?? 0;

  return (
    <div className="no-wobble fixed inset-0 overflow-hidden bg-paper">
      {/* langit */}
      <Sun className="absolute right-[6%] top-[10%] h-24 w-24 md:h-36 md:w-36" />

      {/* dunia 3D */}
      <div className="absolute inset-0" style={{ perspective: 2800, perspectiveOrigin: "50% 40%" }}>
        <motion.div
          className="absolute"
          style={{ left: "50%", top: "55%", width: 0, height: 0, transformStyle: "preserve-3d", rotateX: rx, rotateZ: rz }}
        >
          <motion.div
            style={{ transformStyle: "preserve-3d" }}
            animate={{ x: -pos.x * scale, y: -pos.y * scale, scale }}
            transition={{ type: "spring", stiffness: launching ? 90 : 70, damping: 16 }}
            initial={{ x: -pos.x * scale, y: -pos.y * scale, scale: scale * 0.7 }}
          >
            {/* tanah: kertas kotak-kotak, makin jauh makin rapat */}
            <div
              className="absolute"
              style={{
                left: -3000,
                top: -2200,
                width: 6000,
                height: 4400,
                backgroundColor: "#fffdf6",
                backgroundImage:
                  "linear-gradient(rgba(17,17,17,.13) 2px, transparent 2px), linear-gradient(90deg, rgba(17,17,17,.13) 2px, transparent 2px), radial-gradient(rgba(17,17,17,.18) 3px, transparent 3px)",
                backgroundSize: "100px 100px, 100px 100px, 50px 50px",
              }}
            />

            {/* jalan titik-titik */}
            <svg
              className="absolute"
              width={4000}
              height={3000}
              viewBox="0 0 4000 3000"
              style={{ left: -2000, top: -1500, transform: "translateZ(2px)" }}
              aria-hidden
            >
              <path d={path} fill="none" stroke="#111" strokeWidth={14} strokeLinecap="round" strokeDasharray="2 34" style={{ animation: "dash 2.2s linear infinite" }} />
            </svg>

            {/* dekor */}
            {DECOR.map((d, i) => (
              <div key={i} className="absolute" style={{ left: d.x, top: d.y, width: d.s, transformStyle: "preserve-3d" }}>
                <Stand>
                  {d.t === "tree" ? (
                    <div style={{ width: d.s }}><PineTree className="w-full" /></div>
                  ) : (
                    <div style={{ width: d.s }}><Rock className="w-full" /></div>
                  )}
                </Stand>
              </div>
            ))}

            {/* awan melayang */}
            {CLOUDS.map((c, i) => (
              <div key={i} className="absolute" style={{ left: c.x, top: c.y, transformStyle: "preserve-3d" }}>
                <Stand z={c.z} padX={80} padTop={20} padBottom={20}>
                  <div style={{ width: c.w, animation: `drift ${9 + i * 3}s ease-in-out infinite alternate` }}>
                    <Cloud className="w-full" />
                  </div>
                </Stand>
              </div>
            ))}

            {/* pulau + monster */}
            {LEVEL_ORDER.map((id) => {
              const cfg = LEVELS[id];
              const isl = ISLANDS[id];
              const sel = id === selected;
              const st = progress[id] ?? 0;
              return (
                <motion.div
                  key={id}
                  className="absolute cursor-pointer"
                  style={{ left: isl.x - isl.d / 2, top: isl.y - isl.d / 2, width: isl.d, height: isl.d, transformStyle: "preserve-3d" }}
                  animate={{ z: sel ? 16 : 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 14 }}
                  onClick={() => pick(id)}
                  role="button"
                  aria-label={`Pilih ${cfg.monsterName}`}
                >
                  {/* bayangan di tanah */}
                  <div
                    className="absolute"
                    style={{ inset: -26, borderRadius: BLOB, background: "rgba(17,17,17,.22)", transform: "translateZ(-2px)", filter: "blur(10px)" }}
                  />
                  {/* sisi tebal */}
                  {Array.from({ length: THICK }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{ inset: 0, borderRadius: BLOB, background: i % 2 ? "#111" : "#2b2b2b", transform: `translateZ(${i * LAYER}px)` }}
                    />
                  ))}
                  {/* permukaan */}
                  <div
                    className="absolute"
                    style={{
                      inset: 0,
                      borderRadius: BLOB,
                      border: "6px solid #111",
                      background: sel
                        ? "radial-gradient(circle at 50% 50%, #fffbe0 0 55%, #ffe14d 100%)"
                        : "radial-gradient(circle at 50% 50%, #fff 0 60%, #f1efe4 100%)",
                      transform: `translateZ(${TOP}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="absolute inset-[9%]" style={{ borderRadius: BLOB, border: "4px dashed rgba(17,17,17,.45)" }} />
                  </div>
                  {/* monster (di luar permukaan agar tidak terpotong) */}
                  <div className="absolute" style={{ left: "50%", top: "62%", transformStyle: "preserve-3d" }}>
                      <Stand z={TOP} padTop={80} padX={70} padBottom={80}>
                        <div className="relative">
                        <motion.div
                          animate={{ y: [0, sel ? -18 : -8, 0], scale: sel ? 1.12 : 1 }}
                          transition={{ y: { duration: sel ? 0.9 : 2.2, repeat: Infinity, ease: "easeInOut" }, scale: { type: "spring" } }}
                          style={{ width: isl.m, transformOrigin: "50% 100%" }}
                        >
                          <Monster kind={cfg.monster} className="w-full" title={cfg.monsterName} />
                        </motion.div>
                        <div className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
                          <div className="doodle-box flex items-center gap-1 px-3 py-0.5">
                            <span className="font-display text-xl">{cfg.monsterName}</span>
                            <span className="flex">
                              {[1, 2, 3].map((n) => (
                                <StarIcon key={n} filled={n <= st} className="h-5 w-5" />
                              ))}
                            </span>
                          </div>
                        </div>
                        </div>
                      </Stand>
                  </div>
                </motion.div>
              );
            })}

            {/* pemain: pensil kecil yang melompat antar pulau */}
            <motion.div
              className="absolute"
              style={{ left: 0, top: 0, transformStyle: "preserve-3d" }}
              animate={{ x: pos.x - ISLANDS[selected].d * 0.34, y: pos.y + ISLANDS[selected].d * 0.3 }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
            >
              <Stand z={TOP + 16} padTop={170} padX={30}>
                <motion.div
                  key={selected}
                  animate={{ y: [0, -120, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  style={{ width: 70 }}
                >
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.1, repeat: Infinity }}>
                    <PencilHero className="w-full" />
                  </motion.div>
                </motion.div>
              </Stand>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* kabut horizon */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
        style={{ background: "linear-gradient(#fffdf6 6%, rgba(255,253,246,.8) 40%, rgba(255,253,246,0))" }}
      />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 md:p-5">
        <Link href="/" className="doodle-btn pointer-events-auto bg-white px-4 py-1 text-xl">
          ← Beranda
        </Link>
        <h1 className="doodle-box hidden -rotate-1 px-5 py-1 font-display text-2xl sm:block md:text-4xl">
          PETA <span className="bg-marker px-1">MONSTER</span>
        </h1>
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="doodle-box flex items-center gap-1 px-3 py-1 text-xl">
            <StarIcon filled className="h-6 w-6" /> {total}/9
          </span>
          <button
            onClick={onToggleMute}
            className="doodle-btn grid h-11 w-11 place-items-center bg-white text-2xl"
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* panel info */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ y: 60, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="doodle-box pointer-events-auto flex w-full max-w-3xl flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:justify-between"
          >
            <div className="text-center sm:text-left">
              <p className="font-display text-2xl md:text-3xl">{lv.monsterName}</p>
              <p className="text-lg">
                <span className="rounded-full border-2 border-ink bg-marker px-2">
                  {lv.label} · {lv.grade}
                </span>{" "}
                {lv.blurb}
              </p>
              <p className="text-base text-ink/60">
                {"♥".repeat(lv.hearts)} nyawa · {lv.timer ? `${lv.timer} detik/soal` : "tanpa batas waktu"} · pakai ← → untuk pindah
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex" aria-label={`${stars} dari 3 bintang`}>
                {[1, 2, 3].map((n) => (
                  <StarIcon key={n} filled={n <= stars} className="h-9 w-9" />
                ))}
              </span>
              <button onClick={() => launch(selected)} className="doodle-btn px-7 py-2 text-2xl md:text-3xl">
                LAWAN! ⚔
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* transisi masuk battle */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 bg-paper"
        initial={{ opacity: 1 }}
        animate={{ opacity: launching ? 1 : 0 }}
        transition={{ duration: launching ? 0.5 : 0.9, delay: launching ? 0.15 : 0.2 }}
      />
    </div>
  );
}
