// Test script to verify notifications API fix
const testNotificationsAPI = async () => {
  const baseUrl = 'https://www.worldtripagency.com'
  
  console.log('Testing notifications API endpoints...')
  
  try {
    // Test 1: Get notifications
    console.log('\n1. Testing GET /api/admin/notifications')
    const getResponse = await fetch(`${baseUrl}/api/admin/notifications`)
    const getData = await getResponse.json()
    console.log('GET Response:', getResponse.status, getData)
    
    if (getData.success && getData.notifications.length > 0) {
      console.log('✅ GET notifications working')
      
      // Test 2: Mark all as read
      console.log('\n2. Testing PATCH /api/admin/notifications/mark-all-read')
      const markAllResponse = await fetch(`${baseUrl}/api/admin/notifications/mark-all-read`, {
        method: 'PATCH'
      })
      const markAllData = await markAllResponse.json()
      console.log('Mark All Response:', markAllResponse.status, markAllData)
      
      if (markAllResponse.status === 200 && markAllData.success) {
        console.log('✅ Mark all as read working')
      } else {
        console.log('❌ Mark all as read failed')
      }
      
      // Test 3: Mark single notification as read
      if (getData.notifications.length > 0) {
        const firstNotification = getData.notifications[0]
        console.log('\n3. Testing PATCH /api/admin/notifications/[id]/read')
        const markSingleResponse = await fetch(`${baseUrl}/api/admin/notifications/${firstNotification.id}/read`, {
          method: 'PATCH'
        })
        const markSingleData = await markSingleResponse.json()
        console.log('Mark Single Response:', markSingleResponse.status, markSingleData)
        
        if (markSingleResponse.status === 200 && markSingleData.success) {
          console.log('✅ Mark single as read working')
        } else {
          console.log('❌ Mark single as read failed')
        }
      }
    } else {
      console.log('❌ No notifications found to test with')
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run the test
testNotificationsAPI()
