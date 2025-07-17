self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1.0').then((cache) => {
      return cache.addAll([
        'index.html',
        'css/style.css',
        'css/detail.css',
        'js/bg.js',
        'js/detail.js'
      ]);
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
