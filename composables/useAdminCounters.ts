export const useAdminCounters = () => {
  const notificationCount = ref(0)
  const messageCount = ref(0)
  const bookingCount = ref(0)
  const loading = ref(false)

  // Load notification count
  const loadNotificationCount = async () => {
    try {
      const response = await $fetch('/api/admin/notifications?status=unread')
      if (response.success) {
        notificationCount.value = response.notifications?.length || 0
      }
    } catch (error) {
      console.error('Error loading notification count:', error)
      notificationCount.value = 0
    }
  }

  // Load message count
  const loadMessageCount = async () => {
    try {
      const response = await $fetch('/api/admin/contact-messages?status=unread')
      if (response.success) {
        messageCount.value = response.data?.length || 0
      }
    } catch (error) {
      console.error('Error loading message count:', error)
      messageCount.value = 0
    }
  }

  // Load booking count (new bookings)
  const loadBookingCount = async () => {
    try {
      const response = await $fetch('/api/admin/bookings?status=pending')
      if (response.success) {
        bookingCount.value = response.bookings?.length || 0
      }
    } catch (error) {
      console.error('Error loading booking count:', error)
      bookingCount.value = 0
    }
  }

  // Load all counts
  const loadAllCounts = async () => {
    loading.value = true
    try {
      await Promise.all([
        loadNotificationCount(),
        loadMessageCount(),
        loadBookingCount()
      ])
    } catch (error) {
      console.error('Error loading all counts:', error)
    } finally {
      loading.value = false
    }
  }

  // Auto-refresh counts every 30 seconds
  const startAutoRefresh = () => {
    const interval = setInterval(loadAllCounts, 30000)
    onUnmounted(() => clearInterval(interval))
  }

  // Initialize counters
  const initialize = async () => {
    await loadAllCounts()
    startAutoRefresh()
  }

  return {
    notificationCount: readonly(notificationCount),
    messageCount: readonly(messageCount),
    bookingCount: readonly(bookingCount),
    loading: readonly(loading),
    loadNotificationCount,
    loadMessageCount,
    loadBookingCount,
    loadAllCounts,
    initialize
  }
}
