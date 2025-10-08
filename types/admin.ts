import type { Database } from './supabase'

// Admin user types
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update']

// Admin session types
export type AdminSession = Database['public']['Tables']['admin_sessions']['Row']
export type AdminSessionInsert = Database['public']['Tables']['admin_sessions']['Insert']

// Admin activity log types
export type AdminActivityLog = Database['public']['Tables']['admin_activity_logs']['Row']
export type AdminActivityLogInsert = Database['public']['Tables']['admin_activity_logs']['Insert']

// Booking types
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// Destination types
export type Destination = Database['public']['Tables']['destinations']['Row']
export type DestinationInsert = Database['public']['Tables']['destinations']['Insert']
export type DestinationUpdate = Database['public']['Tables']['destinations']['Update']

// SEO settings types
export type SeoSettings = Database['public']['Tables']['seo_settings']['Row']
export type SeoSettingsInsert = Database['public']['Tables']['seo_settings']['Insert']
export type SeoSettingsUpdate = Database['public']['Tables']['seo_settings']['Update']

// Notification types
export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

// Admin login request/response types
export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  success: boolean
  user?: AdminUser
  sessionToken?: string
  message?: string
}

export interface AdminLogoutResponse {
  success: boolean
  message?: string
}

// Dashboard statistics types
export interface DashboardStats {
  totalUsers: number
  newMessages: number
  totalDestinations: number
  totalPackages: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  cancelledBookings: number
  completedBookings: number
}

// Chart data types
export interface BookingDistribution {
  type: string
  count: number
  percentage: number
  color: string
}

export interface MonthlySales {
  month: string
  amount: number
  bookings: number
}

// Popular package type
export interface PopularPackage {
  id: string
  title: string
  price: number
  views: number
  image_url: string
}

// Recent activity type
export interface RecentActivity {
  id: string
  action: string
  description: string
  timestamp: string
  type: 'package' | 'booking' | 'message' | 'destination'
}

// SEO issue type
export interface SeoIssue {
  id: string
  type: 'missing_analytics' | 'missing_search_console' | 'missing_meta_tags' | 'duplicate_content'
  severity: 'low' | 'medium' | 'high'
  description: string
  recommendation: string
}

// Quick recommendation type
export interface QuickRecommendation {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

// Admin API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter types
export interface BookingFilters extends PaginationParams {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  dateFrom?: string
  dateTo?: string
  packageId?: string
}

export interface PackageFilters extends PaginationParams {
  destination?: string
  priceMin?: number
  priceMax?: number
  durationMin?: number
  durationMax?: number
}

export interface DestinationFilters extends PaginationParams {
  country?: string
  city?: string
  isFeatured?: boolean
  isActive?: boolean
}
