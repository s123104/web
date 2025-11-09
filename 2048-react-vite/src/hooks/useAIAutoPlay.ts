import { useEffect, useRef, useState } from 'react';
import type { AIMode } from './useAIMode';
import type { GameState } from '../types';
import {
  findBestMove,
  chooseBestMoveDeep,
  findMCTSMove,
  chooseBestMoveReward
} from '../utils/aiStrategies';

interface UseAIAutoPlayProps {
  aiMode: AIMode;
  gameOver: boolean;
  won: boolean;
  move: (direction: number) => boolean;
  getStateForAI: () => GameState | null;
  restart: () => void;
}

/**
 * useAIAutoPlay Hook
 * 實作 AI 自動播放功能
 */
export function useAIAutoPlay({
  aiMode,
  gameOver,
  won,
  move,
  getStateForAI,
  restart,
}: UseAIAutoPlayProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [speed, setSpeed] = useState<number>(100); // 預設速度 100ms
  const [runCount, setRunCount] = useState<number>(0);
  const [currentMove, setCurrentMove] = useState<string>('');

  useEffect(() => {
    // 如果不是 AI 模式，清除計時器
    if (aiMode === 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // 如果遊戲結束或獲勝，自動重新開始
    if (gameOver || won) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setRunCount(prev => prev + 1);

      // 1秒後重新開始
      timeoutRef.current = setTimeout(() => {
        restart();
        // 重新啟動 AI 循環
        timeoutRef.current = setTimeout(executeAIMove, 100);
      }, 1000);

      return;
    }

    // 執行 AI 移動
    const executeAIMove = () => {
      const currentState = getStateForAI();

      if (!currentState || currentState.gameOver) {
        return;
      }

      let bestDirection: number | null = null;
      const directionNames = ['上', '右', '下', '左'];

      // 根據不同的 AI 模式選擇策略
      switch (aiMode) {
        case 1:
          // 簡易模式
          bestDirection = findBestMove(currentState);
          break;
        case 2: {
          // 深度模式
          const depth = 5;
          const iterationsPerMove = 15;
          const result = chooseBestMoveDeep(currentState, depth, iterationsPerMove);
          bestDirection = result.bestMove;
          break;
        }
        case 3:
          // MCTS 進階模式
          bestDirection = findMCTSMove(currentState);
          break;
        case 4: {
          // Reward 模式
          const depth = 5;
          const iterationsPerMove = 10;
          const result = chooseBestMoveReward(currentState, depth, iterationsPerMove);
          bestDirection = result.bestMove;
          break;
        }
      }

      // 如果沒有找到最佳移動，嘗試隨機選擇一個有效移動
      if (bestDirection === null) {
        const possibleMoves: number[] = [];
        for (let direction = 0; direction < 4; direction++) {
          // 測試這個方向是否有效
          const testState = {
            ...currentState,
            board: currentState.board.map(row => [...row]),
          };
          // 這裡簡化處理，實際應該用 GameCore 測試
          possibleMoves.push(direction);
        }

        if (possibleMoves.length > 0) {
          bestDirection = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
          bestDirection = Math.floor(Math.random() * 4);
        }
      }

      if (bestDirection !== null) {
        setCurrentMove(directionNames[bestDirection]);
        move(bestDirection);
      }

      // 根據速度滑桿設定下一次移動的延遲
      timeoutRef.current = setTimeout(executeAIMove, speed);
    };

    // 開始 AI 循環
    timeoutRef.current = setTimeout(executeAIMove, speed);

    // 清理函數
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [aiMode, gameOver, won, speed, move, getStateForAI, restart]);

  return {
    speed,
    setSpeed,
    runCount,
    currentMove,
  };
}
