import { useEffect, useCallback, useRef } from 'react';
import { useGame } from './hooks/useGame';
import { useAudio } from './hooks/useAudio';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';

function App() {
  const { state, startGame, pauseGame, resumeGame, moveLeft, moveRight, moveDown, hardDrop, rotate } = useGame();
  const { playRotate, playMove, playDrop, playHardDrop, playClear, playLevelUp, playGameOver } = useAudio();
  
  // Track previous values for sound effects
  const prevLevelRef = useRef(state.level);
  const prevLinesRef = useRef(state.lines);
  const prevGameStateRef = useRef(state.gameState);
  
  useEffect(() => {
    // Level up sound
    if (state.level > prevLevelRef.current) {
      playLevelUp();
    }
    
    // Line clear sound
    const linesCleared = state.lines - prevLinesRef.current;
    if (linesCleared > 0) {
      playClear(linesCleared);
    }
    
    // Game over sound
    if (state.gameState === 'gameOver' && prevGameStateRef.current === 'playing') {
      playGameOver();
    }
    
    prevLevelRef.current = state.level;
    prevLinesRef.current = state.lines;
    prevGameStateRef.current = state.gameState;
  }, [state.level, state.lines, state.gameState, playLevelUp, playClear, playGameOver]);
  
  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state.gameState !== 'playing') {
      if (e.key === 'Enter' && (state.gameState === 'menu' || state.gameState === 'gameOver')) {
        startGame();
      }
      if ((e.key === 'p' || e.key === 'P') && state.gameState === 'paused') {
        resumeGame();
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        playMove();
        break;
      case 'ArrowRight':
        moveRight();
        playMove();
        break;
      case 'ArrowDown':
        moveDown();
        playDrop();
        break;
      case 'ArrowUp':
        rotate();
        playRotate();
        break;
      case ' ':
        e.preventDefault();
        hardDrop();
        playHardDrop();
        break;
      case 'p':
      case 'P':
        pauseGame();
        break;
    }
  }, [state.gameState, moveLeft, moveRight, moveDown, hardDrop, rotate, startGame, pauseGame, resumeGame, playMove, playDrop, playRotate, playHardDrop]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            TETRIS
          </h1>
          <p className="text-gray-400 mt-2">俄罗斯方块</p>
        </header>
        
        {/* Game Container */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Game Board */}
          <div className="flex-shrink-0">
            <GameBoard 
              board={state.board} 
              currentPiece={state.currentPiece}
              gameOver={state.gameState === 'gameOver'}
              paused={state.gameState === 'paused'}
            />
          </div>
          
          {/* Side Panel */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {/* Next Piece */}
            <NextPiece nextPiece={state.nextPiece} />
            
            {/* Score Board */}
            <ScoreBoard 
              score={state.score}
              highScore={state.highScore}
              level={state.level}
              lines={state.lines}
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-6">
          <Controls
            onLeft={() => { moveLeft(); playMove(); }}
            onRight={() => { moveRight(); playMove(); }}
            onDown={() => { moveDown(); playDrop(); }}
            onRotate={() => { rotate(); playRotate(); }}
            onHardDrop={() => { hardDrop(); playHardDrop(); }}
            gameState={state.gameState}
            onStart={startGame}
            onPause={pauseGame}
            onResume={resumeGame}
          />
        </div>
      </div>
    </div>
  );
}

export default App;