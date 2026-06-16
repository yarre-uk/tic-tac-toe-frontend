import {
  MARK_ARM,
  MARK_RADIUS,
  MARK_STROKE,
} from '@/components/ui/mark-geometry';

type Colors = { x: string; o: string };

type WorkerMessage =
  | { type: 'init'; canvas: OffscreenCanvas; colors: Colors }
  | { type: 'resize'; width: number; height: number };

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
const colors: Colors = { x: '#59aaf8', o: '#f3625d' };

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

function drawSymbol(type: 'x' | 'o', x: number, y: number, angle: number) {
  if (!ctx) {
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineWidth = MARK_STROKE;
  ctx.lineCap = 'round';

  if (type === 'x') {
    ctx.strokeStyle = colors.x;
    drawX();
  } else {
    ctx.strokeStyle = colors.o;
    drawO();
  }

  ctx.restore();
}

function draw() {
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 4;

  drawSymbol('x', cx - 60, cy, (-15 * Math.PI) / 180);
  drawSymbol('o', cx + 60, cy, (60 * Math.PI) / 180);
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  if (msg.type === 'init') {
    colors.x = msg.colors.x;
    colors.o = msg.colors.o;
    ctx = msg.canvas.getContext('2d');
    width = ctx!.canvas.width;
    height = ctx!.canvas.height;
    draw();
  } else if (msg.type === 'resize') {
    width = msg.width;
    height = msg.height;
    // Reassigning width/height resets the bitmap — redraw after.
    ctx!.canvas.width = width;
    ctx!.canvas.height = height;
    draw();
  }
};
