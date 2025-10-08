export default defineNuxtPlugin(() => {
  const { checkAuth } = useAdminAuth()
  
  // Check authentication status on app initialization
  checkAuth()
})
