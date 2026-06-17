import type {
  Colors,
  InitMessage,
  MouseMessage,
  Particle,
  ResizeMessage,
  WorkerMessage,
} from '../types';

import { MARK_ARM, MARK_RADIUS, MARK_STROKE } from '@/constants';
import { randomInRange } from '@/lib/utils';

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
const colors: Colors = { x: '#59aaf8', o: '#f3625d' };
let particles: Array<Particle> = [];
const mouseParticles: Array<Particle> = [];
const TARGET_FRAMERATE = 30;
const FRAME_INTERVAL = 1000 / TARGET_FRAMERATE;
let loopStarted = false;
let lastFrameTime = 0;
let mouseX: number | null = null;
let mouseY: number | null = null;

const MIN_DIST = 80;
const MAX_PARTICLES = 30;
const INITIAL_PARTICLES = Math.floor(MAX_PARTICLES / 10);
const LIFETIME_MIN = 2000;
const LIFETIME_MAX = 6000;
const CANDIDATES = 15;
const SPAWN_STAGGER = 400;
const SYMBOL_SIZE = 0.3;
const BASE_ALPHA = 0.3;

const MOUSE_PARTICLES_MAX = 10;
const MOUSE_PARTICLES_RANGE = 75;
const MOUSE_MIN_DIST = 30;
const MOUSE_INITIAL_PARTICLES = Math.floor(MOUSE_PARTICLES_MAX / 2);

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

// ---------------------------------------------------------------------------
// Respawn — pick the candidate furthest from all live particles
// ---------------------------------------------------------------------------

function findPosition(
  pool: Array<Particle>,
  minDist: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): { x: number; y: number } {
  let bestX = randomInRange(startX, endX);
  let bestY = randomInRange(startY, endY);
  let bestClosestDistSq = -1;

  for (let i = 0; i < CANDIDATES; i++) {
    const candidateX = randomInRange(startX, endX);
    const candidateY = randomInRange(startY, endY);
    let closestDistSq = Infinity;

    for (const p of pool) {
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

      if (bestClosestDistSq >= minDist * minDist) {
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

function drawSymbol(p: Particle, progress: number, pureProgress?: number) {
  if (!ctx) {
    return;
  }

  const animProgress = pureProgress ?? progress;
  const fadeWave = Math.sin(progress * Math.PI);
  const animWave = Math.sin(animProgress * Math.PI);
  const alpha = BASE_ALPHA * fadeWave;
  const scale = SYMBOL_SIZE * (0.5 + 0.5 * animWave);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle + p.spin * animProgress);
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

function mouseSpeedMultiplier(p: Particle): number {
  if (mouseX === null || mouseY === null) {
    return 1;
  }

  const dx = p.x - mouseX;
  const dy = p.y - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const excess = Math.max(0, dist - MOUSE_PARTICLES_RANGE);

  return 1 + excess / MOUSE_PARTICLES_RANGE;
}

function redraw() {
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  for (const p of [...particles]) {
    const progress = (Date.now() - p.createdAt) / p.duration;

    if (progress >= 1) {
      expireParticle(p, particles, () =>
        spawnParticle(particles, MAX_PARTICLES, () =>
          findPosition(particles, MIN_DIST, 0, 0, width, height),
        ),
      );
    } else {
      drawSymbol(p, progress);
    }
  }

  for (const p of [...mouseParticles]) {
    p.speedMultiplier = Math.max(p.speedMultiplier, mouseSpeedMultiplier(p));
    const pureProgress = (Date.now() - p.createdAt) / p.duration;
    const progress = pureProgress * p.speedMultiplier;

    if (progress >= 1) {
      expireParticle(p, mouseParticles, () =>
        spawnParticle(mouseParticles, MOUSE_PARTICLES_MAX, () => {
          if (mouseX === null || mouseY === null) {
            return null;
          }

          return findPosition(
            mouseParticles,
            MOUSE_MIN_DIST,
            mouseX - MOUSE_PARTICLES_RANGE,
            mouseY - MOUSE_PARTICLES_RANGE,
            mouseX + MOUSE_PARTICLES_RANGE,
            mouseY + MOUSE_PARTICLES_RANGE,
          );
        }),
      );
    } else {
      drawSymbol(p, progress, pureProgress);
    }
  }
}

// ---------------------------------------------------------------------------
// Particle lifecycle
// ---------------------------------------------------------------------------

function makeParticle(x: number, y: number): Particle {
  return {
    x,
    y,
    type: randomInRange(0, 1) < 0.5 ? 'x' : 'o',
    angle: randomInRange(0, Math.PI * 2),
    spin: randomInRange(-Math.PI / 2, Math.PI / 2),
    duration: randomInRange(LIFETIME_MIN, LIFETIME_MAX),
    createdAt: Date.now(),
    speedMultiplier: 1,
  };
}

function spawnParticle(
  pool: Array<Particle>,
  max: number,
  findPos: () => { x: number; y: number } | null,
) {
  if (pool.length >= max) {
    return;
  }

  const pos = findPos();
  if (!pos) {
    return;
  }

  pool.push(makeParticle(pos.x, pos.y));
}

function expireParticle(
  particle: Particle,
  pool: Array<Particle>,
  spawn: () => void,
) {
  const idx = pool.indexOf(particle);
  if (idx === -1) {
    return;
  }

  pool.splice(idx, 1);

  const count = Math.floor(randomInRange(1, 4));

  for (let i = 0; i < count; i++) {
    self.setTimeout(spawn, i * SPAWN_STAGGER + randomInRange(0, 200));
  }
}

function initParticles() {
  particles = [];

  for (let i = 0; i < INITIAL_PARTICLES; i++) {
    spawnParticle(particles, MAX_PARTICLES, () =>
      findPosition(particles, MIN_DIST, 0, 0, width, height),
    );
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

function handleMouse(msg: MouseMessage) {
  mouseX = msg.x;
  mouseY = msg.y;

  if (mouseParticles.length === 0) {
    for (let i = 0; i < MOUSE_INITIAL_PARTICLES; i++) {
      spawnParticle(mouseParticles, MOUSE_PARTICLES_MAX, () => {
        if (mouseX === null || mouseY === null) return null;
        return findPosition(
          mouseParticles,
          MOUSE_MIN_DIST,
          mouseX - MOUSE_PARTICLES_RANGE,
          mouseY - MOUSE_PARTICLES_RANGE,
          mouseX + MOUSE_PARTICLES_RANGE,
          mouseY + MOUSE_PARTICLES_RANGE,
        );
      });
    }
  }
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  if (msg.type === 'init') {
    handleInit(msg);
  } else if (msg.type === 'resize') {
    handleResize(msg);
  } else {
    handleMouse(msg);
  }
};
