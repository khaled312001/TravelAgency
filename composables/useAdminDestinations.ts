import { ref } from 'vue'
import type { Database } from '~/types/supabase'

type Destination = Database['public']['Tables']['destinations']['Row']
type DestinationInsert = Database['public']['Tables']['destinations']['Insert']
type DestinationUpdate = Database['public']['Tables']['destinations']['Update']

export const useAdminDestinations = () => {
  const destinations = ref<Destination[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getAuthHeaders } = useAdminAuth()

  // Fetch destinations
  const fetchDestinations = async (params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    type?: string
    featured?: boolean
  } = {}) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.type) queryParams.append('type', params.type)
      if (params.featured !== undefined) queryParams.append('featured', params.featured.toString())

      const response = await $fetch(`/api/admin/destinations?${queryParams}`, {
        headers: getAuthHeaders()
      })

      destinations.value = response.destinations
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch destinations'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create destination
  const createDestination = async (destinationData: DestinationInsert) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/admin/destinations', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: destinationData
      })

      await fetchDestinations() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create destination'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update destination
  const updateDestination = async (id: string, destinationData: DestinationUpdate) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/destinations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: destinationData
      })

      await fetchDestinations() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update destination'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete destination
  const deleteDestination = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/destinations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      await fetchDestinations() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to delete destination'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    destinations: readonly(destinations),
    loading: readonly(loading),
    error: readonly(error),
    fetchDestinations,
    createDestination,
    updateDestination,
    deleteDestination
  }
}
