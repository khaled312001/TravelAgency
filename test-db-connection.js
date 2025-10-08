import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
    } else {
      console.log('Database connection successful!')
      console.log('Data:', data)
    }
    
    // Test specific admin user
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@wonderland.com')
      .single()
    
    if (adminError) {
      console.error('Admin user query error:', adminError)
    } else {
      console.log('Admin user found:', adminData)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testConnection()
