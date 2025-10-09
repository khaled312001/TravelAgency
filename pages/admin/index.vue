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
      <!-- Revenue Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">الإيرادات الشهرية</h3>
          <select v-model="selectedPeriod" @change="updateRevenueChart" class="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option value="6months">آخر 6 أشهر</option>
            <option value="12months">آخر 12 شهر</option>
            <option value="year">هذا العام</option>
          </select>
        </div>
        <div class="h-64">
          <canvas ref="revenueChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Bookings Trend Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">اتجاه الحجوزات</h3>
          <select v-model="selectedBookingPeriod" @change="updateBookingsChart" class="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option value="7days">آخر 7 أيام</option>
            <option value="30days">آخر 30 يوم</option>
            <option value="3months">آخر 3 أشهر</option>
          </select>
        </div>
        <div class="h-64">
          <canvas ref="bookingsChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Advanced Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Package Performance Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">أداء الباقات</h3>
        <div class="h-80">
          <canvas ref="packageChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Customer Demographics -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">ديموغرافيا العملاء</h3>
        <div class="h-80">
          <canvas ref="demographicsChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Revenue by Destination -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">الإيرادات حسب الوجهة</h3>
        <div class="h-80">
          <canvas ref="destinationChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- KPI Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Conversion Rate -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">معدل التحويل</p>
            <p class="text-2xl font-bold text-blue-900">{{ conversionRate }}%</p>
            <p class="text-xs text-blue-600 mt-1">+2.5% من الشهر الماضي</p>
          </div>
          <div class="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
            <Icon name="lucide:trending-up" class="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <!-- Average Booking Value -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">متوسط قيمة الحجز</p>
            <p class="text-2xl font-bold text-green-900">{{ averageBookingValue }} ريال</p>
            <p class="text-xs text-green-600 mt-1">+150 ريال من الشهر الماضي</p>
          </div>
          <div class="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
            <Icon name="lucide:dollar-sign" class="w-6 h-6 text-green-700" />
          </div>
        </div>
      </div>

      <!-- Customer Satisfaction -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">رضا العملاء</p>
            <p class="text-2xl font-bold text-purple-900">{{ customerSatisfaction }}/5</p>
            <p class="text-xs text-purple-600 mt-1">+0.3 من الشهر الماضي</p>
          </div>
          <div class="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
            <Icon name="lucide:star" class="w-6 h-6 text-purple-700" />
          </div>
        </div>
      </div>

      <!-- Repeat Customers -->
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-orange-600">العملاء العائدون</p>
            <p class="text-2xl font-bold text-orange-900">{{ repeatCustomers }}%</p>
            <p class="text-xs text-orange-600 mt-1">+5% من الشهر الماضي</p>
          </div>
          <div class="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
            <Icon name="lucide:repeat" class="w-6 h-6 text-orange-700" />
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
          <div v-for="pkg in localPopularPackages" :key="pkg.id" class="flex items-center space-x-4 space-x-reverse">
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
          <div v-for="activity in localRecentActivities" :key="activity.id" class="flex items-start space-x-3 space-x-reverse">
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
import type { PopularPackage, RecentActivity } from '~/types/admin'

// Use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Chart refs
const revenueChart = ref<HTMLCanvasElement>()
const bookingsChart = ref<HTMLCanvasElement>()
const packageChart = ref<HTMLCanvasElement>()
const demographicsChart = ref<HTMLCanvasElement>()
const destinationChart = ref<HTMLCanvasElement>()

// Chart instances
let revenueChartInstance: any = null
let bookingsChartInstance: any = null
let packageChartInstance: any = null
let demographicsChartInstance: any = null
let destinationChartInstance: any = null

// Chart data and controls
const selectedPeriod = ref('6months')
const selectedBookingPeriod = ref('30days')

// KPI metrics
const conversionRate = ref(12.5)
const averageBookingValue = ref(2850)
const customerSatisfaction = ref(4.7)
const repeatCustomers = ref(35)

// Dashboard data
const { 
  stats, 
  bookingDistribution, 
  monthlySales, 
  isLoading,
  fetchDashboardData 
} = useAdminDashboard()

// Local state for better performance
const localPopularPackages = ref<PopularPackage[]>([])
const localRecentActivities = ref<RecentActivity[]>([])

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

// Chart creation functions
const createRevenueChart = async () => {
  if (!revenueChart.value) return
  
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  const ctx = revenueChart.value.getContext('2d')
  if (!ctx) return
  
  // Destroy existing chart
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
  }
  
  const data = await getRevenueData(selectedPeriod.value)
  
  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'الإيرادات (ريال)',
        data: data.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return value.toLocaleString() + ' ريال'
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const createBookingsChart = async () => {
  if (!bookingsChart.value) return
  
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  const ctx = bookingsChart.value.getContext('2d')
  if (!ctx) return
  
  if (bookingsChartInstance) {
    bookingsChartInstance.destroy()
  }
  
  const data = await getBookingsData(selectedBookingPeriod.value)
  
  bookingsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'عدد الحجوزات',
        data: data.values,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const createPackageChart = async () => {
  if (!packageChart.value) return
  
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  const ctx = packageChart.value.getContext('2d')
  if (!ctx) return
  
  if (packageChartInstance) {
    packageChartInstance.destroy()
  }
  
  const data = await getPackagePerformanceData()
  
  packageChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  })
}

