importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  workbox.routing.registerRoute(
    new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.networkFirst({
      cacheName: 'fonts-cache',
    }),
  );

  workbox.routing.registerRoute(
    '/',
    workbox.strategies.networkFirst({
      cacheName: 'html-cache',
    })
  );

  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.networkFirst({
      // Use a custom cache name
      cacheName: 'css-cache',
    })
  );

  workbox.routing.registerRoute(
    // Cache JS/JSON files
    /.*\.(js)/,
    // Use cache but update in background ASAP
    workbox.strategies.networkFirst({
      cacheName: 'scripts-cache',
    })
  )
}