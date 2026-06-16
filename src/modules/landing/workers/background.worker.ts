/* eslint-disable sonarjs/pseudo-random */
import {
  MARK_ARM,
  MARK_RADIUS,
  MARK_STROKE,
} from '@/components/ui/mark-geometry';

type Colors = { x: string; o: string };
type SymbolType = 'x' | 'o';

type WorkerMessage =
  | { type: 'init'; canvas: OffscreenCanvas; colors: Colors }
  | { type: 'resize'; width: number; height: number };

interface Particle {
  x: number;
  y: number;
  type: SymbolType;
  angle: number;
  spin: number;
  timerId: number;
  createdAt: number;
  duration: number;
}

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
const colors: Colors = { x: '#59aaf8', o: '#f3625d' };
let particles: Array<Particle> = [];
let loopStarted = false;

function startLoop() {
  if (loopStarted) return;

  loopStarted = true;
  self.setInterval(redraw, 1000 / 30);
}

const MIN_DIST = 80;
const MAX_PARTICLES = 30;
const INITIAL_PARTICLES = Math.floor(MAX_PARTICLES / 10);
const LIFETIME_MIN = 2000;
const LIFETIME_MAX = 6000;
const CANDIDATES = 30;
const SPAWN_STAGGER = 400;
const SYMBOL_SIZE = 0.25;
const BASE_ALPHA = 0.3;

// ---------------------------------------------------------------------------
// Respawn — pick the candidate furthest from all live particles
// ---------------------------------------------------------------------------

function findPosition(): { x: number; y: number } {
  let bestX = Math.random() * width;
  let bestY = Math.random() * height;
  let bestDist = -1;

  for (let i = 0; i < CANDIDATES; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    let minSq = Infinity;

    for (const p of particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const sq = dx * dx + dy * dy;
      if (sq < minSq) minSq = sq;
    }

    if (minSq > bestDist) {
      bestDist = minSq;
      bestX = x;
      bestY = y;
      if (bestDist >= MIN_DIST * MIN_DIST) break;
    }
  }

  return { x: bestX, y: bestY };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function drawX() {
  if (!ctx) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(-MARK_ARM, -MARK_ARM);
  ctx.lineTo(MARK_ARM, MARK_ARM);
  ctx.moveTo(MARK_ARM, -MARK_ARM);
  ctx.lineTo(-MARK_ARM, MARK_ARM);
  ctx.stroke();
}

function drawO() {
  if (!ctx) {
    return;
  }

  ctx.beginPath();
  ctx.arc(0, 0, MARK_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
}

function drawSymbol(p: Particle) {
  if (!ctx) {
    return;
  }

  const progress = Math.max(
    0,
    Math.min(1, (Date.now() - p.createdAt) / p.duration),
  );
  const wave = Math.sin(progress * Math.PI);
  const alpha = BASE_ALPHA * wave;
  const scale = SYMBOL_SIZE * (0.5 + 0.5 * wave);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle + p.spin * progress);
  ctx.scale(scale, scale);
  ctx.lineWidth = MARK_STROKE;
  ctx.lineCap = 'round';

  if (p.type === 'x') {
    ctx.strokeStyle = colors.x;
    drawX();
  } else {
    ctx.strokeStyle = colors.o;
    drawO();
  }

  ctx.restore();
}

function redraw() {
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    drawSymbol(p);
  }
}

// ---------------------------------------------------------------------------
// Particle lifecycle
// ---------------------------------------------------------------------------

function spawnOne() {
  if (particles.length >= MAX_PARTICLES) {
    return;
  }

  const pos = findPosition();
  particles.push(makeParticle(pos.x, pos.y));
}

function expire(particle: Particle) {
  const idx = particles.indexOf(particle);
  if (idx === -1) {
    return;
  }

  particles.splice(idx, 1);

  const count = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < count; i++) {
    self.setTimeout(spawnOne, i * SPAWN_STAGGER + Math.random() * 200);
  }
}

function makeParticle(x: number, y: number): Particle {
  const type: SymbolType = Math.random() < 0.5 ? 'x' : 'o';
  const angle = Math.random() * Math.PI * 2;
  const spin = (Math.random() - 0.5) * Math.PI;
  const duration = LIFETIME_MIN + Math.random() * (LIFETIME_MAX - LIFETIME_MIN);
  const createdAt = Date.now();
  const particle: Particle = {
    x,
    y,
    type,
    angle,
    spin,
    timerId: 0,
    createdAt,
    duration,
  };

  particle.timerId = self.setTimeout(() => {
    expire(particle);
  }, duration);

  return particle;
}

function initParticles() {
  for (const p of particles) {
    self.clearTimeout(p.timerId);
  }

  particles = [];

  for (let i = 0; i < INITIAL_PARTICLES; i++) {
    const pos = findPosition();
    particles.push(makeParticle(pos.x, pos.y));
  }

  redraw();
}

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  if (msg.type === 'init') {
    colors.x = msg.colors.x;
    colors.o = msg.colors.o;
    ctx = msg.canvas.getContext('2d');
    width = ctx!.canvas.width;
    height = ctx!.canvas.height;
    initParticles();
    startLoop();
  } else {
    width = msg.width;
    height = msg.height;
    ctx!.canvas.width = width;
    ctx!.canvas.height = height;
    initParticles();
  }
};
