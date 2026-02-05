export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
  color: string;
}

export interface Cell {
  filled: boolean;
  color?: string;
  type?: TetrominoType;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface GameData {
  board: Cell[][];
  currentPiece: Tetromino | null;
  nextPiece: TetrominoType;
  score: number;
  level: number;
  lines: number;
  gameState: GameState;
  highScore: number;
}