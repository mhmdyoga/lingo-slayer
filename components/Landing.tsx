"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Monster, type MonsterKind } from "./Monsters";
import { Knight } from "./Scenery";
import { LEVELS, LEVEL_ORDER } from "@/lib/questions";
import RotatingText from "./fragments/rotatingText";
import {Modak} from "next/font/google"



gsap.registerPlugin(ScrollTrigger);
 const Modaks = Modak({
  variable: "--font-modak",
  subsets: ["latin"],
  weight: ["400"],
});

const CROWD: { kind: MonsterKind; left: number; size: number; rot: number; flip: boolean; layer: 0 | 1 }[] = [
  { kind: "wispal", left: -4, size: 21, rot: -8, flip: false, layer: 0 },
  { kind: "rocky", left: 9, size: 17, rot: 6, flip: true, layer: 1 },
  { kind: "magma", left: 21, size: 20, rot: -4, flip: false, layer: 0 },
  { kind: "frostborn", left: 34, size: 19, rot: 5, flip: false, layer: 1 },
  { kind: "venomspine", left: 45, size: 18, rot: -6, flip: true, layer: 0 },
  { kind: "treetank", left: 56, size: 21, rot: 4, flip: true, layer: 1 },
  { kind: "lurker", left: 68, size: 18, rot: -5, flip: false, layer: 0 },
  { kind: "sandrex", left: 79, size: 20, rot: 7, flip: false, layer: 1 },
  { kind: "boulderback", left: 90, size: 17, rot: -7, flip: true, layer: 0 },
];

const TICKER = [
  "CAT 🐱", "APPLE 🍎", "BOOK 📖", "EYE 👁️", "MOTHER 👩", "FISH 🐟", "CHAIR 🪑", "NOSE 👃",
  "BANANA 🍌", "TEACHER 🧑‍🏫", "ELEPHANT 🐘", "UMBRELLA ☂️",
];

