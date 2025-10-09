<template>
  <div class="notification-settings-page space-y-6">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إعدادات الإشعارات</h1>
          <p class="page-subtitle">تخصيص إعدادات الإشعارات والتنبيهات</p>
        </div>
      </div>
    </div>

    <!-- Notification Status Card -->
    <div class="settings-card">
      <div class="card-header">
        <h2 class="card-title">حالة الإشعارات</h2>
        <p class="card-description">إعدادات الإشعارات الأساسية</p>
      </div>
      
      <div class="card-content">
        <div class="status-grid">
          <div class="status-item">
            <div class="status-icon">
              <Icon name="lucide:bell" class="icon" />
            </div>
            <div class="status-info">
              <h3 class="status-title">دعم الإشعارات</h3>
              <p class="status-description">هل يدعم المتصفح الإشعارات؟</p>
              <span class="status-badge" :class="{ 'supported': isSupported, 'not-supported': !isSupported }">
                {{ isSupported ? 'مدعوم' : 'غير مدعوم' }}
              </span>
            </div>
          </div>

          <div class="status-item">
            <div class="status-icon">
              <Icon name="lucide:shield-check" class="icon" />
            </div>
            <div class="status-info">
              <h3 class="status-title">إذن الإشعارات</h3>
              <p class="status-description">حالة إذن الإشعارات</p>
              <span class="status-badge" :class="permissionClass">
                {{ permissionText }}
              </span>
            </div>
          </div>

          <div class="status-item">
            <div class="status-icon">
              <Icon name="lucide:settings" class="icon" />
            </div>
            <div class="status-info">
              <h3 class="status-title">Service Worker</h3>
              <p class="status-description">حالة تسجيل Service Worker</p>
              <span class="status-badge" :class="{ 'supported': swRegistered, 'not-supported': !swRegistered }">
                {{ swRegistered ? 'مسجل' : 'غير مسجل' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="isSupported && permission !== 'granted'" class="permission-actions">
          <button 
            @click="requestPermission" 
            class="permission-btn"
            :disabled="permission === 'denied'"
          >
            <Icon name="lucide:bell-ring" class="btn-icon" />
            {{ permission === 'denied' ? 'الإشعارات محظورة' : 'تفعيل الإشعارات' }}
          </button>
          <p v-if="permission === 'denied'" class="permission-help">
            الإشعارات محظورة. يرجى تفعيلها من إعدادات المتصفح.
          </p>
        </div>
      </div>
    </div>

    <!-- Sound Settings Card -->
    <div class="settings-card">
      <div class="card-header">
        <h2 class="card-title">إعدادات الصوت</h2>
        <p class="card-description">تخصيص أصوات الإشعارات</p>
      </div>
      
      <div class="card-content">
        <div class="sound-settings">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">صوت الإشعارات</h3>
              <p class="setting-description">تشغيل صوت عند وصول إشعار جديد</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="soundEnabled" 
                  type="checkbox"
                  @change="updateSoundSettings"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">مستوى الصوت</h3>
              <p class="setting-description">تعديل مستوى صوت الإشعارات</p>
            </div>
            <div class="setting-control">
              <input 
                v-model="soundVolume" 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                class="volume-slider"
                @change="updateSoundSettings"
              />
              <span class="volume-value">{{ Math.round(soundVolume * 100) }}%</span>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-title">اختبار الصوت</h3>
              <p class="setting-description">تشغيل صوت تجريبي للإشعارات</p>
            </div>
            <div class="setting-control">
              <button @click="testSound" class="test-sound-btn">
                <Icon name="lucide:play" class="btn-icon" />
                تشغيل تجريبي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Types Card -->
    <div class="settings-card">
      <div class="card-header">
        <h2 class="card-title">أنواع الإشعارات</h2>
        <p class="card-description">اختيار أنواع الإشعارات التي تريد استقبالها</p>
      </div>
      
      <div class="card-content">
        <div class="notification-types">
          <div class="type-item">
            <div class="type-info">
              <Icon name="lucide:mail" class="type-icon" />
              <div class="type-details">
                <h3 class="type-title">رسائل التواصل</h3>
                <p class="type-description">إشعارات عند وصول رسائل جديدة من العملاء</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input 
                v-model="notificationTypes.message" 
                type="checkbox"
                @change="updateNotificationTypes"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="type-item">
            <div class="type-info">
              <Icon name="lucide:calendar" class="type-icon" />
              <div class="type-details">
                <h3 class="type-title">الحجوزات الجديدة</h3>
                <p class="type-description">إشعارات عند إنشاء حجز جديد</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input 
                v-model="notificationTypes.booking" 
                type="checkbox"
                @change="updateNotificationTypes"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="type-item">
            <div class="type-info">
              <Icon name="lucide:alert-triangle" class="type-icon" />
              <div class="type-details">
                <h3 class="type-title">تنبيهات النظام</h3>
                <p class="type-description">إشعارات مهمة من النظام</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input 
                v-model="notificationTypes.system" 
                type="checkbox"
                @change="updateNotificationTypes"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Notifications Card -->
    <div class="settings-card">
      <div class="card-header">
        <h2 class="card-title">اختبار الإشعارات</h2>
        <p class="card-description">إرسال إشعارات تجريبية لاختبار الإعدادات</p>
      </div>
      
      <div class="card-content">
        <div class="test-actions">
          <button @click="sendTestNotification" class="test-btn">
            <Icon name="lucide:bell" class="btn-icon" />
            إرسال إشعار تجريبي
          </button>
          <button @click="sendTestPush" class="test-btn secondary">
            <Icon name="lucide:send" class="btn-icon" />
            إرسال Push تجريبي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { 
  isSupported, 
  permission, 
  initialize, 
  requestPermission, 
  playNotificationSound,
  showNotification,
  sendPushNotification 
} = useNotifications()

const soundEnabled = ref(true)
const soundVolume = ref(0.5)
const swRegistered = ref(false)

const notificationTypes = ref({
  message: true,
  booking: true,
  system: true
})

const permissionClass = computed(() => {
  switch (permission.value) {
    case 'granted': return 'granted'
    case 'denied': return 'denied'
    default: return 'default'
  }
})

const permissionText = computed(() => {
  switch (permission.value) {
    case 'granted': return 'مفعل'
    case 'denied': return 'محظور'
    default: return 'غير محدد'
  }
})

const updateSoundSettings = () => {
  // Save to localStorage
  localStorage.setItem('notification-sound-enabled', soundEnabled.value.toString())
  localStorage.setItem('notification-sound-volume', soundVolume.value.toString())
}

const updateNotificationTypes = () => {
  // Save to localStorage
  localStorage.setItem('notification-types', JSON.stringify(notificationTypes.value))
}

const testSound = () => {
  if (soundEnabled.value) {
    playNotificationSound()
  }
}

const sendTestNotification = () => {
  if (permission.value === 'granted') {
    showNotification('إشعار تجريبي', {
      body: 'هذا إشعار تجريبي لاختبار الإعدادات',
      icon: '/favicon.ico'
    })
  } else {
    alert('يرجى تفعيل الإشعارات أولاً')
  }
}

const sendTestPush = async () => {
  try {
    const success = await sendPushNotification('Push تجريبي', {
      body: 'هذا إشعار Push تجريبي',
      icon: '/favicon.ico'
    })
    
    if (success) {
      alert('تم إرسال Push تجريبي بنجاح')
    } else {
      alert('فشل في إرسال Push تجريبي')
    }
  } catch (error) {
    console.error('Test push error:', error)
    alert('حدث خطأ أثناء إرسال Push تجريبي')
  }
}

// Load settings from localStorage
const loadSettings = () => {
  const soundEnabledValue = localStorage.getItem('notification-sound-enabled')
  const soundVolumeValue = localStorage.getItem('notification-sound-volume')
  const notificationTypesValue = localStorage.getItem('notification-types')

  if (soundEnabledValue !== null) {
    soundEnabled.value = soundEnabledValue === 'true'
  }
  
  if (soundVolumeValue !== null) {
    soundVolume.value = parseFloat(soundVolumeValue)
  }
  
  if (notificationTypesValue) {
    try {
      notificationTypes.value = JSON.parse(notificationTypesValue)
    } catch (error) {
      console.error('Error parsing notification types:', error)
    }
  }
}

onMounted(async () => {
  await initialize()
  swRegistered.value = true
  loadSettings()
})

// Set page title
useHead({
  title: 'إعدادات الإشعارات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.notification-settings-page {
  @apply space-y-6;
}

.page-header {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.header-content {
  @apply flex items-center justify-between;
}

.page-title {
  @apply text-2xl font-bold text-gray-900;
}

.page-subtitle {
  @apply text-gray-600 mt-1;
}

.settings-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.card-header {
  @apply p-6 border-b border-gray-200;
}

.card-title {
  @apply text-xl font-semibold text-gray-900;
}

.card-description {
  @apply text-gray-600 mt-1;
}

.card-content {
  @apply p-6;
}

.status-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.status-item {
  @apply flex items-start space-x-4 space-x-reverse;
}

.status-icon {
  @apply w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.status-icon .icon {
  @apply w-6 h-6 text-purple-600;
}

.status-info {
  @apply flex-1;
}

.status-title {
  @apply text-lg font-semibold text-gray-900;
}

.status-description {
  @apply text-gray-600 text-sm mt-1;
}

.status-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2;
}

.status-badge.supported,
.status-badge.granted {
  @apply bg-green-100 text-green-800;
}

.status-badge.not-supported,
.status-badge.denied {
  @apply bg-red-100 text-red-800;
}

.status-badge.default {
  @apply bg-yellow-100 text-yellow-800;
}

.permission-actions {
  @apply mt-6 p-4 bg-gray-50 rounded-lg;
}

.permission-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.permission-help {
  @apply text-sm text-gray-600 mt-2;
}

.sound-settings {
  @apply space-y-6;
}

.setting-item {
  @apply flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0;
}

.setting-info {
  @apply flex-1;
}

.setting-title {
  @apply text-lg font-semibold text-gray-900;
}

.setting-description {
  @apply text-gray-600 text-sm mt-1;
}

.setting-control {
  @apply flex items-center space-x-3 space-x-reverse;
}

.toggle-switch {
  @apply relative inline-block w-12 h-6;
}

.toggle-switch input {
  @apply opacity-0 w-0 h-0;
}

.toggle-slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300;
}

.toggle-slider:before {
  content: '';
  @apply absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300;
}

input:checked + .toggle-slider {
  @apply bg-purple-600;
}

input:checked + .toggle-slider:before {
  @apply transform translate-x-6;
}

.volume-slider {
  @apply w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer;
}

.volume-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-purple-600 rounded-full cursor-pointer;
}

.volume-value {
  @apply text-sm text-gray-600 min-w-[3rem];
}

.test-sound-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.notification-types {
  @apply space-y-4;
}

.type-item {
  @apply flex items-center justify-between p-4 border border-gray-200 rounded-lg;
}

.type-info {
  @apply flex items-center space-x-3 space-x-reverse flex-1;
}

.type-icon {
  @apply w-8 h-8 text-purple-600;
}

.type-details {
  @apply flex-1;
}

.type-title {
  @apply text-lg font-semibold text-gray-900;
}

.type-description {
  @apply text-gray-600 text-sm mt-1;
}

.test-actions {
  @apply flex flex-col sm:flex-row gap-4;
}

.test-btn {
  @apply flex items-center space-x-2 space-x-reverse px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.test-btn.secondary {
  @apply bg-gray-600 hover:bg-gray-700;
}

.btn-icon {
  @apply w-4 h-4;
}
</style>
