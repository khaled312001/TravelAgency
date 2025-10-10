<template>
  <section class="py-16 bg-surface-container" data-aos="fade-up">
    <div class="container">
      <div class="text-center mb-12" data-aos="fade-down">
        <h2 class="text-4xl md:text-5xl font-bold  mb-6 leading-tight">
          {{ saudiTitle }}
        </h2>
        <p class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ saudiSubtitle }}
        </p>
      </div>
      
      <Carousel 
        v-if="saudiDestinations && saudiDestinations.length > 0"
        :items="saudiDestinations"
        @change="handleSlideChange"
      >
        <template #default="{ item: destination, index }">
          <DestinationCard
            :destination="destination"
            :delay="150 * index"
            class="h-full"
          />
        </template>
      </Carousel>

      <div v-else class="text-center text-gray-500">
        {{ t('common.no_destinations') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'
import { useDestinations } from '~/composables/useDestinations'
import DestinationCard from '~/components/destinations/DestinationCard.vue'
import Carousel from '~/components/ui/Carousel.vue'

const { t, locale } = useI18n()
const { saudiDestinations } = useDestinations()
const localePath = useLocalePath()

// Use site content composable
const { getDestinationsContent, init: initContent } = useSiteContent()

// Initialize content
onMounted(async () => {
  await initContent()
})

// Get Saudi destinations content with fallback to translations
const saudiTitle = computed(() => {
  const customTitle = getDestinationsContent('saudi', 'title', locale.value === 'ar-SA' ? 'ar' : 'en')
  return customTitle || t('home.destinations.saudi.title')
})

const saudiSubtitle = computed(() => {
  const customSubtitle = getDestinationsContent('saudi', 'subtitle', locale.value === 'ar-SA' ? 'ar' : 'en')
  return customSubtitle || t('home.destinations.saudi.subtitle')
})

const handleSlideChange = (index: number) => {
  // Handle slide change if needed
}

// SEO Optimization
useHead({
  title: computed(() => `${t('home.destinations.saudi.title')} | World Trip Agency Agency`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('home.destinations.saudi.subtitle'))
    },
    {
      property: 'og:title',
      content: computed(() => t('home.destinations.saudi.title'))
    },
    {
      property: 'og:description',
      content: computed(() => t('home.destinations.saudi.subtitle'))
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:image',
      content: computed(() => saudiDestinations.value?.[0]?.mainImage || '')
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: saudiDestinations.value?.map((destination, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'TouristDestination',
            name: destination.name[locale.value.slice(0, 2)],
            description: destination.description[locale.value.slice(0, 2)],
            image: destination.mainImage,
            url: `${localePath('/destinations')}/${destination.id}`
          }
        }))
      }))
    }
  ]
})
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
