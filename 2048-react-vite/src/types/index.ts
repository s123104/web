/**
 * 遊戲類型定義
 */

/** 方向枚舉 */
export enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

/** 棋盤類型 (4x4 二維數組) */
export type Board = number[][];

/** 位置接口 */
export interface Position {
  row: number;
  col: number;
}

/** 磚塊信息 */
export interface TileInfo extends Position {
  value: number;
}

/** 合併的磚塊信息 */
export interface MergedTile extends TileInfo {
  merged: boolean;
}

/** 移動結果 */
export interface MoveResult {
  moved: boolean;
  mergedTiles: MergedTile[];
  movedTiles: TileInfo[];
  score: number;
  gameOver: boolean;
}

/** AI 用的遊戲狀態 */
export interface GameState {
  board: Board;
  score: number;
  gameOver: boolean;
}

/** AI 移動統計 */
export interface MoveStats {
  [direction: number]: number | string;
}

/** AI 最佳移動結果 */
export interface BestMoveResult {
  bestMove: number | null;
  bestScore: number;
  moveStats: MoveStats;
}

/** 獎懲明細項目 */
export interface RewardDetail {
  label: string;
  value: number;
  operator: string;
}

/** 每局獎懲記錄 */
export interface RewardRecord {
  move: number;
  label: string;
  operator: string;
  value: number;
}

/** 學習數據項目 */
export interface LearningDataItem {
  run: number;
  score: number;
}

/** 模擬遊戲結果 */
export interface SimulationResult {
  score: number;
  moves: number;
}

/** MCTS 移動統計 */
export interface MCTSMoveStats {
  visits: number[];
  scores: number[];
}
