import { useEffect, useRef } from 'react';
import type { TetrominoType } from '../types/tetris';
import { TETROMINO_SHAPES, TETROMINO_HEX_COLORS } from '../utils/tetrominos';

interface NextPieceProps {
  nextPiece: TetrominoType;
}

const CELL_SIZE = 25;
const CANVAS_SIZE = 4 * CELL_SIZE;

export function NextPiece({ nextPiece }: NextPieceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw border
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Get shape
    const shape = TETROMINO_SHAPES[nextPiece][0];
    const color = TETROMINO_HEX_COLORS[nextPiece];
    
    // Calculate center offset
    const offsetX = Math.floor((4 - shape[0].length) / 2);
    const offsetY = Math.floor((4 - shape.length) / 2);
    
    // Draw shape
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const drawX = (offsetX + x) * CELL_SIZE;
          const drawY = (offsetY + y) * CELL_SIZE;
          
          ctx.fillStyle = color;
          ctx.fillRect(drawX + 2, drawY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(drawX + 2, drawY + 2, CELL_SIZE - 4, 4);
          
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.strokeRect(drawX + 2, drawY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [nextPiece]);
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-300 mb-2">下一个</h3>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-lg"
      />
    </div>
  );
}