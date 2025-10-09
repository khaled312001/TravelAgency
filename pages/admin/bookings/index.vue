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
          <button @click="showAddBookingModal = true" class="add-btn">
            <Icon name="lucide:plus" class="btn-icon" />
            إضافة حجز جديد
          </button>
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
                  <button @click="generateInvoice(booking)" class="action-btn invoice">
                    <Icon name="lucide:file-text" class="action-icon" />
                  </button>
                  <button @click="deleteBooking(booking)" class="action-btn delete">
                    <Icon name="lucide:trash" class="action-icon" />
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
const showEditBookingModal = ref(false)
const showAddBookingModal = ref(false)
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
    
    // Build query parameters
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (packageFilter.value) params.append('package_id', packageFilter.value)
    if (dateFilter.value) params.append('date_from', dateFilter.value)
    if (searchQuery.value) params.append('search', searchQuery.value)
    
    const queryString = params.toString()
    const url = `/api/admin/bookings${queryString ? `?${queryString}` : ''}`
    
    const response = await $fetch(url)
    
    if (response.success && response.bookings) {
      bookings.value = response.bookings
    } else {
      bookings.value = []
    }
  } catch (error) {
    console.error('Error loading bookings:', error)
    bookings.value = []
  } finally {
    loading.value = false
  }
}

const viewBooking = (booking: Booking) => {
  selectedBooking.value = booking
  showBookingModal.value = true
}

const editBooking = (booking: Booking) => {
  selectedBooking.value = booking
  showEditBookingModal.value = true
}

const generateInvoice = async (booking: Booking) => {
  try {
    const response = await $fetch(`/api/admin/bookings/${booking.id}/invoice`)
    if (response.success) {
      // Open invoice in new window
      const invoiceWindow = window.open('', '_blank')
      if (invoiceWindow) {
        invoiceWindow.document.write(generateInvoiceHTML(response.invoice))
        invoiceWindow.document.close()
      }
    }
  } catch (error) {
    console.error('Error generating invoice:', error)
    alert('حدث خطأ أثناء إنشاء الفاتورة')
  }
}

const deleteBooking = async (booking: Booking) => {
  if (confirm(`هل أنت متأكد من حذف حجز ${booking.customer_name}؟`)) {
    try {
      const response = await $fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        alert('تم حذف الحجز بنجاح')
        loadBookings() // Reload bookings
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('حدث خطأ أثناء حذف الحجز')
    }
  }
}

const exportBookings = () => {
  // TODO: Implement export functionality
  console.log('Export bookings')
}

const closeModal = () => {
  showBookingModal.value = false
  showEditBookingModal.value = false
  showAddBookingModal.value = false
  selectedBooking.value = null
}

const generateInvoiceHTML = (invoice: any) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة ${invoice.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .invoice { background: white; max-width: 800px; margin: 0 auto; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; }
        .company-info { margin-bottom: 20px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-info, .invoice-meta { flex: 1; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { padding: 12px; text-align: right; border: 1px solid #ddd; }
        .table th { background: #f8f9fa; font-weight: bold; }
        .totals { text-align: left; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-row.final { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; margin-top: 10px; padding-top: 15px; }
        .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .status.confirmed { background: #d4edda; color: #155724; }
        .status.pending { background: #fff3cd; color: #856404; }
        .status.completed { background: #cce5ff; color: #004085; }
        .status.cancelled { background: #f8d7da; color: #721c24; }
        @media print { body { background: white; } .invoice { box-shadow: none; } }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <h1>فاتورة</h1>
          <h2>${invoice.company.name}</h2>
          <p>${invoice.company.address}</p>
          <p>هاتف: ${invoice.company.phone} | بريد إلكتروني: ${invoice.company.email}</p>
          <p>الرقم الضريبي: ${invoice.company.tax_number} | رقم الترخيص: ${invoice.company.license_number}</p>
        </div>
        
        <div class="invoice-details">
          <div class="customer-info">
            <h3>بيانات العميل:</h3>
            <p><strong>الاسم:</strong> ${invoice.customer.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${invoice.customer.email}</p>
            <p><strong>رقم الهاتف:</strong> ${invoice.customer.phone}</p>
          </div>
          <div class="invoice-meta">
            <h3>بيانات الفاتورة:</h3>
            <p><strong>رقم الفاتورة:</strong> ${invoice.invoice_number}</p>
            <p><strong>تاريخ الفاتورة:</strong> ${invoice.invoice_date}</p>
            <p><strong>تاريخ الاستحقاق:</strong> ${invoice.due_date}</p>
            <p><strong>رقم الحجز:</strong> ${invoice.booking.id}</p>
          </div>
        </div>
        
        <div class="booking-details">
          <h3>تفاصيل الحجز:</h3>
          <p><strong>الباقة:</strong> ${invoice.booking.package_title}</p>
          <p><strong>الوجهة:</strong> ${invoice.booking.destination}</p>
          <p><strong>تاريخ السفر:</strong> ${invoice.booking.travel_date}</p>
          <p><strong>عدد الأشخاص:</strong> ${invoice.booking.participants_count}</p>
          <p><strong>حالة الحجز:</strong> <span class="status ${invoice.status}">${getStatusText(invoice.status)}</span></p>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>الوصف</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.unit_price)}</td>
                <td>${formatPrice(item.total_price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>المجموع الفرعي:</span>
            <span>${formatPrice(invoice.totals.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>ضريبة القيمة المضافة (${invoice.totals.tax_rate}%):</span>
            <span>${formatPrice(invoice.totals.tax_amount)}</span>
          </div>
          <div class="total-row">
            <span>المبلغ المدفوع:</span>
            <span>${formatPrice(invoice.totals.paid_amount)}</span>
          </div>
          <div class="total-row final">
            <span>المبلغ المستحق:</span>
            <span>${formatPrice(invoice.totals.balance_due)}</span>
          </div>
        </div>
        
        ${invoice.notes ? `
          <div class="notes">
            <h3>ملاحظات:</h3>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.9em;">
          <p>شكراً لاختياركم وكالة أرض العجائب للسفر</p>
          <p>للاستفسارات: ${invoice.company.phone} | ${invoice.company.email}</p>
        </div>
      </div>
      
      <script>
        function formatPrice(price) {
          return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR'
          }).format(price);
        }
        
        function getStatusText(status) {
          const statusMap = {
            pending: 'في الانتظار',
            confirmed: 'مؤكد',
            cancelled: 'ملغي',
            completed: 'مكتمل'
          };
          return statusMap[status] || status;
        }
        
        // Auto print when loaded
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 1000);
        };
      </script>
    </body>
    </html>
  `
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

.add-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
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

.action-btn.invoice:hover {
  @apply text-blue-600;
}

.action-btn.delete:hover {
  @apply text-red-600;
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