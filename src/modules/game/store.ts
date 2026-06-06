import { create } from 'zustand';

export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';

export interface GameActions {
  board: Array<Cell>;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winLine: [number, number, number] | null;
  makeMove: (index: number) => void;
  reset: () => void;
}

interface BoardState {
  board: Array<Cell>;
  setMove: (index: number, player: Player) => void;
  reset: () => void;
}

const emptyBoard = (): Array<Cell> => Array(9).fill(null);

export const useBoardStore = create<BoardState>((set) => ({
  board: emptyBoard(),

  setMove: (index, player) =>
    set((state) => {
      const board = [...state.board];
      board[index] = player;

      return { board };
    }),

  reset: () =>
    set({
      board: emptyBoard(),
    }),
}));
