// Cache busting and data freshness system
class CacheBuster {
    constructor() {
        this.init();
    }

    init() {
        this.addCacheBustingToDataRequests();
        this.setupPageVisibilityListener();
        this.setupOnlineListener();
    }

    // Add cache busting parameters to data requests
    addCacheBustingToDataRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            if (url.includes('data.json') || url.includes('/data/')) {
                const separator = url.includes('?') ? '&' : '?';
                url += `${separator}v=${Date.now()}&cb=${Math.random()}`;
            }
            return originalFetch(url, options);
        };
    }

    // Refresh data when page becomes visible
    setupPageVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && window.dataSync) {
                window.dataSync.forceSync();
            }
        });
    }

    // Refresh data when coming back online
    setupOnlineListener() {
        window.addEventListener('online', () => {
            if (window.dataSync) {
                window.dataSync.forceSync();
            }
        });
    }

    // Force refresh all cached data
    static clearAllCache() {
        // Clear localStorage
        localStorage.removeItem('techinternsData');
        localStorage.removeItem('lastSyncTime');
        
        // Clear browser cache for data files
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Force page reload
        window.location.reload(true);
    }
}

// Initialize cache buster
new CacheBuster();

// Add refresh button to admin panel
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-outline-info btn-sm position-fixed';
        refreshBtn.style.cssText = 'top: 10px; right: 10px; z-index: 9999;';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Force Sync';
        refreshBtn.onclick = () => {
            if (window.dataSync) {
                window.dataSync.forceSync();
                showAlert('Data synchronized successfully!', 'info');
            }
        };
        document.body.appendChild(refreshBtn);
    });
}