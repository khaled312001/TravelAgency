import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminAccount() {
  try {
    // Hash the password
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    console.log('Hashed password:', hashedPassword)
    
    // Delete existing admin user
    await supabase
      .from('admin_users')
      .delete()
      .eq('email', 'info@worldtripagency.com')
    
    // Create new admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: 'info@worldtripagency.com',
        password_hash: hashedPassword,
        name: 'مدير النظام',
        role: 'super_admin',
        is_active: true
      })
      .select()
    
    if (error) {
      console.error('Error creating admin user:', error)
    } else {
      console.log('Admin user created successfully:', data)
    }
    
    // Test login
    const testPassword = await bcrypt.compare('admin123', hashedPassword)
    console.log('Password test result:', testPassword)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createAdminAccount()
