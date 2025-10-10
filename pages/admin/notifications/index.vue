<template>
  <div class="notifications-page">
    <div class="page-header">
      <h1 class="page-title">الإشعارات</h1>
      <p class="page-description">جميع الإشعارات والتنبيهات الخاصة بك</p>
      <div class="mt-4 flex gap-4">
        <button 
          @click="markAllAsRead" 
          :disabled="unreadCount === 0"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Icon name="lucide:check" class="w-4 h-4 mr-2" />
          تعيين الكل كمقروء
        </button>
        <button 
          @click="refreshNotifications" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
          تحديث
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100">
          <Icon name="lucide:bell" class="w-6 h-6 text-blue-600" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ totalNotifications }}</h3>
          <p class="stat-label">إجمالي الإشعارات</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-red-100">
          <Icon name="lucide:bell-ring" class="w-6 h-6 text-red-600" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ unreadCount }}</h3>
          <p class="stat-label">غير مقروءة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green-100">
          <Icon name="lucide:check-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ readCount }}</h3>
          <p class="stat-label">مقروءة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-purple-100">
          <Icon name="lucide:calendar" class="w-6 h-6 text-purple-600" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ todayCount }}</h3>
          <p class="stat-label">اليوم</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group">
          <label class="filter-label">البحث</label>
          <input
            v-model="searchQuery"
            type="text"
            class="filter-input"
            placeholder="ابحث في الإشعارات..."
          />
        </div>
        
        <div class="filter-group">
          <label class="filter-label">الحالة</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="">الكل</option>
            <option value="unread">غير مقروءة</option>
            <option value="read">مقروءة</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">النوع</label>
          <select v-model="typeFilter" class="filter-select">
            <option value="">الكل</option>
            <option value="booking">حجز</option>
            <option value="message">رسالة</option>
            <option value="system">نظام</option>
            <option value="alert">تنبيه</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">التاريخ</label>
          <select v-model="dateFilter" class="filter-select">
            <option value="">الكل</option>
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="notifications-list">
      <div v-if="loading" class="loading-state">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-blue-600" />
        <p>جاري تحميل الإشعارات...</p>
      </div>
      
      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        <Icon name="lucide:bell-off" class="w-16 h-16 text-gray-400" />
        <h3>لا توجد إشعارات</h3>
        <p>لم يتم العثور على إشعارات تطابق معايير البحث</p>
      </div>
      
      <div v-else class="notifications-grid">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :class="['notification-card', { 'unread': !notification.isRead }]"
          @click="viewNotification(notification)"
        >
          <div class="notification-icon">
            <Icon :name="getNotificationIcon(notification.type)" :class="getNotificationIconClass(notification.type)" />
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
            </div>
            
            <p class="notification-message">{{ notification.message }}</p>
            
            <div class="notification-footer">
              <span :class="['notification-type', `type-${notification.type}`]">
                {{ getNotificationTypeText(notification.type) }}
              </span>
              
              <div class="notification-actions">
                <button
                  v-if="!notification.isRead"
                  @click.stop="markAsRead(notification.id)"
                  class="action-btn read-btn"
                  title="تعيين كمقروء"
                >
                  <Icon name="lucide:check" class="w-4 h-4" />
                </button>
                
                <button
                  @click.stop="deleteNotification(notification.id)"
                  class="action-btn delete-btn"
                  title="حذف"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="!notification.isRead" class="unread-indicator"></div>
        </div>
      </div>
    </div>

    <!-- Notification Detail Modal -->
    <div v-if="selectedNotification" class="modal-overlay" @click="closeNotificationModal">
      <div class="modal-content notification-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">تفاصيل الإشعار</h2>
          <button @click="closeNotificationModal" class="modal-close">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="notification-detail">
            <div class="detail-header">
              <div class="detail-icon">
                <Icon :name="getNotificationIcon(selectedNotification.type)" :class="getNotificationIconClass(selectedNotification.type)" />
              </div>
              <div class="detail-info">
                <h3 class="detail-title">{{ selectedNotification.title }}</h3>
                <div class="detail-meta">
                  <span class="detail-type">{{ getNotificationTypeText(selectedNotification.type) }}</span>
                  <span class="detail-time">{{ formatTime(selectedNotification.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-content">
              <p class="detail-message">{{ selectedNotification.message }}</p>
              
              <div v-if="selectedNotification.data" class="detail-data">
                <h4>معلومات إضافية:</h4>
                <pre class="detail-json">{{ JSON.stringify(selectedNotification.data, null, 2) }}</pre>
              </div>
            </div>
            
            <div class="detail-actions">
              <button
                v-if="!selectedNotification.isRead"
                @click="markAsRead(selectedNotification.id)"
                class="btn btn-primary"
              >
                <Icon name="lucide:check" class="w-4 h-4 mr-2" />
                تعيين كمقروء
              </button>
              
              <button
                @click="deleteNotification(selectedNotification.id)"
                class="btn btn-danger"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
                حذف الإشعار
              </button>
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
import { ref, computed, onMounted, watch } from 'vue'

// Use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Interface for notification
interface Notification {
  id: string
  title: string
  message: string
  type: 'booking' | 'message' | 'system' | 'alert'
  isRead: boolean
  createdAt: string
  data?: any
}

// Reactive data
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const notifications = ref<Notification[]>([])
const selectedNotification = ref<Notification | null>(null)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const dateFilter = ref('')

// Computed properties
const totalNotifications = computed(() => notifications.value.length)
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
const readCount = computed(() => notifications.value.filter(n => n.isRead).length)
const todayCount = computed(() => {
  const today = new Date().toDateString()
  return notifications.value.filter(n => new Date(n.createdAt).toDateString() === today).length
})

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(n => 
      n.title.toLowerCase().includes(query) || 
      n.message.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(n => {
      if (statusFilter.value === 'read') return n.isRead
      if (statusFilter.value === 'unread') return !n.isRead
      return true
    })
  }

  // Type filter
  if (typeFilter.value) {
    filtered = filtered.filter(n => n.type === typeFilter.value)
  }

  // Date filter
  if (dateFilter.value) {
    const now = new Date()
    filtered = filtered.filter(n => {
      const notificationDate = new Date(n.createdAt)
      switch (dateFilter.value) {
        case 'today':
          return notificationDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return notificationDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return notificationDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Helper functions
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'booking': return 'lucide:calendar'
    case 'message': return 'lucide:message-circle'
    case 'system': return 'lucide:settings'
    case 'alert': return 'lucide:alert-triangle'
    default: return 'lucide:bell'
  }
}

const getNotificationIconClass = (type: string) => {
  switch (type) {
    case 'booking': return 'w-6 h-6 text-green-600'
    case 'message': return 'w-6 h-6 text-blue-600'
    case 'system': return 'w-6 h-6 text-gray-600'
    case 'alert': return 'w-6 h-6 text-red-600'
    default: return 'w-6 h-6 text-gray-600'
  }
}

const getNotificationTypeText = (type: string) => {
  switch (type) {
    case 'booking': return 'حجز'
    case 'message': return 'رسالة'
    case 'system': return 'نظام'
    case 'alert': return 'تنبيه'
    default: return 'عام'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} دقيقة`
  if (hours < 24) return `منذ ${hours} ساعة`
  if (days < 7) return `منذ ${days} يوم`
  
  return date.toLocaleDateString('ar-SA')
}

// Main functions
const loadNotifications = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (typeFilter.value) params.append('type', typeFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)
    
    const response = await $fetch(`/api/admin/notifications?${params.toString()}`)
    
    if (response.success && response.notifications) {
      notifications.value = response.notifications.map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        isRead: notification.is_read,
        createdAt: notification.created_at,
        data: notification.data
      }))
    } else {
      throw new Error('Failed to load notifications')
    }
  } catch (error) {
    console.error('Error loading notifications:', error)
    errorMessage.value = 'حدث خطأ أثناء تحميل الإشعارات'
  } finally {
    loading.value = false
  }
}

const viewNotification = (notification: Notification) => {
  selectedNotification.value = notification
  if (!notification.isRead) {
    markAsRead(notification.id)
  }
}

const markAsRead = async (id: string) => {
  try {
    const response = await $fetch(`/api/admin/notifications/${id}/read`, {
      method: 'PATCH'
    })
    
    if (response.success) {
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.isRead = true
      }
      successMessage.value = 'تم تعيين الإشعار كمقروء'
      setTimeout(() => successMessage.value = '', 3000)
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    errorMessage.value = 'حدث خطأ أثناء تعيين الإشعار كمقروء'
  }
}

const markAllAsRead = async () => {
  try {
    const response = await $fetch('/api/admin/notifications/mark-all-read', {
      method: 'PATCH'
    })
    
    if (response.success) {
      notifications.value.forEach(n => n.isRead = true)
      successMessage.value = 'تم تعيين جميع الإشعارات كمقروءة'
      setTimeout(() => successMessage.value = '', 3000)
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    errorMessage.value = 'حدث خطأ أثناء تعيين جميع الإشعارات كمقروءة'
  }
}

const deleteNotification = async (id: string) => {
  if (confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
    try {
    const response = await $fetch(`/api/admin/notifications/${id}`, {
      method: 'DELETE'
    }) as { success: boolean }
    
    if (response.success) {
        notifications.value = notifications.value.filter(n => n.id !== id)
        if (selectedNotification.value?.id === id) {
          selectedNotification.value = null
        }
        successMessage.value = 'تم حذف الإشعار'
        setTimeout(() => successMessage.value = '', 3000)
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      errorMessage.value = 'حدث خطأ أثناء حذف الإشعار'
    }
  }
}

const refreshNotifications = () => {
  loadNotifications()
}

const closeNotificationModal = () => {
  selectedNotification.value = null
}

// Watch for filter changes
watch([searchQuery, statusFilter, typeFilter, dateFilter], () => {
  loadNotifications()
})

// Initialize on mount
onMounted(() => {
  loadNotifications()
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

/* Stats Cards */
.stat-card {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center gap-4;
}

.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center;
}

.stat-content {
  @apply flex-1;
}

.stat-number {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

/* Filters */
.filters-section {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-200;
}

.filters-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply block text-sm font-medium text-gray-700;
}

.filter-input,
.filter-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* Notifications List */
.notifications-list {
  @apply space-y-4;
}

.loading-state,
.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-state h3 {
  @apply text-lg font-semibold text-gray-900 mt-4;
}

.empty-state p {
  @apply text-gray-600 mt-2;
}

.notifications-grid {
  @apply space-y-4;
}

.notification-card {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md relative;
}

.notification-card.unread {
  @apply border-l-4 border-l-blue-500 bg-blue-50;
}

.notification-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center mb-4;
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

.notification-time {
  @apply text-sm text-gray-500;
}

.notification-message {
  @apply text-gray-700 mb-4;
}

.notification-footer {
  @apply flex items-center justify-between;
}

.notification-type {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.type-booking {
  @apply bg-green-100 text-green-800;
}

.type-message {
  @apply bg-blue-100 text-blue-800;
}

.type-system {
  @apply bg-gray-100 text-gray-800;
}

.type-alert {
  @apply bg-red-100 text-red-800;
}

.notification-actions {
  @apply flex gap-2;
}

.action-btn {
  @apply w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200;
}

.read-btn {
  @apply bg-green-100 text-green-600 hover:bg-green-200;
}

.delete-btn {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.unread-indicator {
  @apply absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full;
}

/* Modal */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900;
}

.modal-close {
  @apply w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors;
}

.modal-body {
  @apply p-6 overflow-y-auto;
}

/* Notification Detail */
.notification-detail {
  @apply space-y-6;
}

.detail-header {
  @apply flex items-start gap-4;
}

.detail-icon {
  @apply w-16 h-16 rounded-xl flex items-center justify-center;
}

.detail-info {
  @apply flex-1;
}

.detail-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.detail-meta {
  @apply flex items-center gap-4 text-sm text-gray-600;
}

.detail-content {
  @apply space-y-4;
}

.detail-message {
  @apply text-gray-700 leading-relaxed;
}

.detail-data {
  @apply bg-gray-50 rounded-lg p-4;
}

.detail-data h4 {
  @apply font-semibold text-gray-900 mb-2;
}

.detail-json {
  @apply text-sm text-gray-600 whitespace-pre-wrap;
}

.detail-actions {
  @apply flex gap-4 pt-4 border-t border-gray-200;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500;
}
</style>