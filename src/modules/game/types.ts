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
