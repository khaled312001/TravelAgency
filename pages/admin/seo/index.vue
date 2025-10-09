<template>
  <div class="seo-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">إدارة SEO</h1>
          <p class="page-subtitle">تحسين محركات البحث وإعدادات الموقع</p>
        </div>
        <div class="header-right">
          <button @click="saveAllSettings" class="save-btn">
            <Icon name="lucide:save" class="btn-icon" />
            حفظ جميع الإعدادات
          </button>
        </div>
      </div>
    </div>

    <!-- SEO Overview -->
    <div class="overview-section">
      <div class="overview-grid">
        <div class="overview-card">
          <div class="overview-icon">
            <Icon name="lucide:search" class="icon" />
          </div>
          <div class="overview-content">
            <p class="overview-value">{{ seoScore }}</p>
            <p class="overview-label">نقاط SEO</p>
            <div class="overview-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: seoScore + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-icon">
            <Icon name="lucide:trending-up" class="icon" />
          </div>
          <div class="overview-content">
            <p class="overview-value">{{ organicTraffic }}</p>
            <p class="overview-label">الزوار العضويين</p>
            <p class="overview-change positive">+15% من الشهر الماضي</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-icon">
            <Icon name="lucide:target" class="icon" />
          </div>
          <div class="overview-content">
            <p class="overview-value">{{ keywordRankings }}</p>
            <p class="overview-label">كلمات مفتاحية في الصفحة الأولى</p>
            <p class="overview-change positive">+3 كلمات جديدة</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-icon">
            <Icon name="lucide:link" class="icon" />
          </div>
          <div class="overview-content">
            <p class="overview-value">{{ backlinks }}</p>
            <p class="overview-label">الروابط الخلفية</p>
            <p class="overview-change positive">+8 روابط جديدة</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SEO Settings Tabs -->
    <div class="tabs-section">
      <div class="tabs-container">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="tab-button"
            :class="{ 'active': activeTab === tab.id }"
          >
            <Icon :name="tab.icon" class="tab-icon" />
            {{ tab.name }}
          </button>
        </div>

        <div class="tabs-content">
          <!-- General SEO Settings -->
          <div v-if="activeTab === 'general'" class="tab-panel">
            <div class="settings-grid">
              <div class="setting-card">
                <h3 class="setting-title">إعدادات الموقع العامة</h3>
                <div class="setting-fields">
                  <div class="field-group">
                    <label class="field-label">عنوان الموقع</label>
                    <input 
                      v-model="seoSettings.siteTitle" 
                      type="text" 
                      class="field-input"
                      placeholder="عنوان الموقع"
                    />
                  </div>
                  
                  <div class="field-group">
                    <label class="field-label">وصف الموقع</label>
                    <textarea 
                      v-model="seoSettings.siteDescription" 
                      class="field-textarea"
                      placeholder="وصف الموقع"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div class="field-group">
                    <label class="field-label">الكلمات المفتاحية</label>
                    <input 
                      v-model="seoSettings.keywords" 
                      type="text" 
                      class="field-input"
                      placeholder="كلمات مفتاحية مفصولة بفواصل"
                    />
                  </div>
                  
                  <div class="field-group">
                    <label class="field-label">لغة الموقع</label>
                    <select v-model="seoSettings.language" class="field-select">
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="setting-card">
                <h3 class="setting-title">إعدادات Open Graph</h3>
                <div class="setting-fields">
                  <div class="field-group">
                    <label class="field-label">عنوان Open Graph</label>
                    <input 
                      v-model="seoSettings.ogTitle" 
                      type="text" 
                      class="field-input"
                      placeholder="عنوان Open Graph"
                    />
                  </div>
                  
                  <div class="field-group">
                    <label class="field-label">وصف Open Graph</label>
                    <textarea 
                      v-model="seoSettings.ogDescription" 
                      class="field-textarea"
                      placeholder="وصف Open Graph"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div class="field-group">
                    <label class="field-label">صورة Open Graph</label>
                    <input 
                      v-model="seoSettings.ogImage" 
                      type="url" 
                      class="field-input"
                      placeholder="رابط صورة Open Graph"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Meta Tags -->
          <div v-if="activeTab === 'meta'" class="tab-panel">
            <div class="meta-tags-section">
              <div class="meta-header">
                <h3 class="meta-title">إدارة Meta Tags</h3>
                <button @click="addMetaTag" class="add-meta-btn">
                  <Icon name="lucide:plus" class="btn-icon" />
                  إضافة Meta Tag
                </button>
              </div>
              
              <div class="meta-tags-list">
                <div v-for="(tag, index) in metaTags" :key="index" class="meta-tag-item">
                  <div class="meta-tag-content">
                    <div class="meta-tag-field">
                      <label class="meta-label">الاسم</label>
                      <input 
                        v-model="tag.name" 
                        type="text" 
                        class="meta-input"
                        placeholder="اسم الـ meta tag"
                      />
                    </div>
                    <div class="meta-tag-field">
                      <label class="meta-label">المحتوى</label>
                      <input 
                        v-model="tag.content" 
                        type="text" 
                        class="meta-input"
                        placeholder="محتوى الـ meta tag"
                      />
                    </div>
                  </div>
                  <button @click="removeMetaTag(index)" class="remove-meta-btn">
                    <Icon name="lucide:trash-2" class="remove-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sitemap -->
          <div v-if="activeTab === 'sitemap'" class="tab-panel">
            <div class="sitemap-section">
              <div class="sitemap-header">
                <h3 class="sitemap-title">إدارة Sitemap</h3>
                <div class="sitemap-actions">
                  <button @click="generateSitemap" class="generate-sitemap-btn">
                    <Icon name="lucide:refresh-cw" class="btn-icon" />
                    توليد Sitemap
                  </button>
                  <button @click="submitSitemap" class="submit-sitemap-btn">
                    <Icon name="lucide:upload" class="btn-icon" />
                    إرسال إلى Google
                  </button>
                </div>
              </div>
              
              <div class="sitemap-info">
                <div class="sitemap-stats">
                  <div class="sitemap-stat">
                    <span class="stat-label">إجمالي الصفحات:</span>
                    <span class="stat-value">{{ sitemapStats.totalPages }}</span>
                  </div>
                  <div class="sitemap-stat">
                    <span class="stat-label">آخر تحديث:</span>
                    <span class="stat-value">{{ sitemapStats.lastUpdated }}</span>
                  </div>
                  <div class="sitemap-stat">
                    <span class="stat-label">حجم الملف:</span>
                    <span class="stat-value">{{ sitemapStats.fileSize }}</span>
                  </div>
                </div>
                
                <div class="sitemap-urls">
                  <h4 class="urls-title">روابط Sitemap:</h4>
                  <div class="urls-list">
                    <div class="url-item">
                      <span class="url-text">https://worldtripagency.com/sitemap.xml</span>
                      <button class="copy-url-btn">
                        <Icon name="lucide:copy" class="copy-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics -->
          <div v-if="activeTab === 'analytics'" class="tab-panel">
            <div class="analytics-section">
              <div class="analytics-grid">
                <div class="analytics-card">
                  <h3 class="analytics-title">Google Analytics</h3>
                  <div class="analytics-fields">
                    <div class="field-group">
                      <label class="field-label">Google Analytics ID</label>
                      <input 
                        v-model="analyticsSettings.googleAnalyticsId" 
                        type="text" 
                        class="field-input"
                        placeholder="GA-XXXXXXXXX"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Google Tag Manager ID</label>
                      <input 
                        v-model="analyticsSettings.gtmId" 
                        type="text" 
                        class="field-input"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div class="analytics-card">
                  <h3 class="analytics-title">Facebook Pixel</h3>
                  <div class="analytics-fields">
                    <div class="field-group">
                      <label class="field-label">Facebook Pixel ID</label>
                      <input 
                        v-model="analyticsSettings.facebookPixelId" 
                        type="text" 
                        class="field-input"
                        placeholder="XXXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div class="analytics-card">
                  <h3 class="analytics-title">Search Console</h3>
                  <div class="analytics-fields">
                    <div class="field-group">
                      <label class="field-label">Google Search Console</label>
                      <input 
                        v-model="analyticsSettings.searchConsoleId" 
                        type="text" 
                        class="field-input"
                        placeholder="Search Console ID"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Bing Webmaster Tools</label>
                      <input 
                        v-model="analyticsSettings.bingWebmasterId" 
                        type="text" 
                        class="field-input"
                        placeholder="Bing Webmaster ID"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Keywords -->
          <div v-if="activeTab === 'keywords'" class="tab-panel">
            <div class="keywords-section">
              <div class="keywords-header">
                <h3 class="keywords-title">إدارة الكلمات المفتاحية</h3>
                <button @click="addKeyword" class="add-keyword-btn">
                  <Icon name="lucide:plus" class="btn-icon" />
                  إضافة كلمة مفتاحية
                </button>
              </div>
              
              <div class="keywords-list">
                <div v-for="(keyword, index) in keywords" :key="index" class="keyword-item">
                  <div class="keyword-content">
                    <div class="keyword-field">
                      <label class="keyword-label">الكلمة المفتاحية</label>
                      <input 
                        v-model="keyword.term" 
                        type="text" 
                        class="keyword-input"
                        placeholder="الكلمة المفتاحية"
                      />
                    </div>
                    <div class="keyword-field">
                      <label class="keyword-label">الترتيب الحالي</label>
                      <input 
                        v-model="keyword.rank" 
                        type="number" 
                        class="keyword-input"
                        placeholder="الترتيب"
                      />
                    </div>
                    <div class="keyword-field">
                      <label class="keyword-label">الصفحة المستهدفة</label>
                      <input 
                        v-model="keyword.targetPage" 
                        type="text" 
                        class="keyword-input"
                        placeholder="رابط الصفحة"
                      />
                    </div>
                  </div>
                  <button @click="removeKeyword(index)" class="remove-keyword-btn">
                    <Icon name="lucide:trash-2" class="remove-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('general')

