import { ref } from 'vue'
import type { Destination } from '~/types/destination'

export const useDestinations = () => {
  // Fetch destinations from API
  const { data: saudiDestinationsData } = useAsyncData('saudi-destinations', () => 
    $fetch('/api/destinations', {
      query: { country: 'Saudi Arabia' }
    })
  )

  const { data: globalDestinationsData } = useAsyncData('global-destinations', () => 
    $fetch('/api/destinations', {
      query: { 'country.ne': 'Saudi Arabia' }
    })
  )

  const saudiDestinations = computed(() => saudiDestinationsData.value?.destinations || [])
  const globalDestinations = computed(() => globalDestinationsData.value?.destinations || [])

  // Get destination by ID
  const getDestinationById = (id: string): Destination | null => {
    const destination = [...saudiDestinations.value, ...globalDestinations.value]
      .find(d => d.id === id)
    
    if (!destination) return null
    return destination
  }

  // Get localized name
  const getLocalizedName = (destination: Destination): string => {
    const { locale } = useI18n()
    return destination.name[locale.value as keyof typeof destination.name] || destination.name.en
  }

  // Get localized description
  const getLocalizedDescription = (destination: Destination): string => {
    const { locale } = useI18n()
    return destination.description[locale.value as keyof typeof destination.description] || destination.description.en
  }

  return {
    saudiDestinations,
    globalDestinations,
    getDestinationById,
    getLocalizedName,
    getLocalizedDescription
  }
}