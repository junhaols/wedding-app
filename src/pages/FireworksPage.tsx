import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { assetUrl } from '../utils/assets';

// ===================== LOVE LETTER + PROPOSAL =====================

const LOVE_LETTER = [
  '亲爱的思宝',
  '从理科一班的初次相遇',
  '到北京城里的相依相伴',
  '我们',
  '是朋友更是知己',
  '铭记',
  '2019年7月20日 我们正式在一起',
  '自此，这一天于我们而言',
  '有了非凡意义',
  '七年的时光 如白驹过隙 忽然而已',
  '借此机会，我想对你说三个词',
  '第一个词：对不起',
  '这些年 因为我的不成熟',
  '给你带来了很多不愉快回忆',
  '第二个词：谢谢你',
  '感谢这些年的陪伴和包容',
  '理解与支持、等待与坚守',
  '我无数次地惹你生气',
  '你依然选择包容我、理解我',
  '帮我分析问题、解决问题',
  '读博的那几年，我们异地',
  '也是我的至暗时刻',
  '你人生中最宝贵的青春',
  '恰恰用来等我毕业，陪我成长',
  '谢谢你的信任和支持',
  '谢谢你的不离不弃',
  '第三个词：相信我',
  '一定：',
  '以最快的速度，改掉自身的坏毛病',
  '不再惹你生气',
  '以积极的心态，学习做饭、研究摄影',
  '化身你的专属大厨和摄影师',
  '记录生活中，最美的你',
  '以坚定的意志，运动健身',
  '成为更好的自己，向你看齐',
  '以科学的理念，自我提升',
  '规划未来，经营小家',
  '未来',
  '想和你，携手同行、探索世界',
  '此刻，想争取一个机会',
  '认真生活，好好爱你',
  '亲爱的，',
  '你愿意嫁给我吗？',
];

const PROPOSAL_SIGNATURE = '—— 永远爱你的罗先生';
const COUPLE_PHOTO = assetUrl('/images/wedding-compressed/MY1A9349.webp');

// ===================== PALETTE =====================

