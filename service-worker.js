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

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (caches.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
