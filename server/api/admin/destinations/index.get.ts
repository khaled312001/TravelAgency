import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching destinations from database...')
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 50, search, status, type, featured } = query

    // Build query
    let supabaseQuery = supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      supabaseQuery = supabaseQuery.or(`name_ar.ilike.%${searchLower}%,name_en.ilike.%${searchLower}%,description_ar.ilike.%${searchLower}%,description_en.ilike.%${searchLower}%,region_ar.ilike.%${searchLower}%,region_en.ilike.%${searchLower}%`)
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status)
    }

    if (type) {
      supabaseQuery = supabaseQuery.eq('destination_type_ar', type)
    }

    if (featured) {
      supabaseQuery = supabaseQuery.eq('featured', featured === 'true')
    }

    // Execute query
    const { data: destinations, error } = await supabaseQuery

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    // Apply pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum
    const paginatedDestinations = destinations?.slice(from, to) || []

    console.log('Destinations fetched successfully:', paginatedDestinations.length)

    return {
      destinations: paginatedDestinations,
      total: destinations?.length || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((destinations?.length || 0) / limitNum)
    }
  } catch (error: any) {
    console.error('Destinations fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch destinations: ${error.message}`
    })
  }
})
