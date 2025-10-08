import type { NotificationResult, PackageInquiry, DestinationInquiry } from '~/types/whatsapp'
import type { Database } from '~/types/supabase'
import { ref } from 'vue'

export const useWhatsApp = () => {
  const whatsappNumber = '+966500982394'
  const whatsappBaseUrl = 'https://wa.me'
  const { locale } = useI18n()

  const notificationSent = ref(false)
  const notificationError = ref<string | null>(null)
  const isLoading = ref(false)

  /**
   * Get WhatsApp contact URL with optional message
   * @param message Optional pre-filled message
   * @returns Full WhatsApp URL
   */
  const getWhatsAppUrl = (message?: string) => {
    const baseUrl = `${whatsappBaseUrl}/${whatsappNumber}`
    if (!message) return baseUrl
    
    const encodedMessage = encodeURIComponent(message)
    return `${baseUrl}?text=${encodedMessage}`
  }

  /**
   * Store package inquiry in Supabase and provide WhatsApp link
   * @param data Form data to store
   * @returns Notification result with success status and optional error
   */
  const sendPackageNotification = async (data: Partial<PackageInquiry>): Promise<NotificationResult> => {
    isLoading.value = true
    notificationError.value = null
    
    try {
      const client = useSupabaseClient<Database>()
      
      // Store inquiry in Supabase
      const { data: inquiryData, error: dbError } = await client
        .from('package_inquiries')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          package_id: data.packageId,
          package_name: data.packageName,
          message: data.message,
          created_at: new Date().toISOString(),
          locale: locale.value,
          notification_sent: false
        })
        .select()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      notificationSent.value = true
      
      return {
        success: true,
        messageId: inquiryData?.[0]?.id,
        error: undefined
      }
    } catch (error: any) {
      console.error('Failed to store package inquiry:', error)
      
      notificationError.value = error.message || 'Failed to store inquiry'
      
      return {
        success: false,
        error: notificationError.value || 'Failed to store inquiry'
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Store destination inquiry in Supabase and provide WhatsApp link
   * @param data Form data to store
   * @returns Notification result with success status and optional error
   */
  const sendDestinationNotification = async (data: Partial<DestinationInquiry>): Promise<NotificationResult> => {
    isLoading.value = true
    notificationError.value = null
    
    try {
      const client = useSupabaseClient<Database>()
      
      // Store inquiry in Supabase
      const { data: inquiryData, error: dbError } = await client
        .from('destination_inquiries')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          destination_name: data.destinationName,
          message: data.message,
          created_at: new Date().toISOString(),
          locale: locale.value,
          notification_sent: false
        })
        .select()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      notificationSent.value = true
      
      return {
        success: true,
        messageId: inquiryData?.[0]?.id,
        error: undefined
      }
    } catch (error: any) {
      console.error('Failed to store destination inquiry:', error)
      
      notificationError.value = error.message || 'Failed to store inquiry'
      
      return {
        success: false,
        error: notificationError.value || 'Failed to store inquiry'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    whatsappNumber,
    getWhatsAppUrl,
    sendPackageNotification,
    sendDestinationNotification,
    notificationSent,
    notificationError,
    isLoading
  }
}
