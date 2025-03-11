/***********************
 * 基本工具函數
 ***********************/

// 顯示Toast訊息
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = "";
  }, 2500);
}

// 顯示精美模態窗而非系統alert
function showModal(title, message, buttonText = "確定", callback = null) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("modal-button").textContent = buttonText;

  const overlay = document.getElementById("modal-overlay");
  overlay.style.display = "flex";

  document.getElementById("modal-button").onclick = function () {
    overlay.style.display = "none";
    if (callback) callback();
  };
}

// 粒子效果系統 - 當合併高值磚塊時
function createParticles(x, y, color, count) {
  const container = document.querySelector(".game-container");

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.backgroundColor = color;
    particle.style.position = "absolute";
    particle.style.width = "8px";
    particle.style.height = "8px";
    particle.style.borderRadius = "50%";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.zIndex = "100";

    // 隨機方向
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    const animDuration = 0.5 + Math.random() * 1;

    particle.style.animation = `particle-fade ${animDuration}s ease-out forwards`;

    // 設置粒子移動方向
    const translateX = Math.cos(angle) * 100 * speed;
    const translateY = Math.sin(angle) * 100 * speed;

    particle.style.transform = `translate(${translateX}px, ${translateY}px)`;

    container.appendChild(particle);

    // 動畫結束後移除粒子
    setTimeout(() => {
      particle.remove();
    }, animDuration * 1000);
  }
}

// 磚塊合併時調用粒子效果
function onTileMerged(row, col, value) {
  // 只有當合併的值大於等於128時才產生粒子效果
  if (value >= 128) {
    // 計算磚塊在畫面上的實際位置
    const container = document.querySelector(".game-container");
    const rect = container.getBoundingClientRect();

    // 磚塊的相對位置
    const tileWidth = rect.width / 4;
    const tileHeight = rect.height / 4;

    const x = rect.left + (col + 0.5) * tileWidth;
    const y = rect.top + (row + 0.5) * tileHeight;

    // 根據值決定粒子顏色和數量
    let color, count;

    if (value >= 2048) {
      color = "#edc22e"; // 金色
      count = 30;
    } else if (value >= 1024) {
      color = "#edc53f"; // 黃色
      count = 20;
    } else if (value >= 512) {
      color = "#edc850"; // 橙黃色
      count = 15;
    } else if (value >= 256) {
      color = "#edcc61"; // 黃色
      count = 12;
    } else {
      color = "#f2b179"; // 橙色
      count = 10;
    }

    createParticles(x, y, color, count);
  }
}

