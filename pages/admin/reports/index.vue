<template>
  <div class="reports-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">التقارير والإحصائيات</h1>
          <p class="page-subtitle">تقارير شاملة وإحصائيات مفصلة للموقع</p>
        </div>
        <div class="header-right">
          <button @click="exportReport" class="export-btn">
            <Icon name="lucide:download" class="btn-icon" />
            تصدير التقرير
          </button>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="filters-section">
      <div class="filters-container">
        <div class="date-range">
          <label class="filter-label">فترة التقرير:</label>
          <div class="date-inputs">
            <input 
              v-model="dateFrom" 
              type="date" 
              class="date-input"
              placeholder="من تاريخ"
            />
            <span class="date-separator">إلى</span>
            <input 
              v-model="dateTo" 
              type="date" 
              class="date-input"
              placeholder="إلى تاريخ"
            />
          </div>
        </div>
        
        <div class="filter-controls">
          <select v-model="reportType" class="filter-select">
            <option value="overview">نظرة عامة</option>
            <option value="bookings">الحجوزات</option>
            <option value="revenue">الإيرادات</option>
            <option value="customers">العملاء</option>
            <option value="packages">الباقات</option>
          </select>
          
          <button @click="generateReport" class="generate-btn">
            <Icon name="lucide:refresh-cw" class="btn-icon" />
            تحديث التقرير
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">
          <Icon name="lucide:calendar" class="icon" />
        </div>
        <div class="metric-content">
          <p class="metric-value">{{ totalBookings }}</p>
          <p class="metric-label">إجمالي الحجوزات</p>
          <p class="metric-change positive">+12% من الشهر الماضي</p>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <Icon name="lucide:dollar-sign" class="icon" />
        </div>
        <div class="metric-content">
          <p class="metric-value">{{ formatPrice(totalRevenue) }}</p>
          <p class="metric-label">إجمالي الإيرادات</p>
          <p class="metric-change positive">+8% من الشهر الماضي</p>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <Icon name="lucide:users" class="icon" />
        </div>
        <div class="metric-content">
          <p class="metric-value">{{ totalCustomers }}</p>
          <p class="metric-label">إجمالي العملاء</p>
          <p class="metric-change positive">+15% من الشهر الماضي</p>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <Icon name="lucide:package" class="icon" />
        </div>
        <div class="metric-content">
          <p class="metric-value">{{ totalPackages }}</p>
          <p class="metric-label">إجمالي الباقات</p>
          <p class="metric-change neutral">بدون تغيير</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Revenue Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">الإيرادات الشهرية</h3>
          <div class="chart-actions">
            <button class="chart-action-btn">
              <Icon name="lucide:maximize" class="action-icon" />
            </button>
          </div>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <Icon name="lucide:trending-up" class="chart-icon" />
            <p class="chart-text">رسم بياني للإيرادات الشهرية</p>
            <div class="chart-data">
              <div class="data-item">
                <span class="data-label">يناير:</span>
                <span class="data-value">45,000 ريال</span>
              </div>
              <div class="data-item">
                <span class="data-label">فبراير:</span>
                <span class="data-value">52,000 ريال</span>
              </div>
              <div class="data-item">
                <span class="data-label">مارس:</span>
                <span class="data-value">48,000 ريال</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">توزيع الحجوزات</h3>
          <div class="chart-actions">
            <button class="chart-action-btn">
              <Icon name="lucide:maximize" class="action-icon" />
            </button>
          </div>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <Icon name="lucide:pie-chart" class="chart-icon" />
            <p class="chart-text">رسم بياني لتوزيع الحجوزات</p>
            <div class="chart-data">
              <div class="data-item">
                <span class="data-label">رحلات داخلية:</span>
                <span class="data-value">60%</span>
              </div>
              <div class="data-item">
                <span class="data-label">رحلات خارجية:</span>
                <span class="data-value">25%</span>
              </div>
              <div class="data-item">
                <span class="data-label">عمرة:</span>
                <span class="data-value">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="reports-grid">
      <!-- Top Packages -->
      <div class="report-card">
        <div class="report-header">
          <h3 class="report-title">أكثر الباقات شعبية</h3>
          <button class="report-action-btn">
            <Icon name="lucide:external-link" class="action-icon" />
          </button>
        </div>
        <div class="report-content">
          <div class="report-list">
            <div v-for="pkg in topPackages" :key="pkg.id" class="report-item">
              <div class="item-info">
                <h4 class="item-title">{{ pkg.title }}</h4>
                <p class="item-subtitle">{{ pkg.destination }}</p>
              </div>
              <div class="item-stats">
                <span class="item-value">{{ pkg.bookings }}</span>
                <span class="item-label">حجز</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="report-card">
        <div class="report-header">
          <h3 class="report-title">آخر الحجوزات</h3>
          <button class="report-action-btn">
            <Icon name="lucide:external-link" class="action-icon" />
          </button>
        </div>
        <div class="report-content">
          <div class="report-list">
            <div v-for="booking in recentBookings" :key="booking.id" class="report-item">
              <div class="item-info">
                <h4 class="item-title">{{ booking.customer_name }}</h4>
                <p class="item-subtitle">{{ booking.package_title }}</p>
              </div>
              <div class="item-stats">
                <span class="item-value">{{ formatPrice(booking.amount) }}</span>
                <span class="item-label">{{ formatDate(booking.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Analytics -->
      <div class="report-card">
        <div class="report-header">
          <h3 class="report-title">تحليل العملاء</h3>
          <button class="report-action-btn">
            <Icon name="lucide:external-link" class="action-icon" />
          </button>
        </div>
        <div class="report-content">
          <div class="analytics-grid">
            <div class="analytics-item">
              <div class="analytics-icon">
                <Icon name="lucide:user-plus" class="icon" />
              </div>
              <div class="analytics-content">
                <p class="analytics-value">{{ newCustomers }}</p>
                <p class="analytics-label">عملاء جدد</p>
              </div>
            </div>
            <div class="analytics-item">
              <div class="analytics-icon">
                <Icon name="lucide:repeat" class="icon" />
              </div>
              <div class="analytics-content">
                <p class="analytics-value">{{ returningCustomers }}</p>
                <p class="analytics-label">عملاء عائدون</p>
              </div>
            </div>
            <div class="analytics-item">
              <div class="analytics-icon">
                <Icon name="lucide:star" class="icon" />
              </div>
              <div class="analytics-content">
                <p class="analytics-value">{{ averageRating }}</p>
                <p class="analytics-label">متوسط التقييم</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="report-card">
        <div class="report-header">
          <h3 class="report-title">مؤشرات الأداء</h3>
          <button class="report-action-btn">
            <Icon name="lucide:external-link" class="action-icon" />
          </button>
        </div>
        <div class="report-content">
          <div class="performance-metrics">
            <div class="metric-item">
              <div class="metric-header">
                <span class="metric-name">معدل التحويل</span>
                <span class="metric-percentage">3.2%</span>
              </div>
              <div class="metric-bar">
                <div class="metric-fill" style="width: 32%"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-header">
                <span class="metric-name">متوسط قيمة الحجز</span>
                <span class="metric-percentage">4,500 ريال</span>
              </div>
              <div class="metric-bar">
                <div class="metric-fill" style="width: 75%"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-header">
                <span class="metric-name">معدل الإلغاء</span>
                <span class="metric-percentage">2.1%</span>
              </div>
              <div class="metric-bar">
                <div class="metric-fill cancel" style="width: 21%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const dateFrom = ref('')
const dateTo = ref('')
const reportType = ref('overview')

// Real data from database
const totalBookings = ref(0)
const totalRevenue = ref(0)
const totalCustomers = ref(0)
const totalPackages = ref(0)
const newCustomers = ref(0)
const returningCustomers = ref(0)
const averageRating = ref(0)
const loading = ref(false)

// Load real data from database
const loadReportsData = async () => {
  try {
    loading.value = true
    
    // Load bookings data
    const bookingsResponse = await $fetch('/api/admin/bookings')
    if (bookingsResponse.success) {
      const bookings = bookingsResponse.bookings || []
      totalBookings.value = bookings.length
      
      // Calculate total revenue
      totalRevenue.value = bookings.reduce((sum: number, booking: any) => {
        return sum + (booking.price * booking.num_travelers || 0)
      }, 0)
      
      // Calculate unique customers
      const uniqueCustomers = new Set(bookings.map((booking: any) => booking.customer_email))
      totalCustomers.value = uniqueCustomers.size
      
      // Calculate new vs returning customers (simplified logic)
      const customerBookings = bookings.reduce((acc: any, booking: any) => {
        if (!acc[booking.customer_email]) {
          acc[booking.customer_email] = 0
        }
        acc[booking.customer_email]++
        return acc
      }, {})
      
      newCustomers.value = Object.values(customerBookings).filter((count: any) => count === 1).length
      returningCustomers.value = Object.values(customerBookings).filter((count: any) => count > 1).length
    }
    
    // Load packages data
    const packagesResponse = await $fetch('/api/admin/packages')
    if (packagesResponse.success) {
      totalPackages.value = packagesResponse.data?.length || 0
    }
    
    // Load contact messages for customer insights
    const messagesResponse = await $fetch('/api/admin/contact-messages')
    if (messagesResponse.success) {
      const messages = messagesResponse.data || []
      const uniqueMessageCustomers = new Set(messages.map((msg: any) => msg.email))
      totalCustomers.value += uniqueMessageCustomers.size
    }
    
    // Calculate average rating (mock for now, can be enhanced with real reviews)
    averageRating.value = 4.7
    
  } catch (error) {
    console.error('Error loading reports data:', error)
  } finally {
    loading.value = false
  }
}

// Load data on component mount
onMounted(() => {
  loadReportsData()
})

const topPackages = ref([
  {
    id: '1',
    title: 'رحلة إلى دبي',
    destination: 'دبي، الإمارات',
    bookings: 45
  },
  {
    id: '2',
    title: 'عمرة رمضان',
    destination: 'مكة المكرمة',
    bookings: 38
  },
  {
    id: '3',
    title: 'رحلة إلى تركيا',
    destination: 'إسطنبول، تركيا',
    bookings: 32
  }
])

const recentBookings = ref([
  {
    id: '1',
    customer_name: 'أحمد محمد',
    package_title: 'رحلة إلى دبي',
    amount: 5000,
    date: '2024-01-21'
  },
  {
    id: '2',
    customer_name: 'فاطمة علي',
    package_title: 'عمرة رمضان',
    amount: 8000,
    date: '2024-01-20'
  },
  {
    id: '3',
    customer_name: 'محمد أحمد',
    package_title: 'رحلة إلى تركيا',
    amount: 6500,
    date: '2024-01-19'
  }
])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const generateReport = async () => {
  await loadReportsData()
}

const exportReport = async () => {
  // Show export options modal
  const format = await showExportOptions()
  if (!format) return
  
  try {
    loading.value = true
    
    // Prepare data for export
    const reportData = {
      title: 'تقرير شامل - أرض العجائب للسفر',
      date: new Date().toLocaleDateString('ar-SA'),
      period: dateFrom.value && dateTo.value ? 
        `من ${dateFrom.value} إلى ${dateTo.value}` : 
        'جميع الفترات',
      metrics: {
        totalBookings: totalBookings.value,
        totalRevenue: totalRevenue.value,
        totalCustomers: totalCustomers.value,
        totalPackages: totalPackages.value,
        newCustomers: newCustomers.value,
        returningCustomers: returningCustomers.value,
        averageRating: averageRating.value
      },
      topPackages: topPackages.value,
      recentBookings: recentBookings.value
    }
    
    if (format === 'excel') {
      await exportToExcel(reportData)
    } else if (format === 'pdf') {
      await exportToPDF(reportData)
    }
    
  } catch (error) {
    console.error('Export error:', error)
    alert('حدث خطأ أثناء التصدير')
  } finally {
    loading.value = false
  }
}

const showExportOptions = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">اختر تنسيق التصدير</h3>
        <div class="space-y-3">
          <button 
            class="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            onclick="this.closest('.fixed').remove(); window.exportFormat = 'excel'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            تصدير Excel
          </button>
          <button 
            class="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            onclick="this.closest('.fixed').remove(); window.exportFormat = 'pdf'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
            </svg>
            تصدير PDF
          </button>
          <button 
            class="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onclick="this.closest('.fixed').remove(); window.exportFormat = null"
          >
            إلغاء
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Wait for user selection
    const checkFormat = () => {
      if (window.exportFormat !== undefined) {
        const format = window.exportFormat
        delete window.exportFormat
        document.body.removeChild(modal)
        resolve(format)
      } else {
        setTimeout(checkFormat, 100)
      }
    }
    checkFormat()
  })
}

