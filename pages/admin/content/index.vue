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

      <!-- About Page Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">صفحة عن الشركة</h2>
          <p class="section-description">تعديل محتوى صفحة عن الشركة</p>
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
                <label class="form-label">عنوان البطل الرئيسي</label>
                <input
                  v-model="content.about.hero.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان البطل الرئيسي"
                />
              </div>
              <div class="form-group">
                <label class="form-label">النص الفرعي للبطل</label>
                <textarea
                  v-model="content.about.hero.subtitle.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="النص الفرعي للبطل"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">عنوان نظرة عامة</label>
                <input
                  v-model="content.about.overview.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان نظرة عامة"
                />
              </div>
              <div class="form-group">
                <label class="form-label">مقدمة نظرة عامة</label>
                <textarea
                  v-model="content.about.overview.intro.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="مقدمة نظرة عامة"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">لماذا تختارنا</label>
                <input
                  v-model="content.about.overview.why_choose_us.ar"
                  type="text"
                  class="form-input"
                  placeholder="لماذا تختارنا"
                />
              </div>
              <div class="form-group">
                <label class="form-label">عنوان عن الشركة</label>
                <input
                  v-model="content.about.overview.about_title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان عن الشركة"
                />
              </div>
              <div class="form-group">
                <label class="form-label">نص عن الشركة</label>
                <textarea
                  v-model="content.about.overview.about_text.ar"
                  class="form-textarea"
                  rows="4"
                  placeholder="نص عن الشركة"
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
                <label class="form-label">Hero Title</label>
                <input
                  v-model="content.about.hero.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Hero title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Hero Subtitle</label>
                <textarea
                  v-model="content.about.hero.subtitle.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Hero subtitle"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Overview Title</label>
                <input
                  v-model="content.about.overview.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Overview title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Overview Intro</label>
                <textarea
                  v-model="content.about.overview.intro.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Overview intro"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Why Choose Us</label>
                <input
                  v-model="content.about.overview.why_choose_us.en"
                  type="text"
                  class="form-input"
                  placeholder="Why choose us"
                />
              </div>
              <div class="form-group">
                <label class="form-label">About Title</label>
                <input
                  v-model="content.about.overview.about_title.en"
                  type="text"
                  class="form-input"
                  placeholder="About title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">About Text</label>
                <textarea
                  v-model="content.about.overview.about_text.en"
                  class="form-textarea"
                  rows="4"
                  placeholder="About text"
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
  },
  about: {
    hero: {
      title: { ar: '', en: '' },
      subtitle: { ar: '', en: '' }
    },
    overview: {
      title: { ar: '', en: '' },
      intro: { ar: '', en: '' },
      why_choose_us: { ar: '', en: '' },
      about_title: { ar: '', en: '' },
      about_text: { ar: '', en: '' }
    }
  }
})

// Load content from API
const loadContent = async () => {
  try {
    // Load main content
    const response = await $fetch('/api/admin/content')
    const data = response.data || response
    if (data) {
      content.value = { ...content.value, ...data }
    }
    
    // Load about page content
    try {
      const aboutResponse = await $fetch('/api/admin/content/about')
      console.log('About content loaded from API:', aboutResponse.data)
      if (aboutResponse.data) {
        content.value.about = aboutResponse.data
        console.log('About content set in form:', content.value.about)
      }
    } catch (aboutError) {
      console.error('Error loading about content:', aboutError)
      // Use default about content
      content.value.about = loadDefaultContent().about
    }
  } catch (error) {
    console.error('Error loading content:', error)
    // Load default content from translations
    loadDefaultContent()
  }
}

