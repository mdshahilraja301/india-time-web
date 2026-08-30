const CACHE_NAME = "india-time-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",

    // CSS
    "./css/style.css",
    "./css/timer.css",
    "./css/alarm.css",
    "./css/offline.css",
    "./css/offline-timer.css",
    "./css/offline-alarm.css",

    // Main JS
    "./js/app.js",

    // Time
    "./js/time/timeService.js",
    "./js/time/systemTime.js",

    // Timer
    "./js/timer/timer.js",

    // Alarm
    "./js/alarm/alarm.js",

    // Mode
    "./js/mode/modeManager.js",

    // Offline
    "./js/offline/offline-storage.js",
    "./js/offline/offline-timer.js",
    "./js/offline/offline-alarm.js",
    "./js/offline/offline-alarm-engine.js",

    // Pages
    "./pages/timer.html",
    "./pages/alarm.html",
    "./offline.html",
    "./offline/offline-timer.html",
    "./offline/offline-alarm.html",

    // PWA icons
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// ================================
// INSTALL
// ================================

self.addEventListener("install", event => {

    console.log("India Time SW: Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(APP_FILES);

            })
            .then(() => {

                console.log("India Time SW: Files cached");

                return self.skipWaiting();

            })

    );

});


// ================================
// ACTIVATE
// ================================

self.addEventListener("activate", event => {

    console.log("India Time SW: Activated");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


// ================================
// FETCH
// ================================

self.addEventListener("fetch", event => {

    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(request)
            .then(response => {

                // Save successful response in cache
                const responseClone = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(request, responseClone);

                    });

                return response;

            })
            .catch(() => {

                // Internet unavailable
                return caches.match(request)
                    .then(cachedResponse => {

                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // If navigation request has no cached page,
                        // show offline page
                        if (request.mode === "navigate") {

                            return caches.match(
                                "./offline.html"
                            );

                        }

                    });

            })

    );

});