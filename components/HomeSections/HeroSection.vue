<template>
  <section class="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
    <!-- Video Background with fallback -->
    <div class="absolute inset-0 z-0">
      <!-- Background Video -->
      <video ref="videoRef" preload="auto" autoplay loop muted playsinline class="w-full h-full object-cover">
        <source v-if="isBase64Video(heroVideo)" :src="heroVideo" type="video/mp4">
        <source v-else :src="heroVideo" type="video/webm">
        <source v-else :src="heroVideo.replace('.webm', '.mp4')" type="video/mp4">
      </video>

      <!-- Gradient Overlay -->
      <div 
        class="absolute inset-0 bg-gradient-to-b from-black/20"
      ></div>
    </div>

    <!-- Content -->
    <div 
      class="relative z-10 container"
    >
      <!-- Main Heading with Sliding Text -->
      <h1 class="text-3xl text-capitalize sm:text-7xl md:text-7xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.2] md:leading-[1.1] text-wrap:balance mx-auto w-full text-center text-shadow min-h-[6em] sm:min-h-[4em] md:min-h-[3.3em] flex items-center justify-center">
        <div class="w-full flex items-center justify-center">
          <div class="w-[80%] sm:w-[85%] md:w-[90%]">
            <SlideText 
              :phrases="heroTitlePhrases"
              textColor="white"
              fontWeight="inherit"
              :transitionDelay="3000"
            />
          </div>
        </div>
      </h1>

      <!-- Animated Subheading -->
      <p 
        class="text-2xl text-white mb-10 max-w-4xl font-bold mx-auto tracking-wide leading-relaxed [text-wrap:balance]"
      >
        {{ heroSubtitle }}
      </p>

      <!-- Animated CTA Button -->
      <button
        @click="scrollToPackages"
        class="bg-primary-500 outline-none hover:bg-primary-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_4px_30px_rgba(255,255,255,0.25)] active:scale-105"
      >
        {{ heroCta }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import SlideText from '~/components/ui/SlideText.vue'

const { t, locale } = useI18n()
const emit = defineEmits<{
  (e: 'scroll-to-packages'): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

// Use site content composable
const { getHeroContent, init: initContent, reload: reloadContent } = useSiteContent()

// Watch for locale changes and reload content
watch(() => locale.value, async () => {
  await reloadContent()
})

// Get hero content with fallback to translations
const heroTitle = computed(() => {
  const customTitle = getHeroContent('title', locale.value === 'ar-SA' ? 'ar' : 'en')
  return customTitle || t('home.hero.title')
})

const heroSubtitle = computed(() => {
  const customSubtitle = getHeroContent('subtitle', locale.value === 'ar-SA' ? 'ar' : 'en')
  return customSubtitle || t('home.hero.subtitle')
})

const heroCta = computed(() => {
  const customCta = getHeroContent('cta', locale.value === 'ar-SA' ? 'ar' : 'en')
  return customCta || t('home.hero.cta')
})

const heroVideo = computed(() => {
  const customVideo = getHeroContent('video', locale.value === 'ar-SA' ? 'ar' : 'en')
  console.log('Hero Video:', customVideo)
  return customVideo || '/videos/hero/desktop/hero-desktop.webm'
})

// Watch for video changes and reload video element
watch(heroVideo, (newVideo) => {
  console.log('Video changed:', newVideo)
  if (videoRef.value) {
    videoRef.value.load() // Reload the video element
  }
})

// Check if image is base64 encoded
const isBase64Image = (imageSrc: string) => {
  return imageSrc && imageSrc.startsWith('data:image/')
}

// Create an array of phrases for the sliding text effect
const heroTitlePhrases = computed(() => {
  // Base title from custom content or i18n
  const baseTitle = heroTitle.value
  
  // Additional phrases that will morph with the base title
  // These should be translated or dynamically generated based on your needs
  if (locale.value === 'ar-SA') {
    return [
      baseTitle,
      'اكتشف عالماً من المغامرات',
      'تجارب لا تُنسى تنتظرك'
    ]
  } else {
    return [
      baseTitle,
      'Discover a World of Adventures',
      'Unforgettable Experiences Await'
    ]
  }
})

// Initialize content loading and video optimization
onMounted(async () => {
  // Load content from database
  await initContent()
  
  // Setup video optimization
  if (videoRef.value) {
    const { stop } = useIntersectionObserver(
      videoRef,
      ([{ isIntersecting }]) => {
        if (videoRef.value) {
          if (isIntersecting) {
            videoRef.value.play()
          } else {
            videoRef.value.pause()
          }
        }
      }
    )
  }
})

const scrollToPackages = () => {
  emit('scroll-to-packages')
}

// Check if video is base64 encoded
const isBase64Video = (videoSrc: string) => {
  return videoSrc && videoSrc.startsWith('data:video/')
}
</script>

<style>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* Ensure smooth font rendering */
h1,
p {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  /* Mobile-specific adjustments */
}

@media (max-width: 480px) {
  /* Small mobile adjustments */
}
</style>