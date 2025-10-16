<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">اختبار نظام PDF</h1>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">اختبار تحميل PDF</h2>
        
        <div class="mb-4">
          <button @click="testPDFGeneration" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-4">
            اختبار تحميل PDF
          </button>
          <button @click="testPrint" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            اختبار الطباعة
          </button>
        </div>
        
        <div v-if="testData" class="mt-4 p-4 bg-gray-50 rounded">
          <h3 class="font-semibold mb-2">بيانات الاختبار:</h3>
          <pre class="text-sm">{{ JSON.stringify(testData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const testData = ref(null)

const testPDFGeneration = async () => {
  try {
    // Create test invoice data
    const invoiceData = {
      invoiceNumber: 'INV-TEST-001',
      issueDate: new Date().toLocaleDateString('ar-SA'),
      travelDate: new Date().toLocaleDateString('ar-SA'),
      customerName: 'أحمد محمد',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+966501234567',
      packageTitle: 'رحلة إلى دبي',
      destination: 'دبي، الإمارات العربية المتحدة',
      packageDescription: 'باقة سفر إلى دبي تشمل الإقامة والوجبات والجولات السياحية',
      participantsCount: 2,
      unitPrice: 2500,
      subtotal: 5000,
      discount: 0,
      tax: 750,
      taxRate: 15,
      totalAmount: 5750,
      paidAmount: 2000,
      remainingAmount: 3750,
      paymentStatus: 'pending',
      paymentDueDate: 7,
      notes: 'رحلة عائلية ممتعة'
    }
    
    testData.value = invoiceData
    
    // Wait for DOM to be ready
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const html2pdf = (await import('html2pdf.js')).default
    
    // Create HTML content directly
    const invoiceHTML = createTestInvoiceHTML(invoiceData)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = invoiceHTML
    
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '800px'
    tempContainer.style.height = 'auto'
    tempContainer.style.backgroundColor = '#ffffff'
    tempContainer.style.visibility = 'visible'
    tempContainer.style.display = 'block'
    tempContainer.style.overflow = 'visible'
    tempContainer.innerHTML = invoiceHTML
    
    // Add CSS
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; }
      body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right; }
    `
    tempContainer.appendChild(style)
    
    document.body.appendChild(tempContainer)
    
    try {
      const opt = {
        margin: 0.5,
        filename: `فاتورة-${invoiceData.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: true,
          width: 800,
          height: 1200,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 800,
          windowHeight: 1200
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: false,
          precision: 2
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      console.log('Generating PDF with options:', opt)
      await html2pdf().set(opt).from(tempContainer).save()
      console.log('PDF generated successfully')
      
    } finally {
      // Clean up
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer)
      }
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('حدث خطأ أثناء إنشاء ملف PDF: ' + error.message)
  }
}

const testPrint = () => {
  try {
    const invoiceData = {
      invoiceNumber: 'INV-TEST-001',
      issueDate: new Date().toLocaleDateString('ar-SA'),
      travelDate: new Date().toLocaleDateString('ar-SA'),
      customerName: 'أحمد محمد',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+966501234567',
      packageTitle: 'رحلة إلى دبي',
      destination: 'دبي، الإمارات العربية المتحدة',
      packageDescription: 'باقة سفر إلى دبي تشمل الإقامة والوجبات والجولات السياحية',
      participantsCount: 2,
      unitPrice: 2500,
      subtotal: 5000,
      discount: 0,
      tax: 750,
      taxRate: 15,
      totalAmount: 5750,
      paidAmount: 2000,
      remainingAmount: 3750,
      paymentStatus: 'pending',
      paymentDueDate: 7,
      notes: 'رحلة عائلية ممتعة'
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة للطباعة')
      return
    }

    const invoiceHTML = createTestInvoiceHTML(invoiceData)
    
    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
    
  } catch (error) {
    console.error('Error printing:', error)
    alert('حدث خطأ أثناء الطباعة')
  }
}

