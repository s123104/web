interface GameMessageProps {
  show: boolean;
  isWin: boolean;
  onRestart: () => void;
  onKeepPlaying: () => void;
}

/**
 * GameMessage 遊戲消息組件
 * 顯示遊戲結束或獲勝消息
 */
export function GameMessage({ show, isWin, onRestart, onKeepPlaying }: GameMessageProps) {
  if (!show) return null;

  return (
    <div className={`
      absolute inset-0 bg-[rgba(238,228,218,0.73)]
      z-[100] flex flex-col items-center justify-center
      text-center rounded-xl backdrop-blur-sm
      transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
      ${show ? 'scale-100 opacity-100' : 'scale-80 opacity-0'}
      ${isWin ? 'game-message win' : 'game-message lose'}
    `}>
      <p className="text-[60px] font-bold h-[60px] leading-[60px] mb-5 text-text-dark drop-shadow-sm max-[520px]:text-[40px] max-[520px]:h-[40px] max-[520px]:leading-[40px] max-[350px]:text-[32px] max-[350px]:h-[40px] max-[350px]:leading-[40px]">
        {isWin ? '你贏了!' : '遊戲結束'}
      </p>
      <div className="flex mt-8 gap-2.5">
        <button
          onClick={onRestart}
          className="bg-gradient-to-br from-[#8f7a66] to-[#9d8876] text-white border-none rounded-lg px-6 py-3 font-semibold cursor-pointer transition-all duration-300 shadow-button hover:-translate-y-1 hover:shadow-lg hover:from-[#9f8b77] hover:to-[#ad9a87] active:translate-y-0"
        >
          再試一次
        </button>
        {isWin && (
          <button
            onClick={onKeepPlaying}
            className="bg-gradient-to-br from-[#8f7a66] to-[#9d8876] text-white border-none rounded-lg px-6 py-3 font-semibold cursor-pointer transition-all duration-300 shadow-button hover:-translate-y-1 hover:shadow-lg hover:from-[#9f8b77] hover:to-[#ad9a87] active:translate-y-0"
          >
            繼續玩
          </button>
        )}
      </div>
    </div>
  );
}
