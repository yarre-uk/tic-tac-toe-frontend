import type {
  Colors,
  InitMessage,
  Particle,
  ResizeMessage,
  SymbolType,
  WorkerMessage,
} from '../types';

import { MARK_ARM, MARK_RADIUS, MARK_STROKE } from '@/constants';
import { randomInRange } from '@/lib/utils';

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
const colors: Colors = { x: '#59aaf8', o: '#f3625d' };
let particles: Array<Particle> = [];
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
let loopStarted = false;
let lastFrameTime = 0;

function animationStep(timestamp: number) {
  if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
    lastFrameTime = timestamp;
    redraw();
  }

  self.requestAnimationFrame(animationStep);
}

function startLoop() {
  if (loopStarted) return;

  loopStarted = true;
  self.requestAnimationFrame(animationStep);
}

const MIN_DIST = 80;
const MAX_PARTICLES = 30;
const INITIAL_PARTICLES = Math.floor(MAX_PARTICLES / 10);
const LIFETIME_MIN = 2000;
const LIFETIME_MAX = 6000;
const CANDIDATES = 30;
const SPAWN_STAGGER = 400;
const SYMBOL_SIZE = 1;
const BASE_ALPHA = 0.35;

// ---------------------------------------------------------------------------
// Respawn — pick the candidate furthest from all live particles
// ---------------------------------------------------------------------------

function findPosition(): { x: number; y: number } {
  let bestX = randomInRange(0, width);
  let bestY = randomInRange(0, height);
  let bestClosestDistSq = -1;

  for (let i = 0; i < CANDIDATES; i++) {
    const candidateX = randomInRange(0, width);
    const candidateY = randomInRange(0, height);
    let closestDistSq = Infinity;

    for (const p of particles) {
      const deltaX = p.x - candidateX;
      const deltaY = p.y - candidateY;
      const distSq = deltaX * deltaX + deltaY * deltaY;

      if (distSq < closestDistSq) {
        closestDistSq = distSq;
      }
    }

    if (closestDistSq > bestClosestDistSq) {
      bestClosestDistSq = closestDistSq;
      bestX = candidateX;
      bestY = candidateY;

      if (bestClosestDistSq >= MIN_DIST * MIN_DIST) {
        break;
      }
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

  const count = Math.floor(randomInRange(1, 4));

  for (let i = 0; i < count; i++) {
    self.setTimeout(spawnOne, i * SPAWN_STAGGER + randomInRange(0, 200));
  }
}

function makeParticle(x: number, y: number): Particle {
  const type: SymbolType = randomInRange(0, 1) < 0.5 ? 'x' : 'o';
  const angle = randomInRange(0, Math.PI * 2);
  const spin = randomInRange(-Math.PI / 2, Math.PI / 2);
  const duration = randomInRange(LIFETIME_MIN, LIFETIME_MAX);
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
// Message handlers
// ---------------------------------------------------------------------------

function handleInit(msg: InitMessage) {
  colors.x = msg.colors.x;
  colors.o = msg.colors.o;
  ctx = msg.canvas.getContext('2d');
  width = ctx!.canvas.width;
  height = ctx!.canvas.height;
  initParticles();
  startLoop();
}

function handleResize(msg: ResizeMessage) {
  width = msg.width;
  height = msg.height;

  ctx!.canvas.width = width;
  ctx!.canvas.height = height;

  initParticles();
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  if (msg.type === 'init') {
    handleInit(msg);
  } else {
    handleResize(msg);
  }
};
