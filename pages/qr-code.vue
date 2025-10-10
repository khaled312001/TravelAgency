<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          QR Code الموقع
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          QR Code مخصص بتصميم رائع يحتوي على شعار الموقع - يمكنك مسحه للوصول مباشرة إلى موقعنا
        </p>
      </div>

      <!-- QR Code Generator -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Controls -->
          <div class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">تخصيص QR Code</h2>
            
            <!-- Website URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                رابط الموقع
              </label>
              <input
                v-model="websiteUrl"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://www.worldtripagency.com"
              />
            </div>

            <!-- Size -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                حجم QR Code
              </label>
              <select
                v-model="qrSize"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="200">صغير (200px)</option>
                <option value="300">متوسط (300px)</option>
                <option value="400">كبير (400px)</option>
                <option value="500">كبير جداً (500px)</option>
              </select>
            </div>

            <!-- Colors -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  لون المقدمة
                </label>
                <input
                  v-model="foregroundColor"
                  type="color"
                  class="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div class="mt-2 flex gap-2">
                  <button
                    @click="foregroundColor = '#8b5cf6'"
                    class="w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow-md"
                    title="بنفسجي"
                  ></button>
                  <button
                    @click="foregroundColor = '#3b82f6'"
                    class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md"
                    title="أزرق"
                  ></button>
                  <button
                    @click="foregroundColor = '#059669'"
                    class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-md"
                    title="أخضر"
                  ></button>
                  <button
                    @click="foregroundColor = '#dc2626'"
                    class="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-md"
                    title="أحمر"
                  ></button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  لون الخلفية
                </label>
                <input
                  v-model="backgroundColor"
                  type="color"
                  class="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div class="mt-2 flex gap-2">
                  <button
                    @click="backgroundColor = '#ffffff'"
                    class="w-6 h-6 rounded-full bg-white border-2 border-gray-300 shadow-md"
                    title="أبيض"
                  ></button>
                  <button
                    @click="backgroundColor = '#f8fafc'"
                    class="w-6 h-6 rounded-full bg-slate-50 border-2 border-gray-300 shadow-md"
                    title="رمادي فاتح"
                  ></button>
                  <button
                    @click="backgroundColor = '#fef3c7'"
                    class="w-6 h-6 rounded-full bg-yellow-100 border-2 border-gray-300 shadow-md"
                    title="أصفر فاتح"
                  ></button>
                  <button
                    @click="backgroundColor = '#dbeafe'"
                    class="w-6 h-6 rounded-full bg-blue-100 border-2 border-gray-300 shadow-md"
                    title="أزرق فاتح"
                  ></button>
                </div>
              </div>
            </div>

            <!-- Logo Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                حجم الشعار
              </label>
              <select
                v-model="logoSize"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="0.1">صغير (10%)</option>
                <option value="0.15">متوسط (15%)</option>
                <option value="0.2">كبير (20%)</option>
                <option value="0.25">كبير جداً (25%)</option>
              </select>
            </div>

            <!-- Quick Templates -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                قوالب سريعة
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="applyTemplate('classic')"
                  class="p-3 border border-gray-300 rounded-lg hover:border-purple-500 transition-colors duration-300 text-sm"
                >
                  <div class="w-4 h-4 bg-purple-600 rounded mx-auto mb-1"></div>
                  كلاسيكي
                </button>
                <button
                  @click="applyTemplate('modern')"
                  class="p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-300 text-sm"
                >
                  <div class="w-4 h-4 bg-blue-600 rounded mx-auto mb-1"></div>
                  عصري
                </button>
                <button
                  @click="applyTemplate('elegant')"
                  class="p-3 border border-gray-300 rounded-lg hover:border-emerald-500 transition-colors duration-300 text-sm"
                >
                  <div class="w-4 h-4 bg-emerald-600 rounded mx-auto mb-1"></div>
                  أنيق
                </button>
                <button
                  @click="applyTemplate('vibrant')"
                  class="p-3 border border-gray-300 rounded-lg hover:border-red-500 transition-colors duration-300 text-sm"
                >
                  <div class="w-4 h-4 bg-red-600 rounded mx-auto mb-1"></div>
                  نابض بالحياة
                </button>
              </div>
            </div>

            <!-- Generate Button -->
            <button
              @click="generateQRCode"
              class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              إنشاء QR Code
            </button>
          </div>

          <!-- QR Code Display -->
          <div class="flex flex-col items-center justify-center">
            <div class="bg-white p-6 rounded-xl shadow-lg mb-6">
              <div ref="qrCodeContainer" class="flex items-center justify-center">
                <!-- QR Code will be generated here -->
                <div v-if="!qrCodeGenerated" class="text-center text-gray-500">
                  <Icon name="lucide:qr-code" class="w-24 h-24 mx-auto mb-4 text-gray-300" />
                  <p>اضغط على "إنشاء QR Code" لعرض النتيجة</p>
                </div>
              </div>
            </div>

            <!-- Download Options -->
            <div v-if="qrCodeGenerated" class="flex gap-4">
              <button
                @click="downloadQRCode('png')"
                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Icon name="lucide:download" class="w-4 h-4" />
                تحميل PNG
              </button>
              <button
                @click="downloadQRCode('svg')"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Icon name="lucide:download" class="w-4 h-4" />
                تحميل SVG
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg text-center">
          <Icon name="lucide:smartphone" class="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-800 mb-2">سهل المسح</h3>
          <p class="text-gray-600">يمكن مسحه بسهولة من أي هاتف ذكي</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg text-center">
          <Icon name="lucide:palette" class="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-800 mb-2">تصميم مخصص</h3>
          <p class="text-gray-600">ألوان وتصميم يناسب هوية الموقع</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg text-center">
          <Icon name="lucide:image" class="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-800 mb-2">شعار مدمج</h3>
          <p class="text-gray-600">يحتوي على شعار الموقع في المنتصف</p>
        </div>
      </div>

      <!-- Usage Instructions -->
      <div class="bg-white rounded-xl p-8 shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">كيفية الاستخدام</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">للموظفين:</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>طباعة QR Code على البطاقات الشخصية</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>إضافته إلى المطبوعات التسويقية</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>مشاركته على وسائل التواصل الاجتماعي</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">للعملاء:</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start gap-2">
                <Icon name="lucide:smartphone" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>فتح تطبيق الكاميرا في الهاتف</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:scan" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>توجيه الكاميرا نحو QR Code</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:external-link" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>الضغط على الرابط للوصول للموقع</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode'

