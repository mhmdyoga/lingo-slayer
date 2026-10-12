import { useId } from "react";

const INK = "#1b1b1b"; // atau pakai konstanta INK milikmu

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
  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden overflow="visible">
      {/* bayangan tanah */}
      <ellipse cx="42" cy="48.5" rx="38" ry="3" fill="#000" opacity="0.18" />

      {/* serpihan di tanah */}
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
        <path d="M-12 47 L-9 38 L-1 41 L-2 47 Z" fill="#8E8E9C" />
        <path d="M-9 38 L-1 41 L-2 47 L-6 47 Z" fill="#6E6E7C" stroke="none" />
        <path d="M80 47 L83 38 L91 42 L89 47 Z" fill="#8E8E9C" />
        <path d="M83 38 L91 42 L89 47 L85 47 Z" fill="#6E6E7C" stroke="none" />
      </g>

      {/* serpihan melayang */}
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
        <path d="M66 8 L75 2 L79 10 L70 13 Z" fill="#B9B9C6" />
        <path d="M75 2 L79 10 L70 13 Z" fill="#8E8E9C" stroke="none" />
        <path d="M4 7 L11 2 L14 9 L7 12 Z" fill="#C4C4D0" />
        <path d="M11 2 L14 9 L7 12 Z" fill="#9A9AA8" stroke="none" />
        <path d="M82 22 L86 19 L88 24 L84 26 Z" fill="#A5A5B2" />
      </g>

      {/* batu utama: bidang-bidang pecahan */}
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* kiri-atas (terang) */}
        <path d="M4 32 L14 18 L22 30 Z" fill="#A8A8B6" />
        <path d="M14 18 L24 12 L38 22 L22 30 Z" fill="#C2C2CE" />
        <path d="M24 12 L36 6 L38 22 Z" fill="#E0E0EA" />
        <path d="M36 6 L50 10 L38 22 Z" fill="#CFCFDA" />
        {/* tengah */}
        <path d="M50 10 L62 16 L56 28 L38 22 Z" fill="#A0A0AE" />
        <path d="M22 30 L38 22 L56 28 L40 46 Z" fill="#8C8C9A" />
        <path d="M6 46 L4 32 L22 30 L40 46 Z" fill="#7A7A89" />
        {/* kanan-bawah (gelap) */}
        <path d="M62 16 L72 28 L56 28 Z" fill="#82828F" />
        <path d="M56 28 L60 46 L40 46 Z" fill="#666674" />
        <path d="M72 28 L76 46 L60 46 L56 28 Z" fill="#555563" />
      </g>

      {/* garis antar-bidang */}
      <g fill="none" stroke="#3E3E4B" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
        <path d="M4 32 L22 30 L14 18" />
        <path d="M24 12 L38 22 L22 30" />
        <path d="M36 6 L38 22 L50 10" />
        <path d="M38 22 L56 28 L62 16" />
        <path d="M22 30 L40 46" />
        <path d="M56 28 L40 46" />
        <path d="M56 28 L60 46" />
        <path d="M56 28 L72 28" />
      </g>

      {/* sorot tepi terang */}
      <g fill="none" stroke="#F4F4FA" strokeWidth={1.6} strokeLinecap="round" opacity="0.85">
        <path d="M16 18 L24 14" />
        <path d="M26 11 L35 8" />
        <path d="M38 8 L47 11" />
      </g>

      {/* retakan */}
      <g fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 26 l-3 5 l4 3 l-2 6" />
        <path d="M12 38 l5 -2 l2 4" />
      </g>

      {/* pecahan kecil menempel di tepi */}
      <path
        d="M72 28 L78 33 L76 40 L74 34 Z"
        fill="#6A6A78"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* outline luar tebal (siluet bersudut) */}
      <path
        d="M6 46 L4 32 L14 18 L24 12 L36 6 L50 10 L62 16 L72 28 L76 46 Z"
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

