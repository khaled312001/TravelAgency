import { ref, computed, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'

/**
 * Composable for managing PWA installation
 * Leverages the official PWA module's API while providing a clean interface
 */
export const usePwaInstall = () => {
  const nuxtApp = useNuxtApp()
  const { $pwa } = nuxtApp
  
  // Local state
  const installDismissed = ref(false)
  const installationInProgress = ref(false)
  
  // Check if we should show the prompt based on localStorage
  const shouldShowPrompt = () => {
    if (typeof window === 'undefined' || !window.localStorage) return true
    
    const lastDismissed = window.localStorage.getItem('pwa-install-dismissed')
    if (!lastDismissed) return true
    
    // Don't show again for 24 hours after dismissal
    const dismissedTime = parseInt(lastDismissed, 10)
    const now = Date.now()
    const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60)
    
    return hoursSinceDismissed > 24
  }
  
  // Computed property to determine if prompt should be shown
  const showInstallPrompt = computed(() => {
    const shouldShow = $pwa?.showInstallPrompt && 
                      !$pwa?.offlineReady && 
                      !$pwa?.needRefresh &&
                      !installDismissed.value &&
                      shouldShowPrompt()
    
    return shouldShow
  })
  
  // Check if the app is already installed
  const isInstalled = computed(() => {
    if (typeof window === 'undefined') return false
    
    // Check if running as standalone PWA
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.matchMedia('(display-mode: fullscreen)').matches ||
           window.matchMedia('(display-mode: minimal-ui)').matches ||
           // @ts-ignore - Safari specific
           window.navigator.standalone === true ||
           // Use the PWA module's property if available
           $pwa?.isPWAInstalled === true
  })
  
  // Install the app
  const install = async () => {
    if (installationInProgress.value) return
    
    installationInProgress.value = true
    
    try {
      if (!$pwa) {
        throw new Error('PWA module not available')
      }
      
      if (typeof $pwa.install !== 'function') {
        throw new Error('PWA install method not available')
      }
      
      // Call the official install method
      const result = await $pwa.install()
      
      // Handle the result
      if (result && result.outcome === 'accepted') {
      } else {
        dismissPrompt()
      }
    } catch (error) {
      
      // Show a fallback message for manual installation
      if (typeof window !== 'undefined') {
        alert('Please use your browser menu to install this app (Add to Home Screen)')
      }
    } finally {
      // Always reset the installation progress state, regardless of outcome
      setTimeout(() => {
        installationInProgress.value = false
      }, 1000) // Small delay to ensure UI updates properly
    }
  }
  
  // Dismiss the prompt
  const dismissPrompt = () => {
    
    // Use the official module's method if available
    if ($pwa) {
      if (typeof $pwa.cancelPrompt === 'function') {
        $pwa.cancelPrompt()
      } else if (typeof $pwa.cancelInstall === 'function') {
        $pwa.cancelInstall()
      }
    }
    
    // Track dismissal in local state
    installDismissed.value = true
    
    // Store the dismissal in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }
  }
  
  return {
    showInstallPrompt,
    isInstalled,
    install,
    dismissPrompt,
    installationInProgress
  }
}
