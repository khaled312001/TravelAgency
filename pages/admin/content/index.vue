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
                <label class="form-label">فيديو الخلفية (Desktop)</label>
                <ClientFileUpload
                  v-model="content.hero.video_desktop"
                  accept="video/*"
                  :max-size="50"
                />
              </div>
              <div class="form-group">
                <label class="form-label">فيديو الخلفية (Mobile)</label>
                <ClientFileUpload
                  v-model="content.hero.video_mobile"
                  accept="video/*"
                  :max-size="50"
                />
              </div>
              <div class="form-group">
                <label class="form-label">صورة الملصق</label>
                <ClientFileUpload
                  v-model="content.hero.poster_image"
                  accept="image/*"
                  :max-size="10"
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
                <label class="form-label">Background Video (Desktop)</label>
                <ClientFileUpload
                  v-model="content.hero.video_desktop"
                  accept="video/*"
                  :max-size="50"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Background Video (Mobile)</label>
                <ClientFileUpload
                  v-model="content.hero.video_mobile"
                  accept="video/*"
                  :max-size="50"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Poster Image</label>
                <ClientFileUpload
                  v-model="content.hero.poster_image"
                  accept="image/*"
                  :max-size="10"
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
        
        <!-- Hero Section -->
        <div class="subsection-header">
          <h3 class="subsection-title">قسم البطل الرئيسي</h3>
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
                <label class="form-label">عنوان زر الدعوة لاتخاذ إجراء</label>
                <input
                  v-model="content.about.hero.cta_title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان زر الدعوة لاتخاذ إجراء"
                />
              </div>
              <div class="form-group">
                <label class="form-label">نص زر الدعوة لاتخاذ إجراء</label>
                <input
                  v-model="content.about.hero.cta.ar"
                  type="text"
                  class="form-input"
                  placeholder="نص زر الدعوة لاتخاذ إجراء"
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
                <label class="form-label">CTA Title</label>
                <input
                  v-model="content.about.hero.cta_title.en"
                  type="text"
                  class="form-input"
                  placeholder="CTA title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">CTA Button Text</label>
                <input
                  v-model="content.about.hero.cta.en"
                  type="text"
                  class="form-input"
                  placeholder="CTA button text"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Overview Section -->
        <div class="subsection-header">
          <h3 class="subsection-title">قسم النظرة العامة</h3>
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
              <div class="form-group">
                <label class="form-label">لماذا نحن</label>
                <input
                  v-model="content.about.overview.why_us.ar"
                  type="text"
                  class="form-input"
                  placeholder="لماذا نحن"
                />
              </div>
              <div class="form-group">
                <label class="form-label">النص الختامي</label>
                <textarea
                  v-model="content.about.overview.closing.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="النص الختامي"
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
              <div class="form-group">
                <label class="form-label">Why Us</label>
                <input
                  v-model="content.about.overview.why_us.en"
                  type="text"
                  class="form-input"
                  placeholder="Why us"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Closing Text</label>
                <textarea
                  v-model="content.about.overview.closing.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Closing text"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="subsection-header">
          <h3 class="subsection-title">المزايا (6 عناصر)</h3>
        </div>
        <div class="content-grid">
          <!-- Arabic Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">المحتوى العربي</h3>
              <div class="language-badge arabic">العربية</div>
            </div>
            <div class="card-content">
              <div v-for="index in 6" :key="`benefit-ar-${index}`" class="form-group">
                <label class="form-label">ميزة {{ index }}</label>
                <textarea
                  v-model="content.about.overview.benefits[index - 1].ar"
                  class="form-textarea"
                  rows="2"
                  :placeholder="`نص الميزة ${index}`"
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
              <div v-for="index in 6" :key="`benefit-en-${index}`" class="form-group">
                <label class="form-label">Benefit {{ index }}</label>
                <textarea
                  v-model="content.about.overview.benefits[index - 1].en"
                  class="form-textarea"
                  rows="2"
                  :placeholder="`Benefit ${index} text`"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Reasons Section -->
        <div class="subsection-header">
          <h3 class="subsection-title">الأسباب (4 عناصر)</h3>
        </div>
        <div class="content-grid">
          <!-- Arabic Content -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">المحتوى العربي</h3>
              <div class="language-badge arabic">العربية</div>
            </div>
            <div class="card-content">
              <div v-for="index in 4" :key="`reason-ar-${index}`" class="form-group">
                <label class="form-label">سبب {{ index }}</label>
                <input
                  v-model="content.about.overview.reasons[index - 1].ar"
                  type="text"
                  class="form-input"
                  :placeholder="`نص السبب ${index}`"
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
              <div v-for="index in 4" :key="`reason-en-${index}`" class="form-group">
                <label class="form-label">Reason {{ index }}</label>
                <input
                  v-model="content.about.overview.reasons[index - 1].en"
                  type="text"
                  class="form-input"
                  :placeholder="`Reason ${index} text`"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Mission & Vision Section -->
        <div class="subsection-header">
          <h3 class="subsection-title">المهمة والرؤية</h3>
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
                <label class="form-label">عنوان القسم</label>
                <input
                  v-model="content.about.mission.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان القسم"
                />
              </div>
              <div class="form-group">
                <label class="form-label">العنوان الفرعي</label>
                <input
                  v-model="content.about.mission.subtitle.ar"
                  type="text"
                  class="form-input"
                  placeholder="العنوان الفرعي"
                />
              </div>
              <div class="form-group">
                <label class="form-label">عنوان المهمة</label>
                <input
                  v-model="content.about.mission.mission_title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان المهمة"
                />
              </div>
              <div class="form-group">
                <label class="form-label">نص المهمة</label>
                <textarea
                  v-model="content.about.mission.mission_text.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="نص المهمة"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">عنوان الرؤية</label>
                <input
                  v-model="content.about.mission.vision_title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان الرؤية"
                />
              </div>
              <div class="form-group">
                <label class="form-label">نص الرؤية</label>
                <textarea
                  v-model="content.about.mission.vision_text.ar"
                  class="form-textarea"
                  rows="3"
                  placeholder="نص الرؤية"
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
                <label class="form-label">Section Title</label>
                <input
                  v-model="content.about.mission.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Section title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Subtitle</label>
                <input
                  v-model="content.about.mission.subtitle.en"
                  type="text"
                  class="form-input"
                  placeholder="Subtitle"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Mission Title</label>
                <input
                  v-model="content.about.mission.mission_title.en"
                  type="text"
                  class="form-input"
                  placeholder="Mission title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Mission Text</label>
                <textarea
                  v-model="content.about.mission.mission_text.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Mission text"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Vision Title</label>
                <input
                  v-model="content.about.mission.vision_title.en"
                  type="text"
                  class="form-input"
                  placeholder="Vision title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Vision Text</label>
                <textarea
                  v-model="content.about.mission.vision_text.en"
                  class="form-textarea"
                  rows="3"
                  placeholder="Vision text"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Values Section -->
        <div class="subsection-header">
          <h3 class="subsection-title">القيم الأساسية (6 قيم)</h3>
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
                <label class="form-label">عنوان القسم</label>
                <input
                  v-model="content.about.values.title.ar"
                  type="text"
                  class="form-input"
                  placeholder="عنوان القسم"
                />
              </div>
              <div class="form-group">
                <label class="form-label">العنوان الفرعي</label>
                <input
                  v-model="content.about.values.subtitle.ar"
                  type="text"
                  class="form-input"
                  placeholder="العنوان الفرعي"
                />
              </div>
              <div v-for="index in 6" :key="`value-ar-${index}`" class="form-group-set">
                <h4 class="form-group-title">القيمة {{ index }}</h4>
                <div class="form-group">
                  <label class="form-label">العنوان</label>
                  <input
                    v-model="content.about.values.items[index - 1].title.ar"
                    type="text"
                    class="form-input"
                    :placeholder="`عنوان القيمة ${index}`"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">الوصف</label>
                  <textarea
                    v-model="content.about.values.items[index - 1].description.ar"
                    class="form-textarea"
                    rows="2"
                    :placeholder="`وصف القيمة ${index}`"
                  ></textarea>
                </div>
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
                <label class="form-label">Section Title</label>
                <input
                  v-model="content.about.values.title.en"
                  type="text"
                  class="form-input"
                  placeholder="Section title"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Subtitle</label>
                <input
                  v-model="content.about.values.subtitle.en"
                  type="text"
                  class="form-input"
                  placeholder="Subtitle"
                />
              </div>
              <div v-for="index in 6" :key="`value-en-${index}`" class="form-group-set">
                <h4 class="form-group-title">Value {{ index }}</h4>
                <div class="form-group">
                  <label class="form-label">Title</label>
                  <input
                    v-model="content.about.values.items[index - 1].title.en"
                    type="text"
                    class="form-input"
                    :placeholder="`Value ${index} title`"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea
                    v-model="content.about.values.items[index - 1].description.en"
                    class="form-textarea"
                    rows="2"
                    :placeholder="`Value ${index} description`"
                  ></textarea>
                </div>
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
      subtitle: { ar: '', en: '' },
      cta_title: { ar: '', en: '' },
      cta: { ar: '', en: '' }
    },
    overview: {
      title: { ar: '', en: '' },
      intro: { ar: '', en: '' },
      why_choose_us: { ar: '', en: '' },
      about_title: { ar: '', en: '' },
      about_text: { ar: '', en: '' },
      why_us: { ar: '', en: '' },
      closing: { ar: '', en: '' },
      benefits: [
        { ar: '', en: '' },
        { ar: '', en: '' },
        { ar: '', en: '' },
        { ar: '', en: '' },
        { ar: '', en: '' },
        { ar: '', en: '' }
      ],
      reasons: [
        { ar: '', en: '' },
        { ar: '', en: '' },
        { ar: '', en: '' },
        { ar: '', en: '' }
      ]
    },
    mission: {
      title: { ar: '', en: '' },
      subtitle: { ar: '', en: '' },
      mission_title: { ar: '', en: '' },
      mission_text: { ar: '', en: '' },
      vision_title: { ar: '', en: '' },
      vision_text: { ar: '', en: '' }
    },
    values: {
      title: { ar: '', en: '' },
      subtitle: { ar: '', en: '' },
      items: [
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } },
        { title: { ar: '', en: '' }, description: { ar: '', en: '' } }
      ]
    }
  }
})