const PALETTES = [
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],      // 1  金色 — 亲爱的思宝
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 2  粉色 — 初次相遇
  ['#00bfff', '#87ceeb', '#b0e0e6', '#7ec8e3'],      // 3  蓝色 — 北京
  ['#ffd700', '#ff69b4', '#fffacd', '#ffb6c1'],      // 4  金粉 — 我们
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],      // 5  紫色 — 知己
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],      // 6  金色 — 铭记
  ['#ff1493', '#ff69b4', '#ff007f', '#ff85c8'],      // 7  玫红 — 正式在一起
  ['#ff69b4', '#ffd700', '#ff85c8', '#fffacd'],      // 8  粉金 — 这一天
  ['#ff69b4', '#ffd700', '#ff85c8', '#fffacd'],      // 9  粉金 — 非凡意义
  ['#c0c0c0', '#87ceeb', '#b0c4de', '#e0e0e0'],      // 10 银蓝 — 时光流逝
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],      // 11 紫色 — 三个词
  ['#6495ed', '#7b68ee', '#b0c4de', '#87ceeb'],      // 12 蓝紫 — 对不起
  ['#87ceeb', '#b0e0e6', '#add8e6', '#c4daf0'],      // 13 淡蓝 — 不成熟
  ['#87ceeb', '#b0e0e6', '#add8e6', '#c4daf0'],      // 14 淡蓝 — 不愉快回忆
  ['#ffa500', '#ffd700', '#ffb347', '#ffed4a'],      // 15 暖橙金 — 谢谢你
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 16 粉色 — 陪伴包容
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 17 粉色 — 理解等待
  ['#ff6b6b', '#ff8e8e', '#ffa07a', '#ffc4a3'],      // 18 暖红 — 惹你生气
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],      // 19 紫色 — 包容理解
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],      // 20 紫色 — 解决问题
  ['#6a5acd', '#7b68ee', '#9370db', '#b0c4de'],      // 21 蓝紫 — 异地
  ['#6a5acd', '#7b68ee', '#9370db', '#b0c4de'],      // 22 蓝紫 — 至暗时刻
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],      // 23 金色 — 宝贵青春
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],      // 24 金色 — 毕业成长
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 25 粉色 — 信任支持
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 26 粉色 — 不离不弃
  ['#00cc99', '#00e6b0', '#66ffcc', '#b2ffdd'],      // 27 翠绿 — 相信我
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],      // 28 金色 — 一定
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 29 粉色 — 改掉坏毛病
  ['#ff69b4', '#ff85c8', '#ffb6c1', '#ffd1e8'],      // 30 粉色 — 不再惹你生气
  ['#ffa500', '#ffd700', '#ffb347', '#ffed4a'],      // 31 暖橙 — 学习做饭
  ['#ffa500', '#ffd700', '#ffb347', '#ffed4a'],      // 32 暖橙 — 大厨摄影师
  ['#ffa500', '#ffd700', '#ffb347', '#ffed4a'],      // 33 暖橙 — 最美的你
  ['#00bfff', '#87ceeb', '#b0e0e6', '#7ec8e3'],      // 34 蓝色 — 运动健身
  ['#00bfff', '#87ceeb', '#b0e0e6', '#7ec8e3'],      // 35 蓝色 — 更好的自己
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],      // 36 紫色 — 自我提升
  ['#dda0dd', '#da70d6', '#ee82ee', '#d8b4fe'],      // 37 紫色 — 经营小家
  ['#ffd700', '#ff69b4', '#fffacd', '#ffb6c1'],      // 38 金粉 — 未来
  ['#ff69b4', '#ffd700', '#ff85c8', '#fffacd'],      // 39 粉金 — 携手同行
  ['#ff6b6b', '#ff8e8e', '#ffa07a', '#ffc4a3'],      // 40 暖红 — 争取机会
  ['#ff6b6b', '#ff8e8e', '#ffa07a', '#ffc4a3'],      // 41 暖红 — 好好爱你
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],      // 42 金色 — 亲爱的
  ['#ffd700', '#ff1493', '#ff69b4', '#fffacd'],      // 43 金粉玫红 — 求婚
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

function sampleText(text: string, fs: number, cx: number, cy: number, gap: number, maxPts = MAX_P) {
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
  if (pts.length > maxPts) { pts.sort(() => Math.random() - .5); pts.length = maxPts; }
  return pts;
}

