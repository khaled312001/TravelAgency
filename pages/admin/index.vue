<template>
  <div class="space-y-4">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        مرحباً بك في لوحة التحكم
      </h1>
      <p class="text-gray-600 text-lg">
        إدارة شاملة لموقع Wonder Land Traveling Agency
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">المستخدمين</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.totalUsers || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">رسائل جديدة</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.newMessages || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:mail" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">إجمالي الوجهات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.totalDestinations || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:map-pin" class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">إجمالي الباقات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.totalPackages || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:package" class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.totalBookings || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:calendar" class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Booking Distribution Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">توزيع الحجوزات</h3>
        <p class="text-sm text-gray-600 mb-6">حسب النوع</p>
        
        <div class="space-y-4">
          <div v-for="item in bookingDistribution" :key="item.type" class="flex items-center justify-between">
            <div class="flex items-center">
              <div 
                class="w-4 h-4 rounded-full ml-3" 
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="text-sm text-gray-700">{{ item.type }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ item.count }}</p>
              <p class="text-xs text-gray-500">{{ item.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Sales Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">المبيعات الشهرية</h3>
        <p class="text-sm text-gray-600 mb-6">آخر 6 أشهر</p>
        
        <div class="space-y-4">
          <div v-for="item in monthlySales" :key="item.month" class="flex items-center justify-between">
            <span class="text-sm text-gray-700">{{ item.month }}</span>
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${(item.amount / 70000) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900 w-20 text-left">
                {{ formatCurrency(item.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Information Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- SEO Statistics -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">إحصائيات SEO</h3>
        
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">معدل الأداء</span>
              <span class="text-sm font-medium text-gray-900">87%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: 87%"></div>
            </div>
          </div>
          
          <div>
            <span class="text-sm text-gray-600">صفحات مفهرسة</span>
            <p class="text-lg font-semibold text-gray-900">45</p>
          </div>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-start">
              <Icon name="lucide:alert-triangle" class="w-5 h-5 text-red-500 ml-2 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-red-800">3 مشكلة SEO تحتاج انتباه</p>
                <p class="text-xs text-red-600 mt-1">راجع صفحة إدارة SEO لحل هذه المشاكل</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-900">توصيات سريعة</h4>
            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-700">
                <Icon name="lucide:check" class="w-4 h-4 text-green-500 ml-2" />
                أضف كود Google Analytics لتتبع الزوار
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <Icon name="lucide:check" class="w-4 h-4 text-green-500 ml-2" />
                أضف كود Google Search Console لتحسين الفهرسة
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Packages -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">الباقات الأكثر شعبية</h3>
        
        <div class="space-y-4">
          <div v-for="pkg in popularPackages" :key="pkg.id" class="flex items-center space-x-4 space-x-reverse">
            <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
              <img 
                :src="pkg.image_url" 
                :alt="pkg.title"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900">{{ pkg.title }}</h4>
              <p class="text-sm text-gray-600">{{ formatCurrency(pkg.price) }}</p>
              <p class="text-xs text-gray-500">{{ pkg.views }} مشاهدة</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">الأنشطة الحديثة</h3>
        
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 space-x-reverse">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <NuxtLink
        to="/admin/destinations/new"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
      >
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:plus" class="w-6 h-6 text-blue-600" />
        </div>
        <p class="text-sm font-medium text-gray-900">إضافة وجهة</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/packages/new"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
      >
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:plus" class="w-6 h-6 text-orange-600" />
        </div>
        <p class="text-sm font-medium text-gray-900">إضافة باقة</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/messages"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
      >
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:mail" class="w-6 h-6 text-green-600" />
        </div>
        <p class="text-sm font-medium text-gray-900">عرض الرسائل</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/seo"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
      >
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:search" class="w-6 h-6 text-purple-600" />
        </div>
        <p class="text-sm font-medium text-gray-900">إدارة SEO</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/settings"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
      >
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:settings" class="w-6 h-6 text-gray-600" />
        </div>
        <p class="text-sm font-medium text-gray-900">الإعدادات</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Dashboard data
const { 
  stats, 
  bookingDistribution, 
  monthlySales, 
  popularPackages, 
  recentActivities, 
  isLoading,
  fetchDashboardData 
} = useAdminDashboard()

// Mock data for popular packages
const mockPopularPackages = [
  {
    id: '1',
    title: 'رحلة إلى دبي',
    price: 2500,
    views: 150,
    image_url: '/images/packages/home/package-1.jpeg'
  },
  {
    id: '2',
    title: 'عمرة رمضان',
    price: 1800,
    views: 120,
    image_url: '/images/packages/home/package-1.jpeg'
  }
]

// Mock data for recent activities
const mockRecentActivities = [
  {
    id: '1',
    action: 'create_package',
    description: 'تم إنشاء حزمة جديدة',
    timestamp: '2024-01-31T13:52:00Z',
    type: 'package' as const
  },
  {
    id: '2',
    action: 'new_message',
    description: 'رسالة جديدة من العميل',
    timestamp: '2024-01-31T12:52:00Z',
    type: 'message' as const
  }
]

// Initialize dashboard data
onMounted(async () => {
  try {
    await fetchDashboardData()
  } catch (error) {
    console.error('Error loading dashboard:', error)
  }
})

// Set popular packages and recent activities to mock data for now
popularPackages.value = mockPopularPackages
recentActivities.value = mockRecentActivities

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Set page title
useHead({
  title: 'لوحة التحكم - Wonder Land'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>
