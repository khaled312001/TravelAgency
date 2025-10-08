import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'
import type { AdminLoginRequest, AdminLoginResponse } from '~/types/admin'

export default defineEventHandler(async (event): Promise<AdminLoginResponse> => {
  try {
    const body = await readBody<AdminLoginRequest>(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get admin user by email
    console.log('Searching for admin user with email:', email.toLowerCase())
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    console.log('Admin user query result:', { adminUser, userError })

    if (userError || !adminUser) {
      console.log('No admin user found or error:', userError)
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Generate session token
    const sessionToken = jwt.sign(
      { 
        id: adminUser.id,
        role: adminUser.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Create session in database
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: adminUser.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id)

    // Log activity
    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: adminUser.id,
        action: 'login',
        ip_address: '127.0.0.1',
        user_agent: getHeader(event, 'user-agent') || 'Unknown'
      })

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = adminUser

    return {
      success: true,
      user: userWithoutPassword,
      sessionToken
    }
  } catch (error: any) {
    console.error('Login error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
