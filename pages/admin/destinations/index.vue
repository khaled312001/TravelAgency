<template>
  <div class="destinations-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إدارة الوجهات</h1>
          <p class="page-subtitle">إدارة جميع الوجهات السياحية المتاحة</p>
        </div>
        <div class="header-right">
          <button @click="showCreateModal = true" class="create-btn">
            <Icon name="lucide:plus" class="btn-icon" />
            إضافة وجهة جديدة
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:map-pin" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ destinations.length }}</p>
          <p class="stat-label">إجمالي الوجهات</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:globe" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ activeDestinations }}</p>
          <p class="stat-label">الوجهات النشطة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:star" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ featuredDestinations }}</p>
          <p class="stat-label">الوجهات المميزة</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:trending-up" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ popularDestinations }}</p>
          <p class="stat-label">الأكثر شعبية</p>
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
            placeholder="البحث في الوجهات..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
          
          <select v-model="typeFilter" class="filter-select">
            <option value="">جميع الأنواع</option>
            <option value="domestic">محلية</option>
            <option value="international">دولية</option>
          </select>

          <select v-model="featuredFilter" class="filter-select">
            <option value="">جميع الوجهات</option>
            <option value="featured">مميزة</option>
            <option value="regular">عادية</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Destinations Grid -->
    <div class="destinations-grid">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل الوجهات...</p>
      </div>

      <div v-else-if="filteredDestinations.length === 0" class="empty-state">
        <Icon name="lucide:map-pin" class="empty-icon" />
        <h3>لا توجد وجهات</h3>
        <p>لم يتم العثور على أي وجهات تطابق معايير البحث</p>
        <button @click="showCreateModal = true" class="create-first-btn">
          إضافة أول وجهة
        </button>
      </div>

      <div v-else class="destinations-list">
        <div 
          v-for="destination in filteredDestinations" 
          :key="destination.id" 
          class="destination-card"
        >
          <div class="destination-image">
            <img 
              :src="destination.image_url || '/images/placeholder-destination.jpg'" 
              :alt="destination.name"
              class="destination-img"
            />
            <div class="destination-badges">
              <div v-if="destination.is_featured" class="badge featured">
                <Icon name="lucide:star" class="badge-icon" />
                مميز
              </div>
              <div class="badge status" :class="destination.status">
                {{ getStatusText(destination.status) }}
              </div>
            </div>
          </div>

          <div class="destination-content">
            <div class="destination-header">
              <h3 class="destination-name">{{ destination.name }}</h3>
              <div class="destination-actions">
                <button @click="editDestination(destination)" class="action-btn edit">
                  <Icon name="lucide:edit" class="action-icon" />
                </button>
                <button @click="deleteDestination(destination)" class="action-btn delete">
                  <Icon name="lucide:trash-2" class="action-icon" />
                </button>
              </div>
            </div>

            <p class="destination-description">{{ destination.description }}</p>

            <div class="destination-details">
              <div class="detail-item">
                <Icon name="lucide:map-pin" class="detail-icon" />
                <span>{{ destination.country }}</span>
              </div>
              <div class="detail-item">
                <Icon name="lucide:globe" class="detail-icon" />
                <span>{{ getTypeText(destination.type) }}</span>
              </div>
              <div class="detail-item">
                <Icon name="lucide:calendar" class="detail-icon" />
                <span>أفضل وقت: {{ destination.best_time_to_visit }}</span>
              </div>
            </div>

            <div class="destination-footer">
              <div class="destination-meta">
                <span class="created-date">
                  {{ formatDate(destination.created_at) }}
                </span>
                <span class="packages-count">
                  {{ destination.packages_count || 0 }} باقة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Destination Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ showEditModal ? 'تعديل الوجهة' : 'إضافة وجهة جديدة' }}
          </h2>
          <button @click="closeModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <form @submit.prevent="saveDestination" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">اسم الوجهة *</label>
              <input 
                v-model="destinationForm.name" 
                type="text" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">البلد *</label>
              <input 
                v-model="destinationForm.country" 
                type="text" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">النوع *</label>
              <select v-model="destinationForm.type" class="form-select" required>
                <option value="domestic">محلية</option>
                <option value="international">دولية</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">أفضل وقت للزيارة</label>
              <input 
                v-model="destinationForm.best_time_to_visit" 
                type="text" 
                class="form-input"
                placeholder="مثال: مارس - مايو"
              />
            </div>

            <div class="form-group">
              <label class="form-label">رابط الصورة</label>
              <input 
                v-model="destinationForm.image_url" 
                type="url" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">الحالة</label>
              <select v-model="destinationForm.status" class="form-select">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label">الوصف</label>
              <textarea 
                v-model="destinationForm.description" 
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label flex items-center space-x-2 space-x-reverse">
                <input 
                  v-model="destinationForm.is_featured" 
                  type="checkbox" 
                  class="form-checkbox"
                />
                <span>وجهة مميزة</span>
              </label>
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
interface Destination {
  id: string
  name: string
  description: string
  country: string
  type: string
  best_time_to_visit: string
  status: string
  is_featured: boolean
  image_url?: string
  packages_count?: number
  created_at: string
  updated_at: string
}

