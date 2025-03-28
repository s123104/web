/**
 * 輸出處理相關函數
 */

// 更新輸出
function updateOutput() {
  const outputContainer = document.querySelector(".output-container");
  if (files.length === 0) {
    outputContainer.classList.remove("show");
    return;
  }

  let output = "";
  const selectedFiles = files.filter((f) => f.selected);
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
      } else {
        output += `### ${file.name}\n\`\`\`${ext || "text"}\n${content}\n\`\`\`\n\n`;
      }
    } else {
      output += `### ${file.name}\n（二進位檔案 - ${file.formattedSize}）\n\n`;
    }
  });

  document.getElementById("output").innerHTML = output;
  outputContainer.classList.add("show");
}

// 複製輸出
async function copyOutput() {
  const output = document.getElementById("output").textContent;
  const copyButton = document.getElementById("copyButton");

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
