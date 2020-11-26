const cache = 'budget-tracker-v2'
const cacheFiles = [
    '/',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'index.html',
    'index.js',
    'manifest.webmanifest',
    'serviceWorker.js',
    'styles.css'
];

//service worker update
self.addEventListener('install', event => {
    console.log("hit install");
    event.waitUntil(
        caches
            .open(cache)
            .then(cache => {
                return cache.addAll(cacheFiles);
            })
            .catch(err => console.log('Error caching files on install: ', err))
    );
    self.skipWaiting();
});

//service worker new install
self.addEventListener('activate', event => {
    console.log("hit activate");
    event.waitUntil(
        caches
            .keys()
            .then(keyList => {
                //delete old file versions
                return Promise.all(
                    keyList.map(key => {
                        if (key !== cache) {
                            console.log('Deleting cache: ', key);
                            return caches.delete(key);
                        }
                    })
                )
            })
            .catch(err => console.log('Activation error: ', err))
    );
    self.clients.claim();
});