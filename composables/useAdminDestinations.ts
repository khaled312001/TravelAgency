import type { Database } from '~/types/supabase'

export interface Destination {
  id: string
  name_ar: string
  name_en: string
  description_ar: string
  description_en: string
  region_ar: string
  region_en: string
  location_type_ar: string
  location_type_en: string
  destination_type_ar: string
  destination_type_en: string
  main_image: string
  gallery: any[]
  tourist_spots: any[]
  upcoming_events: any[]
  coordinates: {
    latitude: number
    longitude: number
  }
  featured: boolean
  created_at: string
  updated_at: string
}

export function useAdminDestinations() {
  const client = useSupabaseClient<Database>()

  // جلب جميع الوجهات
  const getDestinations = async () => {
    try {
      const { data, error } = await client
        .from('destinations')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching destinations:', error)
        return []
      }

      return data as Destination[]
    } catch (error) {
      console.error('Error in getDestinations:', error)
      return []
    }
  }

  // جلب الوجهات المميزة
  const getFeaturedDestinations = async () => {
    try {
      const { data, error } = await client
        .from('destinations')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching featured destinations:', error)
        return []
      }

      return data as Destination[]
    } catch (error) {
      console.error('Error in getFeaturedDestinations:', error)
      return []
    }
  }

  // جلب الوجهات السعودية
  const getSaudiDestinations = async () => {
    try {
      const { data, error } = await client
        .from('destinations')
        .select('*')
        .in('region_ar', ['منطقة الرياض', 'منطقة البحر الأحمر', 'منطقة مكة المكرمة', 'منطقة المدينة المنورة'])
        .order('featured', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching Saudi destinations:', error)
        return []
      }

      return data as Destination[]
    } catch (error) {
      console.error('Error in getSaudiDestinations:', error)
      return []
    }
  }

  // جلب الوجهات العالمية
  const getGlobalDestinations = async () => {
    try {
      const { data, error } = await client
        .from('destinations')
        .select('*')
        .not('region_ar', 'in', '(منطقة الرياض,منطقة البحر الأحمر,منطقة مكة المكرمة,منطقة المدينة المنورة)')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching global destinations:', error)
        return []
      }

      return data as Destination[]
    } catch (error) {
      console.error('Error in getGlobalDestinations:', error)
      return []
    }
  }

  // جلب وجهة واحدة بالمعرف
  const getDestinationById = async (id: string) => {
    try {
      const { data, error } = await client
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching destination:', error)
        return null
      }

      return data as Destination
    } catch (error) {
      console.error('Error in getDestinationById:', error)
      return null
    }
  }

  // إضافة وجهة جديدة
  const createDestination = async (destination: Omit<Destination, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await client
        .from('destinations')
        .insert([destination])
        .select()
        .single()

      if (error) {
        console.error('Error creating destination:', error)
        return null
      }

      return data as Destination
    } catch (error) {
      console.error('Error in createDestination:', error)
      return null
    }
  }

  // تحديث وجهة
  const updateDestination = async (id: string, updates: Partial<Destination>) => {
    try {
      const { data, error } = await client
        .from('destinations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating destination:', error)
        return null
      }

      return data as Destination
    } catch (error) {
      console.error('Error in updateDestination:', error)
      return null
    }
  }

  // حذف وجهة
  const deleteDestination = async (id: string) => {
    try {
      const { error } = await client
        .from('destinations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting destination:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteDestination:', error)
      return false
    }
  }

  // تبديل حالة المميز
  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { data, error } = await client
        .from('destinations')
        .update({ 
          featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling featured status:', error)
        return null
      }

      return data as Destination
    } catch (error) {
      console.error('Error in toggleFeatured:', error)
      return null
    }
  }

  return {
    getDestinations,
    getFeaturedDestinations,
    getSaudiDestinations,
    getGlobalDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination,
    toggleFeatured
  }
}