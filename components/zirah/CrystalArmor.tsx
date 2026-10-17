import { Palette } from "@/types/knight/knight";

const ICE_CORE = "#f2fbff";

export function Crystal({ x, y, w, h, r = 0, pal, sw = 3 }: { x: number; y: number; w: number; h: number; r?: number; pal: Palette; sw?: number }) {
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
export function Gem({ cx, cy, hw, hh, pal, sw = 3 }: { cx: number; cy: number; hw: number; hh: number; pal: Palette; sw?: number }) {
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

/** Satu lidah api biru berlapis (luar → dalam → inti). Titik dasar = (cx, by). */
function IceFlame({ cx, by, s = 1, rot = 0, pal, sw = 3 }: { cx: number; by: number; s?: number; rot?: number; pal: Palette; sw?: number }) {
  const d = "M0 0 C-8 -6 -9 -16 -5 -23 C-4 -18 -1 -16 0 -18 C-3 -26 1 -34 6 -40 C6 -32 10 -29 12 -22 C14 -17 13 -9 9 -4 C6 -1 3 0 0 0 Z";
  return (
    <g transform={`translate(${cx} ${by}) rotate(${rot}) scale(${s})`} strokeWidth={sw / s}>
      <path d={d} fill={pal.plume} />
      <g transform="scale(0.68) translate(1 -1)">
        <path d={d} fill={pal.plume2} stroke="none" />
      </g>
      <g transform="scale(0.36) translate(2 -2)">
        <path d={d} fill={ICE_CORE} stroke="none" />
      </g>
    </g>
  );
}

/** Jubah biru di belakang badan (dua sayap), digambar paling awal lewat jambul. */
function IceCape({ pal }: { pal: Palette }) {
  const wing = (side: 1 | -1) => {
    const m = (x: number) => (side === -1 ? x : 120 - x);
    return (
      <g key={side}>
        <path
          d={`M${m(30)} 90 C${m(14)} 120 ${m(6)} 146 ${m(3)} 170 L${m(14)} 162 L${m(22)} 172 L${m(30)} 160 L${m(34)} 166 L${m(42)} 130 Z`}
          fill={pal.plume}
          strokeWidth={3.4}
        />
        <path
          d={`M${m(30)} 92 C${m(19)} 120 ${m(13)} 146 ${m(10)} 160 L${m(17)} 156 C${m(22)} 140 ${m(26)} 118 ${m(33)} 100 Z`}
          fill={pal.plume2}
          opacity={0.6}
          stroke="none"
        />
        <path d={`M${m(18)} 128 L${m(23)} 138 L${m(18)} 148 L${m(13)} 138 Z`} fill="none" stroke={ICE_CORE} strokeWidth={1.6} />
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

/** Nyala api biru besar di atas helm + percikan es + jubah di belakang. */
export function IceCrystalCrest({ pal }: { pal: Palette }) {
  return (
    <>
      <IceCape pal={pal} />
      <IceFlame cx={43} by={31} s={0.85} rot={-16} pal={pal} />
      <IceFlame cx={77} by={31} s={0.85} rot={16} pal={pal} />
      <IceFlame cx={60} by={30} s={1.3} pal={pal} sw={3.2} />
      <g fill={pal.plume2} strokeWidth={1.8}>
        <path d="M31 4 l2.6 3.6 l-2.6 3.6 l-2.6 -3.6 Z" />
        <path d="M91 -6 l2.2 3 l-2.2 3 l-2.2 -3 Z" />
      </g>
    </>
  );
}

/** Kristal di sisi helm, mencuat seperti tanduk (digambar sebelum helm). */
export function IceCrystalHorns({ pal }: { pal: Palette }) {
  const horn = (side: 1 | -1) => {
    const m = (x: number) => (side === -1 ? x : 120 - x);
    const r = (a: number) => (side === -1 ? a : -a);
    return (
      <g key={side}>
        <Crystal x={m(39)} y={46} w={10} h={28} r={r(-30)} pal={pal} sw={3} />
        <Crystal x={m(35)} y={52} w={7} h={15} r={r(-66)} pal={pal} sw={2.6} />
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

/** Permata dahi + kristal kecil di atas helm (digambar setelah helm). */
export function IceCrystalBrow({ pal }: { pal: Palette }) {
  return (
    <>
      <Crystal x={45} y={34} w={5} h={10} r={-24} pal={pal} sw={2.4} />
      <Crystal x={75} y={34} w={5} h={10} r={24} pal={pal} sw={2.4} />
      <path d="M52 34 L60 22 L68 34 Z" fill={pal.light} />
      <Gem cx={60} cy={29} hw={6.5} hh={9.5} pal={pal} sw={2.6} />
      <path d="M42 37 q4 -9 11 -12 M78 37 q-4 -9 -11 -12" fill="none" stroke="#fff" strokeWidth={2.4} />
    </>
  );
}

/** Pelat dada perak + permata besar + lengkung es. */
export function IceCrystalChest({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M44 80 Q47 94 58 104 M76 80 Q73 94 62 104" fill="none" stroke={pal.light} strokeWidth={6} />
      <path d="M44 80 Q47 94 58 104 M76 80 Q73 94 62 104" fill="none" stroke={pal.plume2} strokeWidth={2} />
      <path d="M60 80 L75 98 L60 118 L45 98 Z" fill={pal.light} />
      <Gem cx={60} cy={98} hw={10} hh={16} pal={pal} sw={2.6} />
    </>
  );
}

/** Gesper ikat pinggang berbentuk permata. */
export function IceCrystalBuckle({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M60 110 L72 121.5 L60 133 L48 121.5 Z" fill={pal.light} />
      <Gem cx={60} cy={121.5} hw={7} hh={8.5} pal={pal} sw={2.4} />
    </>
  );
}

/** Kain pinggang biru berpola belah ketupat + kristal di ujung. */
export function IceCrystalTabard({ pal }: { pal: Palette }) {
  return (
    <>
      <path d="M47 127 H73 L71 149 L67 154 L65 161 L60 170 L55 161 L53 154 L49 149 Z" fill={pal.plume} />
      <path d="M60 127 H73 L71 149 L67 154 L65 161 L60 170 Z" fill="#000" opacity={0.2} stroke="none" />
      <path d="M51 128 H57 L55 150 L52 148 Z" fill={pal.plume2} opacity={0.55} stroke="none" />
      <path d="M60 132 L67 144 L60 156 L53 144 Z" fill="none" stroke={pal.plume2} strokeWidth={2.2} />
      <path d="M60 138 L63.5 144 L60 150 L56.5 144 Z" fill={ICE_CORE} stroke="none" />
      <Crystal x={60} y={170} w={7} h={12} r={180} pal={pal} sw={2.2} />
    </>
  );
}

/** Bahu perak dengan gugus kristal besar. side: -1 kiri, 1 kanan */
export function IceCrystalPauldron({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  const r = (a: number) => (side === -1 ? a : -a);
  return (
    <>
      <Crystal x={m(17)} y={80} w={14} h={34} r={r(-48)} pal={pal} sw={3} />
      <Crystal x={m(22)} y={74} w={12} h={30} r={r(-20)} pal={pal} sw={3} />
      <Crystal x={m(31)} y={71} w={10} h={22} r={r(6)} pal={pal} sw={2.8} />
      <Crystal x={m(13)} y={90} w={9} h={16} r={r(-82)} pal={pal} sw={2.6} />
      <Crystal x={m(38)} y={72} w={7} h={13} r={r(26)} pal={pal} sw={2.4} />
      <path d={`M${m(15)} 91 Q${m(28)} 101 ${m(41)} 91`} fill="none" stroke={pal.plume} strokeWidth={3} />
      <Gem cx={m(28)} cy={87} hw={4} hh={5.4} pal={pal} sw={2} />
    </>
  );
}

/** Pelindung lengan bawah dengan kristal + kepalan gelap. */
export function IceCrystalBracer({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  const r = (a: number) => (side === -1 ? a : -a);
  return (
    <>
      <circle cx={m(22)} cy={132} r={9} fill={pal.dark} />
      <path d={`M${m(18)} 128 q4 -3 8 0`} fill="none" stroke="#fff" strokeWidth={1.6} opacity={0.5} />
      <Crystal x={m(14)} y={116} w={7} h={14} r={r(-40)} pal={pal} sw={2.2} />
      <path d={`M${m(12)} 102 H${m(32)} V120 H${m(12)} Z`} fill={pal.light} />
      <path d={`M${m(12)} 118 H${m(32)}`} fill="none" stroke={pal.plume} strokeWidth={2.4} />
      <Gem cx={m(22)} cy={110} hw={4.8} hh={6.6} pal={pal} sw={2.2} />
    </>
  );
}

/** Pelindung lutut & pergelangan kaki dengan kristal. side: -1 kiri, 1 kanan */
export function IceCrystalGreaves({ pal, side }: { pal: Palette; side: 1 | -1 }) {
  const m = (x: number) => (side === -1 ? x : 120 - x);
  const r = (a: number) => (side === -1 ? a : -a);
  return (
    <>
      <Crystal x={m(40)} y={148} w={12} h={30} r={r(-28)} pal={pal} sw={2.7} />
      <Crystal x={m(36)} y={162} w={7} h={15} r={r(-62)} pal={pal} sw={2.3} />
      <path d={`M${m(35)} 138 Q${m(44)} 130 ${m(53)} 138 L${m(52)} 157 H${m(36)} Z`} fill={pal.light} />
      <Gem cx={m(43)} cy={146} hw={4.2} hh={6} pal={pal} sw={2} />
      <path d={`M${m(38)} 159 H${m(58)} V167 H${m(37)} Z`} fill={pal.light} />
      <path d={`M${m(40)} 162.5 H${m(55)}`} fill="none" stroke={pal.plume} strokeWidth={2} />
    </>
  );
}

