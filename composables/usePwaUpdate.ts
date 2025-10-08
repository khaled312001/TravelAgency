import { ref } from 'vue'

/**
 * Composable for managing PWA updates
 * Handles notifications when new content is available and provides functions to update or dismiss
 */
export const usePwaUpdate = () => {
  // Reactive state from the PWA plugin
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateServiceWorker = ref<(() => Promise<void>) | null>(null)
  const updateDismissed = ref(false)

  /**
   * Updates the service worker with new content
   */
  const onNeedRefresh = (updateFn: () => Promise<void>) => {
    // Check if the update was previously dismissed but not applied
    const wasDismissed = localStorage.getItem('pwa-update-dismissed')
    const dismissedTime = localStorage.getItem('pwa-update-dismissed-time')
    
    // Show the update prompt if:
    // 1. It was never dismissed, or
    // 2. It was dismissed but we're in a new session (page refresh/revisit)
    if (!wasDismissed || (wasDismissed && dismissedTime)) {
      needRefresh.value = true
      updateServiceWorker.value = updateFn
      // Clear the dismissed flag when showing the prompt again
      localStorage.removeItem('pwa-update-dismissed')
      localStorage.removeItem('pwa-update-dismissed-time')
    }
  }

  /**
   * Sets offline ready state to true
   */
  const onOfflineReady = () => {
    offlineReady.value = true
  }

  /**
   * Dismisses the update prompt without updating
   * Stores the dismissal in localStorage to track for next visit
   */
  const close = () => {
    needRefresh.value = false
    offlineReady.value = false
    updateDismissed.value = true
    
    // Mark as dismissed for this session, but allow it to show again on refresh
    localStorage.setItem('pwa-update-dismissed', 'true')
    localStorage.setItem('pwa-update-dismissed-time', Date.now().toString())
  }

  return {
    // State
    needRefresh,
    offlineReady,
    updateServiceWorker,
    updateDismissed,
    // Methods
    onNeedRefresh,
    onOfflineReady,
    close
  }
}
