import { ScoreBox } from './ScoreBox';

/**
 * Header 標題組件
 * 顯示遊戲標題和分數
 */
export function Header({ score, bestScore, scoreAddition = 0 }) {
  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="text-[65px] font-bold text-text-dark drop-shadow-sm transition-transform duration-300 hover:scale-105 max-[520px]:text-[48px]">
        2048
      </div>
      <div className="flex gap-5">
        <ScoreBox
          title="分數"
          value={score}
          showAddition={true}
          addition={scoreAddition}
        />
        <ScoreBox title="最佳" value={bestScore} />
      </div>
    </div>
  );
}
