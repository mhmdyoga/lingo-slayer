import type { LevelId } from "./questions";

export type Progress = Partial<Record<LevelId, number>>; // jumlah bintang terbaik

const KEY = "blejar-progress";

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveStars(level: LevelId, stars: number): Progress {
  const current = loadProgress();
  const next = { ...current, [level]: Math.max(current[level] ?? 0, stars) };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}
