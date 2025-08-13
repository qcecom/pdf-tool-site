self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.wasm')) {
    event.respondWith(
      caches.open('wasm').then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const res = await fetch(event.request);
        cache.put(event.request, res.clone());
        return res;
      })
    );
  }
});
