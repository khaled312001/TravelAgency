<template>
  <div class="notification-manager">
    <!-- Notification Permission Button -->
    <button
      v-if="!hasPermission && !isLoading"
      @click="requestPermission"
      class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
    >
      تفعيل الإشعارات
    </button>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-gray-600">
      جاري تفعيل الإشعارات...
    </div>

    <!-- Success State -->
    <div v-if="hasPermission && !isLoading" class="text-green-600 flex items-center gap-2">
      <Icon name="lucide:check-circle" class="w-5 h-5" />
      الإشعارات مفعلة
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reactive state
const hasPermission = ref(false)
const isLoading = ref(false)
const error = ref('')

// Check notification permission
const checkPermission = () => {
  if (!('Notification' in window)) {
    error.value = 'المتصفح لا يدعم الإشعارات'
    return
  }

  hasPermission.value = Notification.permission === 'granted'
}

// Request notification permission
const requestPermission = async () => {
  if (!('Notification' in window)) {
    error.value = 'المتصفح لا يدعم الإشعارات'
    return
  }

  if (!('serviceWorker' in navigator)) {
    error.value = 'Service Worker غير مدعوم'
    return
  }

  if (!('PushManager' in window)) {
    error.value = 'Push API غير مدعوم'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      hasPermission.value = true
      
      // Subscribe to push notifications
      await subscribeToPush()
    } else if (permission === 'denied') {
      error.value = 'تم رفض الإذن للإشعارات'
    } else {
      error.value = 'تم إلغاء طلب الإذن'
    }
  } catch (err) {
    console.error('Error requesting permission:', err)
    error.value = 'حدث خطأ أثناء طلب الإذن'
  } finally {
    isLoading.value = false
  }
}

// Subscribe to push notifications
const subscribeToPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready
    
    // Get VAPID public key
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
  } catch (err) {
    console.error('Error subscribing to push:', err)
    error.value = 'حدث خطأ أثناء الاشتراك في الإشعارات'
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

// Initialize on mount
onMounted(() => {
  checkPermission()
})
</script>

<style scoped>
.notification-manager {
  @apply p-4;
}
</style>
