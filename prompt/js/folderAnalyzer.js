/**
 * 資料夾分析相關函數
 */

// 分析目錄結構
async function analyzeFolderStructure(fileList) {
  showLoadingToast("正在分析資料夾結構...");
  const MAX_FILES_PER_FOLDER = 20; // 檔案數量限制為20個
  const filesArray = Array.from(fileList);
  
  // 尋找 .gitignore 文件
  let gitignoreRules = null;
  for (const file of filesArray) {
    if (file.name === ".gitignore") {
      try {
        const reader = new FileReader();
        const gitignoreContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        gitignoreRules = await parseGitignore(gitignoreContent);
        break;
      } catch (err) {
        console.error("解析 .gitignore 失敗:", err);
      }
    }
  }
  
  // 建立目錄結構
  const rootFolder = {
    name: "根目錄",
    path: "",
    children: {},
    files: [],
    totalFiles: 0,
    selected: true,
    isRoot: true
  };
  
  // 將檔案放入對應的資料夾結構中
  for (const file of filesArray) {
    if (!file.type && file.size === 0) {
      // 跳過目錄項
      continue;
    }
    
    const filePath = file.webkitRelativePath || file.name;
    const pathParts = filePath.split("/");
    const fileName = pathParts.pop();
    
    // 處理檔案是否應該被排除
    const fileExt = fileName.toLowerCase().split(".").pop();
    if (SENSITIVE_EXTENSIONS.includes(fileExt) || BLOCKED_EXTENSIONS.includes(fileExt)) {
      continue;
    }
    
    if (fileName === ".env" || (fileName.endsWith(".env") && !fileName.includes("example") && 
        !fileName.includes("sample") && !fileName.includes("template"))) {
      continue;
    }
    
    if (gitignoreRules && isFileIgnored(filePath, gitignoreRules)) {
      continue;
    }
    
    if (isLargeFile(file.size)) {
      continue;
    }
    
    // 建立或獲取資料夾路徑
    let currentFolder = rootFolder;
    let currentPath = "";
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!currentFolder.children[part]) {
        currentFolder.children[part] = {
          name: part,
          path: currentPath,
          children: {},
          files: [],
          totalFiles: 0,
          selected: true,
          isRoot: false,
          depth: i + 1
        };
      }
      
      currentFolder = currentFolder.children[part];
    }
    
    // 將檔案加入資料夾
    currentFolder.files.push({
      name: fileName,
      path: filePath,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      originalFile: file
    });
    
    // 更新檔案計數
    currentFolder.totalFiles++;
    
    // 同時更新所有父資料夾的計數
    let parentFolder = rootFolder;
    currentPath = "";
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      parentFolder.totalFiles++;
      parentFolder = parentFolder.children[part];
    }
  }
  
  // 設定預設選擇狀態 - 改進的選擇邏輯
  const setFolderSelection = (folder, isTopLevel = false) => {
    // 最上層資料夾（使用者選擇的）或根目錄始終選中
    if (isTopLevel || folder.isRoot) {
      folder.selected = true;
      
      // 處理子資料夾，第一層級預設勾選，除非檔案數量超過限制
      for (const childName in folder.children) {
        const childFolder = folder.children[childName];
        // 如果超過檔案限制，則預設不勾選
        const childIsSelected = childFolder.totalFiles <= MAX_FILES_PER_FOLDER;
        // 與最靠近的上層不同，使用isDirectChild = true
        setFolderSelection(childFolder, false, childIsSelected, true);
      }
    } else {
      // 對於內層資料夾根據傳入的選擇狀態設定，第三個參數可覆寫自動計算的選擇狀態
      const isSelected = arguments.length >= 3 ? arguments[2] : folder.totalFiles <= MAX_FILES_PER_FOLDER;
      folder.selected = isSelected;
      
      // 處理其子資料夾，如果父資料夾不選中，子資料夾也不選中
      for (const childName in folder.children) {
        const childFolder = folder.children[childName];
        // 父資料夾未勾選時，其下所有子資料夾都不勾選
        // 父資料夾已勾選時，根據子資料夾檔案數量決定是否勾選
        const childIsSelected = isSelected ? childFolder.totalFiles <= MAX_FILES_PER_FOLDER : false;
        setFolderSelection(childFolder, false, childIsSelected, false);
      }
    }
  };
  
  setFolderSelection(rootFolder, true);
  hideLoadingToast();
  return { rootFolder, gitignoreRules, fileList: filesArray };
}

