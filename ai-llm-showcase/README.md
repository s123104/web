<!--
 📦 模組：ai-llm-showcase
 🕒 更新：2025-06-19T05:04:45Z
 🧑‍💻 作者：@Codex
 🔢 版本：v1.5.0
 📝 摘要：add ai llm showcase
-->
# AI LLM Showcase

此專案提供各大型語言模型的展示區域，遵循共用規則並各自展現不同的互動效果。

## 結構
- `index.html`：主頁面，區分 ChatGPT、Claude、Gemini 區域
- `css/style.css`：共用與各 LLM 區域的樣式
- `js/script.js`：互動效果腳本
- `logs/ai-llm-showcase.log`：展示運作紀錄

## 規則
1. 自訂名稱需加上專屬前綴，如 `.cgpt-`、`.claude-`、`.gem-`
2. 任何新功能皆須在 `logs/` 留下說明，並更新 `docs/CHANGELOG.md`
3. 行動裝置優先設計，並允許使用 CDN
