// Server-side content preloading to prevent hydration mismatches
export default defineNuxtPlugin(async () => {
  // This plugin runs only on the server side
  // It ensures content is available during SSR
  if (process.server) {
    try {
      // Preload content on server side
      const { useSiteContent } = await import('~/composables/useSiteContent')
      const { init } = useSiteContent()
      await init()
    } catch (error) {
      // Silently handle errors - content will load on client side
      console.warn('Failed to preload content on server:', error)
    }
  }
})
