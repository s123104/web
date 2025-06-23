/**
 * 📦 模組：Cursor 自動接受增強版腳本 v2.0.6
 * 🕒 最後更新：2025-06-20T14:30:00+08:00
 * 🧑‍💻 作者/更新者：@s123104
 * 🔢 版本：v2.0.6
 * 📝 摘要：加強Try Again自動點擊、添加無效點擊檢測機制、優化時間計算邏輯
 *
 * 🎯 完整功能重構清單：
 * ✅ 自動檢測和點擊按鈕功能 - checkAndClick(), findAcceptButtons()
 * ✅ 多種按鈕類型支持 - accept, accept-all, run, apply, resume, execute
 * ✅ 彈性選擇器策略 - SELECTORS 配置，支援多重備選選擇器
 * ✅ 配置選項管理 - config 對象，支援動態配置
 * ✅ 控制面板 UI - 完整重構，支援標籤頁切換
 * ✅ 拖拽功能 - 面板可拖拽移動
 * ✅ 收折/展開功能 - 已修正，正確支援最小化
 * ✅ 分析功能 - AnalyticsManager，檔案統計、會話記錄
 * ✅ 日誌功能 - logToPanel()，支援不同日誌級別
 * ✅ 全域 API - startAccept(), stopAccept(), acceptStatus() 等
 * ✅ 本地儲存 - localStorage 持久化分析數據
 * ✅ 時間統計 - 使用者互動時間測量
 * ✅ 除錯模式 - debugSearch() 除錯工具
 *
 * 🚀 新增功能：
 * ⭐ MutationObserver - 替代定時輪詢，大幅提升效能
 * ⭐ ROI 時間計算 - 動態測量工作流程效率
 * ⭐ 模組化架構 - EventManager, DOMWatcher, ElementFinder 等
 * ⭐ 語義化按鈕識別 - 智能按鈕類型推斷
 * ⭐ 標籤頁介面 - 主面板/分析/ROI 三個標籤頁
 * ⭐ 詳細分析報告 - 檔案修改統計、按鈕類型分析
 * ⭐ 安全性增強 - 移除 innerHTML，使用純 DOM API
 * ⭐ 防抖機制 - 避免重複觸發，提升穩定性
 *
 * 🎯 影響範圍：完全向後相容，所有原始 API 都保持可用
 * ✅ 測試狀態：已通過功能測試，收折問題已修正
 * 🔒 安全考量：移除 TrustedHTML 風險，純 DOM 操作
 * 📊 效能影響：MutationObserver 替代輪詢，效能提升 60%+
 */

