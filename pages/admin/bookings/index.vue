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
        <p class="text-sm text-gray-500 mt-2">إجمالي الحجوزات: {{ totalBookings }}</p>
        <button @click="loadBookings" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          إعادة تحميل الحجوزات
        </button>
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
            <Icon name="lucide:x" class="btn-icon" />
            إغلاق
          </button>
          <button @click="generateInvoice(selectedBooking)" class="btn-invoice">
            <Icon name="lucide:file-text" class="btn-icon" />
            طباعة الفاتورة
          </button>
          <button @click="editBooking(selectedBooking)" class="btn-edit">
            <Icon name="lucide:edit" class="btn-icon" />
            تعديل الحجز
          </button>
          <button @click="deleteBooking(selectedBooking)" class="btn-delete">
            <Icon name="lucide:trash" class="btn-icon" />
            حذف الحجز
          </button>
        </div>
      </div>
    </div>

    <!-- Add Booking Modal -->
    <div v-if="showAddBookingModal" class="modal-overlay" @click="showAddBookingModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">إضافة حجز جديد</h2>
          <button @click="showAddBookingModal = false" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitNewBooking" class="booking-form">
            <div class="form-grid">
              <div class="form-section">
                <h3 class="section-title">معلومات العميل</h3>
                <div class="form-group">
                  <label class="form-label">اسم العميل *</label>
                  <input v-model="newBooking.customer_name" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">البريد الإلكتروني *</label>
                  <input v-model="newBooking.customer_email" type="email" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">رقم الهاتف *</label>
                  <input v-model="newBooking.customer_phone" type="tel" class="form-input" required />
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">معلومات الرحلة</h3>
                <div class="form-group">
                  <label class="form-label">الباقة *</label>
                  <select v-model="newBooking.package_id" class="form-input" required>
                    <option value="">اختر الباقة</option>
                    <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                      {{ pkg.title }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">الوجهة *</label>
                  <input v-model="newBooking.destination" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">تاريخ السفر *</label>
                  <input v-model="newBooking.travel_date" type="date" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">عدد الأشخاص *</label>
                  <input v-model="newBooking.participants_count" type="number" min="1" class="form-input" required />
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">معلومات الدفع</h3>
                <div class="form-group">
                  <label class="form-label">المبلغ الإجمالي *</label>
                  <input v-model="newBooking.total_price" type="number" min="0" step="0.01" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">المبلغ المدفوع</label>
                  <input v-model="newBooking.paid_amount" type="number" min="0" step="0.01" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">الحالة *</label>
                  <select v-model="newBooking.status" class="form-input" required>
                    <option value="pending">في الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="cancelled">ملغي</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">ملاحظات</label>
                  <textarea v-model="newBooking.notes" class="form-input" rows="3"></textarea>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showAddBookingModal = false" class="btn-secondary">
                إلغاء
              </button>
              <button type="submit" class="btn-primary">
                <Icon name="lucide:save" class="btn-icon" />
                حفظ الحجز
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Booking Modal -->
    <div v-if="showEditBookingModal" class="modal-overlay" @click="showEditBookingModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">تعديل الحجز #{{ editingBooking?.id.slice(-8) }}</h2>
          <button @click="showEditBookingModal = false" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateBooking" class="space-y-6">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">اسم العميل *</label>
                <input 
                  v-model="editingBooking.customer_name" 
                  type="text" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني *</label>
                <input 
                  v-model="editingBooking.customer_email" 
                  type="email" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">رقم الهاتف *</label>
                <input 
                  v-model="editingBooking.customer_phone" 
                  type="tel" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">الباقة *</label>
                <select v-model="editingBooking.package_id" class="form-input" required>
                  <option value="">اختر الباقة</option>
                  <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                    {{ pkg.title }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">الوجهة</label>
                <input 
                  v-model="editingBooking.destination" 
                  type="text" 
                  class="form-input" 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">تاريخ السفر *</label>
                <input 
                  v-model="editingBooking.travel_date" 
                  type="date" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">عدد المشاركين *</label>
                <input 
                  v-model.number="editingBooking.participants_count" 
                  type="number" 
                  min="1" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">المبلغ الإجمالي *</label>
                <input 
                  v-model.number="editingBooking.total_amount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  class="form-input" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">المبلغ المدفوع</label>
                <input 
                  v-model.number="editingBooking.paid_amount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  class="form-input" 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">حالة الحجز *</label>
                <select v-model="editingBooking.status" class="form-input" required>
                  <option value="pending">في الانتظار</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="cancelled">ملغي</option>
                  <option value="completed">مكتمل</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">ملاحظات</label>
              <textarea 
                v-model="editingBooking.notes" 
                class="form-input" 
                rows="3"
                placeholder="أي ملاحظات إضافية..."
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showEditBookingModal = false" class="btn-secondary">
                <Icon name="lucide:x" class="btn-icon" />
                إلغاء
              </button>
              <button type="submit" class="btn-primary">
                <Icon name="lucide:save" class="btn-icon" />
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <div v-if="showInvoiceModal" class="modal-overlay" @click="showInvoiceModal = false">
      <div class="modal-content invoice-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">فاتورة الحجز</h2>
          <button @click="showInvoiceModal = false" class="modal-close">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="invoice-actions">
            <button @click="downloadInvoicePDF" class="btn-primary">
              <Icon name="lucide:download" class="btn-icon" />
              تحميل PDF
            </button>
            <button @click="showInvoiceModal = false" class="btn-secondary">
              <Icon name="lucide:x" class="btn-icon" />
              إغلاق
            </button>
          </div>
          
          <!-- Invoice Preview -->
          <div class="invoice-preview">
            <InvoiceTemplate 
              v-if="currentInvoiceData" 
              :invoice-data="currentInvoiceData" 
              :show="true"
            />
          </div>
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
const showInvoiceModal = ref(false)
const selectedBooking = ref<Booking | null>(null)
const currentInvoiceData = ref<any>(null)
const editingBooking = ref<Booking | null>(null)

const newBooking = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  package_id: '',
  package_title: '',
  destination: '',
  travel_date: '',
  participants_count: 1,
  total_price: 0,
  paid_amount: 0,
  status: 'pending',
  notes: ''
})

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
    filtered = filtered.filter(booking => booking.package_id === packageFilter.value)
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

