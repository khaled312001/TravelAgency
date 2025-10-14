<template>
  <div class="content-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">إدارة المحتوى</h1>
          <p class="page-description">تعديل النصوص والعناوين في الصفحة الرئيسية</p>
        </div>
        <div class="header-actions">
          <button
            @click="saveAllContent"
            :disabled="isSaving || isAutoSaving"
            class="btn-primary"
          >
            <Icon :name="isSaving || isAutoSaving ? 'lucide:loader-2' : 'lucide:save'" 
                  :class="isSaving || isAutoSaving ? 'animate-spin' : ''" 
                  class="w-4 h-4" />
            {{ isSaving ? 'جاري الحفظ...' : isAutoSaving ? 'حفظ تلقائي...' : 'حفظ جميع التغييرات' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content Sections -->
    <div class="content-sections">
      <!-- Hero Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">قسم البطل الرئيسي</h2>
          <p class="section-description">العنوان الرئيسي والنص الفرعي في أعلى الصفحة</p>
        </div>
        
        <div class="content-grid">
          <!-- Arabic Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">المحتوى العربي</h3>
              <div class="language-badge arabic">العربية</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">العنوان الرئيسي</label>
                <input
                  v-model="content.hero.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="العنوان الرئيسي"
                />
              </div>
              <div class="form-group">
                <label class="form-label">النص الفرعي</label>
                <textarea
                  v-model="content.hero.subtitle.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="النص الفرعي"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">نص الزر</label>
                <input
                  v-model="content.hero.cta.ar"
                  type="text"
                  class="form-input"
                  placeholder="نص الزر"
                />
              </div>
              <div class="form-group">
                <label class="form-label">فيديو الخلفية</label>
                <ClientFileUpload
                  v-model="content.hero.video"
                  accept="video/*"
                  :max-size="50"
                />
              </div>
            </div>
          </div>

          <!-- English Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">English Content</h3>
              <div class="language-badge english">English</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">Main Title</label>
                <input
                  v-model="content.hero.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Main title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Subtitle</label>
                <textarea
                  v-model="content.hero.subtitle.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Subtitle"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Button Text</label>
                <input
                  v-model="content.hero.cta.en"
                  type="text"
                  class="form-input"
                  placeholder="Button text"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Background Video</label>
                <ClientFileUpload
                  v-model="content.hero.video"
                  accept="video/*"
                  :max-size="50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">قسم البحث</h2>
          <p class="section-description">نصوص قسم البحث والعناوين</p>
        </div>
        
        <div class="content-grid">
          <!-- Arabic Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">المحتوى العربي</h3>
              <div class="language-badge arabic">العربية</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">عنوان البحث</label>
                <input
                  v-model="content.search.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان البحث"
                />
              </div>
              <div class="form-group">
                <label class="form-label">وصف البحث</label>
                <textarea
                  v-model="content.search.description.ar"
                  class="form-textarea"
                  rows="2"
                  placeholder="وصف البحث"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- English Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">English Content</h3>
              <div class="language-badge english">English</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">Search Title</label>
                <input
                  v-model="content.search.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Search title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Search Description</label>
                <textarea
                  v-model="content.search.description.en"
                  class="form-textarea"
                  rows="2"
                  placeholder="Search description"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">قسم الخدمات</h2>
          <p class="section-description">عناوين ووصف قسم الخدمات</p>
        </div>
        
        <div class="content-grid">
          <!-- Arabic Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">المحتوى العربي</h3>
              <div class="language-badge arabic">العربية</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">عنوان الخدمات</label>
                <input
                  v-model="content.services.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان الخدمات"
                />
              </div>
              <div class="form-group">
                <label class="form-label">النص الفرعي</label>
                <input
                  v-model="content.services.subtitle.ar"
                  type="text"
                  class="form-input"
                  placeholder="النص الفرعي"
                />
              </div>
              <div class="form-group">
                <label class="form-label">وصف الخدمات</label>
                <textarea
                  v-model="content.services.description.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="وصف الخدمات"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- English Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">English Content</h3>
              <div class="language-badge english">English</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">Services Title</label>
                <input
                  v-model="content.services.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Services title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Subtitle</label>
                <input
                  v-model="content.services.subtitle.en"
                  type="text"
                  class="form-input"
                  placeholder="Subtitle"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Services Description</label>
                <textarea
                  v-model="content.services.description.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Services description"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Destinations Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">قسم الوجهات</h2>
          <p class="section-description">عناوين أقسام الوجهات السعودية والعالمية</p>
        </div>
        
        <div class="content-grid">
          <!-- Arabic Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">المحتوى العربي</h3>
              <div class="language-badge arabic">العربية</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">عنوان الوجهات السعودية</label>
                <input
                  v-model="content.destinations.saudi.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان الوجهات السعودية"
                />
              </div>
              <div class="form-group">
                <label class="form-label">وصف الوجهات السعودية</label>
                <textarea
                  v-model="content.destinations.saudi.subtitle.ar"
                  class="form-textarea"
                  rows="2"
                  placeholder="وصف الوجهات السعودية"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">عنوان الوجهات العالمية</label>
                <input
                  v-model="content.destinations.global.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان الوجهات العالمية"
                />
              </div>
              <div class="form-group">
                <label class="form-label">وصف الوجهات العالمية</label>
                <textarea
                  v-model="content.destinations.global.subtitle.ar"
                  class="form-textarea"
                  rows="2"
                  placeholder="وصف الوجهات العالمية"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- English Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">English Content</h3>
              <div class="language-badge english">English</div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">Saudi Destinations Title</label>
                <input
                  v-model="content.destinations.saudi.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Saudi destinations title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Saudi Destinations Description</label>
                <textarea
                  v-model="content.destinations.saudi.subtitle.en"
                  class="form-textarea"
                  rows="2"
                  placeholder="Saudi destinations description"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Global Destinations Title</label>
                <input
                  v-model="content.destinations.global.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Global destinations title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Global Destinations Description</label>
                <textarea
                  v-model="content.destinations.global.subtitle.en"
                  class="form-textarea"
                  rows="2"
                  placeholder="Global destinations description"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="message" :class="messageType">
      <Icon :name="messageType === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ClientFileUpload from '~/components/admin/ClientFileUpload.vue'

// Use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Reactive data
const isSaving = ref(false)
const isAutoSaving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// Content structure
const content = ref({
  hero: {
    title: { ar: '', en: '' },
    subtitle: { ar: '', en: '' },
    cta: { ar: '', en: '' },
    video_desktop: '',
    video_mobile: '',
    poster_image: ''
  },
  search: {
    title: { ar: '', en: '' },
    description: { ar: '', en: '' }
  },
  services: {
    title: { ar: '', en: '' },
    subtitle: { ar: '', en: '' },
    description: { ar: '', en: '' }
  },
  destinations: {
    saudi: {
      title: { ar: '', en: '' },
      subtitle: { ar: '', en: '' }
    },
    global: {
      title: { ar: '', en: '' },
      subtitle: { ar: '', en: '' }
    }
  }
})

// Load content from API
const loadContent = async () => {
  try {
    const response = await $fetch('/api/admin/content')
    const data = response.data || response
    if (data) {
      content.value = { ...content.value, ...data }
    }
  } catch (error) {
    console.error('Error loading content:', error)
    // Load default content from translations
    loadDefaultContent()
  }
}

// Load default content from translations
const loadDefaultContent = () => {
  content.value = {
    hero: {
      title: { 
        ar: 'نحنُ نأخذك إلى أفضل الأماكن حول العالم',
        en: 'We take you to the best places around the world'
      },
      subtitle: { 
        ar: 'باقات سفر شاملة تناسب جميع الميزانيات. وجهتك المثالية تبدأ معنا!',
        en: 'All-inclusive travel packages to suit every budget. Your perfect destination starts with us!'
      },
      cta: { 
        ar: 'استكشف باقاتنا',
        en: 'Explore Our Packages'
      },
      video: '/videos/hero/desktop/hero-desktop.webm'
    },
    search: {
      title: { 
        ar: 'ابحث عن رحلتك المثالية',
        en: 'Find Your Perfect Package'
      },
      description: { 
        ar: 'اكتشف باقات سفر مذهلة مصممة حسب تفضيلاتك',
        en: 'Discover amazing travel packages tailored to your preferences'
      }
    },
    services: {
      title: { 
        ar: 'خدماتنا المميزة',
        en: 'Our Premium Services'
      },
      subtitle: { 
        ar: 'استمتع بتجربة سفر سلسة مع مجموعة خدماتنا المميزة المصممة لجعل رحلتك استثنائية',
        en: 'Experience seamless travel with our comprehensive range of premium services designed to make your journey extraordinary'
      },
      description: { 
        ar: 'رحلة أحلامك هي شغفنا. نبذل قصارى جهدنا لتصميم تجارب سفر لا تُنسى، ونهتم بكل التفاصيل حتى تتمكن من التركيز على صنع ذكريات جميلة.',
        en: 'Your dream journey is our passion. We go above and beyond to craft unforgettable travel experiences, taking care of every detail so you can focus on creating beautiful memories.'
      }
    },
    destinations: {
      saudi: {
        title: { 
          ar: 'اكتشف روعة المملكة',
          en: 'Discover Saudi Arabia'
        },
        subtitle: { 
          ar: 'رحلة استثنائية عبر التراث العريق والحضارة المعاصرة والطبيعة الخلابة',
          en: 'Embark on an extraordinary journey through ancient traditions, modern marvels, and breathtaking landscapes'
        }
      },
      global: {
        title: { 
          ar: 'وجهات عالمية فاخرة',
          en: 'World-Class Destinations'
        },
        subtitle: { 
          ar: 'عش تجارب لا تُنسى في أروع الوجهات حول العالم',
          en: 'Experience unforgettable adventures in the most spectacular places around the globe'
        }
      }
    }
  }
}

// Save content to API
const saveAllContent = async () => {
  isSaving.value = true
  message.value = ''
  
  try {
    // Check if content is too large and compress if needed
    const contentToSave = await compressContentIfNeeded(content.value)
    
    await $fetch('/api/admin/content', {
      method: 'POST',
      body: contentToSave
    })
    
    message.value = 'تم حفظ المحتوى بنجاح!'
    messageType.value = 'success'
    
    // Force reload of site content in all components
    const { reload: reloadSiteContent } = useSiteContent()
    await reloadSiteContent()
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error saving content:', error)
    message.value = 'حدث خطأ أثناء حفظ المحتوى'
    messageType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

// Compress content if it's too large
const compressContentIfNeeded = async (contentData: any) => {
  const contentString = JSON.stringify(contentData)
  const sizeInMB = new Blob([contentString]).size / (1024 * 1024)
  
  console.log('Content size:', sizeInMB.toFixed(2), 'MB')
  
  // Skip compression for now - it converts video to image
  console.log('Content size:', sizeInMB.toFixed(2), 'MB - compression skipped')
  
  return contentData
}

// Compress base64 video by reducing quality
const compressBase64Video = async (base64Video: string): Promise<string> => {
  // For now, just return the original video without compression
  // Canvas compression converts video to image, which is not what we want
  console.log('Video compression skipped - using original video')
  return base64Video
}

// File upload handlers are now handled by ClientFileUpload component

// Load content on mount
onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.content-management-page {
  @apply p-6 space-y-8;
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

.page-description {
  @apply text-gray-600 mt-1;
}

.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50;
}

.content-sections {
  @apply space-y-8;
}

.content-section {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.section-header {
  @apply mb-6;
}

.section-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.section-description {
  @apply text-gray-600;
}

.content-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.content-card {
  @apply border border-gray-200 rounded-lg overflow-hidden;
}

.card-header {
  @apply bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between;
}

.card-title {
  @apply font-medium text-gray-900;
}

.language-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.language-badge.arabic {
  @apply bg-green-100 text-green-800;
}

.language-badge.english {
  @apply bg-blue-100 text-blue-800;
}

.card-content {
  @apply p-4 space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none;
}

.message {
  @apply fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50;
}

.message.success {
  @apply bg-green-100 text-green-800 border border-green-200;
}

.message.error {
  @apply bg-red-100 text-red-800 border border-red-200;
}

/* Responsive */
@media (max-width: 768px) {
  .content-management-page {
    @apply p-4;
  }
  
  .header-content {
    @apply flex-col items-start gap-4;
  }
  
  .content-grid {
    @apply grid-cols-1;
  }
}
</style>
