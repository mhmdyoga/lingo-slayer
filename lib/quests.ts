import { BUILD_SENTENCES, SENTENCES, VOCAB, type VocabItem } from "./vocab";
import {
  buildOrder,
  buildQuestion,
  buildSentence,
  pick,
  type LevelId,
  type Question,
  type QuestionKind,
} from "./questions";

import { BESTIARY, type MKind } from "./bestiary";
export type MonsterKindName = MKind;

function tier(playerLevel: number): LevelId {
  return playerLevel <= 2 ? "easy" : playerLevel <= 4 ? "medium" : "hard";
}

/** Jenis quest yang bisa muncul makin banyak seiring naik level. */
function kindsFor(playerLevel: number): QuestionKind[] {
  const base: QuestionKind[] = ["spell", "spell", "pic2word", "listen", "missing"];
  if (playerLevel >= 2) base.push("build", "id2en");
  if (playerLevel >= 3) base.push("sentence", "build");
  if (playerLevel >= 5) base.push("build", "sentence", "spell");
  return base;
}

/**
 * Pembuat quest acak. Soal yang sama tidak diulang sampai semua soal terpakai.
 * Monster bos selalu memberi quest susun kalimat.
 */
export function createQuestGenerator() {
  const used = new Set<string>();

  return function next(playerLevel: number, monster: MonsterKindName): Question {
    const level = tier(playerLevel);
    const kind: QuestionKind = BESTIARY[monster].boss ? "build" : pick(kindsFor(playerLevel));

    if (kind === "build") {
      const maxWords = playerLevel <= 2 ? 4 : playerLevel <= 4 ? 6 : 9;
      const minWords = BESTIARY[monster].boss ? 4 : 0;
      let idx = BUILD_SENTENCES.map((_, i) => i).filter((i) => {
        const n = BUILD_SENTENCES[i].en.split(" ").length;
        return n <= maxWords && n >= minWords && !used.has(`bld-${i}`);
      });
      if (!idx.length) {
        BUILD_SENTENCES.forEach((_, i) => used.delete(`bld-${i}`));
        idx = BUILD_SENTENCES.map((_, i) => i).filter((i) => BUILD_SENTENCES[i].en.split(" ").length <= maxWords);
      }
      const i = pick(idx);
      used.add(`bld-${i}`);
      return buildOrder(i);
    }

    if (kind === "sentence") {
      let idx = SENTENCES.map((_, i) => i).filter((i) => !used.has(`sen-${i}`));
      if (!idx.length) {
        SENTENCES.forEach((_, i) => used.delete(`sen-${i}`));
        idx = SENTENCES.map((_, i) => i);
      }
      const i = pick(idx);
      used.add(`sen-${i}`);
      return buildSentence(i);
    }

    const maxLen = level === "easy" ? 5 : level === "medium" ? 7 : 11;
    const fits = (v: VocabItem) =>
      kind === "spell" ? v.en.length <= maxLen : kind === "missing" ? v.en.length >= 3 : true;
    const prefix = { pic2word: "p2w", id2en: "i2e", missing: "mis", listen: "lis", spell: "spl" }[kind as "spell"];
    let pool = VOCAB.filter((v) => fits(v) && !used.has(`${prefix}-${v.en}`));
    if (!pool.length) {
      VOCAB.forEach((v) => used.delete(`${prefix}-${v.en}`));
      pool = VOCAB.filter(fits);
    }
    const item = pick(pool);
    used.add(`${prefix}-${item.en}`);
    return buildQuestion(kind, item, VOCAB, level);
  };
}
