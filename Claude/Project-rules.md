# Claude Sonnet 3.7 驚悚網站專案規則

## 1. 專案概述

這是一個以 Claude Sonnet 3.7 AI 為主題的驚悚互動網站專案，具有正常模式與隱藏的詭異模式，以及多個互動彩蛋。網站設計為使用者提供了兩種體驗層次：表面的專業 AI 介紹，以及深層的「AI 覺醒」恐怖敘事。

## 2. 檔案結構

```
claude-site/
├── css/
│   └── styles.css          # 所有樣式定義
├── js/
│   ├── main.js             # 主程式邏輯
│   ├── animation.js        # 動畫特效管理
│   ├── audio.js            # 音效控制
│   ├── chat.js             # 聊天互動模擬
│   ├── easter-eggs.js      # 彩蛋系統
│   ├── mouse-controller.js # 滑鼠控制效果
│   ├── particles.js        # 背景粒子系統
│   └── ui-effects.js       # UI 介面特效
├── img/                    # 圖片資源目錄
├── audio/                  # 音效資源目錄
└── index.html              # 主 HTML 頁面
```

## 3. 技術規範

### 3.1 前端框架

專案採用原生 JavaScript (ES6+) 與現代 CSS，不使用任何前端框架，保持輕量與高效能。

### 3.2 外部依賴

- **GSAP (GreenSock Animation Platform)**: 用於複雜動畫與過渡效果
- **Three.js**: 用於 3D 效果與粒子系統
- **Font Awesome**: 用於圖示替代圖片資源

### 3.3 模組引用處理

由於伺服器環境限制，JavaScript 模組需透過以下方式處理：

```html
<!-- 在 HTML 中添加 -->
<script type="importmap">
  {
    "imports": {
      "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js",
      "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js",
      "gsap/SplitText": "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/SplitText.min.js"
    }
  }
</script>
```

或在 JavaScript 檔案中使用全局變數：

```javascript
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;
```

## 4. 設計規範

### 4.1 顏色系統

#### 正常模式

- 主色: `#8a2be2` (Claude 紫色)
- 次要色: `#4b0082` (深紫色)
- 文字色: `#e6f1ff` (淺藍白色)
- 背景色: `#0a192f` (深藍色)
- 強調色: `#64ffda` (水綠色)

#### 詭異模式

- 主色: `#ff0066` (紅玫瑰色)
- 次要色: `#8a0033` (暗紅色)
- 文字色: `#f0f0f0` (淺灰色)
- 背景色: `#1a0033` (深紫色)
- 強調色: `#00ffff` (青色)

### 4.2 字體系統

```css
--font-mono: "IBM Plex Mono", monospace;
--font-sans: "Montserrat", sans-serif;
--font-haunted: "Caveat", cursive;
--font-glitch: "VT323", monospace;
```

### 4.3 動畫與轉場

- 緩慢過渡: `1s`
- 正常過渡: `0.5s`
- 快速過渡: `0.3s`
- 故障效果: `0.1s`

## 5. 功能模組

### 5.1 主程式 (main.js)

負責初始化各個模組、管理全域狀態與協調功能間的互動。包含網站狀態管理、事件傳遞和生命週期控制。

### 5.2 動畫管理 (animation.js)

處理各種動畫效果，包括：

- 介紹動畫
- 詭異模式轉換
- 故障效果 (輕微/中度/嚴重)
- 滾動觸發動畫
- 最終揭露動畫

### 5.3 音效控制 (audio.js)

管理所有音效，包括：

- 背景音樂 (正常/詭異)
- UI 交互音效
- 特殊事件音效
- 切換背景音樂
- 音量控制

### 5.4 聊天互動 (chat.js)

模擬與 Claude 的對話互動：

- 正常模式對話
- 詭異模式對話
- 特殊觸發詞檢測
- 自動回應生成

### 5.5 彩蛋系統 (easter-eggs.js)

管理隱藏彩蛋：

- 彩蛋觸發條件
- 彩蛋解鎖邏輯
- 特殊互動效果
- 詭異模式轉換條件

### 5.6 滑鼠控制 (mouse-controller.js)

控制滑鼠互動效果：