/** Ksatria berzirah. Pedangnya digambar terpisah di dalam game supaya bisa menebas. */
export function Knight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 190" className={className} aria-hidden overflow="visible">
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        {/* jambul */}
        <path d="M60 22 C44 6 52 -8 72 -2 C86 2 88 14 76 22 C70 16 66 18 60 22 Z" fill="#ff7a1a" />
        <path d="M60 22 C52 12 58 4 70 4 C66 10 66 16 60 22 Z" fill="#ffd23f" />
        {/* kaki */}
        <path d="M40 126 H58 V170 H38 Z" fill="#5b6470" />
        <path d="M62 126 H80 V170 H82 Z" fill="#5b6470" />
        <path d="M32 168 H59 V184 H26 Z" fill="#cfd6dd" />
        <path d="M61 168 H88 V184 H94 Z" fill="#cfd6dd" />
        <path d="M40 140 H58 M62 140 H80" stroke="#cfd6dd" strokeWidth={3} fill="none" />
        {/* lengan */}
        <rect x="14" y="88" width="16" height="38" rx="7" fill="#aeb7c2" />
        <rect x="90" y="88" width="16" height="38" rx="7" fill="#aeb7c2" />
        <circle cx="22" cy="132" r="9" fill="#cfd6dd" />
        <circle cx="98" cy="132" r="9" fill="#cfd6dd" />
        {/* badan */}
        <path d="M34 78 H86 L82 124 H38 Z" fill="#dfe5ea" />
        <path d="M60 82 V120 M46 90 Q60 100 74 90" fill="none" strokeWidth={2.5} />
        <rect x="36" y="116" width="48" height="11" rx="2" fill="#8a5a2b" />
        <rect x="55" y="117" width="10" height="9" fill="#ffd23f" strokeWidth={2.5} />
        {/* bahu */}
        <circle cx="28" cy="84" r="16" fill="#cfd6dd" />
        <circle cx="92" cy="84" r="16" fill="#cfd6dd" />
        <path d="M20 80 q6 -6 12 -2 M84 78 q6 -4 12 2" fill="none" stroke="#fff" strokeWidth={3} />
        {/* leher & helm */}
        <ellipse cx="60" cy="74" rx="22" ry="8" fill="#aeb7c2" />
        <path d="M36 46 C36 18 84 18 84 46 V62 C84 74 36 74 36 62 Z" fill="#cfd6dd" />
        <rect x="42" y="38" width="36" height="16" rx="5" fill="#2b2f36" />
        <path d="M51 38 V54 M60 38 V54 M69 38 V54" stroke="#cfd6dd" strokeWidth={2.5} fill="none" />
        <path d="M44 30 q8 -8 20 -8" fill="none" stroke="#fff" strokeWidth={3} />
      </g>
    </svg>
  );
}

export type KnightPartName = "legL" | "legR" | "body" | "armL" | "armR";

/** Satu bagian ksatria (viewBox sama dengan <Knight/>), dipakai untuk animasi di canvas. */
export function KnightPart({ part }: { part: KnightPartName }) {
  return (
    <svg viewBox="0 0 120 190" aria-hidden overflow="visible">
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        {part === "legL" && (
          <>
            <path d="M40 124 H58 V170 H38 Z" fill="#5b6470" />
            <path d="M32 168 H59 V184 H26 Z" fill="#cfd6dd" />
            <path d="M40 140 H58" stroke="#cfd6dd" strokeWidth={3} fill="none" />
          </>
        )}
        {part === "legR" && (
          <>
            <path d="M62 124 H80 V170 H82 Z" fill="#5b6470" />
            <path d="M61 168 H88 V184 H94 Z" fill="#cfd6dd" />
            <path d="M62 140 H80" stroke="#cfd6dd" strokeWidth={3} fill="none" />
          </>
        )}
        {part === "body" && (
          <>
            <path d="M60 22 C44 6 52 -8 72 -2 C86 2 88 14 76 22 C70 16 66 18 60 22 Z" fill="#ff7a1a" />
            <path d="M60 22 C52 12 58 4 70 4 C66 10 66 16 60 22 Z" fill="#ffd23f" />
            <path d="M34 78 H86 L82 128 H38 Z" fill="#dfe5ea" />
            <path d="M60 82 V120 M46 90 Q60 100 74 90" fill="none" strokeWidth={2.5} />
            <rect x="36" y="116" width="48" height="11" rx="2" fill="#8a5a2b" />
            <rect x="55" y="117" width="10" height="9" fill="#ffd23f" strokeWidth={2.5} />
            <ellipse cx="60" cy="74" rx="22" ry="8" fill="#aeb7c2" />
            <path d="M36 46 C36 18 84 18 84 46 V62 C84 74 36 74 36 62 Z" fill="#cfd6dd" />
            <rect x="42" y="38" width="36" height="16" rx="5" fill="#2b2f36" />
            <path d="M51 38 V54 M60 38 V54 M69 38 V54" stroke="#cfd6dd" strokeWidth={2.5} fill="none" />
            <path d="M44 30 q8 -8 20 -8" fill="none" stroke="#fff" strokeWidth={3} />
          </>
        )}
        {part === "armL" && (
          <>
            <rect x="14" y="88" width="16" height="38" rx="7" fill="#aeb7c2" />
            <circle cx="22" cy="132" r="9" fill="#cfd6dd" />
            <circle cx="28" cy="84" r="16" fill="#cfd6dd" />
            <path d="M20 80 q6 -6 12 -2" fill="none" stroke="#fff" strokeWidth={3} />
          </>
        )}
        {part === "armR" && (
          <>
            <rect x="90" y="88" width="16" height="38" rx="7" fill="#aeb7c2" />
            <circle cx="98" cy="132" r="9" fill="#cfd6dd" />
            <circle cx="92" cy="84" r="16" fill="#cfd6dd" />
            <path d="M84 78 q6 -4 12 2" fill="none" stroke="#fff" strokeWidth={3} />
          </>
        )}
      </g>
    </svg>
  );
}
