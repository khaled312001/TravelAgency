// Global cache for about content
let globalAboutContent = ref<any>(null)
let globalIsLoading = ref(false)
let globalError = ref<any>(null)

export const useAboutContent = () => {
  const aboutContent = globalAboutContent
  const isLoading = globalIsLoading
  const error = globalError

  const loadAboutContent = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/admin/content/about')
      aboutContent.value = response.data
      console.log('About content loaded:', response.data)
      return aboutContent.value
    } catch (err) {
      error.value = err
      console.error('Error loading about content:', err)
      
      // Return default content on error
      const defaultContent = {
        hero: {
          title: { 
            ar: 'شريكك الموثوق به لتجارب سفر استثنائية منذ عام 2019',
            en: 'Your Trusted Partner for Exceptional Travel Experiences Since 2019'
          },
          subtitle: { 
            ar: 'اكتشف تجربة السفر مع World Trip Agency - حيث تتحول كل رحلة إلى مغامرة لا تُنسى',
            en: 'Discover the travel experience with World Trip Agency – where every journey transforms into an unforgettable adventure'
          }
        },
        overview: {
          title: { 
            ar: 'World Trip Agency للسفر والسياحة',
            en: 'World Trip Agency Travel & Tourism'
          },
          intro: { 
            ar: 'هل تبحث عن تجربة سفر لا تُنسى بأسعار لا تُقاوم؟ World Trip Agency هي بوابتك إلى عالم مليء بالمغامرات والرفاهية، حيث نقدم أفضل العروض وأعلى مستويات الخدمة!',
            en: 'Are you looking for an unforgettable travel experience at irresistible prices? World Trip Agency is your gateway to a world filled with adventures and luxury, where we offer the best deals and the highest level of service!'
          },
          why_choose_us: { 
            ar: 'لماذا تختار World Trip Agency؟',
            en: 'Why Choose World Trip Agency?'
          },
          about_title: { 
            ar: 'عن World Trip Agency للسفر والسياحة',
            en: 'About World Trip Agency Travel & Tourism'
          },
          about_text: { 
            ar: 'تأسست World Trip Agency للسفر والسياحة في عام 2019، لتكون بوابتك إلى رحلات فريدة وتجارب سفر استثنائية. نحن متخصصون في تقديم خدمات سفر شاملة تضمن تجربة سلسة ومريحة لكل مسافر - سواء كانت إجازات عائلية، أو جولات فاخرة، أو استكشافات مغامرة.',
            en: 'World Trip Agency Travel & Tourism was established in 2019 as your gateway to unique trips and exceptional travel experiences. We specialize in offering comprehensive travel services that ensure a seamless and comfortable experience for every traveler – whether it\'s family vacations, luxury tours, or adventurous explorations.'
          }
        }
      }
      
      aboutContent.value = defaultContent
      return defaultContent
    } finally {
      isLoading.value = false
    }
  }

  const reloadAboutContent = async () => {
    console.log('Reloading about content...')
    aboutContent.value = null
    const result = await loadAboutContent()
    console.log('About content reloaded:', result)
    return result
  }

  return {
    aboutContent: readonly(aboutContent),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadAboutContent,
    reloadAboutContent
  }
}
