export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'super_admin'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          role?: 'admin' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          role?: 'admin' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_sessions: {
        Row: {
          id: string
          admin_user_id: string
          session_token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          session_token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
        }
      }
      admin_activity_logs: {
        Row: {
          id: string
          admin_user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          details: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          details?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          details?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          package_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          number_of_people: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          booking_date: string | null
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          number_of_people?: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          booking_date?: string | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          number_of_people?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          booking_date?: string | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      destinations: {
        Row: {
          id: string
          name: string
          name_en: string | null
          description: string | null
          description_en: string | null
          country: string
          city: string
          image_url: string | null
          gallery_urls: string[] | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_en?: string | null
          description?: string | null
          description_en?: string | null
          country: string
          city: string
          image_url?: string | null
          gallery_urls?: string[] | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_en?: string | null
          description?: string | null
          description_en?: string | null
          country?: string
          city?: string
          image_url?: string | null
          gallery_urls?: string[] | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      seo_settings: {
        Row: {
          id: string
          page_path: string
          title: string | null
          title_en: string | null
          description: string | null
          description_en: string | null
          keywords: string | null
          keywords_en: string | null
          meta_image_url: string | null
          canonical_url: string | null
          is_indexed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_path: string
          title?: string | null
          title_en?: string | null
          description?: string | null
          description_en?: string | null
          keywords?: string | null
          keywords_en?: string | null
          meta_image_url?: string | null
          canonical_url?: string | null
          is_indexed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_path?: string
          title?: string | null
          title_en?: string | null
          description?: string | null
          description_en?: string | null
          keywords?: string | null
          keywords_en?: string | null
          meta_image_url?: string | null
          canonical_url?: string | null
          is_indexed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          title: string
          title_en: string | null
          message: string
          message_en: string | null
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          admin_user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          title_en?: string | null
          message: string
          message_en?: string | null
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          admin_user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_en?: string | null
          message?: string
          message_en?: string | null
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          admin_user_id?: string | null
          created_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          duration_days: number
          destination: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          duration_days: number
          destination: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          duration_days?: number
          destination?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      package_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          package_id: string
          package_name: string
          message: string
          created_at: string
          locale: string
          notification_sent: boolean
          notification_id: string | null
          notification_error: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          package_id: string
          package_name: string
          message: string
          created_at?: string
          locale?: string
          notification_sent?: boolean
          notification_id?: string | null
          notification_error?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          package_id?: string
          package_name?: string
          message?: string
          created_at?: string
          locale?: string
          notification_sent?: boolean
          notification_id?: string | null
          notification_error?: string | null
        }
      }
      destination_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          destination_name: string
          message: string
          created_at: string
          updated_at: string
          locale: string
          notification_sent: boolean
          notification_error: string | null
          notification_attempts: number
        }
        Insert: {
          id?: string
          name: string
          email?: string
          phone: string
          destination_name: string
          message: string
          created_at?: string
          updated_at?: string
          locale?: string
          notification_sent?: boolean
          notification_error?: string | null
          notification_attempts?: number
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          destination_name?: string
          message?: string
          created_at?: string
          updated_at?: string
          locale?: string
          notification_sent?: boolean
          notification_error?: string | null
          notification_attempts?: number
        }
      }
      package_dates: {
        Row: {
          id: string
          package_id: string
          start_date: string
          end_date: string
          available_spots: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          start_date: string
          end_date: string
          available_spots: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          start_date?: string
          end_date?: string
          available_spots?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}