function fitFont(text: string, mw: number, mob: boolean, boost = 0): number {
  const c = document.createElement('canvas');
  const x = c.getContext('2d')!;
  let s = (mob ? 36 : 58) + boost;
  x.font = `bold ${s}px "Ma Shan Zheng",serif`;
  while (x.measureText(text).width > mw * .85 && s > 18) { s -= 2; x.font = `bold ${s}px "Ma Shan Zheng",serif`; }
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

// Update ambient particle physics + lifecycle (module-level for reuse)
function updateAmbientParticle(p: APart, dt: number, newParts: APart[], palette: string[]) {
  if (p.trailMax > 0) {
    p.trail.push(p.x, p.y);
    if (p.trail.length > p.trailMax * 2) { p.trail.splice(0, 2); }
  }
  const df = Math.pow(p.drag, dt * 60);
  p.vx *= df; p.vy *= df;
  p.vy += p.grav * dt * 60;
  p.vx += WIND * dt * 60;
  p.x += p.vx * dt * 60;
  p.y += p.vy * dt * 60;
  p.life -= dt;
  const lr = clamp(p.life / p.maxLife);
  if (lr > .9) { p.alpha = 1; }
  else if (lr > .3) { p.alpha = .75 + .25 * ((lr - .3) / .6); }
  else { p.alpha = (lr / .3) * .75; if (lr < .12 && Math.random() > .6) p.alpha *= rand(.2, .8); }
  p.sz = p.baseSz * (.3 + .7 * lr);
  if (p.canSplit && !p.hasSplit && lr < .45) {
    p.hasSplit = true;
    for (let j = 0; j < p.splitN; j++) {
      const a = Math.random() * Math.PI * 2;
      const spd = rand(2, 5);
      newParts.push({
        x: p.x, y: p.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        color: pick(palette), alpha: 1, sz: p.baseSz * .7, baseSz: p.baseSz * .7,
        life: rand(.7, 1.4), maxLife: rand(.7, 1.4), drag: .96, grav: .15,
        trail: [], trailMax: 5, canSplit: false, hasSplit: false, splitN: 0,
      });
      newParts[newParts.length - 1].maxLife = newParts[newParts.length - 1].life;
    }
  }
  if (lr < .08 && Math.random() > .88) {
    for (let j = 0; j < ~~rand(2, 4); j++) {
      newParts.push({
        x: p.x + rand(-2, 2), y: p.y + rand(-2, 2),
        vx: rand(-1.5, 1.5), vy: rand(-2.5, .5),
        color: '#fff', alpha: 1, sz: rand(.4, 1.2), baseSz: rand(.4, 1.2),
        life: rand(.04, .12), maxLife: .12, drag: .98, grav: .1,
        trail: [], trailMax: 0, canSplit: false, hasSplit: false, splitN: 0,
      });
      newParts[newParts.length - 1].maxLife = newParts[newParts.length - 1].life;
    }
  }
}

// ===================== CELEBRATION FIREWORKS =====================

const CELEBRATION_PALETTES = [
  ['#ff1493', '#ff69b4', '#ff007f', '#ffb6c1'],
  ['#ffd700', '#ffed4a', '#fff8dc', '#ffc107'],
  ['#ff69b4', '#ffd700', '#ff1493', '#fffacd'],
  ['#ff6b6b', '#ff8e8e', '#ff1493', '#ffd700'],
  ['#da70d6', '#ff69b4', '#ffd700', '#ee82ee'],
  ['#ff007f', '#ff1493', '#ffd700', '#fff'],
];

function mkHeartBurst(w: number, h: number): ABurst {
  const palette = pick(CELEBRATION_PALETTES);
  const cx = rand(w * .15, w * .85);
  const cy = rand(h * .1, h * .5);
  const particles: APart[] = [];
  const n = 120;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const dist = Math.sqrt(hx * hx + hy * hy);
    const scale = rand(0.25, 0.45);
    const spd = dist * scale;
    const angle = Math.atan2(hy, hx);
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * spd + rand(-0.3, 0.3),
      vy: Math.sin(angle) * spd + rand(-0.3, 0.3),
      color: pick(palette), alpha: 1,
      sz: rand(1.8, 3.2), baseSz: rand(1.8, 3.2),
      life: rand(2.5, 3.8), maxLife: 3.8,
      drag: .993, grav: .06,
      trail: [], trailMax: 14,
      canSplit: false, hasSplit: false, splitN: 0,
    });
    particles[particles.length - 1].maxLife = particles[particles.length - 1].life;
  }
  return { particles, palette };
}