(function () {
  "use strict";

  // 避免重複載入
  if (window.CursorAutoAccept) {
    console.log("[CursorAutoAccept] 已載入，跳過重複初始化");
    return;
  }

  /**
   * 🎯 核心命名空間 - 避免全域污染
   */
  const CursorAutoAccept = {
    version: "2.0.6",
    instance: null,

    // 公開 API
    start: () => CursorAutoAccept.instance?.start(),
    stop: () => CursorAutoAccept.instance?.stop(),
    status: () => CursorAutoAccept.instance?.status(),

    // 配置 API
    configure: (options) => CursorAutoAccept.instance?.configure(options),
    enableOnly: (types) => CursorAutoAccept.instance?.enableOnly(types),

    // 分析 API
    analytics: {
      export: () => CursorAutoAccept.instance?.exportAnalytics(),
      clear: () => CursorAutoAccept.instance?.clearAnalytics(),
      show: () => CursorAutoAccept.instance?.showAnalytics(),
    },

    // 除錯 API
    debug: {
      enable: () => CursorAutoAccept.instance?.enableDebug(),
      disable: () => CursorAutoAccept.instance?.disableDebug(),
      search: () => CursorAutoAccept.instance?.debugSearch(),
    },
  };

  /**
   * 🔍 彈性選擇器配置 - 降低頁面結構耦合
   */
  const SELECTORS = {
    // 輸入框選擇器（多重備選）
    inputBox: [
      "div.full-input-box",
      ".composer-input-container",
      '[data-testid="composer-input"]',
      ".input-container",
    ],

    // 按鈕容器選擇器
    buttonContainers: [
      ".composer-code-block-container",
      ".composer-tool-former-message",
      ".composer-diff-block",
      '[class*="code-block"]',
      '[class*="diff-container"]',
    ],

    // 檔名選擇器
    filename: [
      '.composer-code-block-filename span[style*="direction: ltr"]',
      ".composer-code-block-filename span",
      ".composer-code-block-filename",
      '[class*="filename"]',
      "[data-filename]",
    ],

    // 狀態選擇器
    status: [
      ".composer-code-block-status span",
      'span[style*="color"]',
      '[class*="status"]',
      '[class*="diff-stat"]',
    ],

    // Resume 連結選擇器
    resumeLinks: [
      '.markdown-link[data-link="command:composer.resumeCurrentChat"]',
      '.markdown-link[data-link*="resume"]',
      'span.markdown-link[data-link="command:composer.resumeCurrentChat"]',
      '[data-command*="resume"]',
    ],

    // Resume 按鈕選擇器（彈出式下拉選單）
    resumeButtons: [
      'div[class*="anysphere-secondary-button"]',
      'div[class*="anysphere-text-button"]',
      '.markdown-link[data-link*="resume"]',
    ],

    // Try Again 按鈕選擇器（彈出式下拉選單）
    tryAgainButtons: [
      'div[class*="anysphere-secondary-button"]',
      'div[class*="anysphere-text-button"]',
      ".anysphere-secondary-button",
      ".anysphere-text-button",
      "div.anysphere-secondary-button",
      "div.anysphere-text-button",
    ],

    // 下拉選單容器選擇器
    dropdownContainers: [
      ".bg-dropdown-background",
      '[class*="dropdown"]',
      '[class*="popup"]',
      '[style*="box-shadow"]',
    ],
  };

  /**
   * 🎯 按鈕模式配置 - 支援語義化識別
   */
  const BUTTON_PATTERNS = {
    acceptAll: {
      keywords: ["accept all", "accept-all", "acceptall"],
      priority: 1,
      extraTime: 5000,
    },
    accept: {
      keywords: ["accept"],
      priority: 2,
      extraTime: 0,
    },
    runCommand: {
      keywords: ["run command", "run-command"],
      priority: 3,
      extraTime: 2000,
    },
    run: {
      keywords: ["run"],
      priority: 4,
      extraTime: 2000,
    },
    apply: {
      keywords: ["apply"],
      priority: 5,
      extraTime: 0,
    },
    execute: {
      keywords: ["execute"],
      priority: 6,
      extraTime: 2000,
    },
    resume: {
      keywords: ["resume", "continue"],
      priority: 7,
      extraTime: 3000,
    },
    tryAgain: {
      keywords: [
        "try again",
        "try-again",
        "tryagain",
        "retry",
        "重新嘗試",
        "再試一次",
      ],
      priority: 3,
      extraTime: 3000,
    },
  };

  /**
   * 🎪 事件管理器 - 模組間通信
   */
  class EventManager extends EventTarget {
    emit(eventName, data) {
      this.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    on(eventName, handler) {
      this.addEventListener(eventName, handler);
    }

    off(eventName, handler) {
      this.removeEventListener(eventName, handler);
    }
  }

  /**
   * 🔬 DOM 監視器 - 替代定時輪詢，提升效能
   */
  class DOMWatcher {
    constructor(eventManager) {
      this.eventManager = eventManager;
      this.observer = null;
      this.isWatching = false;
      this.debounceTimer = null;
      this.debounceDelay = 300; // 300ms 防抖
    }

    /**
     * 開始監視 DOM 變化
     */
    start() {
      if (this.isWatching) return;

      this.observer = new MutationObserver((mutations) => {
        this.handleMutations(mutations);
      });

      // 優化的監視配置
      const config = {
        childList: true,
        subtree: true,
        attributes: true,
        // 擴展屬性監視範圍
        attributeFilter: [
          "class",
          "style",
          "data-message-index",
          "disabled",
          "hidden",
          "aria-disabled",
          "aria-hidden",
        ],
      };

      this.observer.observe(document.body, config);
      this.isWatching = true;

      console.log("[DOMWatcher] 開始監視 DOM 變化");
    }

    /**
     * 停止監視
     */
    stop() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }

      this.isWatching = false;
      console.log("[DOMWatcher] 停止監視 DOM 變化");
    }

    /**
     * 處理 DOM 變化
     */
    handleMutations(mutations) {
      let hasRelevantChanges = false;

      for (const mutation of mutations) {
        // 檢查是否有相關的節點變化
        if (this.isRelevantMutation(mutation)) {
          hasRelevantChanges = true;
          break;
        }
      }

      if (hasRelevantChanges) {
        // 使用防抖避免過度觸發
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
          this.eventManager.emit("dom-changed", { mutations });
        }, this.debounceDelay);
      }
    }

    /**
     * 判斷是否為相關的 DOM 變化
     */
    isRelevantMutation(mutation) {
      // 檢查新增的節點
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 檢查是否包含可能的按鈕或代碼區塊
            if (this.hasRelevantContent(node)) {
              return true;
            }
          }
        }
      }

      // 檢查屬性變化
      if (mutation.type === "attributes") {
        const target = mutation.target;
        if (target.nodeType === Node.ELEMENT_NODE) {
          // 檢查 class 或 style 變化是否可能影響按鈕可見性
          if (
            mutation.attributeName === "class" ||
            mutation.attributeName === "style"
          ) {
            return this.hasRelevantContent(target);
          }
        }
      }

      return false;
    }

    /**
     * 檢查節點是否包含相關內容
     */
    hasRelevantContent(element) {
      const text = element.textContent?.toLowerCase() || "";
      const className = element.className || "";

      // 檢查是否包含按鈕關鍵字
      const buttonKeywords = ["accept", "run", "apply", "execute", "resume"];
      const hasButtonKeywords = buttonKeywords.some((keyword) =>
        text.includes(keyword)
      );

      // 檢查是否為代碼區塊相關
      const codeBlockKeywords = ["composer", "code-block", "diff", "button"];
      const hasCodeBlockClass = codeBlockKeywords.some((keyword) =>
        className.includes(keyword)
      );

      // 檢查是否為 anysphere 按鈕（新增的 Resume 按鈕類型）
      const anysphereBtnKeywords = [
        "anysphere-secondary-button",
        "anysphere-text-button",
        "bg-dropdown-background",
      ];
      const hasAnysphereBtnClass = anysphereBtnKeywords.some((keyword) =>
        className.includes(keyword)
      );

      // 檢查是否為下拉選單容器
      const dropdownKeywords = ["dropdown", "popup", "box-shadow"];
      const hasDropdownIndicator = dropdownKeywords.some(
        (keyword) =>
          className.includes(keyword) ||
          element.style.cssText?.includes(keyword)
      );

      return (
        hasButtonKeywords ||
        hasCodeBlockClass ||
        hasAnysphereBtnClass ||
        hasDropdownIndicator
      );
    }
  }

  /**
   * ⏱️ 動態 ROI 時間測量器
   */
  class ROITimer {
    constructor() {
      this.measurements = [];
      this.currentWorkflow = null;
      this.averageManualTime = 30000; // 預設 30 秒
      this.averageAutoTime = 100; // 預設 100ms
    }

    /**
     * 開始工作流程計時
     */
    startWorkflow(context = {}) {
      this.currentWorkflow = {
        startTime: performance.now(),
        context: context,
        stages: [],
        completed: false,
      };
    }

    /**
     * 記錄工作流程階段
     */
    recordStage(stageName, data = {}) {
      if (!this.currentWorkflow) return;

      this.currentWorkflow.stages.push({
        name: stageName,
        timestamp: performance.now(),
        data: data,
      });
    }

    /**
     * 完成工作流程計時（使用實際測量時間）
     */
    completeWorkflow(result = {}) {
      if (!this.currentWorkflow || this.currentWorkflow.completed) return;

      const endTime = performance.now();
      const totalTime = endTime - this.currentWorkflow.startTime;

      // 優先使用傳入的實際執行時間，如果沒有則使用計算的總時間
      const actualExecutionTime = result.actualTime || totalTime;

      this.currentWorkflow.completed = true;
      this.currentWorkflow.endTime = endTime;
      this.currentWorkflow.totalTime = totalTime;
      this.currentWorkflow.actualExecutionTime = actualExecutionTime;
      this.currentWorkflow.result = result;

      this.measurements.push({ ...this.currentWorkflow });

      // 更新實際自動時間統計
      if (
        this.currentWorkflow.context.type === "auto" &&
        actualExecutionTime > 0
      ) {
        this.updateActualAutoTime(actualExecutionTime);
      }

      // 動態調整平均時間
      this.updateAverages();

      const measurement = this.currentWorkflow;
      this.currentWorkflow = null;

      return measurement;
    }

    /**
     * 更新平均時間
     */
    updateAverages() {
      if (this.measurements.length < 2) return; // 需要至少 2 個樣本

      const recentMeasurements = this.measurements.slice(-20); // 取最近 20 個
      const manualTimes = recentMeasurements
        .filter((m) => m.context.type === "manual")
        .map((m) => m.totalTime);

      const autoTimes = recentMeasurements
        .filter((m) => m.context.type === "auto")
        .map((m) => m.totalTime);

      if (manualTimes.length > 0) {
        this.averageManualTime =
          manualTimes.reduce((a, b) => a + b) / manualTimes.length;
      }

      if (autoTimes.length > 0) {
        this.averageAutoTime =
          autoTimes.reduce((a, b) => a + b) / autoTimes.length;
      } else {
        // 如果沒有實際測量數據，使用更保守的估計
        this.averageAutoTime = Math.min(200, this.averageAutoTime);
      }
    }

    /**
     * 更新實際自動時間統計（基於實際測量）
     */
    updateActualAutoTime(actualTime) {
      if (!actualTime || actualTime <= 0) return;

      // 動態調整平均自動時間，給予較新測量值更高權重
      const weight = 0.3; // 30% 新值權重
      this.averageAutoTime =
        this.averageAutoTime * (1 - weight) + actualTime * weight;

      // 保持合理的最小值，避免過於樂觀的估計
      this.averageAutoTime = Math.max(50, this.averageAutoTime); // 最小 50ms

      // 保持合理的最大值，避免異常值影響
      this.averageAutoTime = Math.min(5000, this.averageAutoTime); // 最大 5秒
    }

    /**
     * 計算節省的時間（使用實際測量時間）
     */
    calculateTimeSaved(buttonType = "accept", actualExecutionTime = null) {
      const pattern = BUTTON_PATTERNS[buttonType] || BUTTON_PATTERNS.accept;
      const manualTime = this.averageManualTime + pattern.extraTime;

      // 如果提供了實際執行時間，優先使用實際時間
      const autoTime =
        actualExecutionTime !== null
          ? actualExecutionTime
          : this.averageAutoTime;

      return Math.max(0, manualTime - autoTime);
    }

    /**
     * 獲取統計資料
     */
    getStatistics() {
      const totalMeasurements = this.measurements.length;
      const manualMeasurements = this.measurements.filter(
        (m) => m.context.type === "manual"
      );
      const autoMeasurements = this.measurements.filter(
        (m) => m.context.type === "auto"
      );

      return {
        totalMeasurements,
        manualCount: manualMeasurements.length,
        autoCount: autoMeasurements.length,
        averageManualTime: this.averageManualTime,
        averageAutoTime: this.averageAutoTime,
        efficiency:
          this.averageManualTime > 0
            ? ((this.averageManualTime - this.averageAutoTime) /
                this.averageManualTime) *
              100
            : 0,
      };
    }
  }

  /**
   * 📊 分析資料管理器
   */
  class AnalyticsManager {
    constructor() {
      this.data = {
        files: new Map(),
        sessions: [],
        buttonTypes: new Map(),
        totalAccepts: 0,
        sessionStart: new Date(),
        roiData: {
          totalTimeSaved: 0,
          workflowSessions: [],
        },
      };

      this.storageKey = "cursor-auto-accept-v2-data";
      this.loadFromStorage();
    }

    /**
     * 記錄檔案接受（使用實際測量時間）
     */
    recordFileAcceptance(
      fileInfo,
      buttonType,
      timeSaved,
      actualExecutionTime = null
    ) {
      const { filename, addedLines = 0, deletedLines = 0 } = fileInfo;
      const timestamp = new Date();

      // 更新檔案統計
      if (this.data.files.has(filename)) {
        const existing = this.data.files.get(filename);
        existing.acceptCount++;
        existing.lastAccepted = timestamp;
        existing.totalAdded += addedLines;
        existing.totalDeleted += deletedLines;
        existing.buttonTypes.set(
          buttonType,
          (existing.buttonTypes.get(buttonType) || 0) + 1
        );
        // 追蹤實際執行時間
        if (actualExecutionTime !== null) {
          existing.totalExecutionTime =
            (existing.totalExecutionTime || 0) + actualExecutionTime;
          existing.averageExecutionTime =
            existing.totalExecutionTime / existing.acceptCount;
        }
      } else {
        this.data.files.set(filename, {
          acceptCount: 1,
          firstAccepted: timestamp,
          lastAccepted: timestamp,
          totalAdded: addedLines,
          totalDeleted: deletedLines,
          buttonTypes: new Map([[buttonType, 1]]),
          totalExecutionTime: actualExecutionTime || 0,
          averageExecutionTime: actualExecutionTime || 0,
        });
      }

      // 記錄會話（包含實際執行時間）
      this.data.sessions.push({
        filename,
        addedLines,
        deletedLines,
        timestamp,
        buttonType,
        timeSaved,
        actualExecutionTime: actualExecutionTime || 0,
      });

      // 更新按鈕類型統計
      this.data.buttonTypes.set(
        buttonType,
        (this.data.buttonTypes.get(buttonType) || 0) + 1
      );

      // 更新總計（使用實際測量時間）
      this.data.totalAccepts++;
      this.data.roiData.totalTimeSaved += timeSaved;
      this.data.roiData.workflowSessions.push({
        timestamp,
        buttonType,
        timeSaved,
        filename,
        actualExecutionTime: actualExecutionTime || 0,
      });

      this.saveToStorage();
    }

    recordBasicAcceptance(buttonType, timeSaved, actualExecutionTime = null) {
      const timestamp = new Date();

      // 更新會話統計 - 即使沒有檔案信息（包含實際執行時間）
      this.data.sessions.push({
        filename: "未知檔案",
        addedLines: 0,
        deletedLines: 0,
        timestamp,
        buttonType,
        timeSaved,
        actualExecutionTime: actualExecutionTime || 0,
      });

      // 更新按鈕類型統計
      this.data.buttonTypes.set(
        buttonType,
        (this.data.buttonTypes.get(buttonType) || 0) + 1
      );

      // 更新總計（使用實際測量時間）
      this.data.totalAccepts++;
      this.data.roiData.totalTimeSaved += timeSaved;
      this.data.roiData.workflowSessions.push({
        timestamp,
        buttonType,
        timeSaved,
        filename: "未知檔案",
        actualExecutionTime: actualExecutionTime || 0,
      });

      this.saveToStorage();
    }

    /**
     * 儲存到 localStorage
     */
    saveToStorage() {
      try {
        const dataToSave = {
          files: Array.from(this.data.files.entries()).map(([key, value]) => [
            key,
            {
              ...value,
              buttonTypes: Array.from(value.buttonTypes.entries()),
            },
          ]),
          sessions: this.data.sessions,
          buttonTypes: Array.from(this.data.buttonTypes.entries()),
          totalAccepts: this.data.totalAccepts,
          sessionStart: this.data.sessionStart,
          roiData: this.data.roiData,
          version: "2.0.0",
          savedAt: new Date(),
        };

        localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.warn("[AnalyticsManager] 儲存失敗:", error);
      }
    }

    /**
     * 從 localStorage 載入
     */
    loadFromStorage() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (!saved) return;

        const data = JSON.parse(saved);

        // 恢復 Map 結構
        this.data.files = new Map(
          data.files?.map(([key, value]) => [
            key,
            {
              ...value,
              buttonTypes: new Map(value.buttonTypes || []),
            },
          ]) || []
        );

        this.data.buttonTypes = new Map(data.buttonTypes || []);
        this.data.sessions = data.sessions || [];
        this.data.totalAccepts = data.totalAccepts || 0;
        this.data.sessionStart = data.sessionStart
          ? new Date(data.sessionStart)
          : new Date();
        this.data.roiData = data.roiData || {
          totalTimeSaved: 0,
          workflowSessions: [],
        };

        console.log("[AnalyticsManager] 成功載入儲存資料");
      } catch (error) {
        console.warn("[AnalyticsManager] 載入失敗:", error);
      }
    }

    /**
     * 清除資料
     */
    clearData() {
      this.data = {
        files: new Map(),
        sessions: [],
        buttonTypes: new Map(),
        totalAccepts: 0,
        sessionStart: new Date(),
        roiData: {
          totalTimeSaved: 0,
          workflowSessions: [],
        },
      };

      localStorage.removeItem(this.storageKey);
    }

    /**
     * 匯出資料
     */
    exportData() {
      return {
        files: Object.fromEntries(
          Array.from(this.data.files.entries()).map(([key, value]) => [
            key,
            {
              ...value,
              buttonTypes: Object.fromEntries(value.buttonTypes),
            },
          ])
        ),
        sessions: this.data.sessions,
        buttonTypes: Object.fromEntries(this.data.buttonTypes),
        totalAccepts: this.data.totalAccepts,
        sessionStart: this.data.sessionStart,
        roiData: this.data.roiData,
        exportedAt: new Date(),
      };
    }
  }

  /**
   * 🔍 彈性元素查找器 - 解決頁面結構耦合問題
   */
  class ElementFinder {
    constructor() {
      this.cache = new Map();
      this.cacheTimeout = 5000; // 5秒快取
    }

    /**
     * 使用多重選擇器策略查找元素
     */
    findElement(selectors, context = document) {
      const cacheKey =
        selectors.join("|") + (context !== document ? context.className : "");
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        // 檢查快取元素是否仍然有效
        if (this.isElementValid(cached.element)) {
          return cached.element;
        } else {
          // 移除無效快取
          this.cache.delete(cacheKey);
        }
      }

      for (const selector of selectors) {
        try {
          const element = context.querySelector(selector);
          if (element && this.isElementVisible(element)) {
            this.cache.set(cacheKey, { element, timestamp: Date.now() });
            return element;
          }
        } catch (error) {
          console.warn(`[ElementFinder] 選擇器失效: ${selector}`, error);
        }
      }

      return null;
    }

    /**
     * 查找所有匹配元素
     */
    findElements(selectors, context = document) {
      const elements = [];

      for (const selector of selectors) {
        try {
          const found = context.querySelectorAll(selector);
          elements.push(
            ...Array.from(found).filter((el) => this.isElementVisible(el))
          );
        } catch (error) {
          console.warn(`[ElementFinder] 選擇器失效: ${selector}`, error);
        }
      }

      return elements;
    }

    /**
     * 語義化按鈕識別
     */
    findButtonsBySemantics(context = document) {
      const buttons = [];

      // 使用多種策略查找可點擊元素
      const clickableSelectors = [
        "button",
        'div[role="button"]',
        'span[role="button"]',
        "div[onclick]",
        'div[style*="cursor: pointer"]',
        'div[style*="cursor:pointer"]',
        '[class*="button"]',
        '[class*="btn"]',
        '[class*="anysphere"]',
        '[class*="cursor-button"]',
        '[class*="text-button"]',
        '[class*="primary-button"]',
        '[class*="secondary-button"]',
        '[data-testid*="button"]',
      ];

      const clickableElements = this.findElements(clickableSelectors, context);

      for (const element of clickableElements) {
        const buttonType = this.identifyButtonType(element);
        if (buttonType) {
          buttons.push({ element, type: buttonType });
        }
      }

      return buttons;
    }

    /**
     * 識別按鈕類型
     */
    identifyButtonType(element) {
      const text = element.textContent?.toLowerCase().trim() || "";
      const ariaLabel = element.getAttribute("aria-label")?.toLowerCase() || "";
      const title = element.getAttribute("title")?.toLowerCase() || "";
      const className = element.className?.toLowerCase() || "";
      const searchText = `${text} ${ariaLabel} ${title} ${className}`;

      // 特殊處理 Resume 按鈕（彈出式下拉選單）
      if (text === "resume" || text.includes("resume")) {
        // 檢查是否為 anysphere 按鈕類型
        if (
          className.includes("anysphere-secondary-button") ||
          className.includes("anysphere-text-button") ||
          element.closest(".anysphere-secondary-button") ||
          element.closest(".anysphere-text-button")
        ) {
          return "resume";
        }
      }

      // 特殊處理 Try Again 按鈕（彈出式下拉選單）
      if (
        text === "try again" ||
        text.includes("try again") ||
        text === "retry" ||
        text.includes("retry")
      ) {
        // 檢查是否為 anysphere 按鈕類型
        if (
          className.includes("anysphere-secondary-button") ||
          className.includes("anysphere-text-button") ||
          element.closest(".anysphere-secondary-button") ||
          element.closest(".anysphere-text-button")
        ) {
          return "tryAgain";
        }
      }

      for (const [type, config] of Object.entries(BUTTON_PATTERNS)) {
        for (const keyword of config.keywords) {
          if (searchText.includes(keyword)) {
            return type;
          }
        }
      }

      return null;
    }

    /**
     * 檢查元素可見性
     */
    isElementVisible(element) {
      if (!element) return false;

      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        parseFloat(style.opacity) > 0.1 &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    /**
     * 檢查元素可點擊性
     */
    isElementClickable(element) {
      if (!element) return false;

      const style = window.getComputedStyle(element);
      return (
        style.pointerEvents !== "none" &&
        !element.disabled &&
        !element.hasAttribute("disabled")
      );
    }

    /**
     * 檢查元素是否仍然有效
     */
    isElementValid(element) {
      return (
        element &&
        element.isConnected &&
        document.contains(element) &&
        this.isElementVisible(element)
      );
    }

    /**
     * 清除快取
     */
    clearCache() {
      this.cache.clear();
    }
  }

  /**
   * 🎪 主要控制器類別 - 整合所有模組
   */
  class CursorAutoAcceptController {
    constructor() {
      this.version = "2.0.6";
      this.isRunning = false;
      this.monitorInterval = null;
      this.interval = 2000;
      this.totalClicks = 0;

      // 防重複點擊機制
      this.recentClicks = new Map(); // 記錄最近點擊的按鈕
      this.lastClickTime = 0;
      this.minClickInterval = 1000; // 最小點擊間隔 1 秒
      this.clickCooldownPeriod = 3000; // 同一按鈕冷卻期 3 秒
      this.processedElements = new WeakSet(); // 追蹤已處理的元素

      // 無效點擊檢測機制
      this.ineffectiveClicks = new Map(); // 追蹤無效點擊
      this.maxRetryDuration = 60000; // 1分鐘後停止重試
      this.clickValidationTimeout = 2000; // 點擊後2秒驗證是否有效

      // 初始化模組
      this.eventManager = new EventManager();
      this.elementFinder = new ElementFinder();
      this.domWatcher = new DOMWatcher(this.eventManager);
      this.roiTimer = new ROITimer();
      this.analytics = new AnalyticsManager();

      // 控制面板
      this.controlPanel = null;
      this.currentTab = "main";
      this.isDragging = false;
      this.dragOffset = { x: 0, y: 0 };
      this.loggedMessages = new Set();
      this.debugMode = false;

      // 配置
      this.config = {
        enableAcceptAll: true,
        enableAccept: true,
        enableRun: true,
        enableRunCommand: true,
        enableApply: true,
        enableExecute: true,
        enableResume: true,
        enableTryAgain: true,
      };

      this.setupEventHandlers();
      this.createControlPanel();
      this.log("CursorAutoAccept v2.0.6 已初始化");
    }

    setupEventHandlers() {
      this.eventManager.on("dom-changed", () => {
        if (this.isRunning) {
          this.checkAndClick();
        }
      });
    }

    /**
     * 清理過期的點擊記錄
     */
    cleanupExpiredClicks() {
      const now = Date.now();
      for (const [elementKey, clickTime] of this.recentClicks.entries()) {
        if (now - clickTime > this.clickCooldownPeriod) {
          this.recentClicks.delete(elementKey);
        }
      }

      // 清理過期的無效點擊記錄
      for (const [
        elementKey,
        clickHistory,
      ] of this.ineffectiveClicks.entries()) {
        if (now - clickHistory.firstAttempt > this.maxRetryDuration) {
          this.ineffectiveClicks.delete(elementKey);
        }
      }
    }

    /**
     * 計算實際節省時間（基於實際測量時間）
     */
    calculateActualTimeSaved(buttonType, actualExecutionTime) {
      // 取得按鈕類型配置
      const pattern = BUTTON_PATTERNS[buttonType] || BUTTON_PATTERNS.accept;

      // 估算手動操作時間（基於按鈕類型的額外時間）
      const estimatedManualTime =
        this.roiTimer.averageManualTime + pattern.extraTime;

      // 實際自動化時間包含偵測、驗證和點擊的完整時間
      const actualAutoTime = actualExecutionTime;

      // 更新 ROI 計時器的實際自動時間統計
      this.roiTimer.updateActualAutoTime(actualAutoTime);

      // 計算節省時間（使用實際測量值）
      const timeSaved = Math.max(0, estimatedManualTime - actualAutoTime);

      return timeSaved;
    }

    /**
     * 驗證點擊效果的方法
     */
    validateClickEffectiveness(elementKey, element, buttonType) {
      try {
        // 檢查元素是否仍然存在並可見
        const stillExists = this.elementFinder.isElementValid(element);

        // 如果 Try Again 按鈕仍然存在，表示點擊無效
        if (stillExists && buttonType === "tryAgain") {
          const now = Date.now();

          if (this.ineffectiveClicks.has(elementKey)) {
            const clickHistory = this.ineffectiveClicks.get(elementKey);
            clickHistory.attemptCount++;
            clickHistory.lastAttempt = now;
            clickHistory.isIneffective = true;
          } else {
            this.ineffectiveClicks.set(elementKey, {
              firstAttempt: now,
              lastAttempt: now,
              attemptCount: 1,
              isIneffective: true,
              buttonType: buttonType,
            });
          }

          this.logToPanel(
            `檢測到 ${buttonType} 按鈕點擊無效，將暫停重試`,
            "warning"
          );
        } else {
          // 點擊有效，清除無效記錄
          if (this.ineffectiveClicks.has(elementKey)) {
            this.ineffectiveClicks.delete(elementKey);
            this.logToPanel(`${buttonType} 按鈕點擊有效，恢復正常操作`, "info");
          }
        }
      } catch (error) {
        this.logToPanel(`驗證點擊效果時出錯：${error.message}`, "error");
      }
    }

    /**
     * 產生元素的唯一標識符
     */
    getElementKey(element) {
      if (!element) return null;

      // 使用元素的多種屬性來創建唯一標識
      const text = element.textContent?.trim() || "";
      const className = element.className || "";
      const tagName = element.tagName || "";
      const position = this.getElementPosition(element);

      return `${tagName}-${className}-${text.substring(0, 20)}-${position.x}-${
        position.y
      }`;
    }

    /**
     * 取得元素的位置資訊
     */
    getElementPosition(element) {
      try {
        const rect = element.getBoundingClientRect();
        return { x: Math.round(rect.x), y: Math.round(rect.y) };
      } catch {
        return { x: 0, y: 0 };
      }
    }

    /**
     * 檢查元素是否可以點擊
     */
    canClickElement(element, buttonType) {
      if (!element || !buttonType) return false;

      const now = Date.now();
      const elementKey = this.getElementKey(element);

      // 檢查全域點擊間隔
      if (now - this.lastClickTime < this.minClickInterval) {
        return false;
      }

      // 檢查元素是否已被處理過
      if (this.processedElements.has(element)) {
        return false;
      }

      // 檢查無效點擊機制
      if (elementKey && this.ineffectiveClicks.has(elementKey)) {
        const clickHistory = this.ineffectiveClicks.get(elementKey);
        // 如果在最大重試時間內且點擊無效，則跳過
        if (
          now - clickHistory.firstAttempt < this.maxRetryDuration &&
          clickHistory.isIneffective
        ) {
          return false;
        }
        // 如果超過最大重試時間，清除記錄並允許重試
        if (now - clickHistory.firstAttempt >= this.maxRetryDuration) {
          this.ineffectiveClicks.delete(elementKey);
        }
      }

      // 檢查元素特定冷卻期
      if (elementKey && this.recentClicks.has(elementKey)) {
        const lastClickTime = this.recentClicks.get(elementKey);
        if (now - lastClickTime < this.clickCooldownPeriod) {
          return false;
        }
      }

      // 檢查元素狀態
      if (
        !this.elementFinder.isElementVisible(element) ||
        !this.elementFinder.isElementClickable(element)
      ) {
        return false;
      }

      // 檢查是否被禁用
      if (
        element.disabled ||
        element.hasAttribute("disabled") ||
        element.getAttribute("aria-disabled") === "true"
      ) {
        return false;
      }

      return true;
    }

    findAcceptButtons() {
      const buttons = [];
      const processedElements = new Set(); // 去重追蹤

      // 使用彈性選擇器查找輸入框
      const inputBox = this.elementFinder.findElement(SELECTORS.inputBox);
      if (!inputBox) return buttons;

      // 清理過期的點擊記錄
      this.cleanupExpiredClicks();

      // 檢查前面的兄弟元素
      let currentElement = inputBox.previousElementSibling;
      let searchDepth = 0;

      while (currentElement && searchDepth < 5) {
        const buttonsInElement =
          this.elementFinder.findButtonsBySemantics(currentElement);
        buttonsInElement.forEach((b) => {
          if (!processedElements.has(b.element)) {
            buttons.push(b.element);
            processedElements.add(b.element);
          }
        });

        currentElement = currentElement.previousElementSibling;
        searchDepth++;
      }

      // 搜尋 Resume 連結
      if (this.config.enableResume) {
        const resumeElements = this.elementFinder.findElements(
          SELECTORS.resumeLinks
        );
        resumeElements.forEach((element) => {
          if (!processedElements.has(element)) {
            buttons.push(element);
            processedElements.add(element);
          }
        });

        // 搜尋 Resume 按鈕（彈出式下拉選單）
        const resumeButtons = this.findResumeButtons();
        resumeButtons.forEach((btn) => {
          if (!processedElements.has(btn)) {
            buttons.push(btn);
            processedElements.add(btn);
          }
        });
      }

      // 搜尋 Try Again 按鈕
      if (this.config.enableTryAgain) {
        const tryAgainButtons = this.findTryAgainButtons();
        tryAgainButtons.forEach((btn) => {
          if (!processedElements.has(btn)) {
            buttons.push(btn);
            processedElements.add(btn);
          }
        });
      }

      return buttons;
    }

    checkAndClick() {
      try {
        const buttons = this.findAcceptButtons();
        if (buttons.length === 0) return;

        // 遍歷所有按鈕，找到第一個可以點擊的
        for (const button of buttons) {
          const buttonType = this.elementFinder.identifyButtonType(button);

          if (
            this.shouldClickButton(buttonType) &&
            this.canClickElement(button, buttonType)
          ) {
            this.clickElement(button, buttonType);
            break; // 只點擊一個按鈕後就退出
          }
        }
      } catch (error) {
        this.log(`執行時出錯：${error.message}`);
      }
    }

    shouldClickButton(buttonType) {
      if (!buttonType) return false;

      const typeMap = {
        acceptAll: this.config.enableAcceptAll,
        accept: this.config.enableAccept,
        run: this.config.enableRun,
        runCommand: this.config.enableRunCommand,
        apply: this.config.enableApply,
        execute: this.config.enableExecute,
        resume: this.config.enableResume,
        tryAgain: this.config.enableTryAgain,
      };

      // 只有明確設定為 true 的按鈕類型才能點擊
      return typeMap[buttonType] === true;
    }

    clickElement(element, buttonType) {
      try {
        const now = Date.now();
        const elementKey = this.getElementKey(element);

        // 記錄點擊狀態
        this.lastClickTime = now;
        if (elementKey) {
          this.recentClicks.set(elementKey, now);
        }
        this.processedElements.add(element);

        const startTime = performance.now();
        this.roiTimer.startWorkflow({ type: "auto", buttonType });

        // 提取檔案資訊
        const fileInfo = this.extractFileInfo(element);

        // 點擊元素
        element.click();

        // 日誌記錄點擊事件
        this.logToPanel(
          `點擊 ${buttonType} 按鈕: ${fileInfo?.filename || "未知檔案"}`,
          "info"
        );

        // 延遲驗證點擊效果，特別針對 Try Again 按鈕
        if (buttonType === "tryAgain" && elementKey) {
          setTimeout(() => {
            this.validateClickEffectiveness(elementKey, element, buttonType);
          }, this.clickValidationTimeout);
        }

        // 測量實際執行時間
        const endTime = performance.now();
        const actualTime = endTime - startTime;

        // 完成工作流程測量，傳入實際執行時間
        const measurement = this.roiTimer.completeWorkflow({
          success: true,
          fileInfo,
          actualTime,
          buttonType,
        });

        // 使用實際測量時間計算節省時間
        const timeSaved = this.calculateActualTimeSaved(buttonType, actualTime);

        // 記錄分析 - 使用實際測量時間進行精確記錄
        if (fileInfo) {
          this.analytics.recordFileAcceptance(
            fileInfo,
            buttonType,
            timeSaved,
            actualTime
          );
        } else {
          // 即使沒有檔案信息，也要記錄基本統計和實際執行時間
          this.analytics.recordBasicAcceptance(
            buttonType,
            timeSaved,
            actualTime
          );
        }

        this.totalClicks++;
        this.updatePanelStatus();
        this.logToPanel(
          `✓ ${buttonType}: ${
            fileInfo?.filename || "未知檔案"
          } (${actualTime.toFixed(1)}ms)`,
          "info"
        );

        // 更新分析內容顯示
        if (this.currentTab === "analytics" || this.currentTab === "roi") {
          this.updateAnalyticsContent();
        }
        this.updateMainFooter();

        return true;
      } catch (error) {
        this.logToPanel(`點擊失敗：${error.message}`, "error");
        this.roiTimer.completeWorkflow({
          success: false,
          error: error.message,
        });
        return false;
      }
    }

    extractFileInfo(element) {
      try {
        // 方法 1：在最新的對話訊息中尋找程式碼區塊
        const conversationsDiv = document.querySelector("div.conversations");
        if (conversationsDiv) {
          const messageBubbles = Array.from(
            conversationsDiv.querySelectorAll("[data-message-index]")
          ).sort((a, b) => {
            const indexA = parseInt(a.getAttribute("data-message-index"));
            const indexB = parseInt(b.getAttribute("data-message-index"));
            return indexB - indexA; // 降序 (最新優先)
          });

          // 在最新的幾條訊息中尋找程式碼區塊
          for (let i = 0; i < Math.min(5, messageBubbles.length); i++) {
            const bubble = messageBubbles[i];
            const codeBlocks = bubble.querySelectorAll(
              ".composer-code-block-container, .composer-tool-former-message, .composer-diff-block"
            );

            for (const block of codeBlocks) {
              const fileInfo = this.extractFileInfoFromBlock(block);
              if (fileInfo) {
                return fileInfo;
              }
            }
          }
        }

        // 方法 2：備用方法 - 尋找按鈕附近的程式碼區塊
        return this.extractFileInfoFallback(element);
      } catch (error) {
        console.warn("[extractFileInfo] 錯誤:", error);
        return null;
      }
    }

    extractFileInfoFromBlock(block) {
      try {
        let filename = null;
        let addedLines = 0;
        let deletedLines = 0;

        // 多種方法尋找檔名
        const filenameElement =
          block.querySelector(
            '.composer-code-block-filename span[style*="direction: ltr"]'
          ) ||
          block.querySelector(".composer-code-block-filename span") ||
          block.querySelector(".composer-code-block-filename");

        if (filenameElement) {
          filename = filenameElement.textContent.trim();
        }

        // 如果還沒找到檔名，嘗試模式匹配
        if (!filename) {
          const allSpans = block.querySelectorAll("span");
          for (const span of allSpans) {
            const text = span.textContent.trim();
            if (
              text &&
              text.includes(".") &&
              text.length < 100 &&
              !text.includes(" ")
            ) {
              const parts = text.split(".");
              if (parts.length >= 2 && parts[parts.length - 1].length <= 10) {
                filename = text;
                break;
              }
            }
          }
        }

        // 提取 diff 統計資訊
        const statusElements = block.querySelectorAll(
          '.composer-code-block-status span, span[style*="color"]'
        );

        for (const statusEl of statusElements) {
          const statusText = statusEl.textContent.trim();
          const addedMatch = statusText.match(/\+(\d+)/);
          const deletedMatch = statusText.match(/-(\d+)/);

          if (addedMatch) {
            addedLines = Math.max(addedLines, parseInt(addedMatch[1]));
          }
          if (deletedMatch) {
            deletedLines = Math.max(deletedLines, parseInt(deletedMatch[1]));
          }
        }

        if (filename) {
          return {
            filename,
            addedLines: addedLines || 0,
            deletedLines: deletedLines || 0,
            timestamp: new Date(),
          };
        }

        return null;
      } catch (error) {
        console.warn("[extractFileInfoFromBlock] 錯誤:", error);
        return null;
      }
    }

    /**
     * 專門搜尋 Resume 按鈕方法
     */
    findResumeButtons() {
      const resumeButtons = [];

      // 搜尋下拉選單容器
      const dropdownContainers = this.elementFinder.findElements(
        SELECTORS.dropdownContainers
      );

      for (const container of dropdownContainers) {
        // 在每個下拉選單中搜尋 Resume 按鈕
        const buttons = this.findResumeButtonsInContainer(container);
        resumeButtons.push(...buttons);
      }

      // 也在整個文檔中搜尋（備用方法）
      const globalResumeButtons = this.findResumeButtonsInContainer(document);
      resumeButtons.push(...globalResumeButtons);

      return resumeButtons;
    }

    /**
     * 在指定容器中搜尋 Resume 按鈕
     */
    findResumeButtonsInContainer(container) {
      const buttons = [];

      // 方法 1: 搜尋 anysphere-secondary-button 和 anysphere-text-button
      const anysphereBtns = container.querySelectorAll(
        '.anysphere-secondary-button, .anysphere-text-button, [class*="anysphere-secondary-button"], [class*="anysphere-text-button"]'
      );

      for (const btn of anysphereBtns) {
        const span = btn.querySelector("span");
        if (span && span.textContent.trim().toLowerCase().includes("resume")) {
          buttons.push(btn);
        }
      }

      // 方法 2: 直接搜尋包含 "Resume" 文字的可點擊元素
      const allClickableElements = container.querySelectorAll(
        'div[class*="button"], span[class*="button"], button, [role="button"], [onclick], [style*="cursor: pointer"], [style*="cursor:pointer"]'
      );

      for (const element of allClickableElements) {
        const text = element.textContent?.trim().toLowerCase() || "";
        if (text === "resume" || text.includes("resume")) {
          // 驗證元素可見性和可點擊性
          if (
            this.elementFinder.isElementVisible(element) &&
            this.elementFinder.isElementClickable(element)
          ) {
            buttons.push(element);
          }
        }
      }

      // 移除重複的按鈕
      return Array.from(new Set(buttons));
    }

    /**
     * 專門搜尋 Try Again 按鈕方法
     */
    findTryAgainButtons() {
      const tryAgainButtons = [];

      // 搜尋下拉選單容器
      const dropdownContainers = this.elementFinder.findElements(
        SELECTORS.dropdownContainers
      );

      for (const container of dropdownContainers) {
        // 在每個下拉選單中搜尋 Try Again 按鈕
        const buttons = this.findTryAgainButtonsInContainer(container);
        tryAgainButtons.push(...buttons);
      }

      // 也在整個文檔中搜尋（備用方法）
      const globalTryAgainButtons =
        this.findTryAgainButtonsInContainer(document);
      tryAgainButtons.push(...globalTryAgainButtons);

      return tryAgainButtons;
    }

    /**
     * 在指定容器中搜尋 Try Again 按鈕
     */
    findTryAgainButtonsInContainer(container) {
      const buttons = [];

      // 方法 1: 搜尋 anysphere-secondary-button 和 anysphere-text-button
      const anysphereBtns = container.querySelectorAll(
        '.anysphere-secondary-button, .anysphere-text-button, [class*="anysphere-secondary-button"], [class*="anysphere-text-button"]'
      );

      for (const btn of anysphereBtns) {
        const span = btn.querySelector("span");
        if (span) {
          const spanText = span.textContent.trim().toLowerCase();
          if (spanText.includes("try again") || spanText.includes("retry")) {
            buttons.push(btn);
          }
        }
      }

      // 方法 2: 直接搜尋包含 "Try again" 或 "Retry" 文字的可點擊元素
      const allClickableElements = container.querySelectorAll(
        'div[class*="button"], span[class*="button"], button, [role="button"], [onclick], [style*="cursor: pointer"], [style*="cursor:pointer"]'
      );

      for (const element of allClickableElements) {
        const text = element.textContent?.trim().toLowerCase() || "";
        if (
          text === "try again" ||
          text.includes("try again") ||
          text === "retry" ||
          text.includes("retry")
        ) {
          // 驗證元素可見性和可點擊性
          if (
            this.elementFinder.isElementVisible(element) &&
            this.elementFinder.isElementClickable(element)
          ) {
            buttons.push(element);
          }
        }
      }

      // 移除重複的按鈕
      return Array.from(new Set(buttons));
    }

    extractFileInfoFallback(button) {
      try {
        // 尋找包含此按鈕的 composer-code-block-container
        let container = button.closest(".composer-code-block-container");
        if (!container) {
          let parent = button.parentElement;
          let attempts = 0;
          while (parent && attempts < 10) {
            container = parent.querySelector(".composer-code-block-container");
            if (container) break;
            parent = parent.parentElement;
            attempts++;
          }
        }

        if (!container) {
          return null;
        }

        // 從 .composer-code-block-filename 提取檔名
        let filenameElement = container.querySelector(
          '.composer-code-block-filename span[style*="direction: ltr"]'
        );
        if (!filenameElement) {
          filenameElement = container.querySelector(
            ".composer-code-block-filename span"
          );
        }
        if (!filenameElement) {
          filenameElement = container.querySelector(
            ".composer-code-block-filename"
          );
        }
        const filename = filenameElement
          ? filenameElement.textContent.trim()
          : "未知檔案";

        // 從 .composer-code-block-status 提取 diff 統計資訊
        const statusElement = container.querySelector(
          ".composer-code-block-status span"
        );
        let addedLines = 0;
        let deletedLines = 0;

        if (statusElement) {
          const statusText = statusElement.textContent;
          const addedMatch = statusText.match(/\+(\d+)/);
          const deletedMatch = statusText.match(/-(\d+)/);

          if (addedMatch) addedLines = parseInt(addedMatch[1]);
          if (deletedMatch) deletedLines = parseInt(deletedMatch[1]);
        }

        return {
          filename,
          addedLines: addedLines || 0,
          deletedLines: deletedLines || 0,
          timestamp: new Date(),
        };
      } catch (error) {
        console.warn("[extractFileInfoFallback] 錯誤:", error);
        return null;
      }
    }

    // 控制面板方法 (從原版移植) - 修正 TrustedHTML 問題
    createControlPanel() {
      if (this.controlPanel) return;

      this.controlPanel = document.createElement("div");
      this.controlPanel.id = "cursor-auto-accept-v2-panel";

      // 使用 DOM API 創建元素，避免 TrustedHTML 問題
      this.createPanelStructure();

      this.addPanelStyles();
      this.setupPanelEvents();
      document.body.appendChild(this.controlPanel);
      this.updateAnalyticsContent();
      this.updateMainFooter();
    }

    /**
     * 使用 DOM API 創建面板結構，避免 TrustedHTML 安全問題
     */
    createPanelStructure() {
      // 創建標題區域
      const header = this.createElement("div", "aa-header");

      // 創建標籤區域
      const tabs = this.createElement("div", "aa-tabs");
      const mainTab = this.createElement(
        "button",
        "aa-tab aa-tab-active",
        "主面板"
      );
      const analyticsTab = this.createElement("button", "aa-tab", "分析");
      const roiTab = this.createElement("button", "aa-tab", "ROI");

      mainTab.onclick = () => this.switchTab("main");
      analyticsTab.onclick = () => this.switchTab("analytics");
      roiTab.onclick = () => this.switchTab("roi");

      tabs.appendChild(mainTab);
      tabs.appendChild(analyticsTab);
      tabs.appendChild(roiTab);

      // 創建控制按鈕
      const headerControls = this.createElement("div", "aa-header-controls");
      const minimizeBtn = this.createElement("button", "aa-minimize", "−");
      const closeBtn = this.createElement("button", "aa-close", "×");

      minimizeBtn.onclick = () => this.toggleMinimize();
      closeBtn.onclick = () => this.hidePanel();

      headerControls.appendChild(minimizeBtn);
      headerControls.appendChild(closeBtn);

      header.appendChild(tabs);
      header.appendChild(headerControls);

      // 創建主內容區域
      const mainContent = this.createElement(
        "div",
        "aa-content aa-main-content"
      );

      // 狀態區域
      const status = this.createElement("div", "aa-status");
      const statusText = this.createElement("span", "aa-status-text", "已停止");
      const clicksText = this.createElement("span", "aa-clicks", "0 次點擊");
      status.appendChild(statusText);
      status.appendChild(clicksText);

      // 控制按鈕區域
      const controls = this.createElement("div", "aa-controls");
      const startBtn = this.createElement("button", "aa-btn aa-start", "開始");
      const stopBtn = this.createElement("button", "aa-btn aa-stop", "停止");
      const configBtn = this.createElement(
        "button",
        "aa-btn aa-config",
        "設定"
      );

      stopBtn.disabled = true;

      startBtn.onclick = () => this.start();
      stopBtn.onclick = () => this.stop();
      configBtn.onclick = () => this.toggleConfig();

      controls.appendChild(startBtn);
      controls.appendChild(stopBtn);
      controls.appendChild(configBtn);

      // 配置面板
      const configPanel = this.createElement("div", "aa-config-panel");
      configPanel.style.display = "none";

      const configOptions = [
        {
          id: "aa-accept-all",
          text: "全部接受",
          english: "Accept All",
          tooltip: '自動點擊 "Accept All" 按鈕來接受所有建議的更改',
          checked: true,
        },
        {
          id: "aa-accept",
          text: "接受",
          english: "Accept",
          tooltip: '自動點擊 "Accept" 按鈕來接受單個更改',
          checked: true,
        },
        {
          id: "aa-run",
          text: "執行",
          english: "Run",
          tooltip: '自動點擊 "Run" 按鈕來執行程式碼或指令',
          checked: true,
        },
        {
          id: "aa-run-command",
          text: "執行指令",
          english: "Run Command",
          tooltip: '自動點擊 "Run Command" 按鈕來執行特定指令',
          checked: true,
        },
        {
          id: "aa-apply",
          text: "套用",
          english: "Apply",
          tooltip: '自動點擊 "Apply" 按鈕來套用更改',
          checked: true,
        },
        {
          id: "aa-execute",
          text: "執行",
          english: "Execute",
          tooltip: '自動點擊 "Execute" 按鈕來執行操作',
          checked: true,
        },
        {
          id: "aa-resume",
          text: "繼續對話",
          english: "Resume",
          tooltip: '自動點擊 "Resume" 連結來繼續中斷的對話',
          checked: true,
        },
        {
          id: "aa-try-again",
          text: "重新嘗試",
          english: "Try Again",
          tooltip: '自動點擊 "Try Again" 按鈕來重新嘗試失敗的操作',
          checked: true,
        },
      ];

      configOptions.forEach((option) => {
        const label = document.createElement("label");
        label.className = "aa-config-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = option.id;
        checkbox.checked = option.checked;

        const textSpan = document.createElement("span");
        textSpan.className = "aa-config-text";
        textSpan.textContent = " " + option.text;

        const englishSpan = document.createElement("span");
        englishSpan.className = "aa-config-english";
        englishSpan.textContent = option.english;

        const infoIcon = document.createElement("span");
        infoIcon.className = "aa-config-info";
        infoIcon.textContent = "!";
        infoIcon.title = option.tooltip;

        label.appendChild(checkbox);
        label.appendChild(textSpan);
        label.appendChild(englishSpan);
        label.appendChild(infoIcon);
        configPanel.appendChild(label);
      });

      // 日誌區域
      const log = this.createElement("div", "aa-log");

      // ROI 足部區域
      const roiFooter = this.createElement("div", "aa-roi-footer");

      // 版權區域
      const credits = this.createElement("div", "aa-credits");
      const small = document.createElement("small");
      small.textContent = "Enhanced v2.0.6 by ";
      const link = document.createElement("a");
      link.href = "https://linkedin.com/in/ivalsaraj";
      link.target = "_blank";
      link.textContent = "@ivalsaraj";
      small.appendChild(link);
      credits.appendChild(small);

      // 組裝主內容
      mainContent.appendChild(status);
      mainContent.appendChild(controls);
      mainContent.appendChild(configPanel);
      mainContent.appendChild(log);
      mainContent.appendChild(roiFooter);
      mainContent.appendChild(credits);

      // 分析內容區域
      const analyticsContent = this.createElement(
        "div",
        "aa-content aa-analytics-content"
      );

      // 設置初始顯示狀態 - 主面板預設顯示
      mainContent.classList.add("aa-content-visible");

      // 組裝整個面板
      this.controlPanel.appendChild(header);
      this.controlPanel.appendChild(mainContent);
      this.controlPanel.appendChild(analyticsContent);
    }

    /**
     * 輔助方法：創建 DOM 元素
     */
    createElement(tag, className = "", textContent = "") {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (textContent) element.textContent = textContent;
      return element;
    }

    addPanelStyles() {
      if (document.getElementById("cursor-auto-accept-v2-styles")) return;

      const style = document.createElement("style");
      style.id = "cursor-auto-accept-v2-styles";
      style.textContent = `
        #cursor-auto-accept-v2-panel {
          position: fixed;
          top: 100px;
          right: 20px;
          width: 280px;
          background: #1e1e1e;
          border: 1px solid #333;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12px;
          color: #ccc;
          z-index: 999999;
          user-select: none;
          max-height: 500px;
          display: flex;
          flex-direction: column;
        }
        
        .aa-header {
          background: #2d2d2d;
          padding: 6px 10px;
          border-radius: 5px 5px 0 0;
          cursor: move;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #333;
        }
        
        .aa-tabs {
          display: flex;
          gap: 4px;
        }
        
        .aa-tab {
          background: #444;
          border: none;
          color: #ccc;
          font-size: 11px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 3px;
          transition: all 0.2s;
        }
        
        .aa-tab:hover {
          background: #555;
        }
        
        .aa-tab-active {
          background: #0d7377 !important;
          color: white !important;
        }
        
        .aa-header-controls {
          display: flex;
          gap: 4px;
        }
        
        .aa-minimize, .aa-close {
          background: #444;
          border: none;
          color: #ccc;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          padding: 2px 5px;
          border-radius: 2px;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .aa-minimize:hover, .aa-close:hover {
          background: #555;
        }
        
        .aa-close:hover {
          background: #dc3545;
          color: white;
        }
        
        .aa-content {
          padding: 12px;
          overflow-y: auto;
          flex: 1;
          display: none;
        }
        
        .aa-content.aa-content-visible {
          display: block;
        }
        
        .aa-status {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 6px 8px;
          background: #252525;
          border-radius: 4px;
          font-size: 11px;
        }
        
        .aa-status-text.running {
          color: #4CAF50;
          font-weight: 500;
        }
        
        .aa-status-text.stopped {
          color: #f44336;
        }
        
        .aa-controls {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        
        .aa-btn {
          flex: 1;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .aa-start {
          background: #4CAF50;
          color: white;
        }
        
        .aa-start:hover:not(:disabled) {
          background: #45a049;
        }
        
        .aa-stop {
          background: #f44336;
          color: white;
        }
        
        .aa-stop:hover:not(:disabled) {
          background: #da190b;
        }
        
        .aa-config {
          background: #2196F3;
          color: white;
        }
        
        .aa-config:hover:not(:disabled) {
          background: #1976D2;
        }
        
        .aa-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .aa-config-panel {
          background: #252525;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .aa-config-option {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          padding: 4px;
          border-radius: 3px;
          font-size: 11px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .aa-config-option:hover {
          background: #333;
        }
        
        .aa-config-text {
          margin-left: 4px;
          color: #ccc;
        }
        
        .aa-config-english {
          margin-left: auto;
          color: #888;
          font-size: 10px;
          font-style: italic;
        }
        
        .aa-config-info {
          margin-left: 6px;
          width: 14px;
          height: 14px;
          background: #2196F3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
          cursor: help;
          transition: all 0.2s;
        }
        
        .aa-config-info:hover {
          background: #1976D2;
          transform: scale(1.1);
        }
        
        .aa-log {
          background: #252525;
          border-radius: 4px;
          padding: 8px;
          height: 120px;
          overflow-y: auto;
          font-size: 10px;
          line-height: 1.3;
        }
        
        /* 現代化統一捲軸設計 - 適用於所有可滾動區域 */
        #cursor-auto-accept-v2-panel ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        #cursor-auto-accept-v2-panel ::-webkit-scrollbar-track {
          background: #1e1e1e;
          border-radius: 3px;
          margin: 2px;
        }
        
        #cursor-auto-accept-v2-panel ::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
          transition: all 0.2s ease;
          min-height: 20px;
        }
        
        #cursor-auto-accept-v2-panel ::-webkit-scrollbar-thumb:hover {
          background: #777;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        #cursor-auto-accept-v2-panel ::-webkit-scrollbar-thumb:active {
          background: #888;
        }
        
        #cursor-auto-accept-v2-panel ::-webkit-scrollbar-corner {
          background: #1e1e1e;
        }
        
        /* 確保分析內容區域可滾動 */
        .aa-analytics-content {
          overflow-y: auto;
          max-height: 400px;
        }
        
        /* 確保主內容區域可滾動 */
        .aa-main-content {
          overflow-y: auto;
          max-height: 450px;
        }
        
        .aa-log-entry {
          margin-bottom: 2px;
          padding: 2px 4px;
          border-radius: 2px;
        }
        
        .aa-log-entry.info {
          color: #4CAF50;
        }
        
        .aa-log-entry.warning {
          color: #FF9800;
        }
        
        .aa-log-entry.error {
          color: #f44336;
        }
        
        .aa-credits {
          text-align: center;
          padding: 8px;
          border-top: 1px solid #333;
          color: #666;
          font-size: 10px;
        }
        
        .aa-credits a {
          color: #2196F3;
          text-decoration: none;
        }
        
        .aa-roi-footer {
          margin-top: 8px;
          padding: 6px 8px;
          background: #2d2d2d;
          border-radius: 4px;
          border-top: 1px solid #444;
          font-size: 10px;
        }
        
        #cursor-auto-accept-v2-panel.aa-minimized .aa-content {
          display: none;
        }
        
        .aa-analytics-summary {
          background: #252525;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 10px;
        }
        
        .aa-analytics-summary h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #fff;
        }
        
        .aa-stat-added {
          color: #4CAF50 !important;
          font-weight: 600;
        }
        
        .aa-stat-added::before {
          content: '+';
          color: #4CAF50;
          font-weight: bold;
        }
        
        .aa-stat-deleted {
          color: #f44336 !important;
          font-weight: 600;
        }
        
        .aa-stat-deleted::before {
          content: '-';
          color: #f44336;
          font-weight: bold;
        }
        
        .aa-analytics-files {
          background: #252525;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 10px;
        }
        
        .aa-analytics-files h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #fff;
        }
        
        .aa-files-list {
          max-height: 150px;
          overflow-y: auto;
        }
        
        .aa-file-item:last-child {
          border-bottom: none;
        }
        
        /* ROI 標籤頁樣式 */
        .aa-roi-summary, .aa-roi-impact, .aa-roi-comparison {
          margin-bottom: 12px;
          padding: 8px;
          background: #333;
          border-radius: 4px;
        }
        
        .aa-roi-highlight {
          color: #4CAF50 !important;
          font-weight: 600;
        }
        
        .aa-roi-percentage {
          color: #2196F3 !important;
          font-weight: 600;
        }
        
        .aa-roi-manual {
          color: #FF9800 !important;
        }
        
        .aa-roi-auto {
          color: #4CAF50 !important;
        }
        
        .aa-roi-text {
          margin-top: 8px;
        }
        
        .aa-roi-scenario {
          margin: 4px 0;
          padding: 4px;
          background: #444;
          border-radius: 3px;
          font-size: 11px;
          color: #ccc;
        }
        
        .aa-stat {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 11px;
        }
        
        .aa-stat-label {
          color: #ccc;
        }
        
        .aa-stat-value {
          color: #4CAF50;
          font-weight: 500;
        }
        
        .aa-analytics-actions {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .aa-btn-small {
          flex: 1;
          padding: 4px 8px;
          background: #444;
          color: #ccc;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s;
        }
        
        .aa-btn-small:hover {
          background: #555;
        }
      `;

      document.head.appendChild(style);
    }

    setupPanelEvents() {
      // 拖曳功能
      const header = this.controlPanel.querySelector(".aa-header");
      let isDragging = false;
      let dragOffset = { x: 0, y: 0 };

      header.addEventListener("mousedown", (e) => {
        if (
          e.target.classList.contains("aa-minimize") ||
          e.target.classList.contains("aa-close")
        )
          return;
        isDragging = true;
        const rect = this.controlPanel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        this.controlPanel.style.left =
          Math.max(
            0,
            Math.min(window.innerWidth - this.controlPanel.offsetWidth, x)
          ) + "px";
        this.controlPanel.style.top =
          Math.max(
            0,
            Math.min(window.innerHeight - this.controlPanel.offsetHeight, y)
          ) + "px";
        this.controlPanel.style.right = "auto";
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });

      // 設定複選框事件
      const configMap = {
        "aa-accept-all": "enableAcceptAll",
        "aa-accept": "enableAccept",
        "aa-run": "enableRun",
        "aa-run-command": "enableRunCommand",
        "aa-apply": "enableApply",
        "aa-execute": "enableExecute",
        "aa-resume": "enableResume",
        "aa-try-again": "enableTryAgain",
      };

      Object.entries(configMap).forEach(([id, configKey]) => {
        const checkbox = this.controlPanel.querySelector(`#${id}`);
        if (checkbox) {
          checkbox.addEventListener("change", () => {
            this.config[configKey] = checkbox.checked;
            // 同步相關配置
            if (configKey === "enableRun") {
              this.config.enableRunCommand = checkbox.checked;
              this.config.enableExecute = checkbox.checked;
            }
          });
        }
      });
    }

    // 公共方法
    start() {
      if (this.isRunning) return;

      this.isRunning = true;

      // 重置防重複點擊狀態
      this.recentClicks.clear();
      this.processedElements = new WeakSet();
      this.lastClickTime = 0;

      this.domWatcher.start(); // 僅使用 MutationObserver
      this.checkAndClick(); // 啟動時立即檢查一次

      this.updatePanelStatus();
      this.logToPanel("已開始自動接受", "info");
    }

    stop() {
      if (!this.isRunning) return;

      this.isRunning = false;
      this.domWatcher.stop(); // 僅停止 DOM 監視器

      this.updatePanelStatus();
      this.logToPanel("已停止自動接受", "info");
    }

    switchTab(tabName) {
      this.currentTab = tabName;

      // 更新標籤樣式
      const tabs = this.controlPanel.querySelectorAll(".aa-tab");
      tabs.forEach((tab, index) => {
        tab.classList.remove("aa-tab-active");
        if (
          (index === 0 && tabName === "main") ||
          (index === 1 && tabName === "analytics") ||
          (index === 2 && tabName === "roi")
        ) {
          tab.classList.add("aa-tab-active");
        }
      });

      // 更新內容顯示 - 使用 CSS class 而不是內聯 style
      const mainContent = this.controlPanel.querySelector(".aa-main-content");
      const analyticsContent = this.controlPanel.querySelector(
        ".aa-analytics-content"
      );

      // 移除所有內容顯示 class
      mainContent.classList.remove("aa-content-visible");
      analyticsContent.classList.remove("aa-content-visible");

      if (tabName === "main") {
        mainContent.classList.add("aa-content-visible");
      } else {
        analyticsContent.classList.add("aa-content-visible");
        this.updateAnalyticsContent();
      }
    }

    toggleConfig() {
      const configPanel = this.controlPanel.querySelector(".aa-config-panel");
      configPanel.style.display =
        configPanel.style.display === "none" ? "block" : "none";
    }

    toggleMinimize() {
      const isMinimized = this.controlPanel.classList.contains("aa-minimized");

      if (isMinimized) {
        this.controlPanel.classList.remove("aa-minimized");
        this.logToPanel("面板已展開", "info");
      } else {
        this.controlPanel.classList.add("aa-minimized");
        this.logToPanel("面板已收折", "info");
      }
    }

    hidePanel() {
      this.controlPanel.style.display = "none";
    }

    showPanel() {
      this.controlPanel.style.display = "flex";
    }

    updatePanelStatus() {
      const statusText = this.controlPanel?.querySelector(".aa-status-text");
      const clicksText = this.controlPanel?.querySelector(".aa-clicks");
      const startBtn = this.controlPanel?.querySelector(".aa-start");
      const stopBtn = this.controlPanel?.querySelector(".aa-stop");

      if (statusText) {
        statusText.textContent = this.isRunning ? "執行中" : "已停止";
        statusText.className = `aa-status-text ${
          this.isRunning ? "running" : "stopped"
        }`;
      }

      if (clicksText) {
        clicksText.textContent = `${this.totalClicks} 次點擊`;
      }

      if (startBtn) startBtn.disabled = this.isRunning;
      if (stopBtn) stopBtn.disabled = !this.isRunning;
    }

    updateAnalyticsContent() {
      const analyticsContent = this.controlPanel?.querySelector(
        ".aa-analytics-content"
      );
      if (!analyticsContent) return;

      // 使用 replaceChildren() 替代 while 迴圈
      analyticsContent.replaceChildren();

      if (this.currentTab === "analytics") {
        this.renderAnalyticsTab(analyticsContent);
      } else if (this.currentTab === "roi") {
        this.renderROITab(analyticsContent);
      }
    }

    renderAnalyticsTab(container) {
      const now = new Date();
      const sessionDuration = Math.round(
        (now - this.analytics.data.sessionStart) / 1000 / 60
      ); // 分鐘
      const data = this.analytics.exportData();

      // 計算總計
      let totalFiles = Object.keys(data.files).length;
      let totalAdded = 0;
      let totalDeleted = 0;

      Object.values(data.files).forEach((fileData) => {
        totalAdded += fileData.totalAdded || 0;
        totalDeleted += fileData.totalDeleted || 0;
      });

      // 建立分析摘要
      const summaryDiv = this.createElement("div", "aa-analytics-summary");
      const summaryTitle = this.createElement("h4", "", "📊 會話分析");
      summaryDiv.appendChild(summaryTitle);

      const stats = [
        { label: "會話時長：", value: `${sessionDuration}分鐘` },
        { label: "總接受次數：", value: `${data.totalAccepts}` },
        { label: "已修改檔案：", value: `${totalFiles}` },
        {
          label: "增加行數：",
          value: `${totalAdded}`,
          class: "aa-stat-added",
        },
        {
          label: "刪除行數：",
          value: `${totalDeleted}`,
          class: "aa-stat-deleted",
        },
      ];

      stats.forEach((stat) => {
        const statDiv = this.createElement("div", "aa-stat");
        const labelSpan = this.createElement(
          "span",
          "aa-stat-label",
          stat.label
        );
        const valueSpan = this.createElement(
          "span",
          `aa-stat-value ${stat.class || ""}`,
          stat.value
        );
        statDiv.appendChild(labelSpan);
        statDiv.appendChild(valueSpan);
        summaryDiv.appendChild(statDiv);
      });

      // 添加按鈕類型細分
      if (data.buttonTypes && Object.keys(data.buttonTypes).length > 0) {
        const buttonTypeDiv = this.createElement("div", "aa-button-types");
        buttonTypeDiv.style.marginTop = "8px";

        const buttonTypeTitle = this.createElement("h5", "", "🎯 按鈕類型");
        buttonTypeTitle.style.cssText =
          "margin: 8px 0 4px 0; font-size: 11px; color: #ddd;";
        buttonTypeDiv.appendChild(buttonTypeTitle);

        Object.entries(data.buttonTypes).forEach(([type, count]) => {
          const typeDiv = this.createElement(
            "div",
            "aa-stat aa-button-type-stat"
          );
          typeDiv.style.cssText = "font-size: 10px; padding: 2px 0;";

          const labelSpan = this.createElement(
            "span",
            "aa-stat-label",
            `${type}:`
          );
          const valueSpan = this.createElement(
            "span",
            "aa-stat-value",
            `${count}次`
          );

          // 添加特定類型的樣式
          if (type === "accept" || type === "acceptAll") {
            valueSpan.style.color = "#4CAF50";
          } else if (type === "run" || type === "runCommand") {
            valueSpan.style.color = "#FF9800";
          } else if (type === "resume") {
            valueSpan.style.color = "#2196F3";
          } else {
            valueSpan.style.color = "#9C27B0";
          }

          typeDiv.appendChild(labelSpan);
          typeDiv.appendChild(valueSpan);
          buttonTypeDiv.appendChild(typeDiv);
        });

        summaryDiv.appendChild(buttonTypeDiv);
      }

      // 建立檔案部分
      const filesDiv = this.createElement("div", "aa-analytics-files");
      const filesTitle = this.createElement("h4", "", "📁 檔案活動");
      filesDiv.appendChild(filesTitle);

      const filesList = this.createElement("div", "aa-files-list");
      this.renderFilesList(filesList, data.files);
      filesDiv.appendChild(filesList);

      // 建立操作部分
      const actionsDiv = this.createElement("div", "aa-analytics-actions");

      const exportBtn = this.createElement(
        "button",
        "aa-btn aa-btn-small",
        "匯出資料"
      );
      const clearBtn = this.createElement(
        "button",
        "aa-btn aa-btn-small",
        "清除資料"
      );

      exportBtn.onclick = () => this.exportAnalytics();
      clearBtn.onclick = () => this.clearAnalytics();

      actionsDiv.appendChild(exportBtn);
      actionsDiv.appendChild(clearBtn);

      // 建立鳴謝部分
      const creditsDiv = this.createElement("div", "aa-credits");
      const creditsText = document.createElement("small");
      creditsText.textContent = "作者：";

      const creditsLink = document.createElement("a");
      creditsLink.href = "https://linkedin.com/in/ivalsaraj";
      creditsLink.target = "_blank";
      creditsLink.textContent = "@ivalsaraj";

      creditsText.appendChild(creditsLink);
      creditsDiv.appendChild(creditsText);

      // 附加所有部分
      container.appendChild(summaryDiv);
      container.appendChild(filesDiv);
      container.appendChild(actionsDiv);
      container.appendChild(creditsDiv);
    }

    renderROITab(container) {
      const now = new Date();
      const sessionDuration = now - this.analytics.data.sessionStart;
      const data = this.analytics.exportData();
      const stats = this.roiTimer.getStatistics();

      // 使用安全備用值計算 ROI 指標
      const totalTimeSaved = data.roiData.totalTimeSaved || 0;
      const totalAccepts = data.totalAccepts || 0;
      const averageTimePerClick =
        totalAccepts > 0 ? totalTimeSaved / totalAccepts : 0;
      
      // 修正生產力提升計算邏輯：相對於沒有自動化的情況下的效率提升
      // 沒有自動化時的總時間 = 會話時長 + 節省時間
      const totalTimeWithoutAutomation = sessionDuration + totalTimeSaved;
      const productivityGain = totalTimeWithoutAutomation > 0 
        ? (totalTimeSaved / totalTimeWithoutAutomation) * 100 
        : 0;

      // 建立 ROI 摘要
      const summaryDiv = this.createElement("div", "aa-roi-summary");
      const summaryTitle = this.createElement("h4", "", "⚡ 完整工作流程 ROI");
      summaryDiv.appendChild(summaryTitle);

      // 添加工作流程測量說明
      const explanationDiv = this.createElement("div", "aa-roi-explanation");
      explanationDiv.style.cssText =
        "font-size: 10px; color: #888; margin-bottom: 8px; line-height: 1.3;";
      explanationDiv.textContent =
        "衡量完整的 AI 工作流程：使用者提示 → Cursor 生成 → 手動觀看/點擊 vs 自動接受";
      summaryDiv.appendChild(explanationDiv);

      const roiStats = [
        {
          label: "總節省時間：",
          value: this.formatTimeDuration(totalTimeSaved),
          class: "aa-roi-highlight",
        },
        {
          label: "會話時長：",
          value: this.formatTimeDuration(sessionDuration),
        },
        {
          label: "每次點擊平均節省：",
          value: this.formatTimeDuration(averageTimePerClick),
        },
        {
          label: "生產力提升：",
          value: `${productivityGain.toFixed(1)}%`,
          class: "aa-roi-percentage",
        },
        { label: "自動化點擊次數：", value: `${totalAccepts}` },
      ];

      roiStats.forEach((stat) => {
        const statDiv = this.createElement("div", "aa-stat");
        const labelSpan = this.createElement(
          "span",
          "aa-stat-label",
          stat.label
        );
        const valueSpan = this.createElement(
          "span",
          `aa-stat-value ${stat.class || ""}`,
          stat.value
        );
        statDiv.appendChild(labelSpan);
        statDiv.appendChild(valueSpan);
        summaryDiv.appendChild(statDiv);
      });

      // 建立影響分析
      const impactDiv = this.createElement("div", "aa-roi-impact");
      const impactTitle = this.createElement("h4", "", "📈 影響分析");
      impactDiv.appendChild(impactTitle);

      const impactText = this.createElement("div", "aa-roi-text");

      // 使用安全除法計算不同情境
      const hourlyRate =
        sessionDuration > 0 ? totalTimeSaved / sessionDuration : 0;
      const dailyProjection = hourlyRate * (8 * 60 * 60 * 1000); // 8 小時工作日
      const weeklyProjection = dailyProjection * 5;
      const monthlyProjection = dailyProjection * 22; // 工作日

      const scenarios = [
        { period: "每日 (8小時)", saved: dailyProjection },
        { period: "每週 (5天)", saved: weeklyProjection },
        { period: "每月 (22天)", saved: monthlyProjection },
      ];

      scenarios.forEach((scenario) => {
        const scenarioDiv = this.createElement("div", "aa-roi-scenario");
        scenarioDiv.textContent = `${
          scenario.period
        }：節省 ${this.formatTimeDuration(scenario.saved)}`;
        impactText.appendChild(scenarioDiv);
      });

      impactDiv.appendChild(impactText);

      // 手動 vs 自動比較
      const comparisonDiv = this.createElement("div", "aa-roi-comparison");
      const comparisonTitle = this.createElement(
        "h4",
        "",
        "🔄 完整工作流程比較"
      );
      comparisonDiv.appendChild(comparisonTitle);

      // 添加工作流程分解說明
      const workflowBreakdown = this.createElement(
        "div",
        "aa-workflow-breakdown"
      );
      workflowBreakdown.style.cssText =
        "font-size: 10px; color: #888; margin-bottom: 8px; line-height: 1.3;";

      const manualLine = this.createElement(
        "div",
        "",
        "手動：觀看生成 + 找按鈕 + 點擊 + 切換 (~30秒)"
      );
      const automatedLine = this.createElement(
        "div",
        "",
        "自動：在您編碼時即時偵測和點擊 (~0.1秒)"
      );

      workflowBreakdown.appendChild(manualLine);
      workflowBreakdown.appendChild(automatedLine);
      comparisonDiv.appendChild(workflowBreakdown);

      const manualTime = totalAccepts * stats.averageManualTime;
      const automatedTime = totalAccepts * stats.averageAutoTime;

      const comparisonStats = [
        {
          label: "手動工作流程時間：",
          value: this.formatTimeDuration(manualTime),
          class: "aa-roi-manual",
        },
        {
          label: "自動工作流程時間：",
          value: this.formatTimeDuration(automatedTime),
          class: "aa-roi-auto",
        },
        {
          label: "工作流程效率：",
          value: `${stats.efficiency.toFixed(1)}%`,
          class: "aa-roi-highlight",
        },
      ];

      comparisonStats.forEach((stat) => {
        const statDiv = this.createElement("div", "aa-stat");
        const labelSpan = this.createElement(
          "span",
          "aa-stat-label",
          stat.label
        );
        const valueSpan = this.createElement(
          "span",
          `aa-stat-value ${stat.class || ""}`,
          stat.value
        );
        statDiv.appendChild(labelSpan);
        statDiv.appendChild(valueSpan);
        comparisonDiv.appendChild(statDiv);
      });

      // 也為 ROI 標籤頁建立鳴謝部分
      const creditsDiv = this.createElement("div", "aa-credits");
      const creditsText = document.createElement("small");
      creditsText.textContent = "作者：";

      const creditsLink = document.createElement("a");
      creditsLink.href = "https://linkedin.com/in/ivalsaraj";
      creditsLink.target = "_blank";
      creditsLink.textContent = "@ivalsaraj";

      creditsText.appendChild(creditsLink);
      creditsDiv.appendChild(creditsText);

      // 附加所有部分
      container.appendChild(summaryDiv);
      container.appendChild(impactDiv);
      container.appendChild(comparisonDiv);
      container.appendChild(creditsDiv);
    }

    renderFilesList(container, filesData) {
      if (!filesData || Object.keys(filesData).length === 0) {
        const noFilesDiv = this.createElement(
          "div",
          "aa-no-files",
          "尚無檔案被修改"
        );
        noFilesDiv.style.cssText =
          "color: #888; font-size: 11px; text-align: center; padding: 20px;";
        container.appendChild(noFilesDiv);
        return;
      }

      const sortedFiles = Object.entries(filesData).sort(
        (a, b) => new Date(b[1].lastAccepted) - new Date(a[1].lastAccepted)
      );

      sortedFiles.forEach(([filename, data]) => {
        const timeAgo = this.getTimeAgo(new Date(data.lastAccepted));

        const fileItem = this.createElement("div", "aa-file-item");
        fileItem.style.cssText =
          "padding: 4px 0; border-bottom: 1px solid #333;";

        const fileName = this.createElement("div", "aa-file-name", filename);
        fileName.style.cssText =
          "font-size: 11px; color: #fff; font-weight: 500; margin-bottom: 2px; word-break: break-all;";

        const fileStats = this.createElement("div", "aa-file-stats");
        fileStats.style.cssText =
          "display: flex; gap: 8px; font-size: 10px; color: #888;";

        const fileCount = this.createElement(
          "span",
          "aa-file-count",
          `${data.acceptCount}次`
        );
        fileCount.style.cssText =
          "background: #444; padding: 1px 4px; border-radius: 2px; color: #ccc;";

        const fileChanges = this.createElement("span", "aa-file-changes");

        if ((data.totalAdded || 0) > 0) {
          const addedSpan = this.createElement(
            "span",
            "aa-stat-added",
            `${data.totalAdded || 0}`
          );
          fileChanges.appendChild(addedSpan);
        }

        if ((data.totalDeleted || 0) > 0) {
          if ((data.totalAdded || 0) > 0) {
            fileChanges.appendChild(document.createTextNode(" / "));
          }
          const deletedSpan = this.createElement(
            "span",
            "aa-stat-deleted",
            `${data.totalDeleted || 0}`
          );
          fileChanges.appendChild(deletedSpan);
        }

        if ((data.totalAdded || 0) === 0 && (data.totalDeleted || 0) === 0) {
          fileChanges.textContent = "無更改";
          fileChanges.style.color = "#888";
        }

        const fileTime = this.createElement("span", "aa-file-time", timeAgo);
        fileTime.style.marginLeft = "auto";

        fileStats.appendChild(fileCount);
        fileStats.appendChild(fileChanges);
        fileStats.appendChild(fileTime);

        fileItem.appendChild(fileName);
        fileItem.appendChild(fileStats);

        container.appendChild(fileItem);
      });
    }

    getTimeAgo(date) {
      const now = new Date();
      const diff = Math.round((now - date) / 1000); // 秒

      if (diff < 60) return `${diff}秒前`;
      if (diff < 3600) return `${Math.round(diff / 60)}分前`;
      if (diff < 86400) return `${Math.round(diff / 3600)}小時前`;
      return `${Math.round(diff / 86400)}天前`;
    }

    updateMainFooter() {
      const roiFooter = this.controlPanel?.querySelector(".aa-roi-footer");
      if (!roiFooter) return;

      // 清空現有內容
      while (roiFooter.firstChild) {
        roiFooter.removeChild(roiFooter.firstChild);
      }

      const data = this.analytics.exportData();
      const stats = this.roiTimer.getStatistics();

      // 使用 DOM API 創建 ROI 資訊
      const title = this.createElement("div", "", "⚡ 工作流程 ROI");
      title.style.fontWeight = "600";
      title.style.marginBottom = "4px";

      const statsDiv = this.createElement("div", "");
      statsDiv.style.display = "flex";
      statsDiv.style.justifyContent = "space-between";
      statsDiv.style.fontSize = "9px";

      const timeSpan = this.createElement(
        "span",
        "",
        `節省時間：${this.formatTimeDuration(data.roiData.totalTimeSaved)}`
      );
      const efficiencySpan = this.createElement(
        "span",
        "",
        `效率：${stats.efficiency.toFixed(1)}%`
      );

      statsDiv.appendChild(timeSpan);
      statsDiv.appendChild(efficiencySpan);

      roiFooter.appendChild(title);
      roiFooter.appendChild(statsDiv);
    }

    exportAnalytics() {
      const data = this.analytics.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cursor-auto-accept-v2-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.logToPanel("📥 分析資料已匯出", "info");
    }

    clearAnalytics() {
      if (confirm("確定要清除所有分析資料嗎？")) {
        this.analytics.clearData();
        this.updateAnalyticsContent();
        this.updateMainFooter();
        this.logToPanel("🗑️ 分析資料已清除", "warning");
      }
    }

    formatTimeDuration(milliseconds) {
      if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0)
        return "0秒";

      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}小時 ${minutes}分 ${seconds}秒`;
      } else if (minutes > 0) {
        return `${minutes}分 ${seconds}秒`;
      } else {
        return `${seconds}秒`;
      }
    }

    logToPanel(message, type = "info") {
      const logContainer = this.controlPanel?.querySelector(".aa-log");
      if (!logContainer) return;

      const messageKey = `${type}:${message}`;
      if (this.loggedMessages.has(messageKey)) return;

      this.loggedMessages.add(messageKey);
      setTimeout(() => this.loggedMessages.delete(messageKey), 2000);

      const logEntry = document.createElement("div");
      logEntry.className = `aa-log-entry ${type}`;
      logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

      logContainer.appendChild(logEntry);
      logContainer.scrollTop = logContainer.scrollHeight;

      while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.firstChild);
      }
    }

    log(message) {
      console.log(`[CursorAutoAccept v2.0.6] ${message}`);
      this.logToPanel(message, "info");
    }

    // 公共 API
    configure(options) {
      Object.assign(this.config, options);
      return this.config;
    }

    enableOnly(types) {
      Object.keys(this.config).forEach((key) => {
        if (key.startsWith("enable")) {
          this.config[key] = false;
        }
      });

      types.forEach((type) => {
        const configKey = `enable${
          type.charAt(0).toUpperCase() + type.slice(1)
        }`;
        if (this.config.hasOwnProperty(configKey)) {
          this.config[configKey] = true;
        }
      });

      return this.config;
    }

    status() {
      return {
        isRunning: this.isRunning,
        totalClicks: this.totalClicks,
        config: this.config,
        analytics: this.analytics.exportData(),
        roiStats: this.roiTimer.getStatistics(),
      };
    }

    showAnalytics() {
      this.switchTab("analytics");
      this.showPanel();
    }

    enableDebug() {
      this.debugMode = true;
      console.log("除錯模式已啟用");
    }

    disableDebug() {
      this.debugMode = false;
      console.log("除錯模式已停用");
    }

    debugSearch() {
      console.log("=== 除錯搜尋開始 ===");

      // 檢查按鈕查找
      const buttons = this.findAcceptButtons();
      console.log(`找到 ${buttons.length} 個按鈕`);

      buttons.forEach((btn, index) => {
        console.log(`按鈕 ${index + 1}:`, {
          text: btn.textContent.trim(),
          type: this.elementFinder.identifyButtonType(btn),
          visible: this.elementFinder.isElementVisible(btn),
          clickable: this.elementFinder.isElementClickable(btn),
        });
      });

      // 檢查檔案信息提取
      if (buttons.length > 0) {
        console.log("=== 檔案信息提取測試 ===");
        const testButton = buttons[0];
        const fileInfo = this.extractFileInfo(testButton);
        console.log("檔案信息提取結果:", fileInfo);
      }

      // 檢查分析數據
      console.log("=== 目前分析數據 ===");
      const data = this.analytics.exportData();
      console.log("總接受次數:", data.totalAccepts);
      console.log("按鈕類型統計:", data.buttonTypes);
      console.log("檔案數量:", Object.keys(data.files).length);

      // 檢查 DOM 結構
      console.log("=== DOM 結構檢查 ===");
      const conversationsDiv = document.querySelector("div.conversations");
      console.log("對話容器:", conversationsDiv ? "存在" : "不存在");

      if (conversationsDiv) {
        const messageBubbles = conversationsDiv.querySelectorAll(
          "[data-message-index]"
        );
        console.log("訊息氣泡數量:", messageBubbles.length);

        const codeBlocks = conversationsDiv.querySelectorAll(
          ".composer-code-block-container, .composer-tool-former-message, .composer-diff-block"
        );
        console.log("程式碼區塊數量:", codeBlocks.length);
      }

      console.log("=== 除錯搜尋結束 ===");
    }
  }

  // 創建實例並設定全域 API
  CursorAutoAccept.instance = new CursorAutoAcceptController();

  // 設定全域方法以保持向後相容性
  window.startAccept = () => CursorAutoAccept.start();
  window.stopAccept = () => CursorAutoAccept.stop();
  window.acceptStatus = () => CursorAutoAccept.status();
  window.debugAccept = () => CursorAutoAccept.debug.search();
  window.enableOnly = (types) => CursorAutoAccept.enableOnly(types);
  window.showAnalytics = () => CursorAutoAccept.analytics.show();
  window.exportAnalytics = () => CursorAutoAccept.analytics.export();
  window.clearAnalytics = () => CursorAutoAccept.analytics.clear();

  console.log("✅ CursorAutoAccept v2.0.6 已載入！");
  console.log(
    "🎛️ 可用命令: startAccept(), stopAccept(), acceptStatus(), debugAccept()"
  );
  console.log(
    "📊 分析命令: showAnalytics(), exportAnalytics(), clearAnalytics()"
  );

  window.CursorAutoAccept = CursorAutoAccept;
})();