const STEPS = [
  {
    n: "1",
    title: "Jelajahi & cari",
    body: "Jalan di dunia luas pakai WASD atau panah. Ikuti panah dan peta mini untuk menemukan monster.",
    art: <span className="text-6xl">🗺️</span>,
  },
  {
    n: "2",
    title: "Tebas pakai Spasi",
    body: "Ksatria berzirahmu menebas monster dengan pedang. Hati-hati, monster yang menyentuhmu bikin nyawa berkurang.",
    art: <Knight className="h-24 w-16" />,
  },
  {
    n: "3",
    title: "Jawab quest Inggris",
    body: "Monster kalah, quest muncul: susun huruf, susun kalimat, tebak gambar. Jawab benar untuk XP dan naik level!",
    art: (
      <span className="flex gap-2">
        {["C", "A", "T"].map((l) => (
          <span key={l} className="doodle-box grid h-14 w-12 place-items-center font-display text-3xl">
            {l}
          </span>
        ))}
      </span>
    ),
  },
];

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // intro judul
      gsap.from(".hero-char", {
        yPercent: 120,
        rotate: () => gsap.utils.random(-25, 25),
        opacity: 0,
        duration: reduce ? 0 : 0.9,
        ease: "back.out(2)",
        stagger: 0.035,
      });
      gsap.from(".hero-fade", { opacity: 0, y: 24, duration: reduce ? 0 : 0.7, delay: 0.7, stagger: 0.12 });
      gsap.from(".crowd-item", {
        yPercent: 70,
        opacity: 0,
        duration: reduce ? 0 : 1,
        ease: "elastic.out(1, 0.7)",
        stagger: { each: 0.07, from: "random" },
        delay: 0.3,
      });

      // kata yang berganti
      if (!reduce) {
        const words = gsap.utils.toArray<HTMLElement>(".swap-word");
        gsap.set(words, { yPercent: 110 });
        const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
        words.forEach((w) => {
          tl.to(w, { yPercent: 0, duration: 0.6, ease: "back.out(1.7)" })
            .to(w, { yPercent: -110, duration: 0.45, ease: "power2.in" }, "+=1.5");
        });
      } else {
        gsap.set(".swap-word:not(:first-child)", { display: "none" });
      }

      // reveal saat scroll
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) => {
        gsap.from(el, {
          y: 70,
          opacity: 0,
          rotate: i % 2 ? 3 : -3,
          duration: reduce ? 0 : 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // parallax kerumunan saat scroll
      gsap.to(".crowd-layer-0", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".crowd-layer-1", {
        yPercent: -28,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // parallax mouse
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine && !reduce) {
        const q0 = gsap.quickTo(".mouse-0", "x", { duration: 0.9, ease: "power3" });
        const q1 = gsap.quickTo(".mouse-1", "x", { duration: 0.9, ease: "power3" });
        const move = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          q0(nx * -30);
          q1(nx * 50);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const split = (text: string) =>
    text.split("").map((c, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom">
        <span className="hero-char inline-block">{c === " " ? " " : c}</span>
      </span>
    ));

  return (
    <div ref={root}>
      {/* HERO */}
      <header className="hero relative flex min-h-svh flex-col items-center overflow-hidden border-t-2 border-ink">
         <div className="top-0 md:top-12 lg:top-2 absolute left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
            <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
              Hello
            </span>
          </div>

        <h1 className={`font-extrabold mt-40 text-3xl md:text-5xl lg:text-9xl text-black text-center ${Modaks.className}`}>
          <span className="block">{split("LET'S BEAT")}</span>
         <RotatingText
              texts={["MONSTERS", "SPELLING", "ENGLISH", "BOREDOM"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-marker text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              splitBy="characters"
              auto
              loop
            />
        </h1>

        <div className="relative z-20 mt-4 flex flex-col items-center gap-5 px-4 text-center">
          <p className="hero-fade max-w-xl text-sm text-black bg-marker rounded-full p-4 md:text-2xl">
           Game petualangan ksatria untuk anak SD. Jelajahi dunia, tebas monster, lalu taklukkan quest bahasa Inggris!
          </p>
          <div className="hero-fade flex flex-wrap justify-center gap-4">
            <Link href="/play" className="doodle-btn px-8 py-4 text-2xl md:text-3xl">
              MAIN SEKARANG ▶
            </Link>
            <a href="#cara-main" className="doodle-btn bg-white px-6 py-4 text-xl md:text-2xl">
              Cara main
            </a>
            <Link href="/arena" className="doodle-btn bg-white px-6 py-4 text-xl md:text-2xl">
              Mode Arena
            </Link>
          </div>
        </div>

        {/* kerumunan monster */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46svh]" aria-hidden>
          {[0, 1].map((layer) => (
            <div key={layer} className={`crowd-layer-${layer} absolute inset-0`}>
              <div className={`mouse-${layer} absolute inset-0`}>
                {CROWD.filter((c) => c.layer === layer).map((c, i) => (
                  <div
                    key={i}
                    className="crowd-item pointer-events-auto absolute"
                    style={{
                      left: `${c.left}%`,
                      bottom: layer === 0 ? "-6%" : "-14%",
                      width: `${c.size}vw`,
                      minWidth: 120,
                      zIndex: layer,
                    }}
                  >
                    <motion.div
                      style={{ rotate: c.rot, scaleX: c.flip ? -1 : 1 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ y: -26, rotate: c.rot + 8, transition: { type: "spring", stiffness: 300 } }}
                    >
                      <Monster kind={c.kind} className="w-full" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* TICKER */}
      <div className="overflow-hidden border-y-4 border-ink bg-ink py-3 text-paper" aria-hidden>
        <div className="marquee font-display text-3xl">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {TICKER.map((t) => (
                <span key={t + k} className="mx-6 whitespace-nowrap">
                  {t} <span className="text-marker">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CARA MAIN */}
      <section id="cara-main" className="mx-auto max-w-6xl px-5 py-24">
        <h2 data-reveal className="font-display text-5xl md:text-7xl">
          CARA <span className="bg-marker px-2">MAINNYA</span>
        </h2>
        <p data-reveal className="mt-3 max-w-xl text-xl text-ink/70">
          Jelajah, tebas, jawab. Cocok buat kelas 1 sampai 6, dan quest-nya makin sulit seiring naik level.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <article
              key={s.n}
              data-reveal
              className="doodle-box relative flex flex-col items-center gap-4 p-6 pt-10 text-center"
              style={{ rotate: `${(i - 1) * 2}deg` }}
            >
              <span className="absolute -top-6 left-4 grid h-12 w-12 place-items-center rounded-full border-4 border-ink bg-marker font-display text-2xl shadow-[3px_3px_0_#111]">
                {s.n}
              </span>
              <div className="grid h-24 place-items-center">{s.art}</div>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="text-lg text-ink/75">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* MONSTER */}
      <section className="border-y-4 border-ink bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 data-reveal className="font-display text-5xl md:text-7xl">
            KENALAN SAMA <span className="bg-marker px-2">MONSTERNYA</span>
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {LEVEL_ORDER.map((id) => {
              const lv = LEVELS[id];
              return (
                <motion.article
                  key={id}
                  data-reveal
                  whileHover={{ y: -8, rotate: 1.5 }}
                  className="doodle-box flex flex-col items-center p-6 text-center"
                >
                  <Monster kind={lv.monster} className="h-52 w-52" title={lv.monsterName} />
                  <h3 className="mt-2 font-display text-3xl">{lv.monsterName}</h3>
                  <p className="mt-1 inline-block rounded-full border-2 border-ink bg-marker px-3 text-lg">
                    {lv.label} · {lv.grade}
                  </p>
                  <p className="mt-3 text-lg text-ink/75">{lv.blurb}</p>
                  <p className="mt-2 text-base text-ink/60">
                    {"♥".repeat(lv.hearts)} nyawa · {lv.timer ? `${lv.timer} detik/soal` : "tanpa batas waktu"}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOPIK + CTA */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h2 data-reveal className="font-display text-4xl md:text-6xl">KATA APA YANG DIPELAJARI?</h2>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-4 text-xl">
          {["🐶 Hewan", "🍎 Buah & makanan", "🎒 Benda sekolah", "👃 Anggota tubuh", "👩 Keluarga"].map((t) => (
            <span key={t} className="doodle-box px-5 py-2">
              {t}
            </span>
          ))}
        </div>
        <div data-reveal className="mt-14">
          <Link href="/play" className="doodle-btn px-10 py-5 text-3xl md:text-4xl">
            AYO KALAHKAN MONSTER!
          </Link>
        </div>
      </section>

      <footer className="border-t-4 border-ink bg-ink px-5 py-8 text-center text-paper">
        <p className="font-display text-2xl">Blejar English!</p>
        <p className="mt-1 text-base opacity-70">Belajar bahasa Inggris sambil main dan Seru seruan.</p>
      </footer>
    </div>
  );
}
