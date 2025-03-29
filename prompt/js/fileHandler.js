/**
 * 檔案處理相關函數
 */

// 文件類型定義
const textExtensions = [
  "js",
  "py",
  "java",
  "cpp",
  "html",
  "css",
  "jsx",
  "ts",
  "tsx",
  "php",
  "blade.php",
  "json",
  "md",
  "txt",
  "csv",
  "xml",
  "yml",
  "yaml",
  "sql",
  "conf",
  "ini",
  "log",
  "sh",
  "bat",
  "cfg",
  "scss",
  "sass",
  "less",
  "vue",
  "dockerfile",
  "env",
];

const binaryExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "ico",
  "pdf",
  "zip",
  "rar",
  "7z",
  "exe",
  "dll",
  "bin",
];

// 經過調整的敏感檔案類型，移除模糊匹配
const SENSITIVE_EXTENSIONS = [
  "pem",
  "key",
  "crt",
  "p12",
  "pfx",
  "keystore",
  "jks",
  "p8",
  "der",
  "csr",
  "pkcs12",
];

// 經過調整的敏感檔案名稱，使用更精確匹配
const SENSITIVE_FILENAMES = [
  "id_rsa",
  "id_dsa",
  "authorized_keys",
  "known_hosts",
  "ssh_config",
  "private-key",
  "tls.key",
  "client-key.pem",
  "server.key",
  "ca.key",
];

const CONFIG_EXTENSIONS = [
  "yml",
  "yaml",
  "conf",
  "cfg",
  "ini",
  "config",
  "properties",
];

const SCRIPT_EXTENSIONS = ["sh", "bash", "ps1", "bat", "cmd", "powershell"];

const LOG_EXTENSIONS = ["log", "logs", "syslog"];

const BLOCKED_EXTENSIONS = [
  "htpasswd",
  "htaccess",
  "ssh",
  "ppk",
  "keychain",
  "secret",
  "credentials",
  "aws",
  "env",
  "npmrc",
  "netrc",
  "pgpass",
];

// 處理檔案
async function handleFiles(fileList) {
  // 分析資料夾結構
  const folderAnalysis = await analyzeFolderStructure(fileList);

  // 顯示資料夾選擇對話框
  showFolderSelectionModal(folderAnalysis);
}

