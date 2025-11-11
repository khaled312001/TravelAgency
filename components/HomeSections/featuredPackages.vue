<template>
  <section id="packages-section" class="py-16 bg-surface" data-aos="fade-up">
    <div class="container">
      <div class="text-center mb-12" data-aos="fade-down">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {{ $t('home.featured.title') }}
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ $t('home.featured.subtitle') }}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(pkg, index) in featuredPackages"
          :key="pkg.id"
          data-aos="zoom-in"
          :data-aos-delay="100 * index"
        >
          <PackageCard :package_="pkg" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PackageCard from '~/components/packages/PackageCard.vue'
import type { Package } from '~/composables/usePackages'

// Fetch only featured packages from public API to reflect admin "مميز"
const {
  data: featuredPackages,
  pending,
  error,
  refresh
} = await useAsyncData<Package[]>('featured-packages', async () => {
  const res = await $fetch('/api/packages?featured=true')
  return (res?.packages || []) as Package[]
}, { default: () => [] })
</script>
