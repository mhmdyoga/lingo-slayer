"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "framer-motion";
import { Monster, PencilIcon, HeartIcon, type Mood } from "./Monsters";
import { LEVELS, createQuestionStream, starsFor, type LevelId, type Question } from "@/lib/questions";
import { play } from "@/lib/sfx";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";

export type Review = { en: string; id: string; emoji?: string };
export type BattleResult = { won: boolean; stars: number; hearts: number; learned: Review[] };

type Phase = "ask" | "right" | "wrong";
type Anim = "idle" | "hurt" | "lunge" | "dead";

const MONSTER_ANIM: Record<Anim, { animate: TargetAndTransition; transition: Transition }> = {
  idle: {
    animate: { x: 0, y: [0, -10, 0], rotate: 0, scale: 1, opacity: 1 },
    transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
  },
  hurt: {
    animate: { x: [0, -20, 16, -10, 6, 0], y: 0, rotate: [0, -8, 8, -4, 0], scale: [1, 0.9, 1], opacity: 1 },
    transition: { duration: 0.5 },
  },
  lunge: {
    animate: { x: 0, y: [0, 34, 0], rotate: 0, scale: [1, 1.28, 1], opacity: 1 },
    transition: { duration: 0.55, ease: "easeOut" },
  },
  dead: {
    animate: { x: 0, y: [0, -40, 420], rotate: [0, 18, -160], scale: 1, opacity: [1, 1, 0] },
    transition: { duration: 1.1, ease: "easeIn" },
  },
};

