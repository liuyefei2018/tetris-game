interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  lines: number;
}

export function ScoreBoard({ score, highScore, level, lines }: ScoreBoardProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700">
      <div className="text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">分数</div>
        <div className="text-3xl font-bold text-white font-mono">{score.toLocaleString()}</div>
      </div>
      
      <div className="text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">最高分</div>
        <div className="text-xl font-bold text-yellow-400 font-mono">{highScore.toLocaleString()}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">等级</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{level}</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">行数</div>
          <div className="text-2xl font-bold text-green-400 font-mono">{lines}</div>
        </div>
      </div>
    </div>
  );
}