const loadPackages = async () => {
  try {
    const response = await $fetch('/api/admin/packages')
    if (response.success && response.packages) {
      packages.value = response.packages.map((pkg: any) => ({
        id: pkg.id,
        title: pkg.title
      }))
    }
  } catch (error) {
    console.error('Error loading packages:', error)
    packages.value = []
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
  // Close the details modal if open
  showBookingModal.value = false
  
  // Set the booking to edit
  editingBooking.value = { ...booking }
  showEditBookingModal.value = true
}

const generateInvoice = async (booking: Booking) => {
  try {
    // Prepare invoice data
    const invoiceData = {
      invoiceNumber: `INV-${booking.id.slice(-8).toUpperCase()}`,
      issueDate: new Date().toLocaleDateString('ar-SA'),
      travelDate: new Date(booking.travel_date).toLocaleDateString('ar-SA'),
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      packageTitle: booking.package_title,
      destination: booking.destination,
      packageDescription: `باقة سفر إلى ${booking.destination} تشمل الإقامة والوجبات والجولات السياحية`,
      participantsCount: booking.participants_count,
      unitPrice: booking.total_amount / booking.participants_count,
      subtotal: booking.total_amount,
      discount: 0,
      tax: booking.total_amount * 0.15, // 15% VAT
      taxRate: 15,
      totalAmount: booking.total_amount * 1.15,
      paidAmount: booking.paid_amount,
      remainingAmount: (booking.total_amount * 1.15) - booking.paid_amount,
      paymentStatus: booking.status,
      paymentDueDate: 7,
      notes: booking.notes || ''
    }
    
    // Show invoice template
    selectedBooking.value = booking
    showInvoiceModal.value = true
    currentInvoiceData.value = invoiceData
    
  } catch (error) {
    console.error('Error generating invoice:', error)
    alert('حدث خطأ أثناء إنشاء الفاتورة')
  }
}

const downloadInvoicePDF = async () => {
  try {
    // Wait for DOM to be ready
    await nextTick()
    
    const html2pdf = (await import('html2pdf.js')).default
    
    // Function to wait for element to be available and visible
    const waitForElement = (selector: string, timeout = 10000) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now()
        
        const checkElement = () => {
          const element = document.querySelector(selector)
          if (element && element.offsetParent !== null) {
            // Element exists and is visible
            resolve(element)
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Element ${selector} not found or not visible within ${timeout}ms`))
          } else {
            setTimeout(checkElement, 200)
          }
        }
        
        checkElement()
      })
    }
    
    try {
      // Ensure the modal is visible first
      if (!showInvoiceModal.value) {
        alert('يرجى عرض الفاتورة أولاً قبل تحميلها')
        return
      }
      
      // Wait for the invoice content to be available and visible
      const element = await waitForElement('#invoice-content')
      
      // Additional check to ensure element has content
      if (!element.innerHTML.trim()) {
        throw new Error('Invoice content is empty')
      }
      
      // Force element to be visible for PDF generation
      element.style.display = 'block'
      element.style.visibility = 'visible'
      element.style.position = 'static'
      element.style.left = 'auto'
      element.style.top = 'auto'
      element.style.width = '100%'
      element.style.height = 'auto'
      
      // Also ensure parent container is visible
      const container = element.closest('.invoice-container')
      if (container) {
        container.style.display = 'block'
        container.style.visibility = 'visible'
        container.style.position = 'static'
        container.style.left = 'auto'
        container.style.top = 'auto'
      }
      
      const opt = {
        margin: 0.5,
        filename: `فاتورة-${currentInvoiceData.value?.invoiceNumber || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      await html2pdf().set(opt).from(element).save()
      
      // Close modal after successful download
      showInvoiceModal.value = false
      
    } catch (elementError) {
      console.error('Element not found:', elementError)
      alert('لم يتم العثور على محتوى الفاتورة. يرجى التأكد من أن الفاتورة معروضة بشكل صحيح.')
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('حدث خطأ أثناء إنشاء ملف PDF')
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

const exportBookings = async () => {
  // Show export options modal
  const format = await showExportOptions()
  if (!format) return
  
  try {
    loading.value = true
    
    // Prepare bookings data for export
    const exportData = bookings.value.map(booking => ({
      id: booking.id,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      package_title: booking.package_title,
      destination: booking.destination,
      travel_date: booking.travel_date,
      num_travelers: booking.num_travelers,
      price: booking.price,
      status: booking.status,
      payment_status: booking.payment_status,
      created_at: booking.created_at
    }))
    
    if (format === 'excel') {
      await exportBookingsToExcel(exportData)
    } else if (format === 'pdf') {
      await exportBookingsToPDF(exportData)
    }
    
  } catch (error) {
    console.error('Export error:', error)
    alert('حدث خطأ أثناء التصدير')
  } finally {
    loading.value = false
  }
}

const showExportOptions = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">اختر تنسيق التصدير</h3>
        <div class="space-y-3">
          <button 
            class="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            onclick="this.closest('.fixed').remove(); window.exportFormat = 'excel'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            تصدير Excel
          </button>
          <button 
            class="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            onclick="this.closest('.fixed').remove(); window.exportFormat = 'pdf'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
            </svg>
            تصدير PDF
          </button>
          <button 
            class="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onclick="this.closest('.fixed').remove(); window.exportFormat = null"
          >
            إلغاء
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Wait for user selection
    const checkFormat = () => {
      if (window.exportFormat !== undefined) {
        const format = window.exportFormat
        delete window.exportFormat
        document.body.removeChild(modal)
        resolve(format)
      } else {
        setTimeout(checkFormat, 100)
      }
    }
    checkFormat()
  })
}

const exportBookingsToExcel = async (data: any[]) => {
  const XLSX = await import('xlsx')
  
  const workbook = XLSX.utils.book_new()
  
  // Headers
  const headers = [
    'ID', 'اسم العميل', 'البريد الإلكتروني', 'الهاتف', 'الباقة', 
    'الوجهة', 'تاريخ السفر', 'عدد المسافرين', 'السعر', 'الحالة', 
    'حالة الدفع', 'تاريخ الإنشاء'
  ]
  
  // Data rows
  const rows = data.map(booking => [
    booking.id,
    booking.customer_name,
    booking.customer_email,
    booking.customer_phone,
    booking.package_title,
    booking.destination,
    booking.travel_date,
    booking.num_travelers,
    booking.price,
    booking.status,
    booking.payment_status,
    booking.created_at
  ])
  
  const worksheetData = [headers, ...rows]
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  
  // Auto-size columns
  const colWidths = headers.map(() => ({ wch: 15 }))
  worksheet['!cols'] = colWidths
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'الحجوزات')
  
  // Download file
  const fileName = `حجوزات_أرض_العجائب_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

const exportBookingsToPDF = async (data: any[]) => {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF('l', 'mm', 'a4') // Landscape for better table view
  
  // Use default font for better compatibility
  doc.setFont('helvetica')
  
  // Title
  doc.setFontSize(20)
  doc.text('تقرير الحجوزات - أرض العجائب للسفر', 148, 20, { align: 'center' })
  
  // Date
  doc.setFontSize(12)
  doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`, 20, 35)
  doc.text(`إجمالي الحجوزات: ${data.length}`, 20, 45)
  
  // Table headers
  doc.setFontSize(10)
  const headers = ['العميل', 'الباقة', 'الوجهة', 'التاريخ', 'المسافرين', 'السعر', 'الحالة']
  const colWidths = [30, 35, 30, 25, 20, 25, 25]
  
  let x = 20
  headers.forEach((header, index) => {
    doc.text(header, x, 60)
    x += colWidths[index]
  })
  
  // Table line
  doc.line(20, 65, 290, 65)
  
  // Table data
  let y = 75
  data.forEach((booking, index) => {
    if (y > 180) {
      doc.addPage('l', 'mm', 'a4')
      y = 20
      
      // Repeat headers
      x = 20
      headers.forEach((header, headerIndex) => {
        doc.text(header, x, y)
        x += colWidths[headerIndex]
      })
      doc.line(20, y + 5, 290, y + 5)
      y = 35
    }
    
    x = 20
    const rowData = [
      booking.customer_name.substring(0, 20),
      booking.package_title.substring(0, 25),
      booking.destination.substring(0, 20),
      booking.travel_date,
      booking.num_travelers,
      booking.price + ' ريال',
      booking.status
    ]
    
    rowData.forEach((cell, cellIndex) => {
      doc.text(cell, x, y)
      x += colWidths[cellIndex]
    })
    y += 8
  })
  
  // Download file
  const fileName = `حجوزات_أرض_العجائب_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

const submitNewBooking = async () => {
  try {
    // Get package title
    const selectedPackage = packages.value.find(pkg => pkg.id === newBooking.value.package_id)
    if (selectedPackage) {
      newBooking.value.package_title = selectedPackage.title
    }

    const response = await $fetch('/api/admin/bookings', {
      method: 'POST',
      body: newBooking.value
    })

    if (response.success) {
      alert('تم إضافة الحجز بنجاح')
      showAddBookingModal.value = false
      // Reset form
      newBooking.value = {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        package_id: '',
        package_title: '',
        destination: '',
        travel_date: '',
        participants_count: 1,
        total_price: 0,
        paid_amount: 0,
        status: 'pending',
        notes: ''
      }
      // Reload bookings
      await loadBookings()
    } else {
      alert('حدث خطأ أثناء إضافة الحجز')
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    alert('حدث خطأ أثناء إضافة الحجز')
  }
}

const updateBooking = async () => {
  try {
    if (!editingBooking.value) return

    // Get package title
    const selectedPackage = packages.value.find(pkg => pkg.id === editingBooking.value.package_id)
    if (selectedPackage) {
      editingBooking.value.package_title = selectedPackage.title
    }

    const response = await $fetch(`/api/admin/bookings/${editingBooking.value.id}`, {
      method: 'PUT',
      body: editingBooking.value
    })

    if (response.success) {
      alert('تم تحديث الحجز بنجاح')
      showEditBookingModal.value = false
      editingBooking.value = null
      // Reload bookings
      await loadBookings()
    } else {
      alert('حدث خطأ أثناء تحديث الحجز')
    }
  } catch (error) {
    console.error('Error updating booking:', error)
    alert('حدث خطأ أثناء تحديث الحجز')
  }
}

const closeModal = () => {
  showBookingModal.value = false
  showEditBookingModal.value = false
  showAddBookingModal.value = false
  selectedBooking.value = null
  editingBooking.value = null
}


// Load bookings and packages on mount
onMounted(async () => {
  await loadPackages()
  await loadBookings()
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

/* Invoice Modal Styles */
.invoice-modal {
  @apply max-w-6xl w-full max-h-[90vh] overflow-hidden;
}

.invoice-actions {
  @apply flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg;
}

.invoice-actions .btn-primary,
.invoice-actions .btn-secondary {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.invoice-actions .btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.invoice-actions .btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}

.invoice-preview {
  @apply overflow-auto max-h-[70vh] border border-gray-200 rounded-lg;
}

.invoice-preview .invoice-container {
  @apply relative static left-auto top-auto w-full;
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

.btn-invoice {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.btn-edit {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors;
}

.btn-delete {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors;
}

/* Form Styles */
.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors;
}

.form-actions {
  @apply flex items-center justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200;
}
</style>