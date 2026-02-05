interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  gameState: 'playing' | 'paused' | 'menu' | 'gameOver';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
}

export function Controls({ 
  onLeft, 
  onRight, 
  onDown, 
  onRotate, 
  onHardDrop,
  gameState,
  onStart,
  onPause,
  onResume
}: ControlsProps) {
  const controlButtonClass = "bg-blue-600/80 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-full shadow-lg active:scale-95 transition-transform select-none flex items-center justify-center";
  
  return (
    <div className="flex flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {gameState === 'menu' || gameState === 'gameOver' ? (
          <button 
            onClick={onStart}
            className="bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            开始游戏
          </button>
        ) : gameState === 'playing' ? (
          <button 
            onClick={onPause}
            className="bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            暂停
          </button>
        ) : (
          <button 
            onClick={onResume}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            继续
          </button>
        )}
      </div>
      
      {/* Touch Controls - Mobile */}
      <div className="grid grid-cols-3 gap-2 max-w-[250px] mx-auto lg:hidden">
        {/* Row 1 */}
        <div></div>
        <button 
          onClick={onRotate}
          className={controlButtonClass}
          style={{ width: '70px', height: '70px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          onClick={onHardDrop}
          className={controlButtonClass}
          style={{ width: '70px', height: '70px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        
        {/* Row 2 */}
        <button 
          onClick={onLeft}
          className={controlButtonClass}
          style={{ width: '70px', height: '70px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={onDown}
          className={controlButtonClass}
          style={{ width: '70px', height: '70px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button 
          onClick={onRight}
          className={controlButtonClass}
          style={{ width: '70px', height: '70px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Keyboard Hints - Desktop */}
      <div className="hidden lg:block text-center text-gray-400 text-sm">
        <p className="mb-1">键盘控制: ← → 移动 | ↓ 加速 | ↑ 旋转 | 空格 硬降 | P 暂停</p>
      </div>
    </div>
  );
}