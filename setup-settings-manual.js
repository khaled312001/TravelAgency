import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupSettings() {
  try {
    console.log('🚀 Setting up settings manually...')
    
    // First, try to create the table using a simple insert (this will create the table if it doesn't exist)
    const defaultSettings = [
      // General Settings
      { key: 'site_name', value: JSON.stringify({en: "World Trip Agency Traveling Agency", ar: "وكالة أرض العجائب للسفر"}), category: 'general', description: 'Website name in multiple languages' },
      { key: 'site_description', value: JSON.stringify({en: "Specialized travel agency for organizing tourist trips", ar: "وكالة سفر متخصصة في تنظيم الرحلات السياحية"}), category: 'general', description: 'Website description' },
      { key: 'site_url', value: JSON.stringify("https://www.worldtripagency.com"), category: 'general', description: 'Website URL' },
      { key: 'contact_email', value: JSON.stringify("info@worldtripagency.com"), category: 'general', description: 'Contact email' },
      { key: 'contact_phone', value: JSON.stringify("+966500982394"), category: 'general', description: 'Contact phone number' },
      { key: 'contact_address', value: JSON.stringify({en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية"}), category: 'general', description: 'Contact address' },
      
      // Logo Settings
      { key: 'main_logo', value: JSON.stringify("/images/home/logo/WonderlandLogo.svg"), category: 'logo', description: 'Main website logo' },
      { key: 'footer_logo', value: JSON.stringify("/images/home/logo/WonderlandLogoWhite.svg"), category: 'logo', description: 'Footer logo (white)' },
      { key: 'favicon', value: JSON.stringify("/favicon.ico"), category: 'logo', description: 'Website favicon' },
      { key: 'logo_height', value: JSON.stringify("48"), category: 'logo', description: 'Logo height in pixels' },
      { key: 'show_logo_text', value: JSON.stringify("true"), category: 'logo', description: 'Show logo text next to image' },
      { key: 'logo_text', value: JSON.stringify({en: "World Trip Agency", ar: "أرض العجائب"}), category: 'logo', description: 'Logo text' },
      
      // Email Settings
      { key: 'smtp_host', value: JSON.stringify(""), category: 'email', description: 'SMTP server host' },
      { key: 'smtp_port', value: JSON.stringify("587"), category: 'email', description: 'SMTP server port' },
      { key: 'smtp_username', value: JSON.stringify(""), category: 'email', description: 'SMTP username' },
      { key: 'smtp_password', value: JSON.stringify(""), category: 'email', description: 'SMTP password' },
      { key: 'from_email', value: JSON.stringify("noreply@worldtripagency.com"), category: 'email', description: 'From email address' },
      { key: 'from_name', value: JSON.stringify({en: "World Trip Agency Traveling Agency", ar: "وكالة أرض العجائب للسفر"}), category: 'email', description: 'From name' },
      
      // Payment Settings
      { key: 'stripe_enabled', value: JSON.stringify("false"), category: 'payment', description: 'Enable Stripe payment' },
      { key: 'stripe_public_key', value: JSON.stringify(""), category: 'payment', description: 'Stripe public key' },
      { key: 'stripe_secret_key', value: JSON.stringify(""), category: 'payment', description: 'Stripe secret key' },
      { key: 'mada_enabled', value: JSON.stringify("true"), category: 'payment', description: 'Enable Mada payment' },
      { key: 'visa_enabled', value: JSON.stringify("true"), category: 'payment', description: 'Enable Visa payment' },
      { key: 'mastercard_enabled', value: JSON.stringify("true"), category: 'payment', description: 'Enable Mastercard payment' },
      
      // SEO Settings
      { key: 'meta_title', value: JSON.stringify({en: "World Trip Agency - Specialized Travel Agency", ar: "أرض العجائب - وكالة سفر متخصصة"}), category: 'seo', description: 'Meta title' },
      { key: 'meta_description', value: JSON.stringify({en: "Specialized travel agency for organizing tourist trips, Umrah and Hajj", ar: "وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج"}), category: 'seo', description: 'Meta description' },
      { key: 'meta_keywords', value: JSON.stringify({en: "travel, trips, umrah, hajj, tourism", ar: "سفر, رحلات, عمرة, حج, سياحة"}), category: 'seo', description: 'Meta keywords' },
      { key: 'google_analytics_id', value: JSON.stringify(""), category: 'seo', description: 'Google Analytics ID' },
      { key: 'google_search_console', value: JSON.stringify(""), category: 'seo', description: 'Google Search Console' },
      
      // Security Settings
      { key: 'session_timeout', value: JSON.stringify("24"), category: 'security', description: 'Session timeout in hours' },
      { key: 'require_strong_password', value: JSON.stringify("true"), category: 'security', description: 'Require strong password' },
      { key: 'enable_two_factor', value: JSON.stringify("false"), category: 'security', description: 'Enable two-factor authentication' },
      { key: 'enable_rate_limit', value: JSON.stringify("true"), category: 'security', description: 'Enable rate limiting' }
    ]
    
    console.log(`📝 Inserting ${defaultSettings.length} settings...`)
    
    // Insert settings one by one
    for (let i = 0; i < defaultSettings.length; i++) {
      const setting = defaultSettings[i]
      console.log(`⚡ Inserting setting ${i + 1}/${defaultSettings.length}: ${setting.key}`)
      
      try {
        const { data, error } = await supabase
          .from('settings')
          .upsert(setting, { onConflict: 'key' })
        
        if (error) {
          console.error(`❌ Error inserting ${setting.key}:`, error)
        } else {
          console.log(`✅ ${setting.key} inserted successfully`)
        }
      } catch (err) {
        console.error(`❌ Exception inserting ${setting.key}:`, err.message)
      }
    }
    
    console.log('🎉 Settings setup completed!')
    
    // Verify the settings were inserted
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('key, category')
      .limit(10)
    
    if (settingsError) {
      console.error('❌ Error checking settings:', settingsError)
    } else {
      console.log(`✅ Found ${settings.length} settings in database`)
      console.log('📋 Sample settings:', settings.map(s => `${s.key} (${s.category})`))
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Run the setup
setupSettings()
