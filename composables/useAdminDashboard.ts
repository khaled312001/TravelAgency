import type { DashboardStats, BookingDistribution, MonthlySales, PopularPackage, RecentActivity } from '~/types/admin'

export const useAdminDashboard = () => {
  const stats = ref<DashboardStats | null>(null)
  const bookingDistribution = ref<BookingDistribution[]>([])
  const monthlySales = ref<MonthlySales[]>([])
  const popularPackages = ref<PopularPackage[]>([])
  const recentActivities = ref<RecentActivity[]>([])
  const isLoading = ref(false)

  const { getAuthHeaders } = useAdminAuth()

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const data = await $fetch<DashboardStats>('/api/admin/dashboard/stats', {
        headers: getAuthHeaders()
      })
      stats.value = data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Fetch chart data
  const fetchCharts = async () => {
    try {
      const data = await $fetch<{
        bookingDistribution: BookingDistribution[]
        monthlySales: MonthlySales[]
      }>('/api/admin/dashboard/charts', {
        headers: getAuthHeaders()
      })
      
      bookingDistribution.value = data.bookingDistribution
      monthlySales.value = data.monthlySales
    } catch (error) {
      console.error('Error fetching chart data:', error)
      throw error
    }
  }

  // Fetch popular packages
  const fetchPopularPackages = async () => {
    try {
      const data = await $fetch<PopularPackage[]>('/api/admin/dashboard/popular-packages', {
        headers: getAuthHeaders()
      })
      popularPackages.value = data
    } catch (error) {
      console.error('Error fetching popular packages:', error)
      throw error
    }
  }

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const data = await $fetch<RecentActivity[]>('/api/admin/dashboard/recent-activities', {
        headers: getAuthHeaders()
      })
      recentActivities.value = data
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      throw error
    }
  }

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    isLoading.value = true
    
    try {
      await Promise.all([
        fetchStats(),
        fetchCharts(),
        fetchPopularPackages(),
        fetchRecentActivities()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats: readonly(stats),
    bookingDistribution: readonly(bookingDistribution),
    monthlySales: readonly(monthlySales),
    popularPackages: readonly(popularPackages),
    recentActivities: readonly(recentActivities),
    isLoading: readonly(isLoading),
    fetchStats,
    fetchCharts,
    fetchPopularPackages,
    fetchRecentActivities,
    fetchDashboardData
  }
}
