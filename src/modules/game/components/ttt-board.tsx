import type { GameActions } from '../types';

import { Button, Card, OMark, Text, XMark } from '@/components';
import { cn } from '@/lib/utils';

function getCellVolClass(cell: string | null): string {
  if (cell === 'X') {
    return 'vol-x-dark bg-x-soft text-x border-x';
  }

  if (cell === 'O') {
    return 'vol-o-dark border-o bg-o-soft text-o';
  }

  return 'vol-natural';
}

function getStatusText(
  status: string,
  winner: string | null,
  currentPlayer: string,
): string {
  if (status === 'won') {
    return `WIN - ${winner}`;
  }

  if (status === 'draw') {
    return 'DRAW';
  }

  return `TURN - ${currentPlayer}`;
}

export function TTTBoard({
  board,
  currentPlayer,
  status,
  winner,
  winLine,
  makeMove,
  reset,
  className,
}: Readonly<GameActions & { className: string }>) {
  const statusText = getStatusText(status, winner, currentPlayer);

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-6',
        'transition-all duration-100 ease-in-out',
        className,
      )}
    >
      <Card
        className={cn(
          'grid grid-cols-3 gap-2 md:gap-3 lg:gap-4',
          'rounded-3xl p-4 md:p-8',
        )}
      >
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i) ?? false;
          const isClickable = !cell && status === 'playing';

          return (
            <Card
              key={i}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              variant={'base'}
              aria-label={
                cell
                  ? `Cell ${String(i + 1)}, ${cell}`
                  : `Cell ${String(i + 1)}`
              }
              aria-disabled={!isClickable}
              onClick={() => makeMove(i)}
              onKeyDown={(e) =>
                e.key === 'Enter' || e.key === ' ' ? makeMove(i) : undefined
              }
              className={cn(
                'bg-muted flex size-20 items-center justify-center rounded-2xl md:size-25 lg:size-30',
                'transition-all duration-200 ease-in-out select-none',
                isClickable && 'cursor-pointer',
                getCellVolClass(cell),
                isWinCell && 'scale-105',
              )}
            >
              {cell === 'X' && (
                <XMark className="size-10 md:size-13 lg:size-16" />
              )}
              {cell === 'O' && (
                <OMark className="size-10 md:size-13 lg:size-16" />
              )}
            </Card>
          );
        })}
      </Card>

      <div className="flex flex-col gap-2 md:gap-4">
        <Text
          className={cn(
            'text-center transition-all duration-100 ease-in-out',
            (currentPlayer === 'X' || winner === 'X') && 'text-x',
            (currentPlayer === 'O' || winner === 'O') && 'text-o',
            status === 'draw' && 'text-foreground',
          )}
        >
          {statusText}
        </Text>

        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}
