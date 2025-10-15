<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useWhatsApp } from '~/composables/useWhatsApp';

const { t } = useI18n();
const localePath = useLocalePath();

const { getWhatsAppUrl, whatsappNumber } = useWhatsApp();

// Load settings
const { getLocalizedSetting, loadSettings, addSettingsUpdateListener, settings } = useSettings()

// Reactive key for forcing re-render
const footerLogoKey = ref(0)

// Watch for settings changes
watch(settings, () => {
  footerLogoKey.value++
}, { deep: true })

// Computed property for footer logo
const footerLogo = computed(() => {
  const logo = getLocalizedSetting('logo', 'footerLogo') || '/images/home/logo/WonderlandLogoWhite.svg'
  const finalLogo = `${logo}?t=${Date.now()}&k=${footerLogoKey.value}`
  console.log('Footer logo updated:', finalLogo)
  return finalLogo
})

// Load settings when component mounts
onMounted(async () => {
  await loadSettings()
  
  // Listen for settings updates
  addSettingsUpdateListener(async () => {
    await loadSettings()
    // Force re-render of footer logo
    footerLogoKey.value++
  })
  
  // Listen for custom settings update event
  if (process.client) {
    const handleSettingsUpdate = async () => {
      await loadSettings()
      footerLogoKey.value++
    }
    
    window.addEventListener('settings-updated', handleSettingsUpdate)
    
    // Cleanup on unmount
    onUnmounted(() => {
      window.removeEventListener('settings-updated', handleSettingsUpdate)
    })
  }
})

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear());

// Dynamic social links from settings
const socialLinks = computed(() => [
  { name: 'mdi:whatsapp', href: getLocalizedSetting('general', 'whatsappUrl') || getWhatsAppUrl(), label: 'WhatsApp' },
  { name: 'ic:outline-snapchat', href: getLocalizedSetting('general', 'snapchatUrl') || 'https://www.snapchat.com/add/ahmed18311', label: 'Snapchat' },
  { name: 'mdi:instagram', href: getLocalizedSetting('general', 'instagramUrl') || 'https://www.instagram.com/wonderland.sa.jed', label: 'Instagram' },
  { name: 'ic:outline-tiktok', href: getLocalizedSetting('general', 'tiktokUrl') || 'https://www.tiktok.com/@wonder.land.sa', label: 'TikTok' },
  { name: 'mdi:facebook', href: getLocalizedSetting('general', 'facebookUrl') || 'https://facebook.com/worldtripagency', label: 'Facebook' },
  { name: 'mdi:twitter', href: getLocalizedSetting('general', 'twitterUrl') || 'https://twitter.com/worldtripagency', label: 'Twitter' },
].filter(link => link.href && link.href !== ''));

const contactInfo = computed(() => [
  { icon: 'mdi:phone', textKey: 'footer.phone', detail: getLocalizedSetting('general', 'contactPhone') || whatsappNumber },
  { icon: 'mdi:email', textKey: 'footer.email', detail: getLocalizedSetting('general', 'contactEmail') || 'info@worldtripagency.com' },
  { icon: 'mdi:whatsapp', textKey: 'footer.whatsapp', detail: whatsappNumber }
])

const certifications = computed(() => [
  ...(getLocalizedSetting('general', 'iataNumber') ? [{ key: 'footer.iata', value: getLocalizedSetting('general', 'iataNumber') }] : []),
  { key: 'footer.license', value: getLocalizedSetting('general', 'licenseNumber') || '73105863' },
  ...(getLocalizedSetting('general', 'insuranceInfo') ? [{ key: 'footer.insurance', value: getLocalizedSetting('general', 'insuranceInfo') }] : []),
  { key: 'footer.registration', value: getLocalizedSetting('general', 'registrationNumber') || '7043491153' },
]);

