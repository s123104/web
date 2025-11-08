import { cloneGameCoreState } from './gameCore';

/**
 * AI 策略集合
 * 包含簡易、深度、MCTS、Reward 四種模式
 */

/* ========================================
 * 簡易 AI 模式 (ai=1)
 * ======================================== */

/**
 * 簡易 AI 的評估函數
 */
export function findBestMove(state) {
  const scores = [0, 0, 0, 0]; // 上, 右, 下, 左

  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);

    if (!result.moved) {
      scores[direction] = -Infinity;
      continue;
    }

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

    score += emptyCount * 10;

    // 尋找最大磚塊
    let maxTile = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        maxTile = Math.max(maxTile, cloned.board[i][j]);
      }
    }

    score += Math.log2(maxTile) * 15;
    scores[direction] = score;
  }

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

/* ========================================
 * 深度 AI 模式 (ai=2)
 * ======================================== */

/**
 * 深度模式評估函數
 */
export function evaluateStateDeep(state) {
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
  let maxTile = 0, maxRow = -1, maxCol = -1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] > maxTile) {
        maxTile = board[i][j];
        maxRow = i;
        maxCol = j;
      }
    }
  }

  if ((maxRow === 0 && maxCol === 0) || (maxRow === 0 && maxCol === 3) ||
      (maxRow === 3 && maxCol === 0) || (maxRow === 3 && maxCol === 3)) {
    bonus += maxTile * 50;
  } else {
    bonus -= maxTile * 30;
  }

  // 3. 單調性排列
  let monotonicity = 0;
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
        if (j < 3 && board[i][j + 1] !== 0) {
          smoothness -= Math.abs(tileValue - Math.log2(board[i][j + 1])) * 12;
        }
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
        if (j < 3 && board[i][j] === board[i][j + 1]) {
          mergeBonus += board[i][j] * 8;
        }
        if (i < 3 && board[i][j] === board[i + 1][j]) {
          mergeBonus += board[i][j] * 8;
        }
      }
    }
  }
  bonus += mergeBonus;

  return score + bonus;
}

/**
 * 模擬深度AI移動
 */
export function simulateMovesDeep(state, depth) {
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

/**
 * 選擇深度AI的最佳移動
 */
export function chooseBestMoveDeep(state, depth, iterationsPerMove) {
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

/* ========================================
 * MCTS AI 模式 (ai=3)
 * ======================================== */

/**
 * 模擬一個隨機遊戲直到結束
 */
export function simulateRandomGame(state) {
  let cloned = cloneGameCoreState(state);
  let moveCount = 0;
  const maxMoves = 500;

  while (!cloned.gameOver && moveCount < maxMoves) {
    const validMoves = [];
    for (let direction = 0; direction < 4; direction++) {
      let testClone = cloneGameCoreState(cloned.getStateForAI());
      let result = testClone.move(direction);
      if (result.moved) {
        validMoves.push(direction);
      }
    }

    if (validMoves.length === 0) break;

    const randomDirection = validMoves[Math.floor(Math.random() * validMoves.length)];
    cloned.move(randomDirection);
    moveCount++;
  }

  return {
    score: cloned.score,
    moves: moveCount,
  };
}

/**
 * 使用 MCTS 找出最佳移動
 */
export function findMCTSMove(state) {
  const iterations = 500;
  const validMoves = [];
  const moveStats = {
    visits: [0, 0, 0, 0],
    scores: [0, 0, 0, 0],
  };

  for (let direction = 0; direction < 4; direction++) {
    let cloned = cloneGameCoreState(state);
    let result = cloned.move(direction);
    if (result.moved) {
      validMoves.push(direction);
    }
  }

  if (validMoves.length === 0) return null;

  for (let i = 0; i < iterations; i++) {
    const directionIndex = Math.floor(Math.random() * validMoves.length);
    const direction = validMoves[directionIndex];

    let cloned = cloneGameCoreState(state);
    cloned.move(direction);

    const simulationResult = simulateRandomGame(cloned.getStateForAI());

    moveStats.visits[direction]++;
    moveStats.scores[direction] += simulationResult.score;
  }

  let bestDirection = validMoves[0];
  let bestAvgScore = moveStats.scores[bestDirection] / moveStats.visits[bestDirection];

  for (const direction of validMoves) {
    const avgScore = moveStats.scores[direction] / moveStats.visits[direction];
    if (avgScore > bestAvgScore) {
      bestAvgScore = avgScore;
      bestDirection = direction;
    }
  }

  return bestDirection;
}

/* ========================================
 * Reward AI 模式 (ai=4)
 * ======================================== */

/**
 * Reward 模式評估函數
 */
export function evaluateStateReward(state) {
  let board = state.board;
  let bonus = 0;

  // 1. 空格數量
  let emptyCount = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) emptyCount++;
    }
  }
  bonus += emptyCount * 100;
  if (emptyCount < 4) bonus -= 300;

  // 2. 最大值在角落
  let maxTile = 0, maxRow = -1, maxCol = -1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] > maxTile) {
        maxTile = board[i][j];
        maxRow = i;
        maxCol = j;
      }
    }
  }

  if ((maxRow === 0 && maxCol === 0) || (maxRow === 0 && maxCol === 3) ||
      (maxRow === 3 && maxCol === 0) || (maxRow === 3 && maxCol === 3)) {
    bonus += maxTile * 20;
  } else {
    bonus -= maxTile * 15;
  }

  // 3. 單調性
  let monotonicityBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      let current = board[i][j], next = board[i][j + 1];
      if (current !== 0 && next !== 0) {
        monotonicityBonus += current >= next ? 50 : -30;
      }
    }
  }
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      let current = board[i][j], next = board[i + 1][j];
      if (current !== 0 && next !== 0) {
        monotonicityBonus += current >= next ? 50 : -30;
      }
    }
  }
  bonus += monotonicityBonus;

  // 4. 平滑度
  let smoothnessPenalty = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] !== 0) {
          smoothnessPenalty -= Math.abs(Math.log2(tile) - Math.log2(board[i][j + 1])) * 50;
        }
        if (i < 3 && board[i + 1][j] !== 0) {
          smoothnessPenalty -= Math.abs(Math.log2(tile) - Math.log2(board[i + 1][j])) * 50;
        }
      }
    }
  }
  bonus += smoothnessPenalty;

  // 5. 合併機會
  let mergeBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] === tile) mergeBonus += tile * 2;
        if (i < 3 && board[i + 1][j] === tile) mergeBonus += tile * 2;
      }
    }
  }
  bonus += mergeBonus;

  // 6. 最大值獎勵
  bonus += maxTile * 10;

  // 7. 底行穩定
  let bottomRow = board[3], stable = true;
  for (let j = 0; j < 3; j++) {
    if (bottomRow[j] < bottomRow[j + 1]) {
      stable = false;
      break;
    }
  }
  bonus += stable ? 500 : -500;

  // 8. 生磚區效率
  let productionBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      let tile = board[i][j];
      if (tile >= 64) productionBonus += 500;
      else if (tile >= 32) productionBonus += 200;
    }
  }
  bonus += productionBonus;

  return state.score + bonus;
}

