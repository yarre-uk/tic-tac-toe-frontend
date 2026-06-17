export type Colors = { x: string; o: string };
export type SymbolType = 'x' | 'o';

export type InitMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
  colors: Colors;
};
export type ResizeMessage = { type: 'resize'; width: number; height: number };
export type MouseMessage = { type: 'mouse'; x: number; y: number };
export type WorkerMessage = InitMessage | ResizeMessage | MouseMessage;

export interface Particle {
  x: number;
  y: number;
  type: SymbolType;
  angle: number;
  spin: number;
  createdAt: number;
  duration: number;
  speedMultiplier: number;
  isMouseParticle: boolean;
}
