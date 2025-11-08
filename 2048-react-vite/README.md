# 2048 React Vite 專案

這是一個使用 React + Vite + Tailwind CSS 開發的 2048 遊戲，從原始的 HTML/CSS/JavaScript 版本轉換而來。

## 📋 專案特色

### ✨ 功能完整
- 🎮 完整的 2048 遊戲邏輯
- 🎨 精美的 UI 設計（保持原始 CSS 風格）
- 📱 響應式設計（RWD）支援
- ⌨️ 鍵盤控制（方向鍵）
- 👆 觸控手勢支援
- 🎯 分數追蹤與最佳分數記錄
- ✨ 流暢的動畫效果

### 🤖 AI 模式支援
專案包含 4 種 AI 策略（已實現邏輯，可擴展使用）：
1. **簡易模式** (ai=1) - 基於簡單啟發式評估
2. **深度模式** (ai=2) - 深度搜索與高級評估
3. **進階模式** (ai=3) - MCTS 蒙特卡洛樹搜索
4. **Reward 模式** (ai=4) - 獎懲機制與詳細分析

### 🛠 技術棧
- ⚛️ **React 18** - UI 框架
- ⚡ **Vite** - 快速建構工具
- 🎨 **Tailwind CSS** - 樣式管理
- 📊 **Chart.js** - 數據可視化（已安裝，可擴展）

## 🚀 快速開始

### 安裝依賴
\`\`\`bash
npm install
\`\`\`

### 開發模式
\`\`\`bash
npm run dev
\`\`\`

### 建構生產版本
\`\`\`bash
npm run build
\`\`\`

### 預覽生產版本
\`\`\`bash
npm run preview
\`\`\`

## 📁 專案結構

\`\`\`
src/
├── components/          # React 組件
│   ├── Header.jsx      # 標題與分數顯示
│   ├── ScoreBox.jsx    # 分數盒子
│   ├── GameBoard.jsx   # 遊戲棋盤
│   ├── Tile.jsx        # 磚塊組件
│   ├── GameMessage.jsx # 遊戲結束訊息
│   ├── Modal.jsx       # 模態窗
│   └── Toast.jsx       # Toast 提示
├── hooks/              # React Hooks
│   ├── useGame.js      # 遊戲邏輯 Hook
│   ├── useKeyboard.js  # 鍵盤控制 Hook
│   └── useTouch.js     # 觸控控制 Hook
├── utils/              # 工具函數
│   ├── gameCore.js     # 遊戲核心類別
│   └── aiStrategies.js # AI 策略實現
├── App.jsx             # 主應用組件
└── index.css           # 全局樣式
\`\`\`

## 🎮 遊戲玩法

### 桌面端
使用 **↑ ↓ ← →** 方向鍵控制磚塊移動

### 移動端
使用手指滑動手勢控制磚塊移動

### 遊戲目標
合併相同數字的磚塊，最終達成 **2048**！

## 🎨 設計原則

### CSS 不變動原則
- 保留原始遊戲的視覺風格和動畫效果
- 使用 Tailwind CSS 管理樣式，同時保留自定義動畫
- 所有顏色、陰影、過渡效果與原版一致

### Clean Code 實踐
- 組件化設計，職責分離
- 使用 React Hooks 管理狀態和副作用
- 完整的 JSDoc 註釋
- 語義化的命名

## 🔧 擴展功能（可選實現）

專案已預留以下功能的實現基礎：

1. **AI 自動遊玩** - 可在 URL 添加 `?ai=1~4` 啟用不同 AI 模式
2. **學習統計** - Chart.js 圖表展示 AI 學習曲線
3. **獎懲明細** - Reward 模式的詳細分析表格

這些功能的核心邏輯已完成，可根據需求進行 UI 整合。

## 📝 轉換筆記

### 從原始版本的主要變更：

1. **架構升級**
   - HTML/CSS/JS → React 組件化
   - 原生 DOM 操作 → React 狀態管理
   - 全局變量 → React Hooks

2. **樣式管理**
   - 原生 CSS → Tailwind CSS + 自定義樣式
   - 保留所有原始動畫效果
   - 改進響應式設計

3. **代碼質量**
   - 添加完整的類型註釋（JSDoc）
   - 模組化設計
   - 更好的可維護性

## 📄 授權

本專案為教育目的開發，基於原始 2048 遊戲改編。

## 🙏 致謝

- 原始 2048 遊戲設計
- React 和 Vite 社群
- Tailwind CSS 團隊
