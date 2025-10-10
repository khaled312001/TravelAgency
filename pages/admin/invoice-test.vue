<template>
  <div class="invoice-test-page">
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">اختبار نظام الفواتير</h1>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">بيانات تجريبية للفاتورة</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">اسم العميل</label>
            <input v-model="testData.customerName" type="text" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input v-model="testData.customerEmail" type="email" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">رقم الهاتف</label>
            <input v-model="testData.customerPhone" type="text" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">عنوان الباقة</label>
            <input v-model="testData.packageTitle" type="text" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">الوجهة</label>
            <input v-model="testData.destination" type="text" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">عدد المشاركين</label>
            <input v-model.number="testData.participantsCount" type="number" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">المبلغ الإجمالي</label>
            <input v-model.number="testData.totalAmount" type="number" class="w-full p-3 border rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">المبلغ المدفوع</label>
            <input v-model.number="testData.paidAmount" type="number" class="w-full p-3 border rounded-lg" />
          </div>
        </div>
        
        <div class="mt-6">
          <button @click="generateTestInvoice" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            إنشاء فاتورة تجريبية
          </button>
        </div>
      </div>
      
      <!-- Invoice Preview -->
      <div v-if="showInvoice" class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">معاينة الفاتورة</h2>
          <button @click="downloadTestInvoice" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            تحميل PDF
          </button>
        </div>
        
        <InvoiceTemplate 
          :invoice-data="invoiceData" 
          :show="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

// Test data
const testData = ref({
  customerName: 'أحمد محمد العلي',
  customerEmail: 'ahmed@example.com',
  customerPhone: '+966501234567',
  packageTitle: 'باقة دبي الذهبية',
  destination: 'دبي، الإمارات العربية المتحدة',
  participantsCount: 2,
  totalAmount: 5000,
  paidAmount: 2000
})

const showInvoice = ref(false)
const invoiceData = ref<any>(null)

// Generate test invoice
const generateTestInvoice = () => {
  invoiceData.value = {
    invoiceNumber: `INV-${Date.now().toString().slice(-8).toUpperCase()}`,
    issueDate: new Date().toLocaleDateString('ar-SA'),
    travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA'),
    customerName: testData.value.customerName,
    customerEmail: testData.value.customerEmail,
    customerPhone: testData.value.customerPhone,
    packageTitle: testData.value.packageTitle,
    destination: testData.value.destination,
    packageDescription: `باقة سفر إلى ${testData.value.destination} تشمل الإقامة والوجبات والجولات السياحية`,
    participantsCount: testData.value.participantsCount,
    unitPrice: testData.value.totalAmount / testData.value.participantsCount,
    subtotal: testData.value.totalAmount,
    discount: 0,
    tax: testData.value.totalAmount * 0.15,
    taxRate: 15,
    totalAmount: testData.value.totalAmount * 1.15,
    paidAmount: testData.value.paidAmount,
    remainingAmount: (testData.value.totalAmount * 1.15) - testData.value.paidAmount,
    paymentStatus: testData.value.paidAmount >= testData.value.totalAmount * 1.15 ? 'paid' : 'partial',
    paymentDueDate: 7,
    notes: 'يرجى إحضار جواز السفر صالح لمدة 6 أشهر على الأقل'
  }
  
  showInvoice.value = true
}

// Download test invoice
const downloadTestInvoice = async () => {
  try {
    // Wait for DOM to be ready
    await nextTick()
    
    const html2pdf = (await import('html2pdf.js')).default
    
    // Wait a bit more to ensure the invoice template is rendered
    setTimeout(async () => {
      const element = document.getElementById('invoice-content')
      if (!element) {
        alert('لم يتم العثور على محتوى الفاتورة. يرجى المحاولة مرة أخرى.')
        return
      }
      
      const opt = {
        margin: 0.5,
        filename: `فاتورة-تجريبية-${invoiceData.value?.invoiceNumber || 'test'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      await html2pdf().set(opt).from(element).save()
    }, 500) // Wait 500ms for rendering
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('حدث خطأ أثناء إنشاء ملف PDF')
  }
}

// Set page title
useHead({
  title: 'اختبار نظام الفواتير - لوحة التحكم'
})
</script>

<style scoped>
.invoice-test-page {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
