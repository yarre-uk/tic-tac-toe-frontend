import { useBoardStore } from '../store';
import type { Cell, GameActions, GameStatus, Player } from '../store';

import { isDefined } from '@/lib/utils';

const WIN_LINES: Array<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(
  board: Array<Cell>,
): { winner: Player; line: [number, number, number] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  return null;
}

export function useLocalGameStrategy(): GameActions {
  const { board, setMove, reset } = useBoardStore();

  const currentPlayer = board.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
  const result = checkWinner(board);

  let status: GameStatus;

  if (isDefined(result)) {
    status = 'won';
  } else {
    status = board.every((val) => isDefined(val)) ? 'draw' : 'playing';
  }

  function makeMove(index: number) {
    if (status !== 'playing' || board[index]) {
      return;
    }

    setMove(index, currentPlayer);
  }

  return {
    board,
    currentPlayer,
    status,
    winner: result?.winner ?? null,
    winLine: result?.line ?? null,
    makeMove,
    reset,
  };
}
