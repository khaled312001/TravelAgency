<template>
  <div class="image-upload">
    <div v-if="!imageUrl" class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
      <div class="upload-content">
        <Icon name="lucide:upload" class="upload-icon" />
        <p class="upload-text">اضغط لرفع صورة أو اسحبها هنا</p>
        <p class="upload-hint">JPEG, PNG, WebP, GIF (حد أقصى 5MB)</p>
      </div>
    </div>

    <div v-else class="image-preview">
      <img :src="imageUrl" :alt="alt" class="preview-image" />
      <div class="image-actions">
        <button @click="changeImage" type="button" class="action-btn change">
          <Icon name="lucide:edit" class="action-icon" />
          تغيير
        </button>
        <button @click="removeImage" type="button" class="action-btn remove">
          <Icon name="lucide:trash-2" class="action-icon" />
          حذف
        </button>
      </div>
    </div>

    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p class="progress-text">جاري رفع الصورة... {{ uploadProgress }}%</p>
    </div>

    <div v-if="error" class="error-message">
      <Icon name="lucide:alert-circle" class="error-icon" />
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  alt?: string
  maxSize?: number // in MB
  allowedTypes?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'upload', file: File): void
  (e: 'error', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'صورة',
  maxSize: 5,
  allowedTypes: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const imageUrl = ref(props.modelValue || '')
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  imageUrl.value = newValue || ''
})

// Watch for imageUrl changes and emit
watch(imageUrl, (newValue) => {
  emit('update:modelValue', newValue)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = async (file: File) => {
  error.value = ''
  
  // Validate file type
  if (!props.allowedTypes.includes(file.type)) {
    error.value = 'نوع الملف غير مدعوم. يرجى اختيار صورة.'
    emit('error', error.value)
    return
  }

  // Validate file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    error.value = `حجم الملف كبير جداً. الحد الأقصى ${props.maxSize}MB.`
    emit('error', error.value)
    return
  }

  // Show preview immediately
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Upload file
  await uploadFile(file)
}

const uploadFile = async (file: File) => {
  try {
    uploading.value = true
    uploadProgress.value = 0

    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progress) => {
        uploadProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    })

    if (response.success) {
      imageUrl.value = response.url
      emit('upload', file)
    } else {
      throw new Error('فشل في رفع الصورة')
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message || 'حدث خطأ أثناء رفع الصورة'
    emit('error', error.value)
    imageUrl.value = ''
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const changeImage = () => {
  triggerFileInput()
}

const removeImage = () => {
  imageUrl.value = ''
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-upload {
  @apply w-full;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors;
}

.upload-content {
  @apply flex flex-col items-center space-y-2;
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

.image-preview {
  @apply relative;
}

.preview-image {
  @apply w-full h-48 object-cover rounded-lg;
}

.image-actions {
  @apply absolute top-2 right-2 flex space-x-2 space-x-reverse;
}

.action-btn {
  @apply flex items-center space-x-1 space-x-reverse px-3 py-1.5 text-sm font-medium rounded-lg transition-colors;
}

.action-btn.change {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.action-btn.remove {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.action-icon {
  @apply w-4 h-4;
}

.upload-progress {
  @apply mt-4;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-purple-600 h-2 rounded-full transition-all duration-300;
}

.progress-text {
  @apply text-sm text-gray-600 mt-2 text-center;
}

.error-message {
  @apply flex items-center space-x-2 space-x-reverse mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700;
}

.error-icon {
  @apply w-5 h-5 text-red-500;
}

.hidden {
  @apply hidden;
}
</style>
