/**
 * 輸出處理相關函數
 */

// 全域變數宣告 - 確保不會重複宣告
let outputTextArea;

// 更新輸出
function updateOutput() {
  const outputContainer = document.querySelector(".output-container");
  if (files.length === 0) {
    outputContainer.classList.remove("show");
    return;
  }

  let output = "";
  const selectedFiles = files.filter((f) => f.selected);

  // 生成專案結構
  output += "# 專案說明\n\n";
  
  // 添加專案簡介
  const projectPath = selectedFiles.length > 0 ? 
    selectedFiles[0].path.split('/')[0] : 
    "專案";
  
  output += `這是 ${projectPath} 專案的檔案結構與核心程式碼，包含以下主要部分：\n\n`;
  
  // 開始生成簡潔結構圖
  output += "## 📁 專案資料夾結構\n\n```\n";
  const projectStructure = buildProjectStructure(selectedFiles, true);
  output += getFormattedStructure(projectStructure, 0);
  output += "```\n\n";

  
  // 建立檔案類型列表
  const fileCategories = {
    config: false,
    script: false,
    log: false,
    readme: false,
    main: false,
    style: false
  };
  
  // 確認專案中有哪些類型的檔案
  selectedFiles.forEach(file => {
    const ext = file.extension;
    const lowerName = file.name.toLowerCase();
    
    if (file.category === "config" || 
        lowerName.includes("package.json") || 
        lowerName.includes(".gitignore")) {
      fileCategories.config = true;
    }
    else if (file.category === "script" || ext === "js") {
      fileCategories.script = true;
    }
    else if (file.category === "log") {
      fileCategories.log = true;
    }
    else if (lowerName.includes("readme")) {
      fileCategories.readme = true;
    }
    else if (lowerName.includes("app.js") || 
             lowerName.includes("main.js") || 
             lowerName.includes("index.js")) {
      fileCategories.main = true;
    }
    else if (ext === "css" || ext === "scss" || ext === "sass") {
      fileCategories.style = true;
    }
  });
  
  // 添加符號說明
  output += "## 🔢 檔案符號說明\n\n";
  
  let symbolExplanations = [];
  
  if (fileCategories.config) {
    symbolExplanations.push("- **⚙️ 設定檔**：包含專案配置、套件相依性和環境設定");
  }
  if (fileCategories.script) {
    symbolExplanations.push("- **✍️ 腳本檔**：包含邏輯處理、功能實現的程式碼");
  }
  if (fileCategories.log) {
    symbolExplanations.push("- **📑 日誌檔**：記錄系統運行和錯誤資訊");
  }
  if (fileCategories.readme) {
    symbolExplanations.push("- **📘 說明文件**：提供專案概述和使用指南");
  }
  if (fileCategories.main) {
    symbolExplanations.push("- **💻 主程式檔**：應用程式的入口點和核心功能");
  }
  if (fileCategories.style) {
    symbolExplanations.push("- **🎨 樣式表**：定義介面外觀和排版");
  }
  
  // 檢查是否有被過濾的檔案
  const allResults = window.filteredResults || { sensitive: [], blocked: [], large: [] };
  if ((allResults.sensitive && allResults.sensitive.length > 0) || 
      (allResults.blocked && allResults.blocked.length > 0)) {
    symbolExplanations.push("- **🔒 已過濾的敏感檔案**：因安全原因不顯示內容的檔案");
  }
  
  if (allResults.large && allResults.large.length > 0) {
    symbolExplanations.push("- **📦 大型檔案**：超過大小限制的檔案（已過濾）");
  }
  
  const fileWithEnv = selectedFiles.find(f => f.name.toLowerCase().includes(".env"));
  if (fileWithEnv) {
    symbolExplanations.push("- **✅ 環境變數**：包含系統設定和敏感資訊的檔案");
  }
  
  // 如果有任何符號說明，就添加到輸出
  if (symbolExplanations.length > 0) {
    output += symbolExplanations.join("\n") + "\n\n";
  } else {
    // 移除標題，因為沒有符號說明
    output = output.replace("## 🔢 檔案符號說明\n\n", "");
  }

  
  // 添加簡短的專案功能描述
  output += "## 專案功能\n\n";
  output += "以下是此專案的核心檔案及其功能：\n\n";


  // 這裡簡單 grouping 一下路徑
  const paths = new Set(
    selectedFiles.map((f) => f.path.split("/").slice(0, -1).join("/"))
  );

  paths.forEach((path) => {
    if (path) {
      output += `\n## ${path}\n\n`;
      const pathFiles = selectedFiles.filter((f) =>
        f.path.startsWith(path + "/")
      );
      pathFiles.forEach((file) => {
        if (file.type === "text") {
          const ext = file.extension;
          const fileName = file.name.toLowerCase();
          const content = file.processedContent || file.content;
          if (ext === "sql") {
            output += `### ${file.name}\n\`\`\`sql\n${content}\n\`\`\`\n\n`;
          } else if (ext === "conf" || ext === "cfg" || ext === "ini") {
            output += `### ${file.name}\n\`\`\`ini\n${content}\n\`\`\`\n\n`;
          } else if (ext === "log") {
            output += `### ${file.name}\n\`\`\`log\n${content}\n\`\`\`\n\n`;
          } else if (ext === "sh" || ext === "bat") {
            output += `### ${file.name}\n\`\`\`bash\n${content}\n\`\`\`\n\n`;
          } else if (ext === "scss" || ext === "sass" || ext === "less") {
            output += `### ${file.name}\n\`\`\`css\n${content}\n\`\`\`\n\n`;
          } else if (ext === "vue") {
            output += `### ${file.name}\n\`\`\`html\n${content}\n\`\`\`\n\n`;
          } else if (
            fileName === "dockerfile" ||
            fileName.includes("dockerfile")
          ) {
            output += `### ${file.name}\n\`\`\`dockerfile\n${content}\n\`\`\`\n\n`;
          } else if (
            fileName.includes(".env") &&
            (fileName.includes("example") ||
              fileName.includes("sample") ||
              fileName.includes("template"))
          ) {
            output += `### ${file.name}\n\`\`\`properties\n${content}\n\`\`\`\n\n`;
          } else if (fileName.includes(".gitignore")) {
            output += `### ${file.name}\n\`\`\`gitignore\n${content}\n\`\`\`\n\n`;
          } else if (ext === "html" || ext === "htm") {
            output += `### ${file.name}\n\`\`\`html\n${content}\n\`\`\`\n\n`;
          } else if (ext === "js") {
            output += `### ${file.name}\n\`\`\`js\n${content}\n\`\`\`\n\n`;
          } else if (ext === "css") {
            output += `### ${file.name}\n\`\`\`css\n${content}\n\`\`\`\n\n`;
    } else {
      output += `### ${file.name}\n\`\`\`${ext || "text"}\n${content}\n\`\`\`\n\n`;
          }
        } else {
          output += `### ${file.name}\n（二進位檔案 - ${file.formattedSize}）\n\n`;
        }
      });
    }
  });

  const rootFiles = selectedFiles.filter((f) => !f.path.includes("/"));
  
  if (rootFiles.length > 0) {
    output += `\n## 根目錄檔案\n\n`;
  }
  
  // 顯示每個檔案的詳細內容
  rootFiles.forEach((file) => {
    if (file.type === "text") {
      const ext = file.extension;
      const fileName = file.name.toLowerCase();
      const content = file.processedContent || file.content;
      if (ext === "sql") {
        output += `### ${file.name}\n\`\`\`sql\n${content}\n\`\`\`\n\n`;
      } else if (ext === "conf" || ext === "cfg" || ext === "ini") {
        output += `### ${file.name}\n\`\`\`ini\n${content}\n\`\`\`\n\n`;
      } else if (ext === "log") {
        output += `### ${file.name}\n\`\`\`log\n${content}\n\`\`\`\n\n`;
      } else if (ext === "sh" || ext === "bat") {
        output += `### ${file.name}\n\`\`\`bash\n${content}\n\`\`\`\n\n`;
      } else if (ext === "scss" || ext === "sass" || ext === "less") {
        output += `### ${file.name}\n\`\`\`css\n${content}\n\`\`\`\n\n`;
      } else if (ext === "vue") {
        output += `### ${file.name}\n\`\`\`html\n${content}\n\`\`\`\n\n`;
      } else if (
        fileName === "dockerfile" ||
        fileName.includes("dockerfile")
      ) {
        output += `### ${file.name}\n\`\`\`dockerfile\n${content}\n\`\`\`\n\n`;
      } else if (
        fileName.includes(".env") &&
        (fileName.includes("example") ||
          fileName.includes("sample") ||
          fileName.includes("template"))
      ) {
        output += `### ${file.name}\n\`\`\`properties\n${content}\n\`\`\`\n\n`;
      } else if (fileName.includes(".gitignore")) {
        output += `### ${file.name}\n\`\`\`gitignore\n${content}\n\`\`\`\n\n`;
      } else if (ext === "html" || ext === "htm") {
        output += `### ${file.name}\n\`\`\`html\n${content}\n\`\`\`\n\n`;
      } else if (ext === "js") {
        output += `### ${file.name}\n\`\`\`js\n${content}\n\`\`\`\n\n`;
      } else if (ext === "css") {
        output += `### ${file.name}\n\`\`\`css\n${content}\n\`\`\`\n\n`;
      } else {
        output += `### ${file.name}\n\`\`\`${ext || "text"}\n${content}\n\`\`\`\n\n`;
      }
    } else {
      output += `### ${file.name}\n（二進位檔案 - ${file.formattedSize}）\n\n`;
    }
  });

  // 我們不需要進行HTML特殊字元轉義，因為我們將使用textarea顯示純文字
  
  // 清空容器
  outputContainer.innerHTML = `
    <div class="copy-btn-container">
      <button class="copy-btn" onclick="copyOutput()" id="copyButton">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="icon-xs"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z"
            fill="currentColor"
          />
        </svg>
        複製
      </button>
    </div>
  `;

  // 使用 textarea 元素顯示純文字 - 這是關鍵訣竿
  // textarea 內的內容永遠不會被渲染為 HTML
  outputTextArea = document.createElement('textarea');
  outputTextArea.className = 'output';
  outputTextArea.id = 'output';
  outputTextArea.value = output;
  outputTextArea.readOnly = true;
  outputTextArea.spellcheck = false;
  outputTextArea.wrap = 'off';
  outputContainer.appendChild(outputTextArea);
  
  // 保存原始的 Markdown 內容供複製功能使用
  const originalOutput = document.createElement('textarea');
  originalOutput.id = 'originalOutput';
  originalOutput.value = output;
  originalOutput.style.display = 'none';
  outputContainer.appendChild(originalOutput);
  
  outputContainer.classList.add("show");
  
  // 自動調整 textarea 的高度以適應內容
  // 所以使用者不需要捲動
  // 使用 setTimeout 確保在 DOM 更新後調整高度
  setTimeout(() => {
    try {
      if (outputTextArea && outputTextArea.scrollHeight) {
        outputTextArea.style.height = 'auto';
        outputTextArea.style.height = (outputTextArea.scrollHeight + 20) + 'px';
      }
    } catch (e) {
      console.error('調整高度失敗:', e);
    }
  }, 0);
}

