<script setup lang="ts">
import { ref } from 'vue';

// Safe DOM reference handling pattern
const valuesSection = ref<HTMLElement | null>(null);
const localePath = useLocalePath();
const { locale } = useI18n();

// Receive content as prop from parent
const props = defineProps<{
  content?: any
}>()

// For backward compatibility with template
const aboutContent = computed(() => props.content)

// Get icon for each value based on index
const getValueIcon = (index: number): string => {
  const icons = [
    'mdi:star',          // Excellence
    'mdi:shield-check',  // Integrity
    'mdi:lightbulb',     // Innovation
    'mdi:account-cog',   // Personalization
    'mdi:leaf',          // Sustainability
    'mdi:handshake'      // Partnership
  ];
  return icons[index] || 'mdi:check-circle';
};
</script>

<template>
  <section 
    ref="valuesSection"
    class="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-100"
  >
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {{ aboutContent?.values?.title?.[locale === 'ar-SA' ? 'ar' : 'en'] || $t('about.values.title') }}
        </h2>
        <p class="text-base md:text-lg text-gray-700 whitespace-pre-wrap">
          {{ aboutContent?.values?.subtitle?.[locale === 'ar-SA' ? 'ar' : 'en'] || $t('about.values.subtitle') }}
        </p>
      </div>
      
      <!-- Responsive grid with 1, 2, 3 columns based on screen size -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Dynamic Values from Database -->
        <div v-for="(valueItem, index) in (aboutContent?.values?.items || []).slice(0, 6)" :key="index"
             class="bg-gray-50 dark:bg-gray-200 p-6 rounded-lg text-center">
          <div class="mb-6 flex justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 backdrop-blur-sm">
              <Icon :name="getValueIcon(index)" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">
            {{ valueItem?.title?.[locale === 'ar-SA' ? 'ar' : 'en'] || $t(`about.values.items.${index}.title`) }}
          </h3>
          <p class="text-gray-700 whitespace-pre-wrap">
            {{ valueItem?.description?.[locale === 'ar-SA' ? 'ar' : 'en'] || $t(`about.values.items.${index}.description`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
