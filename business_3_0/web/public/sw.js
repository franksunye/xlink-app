/* v0.1 Business 3.0 web: network-only SW. Do NOT add precache/runtime caching for /api/*. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request, {
        cache: "no-store",
        credentials: event.request.credentials,
      })
    );
    return;
  }
  event.respondWith(fetch(event.request));
});
