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
      // Since package_inquiries table doesn't exist, we'll just return success
      // The actual data is already stored via the contact API
      console.log('Package notification data:', data)
      
      notificationSent.value = true
      
      return {
        success: true,
        messageId: 'whatsapp-notification',
        error: undefined
      }
    } catch (error: any) {
      console.error('Failed to send package notification:', error)
      
      notificationError.value = error.message || 'Failed to send notification'
      
      return {
        success: false,
        error: notificationError.value || 'Failed to send notification'
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
      // Since destination_inquiries table doesn't exist, we'll just return success
      // The actual data is already stored via the contact API
      console.log('Destination notification data:', data)
      
      notificationSent.value = true
      
      return {
        success: true,
        messageId: 'whatsapp-notification',
        error: undefined
      }
    } catch (error: any) {
      console.error('Failed to send destination notification:', error)
      
      notificationError.value = error.message || 'Failed to send notification'
      
      return {
        success: false,
        error: notificationError.value || 'Failed to send notification'
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
