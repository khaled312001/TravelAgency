export default defineEventHandler(async (event) => {
  try {
    // For JWT-based auth, logout is handled client-side by removing the token
    // Server-side logout would typically involve blacklisting the token
    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Logout failed'
    })
  }
})
