// Basic shims to keep the editor/TS server happy without generated Nuxt types
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue'
declare module 'vue-i18n'

// Resolve Nuxt alias for specific SFCs used in PackageDetails
declare module '~/components/ui/icons/FlightIcon.vue'
declare module '~/components/ui/icons/SaudiRyialSymbol.vue'
declare module '~/components/ui/modals/PackageContactFormModal.vue'

// Composables that may not be typed locally
declare module '~/composables/useWhatsApp'


