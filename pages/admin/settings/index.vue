<template>
  <div class="settings-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">الإعدادات</h1>
          <p class="page-subtitle">إدارة إعدادات الموقع والنظام</p>
        </div>
        <div class="header-right">
          <button @click="saveAllSettings" class="save-btn" :disabled="saving">
            <Icon v-if="saving" name="lucide:loader-2" class="btn-icon animate-spin" />
            <Icon v-else name="lucide:save" class="btn-icon" />
            {{ saving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="settings-tabs">
      <div class="tabs-container">
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
    </div>

    <!-- Settings Content -->
    <div class="settings-content">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">الإعدادات العامة</h2>
          <p class="section-description">إعدادات الموقع الأساسية</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">معلومات الموقع</h3>
              <p class="setting-description">اسم الموقع والوصف</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">اسم الموقع (بالعربية) *</label>
                <input 
                  v-model="settings.general.siteName.ar" 
                  type="text" 
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">اسم الموقع (بالإنجليزية) *</label>
                <input 
                  v-model="settings.general.siteName.en" 
                  type="text" 
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">وصف الموقع (بالعربية)</label>
                <textarea 
                  v-model="settings.general.siteDescription.ar" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">وصف الموقع (بالإنجليزية)</label>
                <textarea 
                  v-model="settings.general.siteDescription.en" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">رابط الموقع</label>
                <input 
                  v-model="settings.general.siteUrl" 
                  type="url" 
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">معلومات التواصل</h3>
              <p class="setting-description">معلومات التواصل مع العملاء</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني</label>
                <input 
                  v-model="settings.general.contactEmail" 
                  type="email" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رقم الهاتف</label>
                <input 
                  v-model="settings.general.contactPhone" 
                  type="tel" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">العنوان (بالعربية)</label>
                <textarea 
                  v-model="settings.general.contactAddress.ar" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">العنوان (بالإنجليزية)</label>
                <textarea 
                  v-model="settings.general.contactAddress.en" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information Settings -->
      <div v-if="activeTab === 'contact'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">معلومات التواصل</h2>
          <p class="section-description">إدارة معلومات التواصل المعروضة في الموقع</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">معلومات التواصل الأساسية</h3>
              <p class="setting-description">المعلومات المعروضة في قسم التواصل</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني الرئيسي *</label>
                <input 
                  v-model="settings.general.contactEmail" 
                  type="email" 
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني الثانوي</label>
                <input 
                  v-model="settings.general.contactEmail2" 
                  type="email" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رقم الهاتف الرئيسي *</label>
                <input 
                  v-model="settings.general.contactPhone" 
                  type="tel" 
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">رقم الهاتف الثانوي</label>
                <input 
                  v-model="settings.general.contactPhone2" 
                  type="tel" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">العنوان (بالعربية)</label>
                <textarea 
                  v-model="settings.general.contactAddress.ar" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">العنوان (بالإنجليزية)</label>
                <textarea 
                  v-model="settings.general.contactAddress.en" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">ساعات العمل (بالعربية)</label>
                <input 
                  v-model="settings.general.contactHours.ar" 
                  type="text" 
                  class="form-input"
                  placeholder="السبت - الخميس: 8:00 ص - 6:00 م"
                />
              </div>
              <div class="form-group">
                <label class="form-label">ساعات العمل (بالإنجليزية)</label>
                <input 
                  v-model="settings.general.contactHours.en" 
                  type="text" 
                  class="form-input"
                  placeholder="Saturday - Thursday: 8:00 AM - 6:00 PM"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">روابط التواصل الاجتماعي</h3>
              <p class="setting-description">روابط منصات التواصل الاجتماعي</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">رابط الواتساب</label>
                <input 
                  v-model="settings.general.whatsappUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://wa.me/966500982394"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رابط الإنستغرام</label>
                <input 
                  v-model="settings.general.instagramUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://instagram.com/worldtripagency"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رابط الفيسبوك</label>
                <input 
                  v-model="settings.general.facebookUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://facebook.com/worldtripagency"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رابط تويتر</label>
                <input 
                  v-model="settings.general.twitterUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://twitter.com/worldtripagency"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رابط سناب شات</label>
                <input 
                  v-model="settings.general.snapchatUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://www.snapchat.com/add/username"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رابط تيك توك</label>
                <input 
                  v-model="settings.general.tiktokUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://www.tiktok.com/@username"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">معلومات الشهادات والتراخيص</h3>
              <p class="setting-description">الشهادات المعروضة في الفوتر</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">رقم الترخيص</label>
                <input 
                  v-model="settings.general.licenseNumber" 
                  type="text" 
                  class="form-input"
                  placeholder="73105863"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رقم التسجيل</label>
                <input 
                  v-model="settings.general.registrationNumber" 
                  type="text" 
                  class="form-input"
                  placeholder="7043491153"
                />
              </div>
              <div class="form-group">
                <label class="form-label">رقم IATA (اختياري)</label>
                <input 
                  v-model="settings.general.iataNumber" 
                  type="text" 
                  class="form-input"
                  placeholder="XXX12345"
                />
              </div>
              <div class="form-group">
                <label class="form-label">معلومات التأمين (اختياري)</label>
                <input 
                  v-model="settings.general.insuranceInfo" 
                  type="text" 
                  class="form-input"
                  placeholder="Provided by ZZZ Insurers"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">الوجهات المميزة</h3>
              <p class="setting-description">الوجهات المعروضة في الفوتر</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">الوجهة الأولى</label>
                <input 
                  v-model="settings.general.destination1" 
                  type="text" 
                  class="form-input"
                  placeholder="الرياض"
                />
              </div>
              <div class="form-group">
                <label class="form-label">الوجهة الثانية</label>
                <input 
                  v-model="settings.general.destination2" 
                  type="text" 
                  class="form-input"
                  placeholder="البحر الأحمر"
                />
              </div>
              <div class="form-group">
                <label class="form-label">الوجهة الثالثة</label>
                <input 
                  v-model="settings.general.destination3" 
                  type="text" 
                  class="form-input"
                  placeholder="العلا"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo Settings -->
      <div v-if="activeTab === 'logo'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">إعدادات اللوجو</h2>
          <p class="section-description">إدارة لوجو الموقع</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">لوجو الموقع الرئيسي</h3>
              <p class="setting-description">اللوجو المستخدم في الهيدر والموقع</p>
            </div>
            <div class="setting-content">
              <div class="logo-upload-area">
                <div class="current-logo">
                  <img 
                    :src="settings.logo.mainLogo || '/images/home/logo/WonderlandLogo.svg'" 
                    alt="اللوجو الحالي" 
                    class="logo-preview"
                  />
                  <p class="logo-info">اللوجو الحالي</p>
                </div>
                <div class="upload-section">
                  <input 
                    ref="mainLogoInput"
                    type="file" 
                    accept="image/*" 
                    @change="handleMainLogoUpload"
                    class="file-input"
                    id="main-logo-upload"
                  />
                  <label for="main-logo-upload" class="upload-button">
                    <Icon name="lucide:upload" class="upload-icon" />
                    رفع لوجو جديد
                  </label>
                  <p class="upload-hint">
                    <strong>الصيغ المدعومة:</strong> PNG, JPG, JPEG, SVG, WebP<br>
                    <strong>الحجم المفضل:</strong> 200x60 بكسل<br>
                    <strong>الحد الأقصى:</strong> 2 ميجابايت<br>
                    <strong>الخلفية:</strong> شفافة (PNG/SVG) أو بيضاء
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">لوجو الفوتر</h3>
              <p class="setting-description">اللوجو المستخدم في الفوتر (أبيض)</p>
            </div>
            <div class="setting-content">
              <div class="logo-upload-area">
                <div class="current-logo">
                  <img 
                    :src="settings.logo.footerLogo || '/images/home/logo/WonderlandLogoWhite.svg'" 
                    alt="لوجو الفوتر الحالي" 
                    class="logo-preview"
                  />
                  <p class="logo-info">لوجو الفوتر الحالي</p>
                </div>
                <div class="upload-section">
                  <input 
                    ref="footerLogoInput"
                    type="file" 
                    accept="image/*" 
                    @change="handleFooterLogoUpload"
                    class="file-input"
                    id="footer-logo-upload"
                  />
                  <label for="footer-logo-upload" class="upload-button">
                    <Icon name="lucide:upload" class="upload-icon" />
                    رفع لوجو جديد
                  </label>
                  <p class="upload-hint">
                    <strong>الصيغ المدعومة:</strong> PNG, JPG, JPEG, SVG, WebP<br>
                    <strong>الحجم المفضل:</strong> 200x60 بكسل<br>
                    <strong>الحد الأقصى:</strong> 2 ميجابايت<br>
                    <strong>الخلفية:</strong> شفافة (PNG/SVG) أو بيضاء
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">أيقونة الموقع (Favicon)</h3>
              <p class="setting-description">الأيقونة الصغيرة في تبويب المتصفح</p>
            </div>
            <div class="setting-content">
              <div class="logo-upload-area">
                <div class="current-logo">
                  <img 
                    :src="settings.logo.favicon || '/favicon.ico'" 
                    alt="الأيقونة الحالية" 
                    class="favicon-preview"
                  />
                  <p class="logo-info">الأيقونة الحالية</p>
                </div>
                <div class="upload-section">
                  <input 
                    ref="faviconInput"
                    type="file" 
                    accept="image/*" 
                    @change="handleFaviconUpload"
                    class="file-input"
                    id="favicon-upload"
                  />
                  <label for="favicon-upload" class="upload-button">
                    <Icon name="lucide:upload" class="upload-icon" />
                    رفع أيقونة جديدة
                  </label>
                  <p class="upload-hint">
                    <strong>الصيغ المدعومة:</strong> ICO, PNG, SVG<br>
                    <strong>الحجم المفضل:</strong> 32x32 أو 16x16 بكسل<br>
                    <strong>الحد الأقصى:</strong> 1 ميجابايت<br>
                    <strong>الخلفية:</strong> شفافة أو بيضاء
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">إعدادات اللوجو</h3>
              <p class="setting-description">إعدادات عرض اللوجو</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">ارتفاع اللوجو (بالبكسل)</label>
                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                  <input 
                    v-model="settings.logo.logoHeight" 
                    type="range" 
                    class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    min="20"
                    max="120"
                    step="4"
                  />
                  <input 
                    v-model="settings.logo.logoHeight" 
                    type="number" 
                    class="w-20 form-input text-center"
                    min="20"
                    max="120"
                  />
                </div>
                <div class="mt-2 text-sm text-gray-600">
                  <span class="font-medium">معاينة:</span>
                  <div class="mt-2 p-3 bg-gray-50 rounded-lg border">
                    <img 
                      :src="settings.logo.mainLogo || '/images/home/logo/WonderlandLogo.svg'" 
                      :style="`height: ${settings.logo.logoHeight}px; width: auto;`"
                      alt="معاينة اللوجو" 
                      class="transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.logo.showLogoText" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>إظهار نص اللوجو بجانب الصورة</span>
                </label>
              </div>
              <div v-if="settings.logo.showLogoText" class="form-group">
                <label class="form-label">نص اللوجو (بالعربية)</label>
                <input 
                  v-model="settings.logo.logoText.ar" 
                  type="text" 
                  class="form-input"
                  placeholder="أرض العجائب"
                />
              </div>
              <div v-if="settings.logo.showLogoText" class="form-group">
                <label class="form-label">نص اللوجو (بالإنجليزية)</label>
                <input 
                  v-model="settings.logo.logoText.en" 
                  type="text" 
                  class="form-input"
                  placeholder="World Trip Agency"
                />
              </div>
              <div v-if="settings.logo.showLogoText" class="form-group">
                <label class="form-label">معاينة اللوجو مع النص</label>
                <div class="mt-2 p-3 bg-gray-50 rounded-lg border">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <img 
                      :src="settings.logo.mainLogo || '/images/home/logo/WonderlandLogo.svg'" 
                      :style="`height: ${settings.logo.logoHeight}px; width: auto;`"
                      alt="معاينة اللوجو" 
                      class="transition-all duration-300"
                    />
                    <span class="text-lg font-semibold text-gray-900">
                      {{ settings.logo.logoText.ar || 'أرض العجائب' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- معاينة مباشرة للوجو في الهيدر -->
              <div class="form-group">
                <label class="form-label">معاينة اللوجو في الهيدر</label>
                <div class="mt-2 p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center group transition-all duration-300 hover:scale-105">
                      <div class="relative">
                        <img 
                          :src="settings.logo.mainLogo || '/images/home/logo/WonderlandLogo.svg'" 
                          :style="`height: ${settings.logo.logoHeight}px; width: auto;`"
                          :alt="settings.general?.siteName?.ar || 'World Trip Agency Agency Logo'" 
                          loading="eager"
                          class="transition-all duration-300 group-hover:brightness-110"
                        />
                      </div>
                      <span v-if="settings.logo.showLogoText" class="font-bold text-xl font-italic text-primary-900 ml-3 transition-colors duration-300 group-hover:text-primary-700">
                        {{ settings.logo.logoText.ar || 'أرض العجائب' }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500">
                      الارتفاع: {{ settings.logo.logoHeight }}px
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div v-if="activeTab === 'email'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">إعدادات البريد الإلكتروني</h2>
          <p class="section-description">إعدادات إرسال الرسائل الإلكترونية</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">SMTP Server</h3>
              <p class="setting-description">إعدادات خادم البريد الإلكتروني</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">عنوان الخادم</label>
                <input 
                  v-model="settings.email.smtpHost" 
                  type="text" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">المنفذ</label>
                <input 
                  v-model="settings.email.smtpPort" 
                  type="number" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">اسم المستخدم</label>
                <input 
                  v-model="settings.email.smtpUsername" 
                  type="text" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">كلمة المرور</label>
                <input 
                  v-model="settings.email.smtpPassword" 
                  type="password" 
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">قوالب الرسائل</h3>
              <p class="setting-description">قوالب الرسائل الإلكترونية</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني للمرسل</label>
                <input 
                  v-model="settings.email.fromEmail" 
                  type="email" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">اسم المرسل</label>
                <input 
                  v-model="settings.email.fromName" 
                  type="text" 
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div v-if="activeTab === 'payment'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">إعدادات الدفع</h2>
          <p class="section-description">إعدادات طرق الدفع المتاحة</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">الدفع الإلكتروني</h3>
              <p class="setting-description">إعدادات بوابات الدفع</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.payment.stripeEnabled" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>تفعيل Stripe</span>
                </label>
              </div>
              <div v-if="settings.payment.stripeEnabled" class="form-group">
                <label class="form-label">مفتاح Stripe العام</label>
                <input 
                  v-model="settings.payment.stripePublicKey" 
                  type="text" 
                  class="form-input"
                />
              </div>
              <div v-if="settings.payment.stripeEnabled" class="form-group">
                <label class="form-label">مفتاح Stripe السري</label>
                <input 
                  v-model="settings.payment.stripeSecretKey" 
                  type="password" 
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">الدفع المحلي</h3>
              <p class="setting-description">إعدادات طرق الدفع المحلية</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.payment.madaEnabled" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>تفعيل مدى</span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.payment.visaEnabled" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>تفعيل فيزا</span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.payment.mastercardEnabled" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>تفعيل ماستركارد</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO Settings -->
      <div v-if="activeTab === 'seo'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">إعدادات SEO</h2>
          <p class="section-description">إعدادات محركات البحث</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">Meta Tags</h3>
              <p class="setting-description">علامات Meta الأساسية</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">Meta Title</label>
                <input 
                  v-model="settings.seo.metaTitle" 
                  type="text" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Meta Description</label>
                <textarea 
                  v-model="settings.seo.metaDescription" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Meta Keywords</label>
                <input 
                  v-model="settings.seo.metaKeywords" 
                  type="text" 
                  class="form-input"
                  placeholder="كلمة مفتاحية 1, كلمة مفتاحية 2, ..."
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">Google Analytics</h3>
              <p class="setting-description">إعدادات Google Analytics</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">Google Analytics ID</label>
                <input 
                  v-model="settings.seo.googleAnalyticsId" 
                  type="text" 
                  class="form-input"
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Google Search Console</label>
                <input 
                  v-model="settings.seo.googleSearchConsole" 
                  type="text" 
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="settings-section">
        <div class="section-header">
          <h2 class="section-title">إعدادات الأمان</h2>
          <p class="section-description">إعدادات أمان النظام</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">جلسات المستخدمين</h3>
              <p class="setting-description">إعدادات جلسات تسجيل الدخول</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label">مدة انتهاء الجلسة (بالساعات)</label>
                <input 
                  v-model="settings.security.sessionTimeout" 
                  type="number" 
                  class="form-input"
                  min="1"
                  max="24"
                />
              </div>
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.security.requireStrongPassword" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>طلب كلمة مرور قوية</span>
                </label>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <h3 class="setting-title">حماية إضافية</h3>
              <p class="setting-description">إعدادات الحماية المتقدمة</p>
            </div>
            <div class="setting-content">
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.security.enableTwoFactor" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>تفعيل المصادقة الثنائية</span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label flex items-center space-x-2 space-x-reverse">
                  <input 
                    v-model="settings.security.enableRateLimit" 
                    type="checkbox" 
                    class="form-checkbox"
                  />
                  <span>تفعيل تحديد معدل الطلبات</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Settings {
  general: {
    siteName: { ar: string; en: string }
    siteDescription: { ar: string; en: string }
    siteUrl: string
    contactEmail: string
    contactEmail2: string
    contactPhone: string
    contactPhone2: string
    contactAddress: { ar: string; en: string }
    contactAddressEn: string
    contactHours: { ar: string; en: string }
    whatsappUrl: string
    instagramUrl: string
    facebookUrl: string
    twitterUrl: string
    snapchatUrl: string
    tiktokUrl: string
    licenseNumber: string
    registrationNumber: string
    iataNumber: string
    insuranceInfo: string
    destination1: string
    destination2: string
    destination3: string
  }
  logo: {
    mainLogo: string
    footerLogo: string
    favicon: string
    logoHeight: number
    showLogoText: boolean
    logoText: { ar: string; en: string }
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  payment: {
    stripeEnabled: boolean
    stripePublicKey: string
    stripeSecretKey: string
    madaEnabled: boolean
    visaEnabled: boolean
    mastercardEnabled: boolean
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    googleAnalyticsId: string
    googleSearchConsole: string
  }
  security: {
    sessionTimeout: number
    requireStrongPassword: boolean
    enableTwoFactor: boolean
    enableRateLimit: boolean
  }
}

const activeTab = ref('general')
const saving = ref(false)

const tabs = [
  { id: 'general', name: 'عام', icon: 'lucide:settings' },
  { id: 'contact', name: 'معلومات التواصل', icon: 'lucide:phone' },
  { id: 'logo', name: 'اللوجو', icon: 'lucide:image' },
  { id: 'email', name: 'البريد الإلكتروني', icon: 'lucide:mail' },
  { id: 'payment', name: 'الدفع', icon: 'lucide:credit-card' },
  { id: 'seo', name: 'SEO', icon: 'lucide:search' },
  { id: 'security', name: 'الأمان', icon: 'lucide:shield' }
]

const settings = ref<Settings>({
  general: {
    siteName: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
    siteDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
    siteUrl: 'https://worldtripagency.com',
    contactEmail: 'info@worldtripagency.com',
    contactEmail2: 'support@worldtripagency.com',
    contactPhone: '+966501234567',
    contactPhone2: '+966112345678',
    contactAddress: { ar: 'مكة المكرمة  - شارع الستين ', en: 'Riyadh, Saudi Arabia' },
    contactAddressEn: 'Riyadh, Saudi Arabia',
    contactHours: { ar: 'السبت - الخميس: 8:00 ص - 6:00 م', en: 'Saturday - Thursday: 8:00 AM - 6:00 PM' },
    whatsappUrl: 'https://wa.me/966500982394',
    instagramUrl: 'https://instagram.com/worldtripagency',
    facebookUrl: 'https://facebook.com/worldtripagency',
    twitterUrl: 'https://twitter.com/worldtripagency',
    snapchatUrl: 'https://www.snapchat.com/add/ahmed18311',
    tiktokUrl: 'https://www.tiktok.com/@wonder.land.sa',
    licenseNumber: '73105863',
    registrationNumber: '7043491153',
    iataNumber: '',
    insuranceInfo: '',
    destination1: 'الرياض',
    destination2: 'البحر الأحمر',
    destination3: 'العلا'
  },
  logo: {
    mainLogo: '/images/home/logo/WonderlandLogo.svg',
    footerLogo: '/images/home/logo/WonderlandLogoWhite.svg',
    favicon: '/favicon.ico',
    logoHeight: 48,
    showLogoText: false,
    logoText: { ar: 'أرض العجائب', en: 'World Trip Agency' }
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@worldtripagency.com',
    fromName: 'World Trip Agency Traveling Agency'
  },
  payment: {
    stripeEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    madaEnabled: true,
    visaEnabled: true,
    mastercardEnabled: true
  },
  seo: {
    metaTitle: 'World Trip Agency - وكالة سفر متخصصة',
    metaDescription: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج',
    metaKeywords: 'سفر, رحلات, عمرة, حج, سياحة',
    googleAnalyticsId: '',
    googleSearchConsole: ''
  },
  security: {
    sessionTimeout: 24,
    requireStrongPassword: true,
    enableTwoFactor: false,
    enableRateLimit: true
  }
})

// Logo upload functions
const handleMainLogoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 2MB')
      return
    }
    
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      const response = await fetch('/api/admin/upload/logo-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64,
          filename: file.name
        })
      }).then(res => res.json())
      
      if (response.success) {
        settings.value.logo.mainLogo = response.data.url
        // Save settings to database
        await saveSettings()
        alert('تم رفع اللوجو بنجاح!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading main logo:', error)
      alert('حدث خطأ أثناء رفع اللوجو: ' + (error.message || 'خطأ غير معروف'))
    }
  }
}

const handleFooterLogoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 2MB')
      return
    }
    
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      const response = await fetch('/api/admin/upload/logo-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64,
          filename: file.name
        })
      }).then(res => res.json())
      
      if (response.success) {
        settings.value.logo.footerLogo = response.data.url
        // Save settings to database
        await saveSettings()
        alert('تم رفع لوجو الفوتر بنجاح!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading footer logo:', error)
      alert('حدث خطأ أثناء رفع لوجو الفوتر: ' + (error.message || 'خطأ غير معروف'))
    }
  }
}

const handleFaviconUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (file.size > 500 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 500KB')
      return
    }
    
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      const response = await fetch('/api/admin/upload/logo-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64,
          filename: file.name
        })
      }).then(res => res.json())
      
      if (response.success) {
        settings.value.logo.favicon = response.data.url
        alert('تم رفع الأيقونة بنجاح!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading favicon:', error)
      alert('حدث خطأ أثناء رفع الأيقونة')
    }
  }
}

const loadSettings = async () => {
  try {
    const response = await $fetch('/api/admin/settings')
    if (response.success) {
      settings.value = response.data
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    // Keep default settings if API fails
  }
}

const saveSettings = async () => {
  try {
    const response = await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: settings.value
    })
    
    if (response.success) {
      // Update global settings state
      const { updateSettings } = useSettings()
      console.log('Updating settings:', settings.value)
      updateSettings(settings.value)
      
      // Force refresh of all components
      await nextTick()
      
      // Dispatch custom event to notify all components
      if (process.client) {
        window.dispatchEvent(new CustomEvent('settings-updated', { 
          detail: { settings: settings.value } 
        }))
      }
      
      return true
    } else {
      throw new Error('Failed to save settings')
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

const saveAllSettings = async () => {
  try {
    saving.value = true
    
    const success = await saveSettings()
    
    if (success) {
      // Force page refresh to ensure all components update
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
      // Show success message
      alert('تم حفظ الإعدادات بنجاح! سيتم تحديث الصفحة تلقائياً...')
    } else {
      throw new Error('Failed to save settings')
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('حدث خطأ أثناء حفظ الإعدادات')
  } finally {
    saving.value = false
  }
}

// Load settings on mount
onMounted(async () => {
  await loadSettings()
  
  // Also refresh global settings
  const { refreshSettings } = useSettings()
  await refreshSettings()
})

// Set page title
useHead({
  title: 'الإعدادات - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.settings-page {
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
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50;
}

.save-btn:disabled {
  @apply cursor-not-allowed;
}

.btn-icon {
  @apply w-4 h-4;
}

.settings-tabs {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
}

.tabs-container {
  @apply flex overflow-x-auto;
}

.tab-button {
  @apply flex items-center space-x-2 space-x-reverse px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors border-b-2 border-transparent whitespace-nowrap;
}

.tab-button.active {
  @apply text-purple-600 border-purple-600 bg-purple-50;
}

.tab-icon {
  @apply w-4 h-4;
}

.settings-content {
  @apply space-y-6;
}

.settings-section {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.section-header {
  @apply mb-6;
}

.section-title {
  @apply text-xl font-semibold text-gray-900;
}

.section-description {
  @apply text-gray-600 mt-1;
}

.settings-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.setting-card {
  @apply border border-gray-200 rounded-lg p-6;
}

.setting-header {
  @apply mb-4;
}

.setting-title {
  @apply text-lg font-medium text-gray-900;
}

.setting-description {
  @apply text-sm text-gray-600 mt-1;
}

.setting-content {
  @apply space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input,
.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.form-textarea {
  @apply resize-none;
}

.form-checkbox {
  @apply w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500;
}

/* Logo upload styles */
.logo-upload-area {
  @apply space-y-4;
}

.current-logo {
  @apply text-center;
}

.logo-preview {
  @apply max-w-32 max-h-20 object-contain mx-auto border border-gray-200 rounded-lg p-2;
}

.favicon-preview {
  @apply w-16 h-16 object-contain mx-auto border border-gray-200 rounded-lg p-2;
}

.logo-info {
  @apply text-sm text-gray-600 mt-2;
}

.upload-section {
  @apply text-center;
}

.file-input {
  @apply hidden;
}

.upload-button {
  @apply inline-flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer;
}

.upload-icon {
  @apply w-4 h-4;
}

.upload-hint {
  @apply text-xs text-gray-500 mt-2;
}

/* Slider styling */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  outline: none;
  border-radius: 8px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: #7c3aed;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.slider::-moz-range-thumb:hover {
  background: #7c3aed;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .settings-grid {
    @apply grid-cols-1;
  }
  
  .tabs-container {
    @apply flex-col;
  }
  
  .tab-button {
    @apply border-b border-r-0 border-r-2;
  }
}
</style>
