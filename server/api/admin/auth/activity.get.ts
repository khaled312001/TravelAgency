import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'admin_token') || 
                  getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No token provided'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const query = getQuery(event)
    const { type, limit = 50, offset = 0 } = query

    // Build query
    let queryBuilder = supabase
      .from('admin_activity_logs')
      .select('*')
      .eq('admin_user_id', decoded.id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Filter by activity type if provided
    if (type) {
      queryBuilder = queryBuilder.eq('action', type)
    }

    const { data: activities, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch activity log'
      })
    }

    // Transform activities to match frontend format
    const transformedActivities = activities?.map(activity => ({
      id: activity.id,
      type: getActivityType(activity.action),
      description: getActivityDescription(activity.action),
      details: activity.details?.description || getActivityDetails(activity.action, activity.resource_type),
      timestamp: activity.created_at,
      ip_address: activity.ip_address,
      user_agent: activity.user_agent
    })) || []

    return {
      success: true,
      activities: transformedActivities,
      total: activities?.length || 0
    }
  } catch (error: any) {
    console.error('Activity log error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch activity log'
    })
  }
})

function getActivityType(action: string): string {
  const typeMap: { [key: string]: string } = {
    'login': 'login',
    'logout': 'logout',
    'profile_updated': 'update',
    'password_changed': 'update',
    'settings_updated': 'update',
    'package_created': 'create',
    'package_updated': 'update',
    'package_deleted': 'delete',
    'destination_created': 'create',
    'destination_updated': 'update',
    'destination_deleted': 'delete',
    'booking_created': 'create',
    'booking_updated': 'update',
    'booking_deleted': 'delete'
  }
  return typeMap[action] || 'update'
}

function getActivityDescription(action: string): string {
  const descriptionMap: { [key: string]: string } = {
    'login': 'تسجيل الدخول',
    'logout': 'تسجيل الخروج',
    'profile_updated': 'تحديث الملف الشخصي',
    'password_changed': 'تغيير كلمة المرور',
    'settings_updated': 'تحديث الإعدادات',
    'package_created': 'إنشاء باقة جديدة',
    'package_updated': 'تحديث باقة',
    'package_deleted': 'حذف باقة',
    'destination_created': 'إنشاء وجهة جديدة',
    'destination_updated': 'تحديث وجهة',
    'destination_deleted': 'حذف وجهة',
    'booking_created': 'إنشاء حجز جديد',
    'booking_updated': 'تحديث حجز',
    'booking_deleted': 'حذف حجز'
  }
  return descriptionMap[action] || 'نشاط غير محدد'
}

function getActivityDetails(action: string, resourceType?: string): string {
  const detailsMap: { [key: string]: string } = {
    'login': 'تم تسجيل الدخول بنجاح من المتصفح',
    'logout': 'تم تسجيل الخروج من النظام',
    'profile_updated': 'تم تحديث معلومات الملف الشخصي',
    'password_changed': 'تم تغيير كلمة المرور بنجاح',
    'settings_updated': 'تم تحديث إعدادات الموقع',
    'package_created': 'تم إنشاء باقة جديدة في النظام',
    'package_updated': 'تم تحديث بيانات الباقة',
    'package_deleted': 'تم حذف الباقة من النظام',
    'destination_created': 'تم إضافة وجهة جديدة',
    'destination_updated': 'تم تحديث بيانات الوجهة',
    'destination_deleted': 'تم حذف الوجهة',
    'booking_created': 'تم إنشاء حجز جديد',
    'booking_updated': 'تم تحديث بيانات الحجز',
    'booking_deleted': 'تم حذف الحجز'
  }
  return detailsMap[action] || `تم تنفيذ ${action} على ${resourceType || 'المورد'}`
}
