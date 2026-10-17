import { useId } from "react";
import {type Palette  } from "@/types/knight/knight"
import { SKIN } from "@/lib/shop";
import { DragonCrest, DragonHorns, DragonPauldron, DragonTabard, DragonTassel } from "./zirah/DragonArmor";
import { RoyalBracer, RoyalCape, RoyalChest, RoyalGreaves, RoyalHelm, RoyalPauldron, RoyalTabard } from "./zirah/RoyalArmor";
import { IceCrystalBracer, IceCrystalBrow, IceCrystalBuckle, IceCrystalChest, IceCrystalCrest, IceCrystalGreaves, IceCrystalHorns, IceCrystalPauldron, IceCrystalTabard } from "./zirah/CrystalArmor";

export const INK = "#1b1b1b"; // atau pakai konstanta INK milikmu
const DEF: Palette = SKIN[0].pal
export type KnightPartName = "legL" | "legR" | "body" | "armL" | "armR";


export function PineTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 120" className={className} aria-hidden overflow="visible">
      {/* bayangan tanah */}
      <ellipse cx="46" cy="117" rx="26" ry="3.5" fill="#000" opacity="0.18" />

      <g className="ink" stroke={INK} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
        {/* batang */}
        <path d="M39 117 L41 86 L51 86 L53 117 Z" fill="#8B5E34" />
        <path d="M47 86 L51 86 L53 117 L47 117 Z" fill="#5E3C1E" stroke="none" />
        <path d="M43 108 l0 -8 M44 96 l0 -6" fill="none" stroke="#3E2812" strokeWidth={2} />

        {/* tingkat bawah */}
        <path
          d="M8 94 L45 50 L82 94 L68 89 L56 95 L45 89 L34 95 L22 89 Z"
          fill="#2F8F4E"
        />
        <path
          d="M45 50 L82 94 L68 89 L56 95 L45 89 Z"
          fill="#1F6B3A"
          stroke="none"
        />

        {/* tingkat tengah */}
        <path
          d="M14 72 L45 30 L76 72 L64 67 L54 73 L45 67 L36 73 L26 67 Z"
          fill="#35A058"
        />
        <path
          d="M45 30 L76 72 L64 67 L54 73 L45 67 Z"
          fill="#237A42"
          stroke="none"
        />

        {/* tingkat atas */}
        <path
          d="M24 52 L45 8 L66 52 L57 47 L45 53 L33 47 Z"
          fill="#3CB063"
        />
        <path d="M45 8 L66 52 L57 47 L45 53 Z" fill="#2A8A4B" stroke="none" />

        {/* highlight sisi kiri */}
        <g fill="none" stroke="#7FD99A" strokeWidth={2.5}>
          <path d="M42 16 L31 42" />
          <path d="M40 38 L24 64" />
          <path d="M40 60 L16 86" />
        </g>

        {/* detail ranting */}
        <g fill="none" stroke="#17512C" strokeWidth={2}>
          <path d="M36 80 q6 4 12 0" />
          <path d="M54 82 q6 3 12 -1" />
          <path d="M38 58 q6 3 10 0" />
          <path d="M46 36 q4 3 8 0" />
        </g>
      </g>

      {/* salju tipis di ujung (opsional, hapus kalau tidak perlu) */}
      <g fill="#fff" stroke={INK} strokeWidth={2}>
        <path d="M40 20 L45 8 L50 20 L47 18 L45 21 L43 18 Z" />
      </g>
    </svg>
  );
}