// Meta tags
useHead({
  title: 'QR Code الموقع - أرض العجائب للسفر',
  meta: [
    { name: 'description', content: 'إنشاء QR Code مخصص لموقع أرض العجائب للسفر مع شعار الموقع وتصميم احترافي' }
  ]
})

// Reactive data
const websiteUrl = ref('https://www.worldtripagency.com')
const qrSize = ref(400)
const foregroundColor = ref('#8b5cf6')
const backgroundColor = ref('#ffffff')
const logoSize = ref(0.2)
const qrCodeGenerated = ref(false)
const qrCodeContainer = ref(null)

// Generate QR Code
const generateQRCode = async () => {
  try {
    // Clear previous QR code
    if (qrCodeContainer.value) {
      qrCodeContainer.value.innerHTML = ''
    }

    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Set canvas size with padding for border
    const padding = 20
    canvas.width = parseInt(qrSize.value) + (padding * 2)
    canvas.height = parseInt(qrSize.value) + (padding * 2)

    // Draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#f8fafc')
    gradient.addColorStop(1, '#e2e8f0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw QR code
    const qrCanvas = document.createElement('canvas')
    qrCanvas.width = parseInt(qrSize.value)
    qrCanvas.height = parseInt(qrSize.value)

    await QRCode.toCanvas(qrCanvas, websiteUrl.value, {
      width: parseInt(qrSize.value),
      margin: 2,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value
      },
      errorCorrectionLevel: 'H' // High error correction for logo overlay
    })

    // Draw QR code on main canvas
    ctx.drawImage(qrCanvas, padding, padding)

    // Add logo overlay
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.onload = () => {
      const logoSizePx = parseInt(qrSize.value) * parseFloat(logoSize.value)
      const logoX = padding + (parseInt(qrSize.value) - logoSizePx) / 2
      const logoY = padding + (parseInt(qrSize.value) - logoSizePx) / 2

      // Draw circular background for logo
      ctx.save()
      ctx.beginPath()
      ctx.arc(logoX + logoSizePx/2, logoY + logoSizePx/2, logoSizePx/2 + 8, 0, 2 * Math.PI)
      ctx.fillStyle = backgroundColor.value
      ctx.fill()
      ctx.strokeStyle = foregroundColor.value
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()

      // Draw logo
      ctx.drawImage(logo, logoX, logoY, logoSizePx, logoSizePx)

      // Add decorative border
      ctx.save()
      ctx.strokeStyle = foregroundColor.value
      ctx.lineWidth = 4
      ctx.strokeRect(padding - 2, padding - 2, parseInt(qrSize.value) + 4, parseInt(qrSize.value) + 4)
      ctx.restore()

      // Add to container
      if (qrCodeContainer.value) {
        qrCodeContainer.value.appendChild(canvas)
        qrCodeGenerated.value = true
      }
    }
    
    logo.src = '/images/home/logo/WonderlandLogo.svg'
    
  } catch (error) {
    console.error('Error generating QR code:', error)
    alert('حدث خطأ في إنشاء QR Code. يرجى المحاولة مرة أخرى.')
  }
}

