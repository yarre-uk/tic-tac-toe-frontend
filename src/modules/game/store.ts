import { create } from 'zustand';

type Player = 'X' | 'O';
type Cell = Player | null;
type GameStatus = 'playing' | 'won' | 'draw';

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

interface GameState {
  board: Array<Cell>;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winLine: [number, number, number] | null;
  makeMove: (index: number) => void;
  reset: () => void;
}

const emptyBoard = (): Array<Cell> => Array(9).fill(null);

export const useGameStore = create<GameState>((set) => ({
  board: emptyBoard(),
  currentPlayer: 'X',
  status: 'playing',
  winner: null,
  winLine: null,

  makeMove: (index) =>
    set((state) => {
      if (state.status !== 'playing' || state.board[index]) {
        return state;
      }

      const board = [...state.board];
      board[index] = state.currentPlayer;

      const result = checkWinner(board);
      if (result) {
        return {
          board,
          status: 'won',
          winner: result.winner,
          winLine: result.line,
          currentPlayer: state.currentPlayer,
        };
      }

      if (board.every(Boolean)) {
        return { board, status: 'draw' };
      }

      return { board, currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X' };
    }),

  reset: () =>
    set({
      board: emptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      winLine: null,
    }),
}));