// 顯示目錄選擇模態窗
function showFolderSelectionModal(folderAnalysis) {
  const modal = document.getElementById("folderSelectionModal");
  const folderTree = document.getElementById("folderTree");
  
  // 保存分析結果供後續處理使用
  modal._folderAnalysis = folderAnalysis;
  
  // 生成資料夾樹狀結構HTML
  folderTree.innerHTML = generateFolderTreeHTML(folderAnalysis.rootFolder, 0);
  
  // 設置總檔案數
  document.getElementById("totalFilesCount").textContent = folderAnalysis.rootFolder.totalFiles;
  updateSelectedFilesCount();
  
  // 添加資料夾展開/收合事件
  setupFolderToggleEvents();
  
  // 確保刪除與模態框引用關聯的所有監聽器
  if (modal._clickOutsideListener) {
    modal.removeEventListener('click', modal._clickOutsideListener);
  }
  
  // 建立點擊外部關閉的監聽器
  modal._clickOutsideListener = (e) => {
    // 確保點擊的是模態框背景而非內容
    if (e.target === modal) {
      hideFolderSelectionModal();
    }
  };
  
  // 添加監聽器
  modal.addEventListener('click', modal._clickOutsideListener);
  
  // 顯示模態窗
  modal.classList.add("show");
}

// 隱藏目錄選擇模態窗
function hideFolderSelectionModal() {
  const modal = document.getElementById("folderSelectionModal");
  modal.classList.remove("show");
}

// 生成資料夾樹狀結構的HTML
function generateFolderTreeHTML(folder, level) {
  let html = '';
  
  // 根目錄特殊處理
  if (level === 0) {
    html += `<div class="folder-item root-folder">
      <div class="folder-info">
        <svg class="folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="folder-name">全部檔案</span>
        <span class="folder-stats">(${folder.totalFiles} 個檔案)</span>
      </div>
      <label class="toggle small">
        <input type="checkbox" class="folder-checkbox" data-path="${folder.path}" ${folder.selected ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>`;
    
    if (Object.keys(folder.children).length > 0) {
      html += `<div class="folder-children show">`;
      
      // 處理子資料夾
      for (const childName in folder.children) {
        html += generateFolderTreeHTML(folder.children[childName], level + 1);
      }
      
      html += `</div>`;
    }
    
    return html;
  }
  
  // 一般資料夾處理
  html += `<div class="folder-item" data-level="${level}">
    <span class="folder-toggle" onclick="toggleFolder(this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </span>
    <div class="folder-info">
      <svg class="folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="folder-name">${folder.name}</span>
      <span class="folder-stats">(${folder.totalFiles} 個檔案)</span>
    </div>
    <label class="toggle small">
      <input type="checkbox" class="folder-checkbox" data-path="${folder.path}" ${folder.selected ? 'checked' : ''}>
      <span class="slider"></span>
    </label>
  </div>`;
  
  // 如果有子資料夾，加入子資料夾區塊
  if (Object.keys(folder.children).length > 0 || folder.files.length > 0) {
    html += `<div class="folder-children ${level === 1 ? 'show' : ''}">`;
    
    // 處理子資料夾
    for (const childName in folder.children) {
      html += generateFolderTreeHTML(folder.children[childName], level + 1);
    }
    
    // 如果有檔案且檔案數量不多，顯示檔案列表
    if (folder.files.length > 0 && folder.files.length <= 5) {
      folder.files.forEach(file => {
        html += `<div class="folder-item file-item" data-level="${level + 1}">
          <span class="folder-toggle" style="visibility: hidden;"></span>
          <div class="folder-info">
            <svg class="folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span class="folder-name">${file.name}</span>
            <span class="folder-stats">(${file.formattedSize})</span>
          </div>
        </div>`;
      });
    } else if (folder.files.length > 5) {
      html += `<div class="folder-item file-summary" data-level="${level + 1}">
        <span class="folder-toggle" style="visibility: hidden;"></span>
        <div class="folder-info">
          <svg class="folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="M12 8v8"></path>
            <path d="M8 12h8"></path>
          </svg>
          <span class="folder-name">${folder.files.length} 個檔案</span>
        </div>
      </div>`;
    }
    
    html += `</div>`;
  }
  
  return html;
}

// 切換資料夾展開/收合
function toggleFolder(toggleElement) {
  const folderItem = toggleElement.closest('.folder-item');
  const childrenContainer = folderItem.nextElementSibling;
  
  if (childrenContainer && childrenContainer.classList.contains('folder-children')) {
    childrenContainer.classList.toggle('show');
    
    // 旋轉箭頭圖示
    const svgElement = toggleElement.querySelector('svg');
    if (childrenContainer.classList.contains('show')) {
      svgElement.style.transform = 'rotate(90deg)';
    } else {
      svgElement.style.transform = 'rotate(0deg)';
    }
  }
}

// 設置資料夾展開/收合事件
function setupFolderToggleEvents() {
  // 添加資料夾選擇事件
  document.querySelectorAll('.folder-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const path = this.dataset.path;
      const isChecked = this.checked;
      
      // 更新資料夾結構中的選擇狀態
      updateFolderSelection(path, isChecked);
      
      // 更新子資料夾的勾選狀態
      const childCheckboxes = document.querySelectorAll(`.folder-checkbox[data-path^="${path}/"]`);
      childCheckboxes.forEach(child => {
        child.checked = isChecked;
        updateFolderSelection(child.dataset.path, isChecked);
      });
      
      // 更新選擇計數
      updateSelectedFilesCount();
    });
  });
}

