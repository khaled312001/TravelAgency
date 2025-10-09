import type { Database } from '~/types/supabase'
import { ref } from 'vue'
import { useAsyncData } from '#app'

export interface PackageOptions {
  flight?: boolean
  hotel?: boolean
  transportation?: boolean
  hotelGrade?: number // Hotel grade (stars), e.g., 3, 4, 5
}

export interface Package {
  id: string
  image_url: string
  hero_image_url?: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  travel_period?: string
  duration_days: number
  price: number
  max_persons?: number
  featured?: boolean
  created_by_admin?: boolean
  included_options?: PackageOptions
}



export function usePackages() {
  const client = useSupabaseClient<Database>()
  
  // Fetch packages from Supabase directly (client-side)
  const { data: packages, pending, error, refresh } = useAsyncData('packages-fixed', async () => {
    const { data, error: fetchError } = await client
      .from('packages')
      .select(`
        id, image_url, title_ar, title_en, description_ar, description_en, travel_period, duration_days, price, max_persons, featured,
        package_options:package_options (flight, hotel, transportation, hotel_grade)
      `)
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    // Format to match expected structure
    return (data || []).map((pkg: any) => ({
      id: pkg.id,
      image_url: pkg.image_url,
      title_ar: pkg.title_ar,
      title_en: pkg.title_en,
      description_ar: pkg.description_ar,
      description_en: pkg.description_en,
      travel_period: pkg.travel_period,
      duration_days: pkg.duration_days,
      price: pkg.price,
      max_persons: pkg.max_persons,
      featured: pkg.featured,
      included_options: pkg.package_options ? {
        flight: pkg.package_options.flight,
        hotel: pkg.package_options.hotel,
        transportation: pkg.package_options.transportation,
        hotelGrade: pkg.package_options.hotel_grade,
      } : undefined,
    })) as Package[]
  })

  // Get all packages
  const getPackages = () => packages.value || []

  // Get package by ID
  const getPackageById = (id: string) => getPackages().find(p => p.id === id)

  return {
    getPackages,
    getPackageById,
    pending,
    error,
    refresh
  }
}