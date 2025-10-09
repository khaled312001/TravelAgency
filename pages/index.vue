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

    <!-- Contact Section -->
    <ContactSection data-aos="fade-up" />

  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/HomeSections/HeroSection.vue'
import SearchSection from '~/components/HomeSections/searchSection.vue'
import LazyFeaturedPackages from '~/components/HomeSections/featuredPackages.vue'
import LazySaudiDestinations from '~/components/HomeSections/saudiDestinations.vue'
import LazyGlobalDestinations from '~/components/HomeSections/globalDestinations.vue'
import LazyServicesSection from '~/components/HomeSections/servicesSection.vue'
import ContactSection from '~/components/HomeSections/ContactSection.vue'

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
  title: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية | رحلات عمرة وحج وسياحة',
  meta: [
    { 
      name: 'description', 
      content: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج متميزة، سياحة داخلية وخارجية، باقات سفر إلى دبي، تركيا، ماليزيا، تايلاند وأكثر. خدمة 24/7 وأسعار منافسة.' 
    },
    { 
      name: 'keywords', 
      content: 'وكالة سفر السعودية, رحلات عمرة, رحلات حج, سياحة السعودية, رحلات دبي, رحلات تركيا, رحلات ماليزيا, رحلات تايلاند, باقات سفر, وكالة سفر الرياض, سفر وسياحة, رحلات خارجية, رحلات داخلية, أرض العجائب للسفر, وكالة سفر مكة, وكالة سفر المدينة, رحلات عمرة من الرياض, رحلات عمرة من جدة, رحلات عمرة من الدمام, رحلات عمرة من القصيم, رحلات عمرة من تبوك, رحلات عمرة من حائل, رحلات عمرة من الباحة, رحلات عمرة من نجران, رحلات عمرة من جازان, رحلات عمرة من الحدود الشمالية, رحلات عمرة من عسير, رحلات عمرة من الجوف, ' + keywords 
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية' },
    { property: 'og:description', content: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج متميزة، سياحة داخلية وخارجية، باقات سفر متميزة.' },
    { property: 'og:image', content: 'https://www.worldtripagency.com' + ogImage },
    { property: 'og:url', content: 'https://www.worldtripagency.com/' },
    { property: 'og:locale', content: locale.value === 'ar' ? 'ar_SA' : 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية' },
    { name: 'twitter:description', content: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج متميزة، سياحة داخلية وخارجية، باقات سفر متميزة.' },
    { name: 'twitter:image', content: 'https://www.worldtripagency.com' + ogImage },
    { name: 'twitter:url', content: 'https://www.worldtripagency.com/' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.worldtripagency.com/' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "أرض العجائب للسفر",
        "alternateName": "World Trip Agency Traveling Agency",
        "url": "https://www.worldtripagency.com",
        "logo": "https://www.worldtripagency.com/images/home/logo/WonderlandLogo.svg",
        "description": "أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج، سياحة داخلية وخارجية، باقات سفر متميزة.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "الرياض",
          "addressLocality": "الرياض",
          "addressRegion": "منطقة الرياض",
          "addressCountry": "SA"
        },
        "telephone": "+966500982394",
        "email": "info@worldtripagency.com",
        "openingHours": "Mo-Su 00:00-23:59",
        "priceRange": "$$",
        "currenciesAccepted": "SAR",
        "paymentAccepted": "Cash, Credit Card",
        "areaServed": {
          "@type": "Country",
          "name": "Saudi Arabia"
        },
        "serviceType": [
          "رحلات عمرة",
          "رحلات حج", 
          "سياحة داخلية",
          "سياحة خارجية",
          "باقات سفر"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "باقات السفر المتميزة",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TravelPackage",
                "name": "رحلات العمرة",
                "description": "باقات عمرة متميزة من جميع مدن المملكة العربية السعودية"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TravelPackage",
                "name": "رحلات الحج",
                "description": "باقات حج شاملة مع أفضل الخدمات والرعاية"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TravelPackage",
                "name": "رحلات دبي",
                "description": "باقات سفر متميزة إلى دبي مع أفضل الفنادق والأنشطة"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TravelPackage",
                "name": "رحلات تركيا",
                "description": "باقات سفر شاملة إلى تركيا مع جولات سياحية متميزة"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TravelPackage",
                "name": "رحلات ماليزيا",
                "description": "باقات سفر إلى ماليزيا مع أفضل المعالم السياحية"
              }
            }
          ]
        },
        "sameAs": [
          "https://www.instagram.com/wonderlandtravel",
          "https://www.facebook.com/wonderlandtravel",
          "https://wa.me/966500982394"
        ]
      })
    }
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