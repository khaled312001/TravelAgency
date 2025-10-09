import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSettingsTable() {
  try {
    console.log('🚀 Creating settings table...')
    
    // Try to create the table by inserting a test record
    // This will fail if table doesn't exist, but we'll handle it
    const testRecord = {
      key: 'test_setting',
      value: JSON.stringify('test_value'),
      category: 'test',
      description: 'Test setting'
    }
    
    console.log('📝 Attempting to insert test record...')
    const { data, error } = await supabase
      .from('settings')
      .insert(testRecord)
    
    if (error) {
      console.log('❌ Table does not exist, need to create it manually')
      console.log('Error:', error.message)
      
      // Since we can't create tables via API, let's use a different approach
      // We'll store settings in a JSON column in an existing table or create a simple key-value store
      console.log('💡 Alternative: Using seo_settings table for general settings...')
      
      // Insert general settings into seo_settings with page='settings'
      const generalSettings = {
        page: 'settings',
        title_ar: 'إعدادات الموقع',
        title_en: 'Website Settings',
        description_ar: JSON.stringify({
          site_name: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
          site_description: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
          site_url: 'https://www.worldtripagency.com',
          contact_email: 'info@worldtripagency.com',
          contact_phone: '+966500982394',
          contact_address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' }
        }),
        description_en: JSON.stringify({
          main_logo: '/images/home/logo/WonderlandLogo.svg',
          footer_logo: '/images/home/logo/WonderlandLogoWhite.svg',
          favicon: '/favicon.ico',
          logo_height: 48,
          show_logo_text: true,
          logo_text: { ar: 'أرض العجائب', en: 'World Trip Agency' }
        }),
        keywords_ar: JSON.stringify({
          smtp_host: '',
          smtp_port: 587,
          smtp_username: '',
          smtp_password: '',
          from_email: 'noreply@worldtripagency.com',
          from_name: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' }
        }),
        keywords_en: JSON.stringify({
          stripe_enabled: false,
          stripe_public_key: '',
          stripe_secret_key: '',
          mada_enabled: true,
          visa_enabled: true,
          mastercard_enabled: true
        })
      }
      
      console.log('📝 Inserting settings into seo_settings table...')
      const { data: insertData, error: insertError } = await supabase
        .from('seo_settings')
        .upsert(generalSettings, { onConflict: 'page' })
      
      if (insertError) {
        console.error('❌ Error inserting settings:', insertError)
      } else {
        console.log('✅ Settings inserted successfully!')
        
        // Verify the insertion
        const { data: verifyData, error: verifyError } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page', 'settings')
        
        if (verifyError) {
          console.error('❌ Error verifying settings:', verifyError)
        } else {
          console.log('✅ Settings verified:', verifyData)
        }
      }
      
    } else {
      console.log('✅ Table exists and test record inserted successfully!')
      
      // Clean up test record
      await supabase
        .from('settings')
        .delete()
        .eq('key', 'test_setting')
      
      console.log('🧹 Test record cleaned up')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Run the setup
createSettingsTable()
