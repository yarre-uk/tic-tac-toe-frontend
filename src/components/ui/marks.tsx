import {
  MARK_RADIUS,
  MARK_SIZE,
  MARK_STROKE,
  MARK_VIEWBOX,
} from './mark-geometry';

import { cn } from '@/lib/utils';

export function XMark({ className }: Readonly<{ className?: string }>) {
  const V = MARK_VIEWBOX;
  const pad = MARK_STROKE / 2;
  return (
    <svg
      viewBox={`0 0 ${V} ${V}`}
      width={MARK_SIZE}
      height={MARK_SIZE}
      className={cn('fill-none stroke-current', className)}
      strokeWidth={MARK_STROKE}
      strokeLinecap="round"
    >
      <line x1={pad} y1={pad} x2={V - pad} y2={V - pad} />
      <line x1={V - pad} y1={pad} x2={pad} y2={V - pad} />
    </svg>
  );
}

export function OMark({ className }: Readonly<{ className?: string }>) {
  const V = MARK_VIEWBOX;
  return (
    <svg
      viewBox={`0 0 ${V} ${V}`}
      width={MARK_SIZE}
      height={MARK_SIZE}
      overflow="visible"
      className={cn('fill-none stroke-current', className)}
      strokeWidth={MARK_STROKE}
    >
      <circle cx={V / 2} cy={V / 2} r={MARK_RADIUS} />
    </svg>
  );
}
