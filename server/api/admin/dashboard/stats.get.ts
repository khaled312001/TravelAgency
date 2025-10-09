export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching dashboard stats...')
    
    // Return mock stats for now
    const mockStats = {
      totalUsers: 5,
      totalPackages: 12,
      totalBookings: 8,
      totalDestinations: 16,
      newMessages: 3,
      confirmedBookings: 5,
      pendingBookings: 3,
      totalRevenue: 15750
    }

    console.log('Dashboard stats fetched successfully:', mockStats)

    return mockStats

  } catch (error: any) {
    console.error('Dashboard stats fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
