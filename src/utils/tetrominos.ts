import type { TetrominoType, Tetromino } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]]
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
  ]
};

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: 'bg-tetris-cyan',
  O: 'bg-tetris-yellow',
  T: 'bg-tetris-purple',
  S: 'bg-tetris-green',
  Z: 'bg-tetris-red',
  J: 'bg-tetris-blue',
  L: 'bg-tetris-orange'
};

export const TETROMINO_HEX_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

export const TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function createRandomTetromino(type?: TetrominoType): Tetromino {
  const tetrominoType = type || TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  const shape = TETROMINO_SHAPES[tetrominoType][0];
  const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  
  return {
    type: tetrominoType,
    shape,
    position: { x: startX, y: 0 },
    color: TETROMINO_COLORS[tetrominoType]
  };
}

export function getNextTetrominoType(): TetrominoType {
  return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
}

export function rotateTetromino(shape: number[][], direction: number): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array(cols).fill(null).map(() => Array(rows).fill(0));
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (direction > 0) {
        rotated[x][rows - 1 - y] = shape[y][x];
      } else {
        rotated[cols - 1 - x][y] = shape[y][x];
      }
    }
  }
  
  return rotated;
}