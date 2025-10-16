<template>
  <section 
    class="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0 w-full h-full">
      <img 
        src="/images/about/hero-bg.jpeg" 
        alt="Business class airplane cabin with premium seating"
        class="w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>
    
    <div class="relative container mx-auto px-4 md:px-8 lg:px-12 text-center z-10">
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
        {{ props.content?.hero?.title?.[locale.startsWith('ar') ? 'ar' : 'en'] || $t('about.hero.title') }}
      </h1>
      <p class="text-base md:text-lg lg:text-xl text-white opacity-100 max-w-3xl mx-auto drop-shadow-md">
        {{ props.content?.hero?.subtitle?.[locale.startsWith('ar') ? 'ar' : 'en'] || $t('about.hero.subtitle') }}
      </p>
      <NuxtLink 
        :to="localePath('packages')" 
        class="mt-8 inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-md transition duration-300 shadow-lg"
      >
        {{ $t('about.hero.cta') }}
      </NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
const { locale } = useI18n();

// Receive content as prop from parent
const props = defineProps<{
  content?: any
}>()

// Debug
watch(() => props.content, (newVal) => {
  console.log('AboutHeroSection - props.content changed:', newVal)
  console.log('AboutHeroSection - hero.title.ar:', newVal?.hero?.title?.ar)
  console.log('AboutHeroSection - hero.title.en:', newVal?.hero?.title?.en)
  console.log('AboutHeroSection - current locale:', locale.value)
  
  // Get the correct locale key
  const localeKey = locale.value.startsWith('ar') ? 'ar' : 'en'
  console.log('AboutHeroSection - locale key:', localeKey)
  console.log('AboutHeroSection - will show:', newVal?.hero?.title?.[localeKey])
}, { deep: true, immediate: true })
</script>