import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { Cell, GameData, Tetromino } from '../types/tetris';
import { 
  createRandomTetromino, 
  getNextTetrominoType, 
  TETROMINO_SHAPES,
  BOARD_WIDTH, 
  BOARD_HEIGHT 
} from '../utils/tetrominos';

const LINES_PER_LEVEL = 10;
const BASE_SPEED = 1000;

const SCORE_TABLE = [0, 100, 300, 600, 1000];

function createEmptyBoard(): Cell[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false }))
  );
}

function getInitialState(): GameData {
  const highScore = parseInt(localStorage.getItem('tetris-high-score') || '0', 10);
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: getNextTetrominoType(),
    score: 0,
    level: 1,
    lines: 0,
    gameState: 'menu',
    highScore
  };
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'TICK' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_DOWN' }
  | { type: 'HARD_DROP' }
  | { type: 'ROTATE' }
  | { type: 'HOLD_PIECE' };

function isValidPosition(board: Cell[][], piece: Tetromino): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (boardY >= 0 && board[boardY][boardX].filled) {
          return false;
        }
      }
    }
  }
  return true;
}

function lockPiece(board: Cell[][], piece: Tetromino): Cell[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = { 
            filled: true, 
            color: piece.color,
            type: piece.type
          };
        }
      }
    }
  }
  
  return newBoard;
}

function clearLines(board: Cell[][]): { board: Cell[][], linesCleared: number } {
  const newBoard: Cell[][] = [];
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every(cell => cell.filled)) {
      linesCleared++;
    } else {
      newBoard.unshift([...board[y]]);
    }
  }
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false })));
  }
  
  return { board: newBoard, linesCleared };
}

