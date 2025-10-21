export const useNotifications = () => {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const registration = ref<ServiceWorkerRegistration | null>(null)

  // Check if notifications are supported
  const checkSupport = () => {
    isSupported.value = 'Notification' in window && 'serviceWorker' in navigator
    if (isSupported.value) {
      permission.value = Notification.permission
    }
    return isSupported.value
  }

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) {
      console.warn('Notifications not supported')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  // Register service worker
  const registerServiceWorker = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported')
      return false
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      registration.value = reg
      console.log('Service Worker registered:', reg)
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready
      console.log('Service Worker is ready')
      
      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  // Play notification sound
  const playNotificationSound = () => {
    try {
      // Check if sound is enabled in localStorage
      const soundEnabled = localStorage.getItem('notification-sound-enabled')
      if (soundEnabled === 'false') {
        console.log('Notification sound is disabled')
        return
      }

      // Try to play custom notification sound
      const audio = new Audio('/notification-sound.mp3')
      audio.volume = parseFloat(localStorage.getItem('notification-sound-volume') || '0.5')
      
      // Ensure audio can play
      audio.preload = 'auto'
      
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Notification sound played successfully')
        }).catch(error => {
          console.warn('Could not play custom notification sound, using system sound:', error)
          // Fallback to system notification sound
          playSystemNotificationSound()
        })
      }
    } catch (error) {
      console.warn('Custom notification sound not available, using system sound:', error)
      playSystemNotificationSound()
    }
  }

  // Play system notification sound
  const playSystemNotificationSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.warn('System notification sound not available:', error)
    }
  }

  // Show browser notification
  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (!isSupported.value || permission.value !== 'granted') {
      console.warn('Notifications not available')
      return null
    }

    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'admin-notification',
      requireInteraction: true,
      ...options
    }

    try {
      const notification = new Notification(title, defaultOptions)
      
      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close()
      }, 10000)

      return notification
    } catch (error) {
      console.error('Error showing notification:', error)
      return null
    }
  }

  // Send push notification via service worker
  const sendPushNotification = async (title: string, options: NotificationOptions = {}) => {
    if (!registration.value) {
      console.warn('Service Worker not registered')
      return false
    }

    try {
      await registration.value.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-64x64.png',
        tag: 'admin-notification',
        requireInteraction: true,
        // vibrate: [200, 100, 200], // Not supported in all browsers
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
        data: {
          url: '/admin/notifications',
          timestamp: Date.now()
        },
        ...options
      })
      return true
    } catch (error) {
      console.error('Error sending push notification:', error)
      return false
    }
  }

  // Send push notification to all clients
  const sendPushToAllClients = async (title: string, options: NotificationOptions = {}) => {
    if (!registration.value) {
      console.warn('Service Worker not registered')
      return false
    }

    try {
      // Send message to all clients via service worker
      if (registration.value.active) {
        registration.value.active.postMessage({
          type: 'NEW_NOTIFICATION',
          title,
          body: options.body,
          data: options.data
        })
      }

      // Also show notification
      await sendPushNotification(title, options)
      return true
    } catch (error) {
      console.error('Error sending push to all clients:', error)
      return false
    }
  }

  // Initialize notifications system
  const initialize = async (): Promise<boolean> => {
    const supportChecked = checkSupport()
    if (!supportChecked) {
      return false
    }

    const swRegistered = await registerServiceWorker()
    if (!swRegistered) {
      return false
    }

    return true
  }

  // Setup real-time notification listener
  const setupNotificationListener = () => {
    if (!registration.value) return

    // Listen for push events
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NEW_NOTIFICATION') {
        const { title, body, data } = event.data
        
        // Play sound
        playNotificationSound()
        
        // Show browser notification
        showNotification(title, {
          body,
          data
        })
      }
    })
  }

  return {
    isSupported: readonly(isSupported),
    permission: readonly(permission),
    registration: readonly(registration),
    checkSupport,
    requestPermission,
    registerServiceWorker,
    playNotificationSound,
    showNotification,
    sendPushNotification,
    sendPushToAllClients,
    initialize,
    setupNotificationListener
  }
}
