import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching packages from database...')
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 50, search, status, category } = query

    // Build the query
    let supabaseQuery = supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      supabaseQuery = supabaseQuery.or(`title_ar.ilike.%${searchLower}%,title_en.ilike.%${searchLower}%,description_ar.ilike.%${searchLower}%,description_en.ilike.%${searchLower}%`)
    }

    // Apply status filter (if status column exists)
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status)
    }

    // Apply category filter (if category column exists)
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category)
    }

    // Execute the query
    const { data: packages, error } = await supabaseQuery

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    if (!packages) {
      return {
        packages: [],
        total: 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: 0
      }
    }

    // Apply pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum
    const paginatedPackages = packages.slice(from, to)

    console.log('Packages fetched successfully:', paginatedPackages.length)

    return {
      packages: paginatedPackages,
      total: packages.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(packages.length / limitNum)
    }

  } catch (error: any) {
    console.error('Packages fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
