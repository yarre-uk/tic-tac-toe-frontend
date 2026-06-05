import { useGameStore } from '../store';

import { cn } from '@/lib/utils';

function getStatusText(
  status: string,
  winner: string | null,
  currentPlayer: string,
): string {
  if (status === 'won') return `Player ${winner} wins!`;
  if (status === 'draw') return "It's a draw!";
  return `Player ${currentPlayer}'s turn`;
}

export function TTTBoard() {
  const { board, currentPlayer, status, winner, winLine, makeMove, reset } =
    useGameStore();

  const statusText = getStatusText(status, winner, currentPlayer);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xl font-semibold">{statusText}</p>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i) ?? false;
          const isClickable = !cell && status === 'playing';
          const cursorClass = isClickable ? 'cursor-pointer' : 'cursor-default';
          const bgClass = isWinCell
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-white hover:bg-gray-50';

          return (
            <div
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
                'flex h-20 w-20 items-center justify-center rounded border-2 text-4xl font-bold',
                bgClass,
                cursorClass,
                cell === 'X' ? 'text-blue-600' : 'text-red-500',
              )}
            >
              {cell === 'X' && 'X'}
              {cell === 'O' && 'O'}
            </div>
          );
        })}
      </div>

      <button
        onClick={reset}
        className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
      >
        Reset
      </button>
    </div>
  );
}
