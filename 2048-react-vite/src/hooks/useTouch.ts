import { useEffect, useRef } from 'react';

interface TouchStart {
  x: number;
  y: number;
  time: number;
}

/**
 * 觸控控制 Hook
 * 處理滑動手勢
 */
export function useTouch(
  containerRef: React.RefObject<HTMLElement | null>,
  onMove: (direction: number) => void,
  enabled: boolean = true
): void {
  const touchStartRef = useRef<TouchStart>({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent): void => {
      const touch = e.touches[0];
      if (touch) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent): void => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent): void => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartRef.current.time;

      // 如果觸摸時間太短或太長，可能不是有效滑動
      if (touchDuration < 30 || touchDuration > 1000) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const endX = touch.clientX;
      const endY = touch.clientY;

      const dx = endX - touchStartRef.current.x;
      const dy = endY - touchStartRef.current.y;

      // 確保滑動距離足夠
      const minSwipeDistance = 30;
      if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
        return;
      }

      // 確定主要滑動方向
      let direction: number;
      if (Math.abs(dx) > Math.abs(dy)) {
        // 水平滑動
        direction = dx > 0 ? 1 : 3; // 右 : 左
      } else {
        // 垂直滑動
        direction = dy > 0 ? 2 : 0; // 下 : 上
      }

      onMove(direction);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerRef, onMove, enabled]);
}
