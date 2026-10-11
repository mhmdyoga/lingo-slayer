// Mesin game dunia terbuka: murni TypeScript + Canvas 2D, tanpa React.
import { play } from "@/lib/sfx";

import { BESTIARY, type MKind } from "@/lib/bestiary";
export type { MKind };
export type Stats = {
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  xpNext: number;
  kills: number;
  score: number;
  streak: number;
};
export type Sprites = Record<string, HTMLImageElement>;
export type Callbacks = {
  onStats: (s: Stats) => void;
  onKill: (kind: MKind) => void;
  onHurt: () => void;
  onLevelUp: (level: number) => void;
  onGameOver: (s: Stats) => void;
};

export const WORLD_W = 3600;
export const WORLD_H = 2600;
const INK = "#111";
const PAPER = "#fffdf6";
const MARKER = "#ffe14d";

// ---- semi-3D: kamera miring + perspektif kedalaman ----
const TILT = 0.74; // pemendekan sumbu y (lantai terlihat miring)
const DEPTH_K = 0.00062; // makin jauh (atas layar) makin kecil
const MDEF = BESTIARY;
const DYING = 1.1; // detik: jatuh -> tergeletak -> memudar

type Obstacle = {
  type: "tree" | "rock" | "pond";
  x: number;
  y: number;
  r: number; // radius tabrakan (pohon/batu)
  rx: number; // pond
  ry: number;
  s: number; // lebar sprite
  flip: boolean;
};
type Decor = { x: number; y: number; t: 0 | 1; v: number };
type Monster = {
  id: number;
  kind: MKind;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  hurt: number;
  dying: number;
  face: number;
  sp?: number; // kecepatan halus (animasi)
  walk?: number; // fase langkah
  fs?: number; // skala hadap halus (-1..1)
  lean?: number;
  recoil?: number;
  kx: number;
  ky: number;
  wt: number;
  wx: number;
  wy: number;
  born: number;
  phase: number;
};
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; kind: "puff" | "star" | "dust"; size: number; col?: string };
type FloatText = { x: number; y: number; text: string; life: number; color: string };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Engine {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private time = 0;
  private cssW = 0;
  private cssH = 0;
  private dpr = 1;
  private zoom = 1;
  private camX = 0;
  private camY = 0;

  private obstacles: Obstacle[] = [];
  private decor: Decor[] = [];
  private monsters: Monster[] = [];
  private particles: Particle[] = [];
  private texts: FloatText[] = [];
  private nextId = 1;
  private hitstop = 0;
  private shake = 0;
  private respawnT = 0;

  private groundPat: CanvasPattern | null = null;
  private hatchPat: CanvasPattern | null = null;
  private miniBg: HTMLCanvasElement | null = null;

  private keys = new Set<string>();
  joy = { x: 0, y: 0 };

  p = { x: WORLD_W / 2, y: WORLD_H / 2, fx: 0, fy: 1, walk: 0, inv: 0, kx: 0, ky: 0, swing: -1, cd: 0, hitDone: false, moving: false, vx: 0, vy: 0, sx: 1, side: 1, dust: 0, speed: 0 };
  stats: Stats = { hp: 5, maxHp: 5, level: 1, xp: 0, xpNext: 40, kills: 0, score: 0, streak: 0 };
  paused = true; // jeda karena quest / intro
  suspended = false; // jeda manual / tab tersembunyi
  over = false;
  muted = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private sprites: Sprites,
    private cb: Callbacks,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.buildWorld();
    this.buildPatterns();
    this.reset();
  }

  // ---------- dunia ----------
  private buildWorld() {
    const rnd = mulberry32(20261010);
    const free = (x: number, y: number, pad: number) => {
      if (Math.hypot(x - WORLD_W / 2, y - WORLD_H / 2) < 280) return false;
      for (const o of this.obstacles) {
        const rr = o.type === "pond" ? Math.max(o.rx, o.ry) : o.r;
        if (Math.hypot(x - o.x, y - o.y) < rr + pad) return false;
      }
      return true;
    };
    const rand = (a: number, b: number) => a + rnd() * (b - a);

    for (let i = 0, tries = 0; i < 7 && tries < 400; tries++) {
      const rx = rand(140, 230), ry = rand(90, 140);
      const x = rand(300, WORLD_W - 300), y = rand(300, WORLD_H - 300);
      if (free(x, y, Math.max(rx, ry) + 120)) {
        this.obstacles.push({ type: "pond", x, y, r: 0, rx, ry, s: 0, flip: false });
        i++;
      }
    }
    for (let i = 0, tries = 0; i < 130 && tries < 3000; tries++) {
      const x = rand(60, WORLD_W - 60), y = rand(70, WORLD_H - 40);
      if (free(x, y, 95)) {
        this.obstacles.push({ type: "tree", x, y, r: 20, rx: 0, ry: 0, s: rand(110, 150), flip: rnd() > 0.5 });
        i++;
      }
    }
    for (let i = 0, tries = 0; i < 50 && tries < 2000; tries++) {
      const x = rand(60, WORLD_W - 60), y = rand(60, WORLD_H - 60);
      if (free(x, y, 70)) {
        this.obstacles.push({ type: "rock", x, y, r: 30, rx: 0, ry: 0, s: rand(70, 100), flip: rnd() > 0.5 });
        i++;
      }
    }
    for (let i = 0; i < 320; i++) {
      this.decor.push({ x: rand(20, WORLD_W - 20), y: rand(20, WORLD_H - 20), t: rnd() > 0.78 ? 1 : 0, v: rnd() });
    }
  }

  private buildPatterns() {
    const mk = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d")!);
      return this.ctx.createPattern(c, "repeat");
    };
    this.groundPat = mk(160, 160, (c) => {
      c.fillStyle = PAPER;
      c.fillRect(0, 0, 160, 160);
      c.strokeStyle = "rgba(17,17,17,0.09)";
      c.lineWidth = 2;
      c.strokeRect(0, 0, 160, 160);
      c.fillStyle = "rgba(17,17,17,0.16)";
      for (const [x, y] of [[40, 40], [120, 40], [40, 120], [120, 120]]) {
        c.beginPath();
        c.arc(x, y, 2.4, 0, 7);
        c.fill();
      }
    });
    this.hatchPat = mk(24, 24, (c) => {
      c.fillStyle = PAPER;
      c.fillRect(0, 0, 24, 24);
      c.strokeStyle = INK;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(-4, 28);
      c.lineTo(28, -4);
      c.moveTo(-4, 4);
      c.lineTo(4, -4);
      c.moveTo(20, 28);
      c.lineTo(28, 20);
      c.stroke();
    });
    // peta mini statis
    const mw = 168, mh = Math.round((168 * WORLD_H) / WORLD_W);
    const mc = document.createElement("canvas");
    mc.width = mw;
    mc.height = mh;
    const m = mc.getContext("2d")!;
    m.fillStyle = "#fff";
    m.fillRect(0, 0, mw, mh);
    const k = mw / WORLD_W;
    for (const o of this.obstacles) {
      if (o.type === "pond") {
        m.fillStyle = "#c9d6df";
        m.beginPath();
        m.ellipse(o.x * k, o.y * k, o.rx * k, o.ry * k, 0, 0, 7);
        m.fill();
      } else {
        m.fillStyle = o.type === "tree" ? "#9aa29a" : "#777";
        m.fillRect(o.x * k - 1, o.y * k - 1, 2.4, 2.4);
      }
    }
    this.miniBg = mc;
  }

  reset() {
    this.p = { x: WORLD_W / 2, y: WORLD_H / 2, fx: 0, fy: 1, walk: 0, inv: 1, kx: 0, ky: 0, swing: -1, cd: 0, hitDone: false, moving: false, vx: 0, vy: 0, sx: 1, side: 1, dust: 0, speed: 0 };
    this.stats = { hp: 5, maxHp: 5, level: 1, xp: 0, xpNext: 40, kills: 0, score: 0, streak: 0 };
    this.monsters = [];
    this.particles = [];
    this.texts = [];
    this.over = false;
    for (let i = 0; i < 16; i++) this.spawnMonster(true);
    this.cb.onStats({ ...this.stats });
  }

  // ---------- siklus ----------
  start() {
    this.last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.time += dt;
      let udt = dt;
      if (this.hitstop > 0) {
        this.hitstop -= dt;
        udt = dt * 0.06;
      }
      this.shake *= Math.pow(0.002, dt);
      if (!this.paused && !this.suspended && !this.over) this.update(udt);
      else this.idleUpdate(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    cancelAnimationFrame(this.raf);
  }
  resize(w: number, h: number) {
    this.cssW = w;
    this.cssH = h;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.zoom = Math.min(1.2, Math.max(0.62, w / 1150));
  }

  // ---------- input ----------
  keyDown(code: string) {
    if (code === "Space") return this.attack();
    this.keys.add(code);
  }
  keyUp(code: string) {
    this.keys.delete(code);
  }
  clearInput() {
    this.keys.clear();
    this.joy = { x: 0, y: 0 };
  }
  attack() {
    const p = this.p;
    if (this.paused || this.suspended || this.over || p.cd > 0 || p.swing >= 0) return;
    p.swing = 0;
    p.cd = 0.42;
    p.hitDone = false;
    if (!this.muted) play("slash");
  }
  resume() {
    this.paused = false;
    this.clearInput();
  }

  // ---------- logika ----------
  private spawnMonster(initial = false) {
    const pool = Object.values(MDEF).filter((e) => e.minLevel <= this.stats.level);
    let roll = Math.random() * pool.reduce((a, e) => a + e.weight, 0);
    let kind: MKind = pool[0].id;
    for (const e of pool) {
      roll -= e.weight;
      if (roll <= 0) { kind = e.id; break; }
    }
    const d = MDEF[kind];
    for (let t = 0; t < 60; t++) {
      const x = 120 + Math.random() * (WORLD_W - 240);
      const y = 120 + Math.random() * (WORLD_H - 240);
      if (Math.hypot(x - this.p.x, y - this.p.y) < (initial ? 420 : 650)) continue;
      if (this.blocked(x, y, d.r * 0.6)) continue;
      this.monsters.push({
        id: this.nextId++, kind, x, y, hp: d.hp, maxHp: d.hp, hurt: 0, dying: 0, face: 1, kx: 0, ky: 0,
        wt: 0, wx: 0, wy: 0, born: this.time, phase: Math.random() * 6,
      });
      return;
    }
  }

  private blocked(x: number, y: number, r: number) {
    for (const o of this.obstacles) {
      if (o.type === "pond") {
        const dx = (x - o.x) / (o.rx + r), dy = (y - o.y) / (o.ry + r);
        if (dx * dx + dy * dy < 1) return true;
      } else if (Math.hypot(x - o.x, y - o.y) < o.r + r) return true;
    }
    return false;
  }

  private collide(e: { x: number; y: number }, r: number) {
    for (const o of this.obstacles) {
      if (o.type === "pond") {
        const ax = o.rx + r, ay = o.ry + r;
        const dx = e.x - o.x, dy = e.y - o.y;
        const d = Math.sqrt((dx * dx) / (ax * ax) + (dy * dy) / (ay * ay));
        if (d < 1) {
          const k = d < 0.001 ? 1 : 1 / d;
          e.x = o.x + (d < 0.001 ? ax : dx * k);
          e.y = o.y + (d < 0.001 ? 0 : dy * k);
        }
      } else {
        const dx = e.x - o.x, dy = e.y - o.y;
        const d = Math.hypot(dx, dy), min = o.r + r;
        if (d < min) {
          const k = d < 0.001 ? 1 : min / d;
          e.x = o.x + (d < 0.001 ? min : dx * k);
          e.y = o.y + (d < 0.001 ? 0 : dy * k);
        }
      }
    }
    e.x = Math.max(30, Math.min(WORLD_W - 30, e.x));
    e.y = Math.max(50, Math.min(WORLD_H - 20, e.y));
  }

  private idleUpdate(dt: number) {
    for (const t of this.texts) t.life -= dt;
    this.texts = this.texts.filter((t) => t.life > 0);
    this.stepParticles(dt);
  }

  private stepParticles(dt: number) {
    for (const q of this.particles) {
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vx *= 0.94;
      q.vy *= 0.94;
      q.life -= dt;
    }
    this.particles = this.particles.filter((q) => q.life > 0);
  }

  private update(dt: number) {
    const p = this.p;
    const k = this.keys;
    let ix = (k.has("ArrowRight") || k.has("KeyD") ? 1 : 0) - (k.has("ArrowLeft") || k.has("KeyA") ? 1 : 0) + this.joy.x;
    let iy = (k.has("ArrowDown") || k.has("KeyS") ? 1 : 0) - (k.has("ArrowUp") || k.has("KeyW") ? 1 : 0) + this.joy.y;
    const len = Math.hypot(ix, iy);
    if (len > 1) {
      ix /= len;
      iy /= len;
    }
    const mag = Math.min(1, len);
    const maxSp = 255 * (p.swing >= 0 ? 0.6 : 1);
    // akselerasi & pengereman halus (bukan langsung berhenti/jalan)
    const tvx = ix * maxSp, tvy = iy * maxSp;
    const rate = Math.min(1, dt * (mag > 0.1 ? 13 : 9));
    p.vx += (tvx - p.vx) * rate;
    p.vy += (tvy - p.vy) * rate;
    p.speed = Math.hypot(p.vx, p.vy);
    p.moving = p.speed > 28;
    if (mag > 0.12) {
      p.fx = ix / mag;
      p.fy = iy / mag;
      if (Math.abs(ix) > 0.25) p.side = ix > 0 ? 1 : -1;
    }
    // badan berputar halus saat berbalik arah
    p.sx += (p.side - p.sx) * Math.min(1, dt * 15);
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.walk += dt * (p.speed / 255) * 13.5;
    if (p.moving && p.speed > 140) {
      p.dust -= dt;
      if (p.dust <= 0) {
        p.dust = 0.11;
        this.particles.push({ x: p.x - p.vx * 0.04 + (Math.random() - 0.5) * 12, y: p.y - 2, vx: -p.vx * 0.12, vy: -14 - Math.random() * 18, life: 0.38, max: 0.38, kind: "dust", size: 4 + Math.random() * 4 });
      }
    }
    p.x += p.kx * dt;
    p.y += p.ky * dt;
    p.kx *= 0.88;
    p.ky *= 0.88;
    this.collide(p, 20);
    if (p.cd > 0) p.cd -= dt;
    if (p.inv > 0) p.inv -= dt;
    if (p.swing >= 0) {
      p.swing += dt;
      if (!p.hitDone && p.swing > 0.07) {
        p.hitDone = true;
        this.swordHit();
      }
      if (p.swing > 0.3) p.swing = -1;
    }

    for (const m of this.monsters) {
      const d = MDEF[m.kind];
      if (m.dying > 0) {
        m.dying -= dt;
        m.kx *= 0.9;
        m.ky *= 0.9;
        m.x += m.kx * dt;
        m.y += m.ky * dt;
        continue;
      }
      if (m.hurt > 0) m.hurt -= dt;
      m.x += m.kx * dt;
      m.y += m.ky * dt;
      m.kx *= 0.86;
      m.ky *= 0.86;
      const dx = p.x - m.x, dy = p.y - m.y;
      const dist = Math.hypot(dx, dy);
      let vx = 0, vy = 0;
      if (dist < d.aggro && p.inv <= 0) {
        vx = (dx / dist) * d.speed;
        vy = (dy / dist) * d.speed;
      } else if (dist < d.aggro && p.inv > 0) {
        // beri napas sebentar setelah memukul pemain
        vx = (-dx / dist) * d.speed * 0.3;
        vy = (-dy / dist) * d.speed * 0.3;
      } else {
        m.wt -= dt;
        if (m.wt <= 0) {
          m.wt = 1.2 + Math.random() * 2.2;
          const a = Math.random() * 6.283;
          const still = Math.random() < 0.3;
          m.wx = still ? 0 : Math.cos(a) * 38;
          m.wy = still ? 0 : Math.sin(a) * 38;
        }
        vx = m.wx;
        vy = m.wy;
      }
      m.x += vx * dt;
      m.y += vy * dt;
      if (Math.abs(vx) > 6) m.face = vx > 0 ? 1 : -1;
      const spd = Math.hypot(vx, vy);
      m.sp = (m.sp ?? 0) + (spd - (m.sp ?? 0)) * Math.min(1, dt * 7);
      m.walk = (m.walk ?? 0) + dt * (4.5 + (m.sp / d.speed) * 5.5) * (m.sp > 8 ? 1 : 0.25);
      m.lean = (m.lean ?? 0) + (Math.max(-1, Math.min(1, vx / d.speed)) - (m.lean ?? 0)) * Math.min(1, dt * 8);
      m.recoil = (m.recoil ?? 0) * Math.max(0, 1 - dt * 9);
      this.collide(m, d.r * 0.55);
      if (dist < 20 + d.r * 0.75 && p.inv <= 0) this.hurtPlayer(m.x, m.y);
    }

    // selesai animasi kalah -> quest
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      if (m.dying !== 0 && m.dying <= 0 && !this.paused) {
        this.monsters.splice(i, 1);
        this.paused = true;
        this.clearInput();
        this.cb.onKill(m.kind);
        break;
      }
    }

    const target = 14;
    this.respawnT -= dt;
    if (this.respawnT <= 0 && this.monsters.filter((m) => m.dying === 0).length < target) {
      this.respawnT = 4;
      this.spawnMonster();
    }
    for (const t of this.texts) {
      t.y -= 38 * dt;
      t.life -= dt;
    }
    this.texts = this.texts.filter((t) => t.life > 0);
    this.stepParticles(dt);
  }

  private swordHit() {
    const p = this.p;
    const fa = Math.atan2(p.fy, p.fx);
    let hit = false;
    for (const m of this.monsters) {
      if (m.dying !== 0) continue;
      const d = MDEF[m.kind];
      const dx = m.x - p.x, dy = m.y - 28 - (p.y - 44);
      const dist = Math.hypot(dx, m.y - p.y);
      if (dist > 118 + d.r) continue;
      let da = Math.atan2(m.y - p.y, dx) - fa;
      while (da > Math.PI) da -= 6.283;
      while (da < -Math.PI) da += 6.283;
      if (Math.abs(da) > 1.25 && dist > d.r + 30) continue;
      hit = true;
      this.hitstop = 0.07;
      this.shake = Math.max(this.shake, d.boss ? 9 : 6);
      m.hp -= 1;
      m.hurt = 0.18;
      m.recoil = Math.sign(dx || 1);
      const kb = d.boss ? 140 : 300;
      m.kx = (dx / (dist || 1)) * kb;
      m.ky = ((m.y - p.y) / (dist || 1)) * kb;
      this.texts.push({ x: m.x, y: m.y - d.w * 0.9, text: "-1", life: 0.8, color: "#111" });
      this.burst(m.x, m.y - 30, 5, "star", d.color);
      if (m.hp <= 0) {
        m.dying = DYING;
        m.kx *= 0.6;
        m.ky *= 0.6;
        this.stats.kills++;
        this.addXp(d.xp);
        this.burst(m.x, m.y - 30, 14, "puff", d.color);
        if (!this.muted) play("kill");
      } else if (!this.muted) play("hit");
    }
    return hit;
  }

  private burst(x: number, y: number, n: number, kind: "puff" | "star", col?: string) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = 80 + Math.random() * 160;
      this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, life: 0.5 + Math.random() * 0.3, max: 0.8, kind, size: 6 + Math.random() * 10, col });
    }
  }

  private hurtPlayer(fromX: number, fromY: number) {
    const p = this.p;
    p.inv = 1.3;
    const dx = p.x - fromX, dy = p.y - fromY, d = Math.hypot(dx, dy) || 1;
    p.kx = (dx / d) * 520;
    p.ky = (dy / d) * 520;
    this.stats.hp--;
    this.stats.streak = 0;
    this.texts.push({ x: p.x, y: p.y - 110, text: "Aduh!", life: 0.9, color: "#ff4d4d" });
    if (!this.muted) play("hurt");
    this.cb.onHurt();
    this.emit();
    if (this.stats.hp <= 0) this.gameOver();
  }

  private gameOver() {
    this.over = true;
    this.clearInput();
    if (!this.muted) play("lose");
    this.cb.onGameOver({ ...this.stats });
  }

  private addXp(n: number) {
    const s = this.stats;
    s.xp += n;
    while (s.xp >= s.xpNext) {
      s.xp -= s.xpNext;
      s.level++;
      s.maxHp = Math.min(9, s.maxHp + 1);
      s.hp = s.maxHp;
      s.xpNext = 40 + (s.level - 1) * 25;
      if (!this.muted) play("levelup");
      this.cb.onLevelUp(s.level);
    }
  }

  /** Hadiah / hukuman setelah quest dijawab. */
  reward(correct: boolean, kind: MKind) {
    const s = this.stats;
    if (correct) {
      s.streak++;
      const gain = 20 + Math.min(s.streak - 1, 5) * 5 + (MDEF[kind].boss ? 30 : 0);
      s.score += gain * 10;
      this.texts.push({ x: this.p.x, y: this.p.y - 120, text: `+${gain} XP`, life: 1.4, color: "#1a9d4f" });
      if (s.streak % 3 === 0 && s.hp < s.maxHp) {
        s.hp++;
        this.texts.push({ x: this.p.x + 30, y: this.p.y - 150, text: "+♥", life: 1.4, color: "#ff4d4d" });
      }
      this.addXp(gain);
      if (!this.muted) play("correct");
    } else {
      s.streak = 0;
      s.hp--;
      if (!this.muted) play("wrong");
      if (s.hp <= 0) {
        this.emit();
        this.gameOver();
        return;
      }
    }
    this.emit();
  }

  private emit() {
    this.cb.onStats({ ...this.stats });
  }

  // ---------- gambar ----------
  private pcx = 0;
  private pcy = 0;
  /** Proyeksi dunia -> ruang kamera: skala menurut kedalaman + lantai dimiringkan. */
  private proj(x: number, y: number) {
    const s = Math.max(0.5, Math.min(1.7, 1 + (y - this.pcy) * DEPTH_K));
    return { x: this.pcx + (x - this.pcx) * s, y: this.pcy + (y - this.pcy) * TILT * s, s };
  }
  /** Gambar sesuatu yang berpijak di (x,y) dengan skala perspektif; flat = benda rata di lantai. */
  private at(x: number, y: number, fn: () => void, flat = false) {
    const c = this.ctx;
    const q = this.proj(x, y);
    c.save();
    c.translate(q.x, q.y);
    c.scale(q.s, q.s * (flat ? TILT : 1));
    c.translate(-x, -y);
    fn();
    c.restore();
  }
  private flash?: HTMLCanvasElement;
  private img(name: string) {
    return this.sprites[name];
  }

  private draw() {
    const c = this.ctx;
    const z = this.zoom * this.dpr;
    const vw = this.cssW / this.zoom, vh = this.cssH / this.zoom;
    const p = this.p;
    const mx = 90;
    this.camX = Math.max(-mx, Math.min(WORLD_W - vw + mx, p.x - vw / 2));
    this.camY = Math.max(-mx, Math.min(WORLD_H - vh + mx, p.y - 40 - vh / 2));
    if (vw > WORLD_W + mx * 2) this.camX = (WORLD_W - vw) / 2;
    if (vh > WORLD_H + mx * 2) this.camY = (WORLD_H - vh) / 2;
    this.camX += (Math.random() - 0.5) * this.shake;
    this.camY += (Math.random() - 0.5) * this.shake;
    const cx = this.camX, cy = this.camY;

    c.setTransform(z, 0, 0, z, -cx * z, -cy * z);
    this.pcx = cx + vw / 2;
    this.pcy = cy + vh / 2;
    // luar dunia: tembok arsir
    c.fillStyle = this.hatchPat!;
    c.fillRect(cx - 4, cy - 4, vw + 8, vh + 8);
    // lantai dunia = persegi panjang dunia yang diproyeksikan (trapesium)
    const N = 36;
    c.save();
    c.beginPath();
    for (let i = 0; i <= N; i++) {
      const q = this.proj(0, (WORLD_H * i) / N);
      i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y);
    }
    for (let i = N; i >= 0; i--) {
      const q = this.proj(WORLD_W, (WORLD_H * i) / N);
      c.lineTo(q.x, q.y);
    }
    c.closePath();
    c.fillStyle = PAPER;
    c.fill();
    c.save();
    c.clip();
    // garis kisi mengerucut ke arah jauh
    c.strokeStyle = "rgba(17,17,17,0.09)";
    c.lineWidth = 2;
    c.beginPath();
    for (let gy = 0; gy <= WORLD_H; gy += 160) {
      const a1 = this.proj(0, gy), b1 = this.proj(WORLD_W, gy);
      c.moveTo(a1.x, a1.y);
      c.lineTo(b1.x, b1.y);
    }
    for (let gx = 0; gx <= WORLD_W; gx += 160) {
      for (let gy = 0; gy <= WORLD_H; gy += 160) {
        const q = this.proj(gx, gy);
        gy ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y);
      }
    }
    c.stroke();
    c.fillStyle = "rgba(17,17,17,0.16)";
    for (let gx = 40; gx < WORLD_W; gx += 80) {
      for (let gy = 40; gy < WORLD_H; gy += 80) {
        if ((gx / 80 + gy / 80) % 2 === 0) continue;
        const q = this.proj(gx, gy);
        if (q.x < cx - 10 || q.x > cx + vw + 10 || q.y < cy - 10 || q.y > cy + vh + 10) continue;
        c.beginPath();
        c.arc(q.x, q.y, 2.4 * q.s, 0, 7);
        c.fill();
      }
    }
    c.restore();
    c.restore();
    // garis tepi dunia
    c.strokeStyle = INK;
    c.lineWidth = 9;
    c.lineJoin = "round";
    c.beginPath();
    for (let i = 0; i <= N; i++) {
      const q = this.proj(0, (WORLD_H * i) / N);
      i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y);
    }
    for (let i = N; i >= 0; i--) {
      const q = this.proj(WORLD_W, (WORLD_H * i) / N);
      c.lineTo(q.x, q.y);
    }
    c.closePath();
    c.stroke();

    // area yang terlihat lebih luas di bagian atas layar (jauh)
    const inView = (x: number, y: number, pad = 160) =>
      x > cx - vw * 0.45 - pad && x < cx + vw * 1.45 + pad && y > cy - vh * 0.75 - pad && y < cy + vh + pad + 100;

    // kolam
    for (const o of this.obstacles) if (o.type === "pond" && inView(o.x, o.y, o.rx + 40)) this.at(o.x, o.y, () => this.drawPond(o), true);
    // rumput & bunga
    for (const d of this.decor) if (inView(d.x, d.y, 30)) this.at(d.x, d.y, () => this.drawDecor(d));

    // objek berurutan menurut y (efek kedalaman)
    const list: { y: number; f: () => void }[] = [];
    for (const o of this.obstacles) {
      if (o.type === "pond" || !inView(o.x, o.y)) continue;
      list.push({ y: o.y, f: () => this.at(o.x, o.y, () => this.drawProp(o)) });
    }
    for (const m of this.monsters) if (inView(m.x, m.y)) list.push({ y: m.y, f: () => this.at(m.x, m.y, () => this.drawMonster(m)) });
    list.push({ y: p.y, f: () => this.at(p.x, p.y, () => this.drawPlayer()) });
    list.sort((a, b) => a.y - b.y);
    for (const l of list) l.f();

    // efek
    for (const q of this.particles) {
      const pq = this.proj(q.x, q.y);
      c.save();
      c.translate(pq.x - q.x * pq.s, pq.y - q.y * pq.s);
      c.scale(pq.s, pq.s);
      const a = Math.max(0, q.life / q.max);
      c.globalAlpha = a;
      if (q.kind === "dust") {
        c.fillStyle = "rgba(17,17,17,.14)";
        c.strokeStyle = "rgba(17,17,17,.35)";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(q.x, q.y, q.size * (1.2 + (1 - a) * 0.9), 0, 7);
        c.fill();
        c.stroke();
      } else if (q.kind === "puff") {
        c.strokeStyle = INK;
        c.fillStyle = q.col ?? "#fff";
        c.lineWidth = 3;
        c.beginPath();
        c.arc(q.x, q.y, q.size * (1.6 - a * 0.6), 0, 7);
        c.fill();
        c.stroke();
      } else {
        this.star(q.x, q.y, q.size * 0.9, MARKER);
      }
      c.globalAlpha = 1;
      c.restore();
    }
    for (const t of this.texts) {
      const tq = this.proj(t.x, t.y);
      c.save();
      c.translate(tq.x - t.x * tq.s, tq.y - t.y * tq.s);
      c.scale(tq.s, tq.s);
      c.globalAlpha = Math.min(1, t.life * 2);
      c.font = "28px 'Bagel Fat One', sans-serif";
      c.textAlign = "center";
      c.lineWidth = 6;
      c.strokeStyle = "#fff";
      c.strokeText(t.text, t.x, t.y);
      c.fillStyle = t.color;
      c.fillText(t.text, t.x, t.y);
      c.globalAlpha = 1;
      c.restore();
    }

    // ---- overlay layar ----
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // kabut tipis di kejauhan + vinyet lembut = kesan kedalaman
    const fog = c.createLinearGradient(0, 0, 0, this.cssH * 0.34);
    fog.addColorStop(0, "rgba(255,253,246,0.92)");
    fog.addColorStop(1, "rgba(255,253,246,0)");
    c.fillStyle = fog;
    c.fillRect(0, 0, this.cssW, this.cssH * 0.34);
    const vg = c.createRadialGradient(this.cssW / 2, this.cssH * 0.55, Math.min(this.cssW, this.cssH) * 0.45, this.cssW / 2, this.cssH * 0.55, Math.max(this.cssW, this.cssH) * 0.78);
    vg.addColorStop(0, "rgba(17,17,17,0)");
    vg.addColorStop(1, "rgba(17,17,17,0.13)");
    c.fillStyle = vg;
    c.fillRect(0, 0, this.cssW, this.cssH);
    this.drawArrow(vw, vh);
    this.drawMinimap();
  }

  private star(x: number, y: number, r: number, fill: string) {
    const c = this.ctx;
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * i) / 5 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath();
    c.fillStyle = fill;
    c.strokeStyle = INK;
    c.lineWidth = 2.5;
    c.fill();
    c.stroke();
  }

  private drawPond(o: Obstacle) {
    const c = this.ctx;
    c.save();
    c.fillStyle = "#e4eef5";
    c.strokeStyle = INK;
    c.lineWidth = 6;
    c.beginPath();
    c.ellipse(o.x, o.y, o.rx, o.ry, 0, 0, 7);
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(o.x, o.y, o.rx * 0.86, o.ry * 0.82, 0, 0, 7);
    c.setLineDash([10, 12]);
    c.lineWidth = 3;
    c.strokeStyle = "rgba(17,17,17,.4)";
    c.stroke();
    c.setLineDash([]);
    c.strokeStyle = "rgba(17,17,17,.55)";
    c.lineWidth = 3;
    c.lineCap = "round";
    for (let i = -1; i <= 1; i++) {
      const wx = o.x + i * o.rx * 0.45 + Math.sin(this.time * 1.4 + i) * 8;
      const wy = o.y + i * o.ry * 0.25;
      c.beginPath();
      c.moveTo(wx - 26, wy);
      c.quadraticCurveTo(wx - 13, wy - 10, wx, wy);
      c.quadraticCurveTo(wx + 13, wy + 10, wx + 26, wy);
      c.stroke();
    }
    c.restore();
  }

  private drawDecor(d: Decor) {
    const c = this.ctx;
    c.strokeStyle = INK;
    c.lineCap = "round";
    if (d.t === 0) {
      c.lineWidth = 3;
      const s = 7 + d.v * 7;
      c.beginPath();
      c.moveTo(d.x - s, d.y);
      c.lineTo(d.x - s * 0.4, d.y - s * 1.4);
      c.moveTo(d.x, d.y);
      c.lineTo(d.x, d.y - s * 1.9);
      c.moveTo(d.x + s, d.y);
      c.lineTo(d.x + s * 0.4, d.y - s * 1.4);
      c.stroke();
    } else {
      c.lineWidth = 2.6;
      c.beginPath();
      c.moveTo(d.x, d.y);
      c.lineTo(d.x, d.y - 16);
      c.stroke();
      c.fillStyle = d.v > 0.5 ? MARKER : "#fff";
      c.beginPath();
      c.arc(d.x, d.y - 20, 6.5, 0, 7);
      c.fill();
      c.stroke();
      c.fillStyle = INK;
      c.beginPath();
      c.arc(d.x, d.y - 20, 1.8, 0, 7);
      c.fill();
    }
  }

  private shadow(x: number, y: number, rx: number, ry: number) {
    const c = this.ctx;
    c.fillStyle = "rgba(17,17,17,.2)";
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, 7);
    c.fill();
  }

  private drawProp(o: Obstacle) {
    const c = this.ctx;
    const im = this.img(o.type === "tree" ? "tree" : "rock");
    if (!im) return;
    const w = o.s, h = (w * im.naturalHeight) / im.naturalWidth;
    this.shadow(o.x, o.y, w * 0.32, w * 0.09);
    c.save();
    c.translate(o.x, o.y);
    if (o.flip) c.scale(-1, 1);
    const sway = o.type === "tree" ? Math.sin(this.time * 1.2 + o.x) * 0.015 : 0;
    c.rotate(sway);
    c.drawImage(im, -w / 2, -h + 4, w, h);
    c.restore();
  }

  private drawMonster(m: Monster) {
    const c = this.ctx;
    const d = MDEF[m.kind];
    const idle = this.img(`m-${m.kind}-idle`);
    if (!idle) return;
    const k = d.w / idle.naturalWidth; // skala sama untuk semua pose
    const flip = d.face === 0 ? m.face : m.face === d.face ? 1 : -1;
    const age = this.time - m.born;
    const pop = Math.min(1, age / 0.35);

    // tahap: idle -> hurt (kena pukul / sisa nyawa <= 50%) -> dead
    let stage: "idle" | "hurt" | "dead" = "idle";
    if (m.dying > 0) stage = "dead";
    else if (m.hurt > 0 || m.hp <= m.maxHp / 2) stage = "hurt";
    const im = this.img(`m-${m.kind}-${stage}`) ?? idle;
    const w = im.naturalWidth * k, h = im.naturalHeight * k;

    // --- animasi prosedural dari satu gambar ---
    const mv = Math.min(1, (m.sp ?? 0) / d.speed); // 0 diam .. 1 jalan penuh
    const heavy = d.boss || d.speed < 80 ? 0.55 : 1; // monster berat melompat lebih kecil
    const wk = m.walk ?? m.phase;
    const step = Math.abs(Math.sin(wk)); // 0 = kaki menapak, 1 = di udara
    const breath = Math.sin(this.time * 2.6 + m.phase);
    m.fs = (m.fs ?? flip) + (flip - (m.fs ?? flip)) * Math.min(1, 0.45); // berbalik halus (menyempit saat memutar)
    const pops = pop < 1 ? 1 + Math.sin(pop * Math.PI) * 0.18 : 1; // muncul dengan memantul
    let sx = (1 + breath * 0.02 * (1 - mv) + (1 - step) * 0.05 * mv * heavy) * (0.4 + 0.6 * pop) * pops;
    let sy = (1 - breath * 0.03 * (1 - mv) - (1 - step) * 0.05 * mv * heavy + step * 0.04 * mv * heavy) * (0.4 + 0.6 * pop) * pops;
    let rot = Math.sin(wk) * 0.07 * mv * heavy + (m.lean ?? 0) * 0.09 * (flip === 0 ? 1 : 1) + (m.recoil ?? 0) * 0.16;
    let lift = step * h * 0.07 * mv * heavy;
    let alpha = 1;
    let shadowW = idle.naturalWidth * k * 0.36;
    if (stage === "dead") {
      const t = 1 - m.dying / DYING; // 0..1
      const drop = Math.min(1, t / 0.2); // jatuh
      const bounce = t > 0.2 && t < 0.4 ? Math.sin(((t - 0.2) / 0.2) * Math.PI) * 0.12 : 0;
      sx = 1 + (1 - drop) * 0.2 + bounce * 0.4;
      sy = 0.5 + 0.5 * drop + bounce;
      rot = (1 - drop) * -0.35 * (m.face || 1);
      lift = 0;
      if (t > 0.72) alpha = 1 - (t - 0.72) / 0.28;
      shadowW *= 1.1;
    } else if (stage === "hurt" && m.hurt > 0) {
      const t = Math.min(1, m.hurt / 0.18);
      sx *= 1 + t * 0.14;
      sy *= 1 - t * 0.14;
      lift = 0;
    }
    this.shadow(m.x, m.y, shadowW * sx * (1 - (lift / (h || 1)) * 2), idle.naturalWidth * k * 0.09);
    c.save();
    c.globalAlpha = alpha;
    c.translate(m.x, m.y + 6 - lift);
    if (stage === "hurt" && m.hurt > 0) c.translate((Math.random() - 0.5) * 7, 0);
    c.rotate(rot);
    c.scale(sx * m.fs, sy);
    c.drawImage(im, -w / 2, -h, w, h);
    if (stage === "hurt" && m.hurt > 0.08) {
      // kilat putih (hanya di piksel monster) saat terkena pukulan
      const f = (this.flash ??= document.createElement("canvas"));
      f.width = im.naturalWidth;
      f.height = im.naturalHeight;
      const fc = f.getContext("2d")!;
      fc.drawImage(im, 0, 0);
      fc.globalCompositeOperation = "source-atop";
      fc.fillStyle = "#fff";
      fc.fillRect(0, 0, f.width, f.height);
      c.globalAlpha = alpha * 0.6;
      c.drawImage(f, -w / 2, -h, w, h);
    }
    c.restore();
    c.globalAlpha = 1;
    if (m.dying === 0 && m.hp < m.maxHp) {
      const bw = Math.max(46, w * 0.5), bx = m.x - bw / 2, by = m.y - h - 10;
      c.fillStyle = "#fff";
      c.strokeStyle = INK;
      c.lineWidth = 3.5;
      c.fillRect(bx, by, bw, 10);
      c.fillStyle = "#ff4d4d";
      c.fillRect(bx + 1, by + 1, (bw - 2) * (m.hp / m.maxHp), 8);
      c.strokeRect(bx, by, bw, 10);
    }
  }

  private drawPlayer() {
    const c = this.ctx;
    const p = this.p;
    const S = this.sprites;
    if (!S["k-body"]) return;
    const sc = 134 / 190; // tinggi ksatria ~134px
    const horiz = Math.min(1, Math.abs(p.vx) / 200);
    const vert = Math.min(1, Math.abs(p.vy) / 200);
    const sn = Math.sin(p.walk);
    const moving = p.speed > 28 ? Math.min(1, p.speed / 160) : 0;
    const idle = Math.sin(this.time * 2.3);
    const flick = p.inv > 0 && Math.floor(p.inv * 14) % 2 === 0;

    // serangan: tarik ke belakang -> hentakan -> pulih
    let t = -1;
    if (p.swing >= 0) t = Math.min(1, p.swing / 0.3);
    const wind = t >= 0 ? Math.min(1, t / 0.25) : 0;
    const strike = t >= 0 ? Math.max(0, Math.min(1, (t - 0.25) / 0.45)) : 0;
    const lunge = t >= 0 ? Math.sin(Math.min(1, t * 1.15) * Math.PI) * 16 : 0;

    const bob = -Math.abs(sn) * 6 * moving + idle * 1.2 * (1 - moving);
    const lean = (p.vx / 255) * 0.14 * p.side + sn * 0.035 * moving + (t >= 0 ? -0.12 * wind + 0.2 * strike : 0);
    const squashY = 1 + (t >= 0 ? -0.05 * strike : 0) + idle * 0.012 * (1 - moving) - Math.abs(sn) * 0.02 * moving;

    this.shadow(p.x + (t >= 0 ? p.fx * lunge * 0.6 : 0), p.y, 36 - Math.abs(bob) * 0.8, 10);

    c.save();
    if (flick) c.globalAlpha = 0.4;
    c.translate(p.x + (t >= 0 ? p.fx * lunge : 0), p.y + (t >= 0 ? p.fy * lunge * 0.5 : 0));
    c.scale(sc * p.sx, sc);
    c.translate(-60, -184);

    const put = (name: string, px: number, py: number, ang: number, oy = 0) => {
      c.save();
      c.translate(px, py + oy);
      c.rotate(ang);
      c.translate(-px, -py);
      c.drawImage(S[name], -10, -10, 140, 210);
      c.restore();
    };

    const legAmp = 0.5 * (0.35 + 0.65 * horiz) * moving;
    const lift = 10 * (0.4 + 0.6 * vert) * moving;
    put("k-legL", 49, 124, sn * legAmp, -Math.max(0, sn) * lift);
    put("k-legR", 71, 124, -sn * legAmp, -Math.max(0, -sn) * lift);

    // badan + kepala bergoyang dari pinggul
    c.save();
    c.translate(60, 126);
    c.rotate(lean);
    c.scale(1, squashY);
    c.translate(-60, -126 + bob);
    c.drawImage(S["k-body"], -10, -10, 140, 210);

    const armL = -sn * 0.55 * moving + idle * 0.05 * (1 - moving) + (t >= 0 ? -0.6 * wind + 0.9 * strike : 0);
    put("k-armL", 28, 86, armL);

    let armR = sn * 0.55 * moving - idle * 0.05 * (1 - moving);
    if (t >= 0) armR = -2.7 * wind + (1 - wind) * (-2.7 + 3.4 * Math.pow(strike, 0.7));
    c.save();
    c.translate(92, 86);
    c.rotate(armR);
    c.translate(-92, -86);
    c.drawImage(S["k-armR"], -10, -10, 140, 210);
    if (t < 0) {
      // pedang tergenggam di tangan kanan saat tidak menyerang
      c.translate(98, 132);
      this.blade(0, 0, Math.PI / 2 + 0.28, 74);
    }
    c.restore();
    c.restore();
    c.restore();

    if (t >= 0) this.drawSlash(t);
  }

  private drawSlash(t: number) {
    const c = this.ctx;
    const p = this.p;
    const cx = p.x, cy = p.y - 70;
    const fa = Math.atan2(p.fy, p.fx);
    const a0 = fa - 1.55, a1 = fa + 1.55;
    const e = 1 - Math.pow(1 - Math.min(1, t * 1.3), 3);
    const a = a0 + (a1 - a0) * e;
    c.save();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.globalAlpha = Math.max(0, 1 - Math.max(0, t - 0.45) * 1.8);
    for (const [r, lw, col] of [[104, 20, INK], [104, 11, "#fff"], [88, 5, MARKER]] as const) {
      c.beginPath();
      c.arc(cx, cy, r, a0 + 0.25 * e, a);
      c.strokeStyle = col;
      c.lineWidth = lw;
      c.stroke();
    }
    c.globalAlpha = 1;
    this.blade(cx + Math.cos(a) * 24, cy + Math.sin(a) * 24, a, 84);
    c.restore();
  }

  private blade(x: number, y: number, a: number, len: number) {
    const c = this.ctx;
    const dx = Math.cos(a), dy = Math.sin(a);
    const nx = -dy, ny = dx;
    // gagang & pelindung
    c.strokeStyle = INK;
    c.lineWidth = 12;
    c.beginPath();
    c.moveTo(x - dx * 14, y - dy * 14);
    c.lineTo(x, y);
    c.stroke();
    c.strokeStyle = "#8a5a2b";
    c.lineWidth = 6;
    c.stroke();
    // bilah
    c.beginPath();
    c.moveTo(x + nx * 7, y + ny * 7);
    c.lineTo(x + dx * len + nx * 5, y + dy * len + ny * 5);
    c.lineTo(x + dx * (len + 14), y + dy * (len + 14));
    c.lineTo(x + dx * len - nx * 5, y + dy * len - ny * 5);
    c.lineTo(x - nx * 7, y - ny * 7);
    c.closePath();
    c.fillStyle = "#e6ecf1";
    c.strokeStyle = INK;
    c.lineWidth = 4;
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(x + dx * 8, y + dy * 8);
    c.lineTo(x + dx * (len - 6), y + dy * (len - 6));
    c.strokeStyle = "#fff";
    c.lineWidth = 2.5;
    c.stroke();
    // pelindung
    c.beginPath();
    c.moveTo(x + nx * 16, y + ny * 16);
    c.lineTo(x - nx * 16, y - ny * 16);
    c.strokeStyle = INK;
    c.lineWidth = 11;
    c.stroke();
    c.strokeStyle = MARKER;
    c.lineWidth = 5;
    c.stroke();
  }

  /** Panah di tepi layar yang menunjuk ke monster terdekat. */
  private drawArrow(vw: number, vh: number) {
    const alive = this.monsters.filter((m) => m.dying === 0);
    if (!alive.length) return;
    let best = alive[0], bd = Infinity;
    for (const m of alive) {
      const d = Math.hypot(m.x - this.p.x, m.y - this.p.y);
      if (d < bd) {
        bd = d;
        best = m;
      }
    }
    const bq = this.proj(best.x, best.y);
    const sx = (bq.x - this.camX) * this.zoom, sy = (bq.y - 30 * bq.s - this.camY) * this.zoom;
    const pad = 54;
    if (sx > 0 && sx < this.cssW && sy > 0 && sy < this.cssH) return;
    const cx = this.cssW / 2, cy = this.cssH / 2;
    const a = Math.atan2(sy - cy, sx - cx);
    const k = Math.min((cx - pad) / Math.abs(Math.cos(a) || 1e-6), (cy - pad) / Math.abs(Math.sin(a) || 1e-6));
    const ax = cx + Math.cos(a) * k, ay = cy + Math.sin(a) * k;
    const c = this.ctx;
    c.save();
    c.translate(ax, ay);
    c.rotate(a);
    const pulse = 1 + Math.sin(this.time * 6) * 0.08;
    c.scale(pulse, pulse);
    c.beginPath();
    c.moveTo(18, 0);
    c.lineTo(-12, -15);
    c.lineTo(-5, 0);
    c.lineTo(-12, 15);
    c.closePath();
    c.fillStyle = MARKER;
    c.strokeStyle = INK;
    c.lineWidth = 4;
    c.lineJoin = "round";
    c.fill();
    c.stroke();
    c.restore();
    c.font = "18px 'Patrick Hand', cursive";
    c.textAlign = "center";
    c.fillStyle = INK;
    c.lineWidth = 5;
    c.strokeStyle = "#fff";
    const label = `${Math.round(bd / 100)}m`;
    c.strokeText(label, ax - Math.cos(a) * 34, ay - Math.sin(a) * 34 + 6);
    c.fillText(label, ax - Math.cos(a) * 34, ay - Math.sin(a) * 34 + 6);
  }

  private drawMinimap() {
    const c = this.ctx;
    const mw = this.cssW < 600 ? 110 : 168;
    const mh = (mw * WORLD_H) / WORLD_W;
    const x = this.cssW - mw - 14, y = this.cssW < 600 ? 66 : 76;
    const k = mw / WORLD_W;
    c.save();
    c.fillStyle = "rgba(0,0,0,.18)";
    c.fillRect(x + 4, y + 5, mw, mh);
    if (this.miniBg) c.drawImage(this.miniBg, x, y, mw, mh);
    c.strokeStyle = INK;
    c.lineWidth = 3.5;
    c.strokeRect(x, y, mw, mh);
    for (const m of this.monsters) {
      if (m.dying) continue;
      c.fillStyle = MDEF[m.kind].boss ? "#ff4d4d" : INK;
      c.beginPath();
      c.arc(x + m.x * k, y + m.y * k, MDEF[m.kind].boss ? 3.8 : 2.4, 0, 7);
      c.fill();
    }
    c.strokeStyle = "rgba(17,17,17,.6)";
    c.lineWidth = 1.5;
    c.strokeRect(x + this.camX * k, y + this.camY * k, (this.cssW / this.zoom) * k, (this.cssH / this.zoom) * k);
    c.fillStyle = MARKER;
    c.strokeStyle = INK;
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(x + this.p.x * k, y + this.p.y * k, 4.5, 0, 7);
    c.fill();
    c.stroke();
    c.restore();
  }
}
