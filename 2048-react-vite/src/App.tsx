import { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { GameMessage } from './components/GameMessage';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { useTouch } from './hooks/useTouch';

interface ModalContent {
  title: string;
  message: string;
}

/**
 * 主應用組件
 */
function App() {
  const {
    board,
    score,
    bestScore,
    gameOver,
    won,
    mergedTiles,
    move,
    restart,
    keepPlaying,
  } = useGame();

  const [scoreAddition, setScoreAddition] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent>({ title: '', message: '' });
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const prevScoreRef = useRef<number>(0);

  // 處理移動
  const handleMove = useCallback((direction: number): void => {
    const prevScore = prevScoreRef.current;
    const moved = move(direction);

    if (moved && score > prevScore) {
      setScoreAddition(score - prevScore);
      prevScoreRef.current = score;
    }
  }, [move, score]);

  // 監聽分數變化
  useEffect(() => {
    prevScoreRef.current = score;
  }, [score]);

  // 鍵盤控制
  useKeyboard(handleMove, !gameOver && !won);

  // 觸控控制
  useTouch(gameContainerRef, handleMove, !gameOver && !won);

  // 重新開始遊戲
  const handleRestart = useCallback((): void => {
    restart();
    setScoreAddition(0);
    prevScoreRef.current = 0;
    showToastMessage('遊戲已重新開始');
  }, [restart]);

  // 顯示 AI 說明
  const handleShowAIHelp = (): void => {
    setModalContent({
      title: 'AI 模式說明',
      message: `1. ai=1：簡易模式
2. ai=2：深度模式
3. ai=3：進階模式 (MCTS)
4. ai=4：Reward 模式，表格顯示獎懲明細

【使用教學】：
在網址列加上 ?ai=模式數字 即可啟用對應 AI 模式，
或是直接用爬蟲對接 API 進行自動操作，
詳細操作請參考官方文件或相關教學影片。`,
    });
    setShowModal(true);
  };

  // 顯示 Toast 消息
  const showToastMessage = (message: string): void => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="w-full max-w-[650px] min-h-[90vh] p-6 bg-surface-container rounded-[18px] shadow-game overflow-y-auto overflow-scrollbar-none transition-all duration-300 max-[767px]:p-4">
      {/* 標題與分數 */}
      <Header score={score} bestScore={bestScore} scoreAddition={scoreAddition} />

      {/* 遊戲說明與按鈕 */}
      <div className="flex flex-col items-center gap-5 mb-6">
        <div className="text-text-dark leading-relaxed text-center text-base">
          <p>
            哎呀呀～小笨蛋～快來動動腦袋，把方塊湊成 <strong>2048</strong> 啦！(っ´ωc)💕
          </p>
        </div>
        <div className="flex gap-5 text-center">
          <button
            onClick={handleRestart}
            className="bg-gradient-to-br from-[#8f7a66] to-[#9d8876] text-white border-none rounded-lg px-6 py-3 font-semibold cursor-pointer transition-all duration-300 shadow-button hover:-translate-y-1 hover:shadow-xl hover:from-[#9f8b77] hover:to-[#ad9a87] active:translate-y-0 active:shadow-md"
          >
            重新開局✨
          </button>
          <button
            onClick={handleShowAIHelp}
            className="bg-gradient-to-br from-[#8f7a66] to-[#9d8876] text-white border-none rounded-lg px-6 py-3 font-semibold cursor-pointer transition-all duration-300 shadow-button hover:-translate-y-1 hover:shadow-xl hover:from-[#9f8b77] hover:to-[#ad9a87] active:translate-y-0 active:shadow-md"
          >
            AI & 爬蟲說明💡
          </button>
        </div>
      </div>

      {/* 遊戲盤面 */}
      <div className="relative">
        <GameBoard
          ref={gameContainerRef}
          board={board}
          mergedTiles={mergedTiles}
        />
        <GameMessage
          show={gameOver || won}
          isWin={won}
          onRestart={handleRestart}
          onKeepPlaying={keepPlaying}
        />
      </div>

      {/* 操作說明 */}
      <div className="text-center mt-4">
        <p className="text-text-dark text-[15px] opacity-80">
          電腦玩家請用 ↑↓←→ 方向鍵；手機玩家用手指滑動。
        </p>
      </div>

      {/* 模態窗 */}
      <Modal
        isOpen={showModal}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setShowModal(false)}
      />

      {/* Toast 提示 */}
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default App;
