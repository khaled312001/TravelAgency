<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ t('contact.section.title') }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ t('contact.section.subtitle') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div class="space-y-8">
            <div>
              <h3 class="text-2xl font-semibold text-gray-900 mb-6">
                {{ t('contact.section.info_title') }}
              </h3>
              
              <div class="space-y-6">
                <div class="flex items-start space-x-4 space-x-reverse">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="material-symbols:phone" class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">{{ t('contact.section.phone') }}</h4>
                    <p class="text-gray-600">+966 50 123 4567</p>
                    <p class="text-gray-600">+966 11 234 5678</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4 space-x-reverse">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="material-symbols:email" class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">{{ t('contact.section.email') }}</h4>
                    <p class="text-gray-600">info@wonderland.com</p>
                    <p class="text-gray-600">support@wonderland.com</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4 space-x-reverse">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="material-symbols:location-on" class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">{{ t('contact.section.address') }}</h4>
                    <p class="text-gray-600">{{ t('contact.section.address_text') }}</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4 space-x-reverse">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="material-symbols:schedule" class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">{{ t('contact.section.hours') }}</h4>
                    <p class="text-gray-600">{{ t('contact.section.hours_text') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- WhatsApp Button -->
            <div class="pt-6">
              <a 
                :href="getWhatsAppUrl(t('whatsapp.messages.general_inquiry'))"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-3 space-x-reverse bg-[#25D366] text-white px-6 py-3 rounded-xl hover:bg-[#128C7E] transition-colors"
              >
                <Icon name="logos:whatsapp-icon" class="w-6 h-6" />
                <span>{{ t('contact.section.whatsapp') }}</span>
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <h3 class="text-2xl font-semibold text-gray-900 mb-6">
              {{ t('contact.section.form_title') }}
            </h3>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="contact-name" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('contact.form.fullName.label') }} *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  id="contact-name"
                  required
                  :placeholder="t('contact.form.fullName.placeholder')"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label for="contact-email" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('contact.form.email.label') }} *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  id="contact-email"
                  required
                  :placeholder="t('contact.form.email.placeholder')"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label for="contact-phone" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('contact.form.phone.label') }} *
                </label>
                <div class="flex gap-2">
                  <select
                    v-model="form.countryCode"
                    class="px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  >
                    <option v-for="country in countries" :key="country.key" :value="country.code">
                      {{ country.code }}
                    </option>
                  </select>
                  <input
                    v-model="form.phone"
                    type="tel"
                    id="contact-phone"
                    required
                    :placeholder="countries.find(c => c.code === form.countryCode)?.example"
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    @input="handlePhoneInput"
                  />
                </div>
              </div>

              <div>
                <label for="contact-subject" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('contact.section.subject') }}
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  id="contact-subject"
                  :placeholder="t('contact.section.subject_placeholder')"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label for="contact-message" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('contact.form.message.label') }} *
                </label>
                <textarea
                  v-model="form.message"
                  id="contact-message"
                  rows="4"
                  required
                  :placeholder="t('contact.form.message.placeholder')"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!isSubmitting">{{ t('contact.form.submit') }}</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <span class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  {{ t('common.loading') }}
                </span>
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div class="flex items-center gap-3">
                <Icon name="material-symbols:check-circle" class="w-6 h-6 text-green-600" />
                <p class="text-green-800">{{ t('contact.section.success_message') }}</p>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="showError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div class="flex items-center gap-3">
                <Icon name="material-symbols:error" class="w-6 h-6 text-red-600" />
                <p class="text-red-800">{{ t('contact.section.error_message') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWhatsApp } from '~/composables/useWhatsApp'

const { t } = useI18n()
const { getWhatsAppUrl } = useWhatsApp()

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

const countries = [
  { code: '+966', flag: '', example: '5X XXX XXXX', key: 'sa' },
  { code: '+971', flag: '', example: '5X XXX XXXX', key: 'ae' },
  { code: '+974', flag: '', example: '3XXX XXXX', key: 'qa' },
  { code: '+973', flag: '', example: '3XXX XXXX', key: 'bh' },
  { code: '+965', flag: '', example: '5XXX XXXX', key: 'kw' },
  { code: '+968', flag: '', example: '9XXX XXXX', key: 'om' }
]

const form = reactive({
  name: '',
  email: '',
  countryCode: countries[0].code,
  phone: '',
  subject: '',
  message: ''
})

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.phone = input.value.replace(/\D/g, '')
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    showError.value = false
    showSuccess.value = false

    // Send to API
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: `${form.countryCode}${form.phone}`,
        subject: form.subject || 'رسالة تواصل من الموقع',
        message: form.message,
        type: 'inquiry'
      }
    })

    if (response.success) {
      showSuccess.value = true
      // Reset form
      form.name = ''
      form.email = ''
      form.phone = ''
      form.subject = ''
      form.message = ''
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    } else {
      showError.value = true
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>
