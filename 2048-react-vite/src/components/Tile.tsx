interface TileProps {
  row: number;
  col: number;
  value: number;
  merged?: boolean;
}

/**
 * Tile 磚塊組件
 * 顯示單個遊戲磚塊
 * 使用 Tailwind v4 @theme tokens 實現專業化設計系統
 */
export function Tile({ row, col, value, merged = false }: TileProps) {
  const getTileColor = (val: number): string => {
    const colors: Record<number, string> = {
      2: 'bg-tile-2-bg text-tile-2-text',
      4: 'bg-tile-4-bg text-tile-4-text',
      8: 'bg-tile-8-bg text-tile-8-text',
      16: 'bg-tile-16-bg text-tile-16-text',
      32: 'bg-tile-32-bg text-tile-32-text',
      64: 'bg-tile-64-bg text-tile-64-text',
      128: 'bg-tile-128-bg text-tile-128-text',
      256: 'bg-tile-256-bg text-tile-256-text',
      512: 'bg-tile-512-bg text-tile-512-text',
      1024: 'bg-tile-1024-bg text-tile-1024-text',
      2048: 'bg-tile-2048-bg text-tile-2048-text',
    };
    return colors[val] || 'bg-gradient-to-br from-purple-500 to-pink-500 text-tile-2048-text';
  };

  const getFontSize = (val: number): string => {
    if (val < 100) return 'text-[40px] max-[520px]:text-[20px] max-[350px]:text-[16px]';
    if (val < 1000) return 'text-[36px] max-[520px]:text-[18px] max-[350px]:text-[16px]';
    if (val < 10000) return 'text-[28px] max-[520px]:text-[16px] max-[350px]:text-[16px]';
    return 'text-[24px] max-[520px]:text-[16px] max-[350px]:text-[16px]';
  };

  // Position calculation matching original CSS grid layout
  // cell_width = (100% - 3×gap) / 4
  // position = index × (cell_width + gap) = index × (100% + gap) / 4
  const position = {
    top: `calc(${row} * (100% + 10px) / 4)`,
    left: `calc(${col} * (100% + 10px) / 4)`,
  };

  return (
    <div
      className={`
        absolute rounded-lg
        w-[calc((100%-30px)/4)] h-[calc((100%-30px)/4)]
        flex items-center justify-center font-bold
        transition-all duration-150 ease-in-out
        ${getTileColor(value)}
        ${getFontSize(value)}
        ${merged ? 'z-20' : 'z-10'}
        ${value >= 128 ? '[box-shadow:var(--shadow-tile)]' : ''}
      `}
      style={{
        ...position,
        boxShadow: 'var(--shadow-tile)',
        animation: merged
          ? 'var(--animation-tile-merge)'
          : 'var(--animation-tile-appear)',
      }}
    >
      {value}
    </div>
  );
}
