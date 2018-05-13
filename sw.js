importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  workbox.routing.registerRoute(
    new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst(),
  );
  
  workbox.routing.registerRoute(
    new RegExp('^https://cdn\.glitch\.com/.*'),
    workbox.strategies.cacheFirst(),
  );
  
  workbox.routing.registerRoute(
    '/',
    workbox.strategies.cacheFirst()
  );
  
  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.cacheFirst({
      // Use a custom cache name
      cacheName: 'css-cache',
    })
  );
  
  webpack.routing.registerRoute(
    // Cache JS/JSON files
    /.*\.(js|json)/,
    // Use cache but update in background ASAP
    workbox.strategies.cacheFirst({
      cacheName: 'scripts-cache',
    })
  )
}