/**
 * 評估獎懲明細
 */
export function evaluateRewardDetails(state) {
  let board = state.board;
  let details = [];

  const opMap = {
    '空格': '+', '空格不足': '−', '角落': '+', '非角落': '−',
    '單調': '+', '平滑': '÷', '合併': '×', '最大': '×',
    '底行': '+', '生磚': '+',
  };

  let emptyCount = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) emptyCount++;
    }
  }
  details.push({ label: '空格', value: emptyCount * 100, operator: opMap['空格'] });
  if (emptyCount < 4) {
    details.push({ label: '空格不足', value: -300, operator: opMap['空格不足'] });
  }

  let maxTile = 0, maxRow = -1, maxCol = -1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] > maxTile) {
        maxTile = board[i][j];
        maxRow = i;
        maxCol = j;
      }
    }
  }

  if ((maxRow === 0 && maxCol === 0) || (maxRow === 0 && maxCol === 3) ||
      (maxRow === 3 && maxCol === 0) || (maxRow === 3 && maxCol === 3)) {
    details.push({ label: '角落', value: maxTile * 20, operator: opMap['角落'] });
  } else {
    details.push({ label: '非角落', value: -maxTile * 15, operator: opMap['非角落'] });
  }

  let monotonicityBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      let current = board[i][j], next = board[i][j + 1];
      if (current !== 0 && next !== 0) {
        monotonicityBonus += current >= next ? 50 : -30;
      }
    }
  }
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      let current = board[i][j], next = board[i + 1][j];
      if (current !== 0 && next !== 0) {
        monotonicityBonus += current >= next ? 50 : -30;
      }
    }
  }
  details.push({ label: '單調', value: monotonicityBonus, operator: opMap['單調'] });

  let smoothnessPenalty = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] !== 0) {
          smoothnessPenalty -= Math.abs(Math.log2(tile) - Math.log2(board[i][j + 1])) * 50;
        }
        if (i < 3 && board[i + 1][j] !== 0) {
          smoothnessPenalty -= Math.abs(Math.log2(tile) - Math.log2(board[i + 1][j])) * 50;
        }
      }
    }
  }
  details.push({ label: '平滑', value: smoothnessPenalty, operator: opMap['平滑'] });

  let mergeBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = board[i][j];
      if (tile !== 0) {
        if (j < 3 && board[i][j + 1] === tile) mergeBonus += tile * 2;
        if (i < 3 && board[i + 1][j] === tile) mergeBonus += tile * 2;
      }
    }
  }
  details.push({ label: '合併', value: mergeBonus, operator: opMap['合併'] });
  details.push({ label: '最大', value: maxTile * 10, operator: opMap['最大'] });

  let bottomRow = board[3], stable = true;
  for (let j = 0; j < 3; j++) {
    if (bottomRow[j] < bottomRow[j + 1]) {
      stable = false;
      break;
    }
  }
  details.push({ label: '底行', value: stable ? 500 : -500, operator: opMap['底行'] });

  let productionBonus = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      let tile = board[i][j];
      if (tile >= 64) productionBonus += 500;
      else if (tile >= 32) productionBonus += 200;
    }
  }
  details.push({ label: '生磚', value: productionBonus, operator: opMap['生磚'] });

  return details;
}

/**
 * 模擬 Reward 移動
 */
export function simulateMovesReward(state, depth) {
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

/**
 * 選擇 Reward 模式最佳移動
 */
export function chooseBestMoveReward(state, depth, iterationsPerMove) {
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
