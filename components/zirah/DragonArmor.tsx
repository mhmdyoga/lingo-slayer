import { Palette } from "@/types/knight/knight"

const RED = "#c1272d";
const DR_FLAME = "#ff8a1f";
const DR_GLOW = "#ffd23f";
const DR_CORE = "#fff2b8";
const DR_RED = "#b3202a";
const DR_RED_DK = "#7d141c";
const DR_RED_HI = "#e04048";
const DR_INK = "#1b1b1b";
 
/** Satu lidah api berlapis (luar → dalam → inti). Titik tengah dasar = (cx, by). */
export function Flame({ cx, by, s = 1, pal, sw = 2 }: { cx: number; by: number; s?: number; pal: Palette; sw?: number }) {
  const d = "M0 0 C-8 -6 -9 -16 -5 -23 C-4 -18 -1 -16 0 -18 C-3 -26 1 -34 6 -40 C6 -32 10 -29 12 -22 C14 -17 13 -9 9 -4 C6 -1 3 0 0 0 Z";
  return (
    <g transform={`translate(${cx} ${by}) scale(${s})`} strokeWidth={sw / s}>
      <path d={d} fill={pal.plume} />
      <g transform="scale(0.68) translate(1 -1)">
        <path d={d} fill={pal.plume2} stroke="none" />
      </g>
      <g transform="scale(0.36) translate(2 -2)">
        <path d={d} fill={DR_CORE} stroke="none" />
      </g>
    </g>
  );
}

