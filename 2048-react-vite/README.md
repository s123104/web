# 2048 React Vite (TypeScript) 專案

這是一個使用 **React + Vite + TypeScript + Tailwind CSS** 開發的 2048 遊戲，從原始的 HTML/CSS/JavaScript 版本轉換而來，並進行了完整的 TypeScript 重構。

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
- ⚛️ **React 19** - UI 框架
- ⚡ **Vite 7** - 快速建構工具
- 🔷 **TypeScript 5.9** - 類型安全的 JavaScript
- 🎨 **Tailwind CSS v4** - 現代化樣式管理（使用 @tailwindcss/postcss）
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
├── components/          # React 組件 (TypeScript)
│   ├── Header.tsx      # 標題與分數顯示
│   ├── ScoreBox.tsx    # 分數盒子
│   ├── GameBoard.tsx   # 遊戲棋盤
│   ├── Tile.tsx        # 磚塊組件
│   ├── GameMessage.tsx # 遊戲結束訊息
│   ├── Modal.tsx       # 模態窗
│   └── Toast.tsx       # Toast 提示
├── hooks/              # React Hooks (TypeScript)
│   ├── useGame.ts      # 遊戲邏輯 Hook
│   ├── useKeyboard.ts  # 鍵盤控制 Hook
│   └── useTouch.ts     # 觸控控制 Hook
├── utils/              # 工具函數 (TypeScript)
│   ├── gameCore.ts     # 遊戲核心類別
│   └── aiStrategies.ts # AI 策略實現
├── types/              # TypeScript 類型定義
│   └── index.ts        # 遊戲類型定義
├── App.tsx             # 主應用組件
├── main.tsx            # 應用入口
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
- **完整的 TypeScript 類型系統**
- 語義化的命名
- 嚴格的類型檢查（strict mode）

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

2. **TypeScript 重構** 🔷
   - JavaScript → TypeScript（100% 類型安全）
   - 創建完整的類型定義系統
   - 所有組件、Hooks、工具類使用 TypeScript
   - 嚴格的編譯器配置（strict mode）
   - 消除所有潛在的類型錯誤

3. **樣式管理**
   - 原生 CSS → Tailwind CSS v4 + 自定義樣式
   - 使用新的 @tailwindcss/postcss 配置
   - @tailwind 指令 → @import "tailwindcss" 語法
   - 保留所有原始動畫效果
   - 改進響應式設計

4. **代碼質量**
   - TypeScript 提供的類型安全
   - 完整的接口和類型定義
   - 模組化設計
   - 更好的可維護性和 IDE 支援

## 📐 Clean Code 最佳實踐

本專案嚴格遵循 Clean Code 原則和最佳實踐：

### 🎯 SOLID 原則

#### 1. 單一職責原則 (SRP)
每個模組、類別和函數只負責一個明確的功能：

```typescript
// ✅ 好的範例：職責分離
class GameCore {
  // 只負責遊戲邏輯
  move(direction: number): MoveResult { ... }
}

function useGame() {
  // 只負責狀態管理
}

function GameBoard() {
  // 只負責 UI 渲染
}
```

#### 2. 開放封閉原則 (OCP)
系統對擴展開放，對修改封閉：

```typescript
// AI 策略可擴展，無需修改現有代碼
export function findBestMove(state: GameState): number | null { ... }
export function findMCTSMove(state: GameState): number | null { ... }
// 新增策略不影響現有實現
```

#### 3. 依賴反轉原則 (DIP)
高層模組不依賴低層模組的具體實現：

```typescript
// 組件依賴抽象的 Props 接口，不依賴具體實現
interface GameBoardProps {
  board: Board;
  mergedTiles?: MergedTile[];
}
```

### 🏗 架構設計模式

#### 分層架構
```
Presentation Layer (Components)
        ↓
Business Logic Layer (Hooks)
        ↓
Core Logic Layer (Utils)
        ↓
Type System (Types)
```

**詳細架構說明請參閱：[ARCHITECTURE.md](./ARCHITECTURE.md)**

#### 單向數據流
```
用戶操作 → Hooks → Utils → State 更新 → UI 重渲染
```

### 📝 程式碼品質標準

#### 命名規範
```typescript
// Components: PascalCase
export function GameBoard() {}

// Hooks: camelCase with 'use' prefix
export function useGame() {}

// Types/Interfaces: PascalCase
export interface GameState {}

// Constants: UPPER_SNAKE_CASE
const MAX_VALUE = 2048

// Variables/Functions: camelCase
const handleMove = () => {}
```

#### 函數設計原則

1. **單一職責**：每個函數只做一件事
2. **參數限制**：不超過 3 個參數，複雜情況使用對象
3. **純函數優先**：無副作用，相同輸入產生相同輸出
4. **明確返回值**：避免 void，總是返回有意義的值

```typescript
// ✅ 好的範例
function calculateScore(mergedValue: number): number {
  return mergedValue
}

// ❌ 避免的範例
function doSomething(a: any, b: any, c: any, d: any): void {
  // 參數太多，返回值不明確
}
```

