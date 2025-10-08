<template>
  <div class="index-content">
    <HeroSection @scroll-to-packages="scrollToPackages" />

    <!-- Search Section -->
    <SearchSection />
    
    <!-- Services -->
    <LazyServicesSection />
    
    <!-- Featured Packages -->
    <LazyFeaturedPackages />

    <!-- Saudi Destinations -->
    <LazySaudiDestinations data-aos="fade-up" />

    <!-- Global Destinations -->
    <LazyGlobalDestinations data-aos="fade-up" />

  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/HomeSections/HeroSection.vue'
import SearchSection from '~/components/HomeSections/searchSection.vue'
import LazyFeaturedPackages from '~/components/HomeSections/featuredPackages.vue'
import LazySaudiDestinations from '~/components/HomeSections/saudiDestinations.vue'
import LazyGlobalDestinations from '~/components/HomeSections/globalDestinations.vue'
import LazyServicesSection from '~/components/HomeSections/servicesSection.vue'

import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'

// OG image path (using hero section image as requested)
const ogImage = '/images/home/heroSection/hero-image.webp'

const { t, locale } = useI18n()

// SEO keywords (reuse service names from translations)
const keywords = [
  t('home.services.flight_reservations_desc'),
  t('home.services.hotel_reservations_desc'),
  t('home.services.tour_packages_desc'),
  t('home.services.travel_insurance_desc'),
  t('home.services.visa_services_desc'),
  t('home.services.international_driving_license_desc'),
  t('home.services.tourism_consultation_desc'),
  t('home.services.support_24_7_desc')
].join(', ')

useHead({
  title: `${t('common.app_title')} | ${t('home.hero.title')}`,
  meta: [
    { name: 'description', content: t('home.hero.subtitle') },
    { name: 'keywords', content: keywords },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('common.app_title')} | ${t('home.hero.title')}` },
    { property: 'og:description', content: t('home.hero.subtitle') },
    { property: 'og:image', content: ogImage },
    { property: 'og:locale', content: locale.value === 'ar' ? 'ar_SA' : 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${t('common.app_title')} | ${t('home.hero.title')}` },
    { name: 'twitter:description', content: t('home.hero.subtitle') },
    { name: 'twitter:image', content: ogImage }
  ]
})

const scrollToPackages = () => {
  const packagesSection = document.querySelector('#packages-section')
  if (packagesSection) {
    packagesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

definePageMeta({
  layout: 'default'
})
</script>