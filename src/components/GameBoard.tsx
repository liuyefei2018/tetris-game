import { useEffect, useRef } from 'react';
import type { Cell, Tetromino } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_HEX_COLORS } from '../utils/tetrominos';

interface GameBoardProps {
  board: Cell[][];
  currentPiece: Tetromino | null;
  gameOver: boolean;
  paused: boolean;
}

const CELL_SIZE = 30;
const CANVAS_WIDTH = BOARD_WIDTH * CELL_SIZE;
const CANVAS_HEIGHT = BOARD_HEIGHT * CELL_SIZE;

export function GameBoard({ board, currentPiece, gameOver, paused }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid lines
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw locked pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x].filled && board[y][x].color) {
          drawCell(ctx, x, y, TETROMINO_HEX_COLORS[board[y][x].type!]);
        }
      }
    }
    
    // Draw ghost piece
    if (currentPiece) {
      let ghostY = currentPiece.position.y;
      while (ghostY < BOARD_HEIGHT) {
        const testY = ghostY + 1;
        let valid = true;
        for (let y = 0; y < currentPiece.shape.length; y++) {
          for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
              const boardX = currentPiece.position.x + x;
              const boardY = testY + y;
              if (boardY >= BOARD_HEIGHT || (boardY >= 0 && board[boardY][boardX].filled)) {
                valid = false;
                break;
              }
            }
          }
          if (!valid) break;
        }
        if (!valid) break;
        ghostY = testY;
      }
      
      // Draw ghost
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardX = currentPiece.position.x + x;
            const boardY = ghostY + y;
            if (boardY >= 0) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
              ctx.fillRect(boardX * CELL_SIZE + 2, boardY * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.strokeRect(boardX * CELL_SIZE + 2, boardY * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
            }
          }
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      const color = TETROMINO_HEX_COLORS[currentPiece.type];
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardX = currentPiece.position.x + x;
            const boardY = currentPiece.position.y + y;
            if (boardY >= 0) {
              drawCell(ctx, boardX, boardY, color);
            }
          }
        }
      }
    }
  }, [board, currentPiece]);
  
  function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    const padding = 2;
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE + padding, y * CELL_SIZE + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);
    
    // Inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x * CELL_SIZE + padding, y * CELL_SIZE + padding, CELL_SIZE - padding * 2, 4);
    
    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x * CELL_SIZE + padding, y * CELL_SIZE + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);
    ctx.shadowBlur = 0;
  }
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-700 rounded-lg shadow-2xl"
      />
      
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
          <h2 className="text-4xl font-bold text-red-500 mb-4">游戏结束</h2>
          <p className="text-xl text-gray-300">按开始键重新开始</p>
        </div>
      )}
      
      {paused && !gameOver && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
          <h2 className="text-4xl font-bold text-yellow-400 mb-4">已暂停</h2>
          <p className="text-xl text-gray-300">按继续键恢复游戏</p>
        </div>
      )}
    </div>
  );
}