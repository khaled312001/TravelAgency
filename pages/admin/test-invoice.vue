<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">اختبار نظام الفواتير</h1>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">بيانات الحجز التجريبية</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">اسم العميل</label>
            <input v-model="testBooking.customer_name" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input v-model="testBooking.customer_email" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">رقم الهاتف</label>
            <input v-model="testBooking.customer_phone" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">عنوان الباقة</label>
            <input v-model="testBooking.package_title" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">الوجهة</label>
            <input v-model="testBooking.destination" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">عدد المشاركين</label>
            <input v-model.number="testBooking.participants_count" type="number" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">المبلغ الإجمالي</label>
            <input v-model.number="testBooking.total_amount" type="number" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">المبلغ المدفوع</label>
            <input v-model.number="testBooking.paid_amount" type="number" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
        </div>
        
        <div class="mt-6 flex gap-4">
          <button @click="generateTestInvoice" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            إنشاء فاتورة تجريبية
          </button>
          <button @click="downloadTestPDF" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            تحميل PDF
          </button>
        </div>
      </div>
      
      <!-- Invoice Modal -->
      <div v-if="showInvoiceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold">فاتورة الحجز</h2>
              <button @click="showInvoiceModal = false" class="text-gray-500 hover:text-gray-700">
                <Icon name="lucide:x" class="w-6 h-6" />
              </button>
            </div>
            
            <div class="mb-4">
              <button @click="downloadTestPDF" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <Icon name="lucide:download" class="w-4 h-4 inline mr-2" />
                تحميل PDF
              </button>
            </div>
            
            <InvoiceTemplate 
              :invoice-data="currentInvoiceData" 
              :show="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TestBooking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  package_title: string
  destination: string
  participants_count: number
  total_amount: number
  paid_amount: number
  travel_date: string
  status: string
  notes: string
}

const showInvoiceModal = ref(false)
const currentInvoiceData = ref(null)

const testBooking = ref<TestBooking>({
  id: 'test-booking-001',
  customer_name: 'أحمد محمد',
  customer_email: 'ahmed@example.com',
  customer_phone: '+966501234567',
  package_title: 'رحلة إلى دبي',
  destination: 'دبي، الإمارات العربية المتحدة',
  participants_count: 2,
  total_amount: 5000,
  paid_amount: 2000,
  travel_date: '2024-02-15',
  status: 'pending',
  notes: 'رحلة عائلية ممتعة'
})

const generateTestInvoice = async () => {
  try {
    const invoiceData = {
      invoiceNumber: `INV-${testBooking.value.id.slice(-8).toUpperCase()}`,
      issueDate: new Date().toLocaleDateString('ar-SA'),
      travelDate: new Date(testBooking.value.travel_date).toLocaleDateString('ar-SA'),
      customerName: testBooking.value.customer_name,
      customerEmail: testBooking.value.customer_email,
      customerPhone: testBooking.value.customer_phone,
      packageTitle: testBooking.value.package_title,
      destination: testBooking.value.destination,
      packageDescription: `باقة سفر إلى ${testBooking.value.destination} تشمل الإقامة والوجبات والجولات السياحية`,
      participantsCount: testBooking.value.participants_count,
      unitPrice: testBooking.value.total_amount / testBooking.value.participants_count,
      subtotal: testBooking.value.total_amount,
      discount: 0,
      tax: testBooking.value.total_amount * 0.15,
      taxRate: 15,
      totalAmount: testBooking.value.total_amount * 1.15,
      paidAmount: testBooking.value.paid_amount,
      remainingAmount: (testBooking.value.total_amount * 1.15) - testBooking.value.paid_amount,
      paymentStatus: testBooking.value.status,
      paymentDueDate: 7,
      notes: testBooking.value.notes
    }
    
    currentInvoiceData.value = invoiceData
    showInvoiceModal.value = true
    
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Test invoice generated successfully')
    
  } catch (error) {
    console.error('Error generating test invoice:', error)
    alert('حدث خطأ أثناء إنشاء الفاتورة التجريبية')
  }
}

const downloadTestPDF = async () => {
  try {
    if (!currentInvoiceData.value) {
      alert('لا توجد بيانات فاتورة للتحميل')
      return
    }

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const html2pdf = (await import('html2pdf.js')).default
    
    const element = document.querySelector('#invoice-content')
    
    if (!element) {
      const altElement = document.querySelector('.invoice-template') || 
                       document.querySelector('.invoice-container')
      
      if (!altElement) {
        throw new Error('لم يتم العثور على محتوى الفاتورة')
      }
      
      const opt = {
        margin: 0.5,
        filename: `فاتورة-${currentInvoiceData.value.invoiceNumber || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 800,
          height: 1000
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      await html2pdf().set(opt).from(altElement).save()
      return
    }
    
    element.style.display = 'block'
    element.style.visibility = 'visible'
    element.style.position = 'static'
    element.style.width = '100%'
    element.style.height = 'auto'
    
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '800px'
    tempContainer.style.backgroundColor = '#ffffff'
    tempContainer.innerHTML = element.innerHTML
    
    document.body.appendChild(tempContainer)
    
    try {
      const opt = {
        margin: 0.5,
        filename: `فاتورة-${currentInvoiceData.value.invoiceNumber || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 800,
          height: 1000
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      await html2pdf().set(opt).from(tempContainer).save()
      
    } finally {
      document.body.removeChild(tempContainer)
    }
    
    showInvoiceModal.value = false
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('حدث خطأ أثناء إنشاء ملف PDF: ' + error.message)
  }
}
</script>
