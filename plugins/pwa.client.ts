// PWA plugin for handling service worker registration and updates
import { watch } from 'vue'
import { usePwaUpdate } from '~/composables/usePwaUpdate'
import { usePwaInstall } from '~/composables/usePwaInstall'

// Define the PWA injection type based on the official documentation
interface PwaInjection {
  isInstalled: boolean
  isPWAInstalled: Ref<boolean>
  showInstallPrompt: Ref<boolean>
  cancelInstall: () => void
  install: () => Promise<void>
  swActivated: Ref<boolean>
  registrationError: Ref<boolean>
  offlineReady: Ref<boolean>
  needRefresh: Ref<boolean>
  updateServiceWorker: (reloadPage?: boolean | undefined) => Promise<void>
  cancelPrompt: () => Promise<void>
  getSWRegistration: () => ServiceWorkerRegistration | undefined
}

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (process.client) {
    // Check if PWA is available before trying to use it
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const pwaUpdate = usePwaUpdate()
        const pwaInstall = usePwaInstall()
        
        // Access the PWA plugin provided by @vite-pwa/nuxt
        const { $pwa } = nuxtApp
        
        if ($pwa && typeof $pwa === 'object') {
          // Cast to our defined type
          const pwa = $pwa as unknown as PwaInjection
          
          // Watch for service worker updates
          watch(pwa.needRefresh, (needRefresh) => {
            if (needRefresh) {
              // Notify user about update using our custom composable
              pwaUpdate.onNeedRefresh(() => pwa.updateServiceWorker())
            }
          })
          
          // Watch for PWA installation status
          watch(pwa.showInstallPrompt, (showInstallPrompt) => {
            if (showInstallPrompt) {
              // Sync with our custom install prompt state
              pwaInstall.onBeforeInstallPrompt({
                preventDefault: () => {},
                // Create a custom event that matches what our composable expects
                prompt: async () => {
                  await pwa.install()
                },
                userChoice: Promise.resolve({ outcome: 'accepted' })
              } as unknown as Event)
            }
          })
          
          // Watch for service worker activation
          watch(pwa.swActivated, (activated) => {
            if (activated) {
              console.info('Service worker activated successfully')
            }
          })
          
          // Watch for registration errors
          watch(pwa.registrationError, (error) => {
            if (error) {
              console.error('Service worker registration error')
            }
          })
          
          // Log PWA status on initialization
          console.info('PWA plugin initialized successfully')
        } else {
          // PWA plugin not available - this is normal in some deployment scenarios
          // Silent mode - no console output
        }
      } catch (error) {
        // Handle any errors gracefully - silent mode
      }
    } else {
      // Service worker not supported - silent mode
    }
  }
})
