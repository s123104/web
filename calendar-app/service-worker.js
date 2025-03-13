// 台灣行事曆應用 Service Worker
const CACHE_NAME = "taiwan-calendar-app-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/holiday-styles.css",
  "./js/app.js",
  "./js/taiwan-holidays.js",
  "https://cdn.jsdelivr.net/npm/dayjs",
  "https://cdn.jsdelivr.net/npm/dexie",
  "https://unpkg.com/@phosphor-icons/web/css/regular.css",
];

// 安裝 Service Worker 並緩存資源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("已打開快取");
      return cache.addAll(urlsToCache);
    })
  );
});

// 攔截請求並從快取提供資源
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果在快取中找到了回應，則返回該回應
      if (response) {
        return response;
      }

      // 否則發送網絡請求
      return fetch(event.request).then((response) => {
        // 如果請求失敗，則直接返回
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // 複製回應，因為回應流只能使用一次
        const responseToCache = response.clone();

        // 將新回應添加到快取
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// 當安裝新版本時，清除舊快取
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
