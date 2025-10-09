<template>
  <header class="admin-header">
    <div class="header-left">
      <!-- Mobile Menu Button -->
      <button 
        @click="toggleSidebar" 
        class="mobile-menu-btn lg:hidden"
      >
        <Icon name="lucide:menu" class="w-6 h-6" />
      </button>

      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <NuxtLink to="/admin" class="breadcrumb-link">
              <Icon name="lucide:home" class="breadcrumb-icon" />
              لوحة التحكم
            </NuxtLink>
          </li>
          <li v-if="breadcrumb" class="breadcrumb-item">
            <Icon name="lucide:chevron-left" class="breadcrumb-separator" />
            <span class="breadcrumb-current">{{ breadcrumb }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <div class="header-right">
     

      <!-- Notifications -->
      <div class="notification-container">
        <button class="notification-btn" @click="toggleNotifications">
          <Icon name="lucide:bell" class="notification-icon" />
          <span v-if="notificationCount > 0" class="notification-badge">
            {{ notificationCount }}
          </span>
        </button>
      </div>

      <!-- User Menu -->
      <div class="user-menu-container">
        <button @click="toggleUserMenu" class="user-menu-btn">
          <div class="user-avatar">
            <Icon name="lucide:user" class="avatar-icon" />
          </div>
          <div class="user-info">
            <p class="user-name">{{ user?.name || 'مدير النظام' }}</p>
            <p class="user-email">{{ user?.email || 'admin@wonderland.com' }}</p>
          </div>
          <Icon name="lucide:chevron-down" class="dropdown-icon" />
        </button>

        <!-- User Dropdown -->
        <div v-if="showUserMenu" class="user-dropdown">
          <div class="dropdown-header">
            <div class="dropdown-avatar">
              <Icon name="lucide:user" class="dropdown-avatar-icon" />
            </div>
            <div class="dropdown-user-info">
              <p class="dropdown-name">{{ user?.name || 'مدير النظام' }}</p>
              <p class="dropdown-email">{{ user?.email || 'admin@wonderland.com' }}</p>
            </div>
          </div>
          
          <div class="dropdown-divider"></div>
          
          <div class="dropdown-menu">
            <NuxtLink to="/admin/profile" class="dropdown-item">
              <Icon name="lucide:user" class="dropdown-item-icon" />
              الملف الشخصي
            </NuxtLink>
            <NuxtLink to="/admin/settings" class="dropdown-item">
              <Icon name="lucide:settings" class="dropdown-item-icon" />
              الإعدادات
            </NuxtLink>
            <button @click="handleLogout" class="dropdown-item logout-item">
              <Icon name="lucide:log-out" class="dropdown-item-icon" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <!-- Visit Site Button -->
      <NuxtLink to="/" class="visit-site-btn" target="_blank">
        <Icon name="lucide:external-link" class="visit-site-icon" />
        زيارة الموقع
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { AdminUser } from '~/types/admin'

const { user, logout } = useAdminAuth()

const searchQuery = ref('')
const showUserMenu = ref(false)
const notificationCount = ref(0)

const breadcrumb = computed(() => {
  const route = useRoute()
  const path = route.path
  
  if (path === '/admin') return null
  if (path.includes('/packages')) return 'إدارة الباقات'
  if (path.includes('/destinations')) return 'إدارة الوجهات'
  if (path.includes('/bookings')) return 'الحجوزات'
  if (path.includes('/messages')) return 'رسائل التواصل'
  if (path.includes('/notifications')) return 'الإشعارات'
  if (path.includes('/users')) return 'إدارة المستخدمين'
  if (path.includes('/reports')) return 'التقارير والإحصائيات'
  if (path.includes('/seo')) return 'إدارة SEO'
  if (path.includes('/settings')) return 'الإعدادات'
  
  return null
})

const toggleSidebar = () => {
  // Emit event to parent to toggle sidebar
  emit('toggle-sidebar')
}

const toggleNotifications = () => {
  // Navigate to notifications page
  navigateTo('/admin/notifications')
}

// Load notification count
const loadNotificationCount = async () => {
  try {
    const response = await $fetch('/api/admin/notifications?status=unread')
    if (response.success) {
      notificationCount.value = response.data.length
    }
  } catch (error) {
    console.error('Error loading notification count:', error)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  // Load notification count on mount
  loadNotificationCount()
  
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target?.closest('.user-menu-container')) {
      showUserMenu.value = false
    }
  })
})

// Refresh notification count every 30 seconds
onMounted(() => {
  const interval = setInterval(loadNotificationCount, 30000)
  onUnmounted(() => clearInterval(interval))
})

const emit = defineEmits(['toggle-sidebar'])
</script>

<style scoped>
.admin-header {
  @apply bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40;
  direction: rtl;
}

.header-left {
  @apply flex items-center space-x-4 space-x-reverse;
}

.mobile-menu-btn {
  @apply p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors;
}

.breadcrumb {
  @apply hidden sm:block;
}

.breadcrumb-list {
  @apply flex items-center space-x-2 space-x-reverse;
}

.breadcrumb-item {
  @apply flex items-center space-x-2 space-x-reverse;
}

.breadcrumb-link {
  @apply flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-gray-900 transition-colors;
}

.breadcrumb-icon {
  @apply w-4 h-4;
}

.breadcrumb-separator {
  @apply w-4 h-4 text-gray-400;
}

.breadcrumb-current {
  @apply text-gray-900 font-medium;
}

.header-right {
  @apply flex items-center space-x-4 space-x-reverse;
}

.search-container {
  @apply relative hidden md:block;
}

.search-icon {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400;
}

.search-input {
  @apply pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64;
}

.notification-container {
  @apply relative;
}

.notification-btn {
  @apply relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors;
}

.notification-icon {
  @apply w-5 h-5;
}

.notification-badge {
  @apply absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center;
}

.user-menu-container {
  @apply relative;
}

.user-menu-btn {
  @apply flex items-center space-x-3 space-x-reverse p-2 hover:bg-gray-100 rounded-lg transition-colors;
}

.user-avatar {
  @apply w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center;
}

.avatar-icon {
  @apply w-4 h-4 text-white;
}

.user-info {
  @apply hidden sm:block text-right;
}

.user-name {
  @apply text-sm font-medium text-gray-900;
}

.user-email {
  @apply text-xs text-gray-500;
}

.dropdown-icon {
  @apply w-4 h-4 text-gray-400;
}

.user-dropdown {
  @apply absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50;
}

.dropdown-header {
  @apply p-4 flex items-center space-x-3 space-x-reverse;
}

.dropdown-avatar {
  @apply w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center;
}

.dropdown-avatar-icon {
  @apply w-6 h-6 text-white;
}

.dropdown-user-info {
  @apply flex-1;
}

.dropdown-name {
  @apply text-sm font-medium text-gray-900;
}

.dropdown-email {
  @apply text-xs text-gray-500;
}

.dropdown-divider {
  @apply border-t border-gray-200;
}

.dropdown-menu {
  @apply py-2;
}

.dropdown-item {
  @apply flex items-center space-x-3 space-x-reverse px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors;
}

.dropdown-item-icon {
  @apply w-4 h-4;
}

.logout-item {
  @apply text-red-600 hover:bg-red-50;
}

.visit-site-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.visit-site-icon {
  @apply w-4 h-4;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-header {
    @apply px-4;
  }
  
  .header-right {
    @apply space-x-2;
  }
  
  .search-container {
    @apply hidden;
  }
}
</style>
