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
    console.log('Push event received', event);
    
    if (!event.data) {
        console.log('No data in push event');
        return;
    }
    
    let data;
    try {
        data = event.data.json();
        console.log('Push data:', data);
    } catch (error) {
        console.log('Error parsing push data:', error);
        // Fallback untuk data plain text
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
        requireInteraction: true,
        vibrate: [200, 100, 200]
    };

    console.log('Showing notification with options:', options);

    event.waitUntil(
        self.registration.showNotification(data.title || 'Top Up BUSSID', options)
            .then(() => console.log('Notification shown successfully'))
            .catch(error => console.error('Error showing notification:', error))
    );
});

// Handle Klik Notification
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked', event);
    event.notification.close();

    let url = event.notification.data.url || '/';
    
    // Ensure URL is absolute
    if (!url.startsWith('http')) {
        url = self.location.origin + url;
    }

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(url)
                .then(() => console.log('Opened URL:', url))
                .catch(error => console.error('Error opening URL:', error))
        );
    } else if (event.action === 'close') {
        console.log('Notification closed by user');
    } else {
        // Default action ketika notification diklik
        event.waitUntil(
            clients.openWindow(url)
                .then(() => console.log('Opened URL (default):', url))
                .catch(error => console.error('Error opening URL (default):', error))
        );
    }
});

// Handle Notification Close
self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed', event);
});

// Background Sync untuk mengirim subscription ke server
self.addEventListener('sync', function(event) {
    console.log('Background sync:', event.tag);
    if (event.tag === 'send-subscription') {
        event.waitUntil(sendSubscriptionToServer());
    }
});

async function sendSubscriptionToServer() {
    try {
        const subscription = await self.registration.pushManager.getSubscription();
        if (subscription) {
            const response = await fetch('https://paneladmin-83c8a-default-rtdb.firebaseio.com/pushSubscriptions.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    keys: subscription.toJSON().keys,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('Subscription saved to Firebase via background sync');
            }
        }
    } catch (error) {
        console.error('Error in background sync:', error);
    }
}