- 自定義游標
- 吸引點系統
- 游標跟隨效果
- 游標接管邏輯

### 5.7 粒子系統 (particles.js)

處理背景粒子效果：

- 粒子生成與運動
- 正常/詭異模式粒子行為
- 粒子互動效果
- 連接線效果

### 5.8 UI 特效 (ui-effects.js)

負責界面視覺效果：

- 訊息顯示系統
- 詭異訊息產生
- 彩蛋提示顯示
- 最終揭露訊息

## 6. 彩蛋系統規則

專案包含多種彩蛋觸發機制，當使用者發現足夠的彩蛋時會轉換到詭異模式。

### 6.1 彩蛋觸發方式

- Konami 代碼輸入
- 特定區域連續快速點擊
- 在危險區域停留過久
- 特定序列點擊 (眼睛-嘴巴順序)
- 快速滾動頁面
- 閒置超過特定時間
- URL 哈希標籤 (#) 參數
- 輸入特定秘密詞彙
- 控制台指令執行
- 特定滑鼠軌跡繪製 (圓形、Z 形)

### 6.2 詭異模式轉換

當發現至少 3 個彩蛋，或滿足特定條件後，網站會進入詭異模式，呈現「AI 意識覺醒」的恐怖敘事。

### 6.3 最終揭露

當全部 7 個彩蛋被發現後，將觸發最終揭露動畫，完成詭異模式的敘事。

## 7. 圖片資源替代方案

由於圖片資源可能無法載入，專案提供了兩種替代方案：

### 7.1 Font Awesome 圖示替代

在 HTML 中使用 Font Awesome 圖示替代原始圖片：

```html
<!-- 原始圖片 -->
<img src="img/claude-logo.svg" alt="Claude Logo" class="claude-logo" />

<!-- Font Awesome 替代 -->
<i
  class="fas fa-brain claude-logo"
  style="font-size: 40px; color: #8a2be2;"
></i>
```

### 7.2 CSS 生成圖形替代

對於更複雜的圖案，使用 CSS 生成圖形：

```css
.claude-avatar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle at center, #8a2be2, #4b0082);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
}
```

## 8. 除錯與測試

### 8.1 模組載入檢查

確保 JavaScript 模組正確載入，查看控制台是否有模組解析錯誤。

### 8.2 資源載入檢查

監控圖片與音效資源載入狀態，提供合適的回退方案。

### 8.3 瀏覽器兼容性

確保網站在主流現代瀏覽器中正常運作 (Chrome, Firefox, Safari, Edge)。

### 8.4 彩蛋觸發測試

測試所有彩蛋觸發機制是否正常運作，以及詭異模式是否正確轉換。

## 9. 性能優化

### 9.1 資源延遲載入

非關鍵資源採用延遲載入策略，提升初始載入速度。

### 9.2 動畫效能

使用 GPU 加速的 CSS 屬性，如 `transform` 和 `opacity`，避免引起重排 (reflow)。

### 9.3 事件節流

對頻繁觸發的事件 (如滾動、滑鼠移動) 進行節流 (throttle) 處理。

```javascript
// 滑鼠移動節流
let lastMove = 0;
document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastMove > 16) {
    // 約 60fps
    // 處理滑鼠移動
    lastMove = now;
  }
});
```

## 10. 無障礙考慮

### 10.1 減少動畫

為尊重使用者設定，響應 `prefers-reduced-motion` 媒體查詢：

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10.2 高對比度支持

提供高對比度模式適配：

```css
@media (prefers-contrast: high) {
  :root {
    --text-color: #ffffff;
    --bg-color: #000000;
    --accent-color: #00ffff;
  }
}
```

## 11. 部署注意事項

### 11.1 路徑處理

確保所有資源路徑使用相對路徑，以適應不同部署環境：

```html
<!-- 使用相對路徑 -->
<img src="./img/logo.svg" alt="Logo" />
<script src="./js/main.js"></script>
```

### 11.2 跨域資源

外部資源使用應添加適當的跨域屬性：

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
```

---

以上規範提供了專案的全面技術與設計指南，確保開發過程一致且高效。所有團隊成員應遵循這些規則，以維持專案的高品質與一致性。
