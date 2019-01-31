//First register service worker in app.js
const cacheName = 'NAME_OF_YOUR_PWA';

const staticAssets = [
    './',
    './app.js',
    './styles.css',
    './fallback.json',
    //All the assets that need to be cached.
];

self.addEventListener('install', async function() {
    const cache = await caches.open(cacheName);
    cache.addAll(staticAssets);
});



self.addEventListener('fetch', event => {
    const request = event.request;
    console.log(request);
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) {
    const dynamicCache = await caches.open('PWA-dynamic'); //Name of your dynamic cache
    try {
        const networkResponse = await fetch(request);
        dynamicCache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);
        return cachedResponse || await caches.match('./fallback.json');
    }
}