import { useEffect } from 'react';

/**
 * 鍵盤控制 Hook
 * 監聽方向鍵並觸發移動
 */
export function useKeyboard(
  onMove: (direction: number) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      let direction: number | undefined;

      switch (e.key) {
        case 'ArrowUp':
          direction = 0;
          e.preventDefault();
          break;
        case 'ArrowRight':
          direction = 1;
          e.preventDefault();
          break;
        case 'ArrowDown':
          direction = 2;
          e.preventDefault();
          break;
        case 'ArrowLeft':
          direction = 3;
          e.preventDefault();
          break;
        default:
          return;
      }

      if (direction !== undefined) {
        onMove(direction);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove, enabled]);
}
