import { createClient } from '@supabase/supabase-js'
import type { PopularPackage } from '~/types/admin'

export default defineEventHandler(async (event): Promise<PopularPackage[]> => {
  try {
    // Verify admin authentication
    await verifyAdminAuth(event)
    
    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get packages with view counts (mock data for now)
    const { data: packages, error } = await supabase
      .from('packages')
      .select('id, title, price, image_url')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch packages'
      })
    }

    // Mock view counts for now
    const popularPackages: PopularPackage[] = packages?.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      price: pkg.price,
      views: Math.floor(Math.random() * 200) + 50, // Random views between 50-250
      image_url: pkg.image_url
    })) || []

    return popularPackages
  } catch (error: any) {
    console.error('Popular packages error:', error)
    
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
