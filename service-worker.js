const CACHE_NAME = 'tdwa-cache-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'main.js',
  'manifest.json',
  'service-worker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    }).catch(() => {
      // Fallback for navigation requests (prevents infinite reload)
      if (event.request.mode === 'navigate' || event.request.url.endsWith('.html')) {
        return caches.match('index.html');
      }
    })
  );
});
