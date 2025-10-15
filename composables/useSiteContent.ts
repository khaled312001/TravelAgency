// Global singleton state
let globalContent = ref(null)
let globalIsLoading = ref(false)
let globalError = ref(null)
let isInitialized = false
let initPromise: Promise<void> | null = null

export const useSiteContent = () => {
  const content = globalContent
  const isLoading = globalIsLoading
  const error = globalError

  // Load content from API
  const loadContent = async () => {
    if (isLoading.value) return // Prevent concurrent loads
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/admin/content')
      const data = response.data || response
      content.value = data
      console.log('Content loaded:', data)
    } catch (err) {
      error.value = err
      console.error('Error loading site content:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Get content for a specific section and language
  const getContent = (section: string, field: string, language: 'ar' | 'en' = 'ar') => {
    if (!content.value) return ''
    
    const sectionContent = content.value[section]
    if (!sectionContent) return ''
    
    const fieldContent = sectionContent[field]
    if (!fieldContent) return ''
    
    return fieldContent[language] || ''
  }

  // Get hero content
  const getHeroContent = (field: 'title' | 'subtitle' | 'cta' | 'video', language: 'ar' | 'en' = 'ar') => {
    if (field === 'video') {
      // Video is stored directly, not in language object
      if (!content.value) return ''
      const sectionContent = content.value.hero
      if (!sectionContent) return ''
      return sectionContent.video || ''
    }
    return getContent('hero', field, language)
  }

  // Get search content
  const getSearchContent = (field: 'title' | 'description', language: 'ar' | 'en' = 'ar') => {
    return getContent('search', field, language)
  }

  // Get services content
  const getServicesContent = (field: 'title' | 'subtitle' | 'description', language: 'ar' | 'en' = 'ar') => {
    return getContent('services', field, language)
  }

  // Get destinations content
  const getDestinationsContent = (destination: 'saudi' | 'global', field: 'title' | 'subtitle', language: 'ar' | 'en' = 'ar') => {
    if (!content.value) return ''
    
    const destinationsContent = content.value.destinations
    if (!destinationsContent) return ''
    
    const destinationContent = destinationsContent[destination]
    if (!destinationContent) return ''
    
    const fieldContent = destinationContent[field]
    if (!fieldContent) return ''
    
    return fieldContent[language] || ''
  }

  // Initialize content loading (singleton)
  const init = async () => {
    if (isInitialized) return
    
    if (initPromise) {
      return initPromise
    }
    
    initPromise = loadContent()
    await initPromise
    isInitialized = true
  }

  // Force reload content
  const reload = async () => {
    content.value = null
    isInitialized = false
    initPromise = null
    await loadContent()
    isInitialized = true
  }

  return {
    content: readonly(content),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadContent,
    reload,
    getContent,
    getHeroContent,
    getSearchContent,
    getServicesContent,
    getDestinationsContent,
    init
  }
}
