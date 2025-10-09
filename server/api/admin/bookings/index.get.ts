import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 10, search, status, package_id, date_from, date_to } = query

    // Build query
    let queryBuilder = supabase
      .from('bookings')
      .select(`
        *,
        packages:package_id (title_ar, title_en, price),
        users:user_id (name, email, phone)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      queryBuilder = queryBuilder.or(`booking_reference.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    if (package_id) {
      queryBuilder = queryBuilder.eq('package_id', package_id)
    }

    if (date_from) {
      queryBuilder = queryBuilder.gte('created_at', date_from)
    }

    if (date_to) {
      queryBuilder = queryBuilder.lte('created_at', date_to)
    }

    // Apply pagination
    const from = (Number(page) - 1) * Number(limit)
    const to = from + Number(limit) - 1
    queryBuilder = queryBuilder.range(from, to)

    const { data, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    return {
      bookings: data || [],
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((count || 0) / Number(limit))
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch bookings'
    })
  }
})