const seoScore = ref(85)
const organicTraffic = ref('12,450')
const keywordRankings = ref(24)
const backlinks = ref(156)

const tabs = ref([
  { id: 'general', name: 'الإعدادات العامة', icon: 'lucide:settings' },
  { id: 'meta', name: 'Meta Tags', icon: 'lucide:tag' },
  { id: 'sitemap', name: 'Sitemap', icon: 'lucide:map' },
  { id: 'analytics', name: 'التحليلات', icon: 'lucide:bar-chart' },
  { id: 'keywords', name: 'الكلمات المفتاحية', icon: 'lucide:search' }
])

const seoSettings = ref({
  siteTitle: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية | رحلات عمرة وحج وسياحة',
  siteDescription: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج، سياحة داخلية وخارجية، باقات سفر متميزة إلى دبي، تركيا، ماليزيا، تايلاند وأكثر. خدمة 24/7 وأسعار منافسة.',
  keywords: 'وكالة سفر السعودية, رحلات عمرة, رحلات حج, سياحة السعودية, رحلات دبي, رحلات تركيا, رحلات ماليزيا, رحلات تايلاند, باقات سفر, وكالة سفر الرياض, سفر وسياحة, رحلات خارجية, رحلات داخلية, أرض العجائب للسفر, وكالة سفر مكة, وكالة سفر المدينة, رحلات عمرة من الرياض, رحلات عمرة من جدة, رحلات عمرة من الدمام, رحلات عمرة من القصيم, رحلات عمرة من تبوك, رحلات عمرة من حائل, رحلات عمرة من الباحة, رحلات عمرة من نجران, رحلات عمرة من جازان, رحلات عمرة من الحدود الشمالية, رحلات عمرة من عسير, رحلات عمرة من الجوف',
  language: 'ar',
  ogTitle: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية',
  ogDescription: 'اكتشف العالم مع World Trip Agency. رحلات مذهلة وأسعار منافسة.',
  ogImage: 'https://worldtripagency.com/images/og-image.jpg'
})

