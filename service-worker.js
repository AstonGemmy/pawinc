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

  const cache_name = "paw-cache-v1";

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(cache_name).then(function(cache) {
     return cache.addAll(allowed_cache);
   })
 );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');
  const new_cache_name = [cache_name];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (new_cache_name.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
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