// 複製輸出
async function copyOutput() {
  // 取得原始輸出內容，而非使用 textContent 取得已轉義的內容
  const output = document.getElementById("originalOutput")?.value || document.getElementById("output").textContent;
  const copyButton = document.querySelector(".copy-btn");

  try {
    await navigator.clipboard.writeText(output);
    copyButton.classList.add("copied");
    copyButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0633 5.67387C18.5196 5.98499 18.6374 6.60712 18.3262 7.06343L10.8262 18.0634C10.6585 18.3095 10.3898 18.4679 10.0934 18.4957C9.79688 18.5235 9.50345 18.4178 9.29289 18.2072L4.79289 13.7072C4.40237 13.3167 4.40237 12.6835 4.79289 12.293C5.18342 11.9025 5.81658 11.9025 6.20711 12.293L9.85368 15.9396L16.6738 5.93676C16.9849 5.48045 17.607 5.36275 18.0633 5.67387Z" fill="currentColor"/>
      </svg>
      已複製
    `;
    setTimeout(() => {
      copyButton.classList.remove("copied");
      copyButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"/>
        </svg>
        複製
      `;
    }, 2000);
  } catch (err) {
    showModal("複製失敗", "無法複製到剪貼簿，請手動選取複製。", [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
  }
}

// 套用時間過濾
function applyTimeFilter() {
  const selectedRange = document.querySelector('input[name="timeRange"]:checked').value;
  const logFiles = files.filter(f => f.category === "log");
  
  if (logFiles.length === 0) {
    hideTimeFilterModal();
    showToast("沒有可過濾的日誌檔");
    return;
  }

  // 取得時間範圍
  const now = new Date();
  let startDate;
  
  switch (selectedRange) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "yesterday":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      startDate = null;
  }

  // 過濾日誌檔內容
  if (startDate) {
    for (const file of logFiles) {
      if (!file.originalContent) {
        file.originalContent = file.content;
      }

      const lines = file.originalContent.split("\n");
      const filteredLines = [];

      for (const line of lines) {
        // 嘗試從行中提取日期
        const dateMatch = line.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{2}/);
        
        if (dateMatch) {
          const dateStr = dateMatch[0];
          const dateParts = dateStr.split(/[-/]/);
          
          // 處理不同的日期格式
          let year, month, day;
          if (dateParts[0].length === 4) {
            // yyyy-mm-dd
            year = parseInt(dateParts[0]);
            month = parseInt(dateParts[1]) - 1;
            day = parseInt(dateParts[2]);
          } else if (dateParts[2].length === 4) {
            // mm-dd-yyyy or dd-mm-yyyy
            // 這裡假設是 mm-dd-yyyy
            month = parseInt(dateParts[0]) - 1;
            day = parseInt(dateParts[1]);
            year = parseInt(dateParts[2]);
          } else {
            // mm-dd-yy
            month = parseInt(dateParts[0]) - 1;
            day = parseInt(dateParts[1]);
            year = 2000 + parseInt(dateParts[2]);
          }
          
          const lineDate = new Date(year, month, day);
          
          // 只保留在時間範圍內的行
          if (lineDate >= startDate) {
            filteredLines.push(line);
          }
        } else {
          // 找不到日期的行予以保留（可能是格式特殊的日誌）
          filteredLines.push(line);
        }
      }
      
      file.processedContent = filteredLines.join("\n");
      file.content = file.processedContent;
    }
    
    showToast(`已套用時間過濾：${getTimeRangeText(selectedRange)}`);
  } else {
    // 重置所有日誌內容
    for (const file of logFiles) {
      if (file.originalContent) {
        file.content = file.originalContent;
        file.processedContent = null;
      }
    }
    
    showToast("已顯示全部日誌內容");
  }
  
  hideTimeFilterModal();
  updateOutput();
}

