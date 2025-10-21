export const useCloudinary = () => {
  /**
   * Upload base64 image to Cloudinary
   */
  const uploadImage = async (base64String: string, folder: string = 'packages') => {
    try {
      const response = await $fetch('/api/upload/image', {
        method: 'POST',
        body: {
          image: base64String,
          folder: folder
        }
      })
      
      return response
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }

  /**
   * Convert file to base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Upload file directly to Cloudinary
   */
  const uploadFile = async (file: File, folder: string = 'packages') => {
    try {
      const base64String = await fileToBase64(file)
      return await uploadImage(base64String, folder)
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  /**
   * Get optimized image URL
   */
  const getOptimizedUrl = (url: string, width?: number, height?: number, quality: string = 'auto') => {
    if (!url || !url.includes('cloudinary.com')) {
      return url
    }

    // Extract public_id from Cloudinary URL
    const parts = url.split('/')
    const publicId = parts[parts.length - 1].split('.')[0]
    
    // Build optimized URL
    let optimizedUrl = url.replace(`/${publicId}.`, `/${publicId}.`)
    
    if (width || height || quality !== 'auto') {
      const transformations = []
      if (width) transformations.push(`w_${width}`)
      if (height) transformations.push(`h_${height}`)
      if (quality !== 'auto') transformations.push(`q_${quality}`)
      transformations.push('c_limit', 'f_auto')
      
      const transformString = transformations.join(',')
      optimizedUrl = url.replace('/upload/', `/upload/${transformString}/`)
    }
    
    return optimizedUrl
  }

  return {
    uploadImage,
    uploadFile,
    fileToBase64,
    getOptimizedUrl
  }
}
