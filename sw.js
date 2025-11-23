// sw.js - Service Worker FIXED
self.addEventListener('install', function(event) {
    console.log('🚀 Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('✅ Service Worker activated');
    event.waitUntil(self.clients.claim());
});

// Handle Push Notification dari server
self.addEventListener('push', function(event) {
    console.log('📩 Push event received', event);
    
    if (!event.data) {
        console.log('❌ No data in push event');
        return;
    }
    
    let data;
    try {
        data = event.data.json();
        console.log('📊 Push data:', data);
    } catch (error) {
        console.log('❌ Error parsing push data:', error);
        data = {
            title: 'Top Up BUSSID',
            body: event.data.text() || 'Notifikasi baru dari Top Up BUSSID'
        };
    }
    
    const options = {
        body: data.body || 'Notifikasi dari Top Up BUSSID',
        icon: data.icon || 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
        badge: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
        image: data.image,
        data: {
            url: data.url || '/'
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

    console.log('📨 Showing notification:', options);

    event.waitUntil(
        self.registration.showNotification(data.title || 'Top Up BUSSID', options)
    );
});

// Handle notifikasi yang dikirim dari client (browser)
self.addEventListener('message', function(event) {
    console.log('💬 Message received in SW:', event.data);
    
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon, image, url } = event.data;
        
        const options = {
            body: body || 'Notifikasi dari Top Up BUSSID',
            icon: icon || 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
            badge: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
            image: image,
            data: {
                url: url || '/'
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
            tag: 'client-notification',
            requireInteraction: true
        };

        console.log('📨 Showing client notification:', title, options);

        event.waitUntil(
            self.registration.showNotification(title || 'Top Up BUSSID', options)
        );
    }
});

// Handle Klik Notification
self.addEventListener('notificationclick', function(event) {
    console.log('🖱️ Notification clicked', event.notification);
    event.notification.close();

    const url = event.notification.data.url || '/';

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(url)
        );
    } else if (event.action === 'close') {
        console.log('Notification closed by user');
    } else {
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});