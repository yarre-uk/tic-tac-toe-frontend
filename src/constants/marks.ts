// Shared geometry constants for X/O marks.
// Used by both the SVG React components and the canvas Web Worker.
export const MARK_VIEWBOX = 48;
export const MARK_SIZE = MARK_VIEWBOX;
export const MARK_STROKE = 6;
// Arm: X/Y displacement from center so line endpoints land stroke/2 from each corner
export const MARK_ARM = MARK_VIEWBOX / 2 - MARK_STROKE / 2;
// Radius: base radius (V/2 - stroke = 18) projected into diagonal space (×√2 ≈ 25.5)
// so O's stroke centre aligns with X's diagonal reach
export const MARK_RADIUS = (MARK_VIEWBOX / 2 - MARK_STROKE) * Math.SQRT2;
