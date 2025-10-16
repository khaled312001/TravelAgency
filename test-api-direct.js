import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDirectAPI() {
  try {
    console.log('Testing direct API call...')
    
    // Test the exact same query as in the API
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'info@worldtripagency.com')
      .eq('is_active', true)
      .single()

    console.log('Direct query result:', { adminUser, userError })

    if (userError) {
      console.error('Direct query error:', userError)
    } else {
      console.log('Direct query successful!')
    }
    
  } catch (error) {
    console.error('Direct test error:', error)
  }
}

testDirectAPI()
