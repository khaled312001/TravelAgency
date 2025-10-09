<template>
  <div class="bookings-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إدارة الحجوزات</h1>
          <p class="page-subtitle">إدارة جميع حجوزات العملاء</p>
        </div>
        <div class="header-right">
          <button @click="exportBookings" class="export-btn">
            <Icon name="lucide:download" class="btn-icon" />
            تصدير البيانات
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:calendar" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ totalBookings }}</p>
          <p class="stat-label">إجمالي الحجوزات</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:check-circle" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ confirmedBookings }}</p>
          <p class="stat-label">الحجوزات المؤكدة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:clock" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ pendingBookings }}</p>
          <p class="stat-label">في الانتظار</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:dollar-sign" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ formatPrice(totalRevenue) }}</p>
          <p class="stat-label">إجمالي الإيرادات</p>
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
            placeholder="البحث في الحجوزات..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">جميع الحالات</option>
            <option value="pending">في الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="cancelled">ملغي</option>
            <option value="completed">مكتمل</option>
          </select>
          
          <select v-model="packageFilter" class="filter-select">
            <option value="">جميع الباقات</option>
            <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
              {{ pkg.title }}
            </option>
          </select>

          <input 
            v-model="dateFilter" 
            type="date" 
            class="filter-select"
            placeholder="تاريخ الحجز"
          />
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bookings-table-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل الحجوزات...</p>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <Icon name="lucide:calendar" class="empty-icon" />
        <h3>لا توجد حجوزات</h3>
        <p>لم يتم العثور على أي حجوزات تطابق معايير البحث</p>
      </div>

      <div v-else class="bookings-table">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th class="table-cell">رقم الحجز</th>
              <th class="table-cell">العميل</th>
              <th class="table-cell">الباقة</th>
              <th class="table-cell">تاريخ السفر</th>
              <th class="table-cell">عدد الأشخاص</th>
              <th class="table-cell">المبلغ</th>
              <th class="table-cell">الحالة</th>
              <th class="table-cell">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="booking in filteredBookings" :key="booking.id" class="table-row">
              <td class="table-cell">
                <span class="booking-id">#{{ booking.id.slice(-8) }}</span>
              </td>
              <td class="table-cell">
                <div class="customer-info">
                  <p class="customer-name">{{ booking.customer_name }}</p>
                  <p class="customer-email">{{ booking.customer_email }}</p>
                </div>
              </td>
              <td class="table-cell">
                <div class="package-info">
                  <p class="package-name">{{ booking.package_title }}</p>
                  <p class="package-destination">{{ booking.destination }}</p>
                </div>
              </td>
              <td class="table-cell">
                <span class="travel-date">{{ formatDate(booking.travel_date) }}</span>
              </td>
              <td class="table-cell">
                <span class="participants">{{ booking.participants_count }}</span>
              </td>
              <td class="table-cell">
                <span class="amount">{{ formatPrice(booking.total_amount) }}</span>
              </td>
              <td class="table-cell">
                <span class="status-badge" :class="booking.status">
                  {{ getStatusText(booking.status) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="action-buttons">
                  <button @click="viewBooking(booking)" class="action-btn view">
                    <Icon name="lucide:eye" class="action-icon" />
                  </button>
                  <button @click="editBooking(booking)" class="action-btn edit">
                    <Icon name="lucide:edit" class="action-icon" />
                  </button>
                  <button @click="updateBookingStatus(booking)" class="action-btn status">
                    <Icon name="lucide:settings" class="action-icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showBookingModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">تفاصيل الحجز #{{ selectedBooking?.id.slice(-8) }}</h2>
          <button @click="closeModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <div v-if="selectedBooking" class="modal-body">
          <div class="booking-details-grid">
            <div class="detail-section">
              <h3 class="section-title">معلومات العميل</h3>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">الاسم:</span>
                  <span class="detail-value">{{ selectedBooking.customer_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">البريد الإلكتروني:</span>
                  <span class="detail-value">{{ selectedBooking.customer_email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">رقم الهاتف:</span>
                  <span class="detail-value">{{ selectedBooking.customer_phone }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3 class="section-title">معلومات الرحلة</h3>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">الباقة:</span>
                  <span class="detail-value">{{ selectedBooking.package_title }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">الوجهة:</span>
                  <span class="detail-value">{{ selectedBooking.destination }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">تاريخ السفر:</span>
                  <span class="detail-value">{{ formatDate(selectedBooking.travel_date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">عدد الأشخاص:</span>
                  <span class="detail-value">{{ selectedBooking.participants_count }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3 class="section-title">معلومات الدفع</h3>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">المبلغ الإجمالي:</span>
                  <span class="detail-value">{{ formatPrice(selectedBooking.total_amount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">المبلغ المدفوع:</span>
                  <span class="detail-value">{{ formatPrice(selectedBooking.paid_amount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">المبلغ المتبقي:</span>
                  <span class="detail-value">{{ formatPrice(selectedBooking.total_amount - selectedBooking.paid_amount) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3 class="section-title">حالة الحجز</h3>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">الحالة:</span>
                  <span class="status-badge" :class="selectedBooking.status">
                    {{ getStatusText(selectedBooking.status) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">تاريخ الحجز:</span>
                  <span class="detail-value">{{ formatDate(selectedBooking.created_at) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">آخر تحديث:</span>
                  <span class="detail-value">{{ formatDate(selectedBooking.updated_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedBooking.notes" class="notes-section">
            <h3 class="section-title">ملاحظات</h3>
            <p class="notes-text">{{ selectedBooking.notes }}</p>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">
            إغلاق
          </button>
          <button @click="editBooking(selectedBooking)" class="btn-primary">
            <Icon name="lucide:edit" class="btn-icon" />
            تعديل الحجز
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  package_title: string
  destination: string
  travel_date: string
  participants_count: number
  total_amount: number
  paid_amount: number
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

interface Package {
  id: string
  title: string
}

const bookings = ref<Booking[]>([])
const packages = ref<Package[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const packageFilter = ref('')
const dateFilter = ref('')
const showBookingModal = ref(false)
const selectedBooking = ref<Booking | null>(null)

const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (searchQuery.value) {
    filtered = filtered.filter(booking => 
      booking.customer_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.package_title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }

  if (packageFilter.value) {
    filtered = filtered.filter(booking => booking.package_title === packageFilter.value)
  }

  if (dateFilter.value) {
    filtered = filtered.filter(booking => 
      booking.travel_date.startsWith(dateFilter.value)
    )
  }

  return filtered
})

const totalBookings = computed(() => bookings.value.length)
const confirmedBookings = computed(() => 
  bookings.value.filter(booking => booking.status === 'confirmed').length
)
const pendingBookings = computed(() => 
  bookings.value.filter(booking => booking.status === 'pending').length
)
const totalRevenue = computed(() => 
  bookings.value.reduce((sum, booking) => sum + booking.total_amount, 0)
)

const getStatusText = (status: string) => {
  const statusMap = {
    pending: 'في الانتظار',
    confirmed: 'مؤكد',
    cancelled: 'ملغي',
    completed: 'مكتمل'
  }
  return statusMap[status] || status
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
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

const loadBookings = async () => {
  try {
    loading.value = true
    // TODO: Implement API call
    // const { data } = await $fetch('/api/admin/bookings')
    // bookings.value = data || []
    
    // Mock data for now
    bookings.value = [
      {
        id: 'booking-001',
        customer_name: 'أحمد محمد',
        customer_email: 'ahmed@example.com',
        customer_phone: '+966501234567',
        package_title: 'رحلة إلى دبي',
        destination: 'دبي، الإمارات',
        travel_date: '2024-03-15',
        participants_count: 2,
        total_amount: 5000,
        paid_amount: 2500,
        status: 'confirmed',
        notes: 'طلب غرف متجاورة',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'booking-002',
        customer_name: 'فاطمة علي',
        customer_email: 'fatima@example.com',
        customer_phone: '+966507654321',
        package_title: 'عمرة رمضان',
        destination: 'مكة المكرمة',
        travel_date: '2024-04-10',
        participants_count: 4,
        total_amount: 8000,
        paid_amount: 0,
        status: 'pending',
        created_at: '2024-01-20T14:30:00Z',
        updated_at: '2024-01-20T14:30:00Z'
      }
    ]
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    loading.value = false
  }
}

const viewBooking = (booking: Booking) => {
  selectedBooking.value = booking
  showBookingModal.value = true
}

const editBooking = (booking: Booking) => {
  // TODO: Implement edit booking
  console.log('Edit booking:', booking.id)
}

const updateBookingStatus = (booking: Booking) => {
  // TODO: Implement status update
  console.log('Update status for booking:', booking.id)
}

const exportBookings = () => {
  // TODO: Implement export functionality
  console.log('Export bookings')
}

const closeModal = () => {
  showBookingModal.value = false
  selectedBooking.value = null
}

// Load bookings on mount
onMounted(() => {
  loadBookings()
})

// Set page title
useHead({
  title: 'إدارة الحجوزات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.bookings-page {
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

.export-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors;
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

.bookings-table-container {
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

.bookings-table {
  @apply overflow-x-auto;
}

.table {
  @apply w-full;
}

.table-header {
  @apply bg-gray-50 border-b border-gray-200;
}

.table-body {
  @apply divide-y divide-gray-200;
}

.table-row {
  @apply hover:bg-gray-50 transition-colors;
}

.table-cell {
  @apply px-6 py-4 text-sm;
}

.booking-id {
  @apply font-mono text-purple-600 font-medium;
}

.customer-info {
  @apply space-y-1;
}

.customer-name {
  @apply font-medium text-gray-900;
}

.customer-email {
  @apply text-gray-500 text-xs;
}

.package-info {
  @apply space-y-1;
}

.package-name {
  @apply font-medium text-gray-900;
}

.package-destination {
  @apply text-gray-500 text-xs;
}

.travel-date {
  @apply text-gray-900;
}

.participants {
  @apply text-gray-900;
}

.amount {
  @apply font-medium text-green-600;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.status-badge.pending {
  @apply bg-yellow-100 text-yellow-800;
}

.status-badge.confirmed {
  @apply bg-green-100 text-green-800;
}

.status-badge.cancelled {
  @apply bg-red-100 text-red-800;
}

.status-badge.completed {
  @apply bg-blue-100 text-blue-800;
}

.action-buttons {
  @apply flex space-x-2 space-x-reverse;
}

.action-btn {
  @apply p-1.5 text-gray-400 hover:text-gray-600 transition-colors;
}

.action-btn.view:hover {
  @apply text-blue-600;
}

.action-btn.edit:hover {
  @apply text-green-600;
}

.action-btn.status:hover {
  @apply text-purple-600;
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

.booking-details-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.detail-section {
  @apply space-y-4;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2;
}

.detail-items {
  @apply space-y-3;
}

.detail-item {
  @apply flex justify-between items-center;
}

.detail-label {
  @apply text-sm font-medium text-gray-600;
}

.detail-value {
  @apply text-sm text-gray-900;
}

.notes-section {
  @apply mt-6 pt-6 border-t border-gray-200;
}

.notes-text {
  @apply text-sm text-gray-700 bg-gray-50 p-4 rounded-lg;
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