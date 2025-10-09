export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching bookings...')
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 10, search, status } = query

    // Return mock data for now
    const mockBookings = [
      {
        id: '1',
        booking_reference: 'WT-2025-001',
        user_name: 'أحمد محمد',
        user_email: 'ahmed@example.com',
        user_phone: '+966501234567',
        package_name: 'رحلة باريس الرومانسية',
        package_price: 2500,
        total_price: 2500,
        travelers_count: 2,
        travel_date: '2025-03-15',
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'طلب خاص: غرفة متصلة',
        created_at: '2025-01-09T10:00:00Z'
      },
      {
        id: '2',
        booking_reference: 'WT-2025-002',
        user_name: 'فاطمة علي',
        user_email: 'fatima@example.com',
        user_phone: '+966502345678',
        package_name: 'مغامرة تايلاند',
        package_price: 1800,
        total_price: 3600,
        travelers_count: 2,
        travel_date: '2025-04-20',
        status: 'pending',
        payment_status: 'pending',
        notes: 'في انتظار تأكيد التواريخ',
        created_at: '2025-01-09T09:30:00Z'
      },
      {
        id: '3',
        booking_reference: 'WT-2025-003',
        user_name: 'محمد السعد',
        user_email: 'mohammed@example.com',
        user_phone: '+966503456789',
        package_name: 'جولة لندن الكلاسيكية',
        package_price: 2200,
        total_price: 2200,
        travelers_count: 1,
        travel_date: '2025-05-10',
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'مسافر وحيد',
        created_at: '2025-01-09T08:45:00Z'
      },
      {
        id: '4',
        booking_reference: 'WT-2025-004',
        user_name: 'نورا أحمد',
        user_email: 'nora@example.com',
        user_phone: '+966504567890',
        package_name: 'رحلة إسطنبول السحرية',
        package_price: 1500,
        total_price: 4500,
        travelers_count: 3,
        travel_date: '2025-06-05',
        status: 'cancelled',
        payment_status: 'refunded',
        notes: 'تم الإلغاء بناءً على طلب العميل',
        created_at: '2025-01-09T07:20:00Z'
      },
      {
        id: '5',
        booking_reference: 'WT-2025-005',
        user_name: 'سارة محمد',
        user_email: 'sara@example.com',
        user_phone: '+966505678901',
        package_name: 'مغامرة المغرب',
        package_price: 1200,
        total_price: 2400,
        travelers_count: 2,
        travel_date: '2025-07-15',
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'شهر عسل',
        created_at: '2025-01-09T06:15:00Z'
      }
    ]

    // Apply filters
    let filteredBookings = mockBookings

    if (search) {
      const searchLower = search.toLowerCase()
      filteredBookings = filteredBookings.filter(booking => 
        booking.booking_reference.toLowerCase().includes(searchLower) ||
        booking.user_name.toLowerCase().includes(searchLower) ||
        booking.user_email.toLowerCase().includes(searchLower) ||
        booking.package_name.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status)
    }

    // Apply pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum
    const paginatedBookings = filteredBookings.slice(from, to)

    console.log('Bookings fetched successfully:', paginatedBookings.length)

    return {
      bookings: paginatedBookings,
      total: filteredBookings.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredBookings.length / limitNum)
    }

  } catch (error: any) {
    console.error('Bookings fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
