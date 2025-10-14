<template>
  <div ref="invoiceContainer" class="invoice-container" :style="{ display: show ? 'block' : 'none' }">
    <!-- Invoice HTML Template -->
    <div class="invoice-template" id="invoice-content" :style="{ display: show ? 'block' : 'none' }">
      <!-- Header -->
      <div class="invoice-header">
        <div class="company-info">
          <div class="logo-section">
            <img 
              :src="companyLogo" 
              alt="شعار الشركة" 
              class="company-logo"
            />
          </div>
          <div class="company-details">
            <h1 class="company-name">{{ companyName }}</h1>
            <p class="company-tagline">{{ companyTagline }}</p>
            <div class="contact-info">
              <p><strong>العنوان:</strong> {{ companyAddress }}</p>
              <p><strong>الهاتف:</strong> {{ companyPhone }}</p>
              <p><strong>البريد الإلكتروني:</strong> {{ companyEmail }}</p>
            </div>
          </div>
        </div>
        
        <div class="invoice-info">
          <h2 class="invoice-title">فاتورة</h2>
          <div class="invoice-details">
            <p><strong>رقم الفاتورة:</strong> {{ invoiceNumber }}</p>
            <p><strong>تاريخ الإصدار:</strong> {{ issueDate }}</p>
            <p><strong>تاريخ السفر:</strong> {{ travelDate }}</p>
            <p><strong>حالة الدفع:</strong> 
              <span :class="paymentStatusClass">{{ paymentStatusText }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="customer-section">
        <h3 class="section-title">معلومات العميل</h3>
        <div class="customer-info">
          <div class="info-row">
            <div class="info-item">
              <strong>الاسم:</strong> {{ customerName }}
            </div>
            <div class="info-item">
              <strong>البريد الإلكتروني:</strong> {{ customerEmail }}
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <strong>رقم الهاتف:</strong> {{ customerPhone }}
            </div>
            <div class="info-item">
              <strong>عدد المشاركين:</strong> {{ participantsCount }} شخص
            </div>
          </div>
        </div>
      </div>

      <!-- Package Details -->
      <div class="package-section">
        <h3 class="section-title">تفاصيل الباقة</h3>
        <div class="package-details">
          <div class="package-info">
            <h4 class="package-title">{{ packageTitle }}</h4>
            <p class="package-destination"><strong>الوجهة:</strong> {{ destination }}</p>
            <p class="package-description">{{ packageDescription }}</p>
          </div>
        </div>
      </div>

      <!-- Pricing Details -->
      <div class="pricing-section">
        <h3 class="section-title">تفاصيل التسعير</h3>
        <div class="pricing-table">
          <div class="pricing-row header">
            <div class="pricing-cell">الوصف</div>
            <div class="pricing-cell">الكمية</div>
            <div class="pricing-cell">السعر</div>
            <div class="pricing-cell">المجموع</div>
          </div>
          
          <div class="pricing-row">
            <div class="pricing-cell">{{ packageTitle }}</div>
            <div class="pricing-cell">{{ participantsCount }} شخص</div>
            <div class="pricing-cell">{{ formatCurrency(unitPrice) }}</div>
            <div class="pricing-cell">{{ formatCurrency(subtotal) }}</div>
          </div>
          
          <div v-if="discount > 0" class="pricing-row">
            <div class="pricing-cell">خصم</div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell">-{{ formatCurrency(discount) }}</div>
            <div class="pricing-cell">-{{ formatCurrency(discount) }}</div>
          </div>
          
          <div v-if="tax > 0" class="pricing-row">
            <div class="pricing-cell">ضريبة القيمة المضافة ({{ taxRate }}%)</div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell">{{ formatCurrency(tax) }}</div>
          </div>
          
          <div class="pricing-row total">
            <div class="pricing-cell"><strong>المجموع الكلي</strong></div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell"><strong>{{ formatCurrency(totalAmount) }}</strong></div>
          </div>
          
          <div class="pricing-row">
            <div class="pricing-cell"><strong>المبلغ المدفوع</strong></div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell"><strong>{{ formatCurrency(paidAmount) }}</strong></div>
          </div>
          
          <div v-if="remainingAmount > 0" class="pricing-row remaining">
            <div class="pricing-cell"><strong>المبلغ المتبقي</strong></div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell">-</div>
            <div class="pricing-cell"><strong>{{ formatCurrency(remainingAmount) }}</strong></div>
          </div>
        </div>
      </div>

      <!-- Payment Information -->
      <div class="payment-section">
        <h3 class="section-title">معلومات الدفع</h3>
        <div class="payment-info">
          <div class="payment-methods">
            <p><strong>طرق الدفع المقبولة:</strong></p>
            <ul>
              <li>الدفع النقدي</li>
              <li>التحويل البنكي</li>
              <li>البطاقات الائتمانية</li>
              <li>الدفع الإلكتروني</li>
            </ul>
          </div>
          <div class="payment-terms">
            <p><strong>شروط الدفع:</strong></p>
            <p>يرجى تسديد المبلغ المتبقي قبل {{ paymentDueDate }} أيام من تاريخ السفر</p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="notes" class="notes-section">
        <h3 class="section-title">ملاحظات</h3>
        <div class="notes-content">
          <p>{{ notes }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="invoice-footer">
        <div class="footer-content">
          <p class="thank-you">شكراً لاختياركم {{ companyName }}</p>
          <p class="footer-note">نتمنى لكم رحلة سعيدة وممتعة</p>
          <div class="footer-contact">
            <p>للاستفسارات: {{ companyPhone }} | {{ companyEmail }}</p>
          </div>
        </div>
        <div class="footer-logo">
          <img :src="companyLogo" alt="شعار الشركة" class="footer-logo-img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  travelDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  packageTitle: string
  destination: string
  packageDescription: string
  participantsCount: number
  unitPrice: number
  subtotal: number
  discount: number
  tax: number
  taxRate: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: string
  paymentDueDate: number
  notes?: string
}

interface Props {
  invoiceData: InvoiceData
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const invoiceContainer = ref<HTMLElement>()

// Company information
const companyName = 'أرض العجائب للسفر'
const companyTagline = 'وكالة سفر متخصصة في تنظيم الرحلات السياحية'
const companyAddress = 'مكة المكرمة  - شارع الستين '
const companyPhone = '+966500982394'
const companyEmail = 'info@worldtripagency.com'
const companyLogo = '/images/home/logo/WonderlandLogo.svg'

// Computed properties
const paymentStatusText = computed(() => {
  switch (props.invoiceData.paymentStatus) {
    case 'paid':
      return 'مدفوع بالكامل'
    case 'partial':
      return 'مدفوع جزئياً'
    case 'pending':
      return 'في الانتظار'
    case 'overdue':
      return 'متأخر'
    default:
      return 'غير محدد'
  }
})

const paymentStatusClass = computed(() => {
  switch (props.invoiceData.paymentStatus) {
    case 'paid':
      return 'status-paid'
    case 'partial':
      return 'status-partial'
    case 'pending':
      return 'status-pending'
    case 'overdue':
      return 'status-overdue'
    default:
      return 'status-unknown'
  }
})

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2
  }).format(amount)
}

