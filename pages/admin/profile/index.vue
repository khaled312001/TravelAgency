<template>
  <div class="profile-page space-y-4">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">الملف الشخصي</h1>
          <p class="page-subtitle">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
        </div>
        <div class="header-right">
          <button @click="saveProfile" class="save-btn">
            <Icon name="lucide:save" class="btn-icon" />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Overview -->
    <div class="profile-overview">
      <div class="overview-card">
        <div class="profile-avatar">
          <div class="avatar-container">
            <img 
              v-if="profile.avatar" 
              :src="profile.avatar" 
              :alt="profile.name"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              <Icon name="lucide:user" class="avatar-icon" />
            </div>
            <button @click="changeAvatar" class="avatar-edit-btn">
              <Icon name="lucide:camera" class="edit-icon" />
            </button>
          </div>
        </div>
        
        <div class="profile-info">
          <h2 class="profile-name">{{ profile.name }}</h2>
          <p class="profile-email">{{ profile.email }}</p>
          <div class="profile-badges">
            <span class="badge role">{{ getRoleText(profile.role) }}</span>
            <span class="badge status" :class="profile.status">
              {{ getStatusText(profile.status) }}
            </span>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-item">
            <p class="stat-value">{{ profile.lastLogin }}</p>
            <p class="stat-label">آخر تسجيل دخول</p>
          </div>
          <div class="stat-item">
            <p class="stat-value">{{ profile.memberSince }}</p>
            <p class="stat-label">عضو منذ</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Tabs -->
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
          <!-- Personal Information -->
          <div v-if="activeTab === 'personal'" class="tab-panel">
            <div class="form-section">
              <h3 class="section-title">المعلومات الشخصية</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">الاسم الكامل</label>
                  <input 
                    v-model="profile.name" 
                    type="text" 
                    class="form-input"
                    placeholder="الاسم الكامل"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">البريد الإلكتروني</label>
                  <input 
                    v-model="profile.email" 
                    type="email" 
                    class="form-input"
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">رقم الهاتف</label>
                  <input 
                    v-model="profile.phone" 
                    type="tel" 
                    class="form-input"
                    placeholder="رقم الهاتف"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">المنصب</label>
                  <input 
                    v-model="profile.position" 
                    type="text" 
                    class="form-input"
                    placeholder="المنصب"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">القسم</label>
                  <select v-model="profile.department" class="form-select">
                    <option value="">اختر القسم</option>
                    <option value="management">الإدارة</option>
                    <option value="sales">المبيعات</option>
                    <option value="marketing">التسويق</option>
                    <option value="support">الدعم الفني</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">تاريخ الميلاد</label>
                  <input 
                    v-model="profile.birthDate" 
                    type="date" 
                    class="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="tab-panel">
            <div class="security-section">
              <div class="security-card">
                <h3 class="security-title">تغيير كلمة المرور</h3>
                <div class="security-form">
                  <div class="form-group">
                    <label class="form-label">كلمة المرور الحالية</label>
                    <div class="password-input">
                      <input 
                        v-model="passwordForm.currentPassword" 
                        :type="showCurrentPassword ? 'text' : 'password'" 
                        class="form-input"
                        placeholder="كلمة المرور الحالية"
                      />
                      <button @click="showCurrentPassword = !showCurrentPassword" class="password-toggle">
                        <Icon :name="showCurrentPassword ? 'lucide:eye-off' : 'lucide:eye'" class="toggle-icon" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">كلمة المرور الجديدة</label>
                    <div class="password-input">
                      <input 
                        v-model="passwordForm.newPassword" 
                        :type="showNewPassword ? 'text' : 'password'" 
                        class="form-input"
                        placeholder="كلمة المرور الجديدة"
                      />
                      <button @click="showNewPassword = !showNewPassword" class="password-toggle">
                        <Icon :name="showNewPassword ? 'lucide:eye-off' : 'lucide:eye'" class="toggle-icon" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">تأكيد كلمة المرور الجديدة</label>
                    <div class="password-input">
                      <input 
                        v-model="passwordForm.confirmPassword" 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        class="form-input"
                        placeholder="تأكيد كلمة المرور الجديدة"
                      />
                      <button @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
                        <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="toggle-icon" />
                      </button>
                    </div>
                  </div>
                  
                  <button @click="changePassword" class="change-password-btn">
                    <Icon name="lucide:key" class="btn-icon" />
                    تغيير كلمة المرور
                  </button>
                </div>
              </div>

              <div class="security-card">
                <h3 class="security-title">إعدادات الأمان</h3>
                <div class="security-settings">
                  <div class="setting-item">
                    <div class="setting-info">
                      <h4 class="setting-name">المصادقة الثنائية</h4>
                      <p class="setting-description">إضافة طبقة حماية إضافية لحسابك</p>
                    </div>
                    <div class="setting-control">
                      <label class="toggle-switch">
                        <input v-model="securitySettings.twoFactor" type="checkbox" />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="setting-item">
                    <div class="setting-info">
                      <h4 class="setting-name">تسجيل الخروج من جميع الأجهزة</h4>
                      <p class="setting-description">إنهاء جميع الجلسات النشطة</p>
                    </div>
                    <div class="setting-control">
                      <button @click="logoutAllDevices" class="logout-all-btn">
                        <Icon name="lucide:log-out" class="btn-icon" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                  
                  <div class="setting-item">
                    <div class="setting-info">
                      <h4 class="setting-name">إشعارات تسجيل الدخول</h4>
                      <p class="setting-description">تلقي إشعارات عند تسجيل الدخول من أجهزة جديدة</p>
                    </div>
                    <div class="setting-control">
                      <label class="toggle-switch">
                        <input v-model="securitySettings.loginNotifications" type="checkbox" />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="tab-panel">
            <div class="preferences-section">
              <div class="preferences-grid">
                <div class="preference-card">
                  <h3 class="preference-title">إعدادات الواجهة</h3>
                  <div class="preference-settings">
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4 class="setting-name">الوضع المظلم</h4>
                        <p class="setting-description">تفعيل الوضع المظلم للواجهة</p>
                      </div>
                      <div class="setting-control">
                        <label class="toggle-switch">
                          <input v-model="preferences.darkMode" type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4 class="setting-name">اللغة</h4>
                        <p class="setting-description">اختر لغة الواجهة</p>
                      </div>
                      <div class="setting-control">
                        <select v-model="preferences.language" class="preference-select">
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4 class="setting-name">المنطقة الزمنية</h4>
                        <p class="setting-description">اختر المنطقة الزمنية</p>
                      </div>
                      <div class="setting-control">
                        <select v-model="preferences.timezone" class="preference-select">
                          <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                          <option value="Asia/Dubai">دبي (GMT+4)</option>
                          <option value="Europe/London">لندن (GMT+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="preference-card">
                  <h3 class="preference-title">إعدادات الإشعارات</h3>
                  <div class="preference-settings">
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4 class="setting-name">إشعارات البريد الإلكتروني</h4>
                        <p class="setting-description">تلقي إشعارات عبر البريد الإلكتروني</p>
                      </div>
                      <div class="setting-control">
                        <label class="toggle-switch">
                          <input v-model="preferences.emailNotifications" type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4 class="setting-name">إشعارات النظام</h4>
                        <p class="setting-description">تلقي إشعارات النظام</p>
                      </div>
                      <div class="setting-control">
                        <label class="toggle-switch">
                          <input v-model="preferences.systemNotifications" type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <h4 class="setting-name">إشعارات الحجوزات</h4>
                        <p class="setting-description">تلقي إشعارات عند إنشاء حجوزات جديدة</p>
                      </div>
                      <div class="setting-control">
                        <label class="toggle-switch">
                          <input v-model="preferences.bookingNotifications" type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Log -->
          <div v-if="activeTab === 'activity'" class="tab-panel">
            <div class="activity-section">
              <div class="activity-header">
                <h3 class="activity-title">سجل النشاط</h3>
                <div class="activity-filters">
                  <select v-model="activityFilter" class="activity-select">
                    <option value="">جميع الأنشطة</option>
                    <option value="login">تسجيل الدخول</option>
                    <option value="logout">تسجيل الخروج</option>
                    <option value="update">تحديث البيانات</option>
                    <option value="create">إنشاء</option>
                    <option value="delete">حذف</option>
                  </select>
                </div>
              </div>
              
              <div class="activity-list">
                <div v-for="activity in filteredActivities" :key="activity.id" class="activity-item">
                  <div class="activity-icon">
                    <Icon :name="getActivityIcon(activity.type)" class="icon" />
                  </div>
                  <div class="activity-content">
                    <h4 class="activity-description">{{ activity.description }}</h4>
                    <p class="activity-details">{{ activity.details }}</p>
                    <p class="activity-time">{{ formatDateTime(activity.timestamp) }}</p>
                  </div>
                  <div class="activity-meta">
                    <span class="activity-type" :class="activity.type">
                      {{ getActivityTypeText(activity.type) }}
                    </span>
                  </div>
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
const activeTab = ref('personal')

const profile = ref({
  id: '',
  name: 'مدير النظام',
  email: 'info@worldtripagency.com',
  phone: '+966500982394',
  position: 'مدير عام',
  department: 'الإدارة',
  birthDate: '1990-01-01',
  role: 'super_admin',
  status: 'active',
  lastLogin: '',
  memberSince: '',
  avatar: null,
  preferences: {
    darkMode: false,
    language: 'ar',
    timezone: 'Asia/Riyadh',
    emailNotifications: true,
    systemNotifications: true,
    bookingNotifications: true
  },
  securitySettings: {
    twoFactor: false,
    loginNotifications: true
  }
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const securitySettings = computed(() => profile.value.securitySettings)
const preferences = computed(() => profile.value.preferences)

const activityFilter = ref('')

const activities = ref([])

const tabs = ref([
  { id: 'personal', name: 'المعلومات الشخصية', icon: 'lucide:user' },
  { id: 'security', name: 'الأمان', icon: 'lucide:shield' },
  { id: 'preferences', name: 'التفضيلات', icon: 'lucide:settings' },
  { id: 'activity', name: 'سجل النشاط', icon: 'lucide:activity' }
])

const filteredActivities = computed(() => {
  if (!activityFilter.value) return activities.value
  return activities.value.filter(activity => activity.type === activityFilter.value)
})

const getRoleText = (role: string) => {
  const roleMap = {
    super_admin: 'مدير عام',
    admin: 'مدير',
    manager: 'مدير قسم',
    employee: 'موظف'
  }
  return roleMap[role] || role
}

const getStatusText = (status: string) => {
  const statusMap = {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'معلق'
  }
  return statusMap[status] || status
}

const getActivityIcon = (type: string) => {
  const iconMap = {
    login: 'lucide:log-in',
    logout: 'lucide:log-out',
    update: 'lucide:edit',
    create: 'lucide:plus',
    delete: 'lucide:trash-2'
  }
  return iconMap[type] || 'lucide:activity'
}

const getActivityTypeText = (type: string) => {
  const typeMap = {
    login: 'تسجيل دخول',
    logout: 'تسجيل خروج',
    update: 'تحديث',
    create: 'إنشاء',
    delete: 'حذف'
  }
  return typeMap[type] || type
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ar-SA')
}

const loadProfileData = async () => {
  try {
    const { getAuthHeaders } = useAdminAuth()
    const headers = getAuthHeaders()
    
    // Load user profile data
    const profileResponse = await $fetch('/api/admin/auth/me', { headers })
    if (profileResponse.success && profileResponse.user) {
      const user = profileResponse.user
      profile.value = {
        ...profile.value,
        id: user.id,
        name: user.name || 'مدير النظام',
        email: user.email,
        role: user.role || 'super_admin',
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleString('ar-SA') : '',
        memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : ''
      }
    }

    // Load activity log
    const activityResponse = await $fetch('/api/admin/auth/activity', { 
      headers,
      query: { limit: 20 }
    })
    if (activityResponse.success && activityResponse.activities) {
      activities.value = activityResponse.activities
    }
  } catch (error) {
    console.error('Error loading profile data:', error)
  }
}

const changeAvatar = () => {
  console.log('Change avatar...')
}

const saveProfile = async () => {
  try {
    // Show loading state
    const saveBtn = document.querySelector('.save-btn') as HTMLButtonElement
    if (saveBtn) {
      saveBtn.disabled = true
      saveBtn.innerHTML = '<Icon name="lucide:loader-2" class="btn-icon animate-spin" /> جاري الحفظ...'
    }

    const { getAuthHeaders } = useAdminAuth()
    const headers = getAuthHeaders()

    // Save profile data
    const response = await $fetch('/api/admin/auth/profile', {
      method: 'PUT',
      headers,
      body: {
        name: profile.value.name,
        email: profile.value.email
      }
    })

    if (response.success) {
      // Update local profile data
      profile.value = { ...profile.value, ...response.user }
      
      // Show success message
      alert('تم حفظ معلومات الملف الشخصي بنجاح!')
      
      // Reload activity log
      await loadProfileData()
    } else {
      throw new Error('Failed to save profile')
    }
  } catch (error: any) {
    console.error('Error saving profile:', error)
    alert(error.data?.message || 'حدث خطأ أثناء حفظ الملف الشخصي')
  } finally {
    // Reset button state
    const saveBtn = document.querySelector('.save-btn') as HTMLButtonElement
    if (saveBtn) {
      saveBtn.disabled = false
      saveBtn.innerHTML = '<Icon name="lucide:save" class="btn-icon" /> حفظ التغييرات'
    }
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('كلمة المرور الجديدة وتأكيدها غير متطابقتين')
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    return
  }

  try {
    const { getAuthHeaders } = useAdminAuth()
    const headers = getAuthHeaders()

    const response = await $fetch('/api/admin/auth/profile', {
      method: 'PUT',
      headers,
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    })

    if (response.success) {
      alert('تم تغيير كلمة المرور بنجاح!')
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      await loadProfileData()
    } else {
      throw new Error('Failed to change password')
    }
  } catch (error: any) {
    console.error('Error changing password:', error)
    alert(error.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور')
  }
}

const logoutAllDevices = async () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج من جميع الأجهزة؟')) {
    try {
      const { logout } = useAdminAuth()
      await logout()
      await navigateTo('/admin/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
}

// Save preferences
const savePreferences = async () => {
  try {
    const { getAuthHeaders } = useAdminAuth()
    const headers = getAuthHeaders()

    const response = await $fetch('/api/admin/auth/preferences', {
      method: 'PUT',
      headers,
      body: {
        preferences: preferences.value,
        securitySettings: securitySettings.value
      }
    })

    if (response.success) {
      alert('تم حفظ التفضيلات بنجاح!')
      await loadProfileData()
    } else {
      throw new Error('Failed to save preferences')
    }
  } catch (error: any) {
    console.error('Error saving preferences:', error)
    alert(error.data?.message || 'حدث خطأ أثناء حفظ التفضيلات')
  }
}

// Watch for changes in preferences and security settings
watch([preferences, securitySettings], () => {
  // Auto-save preferences after 2 seconds of no changes
  clearTimeout(saveTimeout.value)
  saveTimeout.value = setTimeout(() => {
    savePreferences()
  }, 2000)
}, { deep: true })

const saveTimeout = ref(null)

// Load profile data on mount
onMounted(() => {
  loadProfileData()
})

// Set page title
useHead({
  title: 'الملف الشخصي - لوحة التحكم'
})

// Apply admin auth middleware and layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})
</script>

<style scoped>
.profile-page {
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

.profile-overview {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.overview-card {
  @apply flex items-center space-x-6 space-x-reverse;
}

.profile-avatar {
  @apply flex-shrink-0;
}

.avatar-container {
  @apply relative;
}

.avatar-image {
  @apply w-24 h-24 rounded-full object-cover;
}

.avatar-placeholder {
  @apply w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center;
}

.avatar-icon {
  @apply w-12 h-12 text-gray-400;
}

.avatar-edit-btn {
  @apply absolute bottom-0 right-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors;
}

.edit-icon {
  @apply w-4 h-4;
}

.profile-info {
  @apply flex-1;
}

.profile-name {
  @apply text-2xl font-bold text-gray-900;
}

.profile-email {
  @apply text-gray-600 mt-1;
}

.profile-badges {
  @apply flex space-x-2 space-x-reverse mt-3;
}

.badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
}

.badge.role {
  @apply bg-purple-100 text-purple-800;
}

.badge.status {
  @apply bg-green-100 text-green-800;
}

.badge.status.inactive {
  @apply bg-gray-100 text-gray-800;
}

.badge.status.suspended {
  @apply bg-red-100 text-red-800;
}

.profile-stats {
  @apply flex space-x-6 space-x-reverse;
}

.stat-item {
  @apply text-center;
}

.stat-value {
  @apply text-sm font-semibold text-gray-900;
}

.stat-label {
  @apply text-xs text-gray-600;
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

.form-section {
  @apply space-y-6;
}

.section-title {
  @apply text-lg font-semibold text-gray-900;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.security-section {
  @apply space-y-6;
}

.security-card {
  @apply space-y-4;
}

.security-title {
  @apply text-lg font-semibold text-gray-900;
}

.security-form {
  @apply space-y-4;
}

.password-input {
  @apply relative;
}

.password-toggle {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600;
}

.toggle-icon {
  @apply w-4 h-4;
}

.change-password-btn {
  @apply flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.security-settings {
  @apply space-y-4;
}

.setting-item {
  @apply flex items-center justify-between p-4 bg-gray-50 rounded-lg;
}

.setting-info {
  @apply flex-1;
}

.setting-name {
  @apply text-sm font-medium text-gray-900;
}

.setting-description {
  @apply text-xs text-gray-600 mt-1;
}

.setting-control {
  @apply flex-shrink-0;
}

.toggle-switch {
  @apply relative inline-block w-10 h-6;
}

.toggle-switch input {
  @apply opacity-0 w-0 h-0;
}

.toggle-slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300;
}

.toggle-slider:before {
  content: '';
  @apply absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-all duration-300;
}

.toggle-switch input:checked + .toggle-slider {
  @apply bg-purple-600;
}

.toggle-switch input:checked + .toggle-slider:before {
  @apply transform translate-x-4;
}

.logout-all-btn {
  @apply flex items-center space-x-2 space-x-reverse px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm;
}

.preferences-section {
  @apply space-y-6;
}

.preferences-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.preference-card {
  @apply space-y-4;
}

.preference-title {
  @apply text-lg font-semibold text-gray-900;
}

.preference-settings {
  @apply space-y-4;
}

.preference-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.activity-section {
  @apply space-y-6;
}

.activity-header {
  @apply flex items-center justify-between;
}

.activity-title {
  @apply text-lg font-semibold text-gray-900;
}

.activity-filters {
  @apply flex space-x-3 space-x-reverse;
}

.activity-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.activity-list {
  @apply space-y-4;
}

.activity-item {
  @apply flex items-start space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg;
}

.activity-icon {
  @apply w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.activity-icon .icon {
  @apply w-5 h-5 text-purple-600;
}

.activity-content {
  @apply flex-1;
}

.activity-description {
  @apply text-sm font-medium text-gray-900;
}

.activity-details {
  @apply text-xs text-gray-600 mt-1;
}

.activity-time {
  @apply text-xs text-gray-500 mt-2;
}

.activity-meta {
  @apply flex-shrink-0;
}

.activity-type {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

.activity-type.login {
  @apply bg-green-100 text-green-800;
}

.activity-type.logout {
  @apply bg-gray-100 text-gray-800;
}

.activity-type.update {
  @apply bg-blue-100 text-blue-800;
}

.activity-type.create {
  @apply bg-purple-100 text-purple-800;
}

.activity-type.delete {
  @apply bg-red-100 text-red-800;
}
</style>