// 更新資料夾選擇狀態
function updateFolderSelection(path, isSelected) {
  const modal = document.getElementById("folderSelectionModal");
  if (!modal._folderAnalysis) return;
  
  const { rootFolder } = modal._folderAnalysis;
  
  // 如果是根路徑
  if (path === "") {
    rootFolder.selected = isSelected;
    return;
  }
  
  // 否則尋找對應的資料夾
  const pathParts = path.split("/");
  let currentFolder = rootFolder;
  
  for (const part of pathParts) {
    if (currentFolder.children[part]) {
      currentFolder = currentFolder.children[part];
    } else {
      return; // 找不到資料夾
    }
  }
  
  currentFolder.selected = isSelected;
}

// 更新已選擇的檔案數量
function updateSelectedFilesCount() {
  const modal = document.getElementById("folderSelectionModal");
  if (!modal || !modal._folderAnalysis) return;
  
  const { rootFolder } = modal._folderAnalysis;
  
  // 計算所有被選擇的檔案數量
  let selectedCount = 0;
  
  function countSelectedFiles(folder) {
    if (folder.selected) {
      // 如果資料夾被選擇，計算本資料夾的檔案
      selectedCount += folder.files.length;
      
      // 計算所有被選擇的子資料夾
      for (const childName in folder.children) {
        if (folder.children[childName].selected) {
          countSelectedFiles(folder.children[childName]);
        }
      }
    }
  }
  
  countSelectedFiles(rootFolder);
  document.getElementById("selectedFilesCount").textContent = selectedCount;
}

// 處理選定的文件夹
function processSelectedFolders() {
  const modal = document.getElementById("folderSelectionModal");
  if (!modal._folderAnalysis) return;
  
  const { rootFolder, gitignoreRules, fileList } = modal._folderAnalysis;
  
  // 將所選擇的檔案畫出來
  const selectedFiles = [];
  
  function collectSelectedFiles(folder) {
    if (folder.selected) {
      for (const file of folder.files) {
        selectedFiles.push(file.originalFile);
      }
      
      for (const childName in folder.children) {
        const childFolder = folder.children[childName];
        if (childFolder.selected) {
          collectSelectedFiles(childFolder);
        }
      }
    }
  }
  
  collectSelectedFiles(rootFolder);
  
  if (selectedFiles.length === 0) {
    showModal("未選擇檔案", "請至少選擇一個資料夾或檔案。", [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
    return;
  }
  
  hideFolderSelectionModal();
  showLoadingToast(`正在處理 ${selectedFiles.length} 個選擇的檔案...`);
  
  // 處理選擇的檔案
  processFilesInParallel(selectedFiles, gitignoreRules).then(results => {
    files = results.loaded;
    updateUI();
    hideLoadingToast();
    
    // 處理過濾結果訊息
    let filterMessage = [];
    
    // gitignore 過濾的檔案
    if (results.ignored.length > 0) {
      const ignoredFilesHTML = `
        <div class="results-category">
          <div class="results-category-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            .gitignore 已過濾了 ${results.ignored.length} 個檔案：
          </div>
          <ul class="results-files">
            ${results.ignored.slice(0, 5).map(file => `<li>${file}</li>`).join('')}
            ${results.ignored.length > 5 ? `<li>... 以及其他 ${results.ignored.length - 5} 個檔案</li>` : ''}
          </ul>
        </div>
      `;
      filterMessage.push(ignoredFilesHTML);
    }
    
    // 系統安全過濾的檔案
    const securityFilteredCount = results.sensitive.length + results.blocked.length;
    if (securityFilteredCount > 0) {
      const securityFilesHTML = `
        <div class="results-category">
          <div class="results-category-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            安全原因已過濾了 ${securityFilteredCount} 個檔案：
          </div>
          <ul class="results-files">
            ${[...results.sensitive, ...results.blocked].slice(0, 5).map(file => `<li>${file}</li>`).join('')}
            ${securityFilteredCount > 5 ? `<li>... 以及其他 ${securityFilteredCount - 5} 個檔案</li>` : ''}
          </ul>
        </div>
      `;
      filterMessage.push(securityFilesHTML);
    }
    
    // 顯示過濾訊息對話框
    if (filterMessage.length > 0) {
      showModal(
        "已過濾部分檔案", 
        `<div class="results-list">${filterMessage.join('')}</div>`, 
        [{ text: "知道了", onClick: "hideModal()", primary: true }]
      );
    } else {
      showToast(`已成功讀取 ${results.loaded.length} 個檔案`);
    }
  }).catch(err => {
    console.error("處理檔案錯誤:", err);
    hideLoadingToast();
    showModal("處理錯誤", `處理檔案時發生錯誤: ${err.message}`, [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
  });
}
