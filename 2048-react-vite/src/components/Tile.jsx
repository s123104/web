/**
 * Tile 磚塊組件
 * 顯示單個遊戲磚塊
 */
export function Tile({ row, col, value, merged = false }) {
  const getTileColor = (val) => {
    const colors = {
      2: 'bg-tile-2 text-text-dark',
      4: 'bg-tile-4 text-text-dark',
      8: 'bg-tile-8 text-text-light',
      16: 'bg-tile-16 text-text-light',
      32: 'bg-tile-32 text-text-light',
      64: 'bg-tile-64 text-text-light',
      128: 'bg-tile-128 text-text-light',
      256: 'bg-tile-256 text-text-light',
      512: 'bg-tile-512 text-text-light',
      1024: 'bg-tile-1024 text-text-light',
      2048: 'bg-tile-2048 text-text-light',
    };
    return colors[val] || 'bg-gradient-to-br from-purple-500 to-pink-500 text-text-light';
  };

  const getFontSize = (val) => {
    if (val < 100) return 'text-[40px] max-[520px]:text-[20px] max-[350px]:text-[16px]';
    if (val < 1000) return 'text-[36px] max-[520px]:text-[18px] max-[350px]:text-[16px]';
    if (val < 10000) return 'text-[28px] max-[520px]:text-[16px] max-[350px]:text-[16px]';
    return 'text-[24px] max-[520px]:text-[16px] max-[350px]:text-[16px]';
  };

  const position = {
    top: `${row * 115}px`,
    left: `${col * 115}px`,
  };

  return (
    <div
      className={`
        absolute w-[105px] h-[105px] rounded-lg
        flex items-center justify-center font-bold
        shadow-tile transition-all duration-150 ease-in-out
        ${getTileColor(value)}
        ${getFontSize(value)}
        ${merged ? 'animate-tile-merge z-20' : 'animate-tile-appear z-10'}
        ${value >= 128 ? 'animate-glow' : ''}
        ${value >= 4096 ? 'animate-super-glow' : ''}
        ${value >= 16384 ? 'animate-mega-glow' : ''}
      `}
      style={position}
    >
      {value}
    </div>
  );
}
