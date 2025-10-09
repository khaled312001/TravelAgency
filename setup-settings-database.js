import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupSettingsTable() {
  try {
    console.log('🚀 Setting up settings table...')
    
    // Read SQL file
    const sqlContent = fs.readFileSync('create-settings-table.sql', 'utf8')
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error)
            // Continue with next statement
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err.message)
          // Continue with next statement
        }
      }
    }
    
    console.log('🎉 Settings table setup completed!')
    
    // Verify the table was created
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'settings')
    
    if (tableError) {
      console.error('❌ Error checking table:', tableError)
    } else if (tables && tables.length > 0) {
      console.log('✅ Settings table exists!')
      
      // Check if data was inserted
      const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('key, category')
        .limit(5)
      
      if (settingsError) {
        console.error('❌ Error checking settings data:', settingsError)
      } else {
        console.log(`✅ Found ${settings.length} settings in database`)
        console.log('📋 Sample settings:', settings.map(s => `${s.key} (${s.category})`))
      }
    } else {
      console.log('⚠️ Settings table not found - may need manual creation')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Run the setup
setupSettingsTable()
