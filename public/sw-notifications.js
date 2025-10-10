// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  console.log('Push event received:', event)
  
  let notificationData = {
    title: 'إشعار جديد',
    body: 'لديك إشعار جديد من أرض العجائب للسفر',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-64x64.png',
    data: {
      url: '/',
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
    ]
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
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          const url = event.notification.data?.url || '/'
          return clients.openWindow(url)
        }
      })
    )
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close()
  }
})

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event)
})

// Handle background sync
self.addEventListener('sync', function(event) {
  console.log('Background sync event:', event)
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Handle any pending notification tasks
      handleNotificationSync()
    )
  }
})

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed:', event)
  
  event.waitUntil(
    // Re-subscribe to push notifications
    resubscribeToPush()
  )
})

// Helper functions
async function handleNotificationSync() {
  try {
    // Handle any pending notification tasks
    console.log('Handling notification sync')
  } catch (error) {
    console.error('Error in notification sync:', error)
  }
}

async function resubscribeToPush() {
  try {
    const registration = await self.registration
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI8F7j7ZAd9cn9jKIHaMqI5t9Dg6Ok3U7e1zKqoAZ4j2twFJqOPWqQW60'
    })
    
    // Send new subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    })
    
    console.log('Re-subscribed to push notifications')
  } catch (error) {
    console.error('Error re-subscribing to push:', error)
  }
}
