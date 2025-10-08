<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إضافة باقة جديدة</h1>
        <p class="text-gray-600 mt-1">أضف باقة سفر جديدة إلى الموقع</p>
      </div>
      <NuxtLink
        to="/admin/packages"
        class="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
        العودة للقائمة
      </NuxtLink>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              عنوان الباقة *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="مثال: رحلة إلى دبي"
            />
          </div>

          <!-- Destination -->
          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700 mb-2">
              الوجهة *
            </label>
            <input
              id="destination"
              v-model="form.destination"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="مثال: دبي، الإمارات العربية المتحدة"
            />
          </div>

          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              السعر (ريال سعودي) *
            </label>
            <input
              id="price"
              v-model="form.price"
              type="number"
              required
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="2500.00"
            />
          </div>

          <!-- Duration -->
          <div>
            <label for="duration_days" class="block text-sm font-medium text-gray-700 mb-2">
              مدة الرحلة (بالأيام) *
            </label>
            <input
              id="duration_days"
              v-model="form.duration_days"
              type="number"
              required
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="7"
            />
          </div>

          <!-- Image URL -->
          <div>
            <label for="image_url" class="block text-sm font-medium text-gray-700 mb-2">
              رابط الصورة *
            </label>
            <input
              id="image_url"
              v-model="form.image_url"
              type="url"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p class="text-xs text-gray-500 mt-1">يجب أن يكون الرابط صالحاً ويشير إلى صورة</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              وصف الباقة *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="اكتب وصفاً مفصلاً للباقة..."
            ></textarea>
          </div>

          <!-- Image Preview -->
          <div v-if="form.image_url">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              معاينة الصورة
            </label>
            <div class="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                :src="form.image_url"
                :alt="form.title || 'معاينة الصورة'"
                class="w-full h-full object-cover"
                @error="imageError = true"
              />
              <div v-if="imageError" class="w-full h-full flex items-center justify-center text-gray-500">
                <div class="text-center">
                  <Icon name="lucide:image-off" class="w-8 h-8 mx-auto mb-2" />
                  <p class="text-sm">لا يمكن تحميل الصورة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-400 ml-2" />
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex">
          <Icon name="lucide:check-circle" class="h-5 w-5 text-green-400 ml-2" />
          <p class="text-sm text-green-700">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-8 flex items-center justify-end space-x-4 space-x-reverse">
        <NuxtLink
          to="/admin/packages"
          class="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </NuxtLink>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 ml-2 animate-spin" />
          <Icon v-else name="lucide:save" class="w-4 h-4 ml-2" />
          {{ isLoading ? 'جاري الحفظ...' : 'حفظ الباقة' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// Use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Form data
const form = reactive({
  title: '',
  description: '',
  price: '',
  duration_days: '',
  destination: '',
  image_url: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const imageError = ref(false)

const { getAuthHeaders } = useAdminAuth()

// Handle form submission
const handleSubmit = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch('/api/admin/packages', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        duration_days: parseInt(form.duration_days),
        destination: form.destination,
        image_url: form.image_url
      }
    })

    if (response.success) {
      successMessage.value = 'تم إنشاء الباقة بنجاح!'
      
      // Reset form
      Object.keys(form).forEach(key => {
        form[key] = ''
      })
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigateTo('/admin/packages')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Error creating package:', error)
    errorMessage.value = error.data?.message || 'حدث خطأ أثناء إنشاء الباقة'
  } finally {
    isLoading.value = false
  }
}

// Reset image error when URL changes
watch(() => form.image_url, () => {
  imageError.value = false
})

// Set page title
useHead({
  title: 'إضافة باقة جديدة - لوحة التحكم'
})
</script>
