const CACHE_NAME = 'simulador-viga-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js'
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Estrategia: Buscar en caché primero, si no hay, ir a la red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});