<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <AdminSidebar v-if="!isMobile || showSidebar" class="admin-sidebar" @close="closeSidebar" />

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Header -->
      <AdminHeader @toggle-sidebar="toggleSidebar" />

      <!-- Content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="isMobile && showSidebar" 
      class="mobile-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
const showSidebar = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const closeSidebar = () => {
  showSidebar.value = false
}

// Check if mobile on mount
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

// Apply admin auth middleware
definePageMeta({
  middleware: 'admin-auth'
})
</script>

<style scoped>
.admin-layout {
  @apply min-h-screen bg-gray-50 flex;
  direction: rtl;
}

.admin-sidebar {
  @apply fixed lg:relative top-0 right-0 h-full z-50 lg:z-auto;
}

.admin-main {
  @apply flex-1 flex flex-col;
}

.admin-content {
  @apply flex-1 p-4;
}

.mobile-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-main {
    @apply mr-0;
  }
}
</style>