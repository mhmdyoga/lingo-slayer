import { INK } from "../Scenery";

// pallete royal armor
const GOLD = "#f2b824";
const GOLD_HI = "#ffe58a";
const GOLD_DK = "#b9800f";
const RUBY = "#d7263d";
const RUBY_HI = "#ff8080";
const CAPE = "#a31d2a";
const CAPE_DK = "#6e1019";

const mir = (side: 1 | -1) => (x: number) => (side === -1 ? x : 120 - x);


// royal
export function RubyGem({ cx, cy, hw, hh, sw = 2.4 }: { cx: number; cy: number; hw: number; hh: number; sw?: number }) {
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
export function RoyalCape() {
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
export function RoyalChest() {
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
export function RoyalTabard() {
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
export function RoyalPauldron({ side }: { side: 1 | -1 }) {
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
export function RoyalBracer({ side }: { side: 1 | -1 }) {
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
export function RoyalGreaves({ side }: { side: 1 | -1 }) {
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
export function RoyalHelm() {
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