const metaTags = ref([
  { name: 'author', content: 'World Trip Agency' },
  { name: 'robots', content: 'index, follow' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
])

const sitemapStats = ref({
  totalPages: 45,
  lastUpdated: '2024-01-21',
  fileSize: '2.3 KB'
})

const analyticsSettings = ref({
  googleAnalyticsId: '',
  gtmId: '',
  facebookPixelId: '',
  searchConsoleId: '',
  bingWebmasterId: ''
})

const keywords = ref([
  { term: 'وكالة سفر', rank: 3, targetPage: '/' },
  { term: 'رحلات دبي', rank: 5, targetPage: '/packages/dubai' },
  { term: 'عمرة رمضان', rank: 2, targetPage: '/packages/umrah' },
  { term: 'سياحة تركيا', rank: 8, targetPage: '/packages/turkey' }
])

const addMetaTag = () => {
  metaTags.value.push({ name: '', content: '' })
}

const removeMetaTag = (index: number) => {
  metaTags.value.splice(index, 1)
}

const addKeyword = () => {
  keywords.value.push({ term: '', rank: 0, targetPage: '' })
}

const removeKeyword = (index: number) => {
  keywords.value.splice(index, 1)
}

const generateSitemap = () => {
  console.log('Generating sitemap...')
}

const submitSitemap = () => {
  console.log('Submitting sitemap to Google...')
}

const saveAllSettings = () => {
  console.log('Saving all SEO settings...', {
    seoSettings: seoSettings.value,
    metaTags: metaTags.value,
    analyticsSettings: analyticsSettings.value,
    keywords: keywords.value
  })
}

// Set page title
useHead({
  title: 'إدارة SEO - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.seo-page {
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

.save-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors;
}

.btn-icon {
  @apply w-4 h-4;
}

.overview-section {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.overview-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.overview-card {
  @apply flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg;
}

.overview-icon {
  @apply w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center;
}

.overview-icon .icon {
  @apply w-6 h-6 text-purple-600;
}

.overview-content {
  @apply flex-1;
}

.overview-value {
  @apply text-2xl font-bold text-gray-900;
}

.overview-label {
  @apply text-sm text-gray-600;
}

.overview-change {
  @apply text-xs font-medium;
}

.overview-change.positive {
  @apply text-green-600;
}

.overview-progress {
  @apply mt-2;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-purple-600 rounded-full transition-all duration-300;
}

.tabs-section {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
}

.tabs-container {
  @apply flex flex-col;
}

.tabs-header {
  @apply flex border-b border-gray-200 overflow-x-auto;
}

.tab-button {
  @apply flex items-center space-x-2 space-x-reverse px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap;
}

.tab-button.active {
  @apply text-purple-600 bg-purple-50 border-b-2 border-purple-600;
}

.tab-icon {
  @apply w-4 h-4;
}

.tabs-content {
  @apply p-6;
}

.tab-panel {
  @apply space-y-6;
}

.settings-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.setting-card {
  @apply space-y-4;
}

.setting-title {
  @apply text-lg font-semibold text-gray-900;
}

.setting-fields {
  @apply space-y-4;
}

.field-group {
  @apply space-y-2;
}

.field-label {
  @apply block text-sm font-medium text-gray-700;
}

.field-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.field-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none;
}

.field-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.meta-tags-section {
  @apply space-y-6;
}

.meta-header {
  @apply flex items-center justify-between;
}

.meta-title {
  @apply text-lg font-semibold text-gray-900;
}

.add-meta-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.meta-tags-list {
  @apply space-y-4;
}

.meta-tag-item {
  @apply flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg;
}

.meta-tag-content {
  @apply flex-1 grid grid-cols-1 md:grid-cols-2 gap-4;
}

.meta-tag-field {
  @apply space-y-2;
}

.meta-label {
  @apply block text-sm font-medium text-gray-700;
}

.meta-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.remove-meta-btn {
  @apply p-2 text-gray-400 hover:text-red-600 transition-colors;
}

.remove-icon {
  @apply w-4 h-4;
}

.sitemap-section {
  @apply space-y-6;
}

.sitemap-header {
  @apply flex items-center justify-between;
}

.sitemap-title {
  @apply text-lg font-semibold text-gray-900;
}

.sitemap-actions {
  @apply flex space-x-3 space-x-reverse;
}

.generate-sitemap-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.submit-sitemap-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors;
}

.sitemap-info {
  @apply space-y-6;
}

.sitemap-stats {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.sitemap-stat {
  @apply flex justify-between items-center p-4 bg-gray-50 rounded-lg;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.stat-value {
  @apply text-sm font-semibold text-gray-900;
}

.sitemap-urls {
  @apply space-y-4;
}

.urls-title {
  @apply text-lg font-semibold text-gray-900;
}

.urls-list {
  @apply space-y-2;
}

.url-item {
  @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
}

.url-text {
  @apply text-sm text-gray-700 font-mono;
}

.copy-url-btn {
  @apply p-1 text-gray-400 hover:text-gray-600 transition-colors;
}

.copy-icon {
  @apply w-4 h-4;
}

.analytics-section {
  @apply space-y-6;
}

.analytics-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6;
}

.analytics-card {
  @apply space-y-4;
}

.analytics-title {
  @apply text-lg font-semibold text-gray-900;
}

.analytics-fields {
  @apply space-y-4;
}

.keywords-section {
  @apply space-y-6;
}

.keywords-header {
  @apply flex items-center justify-between;
}

.keywords-title {
  @apply text-lg font-semibold text-gray-900;
}

.add-keyword-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.keywords-list {
  @apply space-y-4;
}

.keyword-item {
  @apply flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg;
}

.keyword-content {
  @apply flex-1 grid grid-cols-1 md:grid-cols-3 gap-4;
}

.keyword-field {
  @apply space-y-2;
}

.keyword-label {
  @apply block text-sm font-medium text-gray-700;
}

.keyword-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.remove-keyword-btn {
  @apply p-2 text-gray-400 hover:text-red-600 transition-colors;
}
</style>
