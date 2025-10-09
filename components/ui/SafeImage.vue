<template>
  <div class="relative overflow-hidden" :class="wrapperClass">
    <!-- Fallback image -->
    <img
      v-if="showFallback"
      :src="fallbackSrc"
      :alt="alt"
      :class="imageClass"
      class="w-full h-full object-cover"
    />
    
    <!-- Main image with error handling -->
    <NuxtImg
      v-else
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imageClass"
      :sizes="sizes"
      :loading="loading"
      format="webp"
      :quality="quality"
      @error="handleError"
      @load="handleLoad"
      placeholder
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  wrapperClass?: string
  imageClass?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  quality?: number
  fallbackSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  wrapperClass: '',
  imageClass: 'w-full h-full object-cover',
  sizes: '(max-width: 768px) 100vw, 50vw',
  loading: 'lazy',
  quality: 80,
  fallbackSrc: '/images/destinations/placeholder.jpg'
})

const showFallback = ref(false)

const handleError = () => {
  console.warn('Image failed to load:', props.src)
  showFallback.value = true
}

const handleLoad = () => {
  showFallback.value = false
}

// Reset fallback when src changes
watch(() => props.src, () => {
  showFallback.value = false
})
</script>
