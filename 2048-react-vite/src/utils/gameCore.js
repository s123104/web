/**
 * 2048 遊戲核心邏輯類別
 * 處理遊戲狀態、移動、合併等核心功能
 */
export class GameCore {
  constructor() {
    this.board = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.keepPlaying = false;
    this.init();
  }

  /**
   * 初始化遊戲
   */
  init() {
    this.board = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.keepPlaying = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * 添加隨機磚塊
   * @returns {Object|null} 新磚塊的信息
   */
  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) emptyCells.push({ row: i, col: j });
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
      return {
        row: randomCell.row,
        col: randomCell.col,
        value: this.board[randomCell.row][randomCell.col],
      };
    }
    return null;
  }

  /**
   * 執行移動操作
   * @param {number} direction - 0: 上, 1: 右, 2: 下, 3: 左
   * @returns {Object} 移動結果
   */
  move(direction) {
    this.moved = false;
    let mergedTiles = [];
    let movedTiles = [];

    switch (direction) {
      case 0: // 上
        for (let col = 0; col < 4; col++)
          this.processCellsUpDown(col, true, mergedTiles, movedTiles);
        break;
      case 1: // 右
        for (let row = 0; row < 4; row++)
          this.processCellsLeftRight(row, false, mergedTiles, movedTiles);
        break;
      case 2: // 下
        for (let col = 0; col < 4; col++)
          this.processCellsUpDown(col, false, mergedTiles, movedTiles);
        break;
      case 3: // 左
        for (let row = 0; row < 4; row++)
          this.processCellsLeftRight(row, true, mergedTiles, movedTiles);
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
  processCellsUpDown(col, isUp, mergedTiles, movedTiles) {
    const start = isUp ? 0 : 3;
    const step = isUp ? 1 : -1;
    let targetPos = start;

    for (let pos = start; pos !== (isUp ? 4 : -1); pos += step) {
      if (this.board[pos][col] !== 0) {
        let value = this.board[pos][col];
        this.board[pos][col] = 0;

        if (targetPos !== start && this.board[targetPos - step][col] === value) {
          this.board[targetPos - step][col] *= 2;
          this.score += this.board[targetPos - step][col];
          this.moved = true;
          mergedTiles.push({
            row: targetPos - step,
            col: col,
            value: this.board[targetPos - step][col],
            merged: true,
          });
          movedTiles.push({
            row: targetPos - step,
            col: col,
            value: this.board[targetPos - step][col],
          });
        } else {
          this.board[targetPos][col] = value;
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
  processCellsLeftRight(row, isLeft, mergedTiles, movedTiles) {
    const start = isLeft ? 0 : 3;
    const step = isLeft ? 1 : -1;
    let targetPos = start;

    for (let pos = start; pos !== (isLeft ? 4 : -1); pos += step) {
      if (this.board[row][pos] !== 0) {
        let value = this.board[row][pos];
        this.board[row][pos] = 0;

        if (targetPos !== start && this.board[row][targetPos - step] === value) {
          this.board[row][targetPos - step] *= 2;
          this.score += this.board[row][targetPos - step];
          this.moved = true;
          mergedTiles.push({
            row: row,
            col: targetPos - step,
            value: this.board[row][targetPos - step],
            merged: true,
          });
          movedTiles.push({
            row: row,
            col: targetPos - step,
            value: this.board[row][targetPos - step],
          });
        } else {
          this.board[row][targetPos] = value;
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
  checkGameStatus() {
    let hasEmpty = false;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
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
          if (this.board[i][j] === this.board[i][j + 1]) {
            canMerge = true;
            break;
          }
        }
        if (canMerge) break;
      }

      if (!canMerge) {
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 3; i++) {
            if (this.board[i][j] === this.board[i + 1][j]) {
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
  setKeepPlaying() {
    this.keepPlaying = true;
  }

  /**
   * 獲取當前棋盤
   */
  getBoard() {
    return this.board;
  }

  /**
   * 獲取 AI 使用的狀態
   */
  getStateForAI() {
    return {
      board: JSON.parse(JSON.stringify(this.board)),
      score: this.score,
      gameOver: this.gameOver,
    };
  }

  /**
   * 從 AI 應用移動
   */
  applyMoveFromAI(direction) {
    return this.move(direction);
  }
}

/**
 * 克隆遊戲狀態
 * @param {Object} state - 遊戲狀態
 * @returns {GameCore} 克隆的遊戲核心實例
 */
export function cloneGameCoreState(state) {
  let clone = new GameCore();
  clone.board = JSON.parse(JSON.stringify(state.board));
  clone.score = state.score;
  clone.gameOver = state.gameOver;
  return clone;
}
