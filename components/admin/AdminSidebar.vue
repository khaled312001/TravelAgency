<template>
  <div class="admin-sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo-container">
        <Icon name="lucide:compass" class="logo-icon" />
        <div class="logo-text">
          <h2 class="logo-title">World Trip Agency</h2>
          <p class="logo-subtitle">لوحة التحكم</p>
        </div>
      </div>
      
      <!-- Close Button for Mobile -->
      <button 
        @click="closeSidebar" 
        class="close-sidebar-btn lg:hidden"
        aria-label="إغلاق القائمة الجانبية"
      >
        <Icon name="lucide:x" class="close-icon" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in menuItems" :key="item.name" class="nav-item">
          <NuxtLink 
            :to="item.path" 
            class="nav-link group"
            :class="{ 'active': $route.path === item.path }"
          >
            <Icon :name="item.icon" class="nav-icon" />
            <span class="nav-text">{{ item.name }}</span>
            <Icon v-if="item.badge" name="lucide:circle" class="nav-badge" />
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <Icon name="lucide:user" class="avatar-icon" />
        </div>
        <div class="user-details">
          <p class="user-name">{{ user?.name || 'مدير النظام' }}</p>
          <p class="user-role">{{ user?.role === 'super_admin' ? 'مدير عام' : 'مدير' }}</p>
        </div>
      </div>
      
      <button @click="handleLogout" class="logout-btn">
        <Icon name="lucide:log-out" class="logout-icon" />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminUser } from '~/types/admin'

const { user, logout } = useAdminAuth()

const menuItems = [
  {
    name: 'لوحة المعلومات',
    path: '/admin',
    icon: 'lucide:layout-dashboard',
    badge: false
  },
  {
    name: 'إدارة الباقات',
    path: '/admin/packages',
    icon: 'lucide:package',
    badge: false
  },
  {
    name: 'إدارة الوجهات',
    path: '/admin/destinations',
    icon: 'lucide:map-pin',
    badge: false
  },
  {
    name: 'الحجوزات',
    path: '/admin/bookings',
    icon: 'lucide:calendar',
    badge: true
  },
  {
    name: 'رسائل التواصل',
    path: '/admin/messages',
    icon: 'lucide:message-circle',
    badge: true
  },
  {
    name: 'الإشعارات',
    path: '/admin/notifications',
    icon: 'lucide:bell',
    badge: true
  },
  {
    name: 'إعدادات الإشعارات',
    path: '/admin/notifications/settings',
    icon: 'lucide:bell-ring',
    badge: false
  },
  {
    name: 'إدارة المستخدمين',
    path: '/admin/users',
    icon: 'lucide:users',
    badge: false
  },
  {
    name: 'التقارير والإحصائيات',
    path: '/admin/reports',
    icon: 'lucide:bar-chart-3',
    badge: false
  },
      {
        name: 'إدارة المحتوى',
        path: '/admin/content',
        icon: 'lucide:edit-3',
        badge: false
      },
      {
        name: 'الإشعارات',
        path: '/admin/notifications',
        icon: 'lucide:bell',
        badge: false
      },
  {
    name: 'إدارة SEO',
    path: '/admin/seo',
    icon: 'lucide:search',
    badge: false
  },
  {
    name: 'الإعدادات',
    path: '/admin/settings',
    icon: 'lucide:settings',
    badge: false
  }
]

const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeSidebar = () => {
  emit('close')
}
</script>

<style scoped>
.admin-sidebar {
  @apply w-64 h-full bg-gradient-to-b from-purple-900 to-purple-700 text-white flex flex-col;
  direction: rtl;
}

.sidebar-header {
  @apply p-6 border-b border-purple-600 relative;
}

.logo-container {
  @apply flex items-center space-x-3 space-x-reverse;
}

.logo-icon {
  @apply w-8 h-8 text-purple-200;
}

.logo-text {
  @apply flex flex-col;
}

.logo-title {
  @apply text-xl font-bold text-white;
}

.logo-subtitle {
  @apply text-sm text-purple-200;
}

.sidebar-nav {
  @apply flex-1 py-4;
}

.nav-list {
  @apply space-y-1 px-4;
}

.nav-item {
  @apply relative;
}

.nav-link {
  @apply flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-purple-100 hover:bg-purple-600 hover:text-white transition-all duration-200;
}

.nav-link.active {
  @apply bg-purple-600 text-white shadow-lg;
}

.nav-link.active::before {
  content: '';
  @apply absolute right-0 top-0 bottom-0 w-1 bg-white rounded-r-lg;
}

.nav-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.nav-text {
  @apply flex-1 text-sm font-medium;
}

.nav-badge {
  @apply w-2 h-2 text-red-400 fill-current;
}

.sidebar-footer {
  @apply p-4 border-t border-purple-600;
}

.user-info {
  @apply flex items-center space-x-3 space-x-reverse mb-4 p-3 bg-purple-600 rounded-lg;
}

.user-avatar {
  @apply w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center;
}

.avatar-icon {
  @apply w-5 h-5 text-white;
}

.user-details {
  @apply flex-1;
}

.user-name {
  @apply text-sm font-medium text-white;
}

.user-role {
  @apply text-xs text-purple-200;
}

.logout-btn {
  @apply w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200;
}

.logout-icon {
  @apply w-4 h-4;
}

/* Close Sidebar Button */
.close-sidebar-btn {
  @apply absolute top-4 left-4 lg:hidden p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors duration-200 z-10;
}

.close-icon {
  @apply w-5 h-5 text-white;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    @apply w-full;
  }
}
</style>
