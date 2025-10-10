export default defineEventHandler(async (event) => {
  try {
    // Use the correct VAPID public key that matches the server configuration
    const publicKey = process.env.VAPID_PUBLIC_KEY || 'BFdVyptxcvboSd9zX8m-IciFTHpCkS6Ok1BJBPhnOn8kG4Es_eXCgPbh0c5vOniOo4kS24MlEciLsF7Adw1i7sY'
    
    return {
      publicKey
    }
  } catch (error) {
    console.error('Error getting VAPID public key:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get VAPID public key'
    })
  }
})