
// web-first load
self.addEventListener('fetch', event => {
    if (!event.request.url.match(/(google)|(jquery)|(fonts)|(.jpg)/g)) {
        event.respondWith(
            fetch(event.request)
            .then(res => {
                // Check if we received a valid response
                if (!res || res.status !== 200 || res.type !=='basic') {
                    return res;
                }
            // cache response
                var responseToCache = res.clone();
                if (res.url.match(/.jpg$/g)) {
                    caches.open("images").then(cache => {
                    cache.put(event.request, responseToCache);
                    })
                }
                else {
                caches.open('mycache-v1').then(cache => {
                    cache.put(event.request, responseToCache); 
                })
                return res;
            }
            })
            .catch(() => {
                caches.match(event.request).then(response => {
                    if (response) {return response }
            })})
        )
    }
})