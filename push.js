// push.js - Logic untuk Push Notification
class PushNotificationManager {
    constructor() {
        this.vapidPublicKey = 'BNNABHyTxkB4XT2Je9yJ_0bDtRtf1jEXiQvuWqL0Q20k0RtMZTkyk3U54wu19JHCCCd8pZE0FtK1raFGR6fo9fQ'; // Ganti dengan VAPID public key kamu
        this.isSubscribed = false;
        this.swRegistration = null;
        
        this.init();
    }

    async init() {
        try {
            // Cek browser support
            if (!this.checkBrowserSupport()) {
                console.log('Browser tidak support push notification');
                return;
            }

            // Register Service Worker
            await this.registerServiceWorker();
            
            // Cek status subscription
            await this.checkSubscription();
            
            // Tampilkan tombol enable notification
            this.showNotificationButton();
            
        } catch (error) {
            console.error('Error initializing push notification:', error);
        }
    }

    checkBrowserSupport() {
        return (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        );
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker registered successfully');
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }

    async checkSubscription() {
        if (!this.swRegistration) return;

        const subscription = await this.swRegistration.pushManager.getSubscription();
        this.isSubscribed = !(subscription === null);
        
        if (this.isSubscribed) {
            console.log('User sudah subscribe push notification');
            await this.sendSubscriptionToServer(subscription);
        }
    }

    async subscribeUser() {
        try {
            // Minta izin notification
            const permission = await Notification.requestPermission();
            
            if (permission !== 'granted') {
                alert('Izin notifikasi ditolak. Tidak bisa mengaktifkan push notification.');
                return;
            }

            // Subscribe ke push manager
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
            });

            this.isSubscribed = true;
            console.log('User berhasil subscribe:', subscription);
            
            // Kirim subscription ke server
            await this.sendSubscriptionToServer(subscription);
            
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Failed to subscribe user:', error);
            
            if (Notification.permission === 'denied') {
                alert('Izin notifikasi diblokir. Buka pengaturan browser untuk mengizinkan notifikasi.');
            } else {
                alert('Gagal mengaktifkan notifikasi: ' + error.message);
            }
        }
    }

    async unsubscribeUser() {
        try {
            const subscription = await this.swRegistration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
                this.isSubscribed = false;
                console.log('User unsubscribed');
                
                // Hapus dari server
                await this.removeSubscriptionFromServer(subscription);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    }

    async sendSubscriptionToServer(subscription) {
        try {
            // Simpan subscription ke database/localStorage
            localStorage.setItem('pushSubscription', JSON.stringify(subscription));
            
            // Kirim ke server (jika ada backend)
            // await fetch('/api/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(subscription)
            // });
            
            console.log('Subscription saved locally');
        } catch (error) {
            console.error('Error saving subscription:', error);
        }
    }

    async removeSubscriptionFromServer(subscription) {
        try {
            localStorage.removeItem('pushSubscription');
            console.log('Subscription removed locally');
        } catch (error) {
            console.error('Error removing subscription:', error);
        }
    }

    showNotificationButton() {
        // Cari atau buat tombol enable notification
        let notificationBtn = document.getElementById('enableNotifications');
        
        if (!notificationBtn) {
            notificationBtn = document.createElement('button');
            notificationBtn.id = 'enableNotifications';
            notificationBtn.className = 'button notification-btn';
            notificationBtn.innerHTML = '🔔 Aktifkan Notifikasi Promo';
            notificationBtn.style.marginTop = '15px';
            notificationBtn.style.background = '#ff6b6b';
            
            // Tambahkan ke DOM
            const container = document.querySelector('.container') || document.body;
            container.appendChild(notificationBtn);
            
            // Event listener
            notificationBtn.addEventListener('click', () => {
                this.subscribeUser();
            });
        }

        // Update teks berdasarkan status
        if (this.isSubscribed) {
            notificationBtn.innerHTML = '🔔 Notifikasi Aktif';
            notificationBtn.style.background = '#28a745';
            notificationBtn.disabled = true;
        }
    }

    showSuccessMessage() {
        alert('✅ Notifikasi berhasil diaktifkan! Anda akan menerima promo dan update terbaru dari Top Up BUSSID.');
    }

    // Helper function
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Test notification (untuk development)
    async testNotification() {
        if (this.isSubscribed) {
            this.swRegistration.showNotification('Test Notifikasi', {
                body: 'Ini adalah test notifikasi dari Top Up BUSSID',
                icon: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                badge: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                data: { url: window.location.href }
            });
        }
    }
}

// Initialize ketika DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.pushManager = new PushNotificationManager();
});