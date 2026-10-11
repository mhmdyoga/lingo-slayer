// Musik latar sederhana (arpeggio pentatonik) lewat WebAudio, tanpa file audio.
import { getCtx, isMuted } from "./sfx";

const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
const PATTERN = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 7, 5, 4, 2, 1];
let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;

function note() {
  const c = getCtx();
  if (!c || isMuted()) return;
  const f = SCALE[PATTERN[step % PATTERN.length]];
  step++;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  osc.frequency.value = f;
  gain.gain.setValueAtTime(0.025, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.34);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.36);
  if (step % 4 === 1) {
    const bass = c.createOscillator();
    const bg = c.createGain();
    bass.type = "sine";
    bass.frequency.value = f / 2;
    bg.gain.setValueAtTime(0.035, c.currentTime);
    bg.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5);
    bass.connect(bg).connect(c.destination);
    bass.start();
    bass.stop(c.currentTime + 0.52);
  }
}

export function startMusic() {
  if (timer) return;
  timer = setInterval(note, 260);
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
}