export default function Battle({
  level,
  muted,
  onToggleMute,
  onFinish,
  onQuit,
}: {
  level: LevelId;
  muted: boolean;
  onToggleMute: () => void;
  onFinish: (r: BattleResult) => void;
  onQuit: () => void;
}) {
  const cfg = LEVELS[level];
  const [next] = useState(() => createQuestionStream(level));
  const [q, setQ] = useState<Question>(() => next());
  const [qNo, setQNo] = useState(1);
  const [phase, setPhase] = useState<Phase>("ask");
  const [picked, setPicked] = useState<string | null>(null);
  const [slots, setSlots] = useState<number[]>([]);
  const [hp, setHp] = useState(cfg.monsterHp);
  const [hearts, setHearts] = useState(cfg.hearts);
  const [streak, setStreak] = useState(0);
  const [anim, setAnim] = useState<Anim>("idle");
  const [shots, setShots] = useState<{ id: number; dmg: number } | null>(null);
  const [popup, setPopup] = useState<{ id: number; text: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(cfg.timer ?? 0);
  const [learned, setLearned] = useState<Review[]>([]);
  const [shake, setShake] = useState(0);
  const [ended, setEnded] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shotId = useRef(0);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      stopSpeaking();
    };
  }, []);

  const mood: Mood = anim === "hurt" ? "hurt" : anim === "dead" ? "dead" : "idle";
  const isSpell = q.kind === "spell";

  /** Tangani hasil jawaban (benar/salah/waktu habis). */
  const resolve = useCallback(
    (correct: boolean) => {
      if (phase !== "ask" || ended) return;
      setPhase(correct ? "right" : "wrong");
      const entry = q.review;
      setLearned((l) => (l.some((x) => x.en === entry.en) ? l : [...l, entry]));
      later(() => speak(entry.en), 350);

      if (correct) {
        play("correct");
        const newStreak = streak + 1;
        const dmg = newStreak % 3 === 0 ? 2 : 1;
        setStreak(newStreak);
        shotId.current++;
        setShots({ id: shotId.current, dmg });
        later(() => {
          play(dmg > 1 ? "super" : "hit");
          setAnim("hurt");
          setPopup({ id: shotId.current, text: dmg > 1 ? "SUPER! -2" : "-1" });
          const left = Math.max(0, hp - dmg);
          setHp(left);
          if (left <= 0) {
            setEnded(true);
            later(() => setAnim("dead"), 450);
            later(() => {
              play("win");
              onFinish({ won: true, stars: starsFor(true, hearts, cfg.hearts), hearts, learned: [...learned, entry].filter((x, i, a) => a.findIndex((y) => y.en === x.en) === i) });
            }, 1900);
          } else {
            later(() => setAnim("idle"), 520);
          }
        }, 480);
      } else {
        play("wrong");
        setStreak(0);
        const left = hearts - 1;
        setHearts(left);
        setAnim("lunge");
        setShake((s) => s + 1);
        later(() => setAnim("idle"), 600);
        if (left <= 0) {
          setEnded(true);
          later(() => {
            play("lose");
            onFinish({ won: false, stars: 0, hearts: 0, learned: [...learned, entry].filter((x, i, a) => a.findIndex((y) => y.en === x.en) === i) });
          }, 1700);
        }
      }
    },
    [phase, ended, q, streak, hp, hearts, learned, cfg.hearts, later, onFinish],
  );

  const goNext = useCallback(() => {
    if (ended) return;
    stopSpeaking();
    setQ(next());
    setQNo((n) => n + 1);
    setPhase("ask");
    setPicked(null);
    setSlots([]);
    setPopup(null);
  }, [ended, next]);

  // lanjut otomatis setelah jawaban benar
  useEffect(() => {
    if (phase === "right" && !ended) {
      const t = setTimeout(goNext, 1900);
      return () => clearTimeout(t);
    }
  }, [phase, ended, goNext]);

  // putar suara otomatis untuk soal dengar & susun kata
  useEffect(() => {
    if ((q.kind === "listen" || q.kind === "spell") && q.speak) {
      const t = setTimeout(() => speak(q.speak!), 500);
      return () => clearTimeout(t);
    }
  }, [q]);

  // timer per soal
  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;
  useEffect(() => {
    if (!cfg.timer || phase !== "ask" || ended) return;
    const deadline = Date.now() + cfg.timer * 1000;
    setTimeLeft(cfg.timer);
    const iv = setInterval(() => {
      const left = Math.max(0, (deadline - Date.now()) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(iv);
        resolveRef.current(false);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [q, phase, ended, cfg.timer]);

  // ---- aksi pemain ----
  const choose = (value: string) => {
    if (phase !== "ask") return;
    play("click");
    setPicked(value);
    resolve(value === q.answer);
  };

  const pickTile = (idx: number) => {
    if (phase !== "ask" || slots.includes(idx) || slots.length >= q.answer.length) return;
    play("click");
    const nextSlots = [...slots, idx];
    setSlots(nextSlots);
    if (nextSlots.length === q.answer.length) {
      const word = nextSlots.map((i) => q.options[i].value).join("");
      resolve(word === q.answer);
    }
  };
  const removeSlot = (pos: number) => {
    if (phase !== "ask") return;
    play("click");
    setSlots((s) => s.filter((_, i) => i !== pos));
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (phase !== "ask") {
        if ((e.key === "Enter" || e.key === " ") && phase === "wrong") {
          e.preventDefault();
          goNext();
        }
        return;
      }
      if (isSpell) {
        if (e.key === "Backspace") return setSlots((s) => s.slice(0, -1));
        if (/^[a-z]$/i.test(e.key)) {
          const idx = q.options.findIndex((o, i) => o.value === e.key.toLowerCase() && !slots.includes(i));
          if (idx >= 0) pickTile(idx);
        }
      } else {
        const n = Number(e.key);
        if (n >= 1 && n <= q.options.length) choose(q.options[n - 1].value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hpPct = (hp / cfg.monsterHp) * 100;
  const shownSlots = useMemo(() => Array.from({ length: q.answer.length }), [q.answer.length]);

  return (
    <motion.div
      key={shake}
      animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : undefined}
      transition={{ duration: 0.4 }}
      className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 pb-6 pt-3"
    >
      {/* bar atas */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={onQuit} className="doodle-btn bg-white px-4 py-1 text-xl" aria-label="Keluar ke menu">
          ✕ Menu
        </button>
        <div className="flex items-center gap-1" aria-label={`Nyawa ${hearts} dari ${cfg.hearts}`}>
          {Array.from({ length: cfg.hearts }).map((_, i) => (
            <motion.div key={i} animate={i === hearts ? { scale: [1, 1.6, 1], rotate: [0, 20, 0] } : {}}>
              <HeartIcon filled={i < hearts} className="h-9 w-9" />
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <motion.span
              key={streak}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              className="rounded-full border-4 border-ink bg-marker px-3 font-display text-lg"
            >
              🔥 {streak}
            </motion.span>
          )}
          <button
            onClick={onToggleMute}
            className="doodle-btn grid h-11 w-11 place-items-center bg-white text-2xl"
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid flex-1 gap-6 md:grid-cols-[1fr_1.15fr] md:items-center">
        {/* ARENA */}
        <section className="relative flex flex-col items-center" aria-label="Arena monster">
          <div className="doodle-box w-full max-w-sm px-4 py-2">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-xl">{cfg.monsterName}</span>
              <span className="text-lg">
                {hp}/{cfg.monsterHp} HP
              </span>
            </div>
            <div className="mt-1 h-5 overflow-hidden rounded-full border-4 border-ink bg-white">
              <motion.div
                className="hatch h-full bg-marker"
                animate={{ width: `${hpPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>

          <div className="relative mt-3 h-[230px] w-[230px] md:h-[300px] md:w-[300px]">
            <motion.div
              initial={{ scale: 0, y: 140, rotate: -25 }}
              animate={MONSTER_ANIM[anim].animate}
              transition={MONSTER_ANIM[anim].transition}
              className="h-full w-full"
            >
              <Monster kind={cfg.monster} mood={mood} className="h-full w-full" title={cfg.monsterName} />
            </motion.div>

            <AnimatePresence>
              {shots && (
                <motion.div
                  key={shots.id}
                  initial={{ x: -180, y: 170, rotate: -35, opacity: 1 }}
                  animate={{ x: 30, y: 30, rotate: 10 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeIn" }}
                  className="pointer-events-none absolute left-1/4 top-1/4 z-10"
                  onAnimationComplete={() => setShots(null)}
                >
                  <PencilIcon className="h-10 w-28" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {popup && (
                <motion.div
                  key={popup.id}
                  initial={{ y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ y: -70, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute right-2 top-4 z-20 rounded-xl border-4 border-ink bg-marker px-3 py-1 font-display text-2xl shadow-[3px_3px_0_#111]"
                >
                  {popup.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="-mt-2 h-3 w-40 rounded-[50%] bg-ink/20" aria-hidden />
          <p className="mt-3 text-center text-lg text-ink/70">
            Soal {qNo} · {level === "hard" ? "Awas, Raja-nya galak!" : "Ayo kalahkan monsternya!"}
          </p>
        </section>

        {/* SOAL */}
        <section className="doodle-box relative p-5 md:p-7" aria-live="polite">
          {cfg.timer ? (
            <div className="mb-4 h-4 overflow-hidden rounded-full border-4 border-ink bg-white" aria-hidden>
              <div
                className={`h-full ${timeLeft <= 5 ? "bg-bad" : "bg-ok"}`}
                style={{ width: `${(timeLeft / cfg.timer) * 100}%`, transition: "width 0.1s linear" }}
              />
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={qNo}
              initial={{ opacity: 0, x: 40, rotate: 1.5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-center font-display text-2xl md:text-3xl">{q.title}</h2>

              {/* isi soal */}
              <div className="mt-4 flex flex-col items-center gap-2 text-center">
                {q.emoji && (
                  <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-ink bg-marker/60 text-7xl shadow-[4px_4px_0_#111]">
                    <span aria-label={q.kind === "pic2word" ? "gambar soal" : undefined}>{q.emoji}</span>
                  </div>
                )}
                {q.kind === "listen" && (
                  <SpeakButton text={q.speak!} big />
                )}
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
                {q.speak && q.kind !== "listen" && q.kind !== "pic2word" && q.kind !== "id2en" && (
                  <SpeakButton text={q.speak} />
                )}
                {(q.kind === "pic2word" || q.kind === "id2en") && <SpeakButton text={q.speak!} small />}
              </div>

              {/* jawaban */}
              {isSpell ? (
                <div className="mt-5">
                  <div className="flex flex-wrap justify-center gap-2" aria-label="Kotak jawaban">
                    {shownSlots.map((_, pos) => {
                      const tile = slots[pos] !== undefined ? q.options[slots[pos]].value : "";
                      const state =
                        phase === "right" ? "bg-ok" : phase === "wrong" && tile ? "bg-bad" : tile ? "bg-marker" : "bg-white";
                      return (
                        <motion.button
                          key={pos}
                          type="button"
                          onClick={() => tile && removeSlot(pos)}
                          animate={phase === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                          className={`doodle-box grid h-14 w-12 place-items-center font-display text-3xl uppercase md:h-16 md:w-14 md:text-4xl ${state}`}
                          aria-label={tile ? `Huruf ${tile}, ketuk untuk hapus` : "Kotak kosong"}
                        >
                          {tile}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    {q.options.map((o, i) => {
                      const used = slots.includes(i);
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          disabled={used || phase !== "ask"}
                          onClick={() => pickTile(i)}
                          whileTap={{ scale: 0.85 }}
                          animate={{ opacity: used ? 0.2 : 1, y: used ? 8 : 0 }}
                          className="doodle-btn h-14 w-14 bg-white text-3xl uppercase md:h-16 md:w-16 md:text-4xl"
                        >
                          {o.value}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-center">
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
                <div className={`mt-5 grid gap-3 ${q.kind === "listen" || q.options.length === 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {q.options.map((o, i) => {
                    const isAnswer = o.value === q.answer;
                    const state =
                      phase === "ask"
                        ? "bg-white"
                        : isAnswer
                          ? "bg-ok"
                          : picked === o.value
                            ? "bg-bad"
                            : "bg-white opacity-50";
                    return (
                      <motion.button
                        key={o.value + i}
                        type="button"
                        disabled={phase !== "ask"}
                        onClick={() => choose(o.value)}
                        whileTap={{ scale: 0.93 }}
                        animate={phase === "wrong" && picked === o.value ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                        className={`doodle-btn px-3 py-3 ${o.emoji ? "text-6xl" : "text-2xl md:text-3xl"} ${state}`}
                      >
                        {!o.emoji && <span className="mr-2 hidden text-lg opacity-50 md:inline">{i + 1}</span>}
                        {o.emoji ?? o.text}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* umpan balik */}
          <AnimatePresence>
            {phase !== "ask" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-4 border-ink px-4 py-3 ${
                  phase === "right" ? "bg-ok/30" : "bg-bad/20"
                }`}
              >
                <div>
                  <p className="font-display text-2xl">
                    {phase === "right" ? "Yeay, benar! 🎉" : timeLeft <= 0 && cfg.timer ? "Waktu habis! ⏰" : "Ups, belum tepat 😅"}
                  </p>
                  <p className="text-xl">
                    {q.review.emoji} <strong>{q.review.en}</strong> = {q.review.id}
                  </p>
                </div>
                {phase === "wrong" && !ended && (
                  <button onClick={goNext} className="doodle-btn px-6 py-2 text-xl">
                    Lanjut ▶
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  );
}

export function SpeakButton({ text, big, small }: { text: string; big?: boolean; small?: boolean }) {
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported(speechSupported()), []);
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className={`doodle-btn bg-white ${big ? "h-24 w-24 text-5xl" : small ? "px-4 py-1 text-lg" : "px-5 py-1 text-xl"}`}
      aria-label="Dengarkan pengucapan"
    >
      🔊{!big && <span className="ml-1">Dengar</span>}
    </button>
  );
}
