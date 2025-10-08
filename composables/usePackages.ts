// import type { Database } from '~/types/supabase'
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
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  travel_period?: string
  duration_days: number
  price: number
  max_persons?: number
  included_options?: PackageOptions
}



export function usePackages() {
  // Fetch packages from API (SSR/CSR compatible, SWR caching)
  const { data: packages, pending, error, refresh } = useAsyncData('packages', async () => {
    const res = await fetch('/api/packages')
    if (!res.ok) throw new Error('Failed to fetch packages')
    const result = await res.json()
    return result.packages as Package[]
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