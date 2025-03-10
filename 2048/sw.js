self.addEventListener("install", (event) => {
  console.log("Service Worker 安裝中...");
});
self.addEventListener("activate", (event) => {
  console.log("Service Worker 啟動！");
});
self.addEventListener("fetch", (event) => {
  // 可在此加入離線快取邏輯
});
