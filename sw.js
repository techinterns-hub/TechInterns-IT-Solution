// Service Worker for offline support and data synchronization
const CACHE_NAME = 'techinterns-v1';
const DATA_CACHE_NAME = 'techinterns-data-v1';

// Files to cache for offline support
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/courses.html',
    '/internships.html',
    '/about.html',
    '/contact.html',
    '/css/style.css',
    '/css/enhanced-style.css',
    '/js/script.js',
    '/js/data.js',
    '/js/data-sync.js',
    '/js/cache-buster.js'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, update data cache
self.addEventListener('fetch', (event) => {
    // Handle data.json requests specially
    if (event.request.url.includes('data.json')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(event.request)
                        .then((response) => {
                            // If we got a valid response, update the cache
                            if (response.status === 200) {
                                cache.put(event.request, response.clone());
                            }
                            return response;
                        })
                        .catch(() => {
                            // If network fails, try to serve from cache
                            return cache.match(event.request);
                        });
                })
        );
        return;
    }

    // Handle other requests
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Listen for messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(DATA_CACHE_NAME);
        event.ports[0].postMessage({ success: true });
    }
});