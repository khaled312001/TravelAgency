import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testLogin() {
  try {
    const email = 'admin@wonderland.com'
    const password = 'admin123'
    
    console.log('Testing login with:', email)
    
    // Get admin user by email
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    console.log('Admin user query result:', { adminUser, userError })

    if (userError || !adminUser) {
      console.log('No admin user found or error:', userError)
      return
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)
    console.log('Password verification result:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('Invalid password')
      return
    }
    
    console.log('Login successful!')
    console.log('Admin user:', adminUser)
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testLogin()
