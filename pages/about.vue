<template>
  <div class="about-page">
    <!-- First section: Hero with background image -->
    <AboutHeroSection
      title="about.hero.title"
      subtitle="about.hero.subtitle"
      cta="about.hero.cta"
      backgroundImage="/images/about/hero.jpg"
    />
    
    <!-- Second section: Dark background -->
    <AgencyOverview />
    
    <!-- Third section: Light background -->
    <AboutMissionSection />
    
    <!-- Fourth section: Dark background -->
    <CoreValuesGrid />
    
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

// Load about content on page mount
const { loadAboutContent, aboutContent, reloadAboutContent } = useAboutContent()

onMounted(async () => {
  console.log('About page mounted, loading content...')
  await loadAboutContent()
  console.log('About content loaded:', aboutContent.value)
})

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