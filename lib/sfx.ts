// Efek suara kecil lewat WebAudio, tanpa file audio.
let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem("blejar-muted", value ? "1" : "0");
  } catch {}
}

export function getMuted(): boolean {
  try {
    muted = localStorage.getItem("blejar-muted") === "1";
  } catch {}
  return muted;
}

export function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 0.08) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  gain.gain.setValueAtTime(vol, c.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.02);
}

export type Sfx = "click" | "correct" | "wrong" | "hit" | "super" | "win" | "lose" | "slash" | "hurt" | "kill" | "levelup";

export function play(name: Sfx) {
  if (muted) return;
  switch (name) {
    case "click":
      tone(520, 0, 0.06, "triangle");
      break;
    case "correct":
      tone(660, 0, 0.1, "triangle", 0.1);
      tone(880, 0.09, 0.16, "triangle", 0.1);
      break;
    case "wrong":
      tone(220, 0, 0.18, "sawtooth", 0.07);
      tone(165, 0.14, 0.24, "sawtooth", 0.07);
      break;
    case "hit":
      tone(140, 0, 0.12, "square", 0.1);
      tone(90, 0.06, 0.14, "square", 0.08);
      break;
    case "super":
      tone(440, 0, 0.08, "square");
      tone(660, 0.07, 0.08, "square");
      tone(990, 0.14, 0.18, "square");
      break;
    case "win":
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.2, "triangle", 0.1));
      break;
    case "slash":
      tone(300, 0, 0.07, "sawtooth", 0.05);
      tone(620, 0.03, 0.09, "triangle", 0.06);
      break;
    case "hurt":
      tone(180, 0, 0.14, "square", 0.09);
      tone(110, 0.08, 0.2, "sawtooth", 0.08);
      break;
    case "kill":
      tone(330, 0, 0.07, "square", 0.08);
      tone(495, 0.06, 0.07, "square", 0.08);
      tone(740, 0.12, 0.14, "triangle", 0.1);
      break;
    case "levelup":
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.18, "triangle", 0.1));
      break;
    case "lose":
      [392, 330, 262, 196].forEach((f, i) => tone(f, i * 0.16, 0.24, "sawtooth", 0.07));
      break;
  }
}

export function isMuted(): boolean {
  return muted;
}
