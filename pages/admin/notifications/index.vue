<template>
  <div class="notifications-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">الإشعارات</h1>
          <p class="page-subtitle">إدارة جميع الإشعارات والتنبيهات</p>
        </div>
        <div class="header-right">
          <button @click="markAllAsRead" class="mark-read-btn">
            <Icon name="lucide:check" class="btn-icon" />
            تعيين الكل كمقروء
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:bell" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ totalNotifications }}</p>
          <p class="stat-label">إجمالي الإشعارات</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:bell-ring" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ unreadNotifications }}</p>
          <p class="stat-label">غير مقروء</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:mail-open" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ readNotifications }}</p>
          <p class="stat-label">مقروء</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:calendar" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ todayNotifications }}</p>
          <p class="stat-label">اليوم</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-container">
        <div class="search-box">
          <Icon name="lucide:search" class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="البحث في الإشعارات..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">جميع الحالات</option>
            <option value="unread">غير مقروء</option>
            <option value="read">مقروء</option>
          </select>
          
          <select v-model="typeFilter" class="filter-select">
            <option value="">جميع الأنواع</option>
            <option value="booking">حجز جديد</option>
            <option value="message">رسالة جديدة</option>
            <option value="system">نظام</option>
            <option value="alert">تنبيه</option>
          </select>

          <input 
            v-model="dateFilter" 
            type="date" 
            class="filter-select"
            placeholder="تاريخ الإشعار"
          />
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="notifications-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل الإشعارات...</p>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        <Icon name="lucide:bell-off" class="empty-icon" />
        <h3>لا توجد إشعارات</h3>
        <p>لم يتم العثور على أي إشعارات تطابق معايير البحث</p>
      </div>

      <div v-else class="notifications-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id" 
          class="notification-card"
          :class="{ 'unread': notification.status === 'unread' }"
          @click="viewNotification(notification)"
        >
          <div class="notification-icon">
            <Icon :name="getNotificationIcon(notification.type)" class="icon" />
          </div>

          <div class="notification-content">
            <div class="notification-header">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <div class="notification-meta">
                <span class="notification-type" :class="notification.type">
                  {{ getTypeText(notification.type) }}
                </span>
                <span class="notification-date">{{ formatDate(notification.created_at) }}</span>
              </div>
            </div>

            <p class="notification-message">{{ notification.message }}</p>

            <div v-if="notification.data" class="notification-data">
              <div v-if="notification.data.booking_id" class="data-item">
                <span class="data-label">رقم الحجز:</span>
                <span class="data-value">#{{ notification.data.booking_id }}</span>
              </div>
              <div v-if="notification.data.customer_name" class="data-item">
                <span class="data-label">العميل:</span>
                <span class="data-value">{{ notification.data.customer_name }}</span>
              </div>
            </div>
          </div>

          <div class="notification-actions">
            <button 
              @click.stop="toggleNotificationStatus(notification)" 
              class="action-btn status"
              :class="{ 'read': notification.status === 'read' }"
            >
              <Icon 
                :name="notification.status === 'read' ? 'lucide:mail-open' : 'lucide:mail'" 
                class="action-icon" 
              />
            </button>
            <button @click.stop="deleteNotification(notification)" class="action-btn delete">
              <Icon name="lucide:trash-2" class="action-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Details Modal -->
    <div v-if="showNotificationModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">تفاصيل الإشعار</h2>
          <button @click="closeModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <div v-if="selectedNotification" class="modal-body">
          <div class="notification-details">
            <div class="detail-header">
              <div class="detail-icon">
                <Icon :name="getNotificationIcon(selectedNotification.type)" class="icon-large" />
              </div>
              <div class="detail-info">
                <h3 class="detail-title">{{ selectedNotification.title }}</h3>
                <div class="detail-meta">
                  <span class="detail-type" :class="selectedNotification.type">
                    {{ getTypeText(selectedNotification.type) }}
                  </span>
                  <span class="detail-date">{{ formatDateTime(selectedNotification.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-content">
              <h4 class="content-title">الرسالة</h4>
              <p class="content-message">{{ selectedNotification.message }}</p>
            </div>

            <div v-if="selectedNotification.data" class="detail-data">
              <h4 class="data-title">البيانات الإضافية</h4>
              <div class="data-items">
                <div v-for="(value, key) in selectedNotification.data" :key="key" class="data-item">
                  <span class="data-label">{{ getDataLabel(key) }}:</span>
                  <span class="data-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">
            إغلاق
          </button>
          <button 
            @click="toggleNotificationStatus(selectedNotification)" 
            class="btn-primary"
          >
            <Icon 
              :name="selectedNotification?.status === 'read' ? 'lucide:mail' : 'lucide:mail-open'" 
              class="btn-icon" 
            />
            {{ selectedNotification?.status === 'read' ? 'تعيين كمقروء' : 'تعيين كمقروء' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: string
  data?: any
  created_at: string
  updated_at: string
}

const notifications = ref<Notification[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const dateFilter = ref('')
const showNotificationModal = ref(false)
const selectedNotification = ref<Notification | null>(null)

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (searchQuery.value) {
    filtered = filtered.filter(notification => 
      notification.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(notification => notification.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(notification => notification.type === typeFilter.value)
  }

  if (dateFilter.value) {
    filtered = filtered.filter(notification => 
      notification.created_at.startsWith(dateFilter.value)
    )
  }

  return filtered
})

const totalNotifications = computed(() => notifications.value.length)
const unreadNotifications = computed(() => 
  notifications.value.filter(notification => notification.status === 'unread').length
)
const readNotifications = computed(() => 
  notifications.value.filter(notification => notification.status === 'read').length
)
const todayNotifications = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return notifications.value.filter(notification => 
    notification.created_at.startsWith(today)
  ).length
})

const getTypeText = (type: string) => {
  const typeMap = {
    booking: 'حجز جديد',
    message: 'رسالة جديدة',
    system: 'نظام',
    alert: 'تنبيه'
  }
  return typeMap[type] || type
}

const getNotificationIcon = (type: string) => {
  const iconMap = {
    booking: 'lucide:calendar',
    message: 'lucide:mail',
    system: 'lucide:settings',
    alert: 'lucide:alert-triangle'
  }
  return iconMap[type] || 'lucide:bell'
}

const getDataLabel = (key: string) => {
  const labelMap = {
    booking_id: 'رقم الحجز',
    customer_name: 'اسم العميل',
    amount: 'المبلغ',
    status: 'الحالة'
  }
  return labelMap[key] || key
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'تاريخ غير صحيح'
    return date.toLocaleDateString('ar-SA')
  } catch (error) {
    return 'تاريخ غير صحيح'
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'تاريخ غير صحيح'
    return date.toLocaleString('ar-SA')
  } catch (error) {
    return 'تاريخ غير صحيح'
  }
}

const loadNotifications = async () => {
  try {
    loading.value = true
    
    // Build query parameters
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (typeFilter.value) params.append('type', typeFilter.value)
    if (searchQuery.value) params.append('search', searchQuery.value)
    
    const queryString = params.toString()
    const url = `/api/admin/notifications${queryString ? `?${queryString}` : ''}`
    
    const response = await $fetch(url)
    
    if (response.success) {
      notifications.value = response.data
    } else {
      throw new Error('Failed to load notifications')
    }
  } catch (error) {
    console.error('Error loading notifications:', error)
    // Fallback to empty array
    notifications.value = []
  } finally {
    loading.value = false
  }
}

const viewNotification = (notification: Notification) => {
  selectedNotification.value = notification
  showNotificationModal.value = true
  
  // Mark as read if unread
  if (notification.status === 'unread') {
    notification.status = 'read'
  }
}

const toggleNotificationStatus = async (notification: Notification) => {
  try {
    const newStatus = notification.status === 'read' ? 'unread' : 'read'
    
    const response = await $fetch(`/api/admin/notifications/${notification.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    
    if (response.success) {
      notification.status = newStatus
    } else {
      throw new Error('Failed to update notification status')
    }
  } catch (error) {
    console.error('Error toggling notification status:', error)
  }
}

const deleteNotification = async (notification: Notification) => {
  if (confirm(`هل أنت متأكد من حذف الإشعار "${notification.title}"؟`)) {
    try {
      const response = await $fetch(`/api/admin/notifications/${notification.id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        await loadNotifications()
      } else {
        throw new Error('Failed to delete notification')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      alert('حدث خطأ أثناء حذف الإشعار')
    }
  }
}

const markAllAsRead = async () => {
  try {
    const response = await $fetch('/api/admin/notifications/mark-all-read', {
      method: 'POST'
    })
    
    if (response.success) {
      // Reload notifications to reflect changes
      await loadNotifications()
    } else {
      throw new Error('Failed to mark all notifications as read')
    }
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

const closeModal = () => {
  showNotificationModal.value = false
  selectedNotification.value = null
}

// Load notifications on mount
onMounted(() => {
  loadNotifications()
})

// Watch for filter changes and reload notifications
watch([statusFilter, typeFilter, searchQuery], () => {
  loadNotifications()
}, { debounce: 300 })

// Set page title
useHead({
  title: 'الإشعارات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.notifications-page {
  @apply space-y-4;
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

.mark-read-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.btn-icon {
  @apply w-4 h-4;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.stat-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4 space-x-reverse;
}

.stat-icon {
  @apply w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center;
}

.stat-icon .icon {
  @apply w-6 h-6 text-purple-600;
}

.stat-content {
  @apply flex-1;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.filters-section {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.filters-container {
  @apply flex flex-col sm:flex-row gap-4;
}

.search-box {
  @apply relative flex-1;
}

.search-icon {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.filter-controls {
  @apply flex gap-3;
}

.filter-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.notifications-container {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
}

.loading-state {
  @apply flex flex-col items-center justify-center py-12;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-icon {
  @apply w-16 h-16 text-gray-400 mb-4;
}

.notifications-list {
  @apply divide-y divide-gray-200;
}

.notification-card {
  @apply p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-4 space-x-reverse;
}

.notification-card.unread {
  @apply bg-blue-50 border-r-4 border-blue-500;
}

.notification-icon {
  @apply w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.notification-icon .icon {
  @apply w-5 h-5 text-gray-600;
}

.notification-content {
  @apply flex-1;
}

.notification-header {
  @apply flex items-start justify-between mb-2;
}

.notification-title {
  @apply text-lg font-semibold text-gray-900;
}

.notification-meta {
  @apply flex flex-col items-end space-y-1;
}

.notification-type {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

.notification-type.booking {
  @apply bg-green-100 text-green-800;
}

.notification-type.message {
  @apply bg-blue-100 text-blue-800;
}

.notification-type.system {
  @apply bg-gray-100 text-gray-800;
}

.notification-type.alert {
  @apply bg-red-100 text-red-800;
}

.notification-date {
  @apply text-xs text-gray-500;
}

.notification-message {
  @apply text-sm text-gray-600 mb-3;
}

.notification-data {
  @apply space-y-1;
}

.data-item {
  @apply flex items-center space-x-2 space-x-reverse text-xs;
}

.data-label {
  @apply font-medium text-gray-600;
}

.data-value {
  @apply text-gray-900;
}

.notification-actions {
  @apply flex flex-col space-y-2;
}

.action-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg;
}

.action-btn.status:hover {
  @apply text-blue-600 bg-blue-50;
}

.action-btn.delete:hover {
  @apply text-red-600 bg-red-50;
}

.action-icon {
  @apply w-4 h-4;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900;
}

.modal-close {
  @apply p-1 text-gray-400 hover:text-gray-600 transition-colors;
}

.close-icon {
  @apply w-5 h-5;
}

.modal-body {
  @apply p-6;
}

.notification-details {
  @apply space-y-6;
}

.detail-header {
  @apply flex items-start space-x-4 space-x-reverse pb-6 border-b border-gray-200;
}

.detail-icon {
  @apply w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.icon-large {
  @apply w-8 h-8 text-gray-600;
}

.detail-info {
  @apply flex-1;
}

.detail-title {
  @apply text-xl font-semibold text-gray-900;
}

.detail-meta {
  @apply flex flex-col items-end space-y-2 mt-2;
}

.detail-type {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.detail-type.booking {
  @apply bg-green-100 text-green-800;
}

.detail-type.message {
  @apply bg-blue-100 text-blue-800;
}

.detail-type.system {
  @apply bg-gray-100 text-gray-800;
}

.detail-type.alert {
  @apply bg-red-100 text-red-800;
}

.detail-date {
  @apply text-sm text-gray-500;
}

.detail-content {
  @apply space-y-3;
}

.content-title {
  @apply text-lg font-semibold text-gray-900;
}

.content-message {
  @apply text-gray-700 leading-relaxed;
}

.detail-data {
  @apply space-y-3;
}

.data-title {
  @apply text-lg font-semibold text-gray-900;
}

.data-items {
  @apply space-y-2;
}

.modal-actions {
  @apply flex items-center justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200;
}

.btn-secondary {
  @apply px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors;
}

.btn-primary {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}
</style>
