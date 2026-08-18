// ✏️ Service Worker - גרסה מתוקנת (network-first): תמיד מנסה קודם להביא את הגרסה
// העדכנית מהאינטרנט. משתמש בגרסה השמורה (cache) רק אם אין בכלל אינטרנט.
// זה מונע את הבעיה שבה עדכונים לא מגיעים גם אחרי רענון קשיח.

const CACHE_NAME = 'clinic-journal-v6'; // ✏️ כל פעם שמעדכנים באמת את journal.html, כדאי להעלות את המספר כאן ב-1
const FILES_TO_CACHE = [
  './journal.html',
  './journal-manifest.json',
  './icon-192.png?v=3',
  './icon-512.png?v=3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // ✏️ גורם לגרסה החדשה של ה-Service Worker "לתפוס פיקוד" מיד, בלי לחכות שכל הטאבים ייסגרו
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
    // ✏️ קודם מנסים רשת (הגרסה העדכנית באמת) - רק אם זה נכשל (אין אינטרנט), נופלים חזרה לעותק השמור
    fetch(event.request)
      .then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
