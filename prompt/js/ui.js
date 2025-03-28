/**
 * UI 相關函數
 */

// 顯示模態框
function showModal(title, message, actions) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalActions = document.getElementById("modalActions");

  // 判斷是否為HTML內容
  if (message.startsWith("<")) {
    modalBody.innerHTML = message;
  } else {
    modalBody.textContent = message;
  }

  modalTitle.textContent = title;
  modalActions.innerHTML = actions
    .map(
      (action) => `
        <button class="modal-btn ${
          action.primary ? "modal-btn-primary" : "modal-btn-secondary"
        }" onclick="${action.onClick}">${action.text}</button>
      `
    )
    .join("");

  // 確保刪除與模態框引用關聯的所有監聽器
  if (modal._clickOutsideListener) {
    modal.removeEventListener('click', modal._clickOutsideListener);
  }
  
  // 建立點擊外部關閉的監聽器
  modal._clickOutsideListener = (e) => {
    // 確保點擊的是模態框背景而非內容
    if (e.target === modal) {
      hideModal();
    }
  };
  
  // 添加監聽器
  modal.addEventListener('click', modal._clickOutsideListener);

  modal.classList.add("show");
}

// 隱藏模態框
function hideModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
}

// 顯示吐司訊息
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  // 強制重繪後再顯示，避免過渡效果沒有觸發
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.display = "none";
    }, 500);
  }, duration);
}

// 顯示載入中吐司
function showLoadingToast(message) {
  const loadingToast = document.getElementById("loadingToast");
  const loadingMessage = document.getElementById("loadingMessage");
  
  loadingMessage.textContent = message || "載入中...";
  loadingToast.style.display = "flex";
  
  setTimeout(() => {
    loadingToast.style.opacity = "1";
  }, 10);
}

// 更新載入中吐司的訊息
function updateLoadingToast(message) {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.textContent = message;
}

// 隱藏載入中吐司
function hideLoadingToast() {
  const loadingToast = document.getElementById("loadingToast");
  loadingToast.style.opacity = "0";
  
  setTimeout(() => {
    loadingToast.style.display = "none";
  }, 300);
}

// 顯示時間過濾模態視窗
function showTimeFilterModal() {
  const modal = document.getElementById("timeFilterModal");
  
  // 確保刪除與模態框引用關聯的所有監聽器
  if (modal._clickOutsideListener) {
    modal.removeEventListener('click', modal._clickOutsideListener);
  }
  
  // 建立點擊外部關閉的監聽器
  modal._clickOutsideListener = (e) => {
    // 確保點擊的是模態框背景而非內容
    if (e.target === modal) {
      hideTimeFilterModal();
    }
  };
  
  // 添加監聽器
  modal.addEventListener('click', modal._clickOutsideListener);
  
  modal.classList.add("show");
}

