export default defineNuxtRouteMiddleware((to) => {
  // Only apply to admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  // Skip auth check for login page
  if (to.path === '/admin/login') {
    return
  }

  // Check if user is authenticated
  if (process.client) {
    const token = localStorage.getItem('admin_token')
    const user = localStorage.getItem('admin_user')
    
    if (!token || !user) {
      return navigateTo('/admin/login')
    }
  }
})
