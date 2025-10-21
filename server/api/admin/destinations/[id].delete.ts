import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const destinationId = getRouterParam(event, 'id')
    console.log('Deleting destination:', destinationId)

    if (!destinationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      })
    }

    // Delete destination
    const { error: destinationError } = await supabase
      .from('destinations')
      .delete()
      .eq('id', destinationId)

    if (destinationError) {
      console.error('Supabase error:', destinationError)
      throw createError({
        statusCode: 400,
        statusMessage: destinationError.message
      })
    }

    console.log('Destination deleted successfully:', destinationId)

    return {
      success: true,
      message: 'Destination deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting destination:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete destination: ${error.message}`
    })
  }
})