const destinations = ref<Destination[]>([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const featuredFilter = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingDestination = ref<Destination | null>(null)

const destinationForm = ref({
  name: '',
  description: '',
  country: '',
  type: 'domestic',
  best_time_to_visit: '',
  status: 'active',
  is_featured: false,
  image_url: ''
})

const filteredDestinations = computed(() => {
  let filtered = destinations.value

  if (searchQuery.value) {
    filtered = filtered.filter(dest => 
      dest.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(dest => dest.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(dest => dest.type === typeFilter.value)
  }

  if (featuredFilter.value) {
    if (featuredFilter.value === 'featured') {
      filtered = filtered.filter(dest => dest.is_featured)
    } else if (featuredFilter.value === 'regular') {
      filtered = filtered.filter(dest => !dest.is_featured)
    }
  }

  return filtered
})

const activeDestinations = computed(() => 
  destinations.value.filter(dest => dest.status === 'active').length
)

const featuredDestinations = computed(() => 
  destinations.value.filter(dest => dest.is_featured).length
)

const popularDestinations = computed(() => 
  destinations.value.filter(dest => (dest.packages_count || 0) > 0).length
)

const getStatusText = (status: string) => {
  const statusMap = {
    active: 'نشط',
    inactive: 'غير نشط'
  }
  return statusMap[status] || status
}

const getTypeText = (type: string) => {
  const typeMap = {
    domestic: 'محلية',
    international: 'دولية'
  }
  return typeMap[type] || type
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const loadDestinations = async () => {
  try {
    loading.value = true
    
    // Build query parameters
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (typeFilter.value) params.append('type', typeFilter.value)
    if (featuredFilter.value) params.append('featured', featuredFilter.value === 'featured' ? 'true' : 'false')
    if (searchQuery.value) params.append('search', searchQuery.value)
    
    const queryString = params.toString()
    const url = `/api/admin/destinations${queryString ? `?${queryString}` : ''}`
    
    const response = await $fetch(url)
    
    if (response.destinations) {
      // Transform the data to match the expected format
      destinations.value = response.destinations.map((dest: any) => ({
        id: dest.id,
        name: dest.name_ar || dest.name_en || 'غير محدد',
        description: dest.description_ar || dest.description_en || '',
        country: dest.country_ar || dest.country_en || 'غير محدد',
        type: dest.type || 'domestic',
        best_time_to_visit: dest.best_time_to_visit || '',
        status: dest.status || 'active',
        is_featured: dest.featured || false,
        image_url: dest.image_url || '/images/placeholder-destination.jpg',
        packages_count: dest.packages_count || 0,
        created_at: dest.created_at,
        updated_at: dest.updated_at
      }))
    } else {
      destinations.value = []
    }
  } catch (error) {
    console.error('Error loading destinations:', error)
    destinations.value = []
  } finally {
    loading.value = false
  }
}

const editDestination = (destination: Destination) => {
  editingDestination.value = destination
  destinationForm.value = { ...destination }
  showEditModal.value = true
}

const deleteDestination = async (destination: Destination) => {
  if (confirm(`هل أنت متأكد من حذف الوجهة "${destination.name}"؟`)) {
    try {
      // TODO: Implement delete API
      console.log('Delete destination:', destination.id)
      await loadDestinations()
    } catch (error) {
      console.error('Error deleting destination:', error)
    }
  }
}

const saveDestination = async () => {
  try {
    saving.value = true
    
    if (showEditModal.value && editingDestination.value) {
      // Update existing destination
      // await $fetch(`/api/admin/destinations/${editingDestination.value.id}`, {
      //   method: 'PUT',
      //   body: destinationForm.value
      // })
      console.log('Update destination:', destinationForm.value)
    } else {
      // Create new destination
      // await $fetch('/api/admin/destinations', {
      //   method: 'POST',
      //   body: destinationForm.value
      // })
      console.log('Create destination:', destinationForm.value)
    }
    
    await loadDestinations()
    closeModal()
  } catch (error) {
    console.error('Error saving destination:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingDestination.value = null
  destinationForm.value = {
    name: '',
    description: '',
    country: '',
    type: 'domestic',
    best_time_to_visit: '',
    status: 'active',
    is_featured: false,
    image_url: ''
  }
}

// Load destinations on mount
onMounted(() => {
  loadDestinations()
})

// Set page title
useHead({
  title: 'إدارة الوجهات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.destinations-page {
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

.destinations-grid {
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

.destinations-list {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.destination-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow;
}

.destination-image {
  @apply relative h-48 bg-gray-200;
}

.destination-img {
  @apply w-full h-full object-cover;
}

.destination-badges {
  @apply absolute top-3 right-3 flex flex-col space-y-2;
}

.badge {
  @apply px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 space-x-reverse;
}

.badge.featured {
  @apply bg-yellow-100 text-yellow-800;
}

.badge.status.active {
  @apply bg-green-100 text-green-800;
}

.badge.status.inactive {
  @apply bg-red-100 text-red-800;
}

.badge-icon {
  @apply w-3 h-3;
}

.destination-content {
  @apply p-6;
}

.destination-header {
  @apply flex items-start justify-between mb-3;
}

.destination-name {
  @apply text-lg font-semibold text-gray-900 flex-1;
}

.destination-actions {
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

.destination-description {
  @apply text-gray-600 text-sm mb-4 line-clamp-2;
}

.destination-details {
  @apply space-y-2 mb-4;
}

.detail-item {
  @apply flex items-center space-x-2 space-x-reverse text-sm text-gray-600;
}

.detail-icon {
  @apply w-4 h-4 text-gray-400;
}

.destination-footer {
  @apply pt-4 border-t border-gray-200;
}

.destination-meta {
  @apply flex items-center justify-between text-xs text-gray-500;
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

.form-checkbox {
  @apply w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500;
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
</style>