export function Rock({ className }: { className?: string }) {
  const clipId = "rock-clip-" + useId().replace(/:/g, "");

  const body = "M6 46 C0 30 14 12 34 10 C54 6 76 22 74 46 Z";

  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden overflow="visible">
      <defs>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
      </defs>

      {/* bayangan tanah */}
      <ellipse cx="42" cy="48" rx="36" ry="3.2" fill="#000" opacity="0.18" />

      {/* kerikil kecil */}
      <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
        <path d="M76 47 C76 42 84 41 87 45 C88 47 88 48 88 48 L76 48 Z" fill="#A9A9B3" />
        <path d="M-6 48 C-6 44 -1 43 2 45 C4 46 4 48 4 48 Z" fill="#9A9AA4" />
      </g>

      {/* batu utama: dasar + outline */}
      <path
        d={body}
        fill="#9C9CA8"
        stroke={INK}
        strokeWidth={4.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* shading, facet, tekstur (dipotong mengikuti bentuk batu) */}
      <g clipPath={`url(#${clipId})`}>
        {/* sisi gelap bawah & kanan */}
        <ellipse cx="46" cy="52" rx="48" ry="14" fill="#6E6E7C" />
        <path d="M50 8 C68 14 78 28 76 48 L56 48 C60 34 58 20 50 8 Z" fill="#7F7F8E" />

        {/* highlight kiri atas */}
        <ellipse cx="26" cy="20" rx="16" ry="8" fill="#C9C9D4" />
        <ellipse cx="22" cy="18" rx="8" ry="4" fill="#E2E2EA" />

        {/* facet / bidang pecahan */}
        <path d="M14 40 L26 26 L40 30 L36 46 Z" fill="#8A8A98" />
        <path d="M40 30 L52 24 L58 36 L50 46 L36 46 Z" fill="#767684" />
        <path d="M26 26 L34 14 L48 12 L40 30 Z" fill="#B4B4C0" />

        {/* garis facet */}
        <g fill="none" stroke="#4B4B58" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 40 L26 26 L34 14" />
          <path d="M26 26 L40 30 L52 24" />
          <path d="M40 30 L36 46" />
          <path d="M52 24 L58 36 L50 46" />
        </g>

        {/* retakan */}
        <g fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 36 l-4 4 l3 4 l-3 4" />
          <path d="M18 34 l5 2 l-1 5" />
        </g>

        {/* lumut di bagian atas */}
        <path
          d="M30 12 C36 8 44 8 50 11 C52 14 48 16 46 15 C44 18 40 17 38 15 C35 17 31 16 30 12 Z"
          fill="#6DB34F"
        />
        <path d="M34 11 C38 9 44 9 47 11 C44 12 38 12 34 11 Z" fill="#9AD66F" />

        {/* bintik pori / granit */}
        <g fill="#4B4B58" opacity="0.65">
          <circle cx="30" cy="38" r="0.9" />
          <circle cx="44" cy="38" r="1" />
          <circle cx="62" cy="30" r="0.9" />
          <circle cx="20" cy="44" r="0.8" />
          <circle cx="52" cy="42" r="0.9" />
          <circle cx="66" cy="40" r="0.8" />
        </g>
        <g fill="#E8E8F0" opacity="0.7">
          <circle cx="28" cy="22" r="0.8" />
          <circle cx="38" cy="18" r="0.7" />
          <circle cx="16" cy="32" r="0.7" />
        </g>
      </g>

      {/* outline diulang di atas supaya tetap tegas */}
      <path
        d={body}
        fill="none"
        stroke={INK}
        strokeWidth={4.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 100" className={className} aria-hidden>
      <g className="ink" stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M30 86 C4 86 4 54 30 52 C30 24 68 18 84 38 C96 12 142 14 150 44 C182 36 204 62 184 86 Z"
          fill="#fff"
        />
        <path d="M50 70 q14 -8 28 0 M116 66 q12 -6 24 0" fill="none" strokeWidth={3} />
      </g>
    </svg>
  );
}

export function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden>
      <g className="ink" stroke={INK} strokeWidth={5} strokeLinecap="round">
        <g style={{ transformOrigin: "80px 80px", animation: "spin 40s linear infinite" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d="M80 6 L80 24" transform={`rotate(${i * 30} 80 80)`} />
          ))}
        </g>
        <circle cx="80" cy="80" r="38" fill="#ffe14d" />
        <path d="M66 74 q4 -6 8 0 M90 74 q4 -6 8 0" fill="none" strokeWidth={4} />
        <path d="M68 92 q12 12 24 0" fill="none" strokeWidth={4} />
      </g>
    </svg>
  );
}

/** Pensil kecil yang jadi karakter pemain di peta. */
export function PencilHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 170" className={className} aria-hidden overflow="visible">
      <g className="ink" stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 38 H64 V128 H16 Z" fill="#ffe14d" />
        <path d="M16 128 L40 166 L64 128 Z" fill="#f4d2a0" />
        <path d="M32 152 L40 166 L48 152 Z" fill={INK} />
        <rect x="16" y="22" width="48" height="16" fill="#fff" />
        <path d="M16 22 C16 4 64 4 64 22 Z" fill="#ff8fa3" />
        <path d="M30 38 V128 M50 38 V128" strokeWidth={2.5} opacity={0.35} fill="none" />
      </g>
      <g stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none">
        <circle cx="31" cy="72" r="5" fill={INK} />
        <circle cx="50" cy="72" r="5" fill={INK} />
        <path d="M30 92 Q40 104 52 92" />
      </g>
    </svg>
  );
}

