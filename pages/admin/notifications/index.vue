<template>
  <div class="notifications-page">
    <div class="page-header">
      <h1 class="page-title">إدارة الإشعارات</h1>
      <p class="page-description">إرسال إشعارات للمستخدمين حتى لو كان المتصفح مغلق</p>
      <div class="mt-4">
        <NuxtLink
          to="/admin/notifications/setup"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="lucide:settings" class="w-4 h-4 mr-2" />
          إعداد الإشعارات للإدمن
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Send Notification Form -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">إرسال إشعار</h2>
        </div>
        <div class="card-content">
          <form @submit.prevent="sendNotification" class="space-y-6">
            <div class="form-group">
              <label class="form-label">العنوان</label>
              <input
                v-model="notificationForm.title"
                type="text"
                class="form-input"
                placeholder="عنوان الإشعار"
                required
              />
      </div>
      
            <div class="form-group">
              <label class="form-label">الرسالة</label>
              <textarea
                v-model="notificationForm.message"
                class="form-textarea"
                rows="4"
                placeholder="نص الإشعار"
                required
              ></textarea>
    </div>

            <div class="form-group">
              <label class="form-label">الرابط (اختياري)</label>
          <input 
                v-model="notificationForm.url"
                type="url"
                class="form-input"
                placeholder="https://www.worldtripagency.com"
          />
        </div>
        
            <button
              type="submit"
              :disabled="isSending"
              class="btn btn-primary w-full"
            >
              <Icon v-if="isSending" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
              {{ isSending ? 'جاري الإرسال...' : 'إرسال الإشعار' }}
            </button>
          </form>
      </div>
    </div>

      <!-- Notification Settings -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">إعدادات الإشعارات</h2>
      </div>
        <div class="card-content">
          <div class="space-y-6">
            <!-- Permission Status -->
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">حالة الإذن</h3>
                <p class="setting-description">حالة إذن الإشعارات في المتصفح</p>
      </div>
              <div class="setting-value">
                <span :class="permissionStatusClass">
                  {{ permissionStatusText }}
                </span>
              </div>
            </div>

            <!-- Service Worker Status -->
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Service Worker</h3>
                <p class="setting-description">حالة Service Worker</p>
              </div>
              <div class="setting-value">
                <span :class="swStatusClass">
                  {{ swStatusText }}
                </span>
            </div>
          </div>

            <!-- Push API Status -->
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Push API</h3>
                <p class="setting-description">حالة Push API</p>
              </div>
              <div class="setting-value">
                <span :class="pushStatusClass">
                  {{ pushStatusText }}
                  </span>
              </div>
            </div>

            <!-- Subscriptions Count -->
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">عدد المشتركين</h3>
                <p class="setting-description">عدد المستخدمين المشتركين في الإشعارات</p>
            </div>
              <div class="setting-value">
                <span class="text-primary-600 font-semibold">
                  {{ subscriptionsCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert alert-success mt-6">
      <Icon name="lucide:check-circle" class="w-5 h-5" />
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-error mt-6">
      <Icon name="lucide:alert-circle" class="w-5 h-5" />
      {{ errorMessage }}
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

// Reactive data
const isSending = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const subscriptionsCount = ref(0)

// Notification form
const notificationForm = ref({
  title: '',
  message: '',
  url: ''
})

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

// Send notification
const sendNotification = async () => {
  isSending.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationForm.value)
    })

    const result = await response.json()

    if (result.success) {
      successMessage.value = result.message
      notificationForm.value = { title: '', message: '', url: '' }
    } else {
      errorMessage.value = result.message || 'حدث خطأ أثناء إرسال الإشعار'
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    errorMessage.value = 'حدث خطأ أثناء إرسال الإشعار'
  } finally {
    isSending.value = false
  }
}

// Load subscriptions count
const loadSubscriptionsCount = async () => {
  try {
    const response = await fetch('/api/notifications/subscriptions-count')
    const result = await response.json()
    subscriptionsCount.value = result.count || 0
  } catch (error) {
    console.error('Error loading subscriptions count:', error)
  }
}

// Initialize on mount
onMounted(() => {
  loadSubscriptionsCount()
})
</script>

<style scoped>
.notifications-page {
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

.card-header {
  @apply p-6 border-b border-gray-200;
}

.card-title {
  @apply text-xl font-semibold text-gray-900;
}

.card-content {
  @apply p-6;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none;
}

.btn {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-colors;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500;
}

.setting-item {
  @apply flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0;
}

.setting-info {
  @apply flex-1;
}

.setting-title {
  @apply text-sm font-medium text-gray-900;
}

.setting-description {
  @apply text-sm text-gray-500 mt-1;
}

.setting-value {
  @apply ml-4;
}

.alert {
  @apply flex items-center gap-2 p-4 rounded-lg;
}

.alert-success {
  @apply bg-green-50 text-green-800 border border-green-200;
}

.alert-error {
  @apply bg-red-50 text-red-800 border border-red-200;
}
</style>