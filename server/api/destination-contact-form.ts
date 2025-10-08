import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import twilio from 'twilio'
import type { DestinationInquiry } from '~/types/whatsapp'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  const formData = await readBody(event) as DestinationInquiry
  const locale = formData.locale || 'en-US'

  // Try to use the service role client first (bypasses RLS)
  // If that fails, fall back to the regular client
  let supabase;
  try {
    supabase = await serverSupabaseServiceRole<Database>(event)
  } catch (error) {
    console.warn('Failed to use Supabase service role client, falling back to regular client:', error)
    supabase = await serverSupabaseClient<Database>(event)
  }

  try {
    // Store in Supabase
    const { data, error } = await supabase
      .from('destination_inquiries')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination_name: formData.destinationName,
        message: formData.message,
        created_at: new Date().toISOString(),
        locale: locale,
        notification_sent: false
      })
      .select()

    if (error) {
      console.error('Failed to save destination inquiry to Supabase:', error)
      return {
        success: false,
        error: `Database error: ${error.message}`,
        notificationSent: false
      }
    }

    if (!data || data.length === 0) {
      console.error('No data returned from Supabase insert')
      return {
        success: false,
        error: 'Failed to save destination inquiry',
        notificationSent: false
      }
    }

    // Send WhatsApp notification
    try {
      const config = useRuntimeConfig()

      // Validate required Twilio configuration
      if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioPhoneNumber || !config.salesManagerPhone) {
        console.error('Missing Twilio configuration for destination inquiry:', {
          twilioAccountSid: !config.twilioAccountSid ? 'missing' : 'present',
          twilioAuthToken: !config.twilioAuthToken ? 'missing' : 'present',
          twilioPhoneNumber: !config.twilioPhoneNumber ? 'missing' : 'present',
          salesManagerPhone: !config.salesManagerPhone ? 'missing' : 'present'
        });

        // Update the inquiry with error information
        await supabase
          .from('destination_inquiries')
          .update({
            notification_sent: false,
            notification_error: 'Incomplete Twilio configuration'
          })
          .eq('id', data[0].id)

        return {
          success: true,
          inquiryId: data[0].id,
          notificationSent: false,
          error: 'Incomplete Twilio configuration'
        }
      }

      // Initialize Twilio client
      try {
        const client = twilio(
          config.twilioAccountSid,
          config.twilioAuthToken
        )

        // Create a simple text message instead of using templates for now
        const messageBody = locale.startsWith('ar')
          ? `طلب استفسار عن وجهة سياحية جديد!
          
    العميل: ${formData.name}
    البريد الإلكتروني: ${formData.email}
    الهاتف: ${formData.phone}
    الوجهة: ${formData.destinationName}
    الرسالة: ${formData.message}`
          : `New Destination Inquiry!
          
    Customer: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Destination: ${formData.destinationName}
    Message: ${formData.message}`

        // Send a simple WhatsApp message
        const message = await client.messages.create({
          from: `whatsapp:${config.twilioPhoneNumber}`,
          to: `whatsapp:${config.salesManagerPhone}`,
          body: messageBody
        })

        // Update Supabase with notification status
        await supabase
          .from('destination_inquiries')
          .update({
            notification_sent: true,
            notification_id: message.sid
          })
          .eq('id', data[0].id)

        return {
          success: true,
          inquiryId: data[0].id,
          notificationSent: true,
          notificationId: message.sid
        }
      } catch (twilioError: any) {
        console.error('Twilio client error for destination inquiry:', twilioError);

        // Update Supabase with error information
        await supabase
          .from('destination_inquiries')
          .update({
            notification_sent: false,
            notification_error: twilioError.message || 'Twilio error'
          })
          .eq('id', data[0].id)

        return {
          success: true,
          inquiryId: data[0].id,
          notificationSent: false,
          error: twilioError.message || 'Failed to send WhatsApp notification'
        }
      }
    } catch (err: any) {
      console.error('WhatsApp notification for destination inquiry failed:', err)

      // Update Supabase with error information
      await supabase
        .from('destination_inquiries')
        .update({
          notification_sent: false,
          notification_error: err.message || 'Unknown error'
        })
        .eq('id', data[0].id)

      return {
        success: true,
        inquiryId: data[0].id,
        notificationSent: false,
        error: err.message || 'Failed to send WhatsApp notification'
      }
    }
  } catch (err: any) {
    console.error('Destination contact form submission failed:', err)
    return {
      success: false,
      error: err.message || 'Failed to process destination contact form',
      notificationSent: false
    }
  }
})
