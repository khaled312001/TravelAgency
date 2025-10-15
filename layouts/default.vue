<template>
  <div>
    <DirectionHandler />
    <header class="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <nav class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <NuxtLink :to="localpath('/')" class="flex items-center group transition-all duration-300 hover:scale-105">
            <div class="relative">
              <img 
                :src="`${getLocalizedSetting('logo', 'mainLogo') || '/images/home/logo/WonderlandLogo.svg'}?t=${Date.now()}`" 
                :style="`height: ${getSetting('logo', 'logoHeight') || 48}px; width: auto;`"
                :alt="getLocalizedSetting('general', 'siteName') || 'World Trip Agency Agency Logo'" 
                loading="eager"
                class="transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            <span v-if="getSetting('logo', 'showLogoText')" class="font-bold text-xl font-italic text-primary-900 ml-3 transition-colors duration-300 group-hover:text-primary-700">
              {{ getLocalizedSetting('logo', 'logoText') || $t('common.app_title') }}
            </span>
          </NuxtLink>
          
          <div class="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <NuxtLink 
              v-for="(item, index) in navItems" 
              :key="index"
              :to="localpath(item.to)"
              :class="[
                'relative px-3 py-2 rounded-lg transition-all duration-300 font-medium',
                $route.path == localpath(item.to) 
                  ? 'text-primary-900 bg-primary/10 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-900 hover:bg-gray-50'
              ]"
            >
              {{ $t(item.label) }}
              <span 
                v-if="$route.path == localpath(item.to)"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
              ></span>
            </NuxtLink>
            <!-- Language Switcher -->
            <button
              @click.prevent.stop="toggleLanguage"
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span class="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="lucide:globe" class="w-4 h-4" />
                <span>{{ currentLocale === 'en-US' ? 'العربية' : 'English' }}</span>
              </span>
            </button>
          </div>
          <!-- Mobile Menu Button -->
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-900 hover:bg-gray-100 transition-all duration-300"
          >
            <span class="sr-only">Menu</span>
            <Icon 
              :name="isMenuOpen ? 'lucide:x' : 'lucide:menu'" 
              class="h-6 w-6 transition-transform duration-300"
              :class="{ 'rotate-90': isMenuOpen }"
            />
          </button>
        </div>
        <!-- Mobile Menu -->
        <div
          v-show="isMenuOpen"
          class="md:hidden mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-in slide-in-from-top-2 duration-300"
        >
          <NuxtLink
            v-for="(item, index) in navItems"
            :key="index"
            :to="localpath(item.to)"
            :class="[
              'block px-4 py-3 rounded-lg transition-all duration-300 font-medium',
              $route.path == localpath(item.to) 
                ? 'text-primary-900 bg-primary/10 border-l-4 border-primary' 
                : 'text-gray-600 hover:text-primary-900 hover:bg-white'
            ]"
            @click="isMenuOpen = false"
          >
            {{ $t(item.label) }}
          </NuxtLink>
          <button
            @click="toggleLanguage"
            class="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-md"
          >
            <Icon name="lucide:globe" class="w-4 h-4" />
            <span>{{ currentLocale === 'en-US' ? 'العربية' : 'English' }}</span>
          </button>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>
    <AppFooter />
    <FloatingButtons />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppFooter from '~/components/layout/AppFooter.vue';
import FloatingButtons from '~/components/ui/FloatingButtons.vue';
const { locale } = useI18n()
const localpath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = computed(() => locale.value)
const isMenuOpen = ref(false)
const isTransitioning = ref(false)
const { startLocaleTransition } = useViewTransition()

// Load settings
const { settings, loadSettings, getSetting, getLocalizedSetting, addSettingsUpdateListener } = useSettings()
onMounted(async () => {
  await loadSettings()
  
  // Listen for settings updates
  addSettingsUpdateListener(async () => {
    await loadSettings()
  })
})

const navItems = [
  { to: '/', label: 'nav.home' },
  { to: '/packages', label: 'nav.packages' },
  { to: '/about', label: 'nav.about' },
  // { to: '/contact', label: 'nav.contact' }
]

// Use enhanced direction-aware view transition for language switching
const toggleLanguage = async () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  const currentLocaleValue = locale.value
  const targetLocale = currentLocaleValue === 'ar-SA' ? 'en-US' : 'ar-SA'
  
  try {
    // Use the enhanced direction-aware locale transition
    await startLocaleTransition(
      async () => {
        // Set locale client-side
        locale.value = targetLocale
        
        // Wait for locale to fully apply
        await nextTick()
        
        // Update URL without reload using history API - only on client side
        if (process.client) {
          const path = switchLocalePath(targetLocale)
          window.history.replaceState(null, '', path)
        }
      },
      currentLocaleValue,  // From locale
      targetLocale        // To locale
    )
  } finally {
    // Always reset the transitioning state
    isTransitioning.value = false
  }
}
</script>

<style>
.router-link-active {
  color: var(--color-primary);
  font-weight: 500;
}

/* View Transitions */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(package-*),
::view-transition-new(package-*) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(package-image-*),
::view-transition-new(package-image-*) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(package-content-*),
::view-transition-new(package-content-*) {
  animation: none;
  mix-blend-mode: normal;
}

/* Language transition - specialized for locale changes */
.locale-transitioning {
  pointer-events: none;
}

/* Different opacity levels for main content vs. navigation elements */
.locale-transitioning header,
.locale-transitioning footer {
  transition: opacity 300ms;
  opacity: 0.8;
  will-change: opacity;
}

.locale-transitioning main {
  transition: all 300ms;
  will-change: transform, opacity;
}

/* Direction-specific transitions - these are now handled in transitions.css */
/* RTL support for view transitions */
:root[dir="rtl"] {
  ::view-transition-old(*) {
    animation-direction: reverse;
  }
  ::view-transition-new(*) {
    animation-direction: reverse;
  }
}

/* Only apply these page transitions for page navigation, not language switches */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* RTL transitions */
:root[dir="rtl"] {
  .page-enter-from {
    transform: translateX(-20px);
  }
  .page-leave-to {
    transform: translateX(20px);
  }
}

html.locale-transitioning main {
  view-transition-name: locale-main;
}

/* Enhanced header animations */
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slideInFromTop 0.3s ease-out;
}

.slide-in-from-top-2 {
  animation: slideInFromTop 0.3s ease-out;
}

/* Logo hover effects */
.group:hover img {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* Navigation link hover effects */
nav a {
  position: relative;
  overflow: hidden;
}

nav a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

nav a:hover::before {
  left: 100%;
}

/* Mobile menu backdrop blur effect */
@media (max-width: 768px) {
  .md\\:hidden {
    backdrop-filter: blur(10px);
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for mobile menu */
.md\\:hidden::-webkit-scrollbar {
  width: 4px;
}

.md\\:hidden::-webkit-scrollbar-track {
  background: transparent;
}

.md\\:hidden::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.md\\:hidden::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>