export function Knight({ className, pal = DEF }: { className?: string; pal?: Palette }) {
  const dragon = pal.deco === "dragon";
  const ice = pal.deco === "ice";
  const royal = pal.deco === "royal";
  return (
    <svg viewBox="0 0 120 190" className={className} aria-hidden overflow="visible">
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        {/* jubah (paling belakang) */}
        {royal && <RoyalCape />}
        {/* jambul */}
        {dragon ? (
          <DragonCrest pal={pal} />
        ) : ice ? (
          <IceCrystalCrest pal={pal} />
        ) : royal ? null : (
          <>
            <path d="M60 22 C44 6 52 -8 72 -2 C86 2 88 14 76 22 C70 16 66 18 60 22 Z" fill={pal.plume} />
            <path d="M60 22 C52 12 58 4 70 4 C66 10 66 16 60 22 Z" fill={pal.plume2} />
          </>
        )}
        {/* kaki */}
        <path d="M40 126 H58 V170 H38 Z" fill={pal.dark} />
        <path d="M62 126 H80 V170 H82 Z" fill={pal.dark} />
        <path d="M32 168 H59 V184 H26 Z" fill={pal.light} />
        <path d="M61 168 H88 V184 H94 Z" fill={pal.light} />
        <path d="M40 140 H58 M62 140 H80" stroke={pal.light} strokeWidth={3} fill="none" />
        {ice && <IceCrystalGreaves pal={pal} side={-1} />}
        {ice && <IceCrystalGreaves pal={pal} side={1} />}
        {royal && <RoyalGreaves side={-1} />}
        {royal && <RoyalGreaves side={1} />}
        {/* lengan */}
        <rect x="14" y="88" width="16" height="38" rx="7" fill={pal.mid} />
        <rect x="90" y="88" width="16" height="38" rx="7" fill={pal.mid} />
        <circle cx="22" cy="132" r="9" fill={royal ? pal.dark : pal.light} />
        <circle cx="98" cy="132" r="9" fill={royal ? pal.dark : pal.light} />
        {ice && <IceCrystalBracer pal={pal} side={-1} />}
        {ice && <IceCrystalBracer pal={pal} side={1} />}
        {royal && <RoyalBracer side={-1} />}
        {royal && <RoyalBracer side={1} />}
        {/* badan */}
        <path d="M34 78 H86 L82 124 H38 Z" fill={pal.body} />
        {dragon ? (
          <DragonTabard pal={pal} />
        ) : ice ? (
          <IceCrystalChest pal={pal} />
        ) : royal ? (
          <RoyalChest />
        ) : (
          <path d="M60 82 V120 M46 90 Q60 100 74 90" fill="none" strokeWidth={2.5} />
        )}
        <rect x="36" y="116" width="48" height="11" rx="2" fill={pal.trim ?? "#8a5a2b"} />
        {ice ? <IceCrystalBuckle pal={pal} /> : royal ? null : <rect x="55" y="117" width="10" height="9" fill={pal.plume2} strokeWidth={2.5} />}
        {dragon && <DragonTassel />}
        {ice && <IceCrystalTabard pal={pal} />}
        {royal && <RoyalTabard />}
        {/* bahu */}
        <circle cx="28" cy="84" r="16" fill={pal.shoulder ?? pal.light} />
        <circle cx="92" cy="84" r="16" fill={pal.shoulder ?? pal.light} />
        {dragon && <DragonPauldron pal={pal} side={-1} />}
        {dragon && <DragonPauldron pal={pal} side={1} />}
        {ice && <IceCrystalPauldron pal={pal} side={-1} />}
        {ice && <IceCrystalPauldron pal={pal} side={1} />}
        {royal && <RoyalPauldron side={-1} />}
        {royal && <RoyalPauldron side={1} />}
        {!royal && <path d="M20 80 q6 -6 12 -2 M84 78 q6 -4 12 2" fill="none" stroke="#fff" strokeWidth={3} />}
        {/* leher & helm */}
        <ellipse cx="60" cy="74" rx="22" ry="8" fill={pal.mid} />
        {dragon && <DragonHorns pal={pal} />}
        {ice && <IceCrystalHorns pal={pal} />}
        <path d="M36 46 C36 18 84 18 84 46 V62 C84 74 36 74 36 62 Z" fill={pal.helm ?? pal.light} />
        {ice && <IceCrystalBrow pal={pal} />}
        <rect x="42" y="38" width="36" height="16" rx="5" fill="#2b2f36" />
        <path d="M51 38 V54 M60 38 V54 M69 38 V54" stroke={pal.light} strokeWidth={2.5} fill="none" />
        {!royal && <path d="M44 30 q8 -8 20 -8" fill="none" stroke="#fff" strokeWidth={3} />}
        {royal && <RoyalHelm />}
      </g>
    </svg>
  );
}
 