#### TypeScript 嚴格模式

```json
{
  "strict": true,                      // 所有嚴格檢查
  "noUnusedLocals": true,              // 禁止未使用變量
  "noUnusedParameters": true,          // 禁止未使用參數
  "noFallthroughCasesInSwitch": true,  // Switch 完整性
  "noUncheckedIndexedAccess": true     // 陣列訪問安全
}
```

### 🧪 代碼可測試性

#### 依賴注入
```typescript
// 使用參數傳遞依賴，而非硬編碼
function useKeyboard(
  onMove: (direction: number) => void,
  enabled: boolean = true
) { ... }
```

#### 純函數設計
```typescript
// 無副作用，易於測試
export function evaluateState(state: GameState): number {
  // 不修改輸入，只返回計算結果
  return score
}
```

### 📊 效能優化

#### React 優化
```typescript
// 使用 React.memo 避免不必要的重渲染
export const GameBoard = React.memo(forwardRef(...))

// 使用 useCallback 穩定函數引用
const move = useCallback((direction: number) => { ... }, [dependencies])

// 使用 useMemo 緩存計算結果
const tiles = useMemo(() => board.flatMap(...), [board])
```

#### CSS 效能
```css
/* 使用 transform 代替 position，啟用 GPU 加速 */
.tile {
  transform: translate(0, 0);  /* 觸發硬體加速 */
  transition: transform 0.15s; /* 流暢動畫 */
}
```

### 🔒 類型安全

#### 完整的類型覆蓋
- ✅ 100% 函數有明確返回類型
- ✅ 100% 組件 Props 有類型定義
- ✅ 100% 狀態有類型註解
- ✅ 0 個 `any` 類型
- ✅ 0 個 `@ts-ignore`

#### 嚴格的 Null 檢查
```typescript
// 所有可能為 null 的值都有檢查
if (!gameCore || gameOver) return false

// 使用可選鏈
const value = gameCore?.board[row]?.[col]

// 使用 ?? 提供預設值
const tiles = mergedTiles ?? []
```

### 📚 文檔規範

#### JSDoc 註釋
```typescript
/**
 * 移動磚塊到指定方向
 * @param direction - 移動方向：0=上, 1=右, 2=下, 3=左
 * @returns 移動結果，包含是否成功、合併磚塊等資訊
 * @throws 當遊戲已結束時不執行移動
 */
export function move(direction: number): MoveResult { ... }
```

#### README 與 ARCHITECTURE
- ✅ README.md - 使用說明和快速開始
- ✅ ARCHITECTURE.md - 詳細的架構設計文檔
- ✅ 程式碼內註釋 - 解釋「為什麼」而非「做什麼」

### 🎨 樣式組織

#### CSS 模組化
```css
/* 使用 @layer 組織樣式 */
@layer base {
  /* 基礎樣式 */
}

@layer utilities {
  /* 自定義工具類 */
}
```

#### Tailwind 最佳實踐
```typescript
// 使用語義化的 className
<div className="score-box bg-tile-2 rounded-lg shadow-md">

// 避免過長的 className，考慮使用組件
// ❌ <div className="flex items-center justify-center bg-white rounded-lg shadow-lg p-4 m-2 ...">
// ✅ <ScoreBox />
```

### 🔄 版本控制

#### Git Commit 規範
```bash
feat: 新增功能
fix: 修復問題
refactor: 重構代碼
docs: 更新文檔
style: 程式碼格式調整
test: 測試相關
chore: 建置工具或輔助工具變動
```

#### 分支策略
- `main` - 穩定版本
- `claude/*` - 開發分支
- 使用 Pull Request 進行代碼審查

### ✅ 程式碼審查清單

每次提交前檢查：

- [ ] 所有函數有明確類型
- [ ] 無 TypeScript 編譯錯誤
- [ ] 無 console.log 或調試代碼
- [ ] 變量命名清晰有意義
- [ ] 複雜邏輯有註釋說明
- [ ] 組件職責單一
- [ ] 無重複代碼
- [ ] 效能優化（memo, callback）
- [ ] 可訪問性（a11y）考慮

## 🔷 TypeScript 特性

### 類型定義
專案包含完整的類型定義系統（`src/types/index.ts`）：
- **遊戲類型**：Board, TileInfo, MergedTile, Position
- **狀態類型**：GameState, MoveResult
- **AI 類型**：BestMoveResult, RewardDetail, SimulationResult
- **組件 Props**：所有組件都有明確的接口定義

### 類型安全保證
- ✅ 嚴格的 null/undefined 檢查
- ✅ 編譯時錯誤檢測
- ✅ 完整的類型推導
- ✅ IDE 智能提示和自動完成
- ✅ 重構安全性

### TypeScript 配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 📄 授權

本專案為教育目的開發，基於原始 2048 遊戲改編。

## 🙏 致謝

- 原始 2048 遊戲設計
- React 和 Vite 社群
- Tailwind CSS 團隊
