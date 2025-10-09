import { ref } from 'vue'
import type { Database } from '~/types/supabase'

type Booking = Database['public']['Tables']['bookings']['Row']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export const useAdminBookings = () => {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getAuthHeaders } = useAdminAuth()

  // Fetch bookings
  const fetchBookings = async (params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    package_id?: string
    date_from?: string
    date_to?: string
  } = {}) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.package_id) queryParams.append('package_id', params.package_id)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)

      const response = await $fetch(`/api/admin/bookings?${queryParams}`, {
        headers: getAuthHeaders()
      })

      bookings.value = response.bookings
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookings'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update booking
  const updateBooking = async (id: string, bookingData: BookingUpdate) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: bookingData
      })

      await fetchBookings() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update booking'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete booking
  const deleteBooking = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      await fetchBookings() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to delete booking'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings: readonly(bookings),
    loading: readonly(loading),
    error: readonly(error),
    fetchBookings,
    updateBooking,
    deleteBooking
  }
}
