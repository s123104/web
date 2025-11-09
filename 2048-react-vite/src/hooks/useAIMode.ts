import { useState, useEffect } from 'react';

export type AIMode = 0 | 1 | 2 | 3 | 4;

/**
 * useAIMode Hook
 * 從 URL 參數讀取 AI 模式 (?ai=1-4)
 *
 * @returns aiMode - 當前 AI 模式 (0: 人工, 1-4: AI 模式)
 */
export function useAIMode(): AIMode {
  const [aiMode, setAIMode] = useState<AIMode>(0);

  useEffect(() => {
    // 讀取 URL 參數
    const params = new URLSearchParams(window.location.search);
    const aiParam = params.get('ai');

    if (aiParam) {
      const mode = parseInt(aiParam, 10);
      // 驗證模式是否有效 (1-4)
      if (mode >= 1 && mode <= 4) {
        setAIMode(mode as AIMode);

        // 添加 ai-mode class 到 body（如原版）
        document.body.classList.add('ai-mode');
        document.documentElement.classList.add('ai-mode');

        console.log(`[AI Mode] Enabled: ai=${mode}`);
      } else {
        console.warn(`[AI Mode] Invalid mode: ${aiParam}. Using manual mode.`);
      }
    } else {
      // 正常模式，添加 normal-mode class
      document.body.classList.add('normal-mode');
      document.documentElement.classList.add('normal-mode');
    }

    // Cleanup
    return () => {
      document.body.classList.remove('ai-mode', 'normal-mode');
      document.documentElement.classList.remove('ai-mode', 'normal-mode');
    };
  }, []);

  return aiMode;
}
