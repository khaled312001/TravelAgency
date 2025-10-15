// Global settings state
const globalSettings = ref(null)
const globalLoading = ref(false)
const globalError = ref(null)

// Event listeners for settings updates
const settingsUpdateListeners = new Set<() => void>()

// Add listener for settings updates
const addSettingsUpdateListener = (callback: () => void) => {
  settingsUpdateListeners.add(callback)
  return () => settingsUpdateListeners.delete(callback)
}

// Notify all listeners of settings update
const notifySettingsUpdate = () => {
  settingsUpdateListeners.forEach(callback => callback())
}

export const useSettings = () => {
  const settings = globalSettings
  const loading = globalLoading
  const error = globalError

  const loadSettings = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch('/api/settings')
      if (response && response.success && response.data) {
        settings.value = response.data
      } else {
        console.warn('Settings API returned invalid data, using defaults')
        settings.value = {
          general: {
            siteName: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
            siteDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
            siteUrl: 'https://www.worldtripagency.com',
            contactEmail: 'info@worldtripagency.com',
            contactPhone: '+966500982394',
            contactAddress: { ar: 'مكة المكرمة  - شارع الستين ', en: 'Riyadh, Saudi Arabia' }
          },
          logo: {
            mainLogo: '/images/home/logo/WonderlandLogo.svg',
            footerLogo: '/images/home/logo/WonderlandLogoWhite.svg',
            favicon: '/favicon.ico',
            logoHeight: 48,
            showLogoText: true,
            logoText: { ar: 'أرض العجائب', en: 'World Trip Agency' }
          }
        }
      }
    } catch (err) {
      error.value = err
      console.error('Error loading settings:', err)
      // Set default settings on error
      settings.value = {
        general: {
          siteName: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
          siteDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
          siteUrl: 'https://www.worldtripagency.com',
          contactEmail: 'info@worldtripagency.com',
          contactPhone: '+966500982394',
          contactAddress: { ar: 'مكة المكرمة  - شارع الستين ', en: 'Riyadh, Saudi Arabia' }
        },
        logo: {
          mainLogo: '/images/home/logo/WonderlandLogo.svg',
          footerLogo: '/images/home/logo/WonderlandLogoWhite.svg',
          favicon: '/favicon.ico',
          logoHeight: 48,
          showLogoText: true,
          logoText: { ar: 'أرض العجائب', en: 'World Trip Agency' }
        }
      }
    } finally {
      loading.value = false
    }
  }

  const getSetting = (category: string, key: string, locale: string = 'en') => {
    try {
      if (!settings.value) return null
      
      const categorySettings = settings.value[category]
      if (!categorySettings) return null
      
      const value = categorySettings[key]
      if (!value) return null
      
      // If it's an object with locale keys, return the localized value
      if (typeof value === 'object' && value !== null && value[locale]) {
        return value[locale]
      }
      
      // If it's an object but no locale key, return the first available value
      if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value)
        if (keys.length > 0) {
          return value[keys[0]]
        }
      }
      
      return value
    } catch (error) {
      console.error('Error in getSetting:', error, { category, key, locale })
      return null
    }
  }

  const getLocalizedSetting = (category: string, key: string) => {
    try {
      // Get current locale from i18n context
      const currentLocale = process.client ? 
        (document.documentElement.lang === 'ar-SA' ? 'ar' : 'en') : 'ar'
      return getSetting(category, key, currentLocale)
    } catch (error) {
      console.error('Error in getLocalizedSetting:', error, { category, key })
      return null
    }
  }

  const updateSettings = (newSettings: any) => {
    console.log('Settings updated globally:', newSettings)
    settings.value = newSettings
    notifySettingsUpdate()
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  return {
    settings: readonly(settings),
    loading: readonly(loading),
    error: readonly(error),
    loadSettings,
    getSetting,
    getLocalizedSetting,
    updateSettings,
    refreshSettings,
    addSettingsUpdateListener
  }
}
