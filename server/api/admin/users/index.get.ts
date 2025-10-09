export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching users...')
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 10, search, status, role } = query

    // Return mock data for now
    const mockUsers = [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        role: 'admin',
        status: 'active',
        created_at: '2025-01-09T10:00:00Z',
        last_login: '2025-01-09T09:30:00Z'
      },
      {
        id: '2',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966502345678',
        role: 'user',
        status: 'active',
        created_at: '2025-01-09T09:00:00Z',
        last_login: '2025-01-09T08:45:00Z'
      },
      {
        id: '3',
        name: 'محمد السعد',
        email: 'mohammed@example.com',
        phone: '+966503456789',
        role: 'user',
        status: 'inactive',
        created_at: '2025-01-09T08:00:00Z',
        last_login: '2025-01-08T15:20:00Z'
      },
      {
        id: '4',
        name: 'نورا أحمد',
        email: 'nora@example.com',
        phone: '+966504567890',
        role: 'user',
        status: 'active',
        created_at: '2025-01-09T07:00:00Z',
        last_login: '2025-01-09T06:30:00Z'
      },
      {
        id: '5',
        name: 'سارة محمد',
        email: 'sara@example.com',
        phone: '+966505678901',
        role: 'moderator',
        status: 'active',
        created_at: '2025-01-09T06:00:00Z',
        last_login: '2025-01-09T05:45:00Z'
      }
    ]

    // Apply filters
    let filteredUsers = mockUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search)
      )
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    // Apply pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum
    const paginatedUsers = filteredUsers.slice(from, to)

    console.log('Users fetched successfully:', paginatedUsers.length)

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredUsers.length / limitNum)
    }

  } catch (error: any) {
    console.error('Users fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
