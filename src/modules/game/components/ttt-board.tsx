import type { GameActions } from '../types';

import { Button, Card } from '@/components';
import { cn } from '@/lib/utils';

function getStatusText(
  status: string,
  winner: string | null,
  currentPlayer: string,
): string {
  if (status === 'won') {
    return `Player ${winner} wins!`;
  }

  if (status === 'draw') {
    return "It's a draw!";
  }

  return `Player ${currentPlayer}'s turn`;
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
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <p className="text-xl font-semibold">{statusText}</p>

      <Button
        onClick={reset}
        className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
      >
        Reset
      </Button>

      <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i) ?? false;
          const isClickable = !cell && status === 'playing';

          return (
            <Card
              key={i}
              role="button"
              tabIndex={isClickable ? 0 : -1}
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
                'flex size-20 items-center justify-center rounded md:size-25 lg:size-30',
                'text-4xl font-bold text-black select-none md:text-5xl lg:text-6xl',
                'transition-all duration-100 ease-in-out',
                isClickable && 'cursor-pointer hover:scale-105',
                cell === 'X' && 'bg-x-soft border-x text-blue-600',
                cell === 'O' && 'border-o bg-o-soft text-red-500',
                isWinCell && 'scale-105',
              )}
            >
              {cell === 'X' && 'X'}
              {cell === 'O' && 'O'}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
