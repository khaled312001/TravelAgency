<template>
  <div class="notification-setup-page">
    <div class="page-header">
      <h1 class="page-title">تفعيل الإشعارات للإدمن</h1>
      <p class="page-description">تفعيل الإشعارات لاستقبال رسائل جديدة من الفورمات</p>
    </div>

    <div class="max-w-2xl mx-auto">
      <div class="card">
        <div class="card-content">
          <!-- Notification Permission Status -->
          <div class="status-section">
            <h2 class="section-title">حالة الإذن</h2>
            <div class="status-item">
              <span class="status-label">إذن الإشعارات:</span>
              <span :class="permissionStatusClass">
                {{ permissionStatusText }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Service Worker:</span>
              <span :class="swStatusClass">
                {{ swStatusText }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Push API:</span>
              <span :class="pushStatusClass">
                {{ pushStatusText }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-section">
            <button
              v-if="!hasPermission && !isLoading"
              @click="requestPermission"
              class="btn btn-primary w-full"
            >
              <Icon name="lucide:bell" class="w-5 h-5 mr-2" />
              تفعيل الإشعارات
            </button>

            <div v-if="isLoading" class="loading-state">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
              جاري تفعيل الإشعارات...
            </div>

            <div v-if="hasPermission && !isLoading" class="success-state">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-600 mr-2" />
              <span class="text-green-600">الإشعارات مفعلة بنجاح!</span>
            </div>

            <div v-if="error" class="error-state">
              <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-600 mr-2" />
              <span class="text-red-600">{{ error }}</span>
            </div>
          </div>

          <!-- Instructions -->
          <div class="instructions-section">
            <h2 class="section-title">كيف يعمل النظام</h2>
            <div class="instructions-list">
              <div class="instruction-item">
                <Icon name="lucide:message-square" class="w-5 h-5 text-blue-600" />
                <span>عند وصول رسالة جديدة من أي فورم</span>
              </div>
              <div class="instruction-item">
                <Icon name="lucide:bell" class="w-5 h-5 text-blue-600" />
                <span>ستصلك إشعار فوري حتى لو كان المتصفح مغلق</span>
              </div>
              <div class="instruction-item">
                <Icon name="lucide:mouse-pointer-click" class="w-5 h-5 text-blue-600" />
                <span>انقر على الإشعار لفتح لوحة التحكم</span>
              </div>
            </div>
          </div>

          <!-- Test Button -->
          <div v-if="hasPermission" class="test-section">
            <button
              @click="sendTestNotification"
              :disabled="isTesting"
              class="btn btn-secondary w-full"
            >
              <Icon v-if="isTesting" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
              <Icon v-else name="lucide:send" class="w-4 h-4 mr-2" />
              {{ isTesting ? 'جاري الإرسال...' : 'إرسال إشعار تجريبي' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Reactive state
const hasPermission = ref(false)
const isLoading = ref(false)
const isTesting = ref(false)
const error = ref('')

// Check notification permission
const checkPermission = () => {
  if (!('Notification' in window)) {
    error.value = 'المتصفح لا يدعم الإشعارات'
    return
  }

  hasPermission.value = Notification.permission === 'granted'
}

// Computed properties for status
const permissionStatusText = computed(() => {
  if (!('Notification' in window)) return 'غير مدعوم'
  switch (Notification.permission) {
    case 'granted': return 'مفعل'
    case 'denied': return 'مرفوض'
    default: return 'غير محدد'
  }
})

const permissionStatusClass = computed(() => {
  if (!('Notification' in window)) return 'text-red-600'
  switch (Notification.permission) {
    case 'granted': return 'text-green-600'
    case 'denied': return 'text-red-600'
    default: return 'text-yellow-600'
  }
})

const swStatusText = computed(() => {
  return 'serviceWorker' in navigator ? 'مدعوم' : 'غير مدعوم'
})

const swStatusClass = computed(() => {
  return 'serviceWorker' in navigator ? 'text-green-600' : 'text-red-600'
})

const pushStatusText = computed(() => {
  return 'PushManager' in window ? 'مدعوم' : 'غير مدعوم'
})

const pushStatusClass = computed(() => {
  return 'PushManager' in window ? 'text-green-600' : 'text-red-600'
})

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

// Send test notification
const sendTestNotification = async () => {
  isTesting.value = true
  
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'إشعار تجريبي',
        message: 'هذا إشعار تجريبي للتأكد من عمل النظام',
        url: '/admin/messages'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      // Show success message
      setTimeout(() => {
        alert('تم إرسال الإشعار التجريبي بنجاح!')
      }, 1000)
    } else {
      error.value = result.message || 'حدث خطأ أثناء إرسال الإشعار التجريبي'
    }
  } catch (error) {
    console.error('Error sending test notification:', error)
    error.value = 'حدث خطأ أثناء إرسال الإشعار التجريبي'
  } finally {
    isTesting.value = false
  }
}

// Initialize on mount
onMounted(() => {
  checkPermission()
})
</script>

<style scoped>
.notification-setup-page {
  @apply p-6 space-y-8;
}

.page-header {
  @apply text-center;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.page-description {
  @apply text-gray-600;
}

.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.card-content {
  @apply p-8 space-y-8;
}

.status-section {
  @apply space-y-4;
}

.section-title {
  @apply text-xl font-semibold text-gray-900 mb-4;
}

.status-item {
  @apply flex items-center justify-between py-2;
}

.status-label {
  @apply text-gray-700;
}

.action-section {
  @apply space-y-4;
}

.loading-state {
  @apply flex items-center justify-center text-blue-600;
}

.success-state {
  @apply flex items-center justify-center;
}

.error-state {
  @apply flex items-center justify-center;
}

.instructions-section {
  @apply space-y-4;
}

.instructions-list {
  @apply space-y-3;
}

.instruction-item {
  @apply flex items-center gap-3 text-gray-700;
}

.test-section {
  @apply pt-4 border-t border-gray-200;
}

.btn {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-colors;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500;
}

.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500;
}
</style>
