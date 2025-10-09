import { ref } from 'vue'
import type { Database } from '~/types/supabase'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

export const useAdminUsers = () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getAuthHeaders } = useAdminAuth()

  // Fetch users
  const fetchUsers = async (params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    role?: string
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
      if (params.role) queryParams.append('role', params.role)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)

      const response = await $fetch(`/api/admin/users?${queryParams}`, {
        headers: getAuthHeaders()
      })

      users.value = response.users
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create user
  const createUser = async (userData: UserInsert) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: userData
      })

      await fetchUsers() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update user
  const updateUser = async (id: string, userData: UserUpdate) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: userData
      })

      await fetchUsers() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete user
  const deleteUser = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      await fetchUsers() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
