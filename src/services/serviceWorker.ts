class ServiceWorkerManager {
  private wb: any = null;
  private registration: ServiceWorkerRegistration | null = null;

  async register() {
    // Only register service worker in production to avoid storage access issues
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        // Use dynamic import to avoid issues in development
        const { Workbox } = await import('workbox-window');
        this.wb = new Workbox('/sw.js');

        // Add event listeners
        this.wb.addEventListener('installed', (event: any) => {
          if (event.isUpdate) {
            // Show update available notification
            this.showUpdateNotification();
          }
        });

        this.wb.addEventListener('waiting', () => {
          // Show update ready notification
          this.showUpdateReadyNotification();
        });

        this.wb.addEventListener('controlling', () => {
          // Reload page when new service worker takes control
          window.location.reload();
        });

        this.registration = await this.wb.register();
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    } else {
      console.log('Service Worker disabled in development mode');
    }
  }

  async update() {
    if (this.wb) {
      await this.wb.update();
    }
  }

  skipWaiting() {
    if (this.wb) {
      this.wb.messageSkipWaiting();
    }
  }

  private showUpdateNotification() {
    console.log('App update available');
  }

  private showUpdateReadyNotification() {
    console.log('App update ready');
  }

  // Cache management with error handling
  async cacheTrack(trackUrl: string, trackId: string) {
    if (!this.registration || !trackUrl || !import.meta.env.PROD) return;

    try {
      const cache = await caches.open('music-cache-v1');
      await cache.add(trackUrl);
      
      // Store metadata in memory instead of localStorage to avoid storage access issues
      const metadata = {
        id: trackId,
        url: trackUrl,
        cachedAt: Date.now(),
      };
      
      // Use in-memory storage only in production
      console.log('Track cached:', metadata);
    } catch (error) {
      console.warn('Failed to cache track:', error);
    }
  }

  async getCachedTrack(trackId: string): Promise<string | null> {
    if (!import.meta.env.PROD) return null;
    
    try {
      const cache = await caches.open('music-cache-v1');
      const keys = await cache.keys();
      
      // Simple search through cached URLs
      for (const request of keys) {
        if (request.url.includes(trackId)) {
          return request.url;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to get cached track:', error);
      return null;
    }
  }

  async clearCache() {
    if (!import.meta.env.PROD) return;
    
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache cleared successfully');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    if (!import.meta.env.PROD) return 0;
    
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
      }
      return 0;
    } catch (error) {
      console.warn('Failed to get cache size:', error);
      return 0;
    }
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();