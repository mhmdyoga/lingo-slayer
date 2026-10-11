import type { MKind } from "./bestiary";
import { BUILD_SENTENCES, SENTENCES, VOCAB, type VocabItem } from "./vocab";

export type LevelId = "easy" | "medium" | "hard";
export type QuestionKind = "pic2word" | "id2en" | "missing" | "sentence" | "listen" | "spell" | "build";

export type Option = {
  value: string;
  text?: string;
  emoji?: string;
};

export type Question = {
  key: string;
  kind: QuestionKind;
  title: string;
  prompt?: string;
  note?: string;
  emoji?: string;
  speak?: string;
  options: Option[];
  answer: string;
  review: { en: string; id: string; emoji?: string };
};

export type LevelConfig = {
  id: LevelId;
  label: string;
  grade: string;
  monster: MKind;
  monsterName: string;
  monsterHp: number;
  hearts: number;
  timer: number | null; // detik per soal, null = tanpa timer
  kinds: QuestionKind[];
  blurb: string;
};

export const LEVELS: Record<LevelId, LevelConfig> = {
  easy: {
    id: "easy",
    label: "Mudah",
    grade: "Kelas 1-2",
    monster: "rocky",
    monsterName: "Rocky",
    monsterHp: 6,
    hearts: 4,
    timer: null,
    kinds: ["spell", "pic2word", "spell", "listen"],
    blurb: "Susun huruf jadi kata, tebak gambar.",
  },
  medium: {
    id: "medium",
    label: "Sedang",
    grade: "Kelas 3-4",
    monster: "venomspine",
    monsterName: "Venomspine",
    monsterHp: 8,
    hearts: 3,
    timer: 20,
    kinds: ["spell", "id2en", "missing", "spell", "listen"],
    blurb: "Susun kata, huruf hilang, dan dengar.",
  },
  hard: {
    id: "hard",
    label: "Susah",
    grade: "Kelas 5-6",
    monster: "treetank",
    monsterName: "Treetank",
    monsterHp: 10,
    hearts: 3,
    timer: 15,
    kinds: ["spell", "sentence", "missing", "spell", "sentence"],
    blurb: "Kata panjang dan kalimat Inggris.",
  },
};

export const LEVEL_ORDER: LevelId[] = ["easy", "medium", "hard"];

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function distractors(item: VocabItem, pool: VocabItem[], n = 3): VocabItem[] {
  const others = pool.filter((v) => v.en !== item.en && v.emoji !== item.emoji);
  const same = shuffle(others.filter((v) => v.cat === item.cat));
  const diff = shuffle(others.filter((v) => v.cat !== item.cat));
  return [...same, ...diff].slice(0, n);
}

const VOWELS = ["a", "e", "i", "o", "u"];
const CONSONANTS = "bcdfghjklmnpqrstvwy".split("");

function letterOptions(answer: string): string[] {
  const source = VOWELS.includes(answer) ? VOWELS : CONSONANTS;
  const extra = shuffle(source.filter((l) => l !== answer)).slice(0, 3);
  const all = [answer, ...extra];
  // kalau sumber kurang dari 4 huruf, lengkapi dari alfabet lain
  while (all.length < 4) {
    const l = pick("abcdefghijklmnopqrstuvwxyz".split(""));
    if (!all.includes(l)) all.push(l);
  }
  return shuffle(all);
}

