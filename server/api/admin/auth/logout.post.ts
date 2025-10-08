import { createClient } from '@supabase/supabase-js'
import type { AdminLogoutResponse } from '~/types/admin'

export default defineEventHandler(async (event): Promise<AdminLogoutResponse> => {
  try {
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

    // Get session from database
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_user_id')
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid session'
      })
    }

    // Delete session from database
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken)

    // Log logout activity
    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: session.admin_user_id,
        action: 'logout',
        ip_address: getClientIP(event),
        user_agent: getHeader(event, 'user-agent')
      })

    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error: any) {
    console.error('Logout error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
