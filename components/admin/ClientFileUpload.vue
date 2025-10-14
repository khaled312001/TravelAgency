<template>
  <div class="file-upload-container">
    <!-- Upload Area -->
    <div
      v-if="!uploadedFile"
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'uploading': isUploading }"
      @click="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div v-if="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <p class="progress-text">{{ Math.round(uploadProgress) }}%</p>
      </div>
      
      <div v-else class="upload-content">
        <Icon name="lucide:upload" class="upload-icon" />
        <p class="upload-text">{{ $t('admin.uploadFile') }}</p>
        <p class="upload-hint">{{ $t('admin.dragDropOrClick') }}</p>
        <p class="file-types">{{ accept }}</p>
        <p class="file-size">{{ $t('admin.maxSize') }}: {{ maxSize }}MB</p>
      </div>
    </div>

    <!-- Uploaded File Preview -->
    <div v-else class="uploaded-file">
      <div class="file-preview">
        <img 
          v-if="isImage" 
          :src="uploadedFile.url" 
          :alt="uploadedFile.filename"
          class="preview-image"
        />
        <video 
          v-else-if="isVideo" 
          :src="uploadedFile.url" 
          :alt="uploadedFile.filename"
          class="preview-video"
          controls
        />
        <div v-else class="file-icon">
          <Icon name="lucide:file" class="icon" />
        </div>
      </div>
      
      <div class="file-info">
        <p class="filename">{{ uploadedFile.filename }}</p>
        <p class="filesize">{{ formatFileSize(uploadedFile.size) }}</p>
        <p class="filetype">{{ uploadedFile.type }}</p>
      </div>
      
      <div class="file-actions">
        <button 
          @click="removeFile" 
          class="remove-btn"
          :title="$t('admin.removeFile')"
        >
          <Icon name="lucide:trash-2" class="icon" />
        </button>
        <button 
          @click="triggerFileInput" 
          class="change-btn"
          :title="$t('admin.changeFile')"
        >
          <Icon name="lucide:edit" class="icon" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <Icon name="lucide:alert-circle" class="icon" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UploadedFile {
  url: string
  filename: string
  size: number
  type: string
  base64?: string
}

interface Props {
  modelValue?: string
  accept?: string
  maxSize?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*,video/*',
  maxSize: 50,
  placeholder: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'uploaded': [file: UploadedFile]
  'error': [error: string]
}>()

const fileInput = ref<HTMLInputElement>()
const isUploading = ref(false)
const isDragOver = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const uploadedFile = ref<UploadedFile | null>(null)
const lastUploadedFile = ref<File | null>(null)

const isImage = computed(() => uploadedFile.value?.type.startsWith('image/'))
const isVideo = computed(() => uploadedFile.value?.type.startsWith('video/'))

// Initialize with existing value
onMounted(() => {
  if (props.modelValue) {
    // If we have a URL, create a mock uploaded file object
    const filename = props.modelValue.split('/').pop() || 'file'
    uploadedFile.value = {
      url: props.modelValue,
      filename,
      size: 0,
      type: 'unknown'
    }
  }
})

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
    // Convert file to base64 for client-side storage
    const base64 = await fileToBase64(file)
    
    // Complete progress
    uploadProgress.value = 100
    clearInterval(progressInterval)

    // Create file object
    const uploadedFileData: UploadedFile = {
      url: base64,
      filename: file.name,
      size: file.size,
      type: file.type,
      base64: base64
    }

    uploadedFile.value = uploadedFileData
    emit('update:modelValue', base64)
    emit('uploaded', uploadedFileData)

    console.log('File uploaded successfully:', uploadedFileData)

  } catch (error: any) {
    console.error('Upload error:', error)
    errorMessage.value = error.message || 'حدث خطأ أثناء رفع الملف'
    emit('error', error.message || 'Upload failed')
  } finally {
    isUploading.value = false
    clearInterval(progressInterval)
  }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

const removeFile = () => {
  uploadedFile.value = null
  emit('update:modelValue', '')
  errorMessage.value = ''
  
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (!newValue && uploadedFile.value) {
    uploadedFile.value = null
  }
})
</script>

<style scoped>
.file-upload-container {
  @apply w-full;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-purple-400 hover:bg-purple-50;
}

.upload-area.drag-over {
  @apply border-purple-500 bg-purple-100;
}

.upload-area.uploading {
  @apply cursor-not-allowed opacity-75;
}

.upload-content {
  @apply space-y-2;
}

.upload-icon {
  @apply w-12 h-12 text-gray-400 mx-auto;
}

.upload-text {
  @apply text-lg font-medium text-gray-700;
}

.upload-hint {
  @apply text-sm text-gray-500;
}

.file-types {
  @apply text-xs text-gray-400;
}

.file-size {
  @apply text-xs text-gray-400;
}

.upload-progress {
  @apply space-y-2;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-purple-500 h-2 rounded-full transition-all duration-300;
}

.progress-text {
  @apply text-sm font-medium text-gray-700;
}

.uploaded-file {
  @apply border border-gray-200 rounded-lg p-4 bg-white;
}

.file-preview {
  @apply mb-3;
}

.preview-image,
.preview-video {
  @apply w-full h-32 object-cover rounded-lg;
}

.file-icon {
  @apply w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center;
}

.file-icon .icon {
  @apply w-12 h-12 text-gray-400;
}

.file-info {
  @apply space-y-1 mb-3;
}

.filename {
  @apply font-medium text-gray-900 truncate;
}

.filesize,
.filetype {
  @apply text-sm text-gray-500;
}

.file-actions {
  @apply flex space-x-2;
}

.remove-btn,
.change-btn {
  @apply p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors;
}

.remove-btn {
  @apply text-red-600 hover:bg-red-50 hover:border-red-300;
}

.change-btn {
  @apply text-blue-600 hover:bg-blue-50 hover:border-blue-300;
}

.error-message {
  @apply flex items-center space-x-2 mt-2 text-red-600 text-sm;
}

.error-message .icon {
  @apply w-4 h-4;
}

.hidden {
  @apply hidden;
}
</style>
