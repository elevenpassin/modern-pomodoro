if (importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
}



if (workbox) {
  workbox.routing.registerRoute(
    new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'fonts-cache',
    }),
  );

  workbox.routing.registerRoute(
    '/modern-pomodoro/',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
    })
  );

  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    new workbox.strategies.NetworkFirst({
      // Use a custom cache name
      cacheName: 'css-cache',
    })
  );

  workbox.routing.registerRoute(
    // Cache JS/JSON files
    /.*\.(js)/,
    // Use cache but update in background ASAP
    new workbox.strategies.NetworkFirst({
      cacheName: 'scripts-cache',
    })
  )
}