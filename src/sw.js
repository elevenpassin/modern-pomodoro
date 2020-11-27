
const KEY = 'modern-pomodoro-nov-2020';

self.addEventListener('message', (event) => {
  console.log(event.data.type)
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(KEY)
                .then( (cache) => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request).then((response) => {
          let responseClone = response.clone();
          caches.open(KEY).then((cache) => {
            cache.put(event.request, responseClone);
          });
  
          return response;
        })
      })
    );
  }
});

