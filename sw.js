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
    /\.(?:js|css|json)$/,
    workbox.strategies.cacheFirst()
  ); 
}