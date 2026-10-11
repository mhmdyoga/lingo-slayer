/* eslint-disable @next/next/no-img-element */
import { BESTIARY, type MKind } from "@/lib/bestiary";

export type Mood = "idle" | "hurt" | "dead";
export type MonsterKind = MKind;

/** Filter SVG sekali di layout: bikin garis terlihat digambar tangan. */
export function DoodleDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <filter id="wobble" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" />
      </filter>
    </svg>
  );
}

const INK = "#111";

/** Monster yang sama persis dengan di dalam game (gambar di public/monsters). */
export function Monster({
  kind,
  mood = "idle",
  className,
  title,
}: {
  kind: MonsterKind;
  mood?: Mood;
  className?: string;
  title?: string;
}) {
  return (
    <img
      src={`/monsters/${kind}-${mood}.png`}
      alt={title ?? BESTIARY[kind].name}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={`${className ?? ""} select-none object-contain object-bottom`}
    />
  );
}

/** Pensil: peluru yang dilempar ke monster. */
export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden>
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        <path d="M8 20 L30 8 L30 32 Z" fill="#f4d2a0" />
        <path d="M8 20 L16 16 L16 24 Z" fill={INK} />
        <rect x="30" y="8" width="66" height="24" fill="#ffe14d" />
        <path d="M44 8 V32 M58 8 V32" strokeWidth={2.5} />
        <rect x="96" y="8" width="10" height="24" fill="#fff" />
        <path d="M106 8 h6 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 h-6 Z" fill="#ff8fa3" />
      </g>
    </svg>
  );
}

export function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        d="M24 4 L30 18 L45 19 L33 29 L37 44 L24 36 L11 44 L15 29 L3 19 L18 18 Z"
        fill={filled ? "#ffe14d" : "#fff"}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path
        d="M24 40 C6 28 2 18 6 11 C10 4 20 5 24 13 C28 5 38 4 42 11 C46 18 42 28 24 40 Z"
        fill={filled ? "#ff4d4d" : "#fff"}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {!filled && <path d="M10 14 L38 34 M38 14 L10 34" stroke={INK} strokeWidth={2.5} />}
    </svg>
  );
}