/** Satu bagian ksatria (viewBox sama dengan <Knight/>), dipakai untuk animasi di canvas. */
export function KnightPart({ part, pal = DEF }: { part: KnightPartName; pal?: Palette }) {
  const dragon = pal.deco === "dragon";
  const ice = pal.deco === "ice";
  const royal = pal.deco === "royal";
  return (
    <svg viewBox="0 0 120 190" aria-hidden overflow="visible">
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        {part === "legL" && (
          <>
            <path d="M40 124 H58 V170 H38 Z" fill={pal.dark} />
            <path d="M32 168 H59 V184 H26 Z" fill={pal.light} />
            <path d="M40 140 H58" stroke={pal.light} strokeWidth={3} fill="none" />
            {ice && <IceCrystalGreaves pal={pal} side={-1} />}
            {royal && <RoyalGreaves side={-1} />}
          </>
        )}
        {part === "legR" && (
          <>
            <path d="M62 124 H80 V170 H82 Z" fill={pal.dark} />
            <path d="M61 168 H88 V184 H94 Z" fill={pal.light} />
            <path d="M62 140 H80" stroke={pal.light} strokeWidth={3} fill="none" />
            {ice && <IceCrystalGreaves pal={pal} side={1} />}
            {royal && <RoyalGreaves side={1} />}
          </>
        )}
        {part === "body" && (
          <>
            {royal && <RoyalCape />}
            {dragon ? (
              <DragonCrest pal={pal} />
            ) : ice ? (
              <IceCrystalCrest pal={pal} />
            ) : royal ? null : (
              <>
                <path d="M60 22 C44 6 52 -8 72 -2 C86 2 88 14 76 22 C70 16 66 18 60 22 Z" fill={pal.plume} />
                <path d="M60 22 C52 12 58 4 70 4 C66 10 66 16 60 22 Z" fill={pal.plume2} />
              </>
            )}
            <path d="M34 78 H86 L82 128 H38 Z" fill={pal.body} />
            {dragon ? (
              <DragonTabard pal={pal} />
            ) : ice ? (
              <IceCrystalChest pal={pal} />
            ) : royal ? (
              <RoyalChest />
            ) : (
              <path d="M60 82 V120 M46 90 Q60 100 74 90" fill="none" strokeWidth={2.5} />
            )}
            <rect x="36" y="116" width="48" height="11" rx="2" fill={pal.trim ?? "#8a5a2b"} />
            {ice ? <IceCrystalBuckle pal={pal} /> : royal ? null : <rect x="55" y="117" width="10" height="9" fill={pal.plume2} strokeWidth={2.5} />}
            {dragon && <DragonTassel />}
            {ice && <IceCrystalTabard pal={pal} />}
            {royal && <RoyalTabard />}
            <ellipse cx="60" cy="74" rx="22" ry="8" fill={pal.mid} />
            {dragon && <DragonHorns pal={pal} />}
            {ice && <IceCrystalHorns pal={pal} />}
            <path d="M36 46 C36 18 84 18 84 46 V62 C84 74 36 74 36 62 Z" fill={pal.helm ?? pal.light} />
            {ice && <IceCrystalBrow pal={pal} />}
            <rect x="42" y="38" width="36" height="16" rx="5" fill="#2b2f36" />
            <path d="M51 38 V54 M60 38 V54 M69 38 V54" stroke={pal.light} strokeWidth={2.5} fill="none" />
            {!royal && <path d="M44 30 q8 -8 20 -8" fill="none" stroke="#fff" strokeWidth={3} />}
            {royal && <RoyalHelm />}
          </>
        )}
        {part === "armL" && (
          <>
            <rect x="14" y="88" width="16" height="38" rx="7" fill={pal.mid} />
            {dragon && <path d="M14 106 H30" stroke={pal.plume} strokeWidth={4} />}
            <circle cx="22" cy="132" r="9" fill={royal ? pal.dark : pal.light} />
            {ice && <IceCrystalBracer pal={pal} side={-1} />}
            {royal && <RoyalBracer side={-1} />}
            <circle cx="28" cy="84" r="16" fill={pal.shoulder ?? pal.light} />
            {dragon && <DragonPauldron pal={pal} side={-1} />}
            {ice && <IceCrystalPauldron pal={pal} side={-1} />}
            {royal && <RoyalPauldron side={-1} />}
            {!royal && <path d="M20 80 q6 -6 12 -2" fill="none" stroke="#fff" strokeWidth={3} />}
          </>
        )}
        {part === "armR" && (
          <>
            <rect x="90" y="88" width="16" height="38" rx="7" fill={pal.mid} />
            {dragon && <path d="M90 106 H106" stroke={pal.plume} strokeWidth={4} />}
            <circle cx="98" cy="132" r="9" fill={royal ? pal.dark : pal.light} />
            {ice && <IceCrystalBracer pal={pal} side={1} />}
            {royal && <RoyalBracer side={1} />}
            <circle cx="92" cy="84" r="16" fill={pal.shoulder ?? pal.light} />
            {dragon && <DragonPauldron pal={pal} side={1} />}
            {ice && <IceCrystalPauldron pal={pal} side={1} />}
            {royal && <RoyalPauldron side={1} />}
            {!royal && <path d="M84 78 q6 -4 12 2" fill="none" stroke="#fff" strokeWidth={3} />}
          </>
        )}
      </g>
    </svg>
  );
}