/** Sayap naga di belakang badan: selaput merah, tulang & hiasan emas. Digambar paling awal lewat jambul. */
function DragonWings({ pal }: { pal: Palette }) {
  const K = 1.2; // pelebaran sayap ke samping
  const wing = (side: 1 | -1) => {
    const out = side === -1 ? -1 : 1;
    const m = (x: number) => (side === -1 ? 36 - (36 - x) * K : 120 - (36 - (36 - x) * K));
    const gold = pal.trim;
    const dia = (cx: number, cy: number, hw: number, hh: number) => `M${cx} ${cy - hh} L${cx + hw} ${cy} L${cx} ${cy + hh} L${cx - hw} ${cy} Z`;
    const claw = (x: number, y: number) => `M${x} ${y - 3.2} L${x + out * 8} ${y} L${x} ${y + 3.2} Z`;
    // titik pergelangan = (6, 42)
    const bones = [
      `M${m(34)} 86 Q${m(18)} 60 ${m(6)} 42`, // lengan
      `M${m(6)} 42 L${m(-14)} 31`, // jari 1
      `M${m(6)} 42 Q${m(-2)} 64 ${m(-12)} 84`, // jari 2
      `M${m(6)} 42 Q${m(2)} 82 ${m(-6)} 118`, // jari 3
      `M${m(6)} 42 Q${m(10)} 104 ${m(12)} 144`, // jari 4
    ];
    const edge = `M${m(-14)} 31 Q${m(0)} 62 ${m(-12)} 84 Q${m(2)} 104 ${m(-6)} 118 Q${m(8)} 132 ${m(12)} 144 Q${m(26)} 142 ${m(34)} 128`;
    return (
      <g key={side}>
        {/* selaput */}
        <path
          d={`M${m(36)} 86 C${m(24)} 62 ${m(12)} 46 ${m(4)} 40 L${m(-14)} 31 Q${m(0)} 62 ${m(-12)} 84 Q${m(2)} 104 ${m(-6)} 118 Q${m(8)} 132 ${m(12)} 144 Q${m(26)} 142 ${m(34)} 128 Z`}
          fill={DR_RED}
          strokeWidth={3.4}
        />
        {/* bayangan dekat badan + kilau tepi atas */}
        <path
          d={`M${m(36)} 86 C${m(30)} 98 ${m(26)} 114 ${m(12)} 144 Q${m(26)} 142 ${m(34)} 128 Z`}
          fill={DR_RED_DK}
          opacity={0.55}
          stroke="none"
        />
        <path d={`M${m(30)} 80 C${m(22)} 64 ${m(12)} 52 ${m(6)} 47`} fill="none" stroke={DR_RED_HI} strokeWidth={1.8} />
        {/* tulang emas (garis tinta di bawah, emas di atas) */}
        {bones.map((d, i) => (
          <g key={i} fill="none" strokeLinecap="round">
            <path d={d} stroke={DR_INK} strokeWidth={i === 0 ? 6.4 : 5} />
            <path d={d} stroke={gold} strokeWidth={i === 0 ? 3.4 : 2.2} />
          </g>
        ))}
        {/* tepi bergerigi emas */}
        <path d={edge} fill="none" stroke={gold} strokeWidth={1.8} />
        {/* cakar emas di ujung jari */}
        <path d={claw(m(-14), 31)} fill={gold} strokeWidth={2} />
        <path d={claw(m(-12), 84)} fill={gold} strokeWidth={2} />
        <path d={claw(m(-6), 118)} fill={gold} strokeWidth={2} />
        <path d={claw(m(12), 144)} fill={gold} strokeWidth={2} />
        {/* permata api di sendi + hiasan di selaput */}
        <path d={dia(m(6), 42, 5.5, 6.5)} fill={DR_GLOW} strokeWidth={2.2} />
        <path d={dia(m(3), 68, 3.2, 4.4)} fill={gold} strokeWidth={1.6} />
        <path d={dia(m(6), 98, 3.2, 4.4)} fill={gold} strokeWidth={1.6} />
        <path d={dia(m(13), 124, 3.2, 4.4)} fill={gold} strokeWidth={1.6} />
        <path d={dia(m(-3), 56, 2.4, 3.2)} fill={DR_GLOW} strokeWidth={1.4} />
        <path d={dia(m(-4), 100, 2.4, 3.2)} fill={DR_GLOW} strokeWidth={1.4} />
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
 
/** Jambul api: tiga lidah api besar + percikan (+ sayap di belakang, digambar pertama). */
export function DragonCrest({ pal }: { pal: Palette }) {
  return (
    <>
      <DragonWings pal={pal} />
      <Flame cx={45} by={30} s={0.8} pal={pal} sw={3} />
      <Flame cx={75} by={30} s={0.8} pal={pal} sw={3} />
      <Flame cx={60} by={29} s={1.2} pal={pal} sw={3.2} />
      <g fill={pal.plume2} strokeWidth={1.6}>
        <path d="M30 10 l2.4 3.6 l-2.4 3.6 l-2.4 -3.6 Z" />
        <path d="M90 4 l2 3 l-2 3 l-2 -3 Z" />
      </g>
    </>
  );
}
 
/** Tanduk emas melengkung di sisi helm (digambar sebelum helm). */
export function DragonHorns({ pal }: { pal: Palette }) {
  const horn = (side: 1 | -1) => {
    const m = (x: number) => (side === -1 ? x : 120 - x);
    return (
      <g key={side}>
        <path d={`M${m(41)} 54 C${m(25)} 52 ${m(16)} 38 ${m(21)} 18 C${m(26)} 29 ${m(33)} 34 ${m(43)} 37 Z`} fill={pal.trim} />
        <path d={`M${m(23)} 25 C${m(27)} 32 ${m(32)} 36 ${m(40)} 39`} fill="none" stroke="#fff1b0" strokeWidth={1.8} />
        <path d={`M${m(30)} 46 C${m(25)} 46 ${m(22)} 42 ${m(21)} 37`} fill="none" stroke={DR_RED_DK} strokeWidth={1.6} />
      </g>
    );
  };
  return (
    <>
      {horn(-1)}
      {horn(1)}
    </>
  );
}
 
/** Kain dada merah dengan lambang api + tepi api di bawah. */
export function DragonTabard({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M43 80 H77 L73 108 L68 113 L65 108 L60 120 L55 108 L52 113 L47 108 Z" fill={DR_RED} />
      <path d="M60 80 H77 L73 108 L68 113 L65 108 L60 120 Z" fill="#000" opacity={0.2} stroke="none" />
      {/* garis api di tepi kiri-kanan */}
      <path d="M48 84 Q47 96 51 104 M72 84 Q73 96 69 104" fill="none" stroke={pal.plume} strokeWidth={2.4} />
      {/* kerah emas berbentuk V */}
      <path d="M40 80 L60 94 L80 80 L77 80 L60 90 L43 80 Z" fill={pal.trim} strokeWidth={2.4} />
      <Flame cx={60} by={115} s={0.78} pal={pal} sw={2} />
    </>
  );
}
 
/** Kain pinggang merah berujung api. */
export function DragonTassel() {
  return (
    <>
      <path d="M47 127 H73 L71 148 L75 160 L67 152 L65 168 L60 156 L55 168 L53 152 L45 160 L49 148 Z" fill={DR_RED} />
      <path d="M60 127 H73 L71 148 L75 160 L67 152 L65 168 L60 156 Z" fill="#000" opacity={0.2} stroke="none" />
      <path d="M52 130 L51 146 M68 130 L69 146" fill="none" stroke={DR_FLAME} strokeWidth={2.4} />
      <g strokeWidth={1.8}>
        <path d="M60 133 C56 139 54 143 55 148 C56 153 64 153 65 148 C66 143 64 139 60 133 Z" fill={DR_FLAME} />
        <path d="M60 140 C58 144 57 146 58 149 C59 152 61 152 62 149 C63 146 62 144 60 140 Z" fill={DR_GLOW} stroke="none" />
      </g>
    </>
  );
}
 
/** Bahu berbentuk kepala naga bertanduk + api. side: -1 kiri, 1 kanan */
export function DragonPauldron({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  return (
    <>
      {/* bantalan bahu oranye */}
      <path d={`M${m(13)} 92 C${m(14)} 76 ${m(42)} 76 ${m(43)} 92 C${m(34)} 86 ${m(22)} 86 ${m(13)} 92 Z`} fill={pal.plume} strokeWidth={3} />
      {/* duri api di atas bahu */}
      <path d={`M${m(24)} 72 L${m(8)} 50 L${m(18)} 70 Z`} fill={pal.plume} strokeWidth={3} />
      <path d={`M${m(32)} 68 L${m(24)} 42 L${m(37)} 66 Z`} fill={pal.trim} strokeWidth={3} />
      {/* rahang bawah + mulut */}
      <path d={`M${m(8)} 72 L${m(14)} 71 C${m(20)} 71 ${m(27)} 73 ${m(32)} 77 L${m(32)} 82 C${m(26)} 82 ${m(17)} 81 ${m(9)} 79 Z`} fill={DR_RED_DK} strokeWidth={2} />
      <path d={`M${m(9)} 79 L${m(2)} 83 L${m(12)} 83 C${m(19)} 85 ${m(27)} 87 ${m(33)} 87 L${m(33)} 82 C${m(26)} 82 ${m(17)} 81 ${m(9)} 79 Z`} fill={pal.trim} strokeWidth={3} />
      {/* kepala atas + moncong */}
      <path d={`M${m(33)} 74 C${m(32)} 63 ${m(24)} 56 ${m(14)} 57 C${m(8)} 58 ${m(3)} 62 ${m(0)} 68 L${m(9)} 69 L${m(7)} 73 L${m(14)} 71 C${m(20)} 71 ${m(27)} 73 ${m(31)} 77 Z`} fill={pal.trim} strokeWidth={3} />
      {/* mata & kilau */}
      <path d={`M${m(18)} 63 L${m(25)} 65 L${m(19)} 68 Z`} fill={pal.plume2} strokeWidth={1.8} />
      <path d={`M${m(12)} 60 C${m(20)} 58 ${m(28)} 61 ${m(31)} 68`} fill="none" stroke="#fff1b0" strokeWidth={1.8} />
      {/* permata api di bantalan */}
      <path d={`M${m(30)} 80 L${m(35)} 85 L${m(30)} 90 L${m(25)} 85 Z`} fill={pal.plume2} strokeWidth={2} />
    </>
  );
}