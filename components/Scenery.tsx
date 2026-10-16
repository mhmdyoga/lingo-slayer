import { useId } from "react";
import {type Palette  } from "@/types/knight/knight"
import { SKIN } from "@/lib/shop";

const INK = "#1b1b1b"; // atau pakai konstanta INK milikmu
const DEF: Palette = SKIN[0].pal
const RED = "#c1272d";
export type KnightPartName = "legL" | "legR" | "body" | "armL" | "armR";
const GOLD = "#f2b824";
const GOLD_HI = "#ffe58a";
const GOLD_DK = "#b9800f";
const RUBY = "#d7263d";
const RUBY_HI = "#ff8080";
const CAPE = "#a31d2a";
const CAPE_DK = "#6e1019";
 
const mir = (side: 1 | -1) => (x: number) => (side === -1 ? x : 120 - x);
 


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



/* ---- hiasan struktural Zirah Naga Api (dipakai Knight & KnightPart) ---- */
function DragonCrest({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M44 28 C40 16 48 12 46 2 C54 8 56 14 54 22 C56 10 58 4 60 -8 C66 0 70 10 66 24 C70 16 74 10 74 2 C84 12 82 24 76 28 Z" fill={pal.plume} />
      <path d="M54 26 C52 18 58 14 60 6 C64 14 68 20 66 26 Z" fill={pal.plume2} strokeWidth={0} />
    </>
  );
}
function DragonHorns({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M38 44 C26 40 22 26 28 12 C32 24 40 30 46 34 Z" fill={pal.trim} />
      <path d="M82 44 C94 40 98 26 92 12 C88 24 80 30 74 34 Z" fill={pal.trim} />
    </>
  );
}
function DragonTabard({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M46 80 H74 L70 120 H50 Z" fill={RED} />
      <path d="M60 114 C52 106 58 100 56 92 C62 96 68 102 64 110 C66 108 67 106 66 104 C70 110 68 114 60 114 Z" fill={pal.plume2} strokeWidth={2} />
    </>
  );
}
function DragonTassel() {
  return <path d="M47 127 H73 L69 158 L60 150 L51 158 Z" fill={RED} />;
}
/** Bahu berduri seperti kepala naga. side: -1 kiri, 1 kanan */
function DragonPauldron({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  return (
    <>
      <path d={`M${m(16)} 76 L${m(4)} 66 L${m(20)} 70 Z`} fill={pal.trim} />
      <path d={`M${m(20)} 70 L${m(14)} 54 L${m(28)} 66 Z`} fill={pal.trim} />
      <path d={`M${m(28)} 70 C${m(22)} 62 ${m(30)} 60 ${m(28)} 52 C${m(36)} 58 ${m(36)} 66 ${m(32)} 70 Z`} fill={pal.plume} />
    </>
  );
}

function Crystal({ x, y, w, h, r = 0, pal, sw = 3 }: { x: number; y: number; w: number; h: number; r?: number; pal: Palette; sw?: number }) {
  const a = w / 2;
  const b = a * 1.12;
  const s = -h * 0.58;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`} strokeWidth={sw}>
      <path d={`M${-a} 0 L${-b} ${s} L0 ${-h} L${b} ${s} L${a} 0 Z`} fill={pal.plume} />
      <path d={`M${-a} 0 L${-b} ${s} L0 ${-h} L0 0 Z`} fill={pal.plume2} stroke="none" />
      <path d={`M${a * 0.15} ${-h * 0.2} L${b * 0.9} ${s * 0.9} L${a} 0 L${a * 0.15} 0 Z`} fill="#000" opacity={0.16} stroke="none" />
      <path d={`M0 ${-h} L0 0`} fill="none" stroke={pal.plume} strokeWidth={sw * 0.5} />
      <path d={`M${-a * 0.55} ${-h * 0.2} L${-b * 0.72} ${s * 0.9}`} fill="none" stroke="#fff" strokeWidth={sw * 0.7} />
      <path d={`M${-a} 0 L${-b} ${s} L0 ${-h} L${b} ${s} L${a} 0 Z`} fill="none" />
    </g>
  );
}
 
/** Permata belah ketupat berfaset. */
function Gem({ cx, cy, hw, hh, pal, sw = 3 }: { cx: number; cy: number; hw: number; hh: number; pal: Palette; sw?: number }) {
  const d = `M${cx} ${cy - hh} L${cx + hw} ${cy} L${cx} ${cy + hh} L${cx - hw} ${cy} Z`;
  return (
    <g strokeWidth={sw}>
      <path d={d} fill={pal.plume} />
      <path d={`M${cx} ${cy - hh} L${cx - hw} ${cy} L${cx} ${cy} Z`} fill={pal.plume2} stroke="none" />
      <path d={`M${cx} ${cy} L${cx + hw} ${cy} L${cx} ${cy + hh} Z`} fill="#000" opacity={0.18} stroke="none" />
      <path d={`M${cx - hw * 0.5} ${cy - hh * 0.2} L${cx - hw * 0.2} ${cy - hh * 0.55}`} fill="none" stroke="#fff" strokeWidth={sw * 0.7} />
      <path d={d} fill="none" />
    </g>
  );
}
 
/** Nyala api biru di atas helm + pecahan kristal di pangkalnya. */
function IceCrystalCrest({ pal }: { pal: Palette }) {
  const flame = "M43 30 C35 25 35 15 41 9 C41 15 45 17 47 15 C43 7 46 -3 53 -9 C52 -2 56 1 59 -2 C58 -12 63 -21 71 -27 C70 -17 77 -11 77 -1 C81 2 83 9 80 17 C79 24 75 28 71 30 Z";
  const tongue = "M52 30 C47 22 51 13 56 7 C57 12 61 13 62 9 C66 14 68 21 66 27 C65 29 63 30 62 30 Z";
  return (
    <>
      {/* nyala berlapis: biru -> biru muda -> putih */}
      <path d={flame} fill={pal.plume} />
      <g transform="translate(60 31) scale(0.72) translate(-60 -31)">
        <path d={flame} fill={pal.plume2} strokeWidth={0} />
      </g>
      <path d={tongue} fill="#f2fbff" strokeWidth={0} />
      {/* dua percikan es saja */}
      <g fill={pal.plume2} strokeWidth={1.8}>
        <path d="M35 -2 l2.6 3.6 l-2.6 3.6 l-2.6 -3.6 Z" />
        <path d="M85 -12 l2.2 3 l-2.2 3 l-2.2 -3 Z" />
      </g>
    </>
  );
}
 
/** Pecahan kristal di sisi helm, mencuat seperti tanduk (digambar sebelum helm). */
function IceCrystalHorns({ pal }: { pal: Palette }) {
  const m = (x: number) => 120 - x;
  return (
    <>
      <Crystal x={40} y={40} w={10} h={24} r={-34} pal={pal} sw={3} />
      <Crystal x={m(40)} y={40} w={10} h={24} r={34} pal={pal} sw={3} />
    </>
  );
}
 
/** Permata dahi + garis punggung helm (digambar setelah helm). */
function IceCrystalBrow({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M52 34 L60 22 L68 34 Z" fill={pal.light} />
      <Gem cx={60} cy={29} hw={6.5} hh={9.5} pal={pal} sw={2.6} />
      <path d="M42 37 q4 -9 11 -12 M78 37 q-4 -9 -11 -12" fill="none" stroke="#fff" strokeWidth={2.4} />
    </>
  );
}
 
/** Pelat dada + permata besar di tengah. */
function IceCrystalChest({ pal }: { pal: Palette }) {
  return (
    <>
      {/* bingkai + permata besar di tengah dada */}
      <path d="M60 80 L74 98 L60 118 L46 98 Z" fill={pal.light} />
      <Gem cx={60} cy={98} hw={10} hh={16} pal={pal} sw={2.6} />
    </>
  );
}
 
/** Gesper ikat pinggang berbentuk permata. */
function IceCrystalBuckle({ pal }: { pal: Palette }) {
  return <Gem cx={60} cy={121.5} hw={8} hh={9.5} pal={pal} sw={2.6} />;
}
 
/** Kain pinggang biru berpola belah ketupat + kristal di ujung. */
function IceCrystalTabard({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M47 127 H73 L71 149 L67 154 L65 161 L60 169 L55 161 L53 154 L49 149 Z" fill={pal.plume} />
      <path d="M60 127 H73 L71 149 L67 154 L65 161 L60 169 Z" fill="#000" opacity={0.2} stroke="none" />
      <path d="M60 133 L66 146 L60 159 L54 146 Z" fill="none" stroke={pal.plume2} strokeWidth={2.2} />
    </>
  );
}
 
/** Bahu berduri kristal. side: -1 kiri, 1 kanan */
function IceCrystalPauldron({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  const r = (a: number) => (side === -1 ? a : -a);
  return (
    <>
      {/* satu kristal utama condong keluar, satu tegak di atas bantalan, satu kecil di luar */}
      <Crystal x={m(20)} y={77} w={14} h={30} r={r(-36)} pal={pal} sw={3} />
      <Crystal x={m(29)} y={72} w={10} h={19} r={r(-4)} pal={pal} sw={2.8} />
      <Crystal x={m(14)} y={85} w={9} h={14} r={r(-76)} pal={pal} sw={2.6} />
      {/* satu garis biru di bawah bantalan sebagai aksen */}
      <path d={`M${m(15)} 91 Q${m(28)} 101 ${m(41)} 91`} fill="none" stroke={pal.plume} strokeWidth={3} />
    </>
  );
}
 
/** Pelindung lengan bawah dengan duri kristal. */
function IceCrystalBracer({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  return (
    <>
      <path d={`M${m(13)} 104 H${m(31)} V118 H${m(13)} Z`} fill={pal.light} />
      <Gem cx={m(22)} cy={111} hw={4.6} hh={6.4} pal={pal} sw={2.2} />
    </>
  );
}
 
/** Pelindung lutut & pergelangan kaki dengan kristal. side: -1 kiri, 1 kanan */
function IceCrystalGreaves({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  const r = (a: number) => (side === -1 ? a : -a);
  return (
    <>
      {/* satu kristal lutut di sisi luar (sisi dalam tertutup kain pinggang) */}
      <Crystal x={m(43)} y={141} w={12} h={24} r={r(-10)} pal={pal} sw={2.7} />
      <path d={`M${m(37)} 140 Q${m(48)} 133 ${m(58)} 140 L${m(57)} 157 H${m(39)} Z`} fill={pal.light} />
    </>
  );
}

// royal
function RubyGem({ cx, cy, hw, hh, sw = 2.4 }: { cx: number; cy: number; hw: number; hh: number; sw?: number }) {
  const d = `M${cx} ${cy - hh} L${cx + hw} ${cy} L${cx} ${cy + hh} L${cx - hw} ${cy} Z`;
  return (
    <g strokeWidth={sw}>
      <path d={d} fill={RUBY} />
      <path d={`M${cx} ${cy - hh} L${cx - hw} ${cy} L${cx} ${cy} Z`} fill={RUBY_HI} stroke="none" />
      <path d={`M${cx} ${cy} L${cx + hw} ${cy} L${cx} ${cy + hh} Z`} fill="#000" opacity={0.2} stroke="none" />
      <path
        d={`M${cx - hw * 0.5} ${cy - hh * 0.15} L${cx - hw * 0.15} ${cy - hh * 0.55}`}
        fill="none"
        stroke="#fff"
        strokeWidth={sw * 0.7}
      />
      <path d={d} fill="none" />
    </g>
  );
}
 
/** Jubah merah di belakang badan (dua sayap kiri & kanan, hem emas). */
function RoyalCape() {
  const wing = (side: 1 | -1) => {
    const m = mir(side);
    return (
      <g key={side}>
        <path
          d={`M${m(30)} 90 C${m(14)} 120 ${m(6)} 142 ${m(2)} 164 L${m(24)} 156 L${m(36)} 160 L${m(40)} 130 Z`}
          fill={CAPE}
        />
        {/* bayangan sisi luar */}
        <path
          d={`M${m(30)} 90 C${m(14)} 120 ${m(6)} 142 ${m(2)} 164 L${m(12)} 160 C${m(16)} 142 ${m(20)} 120 ${m(30)} 90 Z`}
          fill={CAPE_DK}
          stroke="none"
        />
        {/* pita emas di tepi bawah */}
        <path
          d={`M${m(3.5)} 157 L${m(24)} 149 L${m(37)} 153 L${m(36)} 160 L${m(24)} 156 L${m(2)} 164 Z`}
          fill={GOLD}
          strokeWidth={3}
        />
        {/* lambang kecil di jubah */}
        <path d={`M${m(15)} 132 L${m(19)} 138 L${m(15)} 144 L${m(11)} 138 Z`} fill={GOLD} strokeWidth={1.6} />
      </g>
    );
  };
  return (
    <>
      {wing(-1)}
      {wing(1)}
    </>
  );
}
 
/** Pelat dada: dua pita emas melengkung + ornamen bersayap + ruby. */
function RoyalChest() {
  return (
    <>
      <path d="M40 80 L47 80 Q49 98 60 108 L60 115 Q42 105 40 80 Z" fill={GOLD} strokeWidth={3} />
      <path d="M80 80 L73 80 Q71 98 60 108 L60 115 Q78 105 80 80 Z" fill={GOLD} strokeWidth={3} />
      <path
        d="M60 104 C50 103 45 97 43 90 C51 94 56 94 60 92 C64 94 69 94 77 90 C75 97 70 103 60 104 Z"
        fill={GOLD}
        strokeWidth={3}
      />
      <path d="M47 92 C52 96 56 97 59 97" fill="none" stroke={GOLD_HI} strokeWidth={1.8} />
      <path d="M73 92 C68 96 64 97 61 97" fill="none" stroke={GOLD_DK} strokeWidth={1.8} />
      <RubyGem cx={60} cy={98} hw={4.6} hh={7} sw={2.2} />
    </>
  );
}
 
/** Kain pinggang merah berbingkai emas + lambang bunga lili + gesper ruby + pelat pinggul. */
function RoyalTabard() {
  const fauld = (side: 1 | -1) => {
    const m = mir(side);
    return (
      <g key={side}>
        <path d={`M${m(38)} 128 L${m(46)} 128 L${m(44)} 136 L${m(37)} 138 Z`} fill={GOLD} strokeWidth={3} />
        <path d={`M${m(40)} 130.5 L${m(44)} 130.5`} fill="none" stroke={GOLD_HI} strokeWidth={1.8} />
      </g>
    );
  };
  return (
    <>
      <path d="M47 127 H73 L72 152 L60 170 L48 152 Z" fill={GOLD} strokeWidth={3.5} />
      <path d="M51.5 128 H68.5 L67.5 150 L60 162 L52.5 150 Z" fill={CAPE} stroke="none" />
      <path d="M60 128 H68.5 L67.5 150 L60 162 Z" fill="#000" opacity={0.18} stroke="none" />
      {/* bunga lili */}
      <g fill={GOLD} stroke="none">
        <path d="M60 136 C56.5 140 56.5 145 60 149 C63.5 145 63.5 140 60 136 Z" />
        <path d="M60 148 C57 150 54 147 55 143 C57 144 59 145 59.5 147 Z" />
        <path d="M60 148 C63 150 66 147 65 143 C63 144 61 145 60.5 147 Z" />
        <rect x="56" y="150" width="8" height="1.8" rx="0.9" />
      </g>
      {fauld(-1)}
      {fauld(1)}
      {/* gesper */}
      <path d="M60 110 L73 121.5 L60 133 L47 121.5 Z" fill={GOLD} strokeWidth={3} />
      <path d="M60 110 L47 121.5 L60 121.5 Z" fill={GOLD_HI} stroke="none" />
      <RubyGem cx={60} cy={121.5} hw={5.5} hh={7} sw={2.2} />
    </>
  );
}
 
/** Bahu emas bersayap + bantalan ruby. side: -1 kiri, 1 kanan */
function RoyalPauldron({ side }: { side: 1 | -1 }) {
  const m = mir(side);
  return (
    <>
      {/* bilah sayap (belakang → depan) */}
      <path
        d={`M${m(16)} 78 C${m(4)} 72 ${m(-2)} 60 ${m(2)} 46 C${m(8)} 56 ${m(16)} 62 ${m(26)} 68 Z`}
        fill={GOLD_DK}
        strokeWidth={3}
      />
      <path
        d={`M${m(24)} 72 C${m(14)} 62 ${m(10)} 50 ${m(14)} 36 C${m(20)} 46 ${m(28)} 54 ${m(36)} 62 Z`}
        fill={GOLD}
        strokeWidth={3}
      />
      <path d={`M${m(15)} 44 C${m(17)} 52 ${m(23)} 58 ${m(29)} 62`} fill="none" stroke={GOLD_HI} strokeWidth={2} />
      {/* bantalan bahu bersudut */}
      <path
        d={`M${m(28)} 73 L${m(38)} 84 L${m(28)} 97 L${m(18)} 84 Z`}
        fill={GOLD}
        strokeWidth={3}
      />
      <path d={`M${m(28)} 73 L${m(18)} 84 L${m(28)} 84 Z`} fill={GOLD_HI} stroke="none" />
      <RubyGem cx={m(28)} cy={85} hw={4.2} hh={6.4} sw={2.2} />
    </>
  );
}
 
/** Pelindung lengan bawah berbentuk belah ketupat + ruby. */
function RoyalBracer({ side }: { side: 1 | -1 }) {
  const m = mir(side);
  return (
    <>
      <path d={`M${m(22)} 101 L${m(32)} 113 L${m(22)} 125 L${m(12)} 113 Z`} fill={GOLD} strokeWidth={3} />
      <path d={`M${m(22)} 101 L${m(12)} 113 L${m(22)} 113 Z`} fill={GOLD_HI} stroke="none" />
      <RubyGem cx={m(22)} cy={113} hw={3.4} hh={5.4} sw={2} />
    </>
  );
}
 
/** Pelindung lutut + manset pergelangan + ruby di ujung sepatu. */
function RoyalGreaves({ side }: { side: 1 | -1 }) {
  const m = mir(side);
  return (
    <>
      <path d={`M${m(43)} 136 L${m(52)} 147 L${m(43)} 158 L${m(34)} 147 Z`} fill={GOLD} strokeWidth={3} />
      <path d={`M${m(43)} 136 L${m(34)} 147 L${m(43)} 147 Z`} fill={GOLD_HI} stroke="none" />
      <RubyGem cx={m(43)} cy={147} hw={3.6} hh={5.4} sw={2} />
      <path d={`M${m(38)} 159 H${m(59)} V168 H${m(37)} Z`} fill={GOLD} strokeWidth={3} />
      <path d={`M${m(40)} 162 H${m(56)}`} fill="none" stroke={GOLD_HI} strokeWidth={1.8} />
      <RubyGem cx={m(40)} cy={177} hw={3} hh={4} sw={1.8} />
    </>
  );
}
 
/**
 * Semua hiasan kepala + leher. Gambar PALING AKHIR di dalam <g> badan,
 * setelah visor dan garis highlight helm.
 * (gorget, tanduk samping, bingkai visor, dagu, mahkota, kilau)
 */
function RoyalHelm() {
  const fin = (side: 1 | -1) => {
    const m = mir(side);
    return (
      <path
        key={side}
        d={`M${m(42)} 56 C${m(33)} 50 ${m(29)} 40 ${m(31)} 28 C${m(37)} 35 ${m(41)} 39 ${m(46)} 42 Z`}
        fill={GOLD}
        strokeWidth={3}
      />
    );
  };
  const star = "M0 -6 Q0.8 -0.8 6 0 Q0.8 0.8 0 6 Q-0.8 0.8 -6 0 Q-0.8 -0.8 0 -6 Z";
  const sparks: [number, number, number][] = [
    [14, 30, 1],
    [106, 26, 1.2],
    [3, 104, 0.9],
    [117, 120, 1],
    [96, 4, 0.7],
  ];
  return (
    <>
      {/* gorget (kerah leher) */}
      <path d="M40 75 Q60 85 80 75 L78 81 Q60 91 42 81 Z" fill={GOLD} strokeWidth={3} />
      <path d="M46 78 Q60 86 74 78" fill="none" stroke={GOLD_HI} strokeWidth={1.8} />
      {fin(-1)}
      {fin(1)}
      {/* bingkai visor: garis tinta lebih tebal di bawah, emas di atasnya */}
      <rect x="39" y="35" width="42" height="22" rx="7" fill="none" stroke={INK} strokeWidth={5.4} />
      <rect x="39" y="35" width="42" height="22" rx="7" fill="none" stroke={GOLD} strokeWidth={2.2} />
      {/* pelindung dagu */}
      <path d="M41 57 L60 69 L79 57 L77 62 L60 72 L43 62 Z" fill={GOLD} strokeWidth={3} />
      {/* mahkota */}
      <path d="M40 30 L39 12 L46 20 L50 5 L55 19 L60 -3 L65 19 L70 5 L74 20 L81 12 L80 30 Z" fill={GOLD} />
      <path d="M40 30 L39 12 L46 20 L50 5 L55 19 L60 -3 L60 30 Z" fill="#ffd45a" stroke="none" />
      <path d="M80 30 L81 12 L74 20 L70 5 L65 19 L60 -3 L60 30 Z" fill="#d9981a" stroke="none" />
      <rect x="38" y="26" width="44" height="7" rx="2.5" fill={GOLD} strokeWidth={3} />
      <path d="M42 29 H78" fill="none" stroke={GOLD_HI} strokeWidth={1.6} />
      <RubyGem cx={60} cy={19} hw={4} hh={6.5} sw={2} />
      <RubyGem cx={51} cy={16} hw={2.2} hh={3.4} sw={1.6} />
      <RubyGem cx={69} cy={16} hw={2.2} hh={3.4} sw={1.6} />
      {/* kilau */}
      <g stroke="none" fill="#fff3b0">
        {sparks.map(([x, y, k], i) => (
          <path key={i} d={star} transform={`translate(${x} ${y}) scale(${k * 0.7})`} />
        ))}
      </g>
    </>
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