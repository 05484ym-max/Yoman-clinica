// ✏️ Service Worker פשוט - שומר עותק של הדף במטמון, כדי שהיומן יעבוד גם בלי אינטרנט
// ושהדפדפן יאפשר "התקנה כאפליקציה". אין צורך לגעת בקובץ הזה בדרך כלל.

const CACHE_NAME = 'clinic-journal-v1';
const FILES_TO_CACHE = [
  './journal.html',
  './journal-manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
