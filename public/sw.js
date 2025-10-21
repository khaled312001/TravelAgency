// Service Worker for Push Notifications
const CACHE_NAME = 'travel-agency-v1'
const urlsToCache = [
  '/',
  '/admin',
  '/offline.html'
]

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Push event - Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
  
  let notificationData = {
    title: 'إشعار جديد من أرض العجائب للسفر',
    body: 'لديك إشعار جديد ينتظر مراجعتك',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-64x64.png',
    data: {
      url: '/admin/notifications',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'فتح',
        icon: '/icons/icon-64x64.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icons/icon-64x64.png'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'admin-notification'
  }

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json()
      notificationData = {
        ...notificationData,
        ...pushData
      }
    } catch (error) {
      console.error('Error parsing push data:', error)
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    // Open the admin panel
    event.waitUntil(
      clients.openWindow('/admin/notifications')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close()
  }
})

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event)
})

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Sync notifications in background
      syncNotifications()
    )
  }
})

// Sync notifications function
async function syncNotifications() {
  try {
    // This would typically sync with your server
    console.log('Syncing notifications...')
  } catch (error) {
    console.error('Sync error:', error)
  }
}

// Handle message from main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