const exportToExcel = async (data: any) => {
  // Create Excel file using SheetJS
  const XLSX = await import('xlsx')
  
  const workbook = XLSX.utils.book_new()
  
  // Summary sheet
  const summaryData = [
    ['تقرير شامل - أرض العجائب للسفر'],
    ['تاريخ التقرير:', data.date],
    ['فترة التقرير:', data.period],
    [''],
    ['المؤشرات الرئيسية'],
    ['إجمالي الحجوزات:', data.metrics.totalBookings],
    ['إجمالي الإيرادات:', data.metrics.totalRevenue + ' ريال'],
    ['إجمالي العملاء:', data.metrics.totalCustomers],
    ['إجمالي الباقات:', data.metrics.totalPackages],
    ['عملاء جدد:', data.metrics.newCustomers],
    ['عملاء عائدون:', data.metrics.returningCustomers],
    ['متوسط التقييم:', data.metrics.averageRating]
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'ملخص')
  
  // Bookings sheet
  const bookingsData = [
    ['ID', 'اسم العميل', 'البريد الإلكتروني', 'الهاتف', 'الباقة', 'الوجهة', 'تاريخ السفر', 'عدد المسافرين', 'السعر', 'الحالة']
  ]
  
  data.recentBookings.forEach((booking: any) => {
    bookingsData.push([
      booking.id,
      booking.customer_name,
      booking.customer_email,
      booking.customer_phone,
      booking.package_title,
      booking.destination,
      booking.travel_date,
      booking.num_travelers,
      booking.price,
      booking.status
    ])
  })
  
  const bookingsSheet = XLSX.utils.aoa_to_sheet(bookingsData)
  XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'الحجوزات')
  
  // Download file
  const fileName = `تقرير_أرض_العجائب_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

const exportToPDF = async (data: any) => {
  // Create PDF using jsPDF
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF('p', 'mm', 'a4')
  
  // Use default font for better compatibility
  doc.setFont('helvetica')
  
  // Title
  doc.setFontSize(20)
  doc.text(data.title, 105, 20, { align: 'center' })
  
  // Date and period
  doc.setFontSize(12)
  doc.text(`تاريخ التقرير: ${data.date}`, 20, 35)
  doc.text(`فترة التقرير: ${data.period}`, 20, 45)
  
  // Metrics
  doc.setFontSize(16)
  doc.text('المؤشرات الرئيسية', 20, 65)
  
  doc.setFontSize(12)
  let y = 80
  const metrics = [
    `إجمالي الحجوزات: ${data.metrics.totalBookings}`,
    `إجمالي الإيرادات: ${data.metrics.totalRevenue} ريال`,
    `إجمالي العملاء: ${data.metrics.totalCustomers}`,
    `إجمالي الباقات: ${data.metrics.totalPackages}`,
    `عملاء جدد: ${data.metrics.newCustomers}`,
    `عملاء عائدون: ${data.metrics.returningCustomers}`,
    `متوسط التقييم: ${data.metrics.averageRating}`
  ]
  
  metrics.forEach(metric => {
    doc.text(metric, 20, y)
    y += 10
  })
  
  // Recent bookings table
  doc.setFontSize(16)
  doc.text('الحجوزات الأخيرة', 20, y + 20)
  
  doc.setFontSize(10)
  y += 35
  
  // Table headers
  const headers = ['العميل', 'الباقة', 'الوجهة', 'التاريخ', 'السعر']
  let x = 20
  headers.forEach(header => {
    doc.text(header, x, y)
    x += 35
  })
  
  y += 10
  doc.line(20, y, 190, y)
  y += 5
  
  // Table data
  data.recentBookings.slice(0, 10).forEach((booking: any) => {
    if (y > 250) {
      doc.addPage()
      y = 20
    }
    
    x = 20
    const rowData = [
      booking.customer_name.substring(0, 15),
      booking.package_title.substring(0, 15),
      booking.destination.substring(0, 15),
      booking.travel_date,
      booking.price + ' ريال'
    ]
    
    rowData.forEach(cell => {
      doc.text(cell, x, y)
      x += 35
    })
    y += 8
  })
  
  // Download file
  const fileName = `تقرير_أرض_العجائب_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

