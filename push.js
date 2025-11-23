// push.js - FIXED Version dengan notifikasi lokal
class PushNotificationManager {
    constructor() {
        this.isSubscribed = false;
        this.swRegistration = null;
        
        console.log('🔔 PushNotificationManager initialized');
        
        // Coba init langsung
        this.init();
    }

    async init() {
        try {
            console.log('🔍 Checking browser support...');
            
            if (!this.checkBrowserSupport()) {
                console.log('❌ Browser tidak support push notification');
                this.showUnsupportedMessage();
                return;
            }

            await this.registerServiceWorker();
            await this.checkSubscription();
            
            console.log('✅ Push notification system ready');
            
        } catch (error) {
            console.error('❌ Error initializing:', error);
        }
    }

    checkBrowserSupport() {
        const supported = 'serviceWorker' in navigator && 'Notification' in window;
        console.log('🌐 Browser support:', supported);
        return supported;
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered:', this.swRegistration);
            
            // Tunggu sampai SW aktif
            await this.waitForServiceWorkerActivation();
            
        } catch (error) {
            console.error('❌ SW registration failed:', error);
            throw error;
        }
    }

    async waitForServiceWorkerActivation() {
        return new Promise((resolve) => {
            if (this.swRegistration.active) {
                resolve();
            } else {
                this.swRegistration.addEventListener('activate', () => {
                    console.log('🎯 Service Worker now active');
                    resolve();
                });
            }
        });
    }

    async checkSubscription() {
        if (!this.swRegistration) return;

        try {
            const subscription = await this.swRegistration.pushManager.getSubscription();
            console.log('📋 Current subscription:', subscription);
            this.isSubscribed = !!subscription;
        } catch (error) {
            console.error('❌ Error checking subscription:', error);
        }
    }

    // Manual request function untuk testing
    async requestPermissionManually() {
        try {
            console.log('🔄 Requesting notification permission...');
            
            const permission = await Notification.requestPermission();
            console.log('📝 Permission result:', permission);
            
            if (permission === 'granted') {
                await this.showTestNotification();
                this.showSuccessMessage('Izin notifikasi diberikan! 🎉');
            } else if (permission === 'denied') {
                this.showErrorMessage('Izin notifikasi ditolak. Silakan buka pengaturan browser untuk mengizinkan notifikasi.');
            } else {
                this.showInfoMessage('Izin notifikasi ditunda. Klik tombol lagi untuk mencoba.');
            }
        } catch (error) {
            console.error('❌ Error requesting permission:', error);
            this.showErrorMessage('Error: ' + error.message);
        }
    }

    async showTestNotification() {
        console.log('🎪 Showing test notification...');
        
        if (this.swRegistration && this.swRegistration.active) {
            try {
                // Method 1: Via Service Worker message (lebih reliable)
                this.swRegistration.active.postMessage({
                    type: 'SHOW_NOTIFICATION',
                    title: 'Test Berhasil! 🎉',
                    body: 'Notifikasi dari Top Up BUSSID berhasil diaktifkan. Anda akan mendapatkan promo terbaru!',
                    icon: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                    image: 'https://i.postimg.cc/nrfSZWmP/file-00000000d29861f895e12e2a67d02858.png',
                    url: window.location.href
                });
                
                console.log('✅ Test notification sent to Service Worker');
                
            } catch (error) {
                console.error('❌ Error with SW method:', error);
                
                // Method 2: Fallback ke direct API
                try {
                    await this.showDirectNotification();
                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError);
                }
            }
        } else {
            console.log('❌ Service Worker not active, using direct method');
            await this.showDirectNotification();
        }
    }

    async showDirectNotification() {
        // Method langsung (tanpa Service Worker)
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('Test Berhasil! 🎉', {
                body: 'Notifikasi dari Top Up BUSSID berhasil diaktifkan!',
                icon: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                image: 'https://i.postimg.cc/nrfSZWmP/file-00000000d29861f895e12e2a67d02858.png',
                badge: 'https://i.postimg.cc/GmbgBPZ9/20250827-200754.png',
                tag: 'direct-test'
            });
            
            notification.onclick = function() {
                window.focus();
                this.close();
            };
            
            console.log('✅ Direct notification shown');
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    showUnsupportedMessage() {
        this.showMessage('Browser tidak mendukung notifikasi', 'warning');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        const bgColor = type === 'success' ? '#28a745' : 
                        type === 'error' ? '#dc3545' : 
                        type === 'warning' ? '#ffc107' : '#17a2b8';
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 4000);
    }
}

// Initialize ketika DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing PushNotificationManager...');
    window.pushManager = new PushNotificationManager();
    
    // Tambahkan button manual untuk testing
    setTimeout(() => {
        addTestButton();
    }, 1000);
});

function addTestButton() {
    // Cek jika button sudah ada
    if (document.getElementById('testNotifBtn')) return;
    
    const testBtn = document.createElement('button');
    testBtn.id = 'testNotifBtn';
    testBtn.innerHTML = '🔔 Test Notifikasi';
    testBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #0072ff, #00c6ff);
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0, 114, 255, 0.3);
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    testBtn.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 114, 255, 0.4)';
    };
    
    testBtn.onmouseout = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0, 114, 255, 0.3)';
    };
    
    testBtn.onclick = () => {
        if (window.pushManager) {
            window.pushManager.requestPermissionManually();
        }
    };
    
    document.body.appendChild(testBtn);
}

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
`;
document.head.appendChild(style);