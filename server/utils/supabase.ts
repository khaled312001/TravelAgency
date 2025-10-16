import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with proper error handling
 * Returns null if environment variables are not configured
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not configured. Some features may not work.')
    return null
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Creates a Supabase client or throws an error if not configured
 */
export function requireSupabaseClient() {
  const client = createSupabaseClient()
  
  if (!client) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database not configured. Please set up Supabase environment variables.'
    })
  }
  
  return client
}


