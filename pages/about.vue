<template>
  <div class="about-page">
    <!-- First section: Hero with background image -->
    <AboutHeroSection :content="aboutContent" />
    
    <!-- Second section: Dark background -->
    <AgencyOverview :content="aboutContent" />
    
    <!-- Third section: Light background -->
    <AboutMissionSection :content="aboutContent" />
    
    <!-- Fourth section: Dark background -->
    <CoreValuesGrid :content="aboutContent" />
    
    <!-- Fifth section: Light background -->
    <!-- <HistoryTimeline /> -->
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import AboutHeroSection from '~/components/ui/about/AboutHeroSection.vue';
import AgencyOverview from '~/components/ui/about/AgencyOverview.vue';
import AboutMissionSection from '~/components/ui/about/AboutMissionSection.vue';
import CoreValuesGrid from '~/components/ui/about/CoreValuesGrid.vue';
// import HistoryTimeline from '~/components/ui/about/HistoryTimeline.vue';

// Load about content using useAsyncData for proper SSR
const { data: aboutContent, refresh: reloadAboutContent } = await useAsyncData(
  'about-content',
  () => $fetch('/api/admin/content/about').then(res => res.data),
  {
    lazy: false,
    server: true,
    // Transform the data to ensure it's reactive
    transform: (data) => {
      console.log('About content transformed:', data)
      return data
    }
  }
)

onMounted(() => {
  console.log('About page mounted, content:', aboutContent.value)
  console.log('Hero title AR:', aboutContent.value?.hero?.title?.ar)
  console.log('Hero title EN:', aboutContent.value?.hero?.title?.en)
})

// Watch aboutContent changes
watch(aboutContent, (newVal) => {
  console.log('aboutContent changed in about.vue:', newVal)
  console.log('New hero title AR:', newVal?.hero?.title?.ar)
}, { deep: true, immediate: true })

// Watch for route changes and reload content
watch(() => useRoute().path, async () => {
  console.log('Route changed, reloading about content...')
  await reloadAboutContent()
})

// Listen for content updates from admin panel
onMounted(() => {
  const handleContentUpdate = () => {
    console.log('Content update event received, reloading...')
    reloadAboutContent()
  }
  
  window.addEventListener('contentUpdated', handleContentUpdate)
  
  onUnmounted(() => {
    window.removeEventListener('contentUpdated', handleContentUpdate)
  })
})

useHead({
  title: 'About - World Trip Agency',
  meta: [
    { name: 'description', content: 'Learn about World Trip Agency Travel & Tourism agency, your gateway to unforgettable travel experiences.' }
  ]
})
</script>