/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
const SW_VERSION = "etb-v6.1.0";
const APP_VERSION = "6.1.0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./app.webmanifest",
  "./fx.worker.js",
  "./icons/pwa.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SW_VERSION);
      try {
        await cache.addAll(APP_SHELL);
      } catch (_) {
        /* 忽略個別加載失敗 */
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k !== SW_VERSION ? caches.delete(k) : null))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: APP_VERSION });
  }
});

// 僅處理 http/https GET，且以 same-origin 採 SWR；避免快取 chrome-extension 等非支援 scheme
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 只處理 http/https
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // 只處理 GET
  if (req.method !== "GET") return;

  // 規範陷阱：only-if-cached + 非同源
  if (req.cache === "only-if-cached" && req.mode !== "same-origin") return;

  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SW_VERSION);
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              cache.put(req, res.clone()).catch(() => {});
            }
            return res;
          })
          .catch(() => null);

        return (
          cached ||
          fetchPromise ||
          new Response("離線中", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        );
      })()
    );
  } else {
    // 外部資源：直接網路（避免把外掛資源塞進快取）
    event.respondWith(
      fetch(req).catch(
        () => new Response("離線中（外部資源）", { status: 503 })
      )
    );
  }
});