const createTestInvoiceHTML = (invoiceData: any) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة الحجز</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Cairo', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          background: white;
          color: #333;
          line-height: 1.6;
        }
        .invoice-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #8b5cf6;
        }
        .company-info h1 {
          font-size: 28px;
          font-weight: 700;
          color: #8b5cf6;
          margin: 0 0 5px 0;
        }
        .company-info p {
          font-size: 14px;
          color: #666;
          margin: 0 0 15px 0;
        }
        .contact-info p {
          margin: 5px 0;
          font-size: 12px;
          color: #555;
        }
        .invoice-info {
          text-align: left;
          min-width: 200px;
        }
        .invoice-info h2 {
          font-size: 24px;
          font-weight: 700;
          color: #8b5cf6;
          margin: 0 0 15px 0;
        }
        .invoice-info p {
          margin: 5px 0;
          font-size: 14px;
          color: #555;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #8b5cf6;
          margin: 0 0 15px 0;
        }
        .customer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          font-size: 14px;
        }
        .pricing-table {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .pricing-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          padding: 15px;
          border-bottom: 1px solid #ddd;
        }
        .pricing-row:last-child {
          border-bottom: none;
        }
        .pricing-header {
          background: #f8f9fa;
          font-weight: 600;
        }
        .pricing-total {
          background: #f8f9fa;
          font-weight: 600;
        }
        .pricing-remaining {
          background: #e8f5e8;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #8b5cf6;
        }
        .footer p {
          margin: 0 0 10px 0;
        }
        .footer .thank-you {
          font-size: 16px;
          font-weight: 600;
          color: #8b5cf6;
        }
        .footer .note {
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="company-info">
            <h1>أرض العجائب للسفر</h1>
            <p>وكالة سفر متخصصة في تنظيم الرحلات السياحية</p>
            <div class="contact-info">
              <p><strong>العنوان:</strong> مكة المكرمة - شارع الستين</p>
              <p><strong>الهاتف:</strong> +966500982394</p>
              <p><strong>البريد الإلكتروني:</strong> info@worldtripagency.com</p>
            </div>
          </div>
          <div class="invoice-info">
            <h2>فاتورة</h2>
            <p><strong>رقم الفاتورة:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>تاريخ الإصدار:</strong> ${invoiceData.issueDate}</p>
            <p><strong>تاريخ السفر:</strong> ${invoiceData.travelDate}</p>
            <p><strong>حالة الدفع:</strong> ${invoiceData.paymentStatus}</p>
          </div>
        </div>
        
        <div class="section">
          <h3>معلومات العميل</h3>
          <div class="customer-grid">
            <div><strong>الاسم:</strong> ${invoiceData.customerName}</div>
            <div><strong>البريد الإلكتروني:</strong> ${invoiceData.customerEmail}</div>
            <div><strong>رقم الهاتف:</strong> ${invoiceData.customerPhone}</div>
          </div>
        </div>
        
        <div class="section">
          <h3>تفاصيل الباقة</h3>
          <div style="font-size: 14px;">
            <p><strong>عنوان الباقة:</strong> ${invoiceData.packageTitle}</p>
            <p><strong>الوجهة:</strong> ${invoiceData.destination}</p>
            <p><strong>الوصف:</strong> ${invoiceData.packageDescription}</p>
          </div>
        </div>
        
        <div class="section">
          <h3>تفاصيل التسعير</h3>
          <div class="pricing-table">
            <div class="pricing-row pricing-header">
              <div>الوصف</div>
              <div>الكمية</div>
              <div>سعر الوحدة</div>
              <div>المجموع</div>
            </div>
            <div class="pricing-row">
              <div>${invoiceData.packageTitle}</div>
              <div>${invoiceData.participantsCount}</div>
              <div>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.unitPrice)}</div>
              <div>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.subtotal)}</div>
            </div>
            <div class="pricing-row pricing-total">
              <div><strong>المجموع الفرعي</strong></div>
              <div>-</div>
              <div>-</div>
              <div><strong>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.subtotal)}</strong></div>
            </div>
            <div class="pricing-row">
              <div>ضريبة القيمة المضافة (${invoiceData.taxRate}%)</div>
              <div>-</div>
              <div>-</div>
              <div>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.tax)}</div>
            </div>
            <div class="pricing-row pricing-total">
              <div><strong>المجموع الإجمالي</strong></div>
              <div>-</div>
              <div>-</div>
              <div><strong>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.totalAmount)}</strong></div>
            </div>
            <div class="pricing-row">
              <div><strong>المبلغ المدفوع</strong></div>
              <div>-</div>
              <div>-</div>
              <div><strong>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.paidAmount)}</strong></div>
            </div>
            <div class="pricing-row pricing-remaining">
              <div><strong>المبلغ المتبقي</strong></div>
              <div>-</div>
              <div>-</div>
              <div><strong>${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(invoiceData.remainingAmount)}</strong></div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p class="thank-you">شكراً لاختياركم أرض العجائب للسفر</p>
          <p class="note">نتمنى لكم رحلة سعيدة وممتعة</p>
        </div>
      </div>
    </body>
    </html>
  `
}
</script>
