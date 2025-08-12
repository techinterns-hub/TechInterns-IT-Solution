// Data synchronization system for cross-device consistency
class DataSync {
    constructor() {
        this.apiUrl = window.location.origin;
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || '0';
        this.syncInterval = 30000; // 30 seconds
        this.init();
    }

    init() {
        this.loadFromServer();
        this.startPeriodicSync();
        this.setupStorageListener();
    }

    // Load data from server (data.json)
    async loadFromServer() {
        try {
            // Add cache busting parameters
            const cacheBuster = `t=${Date.now()}&r=${Math.random()}`;
            const response = await fetch(`${this.apiUrl}/data.json?${cacheBuster}`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            if (response.ok) {
                const serverData = await response.json();
                const serverTimestamp = response.headers.get('last-modified') || Date.now();
                
                // Always update if data is different or timestamp is newer
                const localDataStr = localStorage.getItem('techinternsData');
                const serverDataStr = JSON.stringify(serverData);
                
                if (!localDataStr || localDataStr !== JSON.stringify(serverData) || serverTimestamp > this.lastSyncTime) {
                    this.updateLocalData(serverData);
                    this.lastSyncTime = serverTimestamp;
                    localStorage.setItem('lastSyncTime', this.lastSyncTime);
                    this.notifyDataUpdate();
                }
            }
        } catch (error) {
            console.warn('Failed to sync with server, using local data:', error);
            this.loadFromLocalStorage();
        }
    }

    // Update local data with server data
    updateLocalData(serverData) {
        if (serverData.courses) {
            window.courses = serverData.courses;
        }
        if (serverData.pricing) {
            window.pricing = serverData.pricing;
        }
        if (serverData.internships) {
            window.internships = serverData.internships;
        }
        
        // Save to localStorage as backup
        localStorage.setItem('techinternsData', JSON.stringify({
            courses: window.courses,
            pricing: window.pricing,
            internships: window.internships
        }));
    }

    // Load from localStorage as fallback
    loadFromLocalStorage() {
        const data = localStorage.getItem('techinternsData');
        if (data) {
            const parsed = JSON.parse(data);
            window.courses = parsed.courses || window.courses;
            window.pricing = parsed.pricing || window.pricing;
            window.internships = parsed.internships || window.internships;
        }
    }

    // Save data to server (for admin updates)
    async saveToServer(data) {
        try {
            // Try to save to server first
            const response = await fetch(`${this.apiUrl}/update-data.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: data })
            });
            
            if (response.ok) {
                // Server update successful, update data.json directly
                await this.updateDataJsonFile(data);
            }
            
            // Always update localStorage and trigger sync across tabs
            localStorage.setItem('techinternsData', JSON.stringify(data));
            localStorage.setItem('dataUpdated', Date.now().toString());
            this.lastSyncTime = Date.now().toString();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);
            
            // Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'dataUpdated',
                newValue: this.lastSyncTime
            }));
            
            return true;
        } catch (error) {
            console.warn('Server update failed, using local sync only:', error);
            // Fallback to local storage only
            localStorage.setItem('techinternsData', JSON.stringify(data));
            localStorage.setItem('dataUpdated', Date.now().toString());
            this.lastSyncTime = Date.now().toString();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);
            
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'dataUpdated',
                newValue: this.lastSyncTime
            }));
            
            return true;
        }
    }
    
    // Update data.json file directly (fallback method)
    async updateDataJsonFile(data) {
        try {
            // This is a client-side approach - in production, use server-side API
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            
            // Store the updated data with timestamp for cache busting
            localStorage.setItem('dataJsonContent', dataStr);
            localStorage.setItem('dataJsonTimestamp', Date.now().toString());
            
            return true;
        } catch (error) {
            console.error('Failed to update data.json:', error);
            return false;
        }
    }

    // Start periodic sync
    startPeriodicSync() {
        setInterval(() => {
            this.loadFromServer();
        }, this.syncInterval);
    }

    // Listen for storage changes (cross-tab sync)
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'dataUpdated') {
                this.loadFromLocalStorage();
                this.notifyDataUpdate();
            }
        });
    }

    // Notify components about data updates
    notifyDataUpdate() {
        window.dispatchEvent(new CustomEvent('dataUpdated', {
            detail: {
                courses: window.courses,
                pricing: window.pricing,
                internships: window.internships
            }
        }));
    }

    // Force refresh data
    async forceSync() {
        this.lastSyncTime = '0';
        await this.loadFromServer();
    }
}

// Initialize data sync
const dataSync = new DataSync();

// Enhanced save function for admin panel
function saveData() {
    const data = {
        courses: window.courses,
        pricing: window.pricing,
        internships: window.internships
    };
    
    dataSync.saveToServer(data);
}

// Enhanced load function
function loadData() {
    // Data will be loaded by DataSync automatically
    dataSync.loadFromLocalStorage();
}

// Export for use in other scripts
window.dataSync = dataSync;