// 添加方塊可愛效果
function addCuteTileEffects() {
  // 添加CSS效果到樣式表
  const style = document.createElement("style");
  style.textContent = `
    @keyframes particle-fade {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(var(--tx), var(--ty)) scale(0);
      }
    }
    
    .tile.merged {
      z-index: 20;
      animation: tile-pop 0.3s ease-in-out;
    }
    
    @keyframes tile-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// 改進的觸控支援
function setupTouchControls() {
  const gameContainer = document.querySelector(".game-container");
  let startX, startY;
  let touchStartTime;

  gameContainer.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      touchStartTime = Date.now();
      e.preventDefault();
    },
    { passive: false }
  );

  gameContainer.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

  gameContainer.addEventListener("touchend", function (e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;

    // 如果觸摸時間太短或太長，可能不是有效滑動
    if (touchDuration < 30 || touchDuration > 1000) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const dx = endX - startX;
    const dy = endY - startY;

    // 確保滑動距離足夠
    const minSwipeDistance = 30;
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance)
      return;

    // 確定主要滑動方向
    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平滑動
      if (dx > 0) {
        window.uiManager.handleMove(1); // 右
      } else {
        window.uiManager.handleMove(3); // 左
      }
    } else {
      // 垂直滑動
      if (dy > 0) {
        window.uiManager.handleMove(2); // 下
      } else {
        window.uiManager.handleMove(0); // 上
      }
    }
  });
}

// 獎懲明細表格管理相關
let rewardData = []; // 紀錄每局各項獎懲明細
const rowsPerPage = 20;
let roundPage = 1;

// 依局數分組，計算該局獎勵（正值）與懲罰（負值以絕對值呈現），合計 = 獎勵 - 懲罰
function groupRecordsByRound(records) {
  const groups = {};
  records.forEach((rec) => {
    if (!groups[rec.move]) {
      groups[rec.move] = { move: rec.move, reward: 0, punish: 0 };
    }
    if (rec.value > 0) {
      groups[rec.move].reward += rec.value;
    } else if (rec.value < 0) {
      groups[rec.move].punish += Math.abs(rec.value);
    }
  });
  const result = [];
  for (const move in groups) {
    groups[move].total = groups[move].reward - groups[move].punish;
    result.push(groups[move]);
  }
  result.sort((a, b) => b.move - a.move); // 最新在前
  return result;
}

// 更新每局獎懲明細表格
function updateRoundSummaryTable() {
  const tbody = document.querySelector("#round-summary-table tbody");
  tbody.innerHTML = "";
  const groupedArray = groupRecordsByRound(rewardData);
  const start = (roundPage - 1) * rowsPerPage;
  const pageData = groupedArray.slice(start, start + rowsPerPage);
  pageData.forEach((record) => {
    const tr = document.createElement("tr");
    const tdMove = document.createElement("td");
    tdMove.textContent = record.move;
    const tdReward = document.createElement("td");
    tdReward.textContent = record.reward;
    if (record.reward >= 1000) {
      tdReward.textContent += " ⭐";
      tdReward.style.color = "gold";
    } else if (record.reward > 0) {
      tdReward.style.color = "red";
    } else {
      tdReward.style.color = "black";
    }
    const tdPunish = document.createElement("td");
    tdPunish.textContent = record.punish;
    if (record.punish >= 1000) {
      tdPunish.textContent += " 👎";
      tdPunish.style.color = "darkred";
    } else if (record.punish > 0) {
      tdPunish.style.color = "green";
    } else {
      tdPunish.style.color = "black";
    }
    const tdTotal = document.createElement("td");
    tdTotal.textContent = record.total;
    tr.appendChild(tdMove);
    tr.appendChild(tdReward);
    tr.appendChild(tdPunish);
    tr.appendChild(tdTotal);
    tbody.appendChild(tr);
  });
}

// 更新局數分頁
function updateRoundPagination() {
  const paginationDiv = document.getElementById("round-pagination");
  paginationDiv.innerHTML = "";
  const groupedArray = groupRecordsByRound(rewardData);
  const totalPages = Math.ceil(groupedArray.length / rowsPerPage);
  if (totalPages <= 1) return;
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "＜";
  prevBtn.disabled = roundPage === 1;
  prevBtn.addEventListener("click", () => {
    roundPage--;
    updateRoundSummaryTable();
    updateRoundPagination();
  });
  paginationDiv.appendChild(prevBtn);
  const pageInfo = document.createElement("span");
  pageInfo.textContent = ` 第 ${roundPage} / ${totalPages} 頁 `;
  paginationDiv.appendChild(pageInfo);
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "＞";
  nextBtn.disabled = roundPage === totalPages;
  nextBtn.addEventListener("click", () => {
    roundPage++;
    updateRoundSummaryTable();
    updateRoundPagination();
  });
  paginationDiv.appendChild(nextBtn);
}

function updateRewardTables() {
  updateRoundSummaryTable();
  updateRoundPagination();
}

// 更新 AI 模式下的獎懲顯示
function updateRewardDisplay(rewardDetails) {
  // 創建更豐富的獎懲顯示
  let positiveReward = 0;
  let negativeReward = 0;

  rewardDetails.forEach((detail) => {
    if (detail.value > 0) {
      positiveReward += detail.value;
    } else {
      negativeReward += Math.abs(detail.value);
    }
  });

  const totalReward = positiveReward - negativeReward;
  document.getElementById("total-reward").textContent = totalReward.toFixed(0);

  // 根據正負值調整顏色
  if (totalReward > 0) {
    document.getElementById("total-reward").style.color = "#388e3c";
  } else if (totalReward < 0) {
    document.getElementById("total-reward").style.color = "#d32f2f";
  } else {
    document.getElementById("total-reward").style.color = "#ef6c00";
  }
}

/***********************
 * 遊戲核心
 ***********************/
class GameCore {
  constructor() {
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.keepPlaying = false;
    this.init();
  }

  init() {
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.keepPlaying = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) emptyCells.push({ row: i, col: j });
      }
    }
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
      return {
        row: randomCell.row,
        col: randomCell.col,
        value: this.board[randomCell.row][randomCell.col],
      };
    }
    return null;
  }

  move(direction) {
    this.moved = false;
    let mergedTiles = [];
    let movedTiles = [];
    switch (direction) {
      case 0:
        for (let col = 0; col < 4; col++)
          this.processCellsUpDown(col, true, mergedTiles, movedTiles);
        break;
      case 1:
        for (let row = 0; row < 4; row++)
          this.processCellsLeftRight(row, false, mergedTiles, movedTiles);
        break;
      case 2:
        for (let col = 0; col < 4; col++)
          this.processCellsUpDown(col, false, mergedTiles, movedTiles);
        break;
      case 3:
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

  processCellsUpDown(col, isUp, mergedTiles, movedTiles) {
    const start = isUp ? 0 : 3,
      step = isUp ? 1 : -1;
    let targetPos = start;
    for (let pos = start; pos !== (isUp ? 4 : -1); pos += step) {
      if (this.board[pos][col] !== 0) {
        let value = this.board[pos][col];
        this.board[pos][col] = 0;
        if (
          targetPos !== start &&
          this.board[targetPos - step][col] === value
        ) {
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

  processCellsLeftRight(row, isLeft, mergedTiles, movedTiles) {
    const start = isLeft ? 0 : 3,
      step = isLeft ? 1 : -1;
    let targetPos = start;
    for (let pos = start; pos !== (isLeft ? 4 : -1); pos += step) {
      if (this.board[row][pos] !== 0) {
        let value = this.board[row][pos];
        this.board[row][pos] = 0;
        if (
          targetPos !== start &&
          this.board[row][targetPos - step] === value
        ) {
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

  setKeepPlaying() {
    this.keepPlaying = true;
  }

  getBoard() {
    return this.board;
  }

  getStateForAI() {
    return {
      board: JSON.parse(JSON.stringify(this.board)),
      score: this.score,
      gameOver: this.gameOver,
    };
  }

  applyMoveFromAI(direction) {
    return this.move(direction);
  }
}

/***********************
 * UI 管理器
 ***********************/
class UIManager {
  constructor(gameCore) {
    this.gameCore = gameCore;
    this.tileContainer = document.getElementById("tile-container");
    this.scoreElement = document.getElementById("score");
    this.bestScoreElement = document.getElementById("best-score");
    this.messageElement = document.getElementById("game-message");
    this.messageTextElement = document.getElementById("message-text");
    this.bestScore = this.loadBestScore();
    this.bestScoreElement.textContent = this.bestScore;
    this.registerEventListeners();
    this.setupTouchEvents();
    this.drawBoard();
  }

  getTilePosition(row, col) {
    const gap = 10; // grid-gap
    const containerSize = this.tileContainer.clientWidth; // 假設正方形
    const cellSize = (containerSize - gap * 3) / 4;
    return {
      top: row * (cellSize + gap) + "px",
      left: col * (cellSize + gap) + "px",
    };
  }

  drawBoard() {
    this.tileContainer.innerHTML = "";
    const board = this.gameCore.getBoard();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0) this.createTile(i, j, board[i][j]);
      }
    }
  }

  createTile(row, col, value) {
    const tile = document.createElement("div");
    tile.className = "tile tile-" + value;
    const pos = this.getTilePosition(row, col);
    tile.style.top = pos.top;
    tile.style.left = pos.left;
    tile.textContent = value;
    this.tileContainer.appendChild(tile);
    return tile;
  }

  // 改進動畫效果 - 移動磚塊
  animateTileMovement(fromRow, fromCol, toRow, toCol, value, merged = false) {
    const fromPos = this.getTilePosition(fromRow, fromCol);
    const toPos = this.getTilePosition(toRow, toCol);

    const tile = document.createElement("div");
    tile.className = "tile tile-" + value + (merged ? " merged" : " moved");
    tile.style.top = fromPos.top;
    tile.style.left = fromPos.left;
    tile.textContent = value;
    this.tileContainer.appendChild(tile);

    // 使用 requestAnimationFrame 來保證動畫流暢度
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tile.style.top = toPos.top;
        tile.style.left = toPos.left;
      });
    });

    return tile;
  }

  // 改進動畫效果 - 新磚塊出現
  animateNewTile(row, col, value) {
    const tile = this.createTile(row, col, value);
    tile.style.transform = "scale(0)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tile.style.transform = "scale(1)";
      });
    });

    return tile;
  }

  // 改進動畫效果 - 合併磚塊
  animateMergedTile(row, col, value) {
    const tile = this.createTile(row, col, value);
    tile.classList.add("merged");
    return tile;
  }

  updateScore() {
    // 計算分數差值
    const scoreChange =
      this.gameCore.score - parseInt(this.scoreElement.textContent);

    // 直接更新固定的加分容器內容，而不再移除它
    const scoreAdditionEl = document.getElementById("score-addition");
    if (scoreChange > 0) {
      scoreAdditionEl.textContent = "+" + scoreChange;
    } else {
      scoreAdditionEl.textContent = "";
    }

    this.scoreElement.textContent = this.gameCore.score;

    if (this.gameCore.score > this.bestScore) {
      this.bestScore = this.gameCore.score;
      this.bestScoreElement.textContent = this.bestScore;
      localStorage.setItem("bestScore", this.bestScore);
    }
  }

  loadBestScore() {
    return parseInt(localStorage.getItem("bestScore")) || 0;
  }

  registerEventListeners() {
    document.addEventListener("keydown", (e) => {
      let direction;
      switch (e.key) {
        case "ArrowUp":
          direction = 0;
          break;
        case "ArrowRight":
          direction = 1;
          break;
        case "ArrowDown":
          direction = 2;
          break;
        case "ArrowLeft":
          direction = 3;
          break;
        default:
          return;
      }
      this.handleMove(direction);
    });

    document.getElementById("restart-button").addEventListener("click", () => {
      this.restartGame();
      showToast("遊戲已重新開始");
    });

    document.getElementById("retry-button").addEventListener("click", () => {
      this.restartGame();
      showToast("遊戲已重新開始");
    });

    document
      .getElementById("keep-playing-button")
      .addEventListener("click", () => {
        this.gameCore.setKeepPlaying();
        this.hideMessage();
      });

    document.getElementById("ai-help-button").addEventListener("click", () => {
      showModal(
        "AI 模式說明",
        "1. ai=1：簡易模式\n2. ai=2：深度模式\n3. ai=3：進階模式 (MCTS)\n4. ai=4：Reward 模式，表格顯示獎懲明細"
      );
    });

    // 監聽速度滑塊變化
    document
      .getElementById("speed-slider")
      .addEventListener("input", function () {
        document.getElementById("speed-value").textContent = this.value;
      });
  }

  // 設置手指滑動事件 (改進移動端體驗)
  setupTouchEvents() {
    const gameContainer = document.querySelector(".game-container");
    let startX, startY, endX, endY;
    const minDistance = 30; // 最小滑動距離

    gameContainer.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        e.preventDefault();
      },
      { passive: false }
    );

    gameContainer.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    gameContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const dx = endX - startX;
      const dy = endY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < minDistance) return;

      // 判斷滑動方向
      let direction;
      if (absDx > absDy) {
        direction = dx > 0 ? 1 : 3; // 右：1, 左：3
      } else {
        direction = dy > 0 ? 2 : 0; // 下：2, 上：0
      }

      this.handleMove(direction);
    });
  }

  handleMove(direction) {
    if (this.gameCore.gameOver) return;
    const result = this.gameCore.move(direction);

    if (result.moved) {
      // 清空容器準備動畫
      this.tileContainer.innerHTML = "";

      // 先顯示移動的磚塊
      const board = this.gameCore.getBoard();
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] !== 0) {
            // 檢查是否是合併了的磚塊
            const isMerged = result.mergedTiles.some(
              (tile) => tile.row === i && tile.col === j && tile.merged
            );

            if (isMerged) {
              this.animateMergedTile(i, j, board[i][j]);
              // 如果是高值磚塊，添加粒子效果
              if (board[i][j] >= 128) {
                onTileMerged(i, j, board[i][j]);
              }
            } else {
              this.createTile(i, j, board[i][j]);
            }
          }
        }
      }

      // 處理分數更新
      this.updateScore();

      // 檢查遊戲狀態
      if (result.gameOver && !this.gameCore.keepPlaying) {
        this.showMessage("遊戲結束");
      } else if (this.has2048() && !this.gameCore.keepPlaying) {
        this.showMessage("你贏了!");
      }
    }
  }

  has2048() {
    const board = this.gameCore.getBoard();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] >= 2048) return true;
      }
    }
    return false;
  }

  restartGame() {
    this.gameCore.init();
    this.drawBoard();
    this.updateScore();
    this.hideMessage();
  }

  showMessage(msg) {
    this.messageTextElement.textContent = msg;

    if (msg === "遊戲結束") {
      showModal(
        "遊戲結束",
        "很遺憾，你的遊戲結束了。你的分數是 " + this.gameCore.score,
        "再試一次",
        () => {
          this.restartGame();
        }
      );
      this.messageElement.classList.add("lose");
    } else if (msg === "你贏了!") {
      showModal(
        "恭喜！",
        "你成功達成了2048！你的分數是 " + this.gameCore.score,
        "繼續遊戲",
        () => {
          this.gameCore.setKeepPlaying();
          this.hideMessage();
        }
      );
      this.messageElement.classList.add("win");
    }

    this.messageElement.classList.add("show");
  }

  hideMessage() {
    this.messageElement.classList.remove("show");
    this.messageElement.classList.remove("win");
    this.messageElement.classList.remove("lose");
  }
}

/***********************
 * AI 策略和評估函數
 ***********************/

// 克隆遊戲狀態
function cloneGameCoreState(state) {
  let clone = new GameCore();
  clone.board = JSON.parse(JSON.stringify(state.board));
  clone.score = state.score;
  clone.gameOver = state.gameOver;
  return clone;
}

// 學習數據和相關變數
let runCount = 0;
let currentMoveNumber = 0;
let learningData = [];

// 學習曲線圖表
var learningChart;

function initLearningChart() {
  const ctx = document.getElementById("learningChart").getContext("2d");
  learningChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: learningData.map((item) => item.run),
      datasets: [
        {
          label: "得分",
          data: learningData.map((item) => item.score),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "rgba(75,192,192,1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            boxWidth: 30,
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          padding: 12,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "局數",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            color: "rgba(200,200,200,0.2)",
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "得分",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            color: "rgba(200,200,200,0.2)",
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
    },
  });
}

function updateLearningChart() {
  if (learningChart) {
    learningChart.data.labels = learningData.map((item) => item.run);
    learningChart.data.datasets[0].data = learningData.map(
      (item) => item.score
    );
    learningChart.update();
  }
}

function updateResultsTable() {
  const tbody = document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  // 按局數降序排列顯示最近的數據
  const sortedData = [...learningData].sort((a, b) => b.run - a.run);

  // 只顯示前10條記錄
  sortedData.slice(0, 10).forEach((item) => {
    const row = document.createElement("tr");

    const runCell = document.createElement("td");
    runCell.textContent = item.run;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = item.score;

    // 高分標記
    if (item.score >= 20000) {
      scoreCell.style.fontWeight = "bold";
      scoreCell.style.color = "#f65e3b";
    } else if (item.score >= 10000) {
      scoreCell.style.color = "#f2b179";
    }

    row.appendChild(runCell);
    row.appendChild(scoreCell);
    tbody.appendChild(row);
  });

  updatePaginationResults();
}

function updatePaginationResults() {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";
  const totalPages = Math.ceil(learningData.length / 10);

  if (totalPages <= 1) return;

  // 增加分頁UI
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      showResultsPage(i);
    });
    paginationDiv.appendChild(btn);
  }

  if (totalPages > 5) {
    const moreBtn = document.createElement("span");
    moreBtn.textContent = "...";
    moreBtn.style.margin = "0 10px";
    paginationDiv.appendChild(moreBtn);

    const lastBtn = document.createElement("button");
    lastBtn.textContent = totalPages;
    lastBtn.addEventListener("click", () => {
      showResultsPage(totalPages);
    });
    paginationDiv.appendChild(lastBtn);
  }
}

function showResultsPage(page) {
  // 實現分頁顯示功能
  const tbody = document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  const sortedData = [...learningData].sort((a, b) => b.run - a.run);
  const start = (page - 1) * 10;
  const end = Math.min(start + 10, sortedData.length);

  for (let i = start; i < end; i++) {
    const item = sortedData[i];
    const row = document.createElement("tr");

    const runCell = document.createElement("td");
    runCell.textContent = item.run;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = item.score;

    if (item.score >= 20000) {
      scoreCell.style.fontWeight = "bold";
      scoreCell.style.color = "#f65e3b";
    } else if (item.score >= 10000) {
      scoreCell.style.color = "#f2b179";
    }

    row.appendChild(runCell);
    row.appendChild(scoreCell);
    tbody.appendChild(row);
  }
}

/**************************************************
 * AI Reward 模式 (ai=4) - 獎勵評估函數
 **************************************************/
function evaluateStateReward(state) {
  let board = state.board,
    bonus = 0;
  // 1. 空格數量
  let emptyCount = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) if (board[i][j] === 0) emptyCount++;
  bonus += emptyCount * 100;
  if (emptyCount < 4) bonus -= 300;
  // 2. 最大值在角落
  let maxTile = 0,
    maxRow = -1,
    maxCol = -1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] > maxTile) {
        maxTile = board[i][j];
        maxRow = i;
        maxCol = j;
      }
    }
  }
  if (
    (maxRow === 0 && maxCol === 0) ||
    (maxRow === 0 && maxCol === 3) ||
    (maxRow === 3 && maxCol === 0) ||
    (maxRow === 3 && maxCol === 3)
  )
    bonus += maxTile * 20;
  else bonus -= maxTile * 15;
  // 3. 單調性排列
  let monotonicityBonus = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 3; j++) {
      let current = board[i][j],
        next = board[i][j + 1];
      if (current !== 0 && next !== 0)
        monotonicityBonus += current >= next ? 50 : -30;
    }
  for (let j = 0; j < 4; j++)
    for (let i = 0; i < 3; i++) {
      let current = board[i][j],
        next = board[i + 1][j];
      if (current !== 0 && next !== 0)
        monotonicityBonus += current >= next ? 50 : -30;
    }
  bonus += monotonicityBonus;
  // 4. 平滑度
  let smoothnessPenalty = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] !== 0)
          smoothnessPenalty -=
            Math.abs(Math.log2(tile) - Math.log2(board[i][j + 1])) * 50;
        if (i < 3 && board[i + 1][j] !== 0)
          smoothnessPenalty -=
            Math.abs(Math.log2(tile) - Math.log2(board[i + 1][j])) * 50;
      }
    }
  bonus += smoothnessPenalty;
  // 5. 合併機會
  let mergeBonus = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] === tile) mergeBonus += tile * 2;
        if (i < 3 && board[i + 1][j] === tile) mergeBonus += tile * 2;
      }
    }
  bonus += mergeBonus;
  // 6. 最大值獎勵
  bonus += maxTile * 10;
  // 7. 底行穩定
  let bottomRow = board[3],
    stable = true;
  for (let j = 0; j < 3; j++) {
    if (bottomRow[j] < bottomRow[j + 1]) {
      stable = false;
      break;
    }
  }
  bonus += stable ? 500 : -500;
  // 8. 生磚區效率：左側 2 列
  let productionBonus = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 2; j++) {
      let tile = board[i][j];
      if (tile >= 64) productionBonus += 500;
      else if (tile >= 32) productionBonus += 200;
    }
  bonus += productionBonus;
  return state.score + bonus;
}

function evaluateRewardDetails(state) {
  let board = state.board;
  let details = [];
  const opMap = {
    空格: "+",
    空格不足: "−",
    角落: "+",
    非角落: "−",
    單調: "+",
    平滑: "÷",
    合併: "×",
    最大: "×",
    底行: "+",
    生磚: "+",
  };
  let emptyCount = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) if (board[i][j] === 0) emptyCount++;
  details.push({
    label: "空格",
    value: emptyCount * 100,
    operator: opMap["空格"],
  });
  if (emptyCount < 4)
    details.push({
      label: "空格不足",
      value: -300,
      operator: opMap["空格不足"],
    });
  let maxTile = 0,
    maxRow = -1,
    maxCol = -1;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      if (board[i][j] > maxTile) {
        maxTile = board[i][j];
        maxRow = i;
        maxCol = j;
      }
  if (
    (maxRow === 0 && maxCol === 0) ||
    (maxRow === 0 && maxCol === 3) ||
    (maxRow === 3 && maxCol === 0) ||
    (maxRow === 3 && maxCol === 3)
  )
    details.push({
      label: "角落",
      value: maxTile * 20,
      operator: opMap["角落"],
    });
  else
    details.push({
      label: "非角落",
      value: -maxTile * 15,
      operator: opMap["非角落"],
    });
  let monotonicityBonus = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 3; j++) {
      let current = board[i][j],
        next = board[i][j + 1];
      if (current !== 0 && next !== 0)
        monotonicityBonus += current >= next ? 50 : -30;
    }
  for (let j = 0; j < 4; j++)
    for (let i = 0; i < 3; i++) {
      let current = board[i][j],
        next = board[i + 1][j];
      if (current !== 0 && next !== 0)
        monotonicityBonus += current >= next ? 50 : -30;
    }
  details.push({
    label: "單調",
    value: monotonicityBonus,
    operator: opMap["單調"],
  });
  let smoothnessPenalty = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] !== 0)
          smoothnessPenalty -=
            Math.abs(Math.log2(tile) - Math.log2(board[i][j + 1])) * 50;
        if (i < 3 && board[i + 1][j] !== 0)
          smoothnessPenalty -=
            Math.abs(Math.log2(tile) - Math.log2(board[i + 1][j])) * 50;
      }
    }
  details.push({
    label: "平滑",
    value: smoothnessPenalty,
    operator: opMap["平滑"],
  });
  let mergeBonus = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] === tile) mergeBonus += tile * 2;
        if (i < 3 && board[i + 1][j] === tile) mergeBonus += tile * 2;
      }
    }
  details.push({
    label: "合併",
    value: mergeBonus,
    operator: opMap["合併"],
  });
  details.push({
    label: "最大",
    value: maxTile * 10,
    operator: opMap["最大"],
  });
  let bottomRow = board[3],
    stable = true;
  for (let j = 0; j < 3; j++) {
    if (bottomRow[j] < bottomRow[j + 1]) {
      stable = false;
      break;
    }
  }
  details.push({
    label: "底行",
    value: stable ? 500 : -500,
    operator: opMap["底行"],
  });
  let productionBonus = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 2; j++) {
      let tile = board[i][j];
      if (tile >= 64) productionBonus += 500;
      else if (tile >= 32) productionBonus += 200;
    }
  details.push({
    label: "生磚",
    value: productionBonus,
    operator: opMap["生磚"],
  });
  return details;
}

function simulateMovesReward(state, depth) {
  if (depth === 0 || state.gameOver) return evaluateStateReward(state);
  let bestScore = -Infinity;
  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);
    if (!result.moved) continue;
    let score = simulateMovesReward(cloned.getStateForAI(), depth - 1);
    if (score > bestScore) bestScore = score;
  }
  return bestScore;
}

function chooseBestMoveReward(state, depth, iterationsPerMove) {
  let bestMove = null,
    bestScore = -Infinity,
    moveStats = {};
  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);
    if (!result.moved) continue;
    let totalScore = 0;
    for (let i = 0; i < iterationsPerMove; i++) {
      let simState = cloneGameCoreState(cloned.getStateForAI());
      totalScore += simulateMovesReward(simState.getStateForAI(), depth);
    }
    let avgScore = totalScore / iterationsPerMove;
    moveStats[direction] = avgScore;
    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestMove = direction;
    }
  }
  return { bestMove, bestScore, moveStats };
}

/***********************
 * AI 模式實現
 ***********************/

// 改進的AI Reward模式 (ai=4)
function aiLoopReward() {
  let currentState = window.gameCore.getStateForAI();
  if (!currentState.gameOver) {
    // 固定模擬深度，不再根據分數調整
    let depth = 5;
    let iterationsPerMove = 10;
    let simulation = chooseBestMoveReward(
      currentState,
      depth,
      iterationsPerMove
    );
    let bestMove = simulation.bestMove;
    if (bestMove === null) bestMove = Math.floor(Math.random() * 4);
    currentMoveNumber++;
    let detailsArray = evaluateRewardDetails(currentState);
    detailsArray.forEach((detail) => {
      rewardData.unshift({
        move: currentMoveNumber,
        label: detail.label,
        operator: detail.operator,
        value: detail.value,
      });
    });

    // 更新獎懲表格和顯示
    updateRewardTables();
    updateRewardDisplay(detailsArray);

    // 執行AI移動
    const result = window.gameCore.applyMoveFromAI(bestMove);
    window.uiManager.drawBoard();
    window.uiManager.updateScore();

    // 如果有合併的磚塊，添加粒子效果
    if (result.mergedTiles) {
      result.mergedTiles.forEach((tile) => {
        if (tile.merged && tile.value >= 128) {
          onTileMerged(tile.row, tile.col, tile.value);
        }
      });
    }

    // 更新AI統計信息
    document.getElementById("ai-stats").innerHTML =
      "AI Reward 模式 (ai=4)：最佳移動 " +
      ["上", "右", "下", "左"][bestMove] +
      "，模擬平均分 " +
      simulation.bestScore.toFixed(0) +
      "，獎懲分數 " +
      evaluateStateReward(currentState).toFixed(0);

    // 設定下一步的時間間隔
    const speed = parseFloat(document.getElementById("speed-slider").value);
    setTimeout(aiLoopReward, speed);
  } else {
    let finalScore = window.gameCore.score;
    runCount++;
    learningData.push({ run: runCount, score: finalScore });
    updateLearningChart();
    updateResultsTable();

    // 顯示遊戲結束信息
    showModal(
      "AI遊戲結束",
      "AI達到了 " + finalScore + " 分！",
      "再次挑戰",
      () => {
        window.uiManager.restartGame();
        showToast("遊戲已重新開始 (AI Reward 模式)");
        setTimeout(aiLoopReward, 1000);
      }
    );
  }
}

// 深度模式 (ai=2)
function evaluateStateDeep(state) {
  let board = state.board;
  let score = state.score;
  let bonus = 0;

  // 1. 空格數量
  let emptyCount = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) emptyCount++;
    }
  }

  bonus += emptyCount * 120;

  // 2. 最大值在角落
  let maxTile = 0,
    maxRow = -1,
    maxCol = -1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] > maxTile) {
        maxTile = board[i][j];
        maxRow = i;
        maxCol = j;
      }
    }
  }

  // 角落獎勵
  if (
    (maxRow === 0 && maxCol === 0) ||
    (maxRow === 0 && maxCol === 3) ||
    (maxRow === 3 && maxCol === 0) ||
    (maxRow === 3 && maxCol === 3)
  ) {
    bonus += maxTile * 50;
  } else {
    bonus -= maxTile * 30;
  }

  // 3. 單調性排列
  let monotonicity = 0;

  // 檢查行的單調性 (左到右)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] !== 0 && board[i][j + 1] !== 0) {
        if (board[i][j] >= board[i][j + 1]) {
          monotonicity += 20;
        } else {
          monotonicity -= 40;
        }
      }
    }
  }

  // 檢查列的單調性 (上到下)
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      if (board[i][j] !== 0 && board[i + 1][j] !== 0) {
        if (board[i][j] >= board[i + 1][j]) {
          monotonicity += 20;
        } else {
          monotonicity -= 40;
        }
      }
    }
  }

  bonus += monotonicity;

  // 4. 平滑度
  let smoothness = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== 0) {
        let tileValue = Math.log2(board[i][j]);

        // 右邊鄰居
        if (j < 3 && board[i][j + 1] !== 0) {
          smoothness -= Math.abs(tileValue - Math.log2(board[i][j + 1])) * 12;
        }

        // 下邊鄰居
        if (i < 3 && board[i + 1][j] !== 0) {
          smoothness -= Math.abs(tileValue - Math.log2(board[i + 1][j])) * 12;
        }
      }
    }
  }

  bonus += smoothness;

  // 5. 合併機會
  let mergeBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== 0) {
        // 右邊相同
        if (j < 3 && board[i][j] === board[i][j + 1]) {
          mergeBonus += board[i][j] * 8;
        }

        // 下邊相同
        if (i < 3 && board[i][j] === board[i + 1][j]) {
          mergeBonus += board[i][j] * 8;
        }
      }
    }
  }

  bonus += mergeBonus;

  return score + bonus;
}

// 模擬深度AI移動
function simulateMovesDeep(state, depth) {
  if (depth === 0 || state.gameOver) {
    return evaluateStateDeep(state);
  }

  let bestScore = -Infinity;

  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);

    if (!result.moved) continue;

    let score = simulateMovesDeep(cloned.getStateForAI(), depth - 1);

    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore === -Infinity ? evaluateStateDeep(state) : bestScore;
}

// 選擇深度AI的最佳移動
function chooseBestMoveDeep(state, depth, iterationsPerMove) {
  let bestMove = null;
  let bestScore = -Infinity;
  let moveStats = {};

  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);

    if (!result.moved) continue;

    let totalScore = 0;

    for (let i = 0; i < iterationsPerMove; i++) {
      let simState = cloneGameCoreState(cloned.getStateForAI());
      totalScore += simulateMovesDeep(simState.getStateForAI(), depth);
    }

    let avgScore = totalScore / iterationsPerMove;
    moveStats[direction] = avgScore.toFixed(0);

    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestMove = direction;
    }
  }

  return { bestMove, bestScore, moveStats };
}

// 深度模式主循環 (ai=2)
function aiLoopDeep() {
  let currentState = window.gameCore.getStateForAI();
  if (!currentState.gameOver) {
    // 調整深度和迭代參數以獲得更好的表現
    let depth = 7; // 增加深度提高AI表現
    let iterationsPerMove = 15; // 增加每步迭代次數

    let simulation = chooseBestMoveDeep(currentState, depth, iterationsPerMove);
    let bestMove = simulation.bestMove;
    if (bestMove === null) bestMove = Math.floor(Math.random() * 4);

    // 添加移動視覺效果
    const moveNames = ["上", "右", "下", "左"];
    document.getElementById("ai-stats").innerHTML =
      `<div class="ai-move-indicator">AI 深度模式選擇: ${moveNames[bestMove]}</div>` +
      `<div class="ai-stats-detail">深度: ${depth}, 平均評分: ${simulation.bestScore.toFixed(
        0
      )}</div>` +
      `<div class="ai-stats-moves">${JSON.stringify(
        simulation.moveStats
      )}</div>`;

    // 執行AI移動並更新UI
    const result = window.gameCore.applyMoveFromAI(bestMove);
    window.uiManager.drawBoard();
    window.uiManager.updateScore();

    // 如果有合併的磚塊，添加粒子效果
    if (result.mergedTiles) {
      result.mergedTiles.forEach((tile) => {
        if (tile.merged && tile.value >= 128) {
          onTileMerged(tile.row, tile.col, tile.value);
        }
      });
    }

    // 根據速度滑塊設定下一次移動的延遲
    const speed = parseFloat(document.getElementById("speed-slider").value);
    setTimeout(aiLoopDeep, speed);
  } else {
    let finalScore = window.gameCore.score;
    runCount++;
    learningData.push({ run: runCount, score: finalScore });
    updateLearningChart();
    updateResultsTable();
    window.uiManager.restartGame();
    showToast("遊戲已重新開始 (AI 深度模式)");
    setTimeout(aiLoopDeep, 1000); // 重啟前稍微暫停一下
  }
}

// MCTS AI 模式 (ai=3) - 進階模式
function aiLoopMCTS() {
  let currentState = window.gameCore.getStateForAI();
  if (!currentState.gameOver) {
    let bestMove = findMCTSMove(currentState);

    if (bestMove === null) {
      // 如果MCTS沒有找到有效移動，回退到簡單策略
      bestMove = Math.floor(Math.random() * 4);
    }

    // 執行移動並更新UI
    const result = window.gameCore.applyMoveFromAI(bestMove);
    window.uiManager.drawBoard();
    window.uiManager.updateScore();

    // 如果有合併的磚塊，添加粒子效果
    if (result.mergedTiles) {
      result.mergedTiles.forEach((tile) => {
        if (tile.merged && tile.value >= 128) {
          onTileMerged(tile.row, tile.col, tile.value);
        }
      });
    }

    // 更新AI狀態
    document.getElementById("ai-stats").innerHTML =
      "AI 進階模式 (MCTS)：最佳移動 " + ["上", "右", "下", "左"][bestMove];

    // 設定下一步的延遲
    const speed = parseFloat(document.getElementById("speed-slider").value);
    setTimeout(aiLoopMCTS, speed);
  } else {
    // 結束遊戲，記錄數據
    let finalScore = window.gameCore.score;
    runCount++;
    learningData.push({ run: runCount, score: finalScore });
    updateLearningChart();
    updateResultsTable();

    // 重置遊戲
    window.uiManager.restartGame();
    showToast("遊戲已重新開始 (AI 進階模式)");

    setTimeout(aiLoopMCTS, 1000);
  }
}

// 使用蒙特卡洛樹搜索 (MCTS) 找出最佳移動
function findMCTSMove(state) {
  const iterations = 500; // 模擬次數
  const validMoves = [];
  const moveStats = {
    visits: [0, 0, 0, 0],
    scores: [0, 0, 0, 0],
  };

  // 檢查哪些移動有效
  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);
    if (result.moved) {
      validMoves.push(direction);
    }
  }

  if (validMoves.length === 0) return null;

  // 對每個有效移動執行MCTS
  for (let i = 0; i < iterations; i++) {
    // 選擇一個有效的移動方向
    const directionIndex = Math.floor(Math.random() * validMoves.length);
    const direction = validMoves[directionIndex];

    // 克隆狀態並應用移動
    let cloned = cloneGameCoreState(state);
    cloned.move(direction);

    // 從這個狀態開始模擬一個隨機遊戲直到結束
    const simulationResult = simulateRandomGame(cloned.getStateForAI());

    // 更新統計數據
    moveStats.visits[direction]++;
    moveStats.scores[direction] += simulationResult.score;
  }

  // 選擇最佳移動（平均分數最高的）
  let bestDirection = validMoves[0];
  let bestAvgScore =
    moveStats.scores[bestDirection] / moveStats.visits[bestDirection];

  for (const direction of validMoves) {
    const avgScore = moveStats.scores[direction] / moveStats.visits[direction];
    if (avgScore > bestAvgScore) {
      bestAvgScore = avgScore;
      bestDirection = direction;
    }
  }

  return bestDirection;
}

// 模擬一個隨機遊戲直到結束
function simulateRandomGame(state) {
  let cloned = cloneGameCoreState(state);
  let moveCount = 0;
  const maxMoves = 500; // 防止無限循環

  while (!cloned.gameOver && moveCount < maxMoves) {
    // 隨機選擇一個方向
    const validMoves = [];
    for (let direction = 0; direction < 4; direction++) {
      let testClone = cloneGameCoreState(cloned.getStateForAI());
      let result = testClone.move(direction);
      if (result.moved) {
        validMoves.push(direction);
      }
    }

    if (validMoves.length === 0) break;

    // 隨機選擇一個有效方向
    const randomDirection =
      validMoves[Math.floor(Math.random() * validMoves.length)];
    cloned.move(randomDirection);
    moveCount++;
  }

  return {
    score: cloned.score,
    moves: moveCount,
  };
}

// 簡易AI移動 (ai=1)
function aiLoop() {
  let currentState = window.gameCore.getStateForAI();

  if (!currentState.gameOver) {
    // 計算最佳移動方向
    let bestDirection = findBestMove(currentState);
    if (bestDirection === null) {
      // 如果沒有找到最佳移動，隨機選擇一個方向
      let possibleMoves = [];
      for (let direction = 0; direction < 4; direction++) {
        let cloned = cloneGameCoreState(currentState);
        if (cloned.move(direction).moved) {
          possibleMoves.push(direction);
        }
      }

      if (possibleMoves.length > 0) {
        bestDirection =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      } else {
        bestDirection = Math.floor(Math.random() * 4);
      }
    }

    // 執行移動
    const result = window.gameCore.applyMoveFromAI(bestDirection);
    window.uiManager.drawBoard();
    window.uiManager.updateScore();

    // 如果有合併的磚塊，添加粒子效果
    if (result.mergedTiles) {
      result.mergedTiles.forEach((tile) => {
        if (tile.merged && tile.value >= 128) {
          onTileMerged(tile.row, tile.col, tile.value);
        }
      });
    }

    // 更新AI統計信息
    document.getElementById("ai-stats").innerHTML =
      "AI 簡易模式：當前移動 " + ["上", "右", "下", "左"][bestDirection];

    // 設定下一步的時間間隔
    const speed = parseFloat(document.getElementById("speed-slider").value);
    setTimeout(aiLoop, speed);
  } else {
    let finalScore = window.gameCore.score;
    runCount++;
    learningData.push({ run: runCount, score: finalScore });
    updateLearningChart();
    updateResultsTable();
    window.uiManager.restartGame();
    showToast("遊戲已重新開始 (AI 簡易模式)");
    setTimeout(aiLoop, 1000);
  }
}

// 簡易AI的評估函數
function findBestMove(state) {
  const scores = [0, 0, 0, 0]; // 上, 右, 下, 左

  // 嘗試每個方向
  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);

    if (!result.moved) {
      scores[direction] = -Infinity;
      continue;
    }

    // 基本評分 = 移動後得分 - 當前得分
    let score = result.score - state.score;

    // 檢查空格數量
    let emptyCount = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (cloned.board[i][j] === 0) {
          emptyCount++;
        }
      }
    }

    // 空格獎勵
    score += emptyCount * 10;

    // 尋找最大磚塊
    let maxTile = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        maxTile = Math.max(maxTile, cloned.board[i][j]);
      }
    }

    // 最大磚塊獎勵
    score += Math.log2(maxTile) * 15;

    scores[direction] = score;
  }

  // 找出最高分數的移動方向
  let bestDirection = -1;
  let bestScore = -Infinity;

  for (let direction = 0; direction < 4; direction++) {
    if (scores[direction] > bestScore) {
      bestScore = scores[direction];
      bestDirection = direction;
    }
  }

  return bestDirection !== -1 ? bestDirection : null;
}

/***********************
 * 應用程式初始化
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener(
    "touchmove",
    (e) => {
      // 檢查是否來自具有 class "scrollable" 的元素
      if (!e.target.closest(".scrollable")) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  const urlParams = new URLSearchParams(window.location.search);
  let aiMode = urlParams.get("ai");
  if (aiMode) {
    document.body.classList.add("ai-mode");
  } else {
    document.body.classList.add("normal-mode");
    // 一般模式下，才防止手機滾動
    document.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }

  // 初始化遊戲核心和UI
  window.gameCore = new GameCore();
  window.uiManager = new UIManager(window.gameCore);

  // 添加特效和觸控支援
  addCuteTileEffects();
  setupTouchControls();

  // 設定速度滑塊事件
  const speedSlider = document.getElementById("speed-slider");
  const speedValue = document.getElementById("speed-value");

  speedSlider.addEventListener("input", function () {
    speedValue.textContent = this.value;
  });

  // 根據 URL 參數選擇 AI 模式
  if (aiMode === "4") {
    document.getElementById("ai-control").style.display = "block";
    document.getElementById("learning-stats").style.display = "block";
    document.getElementById("reward-summary").style.display = "block";
    showToast("AI Reward 模式 (ai=4) 啟用！");
    initLearningChart();
    aiLoopReward();
  } else if (aiMode === "3") {
    document.getElementById("ai-control").style.display = "block";
    document.getElementById("learning-stats").style.display = "block";
    showToast("AI 進階模式 (ai=3) 啟用！");
    initLearningChart();
    aiLoopMCTS();
  } else if (aiMode === "2") {
    document.getElementById("ai-control").style.display = "block";
    document.getElementById("learning-stats").style.display = "block";
    showToast("AI 深度模式 (ai=2) 啟用！");
    initLearningChart();
    aiLoopDeep();
  } else if (aiMode === "1") {
    document.getElementById("ai-control").style.display = "block";
    document.getElementById("learning-stats").style.display = "block";
    showToast("AI 簡易模式 (ai=1) 啟用！");
    initLearningChart();
    aiLoop();
  }
});