// Load default content from translations
const loadDefaultContent = () => {
  const defaultContent = {
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
    },
    about: {
      hero: {
        title: { 
          ar: 'شريكك الموثوق به لتجارب سفر استثنائية منذ عام 2019',
          en: 'Your Trusted Partner for Exceptional Travel Experiences Since 2019'
        },
        subtitle: { 
          ar: 'اكتشف تجربة السفر مع World Trip Agency - حيث تتحول كل رحلة إلى مغامرة لا تُنسى',
          en: 'Discover the travel experience with World Trip Agency – where every journey transforms into an unforgettable adventure'
        }
      },
      overview: {
        title: { 
          ar: 'World Trip Agency للسفر والسياحة',
          en: 'World Trip Agency Travel & Tourism'
        },
        intro: { 
          ar: 'هل تبحث عن تجربة سفر لا تُنسى بأسعار لا تُقاوم؟ World Trip Agency هي بوابتك إلى عالم مليء بالمغامرات والرفاهية، حيث نقدم أفضل العروض وأعلى مستويات الخدمة!',
          en: 'Are you looking for an unforgettable travel experience at irresistible prices? World Trip Agency is your gateway to a world filled with adventures and luxury, where we offer the best deals and the highest level of service!'
        },
        why_choose_us: { 
          ar: 'لماذا تختار World Trip Agency؟',
          en: 'Why Choose World Trip Agency?'
        },
        about_title: { 
          ar: 'عن World Trip Agency للسفر والسياحة',
          en: 'About World Trip Agency Travel & Tourism'
        },
        about_text: { 
          ar: 'تأسست World Trip Agency للسفر والسياحة في عام 2019، لتكون بوابتك إلى رحلات فريدة وتجارب سفر استثنائية. نحن متخصصون في تقديم خدمات سفر شاملة تضمن تجربة سلسة ومريحة لكل مسافر - سواء كانت إجازات عائلية، أو جولات فاخرة، أو استكشافات مغامرة.',
          en: 'World Trip Agency Travel & Tourism was established in 2019 as your gateway to unique trips and exceptional travel experiences. We specialize in offering comprehensive travel services that ensure a seamless and comfortable experience for every traveler – whether it\'s family vacations, luxury tours, or adventurous explorations.'
        }
      }
    }
  }
  
  content.value = defaultContent
  return defaultContent
}

// Save content to API
const saveAllContent = async () => {
  isSaving.value = true
  message.value = ''
  
  try {
    // Check if content is too large and compress if needed
    const contentToSave = await compressContentIfNeeded(content.value)
    
    // Save main content
    await $fetch('/api/admin/content', {
      method: 'POST',
      body: contentToSave
    })
    
    // Save about page content separately
    if (content.value.about) {
      await $fetch('/api/admin/content/about', {
        method: 'POST',
        body: {
          about: content.value.about
        }
      })
    }
    
    message.value = 'تم حفظ المحتوى بنجاح!'
    messageType.value = 'success'
    
    // Force reload of site content in all components
    const { reload: reloadSiteContent } = useSiteContent()
    await reloadSiteContent()
    
    // Force reload of about content
    console.log('Reloading about content after save...')
    const { reloadAboutContent } = useAboutContent()
    await reloadAboutContent()
    console.log('About content reload completed')
    
    // Dispatch event to notify other pages
    if (process.client) {
      window.dispatchEvent(new CustomEvent('contentUpdated'))
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Error saving content:', error)
    
    // Check if it's a size limit error
    if (error.message && error.message.includes('Content too large')) {
      message.value = error.message
    } else if (error.status === 413) {
      message.value = 'الملف كبير جداً! يرجى استخدام فيديو أصغر (أقل من 4.5 ميجابايت)'
    } else {
      message.value = 'حدث خطأ أثناء حفظ المحتوى'
    }
    
    messageType.value = 'error'
    
    // Clear message after 5 seconds
    setTimeout(() => {
      message.value = ''
    }, 5000)
  } finally {
    isSaving.value = false
  }
}

// Compress content if it's too large
const compressContentIfNeeded = async (contentData: any) => {
  const contentString = JSON.stringify(contentData)
  const sizeInMB = new Blob([contentString]).size / (1024 * 1024)
  
  console.log('Content size:', sizeInMB.toFixed(2), 'MB')
  
  // Check if content is too large for Vercel (4.5MB limit)
  if (sizeInMB > 4) {
    console.log('Content too large for Vercel, please use smaller videos')
    throw new Error(`Content too large: ${sizeInMB.toFixed(2)}MB. Vercel limit is 4.5MB. Please use smaller videos.`)
  }
  
  console.log('Content size:', sizeInMB.toFixed(2), 'MB - within limits')
  
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
