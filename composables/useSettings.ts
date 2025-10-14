export const useSettings = () => {
  const settings = ref(null)
  const loading = ref(false)
  const error = ref(null)

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
      const { locale } = useI18n()
      const currentLocale = locale.value === 'ar-SA' ? 'ar' : 'en'
      return getSetting(category, key, currentLocale)
    } catch (error) {
      console.error('Error in getLocalizedSetting:', error, { category, key })
      return null
    }
  }

  return {
    settings: readonly(settings),
    loading: readonly(loading),
    error: readonly(error),
    loadSettings,
    getSetting,
    getLocalizedSetting
  }
}
