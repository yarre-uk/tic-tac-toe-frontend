export type Colors = { x: string; o: string };
export type SymbolType = 'x' | 'o';

export type InitMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
  colors: Colors;
};
export type ResizeMessage = { type: 'resize'; width: number; height: number };
export type WorkerMessage = InitMessage | ResizeMessage;

export interface Particle {
  x: number;
  y: number;
  type: SymbolType;
  angle: number;
  spin: number;
  timerId: number;
  createdAt: number;
  duration: number;
}
