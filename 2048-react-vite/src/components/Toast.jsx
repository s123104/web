import { useEffect, useState } from 'react';

/**
 * Toast 提示組件
 * 顯示臨時通知消息
 */
export function Toast({ message, duration = 2500, show, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      id="toast"
      className={`
        fixed z-[1000] left-1/2 -translate-x-1/2
        min-w-[280px] bg-[#333] text-white text-center
        rounded-lg px-4 py-3.5 text-base shadow-lg
        transition-all duration-300
        ${isVisible ? 'opacity-100 bottom-10 visible' : 'opacity-0 bottom-8 invisible'}
      `}
    >
      {message}
    </div>
  );
}
