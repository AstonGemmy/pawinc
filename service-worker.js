  const allowed_cache = [
       '/',
       '/index.html',
       '/admin_poral.html',
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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('paw_cache').then(function(cache) {
      return fetch(event.request).then(function(response) {
        if (!cache.match(event.request.url)) {
            cache.add(event.request.url);
            alert(event.request.url);
        }
        //cache.put(event.request.url, response.clone());
        return response;
      });
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
