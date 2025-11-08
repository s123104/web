import { useRef, forwardRef } from 'react';
import { Tile } from './Tile';

/**
 * GameBoard 遊戲板組件
 * 顯示 4x4 遊戲網格和磚塊
 */
export const GameBoard = forwardRef(({ board, mergedTiles = [] }, ref) => {
  // 創建 4x4 網格背景
  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < 16; i++) {
      cells.push(
        <div
          key={i}
          className="rounded-lg bg-grid-cell shadow-inner"
          style={{ boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.1)' }}
        />
      );
    }
    return cells;
  };

  // 渲染磚塊
  const renderTiles = () => {
    const tiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0) {
          const isMerged = mergedTiles.some(
            (tile) => tile.row === i && tile.col === j && tile.merged
          );
          tiles.push(
            <Tile
              key={`${i}-${j}-${board[i][j]}`}
              row={i}
              col={j}
              value={board[i][j]}
              merged={isMerged}
            />
          );
        }
      }
    }
    return tiles;
  };

  return (
    <div
      ref={ref}
      className="relative w-[480px] h-[480px] bg-board-bg rounded-xl mx-auto mb-8 p-2.5 shadow-game transition-all duration-300 hover:shadow-2xl max-[520px]:w-[300px] max-[520px]:h-[300px] max-[350px]:w-[280px] max-[350px]:h-[280px]"
    >
      {/* 背景網格 */}
      <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-2.5 rounded-lg">
        {renderGrid()}
      </div>

      {/* 磚塊容器 */}
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 z-10">
        {renderTiles()}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