// 隱藏時間過濾模態視窗
function hideTimeFilterModal() {
  const modal = document.getElementById("timeFilterModal");
  modal.classList.remove("show");
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

// 更新 UI
function updateUI() {
  updateFileList();
  updateOutput();
  updateVersionsList();
}

// 更新版本列表
function updateVersionsList() {
  const versionsContainer = document.getElementById("savedVersions");
  
  if (savedVersions.length === 0) {
    versionsContainer.innerHTML = "";
    return;
  }
  
  const versionsHTML = savedVersions
    .map(
      (version) => `
      <div class="version-item">
        <div class="version-info">
          <span class="version-name">${version.name}</span>
          <span class="version-time">${formatDate(new Date(version.updated))}</span>
        </div>
        <div class="version-actions">
          <button class="version-load-btn" onclick="loadVersion('${version.id}')">
            載入
          </button>
          <button class="delete-version-btn" onclick="deleteVersion('${version.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `
    )
    .join("");
  
  versionsContainer.innerHTML = versionsHTML;
}

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// 更新檔案列表
function updateFileList() {
  const fileList = document.getElementById("fileList");

  if (files.length === 0) {
    fileList.innerHTML = "";
    return;
  }

  // 先對 files 做自訂順序排序
  files = sortFilesByCustomOrder(files);

  const configFiles = files.filter((f) => f.category === "config");
  const scriptFiles = files.filter((f) => f.category === "script");
  const logFiles = files.filter((f) => f.category === "log");
  const generalFiles = files.filter(
    (f) =>
      f.category === "general" ||
      !["config", "script", "log"].includes(f.category)
  );

  // 若某區塊沒有任何檔案，就隱藏
  const configPanel = createCategoryPanel(
    "設定檔",
    configFiles,
    "config"
  );
  const scriptPanel = createCategoryPanel(
    "腳本檔",
    scriptFiles,
    "script"
  );
  const logPanel = createCategoryPanel("日誌檔", logFiles, "log");
  const generalPanel = createCategoryPanel(
    "一般檔案",
    generalFiles,
    "general"
  );

  // 只組裝有檔案的區塊
  let panels = "";
  panels += configFiles.length > 0 ? configPanel : "";
  panels += scriptFiles.length > 0 ? scriptPanel : "";
  panels += logFiles.length > 0 ? logPanel : "";
  panels += generalFiles.length > 0 ? generalPanel : "";

  fileList.innerHTML = `
    <div class="file-list-header">
      <h2>分類檔案列表</h2>
      <div class="file-list-actions">
        <button class="filter-btn" onclick="showTimeFilterModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          時間過濾
        </button>
        <button class="download-all-button" onclick="downloadAllFiles()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下載全部
        </button>
      </div>
    </div>
    <div class="category-panels">
      ${panels}
    </div>
  `;

  setupToggleEvents();
}

// 創建分類面板
function createCategoryPanel(title, fileArray, category) {
  return `
    <div class="category-panel" data-category="${category}">
      <div class="category-header">
        <div class="category-title">
          <svg class="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${getCategoryIcon(category)}
          </svg>
          <h3>${title} (${fileArray.length})</h3>
        </div>
        <div class="category-actions">
          <button class="category-toggle-btn${fileArray.length > 0 ? " active" : ""}" data-category="${category}"></button>
        </div>
      </div>
      <div class="file-items">
        ${fileArray
          .map((file) => createFileItem(file, category))
          .join("")}
      </div>
    </div>
  `;
}

// 獲取類別圖示
function getCategoryIcon(category) {
  switch (category) {
    case "config":
      return `
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      `;
    case "script":
      return `
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      `;
    case "log":
      return `
        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
        <line x1="9" y1="9" x2="15" y2="9"></line>
        <line x1="9" y1="13" x2="15" y2="13"></line>
        <line x1="9" y1="17" x2="13" y2="17"></line>
      `;
    default:
      return `
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
      `;
  }
}

// 創建檔案項目
function createFileItem(file, category) {
  return `
    <div class="file-item" data-id="${
      file.id
    }" data-category="${category}">
      <div class="file-info">
        <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getFileIcon(file)}
        </svg>
        <div class="file-details">
          <span class="file-path">${file.path}</span>
          ${
            file.formattedSize
              ? `<span class="file-size">(${file.formattedSize})</span>`
              : ""
          }
        </div>
      </div>
      <div class="file-actions">
        <label class="toggle small">
          <input type="checkbox" class="file-toggle" data-id="${
            file.id
          }" data-category="${category}" ${
            file.selected ? "checked" : ""
          }>
          <span class="slider"></span>
        </label>
        <button class="action-btn download" onclick="downloadFile('${
          file.id
        }')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
        <button class="action-btn delete" onclick="deleteFile('${
          file.id
        }')" title="刪除檔案">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// 獲取檔案圖示
function getFileIcon(file) {
  const ext = file.extension;
  const fileName = file.name.toLowerCase();

  if (fileName === "dockerfile" || fileName.includes("dockerfile")) {
    return `
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
      <path d="M7 2v20"></path>
      <path d="M17 2v20"></path>
      <path d="M2 12h20"></path>
      <path d="M2 7h5"></path>
      <path d="M2 17h5"></path>
      <path d="M17 17h5"></path>
      <path d="M17 7h5"></path>
    `;
  } else if (fileName.includes(".gitignore")) {
    return `
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    `;
  } else if (ext === "sql") {
    return `
      <path d="M4 4h16v16H4V4z"></path>
      <polyline points="4 10 12 14 20 10"></polyline>
    `;
  } else if (file.category === "config") {
    return `
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    `;
  } else if (file.category === "script") {
    return `
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    `;
  } else if (file.category === "log") {
    return `
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
      <line x1="9" y1="9" x2="15" y2="9"></line>
      <line x1="9" y1="13" x2="15" y2="13"></line>
      <line x1="9" y1="17" x2="13" y2="17"></line>
    `;
  } else if (
    fileName.includes(".env") &&
    (fileName.includes("example") ||
      fileName.includes("sample") ||
      fileName.includes("template"))
  ) {
    return `
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
      <path d="M12 6v6l4 2"></path>
    `;
  } else if (file.type === "binary") {
    return `
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    `;
  } else {
    return `
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    `;
  }
}

// 設置切換事件
function setupToggleEvents() {
  document.querySelectorAll(".category-toggle-btn").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", function () {
      const category = this.dataset.category;
      // 切換按鈕狀態
      this.classList.toggle("active");
      const isActive = this.classList.contains("active");
      
      // 修改後的代碼
      const fileItems = document.querySelectorAll(
        `.file-item[data-category="${category}"]`
      );
      const fileToggles = document.querySelectorAll(
        `.file-toggle[data-category="${category}"]`
      );
      fileItems.forEach((item) => {
        if (isActive) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });

      fileToggles.forEach((toggle) => {
        toggle.checked = isActive;
      });

      updateFilesDisplayState();
    });
  });

  document.querySelectorAll(".file-toggle").forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const id = this.dataset.id;
      const fileItem = document.querySelector(
        `.file-item[data-id="${id}"]`
      );

      if (this.checked) {
        fileItem.classList.remove("dimmed");
      } else {
        fileItem.classList.add("dimmed");
      }

      updateFilesDisplayState();
    });
  });
}

// 更新檔案顯示狀態
function updateFilesDisplayState() {
  const displayStates = {};
  document.querySelectorAll(".file-toggle").forEach((toggle) => {
    displayStates[toggle.dataset.id] = toggle.checked;
  });

  files = files.map((file) => {
    if (displayStates.hasOwnProperty(file.id)) {
      file.selected = displayStates[file.id];
    }
    return file;
  });

  updateOutput();
}
