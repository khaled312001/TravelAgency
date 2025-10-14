export const useSiteContent = () => {
  const content = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Load content from API
  const loadContent = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch('/api/admin/content')
      content.value = data
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
  const getHeroContent = (field: 'title' | 'subtitle' | 'cta' | 'video_desktop' | 'video_mobile' | 'poster_image', language: 'ar' | 'en' = 'ar') => {
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

  // Initialize content loading
  const init = async () => {
    if (!content.value) {
      await loadContent()
    }
  }

  // Force reload content
  const reload = async () => {
    content.value = null
    await loadContent()
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
