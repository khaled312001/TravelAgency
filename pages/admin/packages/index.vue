<template>
  <div class="packages-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إدارة الباقات</h1>
          <p class="page-subtitle">إدارة جميع باقات السفر المتاحة</p>
        </div>
        <div class="header-right">
          <button @click="showCreateModal = true" class="create-btn">
            <Icon name="lucide:plus" class="btn-icon" />
            إضافة باقة جديدة
          </button>
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
            placeholder="البحث في الباقات..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">جميع الحالات</option>
            <option value="featured">مميز</option>
            <option value="normal">عادي</option>
          </select>
          
          <select v-model="categoryFilter" class="filter-select">
            <option value="">جميع فترات السفر</option>
            <option value="All Year">طوال السنة</option>
            <option value="Winter">الشتاء</option>
            <option value="Spring">الربيع</option>
            <option value="Summer">الصيف</option>
            <option value="Autumn">الخريف</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Packages Grid -->
    <div class="packages-grid">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل الباقات...</p>
      </div>

      <div v-else-if="filteredPackages.length === 0" class="empty-state">
        <Icon name="lucide:package" class="empty-icon" />
        <h3>لا توجد باقات</h3>
        <p>لم يتم العثور على أي باقات تطابق معايير البحث</p>
        <button @click="showCreateModal = true" class="create-first-btn">
          إضافة أول باقة
        </button>
      </div>

      <div v-else class="packages-list">
        <div 
          v-for="pkg in filteredPackages" 
          :key="pkg.id" 
          class="package-card"
        >
          <div class="package-image">
            <img 
              :src="pkg.image_url || '/images/placeholder-package.jpg'" 
              :alt="pkg.title_ar"
              class="package-img"
            />
            <div class="package-status" :class="pkg.featured ? 'featured' : 'normal'">
              {{ getStatusText(pkg.featured) }}
            </div>
          </div>

          <div class="package-content">
            <div class="package-header">
              <h3 class="package-title">{{ pkg.title_ar }}</h3>
              <div class="package-actions">
                <button @click="editPackage(pkg)" class="action-btn edit">
                  <Icon name="lucide:edit" class="action-icon" />
                </button>
                <button @click="deletePackage(pkg)" class="action-btn delete">
                  <Icon name="lucide:trash-2" class="action-icon" />
                </button>
              </div>
            </div>

            <p class="package-description">{{ pkg.description_ar }}</p>

            <div class="package-details">
              <div class="detail-item">
                <Icon name="lucide:calendar" class="detail-icon" />
                <span>{{ pkg.duration_days }} أيام</span>
              </div>
              <div class="detail-item">
                <Icon name="lucide:users" class="detail-icon" />
                <span>{{ pkg.max_persons }} أشخاص</span>
              </div>
              <div class="detail-item">
                <Icon name="lucide:clock" class="detail-icon" />
                <span>{{ pkg.travel_period }}</span>
              </div>
              <div class="detail-item">
                <Icon name="lucide:star" class="detail-icon" />
                <span>{{ pkg.featured ? 'مميز' : 'عادي' }}</span>
              </div>
            </div>

            <div class="package-footer">
              <div class="package-price">
                <span class="price-label">السعر:</span>
                <span class="price-value">{{ formatPrice(pkg.price) }}</span>
              </div>
              <div class="package-meta">
                <span class="created-date">
                  {{ formatDate(pkg.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Package Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ showEditModal ? 'تعديل الباقة' : 'إضافة باقة جديدة' }}
          </h2>
          <button @click="closeModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <form @submit.prevent="savePackage" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">عنوان الباقة (عربي) *</label>
              <input 
                v-model="packageForm.title_ar" 
                type="text" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">عنوان الباقة (إنجليزي) *</label>
              <input 
                v-model="packageForm.title_en" 
                type="text" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">السعر *</label>
              <input 
                v-model="packageForm.price" 
                type="number" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">المدة (أيام) *</label>
              <input 
                v-model="packageForm.duration_days" 
                type="number" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">الحد الأقصى للأشخاص</label>
              <input 
                v-model="packageForm.max_persons" 
                type="number" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">فترة السفر</label>
              <input 
                v-model="packageForm.travel_period" 
                type="text" 
                class="form-input"
                placeholder="مثال: طوال السنة، الشتاء، الصيف"
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">الوصف (عربي)</label>
              <textarea 
                v-model="packageForm.description_ar" 
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label class="form-label">الوصف (إنجليزي)</label>
              <textarea 
                v-model="packageForm.description_en" 
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">رابط الصورة</label>
              <input 
                v-model="packageForm.image_url" 
                type="url" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">رابط صورة البطل</label>
              <input 
                v-model="packageForm.hero_image_url" 
                type="url" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">مميز</label>
              <input 
                v-model="packageForm.featured" 
                type="checkbox" 
                class="form-checkbox"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <Icon v-if="saving" name="lucide:loader-2" class="btn-icon animate-spin" />
              <Icon v-else name="lucide:save" class="btn-icon" />
              {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Package {
  id: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  price: number
  duration_days: number
  max_persons: number
  travel_period: string
  featured: boolean
  image_url?: string
  hero_image_url?: string
  created_at: string
  updated_at: string
}

const packages = ref<Package[]>([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingPackage = ref<Package | null>(null)

const packageForm = ref({
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  price: 0,
  duration_days: 0,
  max_persons: 0,
  travel_period: '',
  featured: false,
  image_url: '',
  hero_image_url: ''
})

const filteredPackages = computed(() => {
  let filtered = packages.value

  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pkg => 
      pkg.title_ar.toLowerCase().includes(searchLower) ||
      pkg.title_en.toLowerCase().includes(searchLower) ||
      pkg.description_ar.toLowerCase().includes(searchLower) ||
      pkg.description_en.toLowerCase().includes(searchLower)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(pkg => pkg.featured === (statusFilter.value === 'featured'))
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(pkg => pkg.travel_period === categoryFilter.value)
  }

  return filtered
})

const getStatusText = (featured: boolean) => {
  return featured ? 'مميز' : 'عادي'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const loadPackages = async () => {
  try {
    loading.value = true
    
    // Build query parameters
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (categoryFilter.value) params.append('category', categoryFilter.value)
    if (searchQuery.value) params.append('search', searchQuery.value)
    
    const queryString = params.toString()
    const url = `/api/admin/packages${queryString ? `?${queryString}` : ''}`
    
    const response = await $fetch(url)
    
    if (response.packages) {
      // Use the data directly from database
      packages.value = response.packages
    } else {
      packages.value = []
    }
  } catch (error) {
    console.error('Error loading packages:', error)
    packages.value = []
  } finally {
    loading.value = false
  }
}

const editPackage = (pkg: Package) => {
  editingPackage.value = pkg
  packageForm.value = { ...pkg }
  showEditModal.value = true
}

const deletePackage = async (pkg: Package) => {
  if (confirm(`هل أنت متأكد من حذف الباقة "${pkg.title_ar}"؟`)) {
    try {
      await $fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'DELETE'
      })
      await loadPackages()
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }
}

const savePackage = async () => {
  try {
    saving.value = true
    
    // Prepare the data for API
    const packageData = {
      title_ar: packageForm.value.title_ar,
      title_en: packageForm.value.title_en,
      description_ar: packageForm.value.description_ar,
      description_en: packageForm.value.description_en,
      price: Number(packageForm.value.price),
      duration_days: Number(packageForm.value.duration_days),
      max_persons: Number(packageForm.value.max_persons) || null,
      travel_period: packageForm.value.travel_period || null,
      featured: packageForm.value.featured || false,
      image_url: packageForm.value.image_url || null,
      hero_image_url: packageForm.value.hero_image_url || null
    }
    
    if (showEditModal.value && editingPackage.value) {
      // Update existing package
      await $fetch(`/api/admin/packages/${editingPackage.value.id}`, {
        method: 'PUT',
        body: packageData
      })
    } else {
      // Create new package
      await $fetch('/api/admin/packages', {
        method: 'POST',
        body: packageData
      })
    }
    
    await loadPackages()
    closeModal()
  } catch (error) {
    console.error('Error saving package:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingPackage.value = null
  packageForm.value = {
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    duration_days: 0,
    max_persons: 0,
    travel_period: '',
    featured: false,
    image_url: '',
    hero_image_url: ''
  }
}

// Load packages on mount
onMounted(() => {
  loadPackages()
})

// Set page title
useHead({
  title: 'إدارة الباقات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.packages-page {
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

.create-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.btn-icon {
  @apply w-4 h-4;
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

.packages-grid {
  @apply min-h-96;
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

.create-first-btn {
  @apply mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.packages-list {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.package-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow;
}

.package-image {
  @apply relative h-48 bg-gray-200;
}

.package-img {
  @apply w-full h-full object-cover;
}

.package-status {
  @apply absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full;
}

.package-status.featured {
  @apply bg-purple-100 text-purple-800;
}

.package-status.normal {
  @apply bg-gray-100 text-gray-800;
}

.package-content {
  @apply p-6;
}

.package-header {
  @apply flex items-start justify-between mb-3;
}

.package-title {
  @apply text-lg font-semibold text-gray-900 flex-1;
}

.package-actions {
  @apply flex space-x-2 space-x-reverse;
}

.action-btn {
  @apply p-1.5 text-gray-400 hover:text-gray-600 transition-colors;
}

.action-btn.edit:hover {
  @apply text-blue-600;
}

.action-btn.delete:hover {
  @apply text-red-600;
}

.action-icon {
  @apply w-4 h-4;
}

.package-description {
  @apply text-gray-600 text-sm mb-4 line-clamp-2;
}

.package-details {
  @apply space-y-2 mb-4;
}

.detail-item {
  @apply flex items-center space-x-2 space-x-reverse text-sm text-gray-600;
}

.detail-icon {
  @apply w-4 h-4 text-gray-400;
}

.package-footer {
  @apply flex items-center justify-between pt-4 border-t border-gray-200;
}

.package-price {
  @apply flex items-center space-x-2 space-x-reverse;
}

.price-label {
  @apply text-sm text-gray-600;
}

.price-value {
  @apply text-lg font-bold text-purple-600;
}

.package-meta {
  @apply text-xs text-gray-500;
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

.modal-form {
  @apply p-6;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-group.full-width {
  @apply md:col-span-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input,
.form-select,
.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.form-textarea {
  @apply resize-none;
}

.modal-actions {
  @apply flex items-center justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200;
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

.form-checkbox {
  @apply w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500;
}
</style>