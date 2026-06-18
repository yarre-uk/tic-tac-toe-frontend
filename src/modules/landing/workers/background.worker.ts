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
let particleCount = 0;
let mouseParticleCount = 0;

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
const MAX_SPEED_MULTIPLIER = 3;

/**
 * requestAnimationFrame reschedules unconditionally every frame; the interval guard throttles
 * actual draws to TARGET_FRAMERATE without breaking the loop cadence.
 */
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

/**
 * Mitchell's best-candidate: samples CANDIDATES random positions inside the
 * bounding box and keeps whichever is furthest from all live particles.
 * Early-exits as soon as a candidate already satisfies minDist to save work.
 */
function findPosition(
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

      if (bestClosestDistSq >= minDist * minDist) {
        break;
      }
    }
  }

  return { x: bestX, y: bestY };
}

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

/**
 * Draws a particle's symbol at its current animation state.
 * `progress` drives fading (sin wave over full lifetime).
 * `pureProgress` — when provided (mouse particles) — drives scale and rotation
 * independently so those animations aren't affected by the speed multiplier.
 */
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

/**
 * Returns a decay multiplier > 1 for particles outside the mouse spawn range,
 * making them fade faster as the cursor moves away.
 * Skips sqrt when the particle is already inside the range (distSq check).
 * Capped at MAX_SPEED_MULTIPLIER to prevent instant vanish.
 */
function mouseSpeedMultiplier(p: Particle): number {
  if (mouseX === null || mouseY === null) {
    return 1;
  }

  const dx = p.x - mouseX;
  const dy = p.y - mouseY;
  const distSq = dx * dx + dy * dy;
  const rangeSq = MOUSE_PARTICLES_RANGE * MOUSE_PARTICLES_RANGE;

  if (distSq <= rangeSq) {
    return 1;
  }

  const excess = Math.sqrt(distSq) - MOUSE_PARTICLES_RANGE;

  return Math.min(MAX_SPEED_MULTIPLIER, 1 + excess / MOUSE_PARTICLES_RANGE);
}

/**
 * Clears the canvas and redraws all live particles.
 * Iterates backwards so splice(idx, 1) inside expireParticle only shifts
 * indices already visited, avoiding skipped elements without a copy.
 */
function redraw() {
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  const now = Date.now();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    if (p.isMouseParticle) {
      p.speedMultiplier = Math.max(p.speedMultiplier, mouseSpeedMultiplier(p));
      const pureProgress = (now - p.createdAt) / p.duration;
      const progress = pureProgress * p.speedMultiplier;

      if (progress >= 1) {
        expireParticle(p, () =>
          spawnParticle(true, MOUSE_PARTICLES_MAX, () => {
            if (mouseX === null || mouseY === null) {
              return null;
            }

            return findPosition(
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
    } else {
      const progress = (now - p.createdAt) / p.duration;

      if (progress >= 1) {
        expireParticle(p, () =>
          spawnParticle(false, MAX_PARTICLES, () =>
            findPosition(MIN_DIST, 0, 0, width, height),
          ),
        );
      } else {
        drawSymbol(p, progress);
      }
    }
  }
}

function makeParticle(
  x: number,
  y: number,
  isMouseParticle: boolean,
): Particle {
  return {
    x,
    y,
    isMouseParticle,
    type: randomInRange(0, 1) < 0.5 ? 'x' : 'o',
    angle: randomInRange(0, Math.PI * 2),
    spin: randomInRange(-Math.PI / 2, Math.PI / 2),
    duration: randomInRange(LIFETIME_MIN, LIFETIME_MAX),
    createdAt: Date.now(),
    speedMultiplier: 1,
  };
}

/**
 * Adds a particle if the per-type cap hasn't been reached.
 * Counts are kept at module level (particleCount / mouseParticleCount) so
 * this check is O(1) instead of scanning the full array each call.
 */
function spawnParticle(
  isMouseParticle: boolean,
  max: number,
  findPos: () => { x: number; y: number } | null,
) {
  const count = isMouseParticle ? mouseParticleCount : particleCount;

  if (count >= max) {
    return;
  }

  const pos = findPos();
  if (!pos) {
    return;
  }

  particles.push(makeParticle(pos.x, pos.y, isMouseParticle));

  if (isMouseParticle) {
    mouseParticleCount++;
  } else {
    particleCount++;
  }
}

/**
 * Removes the particle and schedules 1–3 replacements with random stagger
 * so refills arrive as an organic burst rather than all at once.
 */
function expireParticle(particle: Particle, spawn: () => void) {
  const idx = particles.indexOf(particle);
  if (idx === -1) {
    return;
  }

  particles.splice(idx, 1);

  if (particle.isMouseParticle) {
    mouseParticleCount--;
  } else {
    particleCount--;
  }

  const amount = Math.floor(randomInRange(1, 4));

  for (let i = 0; i < amount; i++) {
    self.setTimeout(spawn, i * SPAWN_STAGGER + randomInRange(0, 200));
  }
}

function initParticles() {
  particles = [];
  particleCount = 0;
  mouseParticleCount = 0;

  for (let i = 0; i < INITIAL_PARTICLES; i++) {
    spawnParticle(false, MAX_PARTICLES, () =>
      findPosition(MIN_DIST, 0, 0, width, height),
    );
  }

  redraw();
}

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

/**
 * Seeds the initial mouse-particle burst on first cursor entry.
 * Subsequent spawns are handled by the expire→spawn cycle in redraw.
 */
function handleMouse(msg: MouseMessage) {
  mouseX = msg.x;
  mouseY = msg.y;

  if (mouseParticleCount === 0) {
    for (let i = 0; i < MOUSE_INITIAL_PARTICLES; i++) {
      spawnParticle(true, MOUSE_PARTICLES_MAX, () => {
        if (mouseX === null || mouseY === null) {
          return null;
        }

        return findPosition(
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
