import { ref } from 'vue'
import type { Database } from '~/types/supabase'

type Package = Database['public']['Tables']['packages']['Row']
type PackageInsert = Database['public']['Tables']['packages']['Insert']
type PackageUpdate = Database['public']['Tables']['packages']['Update']

export const useAdminPackages = () => {
  const packages = ref<Package[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getAuthHeaders } = useAdminAuth()

  // Fetch packages
  const fetchPackages = async (params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    category?: string
  } = {}) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.category) queryParams.append('category', params.category)

      const response = await $fetch(`/api/admin/packages?${queryParams}`, {
        headers: getAuthHeaders()
      })

      packages.value = response.packages
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch packages'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create package
  const createPackage = async (packageData: PackageInsert) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/admin/packages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: packageData
      })

      await fetchPackages() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create package'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update package
  const updatePackage = async (id: string, packageData: PackageUpdate) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: packageData
      })

      await fetchPackages() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update package'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete package
  const deletePackage = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      await fetchPackages() // Refresh list
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to delete package'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    packages: readonly(packages),
    loading: readonly(loading),
    error: readonly(error),
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage
  }
}