// 取得時間範圍描述文字
function getTimeRangeText(range) {
  switch (range) {
    case "today": return "今天";
    case "yesterday": return "昨天至今";
    case "week": return "一週內";
    case "month": return "一個月內";
    default: return "全部內容";
  }
}

// 建立專案結構樹狀圖
function buildProjectStructure(files, includeAnnotations = false) {
  const structure = {};
  const allResults = window.filteredResults || { sensitive: [], blocked: [], large: [] };
  
  // 建立資料夾結構
  files.forEach(file => {
    const parts = file.path.split('/');
    let current = structure;
    
    // 建立或追蹤資料夾樹狀圖
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = { _files: [] };
      }
      current = current[part];
    }
    
    // 將檔案加入最後一層資料夾
    const fileName = parts[parts.length - 1];
    let annotation = '';
    
    if (includeAnnotations) {
      // 根據檔案類型新增註釋
      if (file.category === "config") {
        annotation = "# ⚙️ 設定檔";
      } else if (file.category === "script") {
        annotation = "# ✍️ 腳本檔";
      } else if (file.category === "log") {
        annotation = "# 📑 日誌檔";
      } else if (fileName.toLowerCase().includes("readme")) {
        annotation = "# 📘 專案說明文件";
      } else if (fileName.toLowerCase().includes(".env.example")) {
        annotation = "# 📝 環境變數範例（分享給開發者用）";
      } else if (fileName.toLowerCase().includes(".gitignore")) {
        annotation = "# ✅ Git 忽略檔";
      } else if (fileName.toLowerCase().includes(".dockerignore")) {
        annotation = "# ✅ Docker 建構忽略檔，加速建構";
      } else if (fileName.toLowerCase().includes("docker-compose.yml")) {
        annotation = "# 🐳 Docker 多服務配置主檔";
      } else if (fileName.toLowerCase() === "dockerfile") {
        annotation = "# ⚙️ 自訂 Docker 映像的 Dockerfile";
      } else if (fileName.toLowerCase().includes("backup") && (fileName.endsWith(".sql") || fileName.endsWith(".dump"))) {
        annotation = "# 💾 資料庫備份文件";
      } else if (fileName.toLowerCase().includes("cert") || fileName.endsWith(".pem") || fileName.endsWith(".key")) {
        annotation = "# 🔐 憑證/金鑰檔案 (敏感檔案)";
      } else if (fileName.toLowerCase().includes("nginx.conf") || fileName.toLowerCase().includes("apache.conf")) {
        annotation = "# ⚙️ Web 伺服器設定";
      } else if (fileName.toLowerCase().includes("app.js") || fileName.toLowerCase().includes("main.js")) {
        annotation = "# 💻 主要應用程式檔案";
      } else if (fileName.toLowerCase().includes("index.html")) {
        annotation = "# 👀 主要頁面入口";
      } else if (fileName.toLowerCase().includes("package.json")) {
        annotation = "# 📦 套件相依性設定檔";
      } else if (fileName.toLowerCase().includes(".css") || fileName.toLowerCase().includes(".scss")) {
        annotation = "# 🎨 樣式表檔案";
      } else if (fileName.toLowerCase().includes(".ts") || fileName.toLowerCase().includes(".tsx")) {
        annotation = "# 💾 TypeScript 檔案";
      }
      
      // 參考安全性檔案清單
      if (fileName.toLowerCase() === ".env" || fileName.toLowerCase().endsWith(".env")) {
        annotation = "# ✅ 環境變數（不應提交 Git）";
      }
    }
    
    current._files.push({ name: fileName, annotation: annotation });
  });
  
  // 如果需要包含安全性檔案，並且有全域過濾結果可用
  if (includeAnnotations && allResults) {
    // 將敏感檔案加入結構 (但標記為敏感/安全性檔案)
    // 讓輸出結構更完整
    const blockedFiles = [...(allResults.sensitive || []), ...(allResults.blocked || [])];
    
    blockedFiles.forEach(fileName => {
      const parts = fileName.split('/');
      let current = structure;
      
      // 建立資料夾路徑
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!part) continue;
        
        if (!current[part]) {
          current[part] = { _files: [] };
        }
        current = current[part];
      }
      
      // 將檔案加入目錄
      const baseName = parts[parts.length - 1];
      if (baseName) {
        const existingFile = current._files.find(f => f.name === baseName);
        if (!existingFile) {
          current._files.push({
            name: baseName,
            annotation: "# 🔒 已過濾的敏感檔案"
          });
        }
      }
    });
    
    // 添加大型檔案到結構中
    if (allResults.large && allResults.large.length > 0) {
      allResults.large.forEach(fileName => {
        const parts = fileName.split('/');
        let current = structure;
        
        // 建立資料夾路徑
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!part) continue;
          
          if (!current[part]) {
            current[part] = { _files: [] };
          }
          current = current[part];
        }
        
        // 將檔案加入目錄
        const baseName = parts[parts.length - 1];
        if (baseName) {
          const existingFile = current._files.find(f => f.name === baseName);
          if (!existingFile) {
            current._files.push({
              name: baseName,
              annotation: "# 📦 大型檔案（已過濾）"
            });
          }
        }
      });
    }
  }
  
  return structure;
}

// 遞迴格式化專案結構為樹狀顯示
function getFormattedStructure(structure, depth) {
  let result = '';
  const indent = '  '.repeat(depth);
  
  // 先處理資料夾
  const folders = Object.keys(structure).filter(key => key !== '_files');
  folders.sort();
  
  folders.forEach(folder => {
    result += `${indent}${folder}/\n`;
    result += getFormattedStructure(structure[folder], depth + 1);
  });
  
  // 再處理檔案
  if (structure._files && structure._files.length > 0) {
    // 先錯類檔案，按名字排序
    const sortedFiles = [...structure._files].sort((a, b) => {
      const nameA = typeof a === 'string' ? a : a.name;
      const nameB = typeof b === 'string' ? b : b.name;
      return nameA.localeCompare(nameB);
    });
    
    sortedFiles.forEach(file => {
      if (typeof file === 'string') {
        // 舊版格式，單純顯示檔名
        result += `${indent}${file}\n`;
      } else {
        // 新格式，顯示檔名和註釋
        if (file.annotation) {
          result += `${indent}${file.name} ${file.annotation}\n`;
        } else {
          result += `${indent}${file.name}\n`;
        }
      }
    });
  }
  
  return result;
}
