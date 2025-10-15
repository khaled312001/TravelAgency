<template>
  <div class="logo-upload">
    <div class="upload-area" @click="selectFile" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
      <div v-if="!previewUrl" class="upload-placeholder">
        <Icon name="lucide:upload" class="upload-icon" />
        <p class="upload-text">اضغط أو اسحب لرفع اللوجو</p>
        <p class="upload-hint">PNG, JPG, SVG - حد أقصى 2MB</p>
      </div>
      <div v-else class="preview-container">
        <img :src="previewUrl" :alt="label" class="preview-image" />
        <button @click.stop="removeImage" class="remove-btn">
          <Icon name="lucide:x" class="remove-icon" />
        </button>
      </div>
    </div>
    
    <input 
      ref="fileInput" 
      type="file" 
      accept="image/*" 
      @change="handleFileSelect" 
      class="hidden-input"
    />
    
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p class="progress-text">جاري الرفع... {{ uploadProgress }}%</p>
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  value?: string
  maxSize?: number // in MB
}

const props = withDefaults(defineProps<Props>(), {
  label: 'اللوجو',
  value: '',
  maxSize: 2
})

const emit = defineEmits<{
  'update:value': [value: string]
  'upload-success': [url: string]
  'upload-error': [error: string]
}>()

const fileInput = ref<HTMLInputElement>()
const previewUrl = ref(props.value)
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')

const selectFile = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const processFile = async (file: File) => {
  // Validate file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    errorMessage.value = `الملف كبير جداً. الحد الأقصى: ${props.maxSize} ميجابايت`
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'نوع الملف غير مدعوم. يرجى اختيار صورة.'
    return
  }

  // Clear previous error
  errorMessage.value = ''

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Upload file
  await uploadFile(file)
}

const uploadFile = async (file: File) => {
  uploading.value = true
  uploadProgress.value = 0

  try {
    // Convert to base64
    const base64 = await fileToBase64(file)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10
      }
    }, 200)

    // Upload to server
    const response = await $fetch('/api/admin/upload/logo', {
      method: 'POST',
      body: {
        image: base64,
        filename: file.name
      }
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.success) {
      const imageUrl = response.data.url
      previewUrl.value = imageUrl
      emit('update:value', imageUrl)
      emit('upload-success', imageUrl)
      
      // Clear file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    } else {
      throw new Error('Upload failed')
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    errorMessage.value = 'حدث خطأ أثناء رفع الصورة: ' + (error.message || 'خطأ غير معروف')
    emit('upload-error', error.message || 'خطأ غير معروف')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const removeImage = () => {
  previewUrl.value = ''
  emit('update:value', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Watch for external value changes
watch(() => props.value, (newValue) => {
  previewUrl.value = newValue
})
</script>

<style scoped>
.logo-upload {
  @apply w-full;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-purple-500 hover:bg-purple-50;
}

.upload-placeholder {
  @apply flex flex-col items-center space-y-4;
}

.upload-icon {
  @apply w-12 h-12 text-gray-400;
}

.upload-text {
  @apply text-lg font-medium text-gray-700;
}

.upload-hint {
  @apply text-sm text-gray-500;
}

.preview-container {
  @apply relative inline-block;
}

.preview-image {
  @apply max-w-full max-h-48 rounded-lg shadow-md;
}

.remove-btn {
  @apply absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors;
}

.remove-icon {
  @apply w-4 h-4;
}

.hidden-input {
  @apply hidden;
}

.upload-progress {
  @apply mt-4;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-purple-500 h-2 rounded-full transition-all duration-300;
}

.progress-text {
  @apply text-sm text-gray-600 mt-2;
}

.error-message {
  @apply text-red-500 text-sm mt-2;
}
</style>
