import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

// Übernehme sofort die Kontrolle über die Seite
self.skipWaiting();
clientsClaim();

// Präzisiere und route die Ressourcen
precacheAndRoute(self.__WB_MANIFEST);

// Bereinige veraltete Caches
cleanupOutdatedCaches();

// Fallback für Navigationsanfragen
// if (process.env.MODE !== 'ssr' || process.env.PROD) {
//   registerRoute(
//     new NavigationRoute(
//       createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
//       { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
//     )
//   );
// }


// Listener für eingehende Push-Benachrichtigungen
self.addEventListener('push', function(event) {
  console.log('event :>> ', event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Fehler beim Parsen der Push-Daten:', e);
    }
  }

  const title = data.title || 'Benachrichtigung';
  const options = {
    body: data.body || 'Sie haben eine neue Nachricht.',
    icon: data.icon || 'icons/icon-128x128.png',
    image: data.icon || 'icons/icon-128x128.png',
    badge: data.badge || 'icons/icon-128x128.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listener für Klicks auf Benachrichtigungen
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});