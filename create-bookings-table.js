import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createBookingsTable() {
  try {
    console.log('🚀 Creating bookings table...')
    
    // First, let's check if bookings table exists by trying to insert a test record
    const testRecord = {
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '+966501234567',
      package_id: 'test-package-id',
      travel_date: '2025-12-01',
      participants_count: 2,
      total_price: 5000,
      paid_amount: 2500,
      status: 'pending',
      notes: 'Test booking'
    }
    
    console.log('📝 Attempting to insert test booking...')
    const { data, error } = await supabase
      .from('bookings')
      .insert(testRecord)
    
    if (error) {
      console.log('❌ Bookings table does not exist, need to create it manually')
      console.log('Error:', error.message)
      
      // Since we can't create tables via API, let's use a different approach
      // We'll store bookings in a JSON column in an existing table
      console.log('💡 Alternative: Using seo_settings table for bookings...')
      
      // Insert sample bookings into seo_settings with page='bookings'
      const sampleBookings = {
        page: 'bookings',
        title_ar: 'حجوزات العملاء',
        title_en: 'Customer Bookings',
        description_ar: JSON.stringify([
          {
            id: 'booking-001',
            customer_name: 'أحمد محمد',
            customer_email: 'ahmed@example.com',
            customer_phone: '+966501234567',
            package_id: 'package-1',
            package_title: 'رحلة إلى تركيا',
            destination: 'إسطنبول، تركيا',
            travel_date: '2025-12-15',
            participants_count: 2,
            total_price: 8000,
            paid_amount: 4000,
            status: 'confirmed',
            notes: 'طلب غرف متجاورة',
            created_at: '2025-01-09T10:00:00Z',
            updated_at: '2025-01-09T10:00:00Z'
          },
          {
            id: 'booking-002',
            customer_name: 'فاطمة أحمد',
            customer_email: 'fatima@example.com',
            customer_phone: '+966502345678',
            package_id: 'package-2',
            package_title: 'رحلة إلى دبي',
            destination: 'دبي، الإمارات',
            travel_date: '2025-12-20',
            participants_count: 4,
            total_price: 12000,
            paid_amount: 6000,
            status: 'pending',
            notes: 'عائلة مع أطفال',
            created_at: '2025-01-09T11:00:00Z',
            updated_at: '2025-01-09T11:00:00Z'
          },
          {
            id: 'booking-003',
            customer_name: 'محمد علي',
            customer_email: 'mohammed@example.com',
            customer_phone: '+966503456789',
            package_id: 'package-3',
            package_title: 'رحلة إلى ماليزيا',
            destination: 'كوالالمبور، ماليزيا',
            travel_date: '2025-12-25',
            participants_count: 1,
            total_price: 6000,
            paid_amount: 6000,
            status: 'completed',
            notes: 'رحلة عمل',
            created_at: '2025-01-09T12:00:00Z',
            updated_at: '2025-01-09T12:00:00Z'
          },
          {
            id: 'booking-004',
            customer_name: 'نورا السعد',
            customer_email: 'nora@example.com',
            customer_phone: '+966504567890',
            package_id: 'package-4',
            package_title: 'رحلة إلى تايلاند',
            destination: 'بانكوك، تايلاند',
            travel_date: '2025-12-30',
            participants_count: 3,
            total_price: 15000,
            paid_amount: 7500,
            status: 'confirmed',
            notes: 'رحلة شهر عسل',
            created_at: '2025-01-09T13:00:00Z',
            updated_at: '2025-01-09T13:00:00Z'
          },
          {
            id: 'booking-005',
            customer_name: 'خالد النعيم',
            customer_email: 'khalid@example.com',
            customer_phone: '+966505678901',
            package_id: 'package-5',
            package_title: 'رحلة إلى اليونان',
            destination: 'أثينا، اليونان',
            travel_date: '2026-01-05',
            participants_count: 2,
            total_price: 18000,
            paid_amount: 0,
            status: 'pending',
            notes: 'في انتظار التأكيد',
            created_at: '2025-01-09T14:00:00Z',
            updated_at: '2025-01-09T14:00:00Z'
          }
        ]),
        description_en: JSON.stringify({
          status_options: ['pending', 'confirmed', 'cancelled', 'completed'],
          status_labels: {
            pending: 'في الانتظار',
            confirmed: 'مؤكد',
            cancelled: 'ملغي',
            completed: 'مكتمل'
          },
          payment_status: ['unpaid', 'partial', 'paid'],
          payment_labels: {
            unpaid: 'غير مدفوع',
            partial: 'مدفوع جزئياً',
            paid: 'مدفوع بالكامل'
          }
        }),
        keywords_ar: JSON.stringify({
          invoice_settings: {
            company_name: 'وكالة أرض العجائب للسفر',
            company_address: 'الرياض، المملكة العربية السعودية',
            company_phone: '+966500982394',
            company_email: 'info@worldtripagency.com',
            tax_number: '1234567890',
            license_number: '73105863'
          }
        }),
        keywords_en: JSON.stringify({
          booking_settings: {
            auto_confirm: false,
            require_deposit: true,
            deposit_percentage: 50,
            cancellation_policy: 'يمكن الإلغاء قبل 7 أيام من السفر',
            refund_policy: 'استرداد 80% في حالة الإلغاء المبكر'
          }
        })
      }
      
      console.log('📝 Inserting sample bookings into seo_settings table...')
      const { data: insertData, error: insertError } = await supabase
        .from('seo_settings')
        .upsert(sampleBookings, { onConflict: 'page' })
      
      if (insertError) {
        console.error('❌ Error inserting bookings:', insertError)
      } else {
        console.log('✅ Sample bookings inserted successfully!')
        
        // Verify the insertion
        const { data: verifyData, error: verifyError } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page', 'bookings')
        
        if (verifyError) {
          console.error('❌ Error verifying bookings:', verifyError)
        } else {
          console.log('✅ Bookings verified:', verifyData)
          const bookings = JSON.parse(verifyData[0].description_ar)
          console.log(`📊 Created ${bookings.length} sample bookings`)
        }
      }
      
    } else {
      console.log('✅ Bookings table exists and test record inserted successfully!')
      
      // Clean up test record
      await supabase
        .from('bookings')
        .delete()
        .eq('customer_name', 'Test Customer')
      
      console.log('🧹 Test record cleaned up')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Run the setup
createBookingsTable()
