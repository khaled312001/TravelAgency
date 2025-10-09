import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { type, period } = query

    // Get bookings data
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('seo_settings')
      .select('description_ar')
      .eq('page', 'bookings')
      .single()

    if (bookingsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch bookings data'
      })
    }

    const bookings = JSON.parse(bookingsData.description_ar || '[]')

    // Get contact messages data
    const { data: messagesData, error: messagesError } = await supabase
      .from('contact_messages')
      .select('*')

    if (messagesError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch messages data'
      })
    }

    // Get packages data
    const { data: packagesData, error: packagesError } = await supabase
      .from('packages')
      .select('*')

    if (packagesError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch packages data'
      })
    }

    // Calculate analytics based on type
    let analyticsData = {}

    switch (type) {
      case 'revenue':
        analyticsData = calculateRevenueAnalytics(bookings, period)
        break
      case 'bookings':
        analyticsData = calculateBookingsAnalytics(bookings, period)
        break
      case 'packages':
        analyticsData = calculatePackageAnalytics(bookings, packagesData)
        break
      case 'demographics':
        analyticsData = calculateDemographicsAnalytics(bookings, messagesData)
        break
      case 'destinations':
        analyticsData = calculateDestinationAnalytics(bookings)
        break
      default:
        analyticsData = {
          revenue: calculateRevenueAnalytics(bookings, period),
          bookings: calculateBookingsAnalytics(bookings, period),
          packages: calculatePackageAnalytics(bookings, packagesData),
          demographics: calculateDemographicsAnalytics(bookings, messagesData),
          destinations: calculateDestinationAnalytics(bookings)
        }
    }

    return {
      success: true,
      data: analyticsData
    }

  } catch (error) {
    console.error('Analytics error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

function calculateRevenueAnalytics(bookings: any[], period: string) {
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case '6months':
      startDate.setMonth(now.getMonth() - 6)
      break
    case '12months':
      startDate.setMonth(now.getMonth() - 12)
      break
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setMonth(now.getMonth() - 6)
  }

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.created_at)
    return bookingDate >= startDate
  })

  // Group by month
  const monthlyRevenue = {}
  filteredBookings.forEach(booking => {
    const date = new Date(booking.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyRevenue[monthKey]) {
      monthlyRevenue[monthKey] = 0
    }
    
    monthlyRevenue[monthKey] += (booking.price * booking.num_travelers || 0)
  })

  // Convert to arrays
  const labels = Object.keys(monthlyRevenue).sort().map(key => {
    const [year, month] = key.split('-')
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                       'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    return monthNames[parseInt(month) - 1]
  })
  
  const values = Object.keys(monthlyRevenue).sort().map(key => monthlyRevenue[key])

  return { labels, values }
}

function calculateBookingsAnalytics(bookings: any[], period: string) {
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case '7days':
      startDate.setDate(now.getDate() - 7)
      break
    case '30days':
      startDate.setDate(now.getDate() - 30)
      break
    case '3months':
      startDate.setMonth(now.getMonth() - 3)
      break
    default:
      startDate.setDate(now.getDate() - 30)
  }

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.created_at)
    return bookingDate >= startDate
  })

  // Group by period
  const periodBookings = {}
  filteredBookings.forEach(booking => {
    const date = new Date(booking.created_at)
    let periodKey = ''
    
    if (period === '7days') {
      const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      periodKey = dayNames[date.getDay()]
    } else if (period === '30days') {
      const weekNumber = Math.ceil((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000))
      periodKey = `الأسبوع ${weekNumber}`
    } else {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      periodKey = monthKey
    }
    
    if (!periodBookings[periodKey]) {
      periodBookings[periodKey] = 0
    }
    
    periodBookings[periodKey]++
  })

  const labels = Object.keys(periodBookings).sort()
  const values = Object.keys(periodBookings).sort().map(key => periodBookings[key])

  return { labels, values }
}

function calculatePackageAnalytics(bookings: any[], packages: any[]) {
  const packageStats = {}
  
  bookings.forEach(booking => {
    const packageTitle = booking.package_title || 'غير محدد'
    if (!packageStats[packageTitle]) {
      packageStats[packageTitle] = 0
    }
    packageStats[packageTitle]++
  })

  // Sort by count and take top 6
  const sortedPackages = Object.entries(packageStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)

  const labels = sortedPackages.map(([title]) => title)
  const values = sortedPackages.map(([, count]) => count as number)

  return { labels, values }
}

function calculateDemographicsAnalytics(bookings: any[], messages: any[]) {
  // Analyze customer types based on booking patterns and messages
  const demographics = {
    'العائلات': 0,
    'الأزواج': 0,
    'الأفراد': 0,
    'المجموعات': 0
  }

  // Analyze based on number of travelers
  bookings.forEach(booking => {
    const travelers = booking.num_travelers || 1
    if (travelers >= 4) {
      demographics['العائلات']++
    } else if (travelers === 2) {
      demographics['الأزواج']++
    } else if (travelers === 1) {
      demographics['الأفراد']++
    } else {
      demographics['المجموعات']++
    }
  })

  const labels = Object.keys(demographics)
  const values = Object.values(demographics)

  return { labels, values }
}

function calculateDestinationAnalytics(bookings: any[]) {
  const destinationStats = {}
  
  bookings.forEach(booking => {
    const destination = booking.destination || 'غير محدد'
    if (!destinationStats[destination]) {
      destinationStats[destination] = 0
    }
    destinationStats[destination] += (booking.price * booking.num_travelers || 0)
  })

  // Sort by revenue and take top 6
  const sortedDestinations = Object.entries(destinationStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)

  const labels = sortedDestinations.map(([destination]) => destination)
  const values = sortedDestinations.map(([, revenue]) => revenue as number)

  return { labels, values }
}
