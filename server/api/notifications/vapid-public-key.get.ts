export default defineEventHandler(async (event) => {
  try {
    // VAPID public key (you should generate your own)
    const publicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI8F7j7ZAd9cn9jKIHaMqI5t9Dg6Ok3U7e1zKqoAZ4j2twFJqOPWqQW60'
    
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
