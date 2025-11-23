// push.js - Logic untuk Push Notification (Auto Request)
class PushNotificationManager {
    constructor() {
        // VAPID Public Key - Ganti dengan key kamu
        this.vapidPublicKey = 'BLx1xJ3n7rH7eL2YQc7W6V5U4T3S2R1P0O9N8M7L6K5J4I3H2G1F0E1D2C3B4A5';
        this.isSubscribed = false;
        this.swRegistration = null;
        
        console.log('PushNotificationManager initialized');
        
        // Delay 3 detik biar user lihat website dulu
        setTimeout(() => {
            this.init();
        }, 3000);
    }

    async init() {
        try {
            console.log('Initializing push notification...');
            
            if (!this.checkBrowserSupport()) {
                console.log('Browser tidak support push notification');
                return;
            }

            await this.registerServiceWorker();
            await this.checkSubscription();
            
            // Auto request permission jika belum ada
            if (!this.isSubscribed) {
                await this.autoRequestPermission();
            }
            
        } catch (error) {
            console.error('Error initializing push notification:', error);
        }
    }

    checkBrowserSupport() {
        const isSupported = (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        );
        
        console.log('Browser support check:', isSupported);
        return isSupported;
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker registered successfully:', this.swRegistration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }

    async checkSubscription() {
        if (!this.swRegistration) return;

        try {
            const subscription = await this.swRegistration.pushManager.getSubscription();
            this.isSubscribed = !(subscription === null);
            
            console.log('Subscription status:', this.isSubscribed);
            
            if (this.isSubscribed) {
                console.log('User sudah subscribe push notification:', subscription);
                await this.sendSubscriptionToServer(subscription);
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }

    async autoRequestPermission() {
        try {
            console.log('Auto requesting notification permission...');
            
            // Cek dulu permission status
            if (Notification.permission === 'default') {
                console.log('Permission is default, requesting...');
                
                const permission = await Notification.requestPermission();
                console.log('Permission result:', permission);
                
                if (permission === 'granted') {
                    console.log('Permission granted, subscribing user...');
                    await this.subscribeUser();
                } else {
                    console.log('Permission denied:', permission);
                }
            } else if (Notification.permission === 'granted' && !this.isSubscribed) {
                console.log('Permission already granted, subscribing user...');
                await this.subscribeUser();
            } else {
                console.log('Permission status:', Notification.permission);
            }
            
        } catch (error) {
            console.error('Error in auto request permission:', error);
        }
    }

    async subscribeUser() {
        try {
            console.log('Subscribing user to push notifications...');
            
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
            });

            this.isSubscribed = true;
            console.log('User berhasil subscribe:', subscription);
            
            await this.sendSubscriptionToServer(subscription);
            
            // Show subtle success message
            this.showSubtleSuccess();
            
        } catch (error) {
            console.error('Failed to subscribe user:', error);
            
            if (error.name === 'NotAllowedError') {
                console.log('User denied permission');
            }
        }
    }

    async sendSubscriptionToServer(subscription) {
        try {
            // Simpan di localStorage dulu
            const subsData = {
                endpoint: subscription.endpoint,
                keys: subscription.toJSON().keys,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform
            };
            
            localStorage.setItem('pushSubscription', JSON.stringify(subsData));
            console.log('Subscription saved locally');
            
            // Juga simpan di Firebase
            await this.saveSubscriptionToFirebase(subsData);
            
        } catch (error) {
            console.error('Error saving subscription:', error);
            // Coba simpan ke localStorage saja
            try {
                localStorage.setItem('pushSubscription_backup', JSON.stringify({
                    endpoint: subscription.endpoint,
                    timestamp: new Date().toISOString()
                }));
            } catch (e) {
                console.error('Failed to backup subscription:', e);
            }
        }
    }

    async saveSubscriptionToFirebase(subscription) {
        try {
            console.log('Saving subscription to Firebase...');
            
            const response = await fetch('https://paneladmin-83c8a-default-rtdb.firebaseio.com/pushSubscriptions.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify(subscription)
            });
            
            console.log('Firebase response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Subscription saved to Firebase:', result);
                return true;
            } else {
                console.error('Failed to save to Firebase:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            return false;
        }
    }

    showSubtleSuccess() {
        console.log('Showing success message...');
        
        // Buat subtle notification di corner
        const successMsg = document.createElement('div');
        successMsg.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 12px 18px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-size: 14px;
                font-weight: 500;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #1e7e34;
                display: flex;
                align-items: center;
                gap: 8px;
                max-width: 300px;
            ">
                <span style="font-size: 16px;">🔔</span>
                <span>Notifikasi diaktifkan! Anda akan mendapatkan promo terbaru.</span>
            </div>
        `;
        
        document.body.appendChild(successMsg);
        
        // Auto remove setelah 4 detik
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (successMsg.parentNode) {
                        successMsg.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    urlBase64ToUint8Array(base64String) {
        try {
            // Clean the base64 string
            const cleanedBase64 = base64String
                .replace(/\-/g, '+')
                .replace(/_/g, '/');
            
            const padding = '='.repeat((4 - cleanedBase64.length % 4) % 4);
            const base64 = (cleanedBase64 + padding);
            
            const rawData = atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        } catch (error) {
            console.error('Error converting base64 to Uint8Array:', error);
            throw error;
        }
    }

    // Test notification (untuk development)
    async testLocalNotification() {
        if (this.isSubscribed && this.swRegistration) {
            try {
                await this.swRegistration.showNotification('Test Notifikasi Berhasil! 🎉', {
                    body: 'Push notification berhasil diaktifkan. Anda akan menerima promo terbaru dari Top Up BUSSID.',
                    icon: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                    badge: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                    image: 'https://i.postimg.cc/nrfSZWmP/file-00000000d29861f895e12e2a67d02858.png',
                    data: { url: window.location.href },
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
                    tag: 'test-notification',
                    requireInteraction: true,
                    vibrate: [200, 100, 200]
                });
                console.log('Test notification shown successfully');
            } catch (error) {
                console.error('Error showing test notification:', error);
            }
        } else {
            console.log('Cannot show test notification - not subscribed or no service worker');
        }
    }

    // Unsubscribe user (optional)
    async unsubscribeUser() {
        try {
            const subscription = await this.swRegistration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                this.isSubscribed = false;
                localStorage.removeItem('pushSubscription');
                console.log('User unsubscribed successfully');
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    }
}

// Initialize ketika DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing PushNotificationManager...');
    window.pushManager = new PushNotificationManager();
});

// CSS untuk animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-success {
        animation: slideInRight 0.3s ease !important;
    }
`;
document.head.appendChild(style);

// Export untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PushNotificationManager;
}