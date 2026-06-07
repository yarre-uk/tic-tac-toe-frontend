import { create } from 'zustand';

import type { Cell, Player } from './types';

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
