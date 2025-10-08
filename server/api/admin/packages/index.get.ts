import { createClient } from '@supabase/supabase-js'
import type { PaginatedResponse, PackageFilters } from '~/types/admin'

export default defineEventHandler(async (event): Promise<PaginatedResponse<any>> => {
  try {
    // Verify admin authentication
    await verifyAdminAuth(event)
    
    const query = getQuery(event)
    
    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse query parameters
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string
    const destination = query.destination as string
    const sortBy = query.sortBy as string || 'created_at'
    const sortOrder = query.sortOrder as 'asc' | 'desc' || 'desc'

    // Build query
    let queryBuilder = supabase
      .from('packages')
      .select('*', { count: 'exact' })

    // Apply filters
    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (destination) {
      queryBuilder = queryBuilder.eq('destination', destination)
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    queryBuilder = queryBuilder.range(from, to)

    const { data: packages, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch packages'
      })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data: packages || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  } catch (error: any) {
    console.error('Packages fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

// Helper function to verify admin authentication
async function verifyAdminAuth(event: any) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No valid session token provided'
    })
  }

  const sessionToken = authHeader.substring(7)
  
  // Create Supabase client with service role key
  const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('expires_at')
    .eq('session_token', sessionToken)
    .single()

  if (error || !session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }

  // Check if session is expired
  const now = new Date()
  const expiresAt = new Date(session.expires_at)
  if (now > expiresAt) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session expired'
    })
  }
}
