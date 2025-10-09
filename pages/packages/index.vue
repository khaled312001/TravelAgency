<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-cover bg-center py-20">
      <div class="absolute inset-0">
        <img
          src="/images/packages/home/packages-hero-bg.jpeg"
          alt="Stunning beachfront villa with private pool and ocean views"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0"></div>
      </div>
      <div class="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 class="mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
          {{ $t('packages.title') }}
        </h1>
        <p class="mb-8 text-xl md:text-2xl">
          {{ $t('packages.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Packages Grid -->
    <section class="py-16">
      <div class="container">
        <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ $t('common.error') }}
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PackageCard
            v-for="(package_, index) in packages"
            :key="index"
            :package_="package_"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Package } from '~/composables/usePackages'

import PackageCard from '~/components/packages/PackageCard.vue'
const { getPackages } = usePackages()

// SEO Meta Tags
useHead({
  title: 'باقات السفر المتميزة - أرض العجائب للسفر | رحلات عمرة وحج وسياحة',
  meta: [
    {
      name: 'description',
      content: 'اكتشف أفضل باقات السفر في المملكة العربية السعودية. رحلات عمرة وحج متميزة، سياحة داخلية وخارجية، باقات سفر إلى دبي، تركيا، ماليزيا، تايلاند وأكثر. أسعار منافسة وخدمة 24/7.'
    },
    {
      name: 'keywords',
      content: 'باقات سفر, رحلات عمرة, رحلات حج, سياحة السعودية, رحلات دبي, رحلات تركيا, رحلات ماليزيا, رحلات تايلاند, وكالة سفر الرياض, سفر وسياحة, رحلات خارجية, رحلات داخلية'
    },
    { property: 'og:title', content: 'باقات السفر المتميزة - أرض العجائب للسفر' },
    { property: 'og:description', content: 'اكتشف أفضل باقات السفر في المملكة العربية السعودية. رحلات عمرة وحج متميزة، سياحة داخلية وخارجية.' },
    { property: 'og:url', content: 'https://www.worldtripagency.com/packages' },
    { name: 'twitter:title', content: 'باقات السفر المتميزة - أرض العجائب للسفر' },
    { name: 'twitter:description', content: 'اكتشف أفضل باقات السفر في المملكة العربية السعودية. رحلات عمرة وحج متميزة، سياحة داخلية وخارجية.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.worldtripagency.com/packages' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "باقات السفر المتميزة",
        "description": "مجموعة شاملة من باقات السفر المتميزة تشمل رحلات عمرة وحج وسياحة داخلية وخارجية",
        "url": "https://www.worldtripagency.com/packages",
        "numberOfItems": "50+",
        "itemListElement": [
          {
            "@type": "TravelPackage",
            "name": "رحلات العمرة",
            "description": "باقات عمرة متميزة من جميع مدن المملكة العربية السعودية",
            "url": "https://www.worldtripagency.com/packages/umrah"
          },
          {
            "@type": "TravelPackage", 
            "name": "رحلات الحج",
            "description": "باقات حج شاملة مع أفضل الخدمات والرعاية",
            "url": "https://www.worldtripagency.com/packages/hajj"
          },
          {
            "@type": "TravelPackage",
            "name": "رحلات دبي",
            "description": "باقات سفر متميزة إلى دبي مع أفضل الفنادق والأنشطة",
            "url": "https://www.worldtripagency.com/packages/dubai"
          },
          {
            "@type": "TravelPackage",
            "name": "رحلات تركيا",
            "description": "باقات سفر شاملة إلى تركيا مع جولات سياحية متميزة",
            "url": "https://www.worldtripagency.com/packages/turkey"
          },
          {
            "@type": "TravelPackage",
            "name": "رحلات ماليزيا",
            "description": "باقات سفر إلى ماليزيا مع أفضل المعالم السياحية",
            "url": "https://www.worldtripagency.com/packages/malaysia"
          }
        ]
      })
    }
  ]
})

const {
  data: packages,
  pending,
  error
} = await useAsyncData<Package[]>('packages', () => getPackages(), {
  default: () => []
})

</script>
