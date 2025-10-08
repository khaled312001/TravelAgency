import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'
import type { AdminUser } from '~/types/admin'

export default defineEventHandler(async (event): Promise<AdminUser | null> => {
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

    // Verify session token
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select(`
        admin_user_id,
        expires_at,
        admin_users (
          id,
          email,
          name,
          role,
          is_active,
          last_login,
          created_at,
          updated_at
        )
      `)
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid session'
      })
    }

    // Check if session is expired
    const now = new Date()
    const expiresAt = new Date(session.expires_at)
    if (now > expiresAt) {
      // Delete expired session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken)
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired'
      })
    }

    return session.admin_users as AdminUser
  } catch (error: any) {
    console.error('Auth check error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
