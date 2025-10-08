<template>
  <div>
    <!-- Update prompt modal -->
    <Transition name="fade">
      <div v-if="shouldShowPrompt" class="pwa-update-prompt fixed bottom-0 inset-x-0 md:bottom-4 md:right-4 md:left-auto z-50">
        <div class="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-t-lg md:rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto md:mx-0">
          <div class="flex items-start mb-3">
            <div class="flex-shrink-0 mr-3">
              <Icon name="material-symbols:system-update" class="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                {{ $t('pwa.updatePrompt.title') }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ $t('pwa.updatePrompt.description') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              @click="reloadApp"
              class="w-full sm:flex-1 inline-flex justify-center px-4 py-3 md:py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ $t('pwa.updatePrompt.buttons.update') }}
            </button>
            <button
              @click="handleClosePrompt"
              class="w-full sm:flex-1 inline-flex justify-center px-4 py-3 md:py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ $t('pwa.updatePrompt.buttons.dismiss') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Offline ready notification (toast) -->
    <Transition name="slide-up">
      <div v-if="offlineReady" class="pwa-offline-toast fixed bottom-4 inset-x-0 z-50 flex justify-center px-4">
        <div class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-100 px-4 py-3 rounded-lg shadow-lg flex items-center max-w-sm">
          <svg class="h-5 w-5 mr-3 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-sm font-medium">{{ $t('pwa.offlineNotification.title') }}</p>
          <button 
            @click="closeOfflineToast" 
            class="ml-auto text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 focus:outline-none"
          >
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePwaUpdate } from '~/composables/usePwaUpdate'

// Use the PWA composable for update logic
const { offlineReady, needRefresh, updateServiceWorker, close } = usePwaUpdate()

// Local state for UI control
const offlineToastVisible = ref(true)
const dismissedUpdatePrompt = ref(false)
const lastDismissedTime = ref(0)
const MIN_DISMISS_INTERVAL = 1000 * 60 * 60 // 1 hour

// Compute whether to show the update prompt
const shouldShowPrompt = computed(() => {
  if (!needRefresh.value || dismissedUpdatePrompt.value) {
    return false
  }
  
  // If previously dismissed, only show again after MIN_DISMISS_INTERVAL
  if (Date.now() - lastDismissedTime.value < MIN_DISMISS_INTERVAL) {
    return false
  }
  
  return true
})

// Function to close the offline toast
const closeOfflineToast = () => {
  offlineToastVisible.value = false
  close()
}

// Function to reload the app and apply updates
const reloadApp = async () => {
  try {
    // Save current URL path for restoration after update
    const currentPath = window.location.pathname + window.location.search + window.location.hash
    localStorage.setItem('pwa-update-redirect', currentPath)
    
    // Update service worker and reload the page
    if (updateServiceWorker.value) {
      await updateServiceWorker.value()
      // Force reload after update
      window.location.reload()
    } else {
      // Force reload as fallback if updateServiceWorker is not available
      window.location.reload()
    }
  } catch (error) {
    console.error('Failed to update service worker:', error)
    // Force reload as fallback
    window.location.reload()
  }
}

// Function to close prompt but track dismissal time
const handleClosePrompt = () => {
  dismissedUpdatePrompt.value = true
  lastDismissedTime.value = Date.now()
  localStorage.setItem('pwa-last-dismissed', lastDismissedTime.value.toString())
  close()
}

// Check for previously stored dismissal time
onMounted(() => {
  const storedDismissTime = localStorage.getItem('pwa-last-dismissed')
  if (storedDismissTime) {
    lastDismissedTime.value = parseInt(storedDismissTime, 10)
  }
  
  // Check for redirect after update
  const redirectPath = localStorage.getItem('pwa-update-redirect')
  if (redirectPath && window.location.pathname === '/') {
    // Clear stored path
    localStorage.removeItem('pwa-update-redirect')
    
    // Don't redirect if we're already on the saved path 
    // if (redirectPath !== '/') {
    //   // Use router to navigate
    //   const router = useRouter()
    //   router.replace(redirectPath)
    // }
  }
})

// Reset toast visibility when offline ready changes
watch(offlineReady, (newValue) => {
  if (newValue) {
    offlineToastVisible.value = true
    
    // Auto-hide offline toast after 5 seconds
    setTimeout(() => {
      closeOfflineToast()
    }, 5000)
  }
})

// Clear dismissal state when a new update is detected
watch(needRefresh, (newValue) => {
  if (newValue) {
    // Check if enough time has passed since last dismissal
    if (Date.now() - lastDismissedTime.value >= MIN_DISMISS_INTERVAL) {
      dismissedUpdatePrompt.value = false
    }
  }
})
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Toast notification */
.pwa-offline-toast {
  pointer-events: none;
}

.pwa-offline-toast > div {
  pointer-events: auto;
}

/* Responsive adjustments */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition-duration: 0.1s;
  }
}
</style>