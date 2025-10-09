<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center p-4" dir="rtl">
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="lucide:shield-check" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Wonder Land</h1>
          <p class="text-gray-600 mt-2">لوحة التحكم الإدارية</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="lucide:mail" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="admin@wonderland.com"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="lucide:lock" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 left-0 pl-3 flex items-center"
                :disabled="isLoading"
              >
                <Icon 
                  :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" 
                  class="h-5 w-5 text-gray-400 hover:text-gray-600" 
                />
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-400 ml-2" />
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 ml-2 animate-spin" />
            <Icon v-else name="lucide:log-in" class="w-4 h-4 ml-2" />
            {{ isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}
          </button>
        </form>

      
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-white/80 text-sm">
          © 2024 Wonder Land Traveling Agency. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminLoginRequest } from '~/types/admin'

// Redirect if already authenticated
const { isAuthenticated } = useAdminAuth()
if (isAuthenticated.value) {
  await navigateTo('/admin')
}

// Form data
const form = reactive<AdminLoginRequest>({
  email: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Login handler
const handleLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { login } = useAdminAuth()
    const response = await login(form)

    console.log('Login response:', response)

    if (response && response.success) {
      console.log('Login successful, navigating to admin dashboard')
      await navigateTo('/admin')
    } else {
      errorMessage.value = response?.message || 'فشل في تسجيل الدخول'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    isLoading.value = false
  }
}

// Set page title
useHead({
  title: 'تسجيل الدخول - لوحة التحكم'
})

// Don't use admin layout for login page
definePageMeta({
  layout: false
})
</script>
