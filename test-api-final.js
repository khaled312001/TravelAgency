import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testFinalAPI() {
  try {
    console.log('Testing final API call...')
    
    // Test the exact same query as in the API
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'info@worldtripagency.com')
      .eq('is_active', true)
      .single()

    console.log('Final query result:', { adminUser, userError })

    if (userError) {
      console.error('Final query error:', userError)
    } else {
      console.log('Final query successful!')
      console.log('Admin user email:', adminUser.email)
      console.log('Admin user active:', adminUser.is_active)
    }
    
  } catch (error) {
    console.error('Final test error:', error)
  }
}

testFinalAPI()