function gameReducer(state: GameData, action: GameAction): GameData {
  switch (action.type) {
    case 'START_GAME': {
      const newState = getInitialState();
      const firstPiece = createRandomTetromino();
      return {
        ...newState,
        currentPiece: firstPiece,
        nextPiece: getNextTetrominoType(),
        gameState: 'playing'
      };
    }
    
    case 'PAUSE_GAME':
      return { ...state, gameState: 'paused' };
    
    case 'RESUME_GAME':
      return { ...state, gameState: 'playing' };
    
    case 'GAME_OVER': {
      const newHighScore = Math.max(state.score, state.highScore);
      localStorage.setItem('tetris-high-score', newHighScore.toString());
      return { ...state, gameState: 'gameOver', highScore: newHighScore };
    }
    
    case 'TICK': {
      if (state.gameState !== 'playing' || !state.currentPiece) return state;
      
      const movedPiece = {
        ...state.currentPiece,
        position: { ...state.currentPiece.position, y: state.currentPiece.position.y + 1 }
      };
      
      if (isValidPosition(state.board, movedPiece)) {
        return { ...state, currentPiece: movedPiece };
      }
      
      // Lock piece
      let newBoard = lockPiece(state.board, state.currentPiece);
      
      // Clear lines
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      newBoard = clearedBoard;
      
      // Calculate score
      let newScore = state.score;
      let newLines = state.lines;
      let newLevel = state.level;
      
      if (linesCleared > 0) {
        newScore += SCORE_TABLE[linesCleared] * state.level;
        newLines += linesCleared;
        newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
      }
      
      // Spawn new piece
      const newPiece = createRandomTetromino(state.nextPiece);
      const nextPieceType = getNextTetrominoType();
      
      // Check game over
      if (!isValidPosition(newBoard, newPiece)) {
        const finalHighScore = Math.max(newScore, state.highScore);
        localStorage.setItem('tetris-high-score', finalHighScore.toString());
        return {
          ...state,
          board: newBoard,
          gameState: 'gameOver',
          highScore: finalHighScore
        };
      }
      
      return {
        ...state,
        board: newBoard,
        currentPiece: newPiece,
        nextPiece: nextPieceType,
        score: newScore,
        lines: newLines,
        level: newLevel
      };
    }
    
    case 'MOVE_LEFT': {
      if (state.gameState !== 'playing' || !state.currentPiece) return state;
      
      const movedPiece = {
        ...state.currentPiece,
        position: { ...state.currentPiece.position, x: state.currentPiece.position.x - 1 }
      };
      
      if (isValidPosition(state.board, movedPiece)) {
        return { ...state, currentPiece: movedPiece };
      }
      return state;
    }
    
    case 'MOVE_RIGHT': {
      if (state.gameState !== 'playing' || !state.currentPiece) return state;
      
      const movedPiece = {
        ...state.currentPiece,
        position: { ...state.currentPiece.position, x: state.currentPiece.position.x + 1 }
      };
      
      if (isValidPosition(state.board, movedPiece)) {
        return { ...state, currentPiece: movedPiece };
      }
      return state;
    }
    
    case 'MOVE_DOWN': {
      if (state.gameState !== 'playing' || !state.currentPiece) return state;
      
      const movedPiece = {
        ...state.currentPiece,
        position: { ...state.currentPiece.position, y: state.currentPiece.position.y + 1 }
      };
      
      if (isValidPosition(state.board, movedPiece)) {
        return { ...state, currentPiece: movedPiece };
      }
      
      // Lock piece if can't move down
      return gameReducer(state, { type: 'TICK' });
    }
    
    case 'HARD_DROP': {
      if (state.gameState !== 'playing' || !state.currentPiece) return state;
      
      let dropDistance = 0;
      let movedPiece = { ...state.currentPiece };
      
      while (true) {
        const testPiece = {
          ...movedPiece,
          position: { ...movedPiece.position, y: movedPiece.position.y + 1 }
        };
        
        if (isValidPosition(state.board, testPiece)) {
          movedPiece = testPiece;
          dropDistance++;
        } else {
          break;
        }
      }
      
      return gameReducer(
        { ...state, currentPiece: movedPiece, score: state.score + dropDistance * 2 },
        { type: 'TICK' }
      );
    }
    
    case 'ROTATE': {
      if (state.gameState !== 'playing' || !state.currentPiece) return state;
      
      const currentRotation = TETROMINO_SHAPES[state.currentPiece.type].findIndex(
        shape => JSON.stringify(shape) === JSON.stringify(state.currentPiece!.shape)
      );
      const nextRotation = (currentRotation + 1) % 4;
      const rotatedShape = TETROMINO_SHAPES[state.currentPiece.type][nextRotation];
      
      // Try wall kicks
      const kicks = [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: -2, y: 0 },
        { x: 2, y: 0 }
      ];
      
      for (const kick of kicks) {
        const rotatedPiece = {
          ...state.currentPiece,
          shape: rotatedShape,
          position: {
            x: state.currentPiece.position.x + kick.x,
            y: state.currentPiece.position.y + kick.y
          }
        };
        
        if (isValidPosition(state.board, rotatedPiece)) {
          return { ...state, currentPiece: rotatedPiece };
        }
      }
      
      return state;
    }
    
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const dropInterval = Math.max(100, BASE_SPEED - (state.level - 1) * 80);
  
  useEffect(() => {
    if (state.gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, dropInterval);
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [state.gameState, state.level, dropInterval]);
  
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const pauseGame = useCallback(() => dispatch({ type: 'PAUSE_GAME' }), []);
  const resumeGame = useCallback(() => dispatch({ type: 'RESUME_GAME' }), []);
  const moveLeft = useCallback(() => dispatch({ type: 'MOVE_LEFT' }), []);
  const moveRight = useCallback(() => dispatch({ type: 'MOVE_RIGHT' }), []);
  const moveDown = useCallback(() => dispatch({ type: 'MOVE_DOWN' }), []);
  const hardDrop = useCallback(() => dispatch({ type: 'HARD_DROP' }), []);
  const rotate = useCallback(() => dispatch({ type: 'ROTATE' }), []);
  
  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotate
  };
}