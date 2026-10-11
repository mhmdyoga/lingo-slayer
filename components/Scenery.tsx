const INK = "#111";

export function Tree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 120" className={className} aria-hidden overflow="visible">
      <g className="ink" stroke={INK} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 116 L42 74 L52 74 L54 116 Z" fill="#fff" />
        <path d="M44 100 l6 -8 M46 86 l4 -4" fill="none" strokeWidth={3} />
        <path
          d="M14 66 C-2 56 6 34 22 36 C20 16 44 6 56 20 C72 10 90 28 78 44 C94 52 82 74 62 70 C50 80 28 80 14 66 Z"
          fill="#fff"
        />
        <path d="M30 50 q8 -8 16 0 M52 40 q6 -6 12 0 M38 64 q10 6 22 -2" fill="none" strokeWidth={3} />
      </g>
    </svg>
  );
}

export function Rock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden overflow="visible">
      <g className="ink" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 46 C0 30 14 12 34 10 C54 6 76 22 74 46 Z" fill="#fff" />
        <path d="M24 30 l10 4 M46 22 l8 6" fill="none" strokeWidth={3} />
      </g>
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
