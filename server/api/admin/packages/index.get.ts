import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 10, search, status, category } = query

    // Build query
    let queryBuilder = supabase
      .from('packages')
      .select(`
        *,
        package_options:package_options (*)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      queryBuilder = queryBuilder.or(`title_ar.ilike.%${search}%,title_en.ilike.%${search}%,description_ar.ilike.%${search}%,description_en.ilike.%${search}%`)
    }

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category)
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
      packages: data || [],
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((count || 0) / Number(limit))
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch packages'
    })
  }
})
