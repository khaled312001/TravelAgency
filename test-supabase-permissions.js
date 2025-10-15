// Test Supabase permissions for notifications table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

const testPermissions = async () => {
  console.log('Testing Supabase permissions...')
  
  try {
    // Test 1: Read notifications
    console.log('\n1. Testing READ permissions...')
    const { data: notifications, error: readError } = await supabase
      .from('notifications')
      .select('*')
      .limit(5)
    
    if (readError) {
      console.log('❌ READ error:', readError)
    } else {
      console.log('✅ READ working, found', notifications.length, 'notifications')
    }
    
    // Test 2: Update notifications (mark as read)
    if (notifications && notifications.length > 0) {
      console.log('\n2. Testing UPDATE permissions...')
      const firstNotification = notifications[0]
      
      const { data: updateData, error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', firstNotification.id)
        .select()
      
      if (updateError) {
        console.log('❌ UPDATE error:', updateError)
        console.log('Error details:', JSON.stringify(updateError, null, 2))
      } else {
        console.log('✅ UPDATE working, updated notification:', firstNotification.id)
      }
    }
    
    // Test 3: Update all unread notifications
    console.log('\n3. Testing UPDATE ALL permissions...')
    const { data: updateAllData, error: updateAllError } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)
      .select()
    
    if (updateAllError) {
      console.log('❌ UPDATE ALL error:', updateAllError)
      console.log('Error details:', JSON.stringify(updateAllError, null, 2))
    } else {
      console.log('✅ UPDATE ALL working, updated', updateAllData?.length || 0, 'notifications')
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testPermissions()
