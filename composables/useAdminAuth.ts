import type { AdminUser, AdminLoginRequest, AdminLoginResponse } from '~/types/admin'

export const useAdminAuth = () => {
  const user = ref<AdminUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('admin_user')
      const storedToken = localStorage.getItem('admin_token')
      
      if (storedUser && storedToken) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          clearAuth()
        }
      }
    }
  }

  // Login function
  const login = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    isLoading.value = true
    
    try {
      const data = await $fetch<AdminLoginResponse>('/api/admin/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (data.success && data.user && data.sessionToken) {
        user.value = data.user
        
        if (process.client) {
          localStorage.setItem('admin_user', JSON.stringify(data.user))
          localStorage.setItem('admin_token', data.sessionToken)
        }
      }

      return data
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    isLoading.value = true
    
    try {
      const token = process.client ? localStorage.getItem('admin_token') : null
      
      if (token) {
        await $fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      isLoading.value = false
    }
  }

  // Clear auth state
  const clearAuth = () => {
    user.value = null
    
    if (process.client) {
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_token')
    }
  }

  // Check current user
  const checkAuth = async () => {
    if (!process.client) return

    const token = localStorage.getItem('admin_token')
    if (!token) {
      clearAuth()
      return
    }

    try {
      const currentUser = await $fetch<AdminUser>('/api/admin/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      user.value = currentUser
      localStorage.setItem('admin_user', JSON.stringify(currentUser))
    } catch (error) {
      console.error('Auth check error:', error)
      clearAuth()
    }
  }

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    if (!process.client) return {}
    
    const token = localStorage.getItem('admin_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  // Initialize on client side
  if (process.client) {
    initializeAuth()
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    checkAuth,
    getAuthHeaders,
    clearAuth
  }
}
