  const allowed_cache = [
       '/',
       '/index.html',
       '/admin_portal.html',
       '/Css/PAW.css',
       '/Css/PAW_responsive.css',
       '/Css/fonts.css',
       '/Css/animate.css',
       '/Css/all.css',
       '/Js/PAW.js',
       '/users.json'
     ];

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('paw_cache').then(function(cache) {
     return cache.addAll(allowed_cache);
   })
 );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('paw_cache').then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (allowed_cache.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
