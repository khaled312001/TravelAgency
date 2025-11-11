// @ts-ignore - allow importing JSON without resolveJsonModule in this context
import ar from './locales/ar-SA.json'
// @ts-ignore - allow importing JSON without resolveJsonModule in this context
import en from './locales/en-US.json'

// Declare the Nuxt i18n macro for type checking
declare const defineI18nConfig: <T>(configFactory: () => T) => T

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ar',
  fallbackLocale: 'ar',
  messages: {
    en,
    ar
  }
}))
