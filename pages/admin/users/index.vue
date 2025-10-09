<template>
  <div class="users-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إدارة المستخدمين</h1>
          <p class="page-subtitle">إدارة حسابات المستخدمين والصلاحيات</p>
        </div>
        <div class="header-right">
          <button @click="showCreateModal = true" class="create-btn">
            <Icon name="lucide:plus" class="btn-icon" />
            إضافة مستخدم جديد
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:users" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ totalUsers }}</p>
          <p class="stat-label">إجمالي المستخدمين</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:user-check" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ activeUsers }}</p>
          <p class="stat-label">المستخدمين النشطين</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:user-plus" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ newUsersThisMonth }}</p>
          <p class="stat-label">جدد هذا الشهر</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="lucide:shield" class="icon" />
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ adminUsers }}</p>
          <p class="stat-label">المديرين</p>
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
            placeholder="البحث في المستخدمين..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="suspended">معلق</option>
          </select>
          
          <select v-model="roleFilter" class="filter-select">
            <option value="">جميع الأدوار</option>
            <option value="admin">مدير</option>
            <option value="user">مستخدم</option>
            <option value="moderator">مشرف</option>
          </select>

          <input 
            v-model="dateFilter" 
            type="date" 
            class="filter-select"
            placeholder="تاريخ التسجيل"
          />
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل المستخدمين...</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <Icon name="lucide:users" class="empty-icon" />
        <h3>لا توجد مستخدمين</h3>
        <p>لم يتم العثور على أي مستخدمين تطابق معايير البحث</p>
        <button @click="showCreateModal = true" class="create-first-btn">
          إضافة أول مستخدم
        </button>
      </div>

      <div v-else class="users-table">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th class="table-cell">المستخدم</th>
              <th class="table-cell">البريد الإلكتروني</th>
              <th class="table-cell">الدور</th>
              <th class="table-cell">الحالة</th>
              <th class="table-cell">تاريخ التسجيل</th>
              <th class="table-cell">آخر نشاط</th>
              <th class="table-cell">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
              <td class="table-cell">
                <div class="user-info">
                  <div class="user-avatar">
                    <img 
                      v-if="user.avatar_url" 
                      :src="user.avatar_url" 
                      :alt="user.name"
                      class="avatar-img"
                    />
                    <Icon v-else name="lucide:user" class="avatar-icon" />
                  </div>
                  <div class="user-details">
                    <p class="user-name">{{ user.name }}</p>
                    <p class="user-id">ID: {{ user.id.slice(-8) }}</p>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <span class="user-email">{{ user.email }}</span>
              </td>
              <td class="table-cell">
                <span class="role-badge" :class="user.role">
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td class="table-cell">
                <span class="status-badge" :class="user.status">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="table-cell">
                <span class="registration-date">{{ formatDate(user.created_at) }}</span>
              </td>
              <td class="table-cell">
                <span class="last-activity">{{ formatDate(user.last_login) }}</span>
              </td>
              <td class="table-cell">
                <div class="action-buttons">
                  <button @click="viewUser(user)" class="action-btn view">
                    <Icon name="lucide:eye" class="action-icon" />
                  </button>
                  <button @click="editUser(user)" class="action-btn edit">
                    <Icon name="lucide:edit" class="action-icon" />
                  </button>
                  <button @click="toggleUserStatus(user)" class="action-btn status">
                    <Icon :name="user.status === 'active' ? 'lucide:user-x' : 'lucide:user-check'" class="action-icon" />
                  </button>
                  <button @click="deleteUser(user)" class="action-btn delete">
                    <Icon name="lucide:trash-2" class="action-icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">تفاصيل المستخدم</h2>
          <button @click="closeModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <div v-if="selectedUser" class="modal-body">
          <div class="user-profile">
            <div class="profile-header">
              <div class="profile-avatar">
                <img 
                  v-if="selectedUser.avatar_url" 
                  :src="selectedUser.avatar_url" 
                  :alt="selectedUser.name"
                  class="avatar-large"
                />
                <Icon v-else name="lucide:user" class="avatar-icon-large" />
              </div>
              <div class="profile-info">
                <h3 class="profile-name">{{ selectedUser.name }}</h3>
                <p class="profile-email">{{ selectedUser.email }}</p>
                <div class="profile-badges">
                  <span class="role-badge" :class="selectedUser.role">
                    {{ getRoleText(selectedUser.role) }}
                  </span>
                  <span class="status-badge" :class="selectedUser.status">
                    {{ getStatusText(selectedUser.status) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-section">
                <h4 class="section-title">معلومات الحساب</h4>
                <div class="detail-items">
                  <div class="detail-item">
                    <span class="detail-label">معرف المستخدم:</span>
                    <span class="detail-value">{{ selectedUser.id }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">تاريخ التسجيل:</span>
                    <span class="detail-value">{{ formatDateTime(selectedUser.created_at) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">آخر تسجيل دخول:</span>
                    <span class="detail-value">{{ formatDateTime(selectedUser.last_login) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">عدد الحجوزات:</span>
                    <span class="detail-value">{{ selectedUser.bookings_count || 0 }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedUser.phone" class="detail-section">
                <h4 class="section-title">معلومات التواصل</h4>
                <div class="detail-items">
                  <div class="detail-item">
                    <span class="detail-label">رقم الهاتف:</span>
                    <span class="detail-value">{{ selectedUser.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">
            إغلاق
          </button>
          <button @click="editUser(selectedUser)" class="btn-primary">
            <Icon name="lucide:edit" class="btn-icon" />
            تعديل المستخدم
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeUserModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ showEditModal ? 'تعديل المستخدم' : 'إضافة مستخدم جديد' }}
          </h2>
          <button @click="closeUserModal" class="modal-close">
            <Icon name="lucide:x" class="close-icon" />
          </button>
        </div>

        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">الاسم *</label>
              <input 
                v-model="userForm.name" 
                type="text" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">البريد الإلكتروني *</label>
              <input 
                v-model="userForm.email" 
                type="email" 
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">كلمة المرور {{ showEditModal ? '(اتركها فارغة للحفاظ على الكلمة الحالية)' : '*' }}</label>
              <input 
                v-model="userForm.password" 
                type="password" 
                class="form-input"
                :required="!showEditModal"
              />
            </div>

            <div class="form-group">
              <label class="form-label">رقم الهاتف</label>
              <input 
                v-model="userForm.phone" 
                type="tel" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">الدور *</label>
              <select v-model="userForm.role" class="form-select" required>
                <option value="user">مستخدم</option>
                <option value="moderator">مشرف</option>
                <option value="admin">مدير</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">الحالة</label>
              <select v-model="userForm.status" class="form-select">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">معلق</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeUserModal" class="btn-secondary">
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
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  avatar_url?: string
  bookings_count?: number
  created_at: string
  last_login: string
}

const users = ref<User[]>([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const dateFilter = ref('')
const showUserModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref<User | null>(null)
const editingUser = ref<User | null>(null)

const userForm = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'user',
  status: 'active'
})

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (dateFilter.value) {
    filtered = filtered.filter(user => 
      user.created_at.startsWith(dateFilter.value)
    )
  }

  return filtered
})

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => 
  users.value.filter(user => user.status === 'active').length
)
const newUsersThisMonth = computed(() => {
  const thisMonth = new Date().toISOString().slice(0, 7)
  return users.value.filter(user => 
    user.created_at.startsWith(thisMonth)
  ).length
})
const adminUsers = computed(() => 
  users.value.filter(user => user.role === 'admin').length
)

const getStatusText = (status: string) => {
  const statusMap = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'معلق'
  }
  return statusMap[status] || status
}

const getRoleText = (role: string) => {
  const roleMap = {
    admin: 'مدير',
    moderator: 'مشرف',
    user: 'مستخدم'
  }
  return roleMap[role] || role
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

const loadUsers = async () => {
  try {
    loading.value = true
    // TODO: Implement API call
    // const { data } = await $fetch('/api/admin/users')
    // users.value = data || []
    
    // Mock data for now
    users.value = [
      {
        id: 'user-001',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        role: 'user',
        status: 'active',
        bookings_count: 3,
        created_at: '2024-01-15T10:00:00Z',
        last_login: '2024-01-20T14:30:00Z'
      },
      {
        id: 'user-002',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966507654321',
        role: 'admin',
        status: 'active',
        bookings_count: 1,
        created_at: '2024-01-10T09:00:00Z',
        last_login: '2024-01-21T08:15:00Z'
      }
    ]
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const viewUser = (user: User) => {
  selectedUser.value = user
  showUserModal.value = true
}

const editUser = (user: User) => {
  editingUser.value = user
  userForm.value = { ...user, password: '' }
  showEditModal.value = true
}

const toggleUserStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'
  
  if (confirm(`هل أنت متأكد من ${action} المستخدم "${user.name}"؟`)) {
    try {
      // TODO: Implement API call
      // await $fetch(`/api/admin/users/${user.id}/status`, {
      //   method: 'PUT',
      //   body: { status: newStatus }
      // })
      
      user.status = newStatus
      console.log('Toggle user status:', user.id, newStatus)
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }
}

const deleteUser = async (user: User) => {
  if (confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟`)) {
    try {
      // TODO: Implement API call
      // await $fetch(`/api/admin/users/${user.id}`, {
      //   method: 'DELETE'
      // })
      
      console.log('Delete user:', user.id)
      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const saveUser = async () => {
  try {
    saving.value = true
    
    if (showEditModal.value && editingUser.value) {
      // Update existing user
      // await $fetch(`/api/admin/users/${editingUser.value.id}`, {
      //   method: 'PUT',
      //   body: userForm.value
      // })
      console.log('Update user:', userForm.value)
    } else {
      // Create new user
      // await $fetch('/api/admin/users', {
      //   method: 'POST',
      //   body: userForm.value
      // })
      console.log('Create user:', userForm.value)
    }
    
    await loadUsers()
    closeUserModal()
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showUserModal.value = false
  selectedUser.value = null
}

const closeUserModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    status: 'active'
  }
}

// Load users on mount
onMounted(() => {
  loadUsers()
})

// Set page title
useHead({
  title: 'إدارة المستخدمين - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.users-page {
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

.users-table-container {
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

.create-first-btn {
  @apply mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.users-table {
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

.user-info {
  @apply flex items-center space-x-3 space-x-reverse;
}

.user-avatar {
  @apply w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden;
}

.avatar-img {
  @apply w-full h-full object-cover;
}

.avatar-icon {
  @apply w-5 h-5 text-gray-600;
}

.user-details {
  @apply flex-1;
}

.user-name {
  @apply font-medium text-gray-900;
}

.user-id {
  @apply text-xs text-gray-500;
}

.user-email {
  @apply text-gray-900;
}

.role-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.role-badge.admin {
  @apply bg-red-100 text-red-800;
}

.role-badge.moderator {
  @apply bg-blue-100 text-blue-800;
}

.role-badge.user {
  @apply bg-gray-100 text-gray-800;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.status-badge.active {
  @apply bg-green-100 text-green-800;
}

.status-badge.inactive {
  @apply bg-gray-100 text-gray-800;
}

.status-badge.suspended {
  @apply bg-red-100 text-red-800;
}

.registration-date,
.last-activity {
  @apply text-gray-900;
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

.user-profile {
  @apply space-y-6;
}

.profile-header {
  @apply flex items-center space-x-6 space-x-reverse pb-6 border-b border-gray-200;
}

.profile-avatar {
  @apply w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden;
}

.avatar-large {
  @apply w-full h-full object-cover;
}

.avatar-icon-large {
  @apply w-10 h-10 text-gray-600;
}

.profile-info {
  @apply flex-1;
}

.profile-name {
  @apply text-2xl font-bold text-gray-900;
}

.profile-email {
  @apply text-gray-600 mt-1;
}

.profile-badges {
  @apply flex space-x-2 space-x-reverse mt-3;
}

.profile-details {
  @apply space-y-6;
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

.modal-form {
  @apply p-6;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input,
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
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