// 並行處理檔案
async function processFilesInParallel(fileList, gitignoreRules) {
  const MAX_PARALLEL = 5;
  let currentIndex = 0;
  const results = {
    loaded: [],
    ignored: [], // gitignore 過濾的檔案
    blocked: [], // 安全原因被阻擋的檔案
    sensitive: [], // 敞感檔案
    large: [], // 大檔案
    errors: [], // 讀取錯誤的檔案
  };
  const filesArray = Array.from(fileList);

  updateLoadingToast(`準備處理 ${filesArray.length} 個檔案...`);

  const worker = async () => {
    while (currentIndex < filesArray.length) {
      const index = currentIndex++;
      const file = filesArray[index];

      // 顯示進度
      if (index % 10 === 0) {
        updateLoadingToast(`處理檔案 ${index + 1}/${filesArray.length}...`);
      }

      if (!file.type && file.size === 0) {
        console.warn(`跳過非檔案項目：${file.name}`);
        continue;
      }

      const filePath = file.webkitRelativePath || file.name;
      const fileName = file.name.toLowerCase();
      const ext = fileName.split(".").pop();

      // gitignore 檢查放在最前面
      if (gitignoreRules && isFileIgnored(filePath, gitignoreRules)) {
        results.ignored.push(file.name);
        continue;
      }

      // 敏感檔案檢查 - 改進後的檢查邏輯
      let isSensitive = false;
      // 檢查副檔名
      if (SENSITIVE_EXTENSIONS.includes(ext)) {
        isSensitive = true;
      }

      // 檢查敏感檔名
      for (const sensitiveName of SENSITIVE_FILENAMES) {
        if (
          fileName === sensitiveName ||
          fileName.includes(sensitiveName + ".")
        ) {
          isSensitive = true;
          break;
        }
      }

      // 憑證相關腳本處理的安全清單
      const safeScriptFiles = [
        "backup-certs.ps1",
        "backup-certs.sh",
        "backup-cert.ps1",
        "backup-cert.sh",
        "generate-certs.ps1",
        "generate-certs.sh",
        "generate-cert.ps1",
        "generate-cert.sh",
        "deploy-certs.ps1",
        "deploy-certs.sh",
        "install-certs.ps1",
        "install-certs.sh",
        "renew-certs.ps1",
        "renew-certs.sh",
        "update-certs.ps1",
        "update-certs.sh",
      ];

      const safeOperations = [
        "backup",
        "generate",
        "deploy",
        "install",
        "renew",
        "update",
        "create",
        "setup",
      ];
      const safeCertPatterns = [
        "cert",
        "certs",
        "certificate",
        "certificates",
        "ssl",
        "tls",
      ];
      const safeExtensions = [".ps1", ".sh", ".cmd", ".bat", ".js"];

      if (isSensitive) {
        // 1. 精確比對安全腳本檔案列表
        if (safeScriptFiles.includes(fileName)) {
          isSensitive = false;
        }
        // 2. 模式比對 - 操作+對象+副檔名
        else {
          // 取得檔案名無副檔名部分
          let fileNameWithoutExt = fileName;
          let fileExt = "";

          for (const ext of safeExtensions) {
            if (fileName.endsWith(ext)) {
              fileNameWithoutExt = fileName.slice(0, -ext.length);
              fileExt = ext;
              break;
            }
          }

          // 檢查檔案名是否為「安全操作-憑證相關」的格式
          if (fileExt) {
            // 確保有支援的副檔名
            for (const op of safeOperations) {
              if (fileNameWithoutExt.startsWith(op + "-")) {
                const restOfName = fileNameWithoutExt.substring(op.length + 1);

                for (const pattern of safeCertPatterns) {
                  if (restOfName.includes(pattern)) {
                    isSensitive = false;
                    break;
                  }
                }

                if (!isSensitive) break;
              }
            }
          }
        }
      }

      if (isSensitive) {
        results.sensitive.push(file.name);
        continue;
      }

      // 環境變數檔案檢查
      if (
        fileName === ".env" ||
        (fileName.endsWith(".env") &&
          !fileName.includes("example") &&
          !fileName.includes("sample") &&
          !fileName.includes("template"))
      ) {
        results.blocked.push(file.name);
        continue;
      }

      // 大檔案檢查
      if (isLargeFile(file.size)) {
        results.large.push({
          name: file.name,
          path: filePath,
          size: formatFileSize(file.size),
        });
        continue;
      }

      // 處理合法檔案
      try {
        const { content, type } = await readFileContent(file);
        let category = "general";
        if (CONFIG_EXTENSIONS.includes(ext)) category = "config";
        else if (SCRIPT_EXTENSIONS.includes(ext)) category = "script";
        else if (LOG_EXTENSIONS.includes(ext)) category = "log";

        results.loaded.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          path: filePath,
          content,
          type,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          category,
          extension: ext,
          selected: true,
        });
      } catch (err) {
        console.error(`讀取檔案失敗: ${file.name}`, err);
        results.errors.push(file.name);
      }
    }
  };

  const workers = [];
  for (let i = 0; i < Math.min(MAX_PARALLEL, filesArray.length); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  updateLoadingToast(`處理完成，載入了 ${results.loaded.length} 個檔案`);
  return results;
}

// 讀取檔案內容
function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const ext = file.name.split(".").pop().toLowerCase();
    let typeCategory = "binary";

    if (textExtensions.includes(ext)) {
      typeCategory = "text";
    } else if (binaryExtensions.includes(ext)) {
      typeCategory = "binary";
    }

    if (typeCategory === "text") {
      reader.onload = (e) =>
        resolve({ content: e.target.result, type: "text" });
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      reader.onload = (e) =>
        resolve({ content: e.target.result, type: "binary" });
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    }
  });
}

// 判斷檔案是否為大檔案
function isLargeFile(fileSize) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  return fileSize > MAX_FILE_SIZE;
}

// 檢查檔案是否被 gitignore 忽略
function isFileIgnored(filePath, gitignoreRules) {
  // 基本的 gitignore 規則檢查實作
  for (const rule of gitignoreRules) {
    // 簡易的路徑匹配檢查
    if (rule.startsWith("*")) {
      const pattern = rule.substring(1);
      if (filePath.endsWith(pattern)) {
        return true;
      }
    } else if (rule.endsWith("*")) {
      const pattern = rule.substring(0, rule.length - 1);
      if (filePath.startsWith(pattern)) {
        return true;
      }
    } else if (rule.includes("*")) {
      // 處理中間有 * 的情況
      const parts = rule.split("*");
      let match = true;
      let restPath = filePath;

      for (const part of parts) {
        if (!part) continue; // 空字串跳過

        const index = restPath.indexOf(part);
        if (index === -1) {
          match = false;
          break;
        }

        restPath = restPath.substring(index + part.length);
      }

      if (match) return true;
    } else if (filePath === rule || filePath.includes("/" + rule)) {
      return true;
    }
  }

  return false;
}

