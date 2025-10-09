<template>
  <div class="messages-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إدارة الرسائل</h1>
          <p class="page-subtitle">إدارة رسائل التواصل من العملاء</p>
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
          <Icon name="lucide:mail" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ totalMessages }}</p>
          <p class="stat-label">إجمالي الرسائل</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:mail-open" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ unreadMessages }}</p>
          <p class="stat-label">الرسائل غير المقروءة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:reply" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ repliedMessages }}</p>
          <p class="stat-label">الرسائل المجابة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:clock" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ pendingMessages }}</p>
          <p class="stat-label">في الانتظار</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="filters-container">
        <div class="search-box">
          <Icon name="lucide:search" class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="البحث في الرسائل..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">جميع الحالات</option>
            <option value="unread">غير مقروء</option>
            <option value="read">مقروء</option>
            <option value="replied">مجاب</option>
            <option value="pending">في الانتظار</option>
          </select>
          
          <select v-model="typeFilter" class="filter-select">
            <option value="">جميع الأنواع</option>
            <option value="inquiry">استفسار</option>
            <option value="complaint">شكوى</option>
            <option value="suggestion">اقتراح</option>
            <option value="booking">حجز</option>
          </select>

          <input 
            v-model="dateFilter" 
            type="date" 
            class="filter-select"
            placeholder="تاريخ الرسالة"
          />
        </div>
      </div>
    </div>

    <!-- Messages List -->
    <div class="messages-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل الرسائل...</p>
      </div>

      <div v-else-if="filteredMessages.length === 0" class="empty-state">
        <Icon name="lucide:mail" class="empty-icon" />
        <h3>لا توجد رسائل</h3>
        <p>لم يتم العثور على أي رسائل تطابق معايير البحث</p>
      </div>

      <div v-else class="messages-list">
        <div 
          v-for="message in filteredMessages" 
          :key="message.id" 
          class="message-card"
          :class="{ 'unread': message.status === 'unread' }"
          @click="viewMessage(message)"
        >
          <div class="message-header">
            <div class="sender-info">
              <div class="sender-avatar">
                <Icon name="lucide:user" class="avatar-icon" />
              </div>
              <div class="sender-details">
                <h3 class="sender-name">{{ message.sender_name }}</h3>
                <p class="sender-email">{{ message.sender_email }}</p>
              </div>
            </div>
            
            <div class="message-meta">
              <span class="message-type" :class="message.type">
                {{ getTypeText(message.type) }}
              </span>
              <span class="message-date">{{ formatDate(message.created_at) }}</span>
            </div>
          </div>

          <div class="message-content">
            <h4 class="message-subject">{{ message.subject }}</h4>
            <p class="message-preview">{{ message.message }}</p>
          </div>

          <div class="message-footer">
            <div class="message-status">
              <span class="status-badge" :class="message.status">
                {{ getStatusText(message.status) }}
              </span>
            </div>
            
            <div class="message-actions">
              <button @click.stop="replyToMessage(message)" class="action-btn reply">
                <Icon name="lucide:reply" class="action-icon" />
                رد
              </button>
              <button @click.stop="deleteMessage(message)" class="action-btn delete">
                <Icon name="lucide:trash-2" class="action-icon" />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Details Modal -->
    <div v-if="showMessageModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">تفاصيل الرسالة</h2>
          <button @click="closeModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <div v-if="selectedMessage" class="modal-body">
          <div class="message-details">
            <div class="message-header-detail">
              <div class="sender-info-detail">
                <div class="sender-avatar-large">
                  <Icon name="lucide:user" class="avatar-icon-large" />
                </div>
                <div class="sender-details-large">
                  <h3 class="sender-name-large">{{ selectedMessage.sender_name }}</h3>
                  <p class="sender-email-large">{{ selectedMessage.sender_email }}</p>
                  <p class="sender-phone">{{ selectedMessage.sender_phone }}</p>
                </div>
              </div>
              
              <div class="message-meta-detail">
                <span class="message-type-large" :class="selectedMessage.type">
                  {{ getTypeText(selectedMessage.type) }}
                </span>
                <span class="message-date-large">{{ formatDateTime(selectedMessage.created_at) }}</span>
              </div>
            </div>

            <div class="message-content-detail">
              <h4 class="message-subject-large">{{ selectedMessage.subject }}</h4>
              <div class="message-text">
                {{ selectedMessage.message }}
              </div>
            </div>

            <div v-if="selectedMessage.replies && selectedMessage.replies.length > 0" class="replies-section">
              <h4 class="replies-title">الردود</h4>
              <div class="replies-list">
                <div v-for="reply in selectedMessage.replies" :key="reply.id" class="reply-item">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.author_name }}</span>
                    <span class="reply-date">{{ formatDateTime(reply.created_at) }}</span>
                  </div>
                  <div class="reply-content">{{ reply.message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">
            إغلاق
          </button>
          <button @click="replyToMessage(selectedMessage)" class="btn-primary">
            <Icon name="lucide:reply" class="btn-icon" />
            رد على الرسالة
          </button>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="showReplyModal" class="modal-overlay" @click="closeReplyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">رد على الرسالة</h2>
          <button @click="closeReplyModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <form @submit.prevent="sendReply" class="modal-form">
          <div class="form-group">
            <label class="form-label">الرد *</label>
            <textarea 
              v-model="replyForm.message" 
              class="form-textarea"
              rows="6"
              required
              placeholder="اكتب ردك هنا..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeReplyModal" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" class="btn-primary" :disabled="sendingReply">
              <Icon v-if="sendingReply" name="lucide:loader-2" class="btn-icon animate-spin" />
              <Icon v-else name="lucide:send" class="btn-icon" />
              {{ sendingReply ? 'جاري الإرسال...' : 'إرسال الرد' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: string
  sender_name: string
  sender_email: string
  sender_phone?: string
  subject: string
  message: string
  type: string
  status: string
  created_at: string
  updated_at: string
  replies?: Reply[]
}

interface Reply {
  id: string
  author_name: string
  message: string
  created_at: string
}

const messages = ref<Message[]>([])
const loading = ref(true)
const sendingReply = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const dateFilter = ref('')
const showMessageModal = ref(false)
const showReplyModal = ref(false)
const selectedMessage = ref<Message | null>(null)

const replyForm = ref({
  message: ''
})

const filteredMessages = computed(() => {
  let filtered = messages.value

  if (searchQuery.value) {
    filtered = filtered.filter(message => 
      message.sender_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.sender_email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(message => message.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(message => message.type === typeFilter.value)
  }

  if (dateFilter.value) {
    filtered = filtered.filter(message => 
      message.created_at.startsWith(dateFilter.value)
    )
  }

  return filtered
})

const totalMessages = computed(() => messages.value.length)
const unreadMessages = computed(() => 
  messages.value.filter(message => message.status === 'unread').length
)
const repliedMessages = computed(() => 
  messages.value.filter(message => message.status === 'replied').length
)
const pendingMessages = computed(() => 
  messages.value.filter(message => message.status === 'pending').length
)

const getStatusText = (status: string) => {
  const statusMap = {
    unread: 'غير مقروء',
    read: 'مقروء',
    replied: 'مجاب',
    pending: 'في الانتظار'
  }
  return statusMap[status] || status
}

const getTypeText = (type: string) => {
  const typeMap = {
    inquiry: 'استفسار',
    complaint: 'شكوى',
    suggestion: 'اقتراح',
    booking: 'حجز'
  }
  return typeMap[type] || type
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

const loadMessages = async () => {
  try {
    loading.value = true
    
    // Build query parameters
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (searchQuery.value) params.append('search', searchQuery.value)
    
    const queryString = params.toString()
    const url = `/api/admin/contact-messages${queryString ? `?${queryString}` : ''}`
    
    const response = await $fetch(url)
    
    if (response.success) {
      messages.value = response.data.map((msg: any) => ({
        id: msg.id,
        sender_name: msg.name,
        sender_email: msg.email,
        sender_phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        type: msg.type,
        status: msg.status,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        package_name: msg.package_name
      }))
    } else {
      throw new Error('Failed to load messages')
    }
  } catch (error) {
    console.error('Error loading messages:', error)
    // Fallback to empty array
    messages.value = []
  } finally {
    loading.value = false
  }
}

const viewMessage = (message: Message) => {
  selectedMessage.value = message
  showMessageModal.value = true
  
  // Mark as read if unread
  if (message.status === 'unread') {
    message.status = 'read'
  }
}

const replyToMessage = (message: Message) => {
  selectedMessage.value = message
  showReplyModal.value = true
  replyForm.value.message = ''
}

const sendReply = async () => {
  try {
    sendingReply.value = true
    
    // Update message status to replied
    if (selectedMessage.value) {
      const response = await $fetch(`/api/admin/contact-messages/${selectedMessage.value.id}`, {
        method: 'PUT',
        body: {
          status: 'replied'
        }
      })
      
      if (response.success) {
        selectedMessage.value.status = 'replied'
        // Reload messages to reflect changes
        await loadMessages()
      }
    }
    
    closeReplyModal()
  } catch (error) {
    console.error('Error sending reply:', error)
  } finally {
    sendingReply.value = false
  }
}

const deleteMessage = async (message: Message) => {
  if (confirm(`هل أنت متأكد من حذف الرسالة من ${message.sender_name}؟`)) {
    try {
      const response = await $fetch(`/api/admin/contact-messages/${message.id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        await loadMessages()
      } else {
        throw new Error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('حدث خطأ أثناء حذف الرسالة')
    }
  }
}

const markAllAsRead = async () => {
  try {
    // Update all unread messages to read
    const unreadMessages = messages.value.filter(msg => msg.status === 'unread')
    
    for (const message of unreadMessages) {
      await $fetch(`/api/admin/contact-messages/${message.id}`, {
        method: 'PUT',
        body: {
          status: 'read'
        }
      })
    }
    
    // Reload messages to reflect changes
    await loadMessages()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

const closeModal = () => {
  showMessageModal.value = false
  selectedMessage.value = null
}

const closeReplyModal = () => {
  showReplyModal.value = false
  selectedMessage.value = null
  replyForm.value.message = ''
}

// Load messages on mount
onMounted(() => {
  loadMessages()
})

// Watch for filter changes and reload messages
watch([statusFilter, searchQuery], () => {
  loadMessages()
}, { debounce: 300 })

// Set page title
useHead({
  title: 'إدارة الرسائل - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.messages-page {
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

.messages-container {
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

.messages-list {
  @apply divide-y divide-gray-200;
}

.message-card {
  @apply p-6 hover:bg-gray-50 transition-colors cursor-pointer;
}

.message-card.unread {
  @apply bg-blue-50 border-r-4 border-blue-500;
}

.message-header {
  @apply flex items-start justify-between mb-4;
}

.sender-info {
  @apply flex items-center space-x-3 space-x-reverse;
}

.sender-avatar {
  @apply w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center;
}

.avatar-icon {
  @apply w-5 h-5 text-gray-600;
}

.sender-details {
  @apply flex-1;
}

.sender-name {
  @apply text-sm font-medium text-gray-900;
}

.sender-email {
  @apply text-xs text-gray-500;
}

.message-meta {
  @apply flex flex-col items-end space-y-1;
}

.message-type {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

.message-type.inquiry {
  @apply bg-blue-100 text-blue-800;
}

.message-type.complaint {
  @apply bg-red-100 text-red-800;
}

.message-type.suggestion {
  @apply bg-green-100 text-green-800;
}

.message-type.booking {
  @apply bg-purple-100 text-purple-800;
}

.message-date {
  @apply text-xs text-gray-500;
}

.message-content {
  @apply mb-4;
}

.message-subject {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.message-preview {
  @apply text-sm text-gray-600 line-clamp-2;
}

.message-footer {
  @apply flex items-center justify-between;
}

.message-status {
  @apply flex-1;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.status-badge.unread {
  @apply bg-blue-100 text-blue-800;
}

.status-badge.read {
  @apply bg-gray-100 text-gray-800;
}

.status-badge.replied {
  @apply bg-green-100 text-green-800;
}

.status-badge.pending {
  @apply bg-yellow-100 text-yellow-800;
}

.message-actions {
  @apply flex space-x-2 space-x-reverse;
}

.action-btn {
  @apply flex items-center space-x-1 space-x-reverse px-3 py-1.5 text-xs font-medium rounded-lg transition-colors;
}

.action-btn.reply {
  @apply text-blue-600 bg-blue-100 hover:bg-blue-200;
}

.action-btn.delete {
  @apply text-red-600 bg-red-100 hover:bg-red-200;
}

.action-icon {
  @apply w-3 h-3;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto;
}

.modal-content.large {
  @apply max-w-4xl;
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

.message-details {
  @apply space-y-6;
}

.message-header-detail {
  @apply flex items-start justify-between pb-6 border-b border-gray-200;
}

.sender-info-detail {
  @apply flex items-center space-x-4 space-x-reverse;
}

.sender-avatar-large {
  @apply w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center;
}

.avatar-icon-large {
  @apply w-8 h-8 text-gray-600;
}

.sender-details-large {
  @apply flex-1;
}

.sender-name-large {
  @apply text-lg font-semibold text-gray-900;
}

.sender-email-large {
  @apply text-sm text-gray-600;
}

.sender-phone {
  @apply text-sm text-gray-500;
}

.message-meta-detail {
  @apply flex flex-col items-end space-y-2;
}

.message-type-large {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.message-type-large.inquiry {
  @apply bg-blue-100 text-blue-800;
}

.message-type-large.complaint {
  @apply bg-red-100 text-red-800;
}

.message-type-large.suggestion {
  @apply bg-green-100 text-green-800;
}

.message-type-large.booking {
  @apply bg-purple-100 text-purple-800;
}

.message-date-large {
  @apply text-sm text-gray-500;
}

.message-content-detail {
  @apply space-y-4;
}

.message-subject-large {
  @apply text-xl font-semibold text-gray-900;
}

.message-text {
  @apply text-gray-700 leading-relaxed;
}

.replies-section {
  @apply pt-6 border-t border-gray-200;
}

.replies-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.replies-list {
  @apply space-y-4;
}

.reply-item {
  @apply bg-gray-50 rounded-lg p-4;
}

.reply-header {
  @apply flex items-center justify-between mb-2;
}

.reply-author {
  @apply text-sm font-medium text-gray-900;
}

.reply-date {
  @apply text-xs text-gray-500;
}

.reply-content {
  @apply text-sm text-gray-700;
}

.modal-form {
  @apply p-6;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none;
}

.modal-actions {
  @apply flex items-center justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200;
}

.btn-secondary {
  @apply px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors;
}

.btn-primary {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50;
}

.btn-primary:disabled {
  @apply cursor-not-allowed;
}
</style>