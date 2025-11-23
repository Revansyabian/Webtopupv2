// sw.js - Service Worker untuk Push Notification
self.addEventListener('install', function(event) {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activated');
    return self.clients.claim();
});

// Handle Push Notification
self.addEventListener('push', function(event) {
    console.log('Push event received');
    
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'Notifikasi dari Top Up BUSSID',
        icon: data.icon || 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
        badge: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
        image: data.image,
        data: {
            url: data.url || 'https://topupbussid.web.id'
        },
        actions: [
            {
                action: 'open',
                title: 'Buka Website'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ],
        tag: data.tag || 'bussid-notification',
        requireInteraction: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Top Up BUSSID', options)
    );
});

// Handle Klik Notification
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked');
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else if (event.action === 'close') {
        // Do nothing
    } else {
        // Default action ketika notification diklik
        event.waitUntil(
            clients.openWindow(event.notification.data.url || 'https://topupbussid.web.id')
        );
    }
});

// Handle Notification Close
self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed');
});