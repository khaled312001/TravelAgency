<template>
  <Transition name="slide-down">
    <div 
      v-if="!isOnline && show" 
      class="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-4 flex flex-col md:flex-row items-center justify-between z-50 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex items-center gap-2 mb-3 md:mb-0">
        <Icon name="material-symbols:error-outline-rounded" class="h-6 w-6 flex-shrink-0 text-white" />
        <div>
          <span class="font-semibold">{{ $t('pwa.offlineNotification.title') }}</span>
          <span class="ml-2">{{ $t('pwa.offlineNotification.description') }}</span>
        </div>
      </div>
      <button 
        class="px-4 py-3 md:py-2 bg-white text-red-500 rounded-lg text-sm font-medium w-full md:w-auto min-h-[44px]"
        @click="dismiss"
      >
        {{ $t('common.close') }}
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const isOnline = ref(true)
const show = ref(false)

// Function to check connection and update UI
const updateOnlineStatus = () => {
  const online = navigator.onLine
  isOnline.value = online
  
  // Only show notification when going offline
  if (!online) {
    show.value = true
  }
}

function dismiss() {
  show.value = false
}

// Watch for online status changes
watch(isOnline, (newValue) => {
  if (!newValue) {
    show.value = true
  }
})

// Event handlers for online/offline events
const handleOnline = () => { isOnline.value = true }
const handleOffline = () => { isOnline.value = false }

onMounted(() => {
  // Initialize with current online status
  updateOnlineStatus()
  
  // Listen for online/offline events
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Check connection status periodically
  const intervalId = setInterval(updateOnlineStatus, 5000)
  
  // Cleanup interval on component unmount
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
