import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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
    const { name, email, currentPassword, newPassword } = body

    // Get current user
    const { data: currentAdmin, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', decoded.id)
      .single()

    if (fetchError || !currentAdmin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    // Prepare update data
    const updateData: any = {}

    // Update basic info
    if (name) updateData.name = name
    if (email) updateData.email = email

    // Handle password change
    if (currentPassword && newPassword) {
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, currentAdmin.password_hash)
      if (!isValidPassword) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Current password is incorrect'
        })
      }

      // Hash new password
      const saltRounds = 10
      updateData.password_hash = await bcrypt.hash(newPassword, saltRounds)
    }

    // Check if email is being changed and if it already exists
    if (email && email !== currentAdmin.email) {
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .neq('id', decoded.id)
        .single()

      if (existingUser) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Email already exists'
        })
      }
    }

    // Update user in database
    const { error: updateError } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', decoded.id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update profile'
      })
    }

    // Log activity
    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: decoded.id,
        action: 'profile_updated',
        resource_type: 'admin_user',
        resource_id: decoded.id,
        details: {
          updated_fields: Object.keys(updateData),
          timestamp: new Date().toISOString()
        }
      })

    // Get updated user data
    const { data: updatedAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', decoded.id)
      .single()

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role,
        last_login: updatedAdmin.last_login,
        created_at: updatedAdmin.created_at
      }
    }
  } catch (error: any) {
    console.error('Profile update error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Profile update failed'
    })
  }
})
