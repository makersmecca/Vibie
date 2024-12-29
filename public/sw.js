const OFFLINE_VER = "1.1.0";
const CACHE_NAME = "vbe" + OFFLINE_VER;
const OFFLINE_URL = "fallback.html";

const assets = [
  "/",
  "/index.html",
  "/static/js/main.bundle.js", // Your main React bundle
  "/manifest.json",
  "fallback.html",
  "android/android-launchericon-48-48.png",
  "android/android-launchericon-72-72.png",
  "android/android-launchericon-96-96.png",
  "android/android-launchericon-144-144.png",
  "android/android-launchericon-192-192.png",
  "android/android-launchericon-512-512.png",
  "ios/1024.png",
  "ios/512.png",
  "ios/256.png",
  "ios/192.png",
  "ios/144.png",
  "ios/72.png",
  "ios/32.png",
  "ios/16.png",
  "windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
  "windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
  "windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
  "windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
  "windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
  "windows11/SplashScreen.scale-100.png",
  "windows11/SplashScreen.scale-125.png",
  "windows11/SplashScreen.scale-150.png",
  "windows11/SplashScreen.scale-200.png",
  "windows11/SplashScreen.scale-400.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching offline assets");
        return cache.addAll(assets);
      })
      .catch((error) => console.error("Error caching assets", error))
  );
  self.skipWaiting();
});
// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});
// Fetch event: Serve cached assets, fallback to offline page on failure
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    //navigation requests
    event.respondWith(
      (async () => {
        try {
          // Network fetch
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.error("Network failed; returning offline page", error);
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(OFFLINE_URL);
        }
      })()
    );
  } else {
    //non-navigation requests
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