const createDemographicsChart = async () => {
  if (!demographicsChart.value) return
  
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  const ctx = demographicsChart.value.getContext('2d')
  if (!ctx) return
  
  if (demographicsChartInstance) {
    demographicsChartInstance.destroy()
  }
  
  const data = await getDemographicsData()
  
  demographicsChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  })
}

const createDestinationChart = async () => {
  if (!destinationChart.value) return
  
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  const ctx = destinationChart.value.getContext('2d')
  if (!ctx) return
  
  if (destinationChartInstance) {
    destinationChartInstance.destroy()
  }
  
  const data = await getDestinationRevenueData()
  
  destinationChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'الإيرادات (ريال)',
        data: data.values,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return value.toLocaleString() + ' ريال'
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// Data fetching functions
const getRevenueData = async (period: string) => {
  try {
    const response = await $fetch(`/api/admin/dashboard/analytics?type=revenue&period=${period}`)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching revenue data:', error)
  }
  
  // Fallback data
  const data = {
    '6months': {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      values: [45000, 52000, 48000, 61000, 55000, 67000]
    },
    '12months': {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      values: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 80000, 85000, 90000]
    },
    'year': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      values: [145000, 183000, 227000, 255000]
    }
  }
  return data[period as keyof typeof data] || data['6months']
}

const getBookingsData = async (period: string) => {
  try {
    const response = await $fetch(`/api/admin/dashboard/analytics?type=bookings&period=${period}`)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching bookings data:', error)
  }
  
  // Fallback data
  const data = {
    '7days': {
      labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      values: [12, 18, 15, 22, 19, 25, 28]
    },
    '30days': {
      labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
      values: [85, 92, 78, 105]
    },
    '3months': {
      labels: ['الشهر 1', 'الشهر 2', 'الشهر 3'],
      values: [320, 380, 420]
    }
  }
  return data[period as keyof typeof data] || data['30days']
}

const getPackagePerformanceData = async () => {
  try {
    const response = await $fetch('/api/admin/dashboard/analytics?type=packages')
    if (response.success) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching package data:', error)
  }
  
  // Fallback data
  return {
    labels: ['رحلات العمرة', 'رحلات الحج', 'رحلات دبي', 'رحلات تركيا', 'رحلات ماليزيا', 'رحلات أخرى'],
    values: [35, 25, 15, 12, 8, 5]
  }
}

const getDemographicsData = async () => {
  try {
    const response = await $fetch('/api/admin/dashboard/analytics?type=demographics')
    if (response.success) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching demographics data:', error)
  }
  
  // Fallback data
  return {
    labels: ['العائلات', 'الأزواج', 'الأفراد', 'المجموعات'],
    values: [45, 30, 15, 10]
  }
}

const getDestinationRevenueData = async () => {
  try {
    const response = await $fetch('/api/admin/dashboard/analytics?type=destinations')
    if (response.success) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching destination data:', error)
  }
  
  // Fallback data
  return {
    labels: ['مكة المكرمة', 'المدينة المنورة', 'دبي', 'تركيا', 'ماليزيا', 'تايلاند'],
    values: [120000, 95000, 85000, 75000, 65000, 55000]
  }
}

// Chart update functions
const updateRevenueChart = () => {
  createRevenueChart()
}

const updateBookingsChart = () => {
  createBookingsChart()
}

// Initialize dashboard data with lazy loading
onMounted(async () => {
  try {
    // Set mock data immediately for better UX
    localPopularPackages.value = [...mockPopularPackages]
    localRecentActivities.value = [...mockRecentActivities]
    
    // Initialize charts
    await nextTick()
    await createRevenueChart()
    await createBookingsChart()
    await createPackageChart()
    await createDemographicsChart()
    await createDestinationChart()
    
    // Load real data in background
    setTimeout(async () => {
      try {
        await fetchDashboardData()
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }, 1000)
  } catch (error) {
    console.error('Error initializing dashboard:', error)
  }
})

// Cleanup charts on unmount
onUnmounted(() => {
  if (revenueChartInstance) revenueChartInstance.destroy()
  if (bookingsChartInstance) bookingsChartInstance.destroy()
  if (packageChartInstance) packageChartInstance.destroy()
  if (demographicsChartInstance) demographicsChartInstance.destroy()
  if (destinationChartInstance) destinationChartInstance.destroy()
})

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'تاريخ غير صحيح'
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'تاريخ غير صحيح'
  }
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