// 解析 .gitignore 檔案
async function parseGitignore(content) {
  const lines = content.split("\n");
  const rules = [];

  for (let line of lines) {
    // 移除註解和空行
    line = line.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    // 移除前導的 !（排除規則），目前我們不處理這種情況
    if (line.startsWith("!")) {
      continue;
    }

    // 移除前導的 /
    if (line.startsWith("/")) {
      line = line.substring(1);
    }

    // 加入有效規則
    rules.push(line);
  }

  return rules;
}

// 格式化檔案大小
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

// 刪除檔案
function deleteFile(id) {
  files = files.filter((file) => file.id !== id);
  updateUI();
}

// 下載單個檔案
function downloadFile(id) {
  const file = files.find((f) => f.id === id);
  if (!file) {
    showModal("下載失敗", "找不到該檔案。", [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
    return;
  }

  let blob;
  if (file.type === "text") {
    blob = new Blob([file.content], { type: "text/plain" });
  } else {
    blob = new Blob([file.content]);
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);

  showToast(`已下載：${file.name}`);
}

// 下載所有選取檔案
async function downloadAllFiles() {
  const selectedFiles = files.filter((f) => f.selected);
  if (selectedFiles.length === 0) {
    showToast("沒有已選取的檔案可供下載");
    return;
  }

  if (typeof JSZip === "undefined") {
    showModal("下載失敗", "JSZip 未正確載入，無法壓縮檔案。", [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
    return;
  }

  showLoadingToast("準備下載中...");
  const zip = new JSZip();

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    updateLoadingToast(
      `處理檔案 ${i + 1}/${selectedFiles.length}: ${file.name}`
    );
    if (file.type === "text") {
      zip.file(file.path, file.content);
    } else {
      zip.file(file.path, file.content, { binary: true });
    }
  }

  updateLoadingToast("正在生成壓縮檔...");
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "selected_files.zip";
  a.click();
  URL.revokeObjectURL(url);

  hideLoadingToast();
  showToast(`已下載 ${selectedFiles.length} 個選取的檔案`);
}

// 依照需求排序檔案 (.md 最前、.env.example、.yml、conf、Dockerfile 之類...)
function sortFilesByCustomOrder(filesArr) {
  // 設計一個排序優先序
  const priorityMap = {
    readme_md: -1, // 最優先：README.md 文檔
    md: 0, // 其他 md 文檔
    env_example: 1, // 環境設定範例
    yml_yaml: 2, // 設定檔
    conf: 3, // 配置文件
    dockerfile: 4, // Docker 相關文件
    package_json: 5, // npm 套件設定
    gitignore: 6, // Git 設定
    config: 7, // 其他配置檔案
    other: 9999, // 其他檔案
  };

  // 評估檔案優先級的函數
  const getPriority = (file) => {
    const ext = file.extension;
    const lowerName = file.name.toLowerCase();

    // 特別處理 README.md 檔案（不分大小寫）
    if (lowerName === "readme.md" || lowerName.startsWith("readme."))
      return priorityMap.readme_md;

    if (ext === "md") return priorityMap.md;
    if (lowerName === ".env.example" || lowerName.includes(".env.example"))
      return priorityMap.env_example;
    if (ext === "yml" || ext === "yaml") return priorityMap.yml_yaml;
    if (ext === "conf" || ext === "config") return priorityMap.conf;
    if (lowerName === "dockerfile" || lowerName.includes("dockerfile"))
      return priorityMap.dockerfile;
    if (lowerName === "package.json") return priorityMap.package_json;
    if (lowerName === ".gitignore") return priorityMap.gitignore;
    if (file.category === "config") return priorityMap.config;

    return priorityMap.other;
  };

  return filesArr.slice().sort((a, b) => {
    // 先依照優先級排序
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // 數字比較
    }

    // 如果優先級相同，就依名稱字母順序排序
    return a.name.localeCompare(b.name);
  });
}
