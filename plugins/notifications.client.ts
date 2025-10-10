export default defineNuxtPlugin(() => {
  // Check if we're in the browser
  if (typeof window === 'undefined') return

  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return
  }

  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('Notifications not supported')
    return
  }

  // Check if Push API is supported
  if (!('PushManager' in window)) {
    console.log('Push API not supported')
    return
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        console.log('Notification permission granted')
        return true
      } else if (permission === 'denied') {
        console.log('Notification permission denied')
        return false
      } else {
        console.log('Notification permission default')
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  // Subscribe to push notifications
  const subscribeToPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Get VAPID public key from server
      const response = await fetch('/api/notifications/vapid-public-key')
      const { publicKey } = await response.json()
      
      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(publicKey)
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      
      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      
      console.log('Successfully subscribed to push notifications')
      return subscription
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return null
    }
  }

  // Convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Initialize notifications
  const initializeNotifications = async () => {
    // Request permission
    const hasPermission = await requestNotificationPermission()
    
    if (hasPermission) {
      // Subscribe to push notifications
      await subscribeToPushNotifications()
    }
  }

  // Auto-initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNotifications)
  } else {
    initializeNotifications()
  }

  // Provide notification functions globally
  return {
    provide: {
      requestNotificationPermission,
      subscribeToPushNotifications,
      initializeNotifications
    }
  }
})
