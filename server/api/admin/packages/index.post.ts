import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminAuth(event)
    
    const body = await readBody(event)
    
    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate required fields
    const { title, description, price, duration_days, destination, image_url } = body

    if (!title || !description || !price || !duration_days || !destination || !image_url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required'
      })
    }

    // Create package
    const { data: newPackage, error } = await supabase
      .from('packages')
      .insert({
        title,
        description,
        price: parseFloat(price),
        duration_days: parseInt(duration_days),
        destination,
        image_url
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create package'
      })
    }

    // Log activity
    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: adminUser.id,
        action: 'create_package',
        resource_type: 'package',
        resource_id: newPackage.id,
        details: { title: newPackage.title },
        ip_address: getClientIP(event),
        user_agent: getHeader(event, 'user-agent')
      })

    return {
      success: true,
      data: newPackage
    }
  } catch (error: any) {
    console.error('Package creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

// Helper function to verify admin authentication and return user
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
    .select(`
      admin_user_id,
      expires_at,
      admin_users (
        id,
        email,
        name,
        role
      )
    `)
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

  return session.admin_users
}
