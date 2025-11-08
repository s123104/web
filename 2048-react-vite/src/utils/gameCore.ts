import type { Board, TileInfo, MergedTile, MoveResult, GameState } from '../types';

/**
 * 2048 遊戲核心邏輯類別
 * 處理遊戲狀態、移動、合併等核心功能
 */
export class GameCore {
  board: Board;
  score: number;
  gameOver: boolean;
  keepPlaying: boolean;
  moved: boolean;

  constructor() {
    this.board = Array(4).fill(null).map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.keepPlaying = false;
    this.moved = false;
    this.init();
  }

  /**
   * 初始化遊戲
   */
  init(): void {
    this.board = Array(4).fill(null).map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.keepPlaying = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * 添加隨機磚塊
   * @returns 新磚塊的信息
   */
  addRandomTile(): TileInfo | null {
    const emptyCells: TileInfo[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i]?.[j] === 0) {
          emptyCells.push({ row: i, col: j, value: 0 });
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      if (randomCell && this.board[randomCell.row]) {
        const value = Math.random() < 0.9 ? 2 : 4;
        this.board[randomCell.row]![randomCell.col] = value;
        return {
          row: randomCell.row,
          col: randomCell.col,
          value,
        };
      }
    }
    return null;
  }

  /**
   * 執行移動操作
   * @param direction - 0: 上, 1: 右, 2: 下, 3: 左
   * @returns 移動結果
   */
  move(direction: number): MoveResult {
    this.moved = false;
    const mergedTiles: MergedTile[] = [];
    const movedTiles: TileInfo[] = [];

    switch (direction) {
      case 0: // 上
        for (let col = 0; col < 4; col++) {
          this.processCellsUpDown(col, true, mergedTiles, movedTiles);
        }
        break;
      case 1: // 右
        for (let row = 0; row < 4; row++) {
          this.processCellsLeftRight(row, false, mergedTiles, movedTiles);
        }
        break;
      case 2: // 下
        for (let col = 0; col < 4; col++) {
          this.processCellsUpDown(col, false, mergedTiles, movedTiles);
        }
        break;
      case 3: // 左
        for (let row = 0; row < 4; row++) {
          this.processCellsLeftRight(row, true, mergedTiles, movedTiles);
        }
        break;
    }

    if (this.moved) this.addRandomTile();
    this.checkGameStatus();

    return {
      moved: this.moved,
      mergedTiles,
      movedTiles,
      score: this.score,
      gameOver: this.gameOver,
    };
  }

  /**
   * 處理上下移動的邏輯
   */
  private processCellsUpDown(
    col: number,
    isUp: boolean,
    mergedTiles: MergedTile[],
    movedTiles: TileInfo[]
  ): void {
    const start = isUp ? 0 : 3;
    const step = isUp ? 1 : -1;
    let targetPos = start;

    for (let pos = start; pos !== (isUp ? 4 : -1); pos += step) {
      const cellValue = this.board[pos]?.[col];
      if (cellValue !== undefined && cellValue !== 0) {
        let value = cellValue;
        this.board[pos]![col] = 0;

        const targetRow = this.board[targetPos - step];
        if (targetPos !== start && targetRow?.[col] === value) {
          targetRow[col] *= 2;
          this.score += targetRow[col]!;
          this.moved = true;
          mergedTiles.push({
            row: targetPos - step,
            col: col,
            value: targetRow[col]!,
            merged: true,
          });
          movedTiles.push({
            row: targetPos - step,
            col: col,
            value: targetRow[col]!,
          });
        } else {
          this.board[targetPos]![col] = value;
          if (targetPos !== pos) {
            this.moved = true;
            movedTiles.push({ row: targetPos, col: col, value: value });
          }
          targetPos += step;
        }
      }
    }
  }

  /**
   * 處理左右移動的邏輯
   */
  private processCellsLeftRight(
    row: number,
    isLeft: boolean,
    mergedTiles: MergedTile[],
    movedTiles: TileInfo[]
  ): void {
    const start = isLeft ? 0 : 3;
    const step = isLeft ? 1 : -1;
    let targetPos = start;

    for (let pos = start; pos !== (isLeft ? 4 : -1); pos += step) {
      const cellValue = this.board[row]?.[pos];
      if (cellValue !== undefined && cellValue !== 0) {
        let value = cellValue;
        this.board[row]![pos] = 0;

        const targetCell = this.board[row]?.[targetPos - step];
        const boardRow = this.board[row];
        if (targetPos !== start && targetCell === value && boardRow) {
          const targetIndex = targetPos - step;
          boardRow[targetIndex] = (boardRow[targetIndex] || 0) * 2;
          const mergedValue = boardRow[targetIndex]!;
          this.score += mergedValue;
          this.moved = true;
          mergedTiles.push({
            row: row,
            col: targetPos - step,
            value: mergedValue,
            merged: true,
          });
          movedTiles.push({
            row: row,
            col: targetPos - step,
            value: mergedValue,
          });
        } else if (boardRow) {
          boardRow[targetPos] = value;
          if (targetPos !== pos) {
            this.moved = true;
            movedTiles.push({ row: row, col: targetPos, value: value });
          }
          targetPos += step;
        }
      }
    }
  }

  /**
   * 檢查遊戲狀態
   */
  private checkGameStatus(): void {
    let hasEmpty = false;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i]?.[j] === 0) {
          hasEmpty = true;
          break;
        }
      }
      if (hasEmpty) break;
    }

    if (!hasEmpty) {
      let canMerge = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.board[i]?.[j] === this.board[i]?.[j + 1]) {
            canMerge = true;
            break;
          }
        }
        if (canMerge) break;
      }

      if (!canMerge) {
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 3; i++) {
            if (this.board[i]?.[j] === this.board[i + 1]?.[j]) {
              canMerge = true;
              break;
            }
          }
          if (canMerge) break;
        }
      }

      this.gameOver = !canMerge;
    }
  }

  /**
   * 設置繼續遊戲模式
   */
  setKeepPlaying(): void {
    this.keepPlaying = true;
  }

  /**
   * 獲取當前棋盤
   */
  getBoard(): Board {
    return this.board;
  }

  /**
   * 獲取 AI 使用的狀態
   */
  getStateForAI(): GameState {
    return {
      board: JSON.parse(JSON.stringify(this.board)) as Board,
      score: this.score,
      gameOver: this.gameOver,
    };
  }

  /**
   * 從 AI 應用移動
   */
  applyMoveFromAI(direction: number): MoveResult {
    return this.move(direction);
  }
}

/**
 * 克隆遊戲狀態
 * @param state - 遊戲狀態
 * @returns 克隆的遊戲核心實例
 */
export function cloneGameCoreState(state: GameState): GameCore {
  const clone = new GameCore();
  clone.board = JSON.parse(JSON.stringify(state.board)) as Board;
  clone.score = state.score;
  clone.gameOver = state.gameOver;
  return clone;
}
