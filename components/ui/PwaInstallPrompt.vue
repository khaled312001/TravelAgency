<template>
  <Transition name="pwa-prompt" enter-active-class="transform transition-transform duration-300"
    enter-class="translate-y-full md:translate-y-0 md:opacity-0" enter-to-class="translate-y-0 md:opacity-100"
    leave-active-class="transform transition-transform duration-300" leave-class="translate-y-0 md:opacity-100"
    leave-to-class="translate-y-full md:translate-y-0 md:opacity-0">
    <div v-if="visible" class="pwa-install-prompt fixed z-50" :class="[
      isMobile
        ? 'bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-t-2xl'
        : 'bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xl'
    ]">
      <!-- Mobile version -->
      <div v-if="isMobile" class="mobile-pwa-prompt">
        <!-- Header and close button -->
        <div class="relative px-5 pt-6 pb-3 flex items-center justify-between">
          <h3 class="text-xl font-bold dark:text-white text-center flex-grow">{{ $t('pwa.installPrompt.title') }}</h3>
          <button @click="dismiss"
            class="absolute right-4 top-5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
            aria-label="Close">
            <Icon name="material-symbols:close" class="h-6 w-6" />
          </button>
        </div>

        <!-- Indicator line for draggable UI (mobile design pattern) -->
        <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>

        <!-- Screenshots carousel -->
        <div class="screenshot-carousel relative mb-4">
          <div class="screenshots-container relative overflow-hidden h-48 mx-4 rounded-xl">
            <div class="screenshots-wrapper flex transition-transform duration-300"
              :style="{ transform: `translateX(-${activeMobileScreenshot * 100}%)` }">
              <div v-for="(screenshot, index) in mobileScreenshots" :key="index"
                class="screenshot-item flex-shrink-0 w-full h-full relative">
                <img :src="screenshot.path" :alt="screenshot.alt" class="w-full h-full object-contain"
                  @error="handleImageError" />
              </div>
            </div>

            <!-- Navigation dots -->
            <div class="absolute bottom-2 left-0 right-0 flex justify-center">
              <button v-for="(_, index) in mobileScreenshots" :key="index" @click="activeMobileScreenshot = index"
                class="w-2.5 h-2.5 mx-1 rounded-full transition-colors duration-200"
                :class="activeMobileScreenshot === index ? 'bg-primary-500' : 'bg-gray-300 hover:bg-gray-400'"
                :aria-label="`View screenshot ${index + 1}`"></button>
            </div>
          </div>
        </div>

        <!-- Description and features -->
        <div class="px-5 mb-4">
          <p class="text-gray-600 dark:text-gray-300 mb-4 text-center">{{ $t('pwa.installPrompt.description') }}</p>

          <div class="features-grid grid grid-cols-1 gap-3">
            <div class="feature-item flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="w-8 h-8 mr-3 flex-shrink-0 text-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="dark:text-gray-200 text-sm font-medium">{{ $t('pwa.installPrompt.features.offline') }}</span>
            </div>

            <div class="feature-item flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="w-8 h-8 mr-3 flex-shrink-0 text-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="dark:text-gray-200 text-sm font-medium">{{ $t('pwa.installPrompt.features.faster') }}</span>
            </div>

            <div class="feature-item flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="w-8 h-8 mr-3 flex-shrink-0 text-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="dark:text-gray-200 text-sm font-medium">{{ $t('pwa.installPrompt.features.homescreen')
                }}</span>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="px-5 pb-6 flex flex-col gap-3">
          <button @click="install"
            class="w-full py-3.5 bg-primary-500 text-white rounded-xl text-base font-semibold hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            {{ $t('pwa.installPrompt.buttons.install') }}
          </button>

          <button @click="dismiss"
            class="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-2">
            {{ $t('pwa.installPrompt.buttons.dismiss') }}
          </button>
        </div>
      </div>

      <!-- Desktop version -->
      <div v-else class="desktop-pwa-prompt">
        <!-- Header and close button -->
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-bold dark:text-white">{{ $t('pwa.installPrompt.title') }}</h3>
          <button @click="dismiss"
            class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
            aria-label="Close">
            <Icon name="material-symbols:close" class="h-5 w-5" />
          </button>
        </div>

        <!-- Screenshot carousel -->
        <div class="screenshot-carousel relative mb-3">
          <div class="screenshots-container relative overflow-hidden h-36 rounded-lg">
            <div class="screenshots-wrapper flex transition-transform duration-300"
              :style="{ transform: `translateX(-${activeScreenshot * 100}%)` }">
              <div v-for="(screenshot, index) in desktopScreenshots" :key="index"
                class="screenshot-item flex-shrink-0 w-full h-full relative">
                <img :src="screenshot.path" :alt="screenshot.alt" class="w-full h-full object-contain"
                  @error="handleImageError" />
              </div>
            </div>

            <!-- Navigation dots -->
            <div class="absolute bottom-2 left-0 right-0 flex justify-center">
              <button v-for="(_, index) in desktopScreenshots" :key="index" @click="activeScreenshot = index"
                class="w-2 h-2 mx-1 rounded-full transition-colors duration-200"
                :class="activeScreenshot === index ? 'bg-primary-500' : 'bg-gray-300 hover:bg-gray-400'"
                :aria-label="`View screenshot ${index + 1}`"></button>
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ $t('pwa.installPrompt.description') }}</p>

        <!-- Features in a more compact form -->
        <div class="features mb-4 text-sm">
          <div class="flex items-center mb-1.5">
            <div class="w-5 h-5 mr-2 flex-shrink-0 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="dark:text-gray-200">{{ $t('pwa.installPrompt.features.offline') }}</span>
          </div>
          <div class="flex items-center mb-1.5">
            <div class="w-5 h-5 mr-2 flex-shrink-0 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="dark:text-gray-200">{{ $t('pwa.installPrompt.features.faster') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-5 h-5 mr-2 flex-shrink-0 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="dark:text-gray-200">{{ $t('pwa.installPrompt.features.homescreen') }}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-between gap-3">
          <button @click="dismiss"
            class="w-[150px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-1">
            {{ $t('pwa.installPrompt.buttons.dismiss') }}
          </button>
          <button @click="install"
            class="w-[150px] px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1">
            {{ $t('pwa.installPrompt.buttons.install') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Define screenshots separated by type
const desktopScreenshots = [
  { path: '/screenshots/desktop-home.png', alt: 'Desktop Home' },
  { path: '/screenshots/desktop-packages.png', alt: 'Desktop Packages' }
]

const mobileScreenshots = [
  { path: '/screenshots/mobile-home.png', alt: 'Mobile Home' },
  { path: '/screenshots/mobile-packages.png', alt: 'Mobile Packages' }
]

// Check if viewport is mobile
const isMobile = ref(false)

// Screenshot carousel functionality
const activeScreenshot = ref(0)
const activeMobileScreenshot = ref(0)
const screenshotInterval = ref<number | null>(null)
const visible = ref(true)

// Check viewport size
const checkViewport = () => {
  isMobile.value = window.innerWidth < 768 // md breakpoint
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  // Set a fallback image
  target.src = '/images/default-screenshot.png'
}

// Start automatic rotation of screenshots
const startScreenshotRotation = () => {
  screenshotInterval.value = window.setInterval(() => {
    activeScreenshot.value = (activeScreenshot.value + 1) % desktopScreenshots.length
    activeMobileScreenshot.value = (activeMobileScreenshot.value + 1) % mobileScreenshots.length
  }, 5000) // Change screenshot every 5 seconds
}

// Stop the rotation
const stopScreenshotRotation = () => {
  if (screenshotInterval.value !== null) {
    clearInterval(screenshotInterval.value)
    screenshotInterval.value = null
  }
}

// Handle installation action - emit to parent component
const install = () => {
  emit('install')
}

// Handle dismissal action - emit to parent component
const dismiss = () => {
  emit('dismiss')
}

// Define props and emits
const emit = defineEmits(['install', 'dismiss'])

// Lifecycle hooks
onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
  startScreenshotRotation()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkViewport)
  stopScreenshotRotation()
})
</script>

<style scoped>
/* Add additional styles if needed */
</style>
