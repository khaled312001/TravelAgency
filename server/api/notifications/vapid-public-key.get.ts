export default defineEventHandler(async (event) => {
  try {
    // For development, return a dummy VAPID key
    // In production, you should use your actual VAPID keys
    const publicKey = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI8gW3uK2VgK8K1YQl4j2k3n4m5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2'
    
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