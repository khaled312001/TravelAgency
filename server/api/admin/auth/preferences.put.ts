import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'admin_token') || 
                  getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No token provided'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const body = await readBody(event)
    const { preferences, securitySettings } = body

    // Prepare update data
    const updateData: any = {}
    
    if (preferences) {
      updateData.preferences = preferences
    }
    
    if (securitySettings) {
      updateData.security_settings = securitySettings
    }

    // Update user in database
    const { error: updateError } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', decoded.id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update preferences'
      })
    }

    // Log activity
    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: decoded.id,
        action: 'preferences_updated',
        resource_type: 'admin_user',
        resource_id: decoded.id,
        details: {
          updated_fields: Object.keys(updateData),
          timestamp: new Date().toISOString()
        }
      })

    return {
      success: true,
      message: 'Preferences updated successfully'
    }
  } catch (error: any) {
    console.error('Preferences update error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Preferences update failed'
    })
  }
})
