import { useState, useEffect, useCallback, useRef } from 'react';
import type { Board, MergedTile, GameState } from '../types';
import { GameCore } from '../utils/gameCore';

interface UseGameReturn {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  mergedTiles: MergedTile[];
  move: (direction: number) => boolean;
  restart: () => void;
  keepPlaying: () => void;
  getStateForAI: () => GameState | null;
  gameCore: GameCore | null;
}

/**
 * 遊戲核心 Hook
 * 管理遊戲狀態、分數、移動等邏輯
 */
export function useGame(): UseGameReturn {
  const gameRef = useRef<GameCore | null>(null);
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [mergedTiles, setMergedTiles] = useState<MergedTile[]>([]);

  // 初始化遊戲
  useEffect(() => {
    gameRef.current = new GameCore();
    setBoard([...gameRef.current.getBoard()]);
    setScore(gameRef.current.score);

    // 從 localStorage 讀取最佳分數
    const savedBest = localStorage.getItem('bestScore');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10));
    }
  }, []);

  // 更新最佳分數
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score.toString());
    }
  }, [score, bestScore]);

  // 檢查是否獲勝
  const checkWin = useCallback((): boolean => {
    if (!gameRef.current) return false;
    const currentBoard = gameRef.current.getBoard();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i]?.[j]! >= 2048) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // 移動操作
  const move = useCallback(
    (direction: number): boolean => {
      if (!gameRef.current || gameOver) return false;

      const result = gameRef.current.move(direction);

      if (result.moved) {
        setBoard([...gameRef.current.getBoard()]);
        setScore(gameRef.current.score);
        setMergedTiles(result.mergedTiles);
        setGameOver(result.gameOver);

        // 檢查是否獲勝
        if (!won && checkWin()) {
          setWon(true);
        }

        return true;
      }

      return false;
    },
    [gameOver, won, checkWin]
  );

  // 重新開始遊戲
  const restart = useCallback((): void => {
    if (!gameRef.current) return;
    gameRef.current.init();
    setBoard([...gameRef.current.getBoard()]);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setMergedTiles([]);
  }, []);

  // 繼續遊戲（獲勝後）
  const keepPlaying = useCallback((): void => {
    if (!gameRef.current) return;
    gameRef.current.setKeepPlaying();
    setWon(false);
  }, []);

  // 獲取 AI 用的狀態
  const getStateForAI = useCallback((): GameState | null => {
    return gameRef.current ? gameRef.current.getStateForAI() : null;
  }, []);

  return {
    board,
    score,
    bestScore,
    gameOver,
    won,
    mergedTiles,
    move,
    restart,
    keepPlaying,
    getStateForAI,
    gameCore: gameRef.current,
  };
}