export function buildQuestion(
  kind: QuestionKind,
  item: VocabItem,
  pool: VocabItem[],
  level: LevelId,
): Question {
  const review = { en: item.en, id: item.id, emoji: item.emoji };

  if (kind === "spell") {
    const decoyCount = level === "hard" ? 2 : 0;
    const word = item.en.toLowerCase();
    const decoys = shuffle("abcdefghijklmnopqrstuvwxyz".split("").filter((l) => !word.includes(l))).slice(0, decoyCount);
    return {
      key: `spl-${item.en}`,
      kind,
      title: "Susun huruf jadi kata Inggris!",
      emoji: item.emoji,
      note: item.id,
      speak: item.en,
      options: shuffle([...word.split(""), ...decoys]).map((l) => ({ value: l, text: l })),
      answer: word,
      review,
    };
  }


  if (kind === "pic2word") {
    const opts = shuffle([item, ...distractors(item, pool)]);
    return {
      key: `p2w-${item.en}`,
      kind,
      title: "Apa bahasa Inggris dari gambar ini?",
      emoji: item.emoji,
      speak: item.en,
      options: opts.map((o) => ({ value: o.en, text: o.en })),
      answer: item.en,
      review,
    };
  }

  if (kind === "id2en") {
    const opts = shuffle([item, ...distractors(item, pool)]);
    return {
      key: `i2e-${item.en}`,
      kind,
      title: "Apa bahasa Inggrisnya?",
      prompt: item.id,
      speak: item.en,
      options: opts.map((o) => ({ value: o.en, text: o.en })),
      answer: item.en,
      review,
    };
  }

  if (kind === "missing") {
    const word = item.en;
    const idx = 1 + Math.floor(Math.random() * (word.length - 1)); // huruf pertama tidak pernah dihilangkan
    const letter = word[idx].toLowerCase();
    const masked = word
      .split("")
      .map((ch, i) => (i === idx ? "_" : ch))
      .join(" ");
    return {
      key: `mis-${item.en}`,
      kind,
      title: "Huruf apa yang hilang?",
      prompt: masked,
      note: item.id,
      emoji: item.emoji,
      speak: item.en,
      options: letterOptions(letter).map((l) => ({ value: l, text: l })),
      answer: letter,
      review,
    };
  }

  // listen
  const opts = shuffle([item, ...distractors(item, pool)]);
  return {
    key: `lis-${item.en}`,
    kind: "listen",
    title: "Dengarkan, lalu pilih gambar yang benar!",
    prompt: item.en,
    speak: item.en,
    options: opts.map((o) => ({ value: o.en, emoji: o.emoji })),
    answer: item.en,
    review,
  };
}

export function buildSentence(index: number): Question {
  const s = SENTENCES[index];
  return {
    key: `sen-${index}`,
    kind: "sentence",
    title: "Lengkapi kalimat ini:",
    prompt: s.text,
    note: s.id,
    options: shuffle(s.options).map((o) => ({ value: o, text: o })),
    answer: s.answer,
    review: { en: s.text.replace("___", s.answer), id: s.id },
  };
}

/**
 * Membuat "aliran soal" untuk satu pertarungan.
 * Soal yang sama tidak akan muncul lagi sampai semua soal habis terpakai.
 */
export function createQuestionStream(level: LevelId): () => Question {
  const cfg = LEVELS[level];
  const pool = level === "easy" ? VOCAB.filter((v) => v.en.length <= 5) : VOCAB;
  // pilihan jawaban tetap diambil dari seluruh kosakata supaya pengecoh bervariasi
  const used = new Set<string>();
  let kindCursor = Math.floor(Math.random() * cfg.kinds.length);

  return function next(): Question {
    const kind = cfg.kinds[kindCursor % cfg.kinds.length];
    kindCursor++;

    if (kind === "sentence") {
      const free = SENTENCES.map((_, i) => i).filter((i) => !used.has(`sen-${i}`));
      const list = free.length ? free : SENTENCES.map((_, i) => i);
      if (!free.length) SENTENCES.forEach((_, i) => used.delete(`sen-${i}`));
      const idx = pick(list);
      used.add(`sen-${idx}`);
      return buildSentence(idx);
    }

    const prefix = { pic2word: "p2w", id2en: "i2e", missing: "mis", listen: "lis", spell: "spl", sentence: "sen", build: "bld" }[kind];
    let candidates = pool.filter((v) => !used.has(`${prefix}-${v.en}`));
    const fits = (v: VocabItem) =>
      kind === "missing" ? v.en.length >= 3 : kind === "spell" ? v.en.length <= (level === "medium" ? 7 : 11) : true;
    candidates = candidates.filter(fits);
    if (!candidates.length) {
      pool.forEach((v) => used.delete(`${prefix}-${v.en}`));
      candidates = pool.filter(fits);
    }
    const item = pick(candidates);
    used.add(`${prefix}-${item.en}`);
    return buildQuestion(kind, item, VOCAB, level);
  };
}

export function starsFor(won: boolean, heartsLeft: number, maxHearts: number): number {
  if (!won) return 0;
  const lost = maxHearts - heartsLeft;
  if (lost === 0) return 3;
  if (lost === 1) return 2;
  return 1;
}

/** Quest susun kata acak menjadi kalimat yang benar. */
export function buildOrder(index: number): Question {
  const b = BUILD_SENTENCES[index];
  const words = b.en.split(" ");
  let tiles = shuffle(words);
  // pastikan urutannya benar-benar teracak
  for (let i = 0; i < 6 && tiles.join(" ") === b.en; i++) tiles = shuffle(words);
  return {
    key: `bld-${index}`,
    kind: "build",
    title: "Susun kata jadi kalimat yang benar!",
    note: b.id,
    speak: b.en,
    options: tiles.map((w) => ({ value: w, text: w })),
    answer: b.en,
    review: { en: b.en, id: b.id, emoji: "📝" },
  };
}
