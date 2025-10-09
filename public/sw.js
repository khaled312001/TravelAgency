// Service Worker for Push Notifications
const CACHE_NAME = 'worldtripagency-v1'
const urlsToCache = [
  '/',
  '/admin',
  '/admin/notifications'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
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
    title: 'إشعار جديد',
    body: 'لديك إشعار جديد من أرض العجائب للسفر',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'عرض',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/favicon.ico'
      }
    ]
  }

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        ...data
      }
    } catch (error) {
      console.error('Error parsing push data:', error)
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    notificationData
  )

  event.waitUntil(promiseChain)
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'view') {
    // Open admin notifications page
    event.waitUntil(
      clients.openWindow('/admin/notifications')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open admin notifications page
    event.waitUntil(
      clients.openWindow('/admin/notifications')
    )
  }
})

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    )
  }
})
