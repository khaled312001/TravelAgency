export const useSettings = () => {
  const settings = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadSettings = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch('/api/settings')
      if (response.success) {
        settings.value = response.data
      } else {
        throw new Error('Failed to load settings')
      }
    } catch (err) {
      error.value = err
      console.error('Error loading settings:', err)
    } finally {
      loading.value = false
    }
  }

  const getSetting = (category: string, key: string, locale: string = 'en') => {
    if (!settings.value) return null
    
    const categorySettings = settings.value[category]
    if (!categorySettings) return null
    
    const value = categorySettings[key]
    if (!value) return null
    
    // If it's an object with locale keys, return the localized value
    if (typeof value === 'object' && value[locale]) {
      return value[locale]
    }
    
    // If it's an object but no locale key, return the first available value
    if (typeof value === 'object') {
      const firstKey = Object.keys(value)[0]
      return value[firstKey]
    }
    
    return value
  }

  const getLocalizedSetting = (category: string, key: string) => {
    const { locale } = useI18n()
    return getSetting(category, key, locale.value.slice(0, 2))
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
