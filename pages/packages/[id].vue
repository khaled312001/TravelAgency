<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <span class="sr-only">{{ $t('common.loading') }}</span>
    </div>

    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('common.error') }}</h1>
      <p class="text-gray-600 mb-8">{{ error.message }}</p>
      <NuxtLink 
        to="/" 
        class="rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-dark transition-colors"
      >
        {{ $t('common.back_home') }}
      </NuxtLink>
    </div>

    <div 
      v-else-if="package_ && package_.id" 
      class="relative min-h-screen"
    >
      <!-- Hero Section -->
      <div 
        class="relative h-[40vh] md:h-[60vh]"
        :style="{
          viewTransitionName: `package-image-${package_.id}`
        }"
      >
        <img
          :src="package_.hero_image_url || package_.image_url"
          class="h-full w-full object-cover"
          :alt="$i18n.locale === 'ar-SA' ? package_.title_ar : package_.title_en"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <!-- Content -->
      <div 
        class="relative z-10 -mt-32 rounded-t-[2.5rem] bg-surface px-4 pb-20 pt-12 md:px-8"
        :style="{
          viewTransitionName: `package-content-${package_.id}`
        }"
      >
        <PackageDetails 
          :package_="package_"
          @contact="showContactForm = true"
        />
      </div>
    </div>

    <!-- Contact Form Modal -->
    <ContactFormModal 
      v-if="showContactForm"
      :package_="package_"
      @close="showContactForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAsyncData } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Package } from '~/composables/usePackages'
import { usePackages } from '~/composables/usePackages'

import PackageDetails from '~/components/packages/PackageDetails.vue'

const route = useRoute()
const { t, locale } = useI18n()
const { getPackageById } = usePackages()
const showContactForm = ref(false)

// Fetch package data
const {
  data: package_,
  pending,
  error
} = await useAsyncData<Package>(
  `package-${route.params.id}`,
  async () => {
    console.log('Fetching package with ID:', route.params.id)
    const packageData = await getPackageById(route.params.id as string)
    console.log('Package data received:', packageData)
    return packageData
  },
  {
    watch: [route.params.id],
    default: () => null
  }
)

// SEO Meta Tags - Dynamic based on package data
watch(package_, (newPackage) => {
  if (newPackage) {
    const packageTitle = newPackage.title_ar || newPackage.title_en
    const packageDescription = newPackage.description_ar || newPackage.description_en
    const packagePrice = newPackage.price || 0
    const packageDuration = newPackage.duration_days || 'متغير'
    const packageDestination = newPackage.travel_period || 'وجهة متعددة'
    
    useHead({
      title: `${packageTitle} - أرض العجائب للسفر | باقات سفر متميزة`,
      meta: [
        {
          name: 'description',
          content: `${packageDescription.substring(0, 160)}... باقة سفر متميزة من أرض العجائب للسفر. سعر منافس وخدمة 24/7. احجز الآن!`
        },
        {
          name: 'keywords',
          content: `${packageTitle}, باقة سفر, رحلات, سياحة, ${packageDestination}, أرض العجائب للسفر, وكالة سفر السعودية, رحلات عمرة, رحلات حج`
        },
        { property: 'og:title', content: `${packageTitle} - أرض العجائب للسفر` },
        { property: 'og:description', content: packageDescription.substring(0, 160) + '...' },
        { property: 'og:url', content: `https://www.worldtripagency.com/packages/${route.params.id}` },
        { property: 'og:image', content: newPackage.hero_image_url || newPackage.image_url },
        { name: 'twitter:title', content: `${packageTitle} - أرض العجائب للسفر` },
        { name: 'twitter:description', content: packageDescription.substring(0, 160) + '...' },
        { name: 'twitter:image', content: newPackage.hero_image_url || newPackage.image_url }
      ],
      link: [
        { rel: 'canonical', href: `https://www.worldtripagency.com/packages/${route.params.id}` }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelPackage",
            "name": packageTitle,
            "description": packageDescription,
            "url": `https://www.worldtripagency.com/packages/${route.params.id}`,
            "image": newPackage.hero_image_url || newPackage.image_url,
            "offers": {
              "@type": "Offer",
              "price": packagePrice,
              "priceCurrency": "SAR",
              "availability": "https://schema.org/InStock",
              "validFrom": new Date().toISOString().split('T')[0]
            },
            "provider": {
              "@type": "TravelAgency",
              "name": "أرض العجائب للسفر",
              "url": "https://www.worldtripagency.com",
              "telephone": "+966500982394",
              "email": "info@worldtripagency.com"
            },
            "duration": packageDuration,
            "destination": {
              "@type": "Place",
              "name": packageDestination
            },
            "includes": [
              "النقل",
              "الإقامة",
              "الوجبات",
              "الجولات السياحية",
              "المرشد السياحي"
            ]
          })
        }
      ]
    })
  }
}, { immediate: true })

// Define page meta for proper routing
definePageMeta({
  layout: 'default'
})

// Watch for package data and redirect if not found
watch(package_, (newPackage) => {
  if (!newPackage && !pending.value) {
    console.log('Package not found, redirecting to packages page')
    useRouter().push('/packages')
  }
})

// Watch for errors
watch(error, (newError) => {
  if (newError) {
    console.error('Package fetch error:', newError)
  }
})

// SEO
useHead({
  title: computed(() => package_.value ? `${package_.value[`title_${locale.value.slice(0, 2)}`]} | World Trip Agency Agency` : 'Loading...'),
  meta: [
    {
      name: 'description',
      content: computed(() => package_.value?.[`description_${locale.value.slice(0, 2)}`] || '')
    },
    {
      property: 'og:title',
      content: computed(() => package_.value?.[`title_${locale.value.slice(0, 2)}`] || '')
    },
    {
      property: 'og:description',
      content: computed(() => package_.value?.[`description_${locale.value.slice(0, 2)}`] || '')
    },
    {
      property: 'og:image',
      content: computed(() => package_.value?.hero_image_url || package_.value?.image_url || '')
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      property: 'og:type',
      content: 'product'
    },
    {
      property: 'og:price:amount',
      content: computed(() => package_.value?.price.toString() || '')
    },
    {
      property: 'og:price:currency',
      content: 'SAR'
    }
  ]
})
</script>