// Set default date range (last 30 days)
onMounted(() => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  dateTo.value = today.toISOString().slice(0, 10)
  dateFrom.value = thirtyDaysAgo.toISOString().slice(0, 10)
})

// Set page title
useHead({
  title: 'التقارير والإحصائيات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.reports-page {
  @apply space-y-4;
}

.page-header {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.header-content {
  @apply flex items-center justify-between;
}

.page-title {
  @apply text-2xl font-bold text-gray-900;
}

.page-subtitle {
  @apply text-gray-600 mt-1;
}

.export-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors;
}

.btn-icon {
  @apply w-4 h-4;
}

.filters-section {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.filters-container {
  @apply flex flex-col lg:flex-row gap-4 items-start lg:items-center;
}

.date-range {
  @apply flex flex-col sm:flex-row items-start sm:items-center gap-3;
}

.filter-label {
  @apply text-sm font-medium text-gray-700 whitespace-nowrap;
}

.date-inputs {
  @apply flex items-center gap-3;
}

.date-input {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.date-separator {
  @apply text-gray-500 text-sm;
}

.filter-controls {
  @apply flex gap-3 ml-auto;
}

.filter-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.generate-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.metric-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.metric-icon {
  @apply w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4;
}

.metric-icon .icon {
  @apply w-6 h-6 text-purple-600;
}

.metric-content {
  @apply space-y-2;
}

.metric-value {
  @apply text-2xl font-bold text-gray-900;
}

.metric-label {
  @apply text-sm text-gray-600;
}

.metric-change {
  @apply text-xs font-medium;
}

.metric-change.positive {
  @apply text-green-600;
}

.metric-change.negative {
  @apply text-red-600;
}

.metric-change.neutral {
  @apply text-gray-600;
}

.charts-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.chart-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.chart-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.chart-title {
  @apply text-lg font-semibold text-gray-900;
}

.chart-actions {
  @apply flex space-x-2 space-x-reverse;
}

.chart-action-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg;
}

.action-icon {
  @apply w-4 h-4;
}

.chart-content {
  @apply p-6;
}

.chart-placeholder {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.chart-icon {
  @apply w-16 h-16 text-gray-400 mb-4;
}

.chart-text {
  @apply text-gray-600 mb-6;
}

.chart-data {
  @apply space-y-2 w-full max-w-xs;
}

.data-item {
  @apply flex justify-between items-center text-sm;
}

.data-label {
  @apply text-gray-600;
}

.data-value {
  @apply font-medium text-gray-900;
}

.reports-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.report-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.report-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.report-title {
  @apply text-lg font-semibold text-gray-900;
}

.report-action-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg;
}

.report-content {
  @apply p-6;
}

.report-list {
  @apply space-y-4;
}

.report-item {
  @apply flex items-center justify-between p-4 bg-gray-50 rounded-lg;
}

.item-info {
  @apply flex-1;
}

.item-title {
  @apply text-sm font-medium text-gray-900;
}

.item-subtitle {
  @apply text-xs text-gray-600 mt-1;
}

.item-stats {
  @apply flex flex-col items-end;
}

.item-value {
  @apply text-sm font-semibold text-gray-900;
}

.item-label {
  @apply text-xs text-gray-600;
}

.analytics-grid {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-4;
}

.analytics-item {
  @apply flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg;
}

.analytics-icon {
  @apply w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center;
}

.analytics-icon .icon {
  @apply w-5 h-5 text-purple-600;
}

.analytics-content {
  @apply flex-1;
}

.analytics-value {
  @apply text-lg font-bold text-gray-900;
}

.analytics-label {
  @apply text-xs text-gray-600;
}

.performance-metrics {
  @apply space-y-4;
}

.metric-item {
  @apply space-y-2;
}

.metric-header {
  @apply flex items-center justify-between;
}

.metric-name {
  @apply text-sm font-medium text-gray-700;
}

.metric-percentage {
  @apply text-sm font-semibold text-gray-900;
}

.metric-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.metric-fill {
  @apply h-full bg-purple-600 rounded-full transition-all duration-300;
}

.metric-fill.cancel {
  @apply bg-red-500;
}
</style>
