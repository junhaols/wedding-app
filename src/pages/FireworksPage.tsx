import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ===================== LOVE LETTER =====================

const LOVE_LETTER = [
  '亲爱的',
  '遇见你 是此生最大的幸运',
  '你的笑容 如夜空最亮的星',
  '你的温柔 是我永远的归宿',
  '余生漫漫',
  '我想永远牵着你的手',
  '我爱你',
  '今天 明天 永永远远',
];

// ===================== PALETTE =====================

const PALETTES = [
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],
  ['#00bfff', '#87ceeb', '#b0e0e6', '#7ec8e3'],
  ['#ff6b6b', '#ff8e8e', '#ffa07a', '#ffc4a3'],
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],
  ['#ffd700', '#ff69b4', '#fffacd', '#ffb6c1'],
  ['#ff1493', '#ff69b4', '#ff007f', '#ff85c8'],
  ['#ffd700', '#fffacd', '#fff8dc', '#ffed4a'],
];

// ===================== AMBIENT FIREWORK TYPES =====================

type AmbientType = 'peony' | 'chrysanthemum' | 'willow' | 'crossette' | 'palm' | 'brocade';

const A_CFG: Record<AmbientType, {
  n: [number, number]; drag: number; spd: [number, number];
  trail: number; life: [number, number]; grav: number; splits?: number;
}> = {
  peony:         { n: [60, 90],  drag: .965, spd: [3, 7],  trail: 6,  life: [1.6, 2.4], grav: .15 },
  chrysanthemum: { n: [90, 130], drag: .985, spd: [4, 8],  trail: 12, life: [2.2, 3.2], grav: .10 },
  willow:        { n: [70, 100], drag: .993, spd: [3, 6],  trail: 16, life: [2.8, 4.2], grav: .22 },
  crossette:     { n: [16, 22],  drag: .970, spd: [4, 7],  trail: 5,  life: [1.0, 1.6], grav: .15, splits: 5 },
  palm:          { n: [28, 40],  drag: .975, spd: [6, 11], trail: 9,  life: [1.8, 2.8], grav: .15 },
  brocade:       { n: [100,160], drag: .993, spd: [2, 5],  trail: 14, life: [3.0, 4.5], grav: .25 },
};

const A_TYPES: AmbientType[] = ['peony', 'chrysanthemum', 'willow', 'crossette', 'palm', 'brocade'];

// ===================== TIMING (ms) =====================

const T_ROCKET  = 900;
const T_SCATTER = 650;
const T_FORM    = 1400;
const T_DISPLAY = 2800;
const T_FADE    = 900;
const T_PAUSE   = 500;

const MAX_P     = 480;
const GAP_D     = 3;
const GAP_M     = 4;
const N_STARS   = 80;
const WIND      = .015;

// ===================== TYPES =====================

interface APart {
  x: number; y: number; vx: number; vy: number;
  color: string; alpha: number;
  sz: number; baseSz: number;
  life: number; maxLife: number;
  drag: number; grav: number;
  trail: number[]; // flat [x,y,x,y,...] for perf
  trailMax: number;
  canSplit: boolean; hasSplit: boolean; splitN: number;
}

interface ABurst {
  particles: APart[];
  palette: string[];
}

interface TPart {
  x: number; y: number; vx: number; vy: number;
  tx: number; ty: number;
  sx: number; sy: number;
  color: string; alpha: number;
  sz: number; shimmer: number;
  trail: number[];
}

interface Flash { x: number; y: number; a: number; r: number; color: string; }
interface Ring  { x: number; y: number; r: number; mr: number; a: number; color: string; w: number; }
interface Star  { x: number; y: number; r: number; sp: number; ph: number; }

type Phase = 'idle' | 'rocket' | 'scatter' | 'form' | 'display' | 'fade';

