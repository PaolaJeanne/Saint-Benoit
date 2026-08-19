// Service Worker pour Paroisse Saint-Benoît
const CACHE_NAME = 'saint-benoit-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/actualites.html',
  '/mouvements.html',
  '/apropos.html',
  '/contact.html',
  '/404.html',
  '/css/style.css',
  '/js/script.js',
  '/manifest.json',
  '/img/favicon.ico',
  '/img/icon.svg',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/og-image.jpg',
  '/img/OIP.webp'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
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
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourner la ressource du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request).then(
          function(response) {
            // Vérifier si la réponse est valide
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});