// Download QR Code
const downloadQRCode = (format) => {
  const canvas = qrCodeContainer.value?.querySelector('canvas')
  if (!canvas) return

  const link = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 10)
  link.download = `worldtripagency-qrcode-${timestamp}.${format}`
  
  if (format === 'png') {
    link.href = canvas.toDataURL('image/png', 1.0)
  } else if (format === 'svg') {
    // Create SVG version
    const svgString = createSVGFromCanvas(canvas)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    link.href = URL.createObjectURL(blob)
  }
  
  link.click()
  
  // Clean up object URL for SVG
  if (format === 'svg') {
    setTimeout(() => URL.revokeObjectURL(link.href), 100)
  }
}

// Create SVG from canvas
const createSVGFromCanvas = (canvas) => {
  const dataURL = canvas.toDataURL('image/png')
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
      <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}"/>
    </svg>
  `
}

// Apply template
const applyTemplate = (template) => {
  switch (template) {
    case 'classic':
      foregroundColor.value = '#8b5cf6'
      backgroundColor.value = '#ffffff'
      qrSize.value = 400
      logoSize.value = 0.2
      break
    case 'modern':
      foregroundColor.value = '#3b82f6'
      backgroundColor.value = '#f8fafc'
      qrSize.value = 400
      logoSize.value = 0.18
      break
    case 'elegant':
      foregroundColor.value = '#059669'
      backgroundColor.value = '#fef3c7'
      qrSize.value = 400
      logoSize.value = 0.22
      break
    case 'vibrant':
      foregroundColor.value = '#dc2626'
      backgroundColor.value = '#dbeafe'
      qrSize.value = 400
      logoSize.value = 0.2
      break
  }
  generateQRCode()
}

// Generate QR code on mount
onMounted(() => {
  generateQRCode()
})
</script>

<style scoped>
/* Custom styles for better RTL support */
.container {
  direction: rtl;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #f3e8ff 0%, #dbeafe 50%, #e0e7ff 100%);
}

/* Enhanced shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Hover effects */
button:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #8b5cf6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}
</style>
