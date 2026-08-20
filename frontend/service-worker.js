// Service Worker pour Paroisse Saint-Benoît
const CACHE_NAME = 'saint-benoit-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/actualites.html',
  '/mouvements.html',
  '/apropos.html',
  '/contact.html',
  '/css/style.css',
  '/js/script.js'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  self.skipWaiting(); // Forcer l'activation immédiate de la nouvelle version
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url).catch(err => console.warn('Cache ignoré pour:', url, err.message)))
      );
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  const url = event.request.url;

  // Ignorer ABSOLUMENT toutes les requêtes non-HTTP/HTTPS (extensions chrome-extension://, etc.)
  // et ignorer les requêtes vers l'API et l'espace admin
  if (
    event.request.method !== 'GET' ||
    (!url.startsWith('http://') && !url.startsWith('https://')) ||
    url.includes('/api/') ||
    url.includes('/admin')
  ) {
    return; // Laisser le réseau gérer sans mise en cache
  }

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        if (event.request.url.startsWith('http://') || event.request.url.startsWith('https://')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }

        return networkResponse;
      }).catch(function(err) {
        return cachedResponse;
      });
    })
  );
});
