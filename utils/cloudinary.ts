import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwpbixx3o',
  api_key: '457217934572426',
  api_secret: 'p75oOG1U8c_mMf-TAqrziSbGxBA',
  secure: true
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload base64 image to Cloudinary
 */
export async function uploadBase64Image(
  base64String: string,
  folder: string = 'packages'
): Promise<CloudinaryUploadResult> {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '')
    
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        folder: folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      }
    )

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`)
  }
}

/**
 * Upload file buffer to Cloudinary
 */
export async function uploadFileBuffer(
  buffer: Buffer,
  folder: string = 'packages',
  filename?: string
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${buffer.toString('base64')}`,
      {
        folder: folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        public_id: filename,
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      }
    )

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`)
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number,
  quality: string = 'auto'
): string {
  return cloudinary.url(publicId, {
    width: width,
    height: height,
    crop: 'limit',
    quality: quality,
    fetch_format: 'auto'
  })
}

export default cloudinary