// Load content from API
const loadContent = async () => {
  try {
    // Load main content
    const response: any = await $fetch('/api/admin/content')
    const data = response.data || response
    if (data) {
      content.value = { ...content.value, ...data }
    }
    
    // Load about page content
    try {
      const aboutResponse: any = await $fetch('/api/admin/content/about')
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
      video_desktop: '/videos/hero/desktop/hero-desktop.webm',
      video_mobile: '/videos/hero/mobile/hero-mobile.webm',
      poster_image: '/images/hero-poster.jpg'
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
        },
        cta_title: {
          ar: 'هل أنت مهتم بمعرفة المزيد عن باقاتنا؟',
          en: 'Are you interested in learning more about our packages?'
        },
        cta: {
          ar: 'استكشف باقاتنا',
          en: 'Explore Our Packages'
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
        },
        why_us: {
          ar: 'لماذا نحن؟',
          en: 'Why Us?'
        },
        closing: {
          ar: 'نؤمن بأن السفر ليس مجرد رحلة - إنه تجربة تُذكر. نسعى جاهدين لملء كل رحلة بلحظات سعيدة وذكريات جميلة.',
          en: 'We believe that travel is not just a journey - it\'s an experience to remember. We strive to fill every trip with happy moments and beautiful memories.'
        },
        benefits: [
          { 
            ar: 'أسعار لا تُقاوم: نقدم أفضل العروض على تذاكر الطيران والفنادق بأقل الأسعار دون المساس بالجودة.',
            en: 'Irresistible Prices: We offer the best deals on flights and hotels at the lowest prices without compromising quality.'
          },
          { 
            ar: 'خيارات حجز مخصصة: سواء كنت تفضل خيارات فاخرة أو اقتصادية، لدينا الخيارات المثالية لتلبية احتياجاتك.',
            en: 'Customized Booking Options: Whether you prefer luxury or budget options, we have the perfect choices to meet your needs.'
          },
          { 
            ar: 'خدمات تأشيرة سريعة: نساعدك في الحصول على التأشيرات بسرعة وسهولة، بغض النظر عن وجهتك.',
            en: 'Fast Visa Services: We help you get visas quickly and easily, regardless of your destination.'
          },
          { 
            ar: 'تأمين سفر شامل: استمتع براحة البال في رحلتك مع تغطية التأمين الشاملة.',
            en: 'Comprehensive Travel Insurance: Enjoy peace of mind on your trip with comprehensive insurance coverage.'
          },
          { 
            ar: 'رخصة قيادة دولية: احصل على حرية القيادة في الخارج بثقة مع رخصة القيادة الدولية المعترف بها.',
            en: 'International Driving License: Get the freedom to drive abroad with confidence with a recognized international driving license.'
          },
          { 
            ar: 'خدمة عملاء على مدار الساعة: فريقنا المخصص متاح دائمًا لمساعدتك، في أي وقت وفي أي مكان.',
            en: '24/7 Customer Service: Our dedicated team is always available to help you, anytime, anywhere.'
          }
        ],
        reasons: [
          { 
            ar: 'خبرة واسعة في صناعة السفر',
            en: 'Extensive experience in the travel industry'
          },
          { 
            ar: 'دعم عملاء ممتاز على مدار الساعة',
            en: 'Excellent 24/7 customer support'
          },
          { 
            ar: 'باقات سفر وعروض تنافسية',
            en: 'Competitive travel packages and offers'
          },
          { 
            ar: 'شراكات مع أفضل الفنادق وشركات الطيران',
            en: 'Partnerships with top hotels and airlines'
          }
        ]
      },
      mission: {
        title: {
          ar: 'مهمتنا ورؤيتنا',
          en: 'Our Mission & Vision'
        },
        subtitle: {
          ar: 'مسترشدين بالتزامنا بالتميز ورضا العملاء',
          en: 'Guided by our commitment to excellence and customer satisfaction'
        },
        mission_title: {
          ar: 'مهمتنا',
          en: 'Our Mission'
        },
        mission_text: {
          ar: 'تقديم تجارب سفر استثنائية تفوق توقعات عملائنا من خلال خدمة شخصية، والاهتمام بالتفاصيل، وحلول سفر شاملة.',
          en: 'To deliver exceptional travel experiences that exceed our customers\' expectations through personalized service, attention to detail, and comprehensive travel solutions.'
        },
        vision_title: {
          ar: 'رؤيتنا',
          en: 'Our Vision'
        },
        vision_text: {
          ar: 'أن نصبح وكالة السفر الرائدة المعروفة بتحويل الرحلات العادية إلى رحلات استثنائية، وخلق ذكريات تدوم مدى الحياة لعملائنا حول العالم.',
          en: 'To become the leading travel agency known for transforming ordinary trips into extraordinary journeys, creating lifelong memories for our customers around the world.'
        }
      },
      values: {
        title: {
          ar: 'قيمنا الأساسية',
          en: 'Our Core Values'
        },
        subtitle: {
          ar: 'المبادئ التي توجه كل ما نقوم به',
          en: 'The principles that guide everything we do'
        },
        items: [
          {
            title: { ar: 'التميز', en: 'Excellence' },
            description: { 
              ar: 'نسعى للتميز في كل جانب من جوانب خدمتنا، من الاستفسار الأول حتى اليوم الأخير من رحلتك.',
              en: 'We strive for excellence in every aspect of our service, from the first inquiry to the last day of your trip.'
            }
          },
          {
            title: { ar: 'النزاهة', en: 'Integrity' },
            description: { 
              ar: 'نعمل بشفافية وأمانة كاملة، مما يضمن ثقة عملائنا بنا في كل خطوة من الطريق.',
              en: 'We operate with complete transparency and honesty, ensuring our customers trust us every step of the way.'
            }
          },
          {
            title: { ar: 'الابتكار', en: 'Innovation' },
            description: { 
              ar: 'نبحث باستمرار عن طرق جديدة وأفضل لتعزيز تجربة السفر من خلال التكنولوجيا والحلول الإبداعية.',
              en: 'We continuously seek new and better ways to enhance the travel experience through technology and creative solutions.'
            }
          },
          {
            title: { ar: 'التخصيص', en: 'Personalization' },
            description: { 
              ar: 'ندرك أن كل مسافر فريد من نوعه، ونقوم بتخصيص خدماتنا لتلبية الاحتياجات والتفضيلات الفردية.',
              en: 'We recognize that every traveler is unique, and we customize our services to meet individual needs and preferences.'
            }
          },
          {
            title: { ar: 'الاستدامة', en: 'Sustainability' },
            description: { 
              ar: 'نلتزم بممارسات سفر مسؤولة تحترم وتحافظ على الوجهات للأجيال القادمة.',
              en: 'We are committed to responsible travel practices that respect and preserve destinations for future generations.'
            }
          },
          {
            title: { ar: 'الشراكة', en: 'Partnership' },
            description: { 
              ar: 'نبني علاقات قوية مع عملائنا وموردينا والمجتمعات لخلق قيمة ونجاح متبادل.',
              en: 'We build strong relationships with our customers, suppliers, and communities to create mutual value and success.'
            }
          }
        ]
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

.subsection-header {
  @apply mt-6 mb-4 pt-4 border-t border-gray-200;
}

.subsection-title {
  @apply text-lg font-semibold text-gray-800;
}

.form-group-set {
  @apply p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200;
}

.form-group-title {
  @apply text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-300;
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
