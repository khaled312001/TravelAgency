<template>
  <div class="file-upload">
    <div class="upload-area" 
         :class="{ 'dragover': isDragOver, 'uploading': isUploading }"
         @drop="handleDrop"
         @dragover="handleDragOver"
         @dragleave="handleDragLeave"
         @click="triggerFileInput">
      
      <input
        ref="fileInput"
        type="file"
        :accept="acceptTypes"
        @change="handleFileSelect"
        class="hidden"
      />

      <div v-if="!isUploading" class="upload-content">
        <Icon name="lucide:upload" class="w-8 h-8 text-gray-400 mb-2" />
        <p class="text-sm text-gray-600 mb-1">
          {{ dragText || 'اسحب الملف هنا أو اضغط للاختيار' }}
        </p>
        <p class="text-xs text-gray-500">
          {{ fileTypesText }}
        </p>
        <p class="text-xs text-gray-500">
          الحد الأقصى: {{ maxSizeText }}
        </p>
      </div>

      <div v-else class="upload-content">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-primary-600 mb-2 animate-spin" />
        <p class="text-sm text-primary-600">جاري الرفع...</p>
        <div v-if="uploadProgress > 0" class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <p v-if="uploadProgress > 0" class="text-xs text-gray-500 mt-1">{{ uploadProgress }}%</p>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="previewUrl" class="preview-container mt-4">
      <div class="preview-header">
        <h4 class="text-sm font-medium text-gray-900">معاينة الملف</h4>
        <button
          @click="removeFile"
          class="text-red-500 hover:text-red-700 transition-colors"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
      
      <div class="preview-content">
        <!-- Image Preview -->
        <img
          v-if="isImage"
          :src="previewUrl"
          :alt="fileName"
          class="preview-image"
        />
        
        <!-- Video Preview -->
        <video
          v-else-if="isVideo"
          :src="previewUrl"
          controls
          class="preview-video"
        >
          متصفحك لا يدعم تشغيل الفيديو
        </video>
        
        <!-- File Info -->
        <div class="file-info">
          <p class="text-sm text-gray-600">{{ fileName }}</p>
          <p class="text-xs text-gray-500">{{ fileSize }}</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message mt-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="lucide:alert-circle" class="w-4 h-4 text-red-500" />
          <span class="text-sm text-red-600">{{ errorMessage }}</span>
        </div>
        <button
          v-if="lastUploadedFile"
          @click="retryUpload"
          class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  accept?: string
  maxSize?: number // in MB
  dragText?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*,video/*',
  maxSize: 50,
  dragText: '',
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'uploaded', data: any): void
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const isUploading = ref(false)
const errorMessage = ref('')
const uploadedFile = ref<any>(null)
const uploadProgress = ref(0)
const lastUploadedFile = ref<File | null>(null)

// Computed
const acceptTypes = computed(() => {
  if (props.accept === 'image/*') return 'image/jpeg,image/png,image/webp'
  if (props.accept === 'video/*') return 'video/mp4,video/webm'
  return props.accept
})

const fileTypesText = computed(() => {
  if (props.accept === 'image/*') return 'الصور: JPEG, PNG, WebP'
  if (props.accept === 'video/*') return 'الفيديو: MP4, WebM'
  return 'الملفات المدعومة'
})

const maxSizeText = computed(() => {
  return `${props.maxSize} ميجابايت`
})

const previewUrl = computed(() => {
  return uploadedFile.value?.url || props.modelValue
})

const fileName = computed(() => {
  return uploadedFile.value?.originalName || 'ملف'
})

const fileSize = computed(() => {
  if (!uploadedFile.value?.size) return ''
  const sizeInMB = (uploadedFile.value.size / (1024 * 1024)).toFixed(2)
  return `${sizeInMB} ميجابايت`
})

const isImage = computed(() => {
  const url = previewUrl.value
  return url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp'))
})

const isVideo = computed(() => {
  const url = previewUrl.value
  return url && (url.includes('.mp4') || url.includes('.webm'))
})

// Methods
const triggerFileInput = () => {
  if (!isUploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const uploadFile = async (file: File) => {
  // Store file for potential retry
  lastUploadedFile.value = file
  
  // Validate file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    errorMessage.value = `الملف كبير جداً. الحد الأقصى: ${props.maxSize} ميجابايت`
    return
  }

  // Validate file type
  const allowedTypes = props.accept.split(',').map(type => type.trim())
  const isValidType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'))
    }
    return file.type === type
  })

  if (!isValidType) {
    errorMessage.value = 'نوع الملف غير مدعوم'
    return
  }

  isUploading.value = true
  errorMessage.value = ''
  uploadProgress.value = 0

  // Simulate progress for better UX
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += Math.random() * 10
    }
  }, 200)

  try {
    const formData = new FormData()
    formData.append('file', file)

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      maxSize: maxSizeBytes
    })

    const response = await $fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    console.log('Upload response:', response)

    // Complete progress
    uploadProgress.value = 100
    clearInterval(progressInterval)

    if (response && response.success) {
      uploadedFile.value = response
      emit('update:modelValue', response.url)
      emit('uploaded', response)
      console.log('File uploaded successfully:', response.url)
      // Clear error on success
      errorMessage.value = ''
    } else {
      errorMessage.value = response?.message || 'فشل في رفع الملف'
      console.error('Upload failed:', response)
    }
  } catch (error: any) {
    console.error('Upload error details:', error)
    clearInterval(progressInterval)
    
    // Better error handling
    if (error.statusCode === 400) {
      errorMessage.value = error.data?.statusMessage || 'نوع الملف غير مدعوم أو حجم الملف كبير جداً'
    } else if (error.statusCode === 413) {
      errorMessage.value = 'الملف كبير جداً. الحد الأقصى: ' + props.maxSize + ' ميجابايت'
    } else if (error.statusCode === 500) {
      errorMessage.value = 'خطأ في الخادم. يرجى المحاولة مرة أخرى'
    } else {
      errorMessage.value = error.data?.statusMessage || error.message || 'حدث خطأ أثناء رفع الملف'
    }
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const retryUpload = () => {
  if (lastUploadedFile.value) {
    uploadFile(lastUploadedFile.value)
  }
}

const removeFile = () => {
  uploadedFile.value = null
  lastUploadedFile.value = null
  errorMessage.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.file-upload {
  @apply w-full;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors;
}

.upload-area:hover {
  @apply border-primary-400 bg-primary-50;
}

.upload-area.dragover {
  @apply border-primary-500 bg-primary-100;
}

.upload-area.uploading {
  @apply border-primary-500 bg-primary-50 cursor-not-allowed;
}

.upload-content {
  @apply flex flex-col items-center;
}

.preview-container {
  @apply border border-gray-200 rounded-lg p-4;
}

.preview-header {
  @apply flex items-center justify-between mb-3;
}

.preview-content {
  @apply space-y-3;
}

.preview-image {
  @apply w-full max-w-md h-48 object-cover rounded-lg;
}

.preview-video {
  @apply w-full max-w-md h-48 object-cover rounded-lg;
}

.file-info {
  @apply text-center;
}

.error-message {
  @apply flex items-center gap-2 text-red-600;
}
</style>
