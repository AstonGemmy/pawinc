  self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('paw_cache').then(function(cache) {
     return cache.addAll([
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
     ]);
   })
 );
});

/*self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          return true;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
*/

/*self.addEventListener('fetch', function(event) {
 //console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});
*/

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('paw_cache').then(function(cache) {
      return fetch(event.request).then(function(response) {
        /*if (paw_cache.indexOf(response) == -1) {
             paw_cache.delete(response);
        }*/
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});
