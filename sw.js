const CACHE_NAME = 'simulador-viga-v2'; // Cambiado a v2 para invalidar el caché viejo
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js'
];

// Instalar el Service Worker y guardar archivos iniciales
self.addEventListener('install', e => {
  self.skipWaiting(); // Fuerza al nuevo Service Worker a activarse de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Limpiar cachés antiguas cuando se activa una nueva versión
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia: Buscar en la Red primero (Network First). Si falla (Offline), usar Caché
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Si la red responde bien, guardamos una copia en el caché y devolvemos la respuesta
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // Si no hay red (offline), servimos desde el caché
        return caches.match(e.request);
      })
  );
});