// Render ambient particles, flashes, rings, stars onto canvas
function renderCelebration(
  ctx: CanvasRenderingContext2D, w: number, h: number, now: number,
  cs: { ambients: ABurst[]; flashes: Flash[]; rings: Ring[]; stars: Star[] },
) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#050510'); bg.addColorStop(.5, '#0a0a1f'); bg.addColorStop(1, '#0f0f2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const nt = now / 1000;
  for (const st of cs.stars) {
    ctx.globalAlpha = .3 + .7 * (.5 + .5 * Math.sin(nt * st.sp + st.ph));
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const ab of cs.ambients) {
    for (const p of ab.particles) {
      if (p.life <= 0) continue;
      const lr = clamp(p.life / p.maxLife);
      const tl = p.trail; const tn = tl.length / 2;
      if (tn > 1) {
        for (let j = 0; j < tl.length - 2; j += 2) {
          const ti = j / 2;
          ctx.globalAlpha = (ti / tn) * clamp(p.alpha) * .35;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(tl[j], tl[j + 1], p.sz * (.3 + .7 * ti / tn) * .6, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (lr > .88) {
        ctx.globalAlpha = (lr - .88) / .12 * p.alpha; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = clamp(p.alpha * .25); ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 3, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = clamp(p.alpha); ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();
      if (lr > .4) {
        ctx.globalAlpha = clamp(p.alpha * .5 * ((lr - .4) / .6)); ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * .4, 0, Math.PI * 2); ctx.fill();
      }
      if (lr < .15) {
        ctx.globalAlpha = clamp((1 - lr / .15) * p.alpha * .4); ctx.fillStyle = '#ff6a00';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 1.2, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const f of cs.flashes) {
    const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
    g.addColorStop(0, f.color); g.addColorStop(1, 'transparent');
    ctx.globalAlpha = clamp(f.a); ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  for (const r of cs.rings) {
    ctx.globalAlpha = clamp(r.a); ctx.strokeStyle = r.color; ctx.lineWidth = r.w;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ===================== COMPONENT =====================

const FireworksPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef(0);
  const timerRef  = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [show, setShow] = useState<'start' | 'playing' | 'celebrating' | 'photo' | 'letter'>('start');
  const [showProposalBtns, setShowProposalBtns] = useState(false);
  const [refusePos, setRefusePos] = useState({ x: 0, y: 0 });
  const proposalBtnsShown = useRef(false);

  const startShow = useCallback(() => setShow('playing'), []);
  const replay = useCallback(() => {
    setShowProposalBtns(false);
    proposalBtnsShown.current = false;
    setRefusePos({ x: 0, y: 0 });
    setShow('start');
    setTimeout(() => setShow('playing'), 120);
  }, []);

  const dodgeRefuse = useCallback(() => {
    const rx = (Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 120);
    const ry = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 80);
    setRefusePos({ x: rx, y: ry });
  }, []);

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
      if (s.line >= LOVE_LETTER.length) { return; }
      const text = LOVE_LETTER[s.line];
      const isFinale = s.line >= LOVE_LETTER.length - 2; // 亲爱的，+ 求婚
      const fs = fitFont(text, W(), mob(), isFinale ? 50 : 0);
      const gap = isFinale ? (mob() ? GAP_M - 1 : GAP_D - 1) : (mob() ? GAP_M : GAP_D);
      const cx = W() / 2, cy = H() * .38;
      const pal = PALETTES[s.line % PALETTES.length];
      const pts = sampleText(text, fs, cx, cy, Math.max(2, gap), isFinale ? 720 : MAX_P);

      s.ex = cx + rand(-25, 25); s.ey = cy;
      s.pal = pal;
      s.rx = W() / 2 + rand(-40, 40);
      s.rsy = H() + 10; s.ry = s.rsy; s.rty = cy;
      s.rTrail = [];

      s.parts = pts.map(p => {
        const a = Math.random() * Math.PI * 2;
        const spd = rand(3, 8);
        const pSz = isFinale ? rand(2.2, 3.8) : rand(1.5, 2.8);
        return {
          x: s.ex, y: s.ey,
          vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          tx: p.x, ty: p.y,
          sx: 0, sy: 0,
          color: pick(pal), alpha: 1,
          sz: pSz, shimmer: Math.random() * Math.PI * 2,
          trail: [],
        };
      });
      setPhase('rocket');
    }

    const startTimer = setTimeout(launch, 600);
    let last = performance.now();

    // ==================== UPDATE ====================

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
            // Explosion effects — more dramatic for finale
            const finaleNow = s.line >= LOVE_LETTER.length - 2;
            s.flashes.push({ x: s.ex, y: s.ey, a: 1, r: finaleNow ? 25 : 15, color: '#fff' });
            s.flashes.push({ x: s.ex, y: s.ey, a: .8, r: finaleNow ? 14 : 8, color: s.pal[0] });
            s.rings.push({ x: s.ex, y: s.ey, r: 5, mr: rand(finaleNow ? 180 : 130, finaleNow ? 280 : 200), a: .9, color: s.pal[0], w: finaleNow ? 3.5 : 2.5 });
            s.rings.push({ x: s.ex, y: s.ey, r: 5, mr: rand(80, finaleNow ? 180 : 130), a: .6, color: s.pal[1] || s.pal[0], w: 1.5 });
            if (finaleNow) {
              s.rings.push({ x: s.ex, y: s.ey, r: 5, mr: rand(100, 160), a: .5, color: s.pal[2] || s.pal[0], w: 2 });
              // Extra ambient bursts for finale explosion
              for (let i = 0; i < 3; i++) s.ambients.push(mkAmbient(W(), H(), true));
            }
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
          const isFinale = s.line >= LOVE_LETTER.length - 2;
          for (const pt of s.parts) {
            const sway = isFinale ? 1 : .5;
            pt.x = pt.tx + Math.sin(now * 2 + pt.shimmer) * sway;
            pt.y = pt.ty + Math.cos(now * 2.5 + pt.shimmer) * sway;
            pt.alpha = .85 + .15 * Math.sin(now * 3 + pt.shimmer);
          }
          // Random sparkle (more intense for finale)
          const sparkleChance = isFinale ? .5 : .8;
          if (Math.random() > sparkleChance) {
            const rp = s.parts[~~(Math.random() * s.parts.length)];
            if (rp) {
              const ab = mkCrackle(rp.x, rp.y, '#fff');
              if (s.ambients.length < 6) s.ambients.push({ particles: [ab], palette: ['#fff'] });
            }
          }
          // Spawn extra ambient fireworks during finale lines
          if (isFinale && Math.random() > .92 && s.ambients.length < 8) {
            s.ambients.push(mkAmbient(W(), H(), true));
          }
          const isProposal = s.line === LOVE_LETTER.length - 1;
          // Proposal line: stay in display forever, show buttons after 5s
          if (isProposal) {
            if (s.t >= 5000 && !proposalBtnsShown.current) {
              proposalBtnsShown.current = true;
              setShowProposalBtns(true);
            }
            break;
          }
          const displayTime = isFinale ? T_DISPLAY * 1.8 : T_DISPLAY;
          if (s.t >= displayTime) setPhase('fade');
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
            const isFinaleText = s.line >= LOVE_LETTER.length - 2;
            const fsBoosted = fitFont(text, w, mob(), isFinaleText ? 50 : 0);
            const mc = s.pal[0];
            const ta = s.phase === 'display' ? (isFinaleText ? .95 : .5) : .2;
            ctx.save();
            ctx.font = `bold ${fsBoosted}px "Ma Shan Zheng","ZCOOL XiaoWei","Noto Serif SC",serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const tx = w / 2, ty = h * .38;
            // Glow layers — much stronger for finale
            ctx.globalAlpha = ta * .5;
            ctx.shadowColor = isFinaleText ? '#ffd700' : mc;
            ctx.shadowBlur = isFinaleText ? 80 : 35;
            ctx.fillStyle = mc;
            ctx.fillText(text, tx, ty);
            ctx.globalAlpha = ta * .8;
            ctx.shadowBlur = isFinaleText ? 40 : 14;
            ctx.fillText(text, tx, ty);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = ta;
            ctx.fillStyle = '#fff';
            ctx.fillText(text, tx, ty);
            // Extra crisp layer for finale
            if (isFinaleText) {
              ctx.globalAlpha = ta * .6;
              ctx.fillText(text, tx, ty);
            }
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

  // ==================== CELEBRATION FIREWORKS (30s) ====================
  useEffect(() => {
    if (show !== 'celebrating') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const cs: { ambients: ABurst[]; flashes: Flash[]; rings: Ring[]; stars: Star[]; aTimer: number; heartTimer: number } = {
      ambients: [], flashes: [], rings: [], stars: mkStars(W(), H()), aTimer: 0.1, heartTimer: 1.5,
    };

    const resize = () => {
      canvas.width = W() * dpr; canvas.height = H() * dpr;
      canvas.style.width = `${W()}px`; canvas.style.height = `${H()}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cs.stars = mkStars(W(), H());
    };
    resize();

    const startTime = performance.now();
    let last = startTime;

    // Confetti bursts at intervals
    const confettiInterval = setInterval(() => {
      const colors = ['#ffd700', '#ff69b4', '#ff1493', '#fff', '#dda0dd'];
      confetti({ particleCount: ~~rand(25, 50), spread: rand(50, 100), origin: { x: Math.random(), y: rand(0.2, 0.5) }, colors });
    }, 2800);

    function spawnWithEffects(ab: ABurst) {
      cs.ambients.push(ab);
      const fp = ab.particles[0];
      if (fp) {
        cs.flashes.push({ x: fp.x, y: fp.y, a: .8, r: 15, color: '#fff' });
        cs.flashes.push({ x: fp.x, y: fp.y, a: .5, r: 8, color: pick(ab.palette) });
        cs.rings.push({ x: fp.x, y: fp.y, r: 4, mr: rand(60, 130), a: .6, color: pick(ab.palette), w: 2 });
      }
    }

    function update(dt: number) {
      const elapsed = (performance.now() - startTime) / 1000;

      // Spawn rate increases over time
      let spawnRate: number, maxAmb: number;
      if (elapsed < 5) { spawnRate = 0.45; maxAmb = 8; }
      else if (elapsed < 15) { spawnRate = 0.3; maxAmb = 12; }
      else if (elapsed < 25) { spawnRate = 0.2; maxAmb = 16; }
      else { spawnRate = 0.08; maxAmb = 30; } // Grand finale

      cs.aTimer -= dt;
      if (cs.aTimer <= 0 && cs.ambients.length < maxAmb) {
        spawnWithEffects(mkAmbient(W(), H(), false));
        if (elapsed > 25) {
          // Grand finale: extra bursts
          spawnWithEffects(mkAmbient(W(), H(), false));
          spawnWithEffects(mkAmbient(W(), H(), false));
          if (Math.random() > 0.3) spawnWithEffects(mkAmbient(W(), H(), false));
        }
        cs.aTimer = spawnRate * rand(0.7, 1.3);
      }

      // Heart bursts
      cs.heartTimer -= dt;
      if (cs.heartTimer <= 0) {
        spawnWithEffects(mkHeartBurst(W(), H()));
        if (elapsed > 20) spawnWithEffects(mkHeartBurst(W(), H()));
        if (elapsed > 27) spawnWithEffects(mkHeartBurst(W(), H()));
        cs.heartTimer = elapsed > 25 ? rand(0.5, 1) : elapsed > 15 ? rand(2, 3.5) : rand(3.5, 5);
      }

      // Update particles
      for (let i = cs.ambients.length - 1; i >= 0; i--) {
        const ab = cs.ambients[i];
        const newParts: APart[] = [];
        for (let j = ab.particles.length - 1; j >= 0; j--) {
          updateAmbientParticle(ab.particles[j], dt, newParts, ab.palette);
          if (ab.particles[j].life <= 0) ab.particles.splice(j, 1);
        }
        ab.particles.push(...newParts);
        if (ab.particles.length === 0) cs.ambients.splice(i, 1);
      }
      for (let i = cs.flashes.length - 1; i >= 0; i--) {
        cs.flashes[i].a -= 4 * dt; cs.flashes[i].r += 250 * dt;
        if (cs.flashes[i].a <= 0) cs.flashes.splice(i, 1);
      }
      for (let i = cs.rings.length - 1; i >= 0; i--) {
        const r = cs.rings[i];
        r.r += (r.mr - r.r) * 4 * dt; r.a -= 1.5 * dt;
        if (r.a <= 0) cs.rings.splice(i, 1);
      }
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, .05);
      last = now;
      const elapsed = (now - startTime) / 1000;
      if (elapsed >= 30) {
        // Grand finale confetti
        confetti({ particleCount: 200, spread: 160, origin: { y: 0.5 }, colors: ['#ffd700', '#ff69b4', '#ff1493', '#fff', '#dda0dd'] });
        setTimeout(() => confetti({ particleCount: 150, spread: 120, origin: { y: 0.4 }, colors: ['#ffd700', '#ff69b4', '#ff1493'] }), 300);
        setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors: ['#ffd700', '#ff69b4', '#fff'] }), 600);
        setShow('photo');
        return;
      }
      update(dt);
      renderCelebration(ctx, W(), H(), now, cs);
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    return () => {
      clearInterval(confettiInterval);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [show]);

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    cancelAnimationFrame(animRef.current);
    setShow('letter');
  }, []);

  // ==================== PHOTO AUTO-ADVANCE (10s) ====================
  useEffect(() => {
    if (show !== 'photo') return;
    const timer = setTimeout(() => setShow('letter'), 10000);
    return () => clearTimeout(timer);
  }, [show]);

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

      {/* Celebration overlay — romantic text */}
      <AnimatePresence>
        {show === 'celebrating' && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 1, 0], scale: [0.8, 1, 1, 1, 0.9] }}
              transition={{ duration: 8, times: [0, 0.1, 0.4, 0.85, 1], delay: 1.5 }}>
              <p className="text-3xl md:text-5xl font-elegant text-star-gold text-glow mb-4 tracking-[0.2em]">
                满天烟花
              </p>
              <motion.p className="text-2xl md:text-4xl font-elegant text-love-pink text-glow-pink tracking-[0.15em]"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 1 }}>
                只为你绽放
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start screen */}
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
              用漫天烟花，写一封给你的情书
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

      {/* Proposal buttons — appear over firework canvas after 5s */}
      <AnimatePresence>
        {showProposalBtns && show === 'playing' && (
          <motion.div className="absolute inset-0 z-20 flex items-end justify-center pb-[16vh] md:pb-[20vh]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}>
            <div className="flex gap-6 md:gap-10 items-center">
              <motion.button
                className="px-10 py-4 rounded-full bg-gradient-to-r from-love-pink/25 to-love-rose/25 border-2 border-love-pink/50 text-love-pink text-xl md:text-2xl font-elegant tracking-[0.1em] hover:from-love-pink/35 hover:to-love-rose/35 hover:border-love-pink/70 transition-all duration-300"
                style={{ boxShadow: '0 0 30px rgba(255,105,180,0.3), 0 0 60px rgba(255,105,180,0.15)' }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShow('celebrating')}
              >
                我愿意
              </motion.button>

              <motion.button
                className="px-8 py-3 rounded-full bg-white/5 border border-white/15 text-white/30 text-lg md:text-xl font-elegant select-none"
                animate={{ x: refusePos.x, y: refusePos.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={dodgeRefuse}
                onTouchStart={(e) => { e.preventDefault(); dodgeRefuse(); }}
                onClick={(e) => { e.preventDefault(); dodgeRefuse(); }}
              >
                我不愿意
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo display — couple's photo for 10 seconds */}
      <AnimatePresence>
        {show === 'photo' && (
          <motion.div className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}>
            <div className="absolute inset-0 bg-night-950" />

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,105,180,0.08) 0%, transparent 60%)' }} />

            <motion.div className="relative flex flex-col items-center"
              initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}>

              {/* Polaroid-style photo frame */}
              <motion.div className="bg-[#faf5ef] p-3 md:p-5 pb-16 md:pb-20 rounded-sm"
                style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,215,0,0.08), 0 0 120px rgba(255,105,180,0.06)' }}
                initial={{ rotate: -2 }} animate={{ rotate: [-2, 0.5, -0.5, 0] }}
                transition={{ duration: 3, ease: 'easeInOut' }}>
                <img
                  src={COUPLE_PHOTO}
                  alt="我们的合照"
                  className="max-h-[55vh] md:max-h-[65vh] max-w-[80vw] md:max-w-[70vw] object-contain rounded-sm"
                />
                <motion.div className="absolute bottom-4 md:bottom-6 left-0 right-0 text-center px-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
                  <p className="font-romantic text-lg md:text-2xl text-night-700 tracking-[0.1em]">
                    两颗心紧紧相依
                  </p>
                </motion.div>
              </motion.div>

              {/* Signature below photo */}
              <motion.p className="mt-6 md:mt-8 text-base md:text-lg font-elegant text-star-gold/60 tracking-[0.15em]"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}>
                {PROPOSAL_SIGNATURE}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full love letter */}
      <AnimatePresence>
        {show === 'letter' && (
          <motion.div className="absolute inset-0 flex flex-col items-center z-10 overflow-y-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <div className="absolute inset-0 bg-night-950/90 backdrop-blur-sm" />

            <motion.div className="relative w-full max-w-2xl px-6 md:px-10 py-10 md:py-16 flex flex-col items-center my-auto">
              {/* Top decorative line */}
              <motion.div className="w-20 h-px bg-gradient-to-r from-transparent via-star-gold/40 to-transparent mb-8"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }} />

              {/* Love letter lines */}
              {LOVE_LETTER.map((line, i) => {
                const isProposal = i === LOVE_LETTER.length - 1;
                const isKeyword = line.startsWith('第');
                const isDate = line.includes('2019年');
                const isShort = line.length <= 4;
                const isSignoff = line === '亲爱的，';
                return (
                  <motion.p key={i}
                    className={`font-elegant leading-relaxed text-center ${
                      isProposal ? 'text-xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-gold my-6'
                      : i === 0 ? 'text-xl md:text-2xl text-star-gold text-glow mb-6'
                      : isKeyword ? 'text-lg md:text-2xl text-love-pink text-glow-pink my-4'
                      : isDate ? 'text-lg md:text-xl text-star-gold/90 my-3'
                      : isSignoff ? 'text-lg md:text-2xl text-star-gold/80 mt-6 mb-1'
                      : isShort ? 'text-lg md:text-xl text-white/80 my-3'
                      : 'text-base md:text-lg text-white/65 my-1'
                    }`}
                    style={isProposal ? { filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.4))' } : undefined}
                    initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: .3 + i * .1, duration: .5 }}>
                    {line}
                  </motion.p>
                );
              })}

              {/* Signature */}
              <motion.div className="flex flex-col items-center mt-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: .3 + LOVE_LETTER.length * .1 + .5, duration: .8 }}>

                <motion.div className="w-12 h-px bg-gradient-to-r from-transparent via-star-gold/30 to-transparent mb-6" />

                <motion.div className="text-4xl mb-4"
                  animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, delay: .3 + LOVE_LETTER.length * .1 + 1 }}>
                  💍
                </motion.div>

                <p className="text-base md:text-lg font-elegant text-star-gold/60 tracking-[0.1em] mb-10">
                  {PROPOSAL_SIGNATURE}
                </p>

                <div className="flex gap-4">
                  <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-star-gold/20 to-love-pink/20 border border-star-gold/30 text-star-gold text-sm hover:border-star-gold/60 hover:shadow-glow-gold transition-all duration-300"
                    onClick={replay}>再看一次</button>
                  <Link to="/"
                    className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/30 transition-all duration-300">
                    回到首页
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FireworksPage;