// Featured Destinations Data (Dynamic from settings)
const featuredDestinations = computed(() => [
  ...(getLocalizedSetting('general', 'destination1') ? [{ nameKey: 'footer.destinations.riyadh', link: '/destinations/riyadh', name: getLocalizedSetting('general', 'destination1') }] : []),
  ...(getLocalizedSetting('general', 'destination2') ? [{ nameKey: 'footer.destinations.red_sea', link: '/destinations/red-sea', name: getLocalizedSetting('general', 'destination2') }] : []),
  ...(getLocalizedSetting('general', 'destination3') ? [{ nameKey: 'footer.destinations.alula', link: '/destinations/alula', name: getLocalizedSetting('general', 'destination3') }] : []),
]);

</script>

<template>
  <footer class="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

        <!-- 1. Branding & Contact -->
        <div class="space-y-6">
          <NuxtLink :to="localePath('/')" class="inline-flex items-center space-x-3 rtl:space-x-reverse">
            <img 
              :key="footerLogoKey"
              :src="footerLogo" 
              alt="World Trip Agency Logo" 
              class="h-10"
              loading="eager" 
            />
            <span class="text-white font-semibold text-xl">
              {{ getLocalizedSetting('logo', 'logoText') || $t('common.app_title') }}
            </span>
          </NuxtLink>
          <p class="text-gray-400 text-sm">{{ $t('footer.tagline') }}</p>
          <div class="space-y-3">
            <h4 class="text-lg font-semibold text-white mb-3">{{ $t('footer.contact_us') }}</h4>
            <template v-for="(contact, index) in contactInfo" :key="index">
              <a v-if="contact.icon === 'mdi:whatsapp'" :href="getWhatsAppUrl()" target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 text-sm text-gray-400 hover:text-primary-400 transition-colors py-1">
                <Icon :name="contact.icon" class="text-xl text-primary-500 flex-shrink-0" />
                <span>
                  {{ $t(contact.textKey) }}:
                  <span dir="ltr" class="inline-block ltr:text-left rtl:text-right">{{ contact.detail }}</span>
                </span>
              </a>
              <a v-else :href="contact.icon === 'mdi:email' ? `mailto:${contact.detail}` : `tel:${contact.detail}`"
                class="flex items-center space-x-3 text-sm text-gray-400 hover:text-primary-400 transition-colors py-1">
                <Icon :name="contact.icon" class="text-xl text-primary-500 flex-shrink-0" />
                <span>
                  {{ $t(contact.textKey) }}:
                  <span dir="ltr" class="inline-block ltr:text-left rtl:text-right">{{ contact.detail }}</span>
                </span>
              </a>
            </template>
          </div>
        </div>

        <!-- 2. Certifications -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white mb-4">{{ $t('footer.certifications') }}</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="cert in certifications" :key="cert.key">
              <span class="text-gray-400">{{ $t(cert.key) }} {{ cert.value }}</span>
            </li>
          </ul>
        </div>

        <!-- 3. Connect With Us -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white mb-4">{{ $t('footer.connect') }}</h4>
          <div class="grid grid-cols-2 gap-3">
            <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 space-x-reverse text-gray-400 hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
              :aria-label="social.label">
              <Icon :name="social.name" class="text-xl flex-shrink-0" />
              <span class="text-sm">{{ social.label }}</span>
            </a>
          </div>
        </div>

        <!-- 4. Featured Destinations (Text Links) -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-white">{{ $t('footer.featured_destinations') }}</h4>
          <ul class="space-y-2">
            <li v-for="(dest, index) in featuredDestinations" :key="`dest-${index}`" class="group">
              <NuxtLink :to="localePath(dest.link)"
                class="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="mdi:map-marker"
                  class="text-primary-500 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                <span>
                  {{ dest.name || $t(dest.nameKey) }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright -->
      <div class="text-center text-sm text-gray-500 mt-16 border-t border-gray-700 pt-8">
        {{ $t('footer.copyright', { year: currentYear }) }}
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Add minor transition for better visual feedback */
input,
textarea {
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Ensure links have appropriate styling if needed */
ul a {
  display: inline-block;
  /* Prevents hover effect covering full width */
}
</style>
