const CACHE_NAME = 'tdwa-cache-v7';
const ASSETS_TO_CACHE = [
  '/',
  '/TDWA/index.html',
  '/TDWA/style.css',
  '/TDWA/main.js',
  // Add any additional assets you use (images, sounds, etc.)
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