interface S {
  line: number; phase: Phase; t: number;
  rx: number; ry: number; rsy: number; rty: number;
  rTrail: number[]; // flat [x,y,a, x,y,a, ...]
  ex: number; ey: number;
  pal: string[];
  parts: TPart[];
  flashes: Flash[]; rings: Ring[];
  ambients: ABurst[];
  aTimer: number;
  stars: Star[];
}

// ===================== HELPERS =====================

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const rand  = (a: number, b: number) => a + Math.random() * (b - a);
const pick  = <T,>(a: T[]): T => a[~~(Math.random() * a.length)];

function easeOutCubic(t: number)  { return 1 - (1 - t) ** 3; }
function easeInOutQuad(t: number) { return t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; }

function sampleText(text: string, fs: number, cx: number, cy: number, gap: number) {
  const c = document.createElement('canvas');
  const x = c.getContext('2d')!;
  x.font = `bold ${fs}px "Ma Shan Zheng","ZCOOL XiaoWei","Noto Serif SC",serif`;
  const tw = x.measureText(text).width;
  c.width = ~~tw + 40; c.height = ~~(fs * 1.4) + 20;
  x.font = `bold ${fs}px "Ma Shan Zheng","ZCOOL XiaoWei","Noto Serif SC",serif`;
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(text, c.width / 2, c.height / 2);
  const d = x.getImageData(0, 0, c.width, c.height);
  const pts: { x: number; y: number }[] = [];
  const ox = cx - c.width / 2, oy = cy - c.height / 2;
  for (let py = 0; py < c.height; py += gap)
    for (let px = 0; px < c.width; px += gap)
      if (d.data[(py * c.width + px) * 4 + 3] > 128)
        pts.push({ x: ox + px, y: oy + py });
  if (pts.length > MAX_P) { pts.sort(() => Math.random() - .5); pts.length = MAX_P; }
  return pts;
}

function fitFont(text: string, mw: number, mob: boolean): number {
  const c = document.createElement('canvas');
  const x = c.getContext('2d')!;
  let s = mob ? 36 : 58;
  x.font = `bold ${s}px "Ma Shan Zheng",serif`;
  while (x.measureText(text).width > mw * .8 && s > 18) { s -= 2; x.font = `bold ${s}px "Ma Shan Zheng",serif`; }
  return s;
}

function mkStars(w: number, h: number): Star[] {
  return Array.from({ length: N_STARS }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: rand(.5, 1.8), sp: rand(.4, 1.8), ph: Math.random() * Math.PI * 2,
  }));
}

// Create an ambient firework burst
function mkAmbient(w: number, h: number, avoidCenter: boolean): ABurst {
  const type = pick(A_TYPES);
  const cfg = A_CFG[type];
  const palette = pick(PALETTES);
  let bx: number, by: number;
  if (avoidCenter) {
    bx = Math.random() > .5 ? rand(w * .05, w * .28) : rand(w * .72, w * .95);
    by = rand(h * .08, h * .5);
  } else {
    bx = rand(w * .1, w * .9); by = rand(h * .08, h * .55);
  }
  const n = ~~rand(cfg.n[0], cfg.n[1]);
  const particles: APart[] = [];
  for (let i = 0; i < n; i++) {
    let a = Math.random() * Math.PI * 2;
    // Palm: bias upward
    if (type === 'palm') a = -Math.PI / 2 + rand(-.8, .8);
    const spd = rand(cfg.spd[0], cfg.spd[1]) * (1 + rand(-.15, .15));
    particles.push({
      x: bx, y: by,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
      color: pick(palette), alpha: 1,
      sz: rand(1.2, 2.5), baseSz: rand(1.2, 2.5),
      life: rand(cfg.life[0], cfg.life[1]),
      maxLife: rand(cfg.life[0], cfg.life[1]),
      drag: cfg.drag, grav: cfg.grav,
      trail: [], trailMax: cfg.trail,
      canSplit: !!cfg.splits, hasSplit: false, splitN: cfg.splits || 0,
    });
    particles[particles.length - 1].maxLife = particles[particles.length - 1].life;
  }
  return { particles, palette };
}

// ===================== COMPONENT =====================

const FireworksPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef(0);
  const timerRef  = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [show, setShow] = useState<'start' | 'playing' | 'end'>('start');

  const startShow = useCallback(() => setShow('playing'), []);
  const replay = useCallback(() => { setShow('start'); setTimeout(() => setShow('playing'), 120); }, []);

  useEffect(() => {
    if (show !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const mob = () => W() < 768;

    const resize = () => {
      canvas.width = W() * dpr; canvas.height = H() * dpr;
      canvas.style.width = `${W()}px`; canvas.style.height = `${H()}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.stars = mkStars(W(), H());
    };

    const s: S = {
      line: 0, phase: 'idle', t: 0,
      rx: 0, ry: 0, rsy: 0, rty: 0, rTrail: [],
      ex: 0, ey: 0, pal: PALETTES[0],
      parts: [], flashes: [], rings: [],
      ambients: [], aTimer: rand(.5, 1.2),
      stars: mkStars(W(), H()),
    };
    resize();

    const setPhase = (p: Phase) => { s.phase = p; s.t = 0; };

    // ---------- Launch text firework ----------
    function launch() {
      if (s.line >= LOVE_LETTER.length) { setShow('end'); return; }
      const text = LOVE_LETTER[s.line];
      const fs = fitFont(text, W(), mob());
      const gap = mob() ? GAP_M : GAP_D;
      const cx = W() / 2, cy = H() * .38;
      const pal = PALETTES[s.line % PALETTES.length];
      const pts = sampleText(text, fs, cx, cy, gap);

      s.ex = cx + rand(-25, 25); s.ey = cy;
      s.pal = pal;
      s.rx = W() / 2 + rand(-40, 40);
      s.rsy = H() + 10; s.ry = s.rsy; s.rty = cy;
      s.rTrail = [];

      s.parts = pts.map(p => {
        const a = Math.random() * Math.PI * 2;
        const spd = rand(3, 8);
        return {
          x: s.ex, y: s.ey,
          vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          tx: p.x, ty: p.y,
          sx: 0, sy: 0,
          color: pick(pal), alpha: 1,
          sz: rand(1.5, 2.8), shimmer: Math.random() * Math.PI * 2,
          trail: [],
        };
      });
      setPhase('rocket');
    }

    const startTimer = setTimeout(launch, 600);
    let last = performance.now();

    // ==================== UPDATE ====================

    function updateAmbientParticle(p: APart, dt: number, newParts: APart[], palette: string[]) {
      // Trail (store x,y pairs flat)
      if (p.trailMax > 0) {
        p.trail.push(p.x, p.y);
        if (p.trail.length > p.trailMax * 2) { p.trail.splice(0, 2); }
      }

      // Physics: drag, gravity, wind
      const df = Math.pow(p.drag, dt * 60);
      p.vx *= df; p.vy *= df;
      p.vy += p.grav * dt * 60;
      p.vx += WIND * dt * 60;
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      // Life
      p.life -= dt;
      const lr = clamp(p.life / p.maxLife);

      // Alpha lifecycle: flash → full → dim → flicker → dead
      if (lr > .9) {
        p.alpha = 1;
      } else if (lr > .3) {
        p.alpha = .75 + .25 * ((lr - .3) / .6);
      } else {
        p.alpha = (lr / .3) * .75;
        // Flicker in ember phase
        if (lr < .12 && Math.random() > .6) p.alpha *= rand(.2, .8);
      }

      // Size shrink
      p.sz = p.baseSz * (.3 + .7 * lr);

      // Crossette split
      if (p.canSplit && !p.hasSplit && lr < .45) {
        p.hasSplit = true;
        for (let j = 0; j < p.splitN; j++) {
          const a = Math.random() * Math.PI * 2;
          const spd = rand(2, 5);
          newParts.push({
            x: p.x, y: p.y,
            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
            color: pick(palette), alpha: 1,
            sz: p.baseSz * .7, baseSz: p.baseSz * .7,
            life: rand(.7, 1.4), maxLife: rand(.7, 1.4),
            drag: .96, grav: .15,
            trail: [], trailMax: 5,
            canSplit: false, hasSplit: false, splitN: 0,
          });
          newParts[newParts.length - 1].maxLife = newParts[newParts.length - 1].life;
        }
      }

      // Crackle sparks at end of life
      if (lr < .08 && Math.random() > .88) {
        for (let j = 0; j < ~~rand(2, 4); j++) {
          newParts.push({
            x: p.x + rand(-2, 2), y: p.y + rand(-2, 2),
            vx: rand(-1.5, 1.5), vy: rand(-2.5, .5),
            color: '#fff', alpha: 1,
            sz: rand(.4, 1.2), baseSz: rand(.4, 1.2),
            life: rand(.04, .12), maxLife: .12,
            drag: .98, grav: .1,
            trail: [], trailMax: 0,
            canSplit: false, hasSplit: false, splitN: 0,
          });
          newParts[newParts.length - 1].maxLife = newParts[newParts.length - 1].life;
        }
      }
    }

    function update(dt: number) {
      s.t += dt * 1000;

      // ---- Ambient fireworks ----
      s.aTimer -= dt;
      if (s.aTimer <= 0 && s.ambients.length < 4) {
        const ab = mkAmbient(W(), H(), s.phase !== 'idle');
        s.ambients.push(ab);
        const fp = ab.particles[0];
        if (fp) {
          s.flashes.push({ x: fp.x, y: fp.y, a: .7, r: 12, color: '#fff' });
          s.flashes.push({ x: fp.x, y: fp.y, a: .5, r: 6, color: pick(ab.palette) });
          s.rings.push({ x: fp.x, y: fp.y, r: 4, mr: rand(50, 90), a: .5, color: pick(ab.palette), w: 1.5 });
        }
        s.aTimer = rand(1.0, 2.5);
      }

      for (let i = s.ambients.length - 1; i >= 0; i--) {
        const ab = s.ambients[i];
        const newParts: APart[] = [];
        for (let j = ab.particles.length - 1; j >= 0; j--) {
          updateAmbientParticle(ab.particles[j], dt, newParts, ab.palette);
          if (ab.particles[j].life <= 0) ab.particles.splice(j, 1);
        }
        ab.particles.push(...newParts);
        if (ab.particles.length === 0) s.ambients.splice(i, 1);
      }

      // ---- Flashes ----
      for (let i = s.flashes.length - 1; i >= 0; i--) {
        const f = s.flashes[i];
        f.a -= 4 * dt; f.r += 250 * dt;
        if (f.a <= 0) s.flashes.splice(i, 1);
      }

      // ---- Rings ----
      for (let i = s.rings.length - 1; i >= 0; i--) {
        const r = s.rings[i];
        r.r += (r.mr - r.r) * 4 * dt;
        r.a -= 1.5 * dt;
        if (r.a <= 0) s.rings.splice(i, 1);
      }

      // ---- Main text firework ----
      switch (s.phase) {
        case 'rocket': {
          const p = clamp(s.t / T_ROCKET);
          const wobble = Math.sin(s.t * .02) * 2;
          s.ry = lerp(s.rsy, s.rty, easeOutCubic(p));
          // Rocket trail (store x,y,alpha triples)
          s.rTrail.push(s.rx + wobble, s.ry, 1);
          if (s.rTrail.length > 60) s.rTrail.splice(0, 3);
          // Fade old trail
          for (let i = 0; i < s.rTrail.length; i += 3) s.rTrail[i + 2] *= .92;

          if (p >= 1) {
            // Explosion effects
            s.flashes.push({ x: s.ex, y: s.ey, a: 1, r: 15, color: '#fff' });
            s.flashes.push({ x: s.ex, y: s.ey, a: .8, r: 8, color: s.pal[0] });
            s.rings.push({ x: s.ex, y: s.ey, r: 5, mr: rand(130, 200), a: .9, color: s.pal[0], w: 2.5 });
            s.rings.push({ x: s.ex, y: s.ey, r: 5, mr: rand(80, 130), a: .6, color: s.pal[1] || s.pal[0], w: 1.5 });
            s.rTrail = [];
            setPhase('scatter');
          }
          break;
        }

        case 'scatter': {
          // Physics-based scatter: particles fly outward with gravity + drag
          const p = clamp(s.t / T_SCATTER);
          for (const pt of s.parts) {
            // Trail during scatter
            pt.trail.push(pt.x, pt.y);
            if (pt.trail.length > 12) pt.trail.splice(0, 2);

            const df = Math.pow(.96, dt * 60);
            pt.vx *= df; pt.vy *= df;
            pt.vy += .12 * dt * 60; // gravity
            pt.vx += WIND * dt * 60;
            pt.x += pt.vx * dt * 60;
            pt.y += pt.vy * dt * 60;
          }
          if (p >= 1) {
            // Snapshot scatter-end positions
            for (const pt of s.parts) { pt.sx = pt.x; pt.sy = pt.y; pt.trail = []; }
            setPhase('form');
          }
          break;
        }

        case 'form': {
          const p = clamp(s.t / T_FORM);
          const e = easeInOutQuad(p);
          for (const pt of s.parts) {
            // Trail during formation (light effect)
            if (p < .8) { pt.trail.push(pt.x, pt.y); if (pt.trail.length > 8) pt.trail.splice(0, 2); }
            pt.x = lerp(pt.sx, pt.tx, e);
            pt.y = lerp(pt.sy, pt.ty, e);
            pt.alpha = .5 + .5 * e;
          }
          if (p >= 1) { for (const pt of s.parts) pt.trail = []; setPhase('display'); }
          break;
        }

        case 'display': {
          const now = performance.now() / 1000;
          for (const pt of s.parts) {
            pt.x = pt.tx + Math.sin(now * 2 + pt.shimmer) * .5;
            pt.y = pt.ty + Math.cos(now * 2.5 + pt.shimmer) * .5;
            pt.alpha = .85 + .15 * Math.sin(now * 3 + pt.shimmer);
          }
          // Random sparkle
          if (Math.random() > .8) {
            const rp = s.parts[~~(Math.random() * s.parts.length)];
            if (rp) {
              const ab = mkCrackle(rp.x, rp.y, '#fff');
              if (s.ambients.length < 6) s.ambients.push({ particles: [ab], palette: ['#fff'] });
            }
          }
          if (s.t >= T_DISPLAY) setPhase('fade');
          break;
        }

        case 'fade': {
          const p = clamp(s.t / T_FADE);
          for (const pt of s.parts) {
            // Physics: fall with gravity + trail
            pt.trail.push(pt.x, pt.y);
            if (pt.trail.length > 8) pt.trail.splice(0, 2);
            pt.vy += .08 * dt * 60;
            pt.x += (pt.vx * .2 + WIND) * dt * 60;
            pt.y += pt.vy * dt * 60;
            pt.alpha = 1 - p;
            pt.sz *= .998;
          }
          if (p >= 1) {
            s.line++;
            setPhase('idle');
            timerRef.current = setTimeout(launch, T_PAUSE);
          }
          break;
        }
      }
    }

    function mkCrackle(x: number, y: number, color: string): APart {
      return {
        x, y, vx: rand(-1, 1), vy: rand(-2, -.5),
        color, alpha: 1, sz: rand(.5, 1.5), baseSz: 1,
        life: rand(.08, .2), maxLife: .2,
        drag: .98, grav: .05,
        trail: [], trailMax: 0,
        canSplit: false, hasSplit: false, splitN: 0,
      };
    }

    // ==================== RENDER ====================

    function render(now: number) {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Sky gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#050510');
      bg.addColorStop(.5, '#0a0a1f');
      bg.addColorStop(1, '#0f0f2d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Stars
      const nt = now / 1000;
      for (const st of s.stars) {
        ctx.globalAlpha = .3 + .7 * (.5 + .5 * Math.sin(nt * st.sp + st.ph));
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ---- Ambient firework trails + particles (additive) ----
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const ab of s.ambients) {
        for (const p of ab.particles) {
          if (p.life <= 0) continue;
          const lr = clamp(p.life / p.maxLife);

          // Trails
          const tl = p.trail;
          const tn = tl.length / 2;
          if (tn > 1) {
            for (let j = 0; j < tl.length - 2; j += 2) {
              const ti = j / 2;
              const ta = (ti / tn) * clamp(p.alpha) * .35;
              const tsz = p.sz * (.3 + .7 * ti / tn) * .6;
              ctx.globalAlpha = ta;
              ctx.fillStyle = p.color;
              ctx.beginPath(); ctx.arc(tl[j], tl[j + 1], tsz, 0, Math.PI * 2); ctx.fill();
            }
          }

          // White flash overlay for new particles
          if (lr > .88) {
            ctx.globalAlpha = (lr - .88) / .12 * p.alpha;
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 1.8, 0, Math.PI * 2); ctx.fill();
          }

          // Core glow
          ctx.globalAlpha = clamp(p.alpha * .25);
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 3, 0, Math.PI * 2); ctx.fill();

          // Particle body
          ctx.globalAlpha = clamp(p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();

          // Hot white center
          if (lr > .4) {
            ctx.globalAlpha = clamp(p.alpha * .5 * ((lr - .4) / .6));
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * .4, 0, Math.PI * 2); ctx.fill();
          }

          // Ember warm tint for dying particles
          if (lr < .15) {
            ctx.globalAlpha = clamp((1 - lr / .15) * p.alpha * .4);
            ctx.fillStyle = '#ff6a00';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 1.2, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      ctx.restore();

      // ---- Flashes ----
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const f of s.flashes) {
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, f.color); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = clamp(f.a);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // ---- Rings ----
      for (const r of s.rings) {
        ctx.globalAlpha = clamp(r.a);
        ctx.strokeStyle = r.color; ctx.lineWidth = r.w;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ---- Rocket ----
      if (s.phase === 'rocket') {
        // Rocket trail
        const rt = s.rTrail;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < rt.length; i += 3) {
          const ta = rt[i + 2] * .6;
          if (ta < .01) continue;
          ctx.globalAlpha = ta;
          ctx.fillStyle = s.pal[0];
          const tsz = 1 + ta * 3;
          ctx.beginPath(); ctx.arc(rt[i], rt[i + 1], tsz, 0, Math.PI * 2); ctx.fill();
        }
        // Rocket head
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.rx + Math.sin(s.t * .02) * 2, s.ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Glow around head
        ctx.globalAlpha = .5;
        ctx.fillStyle = s.pal[0];
        ctx.beginPath();
        ctx.arc(s.rx + Math.sin(s.t * .02) * 2, s.ry, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ---- Text particles ----
      if (s.phase !== 'idle' && s.phase !== 'rocket') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Trails (scatter, form, fade phases)
        for (const pt of s.parts) {
          const tl = pt.trail;
          const tn = tl.length / 2;
          if (tn > 1) {
            for (let j = 0; j < tl.length - 2; j += 2) {
              const ti = j / 2;
              const ta = (ti / tn) * clamp(pt.alpha) * .3;
              ctx.globalAlpha = ta;
              ctx.fillStyle = pt.color;
              const tsz = pt.sz * .5;
              ctx.beginPath(); ctx.arc(tl[j], tl[j + 1], tsz, 0, Math.PI * 2); ctx.fill();
            }
          }
        }

        // Glow pass
        if (s.phase === 'display' || s.phase === 'form') {
          for (const pt of s.parts) {
            ctx.globalAlpha = clamp(pt.alpha * .12);
            ctx.fillStyle = pt.color;
            ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz * 3, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.restore();

        // Clear text rendering for legibility
        if (s.phase === 'display' || (s.phase === 'form' && s.t > T_FORM * .7)) {
          const text = LOVE_LETTER[s.line];
          if (text) {
            const fs = fitFont(text, w, mob());
            const mc = s.pal[0];
            const ta = s.phase === 'display' ? .5 : .2;
            ctx.save();
            ctx.font = `bold ${fs}px "Ma Shan Zheng","ZCOOL XiaoWei","Noto Serif SC",serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const tx = w / 2, ty = h * .38;
            ctx.globalAlpha = ta * .4;
            ctx.shadowColor = mc; ctx.shadowBlur = 35;
            ctx.fillStyle = mc;
            ctx.fillText(text, tx, ty);
            ctx.globalAlpha = ta * .7;
            ctx.shadowBlur = 14;
            ctx.fillText(text, tx, ty);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = ta;
            ctx.fillStyle = '#fff';
            ctx.fillText(text, tx, ty);
            ctx.restore();
          }
        }

        // Core particles + white center
        for (const pt of s.parts) {
          const a = clamp(pt.alpha);
          ctx.globalAlpha = a;
          ctx.fillStyle = pt.color;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2); ctx.fill();
          if (s.phase === 'display' || s.phase === 'form') {
            ctx.globalAlpha = a * .55;
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz * .4, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      // Progress
      ctx.globalAlpha = .2;
      ctx.fillStyle = '#fff';
      ctx.font = '12px "Noto Sans SC",sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.fillText(`${Math.min(s.line + 1, LOVE_LETTER.length)} / ${LOVE_LETTER.length}`, w - 16, h - 16);
      ctx.globalAlpha = 1;
    }

    // ==================== LOOP ====================

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, .05);
      last = now;
      update(dt); render(now);
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [show]);

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    cancelAnimationFrame(animRef.current);
    setShow('end');
  }, []);

  // ===================== JSX =====================

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-night-950"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <Link
        to="/"
        className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>

      {show === 'playing' && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/40 text-xs hover:text-white/70 transition-colors"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
          onClick={skip}
        >跳过</motion.button>
      )}

      <AnimatePresence>
        {show === 'start' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.h2 className="text-2xl md:text-4xl font-elegant text-star-gold text-glow mb-6"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .3 }}>
              烟花情书
            </motion.h2>
            <motion.p className="text-white/40 text-sm mb-8"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .5 }}>
              点亮夜空，写下心中的话
            </motion.p>
            <motion.button
              className="px-8 py-3 rounded-full bg-gradient-to-r from-star-gold/20 to-love-pink/20 border border-star-gold/30 text-star-gold hover:border-star-gold/60 hover:shadow-glow-gold transition-all duration-300"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
              onClick={startShow}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .7 }}>
              开始烟花秀
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show === 'end' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-y-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <div className="absolute inset-0 bg-night-950/85 backdrop-blur-sm" />
            <motion.div className="relative max-w-lg w-full px-8 py-12 text-center flex flex-col items-center">
              {LOVE_LETTER.map((line, i) => (
                <motion.p key={i}
                  className={`font-elegant leading-relaxed ${
                    line === '我爱你' ? 'text-2xl md:text-4xl text-love-pink text-glow-pink my-4'
                    : i === 0 ? 'text-xl md:text-2xl text-star-gold text-glow mb-6'
                    : i === LOVE_LETTER.length - 1 ? 'text-base md:text-lg text-star-gold/80 mt-3'
                    : 'text-base md:text-lg text-white/70 my-1.5'
                  }`}
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: .4 + i * .18, duration: .6 }}>
                  {line}
                </motion.p>
              ))}
              <motion.div className="flex gap-4 mt-10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: .4 + LOVE_LETTER.length * .18 + .5 }}>
                <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-star-gold/20 to-love-pink/20 border border-star-gold/30 text-star-gold text-sm hover:border-star-gold/60 hover:shadow-glow-gold transition-all duration-300"
                  onClick={replay}>再看一次</button>
                <Link to="/"
                  className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/30 transition-all duration-300">
                  回到首页
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FireworksPage;
