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

/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cache_name).then(async function(cache) {
      const response = await fetch(event.request);
      // if (!cache.match(event.request.url)) {
      //     cache.add(event.request.url);
      // }
      caches.delete(cache_name);
      cache.put(event.request, response.clone());
      return response;
    })
  );
});*/

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        console.log("This is the response" + response);
        console.log("Fetch event to " + event.request);
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(cache_name)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
