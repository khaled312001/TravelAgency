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
  // Fetch packages from public API endpoint
  const { data: packages, pending, error, refresh } = useAsyncData('packages-public', async () => {
    try {
      console.log('Fetching packages from public API...')
      const response = await $fetch('/api/packages')
      
      if (response.success && response.packages) {
        console.log('Packages fetched successfully:', response.packages.length)
        return response.packages as Package[]
      } else {
        console.error('Invalid response from packages API:', response)
        return []
      }
    } catch (fetchError) {
      console.error('Error fetching packages:', fetchError)
      throw fetchError
    }
  })

  // Get all packages
  const getPackages = () => packages.value || []

  // Get package by ID
  const getPackageById = (id: string) => {
    const packages = getPackages()
    console.log('Looking for package with ID:', id)
    console.log('Available packages:', packages.map(p => ({ id: p.id, title: p.title_ar })))
    const found = packages.find(p => p.id === id)
    console.log('Found package:', found)
    return found
  }

  return {
    getPackages,
    getPackageById,
    pending,
    error,
    refresh
  }
}