export default defineEventHandler(async (event) => {
  try {
    // VAPID public key (you should generate your own)
    const publicKey = 'BFdVyptxcvboSd9zX8m-IciFTHpCkS6Ok1BJBPhnOn8kG4Es_eXCgPbh0c5vOniOo4kS24MlEciLsF7Adw1i7sY'
    
    return {
      publicKey
    }
  } catch (error) {
    console.error('Error getting VAPID public key:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
