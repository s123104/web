/**
 * 主要應用程式檔案
 */

// 全域變數
let files = [];
let savedVersions = [];

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  setupDragAndDrop();
  setupFileInput();
  loadSavedVersions();
});

// 從 localStorage 載入已儲存的版本
function loadSavedVersions() {
  try {
    const savedData = localStorage.getItem("promptVersions");
    if (savedData) {
      savedVersions = JSON.parse(savedData);
      updateVersionsList();
    }
  } catch (err) {
    console.error("載入版本失敗:", err);
  }
}

// 儲存版本到 localStorage
function saveVersionsToStorage() {
  try {
    localStorage.setItem("promptVersions", JSON.stringify(savedVersions));
  } catch (err) {
    console.error("儲存版本失敗:", err);
  }
}

// 設置拖放功能
function setupDragAndDrop() {
  const dropZone = document.getElementById("dropZone");

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  });
}

// 設置文件輸入
function setupFileInput() {
  document.getElementById("fileInput").addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });
}

// 儲存版本
function saveVersion() {
  const versionName = document.getElementById("versionName").value.trim();
  if (!versionName) {
    showModal("儲存失敗", "請輸入版本名稱。", [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
    return;
  }

  const newVersion = {
    id: Math.random().toString(36).substr(2, 9),
    name: versionName,
    files: [...files],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  savedVersions.push(newVersion);
  document.getElementById("versionName").value = "";
  saveVersionsToStorage();
  updateVersionsList();
  showToast("版本已成功儲存");
}

// 載入版本
function loadVersion(id) {
  const version = savedVersions.find(v => v.id === id);
  if (!version) {
    showModal("載入失敗", "找不到該版本。", [
      { text: "確認", onClick: "hideModal()", primary: true },
    ]);
    return;
  }

  files = JSON.parse(JSON.stringify(version.files)); // 深拷貝
  updateUI();
  showToast(`已載入版本：${version.name}`);
}

// 刪除版本
function deleteVersion(id) {
  showModal("確認刪除", "確定要刪除此版本嗎？此操作無法還原。", [
    { text: "取消", onClick: "hideModal()", primary: false },
    { text: "確定刪除", onClick: `confirmDeleteVersion('${id}')`, primary: true },
  ]);
}

// 確認刪除版本
function confirmDeleteVersion(id) {
  savedVersions = savedVersions.filter(v => v.id !== id);
  saveVersionsToStorage();
  updateVersionsList();
  hideModal();
  showToast("版本已成功刪除");
}
