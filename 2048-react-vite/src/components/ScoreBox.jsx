/**
 * ScoreBox 分數盒子組件
 * 顯示當前分數或最佳分數
 */
export function ScoreBox({ title, value, showAddition = false, addition = 0 }) {
  return (
    <div className="bg-gradient-to-br from-[#bbada0] to-[#cfc0b3] px-5 py-2 rounded-xl text-white text-center shadow-button transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
      <div className="text-sm uppercase tracking-wider">{title}</div>
      <div className="text-[28px] font-bold drop-shadow-md relative">
        {value}
        {showAddition && addition > 0 && (
          <div className="score-addition">+{addition}</div>
        )}
      </div>
    </div>
  );
}