// Expose the container for PDF generation
defineExpose({
  invoiceContainer
})

// Ensure proper mounting
onMounted(() => {
  // Wait for next tick to ensure DOM is ready
  nextTick(() => {
    if (invoiceContainer.value) {
      // Container is ready
    }
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');

.invoice-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 210mm;
  min-height: 297mm;
  background: white;
  font-family: 'Cairo', 'Arial', sans-serif;
  direction: rtl;
  text-align: right;
}

.invoice-template {
  padding: 20mm;
  background: white;
  color: #333;
  line-height: 1.6;
}

/* Header Styles */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #8b5cf6;
}

.company-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.logo-section {
  flex-shrink: 0;
}

.company-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.company-details {
  flex: 1;
}

.company-name {
  font-size: 28px;
  font-weight: 700;
  color: #8b5cf6;
  margin: 0 0 5px 0;
}

.company-tagline {
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

.invoice-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
  text-align: center;
}

.invoice-details p {
  margin: 8px 0;
  font-size: 14px;
}

/* Section Styles */
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #8b5cf6;
  margin: 25px 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.customer-section,
.package-section,
.pricing-section,
.payment-section,
.notes-section {
  margin-bottom: 25px;
}

/* Customer Info */
.customer-info {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-right: 4px solid #8b5cf6;
}

.info-row {
  display: flex;
  gap: 30px;
  margin-bottom: 10px;
}

.info-item {
  flex: 1;
  font-size: 14px;
}

/* Package Details */
.package-details {
  background: #f0f9ff;
  padding: 15px;
  border-radius: 8px;
  border-right: 4px solid #3b82f6;
}

.package-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 10px 0;
}

.package-destination {
  font-size: 14px;
  color: #374151;
  margin: 5px 0;
}

.package-description {
  font-size: 14px;
  color: #6b7280;
  margin: 10px 0 0 0;
}

/* Pricing Table */
.pricing-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.pricing-row {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.pricing-row.header {
  background: #8b5cf6;
  color: white;
  font-weight: 600;
}

.pricing-row.total {
  background: #f3f4f6;
  font-weight: 600;
  border-top: 2px solid #8b5cf6;
}

.pricing-row.remaining {
  background: #fef2f2;
  color: #dc2626;
  font-weight: 600;
}

.pricing-cell {
  flex: 1;
  padding: 12px 8px;
  font-size: 14px;
  text-align: center;
}

.pricing-cell:first-child {
  text-align: right;
  flex: 2;
}

/* Payment Status */
.status-paid {
  color: #059669;
  font-weight: 600;
}

.status-partial {
  color: #d97706;
  font-weight: 600;
}

.status-pending {
  color: #3b82f6;
  font-weight: 600;
}

.status-overdue {
  color: #dc2626;
  font-weight: 600;
}

/* Payment Information */
.payment-info {
  display: flex;
  gap: 30px;
}

.payment-methods,
.payment-terms {
  flex: 1;
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
}

.payment-methods ul {
  margin: 10px 0 0 20px;
  padding: 0;
}

.payment-methods li {
  margin: 5px 0;
  font-size: 14px;
}

/* Notes */
.notes-content {
  background: #fef3c7;
  padding: 15px;
  border-radius: 8px;
  border-right: 4px solid #f59e0b;
}

.notes-content p {
  margin: 0;
  font-size: 14px;
  color: #92400e;
}

/* Footer */
.invoice-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content {
  flex: 1;
}

.thank-you {
  font-size: 18px;
  font-weight: 600;
  color: #8b5cf6;
  margin: 0 0 5px 0;
}

.footer-note {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
}

.footer-contact p {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.footer-logo {
  flex-shrink: 0;
}

.footer-logo-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* Print Styles */
@media print {
  .invoice-container {
    position: static;
    left: auto;
    top: auto;
    width: 100%;
    min-height: auto;
  }
  
  .invoice-template {
    padding: 0;
    box-shadow: none;
  }
  
  .invoice-header {
    page-break-inside: avoid;
  }
  
  .pricing-section {
    page-break-inside: avoid;
  }
  
  .invoice-footer {
    page-break-inside: avoid;
  }
}
</style>
